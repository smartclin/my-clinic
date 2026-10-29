import type { db } from "#/db";
import { auditLog } from "#/db/schema";

export type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0];

/** Wrap any mutation in an audit row. */
export async function withAudit<T>(
	tx: Tx,
	params: {
		ownerId: string | null;
		action: string;
		entityType?: string;
		entityId?: string;
		payload?: Record<string, unknown>;
	},
	run: () => Promise<T>
): Promise<T> {
	const result = await run();
	await tx.insert(auditLog).values(params);
	return result;
}
