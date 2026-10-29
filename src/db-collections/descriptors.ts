// src/lib/collections/descriptors.ts
//
// Every `collectionOptions('id', (client) => …)` descriptor used by the
// app. Descriptors are module-level constants — stable identity — so the
// DbClient can memoize each collection across re-renders.
//
// Mutation handlers delegate to the same server functions the query
// layer's `useMutation` hooks call, but they DO NOT call `invalidateQueries`.
// That's the query layer's job. The collection's `onUpdate` / `onInsert` /
// `onDelete` handlers are only reached if the app calls
// `collection.update(...)` / `.insert(...)` / `.delete(...)` directly —
// which the codebase does not (yet) do. When you migrate a form to use
// optimistic collection writes, add the `queryClient.invalidateQueries`
// calls back into the handler, scoped the same way the `useMutation`
// hook does.
//
// Why include the handlers at all, if they're not hit yet?
//   `queryCollectionOptions` requires either the `on*` handlers OR the
//   `disableOptimisticUpdates` flag. Providing the handlers is the
//   forward-compatible choice: swapping a `<form>` from `useMutation`
//   to `collection.update()` is then a local change, not a rewrite.

import { queryCollectionOptions } from "@tanstack/query-db-collection";
import { collectionOptions } from "@tanstack/react-db";
import type { QueryClient } from "@tanstack/react-query";

import type { Patient } from "@/db/schema";
import type {
	ChartPoint,
	GrowthIndicator,
	GrowthMeasurementRow,
	Sex
} from "@/lib/growth/lms-types";
import {
	$createAppointment,
	$createCertificate,
	$createMeasurement,
	$createPatient,
	$createPrescription,
	$createVaccination,
	$deleteAppointment,
	$deleteCertificate,
	$deleteMeasurement,
	$deleteMilestoneRecord,
	$deletePrescription,
	$deleteVaccination,
	$deleteVisit,
	$softDeletePatient,
	$updateAppointment,
	$updateCertificate,
	$updateMeasurement,
	$updatePatient,
	$updatePrescription,
	$updateVaccination,
	$updateVisit,
	$upsertMilestone
} from "@/server/functions";
import {
	$listAppointmentsByPatient,
	$listTodayAppointmentsForClinic
} from "@/server/functions/appointments";
import { $listCertificatesByPatient } from "@/server/functions/certificates";
import {
	$fetchFlaggedMeasurements,
	$fetchGrowthChartCurves,
	$fetchIndicatorSeries
} from "@/server/functions/growthchart";
import { $listMeasurementsByPatient } from "@/server/functions/measurements";
import { $listMilestoneCatalog } from "@/server/functions/milestone-catalog";
import { $listMilestonesByPatient } from "@/server/functions/milestones";
import { $findPatientById, $listMyPatients } from "@/server/functions/patients";
import { $listPrescriptionsByPatient } from "@/server/functions/prescriptions";
import { $listVaccinationsByPatient } from "@/server/functions/vaccinations";
import { $listVaccineCatalog } from "@/server/functions/vaccine-catalog";
import { $listVisitsByPatient } from "@/server/functions/visits";
import { queryKeys } from "@/server/queries/keys";

// ── Shared helpers ──────────────────────────────────────────────────────
// The query client is provided by the `DbClient` at construction time, so
// we never import the singleton here — the descriptor factory receives it.

const qc = (client: { requireDependency: <T>(key: string) => T }) =>
	client.requireDependency<QueryClient>("queryClient");

// ── Reference data ──────────────────────────────────────────────────────

export const vaccines = collectionOptions("vaccines", client =>
	queryCollectionOptions({
		id: "vaccines",
		queryClient: qc(client),
		queryKey: queryKeys.vaccineCatalog.list(),
		queryFn: async () => await $listVaccineCatalog(),
		getKey: v => v.id
		// Reference data: no optimistic writes. Mutations go through
		// `useCreateVaccine` / `useUpdateVaccine` / `useDeleteVaccine`.
	})
);

