"use client";

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calendar, Code, ExternalLink, Github, Terminal } from 'lucide-react';
import React from 'react';

interface ProjectHeaderProps {
	title: string;
	company?: string;
	description: string;
	timeline?: {
		startDate: string;
		endDate?: string;
		status: "active" | "completed" | "maintenance" | "archived";
	};
	github?: string;
	demoUrl?: string;
	caseStudyUrl?: string;
	noTerminalHeader?: boolean;
}

const ProjectHeader: React.FC<ProjectHeaderProps> = ({
	title,
	company,
	description,
	timeline,
	github,
	demoUrl,
	caseStudyUrl,
	noTerminalHeader = false
}) => {
	// Get status color based on project status
	const getStatusColor = (status: string) => {
		switch (status) {
			case 'active':
				return 'bg-green-500/20 text-green-500 border-green-500/30';
			case 'completed':
				return 'bg-blue-500/20 text-blue-500 border-blue-500/30';
			case 'maintenance':
				return 'bg-orange-500/20 text-orange-500 border-orange-500/30';
			case 'archived':
				return 'bg-gray-500/20 text-gray-500 border-gray-500/30';
			default:
				return 'bg-primary/10 text-primary border-primary/30';
		}
	};

	return (
		<div className={noTerminalHeader ? "" : "rounded-xl overflow-hidden"}>
			{/* Terminal-inspired header bar - only show if noTerminalHeader is false */}
			{!noTerminalHeader && (
				<div className="bg-black/70 px-4 py-2 flex items-center gap-2 border-b border-primary/20">
					<div className="flex items-center space-x-1.5">
						<div className="h-3 w-3 rounded-full bg-red-500"></div>
						<div className="h-3 w-3 rounded-full bg-yellow-500"></div>
						<div className="h-3 w-3 rounded-full bg-green-500"></div>
					</div>
					<div className="ml-2 text-xs text-primary/70 font-mono flex items-center">
						<Terminal size={10} className="mr-1.5" />
						project@portfolio:~/{title.toLowerCase().replace(/\s+/g, '-')}
					</div>
				</div>
			)}

			{/* Main content */}
			<div className={`bg-background/95 backdrop-blur-md ${!noTerminalHeader ? "border-x border-b" : ""} border-primary/20 p-6 relative overflow-hidden ${noTerminalHeader ? "rounded-xl" : ""}`}>
				{/* Background pattern */}
				<div className="absolute inset-0 pointer-events-none opacity-5">
					<div className="h-full w-full" style={{
						backgroundImage: `linear-gradient(rgba(var(--primary-rgb), 0.3) 1px, transparent 1px), 
										  linear-gradient(90deg, rgba(var(--primary-rgb), 0.3) 1px, transparent 1px)`,
						backgroundSize: '50px 50px'
					}}></div>
				</div>

				<div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-6">
					<div className="space-y-3 max-w-3xl">
						<div className="flex items-center gap-3 flex-wrap">
							{/* Code tag styling for title */}
							<h2 className="text-2xl md:text-3xl font-bold tracking-tight inline-flex items-center group">
								<span className="text-primary/70 font-mono mr-2 text-xl">&lt;</span>
								{title}
								<span className="text-primary/70 font-mono ml-2 text-xl">/&gt;</span>

								{/* Terminal blinking cursor */}
								<span className="h-5 w-2 bg-primary/70 ml-2 opacity-70 animate-pulse-slow"></span>
							</h2>

							{/* Status badge */}
							{timeline && !noTerminalHeader && (
								<Badge
									variant="outline"
									className={`${getStatusColor(timeline.status)} text-xs px-2 py-0 border ml-2`}
								>
									{timeline.status.charAt(0).toUpperCase() + timeline.status.slice(1)}
								</Badge>
							)}
						</div>

						{/* Company name with code comment styling */}
						{company && (
							<div className="text-lg text-muted-foreground flex items-center">
								<span className="text-primary/60 font-mono mr-2 text-sm">// by</span>
								{company}
							</div>
						)}

						{/* Description with terminal prompt styling */}
						<p className="text-lg">
							<span className="text-primary/70 mr-2 font-mono text-sm inline-block">$</span>
							{description}
						</p>

						{/* Timeline with better styling */}
						{timeline && (
							<div className="flex items-center gap-2 text-sm text-muted-foreground mt-2 bg-black/20 rounded-md px-3 py-1.5 inline-flex">
								<Calendar size={14} className="text-primary/70" />
								<span className="font-mono">{timeline.startDate}</span>
								<ArrowRight size={10} />
								<span className="font-mono">{timeline.endDate || 'Present'}</span>
							</div>
						)}
					</div>

					{/* Project links with improved styling */}
					<div className="flex flex-wrap gap-2 mt-4 md:mt-0 md:flex-col md:items-end">
						{github && (
							<Button variant="outline" size="sm" asChild className="h-9 border-primary/20 hover:bg-primary/10 hover:text-primary bg-black/30">
								<a href={github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
									<Github size={16} />
									<span>GitHub</span>
								</a>
							</Button>
						)}

						{demoUrl && (
							<Button variant="outline" size="sm" asChild className="h-9 border-primary/20 hover:bg-primary/10 hover:text-primary bg-black/30">
								<a href={demoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
									<ExternalLink size={16} />
									<span>Live Demo</span>
								</a>
							</Button>
						)}

						{caseStudyUrl && (
							<Button variant="default" size="sm" asChild className="h-9 bg-primary hover:bg-primary/90">
								<a href={caseStudyUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
									<Code size={16} />
									<span>Case Study</span>
								</a>
							</Button>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProjectHeader; 