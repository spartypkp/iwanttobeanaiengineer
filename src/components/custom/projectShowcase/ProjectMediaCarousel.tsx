"use client";

import { ChevronLeft, ChevronRight, Info, Maximize, X } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player/lazy';

interface MediaItem {
	type: "image" | "video" | "demo" | "3d";
	url: string;
	alt?: string;
	poster?: string; // for videos
}

interface ProjectMediaCarouselProps {
	media: MediaItem[];
	primaryColor?: string;
}

const ProjectMediaCarousel: React.FC<ProjectMediaCarouselProps> = ({
	media,
	primaryColor = 'rgba(0, 255, 65, 0.7)', // Default matrix green
}) => {
	const [activeMediaIndex, setActiveMediaIndex] = useState(0);
	const [isFullscreen, setIsFullscreen] = useState(false);
	const [showInfo, setShowInfo] = useState(false);
	const [isInView, setIsInView] = useState(false);
	const mediaRef = useRef<HTMLDivElement>(null);
	const activeMedia = media[activeMediaIndex];

	// Set up intersection observer to detect when the media is in view
	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) {
					setIsInView(true);
					observer.unobserve(entries[0].target);
				}
			},
			{
				rootMargin: '0px',
				threshold: 0.1,
			}
		);

		// Store ref value in a variable
		const currentRef = mediaRef.current;

		if (currentRef) {
			observer.observe(currentRef);
		}

		return () => {
			if (currentRef) {
				observer.unobserve(currentRef);
			}
		};
	}, []);

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
							playing={isInView || isFullscreen}
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
		: "relative flex flex-col w-full h-[300px] md:h-[380px] overflow-hidden rounded-xl shadow-[0_2px_15px_rgba(var(--project-accent),0.1)] border border-primary/10";

	return (
		<div
			ref={mediaRef}
			className={mediaContainerClasses}
			style={{ '--project-accent': rgbColor } as React.CSSProperties}
		>
			{/* Main Media Display */}
			<div className="relative flex w-full h-full min-h-0 overflow-hidden rounded-lg group">
				<div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent opacity-50 z-10 pointer-events-none"></div>
				{renderMedia()}

				{/* Navigation arrows - only show if more than one media item */}
				{media.length > 1 && (
					<>
						<button
							onClick={handlePrevious}
							className="absolute left-2 top-1/2 transform -translate-y-1/2 z-30 flex items-center justify-center w-8 h-8 rounded-full bg-background/40 backdrop-blur-sm border border-primary/10 hover:bg-background/60 transition-all duration-200 text-foreground shadow-md opacity-0 group-hover:opacity-100 hover:scale-110"
							aria-label="Previous media"
						>
							<ChevronLeft size={16} className="text-primary/80" />
						</button>
						<button
							onClick={handleNext}
							className="absolute right-2 top-1/2 transform -translate-y-1/2 z-30 flex items-center justify-center w-8 h-8 rounded-full bg-background/40 backdrop-blur-sm border border-primary/10 hover:bg-background/60 transition-all duration-200 text-foreground shadow-md opacity-0 group-hover:opacity-100 hover:scale-110"
							aria-label="Next media"
						>
							<ChevronRight size={16} className="text-primary/80" />
						</button>
					</>
				)}

				{/* Control buttons */}
				<div className="absolute top-2 right-2 z-30 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
					<button
						onClick={toggleInfo}
						className="flex items-center justify-center p-1.5 rounded-full bg-background/40 backdrop-blur-sm border border-primary/10 hover:bg-background/60 transition-all duration-200 text-foreground shadow-md hover:shadow-lg hover:scale-105"
						aria-label="Media information"
					>
						<Info size={14} className="text-primary/80" />
					</button>
					<button
						onClick={toggleFullscreen}
						className="flex items-center justify-center p-1.5 rounded-full bg-background/40 backdrop-blur-sm border border-primary/10 hover:bg-background/60 transition-all duration-200 text-foreground shadow-md hover:shadow-lg hover:scale-105"
						aria-label={isFullscreen ? "Exit fullscreen" : "View fullscreen"}
					>
						{isFullscreen ? (
							<X size={14} className="text-primary/80" />
						) : (
							<Maximize size={14} className="text-primary/80" />
						)}
					</button>
				</div>

				{/* Info overlay with animation */}
				{showInfo && activeMedia?.alt && (
					<div className="absolute bottom-0 left-0 right-0 bg-background/70 backdrop-blur-md p-2 border-t border-primary/10 text-xs z-20 animate-fade-in">
						{activeMedia.alt}
					</div>
				)}

				{/* Gradient overlays for visual interest */}
				<div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent pointer-events-none" />
				<div className="absolute inset-0 bg-gradient-to-r from-background/20 via-transparent to-background/20 pointer-events-none" />
			</div>

			{/* Media Navigation (thumbnails) */}
			{media.length > 1 && (
				<div className="flex items-center justify-center gap-2 mt-2 bg-black/20 backdrop-blur-sm rounded-full py-1 px-3 mx-auto w-fit">
					{media.map((item, index) => (
						<button
							key={index}
							onClick={() => handleMediaChange(index)}
							className={`flex items-center justify-center rounded-full transition-all duration-300 ${activeMediaIndex === index
								? 'bg-primary h-1.5 w-6 shadow-[0_0_5px_rgba(var(--project-accent),0.5)]'
								: 'bg-primary/30 hover:bg-primary/50 h-1.5 w-2'
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