import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ToolInvocation } from "ai";
import { Github, Loader2, X } from "lucide-react";

interface GitHubToolCardProps {
	toolInvocation: ToolInvocation;
}

/**
 * Card component for displaying GitHub repository data
 */
export const GitHubToolCard = ({ toolInvocation }: GitHubToolCardProps) => {
	const { toolName, state, args } = toolInvocation;

	// Get the appropriate icon and name based on tool type
	const getToolInfo = () => {
		switch (toolName) {
			case 'getRepositoryDetails':
				return { icon: Github, name: 'Fetching Repository Details', label: args.repoName };
			default:
				return { icon: Github, name: 'GitHub API', label: '' };
		}
	};

	const { icon: Icon, name, label } = getToolInfo();

	// If the call is in progress
	if (state === 'partial-call' || state === 'call') {
		return (
			<div className="my-2 flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-100 rounded-md text-blue-700 text-xs">
				<Loader2 className="h-4 w-4 animate-spin" />
				<div>
					<span className="font-medium">{name}</span>
					{label && <span className="ml-1 text-blue-600">{label}</span>}
				</div>
			</div>
		);
	}

	// If there was an error
	if (toolInvocation.result?.error) {
		return (
			<div className="my-2 flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-100 rounded-md text-red-700 text-xs">
				<X className="h-4 w-4" />
				<div>
					<span className="font-medium">Failed to fetch GitHub data</span>
					<span className="ml-1 text-red-600">{toolInvocation.result?.error}</span>
				</div>
			</div>
		);
	}

	// Success card with repository data
	return (
		<Card className="my-2 border border-gray-200 bg-white overflow-hidden">
			<div className="bg-slate-50 px-3 py-1.5 border-b border-gray-200 flex items-center gap-2">
				<Icon className="h-4 w-4 text-slate-600" />
				<span className="text-xs font-medium text-slate-700">
					GitHub Repository Details
				</span>
				<Badge className="ml-auto bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200">
					{toolInvocation.result?.repository?.name}
				</Badge>
			</div>
			<CardContent className="p-2 text-xs">
				<div className="grid gap-2">
					{/* Repository Info */}
					<div className="grid gap-1.5 text-black">
						<p className="font-medium">Repository: {toolInvocation.result?.repository?.name}</p>
						{toolInvocation.result?.repository?.description && (
							<p className="text-black">{toolInvocation.result?.repository.description}</p>
						)}
						<div className="flex flex-wrap gap-2 mt-1">
							{toolInvocation.result?.repository?.stars !== undefined && (
								<Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
									★ {toolInvocation.result?.repository.stars} stars
								</Badge>
							)}
							{toolInvocation.result?.repository?.forks !== undefined && (
								<Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
									{toolInvocation.result?.repository.forks} forks
								</Badge>
							)}
							{toolInvocation.result?.repository?.language && (
								<Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
									{toolInvocation.result?.repository.language}
								</Badge>
							)}
							{toolInvocation.result?.repository?.openIssues !== undefined && (
								<Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
									{toolInvocation.result?.repository.openIssues} issues
								</Badge>
							)}
						</div>
					</div>

					{/* Languages */}
					{toolInvocation.result?.languages && Object.keys(toolInvocation.result?.languages).length > 0 && (
						<div className="grid gap-1.5 mt-2 pt-2 border-t border-gray-100 text-black">
							<p className="font-medium">Languages</p>
							<div className="flex flex-wrap gap-1 mt-1">
								{Object.entries(toolInvocation.result?.languages).slice(0, 8).map(([lang, bytes]: [string, any], index: number) => (
									<Badge key={index} variant="outline" className="bg-slate-50 text-slate-700 border-slate-200">
										{lang}
									</Badge>
								))}
								{Object.keys(toolInvocation.result?.languages).length > 8 && (
									<Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200">
										+ {Object.keys(toolInvocation.result?.languages).length - 8} more
									</Badge>
								)}
							</div>
						</div>
					)}

					{/* README */}
					{toolInvocation.result?.readme?.content && (
						<div className="grid gap-1.5 mt-2 pt-2 border-t border-gray-100 text-black">
							<p className="font-medium">README</p>
							<div className="mt-1 max-h-36 overflow-y-auto bg-slate-50 p-2 rounded text-xs font-mono whitespace-pre-wrap">
								{toolInvocation.result?.readme.content.substring(0, 500)}
								{toolInvocation.result?.readme.content.length > 500 && '...'}
							</div>
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
}; 