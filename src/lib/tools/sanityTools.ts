import { logToolCall } from '@/lib/tools/utils';
import { client as sanityClient } from '@/sanity/lib/client';
import { addItemToArray, removeItemFromArray, updateDocumentField } from '@/sanity/lib/helpers';
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


