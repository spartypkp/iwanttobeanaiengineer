import { ToolInvocation, ToolInvocationDisplay } from "./index";

interface MessagePartProps {
	part: {
		type: string;
		text?: string;
		toolInvocation?: ToolInvocation;
	};
	addToolResult?: (result: { toolCallId: string; result: any; }) => void;
}

/**
 * Component that renders different types of message parts (text or tool invocations)
 */
export const MessagePart = ({ part, addToolResult }: MessagePartProps) => {
	// Debug incoming message part
	console.log(`[DEBUG] MessagePart rendering - Type: ${part.type}, ToolName: ${part.type === 'tool-invocation' ? part.toolInvocation?.toolName : 'N/A'}`);

	// If this is a tool invocation, add additional debug info
	if (part.type === 'tool-invocation' && part.toolInvocation) {
		console.log(`[DEBUG] MessagePart tool details - ID: ${part.toolInvocation.toolCallId}, State: ${part.toolInvocation.state}, HasResult: ${!!part.toolInvocation.result}`);
	}

	// This component handles rendering different types of message parts
	// When the conversation is loaded from the database, tool calls are
	// reconstructed from the tool_calls table and added to the message
	// as proper message parts with 'tool-invocation' type
	switch (part.type) {
		case 'text':
			return part.text ? (
				<div className="whitespace-pre-wrap prose prose-sm max-w-none prose-p:text-black prose-headings:text-black prose-a:text-emerald-600 prose-ol:pl-5 prose-ul:pl-5 prose-li:my-0 prose-ol:my-2 prose-ul:my-2 prose-ol:list-decimal prose-ul:list-disc">
					{part.text}
				</div>
			) : null;

		case 'tool-invocation':
			return part.toolInvocation ? (
				<div className="my-0.5 inline-block">
					<ToolInvocationDisplay toolInvocation={part.toolInvocation} addToolResult={addToolResult} />
				</div>
			) : null;

		case 'step-start':
			return <div className="my-1.5"><hr className="border-t border-gray-200" /></div>;

		default:
			console.log(`[DEBUG] MessagePart unknown type: ${part.type}`);
			return null;
	}
}; 