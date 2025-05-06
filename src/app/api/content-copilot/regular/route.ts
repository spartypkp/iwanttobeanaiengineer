import { generateContentCopilotSystemPrompt } from '@/lib/prompts';
import { githubTools } from '@/lib/tools/github';
import {
	addToArrayTool,
	getAllDocumentTypesTool,
	getRelatedDocumentTool,
	listDocumentsByTypeTool,
	removeFromArrayTool,
	writeFieldTool
} from '@/lib/tools/sanityTools';
import { createClient } from '@/lib/utils/supabase/server';
import { SerializableSchema } from '@/utils/schema-serialization';
import { anthropic } from '@ai-sdk/anthropic';
import { Message, streamText, type Tool } from 'ai';

// Configure GitHub tools with authentication
const githubToolsConfig = githubTools(
	{
		token: process.env.GITHUB_TOKEN || ''
	},
	{
		// Only include tools we need
		excludeTools: [
			// Exclude all GitHub tools except getRepositoryDetails
			'getRepository',
			'getRepositoryLanguages',
		]
	}
);

// Define available tools
const availableTools: Record<string, Tool> = {
	writeField: writeFieldTool,
	addToArray: addToArrayTool,
	removeFromArray: removeFromArrayTool,
	getRelatedDocument: getRelatedDocumentTool,
	getAllDocumentTypes: getAllDocumentTypesTool,
	listDocumentsByType: listDocumentsByTypeTool,
};

// Add the GitHub repository details tool if available
if (githubToolsConfig.getRepositoryDetails) {
	availableTools.getRepositoryDetails = githubToolsConfig.getRepositoryDetails;
}

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
				system_prompt: generateContentCopilotSystemPrompt({
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

	const systemPrompt = generateContentCopilotSystemPrompt({
		documentId,
		schemaType,
		documentData,
		serializableSchema
	});
	//'console.log('System prompt:', systemPrompt);


	// Create the stream with callbacks
	const stream = streamText({
		model: anthropic('claude-3-7-sonnet-latest'),
		system: systemPrompt,
		messages: aiMessages,
		tools: availableTools,
		maxSteps: 20,
		onFinish: async (result) => {
			// Save the assistant's response
			const nextSequence = await getNextSequence(supabase, sessionId);

			// Extract parts from the response if available
			const messageParts = result.steps?.[0]?.toolCalls?.length > 0 ?
				[
					{ type: 'text', text: result.text },
					...result.steps[0].toolCalls.map(call => {
						// Check if this is a result-state tool call
						if ('result' in call) {
							return {
								type: 'tool-invocation',
								toolInvocation: {
									toolName: call.toolName,
									toolCallId: call.toolCallId,
									state: 'result',
									args: call.args,
									result: call.result
								}
							};
						} else {
							// Handle tool calls without results
							return {
								type: 'tool-invocation',
								toolInvocation: {
									toolName: call.toolName,
									toolCallId: call.toolCallId,
									state: 'call',
									args: call.args
								}
							};
						}
					})
				] : null;

			await supabase.from('messages').insert({
				conversation_id: sessionId,
				role: 'assistant',
				content: result.text,
				content_parts: messageParts,
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
