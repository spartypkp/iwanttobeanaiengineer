import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getAllKnowledgeItems, getAllProjects, getAllSkills } from '@/sanity/lib/client';
import { KnowledgeBase, Project, Skill } from '@/sanity/sanity.types';
import { Edit, Plus, Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ContentItem, ContentType } from './types';

type ContentSidebarProps = {
	contentType: ContentType;
	onSelectItem: (item: ContentItem) => void;
	onCreateNew: (type: Exclude<ContentType, null>) => void;
	isEditMode: boolean;
	selectedItem: ContentItem | null;
	onContentTypeChange?: (type: Exclude<ContentType, null>) => void;
};

export function ContentSidebar({
	contentType,
	onSelectItem,
	onCreateNew,
	isEditMode,
	selectedItem,
	onContentTypeChange
}: ContentSidebarProps) {
	const [projects, setProjects] = useState<Project[]>([]);
	const [skills, setSkills] = useState<Skill[]>([]);
	const [knowledgeItems, setKnowledgeItems] = useState<KnowledgeBase[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState('');
	const [activeTab, setActiveTab] = useState<Exclude<ContentType, null>>(contentType || 'project');

	// Sync the activeTab with the contentType prop
	useEffect(() => {
		if (contentType) {
			setActiveTab(contentType as Exclude<ContentType, null>);
		}
	}, [contentType]);

	// When tab changes, notify parent if callback is provided
	useEffect(() => {
		if (onContentTypeChange && activeTab !== contentType) {
			onContentTypeChange(activeTab);
		}
	}, [activeTab, contentType, onContentTypeChange]);

	useEffect(() => {
		async function fetchAllData() {
			try {
				setIsLoading(true);
				const [projectsData, skillsData, knowledgeData] = await Promise.all([
					getAllProjects(),
					getAllSkills(),
					getAllKnowledgeItems()
				]);

				setProjects(projectsData);
				setSkills(skillsData);
				setKnowledgeItems(knowledgeData);
			} catch (error) {
				console.error('Error fetching content data:', error);
			} finally {
				setIsLoading(false);
			}
		}

		fetchAllData();
	}, []);

	const getContentItems = (): ContentItem[] => {
		if (!activeTab) return [];

		const filteredItems = activeTab === 'project'
			? projects.map(p => ({
				id: p._id || '',
				title: p.title || 'Untitled Project',
				type: 'project',
				description: p.description,
				metadata: {
					status: p.timeline?.status,
					date: p.timeline?.startDate
						? new Date(p.timeline.startDate).toLocaleDateString()
						: undefined
				}
			}))
			: activeTab === 'skill'
				? skills.map(s => ({
					id: s._id || '',
					title: s.name || 'Unnamed Skill',
					type: 'skill',
					description: s.category,
					metadata: {
						proficiency: s.proficiency,
						featured: s.featured ? 'Featured' : undefined
					}
				}))
				: knowledgeItems.map(k => ({
					id: k._id || '',
					title: k.title || 'Untitled Knowledge Item',
					type: 'knowledge',
					description: k.category,
					metadata: {
						priority: k.priority ? `Priority: ${k.priority}` : undefined,
						hasQuestion: k.question ? 'Has Q&A' : undefined
					}
				}));

		if (searchTerm) {
			return filteredItems.filter(item =>
				item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
				(item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
			);
		}

		return filteredItems;
	};

	const normalizeType = (type: string): Exclude<ContentType, null> => {
		switch (type.toLowerCase()) {
			case 'project':
				return 'project';
			case 'skill':
				return 'skill';
			case 'knowledge':
				return 'knowledge';
			default:
				return 'project';
		}
	};

	const getStatusColor = (status?: string): string => {
		if (!status) return 'bg-gray-200';

		switch (status.toLowerCase()) {
			case 'active':
				return 'bg-green-100 text-green-800';
			case 'completed':
				return 'bg-blue-100 text-blue-800';
			case 'maintenance':
				return 'bg-purple-100 text-purple-800';
			case 'archived':
				return 'bg-gray-100 text-gray-800';
			case 'concept':
				return 'bg-amber-100 text-amber-800';
			case 'featured':
				return 'bg-pink-100 text-pink-800';
			case 'expert':
				return 'bg-indigo-100 text-indigo-800';
			case 'advanced':
				return 'bg-blue-100 text-blue-800';
			case 'intermediate':
				return 'bg-green-100 text-green-800';
			case 'beginner':
				return 'bg-amber-100 text-amber-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	};

	const contentItems = getContentItems();

	return (
		<Card className="bg-card border-primary/20 shadow-[0_0_10px_rgba(var(--primary-rgb),0.2)]">
			<CardHeader className="px-4 py-3 border-b border-primary/20 flex flex-col gap-4">
				<CardTitle className="text-sm font-medium text-primary">Content Manager</CardTitle>

				{/* Tabs for content type selection */}
				<div className="border border-primary/20 rounded-md overflow-hidden">
					<div className="flex">
						{['project', 'knowledge', 'skill'].map((tabType) => {
							const isActive = activeTab === tabType;
							const bgColor = isActive ? 'bg-primary/20' : 'bg-card hover:bg-primary/10';
							const textColor = isActive ? 'text-primary' : 'text-primary/60';

							return (
								<button
									key={tabType}
									onClick={() => setActiveTab(tabType as Exclude<ContentType, null>)}
									className={`flex-1 py-2 px-2 text-center ${textColor} ${bgColor} font-medium text-sm transition-colors`}
								>
									{tabType.charAt(0).toUpperCase() + tabType.slice(1)}s
								</button>
							);
						})}
					</div>
				</div>

				{/* New button and selection info */}
				<div className="flex justify-between items-center">
					<div>
						<span className="text-xs text-primary/60">
							{isLoading ? 'Loading...' : `${contentItems.length} ${activeTab}${contentItems.length === 1 ? '' : 's'}`}
						</span>
					</div>
					<Button
						size="sm"
						className="h-8 bg-primary/90 hover:bg-primary text-xs"
						onClick={() => onCreateNew(activeTab)}
					>
						<Plus className="h-3 w-3 mr-1" />
						New {activeTab}
					</Button>
				</div>
			</CardHeader>
			<CardContent className="p-0">
				{isLoading ? (
					<div className="p-4 space-y-2">
						{[1, 2, 3].map((i) => (
							<div key={i} className="flex items-center gap-2 p-2">
								<Skeleton className="h-8 w-8 rounded-full" />
								<div className="space-y-1 flex-1">
									<Skeleton className="h-4 w-3/4" />
									<Skeleton className="h-3 w-1/2" />
								</div>
							</div>
						))}
					</div>
				) : (
					<>
						<div className="p-2 relative">
							<div className="relative">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary/40" />
								<input
									type="text"
									placeholder={`Search ${activeTab}s...`}
									className="w-full rounded-md border border-primary/30 bg-card text-sm pl-9 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
									value={searchTerm}
									onChange={e => setSearchTerm(e.target.value)}
								/>
								{searchTerm && (
									<button
										onClick={() => setSearchTerm('')}
										className="absolute right-3 top-1/2 transform -translate-y-1/2"
									>
										<X className="h-4 w-4 text-primary/40 hover:text-primary" />
									</button>
								)}
							</div>
							{searchTerm && (
								<div className="mt-2 text-xs text-primary/60">
									{contentItems.length} result{contentItems.length === 1 ? '' : 's'} for "{searchTerm}"
								</div>
							)}
						</div>

						{contentItems.length === 0 ? (
							<div className="p-4 text-center text-sm text-primary/60 border-t border-primary/10">
								{searchTerm
									? `No ${activeTab}s found matching "${searchTerm}"`
									: `No ${activeTab}s found. Create your first one!`}
							</div>
						) : (
							<div className="max-h-[calc(100vh-450px)] overflow-y-auto terminal-scrollbar">
								{contentItems.map((item) => (
									<Button
										key={item.id}
										variant="ghost"
										className={`w-full justify-start rounded-none border-l-2 text-left h-auto py-3 ${selectedItem?.id === item.id
											? 'bg-primary/10 border-l-primary'
											: 'border-l-transparent hover:bg-primary/5'
											}`}
										onClick={() => onSelectItem(item)}
									>
										<div className="mr-2 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
											<Edit className="h-3 w-3 text-primary" />
										</div>
										<div className="overflow-hidden flex-1">
											<div className="text-sm font-medium truncate flex items-center justify-between">
												<span className="truncate">{item.title}</span>
												{/* ID preview at the end */}
												<span className="text-xs text-primary/40 ml-2 flex-shrink-0">
													{item.id.substring(0, 4)}...
												</span>
											</div>
											<div className="flex items-center gap-1 mt-1 flex-wrap">
												{item.description && (
													<span className="text-xs text-primary/60 bg-primary/5 px-1.5 py-0.5 rounded">
														{item.description}
													</span>
												)}
												{item.metadata?.status && (
													<span className={`text-xs px-1.5 py-0.5 rounded ${getStatusColor(item.metadata.status)}`}>
														{item.metadata.status}
													</span>
												)}
												{item.metadata?.proficiency && (
													<span className={`text-xs px-1.5 py-0.5 rounded ${getStatusColor(item.metadata.proficiency)}`}>
														{item.metadata.proficiency}
													</span>
												)}
												{item.metadata?.featured && (
													<span className={`text-xs px-1.5 py-0.5 rounded ${getStatusColor('featured')}`}>
														{item.metadata.featured}
													</span>
												)}
												{item.metadata?.priority && (
													<span className="text-xs text-primary/60 bg-primary/5 px-1.5 py-0.5 rounded">
														{item.metadata.priority}
													</span>
												)}
												{item.metadata?.hasQuestion && (
													<span className="text-xs text-primary/60 bg-primary/5 px-1.5 py-0.5 rounded">
														{item.metadata.hasQuestion}
													</span>
												)}
												{item.metadata?.date && (
													<span className="text-xs text-primary/60 bg-primary/5 px-1.5 py-0.5 rounded">
														{item.metadata.date}
													</span>
												)}
											</div>
										</div>
									</Button>
								))}
							</div>
						)}
					</>
				)}
			</CardContent>
		</Card>
	);
} 