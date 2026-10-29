import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import {
	cancelPrescription,
	createPrescription,
	deletePrescription,
	findPrescriptionById,
	listActivePrescriptions,
	listPrescriptionsByPatient,
	listPrescriptionsInRange,
	updatePrescription
} from "#/db/queries/prescriptions";
import { prescriptionInsertSchema } from "#/db/validations";

import { requireSession } from "./_auth";

const medicationSchema = z.object({
	drugId: z.string(),
	name: z.string(),
	dose: z.string(),
	frequency: z.string(),
	duration: z.string(),
	route: z.enum(["IV", "IM", "Oral", "Inhalation", "PR"]),
	instructions: z.string().optional()
});

export const $listPrescriptionsByPatient = createServerFn({ method: "GET" })
	.validator(z.object({ patientId: z.uuid() }))
	.handler(async ({ data }) => {
		await requireSession();
		return listPrescriptionsByPatient(data.patientId);
	});

export const $listActivePrescriptions = createServerFn({ method: "GET" })
	.validator(z.object({ patientId: z.uuid() }))
	.handler(async ({ data }) => {
		await requireSession();
		return listActivePrescriptions(data.patientId);
	});

export const $listPrescriptionsInRange = createServerFn({ method: "GET" })
	.validator(
		z.object({
			patientId: z.uuid(),
			from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
			to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/)
		})
	)
	.handler(async ({ data }) => {
		await requireSession();
		return listPrescriptionsInRange(data.patientId, data.from, data.to);
	});

export const $findPrescriptionById = createServerFn({ method: "GET" })
	.validator(z.object({ id: z.uuid() }))
	.handler(async ({ data }) => {
		await requireSession();
		return findPrescriptionById(data.id);
	});

export const $createPrescription = createServerFn({ method: "POST" })
	.validator(
		z.object({
			patientId: z.uuid(),
			prescriptionDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
			medications: z.array(medicationSchema),
			instructions: z.string().optional(),
			prescribedBy: z.string().optional(),
			notes: z.string().optional()
		})
	)
	.handler(async ({ data }) => {
		const session = await requireSession();
		return createPrescription({
			...data,
			prescribedBy: data.prescribedBy ?? session.user.name,
			createdBy: session.user.id
		});
	});

export const $updatePrescription = createServerFn({ method: "POST" })
	.validator(
		z.object({
			id: z.uuid(),
			data: z.object({
				prescriptionDate: z
					.string()
					.regex(/^\d{4}-\d{2}-\d{2}$/)
					.optional(),
				status: z.enum(["active", "completed", "cancelled"]).optional(),
				medications: z.array(medicationSchema).optional(),
				instructions: z.string().nullable().optional(),
				notes: z.string().nullable().optional()
			})
		})
	)
	.handler(async ({ data }) => {
		const session = await requireSession();
		return updatePrescription(data.id, {
			...data.data,
			updatedBy: session.user.id
		});
	});

export const $cancelPrescription = createServerFn({ method: "POST" })
	.validator(z.object({ id: z.uuid() }))
	.handler(async ({ data }) => {
		await requireSession();
		return cancelPrescription(data.id);
	});

export const $deletePrescription = createServerFn({ method: "POST" })
	.validator(z.object({ id: z.uuid() }))
	.handler(async ({ data }) => {
		await requireSession();
		await deletePrescription(data.id);
		return { success: true };
	});

export const $listTopMedications = createServerFn({ method: "GET" })
	.validator(
		z.object({
			clinicId: z.string(),
			limit: z.number().optional()
		})
	)
	.handler(async () => {
		await requireSession();
		return [] as { medicationName: string; count: number }[];
	});

export const createPrescriptionFn = createServerFn({ method: "POST" })
	.validator(prescriptionInsertSchema)
	.handler(async ({ data }) => {
		const session = await requireSession();
		return createPrescription({
			...data,
			prescribedBy: data.prescribedBy ?? session.user.id,
			createdBy: session.user.id
		});
	});
