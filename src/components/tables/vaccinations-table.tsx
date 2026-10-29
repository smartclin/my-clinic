// src/components/tables/vaccinations-table.tsx
import { useQuery } from "@tanstack/react-query";
import { type AnyRoute, Link } from "@tanstack/react-router";
import {
	columnVisibilityFeature,
	createColumnHelper,
	rowPaginationFeature,
	tableFeatures,
	useTable
} from "@tanstack/react-table";
import { CircleAlertIcon, SearchXIcon, SyringeIcon } from "lucide-react";

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
import type { Vaccination } from "@/db/schema";
import { $listVaccinationsByPatient } from "@/server/functions";

export type VaccinationStatus =
	| "due"
	| "scheduled"
	| "completed"
	| "missed"
	| "refused"
	| "contraindicated";

export type VaccinationRow = Vaccination & {
	vaccine?: { id: string; label: string; disease?: string | null } | null;
};

const features = tableFeatures({
	rowPaginationFeature,
	columnVisibilityFeature
});

const column = createColumnHelper<typeof features, VaccinationRow>();

const STATUS_VARIANT: Record<
	VaccinationStatus,
	"success" | "warning" | "info" | "destructive" | "subtle"
> = {
	completed: "success",
	scheduled: "info",
	due: "warning",
	missed: "destructive",
	refused: "destructive",
	contraindicated: "subtle"
};

const STATUS_LABEL: Record<VaccinationStatus, string> = {
	completed: "Completed",
	scheduled: "Scheduled",
	due: "Due",
	missed: "Missed",
	refused: "Refused",
	contraindicated: "Contraindicated"
};

const columns = column.columns([
	column.accessor("vaccineId", {
		header: "Vaccine",
		cell: ({ row }) => {
			const label = row.original.vaccine?.label ?? row.original.vaccineId;
			const disease = row.original.vaccine?.disease;
			return (
				<div className='flex min-w-0 items-center gap-2.5'>
					<IconTile tone='secondary'>
						<SyringeIcon aria-hidden='true' />
					</IconTile>
					<div className='flex min-w-0 flex-col'>
						<span className='truncate font-medium'>{label}</span>
						{disease ? (
							<span className='text-muted-foreground truncate text-xs'>
								{disease}
							</span>
						) : null}
					</div>
				</div>
			);
		}
	}),
	column.accessor("status", {
		header: "Status",
		meta: { width: "w-32" },
		cell: info => {
			const status = (info.getValue() as VaccinationStatus) ?? "due";
			return (
				<Badge variant={STATUS_VARIANT[status] ?? "subtle"}>
					{STATUS_LABEL[status] ?? status}
				</Badge>
			);
		}
	}),
	column.accessor("administeredDate", {
		header: "Administered",
		meta: { width: "w-36 max-sm:w-28" },
		cell: info => {
			const val = info.getValue();
			return (
				<span className='text-muted-foreground block text-xs tabular-nums'>
					{val ?? "—"}
				</span>
			);
		}
	}),
	column.accessor("batchNumber", {
		header: "Batch #",
		meta: { width: "w-32", hideOnMobile: true },
		cell: info => (
			<span className='text-muted-foreground block truncate font-mono text-xs'>
				{info.getValue() ?? "—"}
			</span>
		)
	}),
	column.accessor("administeredBy", {
		header: "Administered By",
		meta: { width: "w-36", hideOnMobile: true },
		cell: info => (
			<span className='text-muted-foreground block truncate text-xs'>
				{info.getValue() ?? "—"}
			</span>
		)
	})
]);

const COLUMN_LAYOUT = columns.map(definition => definition.meta ?? {});

export function VaccinationsTable<TRoute extends AnyRoute>({
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
	initialData?: VaccinationRow[];
}) {
	const query = useQuery({
		queryKey: ["vaccinations", patientId],
		queryFn: () =>
			$listVaccinationsByPatient({
				data: { patientId }
			}) as unknown as Promise<VaccinationRow[]>,
		initialData
	});

	const all: VaccinationRow[] = (query.data as VaccinationRow[]) ?? [];
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
				description="The patient's immunization history could not load. Check your connection and try again."
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
				aria-label='Vaccinations'
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
									No vaccination records found for this patient.
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
				ariaLabel='Vaccinations Pagination'
				page={page}
				pageCount={pageCount}
				route={route}
				size={size}
			/>
		</div>
	);
}
