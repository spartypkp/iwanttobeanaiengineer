import {
	addToArrayTool,
	getAllDocumentTypesTool,
	getReferencedDocumentsTool,
	getRelatedDocumentTool,
	listDocumentsByTypeTool,
	removeFromArrayTool,
	resolveReferencesTool,
	writeFieldTool
} from './sanityTools';

import {
	arrayTool,
	deleteTool,
	queryTool,
	writeTool
} from './improvedSanityTools';

// Legacy Sanity tools
export const legacySanityTools = {
	writeFieldTool,
	addToArrayTool,
	removeFromArrayTool,
	getRelatedDocumentTool,
	resolveReferencesTool,
	getReferencedDocumentsTool,
	getAllDocumentTypesTool,
	listDocumentsByTypeTool
};

// Improved primitive Sanity tools
export const improvedSanityTools = {
	writeTool,
	deleteTool,
	arrayTool,
	queryTool
};

// Export all tools
export {
	addToArrayTool, arrayTool, deleteTool, getAllDocumentTypesTool, getReferencedDocumentsTool, getRelatedDocumentTool, listDocumentsByTypeTool, queryTool, removeFromArrayTool, resolveReferencesTool,
	// Legacy tools
	writeFieldTool,
	// Improved tools
	writeTool
};
