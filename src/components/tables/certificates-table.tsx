// src/components/tables/certificates-table.tsx
import { useQuery } from "@tanstack/react-query";
import { type AnyRoute, Link } from "@tanstack/react-router";
import {
	columnVisibilityFeature,
	createColumnHelper,
	rowPaginationFeature,
	tableFeatures,
	useTable
} from "@tanstack/react-table";
import { CircleAlertIcon, FileBadgeIcon, SearchXIcon } from "lucide-react";

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
import type { Certificate } from "@/db/schema";
import { $listCertificatesByPatient } from "@/server/functions";

export type CertificateRow = Certificate;

const features = tableFeatures({
	rowPaginationFeature,
	columnVisibilityFeature
});

const column = createColumnHelper<typeof features, CertificateRow>();

const TYPE_VARIANT: Record<string, "info" | "success" | "warning" | "subtle"> =
	{
		medical: "info",
		school: "success",
		travel: "warning",
		fitness: "success",
		absence: "subtle"
	};

const columns = column.columns([
	column.accessor("issueDate", {
		header: "Date",
		meta: { width: "w-32 max-sm:w-28" },
		cell: info => (
			<div className='flex items-center gap-2'>
				<IconTile tone='secondary'>
					<FileBadgeIcon aria-hidden='true' />
				</IconTile>
				<span className='font-mono text-xs tabular-nums'>
					{info.getValue()}
				</span>
			</div>
		)
	}),
	column.accessor("certificateType", {
		header: "Type",
		meta: { width: "w-28" },
		cell: info => {
			const type = info.getValue()?.toLowerCase() ?? "medical";
			return (
				<Badge variant={TYPE_VARIANT[type] ?? "subtle"}>
					{info.getValue()}
				</Badge>
			);
		}
	}),
	column.accessor("title", {
		header: "Title",
		cell: ({ row }) => (
			<div className='flex min-w-0 flex-col'>
				<span className='truncate font-medium'>{row.original.title}</span>
				<span className='text-muted-foreground line-clamp-1 text-xs'>
					{row.original.body}
				</span>
			</div>
		)
	}),
	column.accessor("issuedBy", {
		header: "Issued By",
		meta: { width: "w-36", hideOnMobile: true },
		cell: info => (
			<span className='text-muted-foreground block truncate text-xs'>
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

export function CertificatesTable<TRoute extends AnyRoute>({
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
	initialData?: CertificateRow[];
}) {
	const query = useQuery({
		queryKey: ["certificates", patientId],
		queryFn: () =>
			$listCertificatesByPatient({
				data: { patientId }
			}) as unknown as Promise<CertificateRow[]>,
		initialData
	});

	const all: CertificateRow[] = (query.data as CertificateRow[]) ?? [];
	const total = all.length;
	const pageCount = Math.max(1, Math.ceil(total / size));
	const pageRows = all.slice((page - 1) * size, page * size);

	const table = useTable({
		features,
		columns,
		data: pageRows,
		getRowId: c => c.id,
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
				description='The issued certificates could not load. Check your connection and try again.'
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
				aria-label='Certificates'
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
									No certificates issued for this patient yet.
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
				ariaLabel='Certificates Pagination'
				page={page}
				pageCount={pageCount}
				route={route}
				size={size}
			/>
		</div>
	);
}
