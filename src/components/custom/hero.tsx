import { Badge } from '@/components/ui/badge';
import { ArrowRight, Github, Linkedin, Terminal } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import MatrixButton from './matrixButton';

interface HeroProps {
	name: string;
	title: string;
	tagline: string;
	image: string;
}

export const Hero: React.FC<HeroProps> = ({ name, title, tagline, image }) => {
	return (
		<section className="py-20 flex flex-col md:flex-row items-center gap-12">
			{/* Left side - Content */}
			<div className="flex-1 space-y-6">
				<div className="space-y-3">
					<div className="flex items-center gap-2 text-primary text-sm font-mono mb-1">
						<Terminal size={16} />
						<span>$ whoami</span>
					</div>
					<h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
						{name}
					</h1>
					<div className="flex items-center gap-3">
						<h2 className="text-2xl md:text-3xl text-muted-foreground font-mono">
							{title}
						</h2>
						<Badge variant="default" className="bg-primary text-primary-foreground">Open to Work</Badge>
					</div>
				</div>

				<p className="text-xl text-foreground max-w-2xl font-light">
					{tagline}
				</p>

				<div className="pl-4 border-l-2 border-primary/50">
					<p className="text-lg text-muted-foreground max-w-2xl">
						Currently at <span className="text-primary">Contoural Inc</span>, building LLM systems for Fortune 500 companies.
						Previously founded <span className="text-primary">Recodify.ai</span>, Latent Space Podcast, AI Engineer Conference.
					</p>
				</div>

				<div className="flex gap-4 pt-4">
					<MatrixButton variant="terminal" size="lg" glowIntensity="medium" asChild>
						<Link href="/projects">
							<div className="flex items-center">
								View Projects
								<ArrowRight className="ml-2 h-4 w-4" />
							</div>
						</Link>
					</MatrixButton>
					<MatrixButton variant="ghost" size="lg" glowIntensity="low" asChild>
						<Link href="#contact">
							Get in Touch
						</Link>
					</MatrixButton>
				</div>

				<div className="flex gap-4 pt-2">
					<a
						href="https://github.com/yourusername"
						target="_blank"
						rel="noopener noreferrer"
						className="text-muted-foreground hover:text-primary transition-colors"
					>
						<Github className="h-6 w-6" />
					</a>
					<a
						href="https://linkedin.com/in/yourprofile"
						target="_blank"
						rel="noopener noreferrer"
						className="text-muted-foreground hover:text-primary transition-colors"
					>
						<Linkedin className="h-6 w-6" />
					</a>
				</div>
			</div>

			{/* Right side - Image */}
			<div className="flex-shrink-0">
				<div className="relative h-64 w-64 md:h-80 md:w-80 border-4 border-primary/20 rounded-2xl overflow-hidden shadow-[0_0_15px_rgba(var(--primary)/.2)]">
					<Image
						src={image}
						alt={name}
						fill
						className="rounded-xl object-cover"
						priority
						sizes="(max-width: 768px) 256px, 320px"
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-transparent"></div>
				</div>
			</div>
		</section>
	);
};