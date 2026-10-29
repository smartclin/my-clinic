// db/schema.ts
//
// Drizzle ORM 1.0-rc / Relational Queries v2 schema for the Egyptian
// Pediatric Growth Tracker.
//
// Conventions
// -----------
// - UUID PKs everywhere; `defaultRandom()` → gen_random_uuid().
// - `real` for anything the UI plots (Z-scores, anthropometrics, ages).
// - `text` for calendar dates (YYYY-MM-DD) so string comparisons are stable.
// - `$onUpdate` on every `updatedAt` so callers never set it manually.
// - `version` + `deletedAt` on patients for optimistic concurrency + soft delete.
// - `jsonb` for structured payloads.
// - Better Auth `user.id` is `uuid` (defined in `auth-schema.ts` as `uuid("id")`).
//   Every FK referencing it must be `uuid` — never `text` — to match `user.id`.

import { sql } from "drizzle-orm";
import {
	boolean,
	date,
	index,
	integer,
	jsonb,
	pgEnum,
	pgTable,
	real,
	text,
	timestamp,
	uniqueIndex,
	uuid,
	varchar
} from "drizzle-orm/pg-core";

import type { DrugMonograph } from "#/types/formulary.ts";
import type { DrugFormularyItem } from "#/types/medication.ts";

import { user } from "./auth-schema";

// ── Shared column helpers ────────────────────────────────────────────────
// `...timestamps` was referenced but never defined in the original.
// Every table that spreads it now gets a consistent shape.
const timestamps = {
	createdAt: timestamp("created_at", { withTimezone: true })
		.notNull()
		.defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true })
		.notNull()
		.defaultNow()
		.$onUpdate(() => new Date())
};

// ── Enums ────────────────────────────────────────────────────────────────
export const genderEnum = pgEnum("patient_gender", ["boy", "girl"]);

// Declared but missing in the original — referenced by `appointments`.
export const appointmentStatusEnum = pgEnum("appointment_status", [
	"scheduled",
	"completed",
	"cancelled",
	"no-show"
]);
export const vaccinationStatusEnum = pgEnum("vaccination_status", [
	"due",
	"scheduled",
	"completed",
	"missed",
	"refused",
	"contraindicated"
]);

export const prescriptionStatusEnum = pgEnum("prescription_status", [
	"active",
	"completed",
	"cancelled"
]);

export const milestoneDomainEnum = pgEnum("milestone_domain", [
	"gross-motor",
	"fine-motor",
	"language",
	"social-cognitive"
]);

export type PatientGender = (typeof genderEnum.enumValues)[number];
export type AppointmentStatus =
	(typeof appointmentStatusEnum.enumValues)[number];
export type VaccinationStatus =
	(typeof vaccinationStatusEnum.enumValues)[number];
export type PrescriptionStatus =
	(typeof prescriptionStatusEnum.enumValues)[number];
export type MilestoneDomain = (typeof milestoneDomainEnum.enumValues)[number];

// ── clinics ──────────────────────────────────────────────────────────────
// Defined in the original but never included in the `schema` object,
// which would make `defineRelations(schema, …)` unable to resolve it.
export const clinics = pgTable("clinics", {
	id: uuid("id").primaryKey().defaultRandom(),
	name: text("name").notNull(),
	address: text("address"),
	phone: text("phone"),
	email: text("email"),
	...timestamps
});

