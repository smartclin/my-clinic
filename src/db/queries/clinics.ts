// src/db/queries/clinics.ts

import { eq } from "drizzle-orm";

import { db } from "#/db";
import { clinics } from "#/db/schema";

// ── Read ────────────────────────────────────────────────────────────────
export async function listClinics() {
	return db.query.clinics.findMany({ orderBy: { name: "asc" } });
}

export async function findClinicById(id: string) {
	return db.query.clinics.findFirst({ where: { id } });
}

export async function searchClinics(query: string) {
	return db.query.clinics.findMany({
		where: {
			OR: [
				{ name: { ilike: `%${query}%` } },
				{ email: { ilike: `%${query}%` } },
				{ phone: { ilike: `%${query}%` } }
			]
		},
		orderBy: { name: "asc" }
	});
}

/** Clinic with its patient roster, upcoming appointments, and recent visits. */
export async function getClinicWithDetails(id: string) {
	return db.query.clinics.findFirst({
		where: { id },
		with: {
			patients: {
				where: { deletedAt: { isNull: true } },
				orderBy: { name: "asc" }
			},
			appointments: {
				orderBy: { scheduledAt: "desc" },
				limit: 20
			},
			visits: {
				orderBy: { visitedAt: "desc" },
				limit: 20
			}
		}
	});
}

/** Clinic with patient count only (relation aggregate). */
export async function getClinicPatientCounts() {
	return db.query.clinics.findMany({
		with: {
			patients: { columns: { id: true } }
		}
	});
	// → [{ id, name, ..., patients: [{ id }, ...] }]
}

// ── Write ───────────────────────────────────────────────────────────────

export async function createClinic(data: typeof clinics.$inferInsert) {
	const [clinic] = await db.insert(clinics).values(data).returning();
	return clinic;
}

export async function createManyClinics(data: (typeof clinics.$inferInsert)[]) {
	return db.insert(clinics).values(data).returning();
}

export async function updateClinic(
	id: string,
	data: Partial<typeof clinics.$inferInsert>
) {
	const [updated] = await db
		.update(clinics)
		.set(data) // $onUpdate handles updatedAt
		.where(eq(clinics.id, id))
		.returning();
	return updated;
}

export async function deleteClinic(id: string) {
	await db.delete(clinics).where(eq(clinics.id, id));
}
