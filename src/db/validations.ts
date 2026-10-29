import {
	createInsertSchema,
	createSelectSchema,
	createUpdateSchema
} from "drizzle-orm/zod";
import { z } from "zod/v4";

import * as schema from "./schema";

// ── Zod helpers ─────────────────────────────────────────────────────────
// Drizzle's refine callbacks receive a Zod schema typed to the column. These
// aliases make the "implicit any" errors go away because `s` is now typed.
type ZodString = z.ZodString;
type ZodNumber = z.ZodNumber;

// ============================================================================
// Clinics
// ============================================================================

export const clinicSelectSchema = createSelectSchema(schema.clinics);

export const clinicInsertSchema = createInsertSchema(schema.clinics, {
	name: (s: ZodString) => s.min(2).max(120),
	email: () => z.email().max(254),
	phone: (s: ZodString) => s.min(7).max(20),
	address: (s: ZodString) => s.max(500).optional()
});

export const clinicUpdateSchema = createUpdateSchema(schema.clinics, {
	name: (s: ZodString) => s.min(2).max(120),
	email: () => z.email().max(254),
	phone: (s: ZodString) => s.min(7).max(20),
	address: (s: ZodString) => s.max(500)
});

// ============================================================================
// Auth / identity
// ============================================================================

export const userSelectSchema = createSelectSchema(schema.user);

export const userInsertSchema = createInsertSchema(schema.user, {
	name: (s: ZodString) => s.min(1).max(120),
	email: z.email().max(254),
	role: z.enum(["doctor", "staff", "patient", "admin"]).optional(),
	phone: (s: ZodString) => s.min(7).max(20),
	address: (s: ZodString) => s.max(500)
});

export const userUpdateSchema = createUpdateSchema(schema.user, {
	name: (s: ZodString) => s.min(1).max(120),
	email: z.email().max(254),
	// NOTE: `.min(8).max(14)` on a phone field is narrower than the insert
	// schema above (`.min(7).max(20)`). That is almost certainly a typo —
	// updated phone numbers would be rejected if they exceed 14 chars while
	// the same number was accepted on insert. Aligned to 7–20 here.
	phone: (s: ZodString) => s.min(7).max(20)
});

export const sessionSelectSchema = createSelectSchema(schema.session);
export const accountSelectSchema = createSelectSchema(schema.account);
export const verificationSelectSchema = createSelectSchema(schema.verification);

// ============================================================================
// Patients
// ============================================================================
//
// Note: the previous version refined `firstName` and `lastName` on the
// update schema, but the current `schema.ts` stores the full name in a
// single `name` column (no `firstName`/`lastName` split). The refine below
// targets `name` accordingly. If you reintroduce the split, add the two
// columns to `schema.ts` first.

export const patientSelectSchema = createSelectSchema(schema.patients);

export const patientInsertSchema = createInsertSchema(schema.patients, {
	name: (s: ZodString) => s.min(1).max(120),
	medicalRecordNumber: (s: ZodString) => s.min(1).max(32),
	dob: (s: ZodString) =>
		s.regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD format"),
	guardianPhone: (s: ZodString) => s.max(32),
	allergies: (s: ZodString) => s.max(500)
}).extend({
	ownerId: z.uuid().optional()
});

export const patientUpdateSchema = createUpdateSchema(schema.patients, {
	name: (s: ZodString) => s.min(1).max(120),
	medicalRecordNumber: (s: ZodString) => s.min(1).max(32),
	dob: (s: ZodString) => s.regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD format")
});

// ============================================================================
// Appointments
// ============================================================================

export const appointmentSelectSchema = createSelectSchema(schema.appointments);

export const appointmentInsertSchema = createInsertSchema(schema.appointments, {
	durationMinutes: (s: ZodNumber) => s.int().min(5).max(240),
	reason: (s: ZodString) => s.max(1000),
	notes: (s: ZodString) => s.max(5000)
});

