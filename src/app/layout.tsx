import NavBar from "@/components/custom/navBar";
import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Will Diamond",
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
