"use client";

import { Button } from '@/components/ui/button';
import { urlFor } from '@/sanity/lib/image';
import { Project } from '@/sanity/sanity.types';
import { Code, FileBadge, Terminal, Trophy } from 'lucide-react';
import React, { useEffect, useId, useRef, useState } from 'react';
import ProjectHeader from './ProjectHeader';
import ProjectMediaCarousel from './ProjectMediaCarousel';
import ProjectOverview from './ProjectOverview';

interface ProjectSectionProps {
	project: Project;
}

const ProjectSection: React.FC<ProjectSectionProps> = ({ project }) => {
	const [isInView, setIsInView] = useState(false);
	const sectionRef = useRef<HTMLElement>(null);
	const slug = project.slug?.current || '';

	// Generate a stable unique ID for this component instance
	const uniqueId = useId();

	// Extract base color from project's primaryColor
	const rgbColor = project.primaryColor?.startsWith('#')
		? hexToRgb(project.primaryColor)
		: project.primaryColor || '0, 255, 65';

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

		// Store ref value in a variable
		const currentRef = sectionRef.current;

		if (currentRef) {
			observer.observe(currentRef);
		}

		return () => {
			if (currentRef) {
				observer.unobserve(currentRef);
			}
		};
	}, []);

	// Function to get media items for carousel
	const getMediaItems = () => {
		// If no media items exist, return an empty array
		if (!project.media || project.media.length === 0) {
			return [];
		}

		return project.media.map(m => ({
			type: m.type || 'image',
			url: m.type === 'image' && m.image?.asset ? urlFor(m.image).url() :
				m.type === 'video' && m.videoSource === 'upload' && m.videoFile?.asset ?
					`https://cdn.sanity.io/files/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/${process.env.NEXT_PUBLIC_SANITY_DATASET}/${m.videoFile.asset._ref.replace('file-', '').replace('-mp4', '.mp4')}` :
					m.url || '',
			alt: m.alt || m.image?.alt || '',
			poster: m.type === 'video' && m.poster?.asset ? urlFor(m.poster).url() : undefined,
			featured: m.featured || false,
			caption: m.caption
		}));
	};

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
					{/* Project content */}
					<div className="p-4 md:p-6 bg-background/90">
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
									title={project.title || ''}
									company={project.company}
									description={project.description || ''}
									timeline={project.timeline ? {
										startDate: project.timeline.startDate || '',
										endDate: project.timeline.endDate,
										status: (project.timeline.status || 'active') as 'active' | 'completed' | 'maintenance' | 'archived'
									} : undefined}
									github={project.github}
									demoUrl={project.demoUrl}
									caseStudyUrl={project.caseStudyUrl}
									noTerminalHeader={true}
								/>

								<div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-6">
									<div className="md:col-span-7 transition-all duration-700 delay-200 transform"
										style={{
											transitionDelay: '100ms',
											opacity: isInView ? 1 : 0,
											transform: isInView ? 'translateX(0)' : 'translateX(-20px)'
										}}>
										<ProjectMediaCarousel
											media={getMediaItems()}
											primaryColor={project.primaryColor || '#00FF41'}
										/>
									</div>

									<div className="md:col-span-5 transition-all duration-700 delay-300 transform"
										style={{
											transitionDelay: '200ms',
											opacity: isInView ? 1 : 0,
											transform: isInView ? 'translateX(0)' : 'translateX(20px)'
										}}>
										<ProjectOverview
											problem={project.problem || ''}
											solution={project.solution || ''}
											technologies={project.technologies?.map(tech => ({
												name: tech.name || '',
												category: (tech.category as "frontend" | "backend" | "data" | "devops" | "ai") || 'frontend',
											})) || []}
											timeline={project.timeline ? {
												startDate: project.timeline.startDate || '',
												endDate: project.timeline.endDate,
												status: (project.timeline.status || 'active') as 'active' | 'completed' | 'maintenance' | 'archived'
											} : undefined}
											noTerminalHeader={true}
										/>
									</div>
								</div>

								{/* Key Metrics Section - Compact and visually enhanced version */}
								{((project.metrics && project.metrics.length > 0) || (project.achievements && project.achievements.length > 0)) && (
									<div className="mt-6 transition-all duration-700 delay-400 transform"
										style={{
											transitionDelay: '300ms',
											opacity: isInView ? 1 : 0,
											transform: isInView ? 'translateY(0)' : 'translateY(20px)'
										}}>
										<div className="bg-gradient-to-r from-black/30 via-black/20 to-black/30 backdrop-blur-sm rounded-lg border border-primary/20 p-3 shadow-[0_2px_10px_rgba(var(--primary-rgb),0.07)]">
											<h3 className="text-sm font-semibold mb-3 flex items-center">
												<Trophy size={14} className="text-primary mr-2" />
												<span className="bg-gradient-to-r from-foreground to-foreground/90 bg-clip-text text-transparent">Key Metrics</span>
											</h3>

											<div className="grid grid-cols-2 md:grid-cols-4 gap-2">
												{project.metrics && project.metrics.slice(0, 4).map((metric, index) => (
													<div
														key={index}
														className="bg-black/30 backdrop-blur-sm p-2 rounded-md border border-primary/10 flex items-center space-x-2 hover:border-primary/20 transition-colors duration-200"
													>
														<div className="flex flex-col">
															<div className="text-lg font-bold text-primary flex items-baseline">
																{metric.value}
																{metric.unit && <span className="text-sm ml-0.5 text-primary/80">{metric.unit}</span>}
															</div>
															<div className="text-[10px] text-muted-foreground leading-tight">{metric.label}</div>
														</div>
													</div>
												))}

												{(!project.metrics || project.metrics.length === 0) && project.achievements && project.achievements.slice(0, 1).map((achievement, index) => (
													<div key={index} className="col-span-2 bg-black/30 backdrop-blur-sm p-2 rounded-md border border-primary/10 hover:border-primary/20 transition-colors duration-200">
														<div className="flex items-start">
															<div className="mr-2 mt-0.5 flex-shrink-0">
																<div className="h-4 w-4 rounded-full bg-primary/20 flex items-center justify-center">
																	<Trophy size={10} className="text-primary" />
																</div>
															</div>
															<p className="text-xs text-muted-foreground">{achievement}</p>
														</div>
													</div>
												))}
											</div>
										</div>
									</div>
								)}

								{/* View Project Button */}
								<div className="flex justify-end mt-4 space-x-2">
									{project.caseStudyUrl ? (
										<Button
											variant="default"
											asChild
											size="sm"
											className="bg-primary hover:bg-primary/90 shadow-[0_2px_10px_rgba(var(--primary-rgb),0.2)] transition-all duration-200 hover:translate-y-[-1px]"
										>
											<a href={project.caseStudyUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5">
												<Code size={14} />
												<span>Full Case Study</span>
											</a>
										</Button>
									) : (
										<Button
											variant="default"
											asChild
											size="sm"
											className="bg-primary hover:bg-primary/90 shadow-[0_2px_10px_rgba(var(--primary-rgb),0.2)] transition-all duration-200 hover:translate-y-[-1px]"
										>
											<a href={`/projects/${slug}`} className="flex items-center gap-1.5">
												<Code size={14} />
												<span>View Project</span>
											</a>
										</Button>
									)}
								</div>
							</div>
						</div>
					</div>

					{/* Terminal command prompt footer */}
					<div className="px-4 py-2 bg-zinc-900 border-t border-primary/10">
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