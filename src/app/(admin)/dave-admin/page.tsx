"use client";

import { AdminChat, AdminChatContext } from '@/components/dave-admin/AdminChat';
import { ContentProgressTracker } from '@/components/dave-admin/ContentProgressTracker';
import { ContentSidebar } from '@/components/dave-admin/ContentSidebar';
import { ContentItem, ContentType, KNOWLEDGE_FIELDS, PROJECT_FIELDS, SKILL_FIELDS } from '@/components/dave-admin/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useChat } from 'ai/react';
import { useState } from 'react';

export default function DaveAdminPage() {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [password, setPassword] = useState('');
	const [loginError, setLoginError] = useState('');
	const [chatHooks, setChatHooks] = useState<ReturnType<typeof useChat> | null>(null);

	// Content state
	const [activeContentType, setActiveContentType] = useState<ContentType>(null);
	const [isEditMode, setIsEditMode] = useState(false);
	const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
	const [completedFields, setCompletedFields] = useState<string[]>([]);

	const normalizeType = (type: string): ContentType => {
		switch (type.toLowerCase()) {
			case 'project':
				return 'project';
			case 'skill':
				return 'skill';
			case 'knowledge':
				return 'knowledge';
			default:
				return null;
		}
	};

	// Simplified login function - in a real app, use proper authentication
	const handleLogin = (e: React.FormEvent) => {
		e.preventDefault();
		if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD || password === 'testpass123') {
			setIsLoggedIn(true);
			setLoginError('');
		} else {
			setLoginError('Invalid password');
		}
	};

	// Logout function
	const handleLogout = () => {
		setIsLoggedIn(false);
		setPassword('');
	};

	// Handle content type change from the sidebar
	const handleContentTypeChange = (type: Exclude<ContentType, null>) => {
		// Only change if it's actually different
		if (type !== activeContentType) {
			setActiveContentType(type);
			setIsEditMode(false);
			setSelectedItem(null);
			setCompletedFields([]);

			// Reset the chat if we have access to its hooks
			if (chatHooks) {
				chatHooks.setMessages([]);
			}
		}
	};

	// Create new content
	const handleCreateNew = (type: Exclude<ContentType, null>) => {
		setActiveContentType(type);
		setIsEditMode(false);
		setSelectedItem(null);
		setCompletedFields([]);

		// Reset the chat if we have access to its hooks
		if (chatHooks) {
			chatHooks.setMessages([]);
		}
	};

	// Select existing content
	const handleExistingItemSelect = (item: ContentItem) => {
		setActiveContentType(normalizeType(item.type));
		setIsEditMode(true);
		setSelectedItem(item);
		setCompletedFields([]);

		// Reset the chat if we have access to its hooks
		if (chatHooks) {
			chatHooks.setMessages([]);
		}
	};

	// Track field completion progress
	const handleFieldsProgress = (fields: string[]) => {
		setCompletedFields(prev => {
			const newFields = fields.filter(f => !prev.includes(f));
			return [...prev, ...newFields];
		});
	};

	// Handle content creation callback
	const handleContentCreated = (type: string, data: any) => {
		console.log(`New ${type} created:`, data);
		// In a real app, this would save the content to your database
	};

	// Login page
	if (!isLoggedIn) {
		return (
			<div className="container mx-auto max-w-lg py-16">
				<Card className="border-primary/20 shadow-lg">
					<CardContent className="p-6">
						<div className="text-center mb-6">
							<h1 className="text-2xl font-bold mb-2">Dave Admin Access</h1>
							<p className="text-primary/70">Enter password to access Dave's content management</p>
						</div>
						<form onSubmit={handleLogin} className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="password">Password</Label>
								<Input
									id="password"
									type="password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									placeholder="Enter admin password"
									className="border-primary/30"
								/>
								{loginError && <p className="text-destructive text-sm">{loginError}</p>}
							</div>
							<Button type="submit" className="w-full">Login</Button>
						</form>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<AdminChatContext.Provider value={{ chatHooks, setChatHooks }}>
			<div className="container mx-auto py-6">
				<div className="flex justify-between items-center mb-6">
					<h1 className="text-2xl font-bold">Dave Admin Interface</h1>
					<Button variant="outline" onClick={handleLogout}>Logout</Button>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
					<div className="lg:col-span-1 space-y-6">
						{/* Content sidebar with type selector */}
						<ContentSidebar
							contentType={activeContentType}
							onSelectItem={handleExistingItemSelect}
							onCreateNew={handleCreateNew}
							onContentTypeChange={handleContentTypeChange}
							isEditMode={isEditMode}
							selectedItem={selectedItem}
						/>

						{/* Field completion tracker */}
						{activeContentType && (
							<ContentProgressTracker
								contentType={activeContentType}
								fields={
									activeContentType === 'project' ? PROJECT_FIELDS :
										activeContentType === 'knowledge' ? KNOWLEDGE_FIELDS :
											SKILL_FIELDS
								}
								completedFields={completedFields}
							/>
						)}
					</div>

					{/* Chat interface */}
					<div className="lg:col-span-3 h-[calc(100vh-150px)]">
						<AdminChat
							className="h-full"
							activeContentType={activeContentType}
							isEditMode={isEditMode}
							selectedItemId={selectedItem?.id}
							onContentCreated={handleContentCreated}
							onFieldsProgress={handleFieldsProgress}
						/>
					</div>
				</div>
			</div>
		</AdminChatContext.Provider>
	);
} 