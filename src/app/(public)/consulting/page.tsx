"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, FileBadge, Terminal } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Metadata } from "next";

// Note: metadata export doesn't work in client components
// This metadata is for documentation - actual metadata is in parent layout
// TODO: Consider converting to Server Component if metadata is critical

export default function ConsultingPage() {
	return (
		<main className="mx-auto w-full max-w-4xl px-4 md:px-6 lg:px-8 space-y-24 py-16">
			{/* Hero Section */}
			<section className="space-y-6">
				{/* Terminal window chrome */}
				<div className="mx-auto max-w-4xl shadow-[0_0_60px_rgba(var(--primary-rgb),0.1)] rounded-xl overflow-hidden">
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
								<span>./consulting — services.sh</span>
							</div>
						</div>

						{/* Status indicator */}
						<div className="text-xs font-mono bg-black/30 px-2 py-0.5 rounded-sm border border-primary/10 flex items-center">
							<span className="inline-block h-1.5 w-1.5 rounded-full bg-green-500 mr-1.5 animate-pulse"></span>
							<FileBadge size={10} className="text-primary/60 mr-1" />
							<span className="uppercase text-[10px]">ACCEPTING CLIENTS</span>
						</div>
					</div>

					{/* Terminal content area */}
					<div className="bg-zinc-900/90 backdrop-blur-sm border-x border-b border-primary/20">
						<div className="bg-background/90 p-6 md:p-8">
							{/* Terminal prompt */}
							<div className="font-mono text-sm text-primary/70 mb-4">
								<span className="text-primary/80">$</span> cat ./services/consulting.md
							</div>

							<h1 className="text-4xl md:text-5xl font-bold mb-4">AI Consulting for Regulated Industries</h1>
							<p className="text-xl text-muted-foreground max-w-2xl mb-6">
								I help companies in legal, compliance, finance, and other regulated industries build AI systems that work in production while meeting regulatory requirements. From finding the right opportunities to deploying trusted systems, I handle both the strategy and the implementation.
							</p>

							{/* Status badge */}
							<div className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 bg-primary/10 border border-primary/30 rounded text-sm">
								<CheckCircle2 size={14} className="text-primary" />
								<span className="text-primary font-medium">Currently accepting clients for Q4 2025 and Q1 2026</span>
							</div>

							<div className="pt-4">
								<Link href="https://calendly.com/willdiamond3/30min" target="_blank" rel="noopener noreferrer">
									<Button
										size="lg"
										className="bg-primary hover:bg-primary/90 shadow-[0_0_25px_rgba(var(--primary-rgb),0.2)] transition-all duration-300 hover:shadow-[0_0_35px_rgba(var(--primary-rgb),0.3)] hover:translate-y-[-2px]"
									>
										Schedule Discovery Call
									</Button>
								</Link>
							</div>
						</div>

						{/* Terminal footer */}
						<div className="px-4 py-2 bg-zinc-900 border-t border-primary/10">
							<div className="font-mono text-xs flex items-center text-primary/60">
								<span className="text-primary/80 mr-2">$</span>
								<span className="animate-pulse-slow">▌</span>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Section divider */}
			<div className="w-full max-w-md mx-auto flex items-center gap-3">
				<div className="h-px bg-primary/20 flex-grow"></div>
				<div className="text-xs font-mono text-primary/40 px-2 py-1 border border-primary/10 rounded">select_work</div>
				<div className="h-px bg-primary/20 flex-grow"></div>
			</div>

			{/* Social Proof - Client Logos */}
			<section className="space-y-6">
				<h2 className="text-2xl font-bold text-center text-muted-foreground">Select Work</h2>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
					<div className="space-y-1">
						<div className="font-bold text-lg">Contoural</div>
						<div className="text-sm text-muted-foreground">Info Governance Consulting</div>
						<div className="text-xs text-muted-foreground/70">2 years, sole AI engineer</div>
					</div>
					<div className="space-y-1">
						<div className="font-bold text-lg">Roman AI</div>
						<div className="text-sm text-muted-foreground">A16Z-backed, Private Equity</div>
						<div className="text-xs text-muted-foreground/70">Strategic AI advisory</div>
					</div>
					<div className="space-y-1">
						<div className="font-bold text-lg">Campaign Guardian</div>
						<div className="text-sm text-muted-foreground">Campaign Finance</div>
						<div className="text-xs text-muted-foreground/70">Compliance automation</div>
					</div>
				</div>
			</section>

			{/* Section divider */}
			<div className="w-full max-w-md mx-auto flex items-center gap-3">
				<div className="h-px bg-primary/20 flex-grow"></div>
				<div className="text-xs font-mono text-primary/40 px-2 py-1 border border-primary/10 rounded">case_study</div>
				<div className="h-px bg-primary/20 flex-grow"></div>
			</div>

			{/* Contoural Case Study */}
			<section className="space-y-8">
				<h2 className="text-3xl font-bold">Case Study: Contoural</h2>

				{/* Terminal window for case study */}
				<div className="shadow-[0_0_60px_rgba(var(--primary-rgb),0.12)] rounded-xl overflow-hidden">
					{/* Terminal header */}
					<div className="bg-zinc-900 border-b border-primary/20 flex items-center justify-between px-4 py-2.5">
						<div className="flex items-center gap-4">
							<div className="flex items-center space-x-1.5">
								<div className="h-3 w-3 rounded-full bg-red-500"></div>
								<div className="h-3 w-3 rounded-full bg-yellow-500"></div>
								<div className="h-3 w-3 rounded-full bg-green-500"></div>
							</div>
							<div className="text-xs text-primary/70 font-mono flex items-center">
								<Terminal size={11} className="mr-1.5" />
								<span>contoural_case_study.md</span>
							</div>
						</div>
						<div className="text-xs font-mono bg-black/30 px-2 py-0.5 rounded-sm border border-primary/10 flex items-center">
							<span className="inline-block h-1.5 w-1.5 rounded-full bg-blue-500 mr-1.5"></span>
							<FileBadge size={10} className="text-primary/60 mr-1" />
							<span className="uppercase text-[10px]">COMPLETED</span>
						</div>
					</div>

					{/* Terminal content */}
					<div className="bg-zinc-900/90 backdrop-blur-sm border-x border-b border-primary/20">
						<div className="bg-background/90 p-6 md:p-8 space-y-6">
						<div>
							<h3 className="text-2xl font-bold mb-2">2 Years as Sole AI Engineer</h3>
							<p className="text-lg text-muted-foreground mb-2">
								Contoural is the largest independent provider of information governance, privacy, and AI governance consulting—serving over 30% of the Fortune 500.
							</p>
							<p className="text-muted-foreground">
								I built production AI systems that their consultants used to analyze client documents, handle attorney-client privileged data, and deliver faster, more consistent results for Fortune 500 clients.
							</p>
						</div>

						<div className="space-y-4 border-l-2 border-primary/20 pl-4">
							<div>
								<p className="font-semibold text-foreground mb-2">The Challenge</p>
								<p className="text-muted-foreground">
									Contoural&apos;s consultants spent hours manually analyzing complex legal and regulatory documents for Fortune 500 clients. The firm billed time-and-materials for this work, but the process was slow and varied between consultants. They needed automation that would meet enterprise client expectations for accuracy, auditability, and data security.
								</p>
							</div>

							<div>
								<p className="font-semibold text-foreground mb-2">How I Found The Opportunity</p>
								<p className="text-muted-foreground">
									I shadowed consultants doing their actual work. I watched two senior consultants analyze the same type of document completely differently—one took 4 hours, the other 90 minutes. That inconsistency revealed the opportunity. I interviewed both, mapped their approaches, and identified patterns that could be systematized while maintaining the judgment clients paid for.
								</p>
							</div>

							<div>
								<p className="font-semibold text-foreground mb-2">What I Built</p>
								<p className="text-muted-foreground mb-2">
									AI systems designed for consultants serving Fortune 500 clients:
								</p>
								<ul className="text-sm text-muted-foreground space-y-1 ml-4">
									<li>• Complete audit trails linking every AI output to source documents</li>
									<li>• Explainability so consultants could verify and defend recommendations to clients</li>
									<li>• Security architecture appropriate for attorney-client privileged and sensitive corporate data</li>
									<li>• Edge case detection—the system flagged uncertainty rather than guessing</li>
									<li>• Production deployment handling thousands of enterprise client documents</li>
								</ul>
							</div>

							<div>
								<p className="font-semibold text-foreground mb-2">The Result</p>
								<p className="text-muted-foreground mb-3">
									<strong className="text-foreground">75% reduction in analysis time</strong> for core service offerings. Work that took consultants 2-4 hours could be completed in 30-60 minutes while maintaining quality.
								</p>
								<p className="text-muted-foreground">
									The real validation: Contoural changed their billing model for this service from time-and-materials to project-based pricing. They trusted the system enough to bet revenue on consistent delivery times. When a consulting firm serving Fortune 500 clients stakes their business model on your AI, you know it works.
								</p>
							</div>
						</div>

							<div className="pt-4 border-t border-border">
								<p className="text-sm text-muted-foreground italic">
									Built and maintained as a team of one, handling production workloads for enterprise clients across multiple service lines.
								</p>
							</div>
						</div>

						{/* Terminal footer */}
						<div className="px-4 py-2 bg-zinc-900 border-t border-primary/10">
							<div className="font-mono text-xs flex items-center text-primary/60">
								<span className="text-primary/80 mr-2">$</span>
								<span>cat ./impact_metrics.txt</span>
							</div>
						</div>
					</div>
				</div>

				<div className="pt-4">
					<h3 className="text-xl font-semibold mb-3">Other Work</h3>
					<div className="space-y-4">
						<div className="border-l-2 border-primary/20 pl-4">
							<p className="font-semibold text-foreground mb-1">Roman AI (A16Z-backed, Private Equity)</p>
							<p className="text-sm text-muted-foreground">
								Strategic AI advisory for healthcare compliance automation in the private equity space. Early-stage engagement helping define technical approach and evaluate feasibility for HIPAA-compliant AI systems. Advised on architecture, model selection, and go-to-market for regulated industries.
							</p>
						</div>
						<div className="border-l-2 border-primary/20 pl-4">
							<p className="font-semibold text-foreground mb-1">Campaign Guardian</p>
							<p className="text-sm text-muted-foreground">
								Campaign finance compliance automation - another heavily regulated industry where mistakes have legal consequences. Built systems handling state-specific compliance rules and automated reporting workflows.
							</p>
						</div>
						<div className="border-l-2 border-primary/20 pl-4">
							<p className="font-semibold text-foreground mb-1">Texas Hold LLM</p>
							<p className="text-sm text-muted-foreground">
								Personal project demonstrating multi-agent AI coordination. Built poker-playing agents with strategic reasoning, bluffing, and opponent modeling. Shows capability with complex agent systems beyond production consulting work.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Section divider */}
			<div className="w-full max-w-md mx-auto flex items-center gap-3">
				<div className="h-px bg-primary/20 flex-grow"></div>
				<div className="text-xs font-mono text-primary/40 px-2 py-1 border border-primary/10 rounded">regulated_industries</div>
				<div className="h-px bg-primary/20 flex-grow"></div>
			</div>

			{/* What Makes Regulated Industries Different */}
			<section className="space-y-6">
				<h2 className="text-3xl font-bold">What Makes Regulated Industries Different</h2>
				<div className="space-y-4 text-muted-foreground max-w-2xl">
					<p className="text-lg">
						AI in regulated industries requires more than technical excellence. You need systems that satisfy compliance officers, pass audit review, and maintain trust with legal and regulatory stakeholders.
					</p>
					<p>
						I&apos;ve built production AI systems where explainability, audit trails, and data privacy weren&apos;t nice-to-haves—they were requirements from day one.
					</p>
				</div>
				<div className="grid md:grid-cols-3 gap-6 pt-6">
					<Card className="bg-zinc-900/80 border-primary/20 shadow-[0_0_30px_rgba(var(--primary-rgb),0.08)] hover:shadow-[0_0_40px_rgba(var(--primary-rgb),0.12)] transition-all duration-300">
						<CardContent className="pt-6">
							<h3 className="font-bold mb-2 text-primary">Built for Auditability</h3>
							<p className="text-sm text-muted-foreground">Every AI decision is traceable and explainable. Compliance teams can verify reasoning and maintain audit trails for regulatory review.</p>
						</CardContent>
					</Card>
					<Card className="bg-zinc-900/80 border-primary/20 shadow-[0_0_30px_rgba(var(--primary-rgb),0.08)] hover:shadow-[0_0_40px_rgba(var(--primary-rgb),0.12)] transition-all duration-300">
						<CardContent className="pt-6">
							<h3 className="font-bold mb-2 text-primary">You Own Everything</h3>
							<p className="text-sm text-muted-foreground">No vendor lock-in. Full source code, documentation, and knowledge transfer. Your team maintains and extends the systems independently.</p>
						</CardContent>
					</Card>
					<Card className="bg-zinc-900/80 border-primary/20 shadow-[0_0_30px_rgba(var(--primary-rgb),0.08)] hover:shadow-[0_0_40px_rgba(var(--primary-rgb),0.12)] transition-all duration-300">
						<CardContent className="pt-6">
							<h3 className="font-bold mb-2 text-primary">Compliance-First Architecture</h3>
							<p className="text-sm text-muted-foreground">Security, privacy, and regulatory requirements inform design decisions from the start—not retrofitted after the fact.</p>
						</CardContent>
					</Card>
				</div>
			</section>

			{/* Section divider */}
			<div className="w-full max-w-md mx-auto flex items-center gap-3">
				<div className="h-px bg-primary/20 flex-grow"></div>
				<div className="text-xs font-mono text-primary/40 px-2 py-1 border border-primary/10 rounded">capabilities</div>
				<div className="h-px bg-primary/20 flex-grow"></div>
			</div>

			{/* Core Capabilities */}
			<section className="space-y-8">
				<h2 className="text-3xl font-bold">What I Do</h2>

				<div className="space-y-6">
					<div>
						<h3 className="text-xl font-bold mb-2">Find the Right Opportunities</h3>
						<p className="text-muted-foreground">
							Shadow your team. Watch actual work happen. Find gaps between what people say and what they do. Interview at all levels to identify where AI creates real value versus where it adds complexity.
						</p>
					</div>

					<div>
						<h3 className="text-xl font-bold mb-2">Prototype Fast</h3>
						<p className="text-muted-foreground">
							Build working prototypes in days. Test with real users and real data. Validate technical feasibility and business impact before committing to full implementation.
						</p>
					</div>

					<div>
						<h3 className="text-xl font-bold mb-2">Build for Compliance</h3>
						<p className="text-muted-foreground">
							Design systems that pass audit review. Full audit trails, explainability for every decision, security architecture for sensitive data. HIPAA, SOC2, attorney-client privilege handled from the start.
						</p>
					</div>

					<div>
						<h3 className="text-xl font-bold mb-2">Deploy to Production</h3>
						<p className="text-muted-foreground">
							Ship reliable systems. Systematic prompt engineering, evaluation frameworks, monitoring for production environments. Built to handle real workloads, not just demos.
						</p>
					</div>

					<div>
						<h3 className="text-xl font-bold mb-2">Transfer Knowledge</h3>
						<p className="text-muted-foreground">
							Train your team to own and extend the systems. Full documentation, pair programming sessions, no black boxes. You maintain and improve the AI independently after the engagement ends.
						</p>
					</div>
				</div>
			</section>

			{/* Section divider */}
			<div className="w-full max-w-md mx-auto flex items-center gap-3">
				<div className="h-px bg-primary/20 flex-grow"></div>
				<div className="text-xs font-mono text-primary/40 px-2 py-1 border border-primary/10 rounded">process</div>
				<div className="h-px bg-primary/20 flex-grow"></div>
			</div>

			{/* Process */}
			<section className="space-y-6">
				<h2 className="text-3xl font-bold">How We Work Together</h2>
				<div className="grid md:grid-cols-4 gap-6">
					<div className="space-y-2">
						<div className="font-semibold text-lg">1. Discovery Call</div>
						<p className="text-sm text-muted-foreground">30 min, free. Understand your challenges, see if there&apos;s a fit.</p>
					</div>
					<div className="space-y-2">
						<div className="font-semibold text-lg">2. Proposal</div>
						<p className="text-sm text-muted-foreground">Clear scope, deliverables, pricing, timeline. No surprises.</p>
					</div>
					<div className="space-y-2">
						<div className="font-semibold text-lg">3. Work</div>
						<p className="text-sm text-muted-foreground">Weekly check-ins, iterative progress, transparent updates.</p>
					</div>
					<div className="space-y-2">
						<div className="font-semibold text-lg">4. Handoff</div>
						<p className="text-sm text-muted-foreground">Full documentation, knowledge transfer, training. You own everything.</p>
					</div>
				</div>
			</section>

			{/* Section divider */}
			<div className="w-full max-w-md mx-auto flex items-center gap-3">
				<div className="h-px bg-primary/20 flex-grow"></div>
				<div className="text-xs font-mono text-primary/40 px-2 py-1 border border-primary/10 rounded">pricing</div>
				<div className="h-px bg-primary/20 flex-grow"></div>
			</div>

			{/* Pricing */}
			<section className="space-y-8">
				<h2 className="text-3xl font-bold">Investment Options</h2>

				{/* Discovery Assessment */}
				<div className="shadow-[0_0_40px_rgba(var(--primary-rgb),0.1)] rounded-xl overflow-hidden">
					<div className="bg-zinc-900 border-b border-primary/20 flex items-center justify-between px-4 py-2.5">
						<div className="flex items-center gap-4">
							<div className="flex items-center space-x-1.5">
								<div className="h-3 w-3 rounded-full bg-red-500"></div>
								<div className="h-3 w-3 rounded-full bg-yellow-500"></div>
								<div className="h-3 w-3 rounded-full bg-green-500"></div>
							</div>
							<div className="text-xs text-primary/70 font-mono flex items-center">
								<Terminal size={11} className="mr-1.5" />
								<span>./pricing/discovery.sh</span>
							</div>
						</div>
						<div className="text-xs font-mono text-primary/60">$8k - $12k • 3-4 weeks</div>
					</div>
					<div className="bg-zinc-900/90 backdrop-blur-sm border-x border-b border-primary/20">
						<div className="bg-background/90 p-6 space-y-4">
							<h3 className="text-xl font-bold">Discovery Assessment</h3>
							<p className="text-muted-foreground">
								Interview your team, observe actual workflows, identify AI opportunities with ROI projections. Low risk way to validate AI makes sense for your business before committing to full implementation.
							</p>
							<p className="text-sm text-muted-foreground italic">Deliverable: Assessment report + presentation + roadmap</p>
						</div>
					</div>
				</div>

				{/* Implementation Project */}
				<div className="shadow-[0_0_40px_rgba(var(--primary-rgb),0.1)] rounded-xl overflow-hidden">
					<div className="bg-zinc-900 border-b border-primary/20 flex items-center justify-between px-4 py-2.5">
						<div className="flex items-center gap-4">
							<div className="flex items-center space-x-1.5">
								<div className="h-3 w-3 rounded-full bg-red-500"></div>
								<div className="h-3 w-3 rounded-full bg-yellow-500"></div>
								<div className="h-3 w-3 rounded-full bg-green-500"></div>
							</div>
							<div className="text-xs text-primary/70 font-mono flex items-center">
								<Terminal size={11} className="mr-1.5" />
								<span>./pricing/implementation.sh</span>
							</div>
						</div>
						<div className="text-xs font-mono text-primary/60">$10k - $15k • 4-6 weeks</div>
					</div>
					<div className="bg-zinc-900/90 backdrop-blur-sm border-x border-b border-primary/20">
						<div className="bg-background/90 p-6 space-y-4">
							<h3 className="text-xl font-bold">Implementation Project</h3>
							<p className="text-muted-foreground">
								Build 1-2 working AI systems. Ensure compliance, train your team, document everything. You get production-ready tools and the knowledge to maintain them.
							</p>
							<p className="text-sm text-muted-foreground italic">Deliverable: Working tools + full documentation + trained team</p>
						</div>
					</div>
				</div>

				{/* Ongoing Partnership */}
				<div className="shadow-[0_0_40px_rgba(var(--primary-rgb),0.1)] rounded-xl overflow-hidden">
					<div className="bg-zinc-900 border-b border-primary/20 flex items-center justify-between px-4 py-2.5">
						<div className="flex items-center gap-4">
							<div className="flex items-center space-x-1.5">
								<div className="h-3 w-3 rounded-full bg-red-500"></div>
								<div className="h-3 w-3 rounded-full bg-yellow-500"></div>
								<div className="h-3 w-3 rounded-full bg-green-500"></div>
							</div>
							<div className="text-xs text-primary/70 font-mono flex items-center">
								<Terminal size={11} className="mr-1.5" />
								<span>./pricing/partnership.sh</span>
							</div>
						</div>
						<div className="text-xs font-mono text-primary/60">$15k - $25k/mo • 3-6 months</div>
					</div>
					<div className="bg-zinc-900/90 backdrop-blur-sm border-x border-b border-primary/20">
						<div className="bg-background/90 p-6 space-y-4">
							<h3 className="text-xl font-bold">Ongoing Partnership</h3>
							<p className="text-muted-foreground">
								Act as your part-time AI technical lead. Build custom applications, optimize existing systems, provide strategic guidance. For companies ready to scale their AI capabilities.
							</p>
							<p className="text-sm text-muted-foreground italic">Deliverable: Production systems + sustainable AI capability</p>
						</div>
					</div>
				</div>

				<p className="text-muted-foreground text-center italic pt-4 font-mono text-sm">
					<span className="text-primary/80">$</span> echo &quot;No maintenance contracts. No vendor lock-in. Just results.&quot;
				</p>
			</section>

			{/* Section divider */}
			<div className="w-full max-w-md mx-auto flex items-center gap-3">
				<div className="h-px bg-primary/20 flex-grow"></div>
				<div className="text-xs font-mono text-primary/40 px-2 py-1 border border-primary/10 rounded">faq</div>
				<div className="h-px bg-primary/20 flex-grow"></div>
			</div>

			{/* FAQ */}
			<section className="space-y-6">
				<h2 className="text-3xl font-bold">Common Questions</h2>
				<div className="space-y-4">
					<Card className="bg-zinc-900/60 border-primary/20">
						<CardHeader>
							<CardTitle className="text-lg">How quickly can we see results?</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-muted-foreground">Most clients see working prototypes within 2-3 weeks. Full implementations typically take 4-6 weeks for initial systems, with measurable ROI within 2-3 months.</p>
						</CardContent>
					</Card>

					<Card className="bg-zinc-900/60 border-primary/20">
						<CardHeader>
							<CardTitle className="text-lg">What&apos;s your smallest engagement?</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-muted-foreground">Discovery assessments start at $8k-$12k for 3-4 weeks. This identifies opportunities with ROI projections before committing to full implementation.</p>
						</CardContent>
					</Card>

					<Card className="bg-zinc-900/60 border-primary/20">
						<CardHeader>
							<CardTitle className="text-lg">How do you handle IP and data privacy?</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-muted-foreground">You own everything we build. All work is done under standard consulting agreements with full IP transfer. Data privacy and compliance requirements are designed into the architecture from day one - I spent 2 years building systems trusted with attorney-client privileged data.</p>
						</CardContent>
					</Card>

					<Card className="bg-zinc-900/60 border-primary/20">
						<CardHeader>
							<CardTitle className="text-lg">Do you work remote or on-site?</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-muted-foreground">Both. Based in San Francisco, work with clients nationwide. Discovery phase typically includes some on-site time to observe actual workflows. Implementation can be done remotely with regular check-ins.</p>
						</CardContent>
					</Card>

					<Card className="bg-zinc-900/60 border-primary/20">
						<CardHeader>
							<CardTitle className="text-lg">What if we don&apos;t have a technical team?</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-muted-foreground">That&apos;s common in small companies. I handle both strategy and implementation - translating business needs into technical architecture, building the systems, and training your team to maintain them.</p>
						</CardContent>
					</Card>
				</div>
			</section>

			{/* Section divider */}
			<div className="w-full max-w-md mx-auto flex items-center gap-3">
				<div className="h-px bg-primary/20 flex-grow"></div>
				<div className="text-xs font-mono text-primary/40 px-2 py-1 border border-primary/10 rounded">contact</div>
				<div className="h-px bg-primary/20 flex-grow"></div>
			</div>

			{/* Contact - Centralized */}
			<section id="contact" className="space-y-8">
				{/* Terminal window for contact */}
				<div className="shadow-[0_0_60px_rgba(var(--primary-rgb),0.15)] rounded-xl overflow-hidden">
					{/* Terminal header */}
					<div className="bg-zinc-900 border-b border-primary/20 flex items-center justify-between px-4 py-2.5">
						<div className="flex items-center gap-4">
							<div className="flex items-center space-x-1.5">
								<div className="h-3 w-3 rounded-full bg-red-500"></div>
								<div className="h-3 w-3 rounded-full bg-yellow-500"></div>
								<div className="h-3 w-3 rounded-full bg-green-500"></div>
							</div>
							<div className="text-xs text-primary/70 font-mono flex items-center">
								<Terminal size={11} className="mr-1.5" />
								<span>./contact/schedule.sh</span>
							</div>
						</div>
						<div className="text-xs font-mono bg-black/30 px-2 py-0.5 rounded-sm border border-primary/10 flex items-center">
							<span className="inline-block h-1.5 w-1.5 rounded-full bg-green-500 mr-1.5 animate-pulse"></span>
							<FileBadge size={10} className="text-primary/60 mr-1" />
							<span className="uppercase text-[10px]">READY</span>
						</div>
					</div>

					{/* Terminal content */}
					<div className="bg-zinc-900/90 backdrop-blur-sm border-x border-b border-primary/20">
						<div className="bg-background/90 py-12 px-8">
							{/* Terminal prompt */}
							<div className="font-mono text-sm text-primary/70 mb-4 text-center">
								<span className="text-primary/80">$</span> ./schedule_discovery_call.sh
							</div>

							<div className="text-center space-y-6">
								<h2 className="text-3xl font-bold">Ready to Build AI That Actually Works?</h2>
								<p className="text-lg max-w-2xl mx-auto text-muted-foreground">
									30-minute call to understand your challenges and see if AI makes sense for your business. No obligation, no sales pitch.
								</p>
							</div>

							<div className="flex flex-col items-center gap-6 pt-6">
								<Link href="https://calendly.com/willdiamond3/30min" target="_blank" rel="noopener noreferrer">
									<Button
										size="lg"
										className="text-lg px-8 bg-primary hover:bg-primary/90 shadow-[0_0_25px_rgba(var(--primary-rgb),0.25)] transition-all duration-300 hover:shadow-[0_0_40px_rgba(var(--primary-rgb),0.35)] hover:translate-y-[-2px]"
									>
										Schedule Discovery Call
									</Button>
								</Link>

								<div className="text-center space-y-2">
									<div className="text-sm text-muted-foreground font-mono">Or reach out directly:</div>
									<div className="font-mono">
										<a href="mailto:will@diamondquarters.com" className="text-primary hover:underline hover:text-primary/80 transition-colors">
											will@diamondquarters.com
										</a>
									</div>
								</div>

								<div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/30 rounded text-sm">
									<CheckCircle2 size={14} className="text-primary" />
									<span className="text-primary font-medium">Currently accepting clients for Q4 2025 and Q1 2026</span>
								</div>
							</div>
						</div>

						{/* Terminal footer */}
						<div className="px-4 py-2 bg-zinc-900 border-t border-primary/10">
							<div className="font-mono text-xs flex items-center text-primary/60">
								<span className="text-primary/80 mr-2">$</span>
								<span>exit 0</span>
								<span className="ml-2 animate-pulse-slow">▌</span>
							</div>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}
