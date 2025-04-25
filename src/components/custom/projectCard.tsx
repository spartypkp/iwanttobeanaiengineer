// components/ProjectCard.tsx
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Project } from '@/sanity/sanity.types';
import { ExternalLink, Github } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface ProjectCardProps {
	project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
	// Find thumbnail image for the project
	const thumbnailMedia = project.media?.find(m => m.isThumbnail) || project.media?.[0];
	const thumbnailUrl = thumbnailMedia?.url || '/placeholder-project.jpg';
	const isVideo = thumbnailMedia?.type === 'video';
	// Get poster URL (if available)
	const posterUrl = thumbnailMedia?.poster as string | undefined;

	// Get project status
	const status = project.timeline?.status || 'active';

	// Get slug for project detail page
	const slug = project.slug?.current || '';
	console.log(`Slug for ${project.title} is ${slug}`);

	// Get a list of technology names
	const techNames = project.technologies?.map(tech => tech.name).filter(Boolean) || [];

	return (
		<Card className="overflow-hidden transition-all hover:shadow-lg terminal-glow group bg-card border-primary/30 hover:border-primary/60" style={{ borderColor: project.primaryColor ? `${project.primaryColor}40` : undefined }}>
			<CardHeader className="p-0 relative">
				{/* Terminal-style header bar */}
				<div className="flex items-center justify-between py-2 px-4 bg-black/80 border-b border-primary/20">
					<div className="flex items-center gap-1.5">
						<div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
						<div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
						<div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
					</div>
					<div className="text-xs font-mono text-primary/80 truncate">
						~/projects/{slug}
					</div>
					<div className="w-4"></div>
				</div>

				{/* Project thumbnail image or video */}
				<div className="aspect-video relative overflow-hidden bg-black/60">
					{isVideo ? (
						// Video element for video thumbnails
						<video
							src={thumbnailUrl}
							poster={posterUrl}
							className="absolute inset-0 w-full h-full object-cover"
							autoPlay={false}
							loop
							muted
							playsInline
							controls={false}
						/>
					) : thumbnailUrl && (
						// Image component for image thumbnails
						<Image
							src={thumbnailUrl}
							alt={project.title || 'Project thumbnail'}
							fill
							className="object-cover transition-transform group-hover:scale-105 opacity-80 group-hover:opacity-100"
							sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
						/>
					)}

					{/* Terminal scan lines overlay */}
					<div className="absolute inset-0 terminal-scan-lines pointer-events-none"></div>

					{/* Status badge */}
					<div className="absolute bottom-3 left-3 z-10">
						<Badge
							variant="outline"
							className="text-xs font-mono bg-black/80 border-primary/40 text-primary font-medium"
						>
							{status}
						</Badge>
					</div>

					{/* Video indicator if it's a video */}
					{isVideo && (
						<div className="absolute top-3 right-3 z-10">
							<Badge variant="outline" className="bg-black/80 border-primary/40 text-primary">
								VIDEO
							</Badge>
						</div>
					)}
				</div>
			</CardHeader>

			<CardContent className="p-5 bg-card">
				{/* Project title with terminal prompt */}
				<h3 className="font-mono text-xl font-bold mb-3 flex items-center text-primary">
					<span className="text-primary mr-1.5">{'>'}</span>
					{project.title}
				</h3>

				{/* Project description - truncated */}
				<p className="text-foreground text-sm mb-4 line-clamp-3">
					{project.description}
				</p>

				{/* Tech stack */}
				<div className="flex flex-wrap gap-1.5 mb-2 mt-3">
					{techNames.slice(0, 5).map((tech, i) => (
						<Badge key={i} variant="secondary" className="text-xs bg-secondary/60 text-foreground">
							{tech}
						</Badge>
					))}
					{techNames.length > 5 && (
						<Badge variant="secondary" className="text-xs bg-secondary/60 text-foreground">
							+{techNames.length - 5} more
						</Badge>
					)}
				</div>
			</CardContent>

			<CardFooter className="px-5 pb-5 pt-0 flex items-center justify-between bg-card">
				<div className="flex gap-2">
					{project.github && (
						<Button variant="outline" size="sm" asChild className="h-8 gap-1 border-primary/30 hover:border-primary/80 hover:bg-primary/10">
							<a href={project.github} target="_blank" rel="noopener noreferrer">
								<Github className="w-3.5 h-3.5" />
								<span className="sr-only">GitHub</span>
							</a>
						</Button>
					)}

					{project.demoUrl && (
						<Button variant="outline" size="sm" asChild className="h-8 gap-1 border-primary/30 hover:border-primary/80 hover:bg-primary/10">
							<a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
								<ExternalLink className="w-3.5 h-3.5" />
								<span className="sr-only">Live Demo</span>
							</a>
						</Button>
					)}
				</div>

				<Button asChild className="h-8 bg-primary hover:bg-primary/90 text-primary-foreground">
					<Link href={`/projects/${slug}`}>
						View Details
					</Link>
				</Button>
			</CardFooter>
		</Card>
	);
}
