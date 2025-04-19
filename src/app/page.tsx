"use client";
import { ContactCTA } from '@/components/custom/contactCTA';
import { DomainExpertise } from '@/components/custom/domainExpertise';
import InteractiveTerminal from '@/components/custom/InteractiveTerminal';
import MinimalHero from '@/components/custom/MinimalHero';
import ProjectCarousel from '@/components/custom/projectShowcase/ProjectCarousel';
import { TechStack } from '@/components/custom/techStack';
import { featuredProjects } from '@/lib/projectData';
import React, { useState } from 'react';

const HomePage: React.FC = () => {
	// UI state management
	const [showMatrixRain, setShowMatrixRain] = useState(false);
	const [terminalExpanded, setTerminalExpanded] = useState(true);

	const toggleTerminal = () => {
		setTerminalExpanded(prev => !prev);
	};

	return (
		<>
			<div className="mx-auto px-4 max-w-6xl">
				{/* Interactive Terminal - Primary interface */}
				<div className="mt-8 mb-6">
					<InteractiveTerminal
						expanded={terminalExpanded}
						onToggleExpand={toggleTerminal}
					/>
				</div>

				{/* Minimal Hero Section */}
				<div id="about-section">
					<MinimalHero
						name="Will Diamond"
						title="AI Engineer"
						image="/profilePic.jpg"
					/>
				</div>

				{/* Projects Showcase Section */}
				<div id="projects-section" className="mt-12 mb-8">
					<h2 className="text-3xl font-bold mb-4">Featured Projects</h2>
					<p className="text-xl text-muted-foreground max-w-3xl">
						Dive into my most impactful work in AI engineering, legal tech, and developer tools
					</p>
					<div className="mt-6">
						<ProjectCarousel projects={featuredProjects} transitionEffect="slide" />
					</div>
				</div>

				{/* Skills Section */}
				<div id="skills-section" className="mt-16">
					<TechStack />
				</div>

				{/* Domain Expertise Cards */}
				<div className="mt-16">
					<DomainExpertise />
				</div>

				{/* Contact CTA */}
				<div id="contact-section">
					<ContactCTA
						heading="Let's Build Something Amazing"
						subheading="Looking to collaborate on innovative AI projects?"
						buttonText="Get in Touch"
					/>
				</div>

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
};

export default HomePage;
