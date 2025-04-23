"use client";

import { Badge } from "@/components/ui/badge";
import { CheckCircle, Database, FileBadge, Globe, Server, Terminal } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";

interface TechLove {
	name: string;
	category: string;
	icon: React.ReactNode;
	image: string;
	alt: string;
	loveStatement: string;
	personalNote: string;
}

export const ThingsILove: React.FC = () => {
	const [typedTerminalText, setTypedTerminalText] = useState("");
	const terminalText = "explore personal_favorites --depth=personal --show-reasoning";

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

	const techLoves: TechLove[] = [
		{
			name: "PostgreSQL",
			category: "Databases",
			icon: <Database className="h-5 w-5 text-primary" />,
			image: "/postgres.png",
			alt: "PostgreSQL logo",
			loveStatement: "The database I build everything with",
			personalNote: "I'm a self-proclaimed Postgres hardliner. It's the perfect balance between structured data and flexibility. When starting any project, Postgres is always my first choice - it scales with your needs and never lets you down."
		},
		{
			name: "Pydantic",
			category: "Python Ecosystem",
			icon: <CheckCircle className="h-5 w-5 text-primary" />,
			image: "/pydantic.png",
			alt: "Pydantic logo",
			loveStatement: "Type safety that makes sense in Python",
			personalNote: "Pydantic is game-changing for working with LLMs. It converts structured responses into Python objects with optional typing - catching bugs early and making code more maintainable. It's the perfect bridge between Python's flexibility and the safety of static typing."
		},
		{
			name: "3D Force Graphs",
			category: "Data Visualization",
			icon: <Globe className="h-5 w-5 text-primary" />,
			image: "/force-graph.png",
			alt: "3D Force Graph visualization",
			loveStatement: "Visualizing complex relationships in 3D space",
			personalNote: "I'm obsessed with visualizing complex data relationships in 3D space. My favorite project was creating a force-directed graph of the entire US Code of Federal Regulations, revealing hidden connections that would be impossible to see in traditional interfaces. It's where code meets art."
		},
		{
			name: "FastAPI",
			category: "Backend",
			icon: <Server className="h-5 w-5 text-primary" />,
			image: "/fastapi.png",
			alt: "FastAPI logo",
			loveStatement: "From zero to API in minutes",
			personalNote: "FastAPI is my go-to for building LLM applications quickly. With automatic docs, type validation, and incredible performance, I can deploy on Render and have a production-ready API in no time. Combined with Pydantic, it's an unbeatable combo for rapid prototyping."
		}
	];

	return (
		<section className="py-16 relative">
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
								<span>things-i-love — favorites.terminal</span>
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
						<div className="bg-background/90 p-6">
							{/* Terminal command */}
							<div className="flex items-center gap-2 mb-6">
								<Terminal className="h-5 w-5 text-primary" />
								<p className="text-sm font-mono text-primary">$ {typedTerminalText}<span className="animate-pulse">▌</span></p>
							</div>

							{/* Vertical stack of cards */}
							<div className="space-y-6">
								{techLoves.map((tech, index) => (
									<div
										key={index}
										className="bg-black/30 border border-primary/20 rounded-lg overflow-hidden shadow-sm hover:shadow-[0_0_15px_rgba(var(--primary-rgb),0.15)] transition-all"
									>
										{/* Card header */}
										<div className="bg-black/60 px-4 py-2.5 border-b border-primary/20 flex items-center justify-between">
											<div className="flex items-center gap-2">
												<div className="h-3 w-3 rounded-full bg-primary/70"></div>
												<h3 className="text-primary/90 font-mono text-sm">{tech.name}</h3>
											</div>
											<Badge variant="outline" className="bg-black/50 border-primary/30 text-xs font-mono">
												{tech.category}
											</Badge>
										</div>

										{/* Card content */}
										<div className="p-4 bg-gradient-to-b from-black/10 to-black/30">
											<div className="flex flex-col sm:flex-row gap-6">
												{/* Image container - with a consistent size */}
												<div className="relative h-52 w-52 sm:h-32 sm:w-32 flex-shrink-0 mx-auto sm:mx-0 bg-black/40 rounded-md overflow-hidden border border-primary/20">
													<Image
														src={tech.image}
														alt={tech.alt}
														fill
														className="object-contain p-2"
													/>
												</div>

												{/* Text content */}
												<div className="flex-1">
													<p className="text-foreground font-semibold mb-2 italic">"{tech.loveStatement}"</p>
													<div className="flex text-muted-foreground items-start">
														<span className="text-primary/70 font-mono text-sm mr-2 flex-shrink-0">$&gt;</span>
														<p className="text-sm">{tech.personalNote}</p>
													</div>
												</div>
											</div>
										</div>
									</div>
								))}
							</div>
						</div>

						{/* Terminal command prompt footer */}
						<div className="px-4 py-3 bg-zinc-900 border-t border-primary/10">
							<div className="font-mono text-xs flex items-center text-primary/60">
								<span className="text-primary/80 mr-2">$</span>
								<span className="mr-1">scroll --direction=vertical</span>
								<span className="animate-pulse-slow">▌</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}; 