"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
	children: React.ReactNode;
	defaultTheme?: Theme;
	storageKey?: string;
	attribute?: string;
	enableSystem?: boolean;
};

type ThemeProviderState = {
	theme: Theme;
	setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
	theme: "system",
	setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
	children,
	defaultTheme = "system",
	storageKey = "ui-theme",
	attribute = "data-theme",
	enableSystem = true,
	...props
}: ThemeProviderProps) {
	const [theme, setTheme] = useState<Theme>(defaultTheme);

	useEffect(() => {
		const root = window.document.documentElement;
		root.classList.remove("light", "dark");

		if (attribute === "class") {
			root.classList.add(resolveTheme(theme, enableSystem));
		} else {
			root.setAttribute(attribute, resolveTheme(theme, enableSystem));
		}
	}, [theme, enableSystem, attribute]);

	const value = {
		theme,
		setTheme: (theme: Theme) => {
			setTheme(theme);
			localStorage.setItem(storageKey, theme);
		},
	};

	return (
		<ThemeProviderContext.Provider {...props} value={value}>
			{children}
		</ThemeProviderContext.Provider>
	);
}

export const useTheme = () => {
	const context = useContext(ThemeProviderContext);

	if (context === undefined)
		throw new Error("useTheme must be used within a ThemeProvider");

	return context;
};

// Helper to resolve the theme based on the system preference
function resolveTheme(theme: Theme, enableSystem: boolean): string {
	if (theme === "system" && enableSystem) {
		const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
			? "dark"
			: "light";
		return systemTheme;
	}
	return theme;
} 