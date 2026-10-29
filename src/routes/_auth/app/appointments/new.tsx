import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { PageHeader } from "@/components/blocks/page-header";
import { AppointmentForm } from "@/components/forms/AppointmentForm";

const NewAppointmentPage = () => {
	const navigate = useNavigate();
	return (
		<div className='flex flex-col gap-6'>
			<PageHeader
				description='Schedule a new appointment for a patient.'
				title='New Appointment'
			/>
			<AppointmentForm
				onCancel={() => {
					void navigate({ to: "/app/appointments" });
				}}
				onSuccess={() => {
					void navigate({ to: "/app/appointments" });
				}}
			/>
		</div>
	);
};

export const Route = createFileRoute("/_auth/app/appointments/new")({
	component: NewAppointmentPage
});
