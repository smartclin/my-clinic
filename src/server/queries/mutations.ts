// src/api/client/queries/mutations.ts
//
// Every mutation lives here so the invalidation graph is auditable in one
// place. The rule: invalidate the SMALLEST prefix that covers the effect.
// If a mutation touches only one patient's data, invalidate that patient's
// subtree — not every patient in the clinic.
//
// Usage:
//   const { mutate: createAppointment } = useCreateAppointment();
//   createAppointment({ patientId, clinicId, scheduledAt, ... });

import {
	mutationOptions,
	type QueryClient,
	useMutation,
	useQueryClient
} from "@tanstack/react-query";
import { toast } from "sonner";

import {
	$bulkUpsertVaccinations,
	$cancelPrescription,
	$createAppointment,
	$createCertificate,
	$createManyAppointments,
	$createManyMeasurements,
	$createManyPatients,
	$createMeasurement,
	$createPatient,
	$createPrescription,
	$createVaccination,
	$createVaccine,
	$createVisit,
	$deleteAppointment,
	$deleteAuditOlderThan,
	$deleteCertificate,
	$deleteClinic,
	$deleteMeasurement,
	$deleteMilestoneRecord,
	$deletePrescription,
	$deleteVaccination,
	$deleteVaccine,
	$deleteVisit,
	$hardDeletePatient,
	$importDatabase,
	$logAudit,
	$logAuditMany,
	$markAppointmentCompleted,
	$markAppointmentNoShow,
	$markVaccineCompleted,
	$recordVisitTransaction,
	$rescheduleAppointment,
	$restorePatient,
	$softDeletePatient,
	$toggleMilestone,
	$updateAppointment,
	$updateCertificate,
	$updateClinic,
	$updateMeasurement,
	$updatePatient,
	$updatePatientWithVersion,
	$updatePrescription,
	$updateVaccination,
	$updateVaccine,
	$updateVisit,
	$upsertMeasurement,
	$upsertMilestone,
	$upsertVaccination
} from "@/server/functions";

import { $createClinic } from "../functions";
import { errorMessage, isVersionConflict } from "./errors";
import { queryKeys } from "./keys";

// ── Invalidation helpers ────────────────────────────────────────────────
// Centralized so the rules are visible and reusable.

async function invalidatePatient(qc: QueryClient, patientId: string) {
	await qc.invalidateQueries({
		queryKey: queryKeys.patients.detail(patientId)
	});
	await qc.invalidateQueries({ queryKey: queryKeys.patients.all });
}

async function invalidateMeasurements(qc: QueryClient, patientId: string) {
	await qc.invalidateQueries({
		queryKey: queryKeys.measurements.byPatient(patientId)
	});
	await qc.invalidateQueries({
		queryKey: queryKeys.measurements.latest(patientId)
	});
	await qc.invalidateQueries({
		queryKey: [...queryKeys.measurements.all, "series", patientId]
	});
	await qc.invalidateQueries({
		queryKey: [...queryKeys.measurements.all, "flagged", patientId]
	});
	await qc.invalidateQueries({
		queryKey: queryKeys.crossTable.growthSummary(patientId)
	});
	await qc.invalidateQueries({
		queryKey: queryKeys.crossTable.patientDashboard(patientId)
	});
}

async function invalidateVaccinations(qc: QueryClient, patientId: string) {
	await qc.invalidateQueries({
		queryKey: queryKeys.vaccinations.byPatient(patientId)
	});
	await qc.invalidateQueries({
		queryKey: queryKeys.vaccinations.coverage(patientId)
	});
	await qc.invalidateQueries({
		queryKey: queryKeys.patients.overdueVaccines("me")
	});
}

async function invalidateMilestones(qc: QueryClient, patientId: string) {
	await qc.invalidateQueries({
		queryKey: queryKeys.milestones.byPatient(patientId)
	});
	await qc.invalidateQueries({
		queryKey: queryKeys.milestones.achieved(patientId)
	});
}

