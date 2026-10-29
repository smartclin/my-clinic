import { createFileRoute, Link } from "@tanstack/react-router";
import { UsersIcon } from "lucide-react";

import { PageHeader } from "@/components/blocks/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthSuspense } from "@/hooks/auth.hooks";

const VisitsPage = () => {
	const { user } = useAuthSuspense();

	if (!user?.clinicId) {
		return (
			<PageHeader
				description='No clinic is assigned to your account. Ask an administrator to link you.'
				title='Visits'
			/>
		);
	}

	return (
		<div className='flex flex-col gap-6'>
			<PageHeader
				actions={
					<Button render={<Link to='/app/patients' />}>
						<UsersIcon />
						Select Patient
					</Button>
				}
				description='Recent encounters, diagnoses, and clinical notes.'
				title='Visits'
			/>
			<Card>
				<CardHeader>
					<CardTitle>Encounter log</CardTitle>
				</CardHeader>
				<CardContent>
					<p className='text-muted-foreground text-sm'>
						Open a patient from the Patients page to record a new visit and view
						their encounter history.
					</p>
					<div className='mt-4'>
						<Button
							render={<Link to='/app/patients' />}
							variant='outline'
						>
							<UsersIcon />
							Go to Patients Directory
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

export const Route = createFileRoute("/_auth/app/visits/")({
	component: VisitsPage
});
