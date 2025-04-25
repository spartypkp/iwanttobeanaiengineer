/**
 * This file serves as an adapter layer between the Dave API route and the data sources.
 * It provides a unified interface for fetching data from Sanity CMS and Supabase.
 */

import { createClient } from '@/lib/utils/supabase/server';
import { client as sanityClient } from '@/sanity/lib/client';
import { LRUCache } from 'lru-cache';
import { semanticSearch } from './embeddings';

// Type definitions for the Dave data layer
export type DaveProject = {
	id: string;
	name: string;
	description: string;
	problem?: string;
	solution?: string;
	challenges?: any[];
	technologies?: any[];
	github?: string;
	demoUrl?: string;
};

export type DaveSkill = {
	name: string;
	category: string;
	proficiency: string;
	description?: string;
	yearsExperience?: number;
	examples?: any[];
};

export type DaveKnowledgeItem = {
	title: string;
	category: string;
	content: string;
	question?: string;
	keywords: string[];
	priority: number;
};

export type SearchResults = {
	projects: DaveProject[];
	skills: DaveSkill[];
	knowledgeItems: DaveKnowledgeItem[];
};

// Initialize caching
const cache = new LRUCache<string, any>({
	max: 100, // Maximum items in cache
	ttl: 1000 * 60 * 10, // 10 minutes TTL
});

const supabase = await createClient();




/**
 * Get featured projects with caching
 */
export async function getDaveFeaturedProjects(): Promise<DaveProject[]> {
	const cacheKey = 'featured-projects';

	// Check cache first
	const cached = cache.get(cacheKey);
	if (cached) {
		return cached;
	}

	try {
		// Check if we can use Sanity
		if (sanityClient) {
			const projects = await sanityClient.fetch(
				`*[_type == "project" && isFeatured == true] | order(timeline.startDate desc) {
					_id,
					title,
					id,
					description,
					problem,
					solution,
					technologies,
					github,
					demoUrl
				}`
			);

			// If we got projects from Sanity, transform and return them
			if (projects && projects.length > 0) {
				const result = projects.map((project: any) => ({
					id: project.id || project._id,
					name: project.title,
					description: project.description,
					problem: project.problem,
					solution: project.solution,
					technologies: project.technologies,
					github: project.github,
					demoUrl: project.demoUrl
				}));

				// Cache the result
				cache.set(cacheKey, result);
				return result;
			}
		}


		return [];
	} catch (error) {
		console.error("Error fetching featured projects:", error);
		return [];
	}
}

/**
 * Get details for a specific project with caching
 */
export async function getDaveProjectData(projectName: string): Promise<DaveProject | null> {
	const cacheKey = `project-${projectName.toLowerCase()}`;

	// Check cache first
	const cached = cache.get(cacheKey);
	if (cached) {
		return cached;
	}

	try {
		// Check if we can use Sanity
		if (sanityClient) {
			// Try to find by id first, then by title (case-insensitive)
			const projects = await sanityClient.fetch(
				`*[_type == "project" && (id == $id || lower(title) match $titleMatch)] {
					_id,
					title,
					id,
					description,
					problem,
					solution,
					challenges,
					technologies,
					github,
					demoUrl,
					achievements,
					timeline
				}`,
				{
					id: projectName,
					titleMatch: `*${projectName.toLowerCase()}*`
				}
			);

			// If we found a project in Sanity, transform and return it
			if (projects && projects.length > 0) {
				const project = projects[0];
				const result = {
					id: project.id || project._id,
					name: project.title,
					description: project.description,
					problem: project.problem,
					solution: project.solution,
					challenges: project.challenges,
					technologies: project.technologies,
					github: project.github,
					demoUrl: project.demoUrl,
					achievements: project.achievements,
					status: project.timeline?.status
				};

				// Cache the result
				cache.set(cacheKey, result);
				return result;
			}
		}



		return null;
	} catch (error) {
		console.error(`Error fetching project data for ${projectName}:`, error);
		return null;
	}
}

/**
 * Get details for a specific skill with caching
 */
export async function getDaveSkillData(skillName: string): Promise<DaveSkill | null> {
	const cacheKey = `skill-${skillName.toLowerCase()}`;

	// Check cache first
	const cached = cache.get(cacheKey);
	if (cached) {
		return cached;
	}

	try {
		// Check if we can use Sanity
		if (sanityClient) {
			// Try to find by name (case-insensitive)
			const skills = await sanityClient.fetch(
				`*[_type == "skill" && lower(name) match $nameMatch] {
					_id,
					name,
					category,
					description,
					proficiency,
					yearsExperience,
					examples,
					projects[]->{
						title,
						id,
						description
					}
				}`,
				{
					nameMatch: `*${skillName.toLowerCase()}*`
				}
			);

			// If we found a skill in Sanity, transform and return it
			if (skills && skills.length > 0) {
				const skill = skills[0];
				const result = {
					name: skill.name,
					category: skill.category,
					proficiency: skill.proficiency,
					description: skill.description,
					yearsExperience: skill.yearsExperience,
					examples: skill.examples,
					relatedProjects: skill.projects?.map((p: any) => ({
						id: p.id,
						name: p.title,
						description: p.description
					}))
				};

				// Cache the result
				cache.set(cacheKey, result);
				return result;
			}
		}

		return null;
	} catch (error) {
		console.error(`Error fetching skill data for ${skillName}:`, error);
		return null;
	}
}

