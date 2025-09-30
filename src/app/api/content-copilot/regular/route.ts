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
	try {
		const requestData: ContentCopilotRequest = await req.json();

		let {
			messages,
			documentId,
			conversationId,
			schemaType,
			serializableSchema,
			documentData
		} = requestData;

		const supabase = await createClient();

		// Create or update conversation
		if (!conversationId) {
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
					}
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
		} else {
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

		const modelName = process.env.DEFAULT_ANTHROPIC_MODEL || 'claude-sonnet-4-5';
		const stream = streamText({
			model: anthropic(modelName),
			system: systemPrompt,
			messages: messages,
			tools: availableTools,
			maxSteps: 20,
			onError: (error) => {
				console.error('[content-copilot/regular] Stream error:', error);
			},
			async onFinish({ response }) {
				if (!conversationId) {
					console.error('onFinish: conversationId is null, cannot save chat.');
					return;
				}
				try {
					const updatedMessages = appendResponseMessages({
						messages,
						responseMessages: response.messages,
					});
					await saveChat({
						conversationId: conversationId,
						messages: updatedMessages,
					});
				} catch (error) {
					console.error('[content-copilot/regular] Error in onFinish:', error);
				}
			},
		});

		const responseInit = {
			status: 200,
			headers: new Headers({
				'Content-Type': 'text/plain; charset=utf-8',
				'X-Conversation-Id': conversationId as string
			})
		};

		return stream.toDataStreamResponse(responseInit);
	} catch (error) {
		console.error('[content-copilot/regular] Error:', error);
		return new Response(JSON.stringify({
			error: 'Internal server error',
			details: error instanceof Error ? error.message : String(error)
		}), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
}
