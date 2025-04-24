import type { StructureResolver } from 'sanity/structure';

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
	S.list()
		.title('Portfolio Content')
		.items([
			// Main document types
			S.documentTypeListItem('project')
				.title('Projects'),

			// Divider
			S.divider(),

			// Projects By Category - a dynamic filtered view
			S.listItem()
				.title('Projects By Category')
				.child(
					S.documentTypeList('projectCategory')
						.title('Projects by Category')
						.child((categoryId) =>
							S.documentList()
								.apiVersion('v2023-01-01')
								.title('Projects')
								.filter('_type == "project" && $categoryId in categories[]._ref')
								.params({ categoryId }),
						),
				),

			// Taxonomy & Configuration section
			S.listItem()
				.title('Taxonomy & Configuration')
				.child(
					S.list()
						.title('Taxonomy & Configuration')
						.items([
							S.documentTypeListItem('projectCategory')
								.title('Project Categories'),
							S.documentTypeListItem('technology')
								.title('Technologies'),
						]),
				),
		]);
