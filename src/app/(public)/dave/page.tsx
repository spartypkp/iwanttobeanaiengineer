"use client";

import DaveIcon from '@/components/custom/dave';
//import { ContentCopilot } from '@/components/dave-admin/content-copilot/ContentCopilot';
import { useRef, useState } from 'react';

export default function DavePage() {
	const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
	const terminalRef = useRef<{ setInput: (text: string) => void; }>(null);

	// Questions that can be clicked on
	const suggestedQuestions = [
		"What are Will's core skills?",
		"Tell me about his background in AI",
		"What projects has he worked on?",
		"Why should I hire Will?"
	];

	const handleQuestionClick = (question: string) => {
		setSelectedQuestion(question);
		// Pass the question to the terminal chat component
		if (terminalRef.current) {
			terminalRef.current.setInput(question);
		}
	};

	return (
		<div className="container mx-auto px-4 py-12 max-w-4xl">
			<div className="text-center mb-8">
				<div className="mb-4 flex justify-center">
					<DaveIcon size={64} color="#22c55e" />
				</div>
				<h1 className="text-4xl font-bold mb-4">Chat with Dave</h1>
				<p className="text-xl text-muted-foreground max-w-2xl mx-auto">
					Dave is Will&apos;s AI representative. Ask anything about his skills, experience,
					or projects to learn why he would be a great addition to your team.
				</p>
			</div>

			<div className="grid md:grid-cols-4 gap-8">
				<div className="md:col-span-1 space-y-4">
					<div className="rounded-md border border-zinc-800 p-4 bg-zinc-900/50">
						<h3 className="text-sm font-semibold mb-2 text-zinc-400">Suggested Questions</h3>
						<ul className="space-y-2 text-sm">
							{suggestedQuestions.map((question, index) => (
								<li key={index}>
									<button
										className="text-left text-primary hover:underline w-full"
										onClick={() => handleQuestionClick(question)}
									>
										{question}
									</button>
								</li>
							))}
						</ul>
					</div>

					<div className="rounded-md border border-zinc-800 p-4 bg-zinc-900/50">
						<h3 className="text-sm font-semibold mb-2 text-zinc-400">Available Commands</h3>
						<div className="text-xs text-zinc-500 font-mono space-y-1">
							<p><span className="text-green-500">help</span> - Show available commands</p>
							<p><span className="text-green-500">projects</span> - List Will&apos;s projects</p>
							<p><span className="text-green-500">skills</span> - Show Will&apos;s skills</p>
							<p><span className="text-green-500">contact</span> - Get contact info</p>
							<p><span className="text-green-500">clear</span> - Clear conversation</p>
						</div>
					</div>
				</div>

				<div className="md:col-span-3">
					{/* <ContentCopilot
						className="w-full h-[600px]"
						ref={terminalRef}
					/> */}
				</div>
			</div>

			<div className="mt-8 text-center text-xs text-zinc-500">
				<p>
					Powered by Anthropic Claude via Vercel AI SDK. Dave has knowledge about Will&apos;s
					experience, projects, and skills to provide accurate information.
				</p>
			</div>
		</div>
	);
}