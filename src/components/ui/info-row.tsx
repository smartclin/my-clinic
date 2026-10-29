import type * as React from "react";

import { cn } from "@/lib/utils";

interface InfoRowProps {
	label: string;
	value?: React.ReactNode;
	className?: string;
}

export function InfoRow({ label, value, className }: InfoRowProps) {
	return (
		<div className={cn("flex flex-col gap-0.5", className)}>
			<span className='text-muted-foreground text-xs font-medium'>{label}</span>
			<span className='text-sm font-medium'>{value || "—"}</span>
		</div>
	);
}
