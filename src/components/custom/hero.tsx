import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Github, Linkedin } from 'lucide-react';
import Image from 'next/image';

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
				<div className="space-y-2">
					<h1 className="text-4xl md:text-5xl font-bold tracking-tight">
						{name}
					</h1>
					<div className="flex items-center gap-3">
						<h2 className="text-2xl md:text-3xl text-gray-600">
							{title}
						</h2>
						<Badge variant="secondary">Open to Work</Badge>
					</div>
				</div>

				<p className="text-xl text-gray-600 max-w-2xl">
					{tagline}
				</p>

				<p className="text-lg text-gray-600 max-w-2xl">
					Currently at Contoural Inc, building LLM systems for Fortune 500 companies.
					Previously founded Recodify.ai, Latent Space Podcast, AI Engineer Conference.
				</p>

				<div className="flex gap-4 pt-4">
					<Button size="lg">
						View Projects
						<ArrowRight className="ml-2 h-4 w-4" />
					</Button>
					<Button variant="outline" size="lg">
						Get in Touch
					</Button>
				</div>

				<div className="flex gap-4 pt-2">
					<a
						href="https://github.com/yourusername"
						target="_blank"
						rel="noopener noreferrer"
						className="text-gray-600 hover:text-gray-900"
					>
						<Github className="h-6 w-6" />
					</a>
					<a
						href="https://linkedin.com/in/yourprofile"
						target="_blank"
						rel="noopener noreferrer"
						className="text-gray-600 hover:text-gray-900"
					>
						<Linkedin className="h-6 w-6" />
					</a>
				</div>
			</div>

			{/* Right side - Image */}
			<div className="flex-shrink-0">
				<div className="relative h-64 w-64 md:h-80 md:w-80">
					<Image
						src={image}
						alt={name}
						fill
						className="rounded-2xl object-cover"
						priority
						sizes="(max-width: 768px) 256px, 320px"
					/>
				</div>
			</div>
		</section>
	);
};