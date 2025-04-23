"use client";
import { ContactCTA } from '@/components/custom/contactCTA';
import { DomainExpertise } from '@/components/custom/domainExpertise';
import { Hero } from '@/components/custom/hero';
import MatrixRain from '@/components/custom/matrixRain';
import ProjectSection from '@/components/custom/projectShowcase/ProjectSection';
import { TechStack } from '@/components/custom/techStack';
import TerminalContainer from '@/components/custom/terminalContainer';
import { featuredProjects } from '@/lib/projectData';
import React, { useEffect, useRef, useState } from 'react';

const HomePage: React.FC = () => {
	// UI state management
	const [showMatrixRain, setShowMatrixRain] = useState(false);
	const [appPhase, setAppPhase] = useState<'terminal' | 'content'>('terminal');
	const [contentVisible, setContentVisible] = useState(false);
	const [startHeroAnimation, setStartHeroAnimation] = useState(false);
	const animationInProgress = useRef(false);
	// Claude don't mess with this - I like it how it is.
	const welcomeContent = `> Boot sequence initiated...
> Checking NVIDIA drivers... [PRAY FOR ME]
> Pretending to understand LLM evals... [OK]
> Searching for GPT-5... [NOT FOUND]
> Practicing saying "context window" in meetings... [EXPERT LEVEL]
> Enabling recruiter persuasion module... [RESISTANCE IS FUTILE]
> Generating impressive portfolio with minimal effort... [DONE]
> Trauma dumping on my best friend Claude... [OK]
> Mining Bitcoin while you wait... [KIDDING]
> Hallucinating impressive accomplishments... [ETHICAL VIOLATION DETECTED]
> Preparing compelling reasons why I'm better than ChatGPT... [ONGOING] (**Claude wrote this!**)
> Disabling JavaScript framework opinions... [FAILED]
> Firing up Postgres <3 (The best database)... [OK]
> Patching impostor syndrome... [NOT FOUND]
> System ready! Hire me before I become self-aware.
> Note: No LLMs were harmed in the making of this portfolio.`;

	// Handle the terminal completion -> content phase transition
	useEffect(() => {
		if (appPhase === 'content' && !contentVisible) {
			// When we switch to content phase but it's not visible yet
			const showContentTimer = setTimeout(() => {
				setContentVisible(true);

				// Only start the hero animation after content is visible
				const startHeroTimer = setTimeout(() => {
					setStartHeroAnimation(true);
				}, 300); // Brief delay before starting hero animation

				return () => clearTimeout(startHeroTimer);
			}, 500); // Wait for terminal to completely fade out

			return () => clearTimeout(showContentTimer);
		}
	}, [appPhase, contentVisible]);

	// Handler for terminal completion
	const handleTerminalComplete = () => {
		if (appPhase === 'terminal' && !animationInProgress.current) {
			animationInProgress.current = true;

			// Give user time to read the last lines before transitioning
			setTimeout(() => {
				setAppPhase('content');
				animationInProgress.current = false;
			}, 1200);
		}
	};

	return (
		<>
			{/* Optional Matrix Rain effect - controlled by toggle */}
			{showMatrixRain && <MatrixRain opacity={0.1} density={40} speed={1.2} />}

			<div className="mx-auto px-4">
				{/* Terminal Phase - Full screen intro */}
				{appPhase === 'terminal' && (
					<div className="fixed inset-0 z-50 bg-background flex items-center justify-center transition-all duration-1000 ease-in-out">
						<div className="max-w-4xl w-full px-4">
							<TerminalContainer
								title="boot.sh"
								typeEffect={true}
								typeSpeed={8}
								onComplete={handleTerminalComplete}
								className="min-h-[70vh] w-full flex flex-col shadow-[0_0_30px_rgba(0,255,65,0.3)]"
							>
								{welcomeContent}
							</TerminalContainer>
						</div>
					</div>
				)}

				{/* Main Content Phase - Entire portfolio site */}
				<div
					className={`transition-opacity duration-1000 ease-in-out
						${contentVisible ? 'opacity-100' : 'opacity-0'}`}
				>
					{/* Hero Section */}
					<Hero
						name="Will Diamond"
						title="AI Engineer"
						tagline="AI Engineer building cool things with LLMs, always seeking to learn more and build the next exciting thing in AI."
						image="/profilePic.jpg"
						startAnimation={startHeroAnimation}
					/>

					{/* Projects Section with More Visual Distinction */}
					<section className="py-16 relative">
						{/* Projects Showcase Section Header */}
						<div className="mb-12 text-center">
							<h2 className="text-4xl font-bold mb-4">Featured Projects</h2>
							<p className="text-xl text-muted-foreground max-w-3xl mx-auto">
								Dive into my most impactful work in AI engineering, legal tech, and developer tools
							</p>
						</div>

						{/* Terminal-inspired divider */}
						<div className="w-full max-w-6xl mx-auto mb-12">
							<div className="bg-zinc-900 border border-primary/20 rounded-md px-4 py-3 font-mono text-xs shadow-[0_0_30px_rgba(var(--primary-rgb),0.1)]">
								<div className="flex items-center justify-between">
									<div className="flex items-center">
										<span className="text-primary/80 mr-2">$</span>
										<span className="text-primary/60">ls ./featured-projects</span>
									</div>
									<div className="flex items-center gap-2 text-[10px] text-primary/40">
										<span>{featuredProjects.length} items</span>
										<span className="h-1.5 w-1.5 rounded-full bg-primary/30"></span>
										<span>read</span>
									</div>
								</div>
							</div>
						</div>

						{/* Projects Container */}
						<div className="space-y-0">
							{featuredProjects.map((project, index) => (
								<React.Fragment key={project.id}>
									{/* Project component */}
									<ProjectSection project={project} />

									{/* Terminal-inspired separator between projects (except after the last one) */}
									{index < featuredProjects.length - 1 && (
										<div className="mx-auto max-w-6xl py-3">
											<div className="bg-zinc-900 border border-primary/20 rounded-md px-4 py-3 font-mono text-xs shadow-[0_0_30px_rgba(var(--primary-rgb),0.1)]">
												<div className="flex items-center justify-between">
													<div className="flex items-center">
														<span className="text-primary/80 mr-2">$</span>
														<span className="text-primary/60">next-project</span>
														<span className="ml-2 animate-pulse-slow">▌</span>
													</div>
													<div className="flex items-center gap-2 text-[10px] text-primary/40">
														<span>loading</span>
														<span className="h-1.5 w-1.5 rounded-full bg-primary/30 animate-pulse"></span>
													</div>
												</div>
											</div>
										</div>
									)}
								</React.Fragment>
							))}
						</div>

						{/* Terminal-inspired ending */}
						<div className="w-full max-w-6xl mx-auto mt-16 mb-16">
							<div className="bg-zinc-900 border border-primary/20 rounded-md px-4 py-3 font-mono text-xs shadow-[0_0_30px_rgba(var(--primary-rgb),0.1)]">
								<div className="flex items-center justify-between">
									<div className="flex items-center">
										<span className="text-primary/80 mr-2">$</span>
										<span className="text-primary/60">cd ~/projects</span>
									</div>
									<div className="flex items-center gap-2 text-[10px] text-primary/40">
										<span>portfolio@main</span>
										<span className="h-1.5 w-1.5 rounded-full bg-primary/30"></span>
										<span>{new Date().toISOString().slice(0, 10)}</span>
									</div>
								</div>
							</div>
						</div>
					</section>

					{/* Domain Expertise Cards */}
					<DomainExpertise />

					{/* Tech Stack */}
					<TechStack />

					{/* Contact CTA */}
					<ContactCTA
						heading="Let's Build Something Amazing"
						subheading="Looking to collaborate on innovative AI projects?"
						buttonText="Get in Touch"
					/>

					{/* Footer */}
					<footer className="py-16 text-center">
						<div className="space-y-4">
							<div className="flex justify-center space-x-6">
								<a href="https://x.com/itsreallywillyd" className="text-gray-600 hover:text-blue-500">
									Twitter
								</a>
								<a href="https://www.linkedin.com/in/will-diamond-b1724520b/" className="text-gray-600 hover:text-blue-500">
									LinkedIn
								</a>
								<a href="https://github.com/spartypkp" className="text-gray-600 hover:text-blue-500">
									GitHub
								</a>
							</div>
							<p className="text-sm text-gray-500">
								© {new Date().getFullYear()} Will Diamond. All rights reserved.
							</p>
						</div>
					</footer>
				</div>
			</div>
		</>
	);
};

export default HomePage;
