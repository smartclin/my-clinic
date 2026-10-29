// src/routes/_auth/app/appointments/index.tsx
import { createFileRoute } from "@tanstack/react-router";
import { CalendarClock } from "lucide-react";
import { z } from "zod";

import { PageHeader } from "#/components/blocks/page-header";
import { AppointmentForm } from "#/components/forms/AppointmentForm";
import { AppointmentsTable } from "#/components/tables/appointments-table";
import type { PageSize } from "#/components/tables/table-pagination-constants";
import {
	DEFAULT_PAGE_SIZE,
	isPageSize
} from "#/components/tables/table-pagination-constants";

const AppointmentsPage = () => {
	const { user } = Route.useRouteContext();
	const search = Route.useSearch();
	if (!user?.clinicId)
		return (
			<PageHeader
				description='No clinic assigned.'
				title='Appointments'
			/>
		);
	return (
		<div className='flex flex-col gap-6'>
			<PageHeader
				actions={
					<AppointmentForm
						clinicId={user.clinicId}
						patientId=''
					/>
				}
				description="Today's roster and upcoming bookings."
				icon={CalendarClock}
				title='Appointments'
			/>
			<AppointmentsTable
				clinicId={user.clinicId}
				page={search.page ?? 1}
				route={Route}
				size={search.size ?? DEFAULT_PAGE_SIZE}
			/>
		</div>
	);
};

export const Route = createFileRoute("/_auth/app/appointments/")({
	validateSearch: z.object({
		page: z.number().int().min(1).optional(),
		size: z.custom<PageSize>(v => isPageSize(String(v))).optional()
	}),
	component: AppointmentsPage
});
