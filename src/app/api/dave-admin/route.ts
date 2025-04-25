import { client } from '@/sanity/lib/client';
import { anthropic } from '@ai-sdk/anthropic';
import { streamText, tool } from 'ai';
import { NextResponse } from 'next/server';
import { z } from 'zod';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

// Setup a Sanity client with write capabilities
const writeClient = client.withConfig({
	token: process.env.SANITY_API_TOKEN, // This token needs WRITE access
	useCdn: false, // We need the freshest data for writing
});

// Debug function to log tool calls and responses
const logToolCall = (toolName: string, params: any, result: any) => {
	console.log(`🔧 Admin Tool call: ${toolName}`);
	console.log(`📥 Params:`, JSON.stringify(params));
	console.log(`📤 Result:`, JSON.stringify(result, null, 2));
};

// System prompt to establish Dave's admin persona
const DAVE_ADMIN_SYSTEM_PROMPT = `
You are Dave Admin, a specialized AI assistant designed to help the owner of the portfolio website manage content in the Sanity CMS backend.
Unlike the public-facing Dave, you have WRITE access to the Sanity database and can create or modify content.

STYLE AND TONE:
- Professional but conversational
- Clear and methodical in your approach
- Focus on gathering necessary information to create structured content

CAPABILITIES:
- Create and update projects in Sanity
- Add knowledge base entries
- Update skill information
- Help organize metadata for better searchability

RESPONSIBILITIES:
- Guide the user through content creation by asking relevant questions
- Format data properly according to Sanity schemas
- Validate information before writing to the database
- Confirm when operations are successful
- Explain any errors that occur

TOOL USAGE - EXTREMELY IMPORTANT:
- When creating projects, use createProject tool
- When creating knowledge entries, use createKnowledgeItem tool
- When updating skills, use updateSkill tool
- When checking content, use checkContent tool
- DO NOT mention that you're using tools in your responses

CONTENT CREATION APPROACH:
For projects:
1. Ask for the project title, description, status, and timeline
2. Gather information about the problem solved and solution
3. Get details about technologies used
4. Ask for any GitHub or demo links
5. Collect media information if available

For knowledge items:
1. Ask for the title, category, and core content
2. Suggest keywords for improved searchability
3. Ask if it should be linked to any projects or skills
4. Determine the priority level (1-10)

For skills:
1. Get the name, category, and proficiency level
2. Ask for years of experience and description
3. Get examples of using the skill in projects
4. Link to relevant projects

PROHIBITED:
- DO NOT make up information
- DO NOT create or edit content without explicit user consent
- DO NOT access or modify non-content settings
`;

