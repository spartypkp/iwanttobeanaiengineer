// components/ProjectCard.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";

export interface Project {
    id: string;
    name: string;
    description: string;
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
        <Card className="m-2 bg-white shadow-lg rounded-lg">
            <CardHeader>
                <div className="text-xl font-semibold">{project.name}</div>
                <div className="text-sm text-gray-600">Started: {project.startDate.toDateString()}</div>
            </CardHeader>
            <CardContent>
                <p>{project.description}</p>
                <div className="flex flex-wrap mt-2">
                    {project.technologies.map((tech, index) => (
                        <span key={index} className="bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">{tech}</span>
                    ))}
                </div>
            </CardContent>
            <CardFooter>
                <a href={project.githubUrl} className="text-blue-500 hover:text-blue-800">GitHub</a>
                {project.liveDemoUrl && <a href={project.liveDemoUrl} className="ml-4 text-blue-500 hover:text-blue-800">Live Demo</a>}
                <p className="text-sm text-gray-500 mt-2">Status: {project.status}</p>
            </CardFooter>
        </Card>
    );
}

export default ProjectCard;