async function invalidateVisits(qc: QueryClient, patientId: string) {
	await qc.invalidateQueries({
		queryKey: queryKeys.visits.byPatient(patientId)
	});
	await qc.invalidateQueries({ queryKey: queryKeys.visits.all });
}

async function invalidateAppointments(qc: QueryClient, patientId?: string) {
	await qc.invalidateQueries({ queryKey: queryKeys.appointments.all });
	if (patientId) {
		await qc.invalidateQueries({
			queryKey: queryKeys.appointments.byPatient(patientId)
		});
	}
}

async function invalidatePrescriptions(qc: QueryClient, patientId: string) {
	await qc.invalidateQueries({
		queryKey: queryKeys.prescriptions.byPatient(patientId)
	});
	await qc.invalidateQueries({
		queryKey: queryKeys.prescriptions.active(patientId)
	});
}

async function invalidateCertificates(qc: QueryClient, patientId: string) {
	await qc.invalidateQueries({
		queryKey: queryKeys.certificates.byPatient(patientId)
	});
}

// ── Patients ───────────────────────────────────────────────────────────

export const useCreatePatient = () => {
	const qc = useQueryClient();
	return useMutation(
		mutationOptions({
			mutationFn: (data: Parameters<typeof $createPatient>[0]["data"]) =>
				$createPatient({ data }),
			onSuccess: async () => {
				await qc.invalidateQueries({ queryKey: queryKeys.patients.all });
				toast.success("Patient created");
			}
		})
	);
};

export const useCreateManyPatients = () => {
	const qc = useQueryClient();
	return useMutation(
		mutationOptions({
			mutationFn: (data: Parameters<typeof $createManyPatients>[0]["data"]) =>
				$createManyPatients({ data }),
			onSuccess: async () => {
				await qc.invalidateQueries({ queryKey: queryKeys.patients.all });
				toast.success("Patients created");
			}
		})
	);
};

export const useUpdatePatient = () => {
	const qc = useQueryClient();
	return useMutation(
		mutationOptions({
			mutationFn: (data: Parameters<typeof $updatePatient>[0]["data"]) =>
				$updatePatient({ data }),
			onSuccess: async (_row, vars) => {
				await invalidatePatient(qc, vars.id);
				toast.success("Patient updated");
			}
		})
	);
};

export const useUpdatePatientWithVersion = () => {
	const qc = useQueryClient();
	return useMutation(
		mutationOptions({
			mutationFn: (
				data: Parameters<typeof $updatePatientWithVersion>[0]["data"]
			) => $updatePatientWithVersion({ data }),
			onSuccess: async (_row, vars) => {
				await invalidatePatient(qc, vars.id);
				toast.success("Patient updated");
			},

			onError: async (err, vars) => {
				if (isVersionConflict(err)) {
					// 1. Toast with actionable copy.
					toast.error("This patient was edited elsewhere.", {
						action: {
							label: "Reload",
							onClick: () => {
								// 2. Actually refetch this patient's detail so the
								//    form re-renders with the server's current version.
								void qc.invalidateQueries({
									queryKey: queryKeys.patients.detail(vars.id)
								});
							}
						}
					});
					return;
				}

				toast.error(errorMessage(err, "Could not update patient"));
			}
		})
	);
};

export const useSoftDeletePatient = () => {
	const qc = useQueryClient();
	return useMutation(
		mutationOptions({
			mutationFn: (data: Parameters<typeof $softDeletePatient>[0]["data"]) =>
				$softDeletePatient({ data }),
			onSuccess: async (_row, vars) => {
				await invalidatePatient(qc, vars.id);
				toast.success("Patient archived");
			}
		})
	);
};

