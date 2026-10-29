import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import {
	bulkUpsertVaccinations,
	createVaccination,
	deleteVaccination,
	findVaccinationRecord,
	getVaccinationCoverage,
	listOverdueVaccinations,
	listUpcomingVaccinations,
	listVaccinationsByPatient,
	listVaccinationsByStatus,
	markVaccineCompleted,
	updateVaccination,
	upsertVaccination
} from "#/db/queries/vaccinations";
import { vaccinationInsertSchema } from "#/db/validations";

import { requireSession } from "./_auth";

const statusSchema = z.enum([
	"due",
	"scheduled",
	"completed",
	"missed",
	"refused",
	"contraindicated"
]);

export const $listVaccinationsByPatient = createServerFn({ method: "GET" })
	.validator(z.object({ patientId: z.uuid() }))
	.handler(async ({ data }) => {
		await requireSession();
		return listVaccinationsByPatient(data.patientId);
	});

export const $listVaccinationsByStatus = createServerFn({ method: "GET" })
	.validator(z.object({ patientId: z.uuid(), status: statusSchema }))
	.handler(async ({ data }) => {
		await requireSession();
		return listVaccinationsByStatus(data.patientId, data.status);
	});

export const $findVaccinationRecord = createServerFn({ method: "GET" })
	.validator(z.object({ patientId: z.uuid(), vaccineId: z.string().min(1) }))
	.handler(async ({ data }) => {
		await requireSession();
		return findVaccinationRecord(data.patientId, data.vaccineId);
	});

export const $listMyOverdueVaccinations = createServerFn({
	method: "GET"
}).handler(async () => {
	const session = await requireSession();
	return listOverdueVaccinations(session.user.id);
});

export const $listUpcomingVaccinations = createServerFn({ method: "GET" })
	.validator(
		z.object({
			patientId: z.uuid(),
			daysAhead: z.number().int().min(1).max(365).default(30)
		})
	)
	.handler(async ({ data }) => {
		await requireSession();
		return listUpcomingVaccinations(data.patientId, data.daysAhead);
	});

export const $getVaccinationCoverage = createServerFn({ method: "GET" })
	.validator(z.object({ patientId: z.uuid() }))
	.handler(async ({ data }) => {
		await requireSession();
		return getVaccinationCoverage(data.patientId);
	});

export const $createVaccination = createServerFn({ method: "POST" })
	.validator(
		z.object({
			patientId: z.uuid(),
			vaccineId: z.string().min(1),
			status: statusSchema.default("due"),
			administeredDate: z
				.string()
				.regex(/^\d{4}-\d{2}-\d{2}$/)
				.optional(),
			dueDate: z
				.string()
				.regex(/^\d{4}-\d{2}-\d{2}$/)
				.optional(),
			batchNumber: z.string().optional(),
			administeredBy: z.string().optional(),
			facility: z.string().optional(),
			adverseReactions: z.string().optional(),
			notes: z.string().optional()
		})
	)
	.handler(async ({ data }) => {
		const session = await requireSession();
		return createVaccination({ ...data, createdBy: session.user.id });
	});

export const $upsertVaccination = createServerFn({ method: "POST" })
	.validator(
		z.object({
			patientId: z.uuid(),
			vaccineId: z.string().min(1),
			status: statusSchema,
			administeredDate: z
				.string()
				.regex(/^\d{4}-\d{2}-\d{2}$/)
				.optional(),
			dueDate: z
				.string()
				.regex(/^\d{4}-\d{2}-\d{2}$/)
				.optional(),
			batchNumber: z.string().optional(),
			administeredBy: z.string().optional(),
			facility: z.string().optional(),
			adverseReactions: z.string().optional(),
			notes: z.string().optional()
		})
	)
	.handler(async ({ data }) => {
		const session = await requireSession();
		return upsertVaccination({
			...data,
			createdBy: session.user.id,
			updatedBy: session.user.id
		});
	});

export const $bulkUpsertVaccinations = createServerFn({ method: "POST" })
	.validator(
		z.array(
			z.object({
				patientId: z.uuid(),
				vaccineId: z.string().min(1),
				status: statusSchema,
				administeredDate: z
					.string()
					.regex(/^\d{4}-\d{2}-\d{2}$/)
					.optional(),
				dueDate: z
					.string()
					.regex(/^\d{4}-\d{2}-\d{2}$/)
					.optional(),
				batchNumber: z.string().optional(),
				administeredBy: z.string().optional(),
				facility: z.string().optional(),
				notes: z.string().optional()
			})
		)
	)
	.handler(async ({ data }) => {
		const session = await requireSession();
		return bulkUpsertVaccinations(
			data.map(v => ({ ...v, createdBy: session.user.id }))
		);
	});

export const $updateVaccination = createServerFn({ method: "POST" })
	.validator(
		z.object({
			id: z.uuid(),
			data: z.object({
				status: statusSchema.optional(),
				administeredDate: z
					.string()
					.regex(/^\d{4}-\d{2}-\d{2}$/)
					.nullable()
					.optional(),
				dueDate: z
					.string()
					.regex(/^\d{4}-\d{2}-\d{2}$/)
					.nullable()
					.optional(),
				batchNumber: z.string().nullable().optional(),
				administeredBy: z.string().nullable().optional(),
				facility: z.string().nullable().optional(),
				adverseReactions: z.string().nullable().optional(),
				notes: z.string().nullable().optional()
			})
		})
	)
	.handler(async ({ data }) => {
		const session = await requireSession();
		return updateVaccination(data.id, {
			...data.data,
			updatedBy: session.user.id
		});
	});

export const $markVaccineCompleted = createServerFn({ method: "POST" })
	.validator(
		z.object({
			patientId: z.uuid(),
			vaccineId: z.string().min(1),
			administeredDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
			batchNumber: z.string().optional(),
			administeredBy: z.string().optional(),
			facility: z.string().optional()
		})
	)
	.handler(async ({ data }) => {
		const session = await requireSession();
		const { patientId, vaccineId, ...details } = data;
		return markVaccineCompleted(patientId, vaccineId, {
			...details,
			administeredBy: details.administeredBy ?? session.user.name
		});
	});

export const $deleteVaccination = createServerFn({ method: "POST" })
	.validator(z.object({ patientId: z.uuid(), vaccineId: z.string().min(1) }))
	.handler(async ({ data }) => {
		await requireSession();
		await deleteVaccination(data.patientId, data.vaccineId);
		return { success: true };
	});

export const createVaccinationFn = createServerFn({ method: "POST" })
	.validator(vaccinationInsertSchema)
	.handler(async ({ data }) => {
		const session = await requireSession();
		return upsertVaccination({
			...data,
			createdBy: session.user.id
		});
	});
