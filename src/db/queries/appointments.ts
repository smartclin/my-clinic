// src/db/queries/appointments.ts
//
// Query layer for the `appointments` table. All functions are typed against
// the inferred `Appointment` shape and scoped to a clinic where the query
// could otherwise leak across tenants.
//
// Conventions
// -----------
// - `findMany` results are ordered by `scheduledAt` in the direction the
//   caller expects (today/upcoming: asc; history: desc).
// - `with: { patient: … }` always projects the minimum fields the UI needs.
//   `patients` has a single `name` column in this schema — the previous
//   version selected `firstName`/`lastName`, which don't exist on the table.
// - Status transitions (`markCompleted`, `markNoShow`, …) are separate
//   functions so the caller cannot accidentally set an arbitrary status.

import { and, count, eq, gte, lt } from "drizzle-orm";

import { db } from "#/db";
import { type AppointmentStatus, appointments } from "#/db/schema";

// ── Shared projections ──────────────────────────────────────────────────
// Centralized so the table component and the print view can't drift.

const PATIENT_SUMMARY_COLUMNS = {
	id: true,
	name: true,
	gender: true,
	dob: true,
	medicalRecordNumber: true
} as const;

const DOCTOR_SUMMARY_COLUMNS = {
	id: true,
	name: true,
	email: true,
	role: true
} as const;

// ── Read ────────────────────────────────────────────────────────────────

/**
 * All appointments for a patient, newest first.
 * `status` is optional: omit it to get the patient's full history.
 */
export async function listAppointmentsByPatient(
	patientId: string,
	options: { status?: AppointmentStatus; limit?: number } = {}
) {
	const where = options.status
		? { patientId, status: options.status }
		: { patientId };

	return db.query.appointments.findMany({
		where,
		with: { patient: { columns: PATIENT_SUMMARY_COLUMNS } },
		orderBy: { scheduledAt: "desc" },
		...(options.limit ? { limit: options.limit } : {})
	});
}

/**
 * A doctor's appointments within a date range. Scoped to `clinicId` so a
 * doctor who is a member of two clinics cannot see the other clinic's
 * appointments.
 */
export async function listAppointmentsByDoctor(
	doctorId: string,
	clinicId: string,
	range: { from: Date; to: Date }
) {
	return db.query.appointments.findMany({
		where: {
			doctorId,
			clinicId,
			scheduledAt: { gte: range.from, lt: range.to }
		},
		with: { patient: { columns: PATIENT_SUMMARY_COLUMNS } },
		orderBy: { scheduledAt: "asc" }
	});
}

/**
 * A clinic's appointments within a date range. This is the calendar view's
 * primary read — no patient join because the calendar only shows slots.
 */
export async function listAppointmentsByClinic(
	clinicId: string,
	range: { from: Date; to: Date }
) {
	return db.query.appointments.findMany({
		where: {
			clinicId,
			scheduledAt: { gte: range.from, lt: range.to }
		},
		with: {
			patient: { columns: PATIENT_SUMMARY_COLUMNS },
			doctor: { columns: DOCTOR_SUMMARY_COLUMNS }
		},
		orderBy: { scheduledAt: "asc" }
	});
}

export async function findAppointmentById(id: string) {
	return db.query.appointments.findFirst({
		where: { id },
		with: {
			patient: true,
			clinic: true,
			doctor: { columns: DOCTOR_SUMMARY_COLUMNS },
			visits: true
		}
	});
}

/**
 * The next N scheduled appointments for a doctor at a given clinic.
 */
export async function listUpcomingAppointments(
	doctorId: string,
	clinicId: string,
	limit = 10
) {
	return db.query.appointments.findMany({
		where: {
			doctorId,
			clinicId,
			status: "scheduled",
			scheduledAt: { gte: new Date() }
		},
		with: { patient: { columns: PATIENT_SUMMARY_COLUMNS } },
		orderBy: { scheduledAt: "asc" },
		limit
	});
}

export async function listNoShowAppointments(clinicId: string) {
	return db.query.appointments.findMany({
		where: { clinicId, status: "no-show" },
		with: { patient: { columns: PATIENT_SUMMARY_COLUMNS } },
		orderBy: { scheduledAt: "desc" }
	});
}

// ── Today ───────────────────────────────────────────────────────────────
//
// The "today" boundary is timezone-sensitive. The server's local time is
// NOT the clinic's local time in general. This helper computes `[start,
// end)` in the server's local zone — which is correct for a single-clinic
// deployment (Egypt, Africa/Cairo) and wrong for a multi-timezone clinic
// network. If you later add a `clinics.timezone` column, pass it through
// `Intl.DateTimeFormat` to get the boundary in the clinic's zone instead.

function startOfLocalDay(d = new Date()): Date {
	const start = new Date(d);
	start.setHours(0, 0, 0, 0);
	return start;
}

function startOfNextLocalDay(d = new Date()): Date {
	const end = startOfLocalDay(d);
	end.setDate(end.getDate() + 1);
	return end;
}

