// src/db/queries/vaccine-catalog.ts
import { eq } from "drizzle-orm";

import { db } from "#/db";
import { vaccineCatalog } from "#/db/schema";

export async function listVaccineCatalog() {
	return db.query.vaccineCatalog.findMany({
		orderBy: { recommendedAgeMonths: "asc" }
	});
}

export async function listMandatoryVaccines() {
	return db.query.vaccineCatalog.findMany({
		where: { isMandatoryMoh: true },
		orderBy: { recommendedAgeMonths: "asc" }
	});
}

export async function findVaccineById(id: string) {
	return db.query.vaccineCatalog.findFirst({ where: { id } });
}

export async function createVaccine(data: typeof vaccineCatalog.$inferInsert) {
	const [row] = await db.insert(vaccineCatalog).values(data).returning();
	return row;
}

export async function seedVaccineCatalog(
	data: (typeof vaccineCatalog.$inferInsert)[]
) {
	return db
		.insert(vaccineCatalog)
		.values(data)
		.onConflictDoNothing({ target: vaccineCatalog.id })
		.returning();
}

export async function updateVaccine(
	id: string,
	data: Partial<typeof vaccineCatalog.$inferInsert>
) {
	const [row] = await db
		.update(vaccineCatalog)
		.set(data)
		.where(eq(vaccineCatalog.id, id))
		.returning();
	return row;
}

export async function deleteVaccine(id: string) {
	await db.delete(vaccineCatalog).where(eq(vaccineCatalog.id, id));
}
