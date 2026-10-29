import { createAccessControl } from "better-auth/plugins/access";
import {
	adminAc,
	defaultStatements,
	userAc
} from "better-auth/plugins/admin/access";

import { ROLES_MAP } from "../role";

// Packages/auth/src/permissions.ts (adjust path to match your repo)

// ============================================================
// Statements
// ============================================================
//
// `defaultStatements` from Better Auth gives us the admin-plugin resources:
//   User, session, impersonate
//
// We add the clinic-domain resources on top. Every resource is a list of
// Actions; `ac.newRole(...)` below grants a subset per role.
//
// Keep this object in sync with `ROLES_MAP` — adding a new role there
// Without adding it to `roles` below will let `ac.newRole` silently accept
// Any statement, which is exactly the failure mode access control is
// Supposed to prevent.

export const statements = {
	...defaultStatements,

	// ----------------------------------------------------------
	// Admissions & beds
	// ----------------------------------------------------------
	admission: [
		"create",
		"read",
		"update",
		"delete",
		"discharge",
		"transfer"
	] as const,

	appointment: [
		"create",
		"read",
		"update",
		"delete",
		"cancel",
		"check-in",
		"reschedule"
	] as const,

	// ----------------------------------------------------------
	// Auditing & reporting
	// ----------------------------------------------------------
	auditLog: ["read", "export"] as const,

	bed: ["create", "read", "update", "delete", "allocate", "release"] as const,

	chargeCatalog: ["create", "read", "update", "delete"] as const,

	clinicalNote: ["create", "read", "update", "delete"] as const,

	clinicSettings: ["read", "update"] as const,

	dashboard: ["read"] as const,

	department: ["create", "read", "update", "delete"] as const,

	diagnosis: ["create", "read", "update", "delete"] as const,

	doctor: ["create", "read", "update", "delete"] as const,

	document: ["create", "read", "update", "delete"] as const,

	encounter: [
		"create",
		"read",
		"update",
		"delete",
		"complete",
		"cancel"
	] as const,

	expense: ["create", "read", "update", "delete"] as const,

	growth: ["create", "read", "update", "delete"] as const,

	guardian: ["create", "read", "update", "delete"] as const,

	immunization: [
		"create",
		"read",
		"update",
		"delete",
		"administer",
		"defer",
		"refuse"
	] as const,

	inventory: ["read", "adjust", "receive", "dispense"] as const,

	// ----------------------------------------------------------
	// Billing
	// ----------------------------------------------------------
	invoice: [
		"create",
		"read",
		"update",
		"delete",
		"issue",
		"void",
		"refund"
	] as const,

	// ----------------------------------------------------------
	// Labs
	// ----------------------------------------------------------
	labOrder: [
		"create",
		"read",
		"update",
		"delete",
		"collect",
		"result",
		"cancel"
	] as const,

	labTest: ["create", "read", "update", "delete"] as const,

	// ----------------------------------------------------------
	// Records & documents
	// ----------------------------------------------------------
	medicalRecord: ["create", "read", "update", "delete"] as const,

	medicine: ["create", "read", "update", "delete"] as const,

	// ----------------------------------------------------------
	// Clinical
	// ----------------------------------------------------------
	patient: [
		"create",
		"read",
		"update",
		"delete",
		"archive",
		"merge",
		"export"
	] as const,

	payment: ["create", "read", "update", "delete", "refund"] as const,

	// ----------------------------------------------------------
	// Prescriptions & pharmacy
	// ----------------------------------------------------------
	prescription: [
		"create",
		"read",
		"update",
		"delete",
		"fill",
		"discontinue",
		"renew"
	] as const,

	report: ["read", "export"] as const,

	schedule: ["create", "read", "update", "delete"] as const,

	// ----------------------------------------------------------
	// Staff & org
	// ----------------------------------------------------------
	staff: ["create", "read", "update", "delete", "deactivate"] as const,

	vital: ["create", "read", "update", "delete"] as const
} as const;

export const ac = createAccessControl(statements);

// ============================================================
// Roles
// ============================================================
//
// Principle of least privilege:
//   - admin   → everything
//   - doctor  → full clinical + prescribing + labs, read-only billing
//   - staff   → front-desk / nursing: scheduling, vitals, immunization
//               Administration, dispensing, billing, no clinical edits
//   - patient → own records only (row-level scoping is enforced in the API
//               Layer; this map only grants the *actions*)

