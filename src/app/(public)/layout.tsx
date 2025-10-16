import NavBar from "@/components/custom/navBar";
import { Analytics } from "@vercel/analytics/react";
import { Inter } from "next/font/google";
import "../globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
	title: "Will Diamond",
	description: "AI Engineer and Builder",
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
	return (
		<html lang="en">
			<body className={inter.className}>
				<NavBar />
				{children}
				<Analytics />
			</body>
		</html>
	);
}
