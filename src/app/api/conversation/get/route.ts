import { createClient } from '@/lib/utils/supabase/server';
import { NextResponse } from 'next/server';

// Define proper types for message parts
interface TextPart {
	type: 'text';
	text: string;
}

interface ToolInvocation {
	toolName: string;
	toolCallId: string;
	state: 'partial-call' | 'call' | 'result';
	args: Record<string, any>;
	result?: any;
}

interface ToolInvocationPart {
	type: 'tool-invocation';
	toolInvocation: ToolInvocation;
}

type MessagePart = TextPart | ToolInvocationPart;

export async function POST(request: Request) {
	try {
		const { documentId } = await request.json() as { documentId: string; };

		if (!documentId) {
			return NextResponse.json({ error: 'Missing documentId' }, { status: 400 });
		}

		// Initialize Supabase client
		const supabase = await createClient();

		// Find conversation for this document
		const { data: conversationData, error: conversationError } = await supabase
			.from('conversations')
			.select('*')
			.contains('context', { documentId })
			.order('updated_at', { ascending: false })
			.limit(1)
			.single();

		if (conversationError && conversationError.code !== 'PGRST116') {
			console.error('Error fetching conversation:', conversationError);
			return NextResponse.json({ error: 'Failed to fetch conversation' }, { status: 500 });
		}

		if (!conversationData) {
			// No conversation found for this document
			return NextResponse.json({ conversation: null, messages: [] });
		}

		// Fetch messages for this conversation including join with tool_calls
		const { data: messagesData, error: messagesError } = await supabase
			.from('messages')
			.select(`
				*,
				tool_calls(*)
			`)
			.eq('conversation_id', conversationData.id)
			.order('sequence', { ascending: true });

		if (messagesError) {
			console.error('Error fetching messages:', messagesError);
			return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
		}

		// Transform messages to include proper parts structure for rendering
		const transformedMessages = messagesData.map(message => {
			// If message already has content_parts, use that
			if (message.content_parts) {
				return {
					...message,
					parts: message.content_parts as MessagePart[]
				};
			}

			// Otherwise, reconstruct parts from message content and tool_calls
			const parts: MessagePart[] = [{ type: 'text', text: message.content }];

			// Add tool calls if there are any
			if (message.tool_calls && message.tool_calls.length > 0) {
				message.tool_calls.forEach((toolCall: any) => {
					const toolInvocationPart: ToolInvocationPart = {
						type: 'tool-invocation',
						toolInvocation: {
							toolName: toolCall.tool_name,
							toolCallId: toolCall.tool_call_id,
							state: 'result',
							args: toolCall.arguments,
							result: toolCall.result
						}
					};
					parts.push(toolInvocationPart);
				});
			}

			return {
				...message,
				parts
			};
		});

		return NextResponse.json({ conversation: conversationData, messages: transformedMessages });
	} catch (error) {
		console.error('Error in GET conversation:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
} 