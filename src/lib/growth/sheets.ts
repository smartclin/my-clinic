// src/types/growth/sheets.ts
import type { Indicator, Sex, XAxis } from "./lms-types";

export interface SheetSpec {
	source: string;
	file: "Data Sheet 1" | "Data Sheet 1-1";
	indicator: Indicator;
	sex: Sex;
	xAxis: XAxis;
	minX: number;
	maxX: number;
	step: number;
	/** Whether M is monotonic in x. WFL/BMI fluctuate; skip the check for them. */
	monotonicM: boolean;
}
// src/types/growth/sheets.ts — replace the SHEETS array and add MISSING_RANGES

// src/types/growth/sheets.ts
// (full replacement of the SHEETS array and MISSING_RANGES)
// src/types/growth/sheets.ts — replace the SHEETS array and MISSING_RANGES

export const SHEETS: readonly SheetSpec[] = [
	// ── Data Sheet 1: birth → 5y ─────────────────────────────────────────
	// T1 WFA boys   0–60 months
	{
		source: "T1",
		file: "Data Sheet 1",
		indicator: "weight-for-age",
		sex: "male",
		xAxis: "age",
		minX: 0,
		maxX: 60,
		step: 1,
		monotonicM: true
	},
	// T2 WFA girls  0–60 months
	{
		source: "T2",
		file: "Data Sheet 1",
		indicator: "weight-for-age",
		sex: "female",
		xAxis: "age",
		minX: 0,
		maxX: 60,
		step: 1,
		monotonicM: true
	},
	// T3 HFA boys   0–60 months
	{
		source: "T3",
		file: "Data Sheet 1",
		indicator: "length-for-age",
		sex: "male",
		xAxis: "age",
		minX: 0,
		maxX: 60,
		step: 1,
		monotonicM: true
	},
	// T4 HFA girls  0–60 months (verified: first row 00:00 0 48.7088 …)
	{
		source: "T4",
		file: "Data Sheet 1",
		indicator: "length-for-age",
		sex: "female",
		xAxis: "age",
		minX: 0,
		maxX: 60,
		step: 1,
		monotonicM: true
	},
	// T5 WFL boys   45–120 cm
	{
		source: "T5",
		file: "Data Sheet 1",
		indicator: "weight-for-length",
		sex: "male",
		xAxis: "length",
		minX: 45,
		maxX: 120,
		step: 0.5,
		monotonicM: true
	},
	// T6 WFL girls  45–120 cm
	{
		source: "T6",
		file: "Data Sheet 1",
		indicator: "weight-for-length",
		sex: "female",
		xAxis: "length",
		minX: 45,
		maxX: 120,
		step: 0.5,
		monotonicM: true
	},
	// T7 BMI boys   0–60 months
	{
		source: "T7",
		file: "Data Sheet 1",
		indicator: "bmi-for-age",
		sex: "male",
		xAxis: "age",
		minX: 0,
		maxX: 60,
		step: 1,
		monotonicM: false
	},
	// T8 BMI girls  0–60 months
	{
		source: "T8",
		file: "Data Sheet 1",
		indicator: "bmi-for-age",
		sex: "female",
		xAxis: "age",
		minX: 0,
		maxX: 60,
		step: 1,
		monotonicM: false
	},

	// ── Data Sheet 1-1: 5y → 19y ─────────────────────────────────────────
	// NOTE: table numbering RESTARTS at (1) in this file. Confirmed by
	// `grep -n "Table ("` — this file has tables (1), (2), (3), (4), (5), (6)
	// only. There are NO weight-for-length tables in Data Sheet 1-1, and the
	// BMI tables are numbered (5) and (6) — not (7) and (8).
	// Table (1) WFA boys   61–120 months  (verified: first row 05:01 61 …)
	{
		source: "1-1 T1",
		file: "Data Sheet 1-1",
		indicator: "weight-for-age",
		sex: "male",
		xAxis: "age",
		minX: 61,
		maxX: 120,
		step: 1,
		monotonicM: true
	},
	// Table (2) WFA girls  61–120 months
	{
		source: "1-1 T2",
		file: "Data Sheet 1-1",
		indicator: "weight-for-age",
		sex: "female",
		xAxis: "age",
		minX: 61,
		maxX: 120,
		step: 1,
		monotonicM: true
	},
	// Table (3) HFA boys   61–228 months  (overlaps T3 at month 60; dedupe keeps T3)
	{
		source: "1-1 T3",
		file: "Data Sheet 1-1",
		indicator: "length-for-age",
		sex: "male",
		xAxis: "age",
		minX: 61,
		maxX: 228,
		step: 1,
		monotonicM: true
	},
	// Table (4) HFA girls  61–228 months  (overlaps T4 at month 60; dedupe keeps T4)
	{
		source: "1-1 T4",
		file: "Data Sheet 1-1",
		indicator: "length-for-age",
		sex: "female",
		xAxis: "age",
		minX: 61,
		maxX: 228,
		step: 1,
		monotonicM: true
	},
	// Table (5) BMI boys   61–228 months
	{
		source: "1-1 T5",
		file: "Data Sheet 1-1",
		indicator: "bmi-for-age",
		sex: "male",
		xAxis: "age",
		minX: 61,
		maxX: 228,
		step: 1,
		monotonicM: false
	},
	// Table (6) BMI girls  61–228 months
	{
		source: "1-1 T6",
		file: "Data Sheet 1-1",
		indicator: "bmi-for-age",
		sex: "female",
		xAxis: "age",
		minX: 61,
		maxX: 228,
		step: 1,
		monotonicM: false
	}
] as const;

/**
 * Ranges with NO source data in either PDF. With the corrected SHEETS above
 * there are no gaps — every indicator is covered from 0..max across the two
 * files. Kept as an export so callers can extend this if a future revision
 * of the PDFs introduces a hole; add rows here and the chart layer will warn.
 */
export const MISSING_RANGES: readonly {
	indicator: Indicator;
	sex: Sex;
	xAxis: XAxis;
	min: number;
	max: number;
}[] = [] as const;

interface DomainEntry {
	min: number;
	max: number;
}
export type DomainMap = Record<Indicator, Partial<Record<XAxis, DomainEntry>>>;

const buildDomainMap = (): DomainMap => {
	const map: DomainMap = {
		"weight-for-age": {},
		"length-for-age": {},
		"weight-for-length": {},
		"bmi-for-age": {}
	};
	for (const sheet of SHEETS) {
		const entry = map[sheet.indicator];
		const existing = entry[sheet.xAxis];
		if (existing) {
			existing.min = Math.min(existing.min, sheet.minX);
			existing.max = Math.max(existing.max, sheet.maxX);
		} else {
			entry[sheet.xAxis] = { min: sheet.minX, max: sheet.maxX };
		}
	}
	return map;
};

export const DOMAIN: DomainMap = buildDomainMap();

export type RangeFor<I extends Indicator> = I extends "weight-for-length"
	? { xAxis: "length"; min: number; max: number }
	: { xAxis: "age"; min: number; max: number };
