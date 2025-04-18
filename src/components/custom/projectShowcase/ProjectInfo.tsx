"use client";

import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProjectShowcase } from '@/lib/types';
import { motion } from 'framer-motion';
import { ArrowRight, Award, BrainCircuit, Code, Database, Hammer, History, Lightbulb, ListChecks, MessageSquare, Puzzle, Wand2 } from 'lucide-react';
import React, { useState } from 'react';

interface ProjectInfoProps {
	project: ProjectShowcase;
	isActive: boolean;
}

const ProjectInfo: React.FC<ProjectInfoProps> = ({
	project,
	isActive,
}) => {
	const [activeTab, setActiveTab] = useState('overview');

	// Animation variants for staggered content reveal
	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				when: "beforeChildren",
				staggerChildren: 0.1
			}
		}
	};

	const itemVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				type: "spring",
				stiffness: 400,
				damping: 40
			}
		}
	};

	// Group technologies by category
	const techByCategory = project.technologies.reduce((acc, tech) => {
		if (!acc[tech.category]) {
			acc[tech.category] = [];
		}
		acc[tech.category].push(tech);
		return acc;
	}, {} as Record<string, typeof project.technologies>);

	return (
		<motion.div
			className="flex flex-col h-full min-h-0 relative bg-background/95 backdrop-blur-sm"
			variants={containerVariants}
			initial="hidden"
			animate={isActive ? "visible" : "hidden"}
		>
			{/* Header */}
			<div className="sticky top-0 z-10 flex flex-col bg-background/90 backdrop-blur-md border-b border-primary/20 px-5 py-4 flex-shrink-0">
				<div className="flex flex-col space-y-1">

					<motion.div
						className="text-sm text-muted-foreground"
						variants={itemVariants}
					>
						{project.description}
					</motion.div>
				</div>

				{/* Tabs navigation */}
				<Tabs value={activeTab} onValueChange={setActiveTab} className="mt-5">
					<TabsList className="flex w-full bg-muted/50 border border-primary/10 rounded-md p-0.5">
						<TabsTrigger
							value="overview"
							className="flex-1 data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-sm transition-colors"
						>
							Overview
						</TabsTrigger>
						<TabsTrigger
							value="technical"
							className="flex-1 data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-sm transition-colors"
						>
							Technical
						</TabsTrigger>
						<TabsTrigger
							value="results"
							className="flex-1 data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-sm transition-colors"
						>
							Impact
						</TabsTrigger>
					</TabsList>
				</Tabs>
			</div>

			{/* Content area */}
			<div className="flex-1 overflow-y-auto min-h-0 px-5 py-4">
				<Tabs value={activeTab} className="mt-0">
					{/* Overview Tab */}
					<TabsContent value="overview" className="space-y-6 mt-0 px-0.5">


						<motion.div variants={itemVariants} className="flex flex-col p-4 rounded-lg bg-primary/5 border border-primary/10">
							<h3 className="text-sm font-semibold mb-2 text-primary flex items-center gap-1.5">
								<span className="w-1 h-5 bg-primary/50 rounded-full"></span>
								The Challenge
							</h3>
							<p className="text-muted-foreground mb-0 leading-relaxed">{project.problem}</p>
						</motion.div>

						<motion.div variants={itemVariants} className="flex flex-col p-4 rounded-lg bg-primary/5 border border-primary/10">
							<h3 className="text-sm font-semibold mb-2 text-primary flex items-center gap-1.5">
								<span className="w-1 h-5 bg-primary/50 rounded-full"></span>
								The Solution
							</h3>
							<p className="text-muted-foreground mb-0 leading-relaxed">{project.solution}</p>
						</motion.div>

						{project.timeline && (
							<motion.div variants={itemVariants} className="flex flex-col">
								<div className="flex items-center gap-2 mb-2">
									<History size={16} className="text-primary/80" />
									<h3 className="text-sm font-semibold text-primary">Timeline</h3>
								</div>
								<div className="flex items-center gap-3 text-sm text-muted-foreground">
									<span>{project.timeline.startDate}</span>
									<ArrowRight size={12} />
									<span>{project.timeline.endDate || 'Present'}</span>
									<Badge className="ml-2 bg-primary/10 text-primary border-none">
										{project.timeline.status.charAt(0).toUpperCase() + project.timeline.status.slice(1)}
									</Badge>
								</div>
							</motion.div>
						)}
					</TabsContent>

					{/* Technical Tab */}
					<TabsContent value="technical" className="space-y-6 mt-0 px-0.5">
						{/* Technologies Section */}
						<motion.div variants={itemVariants}>
							<div className="flex items-center gap-2 mb-3">
								<Code size={16} className="text-primary/80" />
								<h3 className="text-sm font-semibold text-primary">Tech Stack</h3>
							</div>

							<div className="flex flex-wrap gap-2 mb-6">
								{project.technologies.map((tech, i) => (
									<Badge
										key={i}
										variant="secondary"
										className="bg-primary/10 hover:bg-primary/20 text-primary border-primary/10 py-1 px-2.5"
									>
										{tech.icon && <span className="mr-1.5 inline-flex">{tech.icon}</span>}
										{tech.name}
									</Badge>
								))}
							</div>
						</motion.div>

						{/* Challenges Section */}
						{project.challenges && project.challenges.length > 0 && (
							<motion.div variants={itemVariants} className="mb-6">
								<div className="flex items-center gap-2 mb-3">
									<Puzzle size={16} className="text-primary/80" />
									<h3 className="text-sm font-semibold text-primary">Technical Challenges</h3>
								</div>

								<div className="space-y-3">
									{project.challenges.map((challenge, index) => (
										<div key={index} className="p-3 rounded-md bg-primary/5 border border-primary/10">
											<h4 className="text-sm font-medium mb-1">{challenge.title}</h4>
											<p className="text-sm text-muted-foreground">{challenge.description}</p>
										</div>
									))}
								</div>
							</motion.div>
						)}

						{/* Approach Section */}
						{project.approach && project.approach.length > 0 && (
							<motion.div variants={itemVariants} className="mb-6">
								<div className="flex items-center gap-2 mb-3">
									<BrainCircuit size={16} className="text-primary/80" />
									<h3 className="text-sm font-semibold text-primary">My Approach</h3>
								</div>

								<div className="space-y-3">
									{project.approach.map((item, index) => (
										<div key={index} className="p-3 rounded-md bg-primary/5 border border-primary/10">
											<h4 className="text-sm font-medium mb-1">{item.title}</h4>
											<p className="text-sm text-muted-foreground">{item.description}</p>
										</div>
									))}
								</div>
							</motion.div>
						)}

						{/* Technical Insights - Modified to hide code blocks */}
						{project.technicalInsights && project.technicalInsights.length > 0 && (
							<motion.div variants={itemVariants} className="mb-6">
								<div className="flex items-center gap-2 mb-3">
									<Lightbulb size={16} className="text-primary/80" />
									<h3 className="text-sm font-semibold text-primary">Technical Insights</h3>
								</div>

								<div className="space-y-4">
									{project.technicalInsights.map((insight, index) => (
										<div key={index} className="p-3 rounded-md bg-primary/5 border border-primary/10">
											<h4 className="text-sm font-medium mb-1">{insight.title}</h4>
											<p className="text-sm text-muted-foreground">{insight.description}</p>
										</div>
									))}
								</div>
							</motion.div>
						)}

						{/* Personal Contribution */}
						{project.personalContribution && (
							<motion.div variants={itemVariants} className="mb-6">
								<div className="flex items-center gap-2 mb-3">
									<Hammer size={16} className="text-primary/80" />
									<h3 className="text-sm font-semibold text-primary">My Contribution</h3>
								</div>

								<div className="p-3 rounded-md bg-primary/5 border border-primary/10">
									<p className="text-sm text-muted-foreground">{project.personalContribution}</p>
								</div>
							</motion.div>
						)}

						{/* Key Learnings */}
						{project.learnings && project.learnings.length > 0 && (
							<motion.div variants={itemVariants}>
								<div className="flex items-center gap-2 mb-3">
									<Wand2 size={16} className="text-primary/80" />
									<h3 className="text-sm font-semibold text-primary">Key Learnings</h3>
								</div>

								<ul className="space-y-2 pl-0">
									{project.learnings.map((learning, index) => (
										<li key={index} className="flex items-start p-2 rounded-md bg-primary/5 border border-primary/10">
											<span className="text-primary mr-2 mt-0.5 font-bold">•</span>
											<span className="text-sm">{learning}</span>
										</li>
									))}
								</ul>
							</motion.div>
						)}
					</TabsContent>

					{/* Results Tab */}
					<TabsContent value="results" className="space-y-6 mt-0 px-0.5">
						{/* Achievements Section */}
						{project.achievements && project.achievements.length > 0 && (
							<motion.div variants={itemVariants} className="mb-6">
								<div className="flex items-center gap-2 mb-3">
									<Award size={16} className="text-primary/80" />
									<h3 className="text-sm font-semibold text-primary">Key Achievements</h3>
								</div>

								<ul className="space-y-2 pl-0">
									{project.achievements.map((achievement, index) => (
										<li key={index} className="flex items-start p-3 rounded-md bg-primary/5 border border-primary/10">
											<span className="text-primary mr-2 mt-0.5 font-bold">•</span>
											<span className="text-sm">{achievement}</span>
										</li>
									))}
								</ul>
							</motion.div>
						)}

						{/* Key Outcomes */}
						<motion.div variants={itemVariants}>
							<div className="flex items-center gap-2 mb-3">
								<ListChecks size={16} className="text-primary/80" />
								<h3 className="text-sm font-semibold text-primary">Business Impact</h3>
							</div>
							<ul className="space-y-3 pl-0">
								{project.results.map((result, i) => (
									<li key={i} className="flex items-start bg-primary/5 p-3 rounded-md border border-primary/10">
										<span className="text-primary mr-2 mt-0.5 font-bold">•</span>
										<span className="leading-relaxed flex-1 text-sm">{result}</span>
									</li>
								))}
							</ul>
						</motion.div>

						{/* Testimonials - Placeholder for future implementation */}
						{false && (
							<motion.div variants={itemVariants} className="mb-6">
								<div className="flex items-center gap-2 mb-3">
									<MessageSquare size={16} className="text-primary/80" />
									<h3 className="text-sm font-semibold text-primary">Testimonials</h3>
								</div>

								<div className="p-4 rounded-md bg-primary/5 border border-primary/10 italic text-sm">
									"Coming soon..."
								</div>
							</motion.div>
						)}

						{/* Impact Metrics */}
						<motion.div variants={itemVariants}>
							<div className="flex items-center gap-2 mb-3">
								<Database size={16} className="text-primary/80" />
								<h3 className="text-sm font-semibold text-primary">Impact Metrics</h3>
							</div>
							<div className="grid grid-cols-2 gap-3">
								{project.metrics.map((metric, i) => (
									<div
										key={i}
										className="flex flex-col bg-primary/5 border border-primary/10 rounded-md p-3 hover:bg-primary/10 transition-colors"
									>
										<div className="text-xs text-muted-foreground mb-1.5 flex items-center">
											{metric.icon && <span className="mr-2 inline-flex">{metric.icon}</span>}
											{metric.label}
										</div>
										<div className="text-xl font-bold text-primary flex items-baseline">
											{metric.value.toLocaleString()}{metric.unit && <span className="text-sm ml-1 text-primary/70">{metric.unit}</span>}
										</div>
									</div>
								))}
							</div>
						</motion.div>
					</TabsContent>
				</Tabs>
			</div>
		</motion.div>
	);
};

export default ProjectInfo; 