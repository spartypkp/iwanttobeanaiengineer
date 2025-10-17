import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Compliance AI Consulting for Regulated Industries",
	description: "AI consulting for legal, healthcare, finance. Will Diamond builds compliance-first AI systems for Fortune 500. 2 years at Contoural handling attorney-client privileged data. 75% efficiency gains, zero vendor lock-in.",
	keywords: [
		"compliance AI consultant",
		"AI consultant regulated industries",
		"legal AI consultant",
		"healthcare AI compliance",
		"HIPAA compliant AI",
		"attorney-client privilege AI",
		"Fortune 500 AI consulting",
		"compliance-first AI",
		"Will Diamond consulting",
		"AI engineer San Francisco"
	],
	openGraph: {
		title: "Compliance AI Consulting | Will Diamond",
		description: "Build AI systems that pass compliance review. 2 years building production AI for Fortune 500 legal teams. Compliance-first architecture, full IP transfer, measurable ROI.",
		url: "https://will-diamond.com/consulting",
		type: "website",
		images: [
			{
				url: '/diamond.png',
				width: 1200,
				height: 630,
				alt: 'Will Diamond - Compliance AI Consultant',
			},
		],
	},
	twitter: {
		card: 'summary_large_image',
		title: "Compliance AI Consulting | Will Diamond",
		description: "Build AI that passes compliance review for regulated industries. Fortune 500 experience.",
		images: ['/diamond.png'],
	},
};

export default function ConsultingLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	// JSON-LD for Professional Service
	const serviceSchema = {
		"@context": "https://schema.org",
		"@type": "ProfessionalService",
		"name": "Will Diamond AI Consulting",
		"description": "Compliance AI consulting for regulated industries including legal, healthcare, and finance",
		"provider": {
			"@type": "Person",
			"name": "Will Diamond",
			"jobTitle": "AI Engineer & Compliance AI Consultant"
		},
		"areaServed": {
			"@type": "Country",
			"name": "United States"
		},
		"serviceType": [
			"Compliance AI Consulting",
			"AI Engineering",
			"LLM Development",
			"Production AI Systems",
			"Legal Tech AI"
		],
		"offers": {
			"@type": "Offer",
			"description": "AI consulting services for regulated industries with compliance-first architecture"
		}
	};

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
			/>
			{children}
		</>
	);
}
