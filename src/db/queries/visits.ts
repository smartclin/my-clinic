// src/db/queries/visits.ts
import { eq } from "drizzle-orm";

import { db } from "#/db";
import { visits } from "#/db/schema";

// ── Read ────────────────────────────────────────────────────────────────

export async function listVisitsByPatient(patientId: string) {
	return db.query.visits.findMany({
		where: { patientId },
		with: {
			clinic: { columns: { id: true, name: true } },
			doctor: { columns: { id: true, name: true } }
		},
		orderBy: { visitedAt: "desc" }
	});
}

export async function listVisitsByClinic(
	clinicId: string,
	range: { from: Date; to: Date }
) {
	return db.query.visits.findMany({
		where: {
			clinicId,
			visitedAt: { gte: range.from, lte: range.to }
		},
		with: { patient: { columns: { id: true, name: true } } },
		orderBy: { visitedAt: "desc" }
	});
}

export async function listVisitsByDoctor(
	doctorId: string,
	range: { from: Date; to: Date }
) {
	return db.query.visits.findMany({
		where: {
			doctorId,
			visitedAt: { gte: range.from, lte: range.to }
		},
		orderBy: { visitedAt: "desc" }
	});
}

export async function findVisitById(id: string) {
	return db.query.visits.findFirst({
		where: { id },
		with: {
			patient: true,
			clinic: true,
			appointment: true
		}
	});
}

export async function findVisitByAppointment(appointmentId: string) {
	return db.query.visits.findFirst({
		where: { appointmentId }
	});
}

/** Daily visit count for a clinic (for dashboards). */
export async function getDailyVisitCounts(
	clinicId: string,
	range: { from: Date; to: Date }
) {
	return db.query.visits.findMany({
		where: {
			clinicId,
			visitedAt: { gte: range.from, lte: range.to }
		},
		columns: { visitedAt: true }
	});
	// → group by day in app code
}

// ── Create / Update / Delete ────────────────────────────────────────────

export async function createVisit(data: typeof visits.$inferInsert) {
	const [row] = await db.insert(visits).values(data).returning();
	return row;
}

export async function updateVisit(
	id: string,
	data: Partial<typeof visits.$inferInsert>
) {
	const [row] = await db
		.update(visits)
		.set(data)
		.where(eq(visits.id, id))
		.returning();
	return row;
}

export async function deleteVisit(id: string) {
	await db.delete(visits).where(eq(visits.id, id));
}
