import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { ToolInvocation } from "ai";
import { Check, ChevronDown, ChevronUp, FileEdit, Loader2, Minus, Plus } from "lucide-react";
import { useState } from "react";

interface WriteToolDisplayProps {
	toolInvocation: ToolInvocation;
}

// Define a type that extends ToolInvocation to include the result property
type ToolInvocationWithResult = ToolInvocation & {
	result?: {
		previousValue?: any;
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
const displayFullValueForHover = (val: any) => {
	if (val === null || val === undefined) {
		const { value: formattedSimpleValue, type } = formatSimpleValue(val);
		return <span className={`${getTypeClass(type)}`}>{formattedSimpleValue}</span>;
	}
	if (typeof val === 'object') {
		return (
			<div className="max-h-32 overflow-y-auto bg-slate-50 p-1.5 rounded border border-slate-200 font-mono text-xs mt-0.5">
				<pre className="whitespace-pre-wrap break-all">
					{JSON.stringify(val, null, 2)}
				</pre>
			</div>
		);
	}
	const { value: formattedSimpleValue, type } = formatSimpleValue(val);
	return <span className={`${getTypeClass(type)} break-words`}>{formattedSimpleValue}</span>;
};

/**
 * Component that renders a write field tool invocation
 * Handles writing values to any path in a document
 */
export const WriteToolDisplay = ({ toolInvocation }: WriteToolDisplayProps) => {
	// Cast to our extended type that includes result
	const typedToolInvocation = toolInvocation as ToolInvocationWithResult;
	const { state, args, toolName } = typedToolInvocation;
	const [expanded, setExpanded] = useState(false);
	const [objectExpanded, setObjectExpanded] = useState<Record<string, boolean>>({});

	// Extract arguments based on tool type (legacy or new)
	const isLegacyTool = toolName === 'writeField';

	// Get field path and value from arguments based on tool type
	const path = isLegacyTool ? args.fieldPath : args.path;
	const value = args.value;
	const previousValue = typedToolInvocation.result?.previousValue;

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
				<div className="inline-flex items-center group">
					<button
						onClick={(e) => {
							e.stopPropagation();
							toggleObjectKey(keyPath);
						}}
						className="inline-flex items-center space-x-1 hover:bg-slate-100 rounded px-1 text-xs"
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
						<span className="font-mono">
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
			<Card className="w-full border bg-white text-black border-blue-100 shadow-sm hover:shadow-md transition-all duration-200">
				<CardHeader className="bg-blue-50 py-2">
					<div className="flex items-center justify-between">
						<CardTitle className="text-sm font-medium text-blue-700">
							<span className="flex items-center gap-1">
								<Loader2 className="h-3.5 w-3.5 animate-spin" />
								Writing Field
							</span>
						</CardTitle>
						<Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200">
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

	// For completed operations with results
	if (!expanded) {
		return (
			<HoverCard openDelay={200} closeDelay={100}>
				<HoverCardTrigger asChild>
					<div
						className="my-0.5 flex items-center gap-1.5 px-2.5 py-1.5 text-xs border border-slate-200 bg-white hover:bg-slate-50 rounded-md cursor-pointer shadow-sm border-l-4 border-green-500"
						onClick={() => setExpanded(true)}
						role="button"
						tabIndex={0}
						aria-expanded="false"
						aria-label={`Write operation on ${path.split('.').pop()}, click to expand`}
					>
						<Check className="h-3.5 w-3.5 text-green-700" />
						<FileEdit className="h-3.5 w-3.5 text-green-700" />
						<span className="font-medium text-slate-800">
							Updated: <span className="font-semibold text-green-700">{path.split('.').pop()}</span>
						</span>
						<span className="flex-grow"></span> {/* Spacer */}
						<ChevronDown className="h-3.5 w-3.5 text-slate-500" />
					</div>
				</HoverCardTrigger>
				<HoverCardContent className="w-auto max-w-xl p-3 text-xs bg-white border border-slate-200 shadow-xl rounded-lg" side="top" align="start">
					<div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5">
						<span className="font-semibold text-slate-600">Path:</span>
						<code className="text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded text-xs break-all font-mono">
							{path}
						</code>

						<span className="font-semibold text-slate-600 self-start">New Value:</span>
						<div>{displayFullValueForHover(value)}</div>

						{previousValue !== undefined && (
							<>
								<span className="font-semibold text-slate-600 self-start">Previous:</span>
								<div>{displayFullValueForHover(previousValue)}</div>
							</>
						)}
					</div>
				</HoverCardContent>
			</HoverCard>
		);
	}

	// Expanded view (when expanded is true)
	return (
		<Card
			className="w-full border bg-white text-black border-green-200 shadow-lg transition-all duration-200 my-0.5"
			role="region"
			aria-expanded={true}
		>
			<CardHeader
				className="bg-green-50 py-2 cursor-pointer"
				onClick={() => setExpanded(false)} // Click to collapse
			>
				<div className="flex items-center justify-between">
					<CardTitle className="text-sm font-medium text-green-700">
						<span className="flex items-center gap-1.5">
							<Check className="h-3.5 w-3.5" />
							<FileEdit className="h-3.5 w-3.5" />
							Field Updated
							<span className="text-xs ml-1 font-mono opacity-90">
								{path.split('.').map((segment: string, i: number, arr: string[]) =>
									i === arr.length - 1 ?
										<span key={i} className="font-semibold">{segment}</span> :
										<span key={i}>{segment}.</span>
								)}
							</span>
						</span>
					</CardTitle>
					<div className="flex items-center gap-2">
						<Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
							{toolName}
						</Badge>
						{/* Chevron now indicates collapse */}
						<button
							onClick={(e) => {
								e.stopPropagation();
								setExpanded(false);
							}}
							className="flex items-center justify-center h-5 w-5 rounded-full bg-green-100 text-green-700"
							aria-label="Collapse details"
						>
							<ChevronUp className="h-3.5 w-3.5" />
						</button>
					</div>
				</div>
			</CardHeader>
			<CardContent className="p-3 bg-white text-black">
				<div className="space-y-3">
					<div className="flex items-start gap-2">
						<span className="text-xs font-semibold text-slate-700 min-w-[80px]">Path:</span>
						<code className="text-xs rounded bg-slate-100 px-1.5 py-1 text-slate-800 break-all font-mono">
							{path}
						</code>
					</div>
					<div className="flex items-start gap-2">
						<span className="text-xs font-semibold text-slate-700 min-w-[80px]">New Value:</span>
						<div className="text-xs rounded bg-slate-50 border border-slate-200 p-3 text-black max-w-full overflow-x-auto flex-grow">
							<ObjectDisplay value={value} keyPath={`val-${path}`} isTopLevel={true} />
						</div>
					</div>

					{previousValue !== undefined && (
						<div className="flex items-start gap-2">
							<span className="text-xs font-semibold text-slate-700 min-w-[80px]">Previous:</span>
							<div className="text-xs rounded bg-slate-50 border border-slate-200 p-3 text-black max-w-full overflow-x-auto flex-grow">
								<ObjectDisplay value={previousValue} keyPath={`prev-${path}`} isTopLevel={true} />
							</div>
						</div>
					)}
				</div>
			</CardContent>
			{/* Footer can be removed if expand/collapse is handled by header and compact view */}
			{/* Or keep it if it offers different functionality like "Show full details in modal" etc. */}
			{/* For now, let's remove it to simplify, as the header handles collapse. */}
		</Card>
	);
}; 