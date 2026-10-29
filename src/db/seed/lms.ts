// db/seed/lms.ts
import {
	EGYPTIAN_LMS_DATA,
	type Gender,
	type GrowthMetric
} from "@/data/egyptianLmsData";

import type { DB } from "../index";
import * as schema from "../schema";

export async function seedLmsReference(db: DB) {
	const rows: (typeof schema.lmsReference.$inferInsert)[] = [];

	for (const gender of ["boy", "girl"] as Gender[]) {
		for (const metric of ["wfa", "lhfa", "wfl", "bmifa"] as GrowthMetric[]) {
			const points = EGYPTIAN_LMS_DATA[gender][metric];
			if (!points) continue;

			for (const p of points) {
				rows.push({
					id: `${gender}:${metric}:${p.x}`,
					gender,
					metric,
					x: p.x,
					l: p.l,
					m: p.m,
					s: p.s,
					// ⚠️ Must be set — otherwise the chart uses CV for LHFA
					//    and every height Z-score is wrong.
					sUnit: metric === "lhfa" ? "sd" : "cv",
					sd3neg: p.sd3neg ?? null,
					sd2neg: p.sd2neg ?? null,
					sd1neg: p.sd1neg ?? null,
					sd0: p.sd0 ?? null,
					sd1pos: p.sd1pos ?? null,
					sd2pos: p.sd2pos ?? null,
					sd3pos: p.sd3pos ?? null
				});
			}
		}
	}

	// Chunked bulk insert — Drizzle's multi-row values() has a parameter limit
	// (~34k on Postgres). 500-row chunks keep us well under it.
	for (let i = 0; i < rows.length; i += 500) {
		await db
			.insert(schema.lmsReference)
			.values(rows.slice(i, i + 500))
			.onConflictDoNothing({ target: schema.lmsReference.id });
	}

	console.info(`[seed] inserted ${rows.length} LMS reference rows`);
}