export const roles = {
	// ----------------------------------------------------------
	// Admin — full control
	// ----------------------------------------------------------
	[ROLES_MAP.ADMIN]: ac.newRole({
		...adminAc.statements,

		admission: ["create", "read", "update", "delete", "discharge", "transfer"],

		appointment: [
			"create",
			"read",
			"update",
			"delete",
			"cancel",
			"check-in",
			"reschedule"
		],

		auditLog: ["read", "export"],

		bed: ["create", "read", "update", "delete", "allocate", "release"],

		chargeCatalog: ["create", "read", "update", "delete"],

		clinicSettings: ["read", "update"],

		clinicalNote: ["create", "read", "update", "delete"],

		dashboard: ["read"],

		department: ["create", "read", "update", "delete"],

		diagnosis: ["create", "read", "update", "delete"],

		doctor: ["create", "read", "update", "delete"],

		document: ["create", "read", "update", "delete"],

		encounter: ["create", "read", "update", "delete", "complete", "cancel"],

		expense: ["create", "read", "update", "delete"],

		growth: ["create", "read", "update", "delete"],

		guardian: ["create", "read", "update", "delete"],

		immunization: [
			"create",
			"read",
			"update",
			"delete",
			"administer",
			"defer",
			"refuse"
		],

		inventory: ["read", "adjust", "receive", "dispense"],

		invoice: ["create", "read", "update", "delete", "issue", "void", "refund"],

		labOrder: [
			"create",
			"read",
			"update",
			"delete",
			"collect",
			"result",
			"cancel"
		],

		labTest: ["create", "read", "update", "delete"],

		medicalRecord: ["create", "read", "update", "delete"],

		medicine: ["create", "read", "update", "delete"],

		patient: [
			"create",
			"read",
			"update",
			"delete",
			"archive",
			"merge",
			"export"
		],

		payment: ["create", "read", "update", "delete", "refund"],

		prescription: [
			"create",
			"read",
			"update",
			"delete",
			"fill",
			"discontinue",
			"renew"
		],

		report: ["read", "export"],

		schedule: ["create", "read", "update", "delete"],

		staff: ["create", "read", "update", "delete", "deactivate"],

		vital: ["create", "read", "update", "delete"]
	}),

	// ----------------------------------------------------------
	// Doctor — full clinical, read-only billing
	// ----------------------------------------------------------
	[ROLES_MAP.DOCTOR]: ac.newRole({
		...userAc.statements,

		admission: ["create", "read", "update", "discharge", "transfer"],

		appointment: [
			"create",
			"read",
			"update",
			"cancel",
			"check-in",
			"reschedule"
		],

		bed: ["read", "allocate", "release"],

		chargeCatalog: ["read"],

		clinicSettings: ["read"],

		clinicalNote: ["create", "read", "update"],

		dashboard: ["read"],

		department: ["read"],

		diagnosis: ["create", "read", "update", "delete"],

		doctor: ["read"],

		document: ["create", "read", "update"],

		encounter: ["create", "read", "update", "complete", "cancel"],

		growth: ["create", "read", "update"],

		guardian: ["create", "read", "update"],

		immunization: ["create", "read", "update", "administer", "defer", "refuse"],

		inventory: ["read"],

		invoice: ["read"],

		labOrder: ["create", "read", "update", "collect", "result", "cancel"],

		labTest: ["read"],

		medicalRecord: ["create", "read", "update"],

		medicine: ["read"],

		patient: ["create", "read", "update", "archive", "export"],

		payment: ["read"],

		prescription: ["create", "read", "update", "fill", "discontinue", "renew"],

		report: ["read", "export"],

		schedule: ["read", "update"],

		staff: ["read"],

		vital: ["create", "read", "update"]
	}),

	// ----------------------------------------------------------
	// Staff — front desk / nursing: scheduling, vitals, dispensing,
	// Billing. No clinical notes, no prescribing, no diagnoses.
	// ----------------------------------------------------------
	[ROLES_MAP.STAFF]: ac.newRole({
		...userAc.statements,

		admission: ["read", "create"],

		appointment: [
			"create",
			"read",
			"update",
			"cancel",
			"check-in",
			"reschedule"
		],
		bed: ["read", "allocate", "release"],
		chargeCatalog: ["read"],
		clinicSettings: ["read"],

		dashboard: ["read"],
		department: ["read"],
		doctor: ["read"],
		document: ["create", "read"],
		encounter: ["read", "create"],
		growth: ["create", "read", "update"],
		guardian: ["create", "read", "update"],
		immunization: ["read", "create", "administer", "defer", "refuse"],
		inventory: ["read", "adjust", "receive", "dispense"],

		invoice: ["create", "read", "update", "issue"],

		labOrder: ["read", "create", "collect"],
		labTest: ["read"],

		medicalRecord: ["create", "read"],
		medicine: ["read"],

		patient: ["create", "read", "update"],
		payment: ["create", "read"],

		prescription: ["read", "fill"],
		schedule: ["read"],

		staff: ["read"],
		vital: ["create", "read", "update"]
	}),

	// ----------------------------------------------------------
	// Patient — read-only access to their own data. Row-level scoping
	// (e.g. "this patient may only read rows where patientId = self")
	// Is enforced in the API layer; this map grants only the actions.
	// ----------------------------------------------------------
	[ROLES_MAP.PATIENT]: ac.newRole({
		...userAc.statements,

		admission: ["read"],

		appointment: ["read", "cancel", "reschedule"],
		bed: ["read"],
		clinicSettings: ["read"],

		dashboard: ["read"],
		department: ["read"],
		diagnosis: ["read"],

		doctor: ["read"],
		document: ["read"],
		encounter: ["read"],
		growth: ["read"],
		guardian: ["read"],
		immunization: ["read"],

		invoice: ["read"],

		labOrder: ["read"],
		labTest: ["read"],

		medicalRecord: ["read"],
		medicine: ["read"],

		patient: ["read"],
		payment: ["read"],

		prescription: ["read"],
		schedule: ["read"],
		vital: ["read"]
	})
};
