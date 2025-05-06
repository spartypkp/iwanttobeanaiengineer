import { AutoPreviewPane } from '@/components/dave-admin/sanity/AutoPreviewPane';
import { DocumentIcon } from '@sanity/icons';
import { defineArrayMember, defineField, defineType } from 'sanity';

export const projectType = defineType({
	name: 'project',
	title: 'Project',
	type: 'document',
	icon: DocumentIcon,
	fields: [
		// Hidden field for auto-preview pane
		defineField({
			name: 'contentCopilotPreview',
			type: 'string',
			hidden: false, // Make visible for debugging
			description: 'This field enables auto-preview',
			components: {
				field: AutoPreviewPane,
			},
		}),

		// Basic Project Information
		defineField({
			name: 'title',
			title: 'Project Title',
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
			name: 'id',
			title: 'Project ID',
			description: 'A unique identifier for the project (used for routing and code references)',
			type: 'string',
			validation: Rule => Rule.required().regex(/^[a-z0-9-]+$/).error('Project ID must be lowercase, numbers, and hyphens only'),
		}),
		defineField({
			name: 'description',
			title: 'Short Description',
			description: 'A brief overview of the project (1-2 sentences)',
			type: 'text',
			rows: 3,
			validation: Rule => Rule.required().max(250),
		}),
		defineField({
			name: 'company',
			title: 'Company/Organization',
			description: 'The company or organization associated with this project',
			type: 'string',
		}),
		defineField({
			name: 'isFeatured',
			title: 'Featured Project',
			description: 'Should this project be displayed on the home page?',
			type: 'boolean',
			initialValue: false,
		}),
		defineField({
			name: 'primaryColor',
			title: 'Primary Color',
			description: 'The main color theme for this project (used for styling)',
			type: 'string',
			validation: Rule => Rule.regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).error('Must be a valid hex color code'),
		}),

		// Timeline and Status
		defineField({
			name: 'timeline',
			title: 'Timeline',
			type: 'object',
			fields: [
				{
					name: 'startDate',
					title: 'Start Date',
					type: 'date',
					validation: Rule => Rule.required(),
				},
				{
					name: 'endDate',
					title: 'End Date',
					type: 'date',
				},
				{
					name: 'status',
					title: 'Project Status',
					type: 'string',
					options: {
						list: [
							{ title: 'Active', value: 'active' },
							{ title: 'Completed', value: 'completed' },
							{ title: 'Maintenance', value: 'maintenance' },
							{ title: 'Archived', value: 'archived' },
							{ title: 'Concept', value: 'concept' },
						],
					},
					validation: Rule => Rule.required(),
				},
			],
			validation: Rule => Rule.required(),
		}),

		// Project Storytelling Components
		defineField({
			name: 'problem',
			title: 'Problem Statement',
			description: 'The problem this project aims to solve',
			type: 'text',
			rows: 4,
		}),
		defineField({
			name: 'solution',
			title: 'Solution Overview',
			description: 'How this project addresses the problem',
			type: 'text',
			rows: 4,
		}),
		defineField({
			name: 'challenges',
			title: 'Challenges',
			description: 'Key challenges faced during the project',
			type: 'array',
			of: [
				{
					type: 'object',
					fields: [
						{
							name: 'title',
							title: 'Challenge Title',
							type: 'string',
							validation: Rule => Rule.required(),
						},
						{
							name: 'description',
							title: 'Challenge Description',
							type: 'text',
							rows: 3,
							validation: Rule => Rule.required(),
						},
					],
				},
			],
		}),
		defineField({
			name: 'approach',
			title: 'Approach',
			description: 'How you approached solving the challenges',
			type: 'array',
			of: [
				{
					type: 'object',
					fields: [
						{
							name: 'title',
							title: 'Approach Title',
							type: 'string',
							validation: Rule => Rule.required(),
						},
						{
							name: 'description',
							title: 'Approach Description',
							type: 'text',
							rows: 3,
							validation: Rule => Rule.required(),
						},
					],
				},
			],
		}),
		defineField({
			name: 'technicalInsights',
			title: 'Technical Insights',
			description: 'Key technical insights or innovations from the project',
			type: 'array',
			of: [
				{
					type: 'object',
					fields: [
						{
							name: 'title',
							title: 'Insight Title',
							type: 'string',
							validation: Rule => Rule.required(),
						},
						{
							name: 'description',
							title: 'Insight Description',
							type: 'text',
							rows: 3,
							validation: Rule => Rule.required(),
						},
						{
							name: 'code',
							title: 'Code Snippet',
							type: 'text',
							rows: 5,
						},
						{
							name: 'language',
							title: 'Programming Language',
							type: 'string',
							description: 'Language of the code snippet for syntax highlighting',
						},
					],
				},
			],
		}),
		defineField({
			name: 'learnings',
			title: 'Key Learnings',
			description: 'What you learned from this project',
			type: 'array',
			of: [defineArrayMember({ type: 'string' })],
		}),
		defineField({
			name: 'achievements',
			title: 'Achievements',
			description: 'Key accomplishments or milestones',
			type: 'array',
			of: [defineArrayMember({ type: 'string' })],
		}),
		defineField({
			name: 'personalContribution',
			title: 'Personal Contribution',
			description: 'Your specific role and contributions to the project',
			type: 'text',
			rows: 3,
		}),
		defineField({
			name: 'results',
			title: 'Results',
			description: 'Measurable outcomes or results of the project',
			type: 'array',
			of: [defineArrayMember({ type: 'string' })],
		}),

		// Project Metrics
		defineField({
			name: 'metrics',
			title: 'Project Metrics',
			description: 'Quantifiable metrics showcasing project impact',
			type: 'array',
			of: [
				{
					type: 'object',
					fields: [
						{
							name: 'label',
							title: 'Metric Label',
							type: 'string',
							validation: Rule => Rule.required(),
						},
						{
							name: 'value',
							title: 'Metric Value',
							type: 'number',
							validation: Rule => Rule.required(),
						},
						{
							name: 'unit',
							title: 'Unit',
							type: 'string',
							description: 'E.g., %, K, M, etc.',
						},
					],
				},
			],
		}),

		// Technologies
		defineField({
			name: 'technologies',
			title: 'Technologies Used',
			type: 'array',
			of: [
				{
					type: 'object',
					fields: [
						{
							name: 'name',
							title: 'Technology Name',
							type: 'string',
							validation: Rule => Rule.required(),
						},
						{
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
						},
						{
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
						},
					],
				},
			],
			validation: Rule => Rule.required().min(1),
		}),

		// Categories and Tags
		defineField({
			name: 'categories',
			title: 'Categories',
			description: 'Project categories (e.g., AI, Web Development, Data Engineering)',
			type: 'array',
			of: [defineArrayMember({ type: 'string' })],
			validation: Rule => Rule.unique(),
		}),
		defineField({
			name: 'tags',
			title: 'Tags',
			description: 'Tags to help with filtering and discovery',
			type: 'array',
			of: [defineArrayMember({ type: 'string' })],
			validation: Rule => Rule.unique(),
		}),
		defineField({
			name: 'complexity',
			title: 'Project Complexity',
			type: 'string',
			options: {
				list: [
					{ title: 'Simple', value: 'simple' },
					{ title: 'Medium', value: 'medium' },
					{ title: 'Complex', value: 'complex' },
					{ title: 'Enterprise', value: 'enterprise' },
				],
			},
		}),

		// Media
		defineField({
			name: 'thumbnail',
			title: 'Project Thumbnail',
			description: 'The main image used for project cards and listings (separate from media gallery)',
			type: 'image',
			options: {
				hotspot: true,
			},
			fields: [
				{
					name: 'alt',
					type: 'string',
					title: 'Alternative Text',
					validation: Rule => Rule.required(),
				},
			],
			validation: Rule => Rule.required(),
		}),
		defineField({
			name: 'media',
			title: 'Project Media',
			description: 'Images, videos, or demos showcasing the project',
			type: 'array',
			of: [
				{
					type: 'object',
					fields: [
						{
							name: 'type',
							title: 'Media Type',
							type: 'string',
							options: {
								list: [
									{ title: 'Image', value: 'image' },
									{ title: 'Video', value: 'video' },
									{ title: 'Demo', value: 'demo' },
									{ title: '3D Model', value: '3d' },
								],
							},
							validation: Rule => Rule.required(),
						},
						{
							name: 'videoSource',
							title: 'Video Source',
							type: 'string',
							options: {
								list: [
									{ title: 'Upload', value: 'upload' },
									{ title: 'External URL', value: 'url' },
								],
							},
							hidden: ({ parent }) => parent?.type !== 'video',
							validation: Rule =>
								Rule.custom((value, context) => {
									const parent = context.parent as { type?: string; };
									if (parent?.type === 'video' && !value) return 'Required for videos';
									return true;
								}),
						},
						{
							name: 'videoFile',
							title: 'Video File',
							type: 'file',
							hidden: ({ parent }) => parent?.type !== 'video' || parent?.videoSource !== 'upload',
							options: {
								accept: 'video/*'
							},
							validation: Rule =>
								Rule.custom((value, context) => {
									const parent = context.parent as { type?: string, videoSource?: string; };
									if (parent?.type === 'video' &&
										parent?.videoSource === 'upload' &&
										!value) return 'Required for uploaded videos';
									return true;
								}),
						},
						{
							name: 'image',
							title: 'Image',
							type: 'image',
							hidden: ({ parent }) => parent?.type !== 'image',
							options: {
								hotspot: true,
							},
							fields: [
								{
									name: 'alt',
									type: 'string',
									title: 'Alternative Text',
								},
							],
						},
						{
							name: 'url',
							title: 'URL',
							description: 'External URL for video, demo or 3D content',
							type: 'url',
							hidden: ({ parent }) => parent?.type === 'image' || (parent?.type === 'video' && parent?.videoSource === 'upload'),
						},
						{
							name: 'alt',
							title: 'Alternative Text',
							type: 'string',
							hidden: ({ parent }) => parent?.type === 'image',
						},
						{
							name: 'poster',
							title: 'Poster Image',
							type: 'image',
							description: 'Thumbnail for videos (shown before video playback begins)',
							hidden: ({ parent }) => parent?.type !== 'video',
						},
						{
							name: 'featured',
							title: 'Featured Media',
							description: 'Feature this item prominently in the media gallery',
							type: 'boolean',
							initialValue: false,
						},
						{
							name: 'caption',
							title: 'Caption',
							description: 'Optional caption describing this media item',
							type: 'string',
						},
					],
				},
			],
		}),

		// Links
		defineField({
			name: 'github',
			title: 'GitHub Repository',
			type: 'url',
		}),
		defineField({
			name: 'demoUrl',
			title: 'Live Demo URL',
			type: 'url',
		}),
		defineField({
			name: 'caseStudyUrl',
			title: 'Case Study URL',
			type: 'url',
		}),
		defineField({
			name: 'blogPosts',
			title: 'Related Blog Posts',
			type: 'array',
			of: [
				{
					type: 'object',
					fields: [
						{
							name: 'title',
							title: 'Post Title',
							type: 'string',
							validation: Rule => Rule.required(),
						},
						{
							name: 'url',
							title: 'Post URL',
							type: 'url',
							validation: Rule => Rule.required(),
						},
					],
				},
			],
		}),
		defineField({
			name: 'documentation',
			title: 'Documentation URL',
			type: 'url',
		}),
	],
	preview: {
		select: {
			title: 'title',
			company: 'company',
			status: 'timeline.status',
			media: 'thumbnail',
		},
		prepare({ title, company, status, media }) {
			const subtitleParts = [];
			if (company) subtitleParts.push(company);
			if (status) subtitleParts.push(`Status: ${status}`);

			return {
				title,
				subtitle: subtitleParts.join(' • '),
				media,
			};
		},
	},
}); 