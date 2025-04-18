"use client";

import React, { useEffect, useState } from 'react';

interface TerminalContainerProps {
	title: string;
	children: React.ReactNode;
	className?: string;
	typeEffect?: boolean;
}

const TerminalContainer: React.FC<TerminalContainerProps> = ({
	title,
	children,
	className = "",
	typeEffect = false
}) => {
	const [visible, setVisible] = useState(false);
	const [typedContent, setTypedContent] = useState<React.ReactNode | null>(null);

	useEffect(() => {
		// Simulate terminal appearing effect
		const timer = setTimeout(() => {
			setVisible(true);
		}, 300);

		return () => clearTimeout(timer);
	}, []);

	useEffect(() => {
		if (!typeEffect || !visible) return;

		if (typeof children === 'string') {
			let i = 0;
			const text = children;
			const typeInterval = setInterval(() => {
				if (i <= text.length) {
					setTypedContent(text.substring(0, i));
					i++;
				} else {
					clearInterval(typeInterval);
				}
			}, 20);

			return () => clearInterval(typeInterval);
		}
	}, [children, typeEffect, visible]);

	return (
		<div
			className={`border border-primary rounded-lg overflow-hidden shadow-md transition-opacity duration-300 opacity-0 ${visible ? 'opacity-100' : ''} ${className}`}
		>
			<div className="bg-secondary p-2 flex items-center">
				<div className="h-3 w-3 rounded-full bg-red-500 mr-2"></div>
				<div className="h-3 w-3 rounded-full bg-yellow-500 mr-2"></div>
				<div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
				<span className="font-mono text-primary text-sm ml-2">$ {title}</span>
			</div>
			<div className="bg-card p-4 text-card-foreground font-mono">
				{typeEffect && typeof children === 'string'
					? <div>{typedContent}<span className="animate-pulse ml-0.5">_</span></div>
					: children
				}
			</div>
		</div>
	);
};

export default TerminalContainer; 