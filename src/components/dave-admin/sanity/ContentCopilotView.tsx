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
import { Loader2 } from "lucide-react";

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
	textAreaRef
}: {
	input: string;
	handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
	handleFormSubmit: (e: React.FormEvent) => void;
	isLoading: boolean;
	textAreaRef: React.RefObject<HTMLTextAreaElement>;
}) => {
	// Handle keyboard shortcuts
	const handleKeyDown = (e: React.KeyboardEvent) => {
		// Submit on Enter (without shift)
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			handleFormSubmit(e as unknown as React.FormEvent);
		}
	};

	return (
		<form onSubmit={handleFormSubmit} className="flex gap-2 items-end">
			<div className="relative flex-1 text-black">
				<Textarea
					ref={textAreaRef}
					value={input}
					onChange={handleInputChange}
					onKeyDown={handleKeyDown}
					placeholder={isLoading ? "Loading conversation..." : "Message Dave about this content... (Enter to send)"}
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

export const ContentCopilotView = (props: CustomSanityComponentProps) => {
	// Move all hooks to the top level
	const [isLoading, setIsLoading] = useState(false);
	const hasInitialized = useRef(false);

	const [conversationId, setConversationId] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [isTyping, setIsTyping] = useState(false);

	const messagesEndRef = useRef<HTMLDivElement>(null);
	const textAreaRef = useRef<HTMLTextAreaElement>(null);

	// The current document being edited
	const documentId: string = props.documentId;
	if (!documentId) {
		return (<div>Fetching documentId</div>);
	}
	// Type name of the current document 
	const schemaType: string = props.schemaType?.name;
	if (!schemaType) {
		return (<div>Fetching schemaType!</div>);
	}

	// Current actual data
	const documentData = props.document.displayed;
	if (!documentData) {
		return (<div>No actual document data!</div>);
	}

	const serializableSchema = useMemo(() =>
		createSerializableSchema(props.schemaType),
		[props.schemaType]
	);

	// Use the AI SDK's useChat hook with our specific setup
	const { messages, input, setInput, setMessages, handleInputChange, handleSubmit, addToolResult } = useChat({
		api: '/api/content-copilot',
		body: {
			documentId,
			conversationId,
			schemaType,
			serializableSchema,
			documentData
		},
		id: conversationId || undefined, // Use existing conversation ID if available
		experimental_throttle: 50, // Add throttling to reduce re-renders
		onResponse: (response) => {
			// Extract conversation ID from headers if available
			const newConversationId = response.headers.get('X-Conversation-Id');
			if (newConversationId && (!conversationId || newConversationId !== conversationId)) {
				console.log('Setting conversation ID from response:', newConversationId);
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
		}
	});

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

	// Load conversation when document changes
	useEffect(() => {
		// If no documentId, don't load conversation
		if (!documentId) return;

		const loadConversation = async () => {
			setIsLoading(true);
			setError(null);

			try {
				console.log("Loading conversation for document:", documentId);

				const response = await fetch('/api/content-copilot/get-conversation', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						documentId,
					}),
				});

				const data = await response.json();

				if (!response.ok) {
					console.error("Error response from API:", data);
					setError(`Failed to load conversation: ${data.error || response.status}`);
					return;
				}

				//console.log("Conversation loaded:", data);
				if (data.conversation) {
					setConversationId(data.conversation.id);
					// If there are previous messages, set them in the chat
					//console.log("Messages:", data.messages);
					if (data.messages && data.messages.length > 0) {
						// Reset and load the conversation history
						setMessages(data.messages);
					} else {
						// No messages in existing conversation
						setMessages([]);
					}
				} else {
					// No existing conversation, which is fine for new documents
					setConversationId(null);
					setMessages([]);
				}

				// Mark as initialized
				hasInitialized.current = true;
			} catch (error) {
				console.error('Failed to load conversation:', error);
				setError(`Error: ${error instanceof Error ? error.message : String(error)}`);
			} finally {
				setIsLoading(false);
			}
		};

		loadConversation();
	}, [documentId, setMessages]);

	// Auto-grow textarea
	const handleTextAreaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		handleInputChange(e);
		adjustTextAreaHeight(e.target);
	};

	// Helper function to adjust textarea height
	const adjustTextAreaHeight = (target: HTMLTextAreaElement) => {
		// Reset height to auto to get proper scrollHeight measurement
		target.style.height = 'auto';
		// Set height based on scrollHeight (plus small buffer)
		target.style.height = `${Math.min(target.scrollHeight + 2, 200)}px`;
	};

	// Handle form submission with improved UX
	const handleFormSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!input.trim()) return;
		console.log(`Handling form submit with input: ${input}`);

		// If this is the first message, we'll get a conversation ID from the response
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

	const getDocumentTitle = () => {
		return documentData.title || documentData.name || `Untitled ${schemaType}`;
	};

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

	// Try-catch only around rendering
	try {
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
					{isLoading ? (
						<div className="h-full flex flex-col items-center justify-center gap-3">
							<Loader2 className="h-8 w-8 animate-spin text-primary" />
							<p className="text-sm text-muted-foreground">Loading conversation...</p>
						</div>
					) : messages.length === 0 ? (
						<div className="h-full flex flex-col items-center justify-center text-center max-w-[500px] mx-auto gap-3">
							{!hasInitialized.current ? (
								<>
									<Loader2 className="h-8 w-8 animate-spin text-primary" />
									<p className="text-sm text-muted-foreground">Starting conversation...</p>
								</>
							) : (
								<>
									<Avatar className="h-12 w-12">
										<AvatarFallback className="text-lg">D</AvatarFallback>
									</Avatar>
									<h3 className="text-lg font-semibold">Ready to help with your content</h3>
									<p className="text-sm text-muted-foreground max-w-[400px]">
										Dave will help you create and edit content through natural conversation.
										Say hello to get started!
									</p>
								</>
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

							{isTyping && (
								<div className="flex gap-2 mb-4">
									<div className="px-4 py-3 rounded-xl rounded-bl-sm bg-gray-100 text-gray-900 max-w-[85%]">
										<div className="flex items-center gap-2">
											<p className="text-sm text-gray-600">Content Copilot is thinking</p>
											<div className="flex items-center h-4">
												<span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:0ms]"></span>
												<span className="mx-0.75 h-1.5 w-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:150ms]"></span>
												<span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:300ms]"></span>
											</div>
										</div>
									</div>
								</div>
							)}

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
						isLoading={isLoading}
						textAreaRef={textAreaRef}
					/>
				</div>
			</div>
		);
	} catch (error) {
		console.error("Unexpected error in ContentCopilotView:", error);
		return <div>{`Unexpected error: ${error instanceof Error ? error.message : String(error)}`}</div>;
	}
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
	// Use a stable ID based on the first few characters of the content
	const getStableId = (text: string) => {
		// Create a stable ID based on the first 20 chars of the content
		return `text-${text.substring(0, 20).replace(/[^a-zA-Z0-9]/g, '')}`;
	};

	switch (part.type) {
		case 'text':
			//console.log(`Text right before rendering: ${part.text}`);
			return part.text ? (
				<div className="whitespace-pre-wrap prose prose-sm max-w-none prose-p:text-gray-800 prose-headings:text-gray-900 prose-a:text-emerald-600 prose-ol:pl-5 prose-ul:pl-5 prose-li:my-0 prose-ol:my-2 prose-ul:my-2 prose-ol:list-decimal prose-ul:list-disc">
					{part.text}
				</div>
			) : null;

		case 'tool-invocation':
			return part.toolInvocation ?
				<ToolInvocationDisplay toolInvocation={part.toolInvocation} addToolResult={addToolResult} /> :
				null;
		case 'step-start':
			return <div className="my-2.5"><hr className="border-t border-gray-200" /></div>;
		default:
			return null;
	}
};

