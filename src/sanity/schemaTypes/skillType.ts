import { AutoPreviewPane } from '@/components/content-copilot/AutoPreviewPane';
import { StarIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';

export const skillType = defineType({
	name: 'skill',
	title: 'Skill',
	type: 'document',
	icon: StarIcon,
	fields: [
		// Hidden field for auto-preview pane
		defineField({
			name: 'contentCopilotPreview',
			type: 'string',
			hidden: true,
			components: {
				field: AutoPreviewPane,
			},
		}),
		defineField({
			name: 'name',
			title: 'Skill Name',
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
					{ title: 'Programming Languages', value: 'programming' },
					{ title: 'Frameworks', value: 'frameworks' },
					{ title: 'AI & Machine Learning', value: 'ai' },
					{ title: 'Cloud & Infrastructure', value: 'cloud' },
					{ title: 'Tools & Software', value: 'tools' },
					{ title: 'Soft Skills', value: 'soft' },
					{ title: 'Domain Knowledge', value: 'domain' },
				],
			},
			validation: Rule => Rule.required(),
		}),
		defineField({
			name: 'description',
			title: 'Description',
			description: 'Detailed explanation of this skill and how it is applied',
			type: 'text',
			rows: 4,
			validation: Rule => Rule.required(),
		}),
		defineField({
			name: 'proficiency',
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
			validation: Rule => Rule.required(),
		}),
		defineField({
			name: 'yearsExperience',
			title: 'Years of Experience',
			type: 'number',
			validation: Rule => Rule.min(0),
		}),
		defineField({
			name: 'projects',
			title: 'Related Projects',
			description: 'Projects where this skill was applied',
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
			description: 'Other skills that are related to this one',
			type: 'array',
			of: [
				{
					type: 'reference',
					to: [{ type: 'skill' }],
				},
			],
		}),
		defineField({
			name: 'technologies',
			title: 'Related Technologies',
			description: 'Technologies associated with this skill',
			type: 'array',
			of: [
				{
					type: 'reference',
					to: [{ type: 'technology' }],
				},
			],
		}),
		defineField({
			name: 'examples',
			title: 'Examples',
			description: 'Specific examples of how this skill has been applied',
			type: 'array',
			of: [
				{
					type: 'object',
					fields: [
						{
							name: 'title',
							title: 'Title',
							type: 'string',
							validation: Rule => Rule.required(),
						},
						{
							name: 'description',
							title: 'Description',
							type: 'text',
							rows: 3,
						},
						{
							name: 'code',
							title: 'Code Example',
							type: 'text',
							rows: 5,
						},
						{
							name: 'language',
							title: 'Programming Language',
							type: 'string',
						},
					],
				},
			],
		}),
		defineField({
			name: 'resources',
			title: 'Learning Resources',
			description: 'Useful resources for learning more about this skill',
			type: 'array',
			of: [
				{
					type: 'object',
					fields: [
						{
							name: 'title',
							title: 'Title',
							type: 'string',
							validation: Rule => Rule.required(),
						},
						{
							name: 'url',
							title: 'URL',
							type: 'url',
						},
						{
							name: 'type',
							title: 'Resource Type',
							type: 'string',
							options: {
								list: [
									{ title: 'Course', value: 'course' },
									{ title: 'Book', value: 'book' },
									{ title: 'Article', value: 'article' },
									{ title: 'Video', value: 'video' },
									{ title: 'Documentation', value: 'docs' },
									{ title: 'Other', value: 'other' },
								],
							},
						},
					],
				},
			],
		}),
		defineField({
			name: 'featured',
			title: 'Featured Skill',
			description: 'Should this skill be highlighted in your skill set?',
			type: 'boolean',
			initialValue: false,
		}),
	],
	preview: {
		select: {
			title: 'name',
			subtitle: 'category',
			description: 'description',
			proficiency: 'proficiency',
		},
		prepare({ title, subtitle, proficiency }) {
			return {
				title,
				subtitle: `${subtitle} | ${proficiency || 'Unknown'} proficiency`,
			};
		},
	},
}); 