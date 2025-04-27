import { createClient } from '@/lib/utils/supabase/server';
import { Message } from 'ai';

interface GetConversationRequest {
	documentId: string;
}

export async function POST(req: Request) {
	try {
		const { documentId }: GetConversationRequest = await req.json();

		if (!documentId) {
			return Response.json({ error: 'Document ID is required' }, { status: 400 });
		}

		// Initialize Supabase client
		const supabase = await createClient();

		// Use a simpler approach to query the JSONB field
		// The containsObject filter checks if the JSON object has the specified field with the specified value
		const { data: conversations, error: conversationError } = await supabase
			.from('conversations')
			.select('*')
			.contains('context', { documentId })
			.limit(1);

		if (conversationError) {
			console.error('Error fetching conversation:', conversationError);
			return Response.json({ error: 'Failed to fetch conversation' }, { status: 500 });
		}

		// If no conversation exists yet
		if (!conversations || conversations.length === 0) {
			console.log('No conversation found for document:', documentId);
			return Response.json({ conversation: null, messages: [] });
		}

		const conversation = conversations[0];
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