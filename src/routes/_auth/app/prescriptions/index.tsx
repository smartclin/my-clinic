// src/routes/_auth/app/prescriptions/index.tsx
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { PillIcon, PlusIcon } from "lucide-react";
import type { ReactNode } from "react";

import { PageHeader } from "@/components/blocks/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from "@/components/ui/table";
import { useAuthSuspense } from "@/hooks/auth.hooks";
import { topMedicationsQueryOptions } from "@/server/queries/prescriptions.queries";

const SKELETON_ROWS = [
	"medication-1",
	"medication-2",
	"medication-3",
	"medication-4",
	"medication-5"
];

const PrescriptionsPage = () => {
	const { user } = useAuthSuspense();

	if (typeof user?.clinicId !== "string" || user.clinicId.length === 0) {
		return (
			<PageHeader
				description='No clinic is assigned to your account. Ask an administrator to link you.'
				title='Prescriptions'
			/>
		);
	}

	return (
		<div className='flex flex-col gap-6'>
			<PageHeader
				actions={
					<Button render={<Link to='/app/patients' />}>
						<PlusIcon />
						New Prescription
					</Button>
				}
				description='All medications prescribed at your clinic.'
				title='Prescriptions'
			/>
			<TopMedicationsCard clinicId={user.clinicId} />
		</div>
	);
};

const TopMedicationsCard = ({ clinicId }: { clinicId: string }) => {
	const q = useQuery(topMedicationsQueryOptions(clinicId, 20));
	let content: ReactNode;

	if (q.isPending) {
		content = (
			<div className='space-y-2 p-4'>
				{SKELETON_ROWS.map(key => (
					<Skeleton
						className='h-10 w-full'
						key={key}
					/>
				))}
			</div>
		);
	} else if (q.isError) {
		content = (
			<p className='text-destructive p-6 text-sm'>
				Could not load prescriptions: {String(q.error)}
			</p>
		);
	} else if (!q.data || q.data.length === 0) {
		content = (
			<p className='text-muted-foreground p-8 text-center text-sm'>
				No prescriptions recorded yet. Open a patient to add one.
			</p>
		);
	} else {
		content = (
			<Table aria-label='Top medications'>
				<TableHeader>
					<TableRow>
						<TableHead>Medication</TableHead>
						<TableHead className='w-32 text-right'>Prescribed</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{q.data.map(row => (
						<TableRow key={row.medicationName}>
							<TableCell className='font-medium'>
								{row.medicationName}
							</TableCell>
							<TableCell className='text-right'>
								<Badge variant='secondary'>{row.count}</Badge>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle className='flex items-center gap-2'>
					<PillIcon className='size-4' />
					Most-Prescribed Medications
				</CardTitle>
			</CardHeader>
			<CardContent className='p-0'>{content}</CardContent>
		</Card>
	);
};

export const Route = createFileRoute("/_auth/app/prescriptions/")({
	component: PrescriptionsPage
});