export const useRestorePatient = () => {
	const qc = useQueryClient();
	return useMutation(
		mutationOptions({
			mutationFn: (data: Parameters<typeof $restorePatient>[0]["data"]) =>
				$restorePatient({ data }),
			onSuccess: async (_row, vars) => {
				await invalidatePatient(qc, vars.id);
				toast.success("Patient restored");
			}
		})
	);
};

export const useHardDeletePatient = () => {
	const qc = useQueryClient();
	return useMutation(
		mutationOptions({
			mutationFn: (data: Parameters<typeof $hardDeletePatient>[0]["data"]) =>
				$hardDeletePatient({ data }),
			onSuccess: async () => {
				await qc.invalidateQueries({ queryKey: queryKeys.patients.all });
				toast.success("Patient permanently deleted");
			}
		})
	);
};

// ── Appointments ───────────────────────────────────────────────────────

export const useCreateAppointment = () => {
	const qc = useQueryClient();
	return useMutation(
		mutationOptions({
			mutationFn: (data: Parameters<typeof $createAppointment>[0]["data"]) =>
				$createAppointment({ data }),
			onSuccess: async (_row, vars) => {
				await invalidateAppointments(qc, vars.patientId);
				toast.success("Appointment scheduled");
			}
		})
	);
};

export const useCreateManyAppointments = () => {
	const qc = useQueryClient();
	return useMutation(
		mutationOptions({
			mutationFn: (
				data: Parameters<typeof $createManyAppointments>[0]["data"]
			) => $createManyAppointments({ data }),
			onSuccess: async () => {
				await invalidateAppointments(qc);
				toast.success("Appointments scheduled");
			}
		})
	);
};

export const useUpdateAppointment = () => {
	const qc = useQueryClient();
	return useMutation(
		mutationOptions({
			mutationFn: (data: Parameters<typeof $updateAppointment>[0]["data"]) =>
				$updateAppointment({ data }),
			onSuccess: async () => {
				await invalidateAppointments(qc);
				toast.success("Appointment updated");
			}
		})
	);
};

export const useMarkAppointmentCompleted = () => {
	const qc = useQueryClient();
	return useMutation(
		mutationOptions({
			mutationFn: (
				data: Parameters<typeof $markAppointmentCompleted>[0]["data"]
			) => $markAppointmentCompleted({ data }),
			onSuccess: async () => {
				await invalidateAppointments(qc);
				toast.success("Appointment marked complete");
			}
		})
	);
};

export const useMarkAppointmentNoShow = () => {
	const qc = useQueryClient();
	return useMutation(
		mutationOptions({
			mutationFn: (
				data: Parameters<typeof $markAppointmentNoShow>[0]["data"]
			) => $markAppointmentNoShow({ data }),
			onSuccess: async () => {
				await invalidateAppointments(qc);
				toast.success("Appointment marked no-show");
			}
		})
	);
};

export const useRescheduleAppointment = () => {
	const qc = useQueryClient();
	return useMutation(
		mutationOptions({
			mutationFn: (
				data: Parameters<typeof $rescheduleAppointment>[0]["data"]
			) => $rescheduleAppointment({ data }),
			onSuccess: async () => {
				await invalidateAppointments(qc);
				toast.success("Appointment rescheduled");
			}
		})
	);
};

export const useDeleteAppointment = () => {
	const qc = useQueryClient();
	return useMutation(
		mutationOptions({
			mutationFn: (data: Parameters<typeof $deleteAppointment>[0]["data"]) =>
				$deleteAppointment({ data }),
			onSuccess: async () => {
				await invalidateAppointments(qc);
				toast.success("Appointment deleted");
			}
		})
	);
};

// ── Visits ─────────────────────────────────────────────────────────────

export const useCreateVisit = () => {
	const qc = useQueryClient();
	return useMutation(
		mutationOptions({
			mutationFn: (data: Parameters<typeof $createVisit>[0]["data"]) =>
				$createVisit({ data }),
			onSuccess: async (_row, vars) => {
				await invalidateVisits(qc, vars.patientId);
				toast.success("Visit recorded");
			}
		})
	);
};

