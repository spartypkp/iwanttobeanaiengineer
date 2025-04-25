'use client';

import { Dialog, DialogContent } from '@/components/ui/dialog';
import { X } from 'lucide-react';
import { useState } from 'react';
import DaveIcon from './dave';
import { TerminalChat } from './terminalChat';

export function DaveFloatingWidget() {
	const [isOpen, setIsOpen] = useState(false);
	const [isMinimized, setIsMinimized] = useState(false);

	return (
		<div className="fixed bottom-5 right-5 z-50">
			{/* Minimized state - just show the icon */}
			{isMinimized && (
				<button
					onClick={() => setIsMinimized(false)}
					className="flex items-center justify-center w-12 h-12 rounded-full bg-zinc-900 border border-primary shadow-lg hover:shadow-primary/20 transition-all duration-300"
					aria-label="Open Dave assistant"
				>
					<DaveIcon size={24} color="#22c55e" />
				</button>
			)}

			{/* Dialog for expanded state */}
			{!isMinimized && (
				<Dialog open={!isMinimized} onOpenChange={(open) => setIsMinimized(!open)}>
					<DialogContent className="p-0 sm:max-w-[500px] border-zinc-800 bg-transparent shadow-xl">
						<div className="relative flex flex-col">
							<div className="absolute top-2 right-2 z-10 flex space-x-2">
								<button
									onClick={() => setIsMinimized(true)}
									className="flex items-center justify-center h-6 w-6 rounded-full bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
									aria-label="Minimize"
								>
									<X size={12} />
								</button>
							</div>
							<TerminalChat className="w-full h-[400px] shadow-lg" />
						</div>
					</DialogContent>
				</Dialog>
			)}

			{/* Always visible trigger when minimized */}
			{isMinimized && (
				<div className="absolute -top-10 right-0 text-xs bg-zinc-900 text-zinc-400 px-2 py-1 rounded-md opacity-80 pointer-events-none">
					Ask Dave
				</div>
			)}
		</div>
	);
} 