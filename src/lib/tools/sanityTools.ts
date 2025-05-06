import { logToolCall } from '@/lib/tools/utils';
import { client as sanityClient } from '@/sanity/lib/client';
import {
	addItemToArray,
	fetchReferencedDocuments,
	fetchRelatedDocument,
	getAllDocumentTypes,
	listDocumentsByType,
	removeItemFromArray,
	resolveDocumentReferences,
	updateDocumentField
} from '@/sanity/lib/helpers';
import { tool } from 'ai';
import { z } from 'zod';



// Define the tools available to the AI
export const writeFieldTool = tool({
	description: 'Update a specific field in the current Sanity document. Use this tool when you are confident about the content and want to write it directly to the document in the background without requiring user confirmation. Best for simple, factual information clearly stated by the user or easily inferred from conversation. The update will be subtle with minimal UI indication to the user.',
	parameters: z.object({
		documentId: z.string().describe('The Sanity document ID for the sanity document you want to update.'),
		fieldPath: z.string().describe('The path to the field (e.g., "title", "description")'),
		value: z.any().describe('The new value to set for the field'),
	}),
	execute: async ({ documentId, fieldPath, value }, { toolCallId }) => {
		try {
			// Get the current document to understand field structure
			const document = await sanityClient.getDocument(documentId);
			if (!document) {
				const error = `Document not found: ${documentId}`;
				await logToolCall(toolCallId, 'writeField', { documentId, fieldPath, value }, { success: false, message: error }, true);
				return {
					success: false,
					message: error
				};
			}

			// Split the field path to access nested properties
			const parts = fieldPath.split('.');





			// Use the helper function to update the field
			await updateDocumentField(documentId, fieldPath, value);

			// Log successful tool call
			await logToolCall(toolCallId, 'writeField', { documentId, fieldPath, value }, {
				success: true,
				message: `Successfully updated field ${fieldPath}`,
				value: value
			}, false);

			return {
				success: true,
				message: `Successfully updated field ${fieldPath}`,
				value: value,
				fieldPath
			};

		} catch (error) {
			console.error('Error writing field:', error);

			// Log failed tool call
			await logToolCall(toolCallId, 'writeField', { documentId, fieldPath, value }, {
				success: false,
				message: `Failed to update field ${fieldPath}: ${error instanceof Error ? error.message : String(error)}`
			}, true);

			return {
				success: false,
				message: `Failed to update field ${fieldPath}: ${error instanceof Error ? error.message : String(error)}`
			};
		}
	}
});

// New tool for adding an item to an array
export const addToArrayTool = tool({
	description: 'Add an item to an array field in the Sanity document. Use this tool when you need to add a new entry to an existing array without modifying current values. This is useful for adding new elements like challenges, technologies, or tags.',
	parameters: z.object({
		documentId: z.string().describe('The Sanity document ID of the document you are editing'),
		arrayPath: z.string().describe('The path to the array field (e.g., "challenges", "technologies")'),
		item: z.any().describe('The item to add to the array, will be formatted appropriately based on the array type'),
	}),
	execute: async ({ documentId, arrayPath, item }, { toolCallId }) => {
		try {
			// Get the document to check if it exists
			const document = await sanityClient.getDocument(documentId);
			if (!document) {
				const error = `Document not found: ${documentId}`;
				await logToolCall(toolCallId, 'addToArray', { documentId, arrayPath, item }, { success: false, message: error }, true);
				return {
					success: false,
					message: error
				};
			}


			// Use the helper function to add the item
			await addItemToArray(documentId, arrayPath, item);

			// Log successful tool call
			const result = {
				success: true,
				message: `Successfully added item to ${arrayPath}`,
				arrayPath,
				item: item
			};

			await logToolCall(toolCallId, 'addToArray', { documentId, arrayPath, item }, result, false);

			return result;
		} catch (error) {
			console.error('Error adding item to array:', error);

			const errorResult = {
				success: false,
				message: `Failed to add item to ${arrayPath}: ${error instanceof Error ? error.message : String(error)}`
			};

			await logToolCall(toolCallId, 'addToArray', { documentId, arrayPath, item }, errorResult, true);

			return errorResult;
		}
	}
});

