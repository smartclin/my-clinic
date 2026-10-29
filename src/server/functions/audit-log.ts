import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import {
	deleteAuditOlderThan,
	findAuditById,
	listAuditForEntity,
	listAuditForOwner,
	listBackupHistory,
	logAudit,
	logAuditMany
} from "#/db/queries/audit-log";

import { requireSession } from "./_auth";

type JsonValue =
	| string
	| number
	| boolean
	| null
	| JsonValue[]
	| { [key: string]: JsonValue };

function serializeAuditPayload<T extends { payload: unknown }>(entry: T) {
	return {
		...entry,
		payload:
			entry.payload == null
				? null
				: (JSON.parse(JSON.stringify(entry.payload)) as JsonValue)
	};
}

export const $logAudit = createServerFn({ method: "POST" })
	.validator(
		z.object({
			action: z.string().min(1),
			entityType: z.string().optional(),
			entityId: z.string().optional(),
			payload: z.record(z.string(), z.unknown()).optional()
		})
	)
	.handler(async ({ data }) => {
		const session = await requireSession();
		return serializeAuditPayload(
			await logAudit({ ...data, ownerId: session.user.id })
		);
	});

export const $logAuditMany = createServerFn({ method: "POST" })
	.validator(
		z.array(
			z.object({
				action: z.string().min(1),
				entityType: z.string().optional(),
				entityId: z.string().optional(),
				payload: z.record(z.string(), z.unknown()).optional()
			})
		)
	)
	.handler(async ({ data }) => {
		const session = await requireSession();
		return (
			await logAuditMany(
				data.map(entry => ({ ...entry, ownerId: session.user.id }))
			)
		).map(serializeAuditPayload);
	});

export const $listMyAuditLogs = createServerFn({ method: "GET" })
	.validator(z.object({ limit: z.number().int().min(1).max(200).default(50) }))
	.handler(async ({ data }) => {
		const session = await requireSession();
		return (await listAuditForOwner(session.user.id, data.limit)).map(
			serializeAuditPayload
		);
	});

export const $listMyAuditForEntity = createServerFn({ method: "GET" })
	.validator(
		z.object({
			entityType: z.string().min(1),
			entityId: z.string().min(1)
		})
	)
	.handler(async ({ data }) => {
		const session = await requireSession();
		return (
			await listAuditForEntity(session.user.id, data.entityType, data.entityId)
		).map(serializeAuditPayload);
	});

export const $listMyBackupHistory = createServerFn({ method: "GET" }).handler(
	async () => {
		const session = await requireSession();
		return (await listBackupHistory(session.user.id)).map(
			serializeAuditPayload
		);
	}
);

export const $findAuditById = createServerFn({ method: "GET" })
	.validator(z.object({ id: z.uuid() }))
	.handler(async ({ data }) => {
		await requireSession();
		const entry = await findAuditById(data.id);
		return entry ? serializeAuditPayload(entry) : null;
	});

export const $deleteAuditOlderThan = createServerFn({ method: "POST" })
	.validator(z.object({ date: z.string().transform(s => new Date(s)) }))
	.handler(async ({ data }) => {
		await requireSession();
		await deleteAuditOlderThan(data.date);
		return { success: true };
	});
