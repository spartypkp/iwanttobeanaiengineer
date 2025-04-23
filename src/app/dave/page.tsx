"use client";

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textArea';
import { Bot, Send, User } from 'lucide-react';
import React, { useState } from 'react';

interface Message {
	id: number;
	role: 'user' | 'assistant';
	content: string;
	timestamp: Date;
}

const DavePage: React.FC = () => {
	const [input, setInput] = useState<string>('');
	const [messages, setMessages] = useState<Message[]>([
		{
			id: 1,
			role: 'assistant',
			content: "Hey there! I'm Dave, Will's AI assistant. I'm here to answer questions about his skills, experience, and why he'd be a great addition to your team. What would you like to know?",
			timestamp: new Date()
		}
	]);

	const handleSendMessage = () => {
		if (!input.trim()) return;

		// Add user message
		const newUserMessage: Message = {
			id: messages.length + 1,
			role: 'user',
			content: input,
			timestamp: new Date()
		};

		setMessages([...messages, newUserMessage]);
		setInput('');

		// Simulate Dave's response (placeholder for actual AI integration)
		setTimeout(() => {
			const daveResponses = [
				"Will has extensive experience with LLMs and AI engineering. His projects demonstrate both technical depth and practical application.",
				"You should absolutely hire Will! He's skilled in Python, TypeScript, and has built several production-ready AI applications.",
				"Looking at Will's portfolio, his projects showcase his ability to architect complex systems and implement AI solutions that solve real problems.",
				"Will is constantly learning and improving. He documents his journey and isn't afraid to tackle challenging problems.",
				"Have you seen Will's open-source contributions? They demonstrate his collaborative approach and technical expertise."
			];

			const randomResponse = daveResponses[Math.floor(Math.random() * daveResponses.length)];

			const newDaveMessage: Message = {
				id: messages.length + 2,
				role: 'assistant',
				content: randomResponse,
				timestamp: new Date()
			};

			setMessages(prev => [...prev, newDaveMessage]);
		}, 1000);
	};

	return (
		<div className="container mx-auto px-4 py-12 max-w-4xl">
			<div className="text-center mb-8">
				<h1 className="text-4xl font-bold mb-4">Chat with Dave</h1>
				<p className="text-xl text-gray-600">
					Dave is Will&apos;s AI advocate. Ask him anything about Will&apos;s skills, projects, or why you should consider him for your team.
				</p>
				<div className="mt-4 bg-amber-100 p-4 rounded-md text-amber-800 text-sm">
					<strong>Note:</strong> This is a placeholder for the future AI assistant. Currently, Dave provides canned responses.
					Real AI integration coming soon!
				</div>
			</div>

			<Card className="border-2 shadow-lg">
				<CardHeader className="bg-gray-50 border-b">
					<div className="flex items-center">
						<Avatar className="h-10 w-10 mr-3">
							<AvatarImage src="/dave-avatar.png" alt="Dave" />
							<AvatarFallback><Bot className="h-6 w-6" /></AvatarFallback>
						</Avatar>
						<div>
							<CardTitle>Dave</CardTitle>
							<CardDescription>Will&apos;s AI Advocate</CardDescription>
						</div>
					</div>
				</CardHeader>

				<CardContent className="p-6">
					<div className="space-y-4 h-[400px] overflow-y-auto mb-4">
						{messages.map((message) => (
							<div
								key={message.id}
								className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
							>
								<div className={`flex items-start gap-2 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
									<div className="mt-1">
										{message.role === 'user' ? (
											<Avatar>
												<AvatarFallback><User className="h-5 w-5" /></AvatarFallback>
											</Avatar>
										) : (
											<Avatar>
												<AvatarImage src="/dave-avatar.png" alt="Dave" />
												<AvatarFallback><Bot className="h-5 w-5" /></AvatarFallback>
											</Avatar>
										)}
									</div>

									<div
										className={`p-3 rounded-lg ${message.role === 'user'
											? 'bg-primary text-primary-foreground'
											: 'bg-muted'
											}`}
									>
										<p>{message.content}</p>
										<div className={`text-xs mt-1 ${message.role === 'user' ? 'text-primary-foreground/70' : 'text-gray-500'}`}>
											{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
				</CardContent>

				<CardFooter className="p-4 border-t bg-gray-50">
					<div className="flex w-full items-center space-x-2">
						<Textarea
							placeholder="Ask Dave about Will's qualifications..."
							value={input}
							onChange={(e) => setInput(e.target.value)}
							className="min-h-12 resize-none"
							onKeyDown={(e) => {
								if (e.key === 'Enter' && !e.shiftKey) {
									e.preventDefault();
									handleSendMessage();
								}
							}}
						/>
						<Button type="submit" size="icon" onClick={handleSendMessage}>
							<Send className="h-5 w-5" />
						</Button>
					</div>
				</CardFooter>
			</Card>

			<div className="mt-8 text-center text-sm text-gray-500">
				<p>
					This AI assistant is a concept demonstration. When fully implemented, Dave will be powered by a
					custom-trained model based on Will&apos;s experience, projects, and skills.
				</p>
			</div>
		</div>
	);
};

export default DavePage;