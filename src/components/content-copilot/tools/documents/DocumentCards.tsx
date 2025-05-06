import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Loader2, Pencil, X } from "lucide-react";
import { useState } from "react";
import { ToolInvocation } from "../index";

interface DocumentToolProps {
	toolInvocation: ToolInvocation;
}

/**
 * Card component for displaying document data from getRelatedDocument and getReferencedDocuments tools
 */
export const DocumentToolCard = ({ toolInvocation }: DocumentToolProps) => {
	const { toolName, state, args, result } = toolInvocation;
	const [isExpanded, setIsExpanded] = useState(false);

	// Get the appropriate icon and name based on tool type
	const getToolInfo = () => {
		switch (toolName) {
			case 'getRelatedDocument':
				return {
					icon: Pencil,
					name: 'Document Details',
					label: `ID: ${args.documentId?.substring(0, 8)}...`
				};
			case 'getReferencedDocuments':
				return {
					icon: Pencil,
					name: 'Referenced Documents',
					label: `Field: ${args.referenceField}`
				};
			default:
				return { icon: Pencil, name: 'Document Data', label: '' };
		}
	};

	const { icon: Icon, name, label } = getToolInfo();

	// If the call is in progress
	if (state === 'partial-call' || state === 'call' || !result) {
		return (
			<div className="my-2 flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-100 rounded-md text-blue-700 text-xs">
				<Loader2 className="h-4 w-4 animate-spin" />
				<div>
					<span className="font-medium">{name}</span>
					{label && <span className="ml-1 text-blue-600">{label}</span>}
				</div>
			</div>
		);
	}

	// If there was an error
	if (!result.success) {
		return (
			<div className="my-2 flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-100 rounded-md text-red-700 text-xs">
				<X className="h-4 w-4" />
				<div>
					<span className="font-medium">Failed to fetch document data</span>
					<span className="ml-1 text-red-600">{result.message}</span>
				</div>
			</div>
		);
	}

	// Display document data based on tool type
	const renderDocumentContent = () => {
		if (toolName === 'getRelatedDocument') {
			const document = result.document || {};
			return (
				<div className="grid gap-2">
					<div className="grid gap-1.5">
						<p className="font-medium">Type: {document._type}</p>
						<p className="text-black">
							Title: {document.title || document.name || 'Untitled'}
						</p>
						{document.description && (
							<p className="text-black text-xs">{document.description.substring(0, 100)}
								{document.description.length > 100 && '...'}
							</p>
						)}
					</div>
					{isExpanded && (
						<div className="mt-2 pt-2 border-t border-gray-100">
							<pre className="max-h-40 overflow-auto bg-slate-50 p-2 rounded text-xs font-mono">
								{JSON.stringify(document, null, 2)}
							</pre>
						</div>
					)}
				</div>
			);
		}

		if (toolName === 'getReferencedDocuments') {
			const documents = result.documents || [];
			return (
				<div className="grid gap-2">
					<p className="font-medium">Found {documents.length} referenced documents</p>
					{documents.length > 0 && (
						<div className="space-y-2">
							{documents.slice(0, isExpanded ? documents.length : 2).map((doc: any, index: number) => (
								<div key={index} className="border border-gray-100 rounded p-2 bg-slate-50">
									<p className="font-medium">{doc.title || doc.name || `Document ${index + 1}`}</p>
									<p className="text-xs text-black">Type: {doc._type}</p>
									{doc.description && (
										<p className="text-xs text-black mt-1">{doc.description.substring(0, 50)}
											{doc.description.length > 50 && '...'}
										</p>
									)}
								</div>
							))}
							{!isExpanded && documents.length > 2 && (
								<p className="text-xs text-blue-600">+ {documents.length - 2} more documents</p>
							)}
						</div>
					)}
				</div>
			);
		}

		return (
			<div className="text-black text-xs">
				{result.message || 'Document data fetched successfully'}
			</div>
		);
	};

	// Success card with document data
	return (
		<Card className="my-2 border border-gray-200 bg-white overflow-hidden text-black">
			<div className="bg-slate-50 px-3 py-1.5 border-b border-gray-200 flex items-center gap-2">
				<Icon className="h-4 w-4 text-slate-600" />
				<span className="text-xs font-medium text-slate-700">{name}</span>
				{label && (
					<Badge className="ml-auto bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200">
						{label}
					</Badge>
				)}
			</div>
			<CardContent className="p-2 text-xs">
				{renderDocumentContent()}
				<Button
					variant="ghost"
					size="sm"
					onClick={() => setIsExpanded(!isExpanded)}
					className="mt-2 h-7 text-xs w-full border border-gray-100 hover:bg-gray-50"
				>
					{isExpanded ? 'Show Less' : 'Show More'}
				</Button>
			</CardContent>
		</Card>
	);
};