export const appointmentUpdateSchema = createUpdateSchema(schema.appointments, {
	durationMinutes: (s: ZodNumber) => s.int().min(5).max(240),
	status: z.enum(["scheduled", "completed", "cancelled", "no-show"]).optional()
});

// ============================================================================
// Visits
// ============================================================================

export const visitSelectSchema = createSelectSchema(schema.visits);

export const visitInsertSchema = createInsertSchema(schema.visits, {
	ageMonths: (s: ZodNumber) => s.min(0).max(1200),
	ageYears: (s: ZodNumber) => s.int().min(0).max(100),
	ageMonthsRemainder: (s: ZodNumber) => s.int().min(0).max(11)
});

export const visitUpdateSchema = createUpdateSchema(schema.visits, {
	ageMonths: (s: ZodNumber) => s.min(0).max(1200)
});

// ============================================================================
// Measurements
// ============================================================================
//
// The table has NO `value`, `zScore`, or `percentile` columns. It has:
//   weight, height, headCircumference, bmi        ← raw measurements
//   weightForAgeZ, lengthForAgeZ, bmiForAgeZ,
//   weightForLengthZ                              ← pre-computed z-scores
//   classification                                ← text label
//
// Refining `value` / `zScore` / `percentile` is what produced the
// `'value' does not exist in type ...` errors.

export const measurementSelectSchema = createSelectSchema(schema.measurements);

export const measurementInsertSchema = createInsertSchema(schema.measurements, {
	// Anthropometrics — physical bounds. `real` columns are numbers.
	weight: (s: ZodNumber) => s.positive("Weight must be positive").max(300),
	height: (s: ZodNumber) => s.positive("Height must be positive").max(250),
	headCircumference: (s: ZodNumber) =>
		s.positive("Head circumference must be positive").max(80),
	bmi: (s: ZodNumber) => s.positive("BMI must be positive").max(100),

	// Pre-computed Z-scores. Clinically meaningful range is ±10; clamping
	// wider than that would reject legitimate extremes in severe cases.
	weightForAgeZ: (s: ZodNumber) => s.min(-10).max(10).nullable().optional(),
	lengthForAgeZ: (s: ZodNumber) => s.min(-10).max(10).nullable().optional(),
	bmiForAgeZ: (s: ZodNumber) => s.min(-10).max(10).nullable().optional(),
	weightForLengthZ: (s: ZodNumber) => s.min(-10).max(10).nullable().optional(),

	// `real` for age months.
	ageMonths: (s: ZodNumber) => s.min(0).max(1200),

	// `date` column stored as YYYY-MM-DD text.
	date: (s: ZodString) =>
		s.regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD format")
});

export const measurementUpdateSchema = createUpdateSchema(schema.measurements, {
	weight: (s: ZodNumber) => s.positive().max(300),
	height: (s: ZodNumber) => s.positive().max(250),
	headCircumference: (s: ZodNumber) => s.positive().max(80),
	bmi: (s: ZodNumber) => s.positive().max(100),
	weightForAgeZ: (s: ZodNumber) => s.min(-10).max(10),
	lengthForAgeZ: (s: ZodNumber) => s.min(-10).max(10),
	bmiForAgeZ: (s: ZodNumber) => s.min(-10).max(10),
	weightForLengthZ: (s: ZodNumber) => s.min(-10).max(10)
});

// ============================================================================
// Vaccine catalogue + vaccinations
// ============================================================================
//
// Not present in the previous validations file. Adding them so the
// immunization module has the same validation guarantees as the rest.

export const vaccineCatalogSelectSchema = createSelectSchema(
	schema.vaccineCatalog
);

export const vaccineCatalogInsertSchema = createInsertSchema(
	schema.vaccineCatalog,
	{
		label: (s: ZodString) => s.min(1).max(200),
		arabicLabel: (s: ZodString) => s.max(200),
		disease: (s: ZodString) => s.min(1).max(200),
		recommendedAgeMonths: (s: ZodNumber) => s.int().min(0).max(228),
		recommendedAgeLabel: (s: ZodString) => s.min(1).max(100)
	}
);

