// components/ProjectCard.tsx
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Github, Globe } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

export interface Project {
	id: string;
	name: string;
	description: string;
	features: React.ReactNode;
	technologies: string[];
	githubUrl: string;
	liveDemoUrl?: string;
	status: 'Active' | 'Maintenance' | 'Archived';
	startDate: Date;
	endDate?: Date;
	thumbnailSrc: string;
}

interface ProjectCardProps {
	project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
	return (
		<Card className="m-4 bg-white shadow-lg rounded-lg max-w-4xl overflow-hidden transition-all duration-300 hover:shadow-xl">
			<CardHeader className="space-y-4">
				<div className="space-y-2">
					<CardTitle className="text-4xl font-bold text-center">{project.name}</CardTitle>
					<div className="flex justify-center">
						<Badge variant={project.status === 'Active' ? 'default' : project.status === 'Maintenance' ? 'secondary' : 'outline'}>
							{project.status}
						</Badge>
						<span className="mx-2 text-gray-400">•</span>
						<span className="text-sm text-gray-600">Started: {project.startDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
						{project.endDate && (
							<>
								<span className="mx-2 text-gray-400">•</span>
								<span className="text-sm text-gray-600">Completed: {project.endDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
							</>
						)}
					</div>
				</div>

				<div className="rounded-lg overflow-hidden border border-gray-200">
					<Image
						src={project.thumbnailSrc}
						alt={project.name}
						width={800}
						height={450}
						className="w-full object-cover transition-transform duration-500 hover:scale-105"
					/>
				</div>

				<div className="space-y-2">
					<h2 className="font-bold text-xl border-b pb-2">Overview</h2>
					<p className="text-gray-700 leading-relaxed">{project.description}</p>
				</div>
			</CardHeader>

			<CardContent className="space-y-6">
				<div className="space-y-3">
					<h2 className="font-bold text-xl border-b pb-2">Features & Functionality</h2>
					<div className="text-gray-700">{project.features}</div>
				</div>

				<div className="space-y-3">
					<h2 className="font-bold text-xl border-b pb-2">Technologies</h2>
					<div className="flex flex-wrap gap-2">
						{project.technologies.map((tech, index) => (
							<Badge key={index} variant="secondary" className="text-sm py-1">
								{tech}
							</Badge>
						))}
					</div>
				</div>
			</CardContent>

			<CardFooter className="flex justify-between items-center pt-4 border-t">
				<div className="flex space-x-4">
					<Button variant="outline" size="sm" asChild>
						<a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center">
							<Github className="mr-2 h-4 w-4" />
							GitHub
						</a>
					</Button>

					{project.liveDemoUrl && (
						<Button variant="default" size="sm" asChild>
							<a href={project.liveDemoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center">
								<Globe className="mr-2 h-4 w-4" />
								Live Demo
							</a>
						</Button>
					)}
				</div>
			</CardFooter>
		</Card>
	);
};

export default ProjectCard;
