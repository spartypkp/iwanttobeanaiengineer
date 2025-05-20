"use server;";
import { createClient } from '@/lib/utils/supabase/server';


// Function to log tool calls to the database
export async function logToolCall(
	toolCallId: string,
	toolName: string,
	args: Record<string, any>,
	result: Record<string, any>,
	isError: boolean
): Promise<void> {
	try {
		const supabase = await createClient();

		// Find the related message
		const { data: messages, error: messageError } = await supabase
			.from('messages')
			.select('id, conversation_id')
			.order('created_at', { ascending: false })
			.limit(1);

		if (messageError) {
			console.error('Error finding message for tool call:', messageError);
			return;
		}

		// If message found, log the tool call
		if (messages && messages.length > 0) {
			const { error } = await supabase
				.from('tool_calls')
				.insert({
					message_id: messages[0].id,
					tool_call_id: toolCallId,
					tool_name: toolName,
					arguments: args,
					result: result,
					is_error: isError
				});

			if (error) {
				console.error('Error logging tool call:', error);
			}

			// // Get current tool call count
			// const { data: analytics } = await supabase
			// 	.from('conversation_analytics')
			// 	.select('tool_call_count')
			// 	.eq('conversation_id', messages[0].conversation_id)
			// 	.single();

			// // Update tool call count in analytics
			// await supabase
			// 	.from('conversation_analytics')
			// 	.upsert({
			// 		conversation_id: messages[0].conversation_id,
			// 		tool_call_count: (analytics?.tool_call_count || 0) + 1,
			// 		updated_at: new Date().toISOString()
			// 	}, {
			// 		onConflict: 'conversation_id'
			// 	});
		}
	} catch (error) {
		console.error('Failed to log tool call:', error);
	}
}