import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, Database, FileText, Loader2, Search, X } from "lucide-react";
import { ToolInvocation } from "../index";

interface QueryToolDisplayProps {
	toolInvocation: ToolInvocation;
	addToolResult?: (result: { toolCallId: string; result: any; }) => void;
}

/**
 * Component that renders a query tool invocation
 * Displays results from document queries in a structured format
 */
export const QueryToolDisplay = ({ toolInvocation }: QueryToolDisplayProps) => {
	const { state, args, result } = toolInvocation;

	// Extract query parameters from args, handling different possible structures
	const {
		type,
		id,
		field,
		value,
		limit = 10,
		groq,
		projection
	} = args;

	// Helper to get a friendly description of the query
	const getQueryDescription = () => {
		if (groq) {
			return "Custom GROQ query";
		}
		if (id) {
			return `Document with ID: ${id}`;
		}
		if (type && field && value !== undefined) {
			return `${type} documents where ${field} = ${JSON.stringify(value)}`;
		}
		if (type) {
			return `All ${type} documents`;
		}
		return "Document query";
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
								Querying Documents
							</span>
						</CardTitle>
					</div>
				</CardHeader>
				<CardContent className="p-3 bg-white text-black">
					<div className="space-y-2">
						<div className="text-xs text-black">
							{getQueryDescription()}
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
								Query Failed
							</span>
						</CardTitle>
					</div>
				</CardHeader>
				<CardContent className="p-3 bg-white text-black">
					<div className="space-y-2">
						<div className="text-xs text-black">
							{getQueryDescription()}
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

	// Empty results
	if (!result.results || result.results.length === 0 || result.count === 0) {
		return (
			<Card className="w-full border bg-white text-black border-amber-100 shadow-sm">
				<CardHeader className="bg-amber-50 py-2">
					<div className="flex items-center justify-between">
						<CardTitle className="text-sm font-medium text-amber-700">
							<span className="flex items-center gap-1">
								<Search className="h-3.5 w-3.5" />
								No Results Found
							</span>
						</CardTitle>
					</div>
				</CardHeader>
				<CardContent className="p-3 bg-white text-black">
					<div className="space-y-2">
						<div className="text-xs text-black">
							{getQueryDescription()}
						</div>
					</div>
				</CardContent>
			</Card>
		);
	}

	// Success with results
	return (
		<Card className="w-full border bg-white text-black border-purple-100 shadow-sm">
			<CardHeader className="bg-purple-50 py-2">
				<div className="flex items-center justify-between">
					<CardTitle className="text-sm font-medium text-purple-700">
						<span className="flex items-center gap-1">
							<Check className="h-3.5 w-3.5" />
							<Database className="h-3.5 w-3.5 ml-0.5" />
							Query Results
						</span>
					</CardTitle>
					<Badge variant="outline" className="bg-purple-100 text-purple-700 border-purple-200">
						{result.count || result.results.length} results
					</Badge>
				</div>
			</CardHeader>
			<CardContent className="p-3 bg-white text-black">
				<div className="space-y-3">
					<div className="text-xs text-black">
						{getQueryDescription()}
					</div>

					{/* Render results in a scrollable area */}
					<ScrollArea className="h-[200px] w-full rounded border border-purple-100 p-2 bg-white">
						{result.results?.map((doc: any, index: number) => (
							<div key={doc._id || index} className="mb-2 pb-2 border-b border-purple-100 last:border-0">
								<div className="flex items-center gap-2">
									<FileText className="h-3.5 w-3.5 text-purple-500" />
									<span className="text-xs font-medium text-black">{doc.title || doc.name || doc._id}</span>
								</div>
								<div className="ml-5 mt-1">
									{doc._type && (
										<div className="text-xs text-gray-500">
											Type: <span className="font-mono text-gray-700">{doc._type}</span>
										</div>
									)}
									{doc._id && (
										<div className="text-xs text-gray-500 font-mono">
											ID: <span className="text-gray-700">{doc._id}</span>
										</div>
									)}
									{doc.description && (
										<div className="text-xs mt-1 text-gray-700">
											{doc.description.length > 100
												? doc.description.substring(0, 97) + "..."
												: doc.description}
										</div>
									)}
								</div>
							</div>
						))}
					</ScrollArea>

					{/* Pagination info if available */}
					{result.pagination && (
						<div className="flex items-center justify-between text-xs text-gray-500 mt-2">
							<span className="text-gray-700">
								{result.pagination.hasMore ? "More results available" : "End of results"}
							</span>
							<span className="text-gray-700">
								Showing {result.pagination.offset + 1}-{result.pagination.offset + result.results.length}
								{result.pagination.totalMatches ? ` of ${result.pagination.totalMatches}` : ""}
							</span>
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
}; 