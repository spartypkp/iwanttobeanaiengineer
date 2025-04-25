import { CodeIcon } from '@sanity/icons';
import type { DefaultDocumentNodeResolver, StructureResolver } from 'sanity/structure';

// Import the Content Copilot view
import { ContentCopilotView } from '@/components/dave-admin/sanity/ContentCopilotView';

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
	S.list()
		.title('Content')
		.items([
			S.listItem()
				.title('Home Page')
				.child(
					S.editor()
						.schemaType('home')
						.documentId('home')
						.title('Home Page')
				),
			S.listItem()
				.title('Projects')
				.schemaType('project')
				.child(S.documentTypeList('project').title('Projects')),
			S.listItem()
				.title('Skills')
				.schemaType('skill')
				.child(S.documentTypeList('skill').title('Skills')),
			S.listItem()
				.title('Knowledge Base')
				.schemaType('knowledgeBase')
				.child(
					S.documentTypeList('knowledgeBase').title('Knowledge Base')
				),
		]);

// Function to add the AI Assistant view to documents
export const defaultDocumentNode: DefaultDocumentNodeResolver = (S, { schemaType }) => {
	// Add the AI Assistant tab to all document types
	return S.document().views([
		// Default form view
		S.view.form(),

		// Custom AI Assistant view
		S.view.component(ContentCopilotView)
			.title('AI Assistant')
			.icon(CodeIcon)
	]);
};

