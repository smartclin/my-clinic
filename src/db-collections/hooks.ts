// src/lib/collections/hooks.ts
//
// React hooks that read a collection from the registry. Each hook returns
// the collection instance so the caller can pass it to `useLiveQuery` /
// `collection.update(...)`.

import { useDbClient } from "@tanstack/react-db";
import { useMemo } from "react";

import { collectionRegistry } from "./registry";

// ── Reference data ──────────────────────────────────────────────────────
export const useVaccinesCollection = () =>
	useMemo(() => collectionRegistry.vaccines(), []);

export const useMilestonesCatalogCollection = () =>
	useMemo(() => collectionRegistry.milestones(), []);

// ── Patients ────────────────────────────────────────────────────────────
export const useMyPatientsCollection = () =>
	useMemo(() => collectionRegistry.myPatients(), []);

export const usePatientDetailCollection = (patientId: string) =>
	useMemo(() => collectionRegistry.patientDetail(patientId), [patientId]);

// ── Encounters ──────────────────────────────────────────────────────────
export const useTodayAppointmentsCollection = (clinicId: string) =>
	useMemo(() => collectionRegistry.todayAppointments(clinicId), [clinicId]);

export const useAppointmentsByPatientCollection = (patientId: string) =>
	useMemo(
		() => collectionRegistry.appointmentsByPatient(patientId),
		[patientId]
	);

export const useVisitsByPatientCollection = (patientId: string) =>
	useMemo(() => collectionRegistry.visitsByPatient(patientId), [patientId]);

// ── Clinical data ───────────────────────────────────────────────────────
export const useMeasurementsByPatientCollection = (patientId: string) =>
	useMemo(
		() => collectionRegistry.measurementsByPatient(patientId),
		[patientId]
	);

export const useVaccinationsByPatientCollection = (patientId: string) =>
	useMemo(
		() => collectionRegistry.vaccinationsByPatient(patientId),
		[patientId]
	);

export const useMilestonesByPatientCollection = (patientId: string) =>
	useMemo(() => collectionRegistry.milestonesByPatient(patientId), [patientId]);

export const usePrescriptionsByPatientCollection = (patientId: string) =>
	useMemo(
		() => collectionRegistry.prescriptionsByPatient(patientId),
		[patientId]
	);

export const useCertificatesByPatientCollection = (patientId: string) =>
	useMemo(
		() => collectionRegistry.certificatesByPatient(patientId),
		[patientId]
	);

// ── Growth ──────────────────────────────────────────────────────────────
export const useIndicatorSeriesCollection = (
	patientId: string,
	indicator: string
) =>
	useMemo(
		() => collectionRegistry.indicatorSeries(patientId, indicator),
		[indicator, patientId]
	);

export const useFlaggedMeasurementsCollection = (patientId: string) =>
	useMemo(() => collectionRegistry.flaggedMeasurements(patientId), [patientId]);

// Re-export the DbClient hook so components don't import from two places.
export { useDbClient };