export const vaccinationSelectSchema = createSelectSchema(schema.vaccinations);

export const vaccinationInsertSchema = createInsertSchema(schema.vaccinations, {
	vaccineId: (s: ZodString) => s.min(1).max(64),
	batchNumber: (s: ZodString) => s.max(64),
	administeredBy: (s: ZodString) => s.max(120),
	facility: (s: ZodString) => s.max(200),
	adverseReactions: (s: ZodString) => s.max(2000),
	administeredDate: (s: ZodString) =>
		s.regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD format")
});

export const vaccinationUpdateSchema = createUpdateSchema(schema.vaccinations, {
	status: z
		.enum([
			"due",
			"scheduled",
			"completed",
			"missed",
			"refused",
			"contraindicated"
		])
		.optional(),
	administeredDate: (s: ZodString) =>
		s.regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD format")
});

// ============================================================================
// Milestone catalogue + milestones
// ============================================================================

export const milestoneCatalogSelectSchema = createSelectSchema(
	schema.milestoneCatalog
);

export const milestoneCatalogInsertSchema = createInsertSchema(
	schema.milestoneCatalog,
	{
		label: (s: ZodString) => s.min(1).max(200),
		arabicLabel: (s: ZodString) => s.max(200),
		ageLabel: (s: ZodString) => s.min(1).max(100),
		redFlagWarning: (s: ZodString) => s.max(2000)
	}
);

export const milestoneSelectSchema = createSelectSchema(schema.milestones);

export const milestoneInsertSchema = createInsertSchema(schema.milestones, {
	milestoneId: (s: ZodString) => s.min(1).max(64),
	achievedDate: (s: ZodString) =>
		s.regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD format")
});

export const milestoneUpdateSchema = createUpdateSchema(schema.milestones, {
	achievedDate: (s: ZodString) =>
		s.regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD format")
});

// ============================================================================
// Prescriptions
// ============================================================================
//
// `medications` is `jsonb` holding `PrescriptionMedication[]`. The
// individual drug fields (`medicationName`, `dosage`, `frequency`,
// `durationDays`) are NOT top-level columns and must not appear in the
// refine object — that's the `'Found unknown key in refinement'` error.
//
// The right place to validate those is a nested Zod schema for the jsonb
// payload itself. That schema is exported below as
// `prescriptionMedicationsSchema` so callers can validate the payload
// before writing.

export const prescriptionMedicationSchema = z.object({
	drugId: z.string().min(1).max(64),
	name: z.string().min(1).max(200),
	dose: z.string().min(1).max(80),
	frequency: z.string().min(1).max(80),
	duration: z.string().min(1).max(80),
	route: z.enum(["IV", "IM", "Oral", "Inhalation", "PR"]),
	instructions: z.string().max(2000).optional()
});

export const prescriptionMedicationsSchema = z
	.array(prescriptionMedicationSchema)
	.max(50, "A single prescription should not contain more than 50 medications");

export const prescriptionSelectSchema = createSelectSchema(
	schema.prescriptions
);

export const prescriptionInsertSchema = createInsertSchema(
	schema.prescriptions,
	{
		prescriptionDate: (s: ZodString) =>
			s.regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD format"),
		instructions: (s: ZodString) => s.max(2000)
		// `medications` is jsonb; Drizzle types it as `unknown` by default,
		// so refining it here requires `.refine()` on the whole thing rather
		// than a per-column builder. Applied below via `.extend()`.
	}
).extend({
	medications: prescriptionMedicationsSchema.nullable().optional()
});

export const prescriptionUpdateSchema = createUpdateSchema(
	schema.prescriptions,
	{
		prescriptionDate: (s: ZodString) =>
			s.regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD format"),
		instructions: (s: ZodString) => s.max(2000)
	}
).extend({
	medications: prescriptionMedicationsSchema.nullable().optional()
});

