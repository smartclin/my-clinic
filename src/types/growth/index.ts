// src/types/growth/index.ts

export type GrowthMetric = "wfa" | "lhfa" | "bmifa" | "wfl" | "hcfa";

export type Gender = "boy" | "girl";

export function decimalMonthsBetween(start: Date, end: Date): number {
	const diffMs = end.getTime() - start.getTime();
	const days = diffMs / (1000 * 60 * 60 * 24);
	// 365.25 / 12 = 30.4375 average days per month
	return Math.max(0, Number((days / 30.4375).toFixed(2)));
}
