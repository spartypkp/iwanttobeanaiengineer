"use client";

import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProjectShowcase } from '@/lib/types';
import { Award, BrainCircuit, Lightbulb, ListChecks, MessageSquare, Puzzle } from 'lucide-react';
import React, { useState } from 'react';

interface ProjectDetailTabsProps {
	project: ProjectShowcase;
}

const ProjectDetailTabs: React.FC<ProjectDetailTabsProps> = ({ project }) => {
	const [isExpanded, setIsExpanded] = useState(false);

	const toggleExpand = () => {
		setIsExpanded(!isExpanded);
	};

	return (
		<div className="mt-8">
			<details className="group" open={isExpanded}>
				<summary
					onClick={(e) => {
						e.preventDefault();
						toggleExpand();
					}}
					className="flex items-center justify-center gap-2 cursor-pointer w-full py-3 px-4 bg-background/70 backdrop-blur-sm border border-primary/10 rounded-lg hover:bg-background/90 transition-all duration-300 list-none"
				>
					<span className="text-lg font-semibold text-center">
						{isExpanded ? 'Hide Detailed Information' : 'View Detailed Information'}
					</span>
					<svg
						className={`h-6 w-6 text-primary transition-transform duration-300 ${isExpanded ? 'rotate-180' : 'rotate-0'}`}
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<polyline points="6 9 12 15 18 9"></polyline>
					</svg>
				</summary>

				<div className="pt-6 pb-2 px-1 animate-fadeIn">
					<Tabs defaultValue="approach" className="w-full">
						<TabsList className="w-full justify-start mb-6 bg-background/50 p-1 overflow-x-auto flex-nowrap">
							<TabsTrigger value="approach" className="flex items-center gap-1">
								<Puzzle className="h-4 w-4" />
								<span>Approach</span>
							</TabsTrigger>
							<TabsTrigger value="challenges" className="flex items-center gap-1">
								<BrainCircuit className="h-4 w-4" />
								<span>Challenges</span>
							</TabsTrigger>
							<TabsTrigger value="insights" className="flex items-center gap-1">
								<Lightbulb className="h-4 w-4" />
								<span>Technical Insights</span>
							</TabsTrigger>
							<TabsTrigger value="learnings" className="flex items-center gap-1">
								<MessageSquare className="h-4 w-4" />
								<span>Learnings</span>
							</TabsTrigger>
							<TabsTrigger value="achievements" className="flex items-center gap-1">
								<Award className="h-4 w-4" />
								<span>Achievements</span>
							</TabsTrigger>
							<TabsTrigger value="metrics" className="flex items-center gap-1">
								<ListChecks className="h-4 w-4" />
								<span>Metrics</span>
							</TabsTrigger>
						</TabsList>

						{/* Approach Tab */}
						<TabsContent value="approach" className="bg-background/50 p-6 rounded-lg border border-primary/10">
							<h3 className="text-xl font-semibold mb-4">Our Approach</h3>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								{project.approach.map((item, index) => (
									<div key={index} className="bg-background/70 p-4 rounded-lg border border-primary/10">
										<h4 className="text-lg font-medium mb-2 text-primary">{item.title}</h4>
										<p className="text-muted-foreground">{item.description}</p>
									</div>
								))}
							</div>
						</TabsContent>

						{/* Challenges Tab */}
						<TabsContent value="challenges" className="bg-background/50 p-6 rounded-lg border border-primary/10">
							<h3 className="text-xl font-semibold mb-4">Key Challenges</h3>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								{project.challenges.map((item, index) => (
									<div key={index} className="bg-background/70 p-4 rounded-lg border border-primary/10">
										<h4 className="text-lg font-medium mb-2 text-primary">{item.title}</h4>
										<p className="text-muted-foreground">{item.description}</p>
									</div>
								))}
							</div>
						</TabsContent>

						{/* Technical Insights Tab */}
						<TabsContent value="insights" className="bg-background/50 p-6 rounded-lg border border-primary/10">
							<h3 className="text-xl font-semibold mb-4">Technical Insights</h3>
							<div className="grid grid-cols-1 gap-6">
								{project.technicalInsights.map((item, index) => (
									<div key={index} className="bg-background/70 p-4 rounded-lg border border-primary/10">
										<h4 className="text-lg font-medium mb-2 text-primary">{item.title}</h4>
										<p className="text-muted-foreground mb-4">{item.description}</p>
										{item.code && (
											<pre className="bg-black/80 p-4 rounded-md overflow-x-auto font-mono text-sm text-primary">
												<code>{item.code}</code>
											</pre>
										)}
									</div>
								))}
							</div>
						</TabsContent>

						{/* Learnings Tab */}
						<TabsContent value="learnings" className="bg-background/50 p-6 rounded-lg border border-primary/10">
							<h3 className="text-xl font-semibold mb-4">Key Learnings</h3>
							<ul className="space-y-3">
								{project.learnings.map((learning, index) => (
									<li key={index} className="flex items-start">
										<span className="text-primary mr-2 font-bold">→</span>
										<span className="text-muted-foreground">{learning}</span>
									</li>
								))}
							</ul>
						</TabsContent>

						{/* Achievements Tab */}
						<TabsContent value="achievements" className="bg-background/50 p-6 rounded-lg border border-primary/10">
							<h3 className="text-xl font-semibold mb-4">Achievements</h3>
							<ul className="space-y-3">
								{project.achievements.map((achievement, index) => (
									<li key={index} className="flex items-start">
										<Badge variant="outline" className="bg-primary/10 text-primary flex-shrink-0 mr-3">
											{index + 1}
										</Badge>
										<span className="text-muted-foreground">{achievement}</span>
									</li>
								))}
							</ul>
						</TabsContent>

						{/* Metrics Tab */}
						<TabsContent value="metrics" className="bg-background/50 p-6 rounded-lg border border-primary/10">
							<h3 className="text-xl font-semibold mb-4">Key Metrics</h3>
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
								{project.metrics.map((metric, index) => (
									<div key={index} className="bg-background/70 p-4 rounded-lg border border-primary/10 flex flex-col items-center justify-center text-center">
										{metric.icon && <div className="mb-2 text-primary">{metric.icon}</div>}
										<div className="text-3xl font-bold text-primary flex items-baseline">
											{metric.value}
											{metric.unit && <span className="text-lg ml-1 text-primary/80">{metric.unit}</span>}
										</div>
										<div className="text-sm text-muted-foreground mt-1">{metric.label}</div>
									</div>
								))}
							</div>
						</TabsContent>
					</Tabs>
				</div>
			</details>
		</div>
	);
};

export default ProjectDetailTabs; 