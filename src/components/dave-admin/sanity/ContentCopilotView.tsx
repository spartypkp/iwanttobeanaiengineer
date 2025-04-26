'use client';

import { useChat } from '@ai-sdk/react';
import { Avatar, Badge, Box, Button, Card, Flex, Spinner, Stack, Text, TextArea } from '@sanity/ui';
import { Component, ErrorInfo, ReactNode, useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';

// Error boundary component to catch rendering errors
class ErrorBoundary extends Component<{ children: ReactNode; }, { hasError: boolean; error: Error | null; }> {
	constructor(props: { children: ReactNode; }) {
		super(props);
		this.state = { hasError: false, error: null };
	}

	static getDerivedStateFromError(error: Error) {
		return { hasError: true, error };
	}

	componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		console.error("ContentCopilotView caught error:", error);
		console.error("Component stack:", errorInfo.componentStack);
	}

	render() {
		if (this.state.hasError) {
			return (
				<Card padding={4} radius={2} tone="critical">
					<Stack space={4}>
						<Text size={2} weight="semibold">Error in AI Assistant</Text>
						<Text size={1}>Something went wrong while loading the AI Assistant.</Text>
						<Card padding={3} radius={2} tone="caution">
							<Text size={0} style={{ fontFamily: 'monospace', overflowWrap: 'break-word' }}>
								{this.state.error?.message || 'Unknown error'}
							</Text>
						</Card>
					</Stack>
				</Card>
			);
		}

		return this.props.children;
	}
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
	schemaType: Record<string, any>;
}

// Message type with additional properties for UI
interface UIMessage {
	id: string;
	role: 'user' | 'assistant' | 'system';
	content: string;
	timestamp?: Date;
	isNew?: boolean;
}

