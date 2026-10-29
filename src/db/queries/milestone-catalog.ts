// src/db/queries/milestone-catalog.ts
import { eq } from "drizzle-orm";

import { db } from "#/db";
import { milestoneCatalog } from "#/db/schema";

export async function listMilestoneCatalog() {
	return db.query.milestoneCatalog.findMany({
		orderBy: { expectedAgeMonths: "asc" }
	});
}

export async function listMilestonesByDomain(
	domain: (typeof milestoneCatalog.$inferSelect)["domain"]
) {
	return db.query.milestoneCatalog.findMany({
		where: { domain },
		orderBy: { expectedAgeMonths: "asc" }
	});
}

export async function findMilestoneById(id: string) {
	return db.query.milestoneCatalog.findFirst({ where: { id } });
}

export async function createMilestone(
	data: typeof milestoneCatalog.$inferInsert
) {
	const [row] = await db.insert(milestoneCatalog).values(data).returning();
	return row;
}

export async function seedMilestoneCatalog(
	data: (typeof milestoneCatalog.$inferInsert)[]
) {
	return db
		.insert(milestoneCatalog)
		.values(data)
		.onConflictDoNothing({ target: milestoneCatalog.id })
		.returning();
}

export async function updateMilestone(
	id: string,
	data: Partial<typeof milestoneCatalog.$inferInsert>
) {
	const [row] = await db
		.update(milestoneCatalog)
		.set(data)
		.where(eq(milestoneCatalog.id, id))
		.returning();
	return row;
}

export async function deleteMilestone(id: string) {
	await db.delete(milestoneCatalog).where(eq(milestoneCatalog.id, id));
}
