import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import {
	deleteMilestone,
	listAchievedMilestones,
	listDelayedMilestones,
	listMilestonesByDomain,
	listMilestonesByPatient,
	toggleMilestone,
	upsertMilestone
} from "#/db/queries/milestones";
import { milestoneInsertSchema } from "#/db/validations";

import { requireSession } from "./_auth";

const domainSchema = z.enum([
	"gross-motor",
	"fine-motor",
	"language",
	"social-cognitive"
]);

export const $listMilestonesByPatient = createServerFn({ method: "GET" })
	.validator(z.object({ patientId: z.uuid() }))
	.handler(async ({ data }) => {
		await requireSession();
		return listMilestonesByPatient(data.patientId);
	});

export const $listAchievedMilestones = createServerFn({ method: "GET" })
	.validator(z.object({ patientId: z.uuid() }))
	.handler(async ({ data }) => {
		await requireSession();
		return listAchievedMilestones(data.patientId);
	});

export const $listPatientMilestonesByDomain = createServerFn({ method: "GET" })
	.validator(z.object({ patientId: z.uuid(), domain: domainSchema }))
	.handler(async ({ data }) => {
		await requireSession();
		return listMilestonesByDomain(data.patientId, data.domain);
	});

export const $listMyDelayedMilestones = createServerFn({ method: "GET" })
	.validator(z.object({ currentAgeMonths: z.number().positive() }))
	.handler(async ({ data }) => {
		const session = await requireSession();
		return listDelayedMilestones(session.user.id, data.currentAgeMonths);
	});

export const $upsertMilestone = createServerFn({ method: "POST" })
	.validator(
		z.object({
			patientId: z.uuid(),
			milestoneId: z.string().min(1),
			isAchieved: z.boolean(),
			achievedDate: z
				.string()
				.regex(/^\d{4}-\d{2}-\d{2}$/)
				.optional(),
			notes: z.string().optional()
		})
	)
	.handler(async ({ data }) => {
		const session = await requireSession();
		return upsertMilestone({ ...data, createdBy: session.user.id });
	});

export const $toggleMilestone = createServerFn({ method: "POST" })
	.validator(
		z.object({
			patientId: z.uuid(),
			milestoneId: z.string().min(1),
			achieved: z.boolean(),
			achievedDate: z
				.string()
				.regex(/^\d{4}-\d{2}-\d{2}$/)
				.optional()
		})
	)
	.handler(async ({ data }) => {
		await requireSession();
		return toggleMilestone(
			data.patientId,
			data.milestoneId,
			data.achieved,
			data.achievedDate
		);
	});

export const $deleteMilestoneRecord = createServerFn({ method: "POST" })
	.validator(z.object({ patientId: z.uuid(), milestoneId: z.string().min(1) }))
	.handler(async ({ data }) => {
		await requireSession();
		await deleteMilestone(data.patientId, data.milestoneId);
		return { success: true };
	});

export const createMilestoneFn = createServerFn({ method: "POST" })
	.validator(milestoneInsertSchema)
	.handler(async ({ data }) => {
		const session = await requireSession();
		return upsertMilestone({
			...data,
			createdBy: session.user.id
		});
	});
