import { CodeIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';

export const technologyType = defineType({
	name: 'technology',
	title: 'Technology',
	type: 'document',
	icon: CodeIcon,
	fields: [
		defineField({
			name: 'name',
			title: 'Technology Name',
			type: 'string',
			validation: Rule => Rule.required(),
		}),
		defineField({
			name: 'slug',
			title: 'Slug',
			type: 'slug',
			validation: Rule => Rule.required(),
			options: {
				source: 'name',
				maxLength: 96,
			},
		}),
		defineField({
			name: 'category',
			title: 'Category',
			type: 'string',
			options: {
				list: [
					{ title: 'Frontend', value: 'frontend' },
					{ title: 'Backend', value: 'backend' },
					{ title: 'Data', value: 'data' },
					{ title: 'DevOps', value: 'devops' },
					{ title: 'AI', value: 'ai' },
					{ title: 'Design', value: 'design' },
					{ title: 'Other', value: 'other' },
				],
			},
			validation: Rule => Rule.required(),
		}),
		defineField({
			name: 'description',
			title: 'Description',
			type: 'text',
			rows: 3,
		}),
		defineField({
			name: 'website',
			title: 'Official Website',
			type: 'url',
		}),
		defineField({
			name: 'logo',
			title: 'Logo',
			type: 'image',
			options: {
				hotspot: true,
			},
		}),
		defineField({
			name: 'color',
			title: 'Brand Color',
			description: 'The official brand color (hex code)',
			type: 'string',
			validation: Rule => Rule.regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).error('Must be a valid hex color code'),
		}),
		defineField({
			name: 'icon',
			title: 'Icon Name',
			description: 'Icon name from Lucide icons (e.g., "code", "database")',
			type: 'string',
		}),
		defineField({
			name: 'experience',
			title: 'Your Experience Level',
			type: 'object',
			fields: [
				{
					name: 'years',
					title: 'Years of Experience',
					type: 'number',
				},
				{
					name: 'level',
					title: 'Proficiency Level',
					type: 'string',
					options: {
						list: [
							{ title: 'Beginner', value: 'beginner' },
							{ title: 'Intermediate', value: 'intermediate' },
							{ title: 'Advanced', value: 'advanced' },
							{ title: 'Expert', value: 'expert' },
						],
					},
				},
				{
					name: 'notes',
					title: 'Personal Notes',
					type: 'text',
					rows: 2,
				},
			],
		}),
		defineField({
			name: 'featured',
			title: 'Featured Technology',
			description: 'Should this technology be highlighted in your skill set?',
			type: 'boolean',
			initialValue: false,
		}),
	],
	preview: {
		select: {
			title: 'name',
			subtitle: 'category',
			media: 'logo',
		},
		prepare({ title, subtitle, media }) {
			return {
				title,
				subtitle: subtitle ? `Category: ${subtitle}` : '',
				media,
			};
		},
	},
}); 