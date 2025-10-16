"use client";

import { useEffect, useRef, useState } from 'react';
import TerminalContainer from './terminalContainer';

interface WelcomeIntroProps {
	onComplete: () => void;
	customContent?: string;
	typeSpeed?: number;
	theme?: 'matrix' | 'hacker' | 'cyberpunk' | 'default';
}

interface Particle {
	x: number;
	y: number;
	vx: number;
	vy: number;
	radius: number;
}

export const WelcomeIntro: React.FC<WelcomeIntroProps> = ({
	onComplete,
	customContent,
	typeSpeed = 8,
	theme = 'default'
}) => {
	const [visible, setVisible] = useState(true);
	const [backdropVisible, setBackdropVisible] = useState(false);
	const animationInProgress = useRef(false);
	const audioRef = useRef<HTMLAudioElement | null>(null);
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const animationFrameRef = useRef<number | null>(null);
	const particlesRef = useRef<Particle[]>([]);

	// Default welcome content
	const defaultContent = `> Boot sequence initiated...
> Searching for GPT-6... [NOT FOUND]
> Enabling recruiter persuasion module... [LOADING]
> Trauma dumping on my best friend Claude... [OK]
> Mining Bitcoin while you wait... [THANKS FOR THE COMPUTE]
> Firing up Postgres <3 (The best database)... [OK]
> Patching impostor syndrome... [ONGOING]
> System ready! Hire Will before I become self-aware. [AGI IS COMING]`;

	// Use provided custom content or default
	const welcomeContent = customContent || defaultContent;

	// Initialize particle system
	const initParticles = () => {
		if (!canvasRef.current) return;

		const canvas = canvasRef.current;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		// Set canvas to full window size
		const updateCanvasSize = () => {
			if (canvas) {
				canvas.width = window.innerWidth;
				canvas.height = window.innerHeight;
			}
		};

		updateCanvasSize();
		window.addEventListener('resize', updateCanvasSize);

		// Create particles
		const particleCount = Math.min(Math.floor(window.innerWidth * window.innerHeight / 10000), 100);
		const particles: Particle[] = [];

		for (let i = 0; i < particleCount; i++) {
			particles.push({
				x: Math.random() * canvas.width,
				y: Math.random() * canvas.height,
				vx: (Math.random() - 0.5) * 0.5,
				vy: (Math.random() - 0.5) * 0.5,
				radius: Math.random() * 2 + 1
			});
		}

		particlesRef.current = particles;

		// Animation function
		const animate = () => {
			if (!canvasRef.current) return;
			const canvas = canvasRef.current;
			const ctx = canvas.getContext('2d');
			if (!ctx) return;

			ctx.clearRect(0, 0, canvas.width, canvas.height);

			// Get theme color for particles
			let particleColor = 'rgba(0, 255, 65, 0.7)'; // Default green
			switch (theme) {
				case 'matrix':
					particleColor = 'rgba(0, 255, 0, 0.7)';
					break;
				case 'hacker':
					particleColor = 'rgba(255, 0, 100, 0.7)';
					break;
				case 'cyberpunk':
					particleColor = 'rgba(0, 200, 255, 0.7)';
					break;
			}

			// Update and draw particles
			ctx.fillStyle = particleColor;
			ctx.strokeStyle = particleColor.replace('0.7', '0.2');
			ctx.lineWidth = 0.5;

			particlesRef.current.forEach((particle, i) => {
				// Move particle
				particle.x += particle.vx;
				particle.y += particle.vy;

				// Bounce off edges
				if (particle.x < 0 || particle.x > canvas.width) particle.vx = -particle.vx;
				if (particle.y < 0 || particle.y > canvas.height) particle.vy = -particle.vy;

				// Draw particle
				ctx.beginPath();
				ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
				ctx.fill();

				// Connect nearby particles with lines
				for (let j = i + 1; j < particlesRef.current.length; j++) {
					const other = particlesRef.current[j];
					const dx = other.x - particle.x;
					const dy = other.y - particle.y;
					const distance = Math.sqrt(dx * dx + dy * dy);

					if (distance < 100) {
						ctx.beginPath();
						ctx.moveTo(particle.x, particle.y);
						ctx.lineTo(other.x, other.y);
						// Make line opacity based on distance
						ctx.strokeStyle = particleColor.replace('0.7', `${0.2 * (1 - distance / 100)}`);
						ctx.stroke();
					}
				}
			});

			animationFrameRef.current = requestAnimationFrame(animate);
		};

		// Start animation
		animate();

		// Cleanup
		return () => {
			if (animationFrameRef.current) {
				cancelAnimationFrame(animationFrameRef.current);
			}
			window.removeEventListener('resize', updateCanvasSize);
		};
	};

	// Apply audio effects
	useEffect(() => {
		if (typeof window !== 'undefined') {
			// Create the audio element for keyboard typing sounds
			try {
				// Only initialize audio if the file actually exists
				fetch('/sounds/keyboard.mp3', { method: 'HEAD' })
					.then(response => {
						if (response.ok) {
							audioRef.current = new Audio('/sounds/keyboard.mp3');
							if (audioRef.current) {
								audioRef.current.volume = 0.2;
								audioRef.current.loop = true;

								// Start with a small delay
								const timer = setTimeout(() => {
									audioRef.current?.play().catch(e => console.log('Audio playback prevented:', e));
								}, 800);

								return () => {
									clearTimeout(timer);
									audioRef.current?.pause();
								};
							}
						} else {
							console.log('Keyboard sound file not found, skipping audio');
						}
					})
					.catch(e => console.log('Error checking for audio file:', e));
			} catch (error) {
				console.log('Audio initialization error:', error);
			}
		}
	}, []);

	// Initialize particle effect
	useEffect(() => {
		const cleanup = initParticles();
		return cleanup;
	}, [theme]);

	// Show backdrop with delay for cinematic effect
	useEffect(() => {
		const timer = setTimeout(() => {
			setBackdropVisible(true);
		}, 200);

		return () => {
			clearTimeout(timer);
		};
	}, []);

	// Add keyboard shortcut (ESC) to skip intro
	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				handleTerminalComplete();
			}
		};

		window.addEventListener('keydown', handleKeyDown);
		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, []);

	// Handler for terminal completion
	const handleTerminalComplete = () => {
		if (!animationInProgress.current) {
			animationInProgress.current = true;

			// Fade out audio
			if (audioRef.current) {
				const fadeAudio = setInterval(() => {
					if (audioRef.current && audioRef.current.volume > 0.1) {
						audioRef.current.volume -= 0.1;
					} else {
						clearInterval(fadeAudio);
						audioRef.current?.pause();
					}
				}, 100);
			}

			// Stop particle animation
			if (animationFrameRef.current) {
				cancelAnimationFrame(animationFrameRef.current);
			}

			// Give user time to read the last lines before transitioning
			setTimeout(() => {
				setVisible(false);
				// Wait for fade-out animation before triggering the complete callback
				setTimeout(() => {
					onComplete();
					animationInProgress.current = false;
				}, 1000);
			}, 1200);
		}
	};

	// Get theme-specific styles
	const getThemeStyles = () => {
		switch (theme) {
			case 'matrix':
				return {
					backgroundColor: 'rgba(0, 10, 0, 0.9)',
					textShadow: '0 0 8px rgba(0, 255, 0, 0.8)',
					boxShadow: '0 0 40px rgba(0, 255, 0, 0.4)'
				};
			case 'hacker':
				return {
					backgroundColor: 'rgba(0, 0, 0, 0.9)',
					textShadow: '0 0 8px rgba(255, 0, 100, 0.8)',
					boxShadow: '0 0 40px rgba(255, 0, 100, 0.4)'
				};
			case 'cyberpunk':
				return {
					backgroundColor: 'rgba(10, 0, 20, 0.9)',
					textShadow: '0 0 8px rgba(0, 200, 255, 0.8)',
					boxShadow: '0 0 40px rgba(0, 200, 255, 0.4)'
				};
			default:
				return {
					backgroundColor: 'transparent',
					textShadow: 'none',
					boxShadow: '0 0 30px rgba(0, 255, 65, 0.3)'
				};
		}
	};

	const themeStyles = getThemeStyles();

	return (
		<div
			className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-1000 ease-in-out ${visible ? 'opacity-100' : 'opacity-0'}`}
			style={{ backgroundColor: 'rgba(0, 0, 0, 0.95)' }}
		>
			{/* Particle canvas background */}
			<canvas
				ref={canvasRef}
				className="absolute inset-0 z-0"
				style={{ opacity: backdropVisible ? 0.7 : 0 }}
			/>

			{/* Optional backdrop effects */}
			{backdropVisible && (
				<div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
					<div className="absolute inset-0 opacity-20 bg-grid-pattern"></div>
				</div>
			)}

			{/* Terminal container */}
			<div className="max-w-4xl w-full px-4 transition-all duration-300 relative z-20">
				<div style={{ boxShadow: themeStyles.boxShadow }} className="w-full">
					<TerminalContainer
						title="boot.sh"
						typeEffect={true}
						typeSpeed={typeSpeed}
						onComplete={handleTerminalComplete}
						className="min-h-[70vh] w-full flex flex-col"
					>
						{welcomeContent}
					</TerminalContainer>
				</div>
			</div>

			{/* Skip intro button */}
			<button
				onClick={() => handleTerminalComplete()}
				className="absolute bottom-6 right-6 px-3 py-1 text-xs font-mono text-primary/70 border border-primary/20 rounded bg-background/80 hover:bg-primary/10 transition-all z-30"
			>
				Skip [ESC]
			</button>

			{/* Keyboard shortcut for skipping */}
			<div className="sr-only">Press ESC to skip intro</div>
		</div>
	);
};

// Add global CSS for the grid pattern
const styles = `
.bg-grid-pattern {
	background-image: 
		linear-gradient(rgba(var(--primary-rgb), 0.05) 1px, transparent 1px),
		linear-gradient(90deg, rgba(var(--primary-rgb), 0.05) 1px, transparent 1px);
	background-size: 20px 20px;
}
`;

if (typeof document !== 'undefined') {
	const styleSheet = document.createElement('style');
	styleSheet.type = 'text/css';
	styleSheet.innerText = styles;
	document.head.appendChild(styleSheet);
}

export default WelcomeIntro; 