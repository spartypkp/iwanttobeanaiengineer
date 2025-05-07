import { ConversationMode } from '@/lib/types';
import { createClient } from '@/lib/utils/supabase/server';
import { CoreAssistantMessage, CoreMessage, CoreUserMessage } from 'ai';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
	try {
		const { documentId, mode = 'regular' } = await request.json() as {
			documentId: string;
			mode?: ConversationMode;
		};

		if (!documentId) {
			return NextResponse.json({ error: 'Missing documentId' }, { status: 400 });
		}

		// Initialize Supabase client
		const supabase = await createClient();

		// Find conversation for this document and mode
		const { data: conversationData, error: conversationError } = await supabase
			.from('conversations')
			.select('*')
			.contains('context', { documentId, mode })
			.order('updated_at', { ascending: false })
			.limit(1)
			.single();

		if (conversationError && conversationError.code !== 'PGRST116') {
			console.error('Error fetching conversation:', conversationError);
			return NextResponse.json({ error: 'Failed to fetch conversation' }, { status: 500 });
		}

		if (!conversationData) {
			// No conversation found for this document and mode
			return NextResponse.json({ conversation: null, messages: [] });
		}

		const { data: messagesData, error: messagesError } = await supabase
			.from('messages')
			.select(`
				*
			`)
			.eq('conversation_id', conversationData.id)
			.order('sequence', { ascending: true });

		if (messagesError) {
			console.error('Error fetching messages:', messagesError);
			return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
		}

		const messages: CoreMessage[] = [];

		for (const message of messagesData) {
			if (message.role === 'user') {
				let userMessage: CoreUserMessage = {
					role: message.role,
					content: message.content
				};
				messages.push(userMessage);
			} else if (message.role === 'assistant') {
				let toAdd = message.content_parts;
				if (!message.content_parts) {
					toAdd = [{ type: 'text', text: message.content }];
				}
				let assistantMessage: CoreAssistantMessage = {
					role: message.role,
					content: toAdd
				};
				messages.push(assistantMessage);
			}
		}



		return NextResponse.json({
			conversation: conversationData,
			messages: messages,
			mode
		});
	} catch (error) {
		console.error('Error in GET conversation:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
} 