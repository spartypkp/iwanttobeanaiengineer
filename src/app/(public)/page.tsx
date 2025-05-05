"use client";
import { ContactCTA } from '@/components/custom/homePage/contactCTA';
import { DeveloperJourney } from '@/components/custom/homePage/developerJourney';
import { Hero as HeroRefactored } from '@/components/custom/homePage/hero-refactored';
import { Testimonials } from '@/components/custom/homePage/testimonials';
import { ThingsILove } from '@/components/custom/homePage/thingsILove';
import WelcomeIntro from '@/components/custom/homePage/welcomeIntro';
import ProjectSection from '@/components/custom/projectShowcase/ProjectSection';
import { getFeaturedProjects } from '@/sanity/lib/client';
import { Project } from '@/sanity/sanity.types';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function HomePage() {
	// UI state management
	const [appPhase, setAppPhase] = useState<'terminal' | 'content'>('terminal');
	const [contentVisible, setContentVisible] = useState(false);
	const [startHeroAnimation, setStartHeroAnimation] = useState(false);
	const [showIntro, setShowIntro] = useState(false);

	// Check if user has seen intro before using localStorage
	useEffect(() => {
		// Get URL parameters to allow forcing the intro
		const params = new URLSearchParams(window.location.search);
		const forceIntro = params.get('intro') === 'true';

		// Only run this on the client side
		if (typeof window !== 'undefined') {
			const hasSeenIntro = localStorage.getItem('hasSeenIntro');

			if (forceIntro || !hasSeenIntro) {
				// Show terminal for first-time visitors or when forced
				setAppPhase('terminal');
				setShowIntro(true);

				// Only set the flag if this is a genuine first visit
				if (!hasSeenIntro) {
					localStorage.setItem('hasSeenIntro', 'true');
				}
			} else {
				// Skip terminal for returning visitors
				setAppPhase('content');
				setContentVisible(true);
				setStartHeroAnimation(true);
			}
		}
	}, []);

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

	// Handler for when the intro animation completes
	const handleIntroComplete = () => {
		console.log('Intro animation complete, transitioning to content phase');
		setAppPhase('content');
		setShowIntro(false);
	};

	const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const loadProjects = async () => {
			try {
				const projects = await getFeaturedProjects();


				// Sort projects by _id field
				const sortedProjects = [...projects].sort((a, b) => {
					//console.log(`Comparing: ${a.id} vs ${b.id}`);
					return a.id!.localeCompare(b.id!);
				});



				setFeaturedProjects(sortedProjects);
			} catch (error) {
				console.error("Error loading projects:", error);
			} finally {
				setIsLoading(false);
			}
		};

		loadProjects();
	}, []);

	return (
		<>
			{showIntro ? (
				<WelcomeIntro
					onComplete={handleIntroComplete}
					theme="default"
					typeSpeed={8}
				/>
			) : (
				<div className="mx-auto px-4">
					{/* Welcome intro component with enhanced features */}


					<HeroRefactored
						name="Will Diamond"
						title="AI Engineer"
						tagline="Building cool things with LLMs, always seeking to learn more and build the next exciting thing in AI."
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
										<span className="h-1.5 w-1.5 rounded-full bg-primary/30"></span>
										<span>read</span>
									</div>
								</div>
							</div>
						</div>

						{/* Projects Container */}
						{isLoading ? (
							<div className="text-center py-20">
								<div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
								<p className="mt-4 text-muted-foreground">Loading featured projects...</p>
							</div>
						) : featuredProjects.length === 0 ? (
							<div className="text-center py-12">
								<p className="text-muted-foreground">No featured projects available yet.</p>
							</div>
						) : (
							<div className="space-y-0">
								{featuredProjects.map((project) => (
									<ProjectSection key={project._id} project={project} />
								))}
							</div>
						)}

						{/* Terminal-inspired ending */}
						<div className="w-full max-w-6xl mx-auto mt-16 mb-16">
							<div className="bg-zinc-900 border border-primary/20 rounded-md px-4 py-3 font-mono text-xs shadow-[0_0_30px_rgba(var(--primary-rgb),0.1)]">
								<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
									<div className="flex items-center">
										<span className="text-primary/80 mr-2">$</span>
										<span className="text-primary/60">cd ~/projects</span>
										<span className="ml-2 animate-pulse-slow">▌</span>
									</div>

									<div className="flex items-center justify-between">
										<div className="flex items-center">
											<Link
												href="/projects"
												className="relative group px-4 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 rounded flex items-center gap-2 transition-all duration-300 hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)]"

											>
												<span className="text-xs font-mono">VIEW ALL PROJECTS</span>
												<svg
													width="12"
													height="12"
													viewBox="0 0 12 12"
													fill="none"
													xmlns="http://www.w3.org/2000/svg"
													className="transform transition-transform duration-300 group-hover:translate-x-0.5"
												>
													<path d="M1 6H11M11 6L6 1M11 6L6 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
												</svg>
												<span className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 rounded transition-opacity duration-300"></span>
											</Link>
										</div>

										<div className="md:ml-4 flex items-center gap-2 text-[10px] text-primary/40">
											<span>portfolio@main</span>
											<span className="h-1.5 w-1.5 rounded-full bg-primary/30"></span>
											<span>{new Date().toISOString().slice(0, 10)}</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</section>

					{/* Section divider with terminal styling */}
					<div className="w-full max-w-md mx-auto mb-12 flex items-center gap-3">
						<div className="h-px bg-primary/20 flex-grow"></div>
						<div className="text-xs font-mono text-primary/40 px-2 py-1 border border-primary/10 rounded">favorites</div>
						<div className="h-px bg-primary/20 flex-grow"></div>
					</div>

					{/* Things I Love Section Header */}
					<div className="mb-12 text-center">
						<h2 className="text-4xl font-bold mb-4">Things I <span className="text-primary">❤️</span></h2>
						<p className="text-xl text-muted-foreground max-w-3xl mx-auto">
							Technologies and tools I&apos;m genuinely passionate about
						</p>
					</div>

					{/* Things I Love Section */}
					<ThingsILove />

					{/* Section divider with terminal styling */}
					<div className="w-full max-w-md mx-auto mb-12 flex items-center gap-3">
						<div className="h-px bg-primary/20 flex-grow"></div>
						<div className="text-xs font-mono text-primary/40 px-2 py-1 border border-primary/10 rounded">journey</div>
						<div className="h-px bg-primary/20 flex-grow"></div>
					</div>

					{/* Things I Love Section Header */}
					<div className="mb-12 text-center">
						<h2 className="text-4xl font-bold mb-4">My Journey</h2>
						<p className="text-xl text-muted-foreground max-w-3xl mx-auto">
							How I got here, and where I&apos;m going
						</p>
					</div>

					{/* Developer Journey */}
					<DeveloperJourney />

					{/* Testimonials Section */}
					<Testimonials />

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

			)}


		</>
	);
}
