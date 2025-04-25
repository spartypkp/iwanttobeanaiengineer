import { useChat } from 'ai/react';

// Chat context type
export type AdminChatContextType = {
	chatHooks: ReturnType<typeof useChat> | null;
	setChatHooks: (chat: ReturnType<typeof useChat>) => void;
};

// Content item type
export type ContentItem = {
	id: string;
	title: string;
	type: string;
	description?: string;
	metadata?: {
		status?: string;
		date?: string;
		proficiency?: string;
		featured?: string;
		priority?: string;
		hasQuestion?: string;
		[key: string]: string | undefined;
	};
};

// Content type enum
export type ContentType = 'project' | 'knowledge' | 'skill' | null;

// Field definitions
export const PROJECT_FIELDS = [
	{ id: 'title', label: 'Title', required: true },
	{ id: 'description', label: 'Description', required: true },
	{ id: 'status', label: 'Status', required: true },
	{ id: 'problem', label: 'Problem', required: false },
	{ id: 'solution', label: 'Solution', required: false },
	{ id: 'technologies', label: 'Technologies', required: false },
	{ id: 'github', label: 'GitHub URL', required: false },
	{ id: 'demoUrl', label: 'Demo URL', required: false },
];

// Knowledge item schema fields
export const KNOWLEDGE_FIELDS = [
	{ id: 'title', label: 'Title', required: true },
	{ id: 'category', label: 'Category', required: true },
	{ id: 'content', label: 'Content', required: true },
	{ id: 'question', label: 'Question', required: false },
	{ id: 'keywords', label: 'Keywords', required: true },
	{ id: 'priority', label: 'Priority', required: true },
];

// Skill schema fields
export const SKILL_FIELDS = [
	{ id: 'name', label: 'Name', required: true },
	{ id: 'category', label: 'Category', required: true },
	{ id: 'proficiency', label: 'Proficiency', required: true },
	{ id: 'description', label: 'Description', required: false },
	{ id: 'yearsExperience', label: 'Years of Experience', required: false },
	{ id: 'examples', label: 'Examples', required: false },
]; 