// New tool for removing an item from an array
export const removeFromArrayTool = tool({
	description: 'Remove an item from an array field in the Sanity document by its _key. Use this tool when you need to delete an existing array item that is no longer needed.',
	parameters: z.object({
		documentId: z.string().describe('The Sanity document ID of the document you are editing'),
		arrayPath: z.string().describe('The path to the array field (e.g., "challenges", "technologies")'),
		itemKey: z.string().describe('The _key of the item to remove'),
	}),
	execute: async ({ documentId, arrayPath, itemKey }, { toolCallId }) => {
		try {
			// Get the document to check if it exists
			const document = await sanityClient.getDocument(documentId);
			if (!document) {
				const error = `Document not found: ${documentId}`;
				await logToolCall(toolCallId, 'removeFromArray', { documentId, arrayPath, itemKey }, { success: false, message: error }, true);
				return {
					success: false,
					message: error
				};
			}

			// Use the helper function to remove the item
			await removeItemFromArray(documentId, arrayPath, itemKey);

			// Log successful tool call
			const result = {
				success: true,
				message: `Successfully removed item with key ${itemKey} from ${arrayPath}`,
				arrayPath,
				itemKey
			};

			await logToolCall(toolCallId, 'removeFromArray', { documentId, arrayPath, itemKey }, result, false);

			return result;
		} catch (error) {
			console.error('Error removing item from array:', error);

			const errorResult = {
				success: false,
				message: `Failed to remove item from ${arrayPath}: ${error instanceof Error ? error.message : String(error)}`
			};

			await logToolCall(toolCallId, 'removeFromArray', { documentId, arrayPath, itemKey }, errorResult, true);

			return errorResult;
		}
	}
});

// Tool for getting related documents
export const getRelatedDocumentTool = tool({
	description: 'Fetch a related document from Sanity by its ID. Use this when you need to reference data from another related document.',
	parameters: z.object({
		documentId: z.string().describe('The Sanity document ID of the related document you want to fetch'),
	}),
	execute: async ({ documentId }, { toolCallId }) => {
		try {
			// Validate documentId is not empty
			if (!documentId || documentId.trim() === '') {
				const error = 'Document ID cannot be empty';
				await logToolCall(toolCallId, 'getRelatedDocument', { documentId }, { success: false, message: error }, true);
				return {
					success: false,
					message: error
				};
			}

			// Fetch the document from Sanity
			let projection = '*';

			// Try to fetch the document
			const document = await fetchRelatedDocument(documentId);

			if (!document) {
				const error = `Document not found: ${documentId}`;
				await logToolCall(toolCallId, 'getRelatedDocument', { documentId }, { success: false, message: error }, true);
				return {
					success: false,
					message: error
				};
			}

			// Handle circular references by cleaning the document
			const serializedDocument = serializeDocument(document);

			// Log successful tool call
			const result = {
				success: true,
				message: `Successfully fetched related document ${documentId}`,
				document: serializedDocument
			};

			await logToolCall(toolCallId, 'getRelatedDocument', { documentId }, result, false);

			return result;
		} catch (error) {
			console.error('Error fetching related document:', error);

			const errorResult = {
				success: false,
				message: `Failed to fetch related document ${documentId}: ${error instanceof Error ? error.message : String(error)}`
			};

			await logToolCall(toolCallId, 'getRelatedDocument', { documentId }, errorResult, true);

			return errorResult;
		}
	}
});

