import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getAllKnowledgeItems, getAllProjects, getAllSkills } from '@/sanity/lib/client';
import { KnowledgeBase, Project, Skill } from '@/sanity/sanity.types';
import { ChevronDown, ChevronUp, Edit, Pencil, Plus, Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ContentItem, ContentType, KNOWLEDGE_FIELDS, PROJECT_FIELDS, SKILL_FIELDS } from './types';

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
	const [viewMode, setViewMode] = useState<'select' | 'edit'>('select');
	const [selectedEntity, setSelectedEntity] = useState<Project | Skill | KnowledgeBase | null>(null);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);

	// When tab changes due to UI interaction, notify parent
	const handleTabChange = (newTab: Exclude<ContentType, null>) => {
		if (onContentTypeChange && newTab !== contentType) {
			onContentTypeChange(newTab);
		}
	};

	// Switch to edit mode when an item is selected
	useEffect(() => {
		if (selectedItem && isEditMode) {
			setViewMode('edit');
			// Find the selected entity in the appropriate list
			if (selectedItem.type === 'project') {
				const project = projects.find(p => p._id === selectedItem.id);
				setSelectedEntity(project || null);
			} else if (selectedItem.type === 'skill') {
				const skill = skills.find(s => s._id === selectedItem.id);
				setSelectedEntity(skill || null);
			} else if (selectedItem.type === 'knowledge') {
				const knowledge = knowledgeItems.find(k => k._id === selectedItem.id);
				setSelectedEntity(knowledge || null);
			}
		} else {
			setSelectedEntity(null);
		}
	}, [selectedItem, isEditMode, projects, skills, knowledgeItems]);

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
		if (!contentType) return [];

		const filteredItems = contentType === 'project'
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
			: contentType === 'skill'
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

	const getFieldsForContentType = () => {
		switch (contentType) {
			case 'project':
				return PROJECT_FIELDS;
			case 'skill':
				return SKILL_FIELDS;
			case 'knowledge':
				return KNOWLEDGE_FIELDS;
			default:
				return [];
		}
	};

	const contentItems = getContentItems();
	const fields = getFieldsForContentType();

	// Get entity value by field ID
	const getEntityValue = (fieldId: string) => {
		if (!selectedEntity) return 'Not set';

		// Handle special cases based on entity type
		if (contentType === 'project') {
			const project = selectedEntity as Project;
			switch (fieldId) {
				case 'title': return project.title || 'Untitled';
				case 'description': return project.description || 'No description';
				case 'status': return project.timeline?.status || 'Not set';
				case 'problem': return project.problem || 'Not specified';
				case 'solution': return project.solution || 'Not specified';
				case 'technologies':
					return project.technologies?.map(t => t.name).join(', ') || 'None specified';
				case 'github': return project.github || 'No link';
				case 'demoUrl': return project.demoUrl || 'No demo';
				default: return 'Not available';
			}
		} else if (contentType === 'skill') {
			const skill = selectedEntity as Skill;
			switch (fieldId) {
				case 'name': return skill.name || 'Unnamed';
				case 'category': return skill.category || 'Uncategorized';
				case 'proficiency': return skill.proficiency || 'Not rated';
				case 'description': return skill.description || 'No description';
				case 'yearsExperience': return skill.yearsExperience?.toString() || 'Not specified';
				case 'examples':
					return skill.examples?.length
						? `${skill.examples.length} example(s)`
						: 'No examples';
				default: return 'Not available';
			}
		} else if (contentType === 'knowledge') {
			const knowledge = selectedEntity as KnowledgeBase;
			switch (fieldId) {
				case 'title': return knowledge.title || 'Untitled';
				case 'category': return knowledge.category || 'Uncategorized';
				case 'content':
					return knowledge.content
						? knowledge.content.length > 50
							? knowledge.content.substring(0, 50) + '...'
							: knowledge.content
						: 'No content';
				case 'question': return knowledge.question || 'No question';
				case 'keywords': return knowledge.keywords?.join(', ') || 'No keywords';
				case 'priority': return knowledge.priority?.toString() || 'Not set';
				default: return 'Not available';
			}
		}

		return 'Not available';
	};

	const handleItemSelection = (id: string) => {
		const item = contentItems.find(item => item.id === id);
		if (item) {
			onSelectItem(item);
			setIsDropdownOpen(false);
		}
	};

	return (
		<Card className="bg-card border-primary/20 shadow-[0_0_10px_rgba(var(--primary-rgb),0.2)]">
			<CardHeader className="px-4 py-3 border-b border-primary/20">
				<CardTitle className="text-sm font-medium text-primary">Content Manager</CardTitle>

				{/* Tabs for content type selection - use TabsList/TabsTrigger components */}
				<Tabs
					value={contentType || 'project'}
					onValueChange={(value) => handleTabChange(value as Exclude<ContentType, null>)}
					className="w-full"
				>
					<TabsList className="grid w-full grid-cols-3">
						<TabsTrigger value="project">Projects</TabsTrigger>
						<TabsTrigger value="knowledge">Knowledge</TabsTrigger>
						<TabsTrigger value="skill">Skills</TabsTrigger>
					</TabsList>
				</Tabs>
			</CardHeader>

			<CardContent className="p-0">
				{/* View mode tabs */}
				<Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'select' | 'edit')} className="w-full">
					<TabsList className="grid w-full grid-cols-2 mx-4 mt-4">
						<TabsTrigger value="select">Select</TabsTrigger>
						<TabsTrigger value="edit" disabled={!selectedItem}>Edit</TabsTrigger>
					</TabsList>

					{/* Tab content for view modes - properly nested inside Tabs component */}
					<TabsContent value="select" className="m-0">
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
								{/* Compact selection UI */}
								<div className="p-4 space-y-4">
									{/* Entity selector dropdown */}
									<div className="relative">
										<div
											className="border border-primary/30 rounded-md p-3 flex justify-between items-center cursor-pointer hover:bg-primary/5"
											onClick={() => setIsDropdownOpen(!isDropdownOpen)}
										>
											<div className="flex items-center">
												<span className="text-sm font-medium">
													{selectedItem ? selectedItem.title : `Select a ${contentType}...`}
												</span>
											</div>
											{isDropdownOpen ?
												<ChevronUp className="h-4 w-4 text-primary/60" /> :
												<ChevronDown className="h-4 w-4 text-primary/60" />
											}
										</div>

										{/* Search box for filtering */}
										{isDropdownOpen && (
											<div className="absolute z-50 w-full mt-1 bg-card border border-primary/30 rounded-md shadow-lg">
												<div className="p-2 border-b border-primary/10">
													<div className="relative">
														<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary/40" />
														<input
															type="text"
															placeholder={`Search ${contentType}s...`}
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
												</div>

												<div className="max-h-64 overflow-y-auto terminal-scrollbar">
													{contentItems.length === 0 ? (
														<div className="p-4 text-center text-sm text-primary/60">
															{searchTerm
																? `No ${contentType}s found matching "${searchTerm}"`
																: `No ${contentType}s found. Create your first one!`}
														</div>
													) : (
														contentItems.map(item => (
															<div
																key={item.id}
																className={`p-3 hover:bg-primary/5 cursor-pointer ${selectedItem?.id === item.id ? 'bg-primary/10' : ''}`}
																onClick={() => handleItemSelection(item.id)}
															>
																<div className="flex items-center">
																	<Edit className="h-4 w-4 text-primary mr-2" />
																	<div>
																		<div className="text-sm font-medium">{item.title}</div>
																		<div className="flex items-center gap-1 mt-0.5 flex-wrap">
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
																		</div>
																	</div>
																</div>
															</div>
														))
													)}
												</div>

												{/* Create new button at bottom of dropdown */}
												<div className="p-2 border-t border-primary/10">
													<Button
														size="sm"
														className="w-full bg-primary/90 hover:bg-primary text-xs"
														onClick={(e) => {
															e.stopPropagation();
															onCreateNew(contentType || 'project');
															setIsDropdownOpen(false);
														}}
													>
														<Plus className="h-3 w-3 mr-1" />
														New {contentType}
													</Button>
												</div>
											</div>
										)}
									</div>

									{/* Create new button */}
									<Button
										size="sm"
										className="w-full bg-primary/90 hover:bg-primary text-xs"
										onClick={() => onCreateNew(contentType || 'project')}
									>
										<Plus className="h-3 w-3 mr-1" />
										New {contentType}
									</Button>

									{/* Selected item summary */}
									{selectedItem && (
										<div className="mt-4 border border-primary/20 rounded-md p-3">
											<div className="text-sm font-medium mb-2 flex items-center justify-between">
												<span>{selectedItem.title}</span>
												<span
													className="text-xs cursor-pointer text-primary hover:text-primary/80"
													onClick={() => setViewMode('edit')}
												>
													<Pencil className="h-3 w-3 inline-block mr-1" />
													Edit
												</span>
											</div>
											<div className="text-xs text-primary/60 mb-1">{selectedItem.id}</div>
											<div className="flex flex-wrap gap-1 mt-1">
												{selectedItem.metadata?.status && (
													<span className={`text-xs px-1.5 py-0.5 rounded ${getStatusColor(selectedItem.metadata.status)}`}>
														{selectedItem.metadata.status}
													</span>
												)}
												{selectedItem.metadata?.proficiency && (
													<span className={`text-xs px-1.5 py-0.5 rounded ${getStatusColor(selectedItem.metadata.proficiency)}`}>
														{selectedItem.metadata.proficiency}
													</span>
												)}
												{selectedItem.metadata?.date && (
													<span className="text-xs text-primary/60 bg-primary/5 px-1.5 py-0.5 rounded">
														{selectedItem.metadata.date}
													</span>
												)}
											</div>
										</div>
									)}
								</div>
							</>
						)}
					</TabsContent>

					<TabsContent value="edit" className="m-0">
						{selectedItem && selectedEntity ? (
							<div className="p-4">
								<div className="mb-4 border-b border-primary/10 pb-2">
									<h3 className="text-sm font-medium">{selectedItem.title}</h3>
									<div className="text-xs text-primary/60">{selectedItem.id}</div>
								</div>

								{/* Field values table */}
								<div className="space-y-2">
									{fields.map(field => (
										<div key={field.id} className="grid grid-cols-2 items-center gap-2 border-b border-primary/5 pb-2">
											<div className="text-xs font-medium text-primary/80">
												{field.label} {field.required && <span className="text-destructive">*</span>}
											</div>
											<div className="text-xs overflow-hidden truncate">
												{getEntityValue(field.id)}
											</div>
										</div>
									))}
								</div>
							</div>
						) : (
							<div className="p-4 text-center text-sm text-primary/60">
								Select an item to view and edit its details
							</div>
						)}
					</TabsContent>
				</Tabs>
			</CardContent>
		</Card>
	);
} 