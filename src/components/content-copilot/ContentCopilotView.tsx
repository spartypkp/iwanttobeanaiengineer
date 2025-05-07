'use client';
import { ToolDisplay } from "@/components/content-copilot/tools/ToolDisplay";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textArea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import { createSerializableSchema } from '@/utils/schema-serialization';
import { useChat } from '@ai-sdk/react';
import { type ObjectSchemaType } from '@sanity/types';
import { Message, UIMessage } from "ai";
import { Loader2 } from "lucide-react";

import { useEffect, useMemo, useRef, useState } from 'react';

// Custom components have the following props:
// document – an object containing the various document states and their data
// documentId – the ID of the current document
// schemaType – the schema type of the current document
interface CustomSanityComponentProps {
	document: {
		published?: Record<string, any> | null;
		draft?: Record<string, any> | null;
		displayed: Record<string, any>;
		historical?: Record<string, any> | null;
	};
	documentId: string;
	schemaType: ObjectSchemaType;
}

// Interface for conversation API response
interface ConversationResponse {
	conversation: {
		id: string;
		title: string;
		[key: string]: any;
	} | null;
	messages: Array<{
		id: string;
		external_id?: string;
		role: string;
		content: string;
		parts?: Array<{
			type: string;
			[key: string]: any;
		}>;
		[key: string]: any;
	}>;
	error?: string;
}



// Define the conversation mode type
type ConversationMode = 'regular' | 'refinement';

