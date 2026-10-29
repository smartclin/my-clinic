import { defineRelations } from "drizzle-orm";

import * as authSchema from "./schemas/auth-schema";
import * as domainSchema from "./schemas/clinic-schema";

export const relations = defineRelations(
	{ ...authSchema, ...domainSchema },
	r => ({
		// ── Better Auth ──────────────────────────────────────────────────────
		user: {
			sessions: r.many.session(),
			accounts: r.many.account(),
			twoFactors: r.many.twoFactor(),

			// `patients` has three FKs to `user`. The `alias` string keeps each
			// edge distinct for the planner; the relation KEY keeps each edge
			// distinct for the type system and for `with:` queries.
			ownedPatients: r.many.patients({
				from: r.user.id,
				to: r.patients.ownerId
			}),
			createdPatients: r.many.patients({
				from: r.user.id,
				to: r.patients.createdBy,
				alias: "patient_created_by"
			}),
			updatedPatients: r.many.patients({
				from: r.user.id,
				to: r.patients.updatedBy,
				alias: "patient_updated_by"
			}),

			auditLogs: r.many.auditLog()
		},

		session: {
			user: r.one.user({
				from: r.session.userId,
				to: r.user.id,
				optional: false
			})
		},

		account: {
			user: r.one.user({
				from: r.account.userId,
				to: r.user.id,
				optional: false
			})
		},

		twoFactor: {
			user: r.one.user({
				from: r.twoFactor.userId,
				to: r.user.id,
				optional: false
			})
		},

		// ── Organization (Better Auth organization plugin) ───────────────────
		organization: {
			roles: r.many.organizationRole(),
			members: r.many.member(),
			invitations: r.many.invitation()
		},
		organizationRole: {
			organization: r.one.organization({
				from: r.organizationRole.organizationId,
				to: r.organization.id,
				optional: false
			})
		},
		member: {
			organization: r.one.organization({
				from: r.member.organizationId,
				to: r.organization.id,
				optional: false
			}),
			user: r.one.user({
				from: r.member.userId,
				to: r.user.id,
				optional: false
			})
		},
		invitation: {
			organization: r.one.organization({
				from: r.invitation.organizationId,
				to: r.organization.id,
				optional: false
			}),
			inviter: r.one.user({
				from: r.invitation.inviterId,
				to: r.user.id,
				optional: false
			})
		},

		// ── Clinics ──────────────────────────────────────────────────────────
		clinics: {
			patients: r.many.patients(),
			appointments: r.many.appointments(),
			visits: r.many.visits()
		},

		// ── Patients ─────────────────────────────────────────────────────────
		patients: {
			clinic: r.one.clinics({
				from: r.patients.clinicId,
				to: r.clinics.id
			}),
			owner: r.one.user({
				from: r.patients.ownerId,
				to: r.user.id,
				optional: false
			}),
			// ⚠️ renamed from `createdBy` — collided with the `createdBy` column.
			creator: r.one.user({
				from: r.patients.createdBy,
				to: r.user.id,
				alias: "patient_created_by"
			}),
			// ⚠️ renamed from `updatedBy`.
			updater: r.one.user({
				from: r.patients.updatedBy,
				to: r.user.id,
				alias: "patient_updated_by"
			}),

			measurements: r.many.measurements(),
			vaccinations: r.many.vaccinations(),
			milestones: r.many.milestones(),
			prescriptions: r.many.prescriptions(),
			appointments: r.many.appointments(),
			visits: r.many.visits(),
			certificates: r.many.certificates()
		},

		// ── Appointments ─────────────────────────────────────────────────────
		appointments: {
			patient: r.one.patients({
				from: r.appointments.patientId,
				to: r.patients.id,
				optional: false
			}),
			clinic: r.one.clinics({
				from: r.appointments.clinicId,
				to: r.clinics.id,
				optional: false
			}),
			doctor: r.one.user({
				from: r.appointments.doctorId,
				to: r.user.id,
				alias: "appointment_doctor"
			}),
			visits: r.many.visits()
		},

		// ── Visits ───────────────────────────────────────────────────────────
		visits: {
			patient: r.one.patients({
				from: r.visits.patientId,
				to: r.patients.id,
				optional: false
			}),
			clinic: r.one.clinics({
				from: r.visits.clinicId,
				to: r.clinics.id,
				optional: false
			}),
			appointment: r.one.appointments({
				from: r.visits.appointmentId,
				to: r.appointments.id
			}),
			doctor: r.one.user({
				from: r.visits.doctorId,
				to: r.user.id,
				alias: "visit_doctor"
			})
		},

		// ── Measurements ─────────────────────────────────────────────────────
		measurements: {
			patient: r.one.patients({
				from: r.measurements.patientId,
				to: r.patients.id,
				optional: false
			}),
			// ⚠️ renamed from `createdBy`.
			creator: r.one.user({
				from: r.measurements.createdBy,
				to: r.user.id,
				alias: "measurement_created_by"
			})
		},

		// ── Vaccine catalogue + vaccinations ─────────────────────────────────
		vaccineCatalog: {
			administeredTo: r.many.vaccinations()
		},
		vaccinations: {
			patient: r.one.patients({
				from: r.vaccinations.patientId,
				to: r.patients.id,
				optional: false
			}),
			vaccine: r.one.vaccineCatalog({
				from: r.vaccinations.vaccineId,
				to: r.vaccineCatalog.id,
				optional: false
			}),
			// ⚠️ renamed from `createdBy`.
			creator: r.one.user({
				from: r.vaccinations.createdBy,
				to: r.user.id,
				alias: "vaccination_created_by"
			}),
			// ⚠️ renamed from `updatedBy`.
			updater: r.one.user({
				from: r.vaccinations.updatedBy,
				to: r.user.id,
				alias: "vaccination_updated_by"
			})
		},

		// ── Milestone catalogue + milestones ─────────────────────────────────
		milestoneCatalog: {
			achievedBy: r.many.milestones()
		},
		milestones: {
			patient: r.one.patients({
				from: r.milestones.patientId,
				to: r.patients.id,
				optional: false
			}),
			milestone: r.one.milestoneCatalog({
				from: r.milestones.milestoneId,
				to: r.milestoneCatalog.id,
				optional: false
			}),
			// ⚠️ renamed from `createdBy`.
			creator: r.one.user({
				from: r.milestones.createdBy,
				to: r.user.id,
				alias: "milestone_created_by"
			}),
			// ⚠️ renamed from `updatedBy`.
			updater: r.one.user({
				from: r.milestones.updatedBy,
				to: r.user.id,
				alias: "milestone_updated_by"
			})
		},

		// ── Prescriptions ────────────────────────────────────────────────────
		prescriptions: {
			patient: r.one.patients({
				from: r.prescriptions.patientId,
				to: r.patients.id,
				optional: false
			}),
			// ⚠️ renamed from `prescriber` — `prescriber` is fine, kept as-is.
			// The column is `prescribedBy` which does NOT collide with `prescriber`.
			prescriber: r.one.user({
				from: r.prescriptions.prescribedBy,
				to: r.user.id,
				alias: "prescription_prescriber"
			}),
			// ⚠️ renamed from `createdBy`.
			creator: r.one.user({
				from: r.prescriptions.createdBy,
				to: r.user.id,
				alias: "prescription_created_by"
			}),
			// ⚠️ renamed from `updatedBy`.
			updater: r.one.user({
				from: r.prescriptions.updatedBy,
				to: r.user.id,
				alias: "prescription_updated_by"
			})
		},

		// ── Certificates ─────────────────────────────────────────────────────
		certificates: {
			patient: r.one.patients({
				from: r.certificates.patientId,
				to: r.patients.id,
				optional: false
			}),
			// ⚠️ THIS WAS THE LINE THAT CRASHED. Renamed from `createdBy`.
			creator: r.one.user({
				from: r.certificates.createdBy,
				to: r.user.id,
				alias: "certificate_created_by"
			}),
			// ⚠️ renamed from `updatedBy`.
			updater: r.one.user({
				from: r.certificates.updatedBy,
				to: r.user.id,
				alias: "certificate_updated_by"
			})
		},

		// ── Audit log ────────────────────────────────────────────────────────
		auditLog: {
			// `owner` ≠ `ownerId` — no collision.
			owner: r.one.user({
				from: r.auditLog.ownerId,
				to: r.user.id
			})
		}
	})
);
