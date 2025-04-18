import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
	Brain,
	Code,
	Database,
	Globe,
	Layout,
	LucideIcon,
	Server,
	Terminal
} from "lucide-react";

interface TechCategory {
	title: string;
	icon: string;
	description: string;
	technologies: string[];
}

export const TechStack: React.FC = () => {
	const categories: TechCategory[] = [
		{
			title: "AI & Machine Learning",
			icon: "brain",
			description: "LLM systems and AI infrastructure",
			technologies: [
				"OpenAI API",
				"LangChain",
				"Pinecone",
				"ChromaDB",
				"HuggingFace",
				"Vector Databases",
				"Prompt Engineering"
			]
		},
		{
			title: "Frontend Development",
			icon: "layout",
			description: "Modern web development",
			technologies: [
				"React",
				"Next.js",
				"TypeScript",
				"Tailwind CSS",
				"Shadcn/UI",
				"Redux",
				"GraphQL"
			]
		},
		{
			title: "Backend Development",
			icon: "server",
			description: "API and server architecture",
			technologies: [
				"Python",
				"FastAPI",
				"Node.js",
				"PostgreSQL",
				"Redis",
				"Docker",
				"REST APIs"
			]
		},
		{
			title: "Development Tools",
			icon: "code",
			description: "Development workflow and tools",
			technologies: [
				"Git",
				"GitHub Actions",
				"AWS",
				"Vercel",
				"Linux",
				"VS Code",
				"Postman"
			]
		}
	];

	const getIcon = (iconName: string): LucideIcon => {
		const icons = {
			brain: Brain,
			code: Code,
			database: Database,
			globe: Globe,
			layout: Layout,
			server: Server
		};
		return icons[iconName as keyof typeof icons] || Code;
	};

	return (
		<section className="py-16">
			<div className="flex items-center gap-2 mb-2">
				<Terminal className="h-5 w-5 text-primary" />
				<p className="text-sm font-mono text-primary">$ scan tech-stack --verbose</p>
			</div>

			<div className="space-y-4 mb-8">
				<h2 className="text-3xl font-bold text-foreground">Technical Stack</h2>
				<p className="text-lg text-muted-foreground">
					Comprehensive toolkit for building modern AI applications
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{categories.map((category, index) => {
					const IconComponent = getIcon(category.icon);
					return (
						<Card key={index} className="p-6 border border-primary/20 bg-card hover:shadow-[0_0_10px_rgba(var(--primary)/.2)] transition-shadow">
							<div className="space-y-4">
								<div className="flex items-center space-x-3">
									<div className="p-2 bg-secondary/20 rounded-lg">
										<IconComponent className="h-6 w-6 text-primary" />
									</div>
									<div>
										<h3 className="text-xl font-semibold text-foreground">{category.title}</h3>
										<p className="text-sm text-muted-foreground">{category.description}</p>
									</div>
								</div>

								<div className="flex flex-wrap gap-2">
									{category.technologies.map((tech, i) => (
										<Badge
											key={i}
											variant="outline"
											className="px-3 py-1 text-sm border-primary/30 text-foreground bg-secondary/10 hover:bg-secondary/20"
										>
											{tech}
										</Badge>
									))}
								</div>
							</div>
						</Card>
					);
				})}
			</div>

			{/* Proficiency Level Indicator */}
			<div className="mt-8 text-center text-sm text-muted-foreground font-mono border-t border-primary/10 pt-4">
				<p>
					<span className="text-primary">$</span> Technologies listed represent production-level experience
				</p>
			</div>
		</section>
	);
};