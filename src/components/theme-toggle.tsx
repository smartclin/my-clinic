import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

export const ThemeToggle = () => {
	const { theme, setTheme } = useTheme();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				render={
					<Button
						size='icon'
						variant='outline'
					/>
				}
			>
				<Sun className='size-5 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90' />
				<Moon className='absolute size-5 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0' />
				<span className='sr-only'>Toggle theme</span>
			</DropdownMenuTrigger>
			<DropdownMenuContent align='end'>
				<DropdownMenuCheckboxItem
					checked={theme === "light"}
					onCheckedChange={v => {
						if (v) setTheme("light");
					}}
				>
					Light
				</DropdownMenuCheckboxItem>
				<DropdownMenuCheckboxItem
					checked={theme === "dark"}
					onCheckedChange={v => {
						if (v) setTheme("dark");
					}}
				>
					Dark
				</DropdownMenuCheckboxItem>
				<DropdownMenuCheckboxItem
					checked={theme === "system"}
					onCheckedChange={v => {
						if (v) setTheme("system");
					}}
				>
					System
				</DropdownMenuCheckboxItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
