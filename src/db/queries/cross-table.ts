// src/db/queries/cross-table.ts
import { eq } from "drizzle-orm";

import { db } from "#/db";
import {
	auditLog,
	measurements,
	milestones,
	patients,
	vaccinations
} from "#/db/schema";

import { logAudit } from "./audit-log";

// ── Composite reads ─────────────────────────────────────────────────────

/** Everything a clinician needs on the patient detail page. */
export async function getPatientDashboard(patientId: string) {
	return db.query.patients.findFirst({
		where: { id: patientId, deletedAt: { isNull: true } },
		with: {
			measurements: { orderBy: { date: "desc" }, limit: 1 },
			vaccinations: {
				where: { status: { in: ["due", "missed"] } },
				with: { vaccine: true },
				orderBy: { dueDate: "asc" },
				limit: 5
			},
			milestones: {
				where: { isAchieved: false },
				with: { milestone: true },
				orderBy: { milestoneId: "asc" },
				limit: 5
			},
			appointments: {
				where: { status: "scheduled" },
				orderBy: { scheduledAt: "asc" },
				limit: 3
			}
		}
	});
}

/** Measurement history joined with patient demographics. */
export async function getMeasurementTimeline(patientId: string) {
	return db.query.measurements.findMany({
		where: { patientId },
		with: {
			patient: {
				columns: {
					id: true,
					name: true,
					gender: true,
					dob: true,
					guardianName: true
				}
			}
		},
		orderBy: { date: "asc" }
	});
}

// ── Full backup / restore (mirrors old Dexie export/import) ────────────

export async function exportDatabaseToJson(ownerId: string) {
	const data = await db.query.patients.findMany({
		where: { ownerId, deletedAt: { isNull: true } },
		with: {
			measurements: true,
			vaccinations: true,
			milestones: true
		}
	});

	const payload = {
		version: 2,
		app: "Egyptian Pediatric Growth Tracker",
		exportedAt: new Date().toISOString(),
		ownerId,
		data
	};

	await logAudit({
		ownerId,
		action: "backup.export",
		entityType: "database",
		payload: { patientCount: data.length }
	});

	return JSON.stringify(payload, null, 2);
}

export async function importDatabaseFromJson(
	ownerId: string,
	jsonString: string,
	mode: "merge" | "replace" = "merge"
) {
	const parsed = JSON.parse(jsonString);
	const rows = parsed.data as Array<{
		id: string;
		measurements: (typeof measurements.$inferInsert)[];
		vaccinations: (typeof vaccinations.$inferInsert)[];
		milestones: (typeof milestones.$inferInsert)[];
		[k: string]: unknown;
	}>;

	return db.transaction(async tx => {
		if (mode === "replace") {
			await tx.delete(patients).where(eq(patients.ownerId, ownerId));
		}

		for (const p of rows) {
			const {
				measurements: ms,
				vaccinations: vs,
				milestones: ml,
				ownerId: _ownerId,
				...patientData
			} = p;
			await tx
				.insert(patients)
				.values(patientData as typeof patients.$inferInsert)
				.onConflictDoUpdate({
					target: patients.id,
					set: {
						name: patientData.name as string,
						gender: patientData.gender as "boy" | "girl",
						dob: patientData.dob as string,
						medicalRecordNumber: patientData.medicalRecordNumber as string
					}
				});
			if (ms?.length)
				await tx.insert(measurements).values(ms).onConflictDoNothing();
			if (vs?.length)
				await tx.insert(vaccinations).values(vs).onConflictDoNothing();
			if (ml?.length)
				await tx.insert(milestones).values(ml).onConflictDoNothing();
		}

		await tx.insert(auditLog).values({
			ownerId,
			action: "backup.import",
			entityType: "database",
			payload: { patientCount: rows.length, mode }
		});

		return {
			patientsCount: rows.length,
			measurementsCount: rows.reduce((n, p) => n + p.measurements.length, 0),
			vaccinationsCount: rows.reduce((n, p) => n + p.vaccinations.length, 0),
			milestonesCount: rows.reduce((n, p) => n + p.milestones.length, 0)
		};
	});
}

// ── Multi-table write: new visit in one transaction ────────────────────

export async function recordVisitTransaction(input: {
	patientId: string;
	ownerId: string;
	measurement: Omit<typeof measurements.$inferInsert, "patientId">;
	vaccinations?: (typeof vaccinations.$inferInsert)[];
	milestones?: (typeof milestones.$inferInsert)[];
}) {
	return db.transaction(async tx => {
		const [measurement] = await tx
			.insert(measurements)
			.values({ ...input.measurement, patientId: input.patientId })
			.returning();

		if (input.vaccinations?.length) {
			await tx
				.insert(vaccinations)
				.values(
					input.vaccinations.map(v => ({ ...v, patientId: input.patientId }))
				);
		}
		if (input.milestones?.length) {
			await tx
				.insert(milestones)
				.values(
					input.milestones.map(m => ({ ...m, patientId: input.patientId }))
				);
		}

		await tx.insert(auditLog).values({
			ownerId: input.ownerId,
			action: "visit.record",
			entityType: "patient",
			entityId: input.patientId,
			payload: { measurementId: measurement.id }
		});

		return measurement;
	});
}

// ── Aggregate: patient growth summary ──────────────────────────────────

export async function getPatientGrowthSummary(patientId: string) {
	return db.query.measurements.findMany({
		where: { patientId },
		orderBy: { date: "desc" },
		limit: 1
	});
	// → first row has latest Z-scores ready for the ClinicalInterpretationCard
}
