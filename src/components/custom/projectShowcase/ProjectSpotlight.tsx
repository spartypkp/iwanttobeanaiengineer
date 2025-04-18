"use client";

import MatrixRain from '@/components/custom/matrixRain';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ProjectShowcase } from '@/lib/types';
import { ArrowRight, Calendar, ExternalLink, Github } from 'lucide-react';
import React from 'react';
import ProjectInfo from './ProjectInfo';
import ProjectMedia from './ProjectMedia';

interface ProjectSpotlightProps {
	project: ProjectShowcase;
	isActive: boolean;
	onNext: () => void;
	onPrevious: () => void;
}

const ProjectSpotlight: React.FC<ProjectSpotlightProps> = ({
	project,
	isActive,
	onNext,
	onPrevious,
}) => {
	// Extract base color from project's primaryColor
	const rgbColor = project.primaryColor.startsWith('#')
		? hexToRgb(project.primaryColor)
		: project.primaryColor;

	return (
		<div
			className="flex flex-col w-full h-full relative overflow-hidden bg-background/95 rounded-xl shadow-2xl border border-primary/5"
			style={{
				'--primary-rgb': rgbColor
			} as React.CSSProperties}
		>
			{/* Subtle matrix rain effect with reduced opacity */}
			{isActive && (
				<div className="absolute inset-0 pointer-events-none opacity-15 mix-blend-overlay">
					<MatrixRain
						opacity={0.05}
						density={20}
						speed={0.8}
					/>
				</div>
			)}

			{/* Background gradient and effects */}
			<div className="absolute inset-0 bg-gradient-to-br from-background/20 via-transparent to-primary/5 pointer-events-none" />
			<div className="absolute inset-0 bg-noise opacity-[0.03] mix-blend-overlay pointer-events-none" />

			{/* Subtle accent glows positioned strategically */}
			<div className="absolute -top-20 -left-20 w-40 h-40 bg-primary/10 rounded-full filter blur-3xl opacity-20 pointer-events-none" />
			<div className="absolute -bottom-20 -right-20 w-40 h-40 bg-primary/10 rounded-full filter blur-3xl opacity-20 pointer-events-none" />

			{/* Main content wrapper - using flex-1 to take available space */}
			<div className="flex flex-col flex-1 min-h-0">

				{/* Top bar - positioned at the top of the layout */}
				<div className="relative flex flex-col md:flex-row items-center justify-between bg-background/95 backdrop-blur-md border-t border-primary/20 px-4 py-3 md:py-4 z-10 flex-shrink-0">
					<h2 className="text-lg font-semibold text-foreground">{project.title}</h2>
					{project.company && (
						<span className="text-sm text-muted-foreground">{project.company}</span>
					)}
				</div>


				{/* Media and Info sections wrapper */}
				<div className="flex flex-col md:flex-row flex-1 min-h-0 overflow-hidden">
					{/* Media section (65% on desktop, full width on mobile) */}
					<div className="flex flex-col w-full md:w-[65%] h-[35vh] md:h-auto min-h-0 flex-1 overflow-hidden">
						<ProjectMedia
							media={project.media}
							isActive={isActive}
							primaryColor={project.primaryColor}
						/>
					</div>

					{/* Info section (35% on desktop, full width on mobile) */}
					<div className="flex flex-col w-full md:w-[35%] h-[35vh] md:h-auto min-h-0 flex-1 overflow-hidden shadow-lg">
						<ProjectInfo
							project={project}
							isActive={isActive}
						/>
					</div>
				</div>

				{/* Bottom bar - positioned at the bottom of the layout */}
				<div className="relative flex flex-col md:flex-row items-center justify-between bg-background/95 backdrop-blur-md border-t border-primary/20 px-4 py-3 md:py-4 z-10 flex-shrink-0">
					{/* Timeline Section */}
					{project.timeline && (
						<div className="flex items-center gap-2 text-xs text-muted-foreground mb-2 md:mb-0">
							<Calendar size={14} className="text-primary/70" />
							<span>{project.timeline.startDate}</span>
							<ArrowRight size={10} />
							<span>{project.timeline.endDate || 'Present'}</span>
							<Badge variant="secondary" className="ml-1 bg-primary/10 text-primary border-none text-xs px-2 py-0">
								{project.timeline.status.charAt(0).toUpperCase() + project.timeline.status.slice(1)}
							</Badge>
						</div>
					)}

					{/* Links Section */}
					<div className="flex flex-wrap gap-2 justify-center md:justify-end">
						{project.github && (
							<Button variant="outline" size="sm" asChild className="h-8 border-primary/20 hover:bg-primary/10 hover:text-primary">
								<a href={project.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
									<Github size={14} />
									<span className="text-xs">GitHub</span>
								</a>
							</Button>
						)}
						{project.demoUrl && (
							<Button variant="outline" size="sm" asChild className="h-8 border-primary/20 hover:bg-primary/10 hover:text-primary">
								<a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
									<ExternalLink size={14} />
									<span className="text-xs">Live Demo</span>
								</a>
							</Button>
						)}
						{project.caseStudyUrl && (
							<Button variant="default" size="sm" asChild className="h-8 bg-primary hover:bg-primary/90">
								<a href={project.caseStudyUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
									<span className="text-xs">Case Study</span>
								</a>
							</Button>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

// Helper function to convert hex to RGB
function hexToRgb(hex: string): string {
	// Remove # if present
	hex = hex.replace('#', '');

	// Parse hex values
	const r = parseInt(hex.substring(0, 2), 16);
	const g = parseInt(hex.substring(2, 4), 16);
	const b = parseInt(hex.substring(4, 6), 16);

	return `${r}, ${g}, ${b}`;
}

export default ProjectSpotlight; 