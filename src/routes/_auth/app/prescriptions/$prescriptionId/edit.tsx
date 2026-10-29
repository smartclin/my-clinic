import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { PageHeader } from "@/components/blocks/page-header";
import { PrescriptionForm } from "@/components/forms/PrescriptionForm";
import { usePrescriptionDetail } from "@/hooks/prescription.hooks";
import { prescriptionDetailQueryOptions } from "@/server/queries/prescriptions.queries";

const EditPrescriptionPage = () => {
	const { prescriptionId } = Route.useParams();
	const navigate = useNavigate();
	const { data: rx } = usePrescriptionDetail(prescriptionId);
	if (!rx) return null;

	return (
		<div className='flex flex-col gap-6'>
			<PageHeader title='Edit Prescription' />
			<PrescriptionForm
				onCancel={() => {
					void navigate({
						to: "/app/prescriptions/$prescriptionId",
						params: { prescriptionId }
					});
				}}
				onSuccess={() => {
					void navigate({
						to: "/app/prescriptions/$prescriptionId",
						params: { prescriptionId }
					});
				}}
				patientId={rx.patientId}
				prescription={rx}
			/>
		</div>
	);
};

export const Route = createFileRoute(
	"/_auth/app/prescriptions/$prescriptionId/edit"
)({
	loader: async ({ context, params }) =>
		await context.queryClient.query(
			prescriptionDetailQueryOptions(params.prescriptionId)
		),
	component: EditPrescriptionPage
});
