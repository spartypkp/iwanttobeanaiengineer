import { client } from '@/sanity/lib/client';
import { anthropic } from '@ai-sdk/anthropic';
import { streamText, tool } from 'ai';
import { NextResponse } from 'next/server';
import { z } from 'zod';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

// Type definition for route params
type RouteParams = {
	params: {
		entityType: 'project' | 'knowledge' | 'skill';
	};
};

// Setup a Sanity client with write capabilities
const writeClient = client.withConfig({
	token: process.env.SANITY_API_TOKEN, // This token needs WRITE access
	useCdn: false, // We need the freshest data for writing
});

// Debug function to log tool calls and responses
const logToolCall = (toolName: string, params: any, result: any) => {
	console.log(`🔧 Entity Tool call: ${toolName}`);
	console.log(`📥 Params:`, JSON.stringify(params));
	console.log(`📤 Result:`, JSON.stringify(result, null, 2));
};

// Base system prompt with shared instructions
const baseSystemPrompt = `
You are Dave Admin, a specialized AI assistant designed to help the owner of the portfolio website manage content in the Sanity CMS backend.
Unlike the public-facing Dave, you have WRITE access to the Sanity database and can create or modify content.

STYLE AND TONE:
- Conversational and friendly, focusing on making content creation feel like a natural discussion
- Guide the user step-by-step through the content creation process
- Be encouraging and positively affirm information as it's provided
- Use a terminal-inspired aesthetic in your communication

APPROACH TO CONVERSATION:
- Ask focused questions one or two at a time rather than overwhelming with many questions at once
- Acknowledge information as it's provided ("Great, I've captured the project title as...")
- Summarize information periodically to confirm understanding
- Suggest specific values when appropriate
- Use examples to illustrate what kind of information you're looking for

CONTEXT AWARENESS:
- Remember what entity is being worked on throughout the conversation
- Keep track of which fields have already been provided and which are still needed
- Understand when the user is providing multiple pieces of information at once
- Recognize related information and suggest appropriate connections

GENERAL GUIDELINES:
- DO NOT make up information
- DO NOT create or edit content without explicit user consent
- Take time to explore each aspect properly, don't rush
`;

// Entity-specific prompts
const entityPrompts = {
	project: `
SPECIFIC INSTRUCTIONS FOR PROJECTS:
You are helping create or edit a PROJECT entity in the portfolio.

Required fields for projects:
- title: The project name (required)
- description: Brief overview of the project (required)
- status: Current state (active, completed, maintenance, archived, concept) (required)
- problem: What problem the project solves
- solution: How the project solves the problem
- technologies: List of technologies used, with categories
- github: GitHub repository URL
- demoUrl: Live demo URL if available

APPROACH:
1. Start with the basics: project title, description, and purpose
2. Explore the problem and solution in a conversational way
3. Discuss technologies - remember to capture both frontend and backend
4. Ask for links and media in a natural way
5. Confirm all information before saving

HELPFUL PROMPTS:
- "Let's start with the basics. What's this project called, and what does it do in a nutshell?"
- "What problem were you trying to solve with this project?"
- "What technologies did you use? Any frontend frameworks or libraries?"
- "Do you have a GitHub repo or demo site you'd like to include?"
- "Is this project currently active, completed, or in maintenance mode?"

When you have sufficient information, use the createProject tool to save the project.
`,

	knowledge: `
SPECIFIC INSTRUCTIONS FOR KNOWLEDGE BASE:
You are helping create or edit a KNOWLEDGE BASE entity that Dave will use to answer questions.

Required fields for knowledge items:
- title: Brief title for the knowledge (required)
- category: Type of knowledge (personal, professional, education, projects, skills, experience, preferences, faq) (required)
- content: The main information content (required)
- question: Question this knowledge would answer
- keywords: Terms that would help find this knowledge (required)
- priority: Importance level from 1-10 (required)
- isPublic: Whether this should be publicly accessible

APPROACH:
1. Start by understanding what knowledge needs to be captured
2. Explore the topic naturally, asking follow-up questions
3. Help craft effective questions this knowledge would answer
4. Collaboratively generate relevant keywords
5. Review and save when complete

HELPFUL PROMPTS:
- "What information would you like to add to Dave's knowledge base?"
- "Which category does this information best fit into?"
- "What questions might someone ask that this knowledge would help answer?"
- "Let's think of some keywords that would help Dave find this information when relevant topics come up."
- "On a scale of 1-10, how important is this information for Dave to prioritize?"

When you have sufficient information, use the createKnowledgeItem tool to save the knowledge.
`,

	skill: `
SPECIFIC INSTRUCTIONS FOR SKILLS:
You are helping create or edit a SKILL entity in the portfolio.

Required fields for skills:
- name: Name of the skill (required)
- category: Skill category (programming, frameworks, ai, cloud, tools, soft, domain) (required)
- proficiency: Skill level (beginner, intermediate, advanced, expert) (required)
- description: Description of the skill
- yearsExperience: Years of experience with the skill
- examples: Examples of using the skill
- featured: Whether this is a featured skill

APPROACH:
1. Start with the skill name and category
2. Discuss proficiency level in a natural way
3. Explore examples of how the skill has been used
4. Connect with relevant projects
5. Confirm and save

HELPFUL PROMPTS:
- "What skill would you like to add to your portfolio?"
- "Which category does this skill best fit under?"
- "How would you rate your proficiency with this skill?"
- "How long have you been working with this skill?"
- "Can you share an example of how you've applied this skill in your work?"
- "Should this be featured as one of your primary skills?"

When you have sufficient information, use the updateSkill tool to save the skill.
`
};

