import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
	Brain,
	Code,
	Database,
	Globe,
	Layout,
	LucideIcon,
	Server
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
			<div className="space-y-4 mb-8">
				<h2 className="text-3xl font-bold">Technical Stack</h2>
				<p className="text-lg text-gray-600">
					Comprehensive toolkit for building modern AI applications
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{categories.map((category, index) => {
					const IconComponent = getIcon(category.icon);
					return (
						<Card key={index} className="p-6">
							<div className="space-y-4">
								<div className="flex items-center space-x-3">
									<div className="p-2 bg-blue-50 rounded-lg">
										<IconComponent className="h-6 w-6 text-blue-600" />
									</div>
									<div>
										<h3 className="text-xl font-semibold">{category.title}</h3>
										<p className="text-sm text-gray-600">{category.description}</p>
									</div>
								</div>

								<div className="flex flex-wrap gap-2">
									{category.technologies.map((tech, i) => (
										<Badge
											key={i}
											variant="secondary"
											className="px-3 py-1 text-sm"
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
			<div className="mt-8 text-center text-sm text-gray-500">
				<p>
					Technologies listed represent production-level experience
				</p>
			</div>
		</section>
	);
};