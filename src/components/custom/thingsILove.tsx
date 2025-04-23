"use client";

import { Badge } from "@/components/ui/badge";
import { CheckCircle, Code, Database, GitBranch, Server, Terminal } from "lucide-react";
import React, { useEffect, useState } from "react";

interface TechLove {
	name: string;
	category: string;
	icon: React.ReactNode;
	loveStatement: string;
	explanation: string;
	snippet?: string;
}

export const ThingsILove: React.FC = () => {
	const [typedTerminalText, setTypedTerminalText] = useState("");
	const terminalText = "scan personal_favorites --depth=deep --show-reasoning";

	// Terminal typing effect
	useEffect(() => {
		let currentText = "";
		let currentIndex = 0;

		const typingInterval = setInterval(() => {
			if (currentIndex < terminalText.length) {
				currentText += terminalText[currentIndex];
				setTypedTerminalText(currentText);
				currentIndex++;
			} else {
				clearInterval(typingInterval);
			}
		}, 50);

		return () => clearInterval(typingInterval);
	}, []);

	const techLoves: TechLove[] = [
		{
			name: "PostgreSQL + JSONB",
			category: "Databases",
			icon: <Database className="h-5 w-5 text-primary" />,
			loveStatement: "The perfect balance between structured data and flexibility",
			explanation: "Combines the reliability of SQL with document-style operations, making it possible to have the best of both worlds.",
			snippet: `SELECT data->>'name' as name
FROM users
WHERE data @> '{"tags": ["developer"]}'
ORDER BY data->'created_at'::timestamp DESC;`
		},
		{
			name: "Pydantic",
			category: "Python Ecosystem",
			icon: <CheckCircle className="h-5 w-5 text-primary" />,
			loveStatement: "Type safety that actually makes sense in Python",
			explanation: "Validates complex data structures with minimal boilerplate, catching bugs at runtime that would've been a pain to debug.",
			snippet: `from pydantic import BaseModel

class User(BaseModel):
    id: int
    name: str
    tags: list[str]
    
# This will raise a validation error:
User(id="not an int", name="Will", tags=["oops"])`
		},
		{
			name: "NextJS + TypeScript",
			category: "Frontend",
			icon: <Code className="h-5 w-5 text-primary" />,
			loveStatement: "The perfect modern web application environment",
			explanation: "Static typing + React's component model + excellent build system = developer happiness",
			snippet: `// Type-safe API routes + React components
export async function getServerSideProps() {
  const data: User[] = await fetchUsers();
  return { props: { users: data } }
}`
		},
		{
			name: "FastAPI",
			category: "Backend",
			icon: <Server className="h-5 w-5 text-primary" />,
			loveStatement: "The backend framework that actually makes sense",
			explanation: "Automatic docs, type validation, async by default, and incredible performance. Backend development as it should be.",
			snippet: `@app.get("/users/{user_id}")
async def get_user(user_id: int) -> User:
    # Type hints become schema validation
    # and automatic docs!
    return await db.get_user(user_id)`
		},
		{
			name: "Git Workflow",
			category: "DevOps",
			icon: <GitBranch className="h-5 w-5 text-primary" />,
			loveStatement: "Structured branching that makes collaboration a joy",
			explanation: "Feature branches + pull requests + CI/CD pipelines = reliable, maintainable code that ships confidently.",
			snippet: `git checkout -b feature/amazing-idea
# Make changes, commit, then...
git push -u origin feature/amazing-idea
# Create PR, review, merge`
		}
	];

	return (
		<section className="py-16">
			{/* Terminal header */}
			<div className="mb-8">
				<div className="flex items-center gap-2 mb-2">
					<Terminal className="h-5 w-5 text-primary" />
					<p className="text-sm font-mono text-primary">$ {typedTerminalText}<span className="animate-pulse">▌</span></p>
				</div>

				<div className="space-y-4">
					<h2 className="text-3xl font-bold text-foreground">Things I <span className="text-primary">❤️</span></h2>
					<p className="text-lg text-muted-foreground">
						Technologies and tools I'm genuinely passionate about
					</p>
				</div>
			</div>

			{/* Horizontal scrolling container for smaller screens */}
			<div className="relative pb-4">
				<div className="overflow-x-auto pb-4 -mb-4 pt-2 px-1">
					<div className="flex gap-4 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6 min-w-[calc(100%+1rem)]">
						{techLoves.map((tech, index) => (
							<div
								key={index}
								className="flex-shrink-0 w-[350px] max-w-[90vw] md:w-full bg-black/30 border border-primary/20 rounded-lg overflow-hidden shadow-sm hover:shadow-[0_0_15px_rgba(var(--primary-rgb),0.15)] transition-all"
							>
								{/* Card header */}
								<div className="bg-black/60 px-4 py-2.5 border-b border-primary/20 flex items-center justify-between">
									<div className="flex items-center gap-2">
										<div className="h-3 w-3 rounded-full bg-primary/70"></div>
										<h3 className="text-primary/90 font-mono text-sm">{tech.name}</h3>
									</div>
									<Badge variant="outline" className="bg-black/50 border-primary/30 text-xs font-mono">
										{tech.category}
									</Badge>
								</div>

								{/* Card content */}
								<div className="p-4 bg-gradient-to-b from-black/10 to-black/30 h-full flex flex-col">
									<div className="mb-2">
										<p className="text-foreground italic mb-3">"{tech.loveStatement}"</p>
										<div className="flex text-muted-foreground items-start">
											<span className="text-primary/70 font-mono text-sm mr-2 flex-shrink-0">$&gt;</span>
											<p className="text-sm">{tech.explanation}</p>
										</div>
									</div>

									{/* Code snippet if available */}
									{tech.snippet && (
										<div className="mt-auto pt-3">
											<pre className="bg-black/70 p-3 rounded-md text-xs text-primary/90 font-mono overflow-x-auto">
												<code>{tech.snippet}</code>
											</pre>
										</div>
									)}
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Scroll shadows */}
				<div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent pointer-events-none hidden md:block"></div>
				<div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none hidden md:block"></div>
			</div>

			{/* Terminal-inspired footer */}
			<div className="mt-6 text-center">
				<p className="inline-block text-xs font-mono text-muted-foreground bg-black/20 px-3 py-1 rounded-full border border-primary/10">
					<span className="text-primary/70 mr-1">~</span>
					scroll to see more
					<span className="text-primary/70 ml-1">~</span>
				</p>
			</div>
		</section>
	);
}; 