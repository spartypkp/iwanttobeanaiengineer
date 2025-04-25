'use client';

import { cn } from '@/lib/utils/cn';
import { useChat } from 'ai/react';
import { Minus, Send, Square, X } from 'lucide-react';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

interface TerminalChatProps {
	initialMessages?: any[];
	className?: string;
	onQuestionClick?: (question: string) => void;
}

export type TerminalChatRef = {
	setInput: (text: string) => void;
};

// Helper functions for localStorage
const STORAGE_KEY = 'dave-chat-history';

const saveMessagesToLocalStorage = (messages: any[]) => {
	if (typeof window !== 'undefined') {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
	}
};

const loadMessagesFromLocalStorage = (): any[] => {
	if (typeof window !== 'undefined') {
		const saved = localStorage.getItem(STORAGE_KEY);
		if (saved) {
			try {
				return JSON.parse(saved);
			} catch (e) {
				console.error('Failed to parse saved messages:', e);
			}
		}
	}
	return [];
};

const clearSavedMessages = () => {
	if (typeof window !== 'undefined') {
		localStorage.removeItem(STORAGE_KEY);
	}
};

export const TerminalChat = forwardRef<TerminalChatRef, TerminalChatProps>(({
	initialMessages = [],
	className,
	onQuestionClick,
}, ref) => {
	// Load saved messages on mount
	const savedMessages = useRef<any[]>([]);

	useEffect(() => {
		savedMessages.current = loadMessagesFromLocalStorage();
	}, []);

	const { messages, input, handleInputChange, handleSubmit, isLoading, setInput, setMessages } = useChat({
		api: '/api/dave',
		initialMessages: savedMessages.current.length > 0 ? savedMessages.current : initialMessages,
		id: 'dave-chat',
	});

	const messagesEndRef = useRef<HTMLDivElement>(null);
	const [isTyping, setIsTyping] = useState(false);

	// Save messages to localStorage when they change
	useEffect(() => {
		if (messages.length > 0) {
			saveMessagesToLocalStorage(messages);
		}
	}, [messages]);

	// Expose the setInput method via ref
	useImperativeHandle(ref, () => ({
		setInput: (text: string) => setInput(text)
	}));

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

	// Special command handling
	const handleFormSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		// Handle special commands
		if (input.trim().toLowerCase() === 'clear') {
			// Clear the conversation
			clearSavedMessages();
			setMessages([]);
			return;
		}

		// Default submission behavior
		handleSubmit(e);
	};

	return (
		<div className={cn("flex flex-col rounded-md border border-zinc-800 shadow-md overflow-hidden bg-black text-green-400", className)}>
			{/* Terminal header */}
			<div className="flex items-center p-2 bg-zinc-900 border-b border-zinc-800">
				<div className="flex space-x-2 mr-4">
					<span className="h-3 w-3 rounded-full bg-red-500"></span>
					<span className="h-3 w-3 rounded-full bg-yellow-500"></span>
					<span className="h-3 w-3 rounded-full bg-green-500"></span>
				</div>
				<div className="text-xs font-mono text-zinc-400 flex-1 text-center">dave@portfolio:~</div>
				<div className="flex space-x-2">
					<button className="text-zinc-400 hover:text-zinc-200">
						<Minus size={14} />
					</button>
					<button className="text-zinc-400 hover:text-zinc-200">
						<Square size={14} />
					</button>
					<button className="text-zinc-400 hover:text-zinc-200">
						<X size={14} />
					</button>
				</div>
			</div>

			{/* Messages container */}
			<div className="flex-1 p-4 overflow-y-auto bg-black font-mono text-sm terminal-scrollbar">
				{/* Welcome message */}
				{messages.length === 0 && (
					<div className="mb-4 terminal-text">
						<pre className="text-xs text-green-400 mb-4">
							{`
 ______   _______  __   __  _______ 
|      | |   _   ||  | |  ||       |
|  _    ||  |_|  ||  |_|  ||    ___|
| | |   ||       ||       ||   |___ 
| |_|   ||       ||       ||    ___|
|       ||   _   | |     | |   |___ 
|______| |__| |__|  |___|  |_______|
                                     
`}
						</pre>
						<p className="text-green-400">Welcome to Dave Terminal v1.0.0</p>
						<p className="text-zinc-500">Will Diamond's AI Assistant</p>
						<p className="text-zinc-500 mb-4">Type <span className="text-green-500">help</span> for available commands or ask anything about Will's skills and projects.</p>
					</div>
				)}

				{/* Message history */}
				{messages.map((message, i) => (
					<div key={i} className="mb-4">
						{message.role === 'user' ? (
							<div className="mb-2">
								<span className="text-yellow-500">visitor@portfolio:~$ </span>
								<span>{message.content}</span>
							</div>
						) : (
							<div className="mb-2">
								<span className="text-green-500">dave@portfolio:~$ </span>
								<span className="whitespace-pre-wrap">{message.content}</span>
							</div>
						)}
					</div>
				))}

				{/* Typing indicator */}
				{isTyping && (
					<div className="mb-2">
						<span className="text-green-500">dave@portfolio:~$ </span>
						<span className="typing-indicator">
							<span className="dot"></span>
							<span className="dot"></span>
							<span className="dot"></span>
						</span>
					</div>
				)}

				{/* Auto-scroll anchor */}
				<div ref={messagesEndRef} />
			</div>

			{/* Input area */}
			<form onSubmit={handleFormSubmit} className="border-t border-zinc-800 p-2 bg-zinc-900 flex items-center">
				<span className="text-yellow-500 text-sm mr-2 font-mono">$</span>
				<input
					className="flex-1 bg-transparent border-none outline-none text-white font-mono text-sm"
					value={input}
					placeholder="Ask about Will's skills, projects, or experience..."
					onChange={handleInputChange}
				/>
				<button
					type="submit"
					className="ml-2 text-zinc-400 hover:text-green-500 transition-colors"
					disabled={isLoading}
				>
					<Send size={18} />
				</button>
			</form>
		</div>
	);
}); 