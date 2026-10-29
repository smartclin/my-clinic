// src/db/queries/measurements.ts
import { eq } from "drizzle-orm";

import { db } from "#/db";
import { measurements } from "#/db/schema";
import { evaluateGrowthMetric } from "#/utils/lmsCalculations";

// ── Read ────────────────────────────────────────────────────────────────

export async function listMeasurementsByPatient(patientId: string) {
	return db.query.measurements.findMany({
		where: { patientId },
		orderBy: { date: "asc" }
	});
}

export async function listMeasurementsInRange(
	patientId: string,
	from: string,
	to: string
) {
	return db.query.measurements.findMany({
		where: {
			patientId,
			date: { gte: from, lte: to }
		},
		orderBy: { date: "asc" }
	});
}

export async function findLatestMeasurement(patientId: string) {
	return db.query.measurements.findFirst({
		where: { patientId },
		orderBy: { date: "desc" }
	});
}

export async function findMeasurementByDate(patientId: string, date: string) {
	return db.query.measurements.findFirst({
		where: { patientId, date }
	});
}

/** Recent measurements across all patients (dashboard feed). */
export async function listRecentMeasurements(ownerId: string, limit = 10) {
	return db.query.measurements.findMany({
		where: {
			patient: { ownerId, deletedAt: { isNull: true } }
		},
		with: {
			patient: { columns: { id: true, name: true, gender: true, dob: true } }
		},
		orderBy: { createdAt: "desc" },
		limit
	});
}

/** Measurement flagged as stunted (weightForAgeZ < -2). */
export async function listStuntedMeasurements(ownerId: string) {
	return db.query.measurements.findMany({
		where: {
			weightForAgeZ: { lt: -2 },
			patient: { ownerId, deletedAt: { isNull: true } }
		},
		with: { patient: { columns: { id: true, name: true } } },
		orderBy: { weightForAgeZ: "asc" }
	});
}

/** Chart data: age + value pair for a given metric. */
export async function getChartPoints(
	patientId: string,
	metric: "weight" | "height" | "bmi" | "headCircumference"
) {
	return db.query.measurements.findMany({
		where: { patientId },
		columns: { date: true, ageMonths: true, [metric]: true } as never,
		orderBy: { date: "asc" }
	});
}

// ── Create (auto-computes Z-scores) ─────────────────────────────────────

export async function createMeasurementWithZScores(
	data: Omit<
		typeof measurements.$inferInsert,
		| "weightForAgeZ"
		| "lengthForAgeZ"
		| "bmiForAgeZ"
		| "weightForLengthZ"
		| "classification"
	>,
	gender: "boy" | "girl"
) {
	const wfa = data.weight
		? evaluateGrowthMetric(gender, "wfa", data.ageMonths, data.weight)
		: null;
	const lhfa = data.height
		? evaluateGrowthMetric(gender, "lhfa", data.ageMonths, data.height)
		: null;
	const bmifa = data.bmi
		? evaluateGrowthMetric(gender, "bmifa", data.ageMonths, data.bmi)
		: null;
	const wfl =
		data.weight && data.height && data.height >= 45 && data.height <= 120
			? evaluateGrowthMetric(gender, "wfl", data.height, data.weight)
			: null;

	const [row] = await db
		.insert(measurements)
		.values({
			...data,
			weightForAgeZ: wfa?.zScore,
			lengthForAgeZ: lhfa?.zScore,
			bmiForAgeZ: bmifa?.zScore,
			weightForLengthZ: wfl?.zScore,
			classification:
				wfa?.classification ??
				lhfa?.classification ??
				bmifa?.classification ??
				null
		})
		.returning();
	return row;
}

export async function createManyMeasurements(
	data: (typeof measurements.$inferInsert)[]
) {
	return db.insert(measurements).values(data).returning();
}

/** Upsert by the (patientId, date) unique index. */
export async function upsertMeasurement(
	data: typeof measurements.$inferInsert
) {
	const [row] = await db
		.insert(measurements)
		.values(data)
		.onConflictDoUpdate({
			target: [measurements.patientId, measurements.date],
			set: {
				weight: data.weight,
				height: data.height,
				headCircumference: data.headCircumference,
				bmi: data.bmi,
				notes: data.notes
			}
		})
		.returning();
	return row;
}

// ── Update / Delete ─────────────────────────────────────────────────────

export async function updateMeasurement(
	id: string,
	data: Partial<typeof measurements.$inferInsert>
) {
	const [row] = await db
		.update(measurements)
		.set(data)
		.where(eq(measurements.id, id))
		.returning();
	return row;
}

export async function deleteMeasurement(id: string) {
	await db.delete(measurements).where(eq(measurements.id, id));
}
