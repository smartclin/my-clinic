// src/db/queries/prescriptions.ts
import { eq } from "drizzle-orm";

import { db } from "#/db";
import { prescriptions } from "#/db/schema";

// ── Read ────────────────────────────────────────────────────────────────

export async function listPrescriptionsByPatient(patientId: string) {
	return db.query.prescriptions.findMany({
		where: { patientId },
		orderBy: { prescriptionDate: "desc" }
	});
}

export async function listActivePrescriptions(patientId: string) {
	return db.query.prescriptions.findMany({
		where: { patientId, status: "active" },
		orderBy: { prescriptionDate: "desc" }
	});
}

export async function listPrescriptionsInRange(
	patientId: string,
	from: string,
	to: string
) {
	return db.query.prescriptions.findMany({
		where: {
			patientId,
			prescriptionDate: { gte: from, lte: to }
		},
		orderBy: { prescriptionDate: "desc" }
	});
}

export async function findPrescriptionById(id: string) {
	return db.query.prescriptions.findFirst({
		where: { id },
		with: { patient: { columns: { id: true, name: true } } }
	});
}

// ── Create / Update / Delete ────────────────────────────────────────────

export async function createPrescription(
	data: typeof prescriptions.$inferInsert
) {
	const [row] = await db.insert(prescriptions).values(data).returning();
	return row;
}

export async function updatePrescription(
	id: string,
	data: Partial<typeof prescriptions.$inferInsert>
) {
	const [row] = await db
		.update(prescriptions)
		.set(data)
		.where(eq(prescriptions.id, id))
		.returning();
	return row;
}

export async function cancelPrescription(id: string) {
	return updatePrescription(id, { status: "cancelled" });
}

export async function deletePrescription(id: string) {
	await db.delete(prescriptions).where(eq(prescriptions.id, id));
}
