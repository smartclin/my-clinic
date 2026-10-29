import { useQuery } from "@tanstack/react-query";
import { type AnyRoute, Link } from "@tanstack/react-router";
import {
	columnVisibilityFeature,
	createColumnHelper,
	rowPaginationFeature,
	tableFeatures,
	useTable
} from "@tanstack/react-table";
import { CircleAlertIcon, SearchXIcon, UserRoundIcon } from "lucide-react";

import { decimalMonthsBetween } from "#/types/growth/index.ts";
import { IconTile } from "@/components/blocks/icon-tile";
import { SectionState } from "@/components/blocks/state-view";
import { TableColGroup } from "@/components/blocks/table-columns";
import {
	type PageSize,
	TablePagination
} from "@/components/tables/table-pagination";
import { Button, buttonVariants } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from "@/components/ui/table";
import type { Patient } from "@/db/schema";
import { fetchPatientsByClinic } from "@/server/functions";

// ── Static module-scope config ──────────────────────────────────────────────

const features = tableFeatures({
	rowPaginationFeature,
	columnVisibilityFeature
});

const column = createColumnHelper<typeof features, Patient>();

/** Format an age in fractional months as "3y 4m" / "11m". */
function formatAge(months: number): string {
	if (months < 0 || !Number.isFinite(months)) return "—";
	const years = Math.floor(months / 12);
	const rem = Math.round(months - years * 12);
	if (rem >= 12) return `${years + 1}y`;
	if (years === 0) return `${rem}m`;
	return rem === 0 ? `${years}y` : `${years}y ${rem}m`;
}

const MODULE_LOAD_MS = Date.now();

function ageMonthsFromDob(dateOfBirth: string): number | null {
	const dob = new Date(`${dateOfBirth}T00:00:00Z`);
	if (Number.isNaN(dob.getTime())) return null;
	return decimalMonthsBetween(dob, new Date(MODULE_LOAD_MS));
}

const columns = column.columns([
	column.accessor("medicalRecordNumber", {
		header: "MRN",
		meta: { width: "w-32 max-sm:w-24" },
		cell: ({ row }) => (
			<span className='block truncate font-mono text-xs tabular-nums'>
				{row.original.medicalRecordNumber}
			</span>
		)
	}),
	column.accessor("name", {
		header: "Patient",
		cell: ({ row }) => (
			<div className='flex min-w-0 items-center gap-2.5'>
				<IconTile tone='secondary'>
					<UserRoundIcon aria-hidden='true' />
				</IconTile>
				<Link
					className='truncate font-medium underline-offset-4 hover:underline'
					params={{ patientId: row.original.id } as never}
					to={"/app/patients/$patientId" as never}
				>
					{row.original.name}
				</Link>
			</div>
		)
	}),
	column.accessor("gender", {
		header: "Gender",
		meta: { width: "w-20", hideOnMobile: true },
		cell: info => (
			<span className='text-muted-foreground capitalize'>
				{info.getValue()}
			</span>
		)
	}),
	column.accessor("dob", {
		header: "Age",
		meta: { width: "w-24 max-sm:w-20" },
		cell: ({ row }) => {
			const ageMonths = ageMonthsFromDob(row.original.dob);
			return (
				<span className='block text-right tabular-nums'>
					{ageMonths === null ? "—" : formatAge(ageMonths)}
				</span>
			);
		}
	}),
	column.accessor("guardianPhone", {
		header: "Phone",
		meta: { width: "w-36", hideOnMobile: true },
		cell: info => (
			<span
				className='text-muted-foreground block truncate'
				title={info.getValue() ?? undefined}
			>
				{info.getValue() ?? "—"}
			</span>
		)
	})
]);

const COLUMN_LAYOUT = columns.map(definition => definition.meta ?? {});

export function PatientsTable<TRoute extends AnyRoute>({
	clinicId,
	page,
	route,
	size,
	initialData
}: {
	clinicId: string;
	page: number;
	route?: TRoute;
	size: PageSize;
	initialData?: Patient[];
}) {
	const query = useQuery({
		queryKey: ["patients", clinicId],
		queryFn: () =>
			fetchPatientsByClinic({ data: { clinicId } }) as unknown as Promise<
				Patient[]
			>,
		initialData
	});

	const all: Patient[] = (query.data as Patient[]) ?? [];
	const total = all.length;
	const pageCount = Math.max(1, Math.ceil(total / size));
	const pageRows = all.slice((page - 1) * size, page * size);

	const table = useTable({
		features,
		columns,
		data: pageRows,
		getRowId: patient => patient.id,
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
				description='The patient roster could not load. Check your connection and try again.'
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
						to={"/app/patients" as never}
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

	const leafColumnCount = table.getVisibleLeafColumns().length;

	return (
		<div className='flex flex-col gap-2'>
			<Table
				aria-busy={query.isFetching}
				aria-label='Patients'
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
							<TableCell colSpan={leafColumnCount}>
								<p className='text-muted-foreground py-8 text-center text-sm'>
									No patients enrolled yet.
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
								<TableCell colSpan={leafColumnCount}>
									<div className='bg-accent h-8 w-full animate-pulse rounded' />
								</TableCell>
							</TableRow>
						))}
				</TableBody>
			</Table>
			<TablePagination
				ariaLabel='Patients Pagination'
				page={page}
				pageCount={pageCount}
				route={route}
				size={size}
			/>
		</div>
	);
}