/**
 * Get knowledge base items that match a query
 */
export async function getDaveKnowledgeItems(query: string): Promise<DaveKnowledgeItem[]> {
	const cacheKey = `knowledge-${query.toLowerCase()}`;

	// Check cache first
	const cached = cache.get(cacheKey);
	if (cached) {
		return cached;
	}

	try {
		// Check if we can use Sanity
		if (sanityClient) {
			const queryLower = query.toLowerCase();

			// Find knowledge items that match the query in title, content, or keywords
			const items = await sanityClient.fetch(
				`*[_type == "knowledgeBase" && (
					lower(title) match $queryParam || 
					lower(content) match $queryParam ||
					$queryParam in keywords[] ||
					lower(question) match $queryParam
				)] | order(priority desc) {
					title,
					category,
					content,
					question,
					keywords,
					priority
				}`,
				{ queryParam: `*${queryLower}*` }
			);

			if (items && items.length > 0) {
				// Cache the result
				cache.set(cacheKey, items);
				return items;
			}
		}

		return [];
	} catch (error) {
		console.error(`Error fetching knowledge items for ${query}:`, error);
		return [];
	}
}

/**
 * Search across projects, skills, and knowledge base
 */
export async function daveSearchPortfolio(query: string): Promise<SearchResults> {
	const cacheKey = `search-${query.toLowerCase()}`;

	// Check cache first
	const cached = cache.get(cacheKey);
	if (cached) {
		return cached;
	}

	try {
		// Try semantic search first if available
		if (supabase && process.env.OPENAI_API_KEY) {
			try {
				// Perform semantic search
				const results = await semanticSearch(query);

				// Extract matching items by type
				const projects = results
					.filter((r: any) => r.content_type === 'project')
					.map((r: any) => ({
						id: r.metadata?.id || r.content_id,
						name: r.metadata?.title || 'Unknown Project',
						description: r.content.split('\n')[1]?.replace('Description: ', '') || ''
					}));

				const skills = results
					.filter((r: any) => r.content_type === 'skill')
					.map((r: any) => ({
						name: r.metadata?.name || 'Unknown Skill',
						category: r.metadata?.category || '',
						proficiency: r.metadata?.proficiency || ''
					}));

				const knowledgeItems = results
					.filter((r: any) => r.content_type === 'knowledge')
					.map((r: any) => ({
						title: r.metadata?.title || 'Unknown Item',
						category: r.metadata?.category || '',
						content: r.content,
						keywords: r.metadata?.keywords || [],
						priority: r.metadata?.priority || 5
					}));

				const result = { projects, skills, knowledgeItems };

				// Cache the result
				cache.set(cacheKey, result);
				return result;
			} catch (semanticError) {
				console.error("Error with semantic search, falling back:", semanticError);
				// Fall through to fallback search
			}
		}

		// Fallback to direct Sanity queries
		let projects: DaveProject[] = [];
		let skills: DaveSkill[] = [];
		let knowledgeItems: DaveKnowledgeItem[] = [];

		if (sanityClient) {
			try {
				const queryLower = query.toLowerCase();

				// Process all requests in parallel for better performance
				const [projectResults, skillResults, knowledgeResults] = await Promise.all([
					// Fetch matching projects
					sanityClient.fetch(
						`*[_type == "project" && (
							lower(title) match $queryParam || 
							lower(description) match $queryParam ||
							count(technologies[lower(name) match $queryParam]) > 0
						)] {
							_id,
							title,
							id,
							description
						}`,
						{ queryParam: `*${queryLower}*` }
					),

					// Fetch matching skills
					sanityClient.fetch(
						`*[_type == "skill" && (
							lower(name) match $queryParam || 
							lower(description) match $queryParam ||
							lower(category) match $queryParam
						)] {
							name,
							category,
							proficiency,
							description
						}`,
						{ queryParam: `*${queryLower}*` }
					),

					// Fetch matching knowledge items
					sanityClient.fetch(
						`*[_type == "knowledgeBase" && (
							lower(title) match $queryParam || 
							lower(content) match $queryParam ||
							$queryParam in keywords[] ||
							lower(question) match $queryParam
						)] | order(priority desc) {
							title,
							category,
							content,
							question,
							keywords,
							priority
						}`,
						{ queryParam: `*${queryLower}*` }
					)
				]);

				// Transform the results
				projects = projectResults.map((p: any) => ({
					id: p.id || p._id,
					name: p.title,
					description: p.description
				}));

				skills = skillResults;
				knowledgeItems = knowledgeResults;
			} catch (sanityError) {
				console.error("Error searching Sanity, falling back to mock data:", sanityError);
				// Fall through to mock data
			}
		}


		const result = { projects, skills, knowledgeItems };

		// Cache the result
		cache.set(cacheKey, result);
		return result;
	} catch (error) {
		console.error(`Error searching portfolio for ${query}:`, error);
		return { projects: [], skills: [], knowledgeItems: [] };
	}
} 