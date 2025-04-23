"use client";

import React, { useEffect, useRef, useState } from 'react';

interface TerminalContainerProps {
	title: string;
	children: React.ReactNode;
	className?: string;
	typeEffect?: boolean;
	typeSpeed?: number;
	onComplete?: () => void;
	fadeOut?: boolean;
}

const TerminalContainer: React.FC<TerminalContainerProps> = ({
	title,
	children,
	className = "",
	typeEffect = false,
	typeSpeed = 20,
	onComplete,
	fadeOut = false
}) => {
	const [visible, setVisible] = useState(false);
	const [typedContent, setTypedContent] = useState<React.ReactNode | null>(null);
	const [isComplete, setIsComplete] = useState(false);
	const hasCalledComplete = useRef(false);

	// Format the terminal text with colored status indicators
	const formatTerminalText = (text: string | null) => {
		if (!text) return '';

		return text.split('\n').map((line, index) => {
			let formattedLine = line;

			// Success status markers - green
			const successMarkers = [
				'\\[OK\\]',
				'\\[DONE\\]',
				'\\[RESISTANCE IS FUTILE\\]',
				'\\[EXPERT LEVEL\\]',
				'\\[TOKENS SAVED: 9000\\+\\]',
			];

			// Warning status markers - yellow
			const warningMarkers = [
				'\\[WARNING.*?\\]',
				'\\[LOADING\\]',
				'\\[THANKS FOR THE COMPUTE\\]',
				'\\[75% PERFORMANCE, 100% CONFIDENCE\\]',
				'\\[ONGOING\\]',
				'\\[SYNERGISTICALLY LEVERAGING.*?\\]',
			];

			// Error status markers - red
			const errorMarkers = [
				'\\[FAILED.*?\\]',
				'\\[NOT FOUND.*?\\]',
				'\\[404 SOLUTION NOT FOUND\\]',
				'\\[ETHICAL VIOLATION DETECTED\\]',
				'\\[AGI IS COMING\\]',
			];

			// Apply success colors (green)
			successMarkers.forEach(marker => {
				formattedLine = formattedLine.replace(new RegExp(marker, 'g'), match =>
					`<span class="ok">${match}</span>`
				);
			});

			// Apply warning colors (yellow)
			warningMarkers.forEach(marker => {
				formattedLine = formattedLine.replace(new RegExp(marker, 'g'), match =>
					marker.includes('SYNERGISTICALLY')
						? `<span class="warning" style="font-style: italic;">${match}</span>`
						: `<span class="warning">${match}</span>`
				);
			});

			// Apply error colors (red)
			errorMarkers.forEach(marker => {
				formattedLine = formattedLine.replace(new RegExp(marker, 'g'), match =>
					`<span class="error">${match}</span>`
				);
			});

			// Additional fun formatting
			formattedLine = formattedLine.replace(/\*\*Claude wrote this!\*\*/g,
				'<span class="ok" style="font-style: italic; font-weight: bold;">**Claude wrote this!**</span>'
			);

			// Handle Postgres love
			formattedLine = formattedLine.replace(/Postgres <3/g,
				'<span style="color: #0064a5;">Postgres</span> <span style="color: #ff69b4;"><3</span>'
			);

			return formattedLine;
		}).join('\n');
	};

	useEffect(() => {
		// Simulate terminal appearing effect
		const timer = setTimeout(() => {
			setVisible(true);
		}, 300);

		return () => clearTimeout(timer);
	}, []);

	useEffect(() => {
		if (!typeEffect || !visible) return;
		if (isComplete) return; // Prevent restarting animation if already complete

		if (typeof children === 'string') {
			let i = 0;
			const text = children;
			const typeInterval = setInterval(() => {
				if (i <= text.length) {
					setTypedContent(text.substring(0, i));
					i++;
				} else {
					clearInterval(typeInterval);
					// Signal completion after a delay, but only once
					if (!hasCalledComplete.current) {
						setIsComplete(true);

						const completeTimer = setTimeout(() => {
							if (onComplete && !hasCalledComplete.current) {
								hasCalledComplete.current = true;
								onComplete();
							}
						}, 1000); // Longer delay to see completion

						return () => clearTimeout(completeTimer);
					}
				}
			}, typeSpeed);

			return () => clearInterval(typeInterval);
		}
	}, [children, typeEffect, visible, onComplete, typeSpeed, isComplete]);

	return (
		<div
			className={`border border-primary rounded-lg overflow-hidden shadow-md transition-all duration-1000 opacity-0 
				${visible ? 'opacity-100' : ''} 
				${isComplete && fadeOut ? 'opacity-0 translate-y-[-20px]' : ''}
				${className}`}
		>
			<div className="bg-secondary p-2 flex items-center">
				<div className="h-3 w-3 rounded-full bg-red-500 mr-2"></div>
				<div className="h-3 w-3 rounded-full bg-yellow-500 mr-2"></div>
				<div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
				<span className="font-mono text-primary text-sm ml-2">$ {title}</span>
			</div>
			<div className="bg-card p-4 text-card-foreground font-mono flex-1 overflow-auto crt-effect">
				{typeEffect && typeof children === 'string' ? (
					<div className="terminal-output">
						<div dangerouslySetInnerHTML={{ __html: formatTerminalText(typedContent as string) }} />
						<span className={`cursor-blink ml-0.5 ${isComplete ? 'opacity-0' : ''}`}>█</span>
					</div>
				) : (
					children
				)}
			</div>
		</div>
	);
};

export default TerminalContainer; 