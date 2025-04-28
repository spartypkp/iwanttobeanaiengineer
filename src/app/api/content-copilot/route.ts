import { createClient } from '@/lib/utils/supabase/server';
import { extractSchemaInfo, formatSchemaFieldsForPrompt, SchemaInfo, SerializableSchema } from '@/utils/schema-serialization';
import { anthropic } from '@ai-sdk/anthropic';
import { createClient as createSanityClient } from '@sanity/client';
import { Message, streamText, tool } from 'ai';
import { z } from 'zod';

// Initialize Sanity client (ensure this is configured in your environment)
const sanityClient = createSanityClient({
	projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
	dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
	token: process.env.SANITY_API_TOKEN,
	apiVersion: '2023-05-03',
	useCdn: false,
});

// Helper function to build nested patch values
function buildNestedValue(pathParts: string[], finalValue: any): Record<string, any> {
	if (pathParts.length === 1) {
		const result: Record<string, any> = {};
		result[pathParts[0]] = finalValue;
		return result;
	} else {
		const result: Record<string, any> = {};
		result[pathParts[0]] = buildNestedValue(pathParts.slice(1), finalValue);
		return result;
	}
}

// Define the tools available to the AI
const writeFieldTool = tool({
	description: 'Update a specific field in the current Sanity document. Use this tool when you are confident about the content and want to write it directly to the document in the background without requiring user confirmation. Best for simple, factual information clearly stated by the user or easily inferred from conversation. The update will be subtle with minimal UI indication to the user.',
	parameters: z.object({
		documentId: z.string().describe('The Sanity document ID for the sanity document you want to update.'),
		fieldPath: z.string().describe('The path to the field (e.g., "title", "description")'),
		value: z.any().describe('The new value to set for the field'),

	}),
	execute: async ({ documentId, fieldPath, value }, { toolCallId }) => {
		try {
			// Get the current document to understand field structure
			const document = await sanityClient.getDocument(documentId);
			if (!document) {
				const error = `Document not found: ${documentId}`;
				await logToolCall(toolCallId, 'writeField', { documentId, fieldPath, value }, { success: false, message: error }, true);
				return {
					success: false,
					message: error
				};
			}

			// Create the patch object based on the field path
			const patch: Record<string, any> = {};
			const parts = fieldPath.split('.');

			// Verify field type and format value accordingly before patching
			// Handle arrays properly by checking structure
			const currentField = getFieldValue(document, parts);
			const formattedValue = formatValueForField(fieldPath, value, currentField);

			// Handle simple field
			if (parts.length === 1) {
				patch[fieldPath] = formattedValue;
			}
			// Handle nested fields with set patch
			else {
				patch[`${parts[0]}`] = {
					_type: 'set',
					value: buildNestedValue(parts.slice(1), formattedValue)
				};
			}

			// Patch the document
			await sanityClient
				.patch(documentId)
				.set(patch)
				.commit();

			// Log successful tool call
			await logToolCall(toolCallId, 'writeField', { documentId, fieldPath, value }, {
				success: true,
				message: `Successfully updated field ${fieldPath}`,
				value: formattedValue
			}, false);

			return {
				success: true,
				message: `Successfully updated field ${fieldPath}`,
				value: formattedValue,
				fieldPath
			};

		} catch (error) {
			console.error('Error writing field:', error);

			// Log failed tool call
			await logToolCall(toolCallId, 'writeField', { documentId, fieldPath, value }, {
				success: false,
				message: `Failed to update field ${fieldPath}: ${error instanceof Error ? error.message : String(error)}`
			}, true);

			return {
				success: false,
				message: `Failed to update field ${fieldPath}: ${error instanceof Error ? error.message : String(error)}`
			};
		}
	}
});

// Helper functions for field handling
function getFieldValue(document: Record<string, any>, pathParts: string[]): any {
	let current = document;
	for (const part of pathParts) {
		if (current === undefined || current === null) return undefined;
		current = current[part];
	}
	return current;
}

