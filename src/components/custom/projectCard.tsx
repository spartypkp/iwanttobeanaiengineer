// components/ProjectCard.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import Image from 'next/image';
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
		<Card className="m-2 bg-white shadow-lg rounded-lg max-w-4xl">
			<CardHeader >
				<CardTitle className="items-center justify-center text-4xl">{project.name}</CardTitle>
				<div className="text-sm text-gray-600">Started: {project.startDate.toDateString()}</div>
				<h1 className="font-bold text-xl ">Description</h1>
				<p>{project.description}</p>
				<div className="flex justify-center items-center p-4">
					<Image
						src={project.thumbnailSrc}
						alt={project.name}
						width={500}
						height={500}
						className="rounded-lg border-4 border-gray-300"
					/>
				</div>
			</CardHeader>
			<CardContent>
				<h1 className="font-semibold text-xl ">Project Features and Functionality</h1>
				<div>{project.features}</div>
				<h1 className="font-bold text-xl ">Core Technologies Used</h1>
				<div className="flex flex-wrap mt-2">
					{project.technologies.map((tech, index) => (
						<span key={index} className="bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">{tech}</span>
					))}
				</div>
			</CardContent>
			<CardFooter>
				<div className="flex flex-col">
					<a href={project.githubUrl} className="text-blue-500 hover:text-blue-800">GitHub</a>
					<a href={project.liveDemoUrl} className="text-blue-500 hover:text-blue-800">Live Demo</a>
					<p className="text-sm text-gray-500 mt-2">Project Status: {project.status}</p>

				</div>

			</CardFooter>
		</Card>
	);
};

export default ProjectCard;
