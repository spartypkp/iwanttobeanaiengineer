'use client';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textArea";
import { cn } from "@/lib/utils";
import { createSerializableSchema } from '@/utils/schema-serialization';
import { useChat } from '@ai-sdk/react';
import { type ObjectSchemaType } from '@sanity/types';
import { AlertCircle, Check, Loader2, Minus, Pencil, Plus, X } from "lucide-react";

import { useEffect, useMemo, useRef, useState } from 'react';


// Define our own ToolInvocation interface that includes all properties we need
interface ToolInvocation {
	toolName: string;
	toolCallId: string;
	state: 'partial-call' | 'call' | 'result';
	args: Record<string, any>;
	result?: any;
}

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
		// Create a context-aware initial message
		const docType = validSchemaType || 'document';
		const docTitle = documentData?.title || 'this content';
		const initialMessage = `Let's work on ${docTitle} together. Please help me flesh out the details for this ${docType}. What kind of information should I include?`;

		if (setIsTyping) setIsTyping(true);

		// Set the input value directly
		if (setInput) setInput(initialMessage);

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
				const response = await fetch('/api/content-copilot/get-conversation', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						documentId: document.id,
					}),
				});

				const data: ConversationResponse = await response.json();

				if (!response.ok) {
					throw new Error(`Failed to load conversation: ${data.error || response.status}`);
				}

				// Set conversation ID if available
				if (data.conversation) {
					setConversationId(data.conversation.id);

					// Set messages if available
					if (data.messages && data.messages.length > 0) {
						// Transform messages to ensure they have the proper structure
						const formattedMessages = data.messages.map((msg) => ({
							id: msg.external_id || msg.id,
							role: msg.role,
							content: msg.content,
							// Ensure parts are properly formatted for AI SDK consumption
							...(msg.parts ? { parts: msg.parts } : {})
						}));

						setLoadedMessages(formattedMessages);
					}
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
	}, [document, status]);

	// --- CHAT INTEGRATION ---
	// Initialize chat hooks with available data
	const {
		messages,
		input,
		handleInputChange,
		handleSubmit,
		setInput,
		addToolResult,
		isLoading: chatIsLoading
	} = useChat({
		api: '/api/content-copilot',
		body: {
			documentId: document.id || '',
			conversationId,
			schemaType: document.type || '',
			serializableSchema,
			documentData: document.data || {}
		},
		id: conversationId || undefined,
		initialMessages: loadedMessages,
		experimental_throttle: 50,
		onResponse: (response) => {
			// Extract conversation ID from headers if available
			const newConversationId = response.headers.get('X-Conversation-Id');
			if (newConversationId && (!conversationId || newConversationId !== conversationId)) {
				setConversationId(newConversationId);
			}
			// Show typing indicator
			setIsTyping(true);
		},
		onFinish: () => {
			// Hide typing indicator when response is complete
			setIsTyping(false);
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

	// Helper function to get document title
	const getDocumentTitle = () => {
		return document.data?.title || document.data?.name || `Untitled ${document.type}`;
	};

	// --- RENDERING ---
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

	// Main component render
	return (
		<div className="flex flex-col w-full h-full max-h-screen border rounded-md ">
			{/* Header */}
			<div className="border-b p-3 flex items-center justify-between shrink-0">
				<div className="flex items-center gap-2">
					<div className="space-y-1">
						<h3 className="text-sm font-semibold">Content Copilot Mode</h3>
						<p className="text-xs text-green-700">Working with: {getDocumentTitle()}</p>
					</div>
				</div>
				{conversationId && (
					<Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Conversation Active</Badge>
				)}
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
											: "bg-gray-100 text-gray-900 rounded-bl-sm mr-auto"
									)}
								>
									{message.role === 'user' ? (
										<p>{message.content}</p>
									) : (
										<div className="w-full">
											{message.parts?.map((part, index) => (
												<div key={index} className="w-full mb-2 last:mb-0">
													<MessagePart part={part} addToolResult={addToolResult} />
												</div>
											))}
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

// Updated MessagePart component
const MessagePart = ({ part, addToolResult }: {
	part: {
		type: string;
		text?: string;
		toolInvocation?: ToolInvocation;
	};
	addToolResult?: (result: { toolCallId: string; result: any; }) => void;
}) => {
	// This component handles rendering different types of message parts
	// When the conversation is loaded from the database, tool calls are
	// reconstructed from the tool_calls table and added to the message
	// as proper message parts with 'tool-invocation' type
	switch (part.type) {
		case 'text':
			return part.text ? (
				<div className="whitespace-pre-wrap prose prose-sm max-w-none prose-p:text-gray-800 prose-headings:text-gray-900 prose-a:text-emerald-600 prose-ol:pl-5 prose-ul:pl-5 prose-li:my-0 prose-ol:my-2 prose-ul:my-2 prose-ol:list-decimal prose-ul:list-disc">
					{part.text}
				</div>
			) : null;

		case 'tool-invocation':
			return part.toolInvocation ? (
				<div className="my-0.5 inline-block">
					<ToolInvocationDisplay toolInvocation={part.toolInvocation} addToolResult={addToolResult} />
				</div>
			) : null;

		case 'step-start':
			return <div className="my-1.5"><hr className="border-t border-gray-200" /></div>;
		default:
			return null;
	}
};

// Tool-specific components for handling tool invocations
const ToolInvocationDisplay = ({ toolInvocation, addToolResult }: { toolInvocation: ToolInvocation, addToolResult?: (result: { toolCallId: string; result: any; }) => void; }) => {
	switch (toolInvocation.toolName) {
		case 'writeField':
			return <ToolCallNotification toolInvocation={toolInvocation} />;
		case 'addToArray':
			return <ToolCallNotification toolInvocation={toolInvocation} />;
		case 'removeFromArray':
			return <ToolCallNotification toolInvocation={toolInvocation} />;
		default:
			// Fallback for any tool we don't have a specific component for
			return (
				<Card className="my-2 border border-gray-200 bg-white">
					<CardContent className="p-2 text-xs">
						<p className="font-semibold">Unknown tool: {toolInvocation.toolName}</p>
					</CardContent>
				</Card>
			);
	}
};

// Unified tool notification component that works for all tool types
const ToolCallNotification = ({ toolInvocation }: { toolInvocation: ToolInvocation; }) => {
	const { toolName, state, args, result } = toolInvocation;

	// Define tool-specific properties
	const getToolDetails = () => {
		switch (toolName) {
			case 'writeField':
				return {
					icon: Pencil,
					fieldName: args.fieldPath || result?.fieldPath,
					action: 'Updated',
					value: args.value || result?.value
				};
			case 'addToArray':
				return {
					icon: Plus,
					fieldName: args.arrayPath || result?.arrayPath,
					action: 'Added to',
					value: args.item || result?.item
				};
			case 'removeFromArray':
				return {
					icon: Minus,
					fieldName: args.arrayPath || result?.arrayPath,
					action: 'Removed from',
					value: args.itemKey || result?.itemKey
				};
			default:
				return {
					icon: AlertCircle,
					fieldName: 'unknown field',
					action: 'Modified',
					value: null
				};
		}
	};

	const { icon: Icon, fieldName, action, value } = getToolDetails();

	if (state === 'partial-call' || state === 'call') {
		return (
			<div className="inline-flex items-center gap-1.5 px-2 py-0.5 my-0.5 text-xs bg-blue-50 border border-blue-100 rounded-md text-blue-700">
				<Loader2 className="h-3 w-3 animate-spin" />
				<span className="text-blue-800 font-medium">{action} {fieldName}</span>
			</div>
		);
	}

	if (!result || !result.success) {
		return (
			<div className="inline-flex items-center gap-1.5 px-2 py-0.5 my-0.5 text-xs bg-red-50 border border-red-100 rounded-md text-red-700">
				<X className="h-3 w-3" />
				<span className="text-red-800 font-medium">Failed to {action.toLowerCase()} {fieldName}</span>
			</div>
		);
	}

	return (
		<div className="inline-flex items-center gap-1.5 px-2 py-0.5 my-0.5 text-xs bg-emerald-50 border border-emerald-100 rounded-md text-emerald-700">
			<Check className="h-3 w-3" />
			<span className="text-emerald-800 font-medium">{action} {fieldName}</span>
			<Icon className="h-3 w-3 ml-0.5 text-emerald-600" />
		</div>
	);
};

export default ContentCopilotView;
