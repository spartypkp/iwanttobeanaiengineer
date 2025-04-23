import { Badge } from '@/components/ui/badge';
import { Code, Coffee, FileBadge, Github, Laptop, Linkedin, Server, Terminal, Twitter, User } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

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
	const [showAccessGranted, setShowAccessGranted] = useState(false);
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

														// Show "Access Granted" message after animation completes
														setTimeout(() => {
															setShowAccessGranted(true);

															// Final pause before completing animation
															setTimeout(() => {
																setAnimationComplete(true);
																animationInProgress.current = false;
															}, 800);
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
		<section className="py-16 md:py-24 relative">
			{/* Background connector elements */}
			<div className="absolute left-0 right-0 top-1/2 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent z-0"></div>
			<div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/20 to-transparent z-0"></div>

			{/* Terminal container for hero section */}
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
								<span>hero — portfolio.terminal</span>
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
						{/* Simulated terminal header text */}
						{/* <div className="px-4 pt-3 pb-2 font-mono text-[10px] text-primary/40 border-b border-primary/5">
							<p>Last login: {new Date().toLocaleDateString()} —— Welcome to Will Diamond's portfolio</p>
						</div> */}

						{/* Main hero content */}
						<div className="bg-background/90">
							{/* Main content with flex layout */}
							<div className="flex flex-col md:flex-row items-center gap-6 md:gap-12 p-5 md:p-8">
								{/* Left side - Content */}
								<div className="flex-1 space-y-6 relative">
									{/* Terminal content area */}
									<div className="space-y-3 crt-effect p-5 bg-black/50 border border-primary/30 rounded-md relative">
										{/* Subtle scan lines */}
										<div className="absolute inset-0 pointer-events-none terminal-scan-lines opacity-20"></div>

										{/* Line numbers */}
										<div className="absolute left-2 top-4 bottom-0 w-5 text-xs font-mono text-primary/30 flex flex-col items-end pr-2">
											<div>1</div>
											<div>2</div>
											<div>3</div>
											<div>4</div>
											<div>5</div>
										</div>

										{/* Command prompt and content with line number margin */}
										<div className="ml-8">
											<div className="flex items-center gap-2 text-primary text-sm font-mono mb-3">
												<Terminal size={14} />
												<span className="opacity-70">$ whoami</span>
											</div>

											<h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground min-h-[3rem] font-mono">
												{showName ? (
													<div className="flex items-center">
														{typedName}
														{showNameCursor && <span className="cursor-blink ml-0.5">█</span>}
													</div>
												) : startAnimation ? null : (
													<div className="flex items-center">
														{name}
													</div>
												)}
											</h1>

											<div className="flex items-center gap-3 min-h-[2.5rem]">
												{showTitle ? (
													<h2 className="text-2xl md:text-3xl text-muted-foreground font-mono flex items-center">
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

											{/* Access granted message */}
											{showAccessGranted && !animationComplete && (
												<div className="mt-4 font-mono text-sm animate-fade-in flex items-center text-primary">
													<span className="mr-2 animate-pulse">▶</span>
													<span className="typing-animation">IDENTITY VERIFIED • ACCESS GRANTED</span>
												</div>
											)}

											{/* Skills listing - simplified */}
											{animationComplete && (
												<div className="font-mono text-xs text-muted-foreground pt-3 border-t border-dashed border-primary/20 mt-4 animate-fade-in">
													<div className="flex items-center mb-2">
														<code className="bg-black/40 px-2 py-1 rounded mr-2 text-primary flex items-center">
															<Terminal size={10} className="mr-1.5" />
															$ ls skills/
														</code>
														<span className="text-primary/30 text-[10px]">// List skill categories</span>
													</div>

													<div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3">
														<div className="flex items-center">
															<Laptop className="h-3 w-3 text-primary mr-1.5" />
															<span className="text-primary/70 animate-type-once overflow-hidden whitespace-nowrap">LLMs</span>
														</div>
														<div className="flex items-center">
															<Terminal className="h-3 w-3 text-primary mr-1.5" />
															<span className="text-primary/70 animate-type-once animation-delay-300 overflow-hidden whitespace-nowrap">Evals</span>
														</div>
														<div className="flex items-center">
															<Server className="h-3 w-3 text-primary mr-1.5" />
															<span className="text-primary/70 animate-type-once animation-delay-600 overflow-hidden whitespace-nowrap">Backend</span>
														</div>
														<div className="flex items-center">
															<Code className="h-3 w-3 text-primary mr-1.5" />
															<span className="text-primary/70 animate-type-once animation-delay-900 overflow-hidden whitespace-nowrap">Cloud</span>
														</div>
													</div>
												</div>
											)}
										</div>
									</div>

									{/* Connection line from terminal to profile - keep for visual connection */}
									<div className="hidden md:block absolute -right-6 top-1/2 w-6 border-t-2 border-dashed border-primary/30"></div>

									{/* Bio section */}
									<div className={`pl-4 border-l-2 border-primary/30 transition-all duration-700 transform ${animationComplete || !startAnimation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
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

									{/* Social links */}
									<div className={`flex gap-4 pt-2 transition-all duration-700 delay-100 transform ${animationComplete || !startAnimation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
										<a
											href="https://github.com/spartypkp"
											target="_blank"
											rel="noopener noreferrer"
											className="text-muted-foreground hover:text-primary transition-colors flex items-center"
										>
											<Github className="h-5 w-5 mr-1" />
											<span className="text-sm">GitHub</span>
										</a>
										<a
											href="https://www.linkedin.com/in/will-diamond-b1724520b/"
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
											<Twitter className="h-5 w-5 mr-1" />
											<span className="text-sm">Twitter</span>
										</a>
										<a
											href="https://buymeacoffee.com/willyd"
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
								<div className={`flex-shrink-0 relative z-10 transition-all duration-1000 transform ${animationComplete || !startAnimation ? 'opacity-100 translate-y-0 rotate-0' : 'opacity-0 translate-y-8 rotate-3'}`}>
									{/* Image frame - simplified */}
									<div className="relative h-72 w-72 md:h-96 md:w-96 border-4 border-primary/30 rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(var(--primary)/.25)] group">
										{/* Connection point from terminal */}
										<div className="absolute -left-3 top-1/2 w-3 h-3 rounded-full bg-primary animate-pulse-slow hidden md:block"></div>

										{/* Status indicator - simplified */}
										<div className="absolute top-3 right-3 z-40 bg-black/80 backdrop-blur-sm rounded-md px-2 py-1 text-xs font-mono text-primary border border-primary/30">
											<span className="inline-block h-2 w-2 rounded-full bg-primary/80 mr-1 animate-pulse"></span>
											ONLINE
										</div>

										{/* Scan lines and overlays */}
										<div className="absolute inset-0 z-10 pointer-events-none terminal-scan-lines opacity-40"></div>
										<div className="absolute inset-0 z-20 bg-gradient-to-br from-transparent via-transparent to-background/80 opacity-70 mix-blend-overlay"></div>
										<div className="absolute inset-0 z-30 bg-[radial-gradient(circle_at_center,rgba(var(--primary),0)_0,rgba(0,0,0,.4)_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

										{/* Image */}
										<Image
											src={image}
											alt={name}
											fill
											className="rounded-xl object-cover transition-transform duration-700 group-hover:scale-105 z-5"
											priority
											sizes="(max-width: 768px) 288px, 384px"
										/>

										{/* Bottom gradient overlay */}
										<div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent z-15"></div>
									</div>

									{/* Image caption/version - simplified */}
									{animationComplete && (
										<div className="mt-4 text-center text-sm text-muted-foreground font-mono animate-fade-in">
											<span className="bg-black/20 px-3 py-1 rounded text-primary/80 border border-primary/10">Will Diamond</span>
										</div>
									)}

									{/* Corner decorations - simplified */}
									<div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary/20 rounded-tr-md"></div>
									<div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary/20 rounded-bl-md"></div>
								</div>
							</div>
						</div>

						{/* Terminal command prompt footer */}
						<div className="px-4 py-3 bg-zinc-900 border-t border-primary/10">
							<div className="font-mono text-xs flex items-center text-primary/60">
								<span className="text-primary/80 mr-2">$</span>
								<span className="mr-1">show projects</span>
								<span className="animate-pulse-slow">▌</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Section divider with terminal styling */}
			<div className="w-full max-w-md mx-auto mt-16 md:mt-20 flex items-center gap-3">
				<div className="h-px bg-primary/20 flex-grow"></div>
				<div className="text-xs font-mono text-primary/40 px-2 py-1 border border-primary/10 rounded">projects</div>
				<div className="h-px bg-primary/20 flex-grow"></div>
			</div>
		</section>
	);
};