export const ContentCopilotView = (props: CustomSanityComponentProps) => {
	// --- STATE MANAGEMENT ---
	// Document state - consolidated into a single object
	const [document, setDocument] = useState<{
		id: string | null;
		type: string | null;
		data: Record<string, any> | null;
		isValid: boolean;
	}>({
		id: null,
		type: null,
		data: null,
		isValid: false
	});

	// Track mode - keep this state outside of the reset
	const [mode, setMode] = useState<ConversationMode>('regular');
	const [parentConversationId, setParentConversationId] = useState<string | null>(null);

	// Simplified loading state using a single enum
	const [status, setStatus] = useState<'initializing' | 'loading' | 'ready' | 'error'>('initializing');
	const [error, setError] = useState<string | null>(null);

	// Conversation state
	const [conversationId, setConversationId] = useState<string | null>(null);
	const [isTyping, setIsTyping] = useState(false);
	const [loadedMessages, setLoadedMessages] = useState<any[]>([]);
	const [conversationLoaded, setConversationLoaded] = useState(false);

	// Refs
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const textAreaRef = useRef<HTMLTextAreaElement>(null);

	// Extract values from props immediately
	const documentId = props.documentId;
	const schemaType = props.schemaType?.name;
	const documentData = props.document.displayed;

	// Determine the API route based on mode
	const apiRoute = mode === 'regular'
		? '/api/content-copilot/regular'
		: '/api/content-copilot/refinement';

	// Memoize the schema serialization to prevent expensive recalculations
	const serializableSchema = useMemo(() => {
		if (!props.schemaType) return null;
		return createSerializableSchema(props.schemaType);
	}, [props.schemaType]);

	// --- DOCUMENT VALIDATION ---
	// Single effect to validate document and set initial state
	useEffect(() => {
		// Validate document properties
		if (documentId && schemaType && documentData) {
			// Set document state
			setDocument({
				id: documentId,
				type: schemaType,
				data: documentData,
				isValid: true
			});

			// Move to loading state
			setStatus('loading');
		} else {
			setError('Missing required document properties');
			setStatus('error');
		}
	}, [documentId]);



	// --- CONVERSATION LOADING ---
	// Effect to handle conversation loading
	useEffect(() => {
		// Only proceed if we're in the loading state and have a valid document
		if (status !== 'loading' || !document.isValid) return;

		// Async function to load conversation
		const loadConversation = async () => {
			try {
				console.log(`Loading conversation for document ${document.id} in ${mode} mode`);
				const response = await fetch('/api/conversation/get', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						documentId: document.id,
						mode,
					}),
				});

				const data: ConversationResponse = await response.json();

				if (!response.ok) {
					throw new Error(`Failed to load conversation: ${data.error || response.status}`);
				}

				// Set conversation ID if available
				if (data.conversation) {
					console.log(`[DEBUG] Loaded ${mode} mode conversation:`, data.conversation.id);
					setConversationId(data.conversation.id);

					// Set messages if available
					if (data.messages && data.messages.length > 0) {
						// Transform messages to ensure they have the proper structure
						const formattedMessages = data.messages.map((msg) => {
							// Log the first message with tool parts for debugging
							if (msg.parts?.some(part => part.type === 'tool-invocation')) {
								const toolParts = msg.parts.filter(part => part.type === 'tool-invocation');
								console.log(`[DEBUG] Message ${msg.id} has ${toolParts.length} tool part(s)`);

								// Log the first tool part state
								if (toolParts.length > 0 && toolParts[0].toolInvocation) {
									console.log(`[DEBUG] First tool part - Name: ${toolParts[0].toolInvocation.toolName}, State: ${toolParts[0].toolInvocation.state}`);
								}
							}

							return {
								id: msg.external_id || msg.id,
								role: msg.role,
								content: msg.content,
								// Ensure parts are properly formatted with preserved state
								...(msg.parts ? {
									parts: msg.parts.map(part => {
										if (part.type === 'tool-invocation' && part.toolInvocation) {
											// Make sure the state and result are preserved
											console.log(`[DEBUG] Preserving tool state: ${part.toolInvocation.toolName}, State: ${part.toolInvocation.state}, HasResult: ${!!part.toolInvocation.result}`);
											return {
												...part,
												toolInvocation: {
													...part.toolInvocation,
													// Ensure state is 'result' if there's a result
													state: part.toolInvocation.result ? 'result' : part.toolInvocation.state
												}
											};
										}
										return part;
									})
								} : {})
							};
						});

						setLoadedMessages(formattedMessages);
					} else {
						// Clear messages if none exist
						setLoadedMessages([]);
					}
				} else {
					// No existing conversation found
					console.log(`No existing ${mode} mode conversation found`);
					setConversationId(null);
					setLoadedMessages([]);
				}

				// Mark conversation as loaded
				setConversationLoaded(true);
				setStatus('ready');

			} catch (error) {
				console.error('Failed to load conversation:', error);
				setError(`Error: ${error instanceof Error ? error.message : String(error)}`);
				setStatus('error');
			}
		};

		loadConversation();
	}, [document, status, mode]);

	// --- CHAT INTEGRATION ---
	// Initialize chat hooks with available data
	const {
		messages,
		input,
		handleInputChange,
		handleSubmit,
		setInput,
		addToolResult,
		isLoading: chatIsLoading,
		setMessages
	} = useChat({
		api: apiRoute,
		body: {
			documentId: document.id || '',
			conversationId,
			parentConversationId: mode === 'refinement' ? parentConversationId : undefined,
			schemaType: document.type || '',
			serializableSchema,
			documentData: document.data || {},
		},
		id: conversationId || undefined,
		initialMessages: loadedMessages,
		onResponse: (response) => {
			// Extract conversation ID from headers if available
			const newConversationId = response.headers.get('X-Conversation-Id');
			if (newConversationId && (!conversationId || newConversationId !== conversationId)) {
				console.log(`Received new conversation ID: ${newConversationId}`);
				setConversationId(newConversationId);
			}
			// Show typing indicator
			setIsTyping(true);
		},
		onFinish: async (message: Message) => {
			// Hide typing indicator when response is complete
			setIsTyping(false);
			// Get the last message from the message array
			const lastMessage = messages[messages.length - 1];
			console.log(`Last message received from AI SDK:`, lastMessage);

			// Save the assistant's message with standard format
			if (conversationId) {
				saveMessage(lastMessage);
			}
		},
		onError: (error) => {
			console.error("Chat API error:", error);
			setError(`API error: ${error.message}`);
			setIsTyping(false);
			setStatus('error');
		}
	});

	// --- UI EFFECTS ---
	// Auto-scroll to the bottom when new messages arrive
	useEffect(() => {
		if (messagesEndRef.current) {
			messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
		}
	}, [messages, isTyping]);

	// Adjust textarea height on mount and input change
	useEffect(() => {
		if (textAreaRef.current) {
			adjustTextAreaHeight(textAreaRef.current);
		}
	}, []);

	// --- HELPER FUNCTIONS ---
	// Auto-grow textarea function
	const handleTextAreaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		handleInputChange(e);
		// Use the input event target or fall back to the ref
		const textArea = e.target || textAreaRef.current;
		if (textArea) {
			adjustTextAreaHeight(textArea);
		}
	};

	// Helper function to adjust textarea height
	const adjustTextAreaHeight = (target: HTMLTextAreaElement) => {
		// Skip if target is undefined or doesn't have style property
		if (!target || typeof target.style === 'undefined') {
			console.warn('Invalid textarea element for height adjustment');
			return;
		}

		try {
			// Reset height to auto to get proper scrollHeight measurement
			target.style.height = 'auto';
			// Set height based on scrollHeight (plus small buffer)
			target.style.height = `${Math.min(target.scrollHeight + 2, 200)}px`;
		} catch (err) {
			console.warn('Error adjusting textarea height:', err);
		}
	};

	// Handle form submission with improved UX
	const handleFormSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!input.trim()) {
			return;
		}

		// Save user message if we have a conversation ID


		handleSubmit(e);

		// Focus back on textarea after sending
		setTimeout(() => {
			if (textAreaRef.current) {
				textAreaRef.current.focus();
				// Reset textarea height
				textAreaRef.current.style.height = '44px';
			}
		}, 0);
	};

	// Helper function to save messages
	const saveMessage = async (message: UIMessage) => {
		if (!conversationId) return;

		try {
			const response = await fetch('/api/conversation/save-message', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					conversationId,
					message
				}),
			});

			if (!response.ok) {
				console.error('Failed to save message:', await response.text());
			}
		} catch (error) {
			console.error('Error saving message:', error);
		}
	};

	// Handle switching to refinement mode
	const switchToRefinementMode = () => {
		// Store current conversation ID as parent for refinement
		setParentConversationId(conversationId);

		// Reset conversation state for the new mode
		setConversationId(null);
		setLoadedMessages([]);
		setConversationLoaded(false);

		// Set to refinement mode
		setMode('refinement');

		// Trigger reload
		setStatus('loading');
	};

	// Handle switching to regular mode
	const switchToRegularMode = () => {
		// Reset parent conversation ID
		setParentConversationId(null);

		// Reset conversation state for the new mode
		setConversationId(null);
		setLoadedMessages([]);
		setConversationLoaded(false);

		// Set to regular mode
		setMode('regular');

		// Trigger reload
		setStatus('loading');
	};

	// Handle mode change
	const handleModeChange = (value: string) => {
		console.log('handleModeChange', value);
		if (value === 'refinement') {
			switchToRefinementMode();
		} else if (value === 'regular') {
			switchToRegularMode();
		}
	};

	// Helper function to get document title
	const getDocumentTitle = () => {
		return document.data?.title || document.data?.name || `Untitled ${document.type}`;
	};

	// --- RENDERING ---
	// Add debugging for development
	useEffect(() => {
		console.log(`============= State Update =============`);
		console.log(`Mode: ${mode}`);
		console.log(`Status: ${status}`);
		console.log(`ConversationId: ${conversationId}`);
		console.log(`ParentConversationId: ${parentConversationId}`);
		console.log(`Messages: ${loadedMessages.length}`);
		console.log(`API Route: ${apiRoute}`);
		console.log(`=======================================`);
	}, [mode, status, conversationId, parentConversationId, loadedMessages, apiRoute]);

	// Handle error state
	if (error) {
		return (
			<Card className="w-full p-4 bg-red-50 border border-red-100">
				<div className="flex items-center gap-2 mb-2">
					<h3 className="text-lg font-semibold text-red-800">Content Copilot Error</h3>
					<Badge variant="outline" className="bg-red-100 text-red-700 border-red-200">Error</Badge>
				</div>
				<p className="text-sm text-red-800">{error}</p>
			</Card>
		);
	}

	// Main component render - using key to force full component remount when mode changes
	return (
		<div key={`content-copilot-${mode}`} className="flex flex-col w-full h-full max-h-screen border rounded-md">
			{/* Header with mode toggle */}
			<div className="border-b p-3 flex items-center justify-between shrink-0">
				<div className="flex items-center gap-2">
					<div className="space-y-1">
						<h3 className="text-sm font-semibold">
							Content Copilot {mode === 'refinement' && '- Refinement Mode'}
						</h3>
						<p className="text-xs text-green-700">Working with: {getDocumentTitle()}</p>
					</div>
				</div>
				<div className="flex items-center gap-2">
					<ToggleGroup type="single" value={mode} onValueChange={handleModeChange}>
						<ToggleGroupItem value="regular" aria-label="Regular Creation">
							Brainstorm
						</ToggleGroupItem>
						<ToggleGroupItem
							value="refinement"
							aria-label="Refinement Mode"
							disabled={!conversationId && mode === 'regular'}
						>
							Refinement
						</ToggleGroupItem>
					</ToggleGroup>
				</div>
			</div>

			{/* Message area */}
			<div className="flex-1 p-4 overflow-y-auto overflow-x-hidden">
				{status !== 'ready' ? (
					<div className="h-full flex flex-col items-center justify-center gap-3">
						<Loader2 className="h-8 w-8 animate-spin text-primary" />
						<p className="text-sm text-muted-foreground">
							{status === 'initializing' ? 'Initializing content...' : 'Loading conversation...'}
						</p>
					</div>
				) : messages.length === 0 ? (
					<div className="h-full flex flex-col items-center justify-center text-center max-w-[500px] mx-auto gap-4">
						<Avatar className="h-12 w-12">
							<AvatarFallback className="text-lg">D</AvatarFallback>
						</Avatar>
						<h3 className="text-lg font-semibold">Ready to help with your content</h3>
						{mode === 'refinement' && (
							<div className="text-sm text-muted-foreground">
								<p>Refinement mode active. I'll help you improve your existing content by:</p>
								<ul className="list-disc list-inside mt-2 text-left">
									<li>Enhancing clarity and impact</li>
									<li>Improving technical precision</li>
									<li>Strengthening narrative flow</li>
									<li>Ensuring voice consistency</li>
									<li>Optimizing for readability and SEO</li>
								</ul>
							</div>
						)}
					</div>
				) : (
					<>
						{messages.map((message) => (
							<div
								key={message.id}
								className={cn(
									"flex gap-2 mb-4 max-w-full",
									message.role === 'user' ? "flex-row-reverse" : "flex-row"
								)}
							>
								<div
									className={cn(
										"px-4 py-3 rounded-xl max-w-[85%] break-words",
										message.role === 'user'
											? "bg-emerald-100 text-emerald-900 rounded-br-sm ml-auto"
											: "bg-gray-100 text-black rounded-bl-sm mr-auto"
									)}
								>
									{message.role === 'user' ? (
										<p>{message.content}</p>
									) : (
										<div className="w-full">
											{Array.isArray(message.content) ? (
												message.content.map((part, partIndex) => (
													<div key={`${message.id}-part-${partIndex}`} className="w-full mb-2 last:mb-0">
														{part.type === 'text' ? (
															<div className="whitespace-pre-wrap prose prose-sm max-w-none prose-p:text-black prose-headings:text-black prose-a:text-emerald-600 prose-ol:pl-5 prose-ul:pl-5 prose-li:my-0 prose-ol:my-2 prose-ul:my-2 prose-ol:list-decimal prose-ul:list-disc">
																{part.text}
															</div>
														) : part.type === 'tool-invocation' ? (
															<ToolDisplay toolCall={part.toolInvocation} addToolResult={addToolResult} />
														) : part.type === 'tool-result' ? (
															null // Don't render tool results separately, they get handled with the tool calls
														) : part.type === 'step-start' || part.type === 'step-finish' ? (
															null // Skip step events
														) : (
															<p className="text-xs text-red-600">Unsupported part type: {part.type}</p>
														)}
													</div>
												))
											) : (
												<div className="whitespace-pre-wrap prose prose-sm max-w-none prose-p:text-black prose-headings:text-black prose-a:text-emerald-600 prose-ol:pl-5 prose-ul:pl-5 prose-li:my-0 prose-ol:my-2 prose-ul:my-2 prose-ol:list-decimal prose-ul:list-disc">
													{message.content}
												</div>
											)}
										</div>
									)}
								</div>
							</div>
						))}

						<div ref={messagesEndRef} />
					</>
				)}
			</div>

			{/* Input area */}
			<div className="border-t p-3 shrink-0 bg-white">
				<ChatInputForm
					input={input}
					handleInputChange={handleTextAreaInput}
					handleFormSubmit={handleFormSubmit}
					isLoading={status !== 'ready' || chatIsLoading}
					textAreaRef={textAreaRef}
					hasMessages={messages.length > 0}
					documentData={document.data}
					validSchemaType={document.type}
					setIsTyping={setIsTyping}
					setInput={setInput}
				/>
			</div>
		</div>
	);
};

