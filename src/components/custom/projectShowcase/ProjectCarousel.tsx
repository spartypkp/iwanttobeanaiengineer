"use client";

import { ProjectShowcase } from '@/lib/types';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import ProjectSpotlight from './ProjectSpotlight';

interface ProjectCarouselProps {
	projects: ProjectShowcase[];
	initialIndex?: number;
	transitionEffect?: 'slide' | 'fade' | 'zoom';
}

const ProjectCarousel: React.FC<ProjectCarouselProps> = ({
	projects,
	initialIndex = 0,
	transitionEffect = 'slide',
}) => {
	const [currentIndex, setCurrentIndex] = useState(initialIndex);
	const [direction, setDirection] = useState(0); // -1 for left, 1 for right
	const [isTransitioning, setIsTransitioning] = useState(false);

	// Animation variants based on the selected transition effect
	const variants = {
		slide: {
			enter: (direction: number) => ({
				x: direction > 0 ? '100%' : '-100%',
				opacity: 0,
			}),
			center: {
				x: 0,
				opacity: 1,
				transition: {
					x: { type: 'spring', stiffness: 300, damping: 30 },
					opacity: { duration: 0.2 },
				},
			},
			exit: (direction: number) => ({
				x: direction < 0 ? '100%' : '-100%',
				opacity: 0,
				transition: {
					x: { type: 'spring', stiffness: 300, damping: 30 },
					opacity: { duration: 0.2 },
				},
			}),
		},
		fade: {
			enter: { opacity: 0 },
			center: { opacity: 1, transition: { duration: 0.5 } },
			exit: { opacity: 0, transition: { duration: 0.5 } },
		},
		zoom: {
			enter: { scale: 0.8, opacity: 0 },
			center: {
				scale: 1,
				opacity: 1,
				transition: {
					scale: { type: 'spring', stiffness: 300, damping: 30 },
					opacity: { duration: 0.5 },
				},
			},
			exit: {
				scale: 0.8,
				opacity: 0,
				transition: {
					scale: { type: 'spring', stiffness: 300, damping: 30 },
					opacity: { duration: 0.5 },
				},
			},
		},
	};

	// Handle navigation
	const handleNext = useCallback(() => {
		if (isTransitioning) return;
		setIsTransitioning(true);
		setDirection(1);
		setCurrentIndex((prevIndex) => (prevIndex + 1) % projects.length);
	}, [isTransitioning, projects.length]);

	const handlePrevious = useCallback(() => {
		if (isTransitioning) return;
		setIsTransitioning(true);
		setDirection(-1);
		setCurrentIndex((prevIndex) => (prevIndex - 1 + projects.length) % projects.length);
	}, [isTransitioning, projects.length]);

	const handleSelectIndex = useCallback((index: number) => {
		if (isTransitioning || index === currentIndex) return;
		setIsTransitioning(true);
		setDirection(index > currentIndex ? 1 : -1);
		setCurrentIndex(index);
	}, [isTransitioning, currentIndex]);

	// Keyboard navigation
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'ArrowLeft') {
				handlePrevious();
			} else if (e.key === 'ArrowRight') {
				handleNext();
			}
		};

		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [handleNext, handlePrevious]);

	// Reset transitioning state after animation completes
	const handleAnimationComplete = () => {
		setIsTransitioning(false);
	};

	// Handle the case of no projects
	if (projects.length === 0) {
		return <div className="flex items-center justify-center w-full h-full min-h-[500px] text-lg font-medium text-muted-foreground">No projects to display</div>;
	}

	return (
		<div className="flex flex-col w-full h-full min-h-[90vh] bg-secondary relative">
			{/* Top gradient */}
			<div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-b from-background to-transparent pointer-events-none z-10"></div>

			{/* Main content area */}
			<div className="flex-1 flex items-center justify-center pb-20 pt-4 relative">
				{/* Main carousel display */}
				<div className="w-full h-full flex items-center justify-center px-4 md:px-8">
					<AnimatePresence initial={false} custom={direction} onExitComplete={handleAnimationComplete}>
						<motion.div
							key={currentIndex}
							custom={direction}
							variants={variants[transitionEffect]}
							initial="enter"
							animate="center"
							exit="exit"
							className="w-full h-full flex items-center justify-center"
						>
							<ProjectSpotlight
								project={projects[currentIndex]}
								isActive={true}
								onNext={handleNext}
								onPrevious={handlePrevious}
							/>
						</motion.div>
					</AnimatePresence>
				</div>
			</div>

			{/* Bottom navigation area (dots and arrows) - positioned at the bottom */}
			<div className="flex-shrink-0 w-full flex items-center justify-between px-4 md:px-8 lg:px-12 py-4 z-20 absolute bottom-0 left-0 right-0">
				{/* Left navigation arrow */}
				<button
					onClick={handlePrevious}
					className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-background/30 backdrop-blur-md border border-primary/10 shadow-lg hover:bg-background/50 hover:border-primary/20 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2 focus:ring-offset-background"
					aria-label="Previous project"
				>
					<ChevronLeft className="h-6 w-6 md:h-7 md:w-7 text-primary/80" />
				</button>

				{/* Project Navigation (dots) */}
				<div className="flex items-center justify-center gap-2 bg-background/50 backdrop-blur-lg py-3 px-6 rounded-full border border-primary/10 shadow-md">
					{Array.from({ length: projects.length }).map((_, index) => (
						<button
							key={index}
							onClick={() => handleSelectIndex(index)}
							aria-label={`Navigate to project ${index + 1}`}
							className="relative flex items-center justify-center h-2.5 w-2.5 mx-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
						>
							<motion.div
								className="absolute inset-0 rounded-full bg-primary/20 hover:bg-primary/40 transition-colors"
								initial={{ scale: 1 }}
								whileHover={{ scale: 1.5 }}
								whileTap={{ scale: 0.9 }}
							/>
							{currentIndex === index && (
								<motion.div
									className="absolute inset-0 bg-primary rounded-full"
									layoutId="activeProjectDot"
									transition={{
										type: "spring",
										stiffness: 300,
										damping: 30
									}}
								/>
							)}
						</button>
					))}

					{/* Project Counter */}
					<div className="flex items-center justify-center ml-3 text-sm font-medium bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
						<span className="text-primary font-semibold">{currentIndex + 1}</span>
						<span className="mx-1 text-primary/60">/</span>
						<span className="text-primary/60">{projects.length}</span>
					</div>
				</div>

				{/* Right navigation arrow */}
				<button
					onClick={handleNext}
					className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-background/30 backdrop-blur-md border border-primary/10 shadow-lg hover:bg-background/50 hover:border-primary/20 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2 focus:ring-offset-background"
					aria-label="Next project"
				>
					<ChevronRight className="h-6 w-6 md:h-7 md:w-7 text-primary/80" />
				</button>
			</div>

			{/* Bottom gradient */}
			<div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-background to-transparent pointer-events-none z-10"></div>
		</div>
	);
};

export default ProjectCarousel; 