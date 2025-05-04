import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { ArrowRight, ExternalLink, Github } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export interface FeaturedProject {
	title: string;
	description: string;
	company?: string;
	tags: string[];
	image?: string;
	link?: string;
	github?: string;
	demoUrl?: string;
}

interface FeaturedProjectsProps {
	projects: FeaturedProject[];
}

export const FeaturedProjects: React.FC<FeaturedProjectsProps> = ({ projects }) => {
	return (
		<div className="relative space-y-10 py-6">
			{/* Background highlight effect */}
			<div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-3xl -z-10"></div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 py-6">
				{projects.map((project, index) => (
					<Card
						key={index}
						className="flex flex-col h-full overflow-hidden group border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 bg-card/90 backdrop-blur-sm relative"
					>
						{/* Top accent bar */}
						<div className="absolute top-0 left-0 w-full h-1 bg-primary/60"></div>

						<CardHeader className="p-0">
							{project.image && (
								<div className="relative h-56 w-full overflow-hidden">
									<Image
										src={project.image}
										alt={project.title}
										fill
										className="object-cover rounded-t-lg transition-transform duration-500 group-hover:scale-110"
										sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
									/>
									<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300" />

									{/* Title overlay on image */}
									<div className="absolute bottom-4 left-4 right-4 transition-all duration-300">
										<h3 className="text-2xl font-bold text-white group-hover:text-primary-foreground transition-colors duration-300">{project.title}</h3>
										{project.company && (
											<span className="text-sm text-white/80 font-medium">{project.company}</span>
										)}
									</div>
								</div>
							)}
						</CardHeader>
						<CardContent className="flex-grow p-6 space-y-4">
							<p className="text-gray-600 text-base">{project.description}</p>

							<div className="flex flex-wrap gap-2 pt-2">
								{project.tags.map((tag, tagIndex) => (
									<Badge key={tagIndex} variant="secondary" className="px-2.5 py-0.5 text-xs font-medium bg-secondary/60 hover:bg-secondary">
										{tag}
									</Badge>
								))}
							</div>
						</CardContent>
						<CardFooter className="px-6 pb-6 pt-0 flex gap-3 justify-between">
							<Link href={project.link || '/projects'} className="flex-grow">
								<Button variant="default" className="w-full justify-between group-hover:bg-primary transition-colors">
									View Details
									<ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
								</Button>
							</Link>

							{/* Action buttons */}
							<div className="flex gap-2">
								{project.github && (
									<Button variant="outline" size="icon" asChild className="h-10 w-10">
										<a href={project.github} target="_blank" rel="noopener noreferrer" aria-label="View GitHub repository">
											<Github className="h-5 w-5" />
										</a>
									</Button>
								)}
								{project.demoUrl && (
									<Button variant="outline" size="icon" asChild className="h-10 w-10">
										<a href={project.demoUrl} target="_blank" rel="noopener noreferrer" aria-label="View live demo">
											<ExternalLink className="h-5 w-5" />
										</a>
									</Button>
								)}
							</div>
						</CardFooter>
					</Card>
				))}
			</div>

			<div className="text-center pt-6 pb-2">
				<Link href="/projects">
					<Button variant="default" size="lg" className="gap-2 px-8 relative overflow-hidden group">
						<span className="relative z-10">View All Projects</span>
						<ArrowRight className="h-4 w-4 relative z-10 group-hover:translate-x-1 transition-transform" />
						<div className="absolute inset-0 bg-primary/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
					</Button>
				</Link>
			</div>
		</div>
	);
}; 