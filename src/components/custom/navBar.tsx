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
		<header
            className="w-full px-4 py-2 text-base bg-background border-b border-solid"
        >
			<NavigationMenu className="w-full min-w-full">
				<NavigationMenuList className="w-full min-w-full flex flex-col md:flex-row justify-between items-center">
					<NavigationMenuItem>
						<Link href="/">
							<div className="flex justify-left items-center font-header font-bold text-olivebrown text-2xl">
								Will
							</div>
						</Link>
					</NavigationMenuItem>
					<NavigationMenuItem>
						<Link href="/projects" legacyBehavior passHref>
							<NavigationMenuLink
								className={navigationMenuTriggerStyle()}
							>
								Resume
							</NavigationMenuLink>
						</Link>
					</NavigationMenuItem>
					<NavigationMenuItem>
						<Link href="projects" legacyBehavior passHref>
							<NavigationMenuLink
								className={navigationMenuTriggerStyle()}
							>
								Projects
							</NavigationMenuLink>
						</Link>
					</NavigationMenuItem>
					<NavigationMenuItem>
						<Link href="/sources" legacyBehavior passHref>
							<NavigationMenuLink
								className={navigationMenuTriggerStyle()}
							>
								Dave Demands You Hire Me
							</NavigationMenuLink>
						</Link>
					</NavigationMenuItem>
					
					<NavigationMenuItem>
						<NavigationMenuTrigger>
							Random Blogs
						</NavigationMenuTrigger>
						<NavigationMenuContent>
							<ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
								<li className="row-span-3">
									<NavigationMenuLink asChild>
										<a
											className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
											href="/mission#dream"
										>
											<div className="mb-2 mt-4 text-lg font-medium">
												TODO
											</div>
											<div className="mb-2 mt-4 text-sm font-medium">
												Like Most of my Documentation!
											</div>
										</a>
									</NavigationMenuLink>
								</li>
								<ListItem href="/random#1" title="Blog">
									Really Cool Blogpost 1
								</ListItem>
								<ListItem href="/random#2" title="Blogg">
									Really Cool Blogpost 2
								</ListItem>
								<ListItem href="/random#3" title="Bloggg">
									Really Cool Blogpost 3
								</ListItem>
							</ul>
						</NavigationMenuContent>
					</NavigationMenuItem>
					{/* <NavigationMenuItem>
						<NavigationMenuTrigger>
							Organization
						</NavigationMenuTrigger>
						<NavigationMenuContent>
							<ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
								{components.map((component) => (
									<ListItem
										key={component.title}
										title={component.title}
										href={component.href}
									>
										{component.description}
									</ListItem>
								))}
							</ul>
						</NavigationMenuContent>
					</NavigationMenuItem> */}

				</NavigationMenuList>
			</NavigationMenu>
		</header>
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
