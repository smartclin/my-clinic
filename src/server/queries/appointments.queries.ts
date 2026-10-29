// src/api/client/queries/appointments.queries.ts

import { queryOptions } from "@tanstack/react-query";

import {
	$countMyAppointmentsByStatus,
	$findAppointmentById,
	$listAppointmentsByClinic,
	$listAppointmentsByPatient,
	$listMyAppointments,
	$listMyUpcomingAppointments,
	$listNoShowAppointments,
	fetchAppointmentStatusCounts,
	fetchAppointmentsForPatient,
	fetchAppointmentsInRange,
	fetchPatientAppointmentCount,
	fetchTodayAppointments,
	fetchUpcomingForDoctor
} from "@/server/functions";

import { queryKeys } from "./keys";
import { STALE } from "./stale-time";

export type AppointmentStatus =
	| "scheduled"
	| "completed"
	| "cancelled"
	| "no-show";

export const appointmentsByPatientQueryOptions = (
	patientId: string,
	status?: AppointmentStatus
) =>
	queryOptions({
		queryFn: () => $listAppointmentsByPatient({ data: { patientId } }),
		queryKey: queryKeys.appointments.byPatient(patientId, status),
		staleTime: STALE.ENCOUNTERS
	});

export const appointmentDetailQueryOptions = (id: string) =>
	queryOptions({
		queryFn: () => $findAppointmentById({ data: { id } }),
		queryKey: queryKeys.appointments.detail(id),
		staleTime: STALE.DETAIL
	});

export const fetchAppointmentDetailQueryOptions = (id: string) =>
	queryOptions({
		queryFn: () => $findAppointmentById({ data: { id } }),
		queryKey: queryKeys.appointments.detail(id),
		staleTime: STALE.DETAIL
	});

export const appointmentsByClinicQueryOptions = (
	clinicId: string,
	range: { from: Date; to: Date }
) =>
	queryOptions({
		queryFn: () =>
			$listAppointmentsByClinic({
				data: {
					clinicId,
					from: range.from.toISOString(),
					to: range.to.toISOString()
				}
			}),
		queryKey: queryKeys.appointments.byClinic(
			clinicId,
			range.from.toISOString(),
			range.to.toISOString()
		),
		staleTime: STALE.ENCOUNTERS
	});

export const myAppointmentsQueryOptions = (range: { from: Date; to: Date }) =>
	queryOptions({
		queryFn: () =>
			$listMyAppointments({
				data: {
					from: range.from.toISOString(),
					to: range.to.toISOString()
				}
			}),
		queryKey: queryKeys.appointments.byDoctor(
			"me",
			"me",
			range.from.toISOString(),
			range.to.toISOString()
		),
		staleTime: STALE.ENCOUNTERS
	});

export const todayAppointmentsQueryOptions = (clinicId: string) =>
	queryOptions({
		queryFn: () => fetchTodayAppointments({ data: { clinicId } }),
		queryKey: queryKeys.appointments.today(clinicId),
		staleTime: STALE.ENCOUNTERS
	});

export const myUpcomingAppointmentsQueryOptions = () =>
	queryOptions({
		queryFn: () => $listMyUpcomingAppointments({ data: { limit: 10 } }),
		queryKey: queryKeys.appointments.upcoming("me", "me"),
		staleTime: STALE.ENCOUNTERS
	});

export const noShowAppointmentsQueryOptions = (clinicId: string) =>
	queryOptions({
		queryFn: () => $listNoShowAppointments({ data: { clinicId } }),
		queryKey: queryKeys.appointments.noShow(clinicId),
		staleTime: STALE.ENCOUNTERS
	});

export const myAppointmentStatusCountsQueryOptions = (range: {
	from: Date;
	to: Date;
}) =>
	queryOptions({
		queryFn: () =>
			$countMyAppointmentsByStatus({
				data: {
					from: range.from.toISOString(),
					to: range.to.toISOString()
				}
			}),
		queryKey: queryKeys.appointments.statusCounts(
			"me",
			"me",
			range.from.toISOString(),
			range.to.toISOString()
		),
		staleTime: STALE.DASHBOARD
	});

export const appointmentsQueryOptions = (
	clinicId: string,
	startDate?: string,
	endDate?: string
) =>
	queryOptions({
		queryKey: [
			"appointments",
			"clinic",
			clinicId,
			startDate ?? null,
			endDate ?? null
		],
		queryFn: async () => {
			// No date range → today's schedule (front-desk screen).
			if (
				startDate == null ||
				startDate === "" ||
				endDate == null ||
				endDate === ""
			) {
				return fetchTodayAppointments({ data: { clinicId } });
			}
			return fetchAppointmentsInRange({
				data: { clinicId, from: startDate, to: endDate }
			});
		},
		staleTime: STALE.ENCOUNTERS
	});

export const patientAppointmentsQueryOptions = (
	patientId: string,
	status?: AppointmentStatus
) =>
	queryOptions({
		queryKey: ["appointments", "patient", patientId, status ?? "all"],
		queryFn: async () =>
			fetchAppointmentsForPatient({ data: { patientId, status } }),
		staleTime: STALE.ENCOUNTERS
	});

export const doctorUpcomingQueryOptions = (doctorId: string, limit = 50) =>
	queryOptions({
		queryKey: ["appointments", "doctor", doctorId, "upcoming", limit],
		queryFn: async () => fetchUpcomingForDoctor({ data: { doctorId, limit } }),
		staleTime: STALE.ENCOUNTERS
	});

export const appointmentStatusCountsQueryOptions = (
	clinicId: string,
	from: string,
	to: string
) =>
	queryOptions({
		queryKey: ["appointments", "status-counts", clinicId, from, to],
		queryFn: async () =>
			fetchAppointmentStatusCounts({ data: { clinicId, from, to } }),
		staleTime: STALE.DASHBOARD
	});

export const patientAppointmentCountQueryOptions = (patientId: string) =>
	queryOptions({
		queryKey: ["appointments", "count", patientId],
		queryFn: async () => fetchPatientAppointmentCount({ data: { patientId } }),
		staleTime: STALE.DASHBOARD
	});
