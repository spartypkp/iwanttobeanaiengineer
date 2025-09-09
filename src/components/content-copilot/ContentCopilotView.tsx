'use client';
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
import { type Message as UIMessage } from "ai";
import { Check, Edit3, Loader2, X } from "lucide-react";
import { ToolDisplay } from "./tools/ToolDisplay";

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

// --- CHILD COMPONENTS FIRST (for clarity and to avoid hoisting issues with linters) ---
const ChatInputForm = ({
	input,
	hasMessages,
	handleInputChange,
	handleFormSubmit,
	isLoading,
	textAreaRef,
	documentData,
	validSchemaType,
	setIsTyping,
	setInput
}: {
	input: string;
	hasMessages: boolean;
	handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
	handleFormSubmit: (e: React.FormEvent) => void;
	isLoading: boolean;
	textAreaRef: React.RefObject<HTMLTextAreaElement>;
	documentData?: Record<string, any> | null;
	validSchemaType?: string | null;
	setIsTyping?: (isTyping: boolean) => void;
	setInput?: (value: string) => void;
}) => {
	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			handleFormSubmit(e as unknown as React.FormEvent);
		}
	};

	const startConversation = () => {
		const docType = validSchemaType || 'document';
		const docTitle = documentData?.title || 'this content';
		const regularMessage = `Let's work on ${docTitle} together. Please help me flesh out the details for this ${docType}. What kind of information should I include?`;

		if (setIsTyping) setIsTyping(true);
		if (setInput) setInput(regularMessage);

		setTimeout(() => {
			const syntheticEvent = { preventDefault: () => { } } as React.FormEvent;
			handleFormSubmit(syntheticEvent);
		}, 100);
	};

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
	messages: UIMessage[];
	error?: string;
}

// Define state for managing which message is being edited
interface EditingMessageState {
	id: string;
	content: string;
}

// Define the conversation mode type
type ConversationMode = 'regular' | 'refinement';

