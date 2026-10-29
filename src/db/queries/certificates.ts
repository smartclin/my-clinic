// src/db/queries/certificates.ts
import { eq } from "drizzle-orm";

import { db } from "#/db";
import { certificates } from "#/db/schema";

export async function listCertificatesByPatient(patientId: string) {
	return db.query.certificates.findMany({
		where: { patientId },
		orderBy: { issueDate: "desc" }
	});
}

export async function findCertificateById(id: string) {
	return db.query.certificates.findFirst({
		where: { id },
		with: { patient: true }
	});
}

export async function createCertificate(
	data: typeof certificates.$inferInsert
) {
	const [row] = await db.insert(certificates).values(data).returning();
	return row;
}

export async function updateCertificate(
	id: string,
	data: Partial<typeof certificates.$inferInsert>
) {
	const [row] = await db
		.update(certificates)
		.set(data)
		.where(eq(certificates.id, id))
		.returning();
	return row;
}

export async function deleteCertificate(id: string) {
	await db.delete(certificates).where(eq(certificates.id, id));
}
