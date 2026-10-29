// src/lib/collections/registry.ts
//
// Registry of collection instances. Collections are memoized by scope key
// so two components reading `patients` get the same instance (and the same
// optimistic state). Without this, each `useDbClient().collection(desc)`
// call would create a fresh collection — which defeats the whole point.
//
// `collectionOptions(...)` descriptors are *stable* (module-level consts),
// so the DbClient memoizes them. This registry exists to give the *typed*
// accessor that `useDbClient().collection()` returns.

import { queryClient } from "#/integrations/tanstack-query/root-provider.tsx";

import { dbClient } from "./client";
import { collections as collectionDescriptors } from "./descriptors";

// Map<scope, collection>. Keyed by `${descriptorId}:${scope}`.
const instances = new Map<string, unknown>();

function resolve<T>(descriptorId: string, scope: string, create: () => T): T {
	const key = `${descriptorId}:${scope}`;
	const existing = instances.get(key);
	if (existing) return existing as T;

	const created = create();
	instances.set(key, created);
	return created;
}

export const collectionRegistry = {
	// ── Reference data ──────────────────────────────────────────────────
	vaccines: () =>
		resolve("vaccines", "all", () =>
			dbClient.collection(collectionDescriptors.vaccines)
		),

	milestones: () =>
		resolve("milestones", "all", () =>
			dbClient.collection(collectionDescriptors.milestones)
		),

	// ── Patients ────────────────────────────────────────────────────────
	myPatients: () =>
		resolve("my-patients", "me", () =>
			dbClient.collection(collectionDescriptors.myPatients)
		),

	patientDetail: (patientId: string) =>
		resolve("patient-detail", patientId, () =>
			dbClient.collection(collectionDescriptors.patientDetail(patientId))
		),

	// ── Encounters ──────────────────────────────────────────────────────
	todayAppointments: (clinicId: string) =>
		resolve("today-appointments", clinicId, () =>
			dbClient.collection(collectionDescriptors.todayAppointments(clinicId))
		),

	appointmentsByPatient: (patientId: string) =>
		resolve("appointments-by-patient", patientId, () =>
			dbClient.collection(
				collectionDescriptors.appointmentsByPatient(patientId)
			)
		),

	visitsByPatient: (patientId: string) =>
		resolve("visits-by-patient", patientId, () =>
			dbClient.collection(collectionDescriptors.visitsByPatient(patientId))
		),

	// ── Clinical data ───────────────────────────────────────────────────
	measurementsByPatient: (patientId: string) =>
		resolve("measurements-by-patient", patientId, () =>
			dbClient.collection(
				collectionDescriptors.measurementsByPatient(patientId)
			)
		),

	vaccinationsByPatient: (patientId: string) =>
		resolve("vaccinations-by-patient", patientId, () =>
			dbClient.collection(
				collectionDescriptors.vaccinationsByPatient(patientId)
			)
		),

	milestonesByPatient: (patientId: string) =>
		resolve("milestones-by-patient", patientId, () =>
			dbClient.collection(collectionDescriptors.milestonesByPatient(patientId))
		),

	prescriptionsByPatient: (patientId: string) =>
		resolve("prescriptions-by-patient", patientId, () =>
			dbClient.collection(
				collectionDescriptors.prescriptionsByPatient(patientId)
			)
		),

	certificatesByPatient: (patientId: string) =>
		resolve("certificates-by-patient", patientId, () =>
			dbClient.collection(
				collectionDescriptors.certificatesByPatient(patientId)
			)
		),

	// ── Growth ──────────────────────────────────────────────────────────
	indicatorSeries: (patientId: string, indicator: string) =>
		resolve("indicator-series", `${patientId}:${indicator}`, () =>
			dbClient.collection(
				collectionDescriptors.indicatorSeries(patientId, indicator)
			)
		),

	flaggedMeasurements: (patientId: string) =>
		resolve("flagged-measurements", patientId, () =>
			dbClient.collection(collectionDescriptors.flaggedMeasurements(patientId))
		)
};

/** Drop every memoized instance. Called on sign-out. */
export function resetCollections(): void {
	instances.clear();
}
export function resetClinicScopedCollections(): void {
	instances.clear();
	queryClient.removeQueries({ queryKey: ["patients"] });
	queryClient.removeQueries({ queryKey: ["appointments"] });
	queryClient.removeQueries({ queryKey: ["visits"] });
	queryClient.removeQueries({ queryKey: ["clinics"] });
}

export function resetAllCollections(): void {
	resetClinicScopedCollections();
	queryClient.removeQueries({ queryKey: ["measurements"] });
	queryClient.removeQueries({ queryKey: ["vaccinations"] });
	queryClient.removeQueries({ queryKey: ["milestones"] });
	queryClient.removeQueries({ queryKey: ["prescriptions"] });
	queryClient.removeQueries({ queryKey: ["certificates"] });
	queryClient.removeQueries({ queryKey: ["growth"] });
}