export const milestones = collectionOptions("milestones", client =>
	queryCollectionOptions({
		id: "milestones",
		queryClient: qc(client),
		queryKey: queryKeys.milestoneCatalog.list(),
		queryFn: async () => await $listMilestoneCatalog(),
		getKey: m => m.id
	})
);

// ── Patients ────────────────────────────────────────────────────────────
//
// Two collections:
//   - `myPatients` — the flat browse list (`PatientListRow` shape).
//   - `patientDetail(id)` — the joined detail (`PatientDetail` shape,
//     includes `clinic`, `provider`, and `counts`). Created lazily per id.
//
// They intentionally do NOT share row identity. Merging them would require
// normalizing `PatientDetail` into the table's row shape, which the app's
// queries don't produce.

export const myPatients = collectionOptions("my-patients", client =>
	queryCollectionOptions<Patient>({
		id: "my-patients",
		queryClient: qc(client),
		queryKey: queryKeys.patients.list({ ownerId: "me" }),
		queryFn: async () => await $listMyPatients(),
		getKey: p => p.id,

		onInsert: async ({ transaction }) => {
			const [mutation] = transaction.mutations;
			if (!mutation) return;
			const p = mutation.modified;
			await $createPatient({
				data: {
					name: p.name,
					gender: p.gender,
					dob: p.dob,
					medicalRecordNumber: p.medicalRecordNumber,
					notes: p.notes ?? undefined,
					guardianName: p.guardianName ?? undefined,
					guardianPhone: p.guardianPhone ?? undefined,
					allergies: p.allergies ?? undefined
				}
			});
		},

		onUpdate: async ({ transaction }) => {
			const [mutation] = transaction.mutations;
			if (!mutation) return;
			const { original, modified } = mutation;
			await $updatePatient({
				data: {
					id: original.id,
					data: {
						...(modified.name === original.name ? {} : { name: modified.name }),
						...(modified.gender === original.gender
							? {}
							: { gender: modified.gender }),
						...(modified.dob === original.dob ? {} : { dob: modified.dob }),
						...(modified.medicalRecordNumber === original.medicalRecordNumber
							? {}
							: { medicalRecordNumber: modified.medicalRecordNumber }),
						...(modified.notes === original.notes
							? {}
							: { notes: modified.notes }),
						...(modified.guardianName === original.guardianName
							? {}
							: { guardianName: modified.guardianName }),
						...(modified.guardianPhone === original.guardianPhone
							? {}
							: { guardianPhone: modified.guardianPhone }),
						...(modified.allergies === original.allergies
							? {}
							: { allergies: modified.allergies })
					}
				}
			});
		},

		onDelete: async ({ transaction }) => {
			const [mutation] = transaction.mutations;
			if (!mutation) return;
			// Soft-delete by default — the patient-record schema supports it.
			// `useHardDeletePatient` remains the explicit path for admins.
			await $softDeletePatient({ data: { id: mutation.original.id } });
		}
	})
);

export const patientDetail = (patientId: string) =>
	collectionOptions(`patient-detail:${patientId}`, client =>
		queryCollectionOptions({
			id: `patient-detail:${patientId}`,
			queryClient: qc(client),
			queryKey: queryKeys.patients.detail(patientId),
			queryFn: async () => {
				const patient = await $findPatientById({ data: { id: patientId } });
				return patient ? [patient] : [];
			},
			getKey: p => p.id
			// Detail rows aren't user-editable as a whole — updates go through
			// the patient form, which calls `useUpdatePatient`. No handlers.
		})
	);

// ── Encounters ──────────────────────────────────────────────────────────

