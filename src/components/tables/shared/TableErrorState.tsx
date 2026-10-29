"use client";

import { AlertCircle } from "lucide-react";
import type React from "react";

export interface TableErrorStateProps {
	entityName: string;
	message?: string;
	onRetry: () => void;
}

export function TableErrorState({
	entityName,
	message,
	onRetry
}: TableErrorStateProps): React.ReactNode {
	return (
		<div className='border-destructive/20 bg-destructive/5 rounded-2xl border p-12 text-center'>
			<AlertCircle className='text-destructive mx-auto mb-3 size-10' />
			<div className='text-destructive text-sm font-bold'>
				Error loading {entityName}
			</div>
			<p className='text-destructive/80 mt-1 text-xs'>
				{message ?? "Unknown error"}
			</p>
			<button
				className='bg-primary text-primary-foreground mt-4 rounded-xl px-4 py-2 text-xs font-bold'
				onClick={onRetry}
				type='button'
			>
				Retry
			</button>
		</div>
	);
}
