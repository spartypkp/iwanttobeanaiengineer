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

/**
 * Fetches a related document by ID
 * @param documentId The ID of the document to fetch
 * @param projection Optional GROQ projection for specific fields
 * @returns The document data or null if not found
 */
export async function fetchRelatedDocument(
	documentId: string,
	projection: string = '*'
): Promise<Record<string, any> | null> {
	try {
		// Use proper GROQ syntax with parameterization
		// The projection needs to be properly formatted based on whether it's a '*' or a custom projection
		const query = projection === '*'
			? `*[_id == $documentId][0]`
			: `*[_id == $documentId][0]{${projection}}`;

		const document = await client.fetch(
			query,
			{ documentId }
		);

		return document || null;
	} catch (error) {
		console.error(`Error fetching related document ${documentId}:`, error);
		return null;
	}
}

/**
 * Fetches related documents based on references in a specific field
 * @param documentId The ID of the source document
 * @param referenceField The field containing references (e.g., "relatedProjects")
 * @param projection Optional GROQ projection for the related documents
 * @returns Array of related documents
 */
export async function fetchReferencedDocuments(
	documentId: string,
	referenceField: string,
	projection: string = '*'
): Promise<Record<string, any>[]> {
	try {
		// First get the source document to extract the references
		const document = await client.fetch(
			`*[_id == $documentId][0]{${referenceField}}`,
			{ documentId }
		);

		if (!document || !document[referenceField]) {
			return [];
		}

		// Get the array of references
		const references = document[referenceField];

		// If it's not an array or empty, return empty result
		if (!Array.isArray(references) || references.length === 0) {
			return [];
		}

		// Extract the reference IDs
		const referenceIds = references
			.filter(ref => ref._ref) // Make sure it has a _ref property
			.map(ref => ref._ref);

		if (referenceIds.length === 0) {
			return [];
		}

		// Fetch all referenced documents in a single query
		const referencedDocuments = await client.fetch(
			`*[_id in $referenceIds]{${projection}}`,
			{ referenceIds }
		);

		return referencedDocuments || [];
	} catch (error) {
		console.error(`Error fetching referenced documents for ${documentId}.${referenceField}:`, error);
		return [];
	}
}

/**
 * Recursively resolves references in a document
 * @param documentId The ID of the document to resolve references for
 * @param depth Maximum depth to resolve (default 1)
 * @param fieldsToResolve Array of field names to resolve references for
 * @returns Document with resolved references
 */
export async function resolveDocumentReferences(
	documentId: string,
	depth: number = 1,
	fieldsToResolve: string[] = []
): Promise<Record<string, any> | null> {
	if (depth < 1) {
		return fetchRelatedDocument(documentId);
	}

	try {
		// First get the document
		const document = await fetchRelatedDocument(documentId);

		if (!document) {
			return null;
		}

		// Create a copy to avoid modifying the original
		const result = { ...document };

		// If no specific fields provided, try to find all reference fields
		const fieldsToProcess = fieldsToResolve.length > 0
			? fieldsToResolve
			: Object.keys(document).filter(key =>
				Array.isArray(document[key]) &&
				document[key].length > 0 &&
				document[key][0]?._ref
			);

		// Process each field with references
		for (const field of fieldsToProcess) {
			if (Array.isArray(document[field]) && document[field].some(item => item._ref)) {
				// Fetch all referenced documents for this field
				const referencedDocs = await fetchReferencedDocuments(documentId, field);

				// Replace the references with the actual documents
				if (referencedDocs.length > 0) {
					// If we need to go deeper, resolve references in the referenced documents
					if (depth > 1) {
						const resolvedRefs = await Promise.all(
							referencedDocs.map(doc =>
								resolveDocumentReferences(doc._id, depth - 1, fieldsToResolve)
							)
						);
						result[field] = resolvedRefs.filter(Boolean);
					} else {
						result[field] = referencedDocs;
					}
				}
			}
		}

		return result;
	} catch (error) {
		console.error(`Error resolving references for document ${documentId}:`, error);
		return null;
	}
}

/**
 * Gets all available document types from the Sanity schema
 * @returns Array of document types with their metadata
 */
