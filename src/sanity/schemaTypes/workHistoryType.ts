import { UserIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';

export const workHistoryType = defineType({
	name: 'workHistory',
	title: 'Work History',
	type: 'document',
	icon: UserIcon,
	fields: [
		defineField({
			name: 'company',
			title: 'Company',
			type: 'string',
			validation: Rule => Rule.required(),
		}),
		defineField({
			name: 'position',
			title: 'Position',
			type: 'string',
			validation: Rule => Rule.required(),
		}),
		defineField({
			name: 'slug',
			title: 'Slug',
			type: 'slug',
			validation: Rule => Rule.required(),
			options: {
				source: doc => `${doc.company}-${doc.position}`,
				maxLength: 96,
			},
		}),
		defineField({
			name: 'startDate',
			title: 'Start Date',
			type: 'date',
			validation: Rule => Rule.required(),
		}),
		defineField({
			name: 'endDate',
			title: 'End Date',
			description: 'Leave blank if this is your current position',
			type: 'date',
		}),
		defineField({
			name: 'isCurrent',
			title: 'Current Position',
			type: 'boolean',
			initialValue: false,
		}),
		defineField({
			name: 'description',
			title: 'Description',
			type: 'text',
			rows: 4,
			validation: Rule => Rule.required(),
		}),
		defineField({
			name: 'responsibilities',
			title: 'Responsibilities',
			type: 'array',
			of: [{ type: 'string' }],
			validation: Rule => Rule.required(),
		}),
		defineField({
			name: 'achievements',
			title: 'Key Achievements',
			type: 'array',
			of: [{ type: 'string' }],
		}),
		defineField({
			name: 'projects',
			title: 'Notable Projects',
			description: 'Projects completed during this position',
			type: 'array',
			of: [
				{
					type: 'reference',
					to: [{ type: 'project' }],
				},
			],
		}),
		defineField({
			name: 'technologies',
			title: 'Technologies Used',
			type: 'array',
			of: [
				{
					type: 'reference',
					to: [{ type: 'technology' }],
				},
			],
		}),
		defineField({
			name: 'skills',
			title: 'Skills Applied',
			type: 'array',
			of: [
				{
					type: 'reference',
					to: [{ type: 'skill' }],
				},
			],
		}),
		defineField({
			name: 'location',
			title: 'Location',
			type: 'string',
		}),
		defineField({
			name: 'url',
			title: 'Company URL',
			type: 'url',
		}),
		defineField({
			name: 'displayOrder',
			title: 'Display Order',
			description: 'Lower numbers will be displayed first',
			type: 'number',
			initialValue: 0,
		}),
	],
	preview: {
		select: {
			title: 'position',
			subtitle: 'company',
			startDate: 'startDate',
			endDate: 'endDate',
			isCurrent: 'isCurrent',
		},
		prepare({ title, subtitle, startDate, endDate, isCurrent }) {
			const dateRange = isCurrent
				? `${startDate} - Present`
				: `${startDate}${endDate ? ` - ${endDate}` : ''}`;

			return {
				title,
				subtitle: `${subtitle} | ${dateRange}`,
			};
		},
	},
}); 