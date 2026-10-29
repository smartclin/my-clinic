// src/db/queries/audit-log.ts

import { lt } from "drizzle-orm";

import { db } from "#/db";
import { auditLog } from "#/db/schema";

export async function logAudit(data: typeof auditLog.$inferInsert) {
	const [row] = await db.insert(auditLog).values(data).returning();
	return row;
}

export async function logAuditMany(data: (typeof auditLog.$inferInsert)[]) {
	return db.insert(auditLog).values(data).returning();
}

export async function listAuditForOwner(ownerId: string, limit = 50) {
	return db.query.auditLog.findMany({
		where: { ownerId },
		orderBy: { createdAt: "desc" },
		limit
	});
}

export async function listAuditForEntity(
	ownerId: string,
	entityType: string,
	entityId: string
) {
	return db.query.auditLog.findMany({
		where: { ownerId, entityType, entityId },
		orderBy: { createdAt: "desc" }
	});
}

export async function listBackupHistory(ownerId: string) {
	return db.query.auditLog.findMany({
		where: {
			ownerId,
			action: { in: ["backup.export", "backup.import"] }
		},
		orderBy: { createdAt: "desc" }
	});
}

export async function findAuditById(id: string) {
	return db.query.auditLog.findFirst({ where: { id } });
}

export async function deleteAuditOlderThan(date: Date) {
	await db.delete(auditLog).where(lt(auditLog.createdAt, date));
}
