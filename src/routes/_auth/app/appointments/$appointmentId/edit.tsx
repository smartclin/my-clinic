import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { PageHeader } from "@/components/blocks/page-header";
import { AppointmentForm } from "@/components/forms/AppointmentForm";
import { appointmentDetailQueryOptions } from "@/server/queries/appointments.queries";

const EditAppointmentPage = () => {
	const { appointmentId } = Route.useParams();
	const navigate = useNavigate();
	const { data: appointment } = useSuspenseQuery(
		appointmentDetailQueryOptions(appointmentId)
	);
	if (!appointment) return null;

	return (
		<div className='flex flex-col gap-6'>
			<PageHeader title='Edit Appointment' />
			<AppointmentForm
				appointment={appointment}
				onCancel={() => {
					void navigate({
						to: "/app/appointments/$appointmentId",
						params: { appointmentId }
					});
				}}
				onSuccess={() => {
					void navigate({
						to: "/app/appointments/$appointmentId",
						params: { appointmentId }
					});
				}}
			/>
		</div>
	);
};

export const Route = createFileRoute(
	"/_auth/app/appointments/$appointmentId/edit"
)({
	loader: async ({ context, params }) =>
		await context.queryClient.query(
			appointmentDetailQueryOptions(params.appointmentId)
		),
	component: EditAppointmentPage
});