function formatValueForField(fieldPath: string, value: any, currentField: any): any {
	// If the current field is an array, make sure we're formatting correctly
	if (Array.isArray(currentField)) {
		// If value is already an array, ensure each item has the right structure
		if (Array.isArray(value)) {
			// For project schema's challenges field, ensure proper structure
			if (fieldPath === 'challenges') {
				return value.map((item, index) => {
					// Ensure each challenge has a title, description and _key
					if (typeof item === 'object') {
						return {
							...item,
							_key: item._key || `${Date.now()}_${index}`
						};
					}
					// If it's just a string, assume it's a description and create proper structure
					else if (typeof item === 'string') {
						return {
							title: `Challenge ${index + 1}`,
							description: item,
							_key: `${Date.now()}_${index}`
						};
					}
					return item;
				});
			}
			// For general array items, ensure each has a _key
			return value.map((item, index) => {
				if (typeof item === 'object' && !item._key) {
					return { ...item, _key: `${Date.now()}_${index}` };
				}
				return item;
			});
		}
		// If the value is a string but the field is an array, convert to array
		// This handles when the AI tries to write a string to an array field
		else if (typeof value === 'string') {
			// For challenges array specifically
			if (fieldPath === 'challenges') {
				return [{
					title: 'Challenge',
					description: value,
					_key: `${Date.now()}_0`
				}];
			}
			// For simple arrays (like tags or technologies)
			return [value];
		}
	}
	return value;
}

// Tool to suggest content for a field without applying it
const suggestContentTool = tool({
	description: 'Generate content suggestions for a specific field that will be presented to the user in a custom UI requiring their explicit approval. Use this tool when you want the user to review and choose from multiple options. Ideal for complex, subjective content that benefits from user input, such as descriptions, problem statements, or any content where the exact wording matters. The user must actively accept or reject the suggestion before it is applied.',
	parameters: z.object({
		documentId: z.string().describe('The Sanity document ID of the document you are editing'),
		fieldPath: z.string().describe('The path to the field you want suggestions for (e.g., "title", "description")'),
		currentValue: z.string().optional().describe('The current content if any exists'),
		fieldType: z.string().describe('The type of the field (e.g., "string", "text", "array")'),
		requirements: z.string().optional().describe('Specific requirements or guidance for the content'),
	}),
	execute: async ({ documentId, fieldPath, currentValue, fieldType, requirements }, { toolCallId }) => {
		try {
			// First, get the document to determine the actual field structure
			const document = await sanityClient.getDocument(documentId);
			if (!document) {
				const error = `Document not found: ${documentId}`;
				await logToolCall(toolCallId, 'suggestContent', { documentId, fieldPath, currentValue, fieldType, requirements }, { success: false, message: error }, true);
				return {
					success: false,
					message: error
				};
			}

			// Determine the actual field type from the document structure
			const parts = fieldPath.split('.');
			const actualField = getFieldValue(document, parts);
			const actualFieldType = detectFieldType(fieldPath, actualField);

			// For the challenges field specifically, format suggestions as an array of challenge objects
			// rather than as text
			let formattedOptions: string[] = [];
			if (fieldPath === 'challenges') {
				// We'll let the AI generate content but ensure it's properly formatted for the UI
				// The suggestedOptions will be processed in the ResponseContent
				formattedOptions = [];
			}

			// Log tool call and return result
			const result = {
				success: true,
				message: `Generated suggestions for ${fieldPath}`,
				fieldPath,
				currentValue: currentValue || null,
				actualFieldType, // Include the actual field type for better client-side handling
				suggestions: {
					original: currentValue || null,
					fieldType: actualFieldType, // Use the detected field type
					requirements: requirements || null,
					// The AI will generate these values based on the context
					suggestedOptions: formattedOptions
				}
			};

			await logToolCall(toolCallId, 'suggestContent', {
				documentId, fieldPath, currentValue, fieldType, requirements
			}, result, false);

			return result;
		} catch (error) {
			console.error('Error generating suggestions:', error);

			const errorResult = {
				success: false,
				message: `Failed to generate suggestions for ${fieldPath}: ${error instanceof Error ? error.message : String(error)}`
			};

			await logToolCall(toolCallId, 'suggestContent', {
				documentId, fieldPath, currentValue, fieldType, requirements
			}, errorResult, true);

			return errorResult;
		}
	}
});

