// src/db/queries/vaccinations.ts
import { and, eq, sql } from "drizzle-orm";

import { db } from "#/db";
import { vaccinations } from "#/db/schema";

// ── Read ────────────────────────────────────────────────────────────────

export async function listVaccinationsByPatient(patientId: string) {
	return db.query.vaccinations.findMany({
		where: { patientId },
		with: { vaccine: true },
		orderBy: { vaccineId: "asc" }
	});
}

export async function listVaccinationsByStatus(
	patientId: string,
	status: (typeof vaccinations.$inferSelect)["status"]
) {
	return db.query.vaccinations.findMany({
		where: { patientId, status },
		with: { vaccine: true },
		orderBy: { administeredDate: "asc" }
	});
}

export async function findVaccinationRecord(
	patientId: string,
	vaccineId: string
) {
	return db.query.vaccinations.findFirst({
		where: { patientId, vaccineId },
		with: { vaccine: true }
	});
}

export async function listOverdueVaccinations(ownerId: string) {
	return db.query.vaccinations.findMany({
		where: {
			status: { in: ["due", "missed"] },
			dueDate: { lt: new Date().toISOString().slice(0, 10) },
			patient: { ownerId, deletedAt: { isNull: true } }
		},
		with: {
			vaccine: true,
			patient: { columns: { id: true, name: true, guardianPhone: true } }
		},
		orderBy: { dueDate: "asc" }
	});
}

export async function listUpcomingVaccinations(
	patientId: string,
	daysAhead = 30
) {
	return db.query.vaccinations.findMany({
		where: {
			patientId,
			status: { in: ["due", "scheduled"] },
			dueDate: {
				gte: new Date().toISOString().slice(0, 10),
				lte: new Date(Date.now() + daysAhead * 24 * 60 * 60 * 1000)
					.toISOString()
					.slice(0, 10)
			}
		},
		with: { vaccine: true },
		orderBy: { dueDate: "asc" }
	});
}

/** Coverage: how many mandatory vaccines are completed for a patient. */
export async function getVaccinationCoverage(patientId: string) {
	const rows = await db.query.vaccinations.findMany({
		where: { patientId },
		columns: { status: true }
	});
	const completed = rows.filter(r => r.status === "completed").length;
	return {
		completed,
		total: rows.length,
		percent: rows.length ? Math.round((completed / rows.length) * 100) : 0
	};
}

// ── Create / Upsert / Update / Delete ──────────────────────────────────

export async function createVaccination(
	data: typeof vaccinations.$inferInsert
) {
	const [row] = await db.insert(vaccinations).values(data).returning();
	return row;
}

/** The primary write path: mark a dose administered or updated. */
export async function upsertVaccination(
	data: typeof vaccinations.$inferInsert
) {
	const [row] = await db
		.insert(vaccinations)
		.values(data)
		.onConflictDoUpdate({
			target: [vaccinations.patientId, vaccinations.vaccineId],
			set: {
				status: data.status,
				administeredDate: data.administeredDate,
				batchNumber: data.batchNumber,
				administeredBy: data.administeredBy,
				facility: data.facility,
				adverseReactions: data.adverseReactions,
				notes: data.notes,
				dueDate: data.dueDate
			}
		})
		.returning();
	return row;
}

export async function bulkUpsertVaccinations(
	data: (typeof vaccinations.$inferInsert)[]
) {
	return db
		.insert(vaccinations)
		.values(data)
		.onConflictDoUpdate({
			target: [vaccinations.patientId, vaccinations.vaccineId],
			set: {
				status: sql`EXCLUDED.status`,
				administeredDate: sql`EXCLUDED.administered_date`,
				batchNumber: sql`EXCLUDED.batch_number`,
				facility: sql`EXCLUDED.facility`,
				notes: sql`EXCLUDED.notes`
			}
		})
		.returning();
}

export async function updateVaccination(
	id: string,
	data: Partial<typeof vaccinations.$inferInsert>
) {
	const [row] = await db
		.update(vaccinations)
		.set(data)
		.where(eq(vaccinations.id, id))
		.returning();
	return row;
}

export async function markVaccineCompleted(
	patientId: string,
	vaccineId: string,
	details: {
		administeredDate: string;
		batchNumber?: string;
		administeredBy?: string;
		facility?: string;
	}
) {
	return upsertVaccination({
		patientId,
		vaccineId,
		status: "completed",
		...details
	});
}

export async function deleteVaccination(patientId: string, vaccineId: string) {
	await db
		.delete(vaccinations)
		.where(
			and(
				eq(vaccinations.patientId, patientId),
				eq(vaccinations.vaccineId, vaccineId)
			)
		);
}