export const useUpdateVisit = () => {
	const qc = useQueryClient();
	return useMutation(
		mutationOptions({
			mutationFn: (data: Parameters<typeof $updateVisit>[0]["data"]) =>
				$updateVisit({ data }),
			onSuccess: async () => {
				await qc.invalidateQueries({ queryKey: queryKeys.visits.all });
				toast.success("Visit updated");
			}
		})
	);
};

export const useDeleteVisit = () => {
	const qc = useQueryClient();
	return useMutation(
		mutationOptions({
			mutationFn: (data: Parameters<typeof $deleteVisit>[0]["data"]) =>
				$deleteVisit({ data }),
			onSuccess: async () => {
				await qc.invalidateQueries({ queryKey: queryKeys.visits.all });
				toast.success("Visit deleted");
			}
		})
	);
};

// ── Measurements ───────────────────────────────────────────────────────

export const useCreateMeasurement = () => {
	const qc = useQueryClient();
	return useMutation(
		mutationOptions({
			mutationFn: (data: Parameters<typeof $createMeasurement>[0]["data"]) =>
				$createMeasurement({ data }),
			onSuccess: async (_row, vars) => {
				await invalidateMeasurements(qc, vars.patientId);
				toast.success("Measurement recorded");
			}
		})
	);
};

export const useCreateManyMeasurements = () => {
	const qc = useQueryClient();
	return useMutation(
		mutationOptions({
			mutationFn: (
				data: Parameters<typeof $createManyMeasurements>[0]["data"]
			) => $createManyMeasurements({ data }),
			onSuccess: async (_row, vars) => {
				const patientIds = [...new Set(vars.map(v => v.patientId))];
				await Promise.all(
					patientIds.map(async id => await invalidateMeasurements(qc, id))
				);
				toast.success("Measurements recorded");
			}
		})
	);
};

export const useUpsertMeasurement = () => {
	const qc = useQueryClient();
	return useMutation(
		mutationOptions({
			mutationFn: (data: Parameters<typeof $upsertMeasurement>[0]["data"]) =>
				$upsertMeasurement({ data }),
			onSuccess: async (_row, vars) => {
				await invalidateMeasurements(qc, vars.patientId);
				toast.success("Measurement saved");
			}
		})
	);
};

export const useUpdateMeasurement = () => {
	const qc = useQueryClient();
	return useMutation(
		mutationOptions({
			mutationFn: (data: Parameters<typeof $updateMeasurement>[0]["data"]) =>
				$updateMeasurement({ data }),
			onSuccess: async () => {
				// We don't know the patientId here without a refetch; invalidate
				// the whole measurements prefix. If this becomes a hot path,
				// return patientId from the server fn and narrow the invalidation.
				await qc.invalidateQueries({ queryKey: queryKeys.measurements.all });
				toast.success("Measurement updated");
			}
		})
	);
};

export const useDeleteMeasurement = () => {
	const qc = useQueryClient();
	return useMutation(
		mutationOptions({
			mutationFn: (data: Parameters<typeof $deleteMeasurement>[0]["data"]) =>
				$deleteMeasurement({ data }),
			onSuccess: async () => {
				await qc.invalidateQueries({ queryKey: queryKeys.measurements.all });
				toast.success("Measurement deleted");
			}
		})
	);
};

// ── Vaccine catalog ────────────────────────────────────────────────────

export const useCreateVaccine = () => {
	const qc = useQueryClient();
	return useMutation(
		mutationOptions({
			mutationFn: (data: Parameters<typeof $createVaccine>[0]["data"]) =>
				$createVaccine({ data }),
			onSuccess: async () => {
				await qc.invalidateQueries({ queryKey: queryKeys.vaccineCatalog.all });
				toast.success("Vaccine created");
			}
		})
	);
};

