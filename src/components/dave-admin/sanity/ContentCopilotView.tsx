import { useChat } from '@ai-sdk/react';
import { Box, Card, Spinner, Stack, Text } from '@sanity/ui';
import { useEffect, useRef, useState } from 'react';
import { useDocumentOperation, useSchema } from 'sanity';
import { useDocumentPatcher } from '../../../lib/document-utils';
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

	schemaType: string;
}

export const ContentCopilotView = (props: CustomSanityComponentProps) => {
	const { document, documentId, schemaType } = props;
	const documentData = document.displayed;

	const [isLoading, setIsLoading] = useState(false);
	const [conversationId, setConversationId] = useState<string | null>(null);

	// Load conversation when document changes
	useEffect(() => {
		const loadConversation = async () => {
			setIsLoading(true);
			try {
				const response = await fetch('/api/content-copilot/get-conversation', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ documentId, schemaType }),
				});

				if (response.ok) {
					const data = await response.json();
					if (data.conversation) {
						setConversationId(data.conversation.id);
						// If there are previous messages, set them in the chat
						if (data.messages && data.messages.length > 0) {
							// Reset and load the conversation history
							setMessages(data.messages);
						}
					}
				}
			} catch (error) {
				console.error('Failed to load conversation:', error);
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
		}
	});

	const messagesEndRef = useRef<HTMLDivElement>(null);

	// Get the schema from Sanity
	const schemaRegistry = useSchema();
	const fullSchemaType = schemaRegistry.get(schemaType);
	if (!fullSchemaType) {
		// Not currently editing a document!
		console.log('Not currently editing a document!');
	}


	// Get document operations from Sanity
	const { patch } = useDocumentOperation(documentId, schemaType);
	const patchDocument = useDocumentPatcher(documentId, schemaType);

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
		}
	};


	// Extract field values from the response
	const extractFieldValues = (text: string): Record<string, any> => {
		const fieldValues: Record<string, any> = {};
		const regex = /<field name="([^"]+)">([^<]+)<\/field>/g;
		let match;

		while ((match = regex.exec(text)) !== null) {
			const [_, fieldName, value] = match;
			fieldValues[fieldName] = value;
		}

		return fieldValues;
	};


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
								Dave AI Assistant: {fullSchemaType?.title || schemaType} {documentData?.title && `- ${documentData.title}`}
							</div>
						</div>
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
										Start a conversation about this {schemaType}. I'll help you create or update content based on our discussion.
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
};