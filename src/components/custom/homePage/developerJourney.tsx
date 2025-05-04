"use client";

import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, Code, FileBadge, Terminal } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

interface JourneyMilestone {
	id: number;
	year: string;
	title: string;
	image: string;
	description: string;
	category: "education" | "work" | "project" | "personal";
}

export const DeveloperJourney: React.FC = () => {
	const [typedTerminalText, setTypedTerminalText] = useState("");
	const [activeMilestone, setActiveMilestone] = useState<number>(0);

	const timelineWrapperRef = useRef<HTMLDivElement>(null);

	const terminalText = "view career_journey --visual-timeline --use-arrows";

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

	// Handle keyboard navigation
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			// Only apply if timeline is in viewport
			if (!timelineWrapperRef.current) return;
			const rect = timelineWrapperRef.current.getBoundingClientRect();
			if (rect.top > window.innerHeight || rect.bottom < 0) return;

			if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
				e.preventDefault();
				if (activeMilestone < milestones.length - 1) {
					setActiveMilestone(prev => prev + 1);
				}
			} else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
				e.preventDefault();
				if (activeMilestone > 0) {
					setActiveMilestone(prev => prev - 1);
				}
			}
		};

		window.addEventListener('keydown', handleKeyDown);
		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, [activeMilestone]);

	const milestones: JourneyMilestone[] = [
		{
			id: 1,
			year: "Early Days",
			title: "Growing Up In the Bay Area",
			image: "/losAltos.png",
			description: "I was born and raised in Los Altos, CA, in the heart of Silicon Valley. I was very fortunate to have been raised in a good neighborhood with a loving and supportive family. I was immersed in a culture of innovation and entrepreneurship from a young age. I got good grades at Los Altos High School, played football for 4 years, and took multiple computer science courses.",
			category: "personal"
		},
		{
			id: 2,
			year: "High School",
			title: "Discovering my Love of Programming",
			image: "/scratch.png",
			description: "I loved the feeling of solving puzzles and the reward of building things. My first project was a 2D golf simulator built in Scratch using physics equations I had just learned in my AP Physics class! I was hooked from there, and decided to pursue a degree in Computer Science in college.",
			category: "education"
		},
		{
			id: 3,
			year: "College",
			title: "Undergraduate Computer Science",
			image: "/msuEngineering.jpeg",
			description: "I attended university at Michigan State as an undergraduate CS major. I chose Michigan State because I loved the traditional midwest college experience, and because I got a partial scholarship to go there. There I learned Python, C++, and of course fundamental data structures and algorithms.",
			category: "education"
		},
		{
			id: 4,
			year: "Pivot",
			title: "Switching Majors to Data Science",
			image: "/nflStats.png",
			description: "After taking some Data Science electives, I quickly found my true calling in data science—an area where the practical application of technology to solve real problems ignited my passion. One of my favorite projects was a statistical analysis of NFL statistics and the coefficient of correlation with number of wins. Not that I didn't like the classic algorithms and data structures of CS, but I got to model and solve real world problems in Data Science.",
			category: "education"
		},
		{
			id: 5,
			year: "First AI Experience",
			title: "First Hands on Experience with ML and AI",
			image: "/SVM.png",
			description: "As I progressed through my data science degree I got to take more classes in AI and Machine Learning, which was just the coolest thing ever to me. I knew I always wanted to work in AI and strongly believed that the hardest and most interesting problems could be solved with AI technology. (Notably this was pre ChatGPT). My capstone project worked with Argonne National Laboratory building ML models to predict moments of high volatility in fluid dynamics datasets.",
			category: "education"
		},
		{
			id: 6,
			year: "Post Graduation",
			title: "Post Graduation Struggles",
			image: "/leetcode.jpeg",
			description: "Post-graduation, the transition from academia to the professional world was unexpectedly challenging. Despite a robust educational background, the job market proved unforgiving, and repeated rejections soon took their toll, leaving me demoralized and questioning my path. Grinding leetcode was something that I seriously struggled with. I spent a year coaching JV football at Palo Alto with my twin brother, which was a unique and fun experience I'm glad I did.",
			category: "personal"
		},
		{
			id: 7,
			year: "Turning Point",
			title: "A Lifechanging Act of Kindness",
			image: "/scratch.jpeg",
			description: "Disillusioned with leetcode grinding and depressed from the college grad job search, I found myself working 40-50+ hours bartending and wondering how I could start my career. The turning point came from an unexpected source—a chance encounter at the bar with a random person at my bar one night. His name was Sean, and he was unexpectedly kind: asking about my education and eventually career goals. On the spot, Sean invited me to come code with him and some friends that Sunday at a local coffee shop.",
			category: "personal"
		},
		{
			id: 8,
			year: "2023",
			title: "Sunday Hustle",
			image: "/sundayHustle.webp",
			description: "I started regularly going to Sunday Hustle every week. At my first Sunday Hustle, I didn't know what to work on. I felt self-conscious of my coding ability and thought that I needed to spend some time doing leetcode to get back to speed. Sean immediately told me this was a dumb idea (something I love about him lol). This is where I first got introduced to the hacker and builder mindset, something I am proud to say I have today.",
			category: "personal"
		},
		{
			id: 9,
			year: "2023",
			title: "Building My Dream Project",
			image: "/abeChat.png",
			description: "Every Sunday marked an improvement in my capabilities as a software engineer and an increase in my experience using LLM technologies. My dream legal help project started to take shape into a fully functional LLM chatbot. The goal of the project was to democratize access and understanding of legal knowledge to all. A user could ask simple questions to the chatbot, which would search a database of scraped legislation to find relevant legislation.",
			category: "project"
		},
		{
			id: 10,
			year: "2023",
			title: "Ask Abe - My First Full Stack AI Application",
			image: "/abeSite.png",
			description: "I gave my LLM the persona of Abraham Lincoln, always honest and truthful. I learned so much about embeddings, similarity search, rag pipelines, optimizations to user queries with LLMs, chain of thought reasoning and prompting, and limitations to LLM technology. Eventually, I went to a Stanford LLM hackathon to showcase Ask Abe. I quit my job bartending, and started working full time on my passion project.",
			category: "project"
		},
		{
			id: 11,
			year: "2023",
			title: "Starting Recodify.ai",
			image: "/sqlStatutes.png",
			description: "I founded my first startup based on the work I had been doing with Ask Abe. The idea was to build a platform to help AI Engineers build LLM applications in the legal field. I asked my data science friend from MSU, Madeline, to be my cofounder. We would provide extensively processed primary source legislation data and tools to streamline the difficult task of building applications.",
			category: "work"
		},
		{
			id: 12,
			year: "2023",
			title: "Democratizing Legal Knowledge",
			image: "/abeMission.png",
			description: "These big players had such a monopoly on these AI applications because they had a monopoly on the data. We aimed to remove this barrier, level the playing field, and provide all the data and tools an AI Engineer would need to start building instantly. We wanted to democratize legal knowledge to allow for the construction of more powerful and wide spread AI applications.",
			category: "work"
		},
		{
			id: 13,
			year: "2024",
			title: "Open Sourcing My Work",
			image: "/openSourceLegislation.png",
			description: "Finding product market fit was difficult, not to mention the technical and practical implications of offering up the world's legislative data from an API. After a lot of debate and hard thinking, I decided to open source my work and shut down the startup to focus on my career as a software engineer and AI Engineer.",
			category: "project"
		},
		{
			id: 14,
			year: "2024",
			title: "AI Engineering Work with Contoural",
			image: "/contoural.png",
			description: "Because of our extensive IP of scraped and processed legislation, we were able to get our first client: Contoural. Contoural is an information governance consulting company which does extensive work consulting clients on how to handle large amounts of data to maintain legal and regulatory compliance.",
			category: "work"
		},
		{
			id: 15,
			year: "2024",
			title: "Building LLM Systems for Fortune 500 Companies",
			image: "/rrExtraction.png",
			description: "We were brought on to Contoural to build an AI system for extracting Recordkeeping Requirements with higher accuracy and quality metadata than anything on the market. This complex AI system pushed the boundaries of LLM capabilities for reasoning and structured data extraction in the legal field. I gained so much experience building production ready LLM applications.",
			category: "work"
		},
		{
			id: 16,
			year: "Present",
			title: "Looking to the Future",
			image: "/totalCommits.png",
			description: "Although I loved founding Recodify.ai, and building LLM applications for Contoural, I've always felt I hadn't reached my potential. I'm currently looking for full time employment in software engineering and AI Engineering. I want to work on interesting and difficult projects in a fast paced environment, BUILDING! Shipping fast, and contributing as much as possible.",
			category: "personal"
		}
	];

	// Handle navigation between milestones
	const navigateToMilestone = (index: number) => {
		if (index >= 0 && index < milestones.length) {
			setActiveMilestone(index);
		}
	};

	const getCategoryColor = (category: string): string => {
		switch (category) {
			case "education":
				return "bg-blue-500/20 text-blue-300 border-blue-500/30";
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
			{/* Section divider with terminal styling */}


			<div className="relative z-10 container mx-auto px-4">
				<div className="mx-auto max-w-6xl shadow-[0_0_60px_rgba(var(--primary),0.1)] rounded-xl overflow-hidden">
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
								<span>developer-journey — timeline.terminal</span>
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
						<div className="bg-background/90 px-6 py-8">
							{/* Terminal command */}
							<div className="flex items-center gap-2 mb-6">
								<Terminal className="h-5 w-5 text-primary" />
								<p className="text-sm font-mono text-primary">$ {typedTerminalText}<span className="animate-pulse">▌</span></p>
							</div>


							{/* Timeline display */}
							<div
								ref={timelineWrapperRef}
								className="relative"
							>
								{/* Progress indicator */}
								<div className="flex justify-between px-2 mb-6">
									<div className="text-xs font-mono text-primary/60">
										<span className="mr-1">Milestone</span>
										<span className="bg-black/40 px-2 py-0.5 rounded">{activeMilestone + 1}/{milestones.length}</span>
									</div>

									<div className="flex items-center gap-1">
										{milestones.map((_, idx) => (
											<button
												key={idx}
												onClick={() => navigateToMilestone(idx)}
												className={`h-1.5 rounded-full transition-all ${idx === activeMilestone
													? 'w-5 bg-primary'
													: 'w-1.5 bg-primary/30 hover:bg-primary/50'
													}`}
												aria-label={`Go to milestone ${idx + 1}`}
											/>
										))}
									</div>
								</div>

								{/* Navigation arrows on sides of timeline */}
								{activeMilestone > 0 && (
									<button
										onClick={() => navigateToMilestone(activeMilestone - 1)}
										className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-black/60 hover:bg-black/80 text-primary/70 hover:text-primary rounded-r-lg p-2 transition-all border-y border-r border-primary/20 shadow-lg"
										aria-label="Previous milestone"
									>
										<ChevronLeft className="h-8 w-8" />
									</button>
								)}

								{activeMilestone < milestones.length - 1 && (
									<button
										onClick={() => navigateToMilestone(activeMilestone + 1)}
										className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-black/60 hover:bg-black/80 text-primary/70 hover:text-primary rounded-l-lg p-2 transition-all border-y border-l border-primary/20 shadow-lg"
										aria-label="Next milestone"
									>
										<ChevronRight className="h-8 w-8" />
									</button>
								)}

								{/* Current milestone card */}
								<div
									className="bg-black/30 rounded-lg border border-primary/20 overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.2)]"
								>
									{/* Header */}
									<div className="bg-black/60 px-4 py-3 border-b border-primary/20 flex items-center justify-between">
										<div className="flex items-center gap-2">
											<Code className="h-4 w-4 text-primary" />
											<h3 className="text-primary/90 font-semibold flex items-center gap-2">
												<span>{milestones[activeMilestone].title}</span>
												<span className="text-xs text-primary/60 font-mono">({milestones[activeMilestone].year})</span>
											</h3>
										</div>
										<Badge
											variant="outline"
											className={`${getCategoryColor(milestones[activeMilestone].category)} text-xs font-mono`}
										>
											{milestones[activeMilestone].category}
										</Badge>
									</div>

									{/* Content with image and text */}
									<div className="flex flex-col md:flex-row">
										{/* Image */}
										<div className="md:w-1/2 relative">
											<div className="aspect-video md:aspect-square relative overflow-hidden border-b md:border-b-0 md:border-r border-primary/10">
												<div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-transparent z-10"></div>
												<Image
													src={milestones[activeMilestone].image}
													alt={milestones[activeMilestone].title}
													fill
													className="object-cover transition-transform duration-700"
													priority={activeMilestone < 3}
												/>
											</div>
										</div>

										{/* Description */}
										<div className="md:w-1/2 p-5 bg-gradient-to-b from-black/10 to-black/30">
											<div className="flex text-muted-foreground">
												<span className="text-primary/50 font-mono text-sm mr-2 flex-shrink-0">
													<ArrowRight className="h-4 w-4" />
												</span>
												<p className="text-sm">{milestones[activeMilestone].description}</p>
											</div>
										</div>
									</div>

									{/* Navigation controls */}
									<div className="flex justify-center items-center px-4 py-3 bg-black/40 border-t border-primary/10">
										{/* <button
											onClick={() => navigateToMilestone(activeMilestone - 1)}
											disabled={activeMilestone === 0}
											className={`px-4 py-2 rounded text-sm font-mono flex items-center gap-2 transition-colors
												${activeMilestone === 0
													? 'bg-black/20 text-primary/30 cursor-not-allowed'
													: 'bg-black/50 text-primary hover:text-primary/100 hover:bg-black/70 border border-primary/30 hover:border-primary/50 shadow-[0_0_10px_rgba(var(--primary-rgb),0.1)] hover:shadow-[0_0_10px_rgba(var(--primary-rgb),0.2)]'}`}
										>
											<ArrowLeft className="h-4 w-4" />
											Previous
										</button> */}

										{/* Navigation instruction */}
										<div className="flex items-center justify-center gap-3 mt-4 text-primary/70 text-sm font-mono border border-primary/30 rounded-md py-2 bg-black/20">
											<ArrowLeft className="h-4 w-4" />
											<ArrowRight className="h-4 w-4" />
											<span>Use arrow keys or navigation buttons to explore my journey</span>
										</div>

										{/* <button
											onClick={() => navigateToMilestone(activeMilestone + 1)}
											disabled={activeMilestone === milestones.length - 1}
											className={`px-4 py-2 rounded text-sm font-mono flex items-center gap-2 transition-colors
												${activeMilestone === milestones.length - 1
													? 'bg-black/20 text-primary/30 cursor-not-allowed'
													: 'bg-black/50 text-primary hover:text-primary/100 hover:bg-black/70 border border-primary/30 hover:border-primary/50 shadow-[0_0_10px_rgba(var(--primary-rgb),0.1)] hover:shadow-[0_0_10px_rgba(var(--primary-rgb),0.2)]'}`}
										>
											Next
											<ArrowRight className="h-4 w-4" />
										</button> */}
									</div>
								</div>
							</div>
						</div>

						{/* Terminal command prompt footer */}
						<div className="px-4 py-3 bg-zinc-900 border-t border-primary/10">
							<div className="font-mono text-xs flex items-center text-primary/60">
								<span className="text-primary/80 mr-2">$</span>
								<span className="mr-1">journey --next-chapter</span>
								<span className="animate-pulse-slow">▌</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}; 