// Improve the ReferencedFieldTool to handle text overflow better
const ReferencedFieldTool = ({ toolInvocation }: { toolInvocation: ToolInvocation; }) => {
	const { state, args, result } = toolInvocation;

	switch (state) {
		case 'partial-call':
			return (
				<Card className="my-3 bg-blue-50 border border-blue-100">
					<CardContent className="p-3">
						<div className="flex items-center gap-2">
							<p className="text-blue-800">Fetching referenced content...</p>
							<Loader2 className="h-4 w-4 animate-spin text-blue-600" />
						</div>
					</CardContent>
				</Card>
			);
		case 'call':
			return (
				<Card className="my-3 bg-blue-50 border border-blue-100">
					<CardContent className="p-3">
						<p className="text-blue-800">Looking up referenced content from {args.referenceFieldPath}...</p>
					</CardContent>
				</Card>
			);
		case 'result':
			if (!result || !result.success) {
				return (
					<Card className="my-3 bg-amber-50 border border-amber-100">
						<CardContent className="p-3">
							<p className="text-amber-800">Failed to fetch referenced content: {result?.message || 'Unknown error'}</p>
						</CardContent>
					</Card>
				);
			}

			// Format the value for display
			let displayValue = '';
			if (typeof result.value === 'object') {
				try {
					displayValue = JSON.stringify(result.value, null, 2);
				} catch (e) {
					displayValue = '[Complex object]';
				}
			} else {
				displayValue = String(result.value);
			}

			return (
				<Card className="my-3 bg-blue-50 border border-blue-100">
					<CardContent className="p-3 space-y-3">
						<div className="flex items-center gap-2">
							<p className="font-semibold text-blue-800">Referenced Content</p>
							<Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200">
								{result.referencedDocumentType}
							</Badge>
						</div>

						<Card className="border border-gray-200 bg-white">
							<CardContent className="p-2 space-y-2">
								<p className="text-xs text-gray-600">
									From document: {result.referencedDocumentId.substring(0, 6)}...
								</p>
								<p className="text-xs text-gray-600">
									Field: {result.referencedFieldPath}
								</p>
								<div className="p-2 bg-gray-50 border border-gray-100 rounded max-w-full overflow-auto">
									<pre className="text-xs font-mono whitespace-pre-wrap break-words">
										{displayValue}
									</pre>
								</div>
							</CardContent>
						</Card>
					</CardContent>
				</Card>
			);
		default:
			return null;
	}
};

