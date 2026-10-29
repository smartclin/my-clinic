// src/api/client/queries/clinics.queries.ts

import { queryOptions } from "@tanstack/react-query";

import {
	$findClinicById,
	$getClinicPatientCounts,
	$getClinicWithDetails,
	$listClinics,
	$searchClinics
} from "@/server/functions";

import { queryKeys } from "./keys";
import { STALE } from "./stale-time";

export const clinicsListQueryOptions = () =>
	queryOptions({
		queryFn: () => $listClinics(),
		queryKey: queryKeys.clinics.list(),
		staleTime: STALE.STATIC
	});

export const clinicSearchQueryOptions = (query: string) =>
	queryOptions({
		enabled: query.length > 0,
		queryFn: () => $searchClinics({ data: { query } }),
		queryKey: queryKeys.clinics.search(query),
		staleTime: STALE.LIST
	});

export const clinicDetailQueryOptions = (id: string) =>
	queryOptions({
		queryFn: () => $findClinicById({ data: { id } }),
		queryKey: queryKeys.clinics.detail(id),
		staleTime: STALE.PATIENT_DEMOGRAPHICS
	});

export const clinicWithDetailsQueryOptions = (id: string) =>
	queryOptions({
		queryFn: () => $getClinicWithDetails({ data: { id } }),
		queryKey: queryKeys.clinics.details(id),
		staleTime: STALE.LIST
	});

export const clinicPatientCountsQueryOptions = () =>
	queryOptions({
		queryFn: () => $getClinicPatientCounts(),
		queryKey: queryKeys.clinics.counts(),
		staleTime: STALE.DASHBOARD
	});
