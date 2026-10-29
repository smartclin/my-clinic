// lib/growth/chartConfig.ts
//
// Declarative configuration for the growth chart. Kept outside the component
// so adding a new indicator (e.g. head circumference) is a table edit, not a
// component edit.
//
// The SD curves match the seven-band Egyptian 2021 reference. Colors come
// from the CSS variables defined in `styles.css` so dark mode works without
// a second code path.

import type { Indicator, XAxis } from "./lms-types";

export type GrowthMetric = "wfa" | "lhfa" | "wfl" | "bmifa";

export type TimeframeOption = "0-2" | "0-5" | "5-10" | "0-19" | "all";

export interface MetricMeta {
	/** Human label shown in the tab bar and axis title. */
	name: string;
	/** Short label shown in the axis title in parentheses. */
	shortName: string;
	/** Y-axis unit ("kg", "cm", "kg/m²"). */
	unit: string;
	/** X-axis unit ("months", "cm"). */
	xUnit: string;
	/** X-axis label ("Age", "Length"). */
	xLabel: string;
	/** Which `Indicator` this metric maps to for LMS lookup. */
	indicator: Indicator;
	/** Which `XAxis` this metric is drawn against. */
	xAxis: XAxis;
	/** Upper bound of the reference domain when "All" is selected. */
	maxX: number;
	/** Lower bound of the reference domain. */
	minX: number;
	/** If true, the timeframe selector is hidden (WFL is length-based, not age). */
	fixedRange: boolean;
}

export const GROWTH_METRIC_METADATA: Record<GrowthMetric, MetricMeta> = {
	bmifa: {
		fixedRange: false,
		indicator: "bmi-for-age",
		maxX: 228,
		minX: 0,
		name: "BMI-for-Age",
		shortName: "BMI",
		unit: "kg/m²",
		xAxis: "age",
		xLabel: "Age",
		xUnit: "months"
	},
	lhfa: {
		fixedRange: false,
		indicator: "length-for-age",
		maxX: 228,
		minX: 0,
		name: "Length/Height-for-Age",
		shortName: "L/HFA",
		unit: "cm",
		xAxis: "age",
		xLabel: "Age",
		xUnit: "months"
	},
	wfa: {
		fixedRange: false,
		indicator: "weight-for-age",
		maxX: 120,
		minX: 0,
		name: "Weight-for-Age",
		shortName: "WFA",
		unit: "kg",
		xAxis: "age",
		xLabel: "Age",
		xUnit: "months"
	},
	wfl: {
		fixedRange: true,
		indicator: "weight-for-length",
		maxX: 120,
		minX: 45,
		name: "Weight-for-Length",
		shortName: "WFL",
		unit: "kg",
		xAxis: "length",
		xLabel: "Length",
		xUnit: "cm"
	}
};

/**
 * Timeframe windows in months. `wfl` ignores this map — its domain is
 * length-based and fixed at 45–120 cm.
 */
export const TIMEFRAME_WINDOWS: Record<
	Exclude<TimeframeOption, "all">,
	{ min: number; max: number }
> = {
	"0-19": { max: 228, min: 0 },
	"0-2": { max: 24, min: 0 },
	"0-5": { max: 60, min: 0 },
	"5-10": { max: 120, min: 60 }
};

/**
 * The seven SD bands, in draw order (widest first, median last so it
 * renders on top). `band: true` means the pair should be filled; lines
 * are always drawn.
 */
export const SD_BANDS = [
	{ key: "sd3neg", label: "-3 SD", style: "outer", bandWith: "sd2neg" },
	{ key: "sd3pos", label: "+3 SD", style: "outer", bandWith: "sd2pos" },
	{ key: "sd2neg", label: "-2 SD", style: "inner", bandWith: null },
	{ key: "sd2pos", label: "+2 SD", style: "inner", bandWith: null },
	{ key: "sd1neg", label: "-1 SD", style: "inner", bandWith: null },
	{ key: "sd1pos", label: "+1 SD", style: "inner", bandWith: null },
	{ key: "sd0", label: "Median", style: "median", bandWith: null }
] as const satisfies readonly {
	key: keyof import("./lms-types").ChartPointValues | "sd0";
	label: string;
	style: "outer" | "inner" | "median";
	bandWith: string | null;
}[];

/**
 * Fill bands. A band is a closed polygon between two SD curves; drawing it
 * before the lines puts the fill underneath. The `+2 → +3` outer band is
 * the yellow region; `-2 → +2` is the green normal region.
 */
export const FILL_BANDS = [
	{
		lower: "sd2neg",
		upper: "sd2pos",
		cssVar: "--chart-band-median",
		opacity: 0.12
	},
	{
		lower: "sd3neg",
		upper: "sd2neg",
		cssVar: "--chart-band-inner",
		opacity: 0.1
	},
	{
		lower: "sd2pos",
		upper: "sd3pos",
		cssVar: "--chart-band-inner",
		opacity: 0.1
	}
] as const;

/**
 * Curve colors resolve to CSS variables defined in `styles.css`, so the
 * same markup works in light and dark mode without a second palette.
 */
export function curveColor(style: "outer" | "inner" | "median"): string {
	switch (style) {
		case "outer": {
			return "var(--chart-band-outer)";
		}
		case "inner": {
			return "var(--chart-band-inner)";
		}
		case "median": {
			return "var(--chart-band-median)";
		}
	}
}

export const PATIENT_COLOR = "var(--chart-patient)";

/**
 * Filter LMS rows to the active window. Extracted so both the chart and
 * its tooltip use the exact same filtered set — a stale tooltip on a
 * time-window change is the most common bug in this kind of migration.
 */
export function filterLmsByTimeframe<T extends { x: number }>(
	rows: T[],
	metric: GrowthMetric,
	timeframe: TimeframeOption
): T[] {
	const meta = GROWTH_METRIC_METADATA[metric];
	if (meta.fixedRange) {
		return rows.filter(r => r.x >= meta.minX && r.x <= meta.maxX);
	}
	const window = TIMEFRAME_WINDOWS[timeframe === "all" ? "0-19" : timeframe];
	return rows.filter(r => r.x >= window.min && r.x <= window.max);
}
