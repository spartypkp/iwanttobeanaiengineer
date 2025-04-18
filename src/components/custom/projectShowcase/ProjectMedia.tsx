"use client";

import { ProjectShowcase } from '@/lib/types';
import { motion } from 'framer-motion';
import { Info, Maximize, X } from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react';
import ReactPlayer from 'react-player/lazy';

interface ProjectMediaProps {
	media: ProjectShowcase['media'];
	isActive: boolean;
	primaryColor?: string;
}

const ProjectMedia: React.FC<ProjectMediaProps> = ({
	media,
	isActive,
	primaryColor = 'rgba(0, 255, 65, 0.7)', // Default matrix green
}) => {
	const [activeMediaIndex, setActiveMediaIndex] = useState(0);
	const [isFullscreen, setIsFullscreen] = useState(false);
	const [showInfo, setShowInfo] = useState(false);
	const activeMedia = media[activeMediaIndex];

	const handleMediaChange = (index: number) => {
		setActiveMediaIndex(index);
	};

	const toggleFullscreen = () => {
		setIsFullscreen(!isFullscreen);
	};

	const toggleInfo = () => {
		setShowInfo(!showInfo);
	};

	// Convert primaryColor to RGB values for use in CSS variables
	const rgbColor = primaryColor.startsWith('#')
		? hexToRgb(primaryColor)
		: primaryColor;

	// Render the appropriate media based on type
	const renderMedia = () => {
		if (!activeMedia) return null;

		switch (activeMedia.type) {
			case 'image':
				return (
					<div className="relative flex w-full h-full min-h-0 overflow-hidden">
						<Image
							src={activeMedia.url}
							alt={activeMedia.alt || 'Project image'}
							fill
							className="object-cover object-center transition-transform duration-700 ease-in-out hover:scale-105"
							priority={isActive}
							sizes="(max-width: 768px) 100vw, 65vw"
						/>
					</div>
				);
			case 'video':
				return (
					<div className="relative flex w-full h-full min-h-0">
						<ReactPlayer
							url={activeMedia.url}
							playing={isActive}
							muted={true}
							loop={true}
							width="100%"
							height="100%"
							light={activeMedia.poster}
							playsinline
							controls={true}
							className="!w-full !h-full"
							config={{
								file: {
									attributes: {
										poster: activeMedia.poster,
										controlsList: 'nodownload',
									}
								}
							}}
						/>
					</div>
				);
			case 'demo':
				return (
					<div className="relative flex w-full h-full min-h-0">
						<iframe
							src={activeMedia.url}
							title={activeMedia.alt || 'Project demo'}
							className="w-full h-full border-0"
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
							loading="lazy"
						/>
					</div>
				);
			default:
				return (
					<div className="flex items-center justify-center w-full h-full min-h-0 bg-muted">
						<span className="text-muted-foreground font-medium">No preview available</span>
					</div>
				);
		}
	};

	// Animation variants
	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				duration: 0.5,
				staggerChildren: 0.1
			}
		}
	};

	const mediaVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				type: "spring",
				stiffness: 300,
				damping: 30
			}
		}
	};

	// Conditional classes for fullscreen mode
	const mediaContainerClasses = isFullscreen
		? "fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-md"
		: "relative flex w-full h-full overflow-hidden";

	return (
		<motion.div
			className={mediaContainerClasses}
			style={{ '--project-accent': rgbColor } as React.CSSProperties}
			variants={containerVariants}
			initial="hidden"
			animate={isActive ? "visible" : "hidden"}
		>
			{/* Main Media Display */}
			<motion.div
				className="relative flex w-full h-full min-h-0 overflow-hidden"
				variants={mediaVariants}
			>
				{renderMedia()}

				{/* Control buttons */}
				<div className="absolute top-4 right-4 z-10 flex items-center gap-2">
					<button
						onClick={toggleInfo}
						className="flex items-center justify-center p-2 rounded-full bg-background/40 backdrop-blur-md border border-primary/10 hover:bg-background/60 transition-all duration-200 text-foreground shadow-md"
						aria-label="Media information"
					>
						<Info size={18} className="text-primary/80" />
					</button>
					<button
						onClick={toggleFullscreen}
						className="flex items-center justify-center p-2 rounded-full bg-background/40 backdrop-blur-md border border-primary/10 hover:bg-background/60 transition-all duration-200 text-foreground shadow-md"
						aria-label={isFullscreen ? "Exit fullscreen" : "View fullscreen"}
					>
						{isFullscreen ? (
							<X size={18} className="text-primary/80" />
						) : (
							<Maximize size={18} className="text-primary/80" />
						)}
					</button>
				</div>

				{/* Info overlay */}
				{showInfo && activeMedia.alt && (
					<motion.div
						className="absolute bottom-0 left-0 right-0 bg-background/70 backdrop-blur-md p-4 border-t border-primary/10 text-sm"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: 20 }}
					>
						{activeMedia.alt}
					</motion.div>
				)}

				{/* Gradient overlays for visual interest */}
				<div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent pointer-events-none" />
				<div className="absolute inset-0 bg-gradient-to-r from-background/20 via-transparent to-background/20 pointer-events-none" />
			</motion.div>

			{/* Media Navigation (if multiple media items) */}
			{media.length > 1 && (
				<div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-3 z-10 px-4 py-2 bg-background/40 backdrop-blur-md rounded-full border border-primary/10">
					{media.map((item, index) => (
						<button
							key={index}
							onClick={() => handleMediaChange(index)}
							className={`flex items-center justify-center h-2 rounded-full transition-all duration-300 ${activeMediaIndex === index
								? 'bg-primary w-8'
								: 'bg-primary/30 hover:bg-primary/50 w-3'
								}`}
							aria-label={`View media ${index + 1}`}
						/>
					))}
				</div>
			)}
		</motion.div>
	);
};

// Helper function to convert hex to RGB
function hexToRgb(hex: string): string {
	// Remove # if present
	hex = hex.replace('#', '');

	// Parse hex values
	const r = parseInt(hex.substring(0, 2), 16);
	const g = parseInt(hex.substring(2, 4), 16);
	const b = parseInt(hex.substring(4, 6), 16);

	return `${r}, ${g}, ${b}`;
}

export default ProjectMedia; 