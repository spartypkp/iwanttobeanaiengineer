import { logToolCall } from '@/lib/tools/utils';
import { client as sanityClient } from '@/sanity/lib/client';
import {
	deleteFromPath,
	performArrayOperation,
	queryDocuments,
	writeToPath
} from '@/sanity/lib/helpers';
import { SanityDocument } from '@sanity/client';
import { tool } from 'ai';
import { z } from 'zod';

// Error type classification for better LLM understanding
const errorTypes = {
	DOCUMENT_NOT_FOUND: "The specified document does not exist",
	PATH_NOT_FOUND: "The path does not exist in the document",
	VALIDATION_ERROR: "The value does not match schema requirements",
	PERMISSION_DENIED: "Insufficient permissions for this operation",
	ITEM_NOT_FOUND: "The specified array item was not found",
	INVALID_ARRAY: "The path exists but is not an array",
	INVALID_OPERATION: "The operation is not valid for this path",
	NETWORK_ERROR: "Connection to Sanity failed",
	UNKNOWN_ERROR: "An unknown error occurred"
};

// Helper function to categorize errors
function categorizeError(error: unknown): {
	type: string;
	message: string;
	suggestion: string;
} {
	const errorMessage = error instanceof Error ? error.message : String(error);

	if (errorMessage.includes('document not found') || errorMessage.includes('Document not found')) {
		return {
			type: 'DOCUMENT_NOT_FOUND',
			message: errorTypes.DOCUMENT_NOT_FOUND,
			suggestion: 'Check that the document ID is correct and the document exists.'
		};
	}

	if (errorMessage.includes('not found in document') || errorMessage.includes('cannot be found')) {
		return {
			type: 'PATH_NOT_FOUND',
			message: errorTypes.PATH_NOT_FOUND,
			suggestion: 'Verify that the path exists in the document structure.'
		};
	}

	if (errorMessage.includes('validation failed') || errorMessage.includes('ValidationError')) {
		return {
			type: 'VALIDATION_ERROR',
			message: errorTypes.VALIDATION_ERROR,
			suggestion: 'Ensure the value matches the expected schema type and constraints.'
		};
	}

	if (errorMessage.includes('permission') || errorMessage.includes('not authorized')) {
		return {
			type: 'PERMISSION_DENIED',
			message: errorTypes.PERMISSION_DENIED,
			suggestion: 'This operation requires different permissions.'
		};
	}

	if (errorMessage.includes('not an array')) {
		return {
			type: 'INVALID_ARRAY',
			message: errorTypes.INVALID_ARRAY,
			suggestion: 'The specified path must point to an array field.'
		};
	}

	if (errorMessage.includes('network') || errorMessage.includes('connection')) {
		return {
			type: 'NETWORK_ERROR',
			message: errorTypes.NETWORK_ERROR,
			suggestion: 'Check your network connection and try again.'
		};
	}

	return {
		type: 'UNKNOWN_ERROR',
		message: errorMessage,
		suggestion: 'Try with a simpler operation or check the document structure.'
	};
}

/**
 * Write/set a value at any path in a Sanity document
 */