export const todayAppointments = (clinicId: string) =>
	collectionOptions(`today-appointments:${clinicId}`, client =>
		queryCollectionOptions({
			id: `today-appointments:${clinicId}`,
			queryClient: qc(client),
			queryKey: queryKeys.appointments.today(clinicId),
			queryFn: async () =>
				await $listTodayAppointmentsForClinic({ data: { clinicId } }),
			getKey: a => a.id,

			onInsert: async ({ transaction }) => {
				const [mutation] = transaction.mutations;
				if (!mutation) return;
				const a = mutation.modified;
				await $createAppointment({
					data: {
						patientId: a.patientId,
						clinicId: a.clinicId ?? clinicId,
						doctorId: a.doctorId ?? undefined,
						scheduledAt: String(a.scheduledAt),
						durationMinutes: a.durationMinutes,
						reason: a.reason ?? undefined,
						notes: a.notes ?? undefined
					}
				});
			},

			onUpdate: async ({ transaction }) => {
				const [mutation] = transaction.mutations;
				if (!mutation) return;
				const { original, modified } = mutation;
				await $updateAppointment({
					data: {
						id: original.id,
						data: {
							...(modified.scheduledAt === original.scheduledAt
								? {}
								: { scheduledAt: String(modified.scheduledAt) }),
							...(modified.durationMinutes === original.durationMinutes
								? {}
								: { durationMinutes: modified.durationMinutes }),
							...(modified.status === original.status
								? {}
								: { status: modified.status }),
							...(modified.reason === original.reason
								? {}
								: { reason: modified.reason }),
							...(modified.notes === original.notes
								? {}
								: { notes: modified.notes })
						}
					}
				});
			},

			onDelete: async ({ transaction }) => {
				const [mutation] = transaction.mutations;
				if (!mutation) return;
				await $deleteAppointment({ data: { id: mutation.original.id } });
			}
		})
	);

export const appointmentsByPatient = (patientId: string) =>
	collectionOptions(`appointments-by-patient:${patientId}`, client =>
		queryCollectionOptions({
			id: `appointments-by-patient:${patientId}`,
			queryClient: qc(client),
			queryKey: queryKeys.appointments.byPatient(patientId),
			queryFn: async () =>
				await $listAppointmentsByPatient({ data: { patientId } }),
			getKey: a => a.id
		})
	);

export const visitsByPatient = (patientId: string) =>
	collectionOptions(`visits-by-patient:${patientId}`, client =>
		queryCollectionOptions({
			id: `visits-by-patient:${patientId}`,
			queryClient: qc(client),
			queryKey: queryKeys.visits.byPatient(patientId),
			queryFn: async () => await $listVisitsByPatient({ data: { patientId } }),
			getKey: v => v.id,

			onUpdate: async ({ transaction }) => {
				const [mutation] = transaction.mutations;
				if (!mutation) return;
				const { original, modified } = mutation;
				await $updateVisit({
					data: {
						id: original.id,
						data: {
							...(modified.visitedAt === original.visitedAt
								? {}
								: { visitedAt: String(modified.visitedAt) }),
							...(modified.ageMonths === original.ageMonths
								? {}
								: { ageMonths: modified.ageMonths })
						}
					}
				});
			},

			onDelete: async ({ transaction }) => {
				const [mutation] = transaction.mutations;
				if (!mutation) return;
				await $deleteVisit({ data: { id: mutation.original.id } });
			}
		})
	);

// ── Clinical data ───────────────────────────────────────────────────────

