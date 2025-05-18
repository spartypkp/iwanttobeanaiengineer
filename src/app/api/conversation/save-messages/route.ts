import { saveChat } from '@/lib/utils/messagesManager';
import { type Message } from 'ai';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
	try {
		const { conversationId, messages } = await req.json() as { conversationId: string, messages: Message[]; };

		if (!conversationId || typeof conversationId !== 'string') {
			return NextResponse.json({ error: 'Invalid or missing conversationId' }, { status: 400 });
		}

		if (!Array.isArray(messages)) {
			return NextResponse.json({ error: 'Invalid or missing messages array' }, { status: 400 });
		}

		// Potentially, add further validation for each message object in the array if needed.

		await saveChat({ conversationId, messages });
		return NextResponse.json({ success: true });
	} catch (error) {
		console.error('[API /save-messages] Error saving messages:', error);
		const errorMessage = error instanceof Error ? error.message : 'Failed to save messages';
		return NextResponse.json({ error: errorMessage }, { status: 500 });
	}
} 