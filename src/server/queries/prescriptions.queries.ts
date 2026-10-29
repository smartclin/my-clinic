// src/server/queries/prescriptions.queries.ts

import { queryOptions } from "@tanstack/react-query";

import {
	$findPrescriptionById,
	$listActivePrescriptions,
	$listPrescriptionsByPatient,
	$listPrescriptionsInRange,
	$listTopMedications
} from "@/server/functions";

import { queryKeys } from "./keys";
import { STALE } from "./stale-time";

export const prescriptionsByPatientQueryOptions = (patientId: string) =>
	queryOptions({
		queryFn: () => $listPrescriptionsByPatient({ data: { patientId } }),
		queryKey: queryKeys.prescriptions.byPatient(patientId),
		staleTime: STALE.PRESCRIPTION
	});

export const activePrescriptionsQueryOptions = (patientId: string) =>
	queryOptions({
		queryFn: () => $listActivePrescriptions({ data: { patientId } }),
		queryKey: queryKeys.prescriptions.active(patientId),
		staleTime: STALE.PRESCRIPTION
	});

export const prescriptionsInRangeQueryOptions = (
	patientId: string,
	from: string,
	to: string
) =>
	queryOptions({
		queryFn: () => $listPrescriptionsInRange({ data: { from, patientId, to } }),
		queryKey: queryKeys.prescriptions.inRange(patientId, from, to),
		staleTime: STALE.PRESCRIPTION
	});

export const prescriptionDetailQueryOptions = (id: string) =>
	queryOptions({
		queryFn: () => $findPrescriptionById({ data: { id } }),
		queryKey: queryKeys.prescriptions.detail(id),
		staleTime: STALE.DETAIL
	});

export const topMedicationsQueryOptions = (clinicId: string, limit = 20) =>
	queryOptions({
		queryFn: () => $listTopMedications({ data: { clinicId, limit } }),
		queryKey: [...queryKeys.prescriptions.all, "top", clinicId, limit] as const,
		staleTime: STALE.LIST
	});
