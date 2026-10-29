import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import {
	createManyMeasurements,
	createMeasurementWithZScores,
	deleteMeasurement,
	findLatestMeasurement,
	findMeasurementByDate,
	getChartPoints,
	listMeasurementsByPatient,
	listMeasurementsInRange,
	listRecentMeasurements,
	listStuntedMeasurements,
	updateMeasurement,
	upsertMeasurement
} from "#/db/queries/measurements";
import { measurementInsertSchema } from "#/db/validations";

import { requireSession } from "./_auth";

export const $listMeasurementsByPatient = createServerFn({ method: "GET" })
	.validator(z.object({ patientId: z.uuid() }))
	.handler(async ({ data }) => {
		await requireSession();
		return listMeasurementsByPatient(data.patientId);
	});

export const $listMeasurementsInRange = createServerFn({ method: "GET" })
	.validator(
		z.object({
			patientId: z.uuid(),
			from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
			to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/)
		})
	)
	.handler(async ({ data }) => {
		await requireSession();
		return listMeasurementsInRange(data.patientId, data.from, data.to);
	});

export const $findLatestMeasurement = createServerFn({ method: "GET" })
	.validator(z.object({ patientId: z.uuid() }))
	.handler(async ({ data }) => {
		await requireSession();
		return findLatestMeasurement(data.patientId);
	});

export const $findMeasurementByDate = createServerFn({ method: "GET" })
	.validator(
		z.object({
			patientId: z.uuid(),
			date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/)
		})
	)
	.handler(async ({ data }) => {
		await requireSession();
		return findMeasurementByDate(data.patientId, data.date);
	});

export const $listMyRecentMeasurements = createServerFn({ method: "GET" })
	.validator(z.object({ limit: z.number().int().min(1).max(50).default(10) }))
	.handler(async ({ data }) => {
		const session = await requireSession();
		return listRecentMeasurements(session.user.id, data.limit);
	});

export const $listMyStuntedMeasurements = createServerFn({
	method: "GET"
}).handler(async () => {
	const session = await requireSession();
	return listStuntedMeasurements(session.user.id);
});

export const $getChartPoints = createServerFn({ method: "GET" })
	.validator(
		z.object({
			patientId: z.uuid(),
			metric: z.enum(["weight", "height", "bmi", "headCircumference"])
		})
	)
	.handler(async ({ data }) => {
		await requireSession();
		return getChartPoints(data.patientId, data.metric);
	});

export const $createMeasurement = createServerFn({ method: "POST" })
	.validator(
		z.object({
			patientId: z.uuid(),
			gender: z.enum(["boy", "girl"]),
			date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
			ageMonths: z.number().positive(),
			weight: z.number().positive().optional(),
			height: z.number().positive().optional(),
			headCircumference: z.number().positive().optional(),
			bmi: z.number().positive().optional(),
			notes: z.string().optional()
		})
	)
	.handler(async ({ data }) => {
		const session = await requireSession();
		const { gender, ...measurementData } = data;
		return createMeasurementWithZScores(
			{ ...measurementData, createdBy: session.user.id },
			gender
		);
	});

export const $createManyMeasurements = createServerFn({ method: "POST" })
	.validator(
		z.array(
			z.object({
				patientId: z.uuid(),
				date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
				ageMonths: z.number().positive(),
				weight: z.number().positive().optional(),
				height: z.number().positive().optional(),
				headCircumference: z.number().positive().optional(),
				bmi: z.number().positive().optional(),
				notes: z.string().optional()
			})
		)
	)
	.handler(async ({ data }) => {
		const session = await requireSession();
		return createManyMeasurements(
			data.map(m => ({ ...m, createdBy: session.user.id }))
		);
	});

export const $upsertMeasurement = createServerFn({ method: "POST" })
	.validator(
		z.object({
			patientId: z.uuid(),
			date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
			ageMonths: z.number().positive(),
			weight: z.number().positive().optional(),
			height: z.number().positive().optional(),
			headCircumference: z.number().positive().optional(),
			bmi: z.number().positive().optional(),
			notes: z.string().optional()
		})
	)
	.handler(async ({ data }) => {
		const session = await requireSession();
		return upsertMeasurement({ ...data, createdBy: session.user.id });
	});

export const $updateMeasurement = createServerFn({ method: "POST" })
	.validator(
		z.object({
			id: z.uuid(),
			data: z.object({
				weight: z.number().positive().nullable().optional(),
				height: z.number().positive().nullable().optional(),
				headCircumference: z.number().positive().nullable().optional(),
				bmi: z.number().positive().nullable().optional(),
				notes: z.string().nullable().optional()
			})
		})
	)
	.handler(async ({ data }) => {
		await requireSession();
		return updateMeasurement(data.id, data.data);
	});

export const $deleteMeasurement = createServerFn({ method: "POST" })
	.validator(z.object({ id: z.uuid() }))
	.handler(async ({ data }) => {
		await requireSession();
		await deleteMeasurement(data.id);
		return { success: true };
	});

export const createMeasurementFn = createServerFn({ method: "POST" })
	.validator(measurementInsertSchema)
	.handler(async ({ data }) => {
		const session = await requireSession();
		return upsertMeasurement({
			...data,
			createdBy: session.user.id
		});
	});

export const fetchIndicatorSeries = $listMeasurementsByPatient;
