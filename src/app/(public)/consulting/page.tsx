import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export const metadata = {
	title: "AI Consulting | Will Diamond",
	description: "Applied AI engineering for small companies in regulated industries. Strategy to deployment, no handoffs.",
};

export default function ConsultingPage() {
	return (
		<main className="mx-auto w-full max-w-4xl px-4 md:px-6 lg:px-8 space-y-20 py-16">
			{/* Hero Section */}
			<section className="space-y-6">
				<h1 className="text-4xl md:text-5xl font-bold">Applied AI Engineering</h1>
				<p className="text-xl text-muted-foreground max-w-2xl">
					I build AI systems for small companies in regulated industries. Strategy to deployment, no handoffs.
				</p>
				<div className="pt-4">
					<Link href="#contact">
						<Button size="lg">Schedule a Call</Button>
					</Link>
				</div>
			</section>

			{/* What I Do */}
			<section className="space-y-6">
				<h2 className="text-3xl font-bold">What I Build</h2>
				<p className="text-muted-foreground max-w-2xl">
					I help companies integrate AI into their workflows. This means understanding your business, finding opportunities, building working systems, and ensuring compliance. I handle both the strategy and the code.
				</p>
				<div className="flex flex-wrap gap-3 text-sm text-muted-foreground pt-2">
					<span>Legal</span>
					<span>•</span>
					<span>Compliance</span>
					<span>•</span>
					<span>Professional Services</span>
					<span>•</span>
					<span>Finance</span>
					<span>•</span>
					<span>Healthcare</span>
				</div>
			</section>

			{/* Services */}
			<section className="space-y-8">
				<h2 className="text-3xl font-bold">How I Work</h2>

				<Card>
					<CardHeader>
						<CardTitle className="flex items-baseline justify-between">
							<span>Assessment</span>
							<span className="text-base font-normal text-muted-foreground">$8k - $12k • 3-4 weeks</span>
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<p className="text-muted-foreground">
							Interview your team, understand workflows, identify AI opportunities with ROI projections. You get a clear roadmap.
						</p>
						<p className="text-sm text-muted-foreground italic">Deliverable: Assessment report + presentation</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="flex items-baseline justify-between">
							<span>Implementation</span>
							<span className="text-base font-normal text-muted-foreground">$10k - $15k • 4-6 weeks</span>
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<p className="text-muted-foreground">
							Build 1-2 working automations. Train your team, ensure compliance, document everything.
						</p>
						<p className="text-sm text-muted-foreground italic">Deliverable: Working tools + documentation + trained team</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="flex items-baseline justify-between">
							<span>Ongoing Partnership</span>
							<span className="text-base font-normal text-muted-foreground">$15k - $25k/month • 3-6 months</span>
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<p className="text-muted-foreground">
							Act as your part-time technical lead. Build custom AI applications, optimize systems, provide strategic guidance.
						</p>
						<p className="text-sm text-muted-foreground italic">Deliverable: Production systems + sustainable capability</p>
					</CardContent>
				</Card>
			</section>

			{/* Approach */}
			<section className="space-y-6">
				<h2 className="text-3xl font-bold">How I Work</h2>
				<p className="text-muted-foreground max-w-2xl">
					I interview your team at all levels - executives, managers, individual contributors. I watch the actual work happen. I find the gaps between what people say and what they do. That&apos;s where the opportunities are.
				</p>
				<Card className="bg-muted/50">
					<CardContent className="pt-6 space-y-2">
						<p className="font-semibold">Example:</p>
						<p className="text-sm text-muted-foreground">
							At Contoural, two consultants were doing the same task completely differently. That discrepancy revealed the opportunity. The system I built reduced analysis time by 75%.
						</p>
					</CardContent>
				</Card>
			</section>

			{/* Previous Work */}
			<section className="space-y-6">
				<h2 className="text-3xl font-bold">Previous Work</h2>

				<div className="space-y-4">
					<div>
						<h3 className="text-xl font-semibold mb-2">Contoural (Legal Tech Startup)</h3>
						<p className="text-muted-foreground mb-3">2 years building AI systems for legal research and compliance</p>
						<ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
							<li>75% reduction in analysis time</li>
							<li>$300k+ annual savings</li>
							<li>99.9% uptime in production</li>
						</ul>
					</div>

					<div>
						<h3 className="text-xl font-semibold mb-2">Other Projects</h3>
						<ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
							<li>Built multi-agent poker system (Texas Hold LLM) demonstrating complex AI coordination</li>
							<li>Designed AI strategy for Roman AI (A16Z-backed)</li>
							<li>Contract rate: $20k/month achieved</li>
						</ul>
					</div>
				</div>
			</section>

			{/* Why Contract */}
			<section className="space-y-6">
				<h2 className="text-3xl font-bold">Why Contract vs Full-Time</h2>
				<p className="text-muted-foreground max-w-2xl">
					No benefits costs, no onboarding time, no management overhead. You get someone who&apos;s done this before and can start immediately.
				</p>
				<Card className="bg-muted/50">
					<CardContent className="pt-6 space-y-2">
						<p className="font-semibold">Example:</p>
						<p className="text-sm text-muted-foreground">
							A $10k assessment that saves 2 hours/week across 5 people = 520 hours/year = $26k annual savings at $50/hour employee cost. ROI in 5 months.
						</p>
					</CardContent>
				</Card>
			</section>

			{/* About */}
			<section className="space-y-6">
				<h2 className="text-3xl font-bold">About</h2>
				<div className="space-y-4 text-muted-foreground max-w-2xl">
					<p>
						I&apos;m an AI engineer based in San Francisco. I spent 2 years building AI systems for Contoural (legal tech startup), where I learned both the technical side and the compliance side of working in regulated industries.
					</p>
					<p>
						I work with small companies (10-100 people) that need both strategy and implementation but don&apos;t have a technical team.
					</p>
					<div className="pt-2">
						<p className="font-semibold text-foreground mb-2">Tech:</p>
						<p className="text-sm">Python, TypeScript, React, LLMs, PostgreSQL</p>
					</div>
					<div className="pt-2">
						<p className="font-semibold text-foreground mb-2">Contact:</p>
						<p className="text-sm">
							<a href="mailto:will@diamondquarters.com" className="text-primary hover:underline">will@diamondquarters.com</a>
							{" • "}
							<a href="tel:+16502791844" className="text-primary hover:underline">(650) 279-1844</a>
						</p>
					</div>
				</div>
			</section>

			{/* FAQ */}
			<section className="space-y-6">
				<h2 className="text-3xl font-bold">FAQ</h2>
				<div className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle className="text-lg">What if we&apos;re not technical?</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-muted-foreground">That&apos;s fine. I translate between business needs and technical implementation.</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle className="text-lg">How do we know AI will work for us?</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-muted-foreground">Start with an assessment. Low risk, identifies real opportunities before committing to build anything.</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle className="text-lg">What about compliance and data privacy?</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-muted-foreground">2 years experience building AI in legal tech. I know regulated industries.</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle className="text-lg">Remote or on-site?</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-muted-foreground">Both. Based in SF, work with clients nationwide. Discovery usually includes some on-site time.</p>
						</CardContent>
					</Card>
				</div>
			</section>

			{/* Process */}
			<section className="space-y-6">
				<h2 className="text-3xl font-bold">Process</h2>
				<div className="grid md:grid-cols-4 gap-6">
					<div className="space-y-2">
						<div className="font-semibold text-lg">1. Discovery Call</div>
						<p className="text-sm text-muted-foreground">30 min, free. Understand your challenges, see if there&apos;s a fit.</p>
					</div>
					<div className="space-y-2">
						<div className="font-semibold text-lg">2. Proposal</div>
						<p className="text-sm text-muted-foreground">Clear scope, deliverables, pricing, timeline.</p>
					</div>
					<div className="space-y-2">
						<div className="font-semibold text-lg">3. Work</div>
						<p className="text-sm text-muted-foreground">Weekly check-ins, iterative progress, transparent updates.</p>
					</div>
					<div className="space-y-2">
						<div className="font-semibold text-lg">4. Handoff</div>
						<p className="text-sm text-muted-foreground">Full documentation, knowledge transfer, training.</p>
					</div>
				</div>
			</section>

			{/* Final CTA */}
			<section id="contact" className="text-center space-y-6 bg-muted/30 py-12 px-8 rounded-lg">
				<p className="text-lg max-w-2xl mx-auto">
					30-minute call to understand your challenges and see if AI makes sense for your business. No obligation.
				</p>
				<div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
					<Link href="mailto:will@diamondquarters.com">
						<Button size="lg">Schedule a Call</Button>
					</Link>
					<span className="text-muted-foreground">or email</span>
					<Link href="mailto:will@diamondquarters.com">
						<Button size="lg" variant="outline">will@diamondquarters.com</Button>
					</Link>
				</div>
				<p className="text-sm text-muted-foreground pt-4">
					Currently accepting clients for Q4 2025 and Q1 2026.
				</p>
			</section>
		</main>
	);
}