export const ContentCopilotView = (props: CustomSanityComponentProps) => {
	// --- STATE MANAGEMENT ---
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

	const [mode, setMode] = useState<ConversationMode>('regular');
	const [parentConversationId, setParentConversationId] = useState<string | null>(null);
	const [status, setStatus] = useState<'initializing' | 'loading' | 'ready' | 'error'>('initializing');
	const [error, setError] = useState<string | null>(null);
	const [conversationId, setConversationId] = useState<string | null>(null);
	const [isTyping, setIsTyping] = useState(false);
	const [loadedMessages, setLoadedMessages] = useState<UIMessage[]>([]);
	const [conversationLoaded, setConversationLoaded] = useState(false);
	const [editingMessage, setEditingMessage] = useState<EditingMessageState | null>(null);

	const messagesEndRef = useRef<HTMLDivElement>(null);
	const textAreaRef = useRef<HTMLTextAreaElement>(null);

	const documentIdFromProps = props.documentId;
	const schemaTypeFromProps = props.schemaType?.name;
	const documentDataFromProps = props.document.displayed;

	// --- SANITY FIELD HIGHLIGHTING (Hacky DOM Manipulation) ---
	// Defined earlier as it's a dependency for handleToolCall
	const attemptSanityFieldHighlight = useCallback((fieldPath: string) => {
		const scrollerElement = window.document.querySelector('[data-testid="document-panel-scroller"]') as HTMLElement | null;

		if (!scrollerElement) {
			console.warn("[ContentCopilotView] Sanity document panel scroller not found. Field highlighting may not work as expected.");
			const fieldElementForWindowScroll = window.document.querySelector(`[data-comments-field-id="${fieldPath}"]`) as HTMLElement | null;
			if (fieldElementForWindowScroll) {
				fieldElementForWindowScroll.scrollIntoView({ behavior: 'smooth', block: 'center' });
			} else {
				console.warn(`[ContentCopilotView] Fallback: Sanity field element not found in document for selector: [data-comments-field-id="${fieldPath}"]`);
				return;
			}
		}

		try {
			const targetSelector = `[data-comments-field-id="${fieldPath}"]`;
			const fieldElement = scrollerElement?.querySelector(targetSelector) as HTMLElement | null || window.document.querySelector(targetSelector) as HTMLElement | null;

			if (fieldElement) {
				if (scrollerElement) {
					const scrollerRect = scrollerElement.getBoundingClientRect();
					const fieldRect = fieldElement.getBoundingClientRect();
					const desiredScrollTop = scrollerElement.scrollTop + (fieldRect.top - scrollerRect.top) - (scrollerRect.height / 3);
					scrollerElement.scrollTo({
						top: desiredScrollTop,
						behavior: 'smooth'
					});
				} else {
					fieldElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
				}

				const originalOutline = fieldElement.style.outline;
				const originalBackgroundColor = fieldElement.style.backgroundColor;
				const originalBoxShadow = fieldElement.style.boxShadow;
				const originalTransition = fieldElement.style.transition;

				fieldElement.style.transition = 'outline 0.2s ease-in-out, background-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out';
				fieldElement.style.outline = '3px solid #FFBF00';
				fieldElement.style.backgroundColor = 'rgba(255, 191, 0, 0.1)';
				fieldElement.style.boxShadow = '0 0 15px rgba(255, 191, 0, 0.5)';
				fieldElement.style.padding = '2px';

				setTimeout(() => {
					fieldElement.style.outline = originalOutline;
					fieldElement.style.backgroundColor = originalBackgroundColor;
					fieldElement.style.boxShadow = originalBoxShadow;
					fieldElement.style.transition = originalTransition;
					fieldElement.style.padding = '';
				}, 3000);
			} else {
				console.warn(`[ContentCopilotView] Sanity field element not found for highlighting. Selector: ${targetSelector}`);
			}
		} catch (e) {
			console.error("[ContentCopilotView] Error during Sanity field highlighting:", e);
		}
	}, []);

	const apiRoute = mode === 'regular'
		? '/api/content-copilot/regular'
		: '/api/content-copilot/refinement';

	const serializableSchema = useMemo(() => {
		if (!props.schemaType) return null;
		return createSerializableSchema(props.schemaType);
	}, [props.schemaType]);

	useEffect(() => {
		if (documentIdFromProps && schemaTypeFromProps) {
			setDocument({
				id: documentIdFromProps,
				type: schemaTypeFromProps,
				data: documentDataFromProps,
				isValid: true
			});
			setStatus('loading');
		} else {
			setError('Missing required document properties');
			setStatus('error');
		}
	}, [documentIdFromProps, schemaTypeFromProps]);

	useEffect(() => {
		if (status !== 'loading' || !document.isValid) return;
		const loadConversation = async () => {
			try {
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

				if (data.conversation) {
					console.log(`[ContentCopilotView] Loaded ${mode} mode conversation:`, data.conversation.id);
					setConversationId(data.conversation.id);
					setLoadedMessages(data.messages || []);
				} else {
					console.log(`[ContentCopilotView] No existing ${mode} mode conversation found for document ${document.id}`);
					setConversationId(null);
					setLoadedMessages([]);
				}
				setConversationLoaded(true);
				setStatus('ready');
			} catch (error) {
				console.error('[ContentCopilotView] Failed to load conversation:', error);
				setError(`Error: ${error instanceof Error ? error.message : String(error)}`);
				setStatus('error');
			}
		};
		loadConversation();
	}, [status, mode, document.id, document.isValid]); // Added document.isValid back based on its usage

	const chatBody = useMemo(() => ({
		documentId: document.id || '',
		conversationId,
		parentConversationId: mode === 'refinement' ? parentConversationId : undefined,
		schemaType: document.type || '',
		serializableSchema,
		documentData: document.data || {},
	}), [document.id, conversationId, mode, parentConversationId, document.type, serializableSchema, document.data]);

	const handleChatResponse = useCallback((response: Response) => {
		const newConversationId = response.headers.get('X-Conversation-Id');
		if (newConversationId && (!conversationId || newConversationId !== conversationId)) {
			console.log(`[ContentCopilotView] Received new conversation ID (${newConversationId}), current was (${conversationId}). Will update state.`);
			setConversationId(newConversationId);
		}
		setIsTyping(true);
	}, [conversationId]);

	const handleChatFinish = useCallback((message: UIMessage) => {
		setIsTyping(false);
	}, []);

	const handleChatError = useCallback((error: Error) => {
		console.error("[ContentCopilotView] Chat API error:", error);
		setError(`API error: ${error.message}`);
		setIsTyping(false);
		setStatus('error');
	}, []);

	// handleToolCall depends on attemptSanityFieldHighlight, so it's defined after.
	// const handleToolCall = useCallback(
	// 	// Match the signature expected by the linter for onToolCall
	// 	({ toolCall }: { toolCall: { toolCallId: string; toolName: string; args: unknown; } | undefined; }) => {
	// 		// Guard against toolCall itself being undefined
	// 		if (!toolCall) {
	// 			console.warn("[ContentCopilotView] onToolCall's 'toolCall' property was falsy:", toolCall);
	// 			return;
	// 		}

	// 		console.log("[ContentCopilotView] onToolCall received (actual toolCall object):", toolCall);
	// 		const knownMutationTools = ['writeTool', 'deleteTool', 'arrayTool', 'updateDocumentField'];
	// 		const { toolName, args, toolCallId } = toolCall; // toolCallId is vital for addToolResult

	// 		if (knownMutationTools.includes(toolName)) {
	// 			let fieldPath: string | undefined = undefined;
	// 			if (args && typeof args === 'object' && args !== null) {
	// 				const coercedArgs = args as Record<string, any>;
	// 				fieldPath = coercedArgs.path || coercedArgs.fieldPath;
	// 			}

	// 			console.log(`[ContentCopilotView] onToolCall - Tool: ${toolName}, Extracted fieldPath: ${fieldPath}`);
	// 			if (fieldPath && typeof fieldPath === 'string') {
	// 				console.log(`[ContentCopilotView] onToolCall - Valid fieldPath found: \"${fieldPath}\". Triggering highlight.`);
	// 				attemptSanityFieldHighlight(fieldPath);
	// 			} else {
	// 				console.warn(`[ContentCopilotView] onToolCall - fieldPath is invalid, not a string, or args is not a suitable object. FieldPath: ${fieldPath}, Args:`, args);
	// 			}
	// 		} else {
	// 			console.log(`[ContentCopilotView] onToolCall - Tool (${toolName}) not in knownMutationTools, skipping highlight.`);
	// 		}

	// 		// WARNING: This onToolCall handler does not call addToolResult.
	// 		// The AI SDK expects addToolResult(toolCallId, result) to be called.
	// 		// Failure to do so will likely cause issues with the AI's operation.
	// 	},
	// 	[attemptSanityFieldHighlight]
	// );

	const {
		messages,
		input,
		handleInputChange,
		handleSubmit,
		setInput,
		addToolResult,
		isLoading: chatIsLoading,
		setMessages,
		append
	} = useChat({
		api: apiRoute,
		body: chatBody,
		id: conversationId || undefined,
		initialMessages: loadedMessages,
		sendExtraMessageFields: true,
		onResponse: handleChatResponse,
		onFinish: handleChatFinish,
		onError: handleChatError,
		// onToolCall: handleToolCall
	});

	useEffect(() => {
		if (messagesEndRef.current) {
			messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
		}
	}, [messages, isTyping]);

	useEffect(() => {
		if (textAreaRef.current) {
			adjustTextAreaHeight(textAreaRef.current);
		}
	}, []);

	const adjustTextAreaHeight = useCallback((target: HTMLTextAreaElement) => {
		if (!target || typeof target.style === 'undefined') {
			console.warn('[ContentCopilotView] Invalid textarea element for height adjustment');
			return;
		}
		try {
			target.style.height = 'auto';
			target.style.height = `${Math.min(target.scrollHeight + 2, 200)}px`;
		} catch (err) {
			console.warn('Error adjusting textarea height:', err);
		}
	}, []);

	const handleTextAreaInput = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
		handleInputChange(e);
		const textArea = e.target || textAreaRef.current;
		if (textArea) {
			adjustTextAreaHeight(textArea);
		}
	}, [handleInputChange, textAreaRef, adjustTextAreaHeight]);

	const handleFormSubmit = useCallback((e: React.FormEvent) => {
		e.preventDefault();
		if (!input.trim() && messages.length === 0) {
			if (messages.length > 0) return;
		}
		handleSubmit(e);
		setTimeout(() => {
			if (textAreaRef.current) {
				textAreaRef.current.focus();
				textAreaRef.current.style.height = '44px';
			}
		}, 0);
	}, [input, messages, handleSubmit, textAreaRef]);

	const handleEditSubmit = useCallback(async () => {
		if (!editingMessage || !conversationId) {
			console.warn('[ContentCopilotView] No message selected for editing or missing conversation ID.');
			setEditingMessage(null);
			return;
		}

		const messageIndex = messages.findIndex(msg => msg.id === editingMessage.id);
		if (messageIndex === -1) {
			console.error("[ContentCopilotView] Editing message not found in current messages array.");
			setEditingMessage(null);
			return;
		}

		const messagesToKeep = messages.slice(0, messageIndex);
		const editedContent = editingMessage.content;

		// Prevent submission if content is empty after edit
		if (!editedContent.trim()) {
			console.warn('[ContentCopilotView] Edited message content is empty. Aborting edit.');
			// Optionally, restore original content or provide feedback
			// For now, just cancel edit
			setEditingMessage(null);
			return;
		}

		setStatus('loading');
		try {
			// 1. Persist the truncated messages to the database
			const saveResponse = await fetch('/api/conversation/save-messages', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					conversationId: conversationId,
					messages: messagesToKeep,
				}),
			});

			if (!saveResponse.ok) {
				const errorData = await saveResponse.json();
				throw new Error(errorData.error || 'Failed to save truncated messages');
			}

			// 2. Update local chat state with truncated messages
			setMessages(messagesToKeep);

			// 3. Clear the editing state
			setEditingMessage(null);

			// 4. Append the edited message as a new user message.
			// This will also trigger the API call to /api/content-copilot/regular
			await append({
				role: 'user',
				content: editedContent,
				// id will be generated by useChat
			});

			// Reset input form height for the main input after submission
			if (textAreaRef.current) {
				textAreaRef.current.style.height = '44px';
				textAreaRef.current.focus();
			}

		} catch (err) {
			console.error("[ContentCopilotView] Failed to save edited message or resubmit:", err);
			setError(`Failed to apply edit: ${err instanceof Error ? err.message : String(err)}`);
			// Optionally, revert UI changes or reload messages if the save/append failed.
			// For now, just show error. User might need to refresh.
		} finally {
			// Set status to ready if not already set by an error in append (onError handler)
			// This assumes append() might trigger onError which sets status to 'error'
			// If append() succeeds, onFinish would eventually run.
			// It's tricky to set status here directly without knowing append's full lifecycle.
			// For now, let onError/onFinish handle status if they are triggered.
			// If error occurred above before append, status is 'error'. If not, it's 'loading'.
			// Let's ensure it goes to 'ready' if no error occurred within this block before append.
			// The chatIsLoading state from useChat should reflect if append is in progress.
			if (status !== 'error') {
				setStatus('ready');
			}
		}
	}, [editingMessage, conversationId, messages, setMessages, append, setInput, setStatus, setError, textAreaRef]);

	const switchToRefinementMode = useCallback(() => {
		setParentConversationId(conversationId);
		setConversationId(null);
		setLoadedMessages([]);
		setConversationLoaded(false);
		setMode('refinement');
		setStatus('loading');
	}, [conversationId]);

	const switchToRegularMode = useCallback(() => {
		setParentConversationId(null);
		setConversationId(null);
		setLoadedMessages([]);
		setConversationLoaded(false);
		setMode('regular');
		setStatus('loading');
	}, []);

	const handleModeChange = useCallback((value: string) => {
		console.log('[ContentCopilotView] Mode changed to:', value);
		if (value === 'refinement') {
			switchToRefinementMode();
		} else if (value === 'regular') {
			switchToRegularMode();
		}
	}, [switchToRefinementMode, switchToRegularMode]);

	const getDocumentTitle = useCallback(() => {
		return document.data?.title || document.data?.name || `Untitled ${document.type}`;
	}, [document.data, document.type]);

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
								<p>Refinement mode active. I&apos;ll help you improve your existing content by:</p>
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
						{messages.map((message: UIMessage) => (
							<div
								key={message.id}
								className={cn(
									"flex gap-2 mb-4 max-w-full",
									message.role === 'user' ? "flex-row-reverse" : "flex-row"
								)}
							>
								<div
									className={cn(
										"px-4 py-3 rounded-xl max-w-[85%] break-words relative group",
										message.role === 'user'
											? "bg-emerald-100 text-emerald-900 rounded-br-sm ml-auto"
											: "bg-gray-100 text-black rounded-bl-sm mr-auto"
									)}
								>
									{message.role === 'user' ? (
										editingMessage?.id === message.id ? (
											<div className="flex flex-col gap-2">
												<Textarea
													value={editingMessage.content}
													onChange={(e) => setEditingMessage({ ...editingMessage, content: e.target.value })}
													rows={3}
													className="text-sm text-black bg-white resize-none w-full p-2 border border-emerald-300 focus:ring-emerald-500"
												/>
												<div className="flex gap-2 justify-end">
													<Button
														size="sm"
														variant="ghost"
														onClick={() => setEditingMessage(null)}
														className="text-xs text-gray-600 hover:text-gray-800"
													>
														<X className="mr-1 h-3 w-3" /> Cancel
													</Button>
													<Button
														size="sm"
														onClick={handleEditSubmit}
														className="text-xs bg-emerald-500 hover:bg-emerald-600 text-white"
														disabled={chatIsLoading || status !== 'ready'}
													>
														<Check className="mr-1 h-3 w-3" /> Save & Resubmit
													</Button>
												</div>
											</div>
										) : (
											<>
												<p>{message.content}</p>
												{!chatIsLoading && status === 'ready' && (
													<Button
														variant="ghost"
														size="icon"
														className="absolute bottom-1 right-1 h-6 w-6 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity"
														onClick={() => setEditingMessage({ id: message.id, content: message.content })}
														title="Edit message"
													>
														<Edit3 className="h-3.5 w-3.5" />
														<span className="sr-only">Edit message</span>
													</Button>
												)}
											</>
										)
									) : (
										<div className="w-full">
											{Array.isArray(message.parts) && message.parts.map((part, partIndex) => (
												<div key={`${message.id}-part-${partIndex}`} className="w-full last:mb-0">
													{part.type === 'text' && (
														<div className="whitespace-pre-wrap prose prose-sm max-w-none prose-p:text-black prose-headings:text-black prose-a:text-emerald-600 prose-ol:pl-5 prose-ul:pl-5 prose-li:my-0 prose-ol:my-2 prose-ul:my-2 prose-ol:list-decimal prose-ul:list-disc mb-2 last:mb-0">
															{part.text}
														</div>
													)}
													{part.type === 'tool-invocation' && part.toolInvocation && (() => {
														// The highlighting logic is now moved to onToolCall handler

														return (
															<div className="flex flex-row">
																<div className="my-2 w-2/3">
																	<ToolDisplay toolCall={part.toolInvocation} addToolResult={addToolResult} />
																</div>
																<div className="w-1/3">

																</div>
															</div>
														);
													})()}
													{part.type === 'step-start' && partIndex > 0 && (
														<hr className="border-gray-300 w-2/3" />
													)}
													{!(part.type === 'text' ||
														(part.type === 'tool-invocation' && part.toolInvocation) ||
														(part.type === 'step-start')) && (
															<p className="text-xs text-gray-500 mb-2 last:mb-0">Unsupported/empty part type: {part.type}</p>
														)}
												</div>
											))}
											{((!Array.isArray(message.parts) || message.parts.length === 0) && message.content) && (
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

export default ContentCopilotView;