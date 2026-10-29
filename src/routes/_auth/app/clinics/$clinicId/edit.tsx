import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { clinicWithDetailsQueryOptions } from "#/server/queries/clinics.queries.ts";
import { PageHeader } from "@/components/blocks/page-header";
import { ClinicForm } from "@/components/forms/ClinicForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuthSuspense } from "@/hooks/auth.hooks";

const EditClinicPage = () => {
	const { clinicId } = Route.useParams();
	const navigate = useNavigate();
	const { user } = useAuthSuspense();

	const cancel = () =>
		void navigate({ to: "/app/clinics/$clinicId", params: { clinicId } });

	if (user?.role !== "admin") {
		return (
			<PageHeader
				description='Only administrators can edit clinics.'
				title='Edit Clinic'
			/>
		);
	}

	return (
		<div className='flex flex-col gap-6'>
			<PageHeader
				actions={
					<Button
						onClick={cancel}
						variant='outline'
					>
						Cancel
					</Button>
				}
				description={`Clinic ID: ${clinicId}`}
				title='Edit Clinic'
			/>
			<Card>
				<CardContent className='pt-6'>
					<EditClinicForm
						clinicId={clinicId}
						onDone={cancel}
					/>
				</CardContent>
			</Card>
		</div>
	);
};

const EditClinicForm = ({
	clinicId,
	onDone
}: {
	clinicId: string;
	onDone: () => void;
}) => {
	const { data: clinic } = useSuspenseQuery(
		clinicWithDetailsQueryOptions(clinicId)
	);
	if (!clinic) {
		return (
			<p className='text-muted-foreground py-6 text-center text-sm'>
				This clinic no longer exists.
			</p>
		);
	}
	return (
		<ClinicForm
			clinic={clinic}
			inline
			onCancel={onDone}
			onSuccess={onDone}
		/>
	);
};

export const Route = createFileRoute("/_auth/app/clinics/$clinicId/edit")({
	loader: ({ context, params }) =>
		context.queryClient.query(clinicWithDetailsQueryOptions(params.clinicId)),
	component: EditClinicPage
});