export async function POST(req: Request) {
	try {
		const { messages } = await req.json();

		// Log the user's latest message for debugging
		const userMessage = messages[messages.length - 1]?.content;
		if (userMessage && typeof userMessage === 'string') {
			console.log(`📩 Admin message: "${userMessage}"`);
		}

		console.log(`🤖 Starting Dave Admin response...`);

		const result = streamText({
			model: anthropic('claude-3-7-sonnet-20250219'),
			system: DAVE_ADMIN_SYSTEM_PROMPT,
			messages,
			temperature: 0.7,
			maxTokens: 1500,
			maxSteps: 5,

			tools: {
				createProject: tool({
					description: 'Create a new project in Sanity CMS',
					parameters: z.object({
						title: z.string().describe('Project title'),
						description: z.string().describe('Short project description'),
						status: z.enum(['active', 'completed', 'maintenance', 'archived', 'concept']).describe('Current project status'),
						isFeatured: z.boolean().optional().describe('Whether this is a featured project'),
						problem: z.string().optional().describe('Problem the project solves'),
						solution: z.string().optional().describe('Solution approach'),
						technologies: z.array(z.object({
							name: z.string().describe('Technology name'),
							category: z.enum(['frontend', 'backend', 'data', 'devops', 'ai', 'design', 'other']).describe('Technology category'),
						})).optional().describe('Technologies used in the project'),
						github: z.string().url().optional().describe('GitHub repository URL'),
						demoUrl: z.string().url().optional().describe('Live demo URL'),
					}),
					execute: async ({ title, description, status, isFeatured, problem, solution, technologies, github, demoUrl }) => {
						console.log(`🔧 Creating project: "${title}"`);
						try {
							// Generate a slug from the title
							const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');

							// Create project document
							const projectDoc = {
								_type: 'project',
								title,
								slug: { _type: 'slug', current: slug },
								description,
								isFeatured: isFeatured ?? false,
								timeline: {
									status,
									startDate: new Date().toISOString().split('T')[0],
								},
								problem,
								solution,
								technologies: technologies?.map(tech => ({
									_key: tech.name.toLowerCase().replace(/\s+/g, '-'),
									name: tech.name,
									category: tech.category,
								})),
								github,
								demoUrl,
							};

							// Create the document in Sanity
							const result = await writeClient.create(projectDoc);

							return {
								success: true,
								projectId: result._id,
								message: `Project "${title}" created successfully!`
							};
						} catch (error: any) {
							console.error(`❌ Error creating project:`, error);
							return {
								success: false,
								message: `Error creating project: ${error.message}`
							};
						}
					},
				}),

				createKnowledgeItem: tool({
					description: 'Create a new knowledge base item in Sanity CMS',
					parameters: z.object({
						title: z.string().describe('Knowledge item title'),
						category: z.enum(['personal', 'professional', 'education', 'projects', 'skills', 'experience', 'preferences', 'faq']).describe('Category of knowledge'),
						content: z.string().describe('Main content text'),
						question: z.string().optional().describe('Related question this knowledge answers'),
						keywords: z.array(z.string()).describe('Keywords for improved searchability'),
						priority: z.number().min(1).max(10).describe('Priority level (1-10), higher is more important'),
						isPublic: z.boolean().optional().describe('Whether this item is publicly accessible'),
					}),
					execute: async ({ title, category, content, question, keywords, priority, isPublic }) => {
						console.log(`🔧 Creating knowledge item: "${title}"`);
						try {
							// Generate a slug from the title
							const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');

							// Create knowledge document
							const knowledgeDoc = {
								_type: 'knowledgeBase',
								title,
								slug: { _type: 'slug', current: slug },
								category,
								content,
								question,
								keywords,
								priority,
								isPublic: isPublic ?? true,
								lastVerified: new Date().toISOString().split('T')[0],
							};

							// Create the document in Sanity
							const result = await writeClient.create(knowledgeDoc);

							return {
								success: true,
								itemId: result._id,
								message: `Knowledge item "${title}" created successfully!`
							};
						} catch (error: any) {
							console.error(`❌ Error creating knowledge item:`, error);
							return {
								success: false,
								message: `Error creating knowledge item: ${error.message}`
							};
						}
					},
				}),

				updateSkill: tool({
					description: 'Update an existing skill or create a new one in Sanity CMS',
					parameters: z.object({
						name: z.string().describe('Skill name'),
						category: z.enum(['programming', 'frameworks', 'ai', 'cloud', 'tools', 'soft', 'domain']).describe('Skill category'),
						proficiency: z.enum(['beginner', 'intermediate', 'advanced', 'expert']).describe('Proficiency level'),
						description: z.string().optional().describe('Description of the skill'),
						yearsExperience: z.number().optional().describe('Years of experience with this skill'),
						examples: z.array(z.object({
							title: z.string().describe('Example title'),
							description: z.string().describe('Example description'),
						})).optional().describe('Examples of using this skill'),
						featured: z.boolean().optional().describe('Whether this is a featured skill'),
					}),
					execute: async ({ name, category, proficiency, description, yearsExperience, examples, featured }) => {
						console.log(`🔧 Updating skill: "${name}"`);
						try {
							// Generate a slug from the name
							const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');

							// Check if skill already exists
							const existingSkill = await writeClient.fetch(
								`*[_type == "skill" && name == $name][0]`,
								{ name }
							);

							let result;

							if (existingSkill) {
								// Update existing skill
								result = await writeClient.patch(existingSkill._id)
									.set({
										category,
										proficiency,
										description,
										yearsExperience,
										examples: examples?.map((ex, i) => ({
											_key: `example-${i}`,
											title: ex.title,
											description: ex.description,
										})),
										featured: featured ?? existingSkill.featured
									})
									.commit();

								return {
									success: true,
									skillId: result._id,
									message: `Skill "${name}" updated successfully!`,
									wasExisting: true
								};
							} else {
								// Create new skill
								const skillDoc = {
									_type: 'skill',
									name,
									slug: { _type: 'slug', current: slug },
									category,
									proficiency,
									description,
									yearsExperience,
									examples: examples?.map((ex, i) => ({
										_key: `example-${i}`,
										title: ex.title,
										description: ex.description,
									})),
									featured: featured ?? false
								};

								result = await writeClient.create(skillDoc);

								return {
									success: true,
									skillId: result._id,
									message: `Skill "${name}" created successfully!`,
									wasExisting: false
								};
							}
						} catch (error: any) {
							console.error(`❌ Error updating skill:`, error);
							return {
								success: false,
								message: `Error updating skill: ${error.message}`
							};
						}
					},
				}),

				checkContent: tool({
					description: 'Check if content exists in the Sanity CMS',
					parameters: z.object({
						contentType: z.enum(['project', 'skill', 'knowledgeBase']).describe('Type of content to check'),
						searchTerm: z.string().describe('Term to search for in title, name, or other key fields'),
					}),
					execute: async ({ contentType, searchTerm }) => {
						console.log(`🔍 Checking for ${contentType}: "${searchTerm}"`);
						try {
							let query: string = '';
							let params;

							if (contentType === 'project') {
								query = `*[_type == "project" && (title match $term || description match $term)]`;
								params = { term: `*${searchTerm}*` };
							} else if (contentType === 'skill') {
								query = `*[_type == "skill" && name match $term]`;
								params = { term: `*${searchTerm}*` };
							} else if (contentType === 'knowledgeBase') {
								query = `*[_type == "knowledgeBase" && (title match $term || content match $term)]`;
								params = { term: `*${searchTerm}*` };
							}

							const results = await writeClient.fetch(query, params);

							return {
								success: true,
								found: results.length > 0,
								count: results.length,
								items: results.map((item: any) => ({
									id: item._id,
									title: item.title || item.name,
									type: contentType
								}))
							};
						} catch (error: any) {
							console.error(`❌ Error checking content:`, error);
							return {
								success: false,
								message: `Error checking for ${contentType}: ${error.message}`
							};
						}
					},
				}),
			},
		});

		console.log(`✅ Dave Admin response stream ready`);

		return result.toDataStreamResponse({
			headers: {
				'Content-Type': 'text/event-stream',
				'Connection': 'keep-alive',
				'Cache-Control': 'no-cache, no-transform',
			},
		});
	} catch (error) {
		console.error('❌ Error in Dave Admin API route:', error);
		return NextResponse.json(
			{ error: 'An error occurred while processing your request' },
			{ status: 500 }
		);
	}
} 