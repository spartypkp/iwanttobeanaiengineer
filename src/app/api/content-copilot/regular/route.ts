import { generateContentCopilotSystemPrompt } from '@/lib/prompts';
import { githubTools } from '@/lib/tools/github';
import {
	//removeFromArrayTool,
	// Only import legacy tools
	arrayTool,
	deleteTool,
	//addToArrayTool,
	getAllDocumentTypesTool,
	getRelatedDocumentTool,
	listDocumentsByTypeTool,
	queryTool,
	writeTool
} from '@/lib/tools/index';
import { saveChat } from '@/lib/utils/messagesManager';
import { createClient } from '@/lib/utils/supabase/server';
import { SerializableSchema } from '@/utils/schema-serialization';
import { anthropic } from '@ai-sdk/anthropic';
import {
	appendResponseMessages,
	streamText,
	type Message, // This is typically UIMessage from 'ai'
	type Tool
} from 'ai';
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

// Define available tools - only use legacy tools for regular mode
const availableTools: Record<string, Tool> = {
	writeTool,
	deleteTool,
	arrayTool,
	queryTool,

	// Other tools
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
	messages: Message[]; // Messages from useChat, which are UIMessages
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

	let {
		messages, // These are UIMessages from the client
		documentId,
		conversationId, // This can be null for a new conversation
		schemaType,
		serializableSchema,
		documentData
	} = requestData;

	// Initialize Supabase client
	const supabase = await createClient();

	// Use existing conversation ID or create a new one
	if (!conversationId) {
		console.log('Creating new conversation for document:', documentId);
		const { data: newConversation, error } = await supabase
			.from('conversations')
			.insert({
				title: documentData.title || `New ${schemaType} - ${documentId.substring(0, 8)}`,
				conversation_type: 'content-copilot',
				context: {
					source: 'sanity',
					documentId,
					schemaType,
					documentTitle: documentData.title || 'Untitled',
					mode: 'regular'
				},
				// Do not store messages JSON here; messages live in the messages table
			})
			.select('id')
			.single();

		if (error) {
			console.error('Failed to create conversation:', error);
			return new Response(JSON.stringify({ error: 'Failed to create conversation' }), {
				status: 500,
				headers: { 'Content-Type': 'application/json' }
			});
		}
		conversationId = newConversation.id;
		console.log('Created new conversation:', conversationId);
	} else {
		// Optionally, update the conversation's updated_at timestamp or messages if needed
		await supabase
			.from('conversations')
			.update({ updated_at: new Date().toISOString() })
			.eq('id', conversationId);
	}


	const systemPrompt = generateContentCopilotSystemPrompt({
		documentId,
		schemaType,
		documentData,
		serializableSchema
	});

	const stream = streamText({
		model: anthropic('claude-3-7-sonnet-latest'),
		system: systemPrompt,
		messages: messages, // Pass UIMessages directly
		tools: availableTools,
		maxSteps: 20,
		async onFinish({ response }) { // response contains response.messages as CoreMessage[]
			if (!conversationId) {
				console.error('onFinish: conversationId is null, cannot save chat.');
				return;
			}
			const updatedMessages = appendResponseMessages({
				messages, // Original UIMessages
				responseMessages: response.messages, // New CoreMessages from AI
			});
			await saveChat({
				conversationId: conversationId, // Corrected parameter name
				messages: updatedMessages, // Persist to messages table
			});
			// Optionally update analytics if still needed
			// await updateConversationAnalytics(supabase, conversationId);
		},
	});

	// Add conversation ID to the response headers for the client to pick up if it's a new chat
	const responseInit = {
		status: 200,
		headers: new Headers({
			'Content-Type': 'text/plain; charset=utf-8',
			'X-Conversation-Id': conversationId as string // Ensure it's a string for the header
		})
	};

	return stream.toDataStreamResponse(responseInit);
}

// Helper functions like getNextSequence and updateConversationAnalytics might be obsolete
// if not used elsewhere, or if analytics are handled differently with the new message storage.
// Consider removing them if they are no longer needed.
