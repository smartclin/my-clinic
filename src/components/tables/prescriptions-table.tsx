// src/components/tables/prescriptions-table.tsx
import { useQuery } from "@tanstack/react-query";
import { type AnyRoute, Link } from "@tanstack/react-router";
import {
	columnVisibilityFeature,
	createColumnHelper,
	rowPaginationFeature,
	tableFeatures,
	useTable
} from "@tanstack/react-table";
import { CircleAlertIcon, PillIcon, SearchXIcon } from "lucide-react";

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
import type { Prescription } from "@/db/schema";
import { $listPrescriptionsByPatient } from "@/server/functions";

export type PrescriptionStatus = "active" | "completed" | "cancelled";

export type PrescriptionRow = Prescription & {
	doctor?: { id: string; name: string } | null;
};

const features = tableFeatures({
	rowPaginationFeature,
	columnVisibilityFeature
});

const column = createColumnHelper<typeof features, PrescriptionRow>();

const STATUS_VARIANT: Record<
	PrescriptionStatus,
	"success" | "info" | "destructive"
> = {
	active: "success",
	completed: "info",
	cancelled: "destructive"
};

const STATUS_LABEL: Record<PrescriptionStatus, string> = {
	active: "Active",
	completed: "Completed",
	cancelled: "Cancelled"
};

const columns = column.columns([
	column.accessor("prescriptionDate", {
		header: "Date",
		meta: { width: "w-32 max-sm:w-28" },
		cell: info => (
			<div className='flex items-center gap-2'>
				<IconTile tone='secondary'>
					<PillIcon aria-hidden='true' />
				</IconTile>
				<span className='font-mono text-xs tabular-nums'>
					{info.getValue()}
				</span>
			</div>
		)
	}),
	column.accessor("medications", {
		header: "Medications",
		cell: info => {
			const meds = info.getValue() ?? [];
			if (meds.length === 0) {
				return <span className='text-muted-foreground italic'>None</span>;
			}
			return (
				<div className='flex flex-col gap-1 py-1'>
					{meds.map((m, idx) => (
						<div
							className='flex items-center gap-2 text-xs'
							key={m.drugId || idx}
						>
							<span className='font-medium'>{m.name}</span>
							<span className='text-muted-foreground'>
								{m.dose} • {m.frequency} ({m.duration})
							</span>
						</div>
					))}
				</div>
			);
		}
	}),
	column.accessor("status", {
		header: "Status",
		meta: { width: "w-28" },
		cell: info => {
			const status = (info.getValue() as PrescriptionStatus) ?? "active";
			return (
				<Badge variant={STATUS_VARIANT[status] ?? "subtle"}>
					{STATUS_LABEL[status] ?? status}
				</Badge>
			);
		}
	}),
	column.accessor("instructions", {
		header: "Instructions",
		meta: { width: "w-48", hideOnMobile: true },
		cell: info => (
			<span
				className='text-muted-foreground block truncate text-xs'
				title={info.getValue() ?? undefined}
			>
				{info.getValue() ?? "—"}
			</span>
		)
	}),
	column.accessor("notes", {
		header: "Notes",
		meta: { width: "w-36", hideOnMobile: true },
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

export function PrescriptionsTable<TRoute extends AnyRoute>({
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
	initialData?: PrescriptionRow[];
}) {
	const query = useQuery({
		queryKey: ["prescriptions", patientId],
		queryFn: () =>
			$listPrescriptionsByPatient({
				data: { patientId }
			}) as unknown as Promise<PrescriptionRow[]>,
		initialData
	});

	const all: PrescriptionRow[] = (query.data as PrescriptionRow[]) ?? [];
	const total = all.length;
	const pageCount = Math.max(1, Math.ceil(total / size));
	const pageRows = all.slice((page - 1) * size, page * size);

	const table = useTable({
		features,
		columns,
		data: pageRows,
		getRowId: p => p.id,
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
				description='The prescriptions history could not load. Check your connection and try again.'
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
				aria-label='Prescriptions'
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
									No prescriptions issued for this patient yet.
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
				ariaLabel='Prescriptions Pagination'
				page={page}
				pageCount={pageCount}
				route={route}
				size={size}
			/>
		</div>
	);
}