const WriteFieldTool = ({ toolInvocation }: { toolInvocation: ToolInvocation; }) => {
	const { state, args, result } = toolInvocation;

	switch (state) {
		case 'partial-call':
		case 'call':
			return (
				<Card className="my-3 bg-emerald-50 border border-emerald-100">
					<CardContent className="p-3">
						<div className="flex items-center gap-2">
							<p className="text-emerald-800">Updating {args?.fieldPath || 'document field'}...</p>
							<Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
						</div>
					</CardContent>
				</Card>
			);
		case 'result':
			if (!result || !result.success) {
				return (
					<Card className="my-3 bg-red-50 border border-red-100">
						<CardContent className="p-3">
							<p className="text-red-800">Failed to update field: {result?.message || 'Unknown error'}</p>
						</CardContent>
					</Card>
				);
			}

			const fieldPath = result.fieldPath || args.fieldPath;

			// Simple UI that just shows the field was updated
			return (
				<Card className="my-3 bg-emerald-50 border border-emerald-100">
					<CardContent className="p-2">
						<div className="flex items-center gap-2">
							<Badge variant="outline" className="bg-emerald-100 text-emerald-700 border-emerald-200">
								✓ Updated
							</Badge>
							<p className="text-sm text-emerald-800 font-medium">{fieldPath}</p>
						</div>
					</CardContent>
				</Card>
			);
		default:
			return null;
	}
};

