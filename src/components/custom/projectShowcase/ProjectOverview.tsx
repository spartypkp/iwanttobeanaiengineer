"use client";

import { Badge } from '@/components/ui/badge';
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
				return <Code className="h-3 w-3 mr-1.5 text-primary/80" />;
			case 'backend':
				return <Server className="h-3 w-3 mr-1.5 text-primary/80" />;
			case 'data':
				return <Database className="h-3 w-3 mr-1.5 text-primary/80" />;
			case 'devops':
				return <Zap className="h-3 w-3 mr-1.5 text-primary/80" />;
			case 'ai':
				return <BrainCircuit className="h-3 w-3 mr-1.5 text-primary/80" />;
			default:
				return <Code className="h-3 w-3 mr-1.5 text-primary/80" />;
		}
	};

	return (
		<div className="backdrop-blur-sm h-full border border-primary/20 shadow-[0_0_15px_rgba(var(--primary-rgb),0.05)] rounded-xl overflow-hidden">
			{/* Terminal-inspired header */}
			{!noTerminalHeader && (
				<div className="bg-black/70 px-4 py-2 border-b border-primary/20">
					<div className="text-xs text-primary/70 font-mono flex items-center">
						<span className="mr-1.5">❯</span>
						project-details.md
					</div>
				</div>
			)}

			<div className="space-y-6 p-6 bg-background/80">
				{/* Challenge Section */}
				<div>
					<h4 className="text-lg font-semibold mb-3 flex items-center">
						<div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary mr-2 text-sm">⧗</div>
						The Challenge
					</h4>
					<div className="relative">
						<div className="absolute top-0 bottom-0 left-0 w-1 bg-primary/10 rounded-full"></div>
						<p className="pl-4 text-muted-foreground">{problem}</p>
					</div>
				</div>

				{/* Solution Section */}
				<div>
					<h4 className="text-lg font-semibold mb-3 flex items-center">
						<div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary mr-2 text-sm">✓</div>
						The Solution
					</h4>
					<div className="relative">
						<div className="absolute top-0 bottom-0 left-0 w-1 bg-primary/10 rounded-full"></div>
						<p className="pl-4 text-muted-foreground">{solution}</p>
					</div>
				</div>

				{/* Technology Stack Section */}
				<div>
					<h4 className="text-lg font-semibold mb-3 flex items-center">
						<div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary mr-2 text-sm">
							<Code className="h-3.5 w-3.5" />
						</div>
						Technology Stack
					</h4>

					<div className="space-y-4 relative">
						<div className="absolute top-0 bottom-0 left-0 w-1 bg-primary/10 rounded-full"></div>

						<div className="pl-4">
							{/* Terminal-inspired tech categories */}
							{Object.entries(techByCategory).map(([category, techs]) => (
								<div key={category} className="mb-4">
									<h5 className="text-sm uppercase tracking-wider mb-2 flex items-center font-mono text-primary/70">
										{getCategoryIcon(category)}
										<span className="bg-black/20 px-2 py-0.5 rounded">{category}</span>
									</h5>
									<div className="flex flex-wrap gap-2">
										{techs.map((tech, index) => (
											<Badge
												key={index}
												variant="outline"
												className="bg-black/30 hover:bg-primary/10 text-sm border-primary/20 shadow-sm"
											>
												{tech.icon && <span className="mr-1">{tech.icon}</span>}
												{tech.name}
											</Badge>
										))}
									</div>
								</div>
							))}
						</div>

						{/* Matrix-inspired code decoration - now using client-side state */}
						<div className="absolute bottom-0 right-0 opacity-10 font-mono text-[8px] text-primary pointers-events-none overflow-hidden w-1/2 h-1/2">
							{matrixPattern.map((row, i) => (
								<div key={i} className="whitespace-nowrap">
									{row.map((bit, j) => (
										<span key={j}>{bit}</span>
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