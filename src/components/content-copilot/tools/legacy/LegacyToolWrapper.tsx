import { ToolInvocation, ToolInvocationDisplay } from "../index";

interface LegacyToolWrapperProps {
	toolInvocation: ToolInvocation;
	addToolResult?: (result: { toolCallId: string; result: any; }) => void;
}

/**
 * Wrapper component that maps legacy tools to new primitive tools
 * Acts as an adapter to ensure backward compatibility
 */
export const LegacyToolWrapper = ({
	toolInvocation,
	addToolResult
}: LegacyToolWrapperProps) => {
	// Debug incoming tool invocation state
	console.log(`[DEBUG] LegacyToolWrapper received - ToolID: ${toolInvocation.toolCallId}, Tool: ${toolInvocation.toolName}, State: ${toolInvocation.state}`);

	// Map legacy tool names to new primitive tool types
	const mapToNewTool = (legacyToolName: string): string => {
		switch (legacyToolName) {
			case 'writeField':
				return 'write';
			case 'addToArray':
				return 'array';
			case 'removeFromArray':
				return 'delete';
			case 'getRelatedDocument':
			case 'resolveReferences':
			case 'getReferencedDocuments':
			case 'getAllDocumentTypes':
			case 'listDocumentsByType':
				return 'query';
			default:
				return legacyToolName;
		}
	};

	// Transform legacy args into new tool format
	const transformArgs = (legacyToolName: string, args: any): any => {
		switch (legacyToolName) {
			case 'writeField':
				return {
					documentId: args.documentId,
					path: args.fieldPath,
					value: args.value
				};
			case 'addToArray':
				return {
					documentId: args.documentId,
					path: args.arrayPath,
					operation: 'append',
					items: Array.isArray(args.item) ? args.item : [args.item]
				};
			case 'removeFromArray':
				return {
					documentId: args.documentId,
					path: args.arrayPath,
					// If it's a key removal
					...(args.itemKey ? {
						at: args.itemKey
					} : {})
				};
			case 'getRelatedDocument':
				return {
					id: args.documentId,
					type: null
				};
			case 'resolveReferences':
				return {
					id: args.documentId,
					type: null,
					projection: args.referenceFields?.join(',')
				};
			case 'getReferencedDocuments':
				return {
					id: args.documentId,
					type: null,
					field: args.referenceField,
					projection: args.includeFields?.join(',')
				};
			case 'getAllDocumentTypes':
				return {
					// Default query for types
				};
			case 'listDocumentsByType':
				return {
					type: args.documentType,
					limit: args.limit,
					offset: args.offset || 0,
					filter: args.filter,
					// Use orderBy as a GROQ fragment
					groq: args.orderBy ? `*[_type == "${args.documentType}"] | order(${args.orderBy})` : null
				};
			default:
				return args;
		}
	};

	// Transform legacy result into new format if needed
	const transformResult = (legacyToolName: string, result: any, args: any): any => {
		// If result is null or not successful, return as is
		if (!result || !result.success) {
			return result;
		}

		switch (legacyToolName) {
			case 'writeField':
				return {
					...result,
					path: result.fieldPath || result.path,
					previousValue: result.originalValue,
					newValue: result.value
				};
			case 'addToArray':
				return {
					...result,
					path: result.arrayPath || result.path,
					operation: 'append',
					itemsAffected: Array.isArray(result.item) ? result.item.length : 1,
					items: Array.isArray(result.item) ? result.item : [result.item]
				};
			case 'removeFromArray':
				return {
					...result,
					path: result.arrayPath || result.path,
					operation: 'remove',
					itemsAffected: 1,
					deletedValue: result.item || result.itemKey
				};
			case 'getRelatedDocument':
			case 'resolveReferences':
				return {
					...result,
					count: result.document ? 1 : 0,
					results: result.document ? [result.document] : []
				};
			case 'getReferencedDocuments':
				return {
					...result,
					count: result.documents?.length || 0,
					results: result.documents || []
				};
			case 'getAllDocumentTypes':
				return {
					...result,
					count: result.types?.length || 0,
					results: result.types || []
				};
			case 'listDocumentsByType':
				return {
					...result,
					count: result.documents?.length || 0,
					results: result.documents || [],
					pagination: result.pagination || {
						offset: args.offset || 0,
						limit: args.limit || 100,
						hasMore: (result.documents?.length || 0) === (args.limit || 100)
					}
				};
			default:
				return result;
		}
	};

	// Make a copy of the tool invocation to avoid mutating the original
	const mappedToolInvocation = {
		...toolInvocation,
		toolName: mapToNewTool(toolInvocation.toolName),
		args: transformArgs(toolInvocation.toolName, toolInvocation.args || {}),
		// Transform result if it exists
		...(toolInvocation.result && {
			result: transformResult(
				toolInvocation.toolName,
				toolInvocation.result,
				toolInvocation.args || {}
			)
		})
	};

	// Debug: Ensure state is correctly passed through
	console.log(`[DEBUG] LegacyToolWrapper mapped - Original state: ${toolInvocation.state}, Mapped state: ${mappedToolInvocation.state}`);

	// Pass to standard tool display component with transformed data
	return <ToolInvocationDisplay toolInvocation={mappedToolInvocation} addToolResult={addToolResult} />;
}; 