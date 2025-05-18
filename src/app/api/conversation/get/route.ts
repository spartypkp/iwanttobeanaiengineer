import { ConversationMode } from '@/lib/types';
import { createClient } from '@/lib/utils/supabase/server';
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





		return NextResponse.json({
			conversation: conversationData,
			messages: conversationData.messages,
			mode
		});
	} catch (error) {
		console.error('Error in GET conversation:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
} 