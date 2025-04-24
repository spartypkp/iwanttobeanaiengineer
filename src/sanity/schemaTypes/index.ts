import { type SchemaTypeDefinition } from 'sanity';

import { blockContentType } from './blockContentType';
import { projectCategoryType } from './projectCategoryType';
import { projectType } from './projectType';
import { technologyType } from './technologyType';

export const schema: { types: SchemaTypeDefinition[]; } = {
	types: [
		blockContentType,
		projectType,
		projectCategoryType,
		technologyType
	],
};
