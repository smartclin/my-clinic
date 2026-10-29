"use client";

import type { LucideIcon } from "lucide-react";
import type React from "react";

export interface TablePageHeaderProps {
	title: string;
	subtitle: string;
	total: number;
	actionIcon: LucideIcon;
	actionLabel: string;
	onAction: () => void;
}

export function TablePageHeader({
	title,
	subtitle,
	total,
	actionIcon: ActionIcon,
	actionLabel,
	onAction
}: TablePageHeaderProps): React.ReactNode {
	return (
		<header className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
			<div>
				<div className='flex items-center gap-2'>
					<h1 className='text-foreground text-2xl font-bold'>{title}</h1>
					<span className='text-base-700 bg-muted rounded-full px-2.5 py-0.5 text-xs font-bold'>
						{total} total
					</span>
				</div>
				<p className='text-base-500 mt-0.5 text-xs'>{subtitle}</p>
			</div>

			<button
				className='hover:bg-base-500 bg-primary flex items-center gap-2 self-start rounded-xl px-4 py-2.5 text-xs font-bold text-white shadow-xs transition-colors sm:self-auto'
				onClick={onAction}
				type='button'
			>
				<ActionIcon className='size-4' />
				{actionLabel}
			</button>
		</header>
	);
}
