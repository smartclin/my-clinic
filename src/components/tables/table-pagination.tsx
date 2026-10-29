// src/components/tables/table-pagination.tsx
import { type AnyRoute, Link } from "@tanstack/react-router";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import type { ReactNode } from "react";

import {
	isPageSize,
	PAGE_SIZES,
	type PageSize
} from "@/components/tables/table-pagination-constants";
import { Button, buttonVariants } from "@/components/ui/button";
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem
} from "@/components/ui/pagination";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "@/components/ui/select";
import { useIsMobile } from "@/hooks/use-mobile";
import { pageRange } from "@/lib/shadcn/page-range";

export type { PageSize } from "@/components/tables/table-pagination-constants";

const SIZE_ITEMS = PAGE_SIZES.map(size => ({
	value: String(size),
	label: String(size)
}));

/**
 * Pagination control for a paginated route.
 *
 * Pass the route object (`Route` from the route file) — not a string path.
 * The route's `validateSearch` must include `page` and `size`; the shared
 * `paginationSearchSchema` is the one to spread into each paginated route.
 */
export function TablePagination<TRoute extends AnyRoute>({
	route,
	page,
	pageCount,
	size,
	ariaLabel
}: {
	route?: TRoute;
	page: number;
	pageCount: number;
	size: PageSize;
	ariaLabel: string;
}) {
	if (!route) return null;
	return (
		<TablePaginationWithRoute
			ariaLabel={ariaLabel}
			page={page}
			pageCount={pageCount}
			route={route}
			size={size}
		/>
	);
}

function TablePaginationWithRoute<TRoute extends AnyRoute>({
	route,
	page,
	pageCount,
	size,
	ariaLabel
}: {
	route: TRoute;
	page: number;
	pageCount: number;
	size: PageSize;
	ariaLabel: string;
}) {
	const isMobile = useIsMobile();
	const navigate = route.useNavigate();
	const search = route.useSearch();

	// Drop `page` so a page-size change starts at the first page.
	const onSizeChange = (value: string | null) => {
		if (!value || !isPageSize(value)) return;
		const { page: _page, ...rest } = search;
		void navigate({
			search: { ...rest, size: value },
			resetScroll: false
		});
	};

	// `page: 1` is the implicit default — omit it from the URL.
	const searchForPage = (next: number) =>
		next > 1 ? { ...search, page: next } : { ...search, page: undefined };

	return (
		<div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
			<div className='flex shrink-0 items-center gap-2 max-sm:self-center'>
				<span
					className='text-muted-foreground text-xs'
					id='rows-per-page'
				>
					Rows Per Page
				</span>
				<Select
					items={SIZE_ITEMS}
					onValueChange={onSizeChange}
					value={String(size)}
				>
					<SelectTrigger
						aria-labelledby='rows-per-page'
						size='sm'
					>
						<SelectValue />
					</SelectTrigger>
					<SelectContent
						align='start'
						alignItemWithTrigger={false}
						side='bottom'
					>
						{SIZE_ITEMS.map(item => (
							<SelectItem
								key={item.value}
								value={item.value}
							>
								{item.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<div className='flex min-w-0 flex-1'>
				<Pagination aria-label={ariaLabel}>
					<PaginationContent>
						<PaginationItem>
							<StepLink
								disabled={page <= 1}
								label='Previous Page'
								page={page - 1}
								route={route}
								searchForPage={searchForPage}
							>
								<ChevronLeftIcon aria-hidden='true' />
							</StepLink>
						</PaginationItem>

						{pageRange(page, pageCount, isMobile ? 0 : 1).map((item, index) =>
							item === "gap" ? (
								<PaginationItem
									// eslint-disable-next-line react/no-array-index-key -- position-only marker
									key={`gap-${index}`}
								>
									<PaginationEllipsis />
								</PaginationItem>
							) : (
								<PaginationItem key={item}>
									<PageLink
										isActive={item === page}
										label={`Page ${item}`}
										page={item}
										route={route}
										searchForPage={searchForPage}
									>
										{item}
									</PageLink>
								</PaginationItem>
							)
						)}

						<PaginationItem>
							<StepLink
								disabled={page >= pageCount}
								label='Next Page'
								page={page + 1}
								route={route}
								searchForPage={searchForPage}
							>
								<ChevronRightIcon aria-hidden='true' />
							</StepLink>
						</PaginationItem>
					</PaginationContent>
				</Pagination>
			</div>
		</div>
	);
}

// ---------------------------------------------------------------------------
// Internal: link builders
// ---------------------------------------------------------------------------

function PageLink<TRoute extends AnyRoute>({
	route,
	page,
	isActive = false,
	label,
	searchForPage,
	children
}: {
	route: TRoute;
	page: number;
	isActive?: boolean;
	label: string;
	searchForPage: (next: number) => Record<string, unknown>;
	children: ReactNode;
}) {
	return (
		<Link
			aria-current={isActive ? "page" : undefined}
			aria-label={label}
			className={buttonVariants({
				variant: isActive ? "secondary" : "ghost",
				size: "icon-sm"
			})}
			resetScroll={false}
			search={searchForPage(page) as never /* see note below */}
			to={route.fullPath}
		>
			{children}
		</Link>
	);
}

function StepLink<TRoute extends AnyRoute>({
	route,
	page,
	disabled,
	label,
	searchForPage,
	children
}: {
	route: TRoute;
	page: number;
	disabled: boolean;
	label: string;
	searchForPage: (next: number) => Record<string, unknown>;
	children: ReactNode;
}) {
	if (disabled) {
		return (
			<Button
				aria-label={label}
				disabled
				size='icon-sm'
				variant='ghost'
			>
				{children}
			</Button>
		);
	}
	return (
		<PageLink
			label={label}
			page={page}
			route={route}
			searchForPage={searchForPage}
		>
			{children}
		</PageLink>
	);
}
