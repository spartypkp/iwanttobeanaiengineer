"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link"; // Import the Link component from the appropriate library
import Image from "next/image"; // Import the Image component from the appropriate library
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuIndicator,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
	NavigationMenuViewport,
	navigationMenuTriggerStyle,
} from "@/components/ui/navigationMenu";
import { cn } from "@/lib/utils/cn";



const NavBar = () => {
	return (
		<div
			className="w-full px-4 py-2 text-base bg-background border-b border-solid"
		>
			<NavigationMenu className="w-full min-w-full">

				<NavigationMenuList>
					<NavigationMenuItem>
						<Link href="/" legacyBehavior passHref>
							<NavigationMenuLink
								className={navigationMenuTriggerStyle()}
							>
								Home
							</NavigationMenuLink>
						</Link>
					</NavigationMenuItem>
					<NavigationMenuItem>
						<Link href="/dailyBlogs" legacyBehavior passHref>
							<NavigationMenuLink
								className={navigationMenuTriggerStyle()}
							>
								Daily Blogs
							</NavigationMenuLink>
						</Link>
					</NavigationMenuItem>
					<NavigationMenuItem>
						<Link href="/technicalBlogs" legacyBehavior passHref>
							<NavigationMenuLink
								className={navigationMenuTriggerStyle()}
							>
								Technical Blogs
							</NavigationMenuLink>
						</Link>
					</NavigationMenuItem>
					<Link href="/dave" legacyBehavior passHref>
						<NavigationMenuLink
							className={navigationMenuTriggerStyle()}
						>
							Argue With Dave
						</NavigationMenuLink>
					</Link>
					<NavigationMenuItem>
						<Link href="/stats" legacyBehavior passHref>
							<NavigationMenuLink
								className={navigationMenuTriggerStyle()}
							>
								My Statistics
							</NavigationMenuLink>
						</Link>
					</NavigationMenuItem>
					<NavigationMenuItem>
						<Link href="/about" legacyBehavior passHref>
							<NavigationMenuLink
								className={navigationMenuTriggerStyle()}
							>
								About Me
							</NavigationMenuLink>
						</Link>
					</NavigationMenuItem>

					{/* <NavigationMenuItem>
						<NavigationMenuTrigger>
							About Me
						</NavigationMenuTrigger>
						<NavigationMenuContent>
							<ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
								<li className="row-span-3">
									<NavigationMenuLink asChild>
										<a
											className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
											href="/"
										>

											<div className="mb-2 mt-4 text-lg font-medium">
												About Me
											</div>
											<p className="text-sm leading-tight text-muted-foreground">
												And some shameless self plugging.
											</p>
										</a>
									</NavigationMenuLink>
								</li>
								<ListItem href="/about#general" title="More About Me">
									Bartending, Football, Pydantic, LLMs... that&apos;s about it.
								</ListItem>
								<ListItem href="/about#interactiveResume" title="Interactive Resume">
									Take a guided tour of my resume
								</ListItem>
								<ListItem href="/about#hireMe" title="I Want To Hire You">
									In case of emergency
								</ListItem>
							</ul>
						</NavigationMenuContent>
					</NavigationMenuItem> */}
				</NavigationMenuList>
			</NavigationMenu>
		</div>
	);
};

export default NavBar;

const ListItem = React.forwardRef<
	React.ElementRef<"a">,
	React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
	return (
		<li>
			<NavigationMenuLink asChild>
				<a
					ref={ref}
					className={cn(
						"block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
						className,
					)}
					{...props}
				>
					<div className="text-sm font-medium leading-none">
						{title}
					</div>
					<p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
						{children}
					</p>
				</a>
			</NavigationMenuLink>
		</li>
	);
});
ListItem.displayName = "ListItem";
