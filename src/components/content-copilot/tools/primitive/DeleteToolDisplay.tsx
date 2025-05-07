import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ToolInvocation } from "ai";
import { Check, ChevronDown, ChevronUp, Loader2, Minus, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

interface DeleteToolDisplayProps {
	toolInvocation: ToolInvocation;
}

// Define a type that extends ToolInvocation to include the result property
type ToolInvocationWithResult = ToolInvocation & {
	result?: {
		deletedValue?: any;
		[key: string]: any;
	};
};

/**
 * Component that renders a delete tool invocation
 * Handles deleting fields at any path in a document
 */
export const DeleteToolDisplay = ({ toolInvocation }: DeleteToolDisplayProps) => {
	// Cast to our extended type that includes result
	const typedToolInvocation = toolInvocation as ToolInvocationWithResult;
	const { state, args, toolName } = typedToolInvocation;
	const [expanded, setExpanded] = useState(false);
	const [objectExpanded, setObjectExpanded] = useState<Record<string, boolean>>({});

	// Extract arguments based on tool type (legacy or new)
	const isLegacyTool = toolName === 'deleteField';

	// Get field path from arguments based on tool type
	const path = isLegacyTool ? args.fieldPath : args.path;
	const deletedValue = typedToolInvocation.result?.deletedValue;

	// Toggle expansion for a specific object key path
	const toggleObjectKey = (keyPath: string) => {
		setObjectExpanded(prev => ({
			...prev,
			[keyPath]: !prev[keyPath]
		}));
	};

	// Check if a value is expandable (object or array with elements)
	const isExpandableValue = (val: any): boolean => {
		if (val === null || val === undefined) return false;
		if (Array.isArray(val)) return val.length > 0;
		if (typeof val === 'object') return Object.keys(val).length > 0;
		return false;
	};

	// Format simple values for display
	const formatSimpleValue = (val: any): { value: string, type: string; } => {
		if (val === null) return { value: 'null', type: 'null' };
		if (val === undefined) return { value: 'undefined', type: 'undefined' };

		switch (typeof val) {
			case 'string':
				return { value: `"${val}"`, type: 'string' };
			case 'number':
				return { value: val.toString(), type: 'number' };
			case 'boolean':
				return { value: val ? 'true' : 'false', type: 'boolean' };
			default:
				return { value: String(val), type: 'unknown' };
		}
	};

	// Get appropriate class for a value type
	const getTypeClass = (type: string): string => {
		switch (type) {
			case 'string': return 'text-green-600';
			case 'number': return 'text-blue-600';
			case 'boolean': return 'text-purple-600';
			case 'null':
			case 'undefined': return 'text-gray-500';
			default: return 'text-black';
		}
	};

	// Display value with proper formatting and potential expansion
	const ObjectDisplay = ({
		value,
		keyPath = '',
		depth = 0,
		isLast = true,
		isTopLevel = false
	}: {
		value: any,
		keyPath?: string,
		depth?: number,
		isLast?: boolean,
		isTopLevel?: boolean;
	}) => {
		// Early return for primitives
		if (value === null || value === undefined || typeof value !== 'object') {
			const { value: formattedValue, type } = formatSimpleValue(value);
			const typeClass = getTypeClass(type);
			return <span className={typeClass}>{formattedValue}</span>;
		}

		const isArray = Array.isArray(value);
		const keys = isArray ? [...Array(value.length).keys()] : Object.keys(value);

		// If empty object or array, render simple representation
		if (keys.length === 0) {
			return <span>{isArray ? '[]' : '{}'}</span>;
		}

		const isExpanded = isTopLevel ? expanded : objectExpanded[keyPath] || false;

		if (!isExpanded && !isTopLevel) {
			// Collapsed preview for objects
			return (
				<div className="inline-flex items-center group">
					<button
						onClick={(e) => {
							e.stopPropagation();
							toggleObjectKey(keyPath);
						}}
						className="inline-flex items-center space-x-1 hover:bg-slate-100 rounded px-1 text-xs"
					>
						<Plus className="h-3 w-3 text-slate-500" />
						<span>
							{isArray
								? `Array(${keys.length})`
								: `Object{${keys.length}}`}
						</span>
					</button>
				</div>
			);
		}

		// Full expanded view
		return (
			<div className={`${isTopLevel ? '' : 'pl-4 border-l border-slate-200'}`}>
				{!isTopLevel && (
					<button
						onClick={(e) => {
							e.stopPropagation();
							toggleObjectKey(keyPath);
						}}
						className="inline-flex items-center hover:bg-slate-100 rounded px-1 mb-1 text-xs"
					>
						<Minus className="h-3 w-3 text-slate-500 mr-1" />
						<span>
							{isArray
								? `Array(${keys.length})`
								: `Object{${keys.length}}`}
						</span>
					</button>
				)}
				<div className="space-y-1">
					{keys.map((key, index) => {
						const childValue = value[key];
						const childKeyPath = keyPath ? `${keyPath}.${key}` : key.toString();
						const isChildExpandable = isExpandableValue(childValue);

						return (
							<div key={childKeyPath} className={`${index === keys.length - 1 ? '' : 'mb-1'}`}>
								<div className="flex items-start">
									<span className="text-slate-500 mr-2">
										{isArray ? '' : <span className="mr-1">{key}:</span>}
									</span>
									{isChildExpandable ? (
										<ObjectDisplay
											value={childValue}
											keyPath={childKeyPath}
											depth={depth + 1}
											isLast={index === keys.length - 1}
										/>
									) : (
										<ObjectDisplay value={childValue} />
									)}
								</div>
							</div>
						);
					})}
				</div>
			</div>
		);
	};

	// Format value for brief display (truncate if needed)
	const formatBriefValue = (val: any): string => {
		if (val === undefined || val === null) return String(val);
		if (typeof val === 'object') {
			try {
				const isArray = Array.isArray(val);
				const size = isArray ? val.length : Object.keys(val).length;
				return isArray ? `[Array: ${size} items]` : `{Object: ${size} properties}`;
			} catch (e) {
				return '[Complex Object]';
			}
		}

		const stringVal = String(val);
		return stringVal.length > 50
			? stringVal.substring(0, 47) + '...'
			: stringVal;
	};

	// Loading state
	if (state === 'partial-call' || state === 'call') {
		return (
			<Card className="w-full border bg-white text-black border-amber-100 shadow-sm hover:shadow-md transition-all duration-200">
				<CardHeader className="bg-amber-50 py-2">
					<div className="flex items-center justify-between">
						<CardTitle className="text-sm font-medium text-amber-700">
							<span className="flex items-center gap-1">
								<Loader2 className="h-3.5 w-3.5 animate-spin" />
								Deleting Data
							</span>
						</CardTitle>
						<Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-200">
							{toolName}
						</Badge>
					</div>
				</CardHeader>
				<CardContent className="p-3 bg-white text-black">
					<div className="space-y-2">
						<div className="flex items-start gap-2">
							<span className="text-xs font-semibold text-black">Path:</span>
							<code className="text-xs rounded bg-slate-100 px-1 py-0.5 text-black">
								{path}
							</code>
						</div>
					</div>
				</CardContent>
			</Card>
		);
	}

	// Success state
	return (
		<Card
			className="w-full border bg-white text-black border-amber-100 shadow-sm hover:shadow-md transition-all duration-200"
			role="region"
			aria-expanded={expanded}
		>
			<CardHeader
				className="bg-amber-50 py-2 cursor-pointer"
				onClick={() => setExpanded(!expanded)}
			>
				<div className="flex items-center justify-between">
					<CardTitle className="text-sm font-medium text-amber-700">
						<span className="flex items-center gap-1">
							<Check className="h-3.5 w-3.5" />
							<Trash2 className="h-3.5 w-3.5 ml-0.5" />
							Content Deleted
						</span>
					</CardTitle>
					<div className="flex items-center gap-2">
						<Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-200">
							{toolName}
						</Badge>
						{expanded ?
							<ChevronUp className="h-3.5 w-3.5 text-amber-700" /> :
							<ChevronDown className="h-3.5 w-3.5 text-amber-700" />
						}
					</div>
				</div>
			</CardHeader>
			<CardContent className="p-3 bg-white text-black">
				<div className="space-y-2">
					<div className="flex items-start gap-2">
						<span className="text-xs font-semibold text-black">Path:</span>
						<code className="text-xs rounded bg-slate-100 px-1 py-0.5 text-black">
							{path}
						</code>
					</div>
					{deletedValue && (
						<div className="flex items-start gap-2">
							<span className="text-xs font-semibold text-black">Deleted Value:</span>
							<div className="text-xs rounded bg-slate-100 px-1.5 py-1 text-black break-all max-w-full overflow-x-auto">
								{isExpandableValue(deletedValue) ? (
									<ObjectDisplay value={deletedValue} keyPath="deleted" isTopLevel={true} />
								) : (
									expanded ? (
										<span className={getTypeClass(typeof deletedValue)}>
											{formatSimpleValue(deletedValue).value}
										</span>
									) : (
										formatBriefValue(deletedValue)
									)
								)}
							</div>
						</div>
					)}
				</div>
			</CardContent>
			{deletedValue && isExpandableValue(deletedValue) && (
				<CardFooter className="p-2 bg-slate-50 border-t border-slate-200 justify-center">
					<button
						onClick={(e) => {
							e.stopPropagation();
							setExpanded(!expanded);
						}}
						className="text-xs text-amber-600 hover:text-amber-800 transition-colors flex items-center gap-1"
					>
						{expanded ? 'Show Less' : 'Show More Details'}
						{expanded ? (
							<ChevronUp className="h-3 w-3" />
						) : (
							<ChevronDown className="h-3 w-3" />
						)}
					</button>
				</CardFooter>
			)}
		</Card>
	);
}; 