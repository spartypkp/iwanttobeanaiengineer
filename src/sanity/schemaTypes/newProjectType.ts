import { DocumentIcon } from '@sanity/icons';
import { defineArrayMember, defineField, defineType } from 'sanity';
import { AutoPreviewPane } from '../../components/content-copilot/AutoPreviewPane';

export const projectType = defineType({
	name: 'project',
	title: 'Project',
	type: 'document',
	icon: DocumentIcon,
	fields: [
		// Content Copilot Integration
		defineField({
			name: 'contentCopilotPreview',
			type: 'string',
			hidden: false, // Make visible for debugging
			description: 'This field enables real-time preview when using Content Copilot. Not meant to be edited directly.',
			components: {
				field: AutoPreviewPane,
			},
		}),

		// ======= BASIC PROJECT INFORMATION =======
		defineField({
			name: 'title',
			title: 'Project Title',
			description: 'The name of your project as you want it to appear across the site',
			type: 'string',
			validation: Rule => Rule.required(),
		}),
		defineField({
			name: 'slug',
			title: 'URL Slug',
			description: 'The unique URL-friendly identifier for this project (auto-generated from title, but can be customized)',
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
			description: 'A unique identifier for code references and integrations (lowercase, numbers, and hyphens only)',
			type: 'string',
			validation: Rule => Rule.required().regex(/^[a-z0-9-]+$/).error('Project ID must be lowercase, numbers, and hyphens only'),
		}),
		defineField({
			name: 'description',
			title: 'Short Description',
			description: 'A concise summary of the project for cards and previews (1-2 sentences, max 400 characters)',
			type: 'text',
			rows: 3,
			validation: Rule => Rule.required().max(400),
		}),
		defineField({
			name: 'company',
			title: 'Company/Organization',
			description: 'The company or organization associated with this project, if applicable (leave blank for personal projects)',
			type: 'string',
		}),
		defineField({
			name: 'isFeatured',
			title: 'Featured Project',
			description: 'Toggle to display this project prominently on the home page',
			type: 'boolean',
			initialValue: false,
		}),

		// ======= PROJECT CLASSIFICATION =======
		defineField({
			name: 'projectType',
			title: 'Project Type',
			description: 'The primary classification of this project based on its origin and purpose. Personal: Self-directed side projects. Professional: Client work or employment projects. Open Source: Public contributions. Academic: Research or coursework. Learning: Projects created primarily for skill development.',
			type: 'string',
			options: {
				list: [
					{ title: 'Personal', value: 'personal' },
					{ title: 'Professional', value: 'professional' },
					{ title: 'Open Source', value: 'opensource' },
					{ title: 'Academic', value: 'academic' },
					{ title: 'Learning', value: 'learning' },
				],
				layout: 'radio',
			},
		}),
		defineField({
			name: 'categories',
			title: 'Categories',
			description: 'Broad domains this project falls under (e.g., Web Development, ML/AI, Data Engineering)',
			type: 'array',
			of: [defineArrayMember({ type: 'string' })],
			validation: Rule => Rule.unique(),
		}),
		defineField({
			name: 'tags',
			title: 'Tags',
			description: 'Specific technologies, techniques, or concepts used in this project (e.g., NextJS, Vector Search, Authentication)',
			type: 'array',
			of: [defineArrayMember({ type: 'string' })],
			validation: Rule => Rule.unique(),
		}),
		defineField({
			name: 'complexity',
			title: 'Project Complexity',
			description: 'The overall complexity and scope of this project. Simple: Small scope, single feature, or concept demonstration. Medium: Multiple features or moderate complexity. Complex: Significant scope with multiple integrated systems. Enterprise: Large-scale with sophisticated architecture.',
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

		// ======= PROJECT STATUS & TIMELINE =======
		defineField({
			name: 'timeline',
			title: 'Timeline',
			description: 'When the project started and ended (if applicable)',
			type: 'object',
			fields: [
				{
					name: 'startDate',
					title: 'Start Date',
					description: 'When you began working on this project',
					type: 'date',
					validation: Rule => Rule.required(),
				},
				{
					name: 'endDate',
					title: 'End Date',
					description: 'When you completed or stopped working on this project (leave blank if ongoing)',
					type: 'date',
				},
			],
			validation: Rule => Rule.required(),
		}),
		defineField({
			name: 'status',
			title: 'Project Status',
			description: 'The current state of development activity for this project. Active: Currently in active development. Paused: Temporarily on hold but will resume. Completed: Successfully finished as planned. Maintenance: No active development, just maintenance. Archived: Intentionally concluded and preserved. Abandoned: No longer working on or maintaining.',
			type: 'string',
			options: {
				list: [
					{ title: 'Active', value: 'active' },
					{ title: 'Paused', value: 'paused' },
					{ title: 'Completed', value: 'completed' },
					{ title: 'Maintenance', value: 'maintenance' },
					{ title: 'Archived', value: 'archived' },
					{ title: 'Abandoned', value: 'abandoned' },
				],
			},
			validation: Rule => Rule.required(),
		}),
		defineField({
			name: 'completionLevel',
			title: 'Completion Level',
			description: 'How far along is this project relative to its intended scope. Proof of Concept: Basic implementation demonstrating core ideas. Early Development: Foundation built with key functionality. Substantial Progress: Major features implemented. Near Complete: Mostly complete with refinements needed. Complete: All planned features implemented. Polished: Complete with additional refinements and polish.',
			type: 'string',
			options: {
				list: [
					{ title: 'Proof of Concept (10-25%)', value: 'poc' },
					{ title: 'Early Development (25-50%)', value: 'early' },
					{ title: 'Substantial Progress (50-75%)', value: 'substantial' },
					{ title: 'Near Complete (75-95%)', value: 'near-complete' },
					{ title: 'Complete (95-100%)', value: 'complete' },
					{ title: 'Polished', value: 'polished' },
				],
			},
		}),
		defineField({
			name: 'timeInvestment',
			title: 'Time Investment',
			description: 'Approximate time spent working on this project',
			type: 'string',
			options: {
				list: [
					{ title: 'One-day project', value: 'day' },
					{ title: 'Weekend project', value: 'weekend' },
					{ title: 'Week-long project', value: 'week' },
					{ title: 'Month-long project', value: 'month' },
					{ title: 'Multi-month project', value: 'months' },
					{ title: 'Year or longer', value: 'year-plus' },
				],
			},
		}),

		// ======= PROJECT NARRATIVE =======
		defineField({
			name: 'problem',
			title: 'Problem Statement',
			description: 'Describe the problem or opportunity this project was created to address',
			type: 'text',
			rows: 4,
		}),
		defineField({
			name: 'solution',
			title: 'Solution Overview',
			description: 'Explain how your project solves the problem or addresses the opportunity',
			type: 'text',
			rows: 4,
		}),
		defineField({
			name: 'challenges',
			title: 'Challenges',
			description: 'Significant obstacles or difficult problems encountered during development',
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
							description: 'Explain the challenge and why it was difficult',
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
			description: 'Methods, techniques, or strategies used to solve the challenges',
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
							description: 'Detail how you tackled the problem and why this approach was chosen',
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
			description: 'Interesting discoveries, innovations, or clever solutions developed during this project',
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
							description: 'Explain the insight and why it was valuable or interesting',
							type: 'text',
							rows: 3,
							validation: Rule => Rule.required(),
						},
						{
							name: 'code',
							title: 'Code Snippet',
							description: 'Optional: Include a relevant code example illustrating this insight',
							type: 'text',
							rows: 5,
						},
						{
							name: 'language',
							title: 'Programming Language',
							description: 'Language of the code snippet for syntax highlighting (e.g., javascript, python, typescript)',
							type: 'string',
						},
					],
				},
			],
		}),
		defineField({
			name: 'personalContribution',
			title: 'Personal Contribution',
			description: 'Your specific role and contributions to the project, especially for team projects',
			type: 'text',
			rows: 3,
		}),
		defineField({
			name: 'futureRoadmap',
			title: 'Future Roadmap',
			description: 'Planned features, improvements, or future directions for this project (if applicable)',
			type: 'array',
			of: [
				{
					type: 'object',
					fields: [
						{
							name: 'title',
							title: 'Feature/Improvement',
							type: 'string',
							validation: Rule => Rule.required(),
						},
						{
							name: 'description',
							title: 'Description',
							description: 'Detailed explanation of the planned feature or improvement',
							type: 'text',
							rows: 3,
						},
						{
							name: 'priority',
							title: 'Priority',
							description: 'How important is this item for future development',
							type: 'string',
							options: {
								list: [
									{ title: 'High', value: 'high' },
									{ title: 'Medium', value: 'medium' },
									{ title: 'Low', value: 'low' },
									{ title: 'Wishlist', value: 'wishlist' },
								],
							},
						},
					],
				},
			],
		}),
		defineField({
			name: 'abandonmentReason',
			title: 'Abandonment Reason',
			description: 'If this project was abandoned, briefly explain why (technical challenges, changing priorities, etc.)',
			type: 'text',
			rows: 3,
			hidden: ({ document }) => document?.status !== 'abandoned',
		}),

		// ======= OUTCOMES & IMPACT =======
		defineField({
			name: 'learnings',
			title: 'Key Learnings',
			description: 'Important lessons, skills, or knowledge gained from working on this project',
			type: 'array',
			of: [defineArrayMember({ type: 'string' })],
		}),
		defineField({
			name: 'achievements',
			title: 'Achievements',
			description: 'Notable accomplishments, milestones, or recognition related to this project',
			type: 'array',
			of: [defineArrayMember({ type: 'string' })],
		}),
		defineField({
			name: 'results',
			title: 'Results',
			description: 'Concrete outcomes or impacts of the project (e.g., "Reduced processing time by 40%")',
			type: 'array',
			of: [defineArrayMember({ type: 'string' })],
		}),
		defineField({
			name: 'metrics',
			title: 'Project Metrics',
			description: 'Quantifiable measurements that demonstrate project impact or scale',
			type: 'array',
			of: [
				{
					type: 'object',
					fields: [
						{
							name: 'label',
							title: 'Metric Label',
							description: 'Name of the metric (e.g., "Users", "Transactions", "Accuracy")',
							type: 'string',
							validation: Rule => Rule.required(),
						},
						{
							name: 'value',
							title: 'Metric Value',
							description: 'Numerical value of the metric',
							type: 'number',
							validation: Rule => Rule.required(),
						},
						{
							name: 'unit',
							title: 'Unit',
							description: 'Unit of measurement (e.g., %, ms, MB, users)',
							type: 'string',
						},
					],
				},
			],
		}),
		defineField({
			name: 'usageExamples',
			title: 'Usage Examples',
			description: 'Real-world examples of how this project was used or implemented',
			type: 'array',
			of: [defineArrayMember({ type: 'string' })],
		}),

		// ======= TECHNOLOGIES =======
		defineField({
			name: 'technologies',
			title: 'Technologies Used',
			description: 'Core technologies, frameworks, libraries, and tools used in this project',
			type: 'array',
			of: [
				{
					type: 'object',
					fields: [
						{
							name: 'name',
							title: 'Technology Name',
							description: 'Name of the technology, library, framework, or tool',
							type: 'string',
							validation: Rule => Rule.required(),
						},
						{
							name: 'category',
							title: 'Category',
							description: 'Classification of this technology',
							type: 'string',
							options: {
								list: [
									{ title: 'Frontend', value: 'frontend' },
									{ title: 'Backend', value: 'backend' },
									{ title: 'Data', value: 'data' },
									{ title: 'DevOps', value: 'devops' },
									{ title: 'AI', value: 'ai' },
									{ title: 'Design', value: 'design' },
									{ title: 'Testing', value: 'testing' },
									{ title: 'Other', value: 'other' },
								],
							},
							validation: Rule => Rule.required(),
						},
						{
							name: 'proficiency',
							title: 'Proficiency Level',
							description: 'Your level of expertise with this technology during this project',
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
							name: 'isCore',
							title: 'Core Technology',
							description: 'Is this a central/primary technology for this project?',
							type: 'boolean',
							initialValue: true,
						},
					],
				},
			],
			validation: Rule => Rule.required().min(1),
		}),

		// ======= MEDIA =======
		defineField({
			name: 'thumbnail',
			title: 'Project Thumbnail',
			description: 'The main image used for project cards and listings (ideally 16:9 ratio)',
			type: 'image',
			options: {
				hotspot: true,
			},
			fields: [
				{
					name: 'alt',
					type: 'string',
					title: 'Alternative Text',
					description: 'Brief description of the image for accessibility and SEO',
					validation: Rule => Rule.required(),
				},
			],
			validation: Rule => Rule.required(),
		}),
		defineField({
			name: 'media',
			title: 'Project Media',
			description: 'Additional images, videos, or demos showcasing various aspects of the project',
			type: 'array',
			of: [
				{
					type: 'object',
					fields: [
						{
							name: 'type',
							title: 'Media Type',
							description: 'The type of media to display',
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
							description: 'Where the video is hosted',
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
							description: 'Upload a video file directly (MP4 recommended)',
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
							description: 'Upload an image for this media item',
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
									description: 'Description of the image for accessibility',
								},
							],
						},
						{
							name: 'url',
							title: 'URL',
							description: 'External URL for video (YouTube, Vimeo), demo, or 3D content',
							type: 'url',
							hidden: ({ parent }) => parent?.type === 'image' || (parent?.type === 'video' && parent?.videoSource === 'upload'),
						},
						{
							name: 'alt',
							title: 'Alternative Text',
							description: 'Brief description of this media for accessibility',
							type: 'string',
							hidden: ({ parent }) => parent?.type === 'image',
						},
						{
							name: 'poster',
							title: 'Poster Image',
							description: 'Thumbnail shown before video playback begins',
							type: 'image',
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
							description: 'Optional description of what this media shows',
							type: 'string',
						},
					],
				},
			],
		}),

		// ======= LINKS & RESOURCES =======
		defineField({
			name: 'github',
			title: 'GitHub Repository',
			description: 'Link to the source code repository (public or private)',
			type: 'url',
		}),
		defineField({
			name: 'demoUrl',
			title: 'Live Demo URL',
			description: 'Link to a working demonstration of the project',
			type: 'url',
		}),
		// defineField({
		//   name: 'caseStudyUrl',
		//   title: 'Case Study URL',
		//   description: 'Link to a detailed case study or project writeup',
		//   type: 'url',
		// }),
		// defineField({
		//   name: 'blogPosts',
		//   title: 'Related Blog Posts',
		//   description: 'Articles or posts you\'ve written about this project',
		//   type: 'array',
		//   of: [
		//     {
		//       type: 'object',
		//       fields: [
		//         {
		//           name: 'title',
		//           title: 'Post Title',
		//           description: 'Title of the blog post or article',
		//           type: 'string',
		//           validation: Rule => Rule.required(),
		//         },
		//         {
		//           name: 'url',
		//           title: 'Post URL',
		//           description: 'Link to the published article',
		//           type: 'url',
		//           validation: Rule => Rule.required(),
		//         },
		//       ],
		//     },
		//   ],
		// }),
		defineField({
			name: 'documentation',
			title: 'Documentation URL',
			description: 'Link to technical documentation, API references, or user guides',
			type: 'url',
		}),
	],
	preview: {
		select: {
			title: 'title',
			projectType: 'projectType',
			company: 'company',
			status: 'status',
			completionLevel: 'completionLevel',
			media: 'thumbnail',
		},
		prepare({ title, projectType, company, status, completionLevel, media }) {
			const subtitleParts = [];
			if (projectType) subtitleParts.push(projectType);
			if (company) subtitleParts.push(company);
			if (status) subtitleParts.push(`Status: ${status}`);
			if (completionLevel) subtitleParts.push(`Completion: ${completionLevel}`);

			return {
				title,
				subtitle: subtitleParts.join(' • '),
				media,
			};
		},
	},
});