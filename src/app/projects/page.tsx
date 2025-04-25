import ProjectGrid from '@/components/custom/projectGrid';
import { getAllProjects } from '@/sanity/lib/client';
import { Loader2 } from 'lucide-react';
import { Suspense } from 'react';

// Metadata for the page
export const metadata = {
	title: 'Projects | Will Diamond',
	description: 'Explore my projects in AI engineering, web development, and more.'
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
		<div className="container mx-auto px-4 py-12">
			<div className="text-center mb-12">
				<h1 className="text-4xl font-bold mb-4 font-mono flex items-center justify-center">
					<span className="text-primary mr-3">&gt;</span>
					Project Portfolio
					<span className="ml-2 inline-block w-3 h-6 bg-primary/70 animate-blink"></span>
				</h1>
				<p className="text-lg text-muted-foreground max-w-3xl mx-auto">
					A collection of my projects showcasing experience with AI, web development,
					and software engineering. Each project represents different skills and technologies.
				</p>
			</div>

			{/* Terminal-style header for the projects section */}
			<div className="mx-auto mb-8 max-w-6xl">
				<div className="bg-zinc-900 border border-primary/20 rounded-md px-4 py-3 font-mono text-xs shadow-[0_0_15px_rgba(var(--primary-rgb),0.2)] relative">
					{/* Terminal window controls */}
					<div className="absolute left-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
						<div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
						<div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
						<div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
					</div>

					<div className="flex items-center justify-center">
						<div className="text-primary/80 font-mono">
							<span className="text-primary/80 mr-2">$</span>
							<span className="text-primary/60">ls -la ~/projects | sort -r</span>
						</div>
					</div>

					<div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 text-[10px] text-primary/40">
						<span className="h-1.5 w-1.5 rounded-full bg-primary/30"></span>
						<span>will@diamond:~</span>
					</div>
				</div>
			</div>

			<div className="relative">
				{/* Terminal scan lines overlay */}
				<div className="absolute inset-0 terminal-scan-lines pointer-events-none opacity-[0.03] z-10"></div>

				<Suspense fallback={<ProjectsLoading />}>
					<ProjectsList />
				</Suspense>
			</div>

			{/* Terminal footer */}
			<div className="mx-auto mt-16 max-w-6xl">
				<div className="bg-zinc-900 border border-primary/20 rounded-md px-4 py-3 font-mono text-xs shadow-[0_0_15px_rgba(var(--primary-rgb),0.2)]">
					<div className="flex items-center justify-between">
						<div className="flex items-center">
							<span className="text-primary/80 mr-2">$</span>
							<span className="text-primary/60">echo &quot;Thanks for exploring my work!&quot;</span>
						</div>
						<div className="flex items-center gap-2 text-[10px] text-primary/40">
							<span>exit 0</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}