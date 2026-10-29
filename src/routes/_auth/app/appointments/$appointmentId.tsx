import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeftIcon } from "lucide-react";

import { appointmentDetailQueryOptions } from "#/server/queries/appointments.queries.ts";
import { PageHeader } from "@/components/blocks/page-header";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const STATUS_VARIANT: Record<
	string,
	"success" | "warning" | "info" | "destructive"
> = {
	scheduled: "info",
	completed: "success",
	cancelled: "destructive",
	"no-show": "warning",
	noShow: "warning"
};

const STATUS_LABEL: Record<string, string> = {
	scheduled: "Scheduled",
	completed: "Completed",
	cancelled: "Cancelled",
	"no-show": "No Show",
	noShow: "No Show"
};

const AppointmentDetailPage = () => {
	const { appointmentId } = Route.useParams();
	const { data: appointment } = useSuspenseQuery(
		appointmentDetailQueryOptions(appointmentId)
	);
	if (!appointment) return null;

	const statusVariant = STATUS_VARIANT[appointment.status] ?? "outline";
	const statusLabel = STATUS_LABEL[appointment.status] ?? appointment.status;

	return (
		<div className='flex flex-col gap-6'>
			<Link
				className={buttonVariants({
					variant: "ghost",
					size: "sm",
					className: "w-fit"
				})}
				to='/app/appointments'
			>
				<ArrowLeftIcon aria-hidden='true' />
				Back to appointments
			</Link>

			<PageHeader
				actions={
					<Link
						className={buttonVariants({ variant: "outline" })}
						params={{ appointmentId }}
						to='/app/appointments/$appointmentId/edit'
					>
						Edit
					</Link>
				}
				description={new Date(String(appointment.scheduledAt)).toLocaleString()}
				title={
					appointment.patient?.name
						? `Appointment · ${appointment.patient.name}`
						: "Appointment"
				}
			/>

			<Card className='p-6'>
				<dl className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
					{appointment.patient && (
						<div>
							<dt className='text-muted-foreground text-sm'>Patient</dt>
							<dd>
								<Link
									className='font-medium underline-offset-4 hover:underline'
									params={{ patientId: appointment.patient.id }}
									to='/app/patients/$patientId'
								>
									{appointment.patient.name}
								</Link>
							</dd>
						</div>
					)}
					<div>
						<dt className='text-muted-foreground text-sm'>Status</dt>
						<dd>
							<Badge variant={statusVariant}>{statusLabel}</Badge>
						</dd>
					</div>
					<div>
						<dt className='text-muted-foreground text-sm'>Duration</dt>
						<dd>{appointment.durationMinutes} min</dd>
					</div>
					<div>
						<dt className='text-muted-foreground text-sm'>Doctor</dt>
						<dd>{appointment.doctor?.name ?? "—"}</dd>
					</div>
					<div>
						<dt className='text-muted-foreground text-sm'>Clinic</dt>
						<dd>{appointment.clinic?.name ?? "—"}</dd>
					</div>
					<div className='sm:col-span-2'>
						<dt className='text-muted-foreground text-sm'>Reason</dt>
						<dd>{appointment.reason ?? "—"}</dd>
					</div>
					<div className='sm:col-span-2'>
						<dt className='text-muted-foreground text-sm'>Notes</dt>
						<dd className='whitespace-pre-wrap'>{appointment.notes ?? "—"}</dd>
					</div>
				</dl>
			</Card>

			<Link
				className={buttonVariants({
					variant: "ghost",
					className: "self-start"
				})}
				to='/app/appointments'
			>
				← Back to appointments
			</Link>
		</div>
	);
};

export const Route = createFileRoute("/_auth/app/appointments/$appointmentId")({
	loader: async ({ context, params }) =>
		await context.queryClient.query(
			appointmentDetailQueryOptions(params.appointmentId)
		),
	component: AppointmentDetailPage
});
