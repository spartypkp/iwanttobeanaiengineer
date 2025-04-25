'use client';

import { useChat } from '@ai-sdk/react';
import { Box, Card, Spinner, Stack, Text } from '@sanity/ui';
import { Component, ErrorInfo, ReactNode, useEffect, useRef, useState } from 'react';

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
				<Card padding={4} radius={0} height="fill" tone="critical">
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

export const ContentCopilotView = (props: CustomSanityComponentProps) => {
	console.log("ContentCopilotView rendering with props:", {
		documentId: props.documentId,
		schemaType: props.schemaType,
		document: props.document,
	});

	try {
		const { document, documentId, schemaType } = props;

		// Defensive checks for required props
		if (!documentId) {
			console.error("Missing documentId in ContentCopilotView");
			return renderError("Missing document ID");
		}

		if (!schemaType) {
			console.error("Missing schemaType in ContentCopilotView");
			return renderError("Missing schema type");
		}

		if (!document) {
			console.error("Missing document in ContentCopilotView");
			return renderError("Document data unavailable");
		}

		const documentData = document?.displayed;
		if (!documentData) {
			console.error("Missing document.displayed in ContentCopilotView");
			return renderError("Document data unavailable");
		}

		const [isLoading, setIsLoading] = useState(false);
		const [conversationId, setConversationId] = useState<string | null>(null);
		const [error, setError] = useState<string | null>(null);
		const documentType: string = schemaType.name;




		// Load conversation when document changes
		useEffect(() => {
			if (!documentId || !schemaType) {
				console.log('Not currently editing a document!', { documentId, schemaType });
				return;
			}

			const loadConversation = async () => {
				setIsLoading(true);
				try {
					console.log("Loading conversation for:", { documentId });
					const response = await fetch('/api/content-copilot/get-conversation', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({ documentId }),
					});

					if (response.ok) {
						const data = await response.json();
						console.log("Conversation loaded:", data);
						if (data.conversation) {
							setConversationId(data.conversation.id);
							// If there are previous messages, set them in the chat
							if (data.messages && data.messages.length > 0) {
								// Reset and load the conversation history
								setMessages(data.messages);
							}
						}
					} else {
						const errorText = await response.text();
						console.error("Error loading conversation:", errorText);
						setError(`Failed to load conversation: ${response.status} ${errorText}`);
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
		}, [documentId, schemaType]);

		const { messages, input, setInput, setMessages, append, handleInputChange, handleSubmit } = useChat({
			api: '/api/content-copilot',
			body: {
				documentData,
				schemaType,
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
			},
			onError: (error) => {
				console.error("Chat API error:", error);
				setError(`API error: ${error.message}`);
			}
		});

		const messagesEndRef = useRef<HTMLDivElement>(null);



		// Scroll to bottom when messages change
		useEffect(() => {
			if (messagesEndRef.current) {
				messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
			}
		}, [messages]);

		// Reset conversation functionality
		const handleResetConversation = async () => {
			if (confirm('Are you sure you want to start a new conversation? This will discard the current conversation history.')) {
				setConversationId(null);
				setMessages([]);
				setError(null);
			}
		};





		if (error) {
			return (
				<Card padding={4} radius={0} height="fill" tone="caution">
					<Stack space={4}>
						<Text size={2} weight="semibold">AI Assistant Error</Text>
						<Text size={1}>{error}</Text>
						<button
							onClick={() => setError(null)}
							style={{
								padding: '8px 12px',
								background: 'var(--card-bg-color)',
								border: '1px solid var(--card-border-color)',
								borderRadius: '4px',
								cursor: 'pointer'
							}}
						>
							Try Again
						</button>
					</Stack>
				</Card>
			);
		}

		return (
			<Card padding={0} radius={0} height="fill">
				<Stack space={0}>
					{/* Terminal-style header */}
					<Box
						padding={3}
						style={{
							borderBottom: '1px solid var(--card-border-color)',
							background: 'var(--card-bg-color)'
						}}
					>
						<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
							<div style={{ display: 'flex', alignItems: 'center' }}>
								<div style={{
									display: 'flex',
									marginRight: '12px',
									gap: '6px'
								}}>
									<div style={{
										height: '12px',
										width: '12px',
										borderRadius: '50%',
										backgroundColor: '#ff5f57'
									}} />
									<div style={{
										height: '12px',
										width: '12px',
										borderRadius: '50%',
										backgroundColor: '#febc2e'
									}} />
									<div style={{
										height: '12px',
										width: '12px',
										borderRadius: '50%',
										backgroundColor: '#28c840'
									}} />
								</div>
								<div style={{
									fontFamily: 'monospace',
									fontSize: '13px',
									color: 'var(--card-fg-color)'
								}}>
									Dave AI Assistant
								</div>
							</div>
							<div>
								{messages.length > 0 && (
									<button
										onClick={handleResetConversation}
										style={{
											background: 'none',
											border: 'none',
											cursor: 'pointer',
											color: 'var(--card-muted-fg-color)',
											fontSize: '12px',
											display: 'flex',
											alignItems: 'center',
										}}
									>
										<span style={{ marginRight: '5px' }}>New Conversation</span>
										<span style={{ fontSize: '14px' }}>🔄</span>
									</button>
								)}
							</div>
						</div>
					</Box>

					{/* Conversation component */}
					<Box flex={1} style={{ height: 'calc(100% - 46px)', overflow: 'hidden' }}>
						<Stack space={4} padding={4}>
							{/* Message history */}
							<Box
								flex={1}
								overflow="auto"
								padding={3}
								style={{
									background: 'var(--card-bg-color)',
									borderRadius: 'var(--border-radius-small)',
									border: '1px solid var(--card-border-color)'
								}}
							>
								{messages.length === 0 && !isLoading && (
									<Card padding={3} marginBottom={3} radius={2}>
										<Text size={1}>
											Start a conversation about this {documentType}. I'll help you create or update content based on our discussion.
										</Text>
									</Card>
								)}
								{messages.map((message, index) => (
									<Card
										key={index}
										padding={3}
										marginBottom={3}
										radius={2}
										tone={message.role === 'user' ? 'primary' : 'default'}
									>
										<Text size={1} weight={message.role === 'user' ? 'semibold' : 'regular'}>
											{message.role === 'user' ? 'You: ' : 'Dave: '}
											{message.content}
										</Text>
									</Card>
								))}
								{isLoading && (
									<Box padding={3} marginBottom={3}>
										<Spinner />
									</Box>
								)}
								<div ref={messagesEndRef} />
							</Box>

							{/* Input area */}
							<Stack space={2}>
								<form onSubmit={handleSubmit}>
									<input
										value={input}
										onChange={handleInputChange}
										placeholder="Ask about this content or describe changes..."
										style={{
											width: '100%',
											padding: '10px',
											borderRadius: '4px',
											border: '1px solid var(--card-border-color)'
										}}
									/>
								</form>
							</Stack>
						</Stack>
					</Box>
				</Stack>
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
		<Card padding={4} radius={0} height="fill" tone="critical">
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