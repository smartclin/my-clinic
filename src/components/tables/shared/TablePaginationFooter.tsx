"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import type React from "react";

export interface TablePaginationFooterProps {
	pageIndex: number;
	pageCount: number;
	pageSize: number;
	total: number;
	onPageChange: (pageIndex: number) => void;
	onPageSizeChange?: (pageSize: number) => void;
	pageSizeOptions?: number[];
}

const DEFAULT_PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

export function TablePaginationFooter({
	pageIndex,
	pageCount,
	pageSize,
	total,
	onPageChange,
	onPageSizeChange,
	pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS
}: TablePaginationFooterProps): React.ReactNode {
	if (total === 0) {
		return null;
	}

	const firstRow = pageIndex * pageSize + 1;
	const lastRow = Math.min((pageIndex + 1) * pageSize, total);

	return (
		<nav className='text-base-500 border-border flex flex-col items-center justify-between gap-3 border-t pt-4 text-xs sm:flex-row'>
			<div className='flex items-center gap-4'>
				<span>
					Showing {firstRow}–{lastRow} of {total}
				</span>
				{onPageSizeChange ? (
					<div className='flex items-center gap-1.5'>
						<span>Rows per page:</span>
						<select
							className='text-base-700 border-border focus:ring-ring rounded-lg border bg-transparent px-2 py-1 text-xs focus:ring-1 focus:outline-none'
							onChange={e => {
								onPageSizeChange(Number(e.target.value));
							}}
							value={pageSize}
						>
							{pageSizeOptions.map(size => (
								<option
									key={size}
									value={size}
								>
									{size}
								</option>
							))}
						</select>
					</div>
				) : null}
			</div>

			<div className='flex items-center gap-2'>
				<button
					className='border-border hover:bg-background rounded-lg border px-3 py-1.5 transition-colors disabled:cursor-not-allowed disabled:opacity-40'
					disabled={pageIndex === 0}
					onClick={() => {
						onPageChange(Math.max(0, pageIndex - 1));
					}}
					type='button'
				>
					<ChevronLeft className='size-3.5' />
				</button>
				<span>
					Page {pageIndex + 1} of {Math.max(1, pageCount)}
				</span>
				<button
					className='border-border hover:bg-background rounded-lg border px-3 py-1.5 transition-colors disabled:cursor-not-allowed disabled:opacity-40'
					disabled={pageIndex >= pageCount - 1}
					onClick={() => {
						onPageChange(Math.min(pageCount - 1, pageIndex + 1));
					}}
					type='button'
				>
					<ChevronRight className='size-3.5' />
				</button>
			</div>
		</nav>
	);
}