export const measurementsByPatient = (patientId: string) =>
	collectionOptions(`measurements-by-patient:${patientId}`, client =>
		queryCollectionOptions({
			id: `measurements-by-patient:${patientId}`,
			queryClient: qc(client),
			queryKey: queryKeys.measurements.byPatient(patientId),
			queryFn: async () =>
				await $listMeasurementsByPatient({ data: { patientId } }),
			getKey: m => m.id,

			onInsert: async ({ transaction }) => {
				const [mutation] = transaction.mutations;
				if (!mutation) return;
				const m = mutation.modified;
				await $createMeasurement({
					data: {
						patientId,
						gender: (m as { gender?: "boy" | "girl" }).gender ?? "boy", // resolve from parent patient at call site
						date: String(m.date),
						ageMonths: m.ageMonths,
						weight: m.weight ?? undefined,
						height: m.height ?? undefined,
						headCircumference: m.headCircumference ?? undefined,
						bmi: m.bmi ?? undefined,
						notes: m.notes ?? undefined
					}
				});
			},

			onUpdate: async ({ transaction }) => {
				const [mutation] = transaction.mutations;
				if (!mutation) return;
				const { original, modified } = mutation;
				await $updateMeasurement({
					data: {
						id: original.id,
						data: {
							...(modified.weight === original.weight
								? {}
								: { weight: modified.weight }),
							...(modified.height === original.height
								? {}
								: { height: modified.height }),
							...(modified.headCircumference === original.headCircumference
								? {}
								: { headCircumference: modified.headCircumference }),
							...(modified.bmi === original.bmi ? {} : { bmi: modified.bmi }),
							...(modified.notes === original.notes
								? {}
								: { notes: modified.notes })
						}
					}
				});
			},

			onDelete: async ({ transaction }) => {
				const [mutation] = transaction.mutations;
				if (!mutation) return;
				await $deleteMeasurement({ data: { id: mutation.original.id } });
			}
		})
	);

export const vaccinationsByPatient = (patientId: string) =>
	collectionOptions(`vaccinations-by-patient:${patientId}`, client =>
		queryCollectionOptions({
			id: `vaccinations-by-patient:${patientId}`,
			queryClient: qc(client),
			queryKey: queryKeys.vaccinations.byPatient(patientId),
			queryFn: async () =>
				await $listVaccinationsByPatient({ data: { patientId } }),
			getKey: v => v.id,

			onInsert: async ({ transaction }) => {
				const [mutation] = transaction.mutations;
				if (!mutation) return;
				const v = mutation.modified;
				await $createVaccination({
					data: {
						patientId,
						vaccineId: v.vaccineId,
						status: v.status,
						administeredDate: v.administeredDate ?? undefined,
						dueDate: v.dueDate ?? undefined,
						batchNumber: v.batchNumber ?? undefined,
						administeredBy: v.administeredBy ?? undefined,
						facility: v.facility ?? undefined,
						adverseReactions: v.adverseReactions ?? undefined,
						notes: v.notes ?? undefined
					}
				});
			},

			onUpdate: async ({ transaction }) => {
				const [mutation] = transaction.mutations;
				if (!mutation) return;
				const { original, modified } = mutation;
				await $updateVaccination({
					data: {
						id: original.id,
						data: {
							...(modified.status === original.status
								? {}
								: { status: modified.status }),
							...(modified.administeredDate === original.administeredDate
								? {}
								: { administeredDate: modified.administeredDate }),
							...(modified.dueDate === original.dueDate
								? {}
								: { dueDate: modified.dueDate }),
							...(modified.batchNumber === original.batchNumber
								? {}
								: { batchNumber: modified.batchNumber }),
							...(modified.administeredBy === original.administeredBy
								? {}
								: { administeredBy: modified.administeredBy }),
							...(modified.facility === original.facility
								? {}
								: { facility: modified.facility }),
							...(modified.adverseReactions === original.adverseReactions
								? {}
								: { adverseReactions: modified.adverseReactions }),
							...(modified.notes === original.notes
								? {}
								: { notes: modified.notes })
						}
					}
				});
			},

			onDelete: async ({ transaction }) => {
				const [mutation] = transaction.mutations;
				if (!mutation) return;
				await $deleteVaccination({
					data: {
						patientId: mutation.original.patientId,
						vaccineId: mutation.original.vaccineId
					}
				});
			}
		})
	);

