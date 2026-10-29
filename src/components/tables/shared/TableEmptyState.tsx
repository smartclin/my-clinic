"use client";

import type { LucideIcon } from "lucide-react";
import type React from "react";

export interface TableEmptyStateProps {
	icon: LucideIcon;
	hasFilters: boolean;
	entityName: string;
	emptyMessage: string;
	filteredMessage?: string;
	actionLabel?: string;
	onAction?: () => void;
}

export function TableEmptyState({
	icon: Icon,
	hasFilters,
	entityName,
	emptyMessage,
	filteredMessage = "Try adjusting your search or filter criteria.",
	actionLabel,
	onAction
}: TableEmptyStateProps): React.ReactNode {
	return (
		<div className='border-border rounded-2xl border border-dashed bg-white p-12 text-center'>
			<Icon className='text-border mx-auto mb-3 size-10' />
			<h3 className='text-base-700 text-sm font-bold'>
				{hasFilters ? `No matching ${entityName}` : `No ${entityName} yet`}
			</h3>
			<p className='text-base-500 mx-auto mt-1 max-w-sm text-xs'>
				{hasFilters ? filteredMessage : emptyMessage}
			</p>
			{!hasFilters && actionLabel && onAction ? (
				<button
					className='bg-primary mt-4 rounded-xl px-4 py-2 text-xs font-bold text-white'
					onClick={onAction}
					type='button'
				>
					{actionLabel}
				</button>
			) : null}
		</div>
	);
}