// Extract the input form to prevent unnecessary re-renders
const ChatInputForm = ({
	input,
	handleInputChange,
	handleFormSubmit,
	isLoading,
	textAreaRef,
	hasMessages,
	documentData,
	validSchemaType,
	setIsTyping,
	setInput
}: {
	input: string;
	handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
	handleFormSubmit: (e: React.FormEvent) => void;
	isLoading: boolean;
	textAreaRef: React.RefObject<HTMLTextAreaElement>;
	hasMessages: boolean;
	documentData?: Record<string, any> | null;
	validSchemaType?: string | null;
	setIsTyping?: (isTyping: boolean) => void;
	setInput?: (value: string) => void;
}) => {
	// Handle keyboard shortcuts
	const handleKeyDown = (e: React.KeyboardEvent) => {
		// Submit on Enter (without shift)
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			handleFormSubmit(e as unknown as React.FormEvent);
		}
	};

	// Function to start a new conversation
	const startConversation = () => {
		// Create a context-aware regular message
		const docType = validSchemaType || 'document';
		const docTitle = documentData?.title || 'this content';
		const regularMessage = `Let's work on ${docTitle} together. Please help me flesh out the details for this ${docType}. What kind of information should I include?`;

		if (setIsTyping) setIsTyping(true);

		// Set the input value directly
		if (setInput) setInput(regularMessage);

		// Submit after a short delay to ensure the input is set
		setTimeout(() => {
			const syntheticEvent = { preventDefault: () => { } } as React.FormEvent;
			handleFormSubmit(syntheticEvent);
		}, 100);
	};

	// If there are no messages yet, show the start button instead of the input
	if (!hasMessages) {
		return (
			<div className="flex flex-col gap-3 items-center justify-center p-4 text-center">
				<p className="text-sm text-black">
					Content Copilot will help you create and edit content through natural conversation.
				</p>
				<Button
					onClick={startConversation}
					className="mt-1"
					disabled={isLoading}
				>
					{isLoading ? (
						<>
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							Starting...
						</>
					) : (
						"Start Conversation"
					)}
				</Button>
			</div>
		);
	}

	// Regular input form when conversation is already started
	return (
		<form onSubmit={handleFormSubmit} className="flex gap-2 items-end">
			<div className="relative flex-1 text-black">
				<Textarea
					ref={textAreaRef}
					value={input}
					onChange={handleInputChange}
					onKeyDown={handleKeyDown}
					placeholder={isLoading
						? "Loading conversation..."
						: "Message Content Copilot about this content... (Enter to send)"
					}
					rows={1}
					disabled={isLoading}
					className="resize-none min-h-[44px] max-h-[200px] w-full p-3 text-sm text-black bg-white"
				/>
			</div>
			<Button
				type="submit"
				size="icon"
				disabled={isLoading || !input.trim()}
				className="h-[44px] w-[44px] shrink-0"
			>
				<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
					<path d="M5 12h14"></path>
					<path d="m12 5 7 7-7 7"></path>
				</svg>
				<span className="sr-only">Send</span>
			</Button>
		</form>
	);
};

export default ContentCopilotView;