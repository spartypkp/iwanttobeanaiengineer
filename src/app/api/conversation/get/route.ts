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

type ConversationMode = 'regular' | 'refinement';

// Define a type for transformed messages
interface TransformedMessage {
	id: string;
	parts: MessagePart[];
	[key: string]: any;
}

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

		console.log(`[DEBUG] Found conversation: ${conversationData.id} for document: ${documentId}, mode: ${mode}`);

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

		console.log(`[DEBUG] Found ${messagesData.length} messages for conversation: ${conversationData.id}`);

		// Log the raw tool calls for inspection
		const toolCallsCount = messagesData.reduce((count, msg) => count + (msg.tool_calls?.length || 0), 0);
		console.log(`[DEBUG] Total tool calls found: ${toolCallsCount}`);

		if (toolCallsCount > 0) {
			// Log first message with tool calls for debugging
			const firstMessageWithTools = messagesData.find(msg => msg.tool_calls && msg.tool_calls.length > 0);
			if (firstMessageWithTools) {
				console.log('[DEBUG] Sample tool_call from DB:', JSON.stringify(firstMessageWithTools.tool_calls[0]));
			}
		}

		// Transform messages to include proper parts structure for rendering
		const transformedMessages: TransformedMessage[] = messagesData.map(message => {
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
							state: 'result', // This should mark all tool calls as completed
							args: toolCall.arguments,
							result: toolCall.result
						}
					};

					// Log the transformed tool invocation for debugging
					console.log(`[DEBUG] Transformed tool call - ID: ${toolCall.tool_call_id}, Name: ${toolCall.tool_name}, State: 'result'`);

					parts.push(toolInvocationPart);
				});
			}

			return {
				...message,
				parts
			};
		});

		// Log the first transformed message with tool calls
		const firstTransformedWithTools = transformedMessages.find(msg =>
			msg.parts && msg.parts.some((part: MessagePart) => part.type === 'tool-invocation')
		);

		if (firstTransformedWithTools) {
			const toolPart = firstTransformedWithTools.parts.find((p: MessagePart) => p.type === 'tool-invocation');
			if (toolPart && toolPart.type === 'tool-invocation') {
				console.log('[DEBUG] Sample transformed tool invocation:', JSON.stringify({
					toolName: toolPart.toolInvocation.toolName,
					state: toolPart.toolInvocation.state,
					hasResult: !!toolPart.toolInvocation.result
				}));
			}
		}

		return NextResponse.json({
			conversation: conversationData,
			messages: transformedMessages,
			mode
		});
	} catch (error) {
		console.error('Error in GET conversation:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
} 