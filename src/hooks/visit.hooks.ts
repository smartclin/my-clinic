import { useQuery } from "@tanstack/react-query";

import {
	dailyVisitCountsQueryOptions,
	myVisitsQueryOptions,
	visitByAppointmentQueryOptions,
	visitDetailQueryOptions,
	visitSnapshotQueryOptions,
	visitsByClinicQueryOptions,
	visitsByPatientQueryOptions
} from "../server/queries/visits.queries";

export function useVisit(visitId: string) {
	return useQuery(visitDetailQueryOptions(visitId));
}

export function useVisitSnapshot(visitId: string) {
	return useQuery(visitSnapshotQueryOptions(visitId));
}

export function usePatientVisits(patientId: string) {
	return useQuery(visitsByPatientQueryOptions(patientId));
}

export function useVisitByAppointment(appointmentId: string) {
	return useQuery(visitByAppointmentQueryOptions(appointmentId));
}

export function useClinicVisits(
	clinicId: string,
	range: { from: Date; to: Date }
) {
	return useQuery(visitsByClinicQueryOptions(clinicId, range));
}

export function useMyVisits(range: { from: Date; to: Date }) {
	return useQuery(myVisitsQueryOptions(range));
}

export function useDailyVisitCounts(
	clinicId: string,
	range: { from: Date; to: Date }
) {
	return useQuery(dailyVisitCountsQueryOptions(clinicId, range));
}
