// utils/sanity/documentEditor.ts
import { client } from './client'; // Your configured Sanity client

/**
 * Updates a specific field in a Sanity document
 * Supports deep paths with dot notation (e.g., "timeline.status")
 */
export async function updateDocumentField(
	documentId: string,
	fieldPath: string,
	value: any
): Promise<void> {
	try {
		// Create a patch for the document
		const patch = client.patch(documentId);

		// Handle nested paths (e.g., "timeline.status" or "challenges[0].title")
		if (fieldPath.includes('.') || fieldPath.includes('[')) {
			// Use set with a nested path object
			// Convert path string to a nested object structure
			const pathObject = createNestedPathObject(fieldPath, value);
			patch.set(pathObject);
		} else {
			// Simple field, just set directly
			patch.set({ [fieldPath]: value });
		}

		// Commit the changes
		await patch.commit();
		console.log(`Successfully updated ${fieldPath} in document ${documentId}`);
	} catch (error) {
		console.error(`Error updating ${fieldPath}:`, error);
		throw error;
	}
}

/**
 * Creates a nested object from a path string
 * e.g., "timeline.status" => { timeline: { status: value } }
 * e.g., "challenges[0].title" => { challenges: { "0": { title: value } } }
 */
function createNestedPathObject(path: string, value: any): Record<string, any> {
	const result: Record<string, any> = {};
	let current = result;

	// Split the path into segments
	// This regex handles both dot notation and array indices
	const segments = path.split(/\.|\[|\]\.?/).filter(Boolean);

	for (let i = 0; i < segments.length; i++) {
		const segment = segments[i];
		const isLastSegment = i === segments.length - 1;

		if (isLastSegment) {
			current[segment] = value;
		} else {
			// Check if next segment is a number (array index)
			const isNextSegmentArrayIndex = /^\d+$/.test(segments[i + 1]);

			// Create a nested object or array depending on the next segment
			current[segment] = current[segment] || (isNextSegmentArrayIndex ? {} : {});
			current = current[segment];
		}
	}

	return result;
}


/**
 * Adds an item to an array field in a Sanity document
 */
export async function addItemToArray(
	documentId: string,
	arrayPath: string,
	item: any
): Promise<void> {
	try {
		// First get the current document to check field type
		const document = await client.getDocument(documentId);
		if (!document) {
			throw new Error(`Document not found: ${documentId}`);
		}

		// Get the current array if it exists to determine the field type
		const pathParts = arrayPath.split('.');
		const currentArray = getFieldValue(document, pathParts);

		// Different handling based on if this is a primitive array or object array
		let itemToInsert;

		// Check if this is a primitive array (strings, numbers)
		const isPrimitiveArray = Array.isArray(currentArray) &&
			currentArray.length > 0 &&
			typeof currentArray[0] !== 'object';

		// If we can't determine from existing array, try to infer from the item type
		const shouldBePrimitiveItem = typeof item !== 'object' ||
			// Common string array fields
			['tags', 'categories', 'learnings', 'achievements', 'results'].includes(arrayPath);

		if (isPrimitiveArray || shouldBePrimitiveItem) {
			// For arrays of primitives, just add the value directly
			// Sanity will handle generating _keys for primitive arrays
			itemToInsert = item;
		} else {
			// For arrays of objects, ensure there's a _key
			itemToInsert = item._key ? item : { ...item, _key: generateKey() };
		}

		// Use setIfMissing first to ensure the array exists
		const patch = client.patch(documentId).setIfMissing({ [arrayPath]: [] });

		// Then append to the array
		patch.append(arrayPath, [itemToInsert]);

		// Commit both operations
		await patch.commit();

		console.log(`Successfully added item to ${arrayPath} in document ${documentId}`);
	} catch (error) {
		console.error(`Error adding item to ${arrayPath}:`, error);
		throw error;
	}
}

/**
 * Removes an item from an array field in a Sanity document by its _key
 */
export async function removeItemFromArray(
	documentId: string,
	arrayPath: string,
	itemKey: string
): Promise<void> {
	try {
		// Use unset to remove the specific array item with matching _key
		await client
			.patch(documentId)
			.unset([`${arrayPath}[_key=="${itemKey}"]`])
			.commit();

		console.log(`Successfully removed item ${itemKey} from ${arrayPath}`);
	} catch (error) {
		console.error(`Error removing item from ${arrayPath}:`, error);
		throw error;
	}
}

/**
 * Generates a random key for Sanity array items
 */
function generateKey(): string {
	return Math.random().toString(36).substring(2, 10);
}


// Helper functions for field handling
function getFieldValue(document: Record<string, any>, pathParts: string[]): any {
	let current = document;
	for (const part of pathParts) {
		if (current === undefined || current === null) return undefined;
		current = current[part];
	}
	return current;
}

function formatValueForField(fieldPath: string, value: any, currentField: any): any {
	// If the current field is an array, make sure we're formatting correctly
	if (Array.isArray(currentField)) {
		// If value is already an array, ensure each item has the right structure
		if (Array.isArray(value)) {
			// For project schema's challenges field, ensure proper structure
			if (fieldPath === 'challenges') {
				return value.map((item, index) => {
					// Ensure each challenge has a title, description and _key
					if (typeof item === 'object') {
						return {
							...item,
							_key: item._key || `${Date.now()}_${index}`
						};
					}
					// If it's just a string, assume it's a description and create proper structure
					else if (typeof item === 'string') {
						return {
							title: `Challenge ${index + 1}`,
							description: item,
							_key: `${Date.now()}_${index}`
						};
					}
					return item;
				});
			}
			// For general array items, ensure each has a _key
			return value.map((item, index) => {
				if (typeof item === 'object' && !item._key) {
					return { ...item, _key: `${Date.now()}_${index}` };
				}
				return item;
			});
		}
		// If the value is a string but the field is an array, convert to array
		// This handles when the AI tries to write a string to an array field
		else if (typeof value === 'string') {
			// For challenges array specifically
			if (fieldPath === 'challenges') {
				return [{
					title: 'Challenge',
					description: value,
					_key: `${Date.now()}_0`
				}];
			}
			// For simple arrays (like tags or technologies)
			return [value];
		}
	}
	return value;
}

