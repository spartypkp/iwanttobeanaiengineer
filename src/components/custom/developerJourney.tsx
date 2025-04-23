"use client";

import { Badge } from "@/components/ui/badge";
import { ArrowRight, Calendar, Code, FileText, GitBranch, Laptop, Terminal } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

interface JourneyMilestone {
	year: string;
	title: string;
	command: string;
	output: string;
	icon: React.ReactNode;
	category: "education" | "work" | "project" | "discovery";
}

export const DeveloperJourney: React.FC = () => {
	const [typedTerminalText, setTypedTerminalText] = useState("");
	const [activeMilestone, setActiveMilestone] = useState<number | null>(null);
	const milestoneRefs = useRef<(HTMLDivElement | null)[]>([]);

	const terminalText = "history | grep career_milestones";

	// Terminal typing effect
	useEffect(() => {
		let currentText = "";
		let currentIndex = 0;

		const typingInterval = setInterval(() => {
			if (currentIndex < terminalText.length) {
				currentText += terminalText[currentIndex];
				setTypedTerminalText(currentText);
				currentIndex++;
			} else {
				clearInterval(typingInterval);
			}
		}, 50);

		return () => clearInterval(typingInterval);
	}, []);

	// Intersection observer to highlight milestones in view
	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					const index = milestoneRefs.current.findIndex(ref => ref === entry.target);
					if (entry.isIntersecting && index !== -1) {
						setActiveMilestone(index);
					}
				});
			},
			{ threshold: 0.5 }
		);

		milestoneRefs.current.forEach((ref) => {
			if (ref) observer.observe(ref);
		});

		return () => {
			milestoneRefs.current.forEach((ref) => {
				if (ref) observer.unobserve(ref);
			});
		};
	}, []);

	const milestones: JourneyMilestone[] = [
		{
			year: "2013",
			title: "First Steps in Programming",
			command: "cat ~/journey/beginning/first_code.py",
			output: "Discovered programming through Python. The simplicity and readability hooked me immediately — I knew this was what I wanted to pursue professionally.",
			icon: <Code className="h-5 w-5 text-primary" />,
			category: "education"
		},
		{
			year: "2016",
			title: "Web Development Awakening",
			command: "cd ~/projects && git log --before=2017 --grep='React'",
			output: "Built my first React application and realized the power of component-based architecture. This fundamentally changed how I thought about building interfaces.",
			icon: <Laptop className="h-5 w-5 text-primary" />,
			category: "project"
		},
		{
			year: "2018",
			title: "PostgreSQL Revelation",
			command: "psql -c 'SELECT version();'",
			output: "Found JSONB in Postgres and realized I didn't need MongoDB anymore. The ability to combine structured data with flexible document storage was a game-changer for my applications.",
			icon: <FileText className="h-5 w-5 text-primary" />,
			category: "discovery"
		},
		{
			year: "2020",
			title: "Type Safety Journey",
			command: "grep -r 'from pydantic import' ~/projects",
			output: "Started using TypeScript and Pydantic seriously. The productivity gains from catching errors at compile/validation time rather than runtime were incredible.",
			icon: <Code className="h-5 w-5 text-primary" />,
			category: "discovery"
		},
		{
			year: "2021",
			title: "AI Engineering Pivot",
			command: "cd ~/career && mkdir ai_engineering",
			output: "Began focusing exclusively on AI engineering. Built my first production LLM systems and discovered my passion for combining ML with practical software engineering.",
			icon: <GitBranch className="h-5 w-5 text-primary" />,
			category: "work"
		},
		{
			year: "2023",
			title: "Full-Stack AI Applications",
			command: "find ~/current_projects -type f -name '*ai*' | wc -l",
			output: "Mastered the full stack of AI application development. From fine-tuning foundational models to building engaging UIs that make AI accessible to everyone.",
			icon: <Laptop className="h-5 w-5 text-primary" />,
			category: "work"
		}
	];

	const getCategoryColor = (category: string): string => {
		switch (category) {
			case "education":
				return "bg-blue-500/20 text-blue-300 border-blue-500/30";
			case "work":
				return "bg-green-500/20 text-green-300 border-green-500/30";
			case "project":
				return "bg-purple-500/20 text-purple-300 border-purple-500/30";
			case "discovery":
				return "bg-amber-500/20 text-amber-300 border-amber-500/30";
			default:
				return "bg-primary/20 text-primary/80 border-primary/30";
		}
	};

	return (
		<section className="py-16">
			{/* Terminal header */}
			<div className="mb-8">
				<div className="flex items-center gap-2 mb-2">
					<Terminal className="h-5 w-5 text-primary" />
					<p className="text-sm font-mono text-primary">$ {typedTerminalText}<span className="animate-pulse">▌</span></p>
				</div>

				<div className="space-y-4">
					<h2 className="text-3xl font-bold text-foreground">Developer Journey</h2>
					<p className="text-lg text-muted-foreground">
						Key milestones in my evolution as a software engineer
					</p>
				</div>
			</div>

			{/* Timeline */}
			<div className="relative pl-8 border-l border-primary/20">
				{/* Glowing dot at top of timeline */}
				<div className="absolute left-[-5px] top-0 h-2.5 w-2.5 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary-rgb),0.8)]"></div>

				{milestones.map((milestone, index) => (
					<div
						key={index}
						ref={(el) => { milestoneRefs.current[index] = el; }}
						className={`mb-10 transition-all duration-500 ${activeMilestone === index
							? 'opacity-100 translate-x-0'
							: 'opacity-60 -translate-x-2'
							}`}
					>
						{/* Year indicator */}
						<div className="flex items-center mb-2">
							<div className="absolute left-[-5px] h-2.5 w-2.5 rounded-full bg-primary/70"></div>
							<Badge
								variant="outline"
								className="bg-black/40 border-primary/30 text-primary/90 font-mono flex items-center"
							>
								<Calendar className="h-3 w-3 mr-1.5" />
								{milestone.year}
							</Badge>
						</div>

						{/* Milestone content */}
						<div className="bg-black/30 rounded-lg border border-primary/20 overflow-hidden shadow-sm">
							{/* Terminal header */}
							<div className="bg-black/60 px-4 py-2 border-b border-primary/20 flex items-center justify-between">
								<div className="flex items-center gap-2">
									<div className="h-2.5 w-2.5 rounded-full bg-red-500"></div>
									<div className="h-2.5 w-2.5 rounded-full bg-yellow-500"></div>
									<div className="h-2.5 w-2.5 rounded-full bg-green-500"></div>
									<h3 className="text-primary/90 font-mono text-sm ml-2">{milestone.title}</h3>
								</div>
								<Badge variant="outline" className={`${getCategoryColor(milestone.category)} text-xs font-mono`}>
									{milestone.category}
								</Badge>
							</div>

							{/* Command */}
							<div className="px-4 py-2 border-b border-primary/10 bg-black/40">
								<div className="flex items-center font-mono text-xs">
									<span className="text-primary/70 mr-2">$</span>
									<span className="text-muted-foreground">{milestone.command}</span>
								</div>
							</div>

							{/* Output */}
							<div className="p-4 bg-gradient-to-b from-black/10 to-black/20">
								<div className="flex text-muted-foreground">
									<span className="text-primary/50 font-mono text-sm mr-2 flex-shrink-0">
										<ArrowRight className="h-4 w-4" />
									</span>
									<p className="text-sm">{milestone.output}</p>
								</div>
							</div>
						</div>
					</div>
				))}

				{/* Glowing dot at bottom of timeline */}
				<div className="absolute left-[-5px] bottom-0 h-2.5 w-2.5 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary-rgb),0.8)]"></div>
			</div>

			{/* Terminal-inspired footer */}
			<div className="mt-6 text-center">
				<p className="inline-block text-xs font-mono text-muted-foreground bg-black/20 px-3 py-1 rounded-full border border-primary/10">
					<span className="text-primary/70 mr-1">&gt;</span>
					journey continues...
				</p>
			</div>
		</section>
	);
}; 