export const useUpdateVaccine = () => {
	const qc = useQueryClient();
	return useMutation(
		mutationOptions({
			mutationFn: (data: Parameters<typeof $updateVaccine>[0]["data"]) =>
				$updateVaccine({ data }),
			onSuccess: async () => {
				await qc.invalidateQueries({ queryKey: queryKeys.vaccineCatalog.all });
				toast.success("Vaccine updated");
			}
		})
	);
};

export const useDeleteVaccine = () => {
	const qc = useQueryClient();
	return useMutation(
		mutationOptions({
			mutationFn: (data: Parameters<typeof $deleteVaccine>[0]["data"]) =>
				$deleteVaccine({ data }),
			onSuccess: async () => {
				await qc.invalidateQueries({ queryKey: queryKeys.vaccineCatalog.all });
				toast.success("Vaccine deleted");
			}
		})
	);
};

// ── Vaccinations ───────────────────────────────────────────────────────

export const useCreateVaccination = () => {
	const qc = useQueryClient();
	return useMutation(
		mutationOptions({
			mutationFn: (data: Parameters<typeof $createVaccination>[0]["data"]) =>
				$createVaccination({ data }),
			onSuccess: async (_row, vars) => {
				await invalidateVaccinations(qc, vars.patientId);
				toast.success("Vaccination recorded");
			}
		})
	);
};

export const useUpsertVaccination = () => {
	const qc = useQueryClient();
	return useMutation(
		mutationOptions({
			mutationFn: (data: Parameters<typeof $upsertVaccination>[0]["data"]) =>
				$upsertVaccination({ data }),
			onSuccess: async (_row, vars) => {
				await invalidateVaccinations(qc, vars.patientId);
				toast.success("Vaccination saved");
			}
		})
	);
};

export const useBulkUpsertVaccinations = () => {
	const qc = useQueryClient();
	return useMutation(
		mutationOptions({
			mutationFn: (
				data: Parameters<typeof $bulkUpsertVaccinations>[0]["data"]
			) => $bulkUpsertVaccinations({ data }),
			onSuccess: async (_row, vars) => {
				const patientIds = [...new Set(vars.map(v => v.patientId))];
				await Promise.all(
					patientIds.map(async id => await invalidateVaccinations(qc, id))
				);
				toast.success("Vaccinations saved");
			}
		})
	);
};

export const useUpdateVaccination = () => {
	const qc = useQueryClient();
	return useMutation(
		mutationOptions({
			mutationFn: (data: Parameters<typeof $updateVaccination>[0]["data"]) =>
				$updateVaccination({ data }),
			onSuccess: async () => {
				await qc.invalidateQueries({ queryKey: queryKeys.vaccinations.all });
				toast.success("Vaccination updated");
			}
		})
	);
};

export const useMarkVaccineCompleted = () => {
	const qc = useQueryClient();
	return useMutation(
		mutationOptions({
			mutationFn: (data: Parameters<typeof $markVaccineCompleted>[0]["data"]) =>
				$markVaccineCompleted({ data }),
			onSuccess: async (_row, vars) => {
				await invalidateVaccinations(qc, vars.patientId);
				toast.success("Vaccine marked complete");
			}
		})
	);
};

export const useDeleteVaccination = () => {
	const qc = useQueryClient();
	return useMutation(
		mutationOptions({
			mutationFn: (data: Parameters<typeof $deleteVaccination>[0]["data"]) =>
				$deleteVaccination({ data }),
			onSuccess: async (_row, vars) => {
				await invalidateVaccinations(qc, vars.patientId);
				toast.success("Vaccination deleted");
			}
		})
	);
};

// ── Milestones ─────────────────────────────────────────────────────────

export const useUpsertMilestone = () => {
	const qc = useQueryClient();
	return useMutation(
		mutationOptions({
			mutationFn: (data: Parameters<typeof $upsertMilestone>[0]["data"]) =>
				$upsertMilestone({ data }),
			onSuccess: async (_row, vars) => {
				await invalidateMilestones(qc, vars.patientId);
				toast.success("Milestone saved");
			}
		})
	);
};

