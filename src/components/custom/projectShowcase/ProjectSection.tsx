"use client";

import { ProjectShowcase } from '@/lib/types';
import { FileBadge, Terminal } from 'lucide-react';
import React, { useEffect, useId, useRef, useState } from 'react';
import ProjectDetailTabs from './ProjectDetailTabs';
import ProjectHeader from './ProjectHeader';
import ProjectMediaCarousel from './ProjectMediaCarousel';
import ProjectOverview from './ProjectOverview';

interface ProjectSectionProps {
	project: ProjectShowcase;
}

const ProjectSection: React.FC<ProjectSectionProps> = ({ project }) => {
	const [isInView, setIsInView] = useState(false);
	const sectionRef = useRef<HTMLElement>(null);

	// Generate a stable unique ID for this component instance
	const uniqueId = useId();

	// Extract base color from project's primaryColor
	const rgbColor = project.primaryColor.startsWith('#')
		? hexToRgb(project.primaryColor)
		: project.primaryColor;

	// Observe when section comes into view for animations
	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) {
					setIsInView(true);
					observer.unobserve(entries[0].target);
				}
			},
			{
				rootMargin: '-100px 0px',
				threshold: 0.1,
			}
		);

		if (sectionRef.current) {
			observer.observe(sectionRef.current);
		}

		return () => {
			if (sectionRef.current) {
				observer.unobserve(sectionRef.current);
			}
		};
	}, []);

	return (
		<section
			ref={sectionRef}
			className={`project-section py-12 relative transition-all duration-1000 ${isInView ? 'opacity-100' : 'opacity-0 translate-y-8'}`}
			id={`project-${project.id}`}
			style={{
				'--primary-rgb': rgbColor
			} as React.CSSProperties}
		>
			{/* Background effects - simplified and more subtle */}
			<div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-background via-transparent to-transparent opacity-80 pointer-events-none z-10" />
			<div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background via-transparent to-transparent opacity-80 pointer-events-none z-10" />

			{/* Terminal container for the entire project */}
			<div className={`relative mx-auto max-w-6xl shadow-[0_0_60px_rgba(var(--primary-rgb),0.1)] transition-all duration-1000 rounded-xl overflow-hidden ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
				{/* Terminal window header bar */}
				<div className="bg-zinc-900 border-b border-primary/20 flex items-center justify-between px-4 py-2.5">
					<div className="flex items-center gap-4">
						{/* Left side with dots */}
						<div className="flex items-center space-x-1.5">
							<div className="h-3 w-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors"></div>
							<div className="h-3 w-3 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors"></div>
							<div className="h-3 w-3 rounded-full bg-green-500 hover:bg-green-600 transition-colors"></div>
						</div>

						{/* Terminal title */}
						<div className="text-xs text-primary/70 font-mono flex items-center">
							<Terminal size={11} className="mr-1.5" />
							<span>{project.id} — portfolio.terminal</span>
						</div>
					</div>

					{/* Status indicator */}
					{project.timeline && (
						<div className="text-xs font-mono bg-black/30 px-2 py-0.5 rounded-sm border border-primary/10 flex items-center">
							<span className={`inline-block h-1.5 w-1.5 rounded-full ${project.timeline.status === 'active' ? 'bg-green-500' :
								project.timeline.status === 'completed' ? 'bg-blue-500' :
									project.timeline.status === 'maintenance' ? 'bg-orange-500' :
										'bg-gray-500'
								} mr-1.5 animate-pulse`}></span>
							<FileBadge size={10} className="text-primary/60 mr-1" />
							<span className="uppercase text-[10px]">{project.timeline.status}</span>
						</div>
					)}
				</div>

				{/* Terminal content area */}
				<div className="bg-zinc-900/90 backdrop-blur-sm border-x border-b border-primary/20">
					{/* Simulated terminal header text */}
					<div className="px-4 pt-3 pb-2 font-mono text-[10px] text-primary/40 border-b border-primary/5">
						<p>Last login: {new Date().toLocaleDateString()} —— Project ID: {project.id}</p>
					</div>

					{/* Project content */}
					<div className="p-5 md:p-8 bg-background/90">
						<div className="relative">
							{/* Subtle background pattern */}
							<div className="absolute inset-0 pointer-events-none opacity-3">
								<div className="h-full w-full" style={{
									backgroundImage: `linear-gradient(rgba(var(--primary-rgb), 0.1) 1px, transparent 1px), 
													  linear-gradient(90deg, rgba(var(--primary-rgb), 0.1) 1px, transparent 1px)`,
									backgroundSize: '50px 50px'
								}}></div>
							</div>

							<div className="relative z-10">
								<ProjectHeader
									title={project.title}
									company={project.company}
									description={project.description}
									timeline={project.timeline}
									github={project.github}
									demoUrl={project.demoUrl}
									caseStudyUrl={project.caseStudyUrl}
									noTerminalHeader={true}
								/>

								<div className="grid grid-cols-1 md:grid-cols-12 gap-8 mt-8">
									<div className="md:col-span-7 transition-all duration-700 delay-200 transform"
										style={{
											transitionDelay: '100ms',
											opacity: isInView ? 1 : 0,
											transform: isInView ? 'translateX(0)' : 'translateX(-20px)'
										}}>
										<ProjectMediaCarousel media={project.media} primaryColor={project.primaryColor} />
									</div>

									<div className="md:col-span-5 transition-all duration-700 delay-300 transform"
										style={{
											transitionDelay: '200ms',
											opacity: isInView ? 1 : 0,
											transform: isInView ? 'translateX(0)' : 'translateX(20px)'
										}}>
										<ProjectOverview
											problem={project.problem}
											solution={project.solution}
											technologies={project.technologies}
											timeline={project.timeline}
											noTerminalHeader={true}
										/>
									</div>
								</div>

								<div className="transition-all duration-700 delay-500 transform"
									style={{
										transitionDelay: '400ms',
										opacity: isInView ? 1 : 0,
										transform: isInView ? 'translateY(0)' : 'translateY(20px)'
									}}>
									<ProjectDetailTabs project={project} />
								</div>
							</div>
						</div>
					</div>

					{/* Terminal command prompt footer */}
					<div className="px-4 py-3 bg-zinc-900 border-t border-primary/10">
						<div className="font-mono text-xs flex items-center text-primary/60">
							<span className="text-primary/80 mr-2">$</span>
							<span className="mr-1">exit</span>
							<span className="animate-pulse-slow">▌</span>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

// Helper function to convert hex to rgb
const hexToRgb = (hex: string): string => {
	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result
		? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
		: '0, 255, 65'; // Default to matrix green
};

export default ProjectSection; 