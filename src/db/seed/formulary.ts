// src/db/seed/formulary.ts

import { EGYPTIAN_NATIONAL_FORMULARY } from "@/data/egyptianNationalFormulary";
import type { DrugMonograph } from "@/types/formulary";

import { type DB, sql } from "../index";
import * as schema from "../schema";

const CHUNK_SIZE = 100;

/**
 * Idempotent. The formulary is *reference data*: re-running the seed must
 * update in place (a corrected dosing guideline should propagate on the
 * next deploy), not skip existing rows.
 *
 * That's why this uses `onConflictDoUpdate` while `lmsReference` uses
 * `onConflictDoNothing` — the LMS table is generated from a source file
 * that never changes at runtime; the formulary is edited by clinicians
 * via the EDA portal, so its state can drift from the type definition.
 */
export async function seedDrugFormulary(db: DB) {
	const rows: schema.NewDrugFormularyRow[] = EGYPTIAN_NATIONAL_FORMULARY.map(
		(d: DrugMonograph) => ({
			id: d.id,
			genericName: d.genericName,
			pharmacologicalCategory: d.pharmacologicalCategory,
			atcCode: d.atcCode,
			awareClassification: d.awareClassification ?? null,
			data: d
		})
	);

	for (let i = 0; i < rows.length; i += CHUNK_SIZE) {
		const chunk = rows.slice(i, i + CHUNK_SIZE);
		await db
			.insert(schema.drugFormulary)
			.values(chunk)
			.onConflictDoUpdate({
				target: schema.drugFormulary.id,
				set: {
					genericName: sql`excluded.generic_name`,
					pharmacologicalCategory: sql`excluded.pharmacological_category`,
					atcCode: sql`excluded.atc_code`,
					awareClassification: sql`excluded.aware_classification`,
					data: sql`excluded.data`
				}
			});
	}

	console.info(`[seed] upserted ${rows.length} drug formulary monographs`);
}
