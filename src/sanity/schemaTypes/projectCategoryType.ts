import { TagIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';

export const projectCategoryType = defineType({
	name: 'projectCategory',
	title: 'Project Category',
	type: 'document',
	icon: TagIcon,
	fields: [
		defineField({
			name: 'title',
			title: 'Category Title',
			type: 'string',
			validation: Rule => Rule.required(),
		}),
		defineField({
			name: 'slug',
			title: 'Slug',
			type: 'slug',
			validation: Rule => Rule.required(),
			options: {
				source: 'title',
				maxLength: 96,
			},
		}),
		defineField({
			name: 'description',
			title: 'Description',
			type: 'text',
			rows: 2,
		}),
		defineField({
			name: 'color',
			title: 'Display Color',
			description: 'Color for category badges and UI elements',
			type: 'string',
			validation: Rule => Rule.regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).error('Must be a valid hex color code'),
		}),
		defineField({
			name: 'icon',
			title: 'Icon',
			description: 'Icon name from Lucide icons set (e.g., "code", "database", "server")',
			type: 'string',
		}),
		defineField({
			name: 'displayOrder',
			title: 'Display Order',
			description: 'Order in which categories should be displayed (lower numbers first)',
			type: 'number',
			initialValue: 100,
		}),
	],
	preview: {
		select: {
			title: 'title',
			subtitle: 'description',
		},
	},
}); 