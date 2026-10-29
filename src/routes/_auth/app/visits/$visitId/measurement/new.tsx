import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { PageHeader } from "@/components/blocks/page-header";
import { MeasurementForm } from "@/components/forms/MeasurementForm";
import { visitSnapshotQueryOptions } from "@/server/queries/visits.queries";

const NewMeasurementPage = () => {
	const { visitId } = Route.useParams();
	const navigate = useNavigate();
	const { visit } = Route.useLoaderData();

	return (
		<div className='flex flex-col gap-6'>
			<PageHeader title='Add Measurement' />
			<MeasurementForm
				dateOfBirth={visit.patient?.dob ?? ""}
				onCancel={() => {
					void navigate({ to: "/app/visits/$visitId", params: { visitId } });
				}}
				onSuccess={() => {
					void navigate({ to: "/app/visits/$visitId", params: { visitId } });
				}}
				patientId={visit.patientId}
				sex={visit.patient?.gender ?? "boy"}
				visitDate={visit.visitedAt}
				visitId={visitId}
			/>
		</div>
	);
};

export const Route = createFileRoute(
	"/_auth/app/visits/$visitId/measurement/new"
)({
	loader: async ({ context, params }) => {
		const visit = await context.queryClient.query(
			visitSnapshotQueryOptions(params.visitId)
		);
		if (!visit) throw new Error(`Visit not found: ${params.visitId}`);
		return { visit };
	},
	component: NewMeasurementPage
});
