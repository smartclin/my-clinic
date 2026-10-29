import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { PageHeader } from "@/components/blocks/page-header";
import { VisitForm } from "@/components/forms/VisitForm";
import { Card, CardContent } from "@/components/ui/card";
import { useVisit } from "@/hooks/visit.hooks";
import { visitDetailQueryOptions } from "@/server/queries/visits.queries";

const EditVisitPage = () => {
	const { visitId } = Route.useParams();
	const navigate = useNavigate();
	const { data: visit } = useVisit(visitId);
	if (!visit) return null;

	return (
		<div className='flex flex-col gap-6'>
			<PageHeader title='Edit Visit' />
			<Card>
				<CardContent className='pt-6'>
					<VisitForm
						onCancel={() => {
							void navigate({
								to: "/app/visits/$visitId",
								params: { visitId }
							});
						}}
						onSuccess={() => {
							void navigate({
								to: "/app/visits/$visitId",
								params: { visitId }
							});
						}}
						visit={visit}
					/>
				</CardContent>
			</Card>
		</div>
	);
};

export const Route = createFileRoute("/_auth/app/visits/$visitId/edit")({
	loader: async ({ context, params }) =>
		await context.queryClient.query(visitDetailQueryOptions(params.visitId)),
	component: EditVisitPage
});
