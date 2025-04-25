import { useCallback } from 'react';
import { useDocumentOperation } from 'sanity';

/**
 * Custom hook for patching Sanity documents
 * @param id Document ID to patch
 * @param type Schema type of the document
 * @returns Function for executing patches
 */
export function useDocumentPatcher(id: string, type: string) {
	const { patch } = useDocumentOperation(id, type);

	/**
	 * Apply a series of patch operations to the document
	 * @param patches Array of patch operations to apply
	 */
	const patchDocument = useCallback((patches: any[]) => {
		// Prepare the patches array
		const patchOperations = patches.map(patch => {
			if (patch.type === 'set') {
				return { set: { [patch.path]: patch.value } };
			}
			if (patch.type === 'unset') {
				return { unset: [patch.path] };
			}
			if (patch.type === 'insert') {
				return {
					insert: {
						after: patch.after,
						items: patch.items
					}
				};
			}
			// Additional patch types can be added as needed
			return patch;
		});

		// Execute the patch operations
		if (patchOperations.length > 0) {
			patch.execute(patchOperations);
		}
	}, [patch]);

	return patchDocument;
}

/**
 * Extracts field updates from AI assistant messages
 * @param message The assistant message to process
 * @param schemaType The schema type for validation
 * @returns Array of patch operations
 */
export function extractFieldUpdates(message: string, schemaType: any) {
	// This is a placeholder implementation that would parse message content
	// looking for structured field updates

	// Example field extraction pattern:
	// <field name="title">New Title Value</field>

	const fieldUpdates: any[] = [];
	const fieldRegex = /<field name="([^"]+)">([^<]+)<\/field>/g;
	let match;

	while ((match = fieldRegex.exec(message)) !== null) {
		const fieldName = match[1];
		const fieldValue = match[2];

		// Validate field exists in schema before adding update
		const fieldExists = schemaType.fields.some((field: any) => field.name === fieldName);

		if (fieldExists) {
			fieldUpdates.push({
				type: 'set',
				path: fieldName,
				value: fieldValue
			});
		}
	}

	return fieldUpdates;
}

/**
 * Creates a patch operation for setting a field value
 * @param fieldName Name of the field to update
 * @param value New value for the field
 * @returns Patch operation object
 */
export function createSetPatch(fieldName: string, value: any) {
	return {
		type: 'set',
		path: fieldName,
		value
	};
}

/**
 * Creates a patch operation for unsetting a field
 * @param fieldName Name of the field to unset
 * @returns Patch operation object
 */
export function createUnsetPatch(fieldName: string) {
	return {
		type: 'unset',
		path: fieldName
	};
} 