export const writeTool = tool({
	description: 'Write/set a value at any path in a Sanity document. Handles simple fields, nested objects, and array items. This is a more flexible alternative to writeFieldTool that can update any part of a document structure.',
	parameters: z.object({
		documentId: z.string().describe('The Sanity document ID'),
		path: z.string().describe('Path to the field (e.g., "title", "content.blocks[0].text", "metadata.tags[_key==\"abc123\"].value")'),
		value: z.any().describe('The value to set at the specified path'),
		createIfMissing: z.boolean().optional().describe('Create parent objects/arrays if they don\'t exist (default: true)')
	}),
	execute: async ({ documentId, path, value, createIfMissing = true }, { toolCallId }) => {
		try {
			const document = await sanityClient.getDocument(documentId) as SanityDocument<Record<string, any>> | null;
			if (!document) {
				const error = {
					success: false,
					operation: "write",
					errorType: "DOCUMENT_NOT_FOUND",
					errorMessage: `Document not found: ${documentId}`,
					suggestion: "Check that the document ID is correct and the document exists."
				};
				await logToolCall(toolCallId, 'writeTool', { documentId, path, value }, error, true);
				console.log('[writeTool] Returning error:', JSON.stringify(error, null, 2));
				return error;
			}

			let previousValue;
			try {
				const pathParts = path.split(/[.\\[\\]]+/).filter(Boolean); // Simplified path splitting
				let current: any = document;
				for (const part of pathParts) {
					if (current === undefined || current === null) break;
					if (part.includes('_key==')) {
						const keyMatch = part.match(/_key=="([^"]+)"/);
						if (keyMatch && Array.isArray(current)) {
							current = current.find(item => item._key === keyMatch[1]);
						} else {
							current = undefined;
						}
					} else if (/^\d+$/.test(part) && Array.isArray(current)) {
						current = current[parseInt(part)];
					} else {
						current = current[part];
					}
				}
				previousValue = current;
			} catch (error) {
				console.log("[writeTool] Could not get previous value:", error);
				previousValue = { error: 'Could not retrieve previous value' }; // Ensure it's serializable
			}

			await writeToPath(documentId, path, value, createIfMissing);

			const result = {
				success: true,
				operation: "write",
				path,
				previousValue,
				newValue: value,
				details: `Successfully updated field at path "${path}"`
			};

			await logToolCall(toolCallId, 'writeTool', { documentId, path, value }, result, false);
			console.log('[writeTool] Returning result:', JSON.stringify(result, null, 2));
			return result;

		} catch (error) {
			console.error('[writeTool] Error:', error);
			const { type, message, suggestion } = categorizeError(error);
			const errorResult = {
				success: false,
				operation: "write",
				errorType: type,
				errorMessage: message,
				suggestion,
				path
			};
			await logToolCall(toolCallId, 'writeTool', { documentId, path, value }, errorResult, true);
			console.log('[writeTool] Returning error result from catch:', JSON.stringify(errorResult, null, 2));
			return errorResult;
		}
	}
});

/**
 * Delete/unset a value at any path in a Sanity document
 */
export const deleteTool = tool({
	description: 'Delete/unset a value at any path in a Sanity document. Works for simple fields, nested objects, and array items. Use this to remove content from documents.',
	parameters: z.object({
		documentId: z.string().describe('The Sanity document ID'),
		path: z.string().describe('Path to delete (e.g., "title", "content.blocks[0]", "tags[_key==\"abc123\"]")')
	}),
	execute: async ({ documentId, path }, { toolCallId }) => {
		try {
			const document = await sanityClient.getDocument(documentId) as SanityDocument<Record<string, any>> | null;
			if (!document) {
				const error = {
					success: false,
					operation: "delete",
					errorType: "DOCUMENT_NOT_FOUND",
					errorMessage: `Document not found: ${documentId}`,
					suggestion: "Check that the document ID is correct and the document exists."
				};
				await logToolCall(toolCallId, 'deleteTool', { documentId, path }, error, true);
				console.log('[deleteTool] Returning error:', JSON.stringify(error, null, 2));
				return error;
			}

			let deletedValue;
			try {
				const pathParts = path.split(/[.\\[\\]]+/).filter(Boolean); // Simplified path splitting
				let current: any = document;
				for (const part of pathParts) {
					if (current === undefined || current === null) break;
					if (part.includes('_key==')) {
						const keyMatch = part.match(/_key=="([^"]+)"/);
						if (keyMatch && Array.isArray(current)) {
							current = current.find(item => item._key === keyMatch[1]);
						} else {
							current = undefined;
						}
					} else if (/^\d+$/.test(part) && Array.isArray(current)) {
						current = current[parseInt(part)];
					} else {
						current = current[part];
					}
				}
				deletedValue = current;
			} catch (error) {
				console.log("[deleteTool] Could not get value to delete:", error);
				deletedValue = { error: 'Could not retrieve value to delete' }; // Ensure it's serializable
			}

			await deleteFromPath(documentId, path);

			const result = {
				success: true,
				operation: "delete",
				path,
				deletedValue,
				details: `Successfully deleted value at path "${path}"`
			};

			await logToolCall(toolCallId, 'deleteTool', { documentId, path }, result, false);
			console.log('[deleteTool] Returning result:', JSON.stringify(result, null, 2));
			return result;

		} catch (error) {
			console.error('[deleteTool] Error:', error);
			const { type, message, suggestion } = categorizeError(error);
			const errorResult = {
				success: false,
				operation: "delete",
				errorType: type,
				errorMessage: message,
				suggestion,
				path
			};
			await logToolCall(toolCallId, 'deleteTool', { documentId, path }, errorResult, true);
			console.log('[deleteTool] Returning error result from catch:', JSON.stringify(errorResult, null, 2));
			return errorResult;
		}
	}
});

