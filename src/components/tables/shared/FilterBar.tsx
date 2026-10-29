"use client";

import { Search, X } from "lucide-react";
import type React from "react";

export interface FilterConfig {
	/** Current selected value, e.g. "All" | "Scheduled" | ... */
	value: string;
	/** Called with the raw <option value> string; caller narrows. */
	onChange: (value: string) => void;
	/** Full option list including the "All" sentinel. */
	options: readonly string[];
	/** Label for the sentinel option (e.g. "All Status"). */
	allLabel: string;
	/** Optional per-option label transform (e.g. capitalize gender). */
	formatOption?: (option: string) => string;
}

export interface FilterBarProps {
	searchValue: string;
	onSearchChange: (value: string) => void;
	searchPlaceholder: string;
	filters: FilterConfig[];
	onClear?: () => void;
	hasFilters: boolean;
	/** Hide the search input entirely (e.g. patient-scoped views). */
	hideSearch?: boolean;
}

export function FilterBar({
	searchValue,
	onSearchChange,
	searchPlaceholder,
	filters,
	onClear,
	hasFilters,
	hideSearch = false
}: FilterBarProps): React.ReactNode {
	return (
		<section className='border-border space-y-3 rounded-2xl border bg-white p-4 shadow-2xs'>
			<div className='flex flex-col gap-3 md:flex-row'>
				{hideSearch ? null : (
					<div className='relative flex-1'>
						<Search className='text-base-400 absolute top-1/2 left-3 size-4 -translate-y-1/2' />
						<input
							className='border-border bg-background text-foreground focus:border-ring w-full rounded-xl border py-2 pr-10 pl-9 text-xs focus:outline-hidden'
							onChange={e => {
								onSearchChange(e.target.value);
							}}
							placeholder={searchPlaceholder}
							type='search'
							value={searchValue}
						/>
						{searchValue ? (
							<button
								aria-label='Clear search'
								className='text-base-400 hover:text-base-700 absolute top-1/2 right-3 -translate-y-1/2'
								onClick={() => {
									onSearchChange("");
								}}
								type='button'
							>
								<X className='size-4' />
							</button>
						) : null}
					</div>
				)}

				{filters.map(filter => (
					<select
						className='text-base-700 border-border bg-background focus:border-ring rounded-xl border px-3 py-2 text-xs font-semibold focus:outline-hidden'
						key={filter.allLabel}
						onChange={e => {
							filter.onChange(e.target.value);
						}}
						value={filter.value}
					>
						{filter.options.map(option => (
							<option
								key={option}
								value={option}
							>
								{option === "All"
									? filter.allLabel
									: (filter.formatOption?.(option) ?? option)}
							</option>
						))}
					</select>
				))}

				{hasFilters && onClear ? (
					<button
						className='border-border text-muted-foreground hover:bg-background rounded-xl border bg-white px-3 py-2 text-xs font-semibold transition-colors'
						onClick={onClear}
						type='button'
					>
						Clear
					</button>
				) : null}
			</div>
		</section>
	);
}
