// Types for the personal website
// This file has been cleaned up to remove blog-related functionality

// Add any new types for other features here
export { };

export interface ProjectShowcase {
	id: string;
	title: string;
	company?: string;
	description: string;
	problem: string;
	solution: string;

	// Enhanced storytelling fields
	challenges: {
		title: string;
		description: string;
	}[];
	approach: {
		title: string;
		description: string;
	}[];
	technicalInsights: {
		title: string;
		description: string;
		code?: string;
		language?: string;
	}[];
	learnings: string[];
	achievements: string[];
	personalContribution?: string;

	results: string[];
	metrics: {
		label: string;
		value: number;
		unit?: string;
		icon?: React.ReactNode;
	}[];
	technologies: {
		name: string;
		category: "frontend" | "backend" | "data" | "devops" | "ai";
		icon?: React.ReactNode;
	}[];
	media: {
		type: "image" | "video" | "demo" | "3d";
		url: string;
		alt?: string;
		poster?: string; // for videos
	}[];
	primaryColor: string; // for theming
	github?: string;
	demoUrl?: string;
	caseStudyUrl?: string;
	timeline?: {
		startDate: string;
		endDate?: string;
		status: "active" | "completed" | "maintenance" | "archived";
	};
}

// --- Message Part Types ---

/**
 * Represents a text part in a message
 */
export interface TextPart {
	type: 'text';
	text: string;
}

/**
 * Represents a tool invocation with all required properties
 */
export interface ToolInvocation {
	toolName: string;
	toolCallId: string;
	state: 'partial-call' | 'call' | 'result';
	args: Record<string, any>;
	result?: any;
	hasResult?: boolean; // Tracks whether a result exists explicitly
}

/**
 * Represents a tool invocation part in a message
 */
export interface ToolInvocationPart {
	type: 'tool-invocation';
	toolInvocation: ToolInvocation;
}

/**
 * Union type representing all possible message parts
 */
export type MessagePart = TextPart | ToolInvocationPart;

/**
 * Type for a transformed message with parts
 */
export interface TransformedMessage {
	id: string;
	parts: MessagePart[];
	role: string;
	content: string;
	[key: string]: any;
}

/**
 * Type for conversation mode
 */
export type ConversationMode = 'regular' | 'refinement';

