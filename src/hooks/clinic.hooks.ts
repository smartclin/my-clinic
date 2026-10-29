import { useQuery } from "@tanstack/react-query";

import {
	clinicDetailQueryOptions,
	clinicPatientCountsQueryOptions,
	clinicSearchQueryOptions,
	clinicsListQueryOptions,
	clinicWithDetailsQueryOptions
} from "../server/queries/clinics.queries";

export function useClinics() {
	return useQuery(clinicsListQueryOptions());
}

export function useClinic(clinicId: string) {
	return useQuery(clinicDetailQueryOptions(clinicId));
}

export function useClinicWithDetails(clinicId: string) {
	return useQuery(clinicWithDetailsQueryOptions(clinicId));
}

export function useClinicSearch(query: string) {
	return useQuery(clinicSearchQueryOptions(query));
}

export function useClinicPatientCounts() {
	return useQuery(clinicPatientCountsQueryOptions());
}
