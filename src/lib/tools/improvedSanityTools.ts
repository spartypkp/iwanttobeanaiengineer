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
			// Get the current document to verify it exists and get the previous value
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
				return error;
			}

			// Try to get the previous value for logging (if the path exists)
			let previousValue;
			try {
				// Navigate to get the previous value - this is a simplified approach
				const pathParts = path.split(/\.|\[|\]\.?/).filter(Boolean);
				let current: any = document;
				for (const part of pathParts) {
					if (current === undefined || current === null) break;
					// Handle array index or key access
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
				// If we can't get the previous value, it's okay to proceed
				console.log("Could not get previous value:", error);
			}

			// Use the helper function to write to the path
			await writeToPath(documentId, path, value, createIfMissing);

			// Log successful tool call
			const result = {
				success: true,
				operation: "write",
				path,
				previousValue,
				newValue: value,
				details: `Successfully updated field at path "${path}"`
			};

			await logToolCall(toolCallId, 'writeTool', { documentId, path, value }, result, false);
			return result;

		} catch (error) {
			console.error('Error using writeTool:', error);

			// Categorize the error
			const { type, message, suggestion } = categorizeError(error);

			// Log failed tool call
			const errorResult = {
				success: false,
				operation: "write",
				errorType: type,
				errorMessage: message,
				suggestion,
				path
			};

			await logToolCall(toolCallId, 'writeTool', { documentId, path, value }, errorResult, true);
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
			// Get the current document to verify it exists and get the value being deleted
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
				return error;
			}

			// Try to get the value that will be deleted
			let deletedValue;
			try {
				// Navigate to get the value - simplified approach
				const pathParts = path.split(/\.|\[|\]\.?/).filter(Boolean);
				let current: any = document;
				for (const part of pathParts) {
					if (current === undefined || current === null) break;
					// Handle array index or key access
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
				// If we can't get the value, it's okay to proceed
				console.log("Could not get value to delete:", error);
			}

			// Use the helper function to delete the path
			await deleteFromPath(documentId, path);

			// Log successful tool call
			const result = {
				success: true,
				operation: "delete",
				path,
				deletedValue,
				details: `Successfully deleted value at path "${path}"`
			};

			await logToolCall(toolCallId, 'deleteTool', { documentId, path }, result, false);
			return result;

		} catch (error) {
			console.error('Error using deleteTool:', error);

			// Categorize the error
			const { type, message, suggestion } = categorizeError(error);

			// Log failed tool call
			const errorResult = {
				success: false,
				operation: "delete",
				errorType: type,
				errorMessage: message,
				suggestion,
				path
			};

			await logToolCall(toolCallId, 'deleteTool', { documentId, path }, errorResult, true);
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
			// Get the current document to verify it exists
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
				return error;
			}

			// Validate parameters based on operation
			if (['append', 'prepend', 'insert', 'replace'].includes(operation) && (!items || items.length === 0)) {
				const error = {
					success: false,
					operation: "array",
					errorType: "VALIDATION_ERROR",
					errorMessage: `Items array is required for '${operation}' operation`,
					suggestion: "Provide at least one item in the items array for this operation."
				};
				await logToolCall(toolCallId, 'arrayTool', { documentId, path, operation }, error, true);
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
				return error;
			}

			// Get the current array length if possible
			let arrayLengthBefore = 0;
			try {
				// Navigate to get the array
				const pathParts = path.split(/\.|\[|\]\.?/).filter(Boolean);
				let current: any = document;
				for (const part of pathParts) {
					if (current === undefined || current === null) break;
					current = current[part];
				}

				if (Array.isArray(current)) {
					arrayLengthBefore = current.length;
				}
			} catch (error) {
				console.log("Could not get array length:", error);
			}

			// Use the helper function to perform the array operation
			await performArrayOperation(documentId, path, operation, items, at, position);

			// Calculate expected new length for a more informative response
			let expectedArrayLength = arrayLengthBefore;
			if (operation === 'append' || operation === 'prepend') {
				expectedArrayLength += items.length;
			} else if (operation === 'insert') {
				expectedArrayLength += items.length;
			} else if (operation === 'remove') {
				expectedArrayLength = Math.max(0, expectedArrayLength - 1);
			}
			// For replace, the length stays the same

			// Log successful tool call
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
			return result;

		} catch (error) {
			console.error('Error using arrayTool:', error);

			// Categorize the error
			const { type, message, suggestion } = categorizeError(error);

			// Log failed tool call
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
			// Use helper function to query documents
			const results = await queryDocuments({
				type,
				id,
				field,
				value,
				limit,
				groq,
				projection
			});

			// Prepare query details for better response
			const queryDetails = {
				...(type && { type }),
				...(id && { id }),
				...(field && { filterField: field }),
				...(value !== undefined && { filterValue: value }),
				...(groq && { customQuery: true }),
				limit,
				projection
			};

			// Log successful tool call
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
			return result;

		} catch (error) {
			console.error('Error using queryTool:', error);

			// Categorize the error
			const { type, message, suggestion } = categorizeError(error);

			// Log failed tool call
			const errorResult = {
				success: false,
				operation: "query",
				errorType: type,
				errorMessage: message,
				suggestion,
				queryDetails: { type, id, field, value, limit, groq }
			};

			await logToolCall(toolCallId, 'queryTool', { type, id, field, value, limit, groq, projection }, errorResult, true);
			return errorResult;
		}
	}
}); 