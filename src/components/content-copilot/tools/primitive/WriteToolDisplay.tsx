import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Loader2, Pencil, X } from "lucide-react";
import { ToolInvocation } from "../index";

interface WriteToolDisplayProps {
	toolInvocation: ToolInvocation;
	addToolResult?: (result: { toolCallId: string; result: any; }) => void;
}

/**
 * Component that renders a write tool invocation
 * Handles updating any field at any path in a document
 */
export const WriteToolDisplay = ({ toolInvocation }: WriteToolDisplayProps) => {
	const { state, args, result } = toolInvocation;
	const { documentId, path, value } = args;

	// Debug log to check received state
	console.log(`[DEBUG] WriteToolDisplay received - State: ${state}, Path: ${path}, HasResult: ${!!result}`);

	// Helper to truncate long values for display
	const truncateValue = (val: any) => {
		if (val === null || val === undefined) return "null";
		const stringVal = typeof val === "object" ? JSON.stringify(val) : String(val);
		return stringVal.length > 60 ? stringVal.substring(0, 57) + "..." : stringVal;
	};

	// Loading state
	if (state === 'partial-call' || state === 'call') {
		console.log(`[DEBUG] WriteToolDisplay rendering LOADING state for: ${path}`);
		return (
			<Card className="w-full border bg-white text-black border-blue-100 shadow-sm">
				<CardHeader className="bg-blue-50 py-2">
					<div className="flex items-center justify-between">
						<CardTitle className="text-sm font-medium text-blue-700">
							<span className="flex items-center gap-1">
								<Loader2 className="h-3.5 w-3.5 animate-spin" />
								Writing to Document
							</span>
						</CardTitle>
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
		console.log(`[DEBUG] WriteToolDisplay rendering ERROR state for: ${path}`);
		return (
			<Card className="w-full border bg-white text-black border-red-100 shadow-sm">
				<CardHeader className="bg-red-50 py-2">
					<div className="flex items-center justify-between">
						<CardTitle className="text-sm font-medium text-red-700">
							<span className="flex items-center gap-1">
								<X className="h-3.5 w-3.5" />
								Write Operation Failed
							</span>
						</CardTitle>
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
	console.log(`[DEBUG] WriteToolDisplay rendering SUCCESS state for: ${path}`);
	return (
		<Card className="w-full border bg-white text-black border-green-100 shadow-sm">
			<CardHeader className="bg-green-50 py-2">
				<div className="flex items-center justify-between">
					<CardTitle className="text-sm font-medium text-green-700">
						<span className="flex items-center gap-1">
							<Check className="h-3.5 w-3.5" />
							<Pencil className="h-3.5 w-3.5 ml-0.5" />
							Field Updated
						</span>
					</CardTitle>
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
						<span className="text-xs font-semibold text-black">Value:</span>
						<code className="text-xs rounded bg-slate-100 px-1 py-0.5 max-w-full overflow-hidden text-black">
							{truncateValue(value)}
						</code>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}; 