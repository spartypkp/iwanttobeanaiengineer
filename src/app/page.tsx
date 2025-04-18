"use client";
import { ContactCTA } from '@/components/custom/contactCTA';
import { DomainExpertise } from '@/components/custom/domainExpertise';
import { Hero } from '@/components/custom/hero';
import MatrixRain from '@/components/custom/matrixRain';
import ProjectCarousel from '@/components/custom/projectShowcase/ProjectCarousel';
import { TechStack } from '@/components/custom/techStack';
import TerminalContainer from '@/components/custom/terminalContainer';
import { featuredProjects } from '@/lib/projectData';
import React, { useState } from 'react';

const HomePage: React.FC = () => {
	const [showMatrixRain, setShowMatrixRain] = useState(false);

	return (
		<>
			{/* Optional Matrix Rain effect - controlled by toggle */}
			{showMatrixRain && <MatrixRain opacity={0.1} density={40} speed={1.2} />}

			<div className="mx-auto px-4">
				{/* Theme Toggle */}
				{/* <div className="fixed bottom-5 right-5 z-50">
					<MatrixButton
						variant="terminal"
						size="sm"
						onClick={() => setShowMatrixRain(!showMatrixRain)}
						glowIntensity="high"
					>
						{showMatrixRain ? 'Disable Matrix' : 'Enable Matrix'}
					</MatrixButton>
				</div> */}

				{/* Terminal Welcome Message */}
				<div className="max-w-7xl mx-auto mb-10 pt-6">
					<TerminalContainer title="welcome.sh" typeEffect={true}>
						Hello, I'm Will Diamond. An AI Engineer with a passion for building the future.
					</TerminalContainer>
				</div>

				{/* Hero Section */}
				<Hero
					name="Will Diamond"
					title="AI Engineer"
					tagline="AI Engineer building cool things with LLMs, always seeking to learn more and build the next exciting thing in AI."
					image="/profilePic.jpg"
				/>

				{/* Projects Showcase Section Header */}
				<div className="mt-16 mb-8 text-center">
					<h2 className="text-4xl font-bold mb-4">Featured Projects</h2>
					<p className="text-xl text-muted-foreground max-w-3xl mx-auto">
						Dive into my most impactful work in AI engineering, legal tech, and developer tools
					</p>
				</div>

				{/* Immersive Project Showcase - Always visible */}
				<ProjectCarousel projects={featuredProjects} transitionEffect="slide" />


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
		</>
	);
};

export default HomePage;