export async function getAllDocumentTypes(): Promise<Array<{
	name: string;
	title: string;
	count: number;
	description?: string;
}>> {
	try {
		// First get the list of document types with counts
		const typesWithCounts = await client.fetch(`
			*[defined(_type)] {
				_type
			} | group by _type | {
				"types": [
					{
						"name": _key,
						"count": count(*[_type == _key])
					}
				]
			}.types
		`);

		// Filter out system types
		const systemTypes = ['sanity.imageAsset', 'sanity.fileAsset', 'media.tag'];
		const filteredTypes = typesWithCounts.filter(
			(type: { name: string; }) => !systemTypes.includes(type.name)
		);

		// Enhance with display titles if possible
		// This is an approximation - for a complete solution, you'd reference
		// the actual schema definition
		const enhancedTypes = filteredTypes.map((type: { name: string; count: number; }) => {
			// Convert camelCase or snake_case to Title Case
			const formattedTitle = type.name
				.replace(/([A-Z])/g, ' $1') // Insert space before capital letters
				.replace(/_/g, ' ') // Replace underscores with spaces
				.toLowerCase()
				.split(' ')
				.map(word => word.charAt(0).toUpperCase() + word.slice(1))
				.join(' ');

			return {
				name: type.name,
				title: formattedTitle,
				count: type.count,
				description: `${formattedTitle} content type`
			};
		});

		return enhancedTypes;
	} catch (error) {
		console.error('Error getting document types:', error);
		return [];
	}
}

/**
 * Lists documents of a specific type with basic information
 * @param documentType The type of documents to list (e.g., 'project', 'skill')
 * @param limit Maximum number of documents to return (default: 100)
 * @param offset Number of documents to skip (for pagination)
 * @param orderBy Field to sort by, prepend with '-' for descending (e.g., '-_createdAt')
 * @param filter Optional additional GROQ filter conditions
 * @returns Array of documents with basic metadata
 */
export async function listDocumentsByType(
	documentType: string,
	limit: number = 100,
	offset: number = 0,
	orderBy: string = '_createdAt',
	filter: string = ''
): Promise<Array<Record<string, any>>> {
	try {
		// Build the filter string
		const filterString = filter ? ` && ${filter}` : '';

		// Create a GROQ query that gets essential fields
		const query = `
			*[_type == $documentType${filterString}] | order(${orderBy}) [${offset}...${offset + limit}] {
				_id,
				_type,
				_createdAt,
				_updatedAt,
				"title": coalesce(title, name, slug.current, "Untitled"),
				"description": coalesce(description, "No description"),
				"slug": slug.current,
				"status": timeline.status
			}
		`;

		const documents = await client.fetch(query, { documentType });
		return documents || [];
	} catch (error) {
		console.error(`Error listing documents of type ${documentType}:`, error);
		return [];
	}
}

/**
 * Generic helper for writing any value at any path in a document
 * Provides more flexibility than updateDocumentField
 */
export async function writeToPath(
	documentId: string,
	path: string,
	value: any,
	createIfMissing: boolean = true
): Promise<{ success: boolean; documentId: string; path: string; error?: any; }> {
	try {
		const patch = client.patch(documentId);

		// Handle missing parent paths if needed
		if (createIfMissing) {
			const pathSegments = path.split(/\.|\[|\]\.?/).filter(Boolean);
			let currentPath = '';

			// Set missing parent objects/arrays
			for (let i = 0; i < pathSegments.length - 1; i++) {
				currentPath = currentPath ? `${currentPath}.${pathSegments[i]}` : pathSegments[i];
				patch.setIfMissing({ [currentPath]: isArrayIndex(pathSegments[i + 1]) ? [] : {} });
			}
		}

		// Set the value
		patch.set(createNestedPathObject(path, value));
		await patch.commit();

		console.log(`Successfully wrote value at path "${path}" in document ${documentId}`);
		return { success: true, documentId, path };
	} catch (error) {
		console.error(`Error writing to path ${path}:`, error);
		// Ensure the error is serializable if it's a complex object
		const serializableError = error instanceof Error ? { message: error.message, name: error.name, stack: error.stack } : error;
		return { success: false, documentId, path, error: serializableError };
	}
}

