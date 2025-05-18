import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { ToolInvocation } from "ai";
import { Check, ChevronDown, ChevronUp, Database, Loader2, Minus, Plus, Search } from "lucide-react";
import { useState } from "react";

interface QueryToolDisplayProps {
	toolInvocation: ToolInvocation;
}

// Define a type that extends ToolInvocation to include the result property
type ToolInvocationWithResult = ToolInvocation & {
	result?: {
		count?: number;
		results?: any[];
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
 * Component that renders a query tool invocation
 * Handles querying and displaying results from the database
 */
export const QueryToolDisplay = ({ toolInvocation }: QueryToolDisplayProps) => {
	// Cast to our extended type that includes result
	const typedToolInvocation = toolInvocation as ToolInvocationWithResult;
	const { state, args, toolName } = typedToolInvocation;
	const [expanded, setExpanded] = useState(false);
	const [objectExpanded, setObjectExpanded] = useState<Record<string, boolean>>({});

	// Get query parameters regardless of legacy or new tool format
	const type = args.type || args.documentType;
	const limit = args.limit || 10;
	const field = args.field;
	const value = args.value;
	const groq = args.groq;

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
	const formatBriefValue = (val: any, maxLength = 50): string => {
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
		return stringVal.length > maxLength
			? stringVal.substring(0, maxLength - 3) + '...'
			: stringVal;
	};

	// Only render loading state if we don't have a result
	if (state === 'partial-call' || state === 'call') {
		return (
			<Card className="w-full border bg-white text-black border-indigo-100 shadow-sm">
				<CardHeader className="bg-indigo-50 py-2">
					<div className="flex items-center justify-between">
						<CardTitle className="text-sm font-medium text-indigo-700">
							<span className="flex items-center gap-1">
								<Loader2 className="h-3.5 w-3.5 animate-spin" />
								Querying Content
							</span>
						</CardTitle>
						<Badge variant="outline" className="bg-indigo-100 text-indigo-700 border-indigo-200">
							{toolName}
						</Badge>
					</div>
				</CardHeader>
				<CardContent className="p-3 bg-white text-black">
					<div className="space-y-1 text-xs">
						{type && (
							<div className="flex items-start gap-2">
								<span className="font-semibold">Type:</span>
								<span>{type}</span>
							</div>
						)}
						{field && (
							<div className="flex items-start gap-2">
								<span className="font-semibold">Field:</span>
								<span>{field}</span>
							</div>
						)}
						{value !== undefined && (
							<div className="flex items-start gap-2">
								<span className="font-semibold">Value:</span>
								<span>{formatBriefValue(value)}</span>
							</div>
						)}
						{groq && (
							<div className="flex items-start gap-2">
								<span className="font-semibold">Query:</span>
								<code className="text-xs rounded bg-slate-100 px-1 py-0.5">
									{formatBriefValue(groq, 40)}
								</code>
							</div>
						)}
						<div className="flex items-start gap-2">
							<span className="font-semibold">Limit:</span>
							<span>{limit}</span>
						</div>
					</div>
				</CardContent>
			</Card>
		);
	}

	// Get results from the completed tool call
	const results = typedToolInvocation.result?.results || [];
	const count = typedToolInvocation.result?.count || results.length || 0;

	// Success state with results
	if (!expanded) {
		return (
			<HoverCard openDelay={200} closeDelay={100}>
				<HoverCardTrigger asChild>
					<div
						className="my-0.5 flex items-center gap-1.5 px-2.5 py-1.5 text-xs border border-slate-200 bg-white hover:bg-slate-50 rounded-md cursor-pointer shadow-sm border-l-4 border-indigo-500"
						onClick={() => setExpanded(true)} role="button" tabIndex={0} aria-expanded="false"
						aria-label={`Query for ${type || 'data'}, ${count} results, click to expand`}
					>
						<Check className="h-3.5 w-3.5 text-indigo-700" />
						<Search className="h-3.5 w-3.5 text-indigo-700" />
						<span className="font-medium text-slate-800">
							Query: <span className="font-semibold text-indigo-700">{type || (groq ? 'GROQ' : 'Data')}</span>
						</span>
						<Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200 text-[10px] px-1.5 py-0">
							{count} {count === 1 ? 'result' : 'results'}
						</Badge>
						<span className="flex-grow"></span>
						<ChevronDown className="h-3.5 w-3.5 text-slate-500" />
					</div>
				</HoverCardTrigger>
				<HoverCardContent className="w-auto max-w-xl p-3 text-xs bg-white border border-slate-200 shadow-xl rounded-lg" side="top" align="start">
					<div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 items-start">
						{type && <>
							<span className="font-semibold text-slate-600">Type:</span>
							<span className="text-slate-800 break-all font-mono">{type}</span>
						</>}
						{field && <>
							<span className="font-semibold text-slate-600">Field:</span>
							<span className="text-slate-800 break-all font-mono">{field}</span>
						</>}
						{value !== undefined &&
							<>
								<span className="font-semibold text-slate-600 self-start">Value:</span>
								<div>{displayFullValueForHover(value)}</div>
							</>
						}
						{groq &&
							<>
								<span className="font-semibold text-slate-600 self-start">Query:</span>
								<code className="text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded text-xs break-all font-mono max-w-[300px] whitespace-pre-wrap">
									{groq}
								</code>
							</>
						}
						<span className="font-semibold text-slate-600">Results:</span>
						<span className="font-semibold text-indigo-700 font-mono">{count}</span>

						<span className="font-semibold text-slate-600">Limit:</span>
						<span className="text-slate-800 font-mono">{limit}</span>
					</div>
				</HoverCardContent>
			</HoverCard>
		);
	}

	return (
		<Card
			className="w-full border bg-white text-black border-indigo-200 shadow-lg my-0.5"
			role="region" aria-expanded={true}
		>
			<CardHeader
				className="bg-indigo-50 py-2 cursor-pointer"
				onClick={() => setExpanded(false)}
			>
				<div className="flex items-center justify-between">
					<CardTitle className="text-sm font-medium text-indigo-700">
						<span className="flex items-center gap-1.5">
							<Check className="h-3.5 w-3.5" />
							<Search className="h-3.5 w-3.5" />
							Query Results
							{type && <span className="text-xs ml-1 font-mono opacity-90 font-semibold">({type})</span>}
						</span>
					</CardTitle>
					<div className="flex items-center gap-2">
						<Badge variant="outline" className="bg-indigo-100 text-indigo-700 border-indigo-200">
							{count} {count === 1 ? 'result' : 'results'}
						</Badge>
						<button
							onClick={(e) => { e.stopPropagation(); setExpanded(false); }}
							className="flex items-center justify-center h-5 w-5 rounded-full bg-indigo-100 text-indigo-700"
							aria-label="Collapse details"
						>
							<ChevronUp className="h-3.5 w-3.5" />
						</button>
					</div>
				</div>
			</CardHeader>
			<CardContent className="p-3 bg-white text-black">
				<div className="space-y-3">
					<div className="space-y-1.5 text-xs">
						{type && <div className="flex items-start"><span className="font-semibold text-slate-700 min-w-[70px]">Type:</span><span className="text-slate-800 font-mono">{type}</span></div>}
						{field && <div className="flex items-start"><span className="font-semibold text-slate-700 min-w-[70px]">Field:</span><span className="text-slate-800 font-mono">{field}</span></div>}
						{value !== undefined && (
							<div className="flex items-start">
								<span className="font-semibold text-slate-700 min-w-[70px] self-start">Value:</span>
								<div className="text-xs rounded bg-slate-50 border border-slate-200 p-3 text-black max-w-full overflow-x-auto flex-grow">
									<ObjectDisplay value={value} keyPath="query-value" isTopLevel={true} />
								</div>
							</div>
						)}
						{groq && (
							<div className="flex items-start mt-1">
								<span className="font-semibold text-slate-700 min-w-[70px] self-start">Query:</span>
								<code className="text-xs rounded bg-slate-100 p-3 text-slate-800 break-all max-w-full flex-grow whitespace-pre-wrap font-mono">
									{groq}
								</code>
							</div>
						)}
						<div className="flex items-start"><span className="font-semibold text-slate-700 min-w-[70px]">Limit:</span><span className="text-slate-800 font-mono">{limit}</span></div>
					</div>

					{count > 0 && (
						<div className="mt-2">
							<div className="text-xs font-semibold text-slate-700 mb-1.5">Result Summary ({count}):</div>
							<div className="border border-slate-200 rounded-md p-3 bg-slate-50">
								<ul className="space-y-1.5">
									{results.map((result: any, index: number) => (
										<li key={index} className="text-xs flex items-start gap-1.5 py-1 border-b border-slate-100 last:border-b-0">
											<Database className="h-3.5 w-3.5 mt-0.5 text-slate-400 flex-shrink-0" />
											<div className="flex-grow">
												<div className="break-all font-medium text-slate-700">
													{result._type && <span className="font-semibold text-indigo-600 font-mono">{result._type}:</span>} <span className="font-mono">{result.title || result.name || result._id || 'Untitled'}</span>
												</div>
												{isExpandableValue(result) && (
													<div className="mt-1 pt-1 border-t border-slate-200">
														<ObjectDisplay value={result} keyPath={`result-${index}`} isTopLevel={false} />
													</div>
												)}
											</div>
										</li>
									))}
								</ul>
							</div>
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
}; 