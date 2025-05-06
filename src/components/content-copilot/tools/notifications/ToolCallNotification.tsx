import { Check, Loader2, Minus, Pencil, Plus, X } from "lucide-react";
import { ToolInvocation } from "../index";

interface ToolCallNotificationProps {
	toolInvocation: ToolInvocation;
}

/**
 * A compact notification component for tool calls
 * Works for all document editing tools (write, delete, array operations)
 */
export const ToolCallNotification = ({ toolInvocation }: ToolCallNotificationProps) => {
	const { toolName, state, args, result } = toolInvocation;

	// Define tool-specific properties
	const getToolDetails = () => {
		switch (toolName) {
			case 'writeField':
			case 'write':
				return {
					icon: Pencil,
					fieldName: args.fieldPath || args.path || result?.fieldPath || result?.path,
					action: 'Updated',
					value: args.value || result?.value
				};
			case 'addToArray':
			case 'array':
				// Check if this is an append/prepend operation
				if (args.operation === 'append' || args.operation === 'prepend' || args.operation === 'insert' || !args.operation) {
					return {
						icon: Plus,
						fieldName: args.arrayPath || args.path || result?.arrayPath || result?.path,
						action: 'Added to',
						value: args.item || args.items || result?.item || result?.items
					};
				} else {
					return {
						icon: Pencil,
						fieldName: args.arrayPath || args.path || result?.arrayPath || result?.path,
						action: `${args.operation || 'Updated'} in`,
						value: null
					};
				}
			case 'removeFromArray':
			case 'delete':
				return {
					icon: Minus,
					fieldName: args.arrayPath || args.path || result?.arrayPath || result?.path,
					action: 'Removed from',
					value: args.itemKey || args.at || result?.itemKey || result?.at
				};
			default:
				return {
					icon: Pencil,
					fieldName: args.path || 'document',
					action: 'Modified',
					value: null
				};
		}
	};

	const { icon: Icon, fieldName, action, value } = getToolDetails();

	if (state === 'partial-call' || state === 'call') {
		return (
			<div className="inline-flex items-center gap-1.5 px-2 py-0.5 my-0.5 text-xs bg-blue-50 border border-blue-100 rounded-md text-blue-700">
				<Loader2 className="h-3 w-3 animate-spin" />
				<span className="text-blue-800 font-medium">{action} {fieldName}</span>
			</div>
		);
	}

	if (!result || !result.success) {
		return (
			<div className="inline-flex items-center gap-1.5 px-2 py-0.5 my-0.5 text-xs bg-red-50 border border-red-100 rounded-md text-red-700">
				<X className="h-3 w-3" />
				<span className="text-red-800 font-medium">Failed to {action.toLowerCase()} {fieldName}</span>
				{result?.suggestion && (
					<span className="italic text-red-600 ml-1">({result.suggestion})</span>
				)}
			</div>
		);
	}

	return (
		<div className="inline-flex items-center gap-1.5 px-2 py-0.5 my-0.5 text-xs bg-emerald-50 border border-emerald-100 rounded-md text-emerald-700">
			<Check className="h-3 w-3" />
			<span className="text-emerald-800 font-medium">{action} {fieldName}</span>
			<Icon className="h-3 w-3 ml-0.5 text-emerald-600" />
		</div>
	);
}; 