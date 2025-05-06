import { Card, CardContent } from "@/components/ui/card";
import {
	ArrayToolDisplay,
	DeleteToolDisplay,
	DocumentListToolCard,
	DocumentToolCard,
	DocumentTypesToolCard,
	GitHubToolCard,
	LegacyToolWrapper,
	QueryToolDisplay,
	ToolInvocation,
	WriteToolDisplay
} from "./index";

// List of legacy tool names
const LEGACY_TOOL_NAMES = [
	'writeField',
	'addToArray',
	'removeFromArray',
	'getRelatedDocument',
	'resolveReferences',
	'getReferencedDocuments',
	'getAllDocumentTypes',
	'listDocumentsByType'
];

interface ToolInvocationDisplayProps {
	toolInvocation: ToolInvocation;
	addToolResult?: (result: { toolCallId: string; result: any; }) => void;
}

/**
 * Component that dispatches to specific tool UI components based on the tool name
 * Handles both legacy and new primitive tools
 */
export const ToolInvocationDisplay = ({ toolInvocation, addToolResult }: ToolInvocationDisplayProps) => {
	// Debug incoming tool invocation
	console.log(`[DEBUG] ToolInvocationDisplay received - Tool: ${toolInvocation.toolName}, State: ${toolInvocation.state}, ID: ${toolInvocation.toolCallId}`);

	// For legacy tools, use the wrapper to map to new primitives
	if (LEGACY_TOOL_NAMES.includes(toolInvocation.toolName)) {
		console.log(`[DEBUG] ToolInvocationDisplay routing to LegacyToolWrapper - Tool: ${toolInvocation.toolName}`);
		return <LegacyToolWrapper toolInvocation={toolInvocation} addToolResult={addToolResult} />;
	}

	// Handle new primitive tools
	console.log(`[DEBUG] ToolInvocationDisplay direct routing - Tool: ${toolInvocation.toolName}, State: ${toolInvocation.state}`);

	switch (toolInvocation.toolName) {
		// Primitive document editing tools
		case 'write':
			return <WriteToolDisplay toolInvocation={toolInvocation} addToolResult={addToolResult} />;
		case 'delete':
			return <DeleteToolDisplay toolInvocation={toolInvocation} addToolResult={addToolResult} />;
		case 'array':
			return <ArrayToolDisplay toolInvocation={toolInvocation} addToolResult={addToolResult} />;
		case 'query':
			return <QueryToolDisplay toolInvocation={toolInvocation} addToolResult={addToolResult} />;

		// GitHub tools - keep as is for now
		case 'getRepositoryDetails':
			return <GitHubToolCard toolInvocation={toolInvocation} />;

		// For backward compatibility with existing components
		// In the future, these could be removed once all tools are migrated
		case 'listDocumentsByType':
			return <DocumentListToolCard toolInvocation={toolInvocation} />;
		case 'getAllDocumentTypes':
			return <DocumentTypesToolCard toolInvocation={toolInvocation} />;
		case 'getRelatedDocument':
		case 'getReferencedDocuments':
			return <DocumentToolCard toolInvocation={toolInvocation} />;

		default:
			// Fallback for any tool we don't have a specific component for
			console.log(`[DEBUG] ToolInvocationDisplay fallback - Unknown tool: ${toolInvocation.toolName}`);
			return (
				<Card className="my-2 border bg-white text-black border-gray-200">
					<CardContent className="p-2 text-xs bg-white text-black">
						<p className="font-semibold text-black">Unknown tool: {toolInvocation.toolName}</p>
					</CardContent>
				</Card>
			);
	}
}; 