export const milestonesByPatient = (patientId: string) =>
	collectionOptions(`milestones-by-patient:${patientId}`, client =>
		queryCollectionOptions({
			id: `milestones-by-patient:${patientId}`,
			queryClient: qc(client),
			queryKey: queryKeys.milestones.byPatient(patientId),
			queryFn: async () =>
				await $listMilestonesByPatient({ data: { patientId } }),
			getKey: m => m.id,

			onInsert: async ({ transaction }) => {
				const [mutation] = transaction.mutations;
				if (!mutation) return;
				const m = mutation.modified;
				await $upsertMilestone({
					data: {
						patientId,
						milestoneId: m.milestoneId,
						isAchieved: m.isAchieved,
						achievedDate: m.achievedDate ?? undefined,
						notes: m.notes ?? undefined
					}
				});
			},

			onUpdate: async ({ transaction }) => {
				const [mutation] = transaction.mutations;
				if (!mutation) return;
				const { original, modified } = mutation;
				// Milestones upsert on (patientId, milestoneId), so the update path
				// is the same server function — different semantics, same endpoint.
				await $upsertMilestone({
					data: {
						patientId: original.patientId,
						milestoneId: modified.milestoneId ?? original.milestoneId,
						isAchieved: modified.isAchieved ?? original.isAchieved,
						achievedDate: modified.achievedDate ?? undefined,
						notes: modified.notes ?? undefined
					}
				});
			},

			onDelete: async ({ transaction }) => {
				const [mutation] = transaction.mutations;
				if (!mutation) return;
				await $deleteMilestoneRecord({
					data: {
						patientId: mutation.original.patientId,
						milestoneId: mutation.original.milestoneId
					}
				});
			}
		})
	);

export const prescriptionsByPatient = (patientId: string) =>
	collectionOptions(`prescriptions-by-patient:${patientId}`, client =>
		queryCollectionOptions({
			id: `prescriptions-by-patient:${patientId}`,
			queryClient: qc(client),
			queryKey: queryKeys.prescriptions.byPatient(patientId),
			queryFn: async () =>
				await $listPrescriptionsByPatient({ data: { patientId } }),
			getKey: p => p.id,

			onInsert: async ({ transaction }) => {
				const [mutation] = transaction.mutations;
				if (!mutation) return;
				const p = mutation.modified;
				await $createPrescription({
					data: {
						patientId,
						prescriptionDate: String(p.prescriptionDate),
						medications: p.medications ?? [],
						instructions: p.instructions ?? undefined,
						notes: p.notes ?? undefined
					}
				});
			},

			onUpdate: async ({ transaction }) => {
				const [mutation] = transaction.mutations;
				if (!mutation) return;
				const { original, modified } = mutation;
				await $updatePrescription({
					data: {
						id: original.id,
						data: {
							...(modified.prescriptionDate === original.prescriptionDate
								? {}
								: { prescriptionDate: String(modified.prescriptionDate) }),
							...(modified.status === original.status
								? {}
								: { status: modified.status }),
							...(modified.medications === original.medications
								? {}
								: { medications: modified.medications ?? [] }),
							...(modified.instructions === original.instructions
								? {}
								: { instructions: modified.instructions }),
							...(modified.notes === original.notes
								? {}
								: { notes: modified.notes })
						}
					}
				});
			},

			onDelete: async ({ transaction }) => {
				const [mutation] = transaction.mutations;
				if (!mutation) return;
				await $deletePrescription({ data: { id: mutation.original.id } });
			}
		})
	);

