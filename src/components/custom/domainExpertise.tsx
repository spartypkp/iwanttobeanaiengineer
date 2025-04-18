import { Card } from "@/components/ui/card";
import {
	Brain,
	Building2,
	Code,
	Database,
	LucideIcon,
	Scale,
	Video
} from "lucide-react";
import TerminalContainer from "./terminalContainer";

interface Domain {
	title: string;
	description: string;
	icon: string;
	achievements: string[];
}

// interface DomainExpertiseProps {
// 	domains: Domain[];
// }

export const DomainExpertise: React.FC = () => {
	const domains: Domain[] = [
		{
			title: "Enterprise AI Systems",
			description: "Building LLM-powered solutions for Fortune 500 companies",
			icon: "building",
			achievements: [
				"75% time reduction in recordkeeping analysis",
				"Complex legal workflow automation",
				"Multi-jurisdictional compliance systems"
			]
		},
		{
			title: "Legal Tech Innovation",
			description: "Democratizing legal knowledge through AI technology",
			icon: "scale",
			achievements: [
				"Legal citation analysis system",
				"Legislative knowledge graph database",
				"Regulatory requirement automation"
			]
		},
		{
			title: "Media Production & AI",
			description: "Streamlining content workflows with AI automation",
			icon: "video",
			achievements: [
				"Automated transcription systems",
				"Multi-platform content distribution",
				"AI-powered content preparation"
			]
		},
		{
			title: "Technical Leadership",
			description: "Leading technical initiatives and team collaboration",
			icon: "brain",
			achievements: [
				"Full-stack application architecture",
				"Cross-functional team leadership",
				"Technical research and strategy"
			]
		}
	];

	const getIcon = (iconName: string): LucideIcon => {
		const icons = {
			building: Building2,
			scale: Scale,
			video: Video,
			brain: Brain,
			code: Code,
			database: Database,
		};
		return icons[iconName as keyof typeof icons] || Building2;
	};

	return (
		<section className="py-16">
			<TerminalContainer title="domain_expertise.sh" className="mb-6">
				<div className="font-mono text-sm mb-2">
					<p>$ scan expertise --fields=enterprise,legal,media,leadership</p>
					<p className="mt-1 opacity-75">Analyzing domain expertise profiles...</p>
				</div>
			</TerminalContainer>

			<div className="space-y-4 mb-8">
				<h2 className="text-3xl font-bold text-foreground">Domain Expertise</h2>
				<p className="text-lg text-muted-foreground">
					Specialized experience across enterprise AI, legal tech, and media production
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{domains.map((domain, index) => {
					const IconComponent = getIcon(domain.icon);
					return (
						<Card key={index} className="p-6 hover:shadow-md transition-shadow border-primary/20 hover:border-primary/40 bg-card">
							<div className="flex items-start space-x-4">
								<div className="p-2 bg-secondary/30 rounded-lg">
									<IconComponent className="h-6 w-6 text-primary" />
								</div>
								<div className="space-y-3 flex-1">
									<h3 className="text-xl font-semibold text-foreground">{domain.title}</h3>
									<p className="text-muted-foreground">{domain.description}</p>
									<ul className="space-y-2">
										{domain.achievements.map((achievement, i) => (
											<li key={i} className="flex items-center text-sm text-foreground/80">
												<span className="w-1.5 h-1.5 bg-primary rounded-full mr-2" />
												{achievement}
											</li>
										))}
									</ul>
								</div>
							</div>
						</Card>
					);
				})}
			</div>
		</section>
	);
};