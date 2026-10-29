import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { PageHeader } from "@/components/blocks/page-header";
import { VisitForm } from "@/components/forms/VisitForm";

const NewVisitPage = () => {
	const navigate = useNavigate();
	const { patientId, appointmentId } = Route.useSearch();

	return (
		<div className='flex flex-col gap-6'>
			<PageHeader
				description='Record a new clinical visit.'
				title='New Visit'
			/>
			<VisitForm
				defaultAppointmentId={appointmentId}
				defaultPatientId={patientId}
				onCancel={() => {
					void navigate({ to: "/app/visits" });
				}}
				onSuccess={visit => {
					void navigate({
						to: "/app/visits/$visitId",
						params: { visitId: visit.id }
					});
				}}
			/>
		</div>
	);
};

export const Route = createFileRoute("/_auth/app/visits/new")({
	validateSearch: (search: Record<string, unknown>) => ({
		patientId:
			typeof search.patientId === "string" ? search.patientId : undefined,
		appointmentId:
			typeof search.appointmentId === "string"
				? search.appointmentId
				: undefined
	}),
	component: NewVisitPage
});
