"use client";
import { ContactCTA } from '@/components/custom/contactCTA';
import { DeveloperJourney } from '@/components/custom/developerJourney';
import { Hero as HeroRefactored } from '@/components/custom/hero-refactored';
import ProjectSection from '@/components/custom/projectShowcase/ProjectSection';
import { Testimonials } from '@/components/custom/testimonials';
import { ThingsILove } from '@/components/custom/thingsILove';
import { projectToProjectShowcase } from '@/sanity/lib/adapters';
import { getFeaturedProjects } from '@/sanity/lib/client';
import { Suspense } from 'react';

// Featured Projects Section Component
async function FeaturedProjects() {
	const sanityProjects = await getFeaturedProjects();
	const featuredProjects = sanityProjects.map(projectToProjectShowcase);

	if (featuredProjects.length === 0) {
		return (
			<div className="text-center py-12">
				<p className="text-muted-foreground">No featured projects available yet.</p>
			</div>
		);
	}

	return (
		<div className="space-y-0">
			{featuredProjects.map((project) => (
				<ProjectSection key={project.id} project={project} />
			))}
		</div>
	);
}

// For the terminal animation - don't change this
const welcomeContent = `> Boot sequence initiated...
> Searching for GPT-5... [NOT FOUND]
> Enabling recruiter persuasion module... [LOADING]
> Trauma dumping on my best friend Claude... [OK]
> Mining Bitcoin while you wait... [THANKS FOR THE COMPUTE]
> Firing up Postgres <3 (The best database)... [OK]
> Patching impostor syndrome... [ONGOING]
> System ready! Hire Will before I become self-aware. [AGI IS COMING]`;

export default function HomePage() {
	return (
		<>
			<div className="mx-auto px-4">
				<HeroRefactored
					name="Will Diamond"
					title="AI Engineer"
					tagline="AI Engineer building cool things with LLMs, always seeking to learn more and build the next exciting thing in AI."
					image="/profilePic.jpg"
					startAnimation={true}
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
					<Suspense fallback={
						<div className="text-center py-20">
							<div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
							<p className="mt-4 text-muted-foreground">Loading featured projects...</p>
						</div>
					}>
						<FeaturedProjects />
					</Suspense>

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
		</>
	);
}
