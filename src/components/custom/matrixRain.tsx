"use client";

import React, { useEffect, useRef } from 'react';

interface MatrixRainProps {
	opacity?: number;
	density?: number;
	speed?: number;
}

const MatrixRain: React.FC<MatrixRainProps> = ({
	opacity = 0.15,
	density = 30,
	speed = 1.5
}) => {
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!containerRef.current) return;

		const container = containerRef.current;
		const width = window.innerWidth;
		const height = window.innerHeight;
		const characters = 'ァアィイゥウェエォオカガキギクグケゲコゴサザシジスズセゼソゾタダチヂッツヅテデトド0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
		const matrixElements: HTMLElement[] = [];

		// Calculate how many streams based on density
		const streamCount = Math.floor(width / density);

		// Get computed style of primary color for the rain characters
		const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim();
		const rainColor = primaryColor ? `hsl(${primaryColor})` : 'hsl(143, 90%, 50%)';

		// Create matrix rain elements
		for (let i = 0; i < streamCount; i++) {
			const element = document.createElement('div');
			element.className = 'matrix-rain-character';
			element.style.left = `${(i / streamCount) * 100}%`;
			element.style.animationDuration = `${(Math.random() * 2 + 1) / speed}s`;
			element.style.opacity = `${opacity}`;
			element.style.animationDelay = `${Math.random() * 2}s`;
			element.style.color = rainColor;
			element.innerText = characters.charAt(Math.floor(Math.random() * characters.length));
			container.appendChild(element);
			matrixElements.push(element);
		}

		// Animation loop
		const intervalId = setInterval(() => {
			matrixElements.forEach(element => {
				// Change character periodically
				if (Math.random() < 0.1) {
					element.innerText = characters.charAt(Math.floor(Math.random() * characters.length));
				}
			});
		}, 100);

		// Handle resizing
		const handleResize = () => {
			// Clear existing elements
			while (container.firstChild) {
				container.removeChild(container.firstChild);
			}
			matrixElements.length = 0;

			// Recalculate based on new size
			const newWidth = window.innerWidth;
			const newStreamCount = Math.floor(newWidth / density);

			// Create new elements
			for (let i = 0; i < newStreamCount; i++) {
				const element = document.createElement('div');
				element.className = 'matrix-rain-character';
				element.style.left = `${(i / newStreamCount) * 100}%`;
				element.style.animationDuration = `${(Math.random() * 2 + 1) / speed}s`;
				element.style.opacity = `${opacity}`;
				element.style.animationDelay = `${Math.random() * 2}s`;
				element.style.color = rainColor;
				element.innerText = characters.charAt(Math.floor(Math.random() * characters.length));
				container.appendChild(element);
				matrixElements.push(element);
			}
		};

		window.addEventListener('resize', handleResize);

		// Cleanup
		return () => {
			clearInterval(intervalId);
			window.removeEventListener('resize', handleResize);
			while (container.firstChild) {
				container.removeChild(container.firstChild);
			}
		};
	}, [opacity, density, speed]);

	return (
		<div
			ref={containerRef}
			className="fixed inset-0 pointer-events-none -z-10 overflow-hidden"
			style={{ opacity }}
		/>
	);
};

export default MatrixRain; 