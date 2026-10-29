import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";

import { PageHeader } from "@/components/blocks/page-header";
import { ClinicForm } from "@/components/forms/ClinicForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuthSuspense } from "@/hooks/auth.hooks";

const NewClinicPage = () => {
	const navigate = useNavigate();
	const { user } = useAuthSuspense();

	if (user?.role !== "admin") {
		return (
			<PageHeader
				description='Only administrators can create clinics.'
				title='New Clinic'
			/>
		);
	}

	return (
		<div className='flex flex-col gap-6'>
			<PageHeader
				actions={
					<Button
						render={
							<Link
								aria-label='Cancel and return to clinics'
								to='/app/clinics'
							/>
						}
						variant='outline'
					>
						Cancel
					</Button>
				}
				description='Register a clinic. You can add staff and patients afterwards.'
				title='New Clinic'
			/>
			<Card>
				<CardContent className='pt-6'>
					<ClinicForm
						inline
						onSuccess={clinic => {
							void navigate({
								to: "/app/clinics/$clinicId",
								params: { clinicId: clinic.id }
							});
						}}
					/>
				</CardContent>
			</Card>
		</div>
	);
};

export const Route = createFileRoute("/_auth/app/clinics/new")({
	component: NewClinicPage
});
