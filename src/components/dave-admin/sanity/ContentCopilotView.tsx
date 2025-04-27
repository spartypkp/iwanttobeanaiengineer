'use client';
import { createSerializableSchema } from '@/utils/schema-serialization';
import { useChat } from '@ai-sdk/react';
import { type ObjectSchemaType } from '@sanity/types';
import { Avatar, Badge, Box, Button, Card, Flex, Spinner, Stack, Text, TextArea } from '@sanity/ui';
import { useEffect, useMemo, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';

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

				console.log("Conversation loaded:", data);
				if (data.conversation) {
					setConversationId(data.conversation.id);
					// If there are previous messages, set them in the chat
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

	// Handle keyboard shortcuts
	const handleKeyDown = (e: React.KeyboardEvent) => {
		// Submit on Enter (without shift)
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			handleFormSubmit(e as unknown as React.FormEvent);
		}
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
			<Card padding={4} radius={2} tone="caution">
				<Stack space={4}>
					<Flex align="center" gap={2}>
						<Text size={2} weight="semibold">AI Assistant Error</Text>
						<Badge tone="critical" size={1}>Error</Badge>
					</Flex>
					<Text size={1}>{error}</Text>
				</Stack>
			</Card>
		);
	}

	// Try-catch only around rendering
	try {
		return (
			<Card height="fill" style={{ display: 'flex', flexDirection: 'column', width: '100%', maxHeight: '100vh' }}>
				{/* Header */}
				<Card tone="default" padding={3} borderBottom style={{ flexShrink: 0 }}>
					<Flex align="center" justify="space-between">
						<Flex align="center" gap={2}>
							<Avatar initials="D" size={1} />
							<Stack space={2}>
								<Text size={1} weight="semibold">Dave Assistant</Text>
								<Text size={0} muted>Working with: {getDocumentTitle()}</Text>
							</Stack>
						</Flex>
						{conversationId && (
							<Badge tone="positive" size={0}>Conversation Active</Badge>
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
						width: '100%',
						overflowY: 'auto',
						overflowX: 'hidden'
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
							{!hasInitialized.current ? (
								<>
									<Spinner />
									<Text size={1} muted>Starting conversation...</Text>
								</>
							) : (
								<>
									<Avatar initials="D" size={2} />
									<Text size={2} weight="semibold">Ready to help with your content</Text>
									<Text size={1} muted style={{ maxWidth: '400px' }}>
										Dave will help you create and edit content through natural conversation.
										Say hello to get started!
									</Text>
								</>
							)}
						</Flex>
					) : (
						<>
							{messages.map((message) => (
								<Flex
									key={message.id}
									direction={message.role === 'user' ? 'row-reverse' : 'row'}
									gap={2}
									marginBottom={4}
									style={{ maxWidth: '100%' }}
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
											borderBottomRightRadius: message.role === 'user' ? '2px' : '14px',
											overflow: 'hidden', /* Prevent content overflow */
											wordBreak: 'break-word' /* Handle long words */
										}}
									>
										{message.role === 'user' ? (
											<Text size={1}>{message.content}</Text>
										) : (
											<>
												{message.parts?.map((part, index) => (
													<div key={index} className="message-part-container">
														<MessagePart part={part} addToolResult={addToolResult} />
													</div>
												)) || (
														// Fallback to support older chat history format that doesn't have parts
														<div className="markdown-content">
															<ReactMarkdown>{message.content}</ReactMarkdown>
														</div>
													)}
											</>
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
											padding: '12px 16px',
											borderRadius: '14px',
											borderBottomLeftRadius: '2px',
											background: 'var(--card-bg-color)',
											border: '1px solid var(--card-border-color)'
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
				<Card padding={[3, 4]} borderTop style={{ backgroundColor: 'var(--card-bg-color)', width: '100%', flexShrink: 0 }}>
					<form onSubmit={handleFormSubmit} style={{ width: '100%' }}>
						<Flex gap={2} align="flex-end" style={{ width: '100%', display: 'flex' }}>
							<div style={{ position: 'relative', width: '100%', flex: '1 1 auto' }}>
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
										width: '100%',
										minHeight: '44px',
										maxHeight: '200px',
										flex: '1 1 auto',
										padding: '12px',
										borderRadius: '4px',
										border: '1px solid var(--card-border-color)',
										fontSize: '14px',
										lineHeight: '1.4'
									}}
								/>
							</div>
							<Button
								type="submit"
								icon="arrow-right"
								tone="primary"
								disabled={isLoading || !input.trim()}
								style={{
									flexShrink: 0,
									flexBasis: 'auto',
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
						height: 16px;
					}
					
					.typing-indicator span {
						height: 6px;
						width: 6px;
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
					
					/* Fix for TextArea wrapper spans */
					[data-ui="TextArea"], 
					.InputRoot-sc-1d6h1o8-1 {
						width: 100%;
						flex: 1 1 auto !important;
						display: block;
					}
					
					/* Message content styling improvements */
					.markdown-content {
						width: 100%;
						overflow-wrap: break-word;
						word-break: break-word;
					}
					
					.markdown-content p {
						margin: 0.5em 0;
						line-height: 1.5;
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
						max-width: 100%;
						font-size: 0.9em;
					}
					
					.markdown-content code {
						font-family: monospace;
						font-size: 0.9em;
						background: var(--card-code-inline-bg-color, rgba(0,0,0,0.05));
						padding: 2px 4px;
						border-radius: 3px;
						white-space: pre-wrap;
					}
					
					.markdown-content pre code {
						background: transparent;
						padding: 0;
						white-space: pre;
					}
					
					.markdown-content ul, .markdown-content ol {
						margin: 0.5em 0;
						padding-left: 1.5em;
					}
					
					.message-part-container {
						width: 100%;
						margin-bottom: 8px;
					}
					
					.message-part-container:last-child {
						margin-bottom: 0;
					}
					
					.step-divider {
						margin: 10px 0;
					}
					
					.step-divider hr {
						border: 0;
						height: 1px;
						background-color: var(--card-border-color);
						margin: 0;
					}
					
					/* Fix tool invocation display */
					pre {
						white-space: pre-wrap;
						max-width: 100%;
						overflow-x: auto;
					}

					/* Add custom badge styling */
					[data-ui="Badge"] {
						display: inline-flex;
						align-items: center;
						justify-content: center;
						max-width: 100%;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
					}
					
					/* Custom scrollbar for better UX */
					::-webkit-scrollbar {
						width: 8px;
						height: 8px;
					}
					
					::-webkit-scrollbar-track {
						background: transparent;
					}
					
					::-webkit-scrollbar-thumb {
						background: var(--card-border-color);
						border-radius: 4px;
					}
					
					::-webkit-scrollbar-thumb:hover {
						background: var(--card-muted-fg-color);
					}
				`}</style>
			</Card>
		);
	} catch (error) {
		console.error("Unexpected error in ContentCopilotView:", error);
		return <div>{`Unexpected error: ${error instanceof Error ? error.message : String(error)}`}</div>;
	}
};

export default ContentCopilotView;

// Tool-specific components for handling tool invocations
const ContentSuggestionTool = ({ toolInvocation, addToolResult }: { toolInvocation: ToolInvocation, addToolResult?: (result: { toolCallId: string; result: any; }) => void; }) => {
	const { toolCallId, state, args, result } = toolInvocation;

	switch (state) {
		case 'partial-call':
			return (
				<Card padding={3} radius={2} marginY={3} tone="primary">
					<Flex align="center" gap={2}>
						<Text>Generating content suggestions...</Text>
						<Spinner />
					</Flex>
				</Card>
			);
		case 'call':
			return (
				<Card padding={3} radius={2} marginY={3} tone="primary" style={{ background: 'var(--card-bg-color)' }}>
					<Stack space={3}>
						<Flex align="center" gap={2}>
							<Text weight="semibold">Content Suggestions for: </Text>
							<Badge tone="primary">{args.fieldPath}</Badge>
						</Flex>

						{args.requirements && (
							<Card padding={2} radius={2} tone="default">
								<Text size={0} muted>Requirements: {args.requirements}</Text>
							</Card>
						)}

						{/* Show current value if it exists */}
						{args.currentValue && (
							<Card padding={2} radius={2} tone="default">
								<Stack space={1}>
									<Text size={0} muted>Current value:</Text>
									<Text size={1} style={{ wordBreak: 'break-word' }}>{args.currentValue}</Text>
								</Stack>
							</Card>
						)}

						{/* We'll display placeholder for suggestions until they're generated by AI */}
						<Card padding={3} radius={2} border tone="default">
							<Text size={1}>Generating suggestions...</Text>
						</Card>
					</Stack>
				</Card>
			);
		case 'result':
			if (!result || !result.suggestions || !result.suggestions.suggestedOptions) {
				return (
					<Card padding={3} radius={2} marginY={3} tone="caution">
						<Text>No suggestions were generated.</Text>
					</Card>
				);
			}

			return (
				<Card padding={3} radius={2} marginY={3} tone="primary" style={{ background: 'var(--card-bg-color)' }}>
					<Stack space={3}>
						<Flex align="center" gap={2}>
							<Text weight="semibold">Content Suggestions for: </Text>
							<Badge tone="primary">{result.fieldPath || args.fieldPath}</Badge>
						</Flex>

						{result.suggestions.suggestedOptions.map((suggestion: string, index: number) => (
							<Card key={index} padding={3} radius={2} border tone="default">
								<Stack space={2}>
									<Flex align="center" justify="space-between">
										<Text size={1} weight="semibold">Suggestion {index + 1}</Text>
										{addToolResult && (
											<Button
												mode="ghost"
												text="Use This"
												size={0}
												tone="primary"
												onClick={() => {
													addToolResult({
														toolCallId,
														result: { success: true, selection: suggestion, fieldPath: result.fieldPath || args.fieldPath }
													});
												}}
											/>
										)}
									</Flex>
									<Card padding={2} radius={1} tone="default" style={{ background: 'var(--card-code-bg-color)' }}>
										<Text size={1} style={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>{suggestion}</Text>
									</Card>
								</Stack>
							</Card>
						))}
					</Stack>
				</Card>
			);
		default:
			return null;
	}
};

// Fix IncompleteFieldsTool component to better display field information
const IncompleteFieldsTool = ({ toolInvocation }: { toolInvocation: ToolInvocation; }) => {
	const { state, args, result } = toolInvocation;

	switch (state) {
		case 'partial-call':
			return (
				<Card padding={3} radius={2} marginY={3} tone="caution">
					<Flex align="center" gap={2}>
						<Text>Analyzing incomplete fields...</Text>
						<Spinner />
					</Flex>
				</Card>
			);
		case 'call':
			return (
				<Card padding={3} radius={2} marginY={3} tone="caution">
					<Text>Checking for incomplete fields in the document...</Text>
				</Card>
			);
		case 'result':
			if (!result || !result.incompleteFields || !result.incompleteFields.length) {
				return (
					<Card padding={3} radius={2} marginY={3} tone="positive">
						<Text>All required fields are complete!</Text>
					</Card>
				);
			}

			return (
				<Card padding={3} radius={2} marginY={3} tone="caution" style={{ background: 'var(--card-bg-color)' }}>
					<Stack space={3}>
						<Flex align="center" gap={2}>
							<Text weight="semibold">Incomplete Fields</Text>
							<Badge tone="caution">{result.totalRequired} required</Badge>
						</Flex>

						<div style={{ maxHeight: '300px', overflowY: 'auto', paddingRight: '4px' }}>
							{result.incompleteFields.map((field: any, index: number) => (
								<Card key={index} padding={2} radius={2} border tone={field.required ? "caution" : "default"} marginBottom={2}>
									<Flex align="center" justify="space-between">
										<Stack space={1}>
											<Text size={1} weight="semibold">{field.title}</Text>
											<Flex gap={2} align="center">
												<Text size={0} muted style={{ fontFamily: 'monospace' }}>{field.name}</Text>
												<Badge tone="default" size={0}>{field.type}</Badge>
											</Flex>
										</Stack>
										{field.required && (
											<Badge tone="caution" size={0}>Required</Badge>
										)}
									</Flex>
								</Card>
							))}
						</div>
					</Stack>
				</Card>
			);
		default:
			return null;
	}
};

const ReferencedFieldTool = ({ toolInvocation }: { toolInvocation: ToolInvocation; }) => {
	const { state, args, result } = toolInvocation;

	switch (state) {
		case 'partial-call':
			return (
				<Card padding={3} radius={2} marginY={3} tone="positive">
					<Flex align="center" gap={2}>
						<Text>Fetching referenced content...</Text>
						<Spinner />
					</Flex>
				</Card>
			);
		case 'call':
			return (
				<Card padding={3} radius={2} marginY={3} tone="positive">
					<Text>Looking up referenced content from {args.referenceFieldPath}...</Text>
				</Card>
			);
		case 'result':
			if (!result || !result.success) {
				return (
					<Card padding={3} radius={2} marginY={3} tone="caution">
						<Text>Failed to fetch referenced content: {result?.message || 'Unknown error'}</Text>
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
				<Card padding={3} radius={2} marginY={3} tone="positive" style={{ background: 'var(--card-bg-color)' }}>
					<Stack space={3}>
						<Flex align="center" gap={2}>
							<Text weight="semibold">Referenced Content</Text>
							<Badge tone="positive">{result.referencedDocumentType}</Badge>
						</Flex>

						<Card padding={2} radius={2} border tone="default">
							<Stack space={2}>
								<Text size={0} muted>
									From document: {result.referencedDocumentId.substring(0, 6)}...
								</Text>
								<Text size={0} muted>
									Field: {result.referencedFieldPath}
								</Text>
								<Card padding={2} radius={1} tone="default" style={{ background: 'var(--card-code-bg-color)', maxWidth: '100%', overflow: 'auto' }}>
									<Text size={1} style={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
										{displayValue}
									</Text>
								</Card>
							</Stack>
						</Card>
					</Stack>
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
				<Card padding={3} radius={2} marginY={3} tone="primary">
					<Flex align="center" gap={2}>
						<Text>Updating {args?.fieldPath || 'document field'}...</Text>
						<Spinner />
					</Flex>
				</Card>
			);
		case 'result':
			if (!result || !result.success) {
				return (
					<Card padding={3} radius={2} marginY={3} tone="critical">
						<Stack space={2}>
							<Flex align="center" gap={2}>
								<Text weight="semibold">Update Failed</Text>
								<Badge tone="critical" size={0}>Error</Badge>
							</Flex>
							<Text size={1}>Failed to update field: {result?.message || 'Unknown error'}</Text>
						</Stack>
					</Card>
				);
			}

			// Format the value for better display
			let valueDisplay = '';
			if (typeof result.value === 'object') {
				try {
					valueDisplay = JSON.stringify(result.value, null, 2);
				} catch (e) {
					valueDisplay = '[Complex object]';
				}
			} else if (typeof result.value === 'string') {
				valueDisplay = result.value;
			} else if (result.value !== undefined) {
				valueDisplay = String(result.value);
			}

			const fieldPath = result.fieldPath || args.fieldPath;
			const truncatedValue = valueDisplay.length > 100
				? valueDisplay.substring(0, 100) + '...'
				: valueDisplay;

			return (
				<Card padding={3} radius={2} marginY={3} tone="positive">
					<Stack space={3}>
						<Flex align="center" gap={2}>
							<Text weight="semibold">Field Updated Successfully</Text>
							<Badge tone="positive" size={0}>Success</Badge>
						</Flex>

						<Flex gap={2} align="flex-start">
							<Badge tone="primary" size={0} style={{ flexShrink: 0, marginTop: '2px' }}>Path</Badge>
							<Text size={1} style={{ fontFamily: 'monospace' }}>{fieldPath}</Text>
						</Flex>

						{valueDisplay && (
							<Stack space={2}>
								<Text size={0} muted>New value:</Text>
								<Card padding={2} radius={1} tone="default" style={{ background: 'var(--card-code-bg-color)' }}>
									<Text size={1} style={{
										wordBreak: 'break-word',
										whiteSpace: 'pre-wrap',
										fontFamily: 'monospace',
										maxHeight: '100px',
										overflowY: 'auto'
									}}>
										{truncatedValue}
									</Text>
								</Card>
								{valueDisplay.length > 100 && (
									<Text size={0} muted style={{ fontStyle: 'italic' }}>Value truncated for display</Text>
								)}
							</Stack>
						)}
					</Stack>
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
		case 'listIncompleteFields':
			return <IncompleteFieldsTool toolInvocation={toolInvocation} />;
		case 'readSubField':
			return <ReferencedFieldTool toolInvocation={toolInvocation} />;
		case 'writeField':
			return <WriteFieldTool toolInvocation={toolInvocation} />;
		default:
			// Fallback for any tool we don't have a specific component for
			return (
				<Card padding={3} radius={2} marginY={3} tone="default">
					<Stack space={2}>
						<Text weight="semibold">Tool: {toolInvocation.toolName}</Text>
						<Card padding={2} radius={2} tone="default">
							<div style={{ maxWidth: '100%', overflow: 'auto' }}>
								<pre style={{ margin: 0, fontSize: '12px', wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>
									{JSON.stringify(toolInvocation, null, 2)}
								</pre>
							</div>
						</Card>
					</Stack>
				</Card>
			);
	}
};

// Component to render each message part
const MessagePart = ({ part, addToolResult }: {
	part: {
		type: string;
		text?: string;
		toolInvocation?: ToolInvocation;
	};
	addToolResult?: (result: { toolCallId: string; result: any; }) => void;
}) => {
	switch (part.type) {
		case 'text':
			return (
				<div className="markdown-content">
					<ReactMarkdown>{part.text || ''}</ReactMarkdown>
				</div>
			);
		case 'tool-invocation':
			return part.toolInvocation ?
				<ToolInvocationDisplay toolInvocation={part.toolInvocation} addToolResult={addToolResult} /> :
				null;
		case 'step-start':
			return <div className="step-divider"><hr /></div>;
		default:
			return null;
	}
};

// Add a helper function to create markdown-style codeblocks
const createCodeBlock = (content: string, language = '') => {
	return `\`\`\`${language}\n${content}\n\`\`\``;
};
