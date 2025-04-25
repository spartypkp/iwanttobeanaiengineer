import { BookIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';

export const knowledgeBaseType = defineType({
	name: 'knowledgeBase',
	title: 'Knowledge Base',
	type: 'document',
	icon: BookIcon,
	fields: [
		defineField({
			name: 'title',
			title: 'Title',
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
			name: 'category',
			title: 'Category',
			type: 'string',
			options: {
				list: [
					{ title: 'Personal', value: 'personal' },
					{ title: 'Professional', value: 'professional' },
					{ title: 'Education', value: 'education' },
					{ title: 'Projects', value: 'projects' },
					{ title: 'Skills', value: 'skills' },
					{ title: 'Experience', value: 'experience' },
					{ title: 'Preferences', value: 'preferences' },
					{ title: 'FAQ', value: 'faq' },
				],
			},
			validation: Rule => Rule.required(),
		}),
		defineField({
			name: 'question',
			title: 'Question',
			description: 'The question this knowledge item answers (for FAQs)',
			type: 'text',
		}),
		defineField({
			name: 'content',
			title: 'Content',
			description: 'The main content of this knowledge item',
			type: 'text',
			rows: 6,
			validation: Rule => Rule.required(),
		}),
		defineField({
			name: 'keywords',
			title: 'Keywords',
			description: 'Keywords to help with search and retrieval',
			type: 'array',
			of: [{ type: 'string' }],
			validation: Rule => Rule.required(),
		}),
		defineField({
			name: 'relatedProjects',
			title: 'Related Projects',
			type: 'array',
			of: [
				{
					type: 'reference',
					to: [{ type: 'project' }],
				},
			],
		}),
		defineField({
			name: 'relatedSkills',
			title: 'Related Skills',
			type: 'array',
			of: [
				{
					type: 'reference',
					to: [{ type: 'skill' }],
				},
			],
		}),
		defineField({
			name: 'relatedKnowledge',
			title: 'Related Knowledge Items',
			type: 'array',
			of: [
				{
					type: 'reference',
					to: [{ type: 'knowledgeBase' }],
				},
			],
		}),
		defineField({
			name: 'source',
			title: 'Source',
			description: 'Where this information came from (if applicable)',
			type: 'string',
		}),
		defineField({
			name: 'lastVerified',
			title: 'Last Verified',
			description: 'When this information was last verified as accurate',
			type: 'date',
		}),
		defineField({
			name: 'priority',
			title: 'Priority',
			description: 'Higher priority items will be used preferentially when multiple match',
			type: 'number',
			initialValue: 5,
			validation: Rule => Rule.min(1).max(10),
		}),
		defineField({
			name: 'isPublic',
			title: 'Public Information',
			description: 'Is this information suitable for public consumption?',
			type: 'boolean',
			initialValue: true,
		}),
	],
	preview: {
		select: {
			title: 'title',
			subtitle: 'category',
			keywords: 'keywords',
		},
		prepare({ title, subtitle, keywords }) {
			return {
				title,
				subtitle: `${subtitle} | ${keywords?.join(', ') || 'No keywords'}`,
			};
		},
	},
}); 