"use client";

import MatrixButton from "@/components/custom/deprecated/matrixButton";
import { Card } from "@/components/ui/card";
import { ArrowRight, CheckCircle2, Code, Coffee, Linkedin, Mail, MessageCircle, Terminal } from "lucide-react";
import { useEffect, useState } from "react";

interface ContactCTAProps {
	heading: string;
	subheading: string;
	buttonText: string;
}

export const ContactCTA: React.FC<ContactCTAProps> = ({
	heading,
	subheading,
	buttonText,
}) => {
	const [showCursor, setShowCursor] = useState(true);

	// Simulate blinking cursor effect
	useEffect(() => {
		const interval = setInterval(() => {
			setShowCursor(prev => !prev);
		}, 530);

		return () => clearInterval(interval);
	}, []);

	return (
		<section className="py-16 relative">
			{/* Terminal-inspired divider */}
			<div className="w-full max-w-md mx-auto mb-12 flex items-center gap-3">
				<div className="h-px bg-primary/20 flex-grow"></div>
				<div className="text-xs font-mono text-primary/40 px-2 py-1 border border-primary/10 rounded">say_hello</div>
				<div className="h-px bg-primary/20 flex-grow"></div>
			</div>

			<div className="max-w-4xl mx-auto">
				<Card className="bg-zinc-900/80 border-primary/20 border shadow-[0_0_25px_rgba(0,255,65,0.15)] overflow-hidden relative">
					{/* Top terminal bar */}
					<div className="bg-black/50 px-4 py-2 flex items-center justify-between border-b border-primary/20">
						<div className="flex items-center gap-2">
							<Terminal className="h-4 w-4 text-primary/70" />
							<span className="text-xs font-mono text-primary/70">let&apos;s_connect.sh</span>
						</div>
						<div className="flex gap-1.5">
							<div className="h-2.5 w-2.5 rounded-full bg-red-500/70"></div>
							<div className="h-2.5 w-2.5 rounded-full bg-yellow-500/70"></div>
							<div className="h-2.5 w-2.5 rounded-full bg-green-500/70"></div>
						</div>
					</div>

					<div className="px-6 py-8 text-center relative">
						{/* Decorative corner brackets */}
						<div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-primary/40"></div>
						<div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-primary/40"></div>
						<div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-primary/40"></div>
						<div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-primary/40"></div>

						{/* Scan line effect */}
						<div className="absolute inset-0 pointer-events-none overflow-hidden">
							<div className="w-full h-[1px] bg-primary/5 absolute top-0 left-0 animate-scan"></div>
						</div>

						<div className="inline-block px-4 py-2 bg-gradient-to-r from-primary/10 to-transparent border-l-2 border-primary/50 mb-6">
							<h2 className="text-3xl font-bold mb-1 text-primary font-mono">
								Let&apos;s Connect
							</h2>
							<div className="flex items-center justify-center gap-2 text-foreground/70 text-sm">
								<Code className="h-4 w-4 text-primary/50" />
								<span>Chat about AI, tech, or just say hello</span>
								<span className={`h-4 w-2 bg-primary/70 ${showCursor ? 'opacity-100' : 'opacity-0'}`}></span>
							</div>
						</div>

						<div className="flex flex-col gap-4 max-w-lg mx-auto mb-8">
							{/* Email Option */}
							<MatrixButton
								variant="terminal"
								size="lg"
								glowIntensity="medium"
								className="flex items-center justify-between px-4"
								onClick={() => { window.location.href = 'mailto:will@example.com'; }}
							>
								<span className="text-primary/80 font-mono text-sm">[01]</span>
								<div className="flex items-center gap-2">
									<Mail className="h-5 w-5" />
									<span>Email Me</span>
								</div>
								<ArrowRight className="h-4 w-4" />
							</MatrixButton>

							{/* Calendar Option */}
							<MatrixButton
								variant="ghost"
								size="lg"
								glowIntensity="low"
								className="flex items-center justify-between px-4"
								onClick={() => { window.open('https://calendly.com/yourusername', '_blank'); }}
							>
								<span className="text-primary/80 font-mono text-sm">[02]</span>
								<div className="flex items-center gap-2">
									<Coffee className="h-5 w-5" />
									<span>Virtual Coffee</span>
								</div>
								<ArrowRight className="h-4 w-4" />
							</MatrixButton>

							{/* LinkedIn Option */}
							<MatrixButton
								variant="ghost"
								size="lg"
								glowIntensity="low"
								className="flex items-center justify-between px-4"
								onClick={() => { window.open('https://linkedin.com/in/will-diamond-b1724520b', '_blank'); }}
							>
								<span className="text-primary/80 font-mono text-sm">[03]</span>
								<div className="flex items-center gap-2">
									<Linkedin className="h-5 w-5" />
									<span>LinkedIn</span>
								</div>
								<ArrowRight className="h-4 w-4" />
							</MatrixButton>
						</div>

						<div className="max-w-2xl mx-auto text-center text-foreground/70 mb-6">
							<p>Whether you&apos;re looking to collaborate on an AI project, chat about tech, or just connect with a fellow developer - I&apos;m always up for a good conversation!</p>
						</div>

						<div className="flex flex-wrap items-center justify-center gap-4 text-sm text-foreground/70 mt-6 border-t border-primary/10 pt-4">
							<div className="flex gap-2 items-center">
								<span className="inline-flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
								<span>Available for new projects & conversations</span>
							</div>
							<span className="text-primary/30 hidden md:inline">|</span>
							<div className="flex gap-2 items-center">
								<CheckCircle2 className="h-4 w-4 text-primary/70" />
								<span>Usually responds within 24hrs</span>
							</div>
							<span className="text-primary/30 hidden md:inline">|</span>
							<div className="flex gap-2 items-center">
								<MessageCircle className="h-4 w-4 text-primary/70" />
								<span>Happy to chat about anything tech-related</span>
							</div>
						</div>
					</div>
				</Card>
			</div>
		</section>
	);
};