// ── patients ─────────────────────────────────────────────────────────────
export const patients = pgTable(
	"patients",
	{
		id: uuid("id").primaryKey().defaultRandom(),

		// Optional clinic scope. Single-clinic deployments leave this null;
		// multi-tenant deployments set it and switch the MRN uniqueness
		// constraint to (clinicId, medicalRecordNumber) — see index below.
		clinicId: uuid("clinic_id").references(() => clinics.id, {
			onDelete: "set null"
		}),

		// The clinician who owns this record. `user.id` is `uuid` (Better Auth).
		ownerId: uuid("owner_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),

		name: text("name").notNull(),
		gender: genderEnum("gender").notNull(),
		dob: text("dob").notNull(), // YYYY-MM-DD; see index note below
		medicalRecordNumber: varchar("medical_record_number", {
			length: 64
		}).notNull(),
		notes: text("notes"),

		guardianName: text("guardian_name"),
		guardianPhone: varchar("guardian_phone", { length: 32 }),
		allergies: text("allergies"),

		version: integer("version").notNull().default(1),
		deletedAt: timestamp("deleted_at", { withTimezone: true }),

		createdBy: uuid("created_by").references(() => user.id, {
			onDelete: "set null"
		}),
		updatedBy: uuid("updated_by").references(() => user.id, {
			onDelete: "set null"
		}),

		...timestamps
	},
	t => [
		// Single-clinic: MRN unique globally. For multi-clinic, replace with
		// uniqueIndex('patients_clinic_mrn_unq').on(t.clinicId, t.medicalRecordNumber)
		// and drop the global unique.
		uniqueIndex("patients_mrn_unq").on(t.medicalRecordNumber),
		index("patients_owner_idx").on(t.ownerId),
		index("patients_clinic_idx").on(t.clinicId),
		index("patients_name_idx").on(t.name),
		// `dob` is text, but YYYY-MM-DD sorts lexicographically identically to
		// chronologically, so a btree index supports range queries.
		index("patients_dob_idx").on(t.dob),
		index("patients_active_idx")
			.on(t.ownerId, t.createdAt)
			.where(sql`${t.deletedAt} IS NULL`)
	]
);

// ── appointments ─────────────────────────────────────────────────────────
export const appointments = pgTable(
	"appointments",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		patientId: uuid("patient_id")
			.notNull()
			.references(() => patients.id, { onDelete: "cascade" }),
		clinicId: uuid("clinic_id")
			.notNull()
			.references(() => clinics.id, { onDelete: "cascade" }),
		doctorId: uuid("doctor_id").references(() => user.id, {
			onDelete: "set null"
		}),
		scheduledAt: timestamp("scheduled_at", {
			withTimezone: true,
			mode: "date"
		}).notNull(),
		durationMinutes: integer("duration_minutes").notNull().default(15),
		status: appointmentStatusEnum("status").notNull().default("scheduled"),
		reason: text("reason"),
		notes: text("notes"),
		...timestamps
	},
	t => [
		index("appointments_patient_idx").on(t.patientId, t.scheduledAt),
		index("appointments_clinic_idx").on(t.clinicId, t.scheduledAt),
		index("appointments_doctor_idx").on(t.doctorId, t.scheduledAt),
		index("appointments_status_idx").on(t.status)
	]
);

// ── visits ───────────────────────────────────────────────────────────────
export const visits = pgTable(
	"visits",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		patientId: uuid("patient_id")
			.notNull()
			.references(() => patients.id, { onDelete: "cascade" }),
		clinicId: uuid("clinic_id")
			.notNull()
			.references(() => clinics.id, { onDelete: "cascade" }),
		appointmentId: uuid("appointment_id").references(() => appointments.id, {
			onDelete: "set null"
		}),
		doctorId: uuid("doctor_id").references(() => user.id, {
			onDelete: "set null"
		}),
		visitedAt: timestamp("visited_at", {
			withTimezone: true,
			mode: "date"
		}).notNull(),
		ageMonths: real("age_months").notNull(),
		ageYears: integer("age_years"),
		ageMonthsRemainder: integer("age_months_remainder"),
		...timestamps
	},
	t => [
		index("visits_patient_idx").on(t.patientId, t.visitedAt),
		index("visits_clinic_idx").on(t.clinicId, t.visitedAt),
		index("visits_doctor_idx").on(t.doctorId, t.visitedAt)
	]
);

