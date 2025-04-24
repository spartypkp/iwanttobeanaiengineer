import { ProjectShowcase } from '@/lib/types';
import {
	BarChart,
	Clock,
	Code,
	Cpu,
	Database,
	GitBranch,
	LineChart,
	Server,
	Zap
} from 'lucide-react';
import React from 'react';
import { Project } from '../sanity.types';

// Map from Lucide icon names to their React components
const iconMap: Record<string, React.ReactNode> = {
	barChart: React.createElement(BarChart, { className: "h-4 w-4" }),
	clock: React.createElement(Clock, { className: "h-4 w-4" }),
	code: React.createElement(Code, { className: "h-3 w-3" }),
	cpu: React.createElement(Cpu, { className: "h-3 w-3" }),
	database: React.createElement(Database, { className: "h-3 w-3" }),
	gitBranch: React.createElement(GitBranch, { className: "h-3 w-3" }),
	lineChart: React.createElement(LineChart, { className: "h-4 w-4" }),
	server: React.createElement(Server, { className: "h-3 w-3" }),
	zap: React.createElement(Zap, { className: "h-4 w-4" }),
};

// Convert a Sanity Project to a ProjectShowcase
export function projectToProjectShowcase(project: Project): ProjectShowcase {
	return {
		id: project.id || '',
		title: project.title || '',
		company: project.company,
		description: project.description || '',
		problem: project.problem || '',
		solution: project.solution || '',

		// Convert challenges
		challenges: project.challenges?.map(challenge => ({
			title: challenge.title || '',
			description: challenge.description || ''
		})) || [],

		// Convert approach
		approach: project.approach?.map(approach => ({
			title: approach.title || '',
			description: approach.description || ''
		})) || [],

		// Convert technical insights
		technicalInsights: project.technicalInsights?.map(insight => ({
			title: insight.title || '',
			description: insight.description || '',
			code: insight.code,
			language: insight.language
		})) || [],

		// Simple arrays
		learnings: project.learnings || [],
		achievements: project.achievements || [],
		personalContribution: project.personalContribution,
		results: project.results || [],

		// Convert metrics (adding default icon)
		metrics: project.metrics?.map(metric => ({
			label: metric.label || '',
			value: metric.value || 0,
			unit: metric.unit,
			icon: metric.label?.toLowerCase().includes('time') ? iconMap.clock :
				metric.label?.toLowerCase().includes('cost') ? iconMap.lineChart :
					metric.label?.toLowerCase().includes('accuracy') ? iconMap.barChart :
						metric.label?.toLowerCase().includes('document') ? iconMap.database :
							metric.label?.toLowerCase().includes('download') ? iconMap.lineChart :
								metric.label?.toLowerCase().includes('star') ? iconMap.gitBranch :
									metric.label?.toLowerCase().includes('efficiency') ? iconMap.zap :
										iconMap.barChart
		})) || [],

		// Convert technologies
		technologies: project.technologies?.map(tech => ({
			name: tech.name || '',
			category: tech.category || 'frontend' as any,
			icon: tech.name?.toLowerCase().includes('python') ? iconMap.code :
				tech.name?.toLowerCase().includes('react') ? iconMap.code :
					tech.name?.toLowerCase().includes('typescript') ? iconMap.code :
						tech.name?.toLowerCase().includes('javascript') ? iconMap.code :
							tech.name?.toLowerCase().includes('node') ? iconMap.server :
								tech.name?.toLowerCase().includes('gpt') ? iconMap.cpu :
									tech.name?.toLowerCase().includes('ai') ? iconMap.cpu :
										tech.name?.toLowerCase().includes('sql') ? iconMap.database :
											tech.name?.toLowerCase().includes('postgres') ? iconMap.database :
												tech.name?.toLowerCase().includes('mongodb') ? iconMap.database :
													tech.name?.toLowerCase().includes('docker') ? iconMap.gitBranch :
														tech.name?.toLowerCase().includes('kubernetes') ? iconMap.gitBranch :
															iconMap.code
		})) || [],

		// Convert media - ensure URLs are properly handled
		media: project.media?.map(media => ({
			type: media.type || 'image',
			url: media.url || '',
			alt: media.alt || '',
			poster: typeof media.poster === 'string' ? media.poster : undefined
		})) || [],

		// Other properties
		primaryColor: project.primaryColor || '#00FF41',
		github: project.github,
		demoUrl: project.demoUrl,
		caseStudyUrl: project.caseStudyUrl,

		// Convert timeline
		timeline: project.timeline ? {
			startDate: project.timeline.startDate || '',
			endDate: project.timeline.endDate,
			status: (project.timeline.status || 'active') as 'active' | 'completed' | 'maintenance' | 'archived'
		} : undefined
	};
} 