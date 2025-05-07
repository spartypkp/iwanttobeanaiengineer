import { ToolInvocation } from "ai";
import { Check, Loader2, X } from "lucide-react";
import { DocumentListToolCard, DocumentToolCard, DocumentTypesToolCard } from "./documents/DocumentCards";
import { GitHubToolCard } from "./github/GitHubToolCard";
import { ArrayToolDisplay } from "./primitive/ArrayToolDisplay";
import { DeleteToolDisplay } from "./primitive/DeleteToolDisplay";
import { QueryToolDisplay } from "./primitive/QueryToolDisplay";
import { WriteToolDisplay } from "./primitive/WriteToolDisplay";

interface ToolCallProps {
	toolCall: ToolInvocation;
	addToolResult?: (params: { toolCallId: string; result: any; }) => void;
}

/**
 * A unified component for displaying tool calls of any type
 * Routes to specialized components for rich UIs or renders simple notifications
 */
export const ToolDisplay = ({ toolCall, addToolResult }: ToolCallProps) => {
	console.log('toolCall', toolCall);
	const { toolName } = toolCall;

	// First, try to route to specialized rich UI components based on tool name
	// Document tools - rich UI with expandable content
	if (toolName === 'getRelatedDocument' || toolName === 'getReferencedDocuments') {
		return <DocumentToolCard toolInvocation={toolCall} />;
	}

	if (toolName === 'getAllDocumentTypes') {
		return <DocumentTypesToolCard toolInvocation={toolCall} />;
	}

	if (toolName === 'listDocumentsByType' || toolName === 'queryTool' || toolName === 'query') {
		return <DocumentListToolCard toolInvocation={toolCall} />;
	}

	// GitHub tools - specialized card for repository data
	if (toolName === 'getRepositoryDetails' || toolName === 'getGitHubRepository') {
		return <GitHubToolCard toolInvocation={toolCall} />;
	}

	// Primitive tools - rich card UIs for data operations
	if (toolName === 'write' || toolName === 'writeField') {
		return <WriteToolDisplay toolInvocation={toolCall} />;
	}

	if (toolName === 'delete' || toolName === 'deleteField') {
		return <DeleteToolDisplay toolInvocation={toolCall} />;
	}

	if (toolName === 'array' || toolName === 'addToArray' || toolName === 'removeFromArray') {
		return <ArrayToolDisplay toolInvocation={toolCall} />;
	}

	if (toolName === 'query') {
		return <QueryToolDisplay toolInvocation={toolCall} />;
	}

	// Fallback to simple notification for other tools
	return <SimpleNotification toolCall={toolCall} />;
};

/**
 * Simple notification component for tools that don't need rich UI
 */
// Tool invocations are either tool calls or tool results. For each assistant tool call, there is one tool invocation. While the call is in progress, the invocation is a tool call. Once the call is complete, the invocation is a tool result.
const SimpleNotification = ({ toolCall }: { toolCall: ToolInvocation; }) => {
	const { toolName, state, args } = toolCall;


	// Normalize the tool data regardless of format (legacy or new)

	// Loading state (operation in progress)
	if (state === 'partial-call' || state === 'call') {
		return (
			<div className="inline-flex items-center gap-1.5 px-2 py-0.5 my-0.5 text-xs bg-blue-50 border border-blue-100 rounded-md text-blue-700">
				<Loader2 className="h-3 w-3 animate-spin" />
				<span className="text-blue-800 font-medium">{toolName}</span>
			</div>
		);
	}

	// Error state
	if (toolCall.result && !toolCall.result.success) {
		return (
			<div className="inline-flex items-center gap-1.5 px-2 py-0.5 my-0.5 text-xs bg-red-50 border border-red-100 rounded-md text-red-700">
				<X className="h-3 w-3" />
				<span className="text-red-800 font-medium">Failed to call {toolName.toLowerCase()}</span>
				{toolCall.result?.message && (
					<span className="italic text-red-600 ml-1">({toolCall.result.message})</span>
				)}
			</div>
		);
	}

	// Success state
	return (
		<div className="inline-flex items-center gap-1.5 px-2 py-0.5 my-0.5 text-xs bg-emerald-50 border border-emerald-100 rounded-md text-emerald-700">
			<Check className="h-3 w-3" />
			<span className="text-emerald-800 font-medium">Successfully called {toolName.toLowerCase()}</span>
		</div>
	);
};

/**
 * Normalizes tool data from both legacy and new tool formats
 */


export default ToolDisplay; 