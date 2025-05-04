import { Badge } from '@/components/ui/badge';
import { Code, FileBadge, Github, Linkedin, Terminal, Twitter, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import GitHubCalendar from "react-github-calendar";
interface HeroProps {
	name: string;
	title: string;
	tagline: string;
	image: string;
	startAnimation?: boolean;
}

// Unified terminal component that executes commands in sequence
export const Hero: React.FC<HeroProps> = ({
	name,
	title,
	tagline,
	image,
	startAnimation = true
}) => {
	// Basic typing animation states
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
	const [profileImageReady, setProfileImageReady] = useState(false);

	// Command execution sequence states
	const [currentCommand, setCurrentCommand] = useState(0);
	const [typingCommand, setTypingCommand] = useState(false);
	const [typedCommand, setTypedCommand] = useState('');
	const [showSkills, setShowSkills] = useState(false);
	const [showGitHubStats, setShowGitHubStats] = useState(false);
	const [allCommandsComplete, setAllCommandsComplete] = useState(false);

	const animationInProgress = useRef(false);
	const terminalRef = useRef<HTMLDivElement>(null);

	// Set profile image ready after initial render
	useEffect(() => {
		// Make the profile image visible immediately when animation starts
		if (startAnimation) {
			// Show profile image immediately
			setProfileImageReady(true);
		} else {
			// For non-animated state, also make image ready immediately
			const timer = setTimeout(() => {
				setProfileImageReady(true);
			}, 50);
			return () => clearTimeout(timer);
		}
	}, [startAnimation]);

	// Terminal command sequence
	const commands = [
		{ id: 'whoami', display: '$ whoami', delay: 0, typingSpeed: 15 },
		{ id: 'skills', display: '$ ls skills/', delay: 300, typingSpeed: 15 },
		{ id: 'github', display: '$ github stats --user=spartypkp', delay: 300, typingSpeed: 15 },
	];

	// Organized skills data by category
	const skillCategories = [
		{
			name: "languages",
			items: ["Python", "TypeScript", "JavaScript", "SQL", "Bash"]
		},
		{
			name: "ai",
			items: ["LLMs", "RAG", "Evals", "Fine-tuning", "Vector DBs"]
		},
		{
			name: "capabilities",
			items: ["Full Stack", "Data Science", "Consulting"]
		}
	];

	// Initial animation sequence (name, title, tagline)
	useEffect(() => {
		// Only start animation when startAnimation is true
		if (!startAnimation || animationInProgress.current) return;

		animationInProgress.current = true;

		// Add delay to start typing animation, allowing profile image to be seen first
		const initialDelay = setTimeout(() => {
			setShowName(true); // Make name container visible after initial delay

			// Fast initial typing speeds
			const nameSpeed = 10;
			const titleSpeed = 10;
			const taglineSpeed = 6;

			// Start typing name after user has had time to see the profile image
			setTimeout(() => {
				// Type name first
				let nameIndex = 0;

				const typeName = () => {
					if (nameIndex <= name.length) {
						setTypedName(name.substring(0, nameIndex));
						nameIndex++;
						setTimeout(typeName, nameSpeed);
					} else {
						// Hide cursor for name
						setTimeout(() => {
							setShowNameCursor(false);

							// Start title animation with a visible pause
							setTimeout(() => {
								setShowTitle(true);

								let titleIndex = 0;
								const typeTitle = () => {
									if (titleIndex <= title.length) {
										setTypedTitle(title.substring(0, titleIndex));
										titleIndex++;
										setTimeout(typeTitle, titleSpeed);
									} else {
										// Hide cursor for title
										setTimeout(() => {
											setShowTitleCursor(false);

											// Start tagline animation with a pause
											setTimeout(() => {
												setShowTagline(true);

												let taglineIndex = 0;
												const typeTagline = () => {
													if (taglineIndex <= tagline.length) {
														setTypedTagline(tagline.substring(0, taglineIndex));
														taglineIndex++;
														setTimeout(typeTagline, taglineSpeed);
													} else {
														// Hide cursor for tagline
														setTimeout(() => {
															setShowTaglineCursor(false);

															// Show "Access Granted" message
															setTimeout(() => {
																setShowAccessGranted(true);

																// Complete animation
																setTimeout(() => {
																	setAnimationComplete(true);
																	animationInProgress.current = false;
																}, 200);
															}, 100);
														}, 80);
													}
												};

												typeTagline();
											}, 200); // Slightly longer pause before tagline
										}, 100);
									}
								};

								typeTitle();
							}, 200); // Slightly longer pause before title
						}, 100);
					}
				};

				typeName();
			}, 300); // Longer initial delay to appreciate the profile image
		}, 100); // Slightly longer initial delay

		return () => {
			clearTimeout(initialDelay);
			animationInProgress.current = false;
		};
	}, [name, title, tagline, startAnimation]);

	// Command execution sequence effect
	useEffect(() => {
		if (!animationComplete) return;

		const executeCommands = async () => {
			// Start with the first command after initial animation
			const executeNextCommand = (index: number) => {
				if (index >= commands.length) {
					// All commands have finished
					setAllCommandsComplete(true);
					return;
				}

				// Start typing animation for the command
				setCurrentCommand(index);
				setTypingCommand(true);

				let cmdIndex = 0;
				const commandText = commands[index].display;
				const typingSpeed = commands[index].typingSpeed;

				// Type the command with consistent speed
				const typeCommandChar = () => {
					if (cmdIndex < commandText.length) {
						setTypedCommand(commandText.substring(0, cmdIndex + 1));
						cmdIndex++;
						setTimeout(typeCommandChar, typingSpeed);
					} else {
						// Command typing completed
						setTypingCommand(false);

						// Show the result immediately
						setTimeout(() => {
							switch (commands[index].id) {
								case 'skills':
									setShowSkills(true);
									break;
								case 'github':
									setShowGitHubStats(true);
									break;
							}

							// Scroll terminal to bottom
							if (terminalRef.current) {
								terminalRef.current.scrollTo({
									top: terminalRef.current.scrollHeight,
									behavior: 'smooth'
								});
							}

							// Execute next command after delay
							if (index < commands.length - 1) {
								setTimeout(() => {
									executeNextCommand(index + 1);
								}, commands[index + 1].delay);
							} else {
								// This was the last command
								setAllCommandsComplete(true);
							}
						}, 100);
					}
				};

				// Start typing the command
				typeCommandChar();
			};

			// Start execution of commands with a pause after initial animation
			setTimeout(() => {
				executeNextCommand(1); // Skip the whoami command as it's already shown
			}, 400); // Slightly longer delay before commands start
		};

		executeCommands();
	}, [animationComplete]);

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

	// Determine if the image should be visible
	const shouldShowImage = profileImageReady;

	if (!startAnimation) {
		return (
			<section className="pb-16 md:py-24 relative">
				{/* Background connector elements */}
				<div className="absolute left-0 right-0 top-1/2 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent z-0"></div>
				<div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/20 to-transparent z-0"></div>

				{/* Main content container */}
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
							<div className="bg-background/90">
								{/* Two-column layout */}
								<div className="flex flex-col md:flex-row gap-6 p-5 md:p-8">
									{/* LEFT COLUMN - Unified Terminal */}
									<div className="w-full md:w-7/12">
										{/* Unified terminal window with scrollable content */}
										<div
											ref={terminalRef}
											className="crt-effect p-5 bg-black/50 border border-primary/30 rounded-md relative h-[750px] overflow-y-auto"
										>
											{/* Subtle scan lines */}
											<div className="absolute inset-0 pointer-events-none terminal-scan-lines opacity-20"></div>

										</div>
									</div>

									{/* RIGHT COLUMN - Profile & Static Information */}
									<div className="w-full md:w-5/12 space-y-8">

									</div>
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
	}

	return (
		<section className="pb-16 md:py-24 relative">
			{/* Background connector elements */}
			<div className="absolute left-0 right-0 top-1/2 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent z-0"></div>
			<div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/20 to-transparent z-0"></div>

			{/* Main content container */}
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
						<div className="bg-background/90">
							{/* Two-column layout */}
							<div className="flex flex-col md:flex-row gap-6 p-5 md:p-8">
								{/* LEFT COLUMN - Unified Terminal */}
								<div className="w-full md:w-7/12">
									{/* Unified terminal window with scrollable content */}
									<div
										ref={terminalRef}
										className="crt-effect p-5 bg-black/50 border border-primary/30 rounded-md relative h-[750px] overflow-y-auto"
									>
										{/* Subtle scan lines */}
										<div className="absolute inset-0 pointer-events-none terminal-scan-lines opacity-20"></div>

										{/* Terminal content - always visible section (whoami) */}
										<div className="space-y-4 mb-6">
											<div className="flex items-center gap-2 text-primary text-sm font-mono">
												<Terminal size={14} />
												<span className="opacity-70">{commands[0].display}</span>
											</div>

											<h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground min-h-[3rem] font-mono pl-4 border-l-2 border-primary/20">
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

											<div className="flex items-center gap-3 min-h-[2.5rem] pl-4 border-l-2 border-primary/20">
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

											<div className="min-h-[4rem] pl-4 border-l-2 border-primary/20">
												{showTagline ? (
													<p className="text-xl text-foreground max-w-2xl font-light flex items-start">
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
												<div className="mt-2 font-mono text-sm animate-fade-in flex items-center text-primary">
													<span className="mr-2 animate-pulse">▶</span>
													<span className="typing-animation">IDENTITY VERIFIED • ACCESS GRANTED</span>
												</div>
											)}
										</div>

										{/* Skills command */}
										{currentCommand >= 1 && (
											<div className="pt-4 mt-6 border-t border-dashed border-primary/20">
												<div className="flex items-center gap-2 text-primary text-sm font-mono mb-4">
													<Terminal size={14} />
													{typingCommand && currentCommand === 1 ? (
														<div className="flex items-center">
															<span className="opacity-70">{typedCommand}</span>
															<span className="cursor-blink ml-0.5">█</span>
														</div>
													) : (
														<span className="opacity-70">{commands[1].display}</span>
													)}
												</div>

												{showSkills && (
													<div className="pl-4 border-l-2 border-primary/20 animate-fade-in">
														{/* Skills listing in terminal ls-style */}
														<div className="font-mono text-sm">
															{skillCategories.map((category, index) => (
																<div key={index} className="mb-2">
																	{/* <div className="text-primary/70 text-xs mb-1">
																		<span className="text-primary mr-1">drwxr-xr-x</span> {category.name}/
																	</div> */}
																	<div className="grid grid-cols-3 md:grid-cols-5 gap-2">
																		{category.items.map((skill, skillIndex) => (
																			<div key={skillIndex} className="text-muted-foreground hover:text-primary transition-colors truncate">
																				<span className="text-primary/40 mr-1 text-xs">•</span>
																				{skill}
																			</div>
																		))}
																	</div>
																</div>
															))}
														</div>
													</div>
												)}
											</div>
										)}

										{/* GitHub Stats command with react-github-calendar */}
										{currentCommand >= 2 && (
											<div className="pt-4 mt-6 border-t border-dashed border-primary/20">
												<div className="flex items-center gap-2 text-primary text-sm font-mono mb-4">
													<Terminal size={14} />
													{typingCommand && currentCommand === 2 ? (
														<div className="flex items-center">
															<span className="opacity-70">{typedCommand}</span>
															<span className="cursor-blink ml-0.5">█</span>
														</div>
													) : (
														<span className="opacity-70">{commands[2].display}</span>
													)}
												</div>

												{showGitHubStats && (
													<div className="pl-4 border-l-2 border-primary/20 animate-fade-in">
														{/* GitHub Calendar integration */}
														<div className="pb-1">
															<div className="text-xs text-primary/60 mb-2">Contribution Calendar:</div>
															<div className="bg-zinc-900/60 p-3 rounded-md">
																<GitHubCalendar
																	username="spartypkp"
																	colorScheme="dark"
																	hideColorLegend
																	hideMonthLabels
																	labels={{
																		totalCount: '{{count}} contributions in the last year',
																	}}
																/>
															</div>
														</div>
													</div>
												)}
											</div>
										)}

										{/* Terminal cursor at end - only show when all commands are done */}
										{allCommandsComplete && (
											<div className="pt-4 mt-6 border-t border-dashed border-primary/20">
												<div className="flex items-center gap-2 text-primary text-sm font-mono">
													<Terminal size={14} />
													<span className="opacity-70">$</span>
													<span className="cursor-blink ml-0.5">█</span>
												</div>
											</div>
										)}
									</div>
								</div>

								{/* RIGHT COLUMN - Profile & Static Information */}
								<div className="w-full md:w-5/12 space-y-8">
									{/* Profile Image */}
									<div className={`relative z-10 transition-all duration-1000 transform ${shouldShowImage ? 'opacity-100 translate-y-0 rotate-0' : 'opacity-0 translate-y-8 rotate-3'}`}>
										{/* Image frame */}
										<div className="relative mx-auto h-64 w-64 md:h-80 md:w-80 border-4 border-primary/30 rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(var(--primary)/.25)] group">
											{/* Status indicator */}
											<div className="absolute top-3 right-3 z-40 bg-black/80 backdrop-blur-sm rounded-md px-2 py-1 text-xs font-mono text-primary border border-primary/30">
												<span className="inline-block h-2 w-2 rounded-full bg-primary/80 mr-1 animate-pulse"></span>
												LOCKED IN
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
												sizes="(max-width: 768px) 256px, 320px"
											/>

											{/* Bottom gradient overlay */}
											<div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent z-15"></div>
										</div>

										{/* Image caption/version */}
										{animationComplete && (
											<div className="mt-4 text-center text-sm text-muted-foreground font-mono animate-fade-in">
												<span className="bg-black/20 px-3 py-1 rounded text-primary/80 border border-primary/10">Will Diamond</span>
											</div>
										)}

										{/* Corner decorations */}
										<div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary/20 rounded-tr-md"></div>
										<div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary/20 rounded-bl-md"></div>
									</div>

									{/* Bio Information */}
									<div className={`space-y-6 transition-all duration-700 transform ${animationComplete || !startAnimation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
										{/* Current Position */}
										<div className="pl-4 border-l-2 border-primary/30">
											<div className="flex items-center space-x-2 mb-2">
												<User size={16} className="text-primary" />
												<h3 className="text-lg font-semibold">Current Position</h3>
											</div>
											<p className="text-lg text-muted-foreground">
												Currently at <Link href="https://contoural.com" target="_blank" rel="noopener noreferrer" className="text-primary underline transition-all">Contoural Inc</Link>, building legal tech LLM systems for Fortune 500 companies. Pursuing independent <span className="text-primary">contract AI Engineering</span> opportunities.
											</p>
										</div>

										{/* Previous Position */}
										<div className="pl-4 border-l-2 border-primary/30">
											<div className="flex items-center space-x-2 mb-2">
												<Code size={16} className="text-primary" />
												<h3 className="text-lg font-semibold">Previously</h3>
											</div>
											<div className="text-lg text-muted-foreground space-y-2">
												<p>
													Founded <span className="text-primary transition-all">Recodify.ai</span>
												</p>
												<p>
													Production Assistant at <Link href="https://www.latent.space/" target="_blank" rel="noopener noreferrer" className="text-primary underline transition-all">Latent Space Podcast</Link>
												</p>
												<p>
													Helped Organize <Link href="https://www.ai.engineer/" target="_blank" rel="noopener noreferrer" className="text-primary underline transition-all">AI Engineer Conference</Link>
												</p>
											</div>
										</div>

										{/* Education */}
										<div className="pl-4 border-l-2 border-primary/30">
											<div className="flex items-center space-x-2 mb-2">
												<Terminal size={16} className="text-primary" />
												<h3 className="text-lg font-semibold">Education</h3>
											</div>
											<p className="text-lg text-muted-foreground">
												Michigan State University, <span className="text-primary">Data Science BS</span>
											</p>
										</div>

										{/* Social links */}
										<div className="flex flex-wrap gap-4 mt-6">
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

										</div>
									</div>
								</div>
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