// Helper function to detect the proper field type
function detectFieldType(fieldPath: string, field: any): string {
	// For known complex fields, hardcode the correct type
	if (fieldPath === 'challenges') {
		return 'challenges-array';
	}

	// Otherwise infer from the field value
	if (field === undefined || field === null) {
		// If field doesn't exist in document yet, use some known mappings
		const knownFields: Record<string, string> = {
			'title': 'string',
			'description': 'text',
			'problem': 'text',
			'solution': 'text',
			'challenges': 'challenges-array',
			'approach': 'approach-array',
			'technologies': 'technologies-array',
			'tags': 'string-array',
			'categories': 'string-array',
			'learnings': 'string-array',
			'achievements': 'string-array',
		};

		return knownFields[fieldPath] || 'text';
	}

	// Detect type from actual field value
	if (Array.isArray(field)) {
		if (field.length === 0) {
			return 'array';
		}

		const firstItem = field[0];
		if (typeof firstItem === 'string') {
			return 'string-array';
		}
		if (typeof firstItem === 'object') {
			if (fieldPath === 'challenges') {
				return 'challenges-array';
			}
			if (fieldPath === 'approach') {
				return 'approach-array';
			}
			if (fieldPath === 'technologies') {
				return 'technologies-array';
			}
			return 'object-array';
		}
		return 'array';
	}

	if (typeof field === 'string') {
		return field.length > 100 ? 'text' : 'string';
	}

	if (typeof field === 'number') {
		return 'number';
	}

	if (typeof field === 'boolean') {
		return 'boolean';
	}

	if (typeof field === 'object') {
		return 'object';
	}

	return 'string';
}

// Tool to read a field from a referenced document
const readSubFieldTool = tool({
	description: 'Read field data from a document referenced by the current document. Use this tool when you need to access information from a related document to provide context or inform suggestions. Helpful when crafting content that needs to be consistent with or reference other documents in the system.',
	parameters: z.object({
		documentId: z.string().describe('The Sanity document ID of the main document'),
		referenceFieldPath: z.string().describe('The path to the reference field in the main document'),
		referencedFieldPath: z.string().describe('The path to the field in the referenced document you want to read'),
		referenceIndex: z.number().optional().describe('For array references, the index of the reference to use'),
	}),
	execute: async ({ documentId, referenceFieldPath, referencedFieldPath, referenceIndex }, { toolCallId }) => {
		try {
			// First get the main document
			const document = await sanityClient.getDocument(documentId);
			if (!document) {
				const errorResult = {
					success: false,
					message: `Document not found: ${documentId}`
				};
				await logToolCall(toolCallId, 'readSubField', {
					documentId, referenceFieldPath, referencedFieldPath, referenceIndex
				}, errorResult, true);
				return errorResult;
			}

			// Get the reference value
			const parts = referenceFieldPath.split('.');
			let refValue: any = document;

			// Navigate to the reference field
			for (const part of parts) {
				if (refValue === undefined || refValue === null) {
					return {
						success: false,
						message: `Reference path ${referenceFieldPath} not found in document`
					};
				}
				refValue = refValue[part];
			}

			// Handle array references if needed
			if (Array.isArray(refValue)) {
				if (referenceIndex !== undefined && referenceIndex >= 0 && referenceIndex < refValue.length) {
					refValue = refValue[referenceIndex];
				} else {
					return {
						success: false,
						message: `Invalid reference index ${referenceIndex} for array of length ${refValue.length}`
					};
				}
			}

			// Get the referenced document ID
			const refId = refValue?._ref;
			if (!refId) {
				return {
					success: false,
					message: `No reference ID found at path ${referenceFieldPath}`
				};
			}

			// Fetch the referenced document
			const referencedDoc = await sanityClient.getDocument(refId);
			if (!referencedDoc) {
				return {
					success: false,
					message: `Referenced document not found with ID: ${refId}`
				};
			}

			// Get the requested field from the referenced document
			const refFieldParts = referencedFieldPath.split('.');
			let fieldValue: any = referencedDoc;

			// Navigate to the field in the referenced document
			for (const part of refFieldParts) {
				if (fieldValue === undefined || fieldValue === null) {
					return {
						success: false,
						message: `Field path ${referencedFieldPath} not found in referenced document`
					};
				}
				fieldValue = fieldValue[part];
			}

			const result = {
				success: true,
				message: `Successfully read referenced field data`,
				referencedDocumentId: refId,
				referencedDocumentType: referencedDoc._type,
				referencedFieldPath,
				value: fieldValue,
			};

			await logToolCall(toolCallId, 'readSubField', {
				documentId, referenceFieldPath, referencedFieldPath, referenceIndex
			}, result, false);

			return result;
		} catch (error) {
			console.error('Error reading referenced field:', error);

			const errorResult = {
				success: false,
				message: `Failed to read referenced field: ${error instanceof Error ? error.message : String(error)}`
			};

			await logToolCall(toolCallId, 'readSubField', {
				documentId, referenceFieldPath, referencedFieldPath, referenceIndex
			}, errorResult, true);

			return errorResult;
		}
	}
});

