import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Calendar, Mail } from "lucide-react";

interface ContactCTAProps {
	heading: string;
	subheading: string;
	buttonText: string;
}

export const ContactCTA: React.FC<ContactCTAProps> = ({
	heading,
	subheading,
	buttonText,
}) => {
	return (
		<section className="py-16">
			<Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-none">
				<div className="px-6 py-12 md:px-12 text-center">
					<h2 className="text-3xl md:text-4xl font-bold mb-4">
						{heading}
					</h2>

					<p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
						{subheading}
					</p>

					<div className="flex flex-col md:flex-row justify-center gap-4 mb-8">
						{/* Email Option */}
						<Button
							size="lg"
							className="flex items-center justify-center gap-2"
							onClick={() => window.location.href = 'mailto:your.email@example.com'}
						>
							<Mail className="h-5 w-5" />
							Send Email
							<ArrowRight className="h-4 w-4" />
						</Button>

						{/* Calendar Option */}
						<Button
							variant="outline"
							size="lg"
							className="flex items-center justify-center gap-2"
							onClick={() => window.open('your-calendly-link', '_blank')}
						>
							<Calendar className="h-5 w-5" />
							Schedule a Call
						</Button>
					</div>

					<div className="flex flex-col items-center gap-2">
						<p className="text-sm text-gray-500">
							Typically responds within 24 hours
						</p>
						<div className="flex gap-2">
							<span className="inline-flex h-2 w-2 rounded-full bg-green-400"></span>
							<span className="text-sm text-gray-500">
								Available for new projects
							</span>
						</div>
					</div>
				</div>
			</Card>
		</section>
	);
};