export const useToggleMilestone = () => {
	const qc = useQueryClient();
	return useMutation(
		mutationOptions({
			mutationFn: (data: Parameters<typeof $toggleMilestone>[0]["data"]) =>
				$toggleMilestone({ data }),
			onSuccess: async (_row, vars) => {
				await invalidateMilestones(qc, vars.patientId);
			}
		})
	);
};

export const useDeleteMilestoneRecord = () => {
	const qc = useQueryClient();
	return useMutation(
		mutationOptions({
			mutationFn: (
				data: Parameters<typeof $deleteMilestoneRecord>[0]["data"]
			) => $deleteMilestoneRecord({ data }),
			onSuccess: async (_row, vars) => {
				await invalidateMilestones(qc, vars.patientId);
				toast.success("Milestone removed");
			}
		})
	);
};

// ── Prescriptions ──────────────────────────────────────────────────────

export const useCreatePrescription = () => {
	const qc = useQueryClient();
	return useMutation(
		mutationOptions({
			mutationFn: (data: Parameters<typeof $createPrescription>[0]["data"]) =>
				$createPrescription({ data }),
			onSuccess: async (_row, vars) => {
				await invalidatePrescriptions(qc, vars.patientId);
				toast.success("Prescription created");
			}
		})
	);
};

export const useUpdatePrescription = () => {
	const qc = useQueryClient();
	return useMutation(
		mutationOptions({
			mutationFn: (data: Parameters<typeof $updatePrescription>[0]["data"]) =>
				$updatePrescription({ data }),
			onSuccess: async () => {
				await qc.invalidateQueries({ queryKey: queryKeys.prescriptions.all });
				toast.success("Prescription updated");
			}
		})
	);
};

export const useCancelPrescription = () => {
	const qc = useQueryClient();
	return useMutation(
		mutationOptions({
			mutationFn: (data: Parameters<typeof $cancelPrescription>[0]["data"]) =>
				$cancelPrescription({ data }),
			onSuccess: async () => {
				await qc.invalidateQueries({ queryKey: queryKeys.prescriptions.all });
				toast.success("Prescription cancelled");
			}
		})
	);
};

export const useDeletePrescription = () => {
	const qc = useQueryClient();
	return useMutation(
		mutationOptions({
			mutationFn: (data: Parameters<typeof $deletePrescription>[0]["data"]) =>
				$deletePrescription({ data }),
			onSuccess: async () => {
				await qc.invalidateQueries({ queryKey: queryKeys.prescriptions.all });
				toast.success("Prescription deleted");
			}
		})
	);
};

// ── Certificates ───────────────────────────────────────────────────────

export const useCreateCertificate = () => {
	const qc = useQueryClient();
	return useMutation(
		mutationOptions({
			mutationFn: (data: Parameters<typeof $createCertificate>[0]["data"]) =>
				$createCertificate({ data }),
			onSuccess: async (_row, vars) => {
				await invalidateCertificates(qc, vars.patientId);
				toast.success("Certificate issued");
			}
		})
	);
};

export const useUpdateCertificate = () => {
	const qc = useQueryClient();
	return useMutation(
		mutationOptions({
			mutationFn: (data: Parameters<typeof $updateCertificate>[0]["data"]) =>
				$updateCertificate({ data }),
			onSuccess: async () => {
				await qc.invalidateQueries({ queryKey: queryKeys.certificates.all });
				toast.success("Certificate updated");
			}
		})
	);
};

export const useDeleteCertificate = () => {
	const qc = useQueryClient();
	return useMutation(
		mutationOptions({
			mutationFn: (data: Parameters<typeof $deleteCertificate>[0]["data"]) =>
				$deleteCertificate({ data }),
			onSuccess: async () => {
				await qc.invalidateQueries({ queryKey: queryKeys.certificates.all });
				toast.success("Certificate deleted");
			}
		})
	);
};

