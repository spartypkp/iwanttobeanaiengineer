import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, List, ListPlus, Loader2, RefreshCw, Trash2, X } from "lucide-react";
import { ToolInvocation } from "../index";

interface ArrayToolDisplayProps {
	toolInvocation: ToolInvocation;
	addToolResult?: (result: { toolCallId: string; result: any; }) => void;
}

/**
 * Component that renders an array tool invocation
 * Handles all array operations (append, prepend, insert, remove, replace)
 */
export const ArrayToolDisplay = ({ toolInvocation }: ArrayToolDisplayProps) => {
	const { state, args, result } = toolInvocation;
	const { documentId, path, operation, items = [], at, position } = args;

	// Helper to format operation display
	const getOperationDisplay = () => {
		switch (operation) {
			case 'append':
				return {
					label: 'Adding to End',
					icon: ListPlus,
					color: 'blue',
					description: `Adding ${items.length} item(s) to the end of the array`
				};
			case 'prepend':
				return {
					label: 'Adding to Beginning',
					icon: ListPlus,
					color: 'blue',
					description: `Adding ${items.length} item(s) to the beginning of the array`
				};
			case 'insert':
				return {
					label: 'Inserting Items',
					icon: ListPlus,
					color: 'indigo',
					description: `Inserting ${items.length} item(s) ${position || 'after'} position ${at}`
				};
			case 'remove':
				return {
					label: 'Removing Items',
					icon: Trash2,
					color: 'amber',
					description: `Removing item at position ${at}`
				};
			case 'replace':
				return {
					label: 'Replacing Items',
					icon: RefreshCw,
					color: 'violet',
					description: `Replacing item at position ${at} with ${items.length} new item(s)`
				};
			default:
				return {
					label: 'Array Operation',
					icon: List,
					color: 'slate',
					description: 'Modifying array'
				};
		}
	};

	const { label, icon: Icon, color, description } = getOperationDisplay();

	// Helper for coloring based on operation
	const getColorClasses = () => {
		const colorMap: Record<string, { bg: string, border: string, text: string; }> = {
			'blue': { bg: 'bg-blue-50', border: 'border-blue-100', text: 'text-blue-700' },
			'green': { bg: 'bg-green-50', border: 'border-green-100', text: 'text-green-700' },
			'amber': { bg: 'bg-amber-50', border: 'border-amber-100', text: 'text-amber-700' },
			'indigo': { bg: 'bg-indigo-50', border: 'border-indigo-100', text: 'text-indigo-700' },
			'violet': { bg: 'bg-violet-50', border: 'border-violet-100', text: 'text-violet-700' },
			'slate': { bg: 'bg-slate-50', border: 'border-slate-100', text: 'text-slate-700' }
		};

		return colorMap[color] || colorMap.slate;
	};

	const colorClasses = getColorClasses();

	// Helper to truncate items for display
	const truncateItems = (items: any[]) => {
		if (!items || !items.length) return "[]";
		if (items.length === 1) {
			const item = typeof items[0] === "object" ? JSON.stringify(items[0]) : String(items[0]);
			return item.length > 40 ? item.substring(0, 37) + "..." : item;
		}
		return `[${items.length} items]`;
	};

	// Loading state
	if (state === 'partial-call' || state === 'call') {
		return (
			<Card className="w-full border bg-white text-black border-blue-100 shadow-sm">
				<CardHeader className="bg-blue-50 py-2">
					<div className="flex items-center justify-between">
						<CardTitle className="text-sm font-medium text-blue-700">
							<span className="flex items-center gap-1">
								<Loader2 className="h-3.5 w-3.5 animate-spin" />
								Array Operation
							</span>
						</CardTitle>
						<Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200">
							{operation}
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

	// Error state
	if (!result || !result.success) {
		return (
			<Card className="w-full border bg-white text-black border-red-100 shadow-sm">
				<CardHeader className="bg-red-50 py-2">
					<div className="flex items-center justify-between">
						<CardTitle className="text-sm font-medium text-red-700">
							<span className="flex items-center gap-1">
								<X className="h-3.5 w-3.5" />
								Array Operation Failed
							</span>
						</CardTitle>
						<Badge variant="outline" className="bg-red-100 text-red-700 border-red-200">
							{operation}
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
						<div className="flex items-start gap-2">
							<span className="text-xs font-semibold text-black">Error:</span>
							<span className="text-xs text-red-600">
								{result?.message || "Unknown error occurred"}
							</span>
						</div>
					</div>
				</CardContent>
			</Card>
		);
	}

	// Success state
	return (
		<Card className={`w-full border bg-white text-black ${colorClasses.border} shadow-sm`}>
			<CardHeader className={`${colorClasses.bg} py-2`}>
				<div className="flex items-center justify-between">
					<CardTitle className={`text-sm font-medium ${colorClasses.text}`}>
						<span className="flex items-center gap-1">
							<Check className="h-3.5 w-3.5" />
							<Icon className="h-3.5 w-3.5 ml-0.5" />
							{label}
						</span>
					</CardTitle>
					<Badge variant="outline" className={`${colorClasses.bg} ${colorClasses.text} border-${color}-200`}>
						{operation}
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
					<div className="text-xs text-black">
						{description}
					</div>
					{(items && items.length > 0 && (operation === 'append' || operation === 'prepend' || operation === 'insert' || operation === 'replace')) && (
						<div className="flex items-start gap-2">
							<span className="text-xs font-semibold text-black">Items:</span>
							<code className="text-xs rounded bg-slate-100 px-1 py-0.5 text-black">
								{truncateItems(items)}
							</code>
						</div>
					)}
					{result?.itemsAffected && (
						<div className="flex items-start gap-2">
							<span className="text-xs font-semibold text-black">Affected:</span>
							<span className="text-xs text-black">
								{result.itemsAffected} item(s)
							</span>
						</div>
					)}
					{result?.arrayLength && (
						<div className="flex items-start gap-2">
							<span className="text-xs font-semibold text-black">New Length:</span>
							<span className="text-xs text-black">
								{result.arrayLength} item(s)
							</span>
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
}; 