// src/components/tables/audit-log-table.tsx
import { useQuery } from "@tanstack/react-query";
import type { AnyRoute } from "@tanstack/react-router";
import {
	columnVisibilityFeature,
	createColumnHelper,
	rowPaginationFeature,
	tableFeatures,
	useTable
} from "@tanstack/react-table";
import { CircleAlertIcon, ShieldAlertIcon } from "lucide-react";

import { IconTile } from "@/components/blocks/icon-tile";
import { SectionState } from "@/components/blocks/state-view";
import { TableColGroup } from "@/components/blocks/table-columns";
import {
	type PageSize,
	TablePagination
} from "@/components/tables/table-pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from "@/components/ui/table";
import type { AuditLogEntry } from "@/db/schema";
import { $listMyAuditLogs } from "@/server/functions";

export type AuditLogRow = AuditLogEntry;

const features = tableFeatures({
	rowPaginationFeature,
	columnVisibilityFeature
});

const column = createColumnHelper<typeof features, AuditLogRow>();

function actionVariant(
	action: string
): "destructive" | "warning" | "success" | "info" | "subtle" {
	const a = action.toLowerCase();
	if (a.includes("delete") || a.includes("destroy") || a.includes("cancel")) {
		return "destructive";
	}
	if (a.includes("update") || a.includes("patch") || a.includes("edit")) {
		return "warning";
	}
	if (a.includes("create") || a.includes("insert") || a.includes("add")) {
		return "success";
	}
	if (a.includes("login") || a.includes("auth")) {
		return "info";
	}
	return "subtle";
}

const columns = column.columns([
	column.accessor("createdAt", {
		header: "Timestamp",
		meta: { width: "w-44 max-sm:w-32" },
		cell: info => {
			const d = new Date(info.getValue());
			return (
				<div className='flex items-center gap-2'>
					<IconTile tone='secondary'>
						<ShieldAlertIcon aria-hidden='true' />
					</IconTile>
					<div className='flex flex-col text-xs'>
						<span className='font-mono font-medium'>
							{d.toLocaleTimeString("en-US", {
								hour: "2-digit",
								minute: "2-digit",
								second: "2-digit"
							})}
						</span>
						<span className='text-muted-foreground text-[11px]'>
							{d.toLocaleDateString("en-US", {
								month: "short",
								day: "numeric",
								year: "numeric"
							})}
						</span>
					</div>
				</div>
			);
		}
	}),
	column.accessor("action", {
		header: "Action",
		meta: { width: "w-32" },
		cell: info => {
			const act = info.getValue();
			return <Badge variant={actionVariant(act)}>{act}</Badge>;
		}
	}),
	column.accessor("entityType", {
		header: "Entity",
		meta: { width: "w-40" },
		cell: ({ row }) => (
			<div className='flex flex-col text-xs'>
				<span className='font-medium capitalize'>
					{row.original.entityType}
				</span>
				<span className='text-muted-foreground truncate font-mono text-[11px]'>
					{row.original.entityId}
				</span>
			</div>
		)
	}),
	column.accessor("ownerId", {
		header: "User ID",
		meta: { width: "w-36", hideOnMobile: true },
		cell: info => (
			<span className='text-muted-foreground block truncate font-mono text-xs'>
				{info.getValue() ?? "System"}
			</span>
		)
	}),
	column.accessor("payload", {
		header: "Payload",
		cell: info => {
			const p = info.getValue();
			if (!p) {
				return <span className='text-muted-foreground text-xs italic'>—</span>;
			}
			return (
				<span
					className='text-muted-foreground block truncate font-mono text-xs'
					title={JSON.stringify(p)}
				>
					{JSON.stringify(p)}
				</span>
			);
		}
	})
]);

const COLUMN_LAYOUT = columns.map(definition => definition.meta ?? {});

export function AuditLogTable<TRoute extends AnyRoute>({
	page = 1,
	size = 20,
	limit = 100,
	route,
	initialData
}: {
	page?: number;
	size?: PageSize;
	limit?: number;
	route?: TRoute;
	initialData?: AuditLogRow[];
}) {
	const query = useQuery({
		queryKey: ["audit-log", limit],
		queryFn: () =>
			$listMyAuditLogs({
				data: { limit }
			}) as unknown as Promise<AuditLogRow[]>,
		initialData
	});

	const all: AuditLogRow[] = (query.data as AuditLogRow[]) ?? [];
	const total = all.length;
	const pageCount = Math.max(1, Math.ceil(total / size));
	const pageRows = all.slice((page - 1) * size, page * size);

	const table = useTable({
		features,
		columns,
		data: pageRows,
		getRowId: entry => entry.id,
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
				description='The audit log records could not load. Check your connection and try again.'
				icon={CircleAlertIcon}
				title='Something Went Wrong'
			/>
		);
	}

	return (
		<div className='flex flex-col gap-2'>
			<Table
				aria-busy={query.isFetching}
				aria-label='Audit Log'
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
									No audit log entries recorded.
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
				ariaLabel='Audit Log Pagination'
				page={page}
				pageCount={pageCount}
				route={route}
				size={size}
			/>
		</div>
	);
}
