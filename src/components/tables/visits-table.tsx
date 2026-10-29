// src/components/tables/visits-table.tsx
import { useQuery } from "@tanstack/react-query";
import { type AnyRoute, Link } from "@tanstack/react-router";
import {
	columnVisibilityFeature,
	createColumnHelper,
	rowPaginationFeature,
	tableFeatures,
	useTable
} from "@tanstack/react-table";
import { CircleAlertIcon, ClipboardListIcon, SearchXIcon } from "lucide-react";

import { IconTile } from "@/components/blocks/icon-tile";
import { SectionState } from "@/components/blocks/state-view";
import { TableColGroup } from "@/components/blocks/table-columns";
import {
	type PageSize,
	TablePagination
} from "@/components/tables/table-pagination";
import { Badge } from "@/components/ui/badge";
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
import type { Visit } from "@/db/schema";
import { $listVisitsByPatient } from "@/server/functions";

export type VisitRow = Visit & {
	patient?: { id: string; name: string } | null;
	clinic?: { id: string; name: string } | null;
	doctor?: { id: string; name: string } | null;
};

const features = tableFeatures({
	rowPaginationFeature,
	columnVisibilityFeature
});

const column = createColumnHelper<typeof features, VisitRow>();

const columns = column.columns([
	column.accessor("visitedAt", {
		header: "Visit Date & Time",
		meta: { width: "w-48 max-sm:w-36" },
		cell: info => {
			const date = new Date(info.getValue());
			return (
				<div className='flex items-center gap-2'>
					<IconTile tone='secondary'>
						<ClipboardListIcon aria-hidden='true' />
					</IconTile>
					<div className='flex flex-col'>
						<span className='font-mono text-xs font-medium tabular-nums'>
							{date.toLocaleDateString("en-US", {
								year: "numeric",
								month: "short",
								day: "numeric"
							})}
						</span>
						<span className='text-muted-foreground font-mono text-[11px] tabular-nums'>
							{date.toLocaleTimeString("en-US", {
								hour: "2-digit",
								minute: "2-digit"
							})}
						</span>
					</div>
				</div>
			);
		}
	}),
	column.accessor("ageMonths", {
		header: "Age at Visit",
		meta: { width: "w-32" },
		cell: ({ row }) => {
			const { ageYears, ageMonthsRemainder, ageMonths } = row.original;
			let text = `${ageMonths.toFixed(1)} mo`;
			if (ageYears != null && ageYears > 0) {
				text = `${ageYears}y ${ageMonthsRemainder ?? 0}m`;
			}
			return <Badge variant='subtle'>{text}</Badge>;
		}
	}),
	column.accessor("clinicId", {
		header: "Clinic",
		meta: { width: "w-40", hideOnMobile: true },
		cell: ({ row }) => (
			<span className='block truncate text-xs font-medium'>
				{row.original.clinic?.name ?? "Main Clinic"}
			</span>
		)
	}),
	column.accessor("doctorId", {
		header: "Attending Doctor",
		meta: { width: "w-40", hideOnMobile: true },
		cell: ({ row }) => (
			<span className='text-muted-foreground block truncate text-xs'>
				{row.original.doctor?.name ?? "Attending Doctor"}
			</span>
		)
	}),
	column.accessor("appointmentId", {
		header: "Type",
		meta: { width: "w-28", hideOnMobile: true },
		cell: ({ row }) =>
			row.original.appointmentId ? (
				<Badge variant='info'>Appointment</Badge>
			) : (
				<Badge variant='subtle'>Walk-in</Badge>
			)
	})
]);

const COLUMN_LAYOUT = columns.map(definition => definition.meta ?? {});

export function VisitsTable<TRoute extends AnyRoute>({
	patientId,
	page = 1,
	size = 20,
	route,
	initialData
}: {
	patientId: string;
	page?: number;
	size?: PageSize;
	route?: TRoute;
	initialData?: VisitRow[];
}) {
	const query = useQuery({
		queryKey: ["visits", patientId],
		queryFn: () =>
			$listVisitsByPatient({
				data: { patientId }
			}) as unknown as Promise<VisitRow[]>,
		initialData
	});

	const all: VisitRow[] = (query.data as VisitRow[]) ?? [];
	const total = all.length;
	const pageCount = Math.max(1, Math.ceil(total / size));
	const pageRows = all.slice((page - 1) * size, page * size);

	const table = useTable({
		features,
		columns,
		data: pageRows,
		getRowId: v => v.id,
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
				description='The visit history could not load. Check your connection and try again.'
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
						params={{ patientId } as never}
						search={
							((prev: Record<string, unknown>) => ({
								...prev,
								page: undefined
							})) as never
						}
						to={"/app/patients/$patientId" as never}
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
				aria-label='Visits'
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
									No visits recorded for this patient yet.
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
				ariaLabel='Visits Pagination'
				page={page}
				pageCount={pageCount}
				route={route}
				size={size}
			/>
		</div>
	);
}
