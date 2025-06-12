import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export const metadata = {
	title: "AI Engineering Consulting | Will Diamond",
	description: "AI engineering consulting services – from concept to production-ready solutions. 2-Week AI Quickstart and custom consulting offerings.",
};

export default function ConsultingPage() {
	return (
		<main className="mx-auto w-full max-w-5xl px-4 md:px-6 lg:px-8 space-y-24 py-16">
			{/* Hero Section */}
			<section className="text-center space-y-6">
				<h1 className="text-4xl md:text-5xl font-bold tracking-tight">AI Engineering Consulting</h1>
				<h2 className="text-xl md:text-2xl text-muted-foreground">From AI concept to production-ready systems</h2>
				<p className="max-w-2xl mx-auto text-base md:text-lg text-foreground/80">
					Whether you&apos;re launching your first AI project or scaling existing capabilities, I help companies build robust, measurable AI solutions that deliver real business value.
				</p>
			</section>

			{/* Services Section */}
			<section className="space-y-10">
				<h3 className="text-3xl font-semibold text-center mb-6">Services</h3>
				<div className="grid gap-6 md:grid-cols-2">
					{/* 2-Week AI Quickstart */}
					<Card className="bg-card/80 border border-border">
						<CardHeader>
							<CardTitle>2-Week AI Quickstart</CardTitle>
							<CardDescription>
								Launch your AI project with confidence.
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4 text-sm leading-relaxed">
							<p>
								Get from concept to measurable prototype in just two weeks. Includes comprehensive specifications, evaluation frameworks, and production-ready testing infrastructure.
							</p>
						</CardContent>
					</Card>

					{/* Custom AI Consulting */}
					<Card className="bg-card/80 border border-border">
						<CardHeader>
							<CardTitle>Custom AI Consulting</CardTitle>
							<CardDescription>
								Strategic guidance & hands-on development.
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4 text-sm leading-relaxed">
							<p>
								Hourly consulting for architecture reviews, implementation support, and technical strategy tailored to your most complex AI challenges.
							</p>
						</CardContent>
					</Card>
				</div>
			</section>

			{/* Process Section */}
			<section className="space-y-10">
				<h3 className="text-3xl font-semibold text-center mb-8">How It Works</h3>
				<div className="grid gap-8 md:grid-cols-4">
					{[
						{
							title: "Define & Specify",
							desc: "Collaborative requirements gathering and technical specification.",
						},
						{
							title: "Measure & Evaluate",
							desc: "Create business-aligned KPIs and evaluation metrics.",
						},
						{
							title: "Build & Test",
							desc: "Implement custom testing harnesses and validation systems.",
						},
						{
							title: "Deploy & Scale",
							desc: "Integrate directly into your production environment.",
						},
					].map((step, idx) => (
						<div key={step.title} className="text-center space-y-3">
							<div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-primary font-semibold">
								{idx + 1}
							</div>
							<h4 className="font-medium">{step.title}</h4>
							<p className="text-sm text-muted-foreground">{step.desc}</p>
						</div>
					))}
				</div>
			</section>

			{/* CTA Section */}
			<section className="text-center space-y-6 bg-primary/5 py-16 rounded-lg">
				<h3 className="text-3xl font-semibold">Ready to start your AI project?</h3>
				<Link href="/#contact">
					<Button size="lg" className="px-8">
						Let&apos;s Talk
					</Button>
				</Link>
			</section>
		</main>
	);
}