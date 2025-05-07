import { createClient } from '@/lib/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
	try {
		const { conversationId, message } = await request.json();

		if (!conversationId || !message) {
			return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
		}

		// Initialize Supabase client
		const supabase = await createClient();

		// Get the next sequence number for this message
		const { data: lastMessage, error: sequenceError } = await supabase
			.from('messages')
			.select('sequence')
			.eq('conversation_id', conversationId)
			.order('sequence', { ascending: false })
			.limit(1);

		if (sequenceError) {
			console.error('Error getting next sequence:', sequenceError);
			return NextResponse.json({ error: 'Failed to determine message sequence' }, { status: 500 });
		}

		const nextSequence = lastMessage?.length > 0 ? (lastMessage[0].sequence + 1) : 0;

		// Insert the message with its original format
		const { error: insertError } = await supabase.from('messages').insert({
			conversation_id: conversationId,
			role: message.role,
			content: typeof message.content === 'string' ? message.content : '',
			content_parts: message.parts || null,
			sequence: nextSequence
		});

		if (insertError) {
			console.error('Error inserting message:', insertError);
			return NextResponse.json({ error: 'Failed to save message' }, { status: 500 });
		}

		// Update conversation timestamp
		await supabase
			.from('conversations')
			.update({ updated_at: new Date().toISOString() })
			.eq('id', conversationId);

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error('Error in save-message endpoint:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
} 