/**
 * Card component for displaying document types from the getAllDocumentTypes tool
 */
export const DocumentTypesToolCard = ({ toolInvocation }: DocumentToolProps) => {
	const { state, result } = toolInvocation;
	const [isExpanded, setIsExpanded] = useState(false);

	// If the call is in progress
	if (state === 'partial-call' || state === 'call' || !result) {
		return (
			<div className="my-2 flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-100 rounded-md text-blue-700 text-xs">
				<Loader2 className="h-4 w-4 animate-spin" />
				<div>
					<span className="font-medium">Fetching Document Types</span>
				</div>
			</div>
		);
	}

	// If there was an error
	if (!result.success) {
		return (
			<div className="my-2 flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-100 rounded-md text-red-700 text-xs">
				<X className="h-4 w-4" />
				<div>
					<span className="font-medium">Failed to fetch document types</span>
					<span className="ml-1 text-red-600">{result.message}</span>
				</div>
			</div>
		);
	}

	const types = result.types || [];

	// Success card with document types
	return (
		<Card className="my-2 border border-gray-200 bg-white overflow-hidden text-black">
			<div className="bg-slate-50 px-3 py-1.5 border-b border-gray-200 flex items-center gap-2">
				<Pencil className="h-4 w-4 text-slate-600" />
				<span className="text-xs font-medium text-slate-700">Document Types</span>
				<Badge className="ml-auto bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200">
					{types.length} Types
				</Badge>
			</div>
			<CardContent className="p-2 text-xs">
				<div className="grid gap-2">
					<p className="font-medium">Available Content Types</p>
					<div className="flex flex-wrap gap-1.5">
						{types.slice(0, isExpanded ? types.length : 6).map((type: any, index: number) => (
							<Badge key={index} className="bg-slate-50 hover:bg-slate-100">
								{type.title} ({type.count})
							</Badge>
						))}
						{!isExpanded && types.length > 6 && (
							<Badge variant="outline">
								+{types.length - 6} more
							</Badge>
						)}
					</div>
					{isExpanded && (
						<div className="mt-2 pt-2 border-t border-gray-100">
							<div className="grid grid-cols-2 gap-2">
								{types.map((type: any, index: number) => (
									<div key={index} className="border border-gray-100 rounded p-2 bg-slate-50">
										<p className="font-medium">{type.title}</p>
										<p className="text-xs text-black">{type.count} documents</p>
										{type.description && (
											<p className="text-xs text-black mt-1">{type.description}</p>
										)}
									</div>
								))}
							</div>
						</div>
					)}
					<Button
						variant="ghost"
						size="sm"
						onClick={() => setIsExpanded(!isExpanded)}
						className="mt-2 h-7 text-xs w-full border border-gray-100 hover:bg-gray-50"
					>
						{isExpanded ? 'Show Less' : 'Show More'}
					</Button>
				</div>
			</CardContent>
		</Card>
	);
};

/**
 * Card component for displaying document lists from the listDocumentsByType and query tools
 */
