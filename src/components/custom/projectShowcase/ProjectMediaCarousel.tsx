"use client";

import { ProjectShowcase } from '@/lib/types';
import { ChevronLeft, ChevronRight, Info, Maximize, X } from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react';
import ReactPlayer from 'react-player/lazy';

interface ProjectMediaCarouselProps {
	media: ProjectShowcase['media'];
	primaryColor?: string;
}

const ProjectMediaCarousel: React.FC<ProjectMediaCarouselProps> = ({
	media,
	primaryColor = 'rgba(0, 255, 65, 0.7)', // Default matrix green
}) => {
	const [activeMediaIndex, setActiveMediaIndex] = useState(0);
	const [isFullscreen, setIsFullscreen] = useState(false);
	const [showInfo, setShowInfo] = useState(false);
	const activeMedia = media[activeMediaIndex];

	const handleMediaChange = (index: number) => {
		setActiveMediaIndex(index);
	};

	const handleNext = () => {
		setActiveMediaIndex((prevIndex) => (prevIndex + 1) % media.length);
	};

	const handlePrevious = () => {
		setActiveMediaIndex((prevIndex) => (prevIndex - 1 + media.length) % media.length);
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
					<div className="relative flex w-full h-full min-h-0 overflow-hidden rounded-lg">
						<Image
							src={activeMedia.url}
							alt={activeMedia.alt || 'Project image'}
							fill
							className="object-cover object-center transition-transform duration-700 ease-in-out hover:scale-105"
							priority
							sizes="(max-width: 768px) 100vw, 65vw"
						/>
					</div>
				);
			case 'video':
				return (
					<div className="relative flex w-full h-full min-h-0 rounded-lg overflow-hidden">
						<ReactPlayer
							url={activeMedia.url}
							playing={true}
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
					<div className="relative flex w-full h-full min-h-0 rounded-lg overflow-hidden">
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
					<div className="flex items-center justify-center w-full h-full min-h-0 bg-muted rounded-lg">
						<span className="text-muted-foreground font-medium">No preview available</span>
					</div>
				);
		}
	};

	// Conditional classes for fullscreen mode
	const mediaContainerClasses = isFullscreen
		? "fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-md"
		: "relative flex flex-col w-full h-[400px] md:h-[500px] overflow-hidden";

	return (
		<div
			className={mediaContainerClasses}
			style={{ '--project-accent': rgbColor } as React.CSSProperties}
		>
			{/* Main Media Display */}
			<div className="relative flex w-full h-full min-h-0 overflow-hidden">
				{renderMedia()}

				{/* Navigation arrows - only show if more than one media item */}
				{media.length > 1 && (
					<>
						<button
							onClick={handlePrevious}
							className="absolute left-4 top-1/2 transform -translate-y-1/2 z-30 flex items-center justify-center w-10 h-10 rounded-full bg-background/40 backdrop-blur-md border border-primary/10 hover:bg-background/60 transition-all duration-200 text-foreground shadow-md"
							aria-label="Previous media"
						>
							<ChevronLeft size={20} className="text-primary/80" />
						</button>
						<button
							onClick={handleNext}
							className="absolute right-4 top-1/2 transform -translate-y-1/2 z-30 flex items-center justify-center w-10 h-10 rounded-full bg-background/40 backdrop-blur-md border border-primary/10 hover:bg-background/60 transition-all duration-200 text-foreground shadow-md"
							aria-label="Next media"
						>
							<ChevronRight size={20} className="text-primary/80" />
						</button>
					</>
				)}

				{/* Control buttons */}
				<div className="absolute top-4 right-4 z-30 flex items-center gap-2">
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
				{showInfo && activeMedia?.alt && (
					<div className="absolute bottom-0 left-0 right-0 bg-background/70 backdrop-blur-md p-4 border-t border-primary/10 text-sm z-20">
						{activeMedia.alt}
					</div>
				)}

				{/* Gradient overlays for visual interest */}
				<div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent pointer-events-none" />
				<div className="absolute inset-0 bg-gradient-to-r from-background/20 via-transparent to-background/20 pointer-events-none" />
			</div>

			{/* Media Navigation (thumbnails) */}
			{media.length > 1 && (
				<div className="flex items-center justify-center gap-3 mt-4">
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
		</div>
	);
};

// Helper function to convert hex to rgb
const hexToRgb = (hex: string): string => {
	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result
		? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
		: '0, 255, 65'; // Default to matrix green
};

export default ProjectMediaCarousel; 