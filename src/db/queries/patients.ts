// src/db/queries/patients.ts
import { and, eq, sql } from "drizzle-orm";

import { db } from "#/db";
import { patients } from "#/db/schema";

// ── Read ────────────────────────────────────────────────────────────────
// db/queries/patients.ts

export class VersionConflictError extends Error {
	constructor(
		public readonly patientId: string,
		public readonly expectedVersion: number,
		public readonly currentVersion: number
	) {
		super(
			`Patient ${patientId} is at version ${currentVersion}, expected ${expectedVersion}`
		);
		this.name = "VersionConflictError";
	}
}
export async function listPatientsByOwner(ownerId: string) {
	return db.query.patients.findMany({
		where: { ownerId, deletedAt: { isNull: true } },
		orderBy: { name: "asc" }
	});
}

export async function listPatientsByClinic(clinicId: string) {
	return db.query.patients.findMany({
		where: { clinicId, deletedAt: { isNull: true } },
		orderBy: { name: "asc" }
	});
}

export async function findPatientById(id: string) {
	return db.query.patients.findFirst({
		where: { id, deletedAt: { isNull: true } }
	});
}

export async function findPatientByMrn(mrn: string) {
	return db.query.patients.findFirst({
		where: { medicalRecordNumber: mrn, deletedAt: { isNull: true } }
	});
}

/** Full clinical record: patient + measurements + vaccinations + milestones. */
export async function getPatientFullRecord(id: string) {
	return db.query.patients.findFirst({
		where: { id, deletedAt: { isNull: true } },
		with: {
			measurements: { orderBy: { date: "asc" } },
			vaccinations: {
				orderBy: { vaccineId: "asc" },
				with: { vaccine: true }
			},
			milestones: {
				orderBy: { milestoneId: "asc" },
				with: { milestone: true }
			}
		}
	});
}

export async function searchPatientsByOwner(ownerId: string, query: string) {
	return db.query.patients.findMany({
		where: {
			ownerId,
			deletedAt: { isNull: true },
			OR: [
				{ name: { ilike: `%${query}%` } },
				{ medicalRecordNumber: { ilike: `%${query}%` } },
				{ guardianName: { ilike: `%${query}%` } }
			]
		},
		orderBy: { name: "asc" }
	});
}

export async function listPatientsByGender(
	ownerId: string,
	gender: "boy" | "girl"
) {
	return db.query.patients.findMany({
		where: { ownerId, gender, deletedAt: { isNull: true } },
		orderBy: { dob: "desc" }
	});
}

/** Patients whose latest measurement is below -2SD weight-for-age. */
export async function listStuntedPatients(ownerId: string) {
	return db.query.patients.findMany({
		where: {
			ownerId,
			deletedAt: { isNull: true },
			measurements: {
				weightForAgeZ: { lt: -2 }
			}
		},
		with: {
			measurements: { orderBy: { date: "desc" }, limit: 1 }
		}
	});
}

/** Patients with at least one overdue vaccination. */
export async function listPatientsWithOverdueVaccines(ownerId: string) {
	return db.query.patients.findMany({
		where: {
			ownerId,
			deletedAt: { isNull: true },
			vaccinations: {
				status: { in: ["due", "missed"] },
				dueDate: { lt: new Date().toISOString().slice(0, 10) }
			}
		},
		with: {
			vaccinations: {
				where: {
					status: { in: ["due", "missed"] },
					dueDate: { lt: new Date().toISOString().slice(0, 10) }
				},
				with: { vaccine: true }
			}
		}
	});
}

/** Paginated patient list with cursor on createdAt + id tiebreaker. */
export async function listPatientsPaginated(
	ownerId: string,
	opts: { limit: number; cursor?: { createdAt: Date; id: string } } = {
		limit: 20
	}
) {
	return db.query.patients.findMany({
		where: {
			ownerId,
			deletedAt: { isNull: true },
			...(opts.cursor
				? {
						OR: [
							{ createdAt: { lt: opts.cursor.createdAt } },
							{
								createdAt: { eq: opts.cursor.createdAt },
								id: { lt: opts.cursor.id }
							}
						]
					}
				: {})
		},
		orderBy: { createdAt: "desc", id: "desc" },
		limit: opts.limit
	});
}

// ── Create ──────────────────────────────────────────────────────────────

export async function createPatient(data: typeof patients.$inferInsert) {
	const [patient] = await db.insert(patients).values(data).returning();
	return patient;
}

export async function createManyPatients(
	data: (typeof patients.$inferInsert)[]
) {
	return db.insert(patients).values(data).returning();
}

// ── Update (with optimistic concurrency) ────────────────────────────────

export async function updatePatient(
	id: string,
	data: Partial<typeof patients.$inferInsert>
) {
	const [updated] = await db
		.update(patients)
		.set(data)
		.where(eq(patients.id, id))
		.returning();
	return updated;
}

export async function updatePatientWithVersion(
	id: string,
	expectedVersion: number,
	data: Partial<typeof patients.$inferInsert>
) {
	const [updated] = await db
		.update(patients)
		.set({ ...data, version: sql`${patients.version} + 1` })
		.where(and(eq(patients.id, id), eq(patients.version, expectedVersion)))
		.returning();

	if (!updated) throw new Error("PATIENT_VERSION_CONFLICT");
	return updated;
}

// ── Delete (soft then hard) ─────────────────────────────────────────────

export async function softDeletePatient(id: string) {
	const [updated] = await db
		.update(patients)
		.set({ deletedAt: new Date() })
		.where(eq(patients.id, id))
		.returning();
	return updated;
}

export async function restorePatient(id: string) {
	const [updated] = await db
		.update(patients)
		.set({ deletedAt: null })
		.where(eq(patients.id, id))
		.returning();
	return updated;
}

export async function hardDeletePatient(id: string) {
	await db.delete(patients).where(eq(patients.id, id));
}