// ── measurements ─────────────────────────────────────────────────────────
export const measurements = pgTable(
	"measurements",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		patientId: uuid("patient_id")
			.notNull()
			.references(() => patients.id, { onDelete: "cascade" }),

		date: text("date").notNull(), // YYYY-MM-DD
		ageMonths: real("age_months").notNull(),

		weight: real("weight"), // kg
		height: real("height"), // cm
		headCircumference: real("head_circumference"), // cm
		bmi: real("bmi"),

		weightForAgeZ: real("weight_for_age_z"),
		lengthForAgeZ: real("length_for_age_z"),
		bmiForAgeZ: real("bmi_for_age_z"),
		weightForLengthZ: real("weight_for_length_z"),
		classification: text("classification"),

		notes: text("notes"),

		createdBy: uuid("created_by").references(() => user.id, {
			onDelete: "set null"
		}),

		...timestamps
	},
	t => [
		index("measurements_patient_date_idx").on(t.patientId, t.date),
		uniqueIndex("measurements_patient_date_unq").on(t.patientId, t.date)
	]
);

// ── vaccine catalogue ────────────────────────────────────────────────────
export const vaccineCatalog = pgTable("vaccine_catalog", {
	id: varchar("id", { length: 64 }).primaryKey(), // 'birth-bcg'
	label: text("label").notNull(),
	arabicLabel: text("arabic_label"),
	disease: text("disease").notNull(),
	recommendedAgeMonths: integer("recommended_age_months").notNull(),
	recommendedAgeLabel: text("recommended_age_label").notNull(),
	schedule: varchar("schedule", { length: 32 }).notNull().default("egypt-moh"),
	isMandatoryMoh: boolean("is_mandatory_moh").notNull().default(true),
	notes: text("notes")
});

// ── vaccinations ─────────────────────────────────────────────────────────
export const vaccinations = pgTable(
	"vaccinations",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		patientId: uuid("patient_id")
			.notNull()
			.references(() => patients.id, { onDelete: "cascade" }),
		vaccineId: varchar("vaccine_id", { length: 64 })
			.notNull()
			.references(() => vaccineCatalog.id, { onDelete: "restrict" }),

		status: vaccinationStatusEnum("status").notNull().default("due"),
		// `administeredDate` is text to match the patient-facing display format
		// ("2024-04-16"). `dueDate` is `date` because overdue queries compare it
		// against `current_date` in SQL. The asymmetry is intentional.
		administeredDate: text("administered_date"),
		dueDate: date("due_date"),

		batchNumber: text("batch_number"),
		administeredBy: text("administered_by"),
		facility: text("facility"),
		adverseReactions: text("adverse_reactions"),
		notes: text("notes"),

		createdBy: uuid("created_by").references(() => user.id, {
			onDelete: "set null"
		}),
		updatedBy: uuid("updated_by").references(() => user.id, {
			onDelete: "set null"
		}),

		...timestamps
	},
	t => [
		index("vaccinations_patient_idx").on(t.patientId),
		index("vaccinations_status_idx").on(t.status),
		index("vaccinations_due_idx").on(t.dueDate, t.status),
		uniqueIndex("vaccinations_patient_vaccine_unq").on(t.patientId, t.vaccineId)
	]
);

// ── milestone catalogue ──────────────────────────────────────────────────
export const milestoneCatalog = pgTable("milestone_catalog", {
	id: varchar("id", { length: 64 }).primaryKey(), // 'm-2m-smile'
	label: text("label").notNull(),
	arabicLabel: text("arabic_label"),
	domain: milestoneDomainEnum("domain").notNull(),
	expectedAgeMonths: integer("expected_age_months").notNull(),
	ageLabel: text("age_label").notNull(),
	redFlagWarning: text("red_flag_warning"),
	notes: text("notes")
});

// ── milestones ───────────────────────────────────────────────────────────
export const milestones = pgTable(
	"milestones",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		patientId: uuid("patient_id")
			.notNull()
			.references(() => patients.id, { onDelete: "cascade" }),
		milestoneId: varchar("milestone_id", { length: 64 })
			.notNull()
			.references(() => milestoneCatalog.id, { onDelete: "restrict" }),

		isAchieved: boolean("is_achieved").notNull().default(false),
		achievedDate: text("achieved_date"),
		notes: text("notes"),

		createdBy: uuid("created_by").references(() => user.id, {
			onDelete: "set null"
		}),
		updatedBy: uuid("updated_by").references(() => user.id, {
			onDelete: "set null"
		}),

		...timestamps
	},
	t => [
		index("milestones_patient_idx").on(t.patientId),
		uniqueIndex("milestones_patient_milestone_unq").on(
			t.patientId,
			t.milestoneId
		)
	]
);

