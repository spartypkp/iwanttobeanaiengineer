import { ConversationMode } from '@/lib/types';
import { createClient } from '@/lib/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
	try {
		// Parse request body
		const body = await request.json().catch(err => {
			console.error('[GET conversation] JSON parse error:', err);
			throw new Error('Invalid JSON in request body');
		});

		const { documentId, mode = 'regular' } = body as {
			documentId: string;
			mode?: ConversationMode;
		};

		if (!documentId) {
			return NextResponse.json({ error: 'Missing documentId' }, { status: 400 });
		}

		console.log(`[GET conversation] Fetching conversation for documentId=${documentId}, mode=${mode}`);

		// Initialize Supabase client with detailed error handling
		let supabase;
		try {
			supabase = await createClient();
			console.log('[GET conversation] Supabase client initialized successfully');
		} catch (error) {
			console.error('[GET conversation] Supabase client initialization failed:', error);
			const errorMessage = error instanceof Error ? error.message : String(error);
			const errorStack = error instanceof Error ? error.stack : 'No stack trace';
			return NextResponse.json({
				error: 'Database connection failed',
				details: errorMessage,
				stack: errorStack
			}, { status: 503 });
		}

		// Find conversation for this document and mode
		console.log('[GET conversation] Querying Supabase for conversation data');
		const { data: conversationData, error: conversationError } = await supabase
			.from('conversations')
			.select('*')
			.contains('context', { documentId, mode })
			.order('updated_at', { ascending: false })
			.limit(1)
			.single();

		if (conversationError && conversationError.code !== 'PGRST116') {
			console.error('[GET conversation] Error fetching conversation from Supabase:', {
				code: conversationError.code,
				message: conversationError.message,
				details: conversationError.details,
				hint: conversationError.hint
			});
			return NextResponse.json({
				error: 'Failed to fetch conversation',
				details: conversationError
			}, { status: 500 });
		}

		if (!conversationData) {
			// No conversation found for this document and mode
			console.log('[GET conversation] No conversation found for this document and mode');
			return NextResponse.json({ conversation: null, messages: [] });
		}

		console.log(`[GET conversation] Successfully found conversation: ${conversationData.id}`);

		// Load messages from the messages table, ordered by sequence
		const { data: rows, error: messagesError } = await supabase
			.from('messages')
			.select('id, external_id, role, content, content_parts, sequence')
			.eq('conversation_id', conversationData.id)
			.order('sequence', { ascending: true });

		if (messagesError) {
			console.error('[GET conversation] Error loading messages from table:', messagesError);
			return NextResponse.json({
				conversation: conversationData,
				messages: [],
				mode
			});
		}

		// Map DB rows to UI message shape expected by useChat
		const uiMessages = (rows || []).map((row: any) => {
			// Prefer parts if present, else fall back to plain content
			if (Array.isArray(row.content_parts) && row.content_parts.length > 0) {
				return {
					id: row.external_id || row.id,
					role: row.role,
					parts: row.content_parts,
				};
			}
			return {
				id: row.external_id || row.id,
				role: row.role,
				content: row.content || '',
			};
		});

		return NextResponse.json({
			conversation: conversationData,
			messages: uiMessages,
			mode
		});
	} catch (error) {
		// Enhanced error logging for the main try/catch block
		console.error('[GET conversation] Unhandled error:', error);
		const errorMessage = error instanceof Error ? error.message : String(error);
		const errorStack = error instanceof Error ? error.stack : 'No stack trace';

		return NextResponse.json({
			error: 'Internal server error',
			details: errorMessage,
			stack: errorStack
		}, { status: 500 });
	}
} 