/**
 * Helper to check if a path segment is an array index
 */
function isArrayIndex(segment: string): boolean {
	return /^\d+$/.test(segment) || segment.startsWith('_key==');
}

/**
 * Delete/unset a value at any path
 */
export async function deleteFromPath(
	documentId: string,
	path: string
): Promise<void> {
	try {
		await client
			.patch(documentId)
			.unset([path])
			.commit();

		console.log(`Successfully deleted value at path "${path}" in document ${documentId}`);
	} catch (error) {
		console.error(`Error deleting from path ${path}:`, error);
		throw error;
	}
}

/**
 * Perform operations on arrays
 */
export async function performArrayOperation(
	documentId: string,
	path: string,
	operation: 'append' | 'prepend' | 'insert' | 'remove' | 'replace',
	items: any[] = [],
	at?: number | string,
	position?: 'before' | 'after' | 'replace'
): Promise<void> {
	try {
		let patch = client.patch(documentId);

		// Create array if it doesn't exist
		patch = patch.setIfMissing({ [path]: [] });

		// Handle the requested operation
		switch (operation) {
			case 'append':
				patch = patch.append(path, items.map(ensureItemKey));
				break;

			case 'prepend':
				patch = patch.prepend(path, items.map(ensureItemKey));
				break;

			case 'insert':
				if (typeof at === 'number') {
					// Using index
					patch = patch.insert(position || 'after', `${path}[${at}]`, items.map(ensureItemKey));
				} else if (typeof at === 'string') {
					// Using _key
					patch = patch.insert(position || 'after', `${path}[_key=="${at}"]`, items.map(ensureItemKey));
				}
				break;

			case 'remove':
				if (typeof at === 'number') {
					patch = patch.unset([`${path}[${at}]`]);
				} else if (typeof at === 'string') {
					patch = patch.unset([`${path}[_key=="${at}"]`]);
				}
				break;

			case 'replace':
				if (typeof at === 'number') {
					patch = patch.insert('replace', `${path}[${at}]`, items.map(ensureItemKey));
				} else if (typeof at === 'string') {
					patch = patch.insert('replace', `${path}[_key=="${at}"]`, items.map(ensureItemKey));
				}
				break;
		}

		await patch.commit();

		console.log(`Successfully performed "${operation}" on array at "${path}" in document ${documentId}`);
	} catch (error) {
		console.error(`Error performing array operation on ${path}:`, error);
		throw error;
	}
}

/**
 * Enhanced query function that handles both simple queries and custom GROQ
 */
export async function queryDocuments(
	options: {
		type?: string;
		id?: string;
		field?: string;
		value?: any;
		limit?: number;
		groq?: string;
		projection?: string;
	}
): Promise<any[]> {
	try {
		const { type, id, field, value, limit = 10, groq, projection = '*' } = options;
		let query;
		let params: Record<string, any> = {};

		// Allow custom GROQ or build simple query
		if (groq) {
			query = groq;
		} else if (id) {
			query = projection === '*'
				? `*[_id == $id][0]`
				: `*[_id == $id][0]{${projection}}`;
			params.id = id;
		} else {
			// Build query from parameters
			let filters = [];
			if (type) {
				filters.push('_type == $type');
				params.type = type;
			}
			if (field && value !== undefined) {
				filters.push(`${field} == $value`);
				params.value = value;
			}

			const filterStr = filters.length > 0 ? `[${filters.join(' && ')}]` : '';
			query = `*${filterStr}`;

			// Add projection
			if (projection === '*') {
				query += ``;
			} else {
				query += `{${projection}}`;
			}

			// Add limit
			if (limit) {
				query += `[0...${limit}]`;
			}
		}

		const results = await client.fetch(query, params);

		// Ensure results is always an array
		return Array.isArray(results) ? results : [results].filter(Boolean);
	} catch (error) {
		console.error(`Error querying documents:`, error);
		throw error;
	}
}

/**
 * Helper to ensure array items have _key for object arrays
 */
function ensureItemKey(item: any): any {
	if (typeof item === 'object' && item !== null && !item._key) {
		return { ...item, _key: Math.random().toString(36).substring(2, 9) };
	}
	return item;
}