// ── prescriptions ────────────────────────────────────────────────────────
export const prescriptions = pgTable(
	"prescriptions",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		patientId: uuid("patient_id")
			.notNull()
			.references(() => patients.id, { onDelete: "cascade" }),

		prescriptionDate: text("prescription_date").notNull(),
		status: prescriptionStatusEnum("status").notNull().default("active"),

		medications: jsonb("medications").$type<PrescriptionMedication[]>(),
		instructions: text("instructions"),

		prescribedBy: uuid("prescribed_by").references(() => user.id, {
			onDelete: "set null"
		}),
		notes: text("notes"),

		createdBy: uuid("created_by").references(() => user.id, {
			onDelete: "set null"
		}),
		updatedBy: uuid("updated_by").references(() => user.id, {
			onDelete: "set null"
		}),

		...timestamps
	},
	t => [
		index("prescriptions_patient_idx").on(t.patientId),
		index("prescriptions_date_idx").on(t.prescriptionDate)
	]
);

// ── certificates ─────────────────────────────────────────────────────────
export const certificates = pgTable(
	"certificates",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		patientId: uuid("patient_id")
			.notNull()
			.references(() => patients.id, { onDelete: "cascade" }),

		issueDate: text("issue_date").notNull(),
		certificateType: varchar("certificate_type", { length: 64 }).notNull(),
		title: text("title").notNull(),
		body: text("body").notNull(),
		issuedBy: text("issued_by"),
		notes: text("notes"),

		createdBy: uuid("created_by").references(() => user.id, {
			onDelete: "set null"
		}),
		// Added: every other mutable table has `updatedAt`. Certificates can be
		// corrected (typo, reissue) and the audit trail should reflect it.
		updatedBy: uuid("updated_by").references(() => user.id, {
			onDelete: "set null"
		}),

		...timestamps
	},
	t => [
		index("certificates_patient_idx").on(t.patientId),
		index("certificates_date_idx").on(t.issueDate)
	]
);

// ── audit log ────────────────────────────────────────────────────────────
// `ownerId` is nullable + `set null` because audit rows may be written
// before a session is fully established (e.g. failed login attempts). The
// row survives a user deletion, which is what audit logs are for.
export const auditLog = pgTable(
	"audit_log",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		ownerId: uuid("owner_id").references(() => user.id, {
			onDelete: "set null"
		}),
		action: text("action").notNull(), // 'backup.export' | 'patient.delete' | ...
		entityType: text("entity_type"),
		entityId: text("entity_id"),
		payload: jsonb("payload").$type<Record<string, unknown>>(),
		createdAt: timestamp("created_at", { withTimezone: true })
			.notNull()
			.defaultNow()
	},
	t => [
		index("audit_log_owner_idx").on(t.ownerId),
		index("audit_log_created_idx").on(t.createdAt),
		index("audit_log_action_idx").on(t.action)
	]
);
// db/schemas/clinic-schema.ts
export const lmsReference = pgTable(
	"lms_reference",
	{
		id: varchar("id", { length: 96 }).primaryKey(), // e.g. "boy:wfa:0"
		gender: genderEnum("gender").notNull(),
		metric: varchar("metric", { length: 16 }).notNull(), // 'wfa' | 'lhfa' | 'wfl' | 'bmifa'
		x: real("x").notNull(),
		l: real("l").notNull(),
		m: real("m").notNull(),
		s: real("s").notNull(),
		sUnit: varchar("s_unit", { length: 4 }).notNull().default("cv"), // 'sd' | 'cv'
		// Pre-computed SD values already exist in the source data; keep them
		// so the chart doesn't have to derive sd3neg etc. from L/M/S at render time.
		sd3neg: real("sd3neg"),
		sd2neg: real("sd2neg"),
		sd1neg: real("sd1neg"),
		sd0: real("sd0"),
		sd1pos: real("sd1pos"),
		sd2pos: real("sd2pos"),
		sd3pos: real("sd3pos")
	},
	t => [index("lms_ref_lookup_idx").on(t.gender, t.metric, t.x)]
);
export const drugFormulary = pgTable(
	"drug_formulary",
	{
		id: varchar("id", { length: 64 }).primaryKey(), // matches DrugMonograph.id
		genericName: text("generic_name").notNull(),
		pharmacologicalCategory: text("pharmacological_category").notNull(),
		atcCode: varchar("atc_code", { length: 16 }),
		awareClassification: varchar("aware_classification", { length: 16 }),
		// Full monograph: brandNamesEgypt, presentations, dosing, warnings,
		// interactions, monitoring — everything the UI needs.
		data: jsonb("data").$type<DrugMonograph>().notNull(),
		// Snapshot of which source PDFs this came from, for provenance.
		sourceEdition: varchar("source_edition", { length: 32 })
			.notNull()
			.default("EDA-2024"),
		...timestamps
	},
	t => [
		index("drug_formulary_generic_idx").on(t.genericName),
		index("drug_formulary_category_idx").on(t.pharmacologicalCategory)
	]
);
export type DrugFormularyRow = typeof drugFormulary.$inferSelect;
export type NewDrugFormularyRow = typeof drugFormulary.$inferInsert;

