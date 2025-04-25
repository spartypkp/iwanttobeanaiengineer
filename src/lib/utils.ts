import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * A utility function to combine class names with Tailwind CSS
 * Uses clsx for conditional class names and twMerge to handle Tailwind conflicts
 */
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
} 