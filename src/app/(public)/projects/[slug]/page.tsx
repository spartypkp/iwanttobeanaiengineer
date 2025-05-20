import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getAllProjects, getProjectBySlug, urlForImage } from '@/sanity/lib/client';
import { ArrowLeft, ExternalLink, Film, Github, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// Revalidate this page frequently or set to 0 for always fresh during development
export const revalidate = 3600; // For production, consider a value like 3600 (1 hour)

// Generate static params for all projects
export async function generateStaticParams() {
	const projects = await getAllProjects();

	return projects.map((project) => ({
		slug: project.slug?.current || '',
	}));
}

// Generate metadata for the page
export async function generateMetadata({ params }: { params: { slug: string; }; }) {
	const project = await getProjectBySlug(params.slug);

	if (!project) {
		return {
			title: 'Project Not Found',
			description: 'The requested project could not be found.',
		};
	}

	return {
		title: `${project.title} | Projects | Will Diamond`,
		description: project.description || 'Project details',
	};
}

export default async function ProjectPage({ params }: { params: { slug: string; }; }) {
	const project = await getProjectBySlug(params.slug);

	// Log the full project object to the server console for debugging
	//console.log("[ProjectPage] Full project object for slug:", params.slug, JSON.stringify(project, null, 2));

	if (!project) {
		notFound();
	}

	// Find main media - prefer a featured video, then any featured media, then thumbnail
	const featuredVideo = project.media?.find(m => m.featured && m.type === 'video');
	const featuredMedia = !featuredVideo ? project.media?.find(m => m.featured) : null;

	// Use featured video or media if available, otherwise use thumbnail
	const mainMedia = featuredVideo || featuredMedia || null;

	// Get thumbnail URL from Sanity
	const thumbnailUrl = project.thumbnail ? urlForImage(project.thumbnail).url() : null;

	// Check if main media is a video
	const isMainVideo = mainMedia?.type === 'video';

	// Determine main media URL - URLs should already be processed by the GROQ query
	const mainMediaUrl = mainMedia?.url || thumbnailUrl;

	// Get poster URL - should be a string from GROQ or fall back to thumbnail
	// In the client.ts GROQ query, poster is already transformed to a URL string
	const posterUrl = (isMainVideo && typeof mainMedia?.poster === 'string')
		? mainMedia.poster
		: thumbnailUrl;

	// Other media items (excluding the main one)
	const otherMedia = project.media?.filter(m => m !== mainMedia) || [];

	// Get timeline information
	const startDate = project.timeline?.startDate
		? new Date(project.timeline.startDate).toLocaleDateString('en-US', {
			year: 'numeric', month: 'long', day: 'numeric'
		})
		: null;

	const endDate = project.timeline?.endDate
		? new Date(project.timeline.endDate).toLocaleDateString('en-US', {
			year: 'numeric', month: 'long', day: 'numeric'
		})
		: null;

	const status = project.timeline?.status || 'active';

	// Get technology names
	const technologies = project.technologies?.map(t => t.name).filter(Boolean) || [];

	return (
		<div className="container max-w-5xl mx-auto px-4 py-12">
			{/* Back navigation */}
			<div className="mb-8">
				<Button variant="ghost" asChild className="pl-0 hover:pl-0">
					<Link href="/projects" className="flex items-center gap-2">
						<ArrowLeft className="w-4 h-4" />
						<span>All Projects</span>
					</Link>
				</Button>
			</div>

			{/* Project header */}
			<div className="mb-12">
				{/* Terminal-style header */}
				<div className="bg-zinc-900 border border-primary/20 rounded-t-md px-4 py-3 font-mono text-xs shadow-[0_0_30px_rgba(var(--primary-rgb),0.1)]">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<div className="flex items-center gap-1.5">
								<div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
								<div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
								<div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
							</div>
							<div className="text-primary/80 ml-2">cat ~/projects/{params.slug}/README.md</div>
						</div>
						<div className="text-primary/40 text-[10px]">
							{status}
						</div>
					</div>
				</div>

				{/* Title and description */}
				<div className="border border-primary/20 rounded-b-md p-6 shadow-lg bg-black/40">
					<h1 className="text-4xl font-bold mb-3 font-mono flex items-center">
						<span className="text-primary mr-2">&gt;</span>
						{project.title}
						<span className="ml-2 inline-block w-3 h-6 bg-primary/70 animate-pulse"></span>
					</h1>

					{/* Status and timeline */}
					<div className="flex flex-wrap items-center gap-3 mb-6 text-sm text-muted-foreground">
						<Badge variant="outline" className="font-mono text-primary border-primary/30">
							{status.charAt(0).toUpperCase() + status.slice(1)}
						</Badge>
						{startDate && (
							<span>Started: {startDate}</span>
						)}
						{endDate && (
							<span>Completed: {endDate}</span>
						)}
						{project.company && (
							<span>Company: {project.company}</span>
						)}
					</div>

					<p className="text-lg mb-6">{project.description}</p>

					{/* Links */}
					<div className="flex flex-wrap gap-3">
						{project.github && (
							<Button variant="outline" asChild>
								<a href={project.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
									<Github className="w-4 h-4" />
									<span>GitHub</span>
								</a>
							</Button>
						)}

						{project.demoUrl && (
							<Button asChild>
								<a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
									<ExternalLink className="w-4 h-4" />
									<span>Live Demo</span>
								</a>
							</Button>
						)}

						{project.caseStudyUrl && (
							<Button variant="secondary" asChild>
								<a href={project.caseStudyUrl} target="_blank" rel="noopener noreferrer">
									Case Study
								</a>
							</Button>
						)}
					</div>
				</div>
			</div>

			{/* Main content in a two-column layout for desktop, single column for mobile */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				{/* Left column - main content */}
				<div className="lg:col-span-2 space-y-12">
					{/* Main media (image or video) */}
					{mainMediaUrl && (
						<div className="rounded-md overflow-hidden border border-primary/20 shadow-lg">
							{isMainVideo ? (
								<div className="relative aspect-video">
									<video
										src={mainMediaUrl}
										poster={posterUrl || undefined}
										className="w-full h-full object-cover"
										controls
										playsInline
										preload="metadata"
									/>
									<div className="absolute inset-0 terminal-scan-lines pointer-events-none opacity-30"></div>
								</div>
							) : (
								<Image
									src={mainMediaUrl}
									alt={mainMedia?.alt || project.thumbnail?.alt || project.title || 'Project image'}
									width={900}
									height={500}
									className="w-full object-cover"
								/>
							)}
						</div>
					)}

					{/* Problem & Solution */}
					{(project.problem || project.solution) && (
						<section>
							<h2 className="text-2xl font-bold mb-4 flex items-center">
								<span className="text-primary mr-2">&gt;</span>
								Problem & Solution
							</h2>
							<div className="space-y-6 pl-6">
								{project.problem && (
									<div>
										<h3 className="text-xl font-semibold mb-2">Problem</h3>
										<p className="text-muted-foreground">{project.problem}</p>
									</div>
								)}

								{project.solution && (
									<div>
										<h3 className="text-xl font-semibold mb-2">Solution</h3>
										<p className="text-muted-foreground">{project.solution}</p>
									</div>
								)}
							</div>
						</section>
					)}

					{/* Challenges */}
					{project.challenges && project.challenges.length > 0 && (
						<section>
							<h2 className="text-2xl font-bold mb-4 flex items-center">
								<span className="text-primary mr-2">&gt;</span>
								Challenges
							</h2>
							<div className="space-y-6 pl-6">
								{project.challenges.map((challenge, index) => (
									<div key={challenge._key || index}>
										{challenge.title && (
											<h3 className="text-xl font-semibold mb-2">{challenge.title}</h3>
										)}
										{challenge.description && (
											<p className="text-muted-foreground">{challenge.description}</p>
										)}
									</div>
								))}
							</div>
						</section>
					)}

					{/* Approach */}
					{project.approach && project.approach.length > 0 && (
						<section>
							<h2 className="text-2xl font-bold mb-4 flex items-center">
								<span className="text-primary mr-2">&gt;</span>
								Approach
							</h2>
							<div className="space-y-6 pl-6">
								{project.approach.map((item, index) => (
									<div key={item._key || index}>
										{item.title && (
											<h3 className="text-xl font-semibold mb-2">{item.title}</h3>
										)}
										{item.description && (
											<p className="text-muted-foreground">{item.description}</p>
										)}
									</div>
								))}
							</div>
						</section>
					)}

					{/* Technical Insights */}
					{project.technicalInsights && project.technicalInsights.length > 0 && (
						<section>
							<h2 className="text-2xl font-bold mb-4 flex items-center">
								<span className="text-primary mr-2">&gt;</span>
								Technical Insights
							</h2>
							<div className="space-y-6 pl-6">
								{project.technicalInsights.map((insight, index) => (
									<div key={insight._key || index}>
										{insight.title && (
											<h3 className="text-xl font-semibold mb-2">{insight.title}</h3>
										)}
										{insight.description && (
											<p className="text-muted-foreground mb-3">{insight.description}</p>
										)}
										{insight.code && (
											<pre className="bg-zinc-900 p-4 rounded-md overflow-x-auto text-sm">
												<code>{insight.code}</code>
											</pre>
										)}
									</div>
								))}
							</div>
						</section>
					)}

					{/* Additional Media (Images & Videos) */}
					{otherMedia.length > 0 && (
						<section>
							<h2 className="text-2xl font-bold mb-4 flex items-center">
								<span className="text-primary mr-2">&gt;</span>
								Project Gallery
							</h2>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								{otherMedia.map((media, index) => {
									const isVideo = media.type === 'video';
									const mediaUrl = media.url;

									if (!mediaUrl) return null;

									// Handle poster for video using type check
									const mediaPoster = isVideo && typeof media.poster === 'string'
										? media.poster
										: undefined;

									return (
										<div key={media._key || index} className="rounded-md overflow-hidden border border-primary/20 relative group">
											{isVideo ? (
												<div className="aspect-video relative">
													<video
														src={mediaUrl}
														poster={mediaPoster}
														className="w-full h-full object-cover"
														controls
														playsInline
														preload="metadata"
													/>
													<div className="absolute inset-0 terminal-scan-lines pointer-events-none opacity-30"></div>
													<div className="absolute top-2 right-2 z-10">
														<Badge variant="outline" className="bg-black/80 border-primary/40 text-primary">
															<Film className="w-3 h-3 mr-1" />
															VIDEO
														</Badge>
													</div>
												</div>
											) : (
												<>
													<Image
														src={mediaUrl}
														alt={media.alt || `Project image ${index + 1}`}
														width={500}
														height={300}
														className="w-full object-cover"
													/>
													<div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
														<Badge variant="outline" className="bg-black/80 border-primary/40 text-primary">
															<ImageIcon className="w-3 h-3 mr-1" />
															IMAGE
														</Badge>
													</div>
												</>
											)}
											{media.caption && (
												<div className="p-2 text-sm text-muted-foreground">{media.caption}</div>
											)}
										</div>
									);
								})}
							</div>
						</section>
					)}
				</div>

				{/* Right column - sidebar */}
				<div className="space-y-8">
					{/* Technologies */}
					<div className="border border-primary/20 rounded-md p-4 shadow-md">
						<h3 className="text-lg font-bold mb-3 flex items-center">
							<span className="text-primary mr-2">&gt;</span>
							Technologies
						</h3>
						<div className="flex flex-wrap gap-2">
							{technologies.map((tech, index) => (
								<Badge key={index} variant="secondary">
									{tech}
								</Badge>
							))}
						</div>
					</div>

					{/* Results */}
					{project.results && project.results.length > 0 && (
						<div className="border border-primary/20 rounded-md p-4 shadow-md">
							<h3 className="text-lg font-bold mb-3 flex items-center">
								<span className="text-primary mr-2">&gt;</span>
								Results
							</h3>
							<ul className="list-disc pl-6 space-y-2">
								{project.results.map((result, index) => (
									<li key={index} className="text-muted-foreground">{result}</li>
								))}
							</ul>
						</div>
					)}

					{/* Key Metrics */}
					{project.metrics && project.metrics.length > 0 && (
						<div className="border border-primary/20 rounded-md p-4 shadow-md">
							<h3 className="text-lg font-bold mb-3 flex items-center">
								<span className="text-primary mr-2">&gt;</span>
								Key Metrics
							</h3>
							<div className="space-y-4">
								{project.metrics.map((metric, index) => (
									<div key={metric._key || index} className="flex justify-between">
										<span className="text-muted-foreground">{metric.label}</span>
										<span className="font-semibold">{metric.value}{metric.unit ? ` ${metric.unit}` : ''}</span>
									</div>
								))}
							</div>
						</div>
					)}

					{/* Key Learnings */}
					{project.learnings && project.learnings.length > 0 && (
						<div className="border border-primary/20 rounded-md p-4 shadow-md">
							<h3 className="text-lg font-bold mb-3 flex items-center">
								<span className="text-primary mr-2">&gt;</span>
								Key Learnings
							</h3>
							<ul className="list-disc pl-6 space-y-2">
								{project.learnings.map((learning, index) => (
									<li key={index} className="text-muted-foreground">{learning}</li>
								))}
							</ul>
						</div>
					)}
				</div>
			</div>

			{/* Terminal footer */}
			<div className="mt-16">
				<div className="bg-zinc-900 border border-primary/20 rounded-md px-4 py-3 font-mono text-xs shadow-[0_0_30px_rgba(var(--primary-rgb),0.1)]">
					<div className="flex items-center justify-between">
						<div className="flex items-center">
							<span className="text-primary/80 mr-2">$</span>
							<span className="text-primary/60">cd ~/projects</span>
						</div>
						<div className="flex items-center gap-2 text-[10px] text-primary/40">
							<span>will@diamond:~</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
} 