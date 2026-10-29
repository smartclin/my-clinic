import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import {
	createClinic,
	createManyClinics,
	deleteClinic,
	findClinicById,
	getClinicPatientCounts,
	getClinicWithDetails,
	listClinics,
	searchClinics,
	updateClinic
} from "#/db/queries/clinics";
import { clinicInsertSchema, clinicUpdateSchema } from "#/db/validations";

import { requireSession } from "./_auth";

export const $listClinics = createServerFn({ method: "GET" }).handler(
	async () => {
		await requireSession();
		return listClinics();
	}
);

export const $findClinicById = createServerFn({ method: "GET" })
	.validator(z.object({ id: z.uuid() }))
	.handler(async ({ data }) => {
		await requireSession();
		return findClinicById(data.id);
	});

export const $searchClinics = createServerFn({ method: "GET" })
	.validator(z.object({ query: z.string().min(1) }))
	.handler(async ({ data }) => {
		await requireSession();
		return searchClinics(data.query);
	});

export const $getClinicWithDetails = createServerFn({ method: "GET" })
	.validator(z.object({ id: z.uuid() }))
	.handler(async ({ data }) => {
		await requireSession();
		return getClinicWithDetails(data.id);
	});

export const $getClinicPatientCounts = createServerFn({
	method: "GET"
}).handler(async () => {
	await requireSession();
	return getClinicPatientCounts();
});

export const $createClinic = createServerFn({ method: "POST" })
	.validator(
		z.object({
			name: z.string().min(2),
			address: z.string().optional(),
			phone: z.string().optional(),
			email: z.string().email().optional()
		})
	)
	.handler(async ({ data }) => {
		await requireSession();
		return createClinic(data);
	});

export const $createManyClinics = createServerFn({ method: "POST" })
	.validator(
		z.array(
			z.object({
				name: z.string().min(2),
				address: z.string().optional(),
				phone: z.string().optional(),
				email: z.string().email().optional()
			})
		)
	)
	.handler(async ({ data }) => {
		await requireSession();
		return createManyClinics(data);
	});

export const $updateClinic = createServerFn({ method: "POST" })
	.validator(
		z.object({
			id: z.uuid(),
			data: z.object({
				name: z.string().min(2).optional(),
				address: z.string().nullable().optional(),
				phone: z.string().nullable().optional(),
				email: z.string().email().nullable().optional()
			})
		})
	)
	.handler(async ({ data }) => {
		await requireSession();
		return updateClinic(data.id, data.data);
	});

export const $deleteClinic = createServerFn({ method: "POST" })
	.validator(z.object({ id: z.uuid() }))
	.handler(async ({ data }) => {
		await requireSession();
		await deleteClinic(data.id);
		return { success: true };
	});

export const createClinicFn = createServerFn({ method: "POST" })
	.validator(clinicInsertSchema)
	.handler(async ({ data }) => {
		await requireSession();
		return createClinic(data);
	});

export const updateClinicFn = createServerFn({ method: "POST" })
	.validator(clinicUpdateSchema)
	.handler(async ({ data }) => {
		await requireSession();
		const { id, ...rest } = data;
		if (!id) {
			throw new Error("Clinic ID is required for update");
		}
		return updateClinic(id, rest);
	});

export const deleteClinicFn = createServerFn({ method: "POST" })
	.validator((data: unknown) => {
		if (
			!data ||
			typeof data !== "object" ||
			!("id" in data) ||
			typeof data.id !== "string"
		) {
			throw new Error("Clinic ID is required for deletion");
		}
		return { id: data.id };
	})
	.handler(async ({ data }) => {
		await requireSession();
		return deleteClinic(data.id);
	});

export const fetchClinics = $listClinics;
