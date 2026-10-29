// lib/growth/lms-types.ts
//
// The three LMS parameters and the chart-point shapes the growth chart
// renders. Kept minimal so the component has no runtime deps.

export type Indicator =
	| "weight-for-age"
	| "length-for-age"
	| "weight-for-length"
	| "bmi-for-age";
export type GrowthIndicator = Indicator;
export type Sex = "male" | "female";
export type XAxis = "age" | "length";

/** The seven reference values at one x. */
export interface ChartPointValues {
	sd3neg: number;
	sd2neg: number;
	sd1neg: number;
	sd0: number; // the median (kept as `sd0` to match SD_BANDS key)
	sd1pos: number;
	sd2pos: number;
	sd3pos: number;
}

export interface ChartPoint extends ChartPointValues {
	x: number;
}

export interface ChartCurves {
	indicator: Indicator;
	sex: Sex;
	xAxis: XAxis;
	points: ChartPoint[];
}

export type ChartBand = ChartPoint;

export interface GrowthMeasurementRow {
	id: string;
	value: number;
	zScore?: number | null;
	percentile?: number | null;
	classification?: string | null;
	visit?: {
		visitedAt?: string | Date | null;
		ageMonths?: number | null;
	} | null;
}

export interface LmsTriple {
	l: number;
	m: number;
	s: number;
}