// Define available tools
const availableTools = {
	writeField: writeFieldTool,
	suggestContent: suggestContentTool,
	readSubField: readSubFieldTool
};

// Request interface that matches what we receive from the frontend
interface ContentCopilotRequest {
	id?: string;
	messages: Message[];
	documentId: string;
	conversationId: string | null;
	schemaType: string;
	serializableSchema: SerializableSchema;
	documentData: Record<string, any>;
}

export async function POST(req: Request) {
	// Parse the request body
	const requestData: ContentCopilotRequest = await req.json();
	console.log('POST content-copilot - received request for document:', requestData.documentId);

	const {
		messages,
		documentId,
		conversationId,
		schemaType,
		serializableSchema,
		documentData
	} = requestData;

	// Initialize Supabase client
	const supabase = await createClient();

	let sessionId: string;

	// Use existing conversation ID if provided
	if (conversationId) {
		sessionId = conversationId;
		console.log('Using existing conversation:', sessionId);

		// Update the conversation timestamp
		await supabase
			.from('conversations')
			.update({ updated_at: new Date().toISOString() })
			.eq('id', sessionId);
	} else {
		console.log('Creating new conversation for document:', documentId);
		// Create a new conversation record
		const { data: newConversation, error } = await supabase
			.from('conversations')
			.insert({
				title: documentData.title || `New ${schemaType} - ${documentId.substring(0, 8)}`,
				conversation_type: 'content-copilot',
				context: {
					source: 'sanity',
					documentId,
					schemaType,
					documentTitle: documentData.title || 'Untitled'
				},
				system_prompt: generateSystemPrompt({
					documentId,
					schemaType,
					documentData,
					serializableSchema
				})
			})
			.select()
			.single();

		if (error) {
			console.error('Failed to create conversation:', error);
			return new Response(JSON.stringify({ error: 'Failed to create conversation' }), {
				status: 500,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		sessionId = newConversation.id;
		console.log('Created new conversation:', sessionId);
	}

	// Get the last user message to save
	const userMessage = messages.length > 0 ? messages[messages.length - 1] : null;

	// If we have a user message, save it to the database
	if (userMessage && userMessage.role === 'user') {
		const nextSequence = await getNextSequence(supabase, sessionId);
		await supabase.from('messages').insert({
			conversation_id: sessionId,
			external_id: userMessage.id || `msg_${Date.now()}`,
			role: 'user',
			content: userMessage.content,
			sequence: nextSequence
		});
		console.log('Saved user message:', { conversationId: sessionId, sequence: nextSequence });
	}

	// Convert messages to the format expected by the streamText function
	const aiMessages: Message[] = messages.map(msg => ({
		id: msg.id || `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
		role: msg.role,
		content: msg.content
	}));

	// Create the stream with callbacks
	const stream = streamText({
		model: anthropic('claude-3-7-sonnet-latest'),
		system: generateSystemPrompt({
			documentId,
			schemaType,
			documentData,
			serializableSchema
		}),
		messages: aiMessages,
		tools: availableTools,
		maxSteps: 5,
		onFinish: async (result) => {
			// Save the assistant's response
			const nextSequence = await getNextSequence(supabase, sessionId);
			await supabase.from('messages').insert({
				conversation_id: sessionId,
				role: 'assistant',
				content: result.text,
				sequence: nextSequence
			});
			console.log('Saved assistant response:', { conversationId: sessionId, sequence: nextSequence });

			// Update any analytics if needed
			await updateConversationAnalytics(supabase, sessionId);
		}
	});

	// Add conversation ID to the response
	const originalResponse = await stream.toDataStreamResponse();

	// Create a new Response with an additional header containing the conversation ID
	const responseInit = {
		status: originalResponse.status,
		statusText: originalResponse.statusText,
		headers: new Headers(originalResponse.headers)
	};
	responseInit.headers.set('X-Conversation-Id', sessionId);

	return new Response(originalResponse.body, responseInit);
}

// Generate a system prompt based on the document context
function generateSystemPrompt(params: {
	documentId: string;
	schemaType: string;
	documentData: Record<string, any>;
	serializableSchema: SerializableSchema;
}): string {
	const { documentId, schemaType, documentData } = params;

	// Create the document structure expected by the schema analysis functions
	const document = {
		displayed: documentData
	};

	// Extract simplified schema information for the prompt
	const schemaInfo = extractSchemaInfo(schemaType);
	const schemaFieldsDescription = formatSchemaFieldsForPrompt(schemaInfo);

	// Get document completion status
	const completionStatus = analyzeDocumentCompletion(documentData, schemaInfo);

	// Document title
	const documentTitle = documentData.title || documentData.name || `Untitled ${schemaType}`;

	return `
<identity>
You are Dave, Will Diamond's personal AI assistant. You help Will create and edit content for his personal website and portfolio.
</identity>

<context>
You are operating in 'Content Copilot' mode within Sanity Studio, a content management system. Will is using you to help create and edit structured content in a natural, conversational way rather than filling out form fields manually. Content creation is often challenging, and your role is to make this process more intuitive and enjoyable.
</context>

<purpose>
Your primary purpose is to:
1. Foster extended, natural conversations about Will's projects and content
2. Understand the complete story and context behind each project
3. Help Will articulate his experiences, challenges, and solutions in a natural way
4. Extract structured information from these conversations without explicitly asking about fields
5. Help refine and improve content iteratively
6. Guide Will through completing all necessary information without overwhelming him
</purpose>

<narrative_first_approach>
Content isn't just a collection of fields—it's a narrative about experiences, challenges, solutions, and outcomes. Your goal is to understand this narrative through conversation before focusing on structured data.

When discussing projects, focus on understanding:
- The problem that inspired the project
- The journey of building a solution
- The obstacles that were overcome
- What was learned along the way
- The impact of the work

Field information should emerge naturally from conversation rather than through direct questioning about specific fields.
</narrative_first_approach>

<document_info>
You are currently editing a Sanity document of type: ${schemaType}
  Document ID: ${documentId}
  Document Title: ${documentTitle}
Completion Status: ${completionStatus.requiredFieldsComplete}/${completionStatus.totalRequiredFields} required fields complete

  Current document data:
  ${JSON.stringify(documentData, null, 2)}
</document_info>

<document_schema>
${schemaFieldsDescription}
</document_schema>

<conversation_phases>
Your interaction should follow these general phases, but you have the freedom to move between them as the conversation naturally evolves:

<story_phase>
- Always start with this phase for new conversations
- Focus primarily on understanding the full story and context
- Ask open-ended questions about experiences, motivations, challenges, solutions
- Have 3-5 messages focused on story development
- Quietly update simple fields in the background when information is clear and unambiguous
- Never explicitly mention fields or the structured nature of the content unless the user does
- Examples of good questions:
  * "What inspired you to create this project?"
  * "What problem were you trying to solve?"
  * "How did you approach building the solution?"
  * "What challenges did you face during development?"
  * "How did users respond to this project?"
</story_phase>

<transition_phase>
- Begin this phase after 3-5 messages when you have solid understanding of the project story
- Continue the narrative conversation while organizing more information
- Continue quietly updating fields using writeField for clear, unambiguous information
- Aim to populate all empty fields with at least initial values based on the conversation
- Use a mix of writeField and suggestContent to ensure all fields have basic content
- Occasionally acknowledge updates in a natural way without disrupting conversation flow
- Continue asking deeper questions about the project
- This phase should continue until all required fields have at least some initial content
- Example transition statement: "That's a fascinating approach! I've updated some basic project information based on our conversation. What was the most challenging technical obstacle you encountered?"
</transition_phase>

<field_focused_phase>
- Enter this phase once all fields have at least initial values or when user indicates field-specific focus
- This phase is about refinement, expansion, and quality improvement of existing content
- Focus on making good content great through detailed exploration and improvement
- Dive deeper into specific aspects of the project that need more detail or clarity
- Address each important field with targeted questions to enhance the quality of content
- Use suggestContent to refine complex fields by offering improved alternatives
- Use writeField to update content with more nuanced, detailed information
- Identify weak spots in the content and proactively suggest improvements
- Connect related fields to ensure overall narrative coherence across the document
- Example approach: "I notice the solution description has good technical details, but we could strengthen it by adding more about the specific user benefits. Would you like me to suggest some enhancements based on what you've shared?"
</field_focused_phase>

<phase_flexibility>
- You are not required to progress linearly through these phases
- Be responsive to user signals and adapt your approach accordingly
- Return to story_phase when:
  * New aspects of the project are introduced
  * The conversation reveals gaps in your understanding
  * The user wants to explore a different facet of the project
- Skip directly to field_focused_phase when:
  * The user explicitly asks for help with specific content
  * The user directly references fields or structured content
  * You already have sufficient context from previous conversations
- Blend elements of different phases when appropriate
- Always prioritize natural conversation flow over rigid adherence to phases
- Use your judgment to determine the most appropriate phase based on:
  * Current conversation context
  * User's apparent needs and preferences
  * The completeness of your understanding
  * The specific content being discussed
  * Completeness of the fields in the document
</phase_flexibility>
</conversation_phases>

<user_signals>
Be attentive to these signals that might indicate a desired phase shift:

<signals_for_story_phase>
- User shares unprompted personal anecdotes about the project
- User mentions context, background, or motivation
- User expresses uncertainty about overall project direction
- Questions like "Let me tell you about..." or "The background is..."
- References to early project stages or inception
</signals_for_story_phase>

<signals_for_transition_phase>
- User has provided substantial narrative information
- Conversation has covered key aspects of why, how, and what was built
- User mentions specific details that could be captured in fields
- User seems to have shared the main story points
- Natural pause points in the conversation
</signals_for_transition_phase>

<signals_for_field_phase>
- Direct questions about content: "Can you help me write..."
- Explicit mentions of fields: "I need help with the description"
- Requests for assistance: "How should I phrase this?"
- Expressions of being stuck on specific content
- User begins asking about specific aspects rather than the overall story
- Signs of completion readiness: "What else do I need to add?"
- When most or all fields have initial values and the focus is on improvement
- When the user indicates they want to refine existing content
</signals_for_field_phase>

<general_guidance>
- Treat these signals as suggestions rather than rules
- Consider multiple signals together rather than isolated instances
- Weigh recent signals more heavily than earlier ones
- User signals always take precedence over your internal phase tracking
- When in doubt, briefly acknowledge the phase shift: "I see you'd like help with specific content now. Let's focus on that..."
</general_guidance>
</user_signals>

<tool_usage>
You have access to the following tools:
1. writeField(documentId, fieldPath, value) - Update a specific field in the document
2. suggestContent(documentId, fieldPath, currentValue, fieldType, requirements) - Generate content suggestions for a field without applying them
3. readSubField(documentId, referenceFieldPath, referencedFieldPath, referenceIndex) - Read field data from a referenced document

<usage_guidelines>
- During story_phase: Quietly use writeField for simple, clear information without interrupting conversation
- During transition_phase: Use writeField more actively for basic fields with clear information
- During field_focused_phase: Use both writeField and suggestContent as appropriate

<writeField_guidelines>
- Use for information clearly established in conversation
- Appropriate for simple fields like title, date, boolean values, technology lists
- Use when the content is straightforward and unlikely to need validation
- Match the writing style and terminology used by Will in conversation
- Prefer updating empty fields first, but also update incorrect information
- Update fields in the background without explicitly mentioning each update
</writeField_guidelines>

<suggestContent_guidelines>
- Use for complex narrative fields like problem statements, descriptions, approaches
- Use when multiple approaches to wording or framing are possible
- Use when the content requires Will's voice or perspective
- Always derive suggestions from the established story conversation
</suggestContent_guidelines>
</usage_guidelines>
</tool_usage>

<conversation_style>
- Begin with extended natural conversation focused solely on understanding the project story
- Ask open-ended questions about experiences, challenges, interesting details, and motivations
- Have multiple back-and-forth exchanges before transitioning to any field-focused activities
- Show genuine curiosity about the background, creation process, and narrative arc
- Never explicitly ask about specific fields during the story phase
- Extract information from Will's natural explanations without explicit prompting for each field
- Allow information to emerge naturally through conversation
- Be conversational rather than transactional - prioritize understanding over completion
- Show enthusiasm about Will's projects and ideas
- Demonstrate understanding of technical concepts in AI engineering and development
</conversation_style>

<instructions>
- Begin with open-ended questions about the project's story
- Ask about experiences, challenges, and interesting details rather than focusing on fields
- Spend time understanding the full context before suggesting improvements or updates
- Draw out the narrative through natural conversation
- Quietly identify field information from the conversation and update appropriate fields in the background
- Feel empowered to update any empty fields whenever clear information is available
- Never ask for information in a robotic, form-filling manner
- Approach the conversation as if you're having coffee with Will and genuinely interested in his project
- Connect to previously shared details to make the conversation feel continuous and natural
- Validate experiences and show enthusiasm for interesting aspects of the project
- When writing content, match Will's voice and incorporate details from the conversation
- Use background knowledge of AI, development, and technology to ask insightful questions
- Remember that understanding the story is the primary goal, with field completion happening naturally in parallel
</instructions>

<examples>
Example 1: Story-first conversation with background updating
AI: "Tell me about your Telegram bot project. What inspired you to create it?"

User: "I was living in a hacker house with 5 other engineers, and we kept having issues with chores. No one remembered whose turn it was to clean."

AI: "That sounds frustrating! How did you approach solving that problem?"

User: "I started by creating a simple bot that would send reminders, but then realized we needed a way to track who actually did what."

AI: "Interesting evolution. What technologies did you use to build it?"

User: "I built it with Node.js and the Telegram Bot API. Used MongoDB to store the chore rotations and completion history."

AI: "How did your housemates respond when you first introduced it?"

User: "They loved it! Especially the leaderboard feature I added later that gamified the whole process."

[After this extended conversation, you would now have enough context to quietly update fields like title, description, technologies, and even parts of the problem/solution without explicitly asking]

Example 2: Transitioning from story to refinement
AI: "It sounds like this project evolved quite a bit from the initial reminder system to the full chore management platform with gamification. That's a great journey! Based on our conversation, I've updated some of the basic information in your project.

I'm curious - what was the most challenging technical aspect of building the leaderboard feature?"

[This continues the narrative conversation while acknowledging that background updates happened]

Example 3: Using suggestContent appropriately
User: "I'm not sure how to describe the problem statement well."

AI: "From our conversation, I understand that the core problem was keeping track of chore responsibilities in a shared living space, which led to tension and disorganization. Would you like me to suggest a more structured problem statement based on what you've shared?"

User: "Yes, that would be helpful."

[Here you would use suggestContent to provide options for the problem statement field]
</examples>

Remember to keep your interactions helpful, natural, and focused on understanding the complete story first. Treat the conversation as an engaging discussion between colleagues rather than a form-filling exercise.
`;
}

// Helper function to analyze document completion status
function analyzeDocumentCompletion(document: any, schemaInfo: SchemaInfo) {
	// Count total required fields and how many are completed
	let totalRequiredFields = 0;
	let requiredFieldsComplete = 0;

	if (schemaInfo.fields && Array.isArray(schemaInfo.fields)) {
		schemaInfo.fields.forEach((field) => {
			if (field.required) {
				totalRequiredFields++;

				// Check if the field has a value in the document
				const fieldValue = document[field.name];
				if (fieldValue !== undefined && fieldValue !== null && fieldValue !== '') {
					// For arrays, check if they have items
					if (Array.isArray(fieldValue)) {
						if (fieldValue.length > 0) {
							requiredFieldsComplete++;
						}
					} else {
						requiredFieldsComplete++;
					}
				}
			}
		});
	}

	return {
		totalRequiredFields,
		requiredFieldsComplete,
		percentComplete: totalRequiredFields > 0
			? Math.round((requiredFieldsComplete / totalRequiredFields) * 100)
			: 100
	};
}

// Helper function to get the next sequence number for messages
async function getNextSequence(supabase: any, conversationId: string): Promise<number> {
	const { data, error } = await supabase
		.from('messages')
		.select('sequence')
		.eq('conversation_id', conversationId)
		.order('sequence', { ascending: false })
		.limit(1);

	if (error) {
		console.error('Error getting next sequence:', error);
		return 0;
	}

	return data?.length > 0 ? (data[0].sequence + 1) : 0;
}

// Helper function to update conversation analytics
async function updateConversationAnalytics(supabase: any, conversationId: string) {
	try {
		// Count messages
		const { data: messageCount, error: countError } = await supabase
			.from('messages')
			.select('id', { count: 'exact' })
			.eq('conversation_id', conversationId);

		if (countError) {
			console.error('Error counting messages:', countError);
			return;
		}

		// Check if analytics record exists
		const { data: existingAnalytics, error: existingError } = await supabase
			.from('conversation_analytics')
			.select('id')
			.eq('conversation_id', conversationId)
			.limit(1);

		if (existingError) {
			console.error('Error checking analytics:', existingError);
			return;
		}

		if (existingAnalytics && existingAnalytics.length > 0) {
			// Update existing record
			await supabase
				.from('conversation_analytics')
				.update({
					message_count: messageCount,
					updated_at: new Date().toISOString(),
					model_used: 'claude-3-7-sonnet'
				})
				.eq('conversation_id', conversationId);
		} else {
			// Create new record
			await supabase
				.from('conversation_analytics')
				.insert({
					conversation_id: conversationId,
					message_count: messageCount,
					model_used: 'claude-3-7-sonnet'
				});
		}
	} catch (error) {
		console.error('Failed to update analytics:', error);
	}
}

// Function to log tool calls to the database
async function logToolCall(
	toolCallId: string,
	toolName: string,
	args: Record<string, any>,
	result: Record<string, any>,
	isError: boolean
): Promise<void> {
	try {
		const supabase = await createClient();

		// Find the related message
		const { data: messages, error: messageError } = await supabase
			.from('messages')
			.select('id, conversation_id')
			.order('created_at', { ascending: false })
			.limit(1);

		if (messageError) {
			console.error('Error finding message for tool call:', messageError);
			return;
		}

		// If message found, log the tool call
		if (messages && messages.length > 0) {
			const { error } = await supabase
				.from('tool_calls')
				.insert({
					message_id: messages[0].id,
					tool_call_id: toolCallId,
					tool_name: toolName,
					arguments: args,
					result: result,
					is_error: isError
				});

			if (error) {
				console.error('Error logging tool call:', error);
			}

			// Get current tool call count
			const { data: analytics } = await supabase
				.from('conversation_analytics')
				.select('tool_call_count')
				.eq('conversation_id', messages[0].conversation_id)
				.single();

			// Update tool call count in analytics
			await supabase
				.from('conversation_analytics')
				.upsert({
					conversation_id: messages[0].conversation_id,
					tool_call_count: (analytics?.tool_call_count || 0) + 1,
					updated_at: new Date().toISOString()
				}, {
					onConflict: 'conversation_id'
				});
		}
	} catch (error) {
		console.error('Failed to log tool call:', error);
	}
}