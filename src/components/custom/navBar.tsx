"use client";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	navigationMenuTriggerStyle
} from "@/components/ui/navigationMenu";
import { cn } from "@/lib/utils/cn";
import Link from "next/link";
import React from "react";

const NavBar = () => {
	return (
		<div className="sticky top-0 z-50 w-full px-4 py-2 text-base bg-background border-b border-solid shadow-sm">
			<NavigationMenu className="w-full min-w-full">
				<NavigationMenuList>
					<NavigationMenuItem>
						<Link href="/projects" legacyBehavior passHref>
							<NavigationMenuLink className={navigationMenuTriggerStyle()}>
								All Projects
							</NavigationMenuLink>
						</Link>
					</NavigationMenuItem>
					<NavigationMenuItem>
						<Link href="/" legacyBehavior passHref>
							<NavigationMenuLink className={navigationMenuTriggerStyle()}>
								Home
							</NavigationMenuLink>
						</Link>
					</NavigationMenuItem>
					<NavigationMenuItem>
						<Link href="/consulting" legacyBehavior passHref>
							<NavigationMenuLink className={navigationMenuTriggerStyle()}>
								Consulting
							</NavigationMenuLink>
						</Link>
					</NavigationMenuItem>
					{/* <NavigationMenuItem>
						<Link href="/dave" legacyBehavior passHref>
							<NavigationMenuLink className={navigationMenuTriggerStyle()}>
								My AI Assistant
							</NavigationMenuLink>
						</Link>
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