/**
 * Every appointment scheduled today for a clinic, ordered by time.
 * This is the front-desk screen — it must see ALL of today's appointments,
 * not just the current doctor's, so there is no `doctorId` filter.
 */
export async function listTodayAppointmentsForClinic(clinicId: string) {
	const [start, end] = [startOfLocalDay(), startOfNextLocalDay()];

	return db.query.appointments.findMany({
		where: {
			clinicId,
			scheduledAt: { gte: start, lt: end }
		},
		with: {
			patient: { columns: PATIENT_SUMMARY_COLUMNS },
			doctor: { columns: DOCTOR_SUMMARY_COLUMNS }
		},
		orderBy: { scheduledAt: "asc" }
	});
}

/**
 * Today's appointments for one doctor at one clinic. The "my schedule"
 * view, distinct from the front-desk "all of today" view above.
 */
export async function listTodayAppointmentsForDoctor(
	doctorId: string,
	clinicId: string
) {
	const [start, end] = [startOfLocalDay(), startOfNextLocalDay()];

	return db.query.appointments.findMany({
		where: {
			doctorId,
			clinicId,
			scheduledAt: { gte: start, lt: end }
		},
		with: { patient: { columns: PATIENT_SUMMARY_COLUMNS } },
		orderBy: { scheduledAt: "asc" }
	});
}

/**
 * Count of appointments today for a clinic, broken down by status.
 * Used by the dashboard's "Today" stat card.
 */
export async function countTodayAppointmentsByStatus(clinicId: string) {
	const [start, end] = [startOfLocalDay(), startOfNextLocalDay()];

	const rows = await db
		.select({
			status: appointments.status,
			count: count()
		})
		.from(appointments)
		.where(
			and(
				eq(appointments.clinicId, clinicId),
				gte(appointments.scheduledAt, start),
				lt(appointments.scheduledAt, end)
			)
		)
		.groupBy(appointments.status);

	// Return a complete map so callers don't need `?? 0` on every render.
	const result: Record<AppointmentStatus, number> = {
		scheduled: 0,
		completed: 0,
		cancelled: 0,
		"no-show": 0
	};
	for (const row of rows) {
		result[row.status] = Number(row.count);
	}
	return result;
}

// ── Aggregates ──────────────────────────────────────────────────────────

/**
 * Counts by status for a doctor within a range. Scoped to `clinicId`
 * because the previous version aggregated across all of a doctor's
 * clinics, which is almost never the intended number.
 */
export async function countAppointmentsByStatus(
	doctorId: string,
	clinicId: string,
	range: { from: Date; to: Date }
) {
	const rows = await db
		.select({
			status: appointments.status,
			count: count()
		})
		.from(appointments)
		.where(
			and(
				eq(appointments.doctorId, doctorId),
				eq(appointments.clinicId, clinicId),
				gte(appointments.scheduledAt, range.from),
				lt(appointments.scheduledAt, range.to)
			)
		)
		.groupBy(appointments.status);

	const result: Record<AppointmentStatus, number> = {
		scheduled: 0,
		completed: 0,
		cancelled: 0,
		"no-show": 0
	};
	for (const row of rows) {
		result[row.status] = Number(row.count);
	}
	return result;
}

/**
 * Total appointment count for a patient. Used by the patient summary card.
 * Excludes soft-deleted patients only implicitly — appointments are not
 * soft-deleted, so every row counts.
 */
export async function countAppointmentsForPatient(patientId: string) {
	const [row] = await db
		.select({ total: count() })
		.from(appointments)
		.where(eq(appointments.patientId, patientId));
	return Number(row?.total ?? 0);
}

// ── Create ──────────────────────────────────────────────────────────────

export async function createAppointment(
	data: typeof appointments.$inferInsert
) {
	const [row] = await db.insert(appointments).values(data).returning();
	return row;
}

export async function createManyAppointments(
	data: (typeof appointments.$inferInsert)[]
) {
	if (data.length === 0) return [];
	return db.insert(appointments).values(data).returning();
}

// ── Update ──────────────────────────────────────────────────────────────

export async function updateAppointment(
	id: string,
	data: Partial<typeof appointments.$inferInsert>
) {
	const [row] = await db
		.update(appointments)
		.set(data)
		.where(eq(appointments.id, id))
		.returning();
	return row;
}

export async function markAppointmentCompleted(id: string) {
	return updateAppointment(id, { status: "completed" });
}

export async function markAppointmentCancelled(id: string) {
	return updateAppointment(id, { status: "cancelled" });
}

export async function markAppointmentNoShow(id: string) {
	return updateAppointment(id, { status: "no-show" });
}

/**
 * Reschedules an appointment. Resets status to `scheduled` — a moved
 * appointment is by definition back in the queue. Preserves `notes` and
 * `reason` because the clinical context doesn't change with the time.
 */
export async function rescheduleAppointment(id: string, newTime: Date) {
	return updateAppointment(id, {
		scheduledAt: newTime,
		status: "scheduled"
	});
}

// ── Delete ──────────────────────────────────────────────────────────────

export async function deleteAppointment(id: string) {
	await db.delete(appointments).where(eq(appointments.id, id));
}
