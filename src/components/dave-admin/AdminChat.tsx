import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/toolTip';
import { useChat } from 'ai/react';
import { Check, Copy, Edit, Send, Trash2, User } from 'lucide-react';
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { AdminChatContextType, ContentType, KNOWLEDGE_FIELDS, PROJECT_FIELDS, SKILL_FIELDS } from './types';

// Create a context to share chat state
export const AdminChatContext = createContext<AdminChatContextType>({
	chatHooks: null,
	setChatHooks: () => { }
});

type AdminChatProps = {
	className?: string;
	initialQuery?: string;
	activeContentType?: ContentType;
	isEditMode?: boolean;
	selectedItemId?: string;
	onContentCreated?: (type: string, data: any) => void;
	onFieldsProgress?: (fields: string[]) => void;
};

export function AdminChat({
	className,
	initialQuery,
	activeContentType,
	isEditMode = false,
	selectedItemId = '',
	onContentCreated,
	onFieldsProgress
}: AdminChatProps) {
	// Access the shared context
	const { setChatHooks } = useContext(AdminChatContext);

	// Use the entity-specific API endpoint for better context awareness
	const chatHooks = useChat({
		api: activeContentType
			? `/api/dave-admin/${activeContentType}`
			: '/api/dave-admin',
		id: `dave-admin-chat-${activeContentType || 'general'}-${selectedItemId || 'new'}`,
		body: {
			entityId: selectedItemId,
			isEditMode: isEditMode
		},
		onFinish: (message) => {
			// When Dave responds, scan for completed fields
			if (activeContentType && onFieldsProgress) {
				const fieldsToCheck =
					activeContentType === 'project' ? PROJECT_FIELDS :
						activeContentType === 'knowledge' ? KNOWLEDGE_FIELDS :
							SKILL_FIELDS;

				// Simple heuristic to detect fields that have been filled
				const detectedFields = fieldsToCheck
					.filter(field =>
						message.content.toLowerCase().includes(field.label.toLowerCase() + ":") ||
						message.content.toLowerCase().includes("project " + field.label.toLowerCase())
					)
					.map(field => field.id);

				if (detectedFields.length > 0) {
					onFieldsProgress(detectedFields);
				}
			}
		}
	});

	// Share chat hooks through context
	useEffect(() => {
		setChatHooks(chatHooks);
	}, [chatHooks, setChatHooks]);

	const { messages, input, handleInputChange, handleSubmit, isLoading, setInput, setMessages } = chatHooks;

	const messagesEndRef = useRef<HTMLDivElement>(null);
	const [isTyping, setIsTyping] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);
	const [messageCount, setMessageCount] = useState(0);
	const [hasInitialMessage, setHasInitialMessage] = useState(false);

	// Update message count for the conversation status display
	useEffect(() => {
		setMessageCount(messages.length);
	}, [messages]);

	// Generate an appropriate welcome message based on entity type and mode
	const generateWelcomeMessage = useCallback(() => {
		// Don't regenerate if we already have messages
		if (messages.length > 0 || !activeContentType) return null;

		let welcomeMessage = '';

		if (isEditMode && selectedItemId) {
			// Messages for editing existing entities
			switch (activeContentType) {
				case 'project':
					welcomeMessage =
						`Hi there! I see you're editing an existing project (ID: ${selectedItemId}). 
						
						I'll help you update the information. Could you start by telling me what specific aspects of this project you'd like to modify? 
						
						Some common areas to update include:
						• Project description or overview
						• Technologies used
						• Status or timeline
						• Challenges and solutions
						• Links to GitHub or demos
						
						Or if you prefer, just tell me about the changes you want to make and I'll help organize the information.`;
					break;

				case 'skill':
					welcomeMessage =
						`Welcome back! I see you're editing an existing skill (ID: ${selectedItemId}).
						
						What would you like to update about this skill? I can help with:
						• Adjusting proficiency level
						• Adding examples of how you've used it
						• Updating years of experience
						• Adding related projects
						• Refining the description
						
						Just let me know what changes you'd like to make!`;
					break;

				case 'knowledge':
					welcomeMessage =
						`Hello! I'm ready to help you edit this knowledge base entry (ID: ${selectedItemId}).
						
						What aspects would you like to update? We could work on:
						• Refining the content
						• Adding related resources
						• Updating the question format
						• Adding more keywords for better findability
						• Linking to projects or other knowledge items
						
						Let me know what you'd like to focus on!`;
					break;
			}
		} else if (activeContentType) {
			// Messages for creating new entities
			switch (activeContentType) {
				case 'project':
					welcomeMessage =
						`Exciting! Let's create a new project for your portfolio.
						
						To get started, I'd love to hear a bit about this project:
						• What's it called?
						• What problem does it solve?
						• What technologies did you use?
						
						Don't worry about structure - just tell me about it conversationally, and I'll help organize the information as we go. You can be as detailed or brief as you like to start.`;
					break;

				case 'skill':
					welcomeMessage =
						`Great! Let's add a new skill to your portfolio.
						
						Tell me about this skill:
						• What's the name of the skill?
						• How would you rate your proficiency (beginner, intermediate, advanced, expert)?
						• How have you applied this skill in your work?
						
						Just chat naturally about it, and I'll help structure the information appropriately.`;
					break;

				case 'knowledge':
					welcomeMessage =
						`Let's create a new knowledge base entry for Dave to use when answering questions.
						
						To get started:
						• What topic does this knowledge cover?
						• What are the key points someone should know about it?
						• What questions might someone ask that this knowledge would help answer?
						
						Feel free to just talk about it naturally, and I'll help organize it into the right format.`;
					break;
			}
		}

		return welcomeMessage;
	}, [activeContentType, isEditMode, selectedItemId, messages.length]);

	// Send initial welcome message
	useEffect(() => {
		const welcomeMessage = generateWelcomeMessage();

		if (welcomeMessage && !hasInitialMessage) {
			// Add the AI welcome message
			setMessages(prev => [
				...prev,
				{
					id: `welcome-${Date.now()}`,
					content: welcomeMessage,
					role: 'assistant',
					createdAt: new Date()
				}
			]);

			setHasInitialMessage(true);
		}
	}, [generateWelcomeMessage, hasInitialMessage, setHasInitialMessage, setMessages]);

	// Reset initial message state when content type or mode changes
	useEffect(() => {
		setHasInitialMessage(false);
	}, [activeContentType, isEditMode, selectedItemId]);

	// Handle initialQuery
	useEffect(() => {
		if (initialQuery && messages.length === 0) {
			// Instead of setting the input, we now directly submit as the user
			setMessages([
				{
					id: `initial-${Date.now()}`,
					content: initialQuery,
					role: 'user',
					createdAt: new Date()
				}
			]);

			// Focus the input after a moment
			setTimeout(() => {
				inputRef.current?.focus();
			}, 100);
		}
	}, [initialQuery, messages.length, setMessages]);

	// Auto-scroll to bottom when new messages arrive
	useEffect(() => {
		if (messagesEndRef.current) {
			messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
		}
	}, [messages]);

	// Simulate typing indicator when loading
	useEffect(() => {
		if (isLoading) {
			setIsTyping(true);
		} else {
			// Keep typing indicator visible for a short time after response starts
			const timer = setTimeout(() => setIsTyping(false), 500);
			return () => clearTimeout(timer);
		}
	}, [isLoading]);

	// Handle clear conversation
	const handleClearConversation = () => {
		if (window.confirm('Are you sure you want to clear the conversation history?')) {
			setMessages([]);
			setHasInitialMessage(false);
			inputRef.current?.focus();
		}
	};

	// Get conversation status
	const getConversationStatus = () => {
		if (messages.length === 0) {
			return 'No messages';
		}

		const lastMessage = messages[messages.length - 1];
		const isAwaitingResponse = lastMessage?.role === 'user' && isLoading;

		if (isAwaitingResponse) {
			return 'Waiting for response...';
		}

		const messageStatus = messageCount === 1
			? '1 message'
			: `${messageCount} messages`;

		if (activeContentType) {
			return `${messageStatus} · ${isEditMode ? 'Editing' : 'Creating'} ${activeContentType}`;
		}

		return messageStatus;
	};

	// Format message content to support basic markdown
	const formatMessageContent = (content: string) => {
		// Convert markdown-style code blocks
		const formattedContent = content
			.replace(/```(\w+)?\n([\s\S]*?)\n```/g, '<pre><code class="language-$1">$2</code></pre>')
			// Convert inline code
			.replace(/`([^`]+)`/g, '<code>$1</code>')
			// Convert bold text
			.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
			// Convert italic text
			.replace(/\*([^*]+)\*/g, '<em>$1</em>')
			// Format bullet points
			.replace(/^• (.+)$/gm, '<span class="flex"><span class="mr-2">•</span><span>$1</span></span>')
			// Convert line breaks to <br>
			.replace(/\n\n/g, '<br><br>')
			.replace(/\n/g, '<br>');

		return formattedContent;
	};

	// Format timestamp for messages
	const formatTimestamp = (timestamp: number | Date) => {
		const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
		return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
	};

	// Copy message content to clipboard
	const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);

	const copyToClipboard = (text: string, messageId: string) => {
		navigator.clipboard.writeText(text).then(() => {
			setCopiedMessageId(messageId);
			setTimeout(() => setCopiedMessageId(null), 2000);
		});
	};

	// Quick responses based on content type
	const getQuickResponses = () => {
		if (!activeContentType) return [];

		switch (activeContentType) {
			case 'project':
				return [
					"Add more details about technologies used",
					"Describe the project challenges",
					"What was the timeline?",
					"Add GitHub repository link"
				];
			case 'skill':
				return [
					"What's my proficiency level?",
					"How have I used this skill?",
					"Add example projects",
					"Years of experience?"
				];
			case 'knowledge':
				return [
					"Related projects?",
					"Add more context",
					"Any resources to link?",
					"How is this implemented?"
				];
			default:
				return [];
		}
	};

	// Send a quick response
	const sendQuickResponse = (response: string) => {
		setInput(response);
		setTimeout(() => {
			handleSubmit(new Event('submit') as any);
		}, 100);
	};

	// Handle keyboard shortcuts
	const handleKeyDown = (e: React.KeyboardEvent) => {
		// Ctrl+Enter to submit
		if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
			e.preventDefault();
			handleSubmit(e as any);
		}
	};

	// Now return the JSX content
	return (
		<Card className={`${className} h-[100%] bg-card border-primary/20 shadow-[0_0_10px_rgba(var(--primary-rgb),0.2)]`}>
			<CardHeader className="px-4 py-3 border-b border-primary/20">
				<div className="flex justify-between items-center">
					<CardTitle className="text-md font-medium text-primary flex items-center">
						<div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center mr-2">
							<Edit className="h-4 w-4 text-primary" />
						</div>
						{isEditMode ? 'Edit' : 'Create'} {activeContentType || 'Content'} {isEditMode && selectedItemId ? `(ID: ${selectedItemId})` : ''}
					</CardTitle>

					{/* Conversation actions */}
					<div className="flex items-center gap-2">
						<div className="text-xs text-primary/60 mr-2">
							{getConversationStatus()}
						</div>

						{messages.length > 0 && (
							<Button
								onClick={handleClearConversation}
								variant="ghost"
								size="sm"
								className="h-8 text-xs text-primary/70 hover:text-primary hover:bg-primary/10"
							>
								<Trash2 className="h-3 w-3 mr-1" />
								Clear
							</Button>
						)}
					</div>
				</div>
			</CardHeader>

			{/* Messages container */}
			<CardContent className="p-0 flex flex-col h-[calc(100%-56px)]">
				<div className="flex-grow overflow-y-auto p-4 terminal-scrollbar max-h-[calc(100vh-240px)]">
					{/* Welcome message */}
					{messages.length === 0 && (
						<div className="mb-4 text-center">
							<div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mx-auto mb-3">
								<Edit className="h-6 w-6 text-primary" />
							</div>
							<h3 className="text-lg font-medium mb-2 text-foreground">Dave Content Assistant</h3>
							<p className="text-sm text-primary/70 mb-4 max-w-md mx-auto">
								{activeContentType
									? `Ready to help you ${isEditMode ? 'edit' : 'create'} a ${activeContentType}. I'll walk you through the process.`
									: 'Select a content type from the sidebar to begin, or ask me any questions about managing your portfolio content.'}
							</p>
							{activeContentType && (
								<div className="text-xs text-primary/60 mt-2 max-w-md mx-auto">
									<p className="border border-primary/20 rounded-md p-2 bg-primary/5">
										Tip: Be specific about what you want to add. For example, tell Dave about the project name, description, and technologies used.
									</p>
								</div>
							)}
						</div>
					)}

					{/* Message history */}
					<div className="space-y-4" aria-live="polite" role="log">
						{messages.map((message, i) => {
							const isUser = message.role === 'user';
							const timestamp = message.createdAt ? formatTimestamp(message.createdAt) : '';
							const messageId = `message-${i}`;
							const isCopied = copiedMessageId === messageId;

							return (
								<div
									key={i}
									className={`flex items-start gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}
									role="article"
									aria-label={`${isUser ? 'Your message' : 'Dave assistant message'}`}
								>
									{!isUser && (
										<div
											className="h-8 w-8 rounded-full bg-primary/20 flex-shrink-0 flex items-center justify-center"
											aria-hidden="true"
										>
											<Edit className="h-4 w-4 text-primary" />
										</div>
									)}

									<div className="flex flex-col max-w-[80%]">
										<div className={`rounded-lg p-3 relative group ${isUser
											? 'bg-primary/60 text-primary-foreground'
											: 'bg-primary/10 text-foreground border border-primary/20'
											}`}>
											{/* Corner triangles for chat bubbles */}
											<div
												className={`absolute top-3 ${isUser ? 'right-[-8px]' : 'left-[-8px]'} w-0 h-0 
													border-y-[8px] border-y-transparent
													${isUser
														? 'border-l-[8px] border-l-primary/60'
														: 'border-r-[8px] border-r-primary/10'
													}`}
												aria-hidden="true"
											/>

											{/* Copy button - appears on hover */}
											<TooltipProvider>
												<Tooltip>
													<TooltipTrigger asChild>
														<button
															onClick={() => copyToClipboard(message.content, messageId)}
															className={`absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity ${isUser ? 'text-primary-foreground/70' : 'text-primary/70'
																} hover:${isUser ? 'text-primary-foreground' : 'text-primary'}`}
															aria-label={isCopied ? "Copied to clipboard" : "Copy to clipboard"}
														>
															{isCopied ?
																<Check className="h-4 w-4" /> :
																<Copy className="h-4 w-4" />
															}
														</button>
													</TooltipTrigger>
													<TooltipContent>
														<p>{isCopied ? 'Copied!' : 'Copy message'}</p>
													</TooltipContent>
												</Tooltip>
											</TooltipProvider>

											{/* Message content with markdown support */}
											<div
												dangerouslySetInnerHTML={{ __html: formatMessageContent(message.content) }}
												className="chat-message-content pr-6"
											/>

											{/* Timestamp */}
											<div
												className={`text-xs mt-1 ${isUser ? 'text-primary-foreground/70' : 'text-primary/60'}`}
												aria-label={`Sent at ${timestamp}`}
											>
												{timestamp}
											</div>
										</div>

										{/* Quick responses - only after AI messages and if not the last message */}
										{!isUser && i === messages.length - 1 && activeContentType && (
											<div className="flex flex-wrap gap-2 mt-2" role="group" aria-label="Quick responses">
												{getQuickResponses().map((response, idx) => (
													<button
														key={idx}
														onClick={() => sendQuickResponse(response)}
														className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors border border-primary/20"
														aria-label={`Quick response: ${response}`}
													>
														{response}
													</button>
												))}
											</div>
										)}
									</div>

									{isUser && (
										<div
											className="h-8 w-8 rounded-full bg-primary/60 flex-shrink-0 flex items-center justify-center"
											aria-hidden="true"
										>
											<User className="h-4 w-4 text-primary-foreground" />
										</div>
									)}
								</div>
							);
						})}

						{/* Typing indicator */}
						{isTyping && (
							<div
								className="flex items-start gap-2 justify-start"
								aria-live="polite"
								aria-label="Dave is typing"
							>
								<div className="h-8 w-8 rounded-full bg-primary/20 flex-shrink-0 flex items-center justify-center">
									<Edit className="h-4 w-4 text-primary" />
								</div>
								<div className="max-w-[80%] rounded-lg p-3 bg-primary/10 border border-primary/20">
									<div className="typing-indicator">
										<div className="dot"></div>
										<div className="dot"></div>
										<div className="dot"></div>
									</div>
								</div>
							</div>
						)}
					</div>

					{/* Auto-scroll anchor */}
					<div ref={messagesEndRef} />
				</div>

				{/* Input area */}
				<div className="border-t border-primary/20 p-4 mt-auto">
					<form onSubmit={handleSubmit} className="flex flex-col gap-2" role="form" aria-label="Message form">
						<div className="flex gap-2 items-start">
							<Input
								ref={inputRef}
								className="flex-1 min-h-[60px] bg-card border-primary/30 text-foreground focus:ring-primary py-3 px-4"
								value={input}
								placeholder={activeContentType
									? `Tell Dave about your ${activeContentType}...`
									: "Ask a question or provide information..."}
								onChange={handleInputChange}
								onKeyDown={handleKeyDown}
								aria-label="Message input"
							/>
							<Button
								type="submit"
								size="icon"
								disabled={isLoading}
								className="bg-primary/90 hover:bg-primary text-primary-foreground h-[60px] w-[60px]"
								aria-label="Send message"
							>
								<Send className="h-5 w-5" />
							</Button>
						</div>
						<div className="flex justify-between items-center">
							<div className="text-xs text-primary/60" aria-live="polite">
								{input.length > 0 ? `${input.length} characters` : ''}
							</div>
							<div className="text-xs text-primary/60">
								<kbd className="px-1 py-0.5 bg-primary/10 rounded text-[10px] border border-primary/20">Ctrl</kbd> +
								<kbd className="px-1 py-0.5 bg-primary/10 rounded text-[10px] border border-primary/20 ml-1">Enter</kbd> to send
							</div>
						</div>
					</form>
				</div>
			</CardContent>

			{/* Add CSS for the chat UI */}
			<style jsx global>{`
				.typing-indicator {
					display: flex;
					align-items: center;
					margin: 0.2rem 0;
				}
				
				.typing-indicator .dot {
					display: inline-block;
					width: 0.5rem;
					height: 0.5rem;
					border-radius: 50%;
					background-color: var(--primary-color, currentColor);
					margin-right: 0.25rem;
					animation: typing-dot 1.3s infinite ease-in-out;
					opacity: 0.5;
				}
				
				.typing-indicator .dot:nth-child(1) {
					animation-delay: 0s;
				}
				
				.typing-indicator .dot:nth-child(2) {
					animation-delay: 0.2s;
				}
				
				.typing-indicator .dot:nth-child(3) {
					animation-delay: 0.4s;
					margin-right: 0;
				}
				
				@keyframes typing-dot {
					0%, 60%, 100% { transform: translateY(0); }
					30% { transform: translateY(-0.25rem); }
				}
				
				.chat-message-content code {
					font-family: monospace;
					background-color: rgba(var(--primary-rgb), 0.1);
					padding: 0.1rem 0.3rem;
					border-radius: 0.25rem;
				}
				
				.chat-message-content pre {
					background-color: rgba(var(--primary-rgb), 0.1);
					padding: 0.5rem;
					border-radius: 0.25rem;
					overflow-x: auto;
					margin: 0.5rem 0;
				}
				
				.chat-message-content pre code {
					background-color: transparent;
					padding: 0;
				}
			`}</style>
		</Card>
	);
} 