import { CodeIcon } from '@sanity/icons';
import type { DefaultDocumentNodeResolver, StructureResolver } from 'sanity/structure';

// Import the Content Copilot view
import { ContentCopilotView } from '@/components/dave-admin/sanity/ContentCopilotView';

// https://www.sanity.io/docs/structure-builder-cheat-sheet

export const structure: StructureResolver = (S) =>
	S.list().title('Base').items(
		S.documentTypeListItems() // <= example code goes here
	);


// Function to add the AI Assistant view to documents
export const defaultDocumentNode: DefaultDocumentNodeResolver = (S, { schemaType }) => {
	// Only add the Content Copilot for specific schema types

	// This initializes the document with both form view and Content Copilot view
	return S.document().views([
		// Default form view
		S.view.form(),

		// Content Copilot view - mark it as default so it opens automatically
		S.view.component(ContentCopilotView)
			.title('Content Copilot')
			.id('contentCopilot')
			.icon(CodeIcon)
			.options({ defaultView: true })
	]);



};

