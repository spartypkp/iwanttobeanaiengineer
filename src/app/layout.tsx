import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import NavBar from "@/components/custom/navBar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "I Want To Be an AI Engineer",
	description:
		"Documenting a young software engineers journey to getting his dream job. You should hire Will!",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		// <ClerkProvider>

		<html lang="en">
			<body className={inter.className}>
				<NavBar></NavBar>
				{children}
				{/* <PageFooter /> */}
			</body>
			<Analytics />
		</html>
		// </ClerkProvider>
	);
}
