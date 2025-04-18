import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
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
}

interface FeaturedProjectsProps {
	projects: FeaturedProject[];
}

export const FeaturedProjects: React.FC<FeaturedProjectsProps> = ({ projects }) => {
	return (
		<div className="space-y-10">
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
				{projects.map((project, index) => (
					<Card
						key={index}
						className="flex flex-col h-full overflow-hidden group border-gray-200 shadow-sm hover:shadow-md transition-all duration-300"
					>
						<CardHeader className="p-0">
							{project.image && (
								<div className="relative h-52 w-full overflow-hidden">
									<Image
										src={project.image}
										alt={project.title}
										fill
										className="object-cover rounded-t-lg transition-transform duration-500 group-hover:scale-105"
										sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
									/>
									<div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
								</div>
							)}
						</CardHeader>
						<CardContent className="flex-grow p-6 space-y-4">
							<div className="space-y-2">
								<div className="flex items-start justify-between">
									<h3 className="text-xl font-bold group-hover:text-primary transition-colors duration-300">{project.title}</h3>
									{project.company && (
										<span className="text-sm text-gray-500 font-medium">{project.company}</span>
									)}
								</div>
								<p className="text-gray-600 line-clamp-3">{project.description}</p>
							</div>

							<div className="flex flex-wrap gap-2">
								{project.tags.map((tag, tagIndex) => (
									<Badge key={tagIndex} variant="secondary" className="text-xs">
										{tag}
									</Badge>
								))}
							</div>
						</CardContent>
						<CardFooter className="px-6 pb-6 pt-0">
							<Link href={project.link || '/projects'} className="w-full">
								<Button variant="outline" className="w-full justify-between group-hover:bg-primary/5 transition-colors">
									View Details
									<ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
								</Button>
							</Link>
						</CardFooter>
					</Card>
				))}
			</div>

			<div className="text-center pt-4">
				<Link href="/projects">
					<Button variant="default" size="lg" className="gap-2">
						View All Projects
						<ArrowRight className="h-4 w-4" />
					</Button>
				</Link>
			</div>
		</div>
	);
}; 