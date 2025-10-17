import ProjectGrid from '@/components/custom/projectShowcase/projectGrid';
import { getAllProjects } from '@/sanity/lib/client';
import { Loader2 } from 'lucide-react';

// Opt-out of caching for this page, or set a short revalidation time
export const revalidate = 3600; // Revalidate at most once per hour

// Metadata for the page
export const metadata = {
	title: 'AI Engineering Projects - Will Diamond Portfolio',
	description: 'Explore Will Diamond\'s AI engineering projects: compliance AI systems, LLM applications, legal tech tools, and production RAG systems. Featured work from Contoural, Texas Hold LLM, and more.',
	keywords: [
		'Will Diamond projects',
		'AI engineering portfolio',
		'compliance AI projects',
		'LLM applications',
		'legal tech AI',
		'RAG systems',
		'production AI systems',
		'AI engineer portfolio',
		'Contoural AI',
		'Texas Hold LLM'
	],
	openGraph: {
		title: 'AI Engineering Projects | Will Diamond',
		description: 'Portfolio of production AI systems including compliance AI for Fortune 500, LLM applications, and legal tech innovations.',
		url: 'https://will-diamond.com/projects',
		type: 'website',
		images: [
			{
				url: '/diamond.png',
				width: 1200,
				height: 630,
				alt: 'Will Diamond - AI Engineering Projects',
			},
		],
	},
	twitter: {
		card: 'summary_large_image',
		title: 'AI Engineering Projects | Will Diamond',
		description: 'Portfolio of production AI systems and LLM applications',
		images: ['/diamond.png'],
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