export const DocumentListToolCard = ({ toolInvocation }: DocumentToolProps) => {
	const { state, args, result } = toolInvocation;
	const [isExpanded, setIsExpanded] = useState(false);

	// Get document type from different tool args formats
	const documentType = args.documentType || args.type || 'documents';

	// If the call is in progress
	if (state === 'partial-call' || state === 'call' || !result) {
		return (
			<div className="my-2 flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-100 rounded-md text-blue-700 text-xs">
				<Loader2 className="h-4 w-4 animate-spin" />
				<div>
					<span className="font-medium">Listing Documents</span>
					<span className="ml-1 text-blue-600">Type: {documentType}</span>
				</div>
			</div>
		);
	}

	// If there was an error
	if (!result.success) {
		return (
			<div className="my-2 flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-100 rounded-md text-red-700 text-xs">
				<X className="h-4 w-4" />
				<div>
					<span className="font-medium">Failed to list documents</span>
					<span className="ml-1 text-red-600">{result.message}</span>
				</div>
			</div>
		);
	}

	// Handle different result formats
	const documents = result.documents || result.results || [];
	const pagination = result.pagination || { offset: 0, limit: 10, hasMore: false };

	// Success card with document list
	return (
		<Card className="my-2 border border-gray-200 bg-white overflow-hidden text-black">
			<div className="bg-slate-50 px-3 py-1.5 border-b border-gray-200 flex items-center gap-2">
				<Pencil className="h-4 w-4 text-slate-600" />
				<span className="text-xs font-medium text-slate-700">Document List</span>
				<Badge className="ml-auto bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200">
					{documentType} ({documents.length})
				</Badge>
			</div>
			<CardContent className="p-2 text-xs">
				<div className="grid gap-2">
					<div className="flex justify-between items-center">
						<p className="font-medium">Documents of type: {documentType}</p>
						{(args.filter || args.field) && <Badge variant="outline">Filtered</Badge>}
					</div>

					{documents.length === 0 ? (
						<div className="p-3 bg-gray-50 rounded-md text-center text-black">
							No documents found
						</div>
					) : (
						<div className="space-y-2 mt-1">
							{documents.slice(0, isExpanded ? documents.length : 3).map((doc: any, index: number) => (
								<div key={index} className="border border-gray-100 rounded p-2 bg-slate-50 flex justify-between">
									<div>
										<p className="font-medium">{doc.title || doc.name || `Document ${index + 1}`}</p>
										{doc.description && (
											<p className="text-xs text-black mt-0.5">{doc.description.substring(0, 50)}
												{doc.description.length > 50 && '...'}
											</p>
										)}
									</div>
									{doc.status && (
										<Badge className={cn(
											"h-fit",
											doc.status === 'active' && "bg-green-50 text-green-700 border-green-200",
											doc.status === 'completed' && "bg-blue-50 text-blue-700 border-blue-200",
											doc.status === 'archived' && "bg-gray-50 text-black border-gray-200",
											doc.status === 'maintenance' && "bg-orange-50 text-orange-700 border-orange-200"
										)}>
											{doc.status}
										</Badge>
									)}
								</div>
							))}
							{!isExpanded && documents.length > 3 && (
								<p className="text-xs text-blue-600">+ {documents.length - 3} more documents</p>
							)}
						</div>
					)}

					{pagination.hasMore && (
						<div className="text-xs text-black mt-1">
							Showing {pagination.offset + 1}-{pagination.offset + documents.length}
							{pagination.hasMore && " (more available)"}
						</div>
					)}

					{documents.length > 3 && (
						<Button
							variant="ghost"
							size="sm"
							onClick={() => setIsExpanded(!isExpanded)}
							className="mt-2 h-7 text-xs w-full border border-gray-100 hover:bg-gray-50"
						>
							{isExpanded ? 'Show Less' : 'Show More'}
						</Button>
					)}
				</div>
			</CardContent>
		</Card>
	);
}; 