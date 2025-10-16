"use client";

import { Badge } from "@/components/ui/badge";
import { ArrowRight, Code, FileBadge, Terminal } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";

interface JourneyMilestone {
	id: number;
	year: string;
	title: string;
	image: string;
	description: string;
	category: "work" | "project" | "personal";
}

export const DeveloperJourney: React.FC = () => {
	const [typedTerminalText, setTypedTerminalText] = useState("");
	const [activeMilestone, setActiveMilestone] = useState<number>(0);

	const terminalText = "cat career_journey.log --format=timeline";

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

	const milestones: JourneyMilestone[] = [
		{
			id: 1,
			year: "2022",
			title: "Post Graduation Struggles",
			image: "/leetcode.jpeg",
			description: "Post-graduation, the transition from academia to the professional world was unexpectedly challenging. Despite a robust educational background, the job market proved unforgiving, and repeated rejections soon took their toll, leaving me demoralized and questioning my path. Grinding leetcode was something that I seriously struggled with. I spent a year coaching JV football at Palo Alto High School with my twin brother, which was a unique and fun experience I'm glad I did.",
			category: "personal"
		},
		{
			id: 2,
			year: "2023",
			title: "A Lifechanging Act of Kindness",
			image: "/scratch.jpeg",
			description: "Disillusioned with leetcode grinding and depressed from the college grad job search, I found myself working 40-50+ hours bartending and wondering how I could start my career. The turning point came from an unexpected source—a chance encounter at the bar with a random customer one night. His name was Sean, and he was unexpectedly kind: asking about my education and eventually career goals. On the spot, Sean invited me to come code with him and some friends that Sunday at a local coffee shop.",
			category: "personal"
		},
		{
			id: 3,
			year: "2023",
			title: "Sunday Hustle - Builder Mindset",
			image: "/sundayHustle.webp",
			description: "I started regularly going to Sunday Hustle every week. At my first Sunday Hustle, I didn't know what to work on. I felt self-conscious of my coding ability and thought that I needed to spend some time doing leetcode to get back to speed. Sean immediately told me this was a dumb idea (something I love about him lol). This is where I first got introduced to the hacker and builder mindset, something I am proud to say I have today.",
			category: "personal"
		},
		{
			id: 4,
			year: "2023",
			title: "Ask Abe - First Full-Stack AI App",
			image: "/abeSite.png",
			description: "Every Sunday at Sunday Hustle marked an improvement in my software engineering capabilities. My dream legal help project evolved into a fully functional LLM chatbot with the persona of Abraham Lincoln. I learned embeddings, similarity search, RAG pipelines, query optimization with LLMs, chain of thought reasoning, and LLM limitations. Eventually, I showcased Ask Abe at a Stanford LLM hackathon. I quit bartending and started working full-time on my passion project.",
			category: "project"
		},
		{
			id: 5,
			year: "2023",
			title: "Founded Recodify.ai",
			image: "/sqlStatutes.png",
			description: "I founded my first startup based on Ask Abe, with my MSU friend Madeline as cofounder. We aimed to democratize legal knowledge by building a platform for AI Engineers to build LLM applications in the legal field. Big players had a monopoly on AI legal tools because they had a monopoly on the data. We provided extensively processed primary source legislation data and tools to level the playing field and enable rapid development.",
			category: "work"
		},
		{
			id: 6,
			year: "2024",
			title: "Open Sourcing & Pivoting",
			image: "/openSourceLegislation.png",
			description: "Finding product market fit was difficult, not to mention the technical and practical implications of offering up the world's legislative data from an API. After a lot of debate and hard thinking, I decided to open source my work and shut down the startup to focus on my career as a software engineer and AI Engineer. This was a difficult but necessary decision that taught me valuable lessons about entrepreneurship.",
			category: "project"
		},
		{
			id: 7,
			year: "2023-2025",
			title: "Contoural - Production AI Engineering",
			image: "/contoural.png",
			description: "Joined Contoural Inc, the largest independent provider of information governance consulting, trusted by 30% of Fortune 500 companies. Built LLM systems for recordkeeping requirement analysis, achieving 75% time reduction for enterprise projects and enabling Contoural to transition to fixed cost pricing. Architected citation extraction system analyzing US Federal Code with knowledge graph database. Designed comprehensive evaluation framework reaching 85% precision on AI classifications, beating human baselines. Collaborated with attorneys in hybrid technical/legal role.",
			category: "work"
		},
		{
			id: 8,
			year: "2024-2025",
			title: "Apprenticeship with Swyx at Smol AI",
			image: "/sundayHustleCommits.png",
			description: "Apprenticed with Swyx (Shawn Wang) across his portfolio of AI engineering ventures. Managed production operations for Latent Space Podcast, coordinating episode releases and building AI engineering projects to assist with production. Coordinated speaker program for AI Engineer Summit in New York, managing technical content and speaker logistics. Learned invaluable lessons about building in public and AI engineering best practices.",
			category: "work"
		},
		{
			id: 9,
			year: "2025",
			title: "Independent AI Engineering Consultancy",
			image: "/totalCommits.png",
			description: "After nearly two years building production LLM systems at Contoural and learning from industry leaders at Smol AI, I launched my independent consultancy. Providing AI engineering services to early-stage startups, building platforms for expert network search, content moderation systems, and evaluation frameworks for conversational AI. Working with multiple clients across diverse AI challenges.",
			category: "work"
		},
		{
			id: 10,
			year: "Present",
			title: "Building the Future",
			image: "/iWantToBeAnAIEngineer.png",
			description: "Running my independent consultancy while actively seeking full-time AI engineering opportunities. Building innovative projects like Texas Hold LLM (multi-agent poker with AI personalities), Specification Engine (dual-space graph visualization), and Sanity Content Copilot (conversational CMS). Still driven by the same passion from Sunday Hustle: working on interesting and difficult projects in a fast-paced environment, BUILDING! Shipping fast, and contributing as much as possible.",
			category: "personal"
		}
	];

	const getCategoryColor = (category: string): string => {
		switch (category) {
			case "work":
				return "bg-green-500/20 text-green-300 border-green-500/30";
			case "project":
				return "bg-purple-500/20 text-purple-300 border-purple-500/30";
			case "personal":
				return "bg-amber-500/20 text-amber-300 border-amber-500/30";
			default:
				return "bg-primary/20 text-primary/80 border-primary/30";
		}
	};

	return (
		<section className="py-16 relative">
			<div className="relative z-10 container mx-auto px-4">
				<div className="mx-auto max-w-7xl shadow-[0_0_60px_rgba(var(--primary),0.1)] rounded-xl overflow-hidden">
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
								<span>career-journey — timeline.log</span>
							</div>
						</div>

						<div className="text-xs font-mono bg-black/30 px-2 py-0.5 rounded-sm border border-primary/10 flex items-center">
							<span className="inline-block h-1.5 w-1.5 rounded-full bg-green-500 mr-1.5 animate-pulse"></span>
							<FileBadge size={10} className="text-primary/60 mr-1" />
							<span className="uppercase text-[10px]">ACTIVE</span>
						</div>
					</div>

					{/* Terminal content area */}
					<div className="bg-zinc-900/90 backdrop-blur-sm border-x border-b border-primary/20">
						{/* Main content */}
						<div className="bg-background/90">
							{/* Terminal command */}
							<div className="flex items-center gap-2 px-6 pt-6 pb-4">
								<Terminal className="h-5 w-5 text-primary" />
								<p className="text-sm font-mono text-primary">$ {typedTerminalText}<span className="animate-pulse">▌</span></p>
							</div>

							{/* TWO COLUMN LAYOUT - Timeline + Detail */}
							<div className="flex flex-col lg:flex-row gap-0 lg:h-[calc(100vh-280px)] lg:max-h-[800px]">
								{/* LEFT SIDEBAR - Vertical Timeline (Always Visible) */}
								<div className="lg:w-[35%] border-r border-primary/10 bg-black/20 lg:overflow-y-auto terminal-scrollbar">
									<div className="p-4">
										<div className="space-y-1">
											{milestones.map((milestone, idx) => (
												<button
													key={milestone.id}
													onClick={() => setActiveMilestone(idx)}
													className={`w-full text-left px-3 py-3 rounded-md transition-all group relative ${
														idx === activeMilestone
															? 'bg-primary/20 border border-primary/30'
															: 'hover:bg-black/40 border border-transparent'
													}`}
												>
													{/* Timeline connector line */}
													{idx < milestones.length - 1 && (
														<div className="absolute left-2 top-full h-1 w-px bg-primary/20"></div>
													)}

													<div className="flex items-start gap-3">
														{/* Dot indicator */}
														<div className={`mt-1 flex-shrink-0 h-2 w-2 rounded-full transition-all ${
															idx === activeMilestone
																? 'bg-primary shadow-[0_0_8px_rgba(var(--primary-rgb),0.6)]'
																: 'bg-primary/30 group-hover:bg-primary/50'
														}`}></div>

														<div className="flex-1 min-w-0">
															{/* Year */}
															<div className="text-[10px] font-mono text-primary/60 mb-0.5">
																{milestone.year}
															</div>

															{/* Title */}
															<div className={`text-sm font-medium transition-colors truncate ${
																idx === activeMilestone
																	? 'text-primary'
																	: 'text-muted-foreground group-hover:text-foreground'
															}`}>
																{milestone.title}
															</div>

															{/* Category badge */}
															<div className="mt-1.5">
																<Badge
																	variant="outline"
																	className={`${getCategoryColor(milestone.category)} text-[10px] py-0 px-1.5 font-mono uppercase`}
																>
																	{milestone.category}
																</Badge>
															</div>
														</div>
													</div>
												</button>
											))}
										</div>
									</div>
								</div>

								{/* RIGHT PANEL - Milestone Detail */}
								<div className="lg:w-[65%] p-4 lg:p-6 relative lg:overflow-y-auto terminal-scrollbar">
									{/* Animated background gradient */}
									<div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-50 pointer-events-none"></div>

									<div className="relative space-y-4 lg:space-y-5">
										{/* Header Section with Terminal Styling */}
										<div className="space-y-3">
											{/* Year badge */}
											<div className="inline-flex items-center gap-2 px-3 py-1 bg-black/40 border border-primary/20 rounded-md">
												<Code className="h-3 w-3 text-primary/70" />
												<span className="text-xs font-mono text-primary/80 tracking-wider">
													{milestones[activeMilestone].year}
												</span>
											</div>

											{/* Title with animated underline */}
											<div className="relative">
												<h3 className="text-3xl lg:text-4xl font-bold text-foreground leading-tight mb-2 transition-all duration-300">
													{milestones[activeMilestone].title}
												</h3>
												<div className="h-0.5 w-16 bg-primary/80 rounded-full transition-all duration-500"></div>
											</div>

											{/* Category badge with icon */}
											<div className="flex items-center gap-3">
												<Badge
													variant="outline"
													className={`${getCategoryColor(milestones[activeMilestone].category)} text-xs font-mono uppercase px-2 py-0.5`}
												>
													{milestones[activeMilestone].category}
												</Badge>
												<div className="text-xs font-mono text-muted-foreground/60">
													{activeMilestone + 1} of {milestones.length}
												</div>
											</div>
										</div>

										{/* Divider */}
										<div className="flex items-center gap-2">
											<div className="h-px flex-1 bg-gradient-to-r from-primary/40 via-primary/20 to-transparent"></div>
											<div className="h-1 w-1 rounded-full bg-primary/40"></div>
											<div className="h-px flex-1 bg-gradient-to-l from-primary/40 via-primary/20 to-transparent"></div>
										</div>

										{/* Image with enhanced styling */}
										<div className="group relative">
											<div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden border border-primary/20 shadow-[0_0_20px_rgba(var(--primary-rgb),0.1)] transition-all duration-500 group-hover:shadow-[0_0_30px_rgba(var(--primary-rgb),0.2)] group-hover:border-primary/30 bg-black/40">
												{/* Corner decorations */}
												<div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-primary/50 z-20"></div>
												<div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-primary/50 z-20"></div>
												<div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-primary/50 z-20"></div>
												<div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-primary/50 z-20"></div>

												{/* Scan line effect */}
												<div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent z-10 animate-pulse-slow"></div>

												{/* Image gradient overlay */}
												<div className="absolute inset-0 bg-gradient-to-br from-black/30 via-transparent to-primary/10 z-10 transition-opacity duration-500 group-hover:opacity-70"></div>

												<Image
													src={milestones[activeMilestone].image}
													alt={milestones[activeMilestone].title}
													fill
													className="object-contain transition-transform duration-700 group-hover:scale-105 p-4"
													priority={activeMilestone < 3}
												/>
											</div>

											{/* Image caption */}
											<div className="mt-2 flex items-center gap-2 text-xs font-mono text-primary/50">
												<div className="h-px w-6 bg-primary/30"></div>
												<span>visual_memory_{activeMilestone + 1}.jpg</span>
											</div>
										</div>

										{/* Description with terminal box */}
										<div className="relative">
											{/* Terminal-style container */}
											<div className="bg-black/30 border border-primary/20 rounded-lg p-4 backdrop-blur-sm">
												{/* Terminal header */}
												<div className="flex items-center justify-between mb-3 pb-2 border-b border-primary/10">
													<div className="flex items-center gap-2">
														<div className="flex gap-1">
															<div className="h-2 w-2 rounded-full bg-red-500/50"></div>
															<div className="h-2 w-2 rounded-full bg-yellow-500/50"></div>
															<div className="h-2 w-2 rounded-full bg-green-500/50"></div>
														</div>
														<span className="text-[10px] font-mono text-primary/50 ml-1">story.txt</span>
													</div>
													<div className="text-[10px] font-mono text-primary/40">
														{milestones[activeMilestone].description.length} chars
													</div>
												</div>

												{/* Description text */}
												<div className="flex gap-3">
													<div className="flex-shrink-0 pt-0.5">
														<ArrowRight className="h-3.5 w-3.5 text-primary/60" />
													</div>
													<div className="flex-1">
														<p className="text-sm lg:text-base leading-relaxed text-foreground/90 font-light">
															{milestones[activeMilestone].description}
														</p>
													</div>
												</div>

												{/* Terminal cursor */}
												<div className="mt-3 pt-2 border-t border-primary/10">
													<div className="flex items-center gap-2 text-xs font-mono text-primary/40">
														<span>$</span>
														<span className="animate-pulse">▌</span>
													</div>
												</div>
											</div>
										</div>

										{/* Navigation with enhanced styling */}
										<div className="relative pt-4">
											{/* Divider */}
											<div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>

											<div className="flex items-center justify-between gap-3">
												<button
													onClick={() => setActiveMilestone(Math.max(0, activeMilestone - 1))}
													disabled={activeMilestone === 0}
													className={`group flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-mono transition-all duration-300 ${
														activeMilestone === 0
															? 'opacity-30 cursor-not-allowed bg-black/20'
															: 'bg-black/40 hover:bg-primary/20 text-primary border border-primary/30 hover:border-primary/50 shadow-[0_0_10px_rgba(var(--primary-rgb),0.1)] hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)]'
													}`}
												>
													<ArrowRight className="h-3.5 w-3.5 rotate-180 transition-transform group-hover:-translate-x-1" />
													<span className="text-xs">Previous</span>
												</button>

												<div className="flex items-center gap-2 px-3 py-1.5 bg-black/40 border border-primary/20 rounded-lg">
													<div className="flex gap-1">
														{milestones.map((_, idx) => (
															<div
																key={idx}
																className={`h-1 rounded-full transition-all duration-300 ${
																	idx === activeMilestone
																		? 'w-5 bg-primary shadow-[0_0_6px_rgba(var(--primary-rgb),0.6)]'
																		: 'w-1 bg-primary/30'
																}`}
															></div>
														))}
													</div>
													<div className="text-xs font-mono text-primary/60 border-l border-primary/20 pl-2">
														{activeMilestone + 1}/{milestones.length}
													</div>
												</div>

												<button
													onClick={() => setActiveMilestone(Math.min(milestones.length - 1, activeMilestone + 1))}
													disabled={activeMilestone === milestones.length - 1}
													className={`group flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-mono transition-all duration-300 ${
														activeMilestone === milestones.length - 1
															? 'opacity-30 cursor-not-allowed bg-black/20'
															: 'bg-black/40 hover:bg-primary/20 text-primary border border-primary/30 hover:border-primary/50 shadow-[0_0_10px_rgba(var(--primary-rgb),0.1)] hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)]'
													}`}
												>
													<span className="text-xs">Next</span>
													<ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
												</button>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>

						{/* Terminal command prompt footer */}
						<div className="px-4 py-3 bg-zinc-900 border-t border-primary/10">
							<div className="font-mono text-xs flex items-center text-primary/60">
								<span className="text-primary/80 mr-2">$</span>
								<span className="mr-1">journey --write-next-chapter</span>
								<span className="animate-pulse-slow">▌</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};