// ── Clinics ────────────────────────────────────────────────────────────

export const useCreateClinic = () => {
	const qc = useQueryClient();
	return useMutation(
		mutationOptions({
			mutationFn: (data: Parameters<typeof $createClinic>[0]["data"]) =>
				$createClinic({ data }),
			onSuccess: async () => {
				await qc.invalidateQueries({ queryKey: queryKeys.clinics.all });
				toast.success("Clinic created");
			}
		})
	);
};

export const useUpdateClinic = () => {
	const qc = useQueryClient();
	return useMutation(
		mutationOptions({
			mutationFn: (data: Parameters<typeof $updateClinic>[0]["data"]) =>
				$updateClinic({ data }),
			onSuccess: async (_row, vars) => {
				await qc.invalidateQueries({ queryKey: queryKeys.clinics.all });
				await qc.invalidateQueries({
					queryKey: queryKeys.clinics.detail(vars.id)
				});
				toast.success("Clinic updated");
			}
		})
	);
};

export const useDeleteClinic = () => {
	const qc = useQueryClient();
	return useMutation(
		mutationOptions({
			mutationFn: (data: Parameters<typeof $deleteClinic>[0]["data"]) =>
				$deleteClinic({ data }),
			onSuccess: async () => {
				await qc.invalidateQueries({ queryKey: queryKeys.clinics.all });
				toast.success("Clinic deleted");
			}
		})
	);
};

// ── Audit ──────────────────────────────────────────────────────────────

export const useLogAudit = () => {
	const qc = useQueryClient();
	return useMutation(
		mutationOptions({
			mutationFn: (data: Parameters<typeof $logAudit>[0]["data"]) =>
				$logAudit({ data }),
			onSuccess: async () => {
				await qc.invalidateQueries({ queryKey: queryKeys.auditLog.all });
			}
		})
	);
};

export const useLogAuditMany = () => {
	const qc = useQueryClient();
	return useMutation(
		mutationOptions({
			mutationFn: (data: Parameters<typeof $logAuditMany>[0]["data"]) =>
				$logAuditMany({ data }),
			onSuccess: async () => {
				await qc.invalidateQueries({ queryKey: queryKeys.auditLog.all });
			}
		})
	);
};

export const useDeleteAuditOlderThan = () => {
	const qc = useQueryClient();
	return useMutation(
		mutationOptions({
			mutationFn: (data: Parameters<typeof $deleteAuditOlderThan>[0]["data"]) =>
				$deleteAuditOlderThan({ data }),
			onSuccess: async () => {
				await qc.invalidateQueries({ queryKey: queryKeys.auditLog.all });
				toast.success("Old audit entries deleted");
			}
		})
	);
};

// ── Cross-table (transactional import / record) ────────────────────────

export const useImportDatabase = () => {
	const qc = useQueryClient();
	return useMutation(
		mutationOptions({
			mutationFn: (data: Parameters<typeof $importDatabase>[0]["data"]) =>
				$importDatabase({ data }),
			onSuccess: async () => {
				// Import replaces every table. Invalidate everything.
				await qc.invalidateQueries();
				toast.success("Database imported");
			}
		})
	);
};

export const useRecordVisitTransaction = () => {
	const qc = useQueryClient();
	return useMutation(
		mutationOptions({
			mutationFn: (
				data: Parameters<typeof $recordVisitTransaction>[0]["data"]
			) => $recordVisitTransaction({ data }),
			onSuccess: async (_row, vars) => {
				await Promise.all([
					invalidateMeasurements(qc, vars.patientId),
					invalidateVaccinations(qc, vars.patientId),
					invalidateMilestones(qc, vars.patientId),
					invalidateVisits(qc, vars.patientId)
				]);
				toast.success("Visit recorded");
			}
		})
	);
};
