import { Badge } from '@/components/ui/badge';
import { ArrowRight, Code, Coffee, Github, Linkedin, Terminal, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import MatrixButton from './matrixButton';

interface HeroProps {
	name: string;
	title: string;
	tagline: string;
	image: string;
	startAnimation?: boolean;
}

export const Hero: React.FC<HeroProps> = ({
	name,
	title,
	tagline,
	image,
	startAnimation = true
}) => {
	const [typedName, setTypedName] = useState('');
	const [typedTitle, setTypedTitle] = useState('');
	const [typedTagline, setTypedTagline] = useState('');
	const [showName, setShowName] = useState(false);
	const [showTitle, setShowTitle] = useState(false);
	const [showTagline, setShowTagline] = useState(false);
	const [showNameCursor, setShowNameCursor] = useState(true);
	const [showTitleCursor, setShowTitleCursor] = useState(true);
	const [showTaglineCursor, setShowTaglineCursor] = useState(true);
	const [animationComplete, setAnimationComplete] = useState(false);
	const [terminalActive, setTerminalActive] = useState(true);
	const animationInProgress = useRef(false);

	// Improved terminal-like typing effect with sequential animations
	useEffect(() => {
		// Only start animation when startAnimation is true
		if (!startAnimation || animationInProgress.current) return;

		animationInProgress.current = true;
		setShowName(true); // Make name container visible once animation starts

		// Slight initial delay before starting animation
		const initialDelay = setTimeout(() => {
			// Type name first
			let nameIndex = 0;
			const nameTypingSpeed = 70; // slightly slower for name for emphasis

			const nameTimer = setInterval(() => {
				if (nameIndex <= name.length) {
					setTypedName(name.substring(0, nameIndex));
					nameIndex++;
				} else {
					clearInterval(nameTimer);

					// Hide cursor for name after a brief pause
					setTimeout(() => {
						setShowNameCursor(false);

						// Pause before starting title animation
						setTimeout(() => {
							setShowTitle(true);

							// Then type title
							let titleIndex = 0;
							const titleTypingSpeed = 50;

							const titleTimer = setInterval(() => {
								if (titleIndex <= title.length) {
									setTypedTitle(title.substring(0, titleIndex));
									titleIndex++;
								} else {
									clearInterval(titleTimer);

									// Hide cursor for title after a brief pause
									setTimeout(() => {
										setShowTitleCursor(false);

										// Pause before starting tagline animation
										setTimeout(() => {
											setShowTagline(true);

											// Finally type tagline
											let taglineIndex = 0;
											const taglineTypingSpeed = 15; // faster for longer tagline text

											const taglineTimer = setInterval(() => {
												if (taglineIndex <= tagline.length) {
													setTypedTagline(tagline.substring(0, taglineIndex));
													taglineIndex++;
												} else {
													clearInterval(taglineTimer);

													// Hide cursor for tagline after a brief pause
													setTimeout(() => {
														setShowTaglineCursor(false);

														// Final pause before completing animation
														setTimeout(() => {
															setAnimationComplete(true);
															animationInProgress.current = false;
														}, 300);
													}, 200);
												}
											}, taglineTypingSpeed);

											return () => clearInterval(taglineTimer);
										}, 400); // Pause between title and tagline
									}, 200);
								}
							}, titleTypingSpeed);

							return () => clearInterval(titleTimer);
						}, 400); // Pause between name and title
					}, 200);
				}
			}, nameTypingSpeed);

			return () => clearInterval(nameTimer);
		}, 200);

		return () => {
			clearTimeout(initialDelay);
			animationInProgress.current = false;
		};
	}, [name, title, tagline, startAnimation]);

	// Highlight key phrases in the tagline
	const highlightTagline = (text: string) => {
		// If animation not running, return fully highlighted text
		if (!startAnimation || animationComplete) {
			return text
				.replace(/LLMs/g, '<span class="text-primary font-semibold">LLMs</span>')
				.replace(/AI/g, '<span class="text-primary font-semibold">AI</span>');
		}

		// During animation, only highlight completed text
		if (showTagline && typedTagline) {
			return typedTagline
				.replace(/LLMs/g, '<span class="text-primary font-semibold">LLMs</span>')
				.replace(/AI/g, '<span class="text-primary font-semibold">AI</span>');
		}

		return typedTagline;
	};

	return (
		<section className="py-20 flex flex-col md:flex-row items-center gap-12">
			{/* Left side - Content */}
			<div className="flex-1 space-y-6">
				{/* Terminal header styling */}
				<div
					className={`terminal-header mb-4 rounded-t-md bg-muted p-2 flex items-center transition-all duration-500 ${terminalActive ? 'shadow-[0_0_8px_rgba(var(--primary)/.3)]' : ''
						}`}
					onClick={() => setTerminalActive(true)}
				>
					<div className="h-3 w-3 rounded-full bg-red-500 mr-2"></div>
					<div className="h-3 w-3 rounded-full bg-yellow-500 mr-2"></div>
					<div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
					<span className="font-mono text-primary text-sm ml-2 flex items-center">
						<Terminal size={12} className="mr-1.5" />
						will@portfolio ~ $
					</span>
					<span className={`ml-auto text-xs text-muted-foreground font-mono transition-opacity duration-300 ${animationComplete ? 'opacity-100' : 'opacity-0'}`}>
						Terminal • Bash • 80×24
					</span>
				</div>

				<div
					className={`space-y-3 crt-effect p-4 bg-card/30 border transition-all duration-500 ${terminalActive
						? 'border-primary/40 rounded-b-md shadow-[inset_0_0_10px_rgba(var(--primary)/.1)]'
						: 'border-primary/10 rounded-b-md'
						}`}
				>
					<div className="flex items-center gap-2 text-primary text-sm font-mono mb-1">
						<Terminal size={16} />
						<span className="opacity-70">$ whoami</span>
					</div>
					<h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground min-h-[3rem] font-mono">
						{showName ? (
							<div className="flex items-center">
								<span className="text-primary/70 mr-2">&gt;</span>
								{typedName}
								{showNameCursor && <span className="cursor-blink ml-0.5">█</span>}
							</div>
						) : startAnimation ? null : (
							<div className="flex items-center">
								<span className="text-primary/70 mr-2">&gt;</span>
								{name}
							</div>
						)}
					</h1>
					<div className="flex items-center gap-3 min-h-[2.5rem]">
						{showTitle ? (
							<h2 className="text-2xl md:text-3xl text-muted-foreground font-mono flex items-center">
								<span className="text-primary/70 mr-2">&gt;</span>
								{typedTitle}
								{showTitleCursor && <span className="cursor-blink ml-0.5">█</span>}
								{!showTitleCursor && animationComplete && (
									<Badge
										variant="default"
										className="ml-3 bg-primary text-primary-foreground animate-pulse-slow"
									>
										Open to Work
									</Badge>
								)}
							</h2>
						) : startAnimation ? null : (
							<h2 className="text-2xl md:text-3xl text-muted-foreground font-mono flex items-center">
								<span className="text-primary/70 mr-2">&gt;</span>
								{title}
								<Badge variant="default" className="ml-3 bg-primary text-primary-foreground">
									Open to Work
								</Badge>
							</h2>
						)}
					</div>

					<div className="min-h-[4rem]">
						{showTagline ? (
							<p className="text-xl text-foreground max-w-2xl font-light flex items-start">
								<span className="text-primary/70 mr-2 font-mono">&gt;</span>
								<span dangerouslySetInnerHTML={{ __html: highlightTagline(typedTagline) }} />
								{showTaglineCursor && <span className="cursor-blink ml-0.5">█</span>}
							</p>
						) : startAnimation ? null : (
							<p className="text-xl text-foreground max-w-2xl font-light flex items-start">
								<span className="text-primary/70 mr-2 font-mono">&gt;</span>
								<span dangerouslySetInnerHTML={{ __html: highlightTagline(tagline) }} />
							</p>
						)}
					</div>

					{animationComplete && (
						<div className="font-mono text-xs text-muted-foreground pt-2 border-t border-dashed border-primary/10 mt-4 flex items-center animate-fade-in">
							<code className="bg-muted/50 px-1 py-0.5 rounded mr-2 text-primary">$ ls skills/</code>
							<span className="text-primary/60 animate-type-once overflow-hidden whitespace-nowrap mr-2">ML</span>
							<span className="text-primary/60 animate-type-once animation-delay-300 overflow-hidden whitespace-nowrap mr-2">LLMs</span>
							<span className="text-primary/60 animate-type-once animation-delay-600 overflow-hidden whitespace-nowrap mr-2">Backend</span>
							<span className="text-primary/60 animate-type-once animation-delay-900 overflow-hidden whitespace-nowrap">Cloud</span>
							<span className="cursor-blink ml-1">█</span>
						</div>
					)}
				</div>

				<div className={`pl-4 border-l-2 border-primary/50 transition-all duration-700 transform ${animationComplete || !startAnimation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
					<div className="flex items-center space-x-2 mb-2">
						<User size={16} className="text-primary" />
						<h3 className="text-lg font-semibold">Current Position</h3>
					</div>
					<p className="text-lg text-muted-foreground max-w-2xl">
						Currently at <span className="text-primary hover:underline transition-all">Contoural Inc</span>, building LLM systems for Fortune 500 companies.
					</p>

					<div className="flex items-center space-x-2 mt-4 mb-2">
						<Code size={16} className="text-primary" />
						<h3 className="text-lg font-semibold">Previously</h3>
					</div>
					<p className="text-lg text-muted-foreground max-w-2xl">
						Founded <span className="text-primary hover:underline transition-all">Recodify.ai</span>, organized Latent Space Podcast and AI Engineer Conference.
					</p>
				</div>

				<div className={`flex gap-4 pt-4 transition-all duration-700 transform ${animationComplete || !startAnimation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
					<MatrixButton variant="terminal" size="lg" glowIntensity="medium" asChild>
						<Link href="/projects">
							<div className="flex items-center">
								View Projects
								<ArrowRight className="ml-2 h-4 w-4" />
							</div>
						</Link>
					</MatrixButton>
					<MatrixButton variant="ghost" size="lg" glowIntensity="low" asChild>
						<Link href="#contact" className="group">
							Get in Touch
							<span className="ml-1 transition-all group-hover:ml-2">→</span>
						</Link>
					</MatrixButton>
				</div>

				<div className={`flex gap-4 pt-2 transition-all duration-700 delay-100 transform ${animationComplete || !startAnimation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
					<a
						href="https://github.com/yourusername"
						target="_blank"
						rel="noopener noreferrer"
						className="text-muted-foreground hover:text-primary transition-colors flex items-center"
					>
						<Github className="h-5 w-5 mr-1" />
						<span className="text-sm">GitHub</span>
					</a>
					<a
						href="https://linkedin.com/in/yourprofile"
						target="_blank"
						rel="noopener noreferrer"
						className="text-muted-foreground hover:text-primary transition-colors flex items-center"
					>
						<Linkedin className="h-5 w-5 mr-1" />
						<span className="text-sm">LinkedIn</span>
					</a>
					<a
						href="https://twitter.com/itsreallywillyd"
						target="_blank"
						rel="noopener noreferrer"
						className="text-muted-foreground hover:text-primary transition-colors flex items-center"
					>
						<Coffee className="h-5 w-5 mr-1" />
						<span className="text-sm">Buy me a coffee</span>
					</a>
				</div>
			</div>

			{/* Right side - Image */}
			<div className={`flex-shrink-0 transition-all duration-1000 transform ${animationComplete || !startAnimation ? 'opacity-100 translate-y-0 rotate-0' : 'opacity-0 translate-y-8 rotate-3'}`}>
				<div className="relative h-64 w-64 md:h-80 md:w-80 border-4 border-primary/30 rounded-2xl overflow-hidden shadow-[0_0_25px_rgba(var(--primary)/.2)] group">
					<div className="absolute inset-0 z-10 pointer-events-none terminal-scan-lines opacity-60"></div>
					<div className="absolute inset-0 z-20 bg-gradient-to-br from-transparent via-transparent to-background/80 opacity-70 mix-blend-overlay"></div>
					<div className="absolute inset-0 z-30 bg-[radial-gradient(circle_at_center,rgba(var(--primary),0)_0,rgba(0,0,0,.4)_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

					<div className="absolute top-3 right-3 z-40 bg-background/80 backdrop-blur-sm rounded-md px-2 py-1 text-xs font-mono text-primary border border-primary/20">
						<span className="inline-block h-2 w-2 rounded-full bg-primary/80 mr-1 animate-pulse"></span>
						LOCKED IN
					</div>

					<Image
						src={image}
						alt={name}
						fill
						className="rounded-xl object-cover transition-transform duration-700 group-hover:scale-105"
						priority
						sizes="(max-width: 768px) 256px, 320px"
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-transparent"></div>
				</div>

				{animationComplete && (
					<div className="mt-4 text-center text-sm text-muted-foreground font-mono animate-fade-in">
						<code className="bg-muted/30 px-2 py-1 rounded text-primary/80">will.diamond 〜 v1.0.2</code>
					</div>
				)}
			</div>
		</section>
	);
};