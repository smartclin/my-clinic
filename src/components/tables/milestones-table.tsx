// src/components/tables/milestones-table.tsx
import { useQuery } from "@tanstack/react-query";
import { type AnyRoute, Link } from "@tanstack/react-router";
import {
	columnVisibilityFeature,
	createColumnHelper,
	rowPaginationFeature,
	tableFeatures,
	useTable
} from "@tanstack/react-table";
import { AwardIcon, CircleAlertIcon, SearchXIcon } from "lucide-react";

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
import type { Milestone } from "@/db/schema";
import { $listMilestonesByPatient } from "@/server/functions";

export type MilestoneRow = Milestone & {
	milestone?: {
		id: string;
		label: string;
		domain: string;
		expectedAgeMonths: number;
		redFlagWarning?: string | null;
	} | null;
};

const features = tableFeatures({
	rowPaginationFeature,
	columnVisibilityFeature
});

const column = createColumnHelper<typeof features, MilestoneRow>();

const columns = column.columns([
	column.accessor("milestoneId", {
		header: "Milestone",
		cell: ({ row }) => {
			const label = row.original.milestone?.label ?? row.original.milestoneId;
			const domain = row.original.milestone?.domain;
			return (
				<div className='flex min-w-0 items-center gap-2.5'>
					<IconTile tone='secondary'>
						<AwardIcon aria-hidden='true' />
					</IconTile>
					<div className='flex min-w-0 flex-col'>
						<span className='truncate font-medium'>{label}</span>
						{domain ? (
							<span className='text-muted-foreground truncate text-xs capitalize'>
								{domain.replace("-", " ")}
							</span>
						) : null}
					</div>
				</div>
			);
		}
	}),
	column.accessor(m => m.milestone?.expectedAgeMonths ?? null, {
		id: "expectedAge",
		header: () => <span className='block text-right'>Expected</span>,
		meta: { width: "w-28", hideOnMobile: true },
		cell: info => {
			const val = info.getValue();
			return (
				<span className='text-muted-foreground block text-right text-xs tabular-nums'>
					{val !== null ? `${val}m` : "—"}
				</span>
			);
		}
	}),
	column.accessor("isAchieved", {
		header: "Status",
		meta: { width: "w-28" },
		cell: info => {
			const achieved = info.getValue();
			return (
				<Badge variant={achieved ? "success" : "warning"}>
					{achieved ? "Achieved" : "Pending"}
				</Badge>
			);
		}
	}),
	column.accessor("achievedDate", {
		header: "Achieved Date",
		meta: { width: "w-36 max-sm:w-28" },
		cell: info => (
			<span className='text-muted-foreground block text-xs tabular-nums'>
				{info.getValue() ?? "—"}
			</span>
		)
	}),
	column.accessor("notes", {
		header: "Notes",
		meta: { width: "w-40", hideOnMobile: true },
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

export function MilestonesTable<TRoute extends AnyRoute>({
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
	initialData?: MilestoneRow[];
}) {
	const query = useQuery({
		queryKey: ["milestones", patientId],
		queryFn: () =>
			$listMilestonesByPatient({
				data: { patientId }
			}) as unknown as Promise<MilestoneRow[]>,
		initialData
	});

	const all: MilestoneRow[] = (query.data as MilestoneRow[]) ?? [];
	const total = all.length;
	const pageCount = Math.max(1, Math.ceil(total / size));
	const pageRows = all.slice((page - 1) * size, page * size);

	const table = useTable({
		features,
		columns,
		data: pageRows,
		getRowId: m => m.id,
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
				description="The patient's developmental milestones could not load. Check your connection and try again."
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
				aria-label='Developmental Milestones'
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
									No milestone records found for this patient.
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
				ariaLabel='Milestones Pagination'
				page={page}
				pageCount={pageCount}
				route={route}
				size={size}
			/>
		</div>
	);
}
