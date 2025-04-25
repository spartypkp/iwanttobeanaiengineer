import { createClient } from '@/lib/utils/supabase/server';
import { anthropic } from '@ai-sdk/anthropic';
import { Message, streamText } from 'ai';

const individualTools = [

];
interface ContentCopilotRequest {
	document: {
		published?: Record<string, any> | null;
		draft?: Record<string, any> | null;
		displayed: Record<string, any>;
		historical?: Record<string, any> | null;
	};
	documentId: string;
	schemaType: string;
	conversationId?: string | null;
}

export async function POST(req: Request) {
	const { messages, body }: { messages: Message[]; body: ContentCopilotRequest; } = await req.json();
	const { documentId, schemaType, conversationId } = body;

	// Initialize Supabase client
	const supabase = await createClient();

	let sessionId: string;

	// Use existing conversation ID if provided
	if (conversationId) {
		sessionId = conversationId;

		// Update the conversation timestamp
		await supabase
			.from('conversations')
			.update({ updated_at: new Date().toISOString() })
			.eq('id', sessionId);
	} else {
		// Create a new conversation record
		const { data: newConversation, error } = await supabase
			.from('conversations')
			.insert({
				title: `${schemaType} - ${body.document.displayed?.title || documentId}`,
				conversation_type: 'content-copilot',
				context: {
					source: 'sanity',
					documentId,
					schemaType
				},
				system_prompt: generateSystemPrompt(body)
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
	}

	// Get the last user message to save
	const userMessage = messages.length > 0 ? messages[messages.length - 1] : null;

	// If we have a user message, save it to the database
	if (userMessage && userMessage.role === 'user') {
		const nextSequence = await getNextSequence(supabase, sessionId);
		await supabase.from('messages').insert({
			conversation_id: sessionId,
			external_id: userMessage.id,
			role: 'user',
			content: userMessage.content,
			sequence: nextSequence
		});
	}

	// Create the stream with callbacks
	const stream = streamText({
		model: anthropic('claude-3-7-sonnet-latest'),
		system: generateSystemPrompt(body),
		messages,
		tools: {},

		onFinish: async (result) => {
			// Save the assistant's response
			const nextSequence = await getNextSequence(supabase, sessionId);
			await supabase.from('messages').insert({
				conversation_id: sessionId,
				role: 'assistant',
				content: result.text,
				sequence: nextSequence
			});

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
function generateSystemPrompt(body: ContentCopilotRequest): string {
	const { documentId, schemaType, document } = body;

	return `
  You are working as Dave, Will Diamond's personal AI assistant. Will Diamond is an AI Engineer and built you to help him with his work.

  You are currently in 'content-copilot' mode. You are helping Will write content for his website - directly integrated with Sanity studio. Writing about content is very difficult for Will. He built you in order to facilitate the creation and enrichment of content in Sanity studio.

  You are currently editing a Sanity document of type: ${schemaType}.
  Document ID: ${documentId}
  Document Title: ${document.displayed?.title || 'Untitled'}

  Current document data:
  ${JSON.stringify(document.displayed, null, 2)}

  You will work with Will in order to help him write the content for this document. The idea is for you to lead a detailed conversation with Will about the specific entity type. Through natural conversation you will learn more about the entity (project potentially). 
  
  Ask targeted questions, be natural. Do not just ask for information, make Will tell a natural story. From this natural conversation you will extract good information to fill in specific fields.
  
  You will call specific tools to get or patch specific fields. This will be done in the background. Will sees your updates after you send them in. This should be a multi-turn natural conversation.
  `;
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