export const ContentCopilotView = (props: CustomSanityComponentProps) => {
	console.log("ContentCopilotView rendering with props:", {
		documentId: props.documentId,
		schemaType: props.schemaType?.name || 'unknown',
		documentExists: !!props.document,
	});

	// Move all hooks to the top level
	const [isLoading, setIsLoading] = useState(false);
	const [conversationId, setConversationId] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [loadAttempt, setLoadAttempt] = useState(0);
	const [isTyping, setIsTyping] = useState(false);
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const textAreaRef = useRef<HTMLTextAreaElement>(null);

	// Extract safe values from props with defaults
	const documentId = props.documentId || '';
	const schemaType = props.schemaType || { name: 'unknown' };
	const documentData = props.document?.displayed || {};
	const documentType = schemaType.name || 'document';

	const { messages, input, setInput, setMessages, append, handleInputChange, handleSubmit } = useChat({
		api: '/api/content-copilot',
		body: {
			documentData,
			schemaType: { name: schemaType.name },
			documentId,
			conversationId,
		},
		maxSteps: 5,
		id: conversationId || undefined,
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
		}
	});

	// Check for required props and set error state if missing
	useEffect(() => {
		if (!props.documentId) {
			setError("Missing document ID");
			return;
		}

		if (!props.schemaType) {
			setError("Missing schema type");
			return;
		}

		if (!props.document) {
			setError("Document data unavailable");
			return;
		}

		if (!props.document.displayed) {
			setError("Document data unavailable");
			return;
		}

		// Only load on first render or when explicitly triggered
		if (loadAttempt === 0) {
			setLoadAttempt(1);
		}
	}, [props.documentId, props.schemaType, props.document, loadAttempt]);

	// Load conversation when document changes or retrying
	useEffect(() => {
		if (loadAttempt === 0 || !documentId) return;

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
						// Pass minimal schema info to avoid circular references
						schemaType: { name: schemaType.name }
					}),
				});

				const data = await response.json();

				if (!response.ok) {
					console.error("Error response from API:", data);
					setError(`Failed to load conversation: ${data.error || response.status}`);
					return;
				}

				console.log("Conversation loaded:", data);
				if (data.conversation) {
					setConversationId(data.conversation.id);
					// If there are previous messages, set them in the chat
					if (data.messages && data.messages.length > 0) {
						// Reset and load the conversation history
						setMessages(data.messages);
					}
				}
			} catch (error) {
				console.error('Failed to load conversation:', error);
				setError(`Error: ${error instanceof Error ? error.message : String(error)}`);
			} finally {
				setIsLoading(false);
			}
		};

		// Reset messages when document changes
		setMessages([]);
		loadConversation();
	}, [documentId, loadAttempt, schemaType.name, setMessages]);

	// Scroll to bottom when messages change
	useEffect(() => {
		if (messagesEndRef.current) {
			messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
		}
	}, [messages, isTyping]);

	// Reset conversation functionality
	const handleResetConversation = async () => {
		if (confirm('Are you sure you want to start a new conversation? This will discard the current conversation history.')) {
			setConversationId(null);
			setMessages([]);
			setError(null);
		}
	};

	// Retry loading conversation
	const handleRetry = () => {
		setError(null);
		setLoadAttempt(curr => curr + 1);
	};

	// Handle form submission with improved UX
	const handleFormSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!input.trim()) return;

		handleSubmit(e);

		// Focus back on textarea after sending
		setTimeout(() => {
			if (textAreaRef.current) {
				textAreaRef.current.focus();
			}
		}, 0);
	};

	// Auto-grow textarea
	const handleTextAreaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		handleInputChange(e);

		const target = e.target;
		// Reset height to auto to get proper scrollHeight measurement
		target.style.height = 'auto';
		// Set height based on scrollHeight (plus small buffer)
		target.style.height = `${Math.min(target.scrollHeight + 2, 200)}px`;
	};

	// Handle keyboard shortcuts
	const handleKeyDown = (e: React.KeyboardEvent) => {
		// Submit on Enter (without shift)
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			handleFormSubmit(e as unknown as React.FormEvent);
		}
	};

	const getDocumentTitle = () => {
		return documentData.title || documentData.name || `Untitled ${documentType}`;
	};

	if (error) {
		return (
			<Card padding={4} radius={2} tone="caution">
				<Stack space={4}>
					<Flex align="center" gap={2}>
						<Text size={2} weight="semibold">AI Assistant Error</Text>
						<Badge tone="critical" size={1}>Error</Badge>
					</Flex>
					<Text size={1}>{error}</Text>
					<Button
						text="Try Again"
						tone="primary"
						onClick={handleRetry}
						style={{ width: 'fit-content' }}
					/>
				</Stack>
			</Card>
		);
	}

	// Try-catch only around rendering
	try {
		return (
			<Card height="fill" style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
				{/* Header */}
				<Card tone="default" padding={3} borderBottom>
					<Flex align="center" justify="space-between">
						<Flex align="center" gap={2}>
							<Avatar initials="D" size={1} />
							<Stack space={2}>
								<Text size={1} weight="semibold">Dave Assistant</Text>
								<Text size={0} muted>Working with: {getDocumentTitle()}</Text>
							</Stack>
						</Flex>
						{messages.length > 0 && (
							<Button
								mode="bleed"
								text="New Conversation"
								tone="primary"
								onClick={handleResetConversation}
								icon="reset"
								fontSize={1}
							/>
						)}
					</Flex>
				</Card>

				{/* Message area */}
				<Box
					flex={1}
					overflow="auto"
					padding={4}
					style={{
						backgroundColor: 'var(--card-bg-color)',
						display: 'flex',
						flexDirection: 'column',
						width: '100%'
					}}
				>
					{isLoading ? (
						<Flex align="center" justify="center" direction="column" gap={3} style={{ height: '100%' }}>
							<Spinner />
							<Text size={1} muted>Loading conversation...</Text>
						</Flex>
					) : messages.length === 0 ? (
						<Flex
							direction="column"
							align="center"
							justify="center"
							gap={3}
							style={{ height: '100%', textAlign: 'center', maxWidth: '500px', margin: '0 auto' }}
						>
							<Avatar initials="D" size={2} />
							<Text size={2} weight="semibold">How can I help with this {documentType}?</Text>
							<Text size={1} muted style={{ maxWidth: '400px' }}>
								I can help you create and edit content by having a conversation. Just ask me questions or tell me what you&apos;d like to change.
							</Text>
							<Flex gap={2} marginTop={3}>
								<Button
									text={`Summarize this ${documentType}`}
									tone="primary"
									fontSize={1}
									onClick={() => append({
										role: 'user',
										content: `Can you summarize the key information about this ${documentType}?`
									})}
								/>
								<Button
									text="Suggest improvements"
									tone="primary"
									mode="ghost"
									fontSize={1}
									onClick={() => append({
										role: 'user',
										content: `What improvements would you suggest for this ${documentType}?`
									})}
								/>
							</Flex>
						</Flex>
					) : (
						<>
							{messages.map((message, index) => (
								<Flex
									key={message.id}
									direction={message.role === 'user' ? 'row-reverse' : 'row'}
									gap={2}
									marginBottom={4}
								>
									<Avatar
										initials={message.role === 'user' ? 'Y' : 'D'}
										color={message.role === 'user' ? 'blue' : 'gray'}
										size={0}
										style={{ flexShrink: 0, marginTop: '2px' }}
									/>
									<Card
										radius={2}
										shadow={1}
										tone={message.role === 'user' ? 'primary' : 'default'}
										style={{
											maxWidth: '85%',
											marginLeft: message.role === 'user' ? 'auto' : '0',
											marginRight: message.role === 'user' ? '0' : 'auto',
											padding: '12px 16px',
											borderRadius: '14px',
											borderBottomLeftRadius: message.role === 'user' ? '14px' : '2px',
											borderBottomRightRadius: message.role === 'user' ? '2px' : '14px'
										}}
									>
										{message.role === 'user' ? (
											<Text size={1}>{message.content}</Text>
										) : (
											<div className="markdown-content">
												<ReactMarkdown>{message.content}</ReactMarkdown>
											</div>
										)}
									</Card>
								</Flex>
							))}

							{isTyping && (
								<Flex direction="row" gap={2} marginBottom={4}>
									<Avatar
										initials="D"
										size={0}
										style={{ flexShrink: 0, marginTop: '2px' }}
									/>
									<Card
										radius={2}
										shadow={1}
										style={{
											maxWidth: '85%',
											padding: '12px 16px',
											borderRadius: '14px',
											borderBottomLeftRadius: '2px'
										}}
									>
										<Flex align="center" gap={2}>
											<Text size={1} muted>Dave is typing</Text>
											<div className="typing-indicator">
												<span></span>
												<span></span>
												<span></span>
											</div>
										</Flex>
									</Card>
								</Flex>
							)}

							<div ref={messagesEndRef} />
						</>
					)}
				</Box>

				{/* Input area */}
				<Card padding={[3, 4]} borderTop style={{ backgroundColor: 'var(--card-bg-color)', width: '100%' }}>
					<form onSubmit={handleFormSubmit} style={{ width: '100%' }}>
						<Flex gap={2} align="flex-end" style={{ width: '100%' }}>
							<TextArea
								ref={textAreaRef}
								value={input}
								onChange={handleTextAreaInput}
								onKeyDown={handleKeyDown}
								placeholder={isLoading ? "Loading conversation..." : "Message Dave about this content... (Enter to send)"}
								rows={1}
								disabled={isLoading}
								style={{
									resize: 'none',
									minHeight: '44px',
									maxHeight: '200px',
									flex: 1,
									padding: '12px',
									borderRadius: '4px',
									border: '1px solid var(--card-border-color)',
									fontSize: '14px',
									lineHeight: '1.4',
									width: '100%'
								}}
							/>
							<Button
								type="submit"
								icon="arrow-right"
								tone="primary"
								disabled={isLoading || !input.trim()}
								style={{
									alignSelf: 'flex-end',
									height: '44px',
									width: '44px',
									padding: 0,
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center'
								}}
							/>
						</Flex>
					</form>
				</Card>

				{/* CSS for typing indicator and markdown */}
				<style jsx global>{`
					.typing-indicator {
						display: flex;
						align-items: center;
					}
					
					.typing-indicator span {
						height: 8px;
						width: 8px;
						background: var(--card-muted-fg-color);
						border-radius: 50%;
						display: inline-block;
						margin-right: 3px;
						animation: bounce 1.3s linear infinite;
					}
					
					.typing-indicator span:nth-child(2) {
						animation-delay: 0.15s;
					}
					
					.typing-indicator span:nth-child(3) {
						animation-delay: 0.3s;
						margin-right: 0;
					}
					
					@keyframes bounce {
						0%, 60%, 100% { transform: translateY(0); }
						30% { transform: translateY(-4px); }
					}
					
					.markdown-content p {
						margin: 0.5em 0;
					}
					
					.markdown-content p:first-child {
						margin-top: 0;
					}
					
					.markdown-content p:last-child {
						margin-bottom: 0;
					}
					
					.markdown-content pre {
						background: var(--card-code-bg-color, #2d2d2d);
						padding: 0.75em;
						border-radius: 4px;
						overflow-x: auto;
						margin: 0.75em 0;
					}
					
					.markdown-content code {
						font-family: monospace;
						font-size: 0.9em;
						background: var(--card-code-inline-bg-color, rgba(0,0,0,0.05));
						padding: 2px 4px;
						border-radius: 3px;
					}
					
					.markdown-content pre code {
						background: transparent;
						padding: 0;
					}
					
					.markdown-content ul, .markdown-content ol {
						margin: 0.5em 0;
						padding-left: 1.5em;
					}
				`}</style>
			</Card>
		);
	} catch (error) {
		console.error("Unexpected error in ContentCopilotView:", error);
		return renderError(`Unexpected error: ${error instanceof Error ? error.message : String(error)}`);
	}
};

// Helper function to render error states
function renderError(message: string) {
	return (
		<Card padding={4} radius={2} tone="critical">
			<Stack space={4}>
				<Text size={2} weight="semibold">Unable to load AI Assistant</Text>
				<Text size={1}>{message}</Text>
				<Text size={1}>
					Please select a document to edit first, or try refreshing the page.
				</Text>
			</Stack>
		</Card>
	);
}

// Wrap the component with the error boundary
export default function ContentCopilotViewWithErrorBoundary(props: CustomSanityComponentProps) {
	return (
		<ErrorBoundary>
			<ContentCopilotView {...props} />
		</ErrorBoundary>
	);
}