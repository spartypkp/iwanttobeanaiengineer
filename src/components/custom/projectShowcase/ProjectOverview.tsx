"use client";

import { ProjectShowcase } from '@/lib/types';
import { BrainCircuit, Code, Database, Server, Zap } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface ProjectOverviewProps {
	problem: string;
	solution: string;
	technologies: ProjectShowcase['technologies'];
	timeline?: ProjectShowcase['timeline'];
	noTerminalHeader?: boolean;
}

const ProjectOverview: React.FC<ProjectOverviewProps> = ({
	problem,
	solution,
	technologies,
	timeline,
	noTerminalHeader = false
}) => {
	// State for matrix pattern - initialized with empty arrays
	const [matrixPattern, setMatrixPattern] = useState<Array<Array<string>>>([]);

	// Generate matrix pattern on the client-side only
	useEffect(() => {
		const rows = 10;
		const cols = 15;
		const pattern = Array.from({ length: rows }, () =>
			Array.from({ length: cols }, () =>
				Math.random() > 0.5 ? '1' : '0'
			)
		);
		setMatrixPattern(pattern);
	}, []);

	// Group technologies by category
	const techByCategory = technologies.reduce((acc, tech) => {
		if (!acc[tech.category]) {
			acc[tech.category] = [];
		}
		acc[tech.category].push(tech);
		return acc;
	}, {} as Record<string, typeof technologies>);

	// Get icon for category
	const getCategoryIcon = (category: string) => {
		switch (category) {
			case 'frontend':
				return <Code className="h-3 w-3 mr-1 text-primary/80" />;
			case 'backend':
				return <Server className="h-3 w-3 mr-1 text-primary/80" />;
			case 'data':
				return <Database className="h-3 w-3 mr-1 text-primary/80" />;
			case 'devops':
				return <Zap className="h-3 w-3 mr-1 text-primary/80" />;
			case 'ai':
				return <BrainCircuit className="h-3 w-3 mr-1 text-primary/80" />;
			default:
				return <Code className="h-3 w-3 mr-1 text-primary/80" />;
		}
	};

	return (
		<div className="backdrop-blur-sm h-full border border-primary/20 shadow-[0_0_15px_rgba(var(--primary-rgb),0.05)] rounded-xl overflow-hidden bg-gradient-to-b from-black/0 to-black/10">
			{/* Terminal-inspired header */}
			{!noTerminalHeader && (
				<div className="bg-black/70 px-4 py-2 border-b border-primary/20">
					<div className="text-xs text-primary/70 font-mono flex items-center">
						<span className="mr-1.5">❯</span>
						project-details.md
					</div>
				</div>
			)}

			<div className="space-y-4 p-4 bg-background/80">
				{/* Challenge Section with improved styling */}
				<div>
					<h4 className="text-base font-semibold mb-2 flex items-center">
						<div className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary mr-2 text-xs shadow-sm shadow-primary/20">⧗</div>
						<span className="bg-gradient-to-r from-foreground to-foreground/90 bg-clip-text text-transparent">The Challenge</span>
					</h4>
					<div className="relative">
						<div className="absolute top-0 bottom-0 left-0 w-1 bg-gradient-to-b from-primary/5 via-primary/20 to-primary/5 rounded-full"></div>
						<p className="pl-3 text-sm text-muted-foreground leading-relaxed">{problem}</p>
					</div>
				</div>

				{/* Solution Section with improved styling */}
				<div>
					<h4 className="text-base font-semibold mb-2 flex items-center">
						<div className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary mr-2 text-xs shadow-sm shadow-primary/20">✓</div>
						<span className="bg-gradient-to-r from-foreground to-foreground/90 bg-clip-text text-transparent">The Solution</span>
					</h4>
					<div className="relative">
						<div className="absolute top-0 bottom-0 left-0 w-1 bg-gradient-to-b from-primary/5 via-primary/20 to-primary/5 rounded-full"></div>
						<p className="pl-3 text-sm text-muted-foreground leading-relaxed">{solution}</p>
					</div>
				</div>

				{/* Technology Stack Section - Enhanced MINIMALIST VERSION */}
				<div>
					<h4 className="text-base font-semibold mb-2 flex items-center">
						<div className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary mr-2 text-xs shadow-sm shadow-primary/20">
							<Code className="h-3 w-3" />
						</div>
						<span className="bg-gradient-to-r from-foreground to-foreground/90 bg-clip-text text-transparent">Tech Stack</span>
					</h4>

					<div className="relative pl-3">
						<div className="absolute top-0 bottom-0 left-0 w-1 bg-gradient-to-b from-primary/5 via-primary/20 to-primary/5 rounded-full"></div>

						{/* Ultra minimalist tech display with enhanced styling */}
						<div className="flex flex-wrap gap-1.5 mb-1 backdrop-blur-sm bg-black/10 p-2 rounded-lg">
							{technologies.slice(0, 8).map((tech, index) => (
								<div
									key={index}
									className="inline-flex items-center px-1.5 py-0.5 rounded-md text-xs bg-black/30 text-primary/90 border border-primary/20 shadow-sm cursor-help hover:bg-black/40 hover:border-primary/30 transition-colors duration-150"
									title={`${tech.name} (${tech.category})`}
								>
									{tech.icon && <span className="mr-1">{tech.icon}</span>}
									<span className="text-xs">{tech.name}</span>
								</div>
							))}
							{technologies.length > 8 && (
								<div className="inline-flex items-center px-1.5 py-0.5 rounded-md text-xs bg-black/20 text-primary/70 border border-primary/10 hover:bg-black/40 hover:border-primary/30 transition-colors duration-150"
									title={technologies.slice(8).map(t => t.name).join(', ')}
								>
									+{technologies.length - 8}
								</div>
							)}
						</div>

						{/* Matrix-inspired code decoration with improved layout */}
						<div className="absolute bottom-1 right-1 opacity-10 font-mono text-[8px] text-primary pointers-events-none overflow-hidden w-1/3 h-1/3">
							{matrixPattern.map((row, i) => (
								<div key={i} className="whitespace-nowrap">
									{row.map((bit, j) => (
										<span key={j} className={bit === '1' ? 'text-primary/90' : 'text-primary/30'}>{bit}</span>
									))}
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProjectOverview; 