// Tool-specific components for handling tool invocations
const ContentSuggestionTool = ({ toolInvocation, addToolResult }: { toolInvocation: ToolInvocation, addToolResult?: (result: { toolCallId: string; result: any; }) => void; }) => {
	const { toolCallId, state, args, result } = toolInvocation;

	switch (state) {
		case 'partial-call':
			return (
				<Card className="my-3 bg-emerald-50 border border-emerald-100">
					<CardContent className="p-3">
						<div className="flex items-center gap-2">
							<p className="text-emerald-800">Generating content suggestions...</p>
							<Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
						</div>
					</CardContent>
				</Card>
			);
		case 'call':
			return (
				<Card className="my-3 bg-emerald-50 border border-emerald-100">
					<CardContent className="p-3">
						<div className="flex items-center gap-2">
							<p className="font-semibold text-emerald-800">Generating suggestions for: </p>
							<Badge variant="outline" className="bg-emerald-100 text-emerald-700 border-emerald-200">{args.fieldPath}</Badge>
							<Loader2 className="h-4 w-4 animate-spin text-emerald-600 ml-auto" />
						</div>
					</CardContent>
				</Card>
			);
		case 'result':
			if (!result || !result.suggestions || !result.suggestions.suggestedOptions) {
				return (
					<Card className="my-3 bg-amber-50 border border-amber-100">
						<CardContent className="p-3">
							<p className="text-amber-800">No suggestions were generated.</p>
						</CardContent>
					</Card>
				);
			}

			const fieldPath = result.fieldPath || args.fieldPath;

			return (
				<Card className="my-3 border border-emerald-100">
					<CardContent className="p-3 space-y-3">
						<div className="flex items-center gap-2">
							<p className="font-semibold">Suggestions for: </p>
							<Badge variant="outline" className="bg-emerald-100 text-emerald-700 border-emerald-200">{fieldPath}</Badge>
						</div>

						{result.suggestions.suggestedOptions.map((suggestion: string, index: number) => (
							<Card key={index} className="border border-gray-200 bg-white">
								<CardContent className="p-3">
									<div className="flex flex-col space-y-3">
										<div className="bg-gray-50 border border-gray-100 rounded p-2 text-sm whitespace-pre-wrap break-words max-h-[120px] overflow-y-auto">
											{suggestion}
										</div>

										{addToolResult && (
											<div className="flex justify-end gap-2">
												<Button
													variant="outline"
													size="sm"
													className="h-8 text-xs bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
													onClick={() => {
														// Reject suggestion
														addToolResult({
															toolCallId,
															result: { success: false, rejected: true, fieldPath }
														});
													}}
												>
													Reject
												</Button>
												<Button
													variant="outline"
													size="sm"
													className="h-8 text-xs bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
													onClick={() => {
														// Accept suggestion
														addToolResult({
															toolCallId,
															result: { success: true, selection: suggestion, fieldPath }
														});
													}}
												>
													Accept
												</Button>
											</div>
										)}
									</div>
								</CardContent>
							</Card>
						))}
					</CardContent>
				</Card>
			);
		default:
			return null;
	}
};

// Component to handle all tool invocations
const ToolInvocationDisplay = ({ toolInvocation, addToolResult }: { toolInvocation: ToolInvocation, addToolResult?: (result: { toolCallId: string; result: any; }) => void; }) => {
	switch (toolInvocation.toolName) {
		case 'suggestContent':
			return <ContentSuggestionTool toolInvocation={toolInvocation} addToolResult={addToolResult} />;
		case 'readSubField':
			return <ReferencedFieldTool toolInvocation={toolInvocation} />;
		case 'writeField':
			return <WriteFieldTool toolInvocation={toolInvocation} />;
		default:
			// Fallback for any tool we don't have a specific component for
			return (
				<Card className="my-3 border border-gray-200 bg-white">
					<CardContent className="p-3 space-y-2">
						<p className="font-semibold">Tool: {toolInvocation.toolName}</p>
						<div className="p-2 bg-gray-50 border border-gray-100 rounded">
							<div className="max-w-full overflow-auto">
								<pre className="text-xs font-mono whitespace-pre-wrap break-words">
									{JSON.stringify(toolInvocation, null, 2)}
								</pre>
							</div>
						</div>
					</CardContent>
				</Card>
			);
	}
};


export default ContentCopilotView;