export const certificatesByPatient = (patientId: string) =>
	collectionOptions(`certificates-by-patient:${patientId}`, client =>
		queryCollectionOptions({
			id: `certificates-by-patient:${patientId}`,
			queryClient: qc(client),
			queryKey: queryKeys.certificates.byPatient(patientId),
			queryFn: async () =>
				await $listCertificatesByPatient({ data: { patientId } }),
			getKey: c => c.id,

			onInsert: async ({ transaction }) => {
				const [mutation] = transaction.mutations;
				if (!mutation) return;
				const c = mutation.modified;
				await $createCertificate({
					data: {
						patientId,
						issueDate: String(c.issueDate),
						certificateType: c.certificateType,
						title: c.title,
						body: c.body,
						issuedBy: c.issuedBy ?? undefined,
						notes: c.notes ?? undefined
					}
				});
			},

			onUpdate: async ({ transaction }) => {
				const [mutation] = transaction.mutations;
				if (!mutation) return;
				const { original, modified } = mutation;
				await $updateCertificate({
					data: {
						id: original.id,
						data: {
							...(modified.issueDate === original.issueDate
								? {}
								: { issueDate: String(modified.issueDate) }),
							...(modified.certificateType === original.certificateType
								? {}
								: { certificateType: modified.certificateType }),
							...(modified.title === original.title
								? {}
								: { title: modified.title }),
							...(modified.body === original.body
								? {}
								: { body: modified.body }),
							...(modified.issuedBy === original.issuedBy
								? {}
								: { issuedBy: modified.issuedBy }),
							...(modified.notes === original.notes
								? {}
								: { notes: modified.notes })
						}
					}
				});
			},

			onDelete: async ({ transaction }) => {
				const [mutation] = transaction.mutations;
				if (!mutation) return;
				await $deleteCertificate({ data: { id: mutation.original.id } });
			}
		})
	);

// ── Growth ──────────────────────────────────────────────────────────────
//
// Growth series and flagged measurements are READ-ONLY collections. The
// chart never writes through them — writes go through the measurement
// form's `useCreateMeasurement`. This is deliberate: growth measurements
// are also part of the visit record, and mutating them outside a visit
// context would leave the visit's own copy stale.

export const indicatorSeries = (patientId: string, indicator: string) =>
	collectionOptions(`indicator-series:${patientId}:${indicator}`, client =>
		queryCollectionOptions({
			id: `indicator-series:${patientId}:${indicator}`,
			queryClient: qc(client),
			queryKey: queryKeys.measurements.series(patientId, indicator),
			queryFn: async () =>
				await $fetchIndicatorSeries({
					data: { indicator: indicator as GrowthIndicator, patientId }
				}),
			getKey: (m: GrowthMeasurementRow) => m.id
		})
	);

export const flaggedMeasurements = (patientId: string) =>
	collectionOptions(`flagged-measurements:${patientId}`, client =>
		queryCollectionOptions({
			id: `flagged-measurements:${patientId}`,
			queryClient: qc(client),
			queryKey: queryKeys.measurements.flagged(patientId, 2),
			queryFn: async () =>
				await $fetchFlaggedMeasurements({
					data: { patientId, zThreshold: 2 }
				}),
			getKey: (m: GrowthMeasurementRow) => m.id
		})
	);

// Growth reference curves are truly static — infinite staleTime, never
// invalidated. If you want them in a collection (rather than the
// `growthCurvesQueryOptions` hook), this is the descriptor.
export const growthCurves = (request: {
	indicator: string;
	sex: string;
	range: unknown;
}) =>
	collectionOptions(`growth-curves:${JSON.stringify(request)}`, client =>
		queryCollectionOptions({
			id: `growth-curves:${JSON.stringify(request)}`,
			queryClient: qc(client),
			queryKey: queryKeys.growth.curves(request),
			queryFn: async () => {
				const curves = await $fetchGrowthChartCurves({
					data: {
						indicator: request.indicator as GrowthIndicator,
						sex: request.sex as Sex,
						range:
							typeof request.range === "string"
								? request.range
								: JSON.stringify(request.range)
					}
				});
				return curves.points;
			},
			getKey: (p: ChartPoint) => String(p.x)
		})
	);

// ── Barrel ──────────────────────────────────────────────────────────────
// The registry imports from this object. Keep the shape stable.

export const collections = {
	vaccines,
	milestones,
	myPatients,
	patientDetail,
	todayAppointments,
	appointmentsByPatient,
	visitsByPatient,
	measurementsByPatient,
	vaccinationsByPatient,
	milestonesByPatient,
	prescriptionsByPatient,
	certificatesByPatient,
	indicatorSeries,
	flaggedMeasurements,
	growthCurves
} as const;
