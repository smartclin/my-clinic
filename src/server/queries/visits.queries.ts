// src/api/client/queries/visits.queries.ts

import { queryOptions } from "@tanstack/react-query";

import {
	$findVisitByAppointment,
	$findVisitById,
	$getDailyVisitCounts,
	$listMyVisits,
	$listVisitsByClinic,
	$listVisitsByPatient
} from "@/server/functions";

import { queryKeys } from "./keys";
import { STALE } from "./stale-time";

export const visitsByPatientQueryOptions = (patientId: string) =>
	queryOptions({
		queryFn: () => $listVisitsByPatient({ data: { patientId } }),
		queryKey: queryKeys.visits.byPatient(patientId),
		staleTime: STALE.ENCOUNTERS
	});

export const visitsByClinicQueryOptions = (
	clinicId: string,
	range: { from: Date; to: Date }
) =>
	queryOptions({
		queryFn: () =>
			$listVisitsByClinic({
				data: {
					clinicId,
					from: range.from.toISOString(),
					to: range.to.toISOString()
				}
			}),
		queryKey: queryKeys.visits.byClinic(
			clinicId,
			range.from.toISOString(),
			range.to.toISOString()
		),
		staleTime: STALE.ENCOUNTERS
	});

export const myVisitsQueryOptions = (range: { from: Date; to: Date }) =>
	queryOptions({
		queryFn: () =>
			$listMyVisits({
				data: {
					from: range.from.toISOString(),
					to: range.to.toISOString()
				}
			}),
		queryKey: queryKeys.visits.byDoctor(
			"me",
			range.from.toISOString(),
			range.to.toISOString()
		),
		staleTime: STALE.ENCOUNTERS
	});

export const visitDetailQueryOptions = (id: string) =>
	queryOptions({
		queryFn: () => $findVisitById({ data: { id } }),
		queryKey: queryKeys.visits.detail(id),
		staleTime: STALE.DETAIL
	});

export const visitSnapshotQueryOptions = visitDetailQueryOptions;
export const visitQueryOptions = visitDetailQueryOptions;

export const visitByAppointmentQueryOptions = (appointmentId: string) =>
	queryOptions({
		queryFn: () => $findVisitByAppointment({ data: { appointmentId } }),
		queryKey: queryKeys.visits.byAppointment(appointmentId),
		staleTime: STALE.ENCOUNTERS
	});

export const dailyVisitCountsQueryOptions = (
	clinicId: string,
	range: { from: Date; to: Date }
) =>
	queryOptions({
		queryFn: () =>
			$getDailyVisitCounts({
				data: {
					clinicId,
					from: range.from.toISOString(),
					to: range.to.toISOString()
				}
			}),
		queryKey: queryKeys.visits.dailyCounts(
			clinicId,
			range.from.toISOString(),
			range.to.toISOString()
		),
		staleTime: STALE.DASHBOARD
	});
