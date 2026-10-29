import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/app/patients/$patientId")({
	component: PatientDetailPage
});

function PatientDetailPage() {
	const { patientId } = Route.useParams();
	return (
		<div>
			<h1 className='text-2xl font-bold'>Patient Detail: {patientId}</h1>
		</div>
	);
}
