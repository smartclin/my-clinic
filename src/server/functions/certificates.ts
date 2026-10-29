import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import {
	createCertificate,
	deleteCertificate,
	findCertificateById,
	listCertificatesByPatient,
	updateCertificate
} from "#/db/queries/certificates";
import { certificateInsertSchema } from "#/db/validations";

import { requireSession } from "./_auth";

export const $listCertificatesByPatient = createServerFn({ method: "GET" })
	.validator(z.object({ patientId: z.uuid() }))
	.handler(async ({ data }) => {
		await requireSession();
		return listCertificatesByPatient(data.patientId);
	});

export const $findCertificateById = createServerFn({ method: "GET" })
	.validator(z.object({ id: z.uuid() }))
	.handler(async ({ data }) => {
		await requireSession();
		return findCertificateById(data.id);
	});

export const $createCertificate = createServerFn({ method: "POST" })
	.validator(
		z.object({
			patientId: z.uuid(),
			issueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
			certificateType: z.string().min(1).max(64),
			title: z.string().min(1),
			body: z.string().min(1),
			issuedBy: z.string().optional(),
			notes: z.string().optional()
		})
	)
	.handler(async ({ data }) => {
		const session = await requireSession();
		return createCertificate({
			...data,
			issuedBy: data.issuedBy ?? session.user.name,
			createdBy: session.user.id
		});
	});

export const $updateCertificate = createServerFn({ method: "POST" })
	.validator(
		z.object({
			id: z.uuid(),
			data: z.object({
				issueDate: z
					.string()
					.regex(/^\d{4}-\d{2}-\d{2}$/)
					.optional(),
				certificateType: z.string().min(1).max(64).optional(),
				title: z.string().min(1).optional(),
				body: z.string().min(1).optional(),
				issuedBy: z.string().nullable().optional(),
				notes: z.string().nullable().optional()
			})
		})
	)
	.handler(async ({ data }) => {
		const session = await requireSession();
		return updateCertificate(data.id, {
			...data.data,
			updatedBy: session.user.id
		});
	});

export const $deleteCertificate = createServerFn({ method: "POST" })
	.validator(z.object({ id: z.uuid() }))
	.handler(async ({ data }) => {
		await requireSession();
		await deleteCertificate(data.id);
		return { success: true };
	});

export const createCertificateFn = createServerFn({ method: "POST" })
	.validator(certificateInsertSchema)
	.handler(async ({ data }) => {
		const session = await requireSession();
		return createCertificate({
			...data,
			issuedBy: data.issuedBy ?? session.user.name,
			createdBy: session.user.id
		});
	});
