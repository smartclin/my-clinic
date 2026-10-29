import { ThemeProvider as NextThemesProvider } from "next-themes";
import type * as React from "react";

export type ThemeMode = "light" | "dark" | "system";

export function ThemeProvider({
	children,
	...props
}: React.ComponentProps<typeof NextThemesProvider>) {
	return (
		<NextThemesProvider
			attribute='class'
			defaultTheme='system'
			enableSystem
			{...props}
		>
			{children}
		</NextThemesProvider>
	);
}

export { useTheme } from "next-themes";
