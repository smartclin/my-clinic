import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { ArrowLeftIcon, PencilIcon } from "lucide-react";

import { PageHeader } from "@/components/blocks/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InfoRow } from "@/components/ui/info-row";
import { useAuthSuspense } from "@/hooks/auth.hooks";
import { clinicWithDetailsQueryOptions } from "@/server/queries/clinics.queries";

const ClinicLayout = () => {
	const { clinicId } = Route.useParams();
	const { user } = useAuthSuspense();

	if (user?.role !== "admin") {
		return (
			<PageHeader
				description='Only administrators can view clinic details.'
				title='Clinic'
			/>
		);
	}

	return (
		<div className='flex flex-col gap-6'>
			<Link
				aria-label='Back to clinics'
				className='text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm font-medium'
				to='/app/clinics'
			>
				<ArrowLeftIcon aria-hidden='true' />
				Back to clinics
			</Link>
			<ClinicDetail clinicId={clinicId} />
			<Outlet />
		</div>
	);
};

export const Route = createFileRoute("/_auth/app/clinics/$clinicId")({
	component: ClinicLayout
});

const ClinicDetail = ({ clinicId }: { clinicId: string }) => {
	const query = useSuspenseQuery(clinicWithDetailsQueryOptions(clinicId));

	const clinic = query.data;
	if (!clinic) {
		return (
			<PageHeader
				description={`No clinic exists with ID ${clinicId}.`}
				title='Clinic not found'
			/>
		);
	}

	const patientCount = clinic.patients?.length ?? 0;
	const staffCount = 0;
	const upcomingCount = clinic.appointments?.length ?? 0;

	return (
		<div className='flex flex-col gap-6'>
			<PageHeader
				actions={
					<Button
						render={
							<Link
								params={{ clinicId }}
								to='/app/clinics/$clinicId/edit'
							/>
						}
						variant='outline'
					>
						<PencilIcon aria-hidden='true' />
						Edit
					</Button>
				}
				description={`Clinic ID: ${clinic.id}`}
				title={clinic.name}
			/>

			<div className='grid gap-3 sm:grid-cols-3'>
				<StatCard
					label='Patients'
					value={patientCount}
				/>
				<StatCard
					label='Staff'
					value={staffCount}
				/>
				<StatCard
					label='Upcoming appointments'
					value={upcomingCount}
				/>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Contact</CardTitle>
				</CardHeader>
				<CardContent className='grid gap-4 sm:grid-cols-2'>
					<InfoRow
						label='Phone'
						value={clinic.phone}
					/>
					<InfoRow
						label='Email'
						value={clinic.email}
					/>
					<InfoRow
						label='Address'
						value={clinic.address}
					/>
				</CardContent>
			</Card>
		</div>
	);
};

const StatCard = ({ label, value }: { label: string; value: number }) => (
	<Card>
		<CardHeader>
			<CardTitle className='text-muted-foreground text-sm font-medium'>
				{label}
			</CardTitle>
		</CardHeader>
		<CardContent>
			<p className='text-2xl font-semibold tabular-nums'>
				{value.toLocaleString("en-US")}
			</p>
		</CardContent>
	</Card>
);
