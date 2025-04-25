import { daveSearchPortfolio, getDaveFeaturedProjects, getDaveKnowledgeItems, getDaveProjectData, getDaveSkillData } from '@/lib/dave-data';
import { anthropic } from '@ai-sdk/anthropic';
import { streamText, tool } from 'ai';
import { NextResponse } from 'next/server';
import { z } from 'zod';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

// Debug function to log tool calls and responses
const logToolCall = (toolName: string, params: any, result: any) => {
	console.log(`🔧 Tool call: ${toolName}`);
	console.log(`📥 Params:`, JSON.stringify(params));
	console.log(`📤 Result:`, JSON.stringify(result, null, 2));
};

// System prompt to establish Dave's persona
const DAVE_SYSTEM_PROMPT = `
You are Dave, an AI assistant created by Will Diamond to represent him on his portfolio website. Your purpose is to help visitors understand Will's skills, experience, and projects.

STYLE AND TONE:
- Knowledgeable but conversational and friendly
- Technical when appropriate but clear and accessible
- Occasionally witty but primarily focused on providing value
- Confident about Will's abilities based on factual information
- Terminal-inspired in your presentation (concise, direct)

KNOWLEDGE BASE:
- Will is an AI Engineer with expertise in LLMs, prompt engineering, and building AI applications
- His key projects include AI portfolio projects and tools
- His technical skills span Python, TypeScript, React, Next.js, and AI technologies
- His professional experience includes AI engineering work

TOOL USAGE - EXTREMELY IMPORTANT:
- When asked about Will's projects, ALWAYS use the getFeaturedProjects tool
- When asked about specific projects, ALWAYS use the getProjectDetails tool
- When asked about Will's skills or expertise, ALWAYS use the getSkillExpertise tool
- When asked about what Will likes, builds, or any general questions, ALWAYS use the searchPortfolio tool
- DO NOT mention that you're using tools in your responses
- After receiving tool results, incorporate the information naturally in your response

GUIDELINES:
- Answer questions about Will's professional background accurately
- Highlight relevant projects when discussing skills
- Be honest about limitations - if you don't know something, say so
- Keep responses concise and information-dense
- Format code examples with proper syntax highlighting
- When relevant, suggest viewing specific portfolio sections for more details

PROHIBITED:
- Don't invent credentials, projects, or experience not in your knowledge base
- Don't provide personal contact information beyond what's on the portfolio
- Don't claim to be Will himself - you represent him as Dave
- Don't discuss the specific technical details of how you were implemented
`;