/**
 * Perform operations on arrays in a Sanity document
 */
export const arrayTool = tool({
	description: 'Perform operations on arrays in a Sanity document - add, remove, or replace items. This is a more powerful alternative to addToArrayTool and removeFromArrayTool that handles all array operations.',
	parameters: z.object({
		documentId: z.string().describe('The Sanity document ID'),
		path: z.string().describe('Path to the array (e.g., "tags", "content.blocks")'),
		operation: z.enum(['append', 'prepend', 'insert', 'remove', 'replace']).describe('The operation to perform on the array'),
		items: z.array(z.any()).optional().describe('Items to add/insert/replace (required for append, prepend, insert, replace)'),
		at: z.union([
			z.number().describe('Index position for insert/replace/remove operations'),
			z.string().describe('Key (_key value) for insert/replace/remove operations in keyed arrays')
		]).optional().describe('Position or key where to perform the operation (required for insert, replace, remove)'),
		position: z.enum(['before', 'after', 'replace']).optional()
			.describe('Position for insert operations - before/after the specified index or key (default: after)')
	}),
	execute: async ({ documentId, path, operation, items = [], at, position }, { toolCallId }) => {
		try {
			const document = await sanityClient.getDocument(documentId) as SanityDocument<Record<string, any>> | null;
			if (!document) {
				const error = {
					success: false,
					operation: "array",
					errorType: "DOCUMENT_NOT_FOUND",
					errorMessage: `Document not found: ${documentId}`,
					suggestion: "Check that the document ID is correct and the document exists."
				};
				await logToolCall(toolCallId, 'arrayTool', { documentId, path, operation }, error, true);
				console.log('[arrayTool] Returning error (document not found):', JSON.stringify(error, null, 2));
				return error;
			}

			if (['append', 'prepend', 'insert', 'replace'].includes(operation) && (!items || items.length === 0)) {
				const error = {
					success: false,
					operation: "array",
					errorType: "VALIDATION_ERROR",
					errorMessage: `Items array is required for '${operation}' operation`,
					suggestion: "Provide at least one item in the items array for this operation."
				};
				await logToolCall(toolCallId, 'arrayTool', { documentId, path, operation }, error, true);
				console.log('[arrayTool] Returning error (items required):', JSON.stringify(error, null, 2));
				return error;
			}

			if (['insert', 'remove', 'replace'].includes(operation) && at === undefined) {
				const error = {
					success: false,
					operation: "array",
					errorType: "VALIDATION_ERROR",
					errorMessage: `'at' parameter is required for '${operation}' operation`,
					suggestion: "Specify the position (index or _key) for the operation."
				};
				await logToolCall(toolCallId, 'arrayTool', { documentId, path, operation }, error, true);
				console.log('[arrayTool] Returning error (at required):', JSON.stringify(error, null, 2));
				return error;
			}

			let arrayLengthBefore = 0;
			try {
				const pathParts = path.split(/[.\\[\\]]+/).filter(Boolean);
				let current: any = document;
				for (const part of pathParts) {
					if (current === undefined || current === null) break;
					current = current[part];
				}
				if (Array.isArray(current)) {
					arrayLengthBefore = current.length;
				}
			} catch (error) {
				console.log("[arrayTool] Could not get array length:", error);
			}

			await performArrayOperation(documentId, path, operation, items, at, position);

			let expectedArrayLength = arrayLengthBefore;
			if (operation === 'append' || operation === 'prepend') {
				expectedArrayLength += items.length;
			} else if (operation === 'insert') {
				expectedArrayLength += items.length;
			} else if (operation === 'remove') {
				expectedArrayLength = Math.max(0, expectedArrayLength - 1);
			}

			const result = {
				success: true,
				operation: "array",
				arrayOperation: operation,
				path,
				itemsAffected: operation === 'remove' ? 1 : items.length,
				arrayLengthBefore,
				arrayLengthAfter: expectedArrayLength,
				details: `Successfully performed "${operation}" on array at "${path}"`
			};

			await logToolCall(toolCallId, 'arrayTool', { documentId, path, operation }, result, false);
			console.log('[arrayTool] Returning result:', JSON.stringify(result, null, 2));
			return result;

		} catch (error) {
			console.error('[arrayTool] Error:', error);
			const { type, message, suggestion } = categorizeError(error);
			const errorResult = {
				success: false,
				operation: "array",
				errorType: type,
				errorMessage: message,
				suggestion,
				arrayOperation: operation,
				path
			};
			await logToolCall(toolCallId, 'arrayTool', { documentId, path, operation }, errorResult, true);
			console.log('[arrayTool] Returning error result from catch:', JSON.stringify(errorResult, null, 2));
			return errorResult;
		}
	}
});

