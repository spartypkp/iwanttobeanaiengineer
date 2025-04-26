import { createClient } from '@/lib/utils/supabase/server';
import { Message } from 'ai';

interface GetConversationRequest {
	documentId: string;
	schemaType?: Record<string, any>;
}

export async function POST(req: Request) {
	try {
		const { documentId, schemaType }: GetConversationRequest = await req.json();

		if (!documentId) {
			return Response.json({ error: 'Document ID is required' }, { status: 400 });
		}

		// Initialize Supabase client
		const supabase = await createClient();

		console.log('Fetching conversation for document:', documentId);

		// Find the latest conversation for this document by title
		// Much simpler query - using documentId directly as the title
		const query = supabase
			.from('conversations')
			.select('*')
			.eq('conversation_type', 'content-copilot')
			.eq('title', documentId)
			.order('updated_at', { ascending: false })
			.limit(1);

		const { data: conversation, error: conversationError } = await query.single();

		if (conversationError && conversationError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
			console.error('Error fetching conversation:', conversationError);
			return Response.json({ error: 'Failed to fetch conversation' }, { status: 500 });
		}

		// If no conversation exists yet
		if (!conversation) {
			console.log('No conversation found for document:', documentId);
			return Response.json({ conversation: null, messages: [] });
		}

		console.log('Found conversation:', conversation.id);

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

		console.log(`Found ${messagesData?.length || 0} messages for conversation ${conversation.id}`);

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