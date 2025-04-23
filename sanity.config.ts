// sanity.config.ts
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';

export default defineConfig({
	basePath: '/studio', // Important: must match your Studio route
	projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
	dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
	plugins: [structureTool()],
	schema: { types: [] }  // You'll define your schemas here or import them
});