// New tool for resolving references in documents
export const resolveReferencesTool = tool({
	description: 'Resolve references in a Sanity document, replacing reference objects with the actual referenced documents. Use this when you need to see the complete data from referenced documents like related projects, skills, or knowledge items.',
	parameters: z.object({
		documentId: z.string().describe('The Sanity document ID of the document to resolve references for'),
		referenceFields: z.array(z.string()).optional().describe('Optional specific reference fields to resolve (e.g., "relatedProjects", "technologies"). If not specified, all reference fields will be attempted.'),
		depth: z.number().optional().describe('How many levels of references to resolve (default: 1, max: 2)'),
	}),
	execute: async ({ documentId, referenceFields = [], depth = 1 }, { toolCallId }) => {
		try {
			// Limit depth to avoid excessive recursive queries
			const safeDepth = Math.min(depth || 1, 2);

			// Resolve references in the document
			const resolvedDocument = await resolveDocumentReferences(
				documentId,
				safeDepth,
				referenceFields
			);

			if (!resolvedDocument) {
				const error = `Document not found or could not resolve references: ${documentId}`;
				await logToolCall(toolCallId, 'resolveReferences', { documentId, referenceFields, depth }, { success: false, message: error }, true);
				return {
					success: false,
					message: error
				};
			}

			// Serialize the result to handle any circular references
			const serializedDocument = serializeDocument(resolvedDocument);

			// Log successful tool call
			const result = {
				success: true,
				message: `Successfully resolved references for document ${documentId}`,
				document: serializedDocument
			};

			await logToolCall(toolCallId, 'resolveReferences', { documentId, referenceFields, depth }, result, false);

			return result;
		} catch (error) {
			console.error('Error resolving references:', error);

			const errorResult = {
				success: false,
				message: `Failed to resolve references for document ${documentId}: ${error instanceof Error ? error.message : String(error)}`
			};

			await logToolCall(toolCallId, 'resolveReferences', { documentId, referenceFields, depth }, errorResult, true);

			return errorResult;
		}
	}
});

// New tool for fetching documents referenced by a specific field
export const getReferencedDocumentsTool = tool({
	description: 'Fetch documents that are referenced by a specific field in a Sanity document. Use this when you need to see all related documents for a specific reference field like "relatedProjects" or "technologies".',
	parameters: z.object({
		documentId: z.string().describe('The Sanity document ID of the source document'),
		referenceField: z.string().describe('The field containing references (e.g., "relatedProjects", "technologies")'),
		includeFields: z.array(z.string()).optional().describe('Optional specific fields to include from the referenced documents (if not specified, fetches all fields)'),
	}),
	execute: async ({ documentId, referenceField, includeFields }, { toolCallId }) => {
		try {
			// Create a projection string if specific fields are requested
			let projection = '*';
			if (includeFields && includeFields.length > 0) {
				projection = includeFields.join(',');
			}

			// Fetch the referenced documents
			const referencedDocuments = await fetchReferencedDocuments(
				documentId,
				referenceField,
				projection
			);

			if (referencedDocuments.length === 0) {
				const message = `No referenced documents found for ${referenceField} in document ${documentId}`;
				await logToolCall(toolCallId, 'getReferencedDocuments', { documentId, referenceField, includeFields }, { success: true, message, documents: [] }, false);
				return {
					success: true,
					message,
					documents: []
				};
			}

			// Serialize the results to handle any circular references
			const serializedDocuments = referencedDocuments.map(doc => serializeDocument(doc));

			// Log successful tool call
			const result = {
				success: true,
				message: `Successfully fetched ${serializedDocuments.length} referenced documents from ${referenceField}`,
				documents: serializedDocuments
			};

			await logToolCall(toolCallId, 'getReferencedDocuments', { documentId, referenceField, includeFields }, result, false);

			return result;
		} catch (error) {
			console.error('Error fetching referenced documents:', error);

			const errorResult = {
				success: false,
				message: `Failed to fetch referenced documents for ${referenceField}: ${error instanceof Error ? error.message : String(error)}`
			};

			await logToolCall(toolCallId, 'getReferencedDocuments', { documentId, referenceField, includeFields }, errorResult, true);

			return errorResult;
		}
	}
});

