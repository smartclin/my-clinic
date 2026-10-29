import type * as React from "react";

import { cn } from "@/lib/utils";

interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
	orientation?: "horizontal" | "vertical";
	decorative?: boolean;
}

export function Separator({
	className,
	orientation = "horizontal",
	decorative = true,
	...props
}: SeparatorProps) {
	if (decorative) {
		return (
			<div
				aria-hidden='true'
				className={cn(
					"bg-border shrink-0",
					orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
					className
				)}
				data-slot='separator'
				{...props}
			/>
		);
	}

	return (
		<div
			aria-orientation={orientation}
			className={cn(
				"bg-border shrink-0",
				orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
				className
			)}
			data-slot='separator'
			role='separator'
			{...props}
		/>
	);
}
