import NavBar from "@/components/custom/navBar";
import { Analytics } from "@vercel/analytics/react";
import { Inter } from "next/font/google";
import "../globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
	metadataBase: new URL('https://will-diamond.com'),
	title: {
		default: "Will Diamond | AI Engineer & Compliance AI Consultant",
		template: "%s | Will Diamond"
	},
	description: "Will Diamond - AI Engineer specializing in compliance AI and production LLM systems for regulated industries. 2 years building AI for Fortune 500 legal teams at Contoural. San Francisco based, available for consulting.",
	keywords: ["Will Diamond", "AI Engineer", "Compliance AI", "AI Consultant", "LLM Engineer", "Legal Tech AI", "Regulated Industries AI", "Production AI Systems", "San Francisco AI Engineer"],
	authors: [{ name: "Will Diamond" }],
	creator: "Will Diamond",
	openGraph: {
		type: 'website',
		locale: 'en_US',
		url: 'https://will-diamond.com',
		siteName: 'Will Diamond - AI Engineer',
		title: "Will Diamond | AI Engineer & Compliance AI Consultant",
		description: "AI Engineer specializing in compliance AI and production LLM systems for regulated industries. Building the future of AI in legal tech.",
		images: [
			{
				url: '/diamond.png',
				width: 1200,
				height: 630,
				alt: 'Will Diamond - AI Engineer',
			},
		],
	},
	twitter: {
		card: 'summary_large_image',
		title: "Will Diamond | AI Engineer & Compliance AI Consultant",
		description: "AI Engineer specializing in compliance AI for regulated industries. Building production LLM systems.",
		creator: '@itsreallywillyd',
		images: ['/diamond.png'],
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			'max-video-preview': -1,
			'max-image-preview': 'large',
			'max-snippet': -1,
		},
	},
	icons: {
		icon: [
			{ url: '/diamond.png' },
			{ url: '/diamond.png', sizes: '32x32', type: 'image/png' },
			{ url: '/diamond.png', sizes: '16x16', type: 'image/png' },
		],
		apple: [
			{ url: '/diamond.png', sizes: '180x180', type: 'image/png' },
		],
	},
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	// JSON-LD structured data for Will Diamond (Person schema)
	const personSchema = {
		"@context": "https://schema.org",
		"@type": "Person",
		"name": "Will Diamond",
		"url": "https://will-diamond.com",
		"image": "https://will-diamond.com/profilePic.jpg",
		"jobTitle": "AI Engineer & Compliance AI Consultant",
		"description": "AI Engineer specializing in compliance AI and production LLM systems for regulated industries",
		"knowsAbout": [
			"Artificial Intelligence",
			"Large Language Models",
			"Compliance AI",
			"Legal Tech",
			"RAG Systems",
			"Production AI Systems",
			"Python",
			"TypeScript",
			"React",
			"Next.js"
		],
		"sameAs": [
			"https://twitter.com/itsreallywillyd",
			"https://www.linkedin.com/in/will-diamond-b1724520b/",
			"https://github.com/spartypkp"
		],
		"alumniOf": {
			"@type": "Organization",
			"name": "Michigan State University"
		},
		"worksFor": {
			"@type": "Organization",
			"name": "Independent AI Engineering Consultancy"
		}
	};

	return (
		<html lang="en">
			<head>
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
				/>
			</head>
			<body className={inter.className}>
				<NavBar />
				{children}
				<Analytics />
			</body>
		</html>
	);
}
