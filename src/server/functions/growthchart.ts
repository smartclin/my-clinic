import { createServerFn } from "@tanstack/react-start";

import {
	EGYPTIAN_LMS_DATA,
	type Gender,
	type GrowthMetric
} from "@/data/egyptianLmsData";
import { listMeasurementsByPatient } from "@/db/queries/measurements";
import type {
	ChartBand,
	ChartCurves,
	ChartPoint,
	GrowthIndicator,
	GrowthMeasurementRow,
	Indicator,
	Sex,
	XAxis
} from "@/lib/growth/lms-types";
import {
	calculateValueFromZScore,
	getInterpolatedLms,
	zScoreToPercentile
} from "@/utils/lmsCalculations";

import { requireSession } from "./_auth";

function isPayload(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parsePayload(raw: unknown): Record<string, unknown> {
	if (!raw) return {};
	if (typeof raw === "string") {
		try {
			const parsed: unknown = JSON.parse(raw);
			return isPayload(parsed) ? parsed : {};
		} catch {
			return {};
		}
	}
	if (isPayload(raw) && raw.data !== undefined) {
		if (typeof raw.data === "string") {
			try {
				const parsed: unknown = JSON.parse(raw.data);
				return isPayload(parsed) ? parsed : {};
			} catch {
				return {};
			}
		}
		return isPayload(raw.data) ? raw.data : {};
	}
	return isPayload(raw) ? raw : {};
}

function toGrowthMetric(indicator: string): GrowthMetric {
	switch (indicator) {
		case "weight-for-age":
		case "wfa":
			return "wfa";
		case "length-for-age":
		case "lhfa":
			return "lhfa";
		case "weight-for-length":
		case "wfl":
			return "wfl";
		case "bmi-for-age":
		case "bmifa":
			return "bmifa";
		default:
			return "wfa";
	}
}

function toGender(sex: string): Gender {
	return sex === "female" || sex === "girl" ? "girl" : "boy";
}

export const $fetchGrowthChartCurves = createServerFn({
	method: "GET"
})
	.validator((data: unknown) => data as Record<string, unknown>)
	.handler(async (ctx): Promise<ChartCurves> => {
		const payload = parsePayload(ctx?.data ?? ctx);
		const indicator = (payload.indicator || "weight-for-age") as Indicator;
		const sex = (payload.sex || "male") as Sex;
		const gender = toGender(sex);
		const metric = toGrowthMetric(indicator);
		const xAxis: XAxis = metric === "wfl" ? "length" : "age";

		let rangeObj: { min?: number; max?: number } | undefined;
		if (payload.range) {
			if (typeof payload.range === "string") {
				try {
					rangeObj = JSON.parse(payload.range);
				} catch {
					// ignore
				}
			} else if (typeof payload.range === "object") {
				rangeObj = payload.range;
			}
		}

		const lmsPoints = EGYPTIAN_LMS_DATA[gender]?.[metric] || [];
		let points: ChartPoint[] = lmsPoints.map(p => {
			const sUnit: "cv" | "sd" =
				"sUnit" in p && (p.sUnit === "cv" || p.sUnit === "sd") ? p.sUnit : "cv";
			return {
				x: p.x,
				sd3neg:
					p.sd3neg ?? calculateValueFromZScore(-3, p.l, p.m, p.s, sUnit) ?? 0,
				sd2neg:
					p.sd2neg ?? calculateValueFromZScore(-2, p.l, p.m, p.s, sUnit) ?? 0,
				sd1neg:
					p.sd1neg ?? calculateValueFromZScore(-1, p.l, p.m, p.s, sUnit) ?? 0,
				sd0: p.sd0 ?? calculateValueFromZScore(0, p.l, p.m, p.s, sUnit) ?? 0,
				sd1pos:
					p.sd1pos ?? calculateValueFromZScore(1, p.l, p.m, p.s, sUnit) ?? 0,
				sd2pos:
					p.sd2pos ?? calculateValueFromZScore(2, p.l, p.m, p.s, sUnit) ?? 0,
				sd3pos:
					p.sd3pos ?? calculateValueFromZScore(3, p.l, p.m, p.s, sUnit) ?? 0
			};
		});

		if (rangeObj?.min != null) {
			const minVal = rangeObj.min;
			points = points.filter(pt => pt.x >= minVal);
		}
		if (rangeObj?.max != null) {
			const maxVal = rangeObj.max;
			points = points.filter(pt => pt.x <= maxVal);
		}

		return {
			indicator,
			sex,
			xAxis,
			points
		};
	});

export const $fetchGrowthChartBand = createServerFn({ method: "GET" })
	.validator((data: unknown) => data as Record<string, unknown>)
	.handler(async (ctx): Promise<ChartBand> => {
		const payload = parsePayload(ctx?.data ?? ctx);
		const indicator = (payload.indicator || "weight-for-age") as Indicator;
		const sex = (payload.sex || "male") as Sex;
		const gender = toGender(sex);
		const metric = toGrowthMetric(indicator);
		const x = Number(payload.x ?? 0);

		const lms = getInterpolatedLms(gender, metric, x);
		if (!lms) {
			return {
				x,
				sd3neg: 0,
				sd2neg: 0,
				sd1neg: 0,
				sd0: 0,
				sd1pos: 0,
				sd2pos: 0,
				sd3pos: 0
			};
		}

		return {
			x,
			sd3neg: calculateValueFromZScore(-3, lms.l, lms.m, lms.s, lms.sUnit) ?? 0,
			sd2neg: calculateValueFromZScore(-2, lms.l, lms.m, lms.s, lms.sUnit) ?? 0,
			sd1neg: calculateValueFromZScore(-1, lms.l, lms.m, lms.s, lms.sUnit) ?? 0,
			sd0: calculateValueFromZScore(0, lms.l, lms.m, lms.s, lms.sUnit) ?? 0,
			sd1pos: calculateValueFromZScore(1, lms.l, lms.m, lms.s, lms.sUnit) ?? 0,
			sd2pos: calculateValueFromZScore(2, lms.l, lms.m, lms.s, lms.sUnit) ?? 0,
			sd3pos: calculateValueFromZScore(3, lms.l, lms.m, lms.s, lms.sUnit) ?? 0
		};
	});

export const $fetchIndicatorSeries = createServerFn({ method: "GET" })
	.validator((data: unknown) => data as Record<string, unknown>)
	.handler(async (ctx): Promise<GrowthMeasurementRow[]> => {
		await requireSession();
		const payload = parsePayload(ctx?.data ?? ctx);
		const patientId = String(payload.patientId || "");
		const indicator = (payload.indicator ||
			"weight-for-age") as GrowthIndicator;

		if (!patientId) return [];

		const measurements = await listMeasurementsByPatient(patientId);

		const rows: GrowthMeasurementRow[] = [];
		for (const m of measurements) {
			let val: number | null = null;
			let zScore: number | null = null;

			if (indicator === "weight-for-age" || indicator === "weight-for-length") {
				val = m.weight != null ? Number(m.weight) : null;
				zScore =
					indicator === "weight-for-age"
						? m.weightForAgeZ != null
							? Number(m.weightForAgeZ)
							: null
						: m.weightForLengthZ != null
							? Number(m.weightForLengthZ)
							: null;
			} else if (indicator === "length-for-age") {
				val = m.height != null ? Number(m.height) : null;
				zScore = m.lengthForAgeZ != null ? Number(m.lengthForAgeZ) : null;
			} else if (indicator === "bmi-for-age") {
				val = m.bmi != null ? Number(m.bmi) : null;
				zScore = m.bmiForAgeZ != null ? Number(m.bmiForAgeZ) : null;
			}

			if (val == null || val <= 0) continue;

			rows.push({
				id: m.id,
				value: val,
				zScore: zScore ?? undefined,
				percentile: zScore != null ? zScoreToPercentile(zScore) : null,
				classification: m.classification,
				visit: {
					visitedAt: m.date,
					ageMonths: m.ageMonths
				}
			});
		}

		return rows;
	});

export const $fetchFlaggedMeasurements = createServerFn({
	method: "GET"
})
	.validator((data: unknown) => data as Record<string, unknown>)
	.handler(async (ctx): Promise<GrowthMeasurementRow[]> => {
		await requireSession();
		const payload = parsePayload(ctx?.data ?? ctx);
		const patientId = String(payload.patientId || "");
		const zThreshold = Number(payload.zThreshold ?? 2);

		if (!patientId) return [];

		const measurements = await listMeasurementsByPatient(patientId);

		return measurements
			.filter(m => {
				const zWfa =
					m.weightForAgeZ != null ? Math.abs(Number(m.weightForAgeZ)) : 0;
				const zLhfa =
					m.lengthForAgeZ != null ? Math.abs(Number(m.lengthForAgeZ)) : 0;
				const zBmi = m.bmiForAgeZ != null ? Math.abs(Number(m.bmiForAgeZ)) : 0;
				return zWfa >= zThreshold || zLhfa >= zThreshold || zBmi >= zThreshold;
			})
			.map(m => {
				const primaryZ = m.weightForAgeZ ?? m.lengthForAgeZ ?? m.bmiForAgeZ;
				const zScore = primaryZ != null ? Number(primaryZ) : null;
				return {
					id: m.id,
					value: Number(m.weight ?? m.height ?? m.bmi ?? 0),
					zScore,
					percentile: zScore != null ? zScoreToPercentile(zScore) : null,
					classification: m.classification,
					visit: {
						visitedAt: m.date,
						ageMonths: m.ageMonths
					}
				} satisfies GrowthMeasurementRow;
			});
	});
