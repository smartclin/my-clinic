// src/api/client/queries/vaccinations.queries.ts

import { queryOptions } from "@tanstack/react-query";

import {
	$findVaccinationRecord,
	$getVaccinationCoverage,
	$listMyOverdueVaccinations,
	$listUpcomingVaccinations,
	$listVaccinationsByPatient,
	$listVaccinationsByStatus
} from "@/server/functions";

import { queryKeys } from "./keys";
import { STALE } from "./stale-time";

type Status =
	| "due"
	| "scheduled"
	| "completed"
	| "missed"
	| "refused"
	| "contraindicated";

export const vaccinationsByPatientQueryOptions = (patientId: string) =>
	queryOptions({
		queryFn: () => $listVaccinationsByPatient({ data: { patientId } }),
		queryKey: queryKeys.vaccinations.byPatient(patientId),
		staleTime: STALE.ENCOUNTERS
	});

export const vaccinationsByStatusQueryOptions = (
	patientId: string,
	status: Status
) =>
	queryOptions({
		queryFn: () => $listVaccinationsByStatus({ data: { patientId, status } }),
		queryKey: queryKeys.vaccinations.byStatus(patientId, status),
		staleTime: STALE.ENCOUNTERS
	});

export const vaccinationRecordQueryOptions = (
	patientId: string,
	vaccineId: string
) =>
	queryOptions({
		enabled: patientId.length > 0 && vaccineId.length > 0,
		queryFn: () => $findVaccinationRecord({ data: { patientId, vaccineId } }),
		queryKey: queryKeys.vaccinations.record(patientId, vaccineId),
		staleTime: STALE.ENCOUNTERS
	});

export const myOverdueVaccinationsQueryOptions = () =>
	queryOptions({
		queryFn: () => $listMyOverdueVaccinations(),
		queryKey: queryKeys.vaccinations.overdue("me"),
		staleTime: STALE.DASHBOARD
	});

export const upcomingVaccinationsQueryOptions = (
	patientId: string,
	daysAhead = 30
) =>
	queryOptions({
		queryFn: () =>
			$listUpcomingVaccinations({ data: { daysAhead, patientId } }),
		queryKey: queryKeys.vaccinations.upcoming(patientId, daysAhead),
		staleTime: STALE.ENCOUNTERS
	});

export const vaccinationCoverageQueryOptions = (patientId: string) =>
	queryOptions({
		queryFn: () => $getVaccinationCoverage({ data: { patientId } }),
		queryKey: queryKeys.vaccinations.coverage(patientId),
		staleTime: STALE.DASHBOARD
	});
