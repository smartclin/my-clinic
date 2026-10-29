import { useQuery } from "@tanstack/react-query";

import {
	activePrescriptionsQueryOptions,
	prescriptionDetailQueryOptions,
	prescriptionsByPatientQueryOptions,
	prescriptionsInRangeQueryOptions,
	topMedicationsQueryOptions
} from "../server/queries/prescriptions.queries";

export function usePrescriptionDetail(prescriptionId: string) {
	return useQuery(prescriptionDetailQueryOptions(prescriptionId));
}

export function usePatientPrescriptions(patientId: string) {
	return useQuery(prescriptionsByPatientQueryOptions(patientId));
}

export function useActivePrescriptions(patientId: string) {
	return useQuery(activePrescriptionsQueryOptions(patientId));
}

export function usePrescriptionsInRange(
	patientId: string,
	from: string,
	to: string
) {
	return useQuery(prescriptionsInRangeQueryOptions(patientId, from, to));
}

export function useTopMedications(clinicId: string, limit = 20) {
	return useQuery(topMedicationsQueryOptions(clinicId, limit));
}
