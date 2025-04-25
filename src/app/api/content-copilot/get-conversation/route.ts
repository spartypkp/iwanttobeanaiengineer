import { createClient } from '@/lib/utils/supabase/server';
import { Message } from 'ai';

interface GetConversationRequest {
	documentId: string;
	schemaType: string;
}

export async function POST(req: Request) {
	try {
		const { documentId, schemaType }: GetConversationRequest = await req.json();

		if (!documentId) {
			return Response.json({ error: 'Document ID is required' }, { status: 400 });
		}

		// Initialize Supabase client
		const supabase = await createClient();

		// Find the latest conversation for this document
		const { data: conversation, error: conversationError } = await supabase
			.from('conversations')
			.select('*')
			.eq('conversation_type', 'content-copilot')
			.eq('context->documentId', documentId)
			.eq('context->schemaType', schemaType)
			.order('updated_at', { ascending: false })
			.limit(1)
			.single();

		if (conversationError && conversationError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
			console.error('Error fetching conversation:', conversationError);
			return Response.json({ error: 'Failed to fetch conversation' }, { status: 500 });
		}

		// If no conversation exists yet
		if (!conversation) {
			return Response.json({ conversation: null, messages: [] });
		}

		// Get messages for this conversation
		const { data: messagesData, error: messagesError } = await supabase
			.from('messages')
			.select('*')
			.eq('conversation_id', conversation.id)
			.order('sequence', { ascending: true });

		if (messagesError) {
			console.error('Error fetching messages:', messagesError);
			return Response.json({ error: 'Failed to fetch messages' }, { status: 500 });
		}

		// Convert to the format expected by AI SDK
		const messages: Message[] = messagesData.map(msg => ({
			id: msg.external_id || msg.id,
			role: msg.role as 'user' | 'assistant' | 'system',
			content: msg.content,
		}));

		return Response.json({
			conversation,
			messages,
		});
	} catch (error) {
		console.error('Unexpected error:', error);
		return Response.json({ error: 'An unexpected error occurred' }, { status: 500 });
	}
} 