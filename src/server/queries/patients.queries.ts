// src/api/client/queries/patients.queries.ts

import { queryOptions } from "@tanstack/react-query";

import {
	$findPatientById,
	$findPatientByMrn,
	$getPatientFullRecord,
	$listMyPatients,
	$listMyPatientsByGender,
	$listMyPatientsPaginated,
	$listMyPatientsWithOverdueVaccines,
	$listMyStuntedPatients,
	$listPatientsByClinic,
	$searchMyPatients
} from "@/server/functions";

import { queryKeys } from "./keys";
import { STALE } from "./stale-time";

export const myPatientsQueryOptions = () =>
	queryOptions({
		queryFn: () => $listMyPatients(),
		queryKey: queryKeys.patients.list({ ownerId: "me" }),
		staleTime: STALE.LIST
	});

export const patientsByClinicQueryOptions = (clinicId: string) =>
	queryOptions({
		queryFn: () => $listPatientsByClinic({ data: { clinicId } }),
		queryKey: queryKeys.patients.list({ clinicId }),
		staleTime: STALE.LIST
	});

export const myPatientsPaginatedQueryOptions = (input: {
	limit?: number;
	cursor?: { createdAt: string; id: string };
}) =>
	queryOptions({
		queryFn: () => $listMyPatientsPaginated({ data: input }),
		queryKey: queryKeys.patients.paginated(
			"me",
			input.limit ?? 20,
			input.cursor
		),
		staleTime: STALE.LIST
	});

export const patientSearchQueryOptions = (query: string) =>
	queryOptions({
		enabled: query.length > 0,
		queryFn: () => $searchMyPatients({ data: { query } }),
		queryKey: queryKeys.patients.search("me", query),
		staleTime: STALE.LIST
	});

export const patientDetailQueryOptions = (id: string) =>
	queryOptions({
		queryFn: () => $findPatientById({ data: { id } }),
		queryKey: queryKeys.patients.detail(id),
		staleTime: STALE.PATIENT_DEMOGRAPHICS
	});

export const patientByMrnQueryOptions = (mrn: string) =>
	queryOptions({
		enabled: mrn.length > 0,
		queryFn: () => $findPatientByMrn({ data: { mrn } }),
		queryKey: [...queryKeys.patients.all, "by-mrn", mrn] as const,
		staleTime: STALE.PATIENT_DEMOGRAPHICS
	});

export const patientFullRecordQueryOptions = (id: string) =>
	queryOptions({
		queryFn: () => $getPatientFullRecord({ data: { id } }),
		queryKey: queryKeys.patients.fullRecord(id),
		staleTime: STALE.DETAIL
	});

export const myPatientsByGenderQueryOptions = (gender: "boy" | "girl") =>
	queryOptions({
		queryFn: () => $listMyPatientsByGender({ data: { gender } }),
		queryKey: queryKeys.patients.list({ ownerId: "me", gender }),
		staleTime: STALE.LIST
	});

export const myStuntedPatientsQueryOptions = () =>
	queryOptions({
		queryFn: () => $listMyStuntedPatients(),
		queryKey: queryKeys.patients.stunted("me"),
		staleTime: STALE.DASHBOARD
	});

export const myOverdueVaccinePatientsQueryOptions = () =>
	queryOptions({
		queryFn: () => $listMyPatientsWithOverdueVaccines(),
		queryKey: queryKeys.patients.overdueVaccines("me"),
		staleTime: STALE.DASHBOARD
	});
