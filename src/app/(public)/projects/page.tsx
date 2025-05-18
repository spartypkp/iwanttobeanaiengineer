import ProjectGrid from '@/components/custom/projectShowcase/projectGrid';
import { getAllProjects } from '@/sanity/lib/client';
import { Loader2 } from 'lucide-react';

// Opt-out of caching for this page, or set a short revalidation time
export const revalidate = 3600; // Revalidate at most once per hour

// Metadata for the page
export const metadata = {
	title: 'Projects | Will Diamond',
	description: 'Explore a curated selection of projects by Will Diamond, showcasing expertise in AI, web development, and more.',
	keywords: ['projects', 'portfolio', 'Will Diamond', 'AI engineer', 'software developer', 'web development', 'data engineering'],
	openGraph: {
		title: 'Projects | Will Diamond',
		description: 'Dive into the portfolio of Will Diamond, featuring innovative projects across various tech domains.',
		// You can add a specific image for the projects page here if desired
	},
};

// Loading component
function ProjectsLoading() {
	return (
		<div className="flex justify-center items-center min-h-[400px]">
			<div className="flex flex-col items-center gap-4">
				<Loader2 className="h-8 w-8 animate-spin text-primary" />
				<p className="text-muted-foreground font-mono">
					<span className="text-primary">$</span> loading_projects.sh
				</p>
			</div>
		</div>
	);
}

// Main projects component - will load asynchronously
async function ProjectsList() {
	// Fetch all projects from Sanity
	const projects = await getAllProjects();

	return <ProjectGrid projects={projects} />;
}

export default function ProjectsPage() {
	return (
		<div className="container mx-auto px-4 py-12 md:py-20">
			<header className="mb-12 text-center">
				<h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">My Projects</h1>
				<p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
					A collection of my work, from AI explorations and full-stack applications to open-source contributions and experimental prototypes.
				</p>
			</header>

			<main>
				<ProjectsList />
			</main>
		</div>
	);
}