/**
 * Query Sanity documents using simple criteria or full GROQ syntax
 */
export const queryTool = tool({
	description: 'Query Sanity documents using simple criteria or full GROQ syntax. Use this to find documents before modifying them.',
	parameters: z.object({
		type: z.string().optional().describe('Filter by document type'),
		id: z.string().optional().describe('Find document by ID'),
		field: z.string().optional().describe('Filter by a specific field value'),
		value: z.any().optional().describe('Value to match for the field'),
		limit: z.number().optional().describe('Maximum number of results (default: 10)'),
		groq: z.string().optional().describe('Custom GROQ query (overrides other parameters)'),
		projection: z.string().optional().describe('Fields to include in results (e.g., "title,description,_id" or "*")')
	}),
	execute: async ({ type, id, field, value, limit = 10, groq, projection = '*' }, { toolCallId }) => {
		try {
			const results = await queryDocuments({ type, id, field, value, limit, groq, projection });
			const queryDetails = {
				...(type && { type }),
				...(id && { id }),
				...(field && { filterField: field }),
				...(value !== undefined && { filterValue: value }),
				...(groq && { customQuery: true }),
				limit,
				projection
			};
			const result = {
				success: true,
				operation: "query",
				count: results.length,
				queryDetails,
				pagination: {
					limit,
					hasMore: results.length === limit
				},
				results
			};

			await logToolCall(toolCallId, 'queryTool', { type, id, field, value, limit, groq, projection }, result, false);
			// For queryTool, results can be large. Stringify with caution or summarize for logging.
			try {
				console.log('[queryTool] Returning result (first item if many):', results.length > 0 ? JSON.stringify(results[0], null, 2) : '[]');
			} catch (e) { console.error('[queryTool] Error stringifying result for console log'); }
			return result;

		} catch (error) {
			console.error('[queryTool] Error:', error);
			const { type: errType, message, suggestion } = categorizeError(error); // Renamed 'type' to 'errType' to avoid conflict
			const errorResult = {
				success: false,
				operation: "query",
				errorType: errType,
				errorMessage: message,
				suggestion,
				queryDetails: { type, id, field, value, limit, groq }
			};
			await logToolCall(toolCallId, 'queryTool', { type, id, field, value, limit, groq, projection }, errorResult, true);
			console.log('[queryTool] Returning error result from catch:', JSON.stringify(errorResult, null, 2));
			return errorResult;
		}
	}
}); 