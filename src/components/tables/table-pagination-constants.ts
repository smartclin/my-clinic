// src/components/tables/table-pagination-constants.ts
/**
 * Page sizes shared by every table. Kept in a non-component module so
 * `table-pagination.tsx` stays a pure client module (the
 * `react/only-export-components` rule fires on mixed modules even with
 * a local disable in some configs).
 */
export const PAGE_SIZES = [10, 20, 50, 100] as const;
export type PageSize = (typeof PAGE_SIZES)[number];
export const DEFAULT_PAGE_SIZE: PageSize = 20;

export type PageSizeString = `${PageSize}`;

const PAGE_SIZE_SET: ReadonlySet<number> = new Set(PAGE_SIZES);

export function isPageSize(
	value: string | null | undefined
): value is PageSizeString {
	if (value == null) return false;
	return PAGE_SIZE_SET.has(Number(value));
}
