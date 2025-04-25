import { type SchemaTypeDefinition } from 'sanity';

import { blockContentType } from './blockContentType';
import { knowledgeBaseType } from './knowledgeBaseType';
import { projectCategoryType } from './projectCategoryType';
import { projectType } from './projectType';
import { skillType } from './skillType';
import { technologyType } from './technologyType';
import { workHistoryType } from './workHistoryType';

// Type Generation Instructions:
// npx sanity@latest schema extract --path=./src/sanity/schema.json   
// cd src/sanity
// npx sanity@latest typegen generate 
export const schema: { types: SchemaTypeDefinition[]; } = {
	types: [
		blockContentType,
		knowledgeBaseType,
		projectType,
		projectCategoryType,
		skillType,
		technologyType,
		workHistoryType
	],
};
