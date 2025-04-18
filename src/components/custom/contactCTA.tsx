import { Card } from "@/components/ui/card";
import { ArrowRight, Calendar, Mail } from "lucide-react";
import MatrixButton from "./matrixButton";
import TerminalContainer from "./terminalContainer";

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
			<TerminalContainer title="contact.sh" className="mb-6">
				<div className="font-mono text-sm">
					<p className="mb-2">$ whoami</p>
					<p className="ml-4 mb-4">will_diamond</p>
					<p className="mb-2">$ contact --options</p>
					<p className="ml-4">Available commands: email, schedule, connect</p>
				</div>
			</TerminalContainer>

			<Card className="bg-gradient-to-r from-slate-900 to-gray-900 border-primary/20 border shadow-[0_0_15px_rgba(0,255,65,0.2)]">
				<div className="px-6 py-12 md:px-12 text-center">
					<h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary-foreground bg-primary px-4 py-2 inline-block rounded-md">
						{heading}
					</h2>

					<p className="text-lg text-foreground mb-8 max-w-2xl mx-auto mt-4">
						{subheading}
					</p>

					<div className="flex flex-col md:flex-row justify-center gap-4 mb-8">
						{/* Email Option */}
						<MatrixButton
							variant="terminal"
							size="lg"
							glowIntensity="medium"
							className="flex items-center justify-center gap-2"
							onClick={() => window.location.href = 'mailto:your.email@example.com'}
						>
							<div className="flex items-center gap-2">
								<Mail className="h-5 w-5" />
								Send Email
								<ArrowRight className="h-4 w-4" />
							</div>
						</MatrixButton>

						{/* Calendar Option */}
						<MatrixButton
							variant="ghost"
							size="lg"
							glowIntensity="low"
							className="flex items-center justify-center gap-2"
							onClick={() => window.open('your-calendly-link', '_blank')}
						>
							<Calendar className="h-5 w-5" />
							Schedule a Call
						</MatrixButton>
					</div>

					<div className="flex flex-col items-center gap-2">
						<p className="text-sm text-foreground">
							Typically responds within 24 hours
						</p>
						<div className="flex gap-2 items-center">
							<span className="inline-flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
							<span className="text-sm text-foreground">
								Available for new projects
							</span>
						</div>
					</div>
				</div>
			</Card>
		</section>
	);
};