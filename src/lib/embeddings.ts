"use server";
import { createClient } from '@/lib/utils/supabase/server';
import { client as sanityClient } from '@/sanity/lib/client';
import { KnowledgeBase, Project, Skill, WorkHistory } from '@/sanity/sanity.types';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

// Initialize Supabase client
const supabase = await createClient();

/**
 * Generate an embedding for a text document using OpenAI's API
 */
export async function generateEmbedding(text: string): Promise<number[]> {
	try {
		const response = await openai.embeddings.create({
			model: 'text-embedding-ada-002',
			input: text,
		});

		return response.data[0].embedding;
	} catch (error) {
		console.error('Error generating embedding:', error);
		throw error;
	}
}

/**
 * Prepare project content for embedding by extracting relevant text
 */
function prepareProjectForEmbedding(project: Project): string {
	return [
		`Project: ${project.title}`,
		`Description: ${project.description || ''}`,
		`Problem: ${project.problem || ''}`,
		`Solution: ${project.solution || ''}`,
		project.challenges?.map(c => `Challenge: ${c.title} - ${c.description}`).join('\n') || '',
		project.approach?.map(a => `Approach: ${a.title} - ${a.description}`).join('\n') || '',
		project.technicalInsights?.map(i => `Technical Insight: ${i.title} - ${i.description}`).join('\n') || '',
		`Achievements: ${project.achievements?.join(', ') || ''}`,
		`Technologies: ${project.technologies?.map(t => t.name).join(', ') || ''}`,
	].filter(Boolean).join('\n');
}

/**
 * Prepare skill content for embedding by extracting relevant text
 */
function prepareSkillForEmbedding(skill: Skill): string {
	return [
		`Skill: ${skill.name}`,
		`Category: ${skill.category || ''}`,
		`Description: ${skill.description || ''}`,
		`Proficiency: ${skill.proficiency || ''}`,
		`Years of Experience: ${skill.yearsExperience || ''}`,
		skill.examples?.map((e: { title?: string; description?: string; }) =>
			`Example: ${e.title || 'Unnamed Example'} - ${e.description || ''}`).join('\n') || '',
	].filter(Boolean).join('\n');
}

/**
 * Prepare work history content for embedding by extracting relevant text
 */
function prepareWorkHistoryForEmbedding(workHistory: WorkHistory): string {
	return [
		`Position: ${workHistory.position}`,
		`Company: ${workHistory.company}`,
		`Duration: ${workHistory.startDate} to ${workHistory.endDate || 'Present'}`,
		`Description: ${workHistory.description || ''}`,
		`Responsibilities: ${workHistory.responsibilities?.join(', ') || ''}`,
		`Achievements: ${workHistory.achievements?.join(', ') || ''}`,
	].filter(Boolean).join('\n');
}

/**
 * Prepare knowledge base content for embedding
 */
function prepareKnowledgeForEmbedding(knowledge: KnowledgeBase): string {
	return [
		`Title: ${knowledge.title}`,
		`Category: ${knowledge.category || ''}`,
		knowledge.question ? `Question: ${knowledge.question}` : '',
		`Content: ${knowledge.content || ''}`,
		`Keywords: ${knowledge.keywords?.join(', ') || ''}`,
	].filter(Boolean).join('\n');
}

/**
 * Store an embedding in Supabase
 */
export async function storeEmbedding(
	contentType: string,
	contentId: string,
	content: string,
	embedding: number[],
	metadata: Record<string, any> = {}
) {
	try {
		const { data, error } = await supabase
			.from('content_embeddings')
			.upsert({
				content_type: contentType,
				content_id: contentId,
				content,
				embedding,
				metadata,
				updated_at: new Date().toISOString(),
			}, {
				onConflict: 'content_type,content_id'
			});

		if (error) throw error;
		return data;
	} catch (error) {
		console.error('Error storing embedding:', error);
		throw error;
	}
}

/**
 * Generate and store embeddings for all projects
 */
export async function generateProjectEmbeddings() {
	try {
		// Fetch all projects from Sanity
		const projects = await sanityClient.fetch('*[_type == "project"]');

		for (const project of projects) {
			// Prepare content for embedding
			const content = prepareProjectForEmbedding(project);

			// Generate embedding
			const embedding = await generateEmbedding(content);

			// Store embedding
			await storeEmbedding(
				'project',
				project._id,
				content,
				embedding,
				{
					title: project.title,
					slug: project.slug?.current,
					isFeatured: project.isFeatured,
				}
			);

			console.log(`Generated embedding for project: ${project.title}`);
		}

		console.log('All project embeddings generated successfully');
	} catch (error) {
		console.error('Error generating project embeddings:', error);
		throw error;
	}
}

/**
 * Generate and store embeddings for all skills
 */
export async function generateSkillEmbeddings() {
	try {
		// Fetch all skills from Sanity
		const skills = await sanityClient.fetch('*[_type == "skill"]');

		for (const skill of skills) {
			// Prepare content for embedding
			const content = prepareSkillForEmbedding(skill);

			// Generate embedding
			const embedding = await generateEmbedding(content);

			// Store embedding
			await storeEmbedding(
				'skill',
				skill._id,
				content,
				embedding,
				{
					name: skill.name,
					category: skill.category,
					proficiency: skill.proficiency,
				}
			);

			console.log(`Generated embedding for skill: ${skill.name}`);
		}

		console.log('All skill embeddings generated successfully');
	} catch (error) {
		console.error('Error generating skill embeddings:', error);
		throw error;
	}
}

/**
 * Perform semantic search using embeddings
 */
export async function semanticSearch(query: string, options: {
	contentTypes?: string[],
	threshold?: number,
	limit?: number;
} = {}) {
	try {
		const {
			contentTypes = ['project', 'skill', 'knowledge', 'work_history'],
			threshold = 0.7,
			limit = 10
		} = options;

		// Generate embedding for the query
		const embedding = await generateEmbedding(query);

		// Search for similar content using the match_documents function
		const { data, error } = await supabase.rpc('match_documents', {
			query_embedding: embedding,
			match_threshold: threshold,
			match_count: limit,
		});

		if (error) throw error;

		// Filter by content type if specified
		let results = data;
		if (contentTypes.length > 0 && contentTypes.length < 4) {
			results = data.filter((item: { content_type: string; }) =>
				contentTypes.includes(item.content_type));
		}

		return results;
	} catch (error) {
		console.error('Error performing semantic search:', error);
		throw error;
	}
}

/**
 * Generate embeddings for all content (projects, skills, knowledge, work history)
 */
export async function generateAllEmbeddings() {
	try {
		console.log('Starting generation of all embeddings...');
		await generateProjectEmbeddings();
		await generateSkillEmbeddings();
		// Add these functions when the schemas are added
		// await generateWorkHistoryEmbeddings();
		// await generateKnowledgeBaseEmbeddings();
		console.log('All embeddings generated successfully');
	} catch (error) {
		console.error('Error generating all embeddings:', error);
		throw error;
	}
} 