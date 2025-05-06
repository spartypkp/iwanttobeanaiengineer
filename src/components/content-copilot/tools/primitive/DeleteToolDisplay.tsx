import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Loader2, Trash, X } from "lucide-react";
import { ToolInvocation } from "../index";

interface DeleteToolDisplayProps {
	toolInvocation: ToolInvocation;
	addToolResult?: (result: { toolCallId: string; result: any; }) => void;
}

/**
 * Component that renders a delete tool invocation
 * Handles deleting any field or array item at any path in a document
 */
export const DeleteToolDisplay = ({ toolInvocation }: DeleteToolDisplayProps) => {
	const { state, args, result } = toolInvocation;
	const { documentId, path } = args;

	// Loading state
	if (state === 'partial-call' || state === 'call') {
		return (
			<Card className="w-full border bg-white text-black border-blue-100 shadow-sm">
				<CardHeader className="bg-blue-50 py-2">
					<div className="flex items-center justify-between">
						<CardTitle className="text-sm font-medium text-blue-700">
							<span className="flex items-center gap-1">
								<Loader2 className="h-3.5 w-3.5 animate-spin" />
								Deleting from Document
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
		return (
			<Card className="w-full border bg-white text-black border-red-100 shadow-sm">
				<CardHeader className="bg-red-50 py-2">
					<div className="flex items-center justify-between">
						<CardTitle className="text-sm font-medium text-red-700">
							<span className="flex items-center gap-1">
								<X className="h-3.5 w-3.5" />
								Delete Operation Failed
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
	return (
		<Card className="w-full border bg-white text-black border-amber-100 shadow-sm">
			<CardHeader className="bg-amber-50 py-2">
				<div className="flex items-center justify-between">
					<CardTitle className="text-sm font-medium text-amber-700">
						<span className="flex items-center gap-1">
							<Check className="h-3.5 w-3.5" />
							<Trash className="h-3.5 w-3.5 ml-0.5" />
							Field Deleted
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
					{result?.deletedValue && (
						<div className="flex items-start gap-2">
							<span className="text-xs font-semibold text-black">Deleted:</span>
							<code className="text-xs rounded bg-slate-100 px-1 py-0.5 line-through text-black">
								{typeof result.deletedValue === "object"
									? JSON.stringify(result.deletedValue)
									: String(result.deletedValue)}
							</code>
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
}; 