import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ToolInvocation } from "ai";
import { Check, ChevronDown, ChevronUp, List, ListPlus, Loader2, Minus, Plus, RefreshCw, Trash2 } from "lucide-react";
import { useState } from "react";

interface ArrayToolDisplayProps {
	toolInvocation: ToolInvocation;
	addToolResult?: (result: { toolCallId: string; result: any; }) => void;
}

// Define a type that extends ToolInvocation to include the result property
type ToolInvocationWithResult = ToolInvocation & {
	result?: {
		itemsAffected?: number;
		arrayLengthAfter?: number;
		[key: string]: any;
	};
};

/**
 * Component that renders an array tool invocation
 * Handles all array operations (append, prepend, insert, remove, replace)
 */
export const ArrayToolDisplay = ({ toolInvocation }: ArrayToolDisplayProps) => {
	// Cast to our extended type that includes result
	const typedToolInvocation = toolInvocation as ToolInvocationWithResult;
	const { state, args, toolName } = typedToolInvocation;
	const [expanded, setExpanded] = useState(false);
	const [objectExpanded, setObjectExpanded] = useState<Record<string, boolean>>({});

	// Extract arguments based on tool type (legacy or new)
	let operation = '';
	let path = '';
	let items = [];
	let at: string | number | undefined;
	let position: string | undefined;

	// Handle legacy tools
	if (toolName === 'addToArray') {
		operation = 'append';
		path = args.arrayPath;
		items = [args.item];
	} else if (toolName === 'removeFromArray') {
		operation = 'remove';
		path = args.arrayPath;
		at = args.itemKey;
	} else {
		// Handle improved array tool
		operation = args.operation;
		path = args.path;
		items = args.items || [];
		at = args.at;
		position = args.position;
	}

	// Get operation details for display
	const getOperationConfig = () => {
		switch (operation) {
			case 'append':
				return {
					icon: ListPlus,
					color: 'blue',
					label: 'Append',
					description: items.length === 1
						? `Adding item to the end of array`
						: `Adding ${items.length} items to the end of array`
				};
			case 'prepend':
				return {
					icon: ListPlus,
					color: 'blue',
					label: 'Prepend',
					description: items.length === 1
						? `Adding item to the beginning of array`
						: `Adding ${items.length} items to the beginning of array`
				};
			case 'insert':
				return {
					icon: ListPlus,
					color: 'indigo',
					label: 'Insert',
					description: items.length === 1
						? `Inserting item ${position || 'after'} position ${at}`
						: `Inserting ${items.length} items ${position || 'after'} position ${at}`
				};
			case 'remove':
				return {
					icon: Trash2,
					color: 'amber',
					label: 'Remove',
					description: `Removing item at position ${at}`
				};
			case 'replace':
				return {
					icon: RefreshCw,
					color: 'violet',
					label: 'Replace',
					description: items.length === 1
						? `Replacing item at position ${at}`
						: `Replacing item at position ${at} with ${items.length} items`
				};
			default:
				return {
					icon: List,
					color: 'slate',
					label: 'Array Op',
					description: 'Modifying array'
				};
		}
	};

	const { icon: OpIcon, color, label, description } = getOperationConfig();

	// Helper for coloring based on operation
	const getColorClass = (type: 'bg' | 'border' | 'text') => {
		const classes = {
			bg: {
				blue: 'bg-blue-50',
				indigo: 'bg-indigo-50',
				amber: 'bg-amber-50',
				violet: 'bg-violet-50',
				slate: 'bg-slate-50',
			},
			border: {
				blue: 'border-blue-100',
				indigo: 'border-indigo-100',
				amber: 'border-amber-100',
				violet: 'border-violet-100',
				slate: 'border-slate-100',
			},
			text: {
				blue: 'text-blue-700',
				indigo: 'text-indigo-700',
				amber: 'text-amber-700',
				violet: 'text-violet-700',
				slate: 'text-slate-700',
			}
		};
		return classes[type][color as keyof typeof classes[typeof type]] || classes[type].slate;
	};

	// Toggle expansion for a specific object key path
	const toggleObjectKey = (keyPath: string, e?: React.MouseEvent) => {
		e?.stopPropagation();
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
			case 'string': return 'text-green-600 font-mono';
			case 'number': return 'text-blue-600 font-mono';
			case 'boolean': return 'text-purple-600 font-mono';
			case 'null':
			case 'undefined': return 'text-gray-500 font-mono italic';
			default: return 'text-black font-mono';
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
			return <span className="font-mono text-gray-500">{isArray ? '[]' : '{}'}</span>;
		}

		const isExpanded = isTopLevel ? expanded : objectExpanded[keyPath] || false;

		if (!isExpanded && !isTopLevel) {
			// Collapsed preview for objects
			return (
				<div className="inline-flex items-center">
					<button
						onClick={(e) => toggleObjectKey(keyPath, e)}
						className="inline-flex items-center space-x-1 hover:bg-slate-100 rounded px-1.5 py-0.5 text-xs border border-slate-200"
					>
						<Plus className="h-3 w-3 text-slate-500" />
						<span className="font-mono">
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
			<div className={`${isTopLevel ? '' : 'pl-4 border-l border-slate-200 ml-1'}`}>
				{!isTopLevel && (
					<button
						onClick={(e) => toggleObjectKey(keyPath, e)}
						className="inline-flex items-center hover:bg-slate-100 rounded px-1.5 py-0.5 text-xs mb-1.5 border border-slate-200"
					>
						<Minus className="h-3 w-3 text-slate-500 mr-1" />
						<span className="font-mono">
							{isArray
								? `Array(${keys.length})`
								: `Object{${keys.length}}`}
						</span>
					</button>
				)}
				<div className="space-y-1.5">
					{keys.map((key, index) => {
						const childValue = value[key];
						const childKeyPath = keyPath ? `${keyPath}.${key}` : key.toString();
						const isChildExpandable = isExpandableValue(childValue);

						return (
							<div key={childKeyPath} className={`${index === keys.length - 1 ? '' : 'mb-1.5'}`}>
								<div className="flex items-start">
									<span className="text-slate-500 mr-2 font-mono">
										{isArray ? (
											<Badge variant="outline" className="text-[10px] h-4 py-0 px-1 font-mono bg-slate-50">
												{key}
											</Badge>
										) : (
											<span>{key}:</span>
										)}
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

	// Only render loading state if we don't have a result
	if (state === 'partial-call' || state === 'call') {
		return (
			<Card className={`w-full border bg-white text-black ${getColorClass('border')} shadow-sm hover:shadow-md transition-all duration-200`}>
				<CardHeader className={`${getColorClass('bg')} py-2`}>
					<div className="flex items-center justify-between">
						<CardTitle className={`text-sm font-medium ${getColorClass('text')}`}>
							<span className="flex items-center gap-1.5">
								<Loader2 className="h-3.5 w-3.5 animate-spin" />
								Array Operation
								<span className="text-xs font-normal opacity-80">
									{path.split('.').pop()}
								</span>
							</span>
						</CardTitle>
						<Badge variant="outline" className={`${getColorClass('bg')} ${getColorClass('text')} border-${color}-200`}>
							{operation}
						</Badge>
					</div>
				</CardHeader>
				<CardContent className="p-3 bg-white text-black">
					<div className="text-xs">{description}</div>
				</CardContent>
			</Card>
		);
	}

	// Result details
	const itemsAffected = typedToolInvocation.result?.itemsAffected || items.length;
	const newLength = typedToolInvocation.result?.arrayLengthAfter;
	const hasArrayItems = items && items.length > 0 &&
		(operation === 'append' || operation === 'prepend' ||
			operation === 'insert' || operation === 'replace');

	// Format array path for better readability
	const formattedPath = path.split('.').map((segment, i, arr) =>
		i === arr.length - 1 ?
			<span key={i} className="font-semibold">{segment}</span> :
			<span key={i}>{segment}.</span>
	);

	return (
		<Card
			className={`w-full border bg-white text-black ${getColorClass('border')} shadow-sm hover:shadow-md transition-all duration-200`}
			role="region"
			aria-expanded={expanded}
		>
			<CardHeader
				className={`${getColorClass('bg')} py-2 ${hasArrayItems ? 'cursor-pointer' : ''}`}
				onClick={() => hasArrayItems && setExpanded(!expanded)}
			>
				<div className="flex items-center justify-between">
					<CardTitle className={`text-sm font-medium ${getColorClass('text')}`}>
						<span className="flex items-center gap-1.5">
							<Check className="h-3.5 w-3.5" />
							<OpIcon className="h-3.5 w-3.5" />
							{label}
							<span className="text-xs ml-1 font-mono opacity-90">
								{formattedPath}
							</span>
						</span>
					</CardTitle>
					<div className="flex items-center gap-2">
						{newLength !== undefined && (
							<Badge className={`${getColorClass('bg')} ${getColorClass('text')} border-${color}-200 text-xs py-0`}>
								{newLength} items
							</Badge>
						)}
						{hasArrayItems && (
							<button
								onClick={(e) => {
									e.stopPropagation();
									setExpanded(!expanded);
								}}
								className={`flex items-center justify-center h-5 w-5 rounded-full bg-${color}-100 ${getColorClass('text')}`}
							>
								{expanded ?
									<ChevronUp className="h-3 w-3" /> :
									<ChevronDown className="h-3 w-3" />
								}
							</button>
						)}
					</div>
				</div>
			</CardHeader>
			<CardContent className="p-3 bg-white text-black">
				<div className="flex flex-col space-y-2">
					{/* Description and status info */}
					<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-y-1.5">
						<div className="text-xs text-slate-600 font-medium">{description}</div>
						{itemsAffected && (
							<div className="text-xs inline-flex items-center px-2 py-1 rounded-full bg-slate-100">
								<span className="mr-1">Modified:</span>
								<span className={`${getColorClass('text')} font-medium`}>
									{itemsAffected} item{itemsAffected !== 1 ? 's' : ''}
								</span>
							</div>
						)}
					</div>

					{/* Preview when collapsed */}
					{hasArrayItems && !expanded && items.length > 0 && (
						<div className="mt-2">
							<div className="flex flex-col">
								<div className="text-xs font-medium mb-1 text-slate-700">Value{items.length !== 1 ? 's' : ''}:</div>
								<div className="rounded-md bg-slate-50 p-2 border border-slate-200 font-mono text-sm overflow-x-auto">
									{items.length <= 3 ? (
										<div className="flex flex-wrap gap-2">
											{items.map((item: any, i: number) => {
												const { value, type } = formatSimpleValue(item);
												return (
													<div key={i} className="flex items-center">
														<Badge variant="outline" className="h-5 mr-1.5 bg-slate-100 font-mono text-slate-500">{i}</Badge>
														<span className={getTypeClass(type)}>
															{value}
														</span>
														{i < items.length - 1 && <span className="mx-1 text-slate-400">,</span>}
													</div>
												);
											})}
										</div>
									) : (
										<div className="flex flex-col gap-1.5">
											<div className="flex items-center">
												<Badge variant="outline" className="h-5 mr-1.5 bg-slate-100 font-mono text-slate-500">0</Badge>
												<span className={getTypeClass(typeof items[0])}>
													{formatSimpleValue(items[0]).value}
												</span>
											</div>
											<div className="text-center text-slate-500 text-xs py-1">• • •</div>
											<div className="flex items-center">
												<Badge variant="outline" className="h-5 mr-1.5 bg-slate-100 font-mono text-slate-500">{items.length - 1}</Badge>
												<span className={getTypeClass(typeof items[items.length - 1])}>
													{formatSimpleValue(items[items.length - 1]).value}
												</span>
											</div>
											<div className="text-xs mt-1 text-slate-500">
												<span className="font-medium">{items.length}</span> items total
											</div>
										</div>
									)}
								</div>
							</div>
						</div>
					)}

					{/* Expanded view with object explorer */}
					{hasArrayItems && expanded && (
						<div className="mt-2">
							<div className="flex justify-between items-center mb-2">
								<div className="text-xs font-medium text-slate-700">Items:</div>
								<button
									onClick={() => setExpanded(false)}
									className="text-xs text-slate-500 hover:text-slate-700 flex items-center gap-1"
								>
									<ChevronUp className="h-3 w-3" />
									<span>Collapse</span>
								</button>
							</div>
							<div className="rounded-md border border-slate-200 bg-slate-50 p-3 text-xs">
								<ObjectDisplay
									value={items}
									keyPath="items"
									isTopLevel={true}
								/>
							</div>
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
}; 