"use client";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Project } from '@/sanity/sanity.types';
import { Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import ProjectCard from './projectCard';

interface ProjectGridProps {
	projects: Project[];
}

export default function ProjectGrid({ projects }: ProjectGridProps) {
	// State for filters
	const [statusFilter, setStatusFilter] = useState<string | null>(null);
	const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
	const [searchTerm, setSearchTerm] = useState('');

	// Get unique categories and statuses from projects
	const categories = [...new Set(projects.flatMap(p => p.categories || []))].filter(Boolean);
	const statuses = [...new Set(projects.map(p => p.timeline?.status || 'active'))].filter(Boolean);

	// Log initial projects and filter states
	useEffect(() => {
		console.log('[ProjectGrid] Received projects:', projects.length, projects.map(p => p.title || p._id));
	}, [projects]);

	// Filter projects based on current filters
	const filteredProjects = projects.filter(project => {
		// Log current filter states for each project being evaluated if needed for deep debugging
		// console.log(`[ProjectGrid] Filtering project: ${project.title || project._id}, StatusFilter: ${statusFilter}, CategoryFilter: ${categoryFilter}, SearchTerm: ${searchTerm}`);

		// Status filter
		if (statusFilter && project.timeline?.status !== statusFilter) {
			// console.log(`[ProjectGrid] Filtered out by status: ${project.title || project._id}`);
			return false;
		}

		// Category filter
		if (categoryFilter && !project.categories?.includes(categoryFilter)) {
			// console.log(`[ProjectGrid] Filtered out by category: ${project.title || project._id}`);
			return false;
		}

		// Search filter - check title and description
		if (searchTerm) {
			const searchLower = searchTerm.toLowerCase();
			const titleMatch = project.title?.toLowerCase().includes(searchLower);
			const descMatch = project.description?.toLowerCase().includes(searchLower);
			const techMatch = project.technologies?.some(t =>
				t.name?.toLowerCase().includes(searchLower)
			);

			if (!titleMatch && !descMatch && !techMatch) {
				// console.log(`[ProjectGrid] Filtered out by search: ${project.title || project._id}`);
				return false;
			}
		}

		return true;
	});

	// Log filtered projects
	useEffect(() => {
		console.log('[ProjectGrid] Filter states:', { statusFilter, categoryFilter, searchTerm });
		console.log('[ProjectGrid] Filtered projects count:', filteredProjects.length, filteredProjects.map(p => p.title || p._id));
	}, [filteredProjects, statusFilter, categoryFilter, searchTerm]);

	// Clear all filters
	const clearFilters = () => {
		setStatusFilter(null);
		setCategoryFilter(null);
		setSearchTerm('');
	};

	// Check if any filters are active
	const hasActiveFilters = statusFilter || categoryFilter || searchTerm;

	return (
		<div className="space-y-8">
			{/* Filter controls inside a terminal-styled container */}
			<div className="bg-card border border-primary/30 rounded-md p-5 space-y-5 terminal-glow">
				{/* Terminal header */}
				<div className="flex items-center text-xs font-mono text-primary/80 mb-4">
					<span className="text-primary mr-2">$</span>
					<span className="typing-effect">find ~/projects -type f | grep -i</span>
					<span className="inline-block w-2 h-4 bg-primary animate-blink ml-1"></span>
				</div>

				{/* Search bar */}
				<div className="relative">
					<Search className="absolute left-3 top-2.5 h-4 w-4 text-primary/70" />
					<Input
						type="text"
						placeholder="Search projects by name, description, or technology..."
						className="pl-9 py-2 h-10 font-mono bg-black/50 border-primary/30 focus:border-primary/80 text-foreground placeholder:text-muted-foreground/70"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
					{searchTerm && (
						<button
							className="absolute right-3 top-2.5"
							onClick={() => setSearchTerm('')}
							aria-label="Clear search"
						>
							<X className="h-4 w-4 text-primary/70 hover:text-primary" />
						</button>
					)}
				</div>

				{/* Filter buttons */}
				<div className="space-y-4">
					{/* Status filters */}
					<div className="space-y-2">
						<div className="flex items-center">
							<span className="text-primary mr-2">$</span>
							<span className="text-sm font-mono text-primary/80">filter --status</span>
						</div>
						<div className="flex flex-wrap items-center gap-2 pl-4">
							<Button
								variant={statusFilter === null ? "default" : "outline"}
								size="sm"
								onClick={() => setStatusFilter(null)}
								className={`h-8 font-mono text-xs ${statusFilter === null ? 'bg-primary text-primary-foreground' : 'border-primary/30 text-foreground hover:bg-primary/10'}`}
							>
								all
							</Button>
							{statuses.map((status) => (
								<Button
									key={status}
									variant={statusFilter === status ? "default" : "outline"}
									size="sm"
									onClick={() => setStatusFilter(status)}
									className={`h-8 font-mono text-xs ${statusFilter === status ? 'bg-primary text-primary-foreground' : 'border-primary/30 text-foreground hover:bg-primary/10'}`}
								>
									{status}
								</Button>
							))}
						</div>
					</div>

					{/* Category filters - only show if categories exist */}
					{categories.length > 0 && (
						<div className="space-y-2">
							<div className="flex items-center">
								<span className="text-primary mr-2">$</span>
								<span className="text-sm font-mono text-primary/80">filter --category</span>
							</div>
							<div className="flex flex-wrap items-center gap-2 pl-4">
								<Button
									variant={categoryFilter === null ? "default" : "outline"}
									size="sm"
									onClick={() => setCategoryFilter(null)}
									className={`h-8 font-mono text-xs ${categoryFilter === null ? 'bg-primary text-primary-foreground' : 'border-primary/30 text-foreground hover:bg-primary/10'}`}
								>
									all
								</Button>
								{categories.map((category) => (
									<Button
										key={category}
										variant={categoryFilter === category ? "default" : "outline"}
										size="sm"
										onClick={() => setCategoryFilter(category)}
										className={`h-8 font-mono text-xs ${categoryFilter === category ? 'bg-primary text-primary-foreground' : 'border-primary/30 text-foreground hover:bg-primary/10'}`}
									>
										{category}
									</Button>
								))}
							</div>
						</div>
					)}

					{/* Applied filters badges */}
					{hasActiveFilters && (
						<div className="mt-4 pt-4 border-t border-primary/20">
							<div className="flex items-center text-primary mb-2">
								<span className="text-primary mr-2">$</span>
								<span className="text-sm font-mono">active-filters</span>
							</div>
							<div className="flex flex-wrap items-center gap-2 pl-4">
								{statusFilter && (
									<Badge variant="outline" className="flex gap-1 items-center bg-black/40 border-primary/40 text-foreground">
										status:{statusFilter}
										<button onClick={() => setStatusFilter(null)}>
											<X className="h-3 w-3 text-primary/70 hover:text-primary" />
										</button>
									</Badge>
								)}
								{categoryFilter && (
									<Badge variant="outline" className="flex gap-1 items-center bg-black/40 border-primary/40 text-foreground">
										category:{categoryFilter}
										<button onClick={() => setCategoryFilter(null)}>
											<X className="h-3 w-3 text-primary/70 hover:text-primary" />
										</button>
									</Badge>
								)}
								{searchTerm && (
									<Badge variant="outline" className="flex gap-1 items-center bg-black/40 border-primary/40 text-foreground">
										search:&quot;{searchTerm}&quot;
										<button onClick={() => setSearchTerm('')}>
											<X className="h-3 w-3 text-primary/70 hover:text-primary" />
										</button>
									</Badge>
								)}
								<Button
									variant="outline"
									size="sm"
									onClick={clearFilters}
									className="ml-2 h-8 text-xs font-mono border-primary/30 hover:bg-primary/10 hover:border-primary/80"
								>
									clear-all
								</Button>
							</div>
						</div>
					)}
				</div>

				{/* Project count with terminal style */}
				<div className="mt-4 pt-4 border-t border-primary/20 flex items-center font-mono text-sm text-primary/80">
					<span className="text-primary mr-2">$</span>
					<span>ls | wc -l</span>
					<span className="ml-3 text-foreground">{filteredProjects.length} of {projects.length} projects</span>
				</div>
			</div>

			{/* Project grid */}
			{filteredProjects.length > 0 ? (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{filteredProjects.map((project) => (
						<ProjectCard key={project._id} project={project} />
					))}
				</div>
			) : (
				<div className="text-center py-12 border border-dashed border-primary/30 rounded-md bg-black/30">
					<div className="text-xl font-mono text-primary mb-3 flex items-center justify-center">
						<span className="text-primary mr-2">$</span>
						<span>find: no matching projects found</span>
					</div>
					<p className="text-sm text-muted-foreground mb-6">
						Try adjusting your filters or search term
					</p>
					<Button
						onClick={clearFilters}
						variant="outline"
						className="font-mono border-primary/40 hover:bg-primary/10 hover:border-primary/80"
					>
						clear-filters
					</Button>
				</div>
			)}
		</div>
	);
} 