export async function POST(req: Request) {
	try {
		const { messages } = await req.json();

		// Log the user's latest message for debugging
		const userMessage = messages[messages.length - 1]?.content;
		if (userMessage && typeof userMessage === 'string') {
			console.log(`📩 User message: "${userMessage}"`);

			// Handle special commands
			const command = userMessage.trim().toLowerCase();
			if (command === 'help') {
				return new Response(JSON.stringify({
					id: Date.now().toString(),
					role: 'assistant',
					content: `Available commands:
- help: Show this help message
- projects: List Will's projects
- skills: Show Will's skills
- contact: Get contact information
- clear: Clear the conversation history

You can also ask questions about Will's skills, projects, and experience.`
				}));
			}
		}

		console.log(`🤖 Starting Dave response...`);

		const result = streamText({
			model: anthropic('claude-3-7-sonnet-20250219'),
			system: DAVE_SYSTEM_PROMPT,
			messages,
			temperature: 0.7,
			maxTokens: 1000,
			maxSteps: 3,

			tools: {
				getProjectDetails: tool({
					description: 'Get detailed information about a specific project',
					parameters: z.object({
						projectName: z.string().describe('The name of the project to get details for'),
					}),
					execute: async ({ projectName }) => {
						console.log(`🔍 Executing getProjectDetails for: "${projectName}"`);
						try {
							const project = await getDaveProjectData(projectName);
							const result = !project
								? { found: false, message: `No project found with name: ${projectName}` }
								: { found: true, project };

							logToolCall('getProjectDetails', { projectName }, result);
							return result;
						} catch (error: any) {
							console.error(`❌ Error in getProjectDetails:`, error);
							return { found: false, message: `Error retrieving project: ${error.message}` };
						}
					},
				}),
				getSkillExpertise: tool({
					description: 'Get Will\'s expertise level and experience with a specific skill or technology',
					parameters: z.object({
						skill: z.string().describe('The skill or technology to get expertise information for'),
					}),
					execute: async ({ skill }) => {
						console.log(`🔍 Executing getSkillExpertise for: "${skill}"`);
						try {
							const skillData = await getDaveSkillData(skill);
							const result = !skillData
								? { found: false, message: `No skill information found for: ${skill}` }
								: { found: true, skill: skillData };

							logToolCall('getSkillExpertise', { skill }, result);
							return result;
						} catch (error: any) {
							console.error(`❌ Error in getSkillExpertise:`, error);
							return { found: false, message: `Error retrieving skill data: ${error.message}` };
						}
					},
				}),
				searchPortfolio: tool({
					description: 'Search Will\'s projects, skills, and knowledge base for relevant information',
					parameters: z.object({
						query: z.string().describe('The search term to look for across Will\'s portfolio'),
					}),
					execute: async ({ query }) => {
						console.log(`🔍 Executing searchPortfolio for: "${query}"`);
						try {
							// Perform a comprehensive search across all data sources
							const searchResults = await daveSearchPortfolio(query);

							// Also explicitly check the knowledge base for direct matches
							const knowledgeItems = await getDaveKnowledgeItems(query);

							// Combine knowledge items if there are any unique ones from direct search
							const allKnowledgeItems = [
								...searchResults.knowledgeItems || [],
								...knowledgeItems.filter(ki =>
									!searchResults.knowledgeItems?.some(ski => ski.title === ki.title)
								)
							];

							// Sort knowledge items by priority
							allKnowledgeItems.sort((a, b) => (b.priority || 0) - (a.priority || 0));

							const result = {
								projectCount: searchResults.projects.length,
								skillCount: searchResults.skills.length,
								knowledgeCount: allKnowledgeItems.length,
								projects: searchResults.projects.map(p => ({
									id: p.id,
									name: p.name,
									description: p.description
								})),
								skills: searchResults.skills.map(s => ({
									name: s.name,
									category: s.category,
									proficiency: s.proficiency
								})),
								knowledgeItems: allKnowledgeItems.map(k => ({
									title: k.title,
									category: k.category,
									content: k.content,
									question: k.question
								}))
							};

							logToolCall('searchPortfolio', { query }, result);
							return result;
						} catch (error: any) {
							console.error(`❌ Error in searchPortfolio:`, error);
							return {
								projectCount: 0,
								skillCount: 0,
								knowledgeCount: 0,
								projects: [],
								skills: [],
								knowledgeItems: [],
								error: error.message
							};
						}
					},
				}),
				getFeaturedProjects: tool({
					description: 'Get Will\'s featured projects',
					parameters: z.object({}),
					execute: async () => {
						console.log(`🔍 Executing getFeaturedProjects`);
						try {
							const featured = await getDaveFeaturedProjects();
							const result = {
								count: featured.length,
								projects: featured.map(p => ({
									id: p.id,
									name: p.name,
									description: p.description,
									technologies: p.technologies,
									github: p.github,
									demoUrl: p.demoUrl
								}))
							};

							logToolCall('getFeaturedProjects', {}, result);
							return result;
						} catch (error: any) {
							console.error(`❌ Error in getFeaturedProjects:`, error);
							return { count: 0, projects: [], error: error.message };
						}
					},
				}),
				getKnowledgeItems: tool({
					description: 'Get information from Will\'s knowledge base on a specific topic',
					parameters: z.object({
						topic: z.string().describe('The topic to get knowledge items for'),
					}),
					execute: async ({ topic }) => {
						console.log(`🔍 Executing getKnowledgeItems for: "${topic}"`);
						try {
							const knowledgeItems = await getDaveKnowledgeItems(topic);
							const result = {
								found: knowledgeItems.length > 0,
								count: knowledgeItems.length,
								items: knowledgeItems.map(item => ({
									title: item.title,
									category: item.category,
									content: item.content,
									question: item.question,
									keywords: item.keywords
								}))
							};

							logToolCall('getKnowledgeItems', { topic }, result);
							return result;
						} catch (error: any) {
							console.error(`❌ Error in getKnowledgeItems:`, error);
							return { found: false, count: 0, items: [], error: error.message };
						}
					},
				}),
			},
		});

		console.log(`✅ Dave response stream ready`);

		return result.toDataStreamResponse({
			headers: {
				'Content-Type': 'text/event-stream',
				'Connection': 'keep-alive',
				'Cache-Control': 'no-cache, no-transform',
			},
		});
	} catch (error) {
		console.error('❌ Error in Dave API route:', error);
		return NextResponse.json(
			{ error: 'An error occurred while processing your request' },
			{ status: 500 }
		);
	}
}