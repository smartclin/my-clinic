import { useQuery } from "@tanstack/react-query";
import { type AnyRoute, Link } from "@tanstack/react-router";
import {
	columnVisibilityFeature,
	createColumnHelper,
	rowPaginationFeature,
	tableFeatures,
	useTable
} from "@tanstack/react-table";
import { Building2Icon, CircleAlertIcon, SearchXIcon } from "lucide-react";

import { IconTile } from "@/components/blocks/icon-tile";
import { SectionState } from "@/components/blocks/state-view";
import { TableColGroup } from "@/components/blocks/table-columns";
import {
	type PageSize,
	TablePagination
} from "@/components/tables/table-pagination";
import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from "@/components/ui/table";
import type { Clinic } from "@/db/schema";
import { fetchClinics } from "@/server/functions";

const features = tableFeatures({
	rowPaginationFeature,
	columnVisibilityFeature
});

const column = createColumnHelper<typeof features, Clinic>();

const columns = column.columns([
	column.accessor("name", {
		header: "Clinic",
		cell: info => (
			<div className='flex min-w-0 items-center gap-2.5'>
				<IconTile tone='secondary'>
					<Building2Icon aria-hidden='true' />
				</IconTile>
				<Link
					className='truncate font-medium underline-offset-4 hover:underline'
					params={{ clinicId: info.row.original.id } as never}
					to={"/app/clinics/$clinicId" as never}
				>
					{info.getValue()}
				</Link>
			</div>
		)
	}),
	column.accessor("address", {
		header: "Address",
		meta: { width: "w-72", hideOnMobile: true },
		cell: info => (
			<span
				className='text-muted-foreground block truncate'
				title={info.getValue() ?? undefined}
			>
				{info.getValue() ?? "—"}
			</span>
		)
	}),
	column.accessor("phone", {
		header: "Phone",
		meta: { width: "w-40", hideOnMobile: true },
		cell: info => (
			<span className='text-muted-foreground block truncate font-mono text-xs'>
				{info.getValue() ?? "—"}
			</span>
		)
	}),
	column.accessor("email", {
		header: "Email",
		meta: { width: "w-48", hideOnMobile: true },
		cell: info => (
			<span
				className='text-muted-foreground block truncate text-xs'
				title={info.getValue() ?? undefined}
			>
				{info.getValue() ?? "—"}
			</span>
		)
	})
]);

const COLUMN_LAYOUT = columns.map(definition => definition.meta ?? {});

export function ClinicsTable<TRoute extends AnyRoute>({
	page,
	route,
	size,
	initialData
}: {
	page: number;
	route?: TRoute;
	size: PageSize;
	initialData?: Clinic[];
}) {
	const query = useQuery({
		queryKey: ["clinics"],
		queryFn: () => fetchClinics() as unknown as Promise<Clinic[]>,
		initialData
	});

	const all: Clinic[] = (query.data as Clinic[]) ?? [];
	const total = all.length;
	const pageCount = Math.max(1, Math.ceil(total / size));
	const pageRows = all.slice((page - 1) * size, page * size);

	const table = useTable({
		features,
		columns,
		data: pageRows,
		getRowId: clinic => clinic.id,
		manualPagination: true,
		rowCount: total,
		state: { pagination: { pageIndex: page - 1, pageSize: size } }
	});

	if (query.isError) {
		return (
			<SectionState
				action={
					<Button
						disabled={query.isFetching}
						onClick={() => void query.refetch()}
					>
						{query.isFetching ? "Retrying…" : "Try Again"}
					</Button>
				}
				description='The clinics directory could not load. Check your connection and try again.'
				icon={CircleAlertIcon}
				title='Something Went Wrong'
			/>
		);
	}

	if (query.data && page > pageCount) {
		return (
			<SectionState
				action={
					<Link
						className={buttonVariants()}
						search={
							((prev: Record<string, unknown>) => ({
								...prev,
								page: undefined
							})) as never
						}
						to={"/app/clinics" as never}
					>
						Back To First Page
					</Link>
				}
				description={`There are only ${pageCount.toLocaleString("en-US")} pages.`}
				icon={SearchXIcon}
				title='Page Not Found'
			/>
		);
	}

	return (
		<div className='flex flex-col gap-2'>
			<Table
				aria-busy={query.isFetching}
				aria-label='Clinics'
				layout='fixed'
			>
				<TableColGroup columns={COLUMN_LAYOUT} />
				<TableHeader>
					{table.getHeaderGroups().map(group => (
						<TableRow key={group.id}>
							{group.headers.map(header => (
								<TableHead
									hideOnMobile={header.column.columnDef.meta?.hideOnMobile}
									key={header.id}
								>
									<table.FlexRender header={header} />
								</TableHead>
							))}
						</TableRow>
					))}
				</TableHeader>
				<TableBody>
					{table.getRowModel().rows.length === 0 && !query.isFetching ? (
						<TableRow>
							<TableCell colSpan={columns.length}>
								<p className='text-muted-foreground py-8 text-center text-sm'>
									No clinics registered yet.
								</p>
							</TableCell>
						</TableRow>
					) : (
						table.getRowModel().rows.map(row => (
							<TableRow key={row.id}>
								{row.getVisibleCells().map(cell => (
									<TableCell
										hideOnMobile={cell.column.columnDef.meta?.hideOnMobile}
										key={cell.id}
									>
										<table.FlexRender cell={cell} />
									</TableCell>
								))}
							</TableRow>
						))
					)}
					{query.isFetching &&
						Array.from({ length: 3 }).map((_, i) => (
							<TableRow key={`skeleton-${i}`}>
								<TableCell colSpan={columns.length}>
									<Skeleton className='h-8 w-full' />
								</TableCell>
							</TableRow>
						))}
				</TableBody>
			</Table>
			<TablePagination
				ariaLabel='Clinics Pagination'
				page={page}
				pageCount={pageCount}
				route={route}
				size={size}
			/>
		</div>
	);
}
