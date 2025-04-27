import {
	type ArraySchemaType,
	type ObjectField,
	type ObjectSchemaType,
	type ReferenceSchemaType,
	type SchemaType
} from '@sanity/types';

// Interfaces for serializable schema
export interface SerializableSchema {
	name: string;
	title?: string;
	type: string;
	fields: SerializableField[];
}

export interface SerializableField {
	name: string;
	title?: string;
	type: string;
	description?: string;
	isRequired?: boolean;
	arrayOf?: SerializableSchemaType[];
	reference?: ReferenceInfo;
	fields?: SerializableField[];
	options?: Record<string, unknown>;
}

export interface SerializableSchemaType {
	type: string;
	title?: string;
	fields?: SerializableField[];
}

export interface ReferenceInfo {
	to: SerializableSchemaType[];
}

// Schema field information for API utilities
export interface SchemaField {
	name: string;
	type: string;
	title: string;
	description?: string;
	required: boolean;
}

export interface SchemaInfo {
	name: string;
	title: string;
	type: string;
	fields: SchemaField[];
}

// Type guard functions to safely determine schema types
export function isObjectSchemaType(schema: SchemaType): schema is ObjectSchemaType {
	return schema.jsonType === 'object' && 'fields' in schema;
}

export function isArraySchemaType(schema: SchemaType): schema is ArraySchemaType {
	return schema.jsonType === 'array' && 'of' in schema;
}

export function isReferenceSchemaType(schema: SchemaType): schema is ReferenceSchemaType {
	return schema.name === 'reference' && schema.jsonType === 'object';
}

// Helper function to serialize a field's validation rules
export function serializeValidation(field: SchemaType): boolean {
	if (!field.validation) return false;

	// Simple string-based check for required validation in function
	if (Array.isArray(field.validation)) {
		return field.validation.some(rule => {
			// Check function-based validation rules
			if (typeof rule === 'function') {
				const ruleString = rule.toString();
				return ruleString.includes('required()') || ruleString.includes('required(true)');
			}

			// Check object-based validation rules safely
			if (typeof rule === 'object' && rule !== null && '_rules' in rule) {
				const rules = rule._rules;
				if (Array.isArray(rules)) {
					// Convert to string representation for safer checking
					return rules.some(r =>
						typeof r === 'object' &&
						r !== null &&
						'flag' in r &&
						String(r.flag) === 'required'
					);
				}
			}
			return false;
		});
	}

	return false;
}

// Helper function to process schema types recursively
export function serializeSchemaType(schemaType: SchemaType): SerializableSchemaType {
	const baseInfo: SerializableSchemaType = {
		type: schemaType.jsonType,
		title: schemaType.title
	};

	// If it's an object type with fields, process them
	if (isObjectSchemaType(schemaType) && schemaType.fields) {
		baseInfo.fields = schemaType.fields.map(serializeField);
	}

	return baseInfo;
}

// Helper function to process an individual field
export function serializeField(field: ObjectField): SerializableField {
	const fieldType = field.type;

	// Basic field info
	const fieldInfo: SerializableField = {
		name: field.name,
		title: fieldType.title,
		type: fieldType.jsonType,
		description: fieldType.description,
	};

	// Process validation
	try {
		fieldInfo.isRequired = serializeValidation(fieldType);
	} catch (e) {
		fieldInfo.isRequired = false;
	}

	// Process array types
	if (isArraySchemaType(fieldType)) {
		fieldInfo.arrayOf = fieldType.of.map(memberType => serializeSchemaType(memberType));
	}

	// Process reference types
	if (isReferenceSchemaType(fieldType) && fieldType.to) {
		fieldInfo.reference = {
			to: fieldType.to.map(refTarget => serializeSchemaType(refTarget))
		};
	}

	// Process object types with nested fields
	if (isObjectSchemaType(fieldType) && fieldType.fields) {
		fieldInfo.fields = fieldType.fields.map(serializeField);
	}

	// Include options if any
	if (fieldType.options) {
		fieldInfo.options = { ...fieldType.options };
	}

	return fieldInfo;
}

// Create a clean schema representation function
export function createSerializableSchema(schemaType: ObjectSchemaType): SerializableSchema | null {
	if (!schemaType) return null;

	// Extract basic schema info
	const result: SerializableSchema = {
		name: schemaType.name,
		title: schemaType.title,
		type: schemaType.jsonType,
		fields: []
	};

	// Process fields if they exist
	if (schemaType.fields) {
		result.fields = schemaType.fields.map(serializeField);
	}

	return result;
}

// Helper function to extract schema information without circular references
export function extractSchemaInfo(schemaType: any): SchemaInfo {
	// Basic schema info extraction
	const info: SchemaInfo = {
		name: schemaType.name,
		title: schemaType.title || schemaType.name,
		type: schemaType.type,
		fields: []
	};

	// Extract fields if available
	if (schemaType.fields && Array.isArray(schemaType.fields)) {
		info.fields = schemaType.fields.map((field: any) => ({
			name: field.name,
			type: field.type,
			title: field.title || field.name,
			description: field.description || '',
			required: getIsRequired(field)
		}));
	}

	return info;
}

// Helper to format schema fields for the prompt
export function formatSchemaFieldsForPrompt(schemaInfo: SchemaInfo): string {
	if (!schemaInfo.fields || schemaInfo.fields.length === 0) {
		return '';
	}

	return `
Document schema fields:
${schemaInfo.fields.map((field) =>
		`- ${field.name} (${field.type}): ${field.title}${field.required ? ' (required)' : ''}${field.description ? `\n  Description: ${field.description}` : ''}`
	).join('\n')}
`;
}

// Helper to determine if a field is required
export function getIsRequired(field: any): boolean {
	if (!field.validation) return false;

	// Check various validation patterns
	if (Array.isArray(field.validation)) {
		return field.validation.some((rule: any) =>
			(rule._rules && rule._rules.some((r: any) => String(r.flag) === 'required')) ||
			(typeof rule === 'function' && rule.toString().includes('required()'))
		);
	}

	return false;
} 