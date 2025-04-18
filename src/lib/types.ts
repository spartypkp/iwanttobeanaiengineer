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

