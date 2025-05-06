// Export tool interfaces
export interface ToolInvocation {
	toolName: string;
	toolCallId: string;
	state: 'partial-call' | 'call' | 'result';
	args: Record<string, any>;
	result?: any;
}

// Export main components
export { MessagePart } from './MessagePart';
export { ToolInvocationDisplay } from './ToolInvocationDisplay';

// Export legacy tool components
export { DocumentListToolCard, DocumentToolCard, DocumentTypesToolCard } from './documents/DocumentCards';
export { GitHubToolCard } from './github/GitHubToolCard';
export { ToolCallNotification } from './notifications/ToolCallNotification';

// Export new primitive tool components
export { ArrayToolDisplay } from './primitive/ArrayToolDisplay';
export { DeleteToolDisplay } from './primitive/DeleteToolDisplay';
export { QueryToolDisplay } from './primitive/QueryToolDisplay';
export { WriteToolDisplay } from './primitive/WriteToolDisplay';

// Export legacy wrapper component
export { LegacyToolWrapper } from './legacy/LegacyToolWrapper';

