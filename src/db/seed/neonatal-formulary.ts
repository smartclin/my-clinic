// src/db/seed/neonatal-formulary.ts
import { sql } from "drizzle-orm";

import { NEONATAL_PEDIATRIC_FORMULARY } from "@/data/neonatalDrugs";

import type { DB } from "../index";
import * as schema from "../schema";

const CHUNK_SIZE = 100;

/**
 * Idempotent + updatable. Same rationale as `seedDrugFormulary`: the
 * neonatal cheat sheet is clinician-edited, so a corrected dose must
 * propagate on the next deploy, not be skipped because "the row exists".
 */
export async function seedNeonatalFormulary(db: DB) {
	const rows: schema.NewNeonatalFormularyRow[] =
		NEONATAL_PEDIATRIC_FORMULARY.map(d => ({
			id: d.id,
			name: d.name,
			genericName: d.genericName,
			category: d.category,
			data: d
		}));

	for (let i = 0; i < rows.length; i += CHUNK_SIZE) {
		await db
			.insert(schema.neonatalFormulary)
			.values(rows.slice(i, i + CHUNK_SIZE))
			.onConflictDoUpdate({
				target: schema.neonatalFormulary.id,
				set: {
					name: sql`excluded.name`,
					genericName: sql`excluded.generic_name`,
					category: sql`excluded.category`,
					data: sql`excluded.data`
				}
			});
	}

	console.info(`[seed] upserted ${rows.length} neonatal formulary drugs`);
}
