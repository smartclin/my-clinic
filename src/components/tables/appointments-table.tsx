import { useQuery } from "@tanstack/react-query";
import { type AnyRoute, Link } from "@tanstack/react-router";
import {
	columnVisibilityFeature,
	createColumnHelper,
	rowPaginationFeature,
	tableFeatures,
	useTable
} from "@tanstack/react-table";
import { CalendarClockIcon, CircleAlertIcon, SearchXIcon } from "lucide-react";

import { IconTile } from "@/components/blocks/icon-tile";
import { SectionState } from "@/components/blocks/state-view";
import { TableColGroup } from "@/components/blocks/table-columns";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from "@/components/ui/table";
import { fetchTodayAppointments } from "@/server/functions";

import { type PageSize, TablePagination } from "./table-pagination";

/**
 * `patient` is nullable because the server function's join produces it
 * that way (LEFT JOIN type). In practice a row with a null patient is a
 * data-integrity anomaly — FK should prevent it — but the UI must render
 * gracefully rather than crash.
 */
type AppointmentPatient = {
	id: string;
	medicalRecordNumber?: string;
	name?: string;
	mrn?: string;
	firstName?: string;
	lastName?: string;
};

type AppointmentStatus = "scheduled" | "completed" | "cancelled" | "no-show";

type AppointmentRow = {
	id: string;
	clinicId: string;
	patientId: string | null;
	doctorId: string | null;
	scheduledAt: Date | string;
	durationMinutes: number;
	status: AppointmentStatus;
	patient: AppointmentPatient | null;
	doctor: { id: string; name: string } | null;
};

const features = tableFeatures({
	rowPaginationFeature,
	columnVisibilityFeature
});

const column = createColumnHelper<typeof features, AppointmentRow>();

const STATUS_VARIANT: Record<
	AppointmentStatus,
	"success" | "warning" | "info" | "destructive"
> = {
	scheduled: "info",
	completed: "success",
	cancelled: "destructive",
	"no-show": "warning"
};

const STATUS_LABEL: Record<AppointmentStatus, string> = {
	scheduled: "Scheduled",
	completed: "Completed",
	cancelled: "Cancelled",
	"no-show": "No Show"
};

const columns = column.columns([
	column.accessor("scheduledAt", {
		header: "Time",
		meta: { width: "w-28 max-sm:w-24" },
		cell: info => {
			const date = new Date(info.getValue());
			return (
				<div className='flex flex-col gap-0.5 py-1'>
					<span className='font-medium tabular-nums'>
						{date.toLocaleTimeString("en-US", {
							hour: "2-digit",
							minute: "2-digit"
						})}
					</span>
					<span className='text-muted-foreground text-xs tabular-nums'>
						{date.toLocaleDateString("en-US", {
							month: "short",
							day: "numeric"
						})}
					</span>
				</div>
			);
		}
	}),
	column.accessor(
		a => {
			if (!a.patient) return "—";
			return (
				a.patient.name ??
				`${a.patient.firstName ?? ""} ${a.patient.lastName ?? ""}`.trim()
			);
		},
		{
			id: "patient",
			header: "Patient",
			cell: ({ row }) => {
				const patient = row.original.patient;
				// Null-safe: a missing patient is shown rather than crashing.
				if (!patient) {
					return (
						<span className='text-muted-foreground italic'>
							Patient not found
						</span>
					);
				}
				const patientName =
					patient.name ??
					`${patient.firstName ?? ""} ${patient.lastName ?? ""}`.trim() ??
					"Unnamed";
				const mrn = patient.medicalRecordNumber ?? patient.mrn ?? "—";
				return (
					<div className='flex min-w-0 items-center gap-2.5'>
						<IconTile>
							<CalendarClockIcon aria-hidden='true' />
						</IconTile>
						<div className='flex min-w-0 flex-col'>
							<Link
								className='truncate font-medium underline-offset-4 hover:underline'
								params={{ patientId: patient.id } as never}
								to={"/app/patients/$patientId" as never}
							>
								{patientName}
							</Link>
							<span className='text-muted-foreground truncate font-mono text-xs'>
								{mrn}
							</span>
						</div>
					</div>
				);
			}
		}
	),
	column.accessor(a => a.doctor?.name ?? null, {
		id: "doctor",
		header: "Doctor",
		meta: { width: "w-40", hideOnMobile: true },
		cell: info => (
			<span className='text-muted-foreground block truncate'>
				{info.getValue() ?? "Unassigned"}
			</span>
		)
	}),
	column.accessor("durationMinutes", {
		header: () => <span className='block text-right'>Min</span>,
		meta: { width: "w-16 max-sm:w-14" },
		cell: info => (
			<span className='block text-right tabular-nums'>{info.getValue()}</span>
		)
	}),
	column.accessor("status", {
		header: "Status",
		meta: { width: "w-32" },
		cell: info => (
			<Badge variant={STATUS_VARIANT[info.getValue()]}>
				{STATUS_LABEL[info.getValue()]}
			</Badge>
		)
	})
]);

const COLUMN_LAYOUT = columns.map(definition => definition.meta ?? {});

export function AppointmentsTable<TRoute extends AnyRoute>({
	route,
	clinicId,
	page,
	size,
	initialData
}: {
	route?: TRoute;
	clinicId: string;
	page: number;
	size: PageSize;
	initialData?: AppointmentRow[];
}) {
	const query = useQuery({
		queryKey: ["appointments", "today", clinicId],
		queryFn: () =>
			fetchTodayAppointments({ data: { clinicId } }) as unknown as Promise<
				AppointmentRow[]
			>,
		initialData
	});

	// Type-annotated, not cast — `AppointmentRow` now structurally matches
	// the server's return type, so `?? []` is enough.
	const all: AppointmentRow[] = (query.data as AppointmentRow[]) ?? [];
	const total = all.length;
	const pageCount = Math.max(1, Math.ceil(total / size));
	const pageRows = all.slice((page - 1) * size, page * size);

	const table = useTable({
		features,
		columns,
		data: pageRows,
		getRowId: appointment => appointment.id,
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
				description="Today's appointment roster could not load. Check your connection and try again."
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
						to={"/app/appointments" as never}
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
				aria-label='Today Appointments'
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
									{header.isPlaceholder
										? null
										: header.column.columnDef.header instanceof Function
											? header.column.columnDef.header(header.getContext())
											: header.column.columnDef.header}
								</TableHead>
							))}
						</TableRow>
					))}
				</TableHeader>
				<TableBody>
					{query.isLoading && all.length === 0 ? (
						<TableRow>
							<TableCell colSpan={columns.length}>
								<div className='text-muted-foreground flex items-center justify-center py-8 text-sm'>
									Loading appointments…
								</div>
							</TableCell>
						</TableRow>
					) : pageRows.length > 0 ? (
						table.getRowModel().rows.map(row => (
							<TableRow key={row.id}>
								{row.getVisibleCells().map(cell => (
									<TableCell
										hideOnMobile={cell.column.columnDef.meta?.hideOnMobile}
										key={cell.id}
									>
										{cell.column.columnDef.cell instanceof Function
											? cell.column.columnDef.cell(cell.getContext())
											: (cell.getValue() as React.ReactNode)}
									</TableCell>
								))}
							</TableRow>
						))
					) : (
						<TableRow>
							<TableCell colSpan={columns.length}>
								<div className='text-muted-foreground flex items-center justify-center py-8 text-sm'>
									No appointments scheduled
								</div>
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
			<TablePagination
				ariaLabel='Appointments Pagination'
				page={page}
				pageCount={pageCount}
				route={route}
				size={size}
			/>
		</div>
	);
}
