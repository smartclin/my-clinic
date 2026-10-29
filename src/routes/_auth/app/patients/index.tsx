// src/routes/_auth/app/patients/index.tsx

import { useLiveQuery } from "@tanstack/react-db";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { useMyPatientsCollection } from "#/db-collections/hooks.ts";
import { PatientForm } from "@/components/forms/PatientForm";
import { PatientsTable } from "@/components/tables/patients-table";
import type { PageSize } from "@/components/tables/table-pagination-constants";
import {
	DEFAULT_PAGE_SIZE,
	isPageSize
} from "@/components/tables/table-pagination-constants";

interface PageHeaderProps {
	title: string;
	description?: string;
	actions?: React.ReactNode;
}

function PageHeader({ title, description, actions }: PageHeaderProps) {
	return (
		<div className='flex items-center justify-between'>
			<div>
				<h1 className='text-2xl font-bold tracking-tight'>{title}</h1>
				{description && (
					<p className='text-muted-foreground text-sm'>{description}</p>
				)}
			</div>
			{actions}
		</div>
	);
}

const PatientsPage = () => {
	const { user } = Route.useRouteContext();
	const search = Route.useSearch() as { page?: number; size?: PageSize };
	const patientsCollection = useMyPatientsCollection();

	// Live query reads from the collection (local-first, reactive). The
	// component falls back to the table which paginates client-side.
	const { data: patients } = useLiveQuery({
		query: q =>
			q.from({ p: patientsCollection }).orderBy(({ p }) => p.name, "asc")
	});

	if (!user?.clinicId) {
		return (
			<PageHeader
				description='No clinic is assigned to your account. Ask an administrator to link you.'
				title='Patients'
			/>
		);
	}

	const page = search.page ?? 1;
	const size = search.size ?? DEFAULT_PAGE_SIZE;

	return (
		<div className='flex flex-col gap-6'>
			<PageHeader
				actions={<PatientForm clinicId={user.clinicId} />}
				description='Browse and manage the children registered at your clinic.'
				title='Patients'
			/>
			<PatientsTable
				clinicId={user.clinicId}
				initialData={patients}
				page={page}
				route={Route}
				size={size}
			/>
		</div>
	);
};

export const Route = createFileRoute("/_auth/app/patients/")({
	validateSearch: z.object({
		page: z.number().int().min(1).optional(),
		size: z.custom<PageSize>(v => isPageSize(String(v))).optional()
	}),
	component: PatientsPage
});