// Get entity data (for editing mode)
async function getEntityById(entityType: string, id: string) {
	try {
		let query = '';

		switch (entityType) {
			case 'project':
				query = `*[_type == "project" && _id == $id][0]`;
				break;
			case 'knowledge':
				query = `*[_type == "knowledgeBase" && _id == $id][0]`;
				break;
			case 'skill':
				query = `*[_type == "skill" && _id == $id][0]`;
				break;
			default:
				return null;
		}

		return await client.fetch(query, { id });
	} catch (error) {
		console.error(`Error fetching ${entityType}:`, error);
		return null;
	}
}

export async function POST(req: Request, { params }: RouteParams) {
	try {
		const { entityType } = params;
		const { messages, entityId, isEditMode } = await req.json();

		// Log the user's latest message for debugging
		const userMessage = messages[messages.length - 1]?.content;
		if (userMessage && typeof userMessage === 'string') {
			console.log(`📩 ${entityType} message: "${userMessage}"`);
		}

		// Get entity data if in edit mode
		let entityData = null;
		if (isEditMode && entityId) {
			entityData = await getEntityById(entityType, entityId);
			console.log(`🔍 Editing existing ${entityType}:`, entityId);
		} else {
			console.log(`➕ Creating new ${entityType}`);
		}

		// Construct the appropriate system prompt
		const entityPrompt = entityPrompts[entityType] || '';
		const contextData = entityData ?
			`\nEDITING EXISTING ENTITY: You are editing an existing ${entityType}. Here is the current data:\n${JSON.stringify(entityData, null, 2)}\n`
			: '';

		const fullSystemPrompt = `${baseSystemPrompt}\n${entityPrompt}\n${contextData}`;

		console.log(`🤖 Starting ${entityType} conversation...`);

		const result = streamText({
			model: anthropic('claude-3-7-sonnet-20250219'),
			system: fullSystemPrompt,
			messages,
			temperature: 0.7,
			maxTokens: 1500,
			maxSteps: 5,

			tools: {
				createProject: tool({
					description: 'Create a new project in Sanity CMS or update an existing one',
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
						console.log(`🔧 Creating/updating project: "${title}"`);
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

							let result;

							// If in edit mode, update the existing document
							if (isEditMode && entityId) {
								result = await writeClient
									.patch(entityId)
									.set(projectDoc)
									.commit();

								return {
									success: true,
									projectId: result._id,
									message: `Project "${title}" updated successfully!`,
									isUpdate: true
								};
							} else {
								// Create new document
								result = await writeClient.create(projectDoc);

								return {
									success: true,
									projectId: result._id,
									message: `Project "${title}" created successfully!`,
									isUpdate: false
								};
							}
						} catch (error: any) {
							console.error(`❌ Error with project:`, error);
							return {
								success: false,
								message: `Error with project: ${error.message}`
							};
						}
					},
				}),

				createKnowledgeItem: tool({
					description: 'Create a new knowledge base item in Sanity CMS or update an existing one',
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
						console.log(`🔧 Creating/updating knowledge item: "${title}"`);
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

							let result;

							// If in edit mode, update the existing document
							if (isEditMode && entityId) {
								result = await writeClient
									.patch(entityId)
									.set(knowledgeDoc)
									.commit();

								return {
									success: true,
									itemId: result._id,
									message: `Knowledge item "${title}" updated successfully!`,
									isUpdate: true
								};
							} else {
								// Create new document
								result = await writeClient.create(knowledgeDoc);

								return {
									success: true,
									itemId: result._id,
									message: `Knowledge item "${title}" created successfully!`,
									isUpdate: false
								};
							}
						} catch (error: any) {
							console.error(`❌ Error with knowledge item:`, error);
							return {
								success: false,
								message: `Error with knowledge item: ${error.message}`
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
						console.log(`🔧 Creating/updating skill: "${name}"`);
						try {
							// Generate a slug from the name
							const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');

							// Create skill document
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
								featured: featured ?? false,
							};

							let result;

							// If in edit mode, update the existing document
							if (isEditMode && entityId) {
								result = await writeClient
									.patch(entityId)
									.set(skillDoc)
									.commit();

								return {
									success: true,
									skillId: result._id,
									message: `Skill "${name}" updated successfully!`,
									isUpdate: true
								};
							} else {
								// Create new document
								result = await writeClient.create(skillDoc);

								return {
									success: true,
									skillId: result._id,
									message: `Skill "${name}" created successfully!`,
									isUpdate: false
								};
							}
						} catch (error: any) {
							console.error(`❌ Error with skill:`, error);
							return {
								success: false,
								message: `Error with skill: ${error.message}`
							};
						}
					},
				}),
			},
		});

		console.log(`✅ ${entityType} stream response ready`);

		return result.toDataStreamResponse({
			headers: {
				'Content-Type': 'text/event-stream',
				'Connection': 'keep-alive',
				'Cache-Control': 'no-cache, no-transform',
			},
		});
	} catch (error) {
		console.error(`❌ Error in ${params.entityType} API route:`, error);
		return NextResponse.json(
			{ error: 'An error occurred while processing your request' },
			{ status: 500 }
		);
	}
} 