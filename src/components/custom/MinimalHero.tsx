import { ArrowRight, Github, Linkedin, Mail } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import MatrixButton from './matrixButton';

interface MinimalHeroProps {
	name: string;
	title: string;
	image: string;
}

const MinimalHero: React.FC<MinimalHeroProps> = ({ name, title, image }) => {
	return (
		<div className="py-10 flex flex-col md:flex-row items-center gap-6">
			{/* Profile Image */}
			<div className="flex-shrink-0">
				<div className="relative h-32 w-32 md:h-36 md:w-36 rounded-full overflow-hidden border-2 border-primary/30 shadow-[0_0_15px_rgba(var(--primary)/.2)]">
					<Image
						src={image}
						alt={name}
						fill
						className="object-cover"
						priority
						sizes="(max-width: 768px) 128px, 144px"
					/>
					<div className="absolute inset-0 bg-gradient-to-tl from-background/40 via-transparent to-transparent"></div>
				</div>
			</div>

			{/* Info */}
			<div className="flex-1 space-y-4 text-center md:text-left">
				<div>
					<h1 className="text-3xl font-bold text-foreground">{name}</h1>
					<h2 className="text-xl text-muted-foreground">{title}</h2>
				</div>

				<p className="text-muted-foreground max-w-lg">
					Building LLM systems for Fortune 500 companies at Contoural Inc.
					Previously founded Recodify.ai and organized AI Engineer Conference.
				</p>

				<div className="flex flex-wrap gap-3 justify-center md:justify-start">
					<MatrixButton variant="terminal" size="sm" glowIntensity="low" asChild>
						<Link href="/projects">
							<div className="flex items-center text-sm">
								View Projects
								<ArrowRight className="ml-1 h-3 w-3" />
							</div>
						</Link>
					</MatrixButton>

					<div className="flex gap-2">
						<a
							href="https://github.com/yourusername"
							target="_blank"
							rel="noopener noreferrer"
							className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-full transition-colors"
							aria-label="GitHub"
						>
							<Github className="h-5 w-5" />
						</a>
						<a
							href="https://linkedin.com/in/yourprofile"
							target="_blank"
							rel="noopener noreferrer"
							className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-full transition-colors"
							aria-label="LinkedIn"
						>
							<Linkedin className="h-5 w-5" />
						</a>
						<a
							href="mailto:your.email@example.com"
							className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-full transition-colors"
							aria-label="Email"
						>
							<Mail className="h-5 w-5" />
						</a>
					</div>
				</div>
			</div>
		</div>
	);
};

export default MinimalHero; 