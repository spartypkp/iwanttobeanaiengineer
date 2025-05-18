import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
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

// Format simple values for display (used by ObjectDisplay and displayFullValueForHover)
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

// Get appropriate class for a value type (used by ObjectDisplay and displayFullValueForHover)
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

// Helper to display full values in HoverCard
const displayFullValueForHover = (val: any, isNested: boolean = false) => {
	if (val === null || val === undefined) {
		const { value: formattedSimpleValue, type } = formatSimpleValue(val);
		return <span className={`${getTypeClass(type)}`}>{formattedSimpleValue}</span>;
	}
	if (typeof val === 'object') {
		return (
			<div className={`max-h-32 overflow-y-auto bg-slate-50 p-1.5 rounded border border-slate-200 font-mono text-xs ${isNested ? 'mt-0' : 'mt-0.5'}`}>
				<pre className="whitespace-pre-wrap break-all text-black">
					{JSON.stringify(val, null, 2)}
				</pre>
			</div>
		);
	}
	const { value: formattedSimpleValue, type } = formatSimpleValue(val);
	return <span className={`${getTypeClass(type)} break-words`}>{formattedSimpleValue}</span>;
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
	let items: any[] = [];
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

	// Destructure config ONCE with unique names
	const { icon: CfgOpIcon, color: cfgOpColor, label: cfgOpLabel, description: cfgOpDescription } = getOperationConfig();

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
		return classes[type][cfgOpColor as keyof typeof classes[typeof type]] || classes[type].slate;
	};

	const compactViewBorderColorClass = (() => {
		const borderColors = { blue: 'border-blue-500', indigo: 'border-indigo-500', amber: 'border-amber-500', violet: 'border-violet-500', slate: 'border-slate-500' };
		return borderColors[cfgOpColor as keyof typeof borderColors] || borderColors.slate;
	})();

	const themedTextColorClass = getColorClass('text');
	const themedBgColorClass = getColorClass('bg');
	const themedBadgeBorderClass = `border-${cfgOpColor}-200`;

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
											<Badge variant="outline" className="text-[10px] h-4 py-0 px-1 font-mono bg-slate-50 border-slate-300">
												{key}
											</Badge>
										) : (
											<span className="font-mono">{key}:</span>
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
				return isArray ? `[Array: ${size} items]` : `{Object: ${size} props}`;
			} catch (e) {
				return '[Complex Object]';
			}
		}

		const stringVal = String(val);
		return stringVal.length > 35 // Reduced length for very brief display
			? stringVal.substring(0, 32) + '...'
			: stringVal;
	};

	// Only render loading state if we don't have a result
	if (state === 'partial-call' || state === 'call') {
		return (
			<Card className={`w-full border bg-white text-black ${getColorClass('border')} shadow-sm`}>
				<CardHeader className={`${themedBgColorClass} py-2`}>
					<div className="flex items-center justify-between">
						<CardTitle className={`text-sm font-medium ${themedTextColorClass}`}>
							<span className="flex items-center gap-1.5">
								<Loader2 className="h-3.5 w-3.5 animate-spin" />
								Array Operation
								<span className="text-xs font-normal opacity-80 ml-1">{path.split('.').pop()}</span>
							</span>
						</CardTitle>
						<Badge variant="outline" className={`${themedBgColorClass} ${themedTextColorClass} ${themedBadgeBorderClass}`}>
							{operation}
						</Badge>
					</div>
				</CardHeader>
				<CardContent className="p-3 bg-white text-black">
					<div className="text-xs">{cfgOpDescription}</div>
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

	if (!expanded) {
		return (
			<HoverCard openDelay={200} closeDelay={100}>
				<HoverCardTrigger asChild>
					<div
						className={`my-0.5 flex items-center gap-1.5 px-2.5 py-1.5 text-xs border border-slate-200 bg-white hover:bg-slate-50 rounded-md cursor-pointer shadow-sm border-l-4 ${compactViewBorderColorClass}`}
						onClick={() => setExpanded(true)}
						role="button" tabIndex={0} aria-expanded="false"
						aria-label={`${cfgOpLabel} operation on ${path.split('.').pop()}, click to expand`}
					>
						<Check className={`h-3.5 w-3.5 ${themedTextColorClass}`} />
						<CfgOpIcon className={`h-3.5 w-3.5 ${themedTextColorClass}`} />
						<span className="font-medium text-slate-800">
							<span className={`font-semibold ${themedTextColorClass}`}>{cfgOpLabel}</span>: <span className="font-semibold text-slate-800 font-mono">{path.split('.').pop()}</span>
						</span>
						{itemsAffected > 0 && (
							<Badge variant="outline" className={`px-1.5 py-0 text-[10px] ${themedBgColorClass} ${themedTextColorClass} ${themedBadgeBorderClass}`}>
								{itemsAffected} {(itemsAffected === 1 && hasArrayItems) ? 'item' : 'items'}
							</Badge>
						)}
						<span className="flex-grow"></span>
						<ChevronDown className="h-3.5 w-3.5 text-slate-500" />
					</div>
				</HoverCardTrigger>
				<HoverCardContent className="w-auto max-w-xl p-3 text-xs bg-white border border-slate-200 shadow-xl rounded-lg" side="top" align="start">
					<div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 items-start">
						<span className="font-semibold text-slate-600">Operation:</span>
						<span className={`font-medium ${themedTextColorClass}`}>{cfgOpLabel}</span>

						<span className="font-semibold text-slate-600">Path:</span>
						<code className="text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded text-xs break-all font-mono">
							{path}
						</code>

						<span className="font-semibold text-slate-600 self-start">Details:</span>
						<span className="text-slate-700 break-words">{cfgOpDescription}</span>

						{itemsAffected > 0 && (
							<>
								<span className="font-semibold text-slate-600">Modified:</span>
								<span className={`font-medium ${themedTextColorClass} font-mono`}>{itemsAffected}</span>
							</>
						)}
						{newLength !== undefined && (
							<>
								<span className="font-semibold text-slate-600">New Length:</span>
								<span className="text-slate-800 font-mono">{newLength}</span>
							</>
						)}
						{hasArrayItems && items.length > 0 && (
							<>
								<span className="font-semibold text-slate-600 col-span-2 pt-1.5 border-t border-slate-200 mt-1">Preview Items ({Math.min(items.length, 3)} of {items.length}):</span>
								{items.slice(0, 3).map((item: any, i: number) => (
									<div key={i} className="col-span-2 pl-2 text-[11px]">
										{displayFullValueForHover(item, true)}
									</div>
								))}
								{items.length > 3 && (
									<span className="col-span-2 pl-2 text-slate-500 italic text-[11px]">
										+ {items.length - 3} more items...
									</span>
								)}
							</>
						)}
					</div>
				</HoverCardContent>
			</HoverCard>
		);
	}

	return (
		<Card
			className={`w-full border bg-white text-black ${getColorClass('border')} shadow-lg my-0.5`}
			role="region" aria-expanded={true}
		>
			<CardHeader
				className={`${themedBgColorClass} py-2 cursor-pointer`}
				onClick={() => setExpanded(false)}
			>
				<div className="flex items-center justify-between">
					<CardTitle className={`text-sm font-medium ${themedTextColorClass}`}>
						<span className="flex items-center gap-1.5">
							<Check className="h-3.5 w-3.5" />
							<CfgOpIcon className="h-3.5 w-3.5" />
							{cfgOpLabel}
							<span className="text-xs ml-1 font-mono opacity-90">{formattedPath}</span>
						</span>
					</CardTitle>
					<div className="flex items-center gap-2">
						{newLength !== undefined && (
							<Badge className={`${themedBgColorClass} ${themedTextColorClass} ${themedBadgeBorderClass} text-xs py-0`}>
								{newLength} items
							</Badge>
						)}
						<button
							onClick={(e) => { e.stopPropagation(); setExpanded(false); }}
							className={`flex items-center justify-center h-5 w-5 rounded-full bg-${cfgOpColor}-100 ${themedTextColorClass}`}
							aria-label="Collapse details"
						>
							<ChevronUp className="h-3 w-3" />
						</button>
					</div>
				</div>
			</CardHeader>
			<CardContent className="p-3 bg-white text-black">
				<div className="flex flex-col space-y-2">
					<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-y-1.5">
						<div className="text-xs text-slate-600 font-medium">{cfgOpDescription}</div>
						{itemsAffected > 0 && (
							<div className="text-xs inline-flex items-center px-2 py-1 rounded-full bg-slate-100">
								<span className="mr-1">Modified:</span>
								<span className={`${themedTextColorClass} font-medium font-mono`}>{itemsAffected} item{itemsAffected !== 1 ? 's' : ''}</span>
							</div>
						)}
					</div>
					{hasArrayItems && (
						<div className="mt-2">
							<div className="text-xs font-medium text-slate-700 mb-2">Items ({items.length}):</div>
							<div className="rounded-md border border-slate-200 bg-slate-50 p-3 text-xs">
								<ObjectDisplay value={items} keyPath="items-expanded" isTopLevel={true} />
							</div>
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
}; 