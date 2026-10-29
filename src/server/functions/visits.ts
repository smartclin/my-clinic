import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import {
	createVisit,
	deleteVisit,
	findVisitByAppointment,
	findVisitById,
	getDailyVisitCounts,
	listVisitsByClinic,
	listVisitsByDoctor,
	listVisitsByPatient,
	updateVisit
} from "#/db/queries/visits";

import { requireSession } from "./_auth";

export const $listVisitsByPatient = createServerFn({ method: "GET" })
	.validator(z.object({ patientId: z.uuid() }))
	.handler(async ({ data }) => {
		await requireSession();
		return listVisitsByPatient(data.patientId);
	});

export const $listVisitsByClinic = createServerFn({ method: "GET" })
	.validator(
		z.object({
			clinicId: z.uuid(),
			from: z.string().transform(s => new Date(s)),
			to: z.string().transform(s => new Date(s))
		})
	)
	.handler(async ({ data }) => {
		await requireSession();
		return listVisitsByClinic(data.clinicId, {
			from: data.from,
			to: data.to
		});
	});

export const $listMyVisits = createServerFn({ method: "GET" })
	.validator(
		z.object({
			from: z.string().transform(s => new Date(s)),
			to: z.string().transform(s => new Date(s))
		})
	)
	.handler(async ({ data }) => {
		const session = await requireSession();
		return listVisitsByDoctor(session.user.id, {
			from: data.from,
			to: data.to
		});
	});

export const $findVisitById = createServerFn({ method: "GET" })
	.validator(z.object({ id: z.uuid() }))
	.handler(async ({ data }) => {
		await requireSession();
		return findVisitById(data.id);
	});

export const $findVisitByAppointment = createServerFn({ method: "GET" })
	.validator(z.object({ appointmentId: z.uuid() }))
	.handler(async ({ data }) => {
		await requireSession();
		return findVisitByAppointment(data.appointmentId);
	});

export const $getDailyVisitCounts = createServerFn({ method: "GET" })
	.validator(
		z.object({
			clinicId: z.uuid(),
			from: z.string().transform(s => new Date(s)),
			to: z.string().transform(s => new Date(s))
		})
	)
	.handler(async ({ data }) => {
		await requireSession();
		return getDailyVisitCounts(data.clinicId, {
			from: data.from,
			to: data.to
		});
	});

export const $createVisit = createServerFn({ method: "POST" })
	.validator(
		z.object({
			patientId: z.uuid(),
			clinicId: z.uuid(),
			appointmentId: z.uuid().optional(),
			doctorId: z.string().optional(),
			visitedAt: z.string().transform(s => new Date(s)),
			ageMonths: z.number().positive(),
			ageYears: z.number().int().positive().optional(),
			ageMonthsRemainder: z.number().int().min(0).max(11).optional()
		})
	)
	.handler(async ({ data }) => {
		const session = await requireSession();
		return createVisit({
			...data,
			doctorId: data.doctorId ?? session.user.id
		});
	});

export const $updateVisit = createServerFn({ method: "POST" })
	.validator(
		z.object({
			id: z.uuid(),
			data: z.object({
				visitedAt: z
					.string()
					.transform(s => new Date(s))
					.optional(),
				ageMonths: z.number().positive().optional(),
				ageYears: z.number().int().positive().nullable().optional(),
				ageMonthsRemainder: z
					.number()
					.int()
					.min(0)
					.max(11)
					.nullable()
					.optional()
			})
		})
	)
	.handler(async ({ data }) => {
		await requireSession();
		return updateVisit(data.id, data.data);
	});

export const $deleteVisit = createServerFn({ method: "POST" })
	.validator(z.object({ id: z.uuid() }))
	.handler(async ({ data }) => {
		await requireSession();
		await deleteVisit(data.id);
		return { success: true };
	});
