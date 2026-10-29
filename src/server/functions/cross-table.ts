import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { db } from "#/db/index.ts";
import {
	exportDatabaseToJson,
	getMeasurementTimeline,
	getPatientDashboard,
	getPatientGrowthSummary,
	importDatabaseFromJson,
	recordVisitTransaction
} from "#/db/queries/cross-table";

import { requireSession } from "./_auth";

recordVisitTransaction;

export const $getPatientDashboard = createServerFn({ method: "GET" })
	.validator(z.object({ patientId: z.uuid() }))
	.handler(async ({ data }) => {
		await requireSession();
		return getPatientDashboard(data.patientId);
	});

export const $getMeasurementTimeline = createServerFn({ method: "GET" })
	.validator(z.object({ patientId: z.uuid() }))
	.handler(async ({ data }) => {
		await requireSession();
		return getMeasurementTimeline(data.patientId);
	});

export const $exportDatabase = createServerFn({ method: "GET" }).handler(
	async () => {
		const session = await requireSession();
		return exportDatabaseToJson(session.user.id);
	}
);

export const $importDatabase = createServerFn({ method: "POST" })
	.validator(
		z.object({
			jsonString: z.string().min(2),
			mode: z.enum(["merge", "replace"]).default("merge")
		})
	)
	.handler(async ({ data }) => {
		const session = await requireSession();
		return importDatabaseFromJson(session.user.id, data.jsonString, data.mode);
	});

export const $recordVisitTransaction = createServerFn({ method: "POST" })
	.validator(
		z.object({
			patientId: z.uuid(),
			measurement: z.object({
				date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
				ageMonths: z.number().positive(),
				weight: z.number().positive().optional(),
				height: z.number().positive().optional(),
				headCircumference: z.number().positive().optional(),
				bmi: z.number().positive().optional(),
				notes: z.string().optional()
			}),
			vaccinations: z.array(z.record(z.string(), z.unknown())).optional(),
			milestones: z.array(z.record(z.string(), z.unknown())).optional()
		})
	)
	.handler(async ({ data }) => {
		const session = await requireSession();
		return recordVisitTransaction({
			patientId: data.patientId,
			ownerId: session.user.id,
			measurement: data.measurement,
			vaccinations: data.vaccinations as never,
			milestones: data.milestones as never
		});
	});

export const $getPatientGrowthSummary = createServerFn({ method: "GET" })
	.validator(z.object({ patientId: z.uuid() }))
	.handler(async ({ data }) => {
		await requireSession();
		return getPatientGrowthSummary(data.patientId);
	});

export const $exportDatabaseFn = createServerFn({ method: "GET" }).handler(
	async () => {
		const session = await requireSession();
		const [patients, measurements, vaccinations, milestones] =
			await Promise.all([
				db.query.patients.findMany({ where: { ownerId: session.user.id } }),
				db.query.measurements.findMany(),
				db.query.vaccinations.findMany(),
				db.query.milestones.findMany()
			]);
		return JSON.stringify(
			{
				version: 2,
				exportedAt: new Date().toISOString(),
				data: { patients, measurements, vaccinations, milestones }
			},
			null,
			2
		);
	}
);

export const $importDatabaseFn = createServerFn({ method: "POST" })
	.validator(
		z.object({
			jsonString: z.string().min(2),
			mode: z.enum(["merge", "replace"])
		})
	)
	.handler(async ({ data }) => {
		const session = await requireSession();
		return importDatabaseFromJson(session.user.id, data.jsonString, data.mode);
	});
