import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import {
	createVaccine,
	deleteVaccine,
	findVaccineById,
	listMandatoryVaccines,
	listVaccineCatalog,
	seedVaccineCatalog,
	updateVaccine
} from "#/db/queries/vaccine-catalog";

import { requireSession } from "./_auth";

export const $listVaccineCatalog = createServerFn({ method: "GET" }).handler(
	async () => {
		await requireSession();
		return listVaccineCatalog();
	}
);

export const $listMandatoryVaccines = createServerFn({ method: "GET" }).handler(
	async () => {
		await requireSession();
		return listMandatoryVaccines();
	}
);

export const $findVaccineById = createServerFn({ method: "GET" })
	.validator(z.object({ id: z.string().min(1) }))
	.handler(async ({ data }) => {
		await requireSession();
		return findVaccineById(data.id);
	});

export const $createVaccine = createServerFn({ method: "POST" })
	.validator(
		z.object({
			id: z.string().min(1).max(64),
			label: z.string().min(1),
			arabicLabel: z.string().optional(),
			disease: z.string().min(1),
			recommendedAgeMonths: z.number().int().min(0),
			recommendedAgeLabel: z.string().min(1),
			schedule: z.string().max(32).default("egypt-moh"),
			isMandatoryMoh: z.boolean().default(true),
			notes: z.string().optional()
		})
	)
	.handler(async ({ data }) => {
		await requireSession();
		return createVaccine(data);
	});

export const $seedVaccineCatalog = createServerFn({ method: "POST" })
	.validator(z.array(z.record(z.string(), z.unknown())))
	.handler(async ({ data }) => {
		await requireSession();
		return seedVaccineCatalog(data as never);
	});

export const $updateVaccine = createServerFn({ method: "POST" })
	.validator(
		z.object({
			id: z.string().min(1),
			data: z.object({
				label: z.string().min(1).optional(),
				arabicLabel: z.string().nullable().optional(),
				disease: z.string().min(1).optional(),
				recommendedAgeMonths: z.number().int().min(0).optional(),
				recommendedAgeLabel: z.string().min(1).optional(),
				schedule: z.string().max(32).optional(),
				isMandatoryMoh: z.boolean().optional(),
				notes: z.string().nullable().optional()
			})
		})
	)
	.handler(async ({ data }) => {
		await requireSession();
		return updateVaccine(data.id, data.data);
	});

export const $deleteVaccine = createServerFn({ method: "POST" })
	.validator(z.object({ id: z.string().min(1) }))
	.handler(async ({ data }) => {
		await requireSession();
		await deleteVaccine(data.id);
		return { success: true };
	});

export const listVaccineCatalogFn = $listVaccineCatalog;
