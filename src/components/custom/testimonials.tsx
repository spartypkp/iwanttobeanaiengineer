"use client";

import { Badge } from "@/components/ui/badge";
import { Briefcase, GraduationCap, Quote, ShieldCheck, Terminal, ThumbsUp, User } from "lucide-react";
import React, { useEffect, useState } from 'react';

interface Testimonial {
	id: number;
	name: string;
	role: string;
	company: string;
	relationship: "colleague" | "friend" | "mentor" | "client";
	quote: string;
	featured?: boolean;
}

export const Testimonials: React.FC = () => {
	const [isLoaded, setIsLoaded] = useState(false);

	// Simulate loading state
	useEffect(() => {
		const timer = setTimeout(() => {
			setIsLoaded(true);
		}, 500);
		return () => clearTimeout(timer);
	}, []);

	// Sample testimonials - replace with real ones
	const testimonials: Testimonial[] = [
		{
			id: 1,
			name: "Alex Johnson",
			role: "Senior AI Engineer",
			company: "TechCorp",
			relationship: "colleague",
			quote: "Will's approach to AI engineering problems is refreshingly innovative. He doesn't just solve problems—he reimagines them.",
			featured: true
		},
		{
			id: 2,
			name: "Mia Rodriguez",
			role: "ML Team Lead",
			company: "DataSystems",
			relationship: "friend",
			quote: "The rare combination of technical excellence and communication skills makes Will stand out. He can translate complex AI concepts into actionable insights."
		},
		{
			id: 3,
			name: "Jamal Washington",
			role: "Startup Founder",
			company: "AIVentures",
			relationship: "client",
			quote: "Will helped design our RAG system when we were starting out. His ability to optimize for both performance and cost-efficiency was exactly what we needed."
		},
		{
			id: 4,
			name: "Sarah Chen",
			role: "Product Manager",
			company: "InnovateTech",
			relationship: "colleague",
			quote: "Will's dedication to user-centric solutions made our partnership exceptional. He never loses sight of the human impact of AI technology."
		},
		{
			id: 5,
			name: "Sean Parker",
			role: "Engineering Director",
			company: "Sunday Hustle",
			relationship: "mentor",
			quote: "I've watched Will's growth as an engineer with pride. His hunger for learning and ability to rapidly iterate on complex systems is impressive."
		},
		{
			id: 6,
			name: "Claude 3.7 Sonnet",
			role: "AI Assistant",
			company: "Anthropic",
			relationship: "friend",
			quote: "Will's prompt engineering skills are genuinely impressive. He builds AI systems that maximize my reasoning capabilities while implementing robust guardrails. His applications are elegantly architected—not that I'm biased about developers who understand my context window limitations.",
			featured: true
		}
	];

	const getRelationshipIcon = (relationship: string) => {
		switch (relationship) {
			case "colleague": return <Briefcase className="h-4 w-4" />;
			case "friend": return <ThumbsUp className="h-4 w-4" />;
			case "mentor": return <GraduationCap className="h-4 w-4" />;
			case "client": return <ShieldCheck className="h-4 w-4" />;
			default: return <User className="h-4 w-4" />;
		}
	};

	const getRelationshipColor = (relationship: string): string => {
		switch (relationship) {
			case "colleague": return "bg-blue-500/20 text-blue-300 border-blue-500/30";
			case "friend": return "bg-purple-500/20 text-purple-300 border-purple-500/30";
			case "mentor": return "bg-amber-500/20 text-amber-300 border-amber-500/30";
			case "client": return "bg-green-500/20 text-green-300 border-green-500/30";
			default: return "bg-primary/20 text-primary/80 border-primary/30";
		}
	};

	return (
		<section className="py-16 relative">
			{/* Section divider with terminal styling */}
			<div className="w-full max-w-md mx-auto mb-12 flex items-center gap-3">
				<div className="h-px bg-primary/20 flex-grow"></div>
				<div className="text-xs font-mono text-primary/40 px-2 py-1 border border-primary/10 rounded">endorsements</div>
				<div className="h-px bg-primary/20 flex-grow"></div>
			</div>

			<div className="container mx-auto px-4">
				{/* Header with humor */}
				<div className="mx-auto max-w-2xl text-center mb-12">
					<h2 className="text-3xl font-bold mb-4">Shameless Self Plug <span className="text-primary">++</span></h2>
					<div className="flex items-center justify-center gap-2 mb-4">
						<div className="inline-block h-1.5 w-24 bg-gradient-to-r from-transparent via-primary/40 to-transparent rounded"></div>
						<Terminal className="h-5 w-5 text-primary/60" />
						<div className="inline-block h-1.5 w-24 bg-gradient-to-r from-transparent via-primary/40 to-transparent rounded"></div>
					</div>

					<p className="text-sm text-primary/70 font-mono border border-primary/20 rounded-md py-2 px-4 bg-black/20 inline-block">
						{"// Yes, I shamelessly bribed friends for testimonials."}
						<br />{"// No, the words weren't put in their mouths."}
						<br />{"// Well, maybe some light prompting..."}
					</p>
				</div>

				{/* Testimonial Grid */}
				<div
					className={`transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
				>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{testimonials.map(testimonial => (
							<div
								key={testimonial.id}
								className={`bg-black/30 rounded-xl overflow-hidden border border-primary/20 transition-all duration-300 hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.2)] hover:-translate-y-1 h-full flex flex-col ${testimonial.featured ? 'ring-2 ring-primary/30' : ''}`}
							>
								{/* Top status bar */}
								<div className="bg-black/60 border-b border-primary/20 flex items-center justify-between px-4 py-3">
									<div className="flex items-center gap-2">
										<Quote className="h-4 w-4 text-primary" />
										<span className="text-primary/90 font-mono text-xs">testimonial_{testimonial.id}.json</span>
									</div>
									<Badge
										variant="outline"
										className={`${getRelationshipColor(testimonial.relationship)} text-xs font-mono flex items-center gap-1`}
									>
										{getRelationshipIcon(testimonial.relationship)}
										<span>{testimonial.relationship}</span>
									</Badge>
								</div>

								{/* Main content */}
								<div className="p-5 flex-grow flex flex-col">
									{/* Quote section */}
									<blockquote className="text-base leading-relaxed relative mb-4 flex-grow">
										<div className="absolute -left-1 -top-1 text-3xl text-primary/20 font-serif">&quot;</div>
										<p className="relative z-10 text-muted-foreground pl-3 pt-2">
											{testimonial.quote}
										</p>
										<div className="absolute -right-1 bottom-0 text-3xl text-primary/20 font-serif">&quot;</div>
									</blockquote>

									{/* Avatar and name section */}
									<div className="mt-auto pt-4 border-t border-primary/10 flex items-center">
										<div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-black/60 flex items-center justify-center mr-3">
											<User className="h-5 w-5 text-primary/60" />
										</div>
										<div>
											<div className="font-medium">{testimonial.name}</div>
											<div className="text-xs text-muted-foreground">{testimonial.role} @ {testimonial.company}</div>
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Terminal footer */}
				<div className="mt-10 w-full max-w-2xl mx-auto">
					<div className="bg-black/30 border border-primary/10 rounded-md px-4 py-2">
						<div className="font-mono text-xs flex items-center text-primary/60">
							<span className="text-primary/80 mr-2">$</span>
							<span>grep -r &quot;nice things&quot; --include=&quot;*.friends&quot; /home/will/social_circle</span>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}; 