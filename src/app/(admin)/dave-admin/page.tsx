"use client";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useChat } from 'ai/react';
import { Minus, Send, Square, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

// Admin version of TerminalChat that connects to the dave-admin API
function AdminTerminalChat({ className, initialQuery }: {
	className?: string;
	initialQuery?: string;
}) {
	// Use the dave-admin API endpoint
	const { messages, input, handleInputChange, handleSubmit, isLoading, setInput } = useChat({
		api: '/api/dave-admin',
		id: 'dave-admin-chat',
	});

	const messagesEndRef = useRef<HTMLDivElement>(null);
	const [isTyping, setIsTyping] = useState(false);

	// Set input if initialQuery changes
	useEffect(() => {
		if (initialQuery) {
			setInput(initialQuery);
		}
	}, [initialQuery, setInput]);

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

	return (
		<div className={`flex flex-col rounded-md border border-zinc-800 shadow-md overflow-hidden bg-black text-green-400 ${className}`}>
			{/* Terminal header */}
			<div className="flex items-center p-2 bg-zinc-900 border-b border-zinc-800">
				<div className="flex space-x-2 mr-4">
					<span className="h-3 w-3 rounded-full bg-red-500"></span>
					<span className="h-3 w-3 rounded-full bg-yellow-500"></span>
					<span className="h-3 w-3 rounded-full bg-green-500"></span>
				</div>
				<div className="text-xs font-mono text-zinc-400 flex-1 text-center">dave-admin@portfolio:~#</div>
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
						<p className="text-green-400">Dave Admin Terminal v1.0.0</p>
						<p className="text-zinc-500">Content Management Interface</p>
						<p className="text-zinc-500 mb-4">Ready to help you manage your portfolio content. What would you like to do today?</p>
					</div>
				)}

				{/* Message history */}
				{messages.map((message, i) => (
					<div key={i} className="mb-4">
						{message.role === 'user' ? (
							<div className="mb-2">
								<span className="text-yellow-500">admin@portfolio:~# </span>
								<span>{message.content}</span>
							</div>
						) : (
							<div className="mb-2">
								<span className="text-green-500">dave@portfolio:~# </span>
								<span className="whitespace-pre-wrap">{message.content}</span>
							</div>
						)}
					</div>
				))}

				{/* Typing indicator */}
				{isTyping && (
					<div className="mb-2">
						<span className="text-green-500">dave@portfolio:~# </span>
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
			<form onSubmit={handleSubmit} className="border-t border-zinc-800 p-2 bg-zinc-900 flex items-center">
				<span className="text-yellow-500 text-sm mr-2 font-mono">$</span>
				<input
					className="flex-1 bg-transparent border-none outline-none text-white font-mono text-sm"
					value={input}
					placeholder="Enter content management commands..."
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
}

export default function DaveAdminPage() {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [currentQuery, setCurrentQuery] = useState<string | undefined>(undefined);

	// Check if we're already authenticated via localStorage
	useEffect(() => {
		const authStatus = localStorage.getItem('dave-admin-auth');
		if (authStatus === 'authenticated') {
			setIsAuthenticated(true);
		}
	}, []);

	const handleLogin = (e: React.FormEvent) => {
		e.preventDefault();

		// Simple client-side password check - replace with your own password
		// For a production app, you'd want a server-side check
		const correctPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'dave-admin-123';

		if (password === correctPassword) {
			setIsAuthenticated(true);
			localStorage.setItem('dave-admin-auth', 'authenticated');
			setError('');
		} else {
			setError('Incorrect password');
		}
	};

	const handleLogout = () => {
		setIsAuthenticated(false);
		localStorage.removeItem('dave-admin-auth');
	};

	const suggestedQueries = [
		"Let's add a new project to Sanity",
		"Help me create a knowledge base entry",
		"Update my skills in the database",
		"Generate embeddings for recent content"
	];

	const handleQueryClick = (query: string) => {
		setCurrentQuery(query);
	};

	if (!isAuthenticated) {
		return (
			<div className="flex flex-col items-center justify-center min-h-screen p-4 bg-black text-green-400">
				<div className="w-full max-w-md p-6 border border-green-500/30 rounded-md bg-black/90 shadow-lg backdrop-blur">
					<div className="text-center mb-6">
						<h1 className="text-2xl font-mono font-bold text-green-400">DAVE ADMIN ACCESS</h1>
						<p className="text-sm text-green-300/70 mt-2">Authorized personnel only</p>
					</div>

					<form onSubmit={handleLogin} className="space-y-4">
						<div className="space-y-2">
							<div className="flex items-center">
								<span className="text-green-500 mr-2 font-mono">$</span>
								<Input
									type="password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									placeholder="Enter access code"
									className="flex-1 bg-black border-green-500/30 text-green-400 placeholder:text-green-500/50 focus-visible:ring-green-500/30"
								/>
							</div>
							{error && <p className="text-red-500 text-sm font-mono">{`> Authentication failed: ${error}`}</p>}
						</div>

						<Button
							type="submit"
							className="w-full bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30"
						>
							Authenticate
						</Button>
					</form>

					<div className="mt-6 pt-4 border-t border-green-500/20 text-center">
						<p className="text-xs text-green-500/50 font-mono">
							[SYSTEM]: Unauthorized access is prohibited and will be logged
						</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-12 max-w-6xl">
			<div className="flex justify-between items-center mb-8">
				<div>
					<h1 className="text-3xl font-bold text-green-400">Dave Admin Console</h1>
					<p className="text-muted-foreground">Create and modify content in your portfolio</p>
				</div>
				<Button
					onClick={handleLogout}
					variant="outline"
					className="border-red-500/30 text-red-400 hover:bg-red-500/10"
				>
					Logout
				</Button>
			</div>

			<div className="grid md:grid-cols-4 gap-8">
				<div className="md:col-span-1 space-y-4">
					<div className="rounded-md border border-zinc-800 p-4 bg-zinc-900/50">
						<h3 className="text-sm font-semibold mb-2 text-zinc-400">Content Actions</h3>
						<ul className="space-y-2 text-sm">
							{suggestedQueries.map((query, index) => (
								<li key={index}>
									<button
										className="text-left text-primary hover:underline w-full"
										onClick={() => handleQueryClick(query)}
									>
										{query}
									</button>
								</li>
							))}
						</ul>
					</div>

					<div className="rounded-md border border-zinc-800 p-4 bg-zinc-900/50">
						<h3 className="text-sm font-semibold mb-2 text-zinc-400">Admin Commands</h3>
						<div className="text-xs text-zinc-500 font-mono space-y-1">
							<p><span className="text-green-500">create project</span> - Add new project</p>
							<p><span className="text-green-500">create knowledge</span> - Add knowledge entry</p>
							<p><span className="text-green-500">update skill</span> - Update skill details</p>
							<p><span className="text-green-500">generate embeddings</span> - Update vector DB</p>
						</div>
					</div>
				</div>

				<div className="md:col-span-3">
					<AdminTerminalChat
						className="w-full h-[600px]"
						initialQuery={currentQuery}
					/>
				</div>
			</div>

			<div className="mt-8 text-center text-xs text-zinc-500">
				<p>
					Admin console powered by Claude. All actions are logged for security purposes.
				</p>
			</div>
		</div>
	);
} 