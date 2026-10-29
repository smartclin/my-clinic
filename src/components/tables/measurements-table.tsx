// src/components/tables/measurements-table.tsx
import { useQuery } from "@tanstack/react-query";
import { type AnyRoute, Link } from "@tanstack/react-router";
import {
	columnVisibilityFeature,
	createColumnHelper,
	rowPaginationFeature,
	tableFeatures,
	useTable
} from "@tanstack/react-table";
import { CircleAlertIcon, RulerIcon, SearchXIcon } from "lucide-react";

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
import { fetchIndicatorSeries } from "@/server/functions";

export type MeasurementIndicator =
	| "weight-for-age"
	| "length-for-age"
	| "weight-for-length"
	| "bmi-for-age"
	| "head-circumference-for-age";

type MeasurementRow = {
	id: string;
	value: number;
	zScore: number | null;
	percentile: number | null;
	classification: string | null;
	visit: { visitedAt: Date; ageMonths: number } | null;
};

interface MeasurementsTableMeta {
	unit: string;
}

function isMeasurementsTableMeta(
	value: unknown
): value is MeasurementsTableMeta {
	return (
		typeof value === "object" &&
		value !== null &&
		"unit" in value &&
		typeof value.unit === "string"
	);
}

const features = tableFeatures({
	rowPaginationFeature,
	columnVisibilityFeature
});

const column = createColumnHelper<typeof features, MeasurementRow>();

const INDICATOR_LABEL: Record<MeasurementIndicator, string> = {
	"weight-for-age": "Weight / age",
	"length-for-age": "Length / age",
	"weight-for-length": "Weight / length",
	"bmi-for-age": "BMI / age",
	"head-circumference-for-age": "Head circ."
};

const INDICATOR_UNIT: Record<MeasurementIndicator, string> = {
	"weight-for-age": "kg",
	"length-for-age": "cm",
	"weight-for-length": "kg",
	"bmi-for-age": "kg/m²",
	"head-circumference-for-age": "cm"
};

function zVariant(
	z: number | null
): "success" | "warning" | "destructive" | "subtle" {
	if (z === null) return "subtle";
	if (z >= -2 && z <= 2) return "success";
	if (z >= -3 && z <= 3) return "warning";
	return "destructive";
}

const columns = column.columns([
	column.accessor(m => m.visit?.visitedAt ?? null, {
		id: "date",
		header: "Date",
		cell: ({ row }) => {
			const visitedAt = row.original.visit?.visitedAt;
			return (
				<div className='flex min-w-0 items-center gap-2.5'>
					<IconTile tone='secondary'>
						<RulerIcon aria-hidden='true' />
					</IconTile>
					<div className='flex min-w-0 flex-col'>
						<span className='font-medium'>
							{visitedAt
								? new Date(visitedAt).toLocaleDateString("en-US", {
										month: "short",
										day: "numeric",
										year: "numeric"
									})
								: "—"}
						</span>
						<span className='text-muted-foreground text-xs'>
							{row.original.visit ? `${row.original.visit.ageMonths}m` : "—"}
						</span>
					</div>
				</div>
			);
		}
	}),
	column.accessor("value", {
		header: ({ table }) => {
			const meta = table.options.meta;
			const unit = isMeasurementsTableMeta(meta) ? meta.unit : "";
			return (
				<span className='block text-right'>
					Value <span className='text-muted-foreground text-xs'>({unit})</span>
				</span>
			);
		},
		meta: { width: "w-28 max-sm:w-24" },
		cell: info => (
			<span className='block text-right font-mono text-xs tabular-nums'>
				{info.getValue().toFixed(2)}
			</span>
		)
	}),
	column.accessor("zScore", {
		header: () => <span className='block text-right'>Z-Score</span>,
		meta: { width: "w-24" },
		cell: info => {
			const z = info.getValue();
			return (
				<span className='block text-right font-mono text-xs tabular-nums'>
					{z === null ? "—" : z > 0 ? `+${z.toFixed(2)}` : z.toFixed(2)}
				</span>
			);
		}
	}),
	column.accessor("percentile", {
		header: () => <span className='block text-right'>Percentile</span>,
		meta: { width: "w-24", hideOnMobile: true },
		cell: info => {
			const p = info.getValue();
			return (
				<span className='block text-right font-mono text-xs tabular-nums'>
					{p === null ? "—" : `${p.toFixed(1)}%`}
				</span>
			);
		}
	}),
	column.accessor("classification", {
		header: "Classification",
		meta: { width: "w-36", hideOnMobile: true },
		cell: ({ row }) => {
			const c = row.original.classification;
			const z = row.original.zScore;
			if (!c) return <span className='text-muted-foreground'>—</span>;
			return <Badge variant={zVariant(z)}>{c}</Badge>;
		}
	})
]);

const COLUMN_LAYOUT = columns.map(definition => definition.meta ?? {});

export function MeasurementsTable<TRoute extends AnyRoute>({
	patientId,
	indicator,
	route,
	page,
	size,
	initialData
}: {
	patientId: string;
	indicator: MeasurementIndicator;
	page: number;
	route?: TRoute;
	size: PageSize;
	initialData?: MeasurementRow[];
}) {
	const query = useQuery({
		queryKey: ["series", patientId, indicator],
		queryFn: () =>
			fetchIndicatorSeries({ data: { patientId } }) as unknown as Promise<
				MeasurementRow[]
			>,
		initialData
	});

	const all: MeasurementRow[] = (query.data as MeasurementRow[]) ?? [];
	const total = all.length;
	const pageCount = Math.max(1, Math.ceil(total / size));
	const pageRows = all.slice((page - 1) * size, page * size);

	const unit = INDICATOR_UNIT[indicator];

	const table = useTable({
		features,
		columns,
		data: pageRows,
		getRowId: measurement => measurement.id,
		manualPagination: true,
		rowCount: total,
		state: { pagination: { pageIndex: page - 1, pageSize: size } },
		meta: { unit } satisfies MeasurementsTableMeta
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
				description='The measurement history could not load. Check your connection and try again.'
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
				aria-label='Measurements'
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
									No measurements recorded yet for {INDICATOR_LABEL[indicator]}.
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
				ariaLabel='Measurements Pagination'
				page={page}
				pageCount={pageCount}
				route={route}
				size={size}
			/>
		</div>
	);
}