export const neonatalFormulary = pgTable(
	"neonatal_formulary",
	{
		id: varchar("id", { length: 64 }).primaryKey(),
		name: text("name").notNull(),
		genericName: text("generic_name").notNull(),
		category: text("category").notNull(),
		data: jsonb("data").$type<DrugFormularyItem>().notNull(),
		...timestamps
	},
	t => [
		index("neonatal_formulary_category_idx").on(t.category),
		index("neonatal_formulary_generic_idx").on(t.genericName)
	]
);

export type NeonatalFormularyRow = typeof neonatalFormulary.$inferSelect;
export type NewNeonatalFormularyRow = typeof neonatalFormulary.$inferInsert;
// ── Shared JSON types ────────────────────────────────────────────────────
export interface PrescriptionMedication {
	drugId: string;
	name: string;
	dose: string;
	frequency: string;
	duration: string;
	route: "IV" | "IM" | "Oral" | "Inhalation" | "PR";
	instructions?: string;
}

// ── Inferred types ───────────────────────────────────────────────────────
export type Patient = typeof patients.$inferSelect;
export type NewPatient = typeof patients.$inferInsert;

export type Clinic = typeof clinics.$inferSelect;
export type NewClinic = typeof clinics.$inferInsert;

export type Appointment = typeof appointments.$inferSelect;
export type NewAppointment = typeof appointments.$inferInsert;

export type Visit = typeof visits.$inferSelect;
export type NewVisit = typeof visits.$inferInsert;

export type Measurement = typeof measurements.$inferSelect;
export type NewMeasurement = typeof measurements.$inferInsert;

export type Vaccination = typeof vaccinations.$inferSelect;
export type NewVaccination = typeof vaccinations.$inferInsert;

export type VaccineCatalogItem = typeof vaccineCatalog.$inferSelect;
export type NewVaccineCatalogItem = typeof vaccineCatalog.$inferInsert;

export type Milestone = typeof milestones.$inferSelect;
export type NewMilestone = typeof milestones.$inferInsert;

export type MilestoneCatalogItem = typeof milestoneCatalog.$inferSelect;
export type NewMilestoneCatalogItem = typeof milestoneCatalog.$inferInsert;

export type Prescription = typeof prescriptions.$inferSelect;
export type NewPrescription = typeof prescriptions.$inferInsert;

export type Certificate = typeof certificates.$inferSelect;
export type NewCertificate = typeof certificates.$inferInsert;

export type AuditLogEntry = typeof auditLog.$inferSelect;
export type NewAuditLogEntry = typeof auditLog.$inferInsert;
