import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import {
	createMilestone,
	deleteMilestone,
	findMilestoneById,
	listMilestoneCatalog,
	listMilestonesByDomain,
	seedMilestoneCatalog,
	updateMilestone
} from "#/db/queries/milestone-catalog";

import { requireSession } from "./_auth";

const domainSchema = z.enum([
	"gross-motor",
	"fine-motor",
	"language",
	"social-cognitive"
]);

export const $listMilestoneCatalog = createServerFn({ method: "GET" }).handler(
	async () => {
		await requireSession();
		return listMilestoneCatalog();
	}
);

export const $listMilestonesByDomain = createServerFn({ method: "GET" })
	.validator(z.object({ domain: domainSchema }))
	.handler(async ({ data }) => {
		await requireSession();
		return listMilestonesByDomain(data.domain);
	});

export const $findMilestoneById = createServerFn({ method: "GET" })
	.validator(z.object({ id: z.string().min(1) }))
	.handler(async ({ data }) => {
		await requireSession();
		return findMilestoneById(data.id);
	});

export const $createMilestone = createServerFn({ method: "POST" })
	.validator(
		z.object({
			id: z.string().min(1).max(64),
			label: z.string().min(1),
			arabicLabel: z.string().optional(),
			domain: domainSchema,
			expectedAgeMonths: z.number().int().min(0),
			ageLabel: z.string().min(1),
			redFlagWarning: z.string().optional(),
			notes: z.string().optional()
		})
	)
	.handler(async ({ data }) => {
		await requireSession();
		return createMilestone(data);
	});

export const $seedMilestoneCatalog = createServerFn({ method: "POST" })
	.validator(z.array(z.record(z.string(), z.unknown())))
	.handler(async ({ data }) => {
		await requireSession();
		return seedMilestoneCatalog(data as never);
	});

export const $updateMilestone = createServerFn({ method: "POST" })
	.validator(
		z.object({
			id: z.string().min(1),
			data: z.object({
				label: z.string().min(1).optional(),
				arabicLabel: z.string().nullable().optional(),
				domain: domainSchema.optional(),
				expectedAgeMonths: z.number().int().min(0).optional(),
				ageLabel: z.string().min(1).optional(),
				redFlagWarning: z.string().nullable().optional(),
				notes: z.string().nullable().optional()
			})
		})
	)
	.handler(async ({ data }) => {
		await requireSession();
		return updateMilestone(data.id, data.data);
	});

export const $deleteMilestone = createServerFn({ method: "POST" })
	.validator(z.object({ id: z.string().min(1) }))
	.handler(async ({ data }) => {
		await requireSession();
		await deleteMilestone(data.id);
		return { success: true };
	});

export const listMilestoneCatalogFn = $listMilestoneCatalog;
