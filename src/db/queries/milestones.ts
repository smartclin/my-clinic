// src/db/queries/milestones.ts
import { and, eq } from "drizzle-orm";

import { db } from "#/db";
import { milestones } from "#/db/schema";

// ── Read ────────────────────────────────────────────────────────────────

export async function listMilestonesByPatient(patientId: string) {
	return db.query.milestones.findMany({
		where: { patientId },
		with: { milestone: true },
		orderBy: { milestoneId: "asc" }
	});
}

export async function listAchievedMilestones(patientId: string) {
	return db.query.milestones.findMany({
		where: { patientId, isAchieved: true },
		with: { milestone: true },
		orderBy: { achievedDate: "asc" }
	});
}

export async function listMilestonesByDomain(
	patientId: string,
	domain: (typeof milestones.$inferSelect)["milestoneId"] extends never
		? never
		: "gross-motor" | "fine-motor" | "language" | "social-cognitive"
) {
	return db.query.milestones.findMany({
		where: {
			patientId,
			milestone: { domain }
		},
		with: { milestone: true },
		orderBy: { milestoneId: "asc" }
	});
}

/** Patients with a delayed milestone (expectedAgeMonths + 2 < current age). */
export async function listDelayedMilestones(
	ownerId: string,
	currentAgeMonths: number
) {
	return db.query.milestones.findMany({
		where: {
			isAchieved: false,
			patient: { ownerId, deletedAt: { isNull: true } },
			milestone: { expectedAgeMonths: { lt: currentAgeMonths - 2 } }
		},
		with: {
			patient: { columns: { id: true, name: true, dob: true } },
			milestone: true
		}
	});
}

// ── Upsert / Toggle ─────────────────────────────────────────────────────

export async function upsertMilestone(data: typeof milestones.$inferInsert) {
	const [row] = await db
		.insert(milestones)
		.values(data)
		.onConflictDoUpdate({
			target: [milestones.patientId, milestones.milestoneId],
			set: {
				isAchieved: data.isAchieved,
				achievedDate: data.achievedDate,
				notes: data.notes
			}
		})
		.returning();
	return row;
}

export async function toggleMilestone(
	patientId: string,
	milestoneId: string,
	achieved: boolean,
	achievedDate?: string
) {
	return upsertMilestone({
		patientId,
		milestoneId,
		isAchieved: achieved,
		achievedDate: achieved
			? (achievedDate ?? new Date().toISOString().slice(0, 10))
			: null
	});
}

export async function deleteMilestone(patientId: string, milestoneId: string) {
	await db
		.delete(milestones)
		.where(
			and(
				eq(milestones.patientId, patientId),
				eq(milestones.milestoneId, milestoneId)
			)
		);
}