// ============================================================================
// Certificates
// ============================================================================

export const certificateSelectSchema = createSelectSchema(schema.certificates);

export const certificateInsertSchema = createInsertSchema(schema.certificates, {
	issueDate: (s: ZodString) =>
		s.regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD format"),
	certificateType: (s: ZodString) => s.min(1).max(64),
	title: (s: ZodString) => s.min(1).max(200),
	body: (s: ZodString) => s.min(1).max(10_000),
	issuedBy: (s: ZodString) => s.max(120),
	notes: (s: ZodString) => s.max(2000)
});

export const certificateUpdateSchema = createUpdateSchema(schema.certificates, {
	title: (s: ZodString) => s.min(1).max(200),
	body: (s: ZodString) => s.min(1).max(10_000),
	notes: (s: ZodString) => s.max(2000)
});

// ============================================================================
// Audit log
// ============================================================================
//
// The current `schema.ts` uses `entityType` (not `entity`) and `payload`
// (not `metadata`). The refine keys below must match the columns exactly.

export const auditLogSelectSchema = createSelectSchema(schema.auditLog);

export const auditLogInsertSchema = createInsertSchema(schema.auditLog, {
	action: (s: ZodString) => s.min(1).max(64),
	entityType: (s: ZodString) => s.min(1).max(64),
	entityId: (s: ZodString) => s.min(1).max(64)
}).extend({
	payload: z
		.object({
			before: z.record(z.string(), z.unknown()).optional(),
			after: z.record(z.string(), z.unknown()).optional()
		})
		.nullable()
		.optional()
});

// ============================================================================
// Inferred input/output types
// ============================================================================

export type ClinicInput = z.infer<typeof clinicInsertSchema>;
export type ClinicUpdateInput = z.infer<typeof clinicUpdateSchema>;

export type UserInput = z.infer<typeof userInsertSchema>;
export type UserUpdateInput = z.infer<typeof userUpdateSchema>;

export type PatientInput = z.infer<typeof patientInsertSchema>;
export type PatientUpdateInput = z.infer<typeof patientUpdateSchema>;

export type AppointmentInput = z.infer<typeof appointmentInsertSchema>;
export type AppointmentUpdateInput = z.infer<typeof appointmentUpdateSchema>;

export type VisitInput = z.infer<typeof visitInsertSchema>;
export type VisitUpdateInput = z.infer<typeof visitUpdateSchema>;

export type MeasurementInput = z.infer<typeof measurementInsertSchema>;
export type MeasurementUpdateInput = z.infer<typeof measurementUpdateSchema>;

export type VaccineCatalogInput = z.infer<typeof vaccineCatalogInsertSchema>;
export type VaccinationInput = z.infer<typeof vaccinationInsertSchema>;
export type VaccinationUpdateInput = z.infer<typeof vaccinationUpdateSchema>;

export type MilestoneCatalogInput = z.infer<
	typeof milestoneCatalogInsertSchema
>;
export type MilestoneInput = z.infer<typeof milestoneInsertSchema>;
export type MilestoneUpdateInput = z.infer<typeof milestoneUpdateSchema>;

export type PrescriptionInput = z.infer<typeof prescriptionInsertSchema>;
export type PrescriptionUpdateInput = z.infer<typeof prescriptionUpdateSchema>;
export type PrescriptionMedicationInput = z.infer<
	typeof prescriptionMedicationSchema
>;

export type CertificateInput = z.infer<typeof certificateInsertSchema>;
export type CertificateUpdateInput = z.infer<typeof certificateUpdateSchema>;

export type AuditLogInput = z.infer<typeof auditLogInsertSchema>;
export const StatusSchema = z.enum([
	"scheduled",
	"completed",
	"cancelled",
	"no-show"
]);
