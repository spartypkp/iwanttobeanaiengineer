"use client";
import BlogFeed from '@/components/custom/blogFeed';
import { ContactCTA } from '@/components/custom/contactCTA';
import { DomainExpertise } from '@/components/custom/domainExpertise';
// import { FeaturedProjects } from '@/components/custom/featuredProjects';
import { Hero } from '@/components/custom/hero';

import { TechStack } from '@/components/custom/techStack';
import React from 'react';

const HomePage: React.FC = () => {
	return (
		<div className="max-w-7xl mx-auto px-4">
			{/* Hero Section */}
			<Hero
				name="Will Diamond"
				title="AI Engineer"
				tagline="AI Engineer building cool things with LLMs, always seeking to learn more and build the next exciting thing in AI."
				image="/profilePic.jpg"
			/>

			{/* Domain Expertise Cards */}
			<DomainExpertise />

			{/* Tech Stack */}
			<TechStack />

			{/* Featured Projects */}
			<section className="py-16">
				<h2 className="text-3xl font-bold mb-8">Featured Work</h2>
				{/* <FeaturedProjects
					projects={[
						{
							title: "Information Governance AI",
							company: "Contoural Inc",
							description: "LLM systems helping Fortune 500 companies navigate complex information governance",
							tags: ["Enterprise", "LLMs", "Compliance"]
						},
						{
							title: "Recodify.ai",
							company: "Founder",
							description: "AI-powered platform making legal knowledge accessible",
							tags: ["Legal Tech", "Startups", "NLP"]
						},
						{
							title: "Content Automation",
							company: "Latent Space",
							description: "AI systems for streamlining tech media production",
							tags: ["Media", "Automation", "Content"]
						}
					]}
				/> */}
			</section>

			{/* Blog Section - Now more focused on technical insights */}
			<section className="py-16">
				<h2 className="text-3xl font-bold mb-8">Technical Insights</h2>
				<p className="text-lg mb-8">
					Exploring the intersection of AI engineering and real-world applications.
					Deep dives into LLMs, system architecture, and lessons learned.
				</p>
				<BlogFeed type="daily" />
			</section>


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
	);
};

export default HomePage;