// New tool for getting all document types
export const getAllDocumentTypesTool = tool({
	description: 'Get a list of all available document types in the Sanity content database. Use this when you need to discover what types of content are available in the system.',
	parameters: z.object({}),
	execute: async ({ }, { toolCallId }) => {
		try {
			// Fetch all document types
			const documentTypes = await getAllDocumentTypes();

			if (documentTypes.length === 0) {
				const message = 'No document types found or unable to retrieve types';
				await logToolCall(toolCallId, 'getAllDocumentTypes', {}, { success: true, message, types: [] }, false);
				return {
					success: true,
					message,
					types: []
				};
			}

			// Log successful tool call
			const result = {
				success: true,
				message: `Successfully retrieved ${documentTypes.length} document types`,
				types: documentTypes
			};

			await logToolCall(toolCallId, 'getAllDocumentTypes', {}, result, false);

			return result;
		} catch (error) {
			console.error('Error getting document types:', error);

			const errorResult = {
				success: false,
				message: `Failed to get document types: ${error instanceof Error ? error.message : String(error)}`
			};

			await logToolCall(toolCallId, 'getAllDocumentTypes', {}, errorResult, true);

			return errorResult;
		}
	}
});

// New tool for listing documents of a specific type
export const listDocumentsByTypeTool = tool({
	description: 'List all documents of a specific type with their basic metadata. Use this to discover available documents of a certain type (e.g., projects, skills) before fetching a specific one.',
	parameters: z.object({
		documentType: z.string().describe('The type of documents to list (e.g., "project", "skill", "knowledgeBase")'),
		limit: z.number().optional().describe('Maximum number of documents to return (default: 100)'),
		offset: z.number().optional().describe('Number of documents to skip for pagination (default: 0)'),
		orderBy: z.string().optional().describe('Field to sort by, prepend with "-" for descending (e.g., "-_createdAt")'),
		filter: z.string().optional().describe('Optional additional GROQ filter conditions (e.g., "isFeatured == true")')
	}),
	execute: async ({ documentType, limit = 100, offset = 0, orderBy = '_createdAt', filter = '' }, { toolCallId }) => {
		try {
			// Fetch the documents
			const documents = await listDocumentsByType(
				documentType,
				limit,
				offset,
				orderBy,
				filter
			);

			if (documents.length === 0) {
				const message = `No documents found of type '${documentType}' or type does not exist`;
				await logToolCall(toolCallId, 'listDocumentsByType', { documentType, limit, offset, orderBy, filter }, { success: true, message, documents: [] }, false);
				return {
					success: true,
					message,
					documents: []
				};
			}

			// Log successful tool call
			const result = {
				success: true,
				message: `Successfully retrieved ${documents.length} documents of type '${documentType}'`,
				documents,
				pagination: {
					offset,
					limit,
					hasMore: documents.length === limit
				}
			};

			await logToolCall(toolCallId, 'listDocumentsByType', { documentType, limit, offset, orderBy, filter }, result, false);

			return result;
		} catch (error) {
			console.error(`Error listing documents of type ${documentType}:`, error);

			const errorResult = {
				success: false,
				message: `Failed to list documents of type '${documentType}': ${error instanceof Error ? error.message : String(error)}`
			};

			await logToolCall(toolCallId, 'listDocumentsByType', { documentType, limit, offset, orderBy, filter }, errorResult, true);

			return errorResult;
		}
	}
});

// Helper function to safely serialize a Sanity document
// Handles circular references and converts _ref objects to strings
function serializeDocument(doc: Record<string, any>): Record<string, any> {
	// Create a cache to handle circular references
	const cache = new WeakMap();

	return JSON.parse(JSON.stringify(doc, (key, value) => {
		// Handle circular references
		if (typeof value === 'object' && value !== null) {
			if (cache.has(value)) {
				return { _ref: value._id || 'circular-ref' };
			}
			cache.set(value, true);
		}

		// Convert _ref objects to a simpler format
		if (key === '_ref' && typeof value === 'string') {
			return value;
		}

		return value;
	}));
}


