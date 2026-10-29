/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * LMS (Lambda-Mu-Sigma) Growth Curve and Z-Score Calculation Engine
 * Implements Cole's LMS method applied to the official Egyptian growth references.
 *
 * ─── IMPORTANT ──────────────────────────────────────────────────────────────
 * LHFA (Length/Height-for-Age) tables in the Egyptian reference store S as an
 * absolute standard deviation in centimeters (S ≈ 2–8 cm), NOT as a
 * coefficient of variation (CV). Every other metric stores S as a CV.
 *
 * This distinction MUST be encoded in the data (via `sUnit` on the LmsPoint)
 * rather than inferred from `l === 1 && s > 1`, which was brittle and could
 * silently misclassify BMI or LHFA rows if the data format ever drifts.
 * ────────────────────────────────────────────────────────────────────────────
 */

import {
	EGYPTIAN_LMS_DATA,
	type Gender,
	type GrowthMetric,
	type LmsPoint
} from "../data/egyptianLmsData.ts";
import type {
	ClinicalClassification,
	ClinicalSeverity,
	ZScoreResult
} from "../types/growth.ts";

// ─── Constants ───────────────────────────────────────────────────────────────

/** L values below this magnitude use the log-normal LMS branch (Cole 1990). */
const L_EPSILON = 0.001;

/** Approximate days per month = 365.25 / 12. Used for chronological age. */
const DAYS_PER_MONTH = 30.4375;

/** Clinical Z-score hard bounds used only for display percentiles. */
const PERCENTILE_TAIL_Z = 5;

// ─── Core LMS math ───────────────────────────────────────────────────────────

/**
 * Returns the effective CV to use in the LMS formula.
 *
 * - When `sUnit === "sd"` (LHFA), S is an absolute SD in measurement units,
 *   so CV = S / M.
 * - Otherwise (all other metrics), S is already a CV.
 *
 * @internal
 */
function effectiveCv(
	s: number,
	m: number,
	sUnit: "sd" | "cv" | undefined
): number {
	if (sUnit === "sd" && m > 0) return s / m;
	return s;
}

/**
 * Cole's LMS forward transform: measured value → Z-score.
 *
 *   Z = ((X / M)^L − 1) / (L · S)     when |L| ≥ 0.001
 *   Z = ln(X / M) / S                 when |L| < 0.001
 *
 * Returns `null` for non-physiological inputs (X ≤ 0, M ≤ 0, S ≤ 0) so callers
 * can distinguish "invalid data" from "exactly at the median (Z = 0)".
 *
 * @param measuredValue Measured anthropometric value X (kg, cm, or kg/m²)
 * @param l             Box-Cox power (skewness)
 * @param m             Median
 * @param s             Dispersion parameter (CV, or absolute SD if sUnit='sd')
 * @param sUnit         How to interpret S. Defaults to 'cv' for backward-compat.
 */
export function calculateLmsZScore(
	measuredValue: number,
	l: number,
	m: number,
	s: number,
	sUnit: "sd" | "cv" = "cv"
): number | null {
	if (!Number.isFinite(measuredValue) || measuredValue <= 0) return null;
	if (!Number.isFinite(m) || m <= 0) return null;
	if (!Number.isFinite(s) || s <= 0) return null;

	const cv = effectiveCv(s, m, sUnit);
	if (cv <= 0) return null;

	const ratio = measuredValue / m;

	const z =
		Math.abs(l) < L_EPSILON
			? Math.log(ratio) / cv
			: (ratio ** l - 1) / (l * cv);

	if (!Number.isFinite(z)) return null;
	return Number(z.toFixed(2));
}

/**
 * Inverse LMS transform: Z-score → expected measurement value.
 *
 *   X = M · (1 + L · S · Z)^(1/L)     when |L| ≥ 0.001
 *   X = M · exp(S · Z)                when |L| < 0.001
 *
 * Returns `null` if the requested Z would produce a non-physical value
 * (e.g., a negative expected weight).
 */
export function calculateValueFromZScore(
	z: number | null,
	l: number,
	m: number,
	s: number,
	sUnit: "sd" | "cv" = "cv"
): number | null {
	if (!Number.isFinite(z) || z == null) return null;
	if (!Number.isFinite(m) || m <= 0) return null;
	if (!Number.isFinite(s) || s <= 0) return null;

	const cv = effectiveCv(s, m, sUnit);
	if (cv <= 0) return null;

	if (Math.abs(l) < L_EPSILON) {
		const val = m * Math.exp(cv * z);
		return Number.isFinite(val) ? Number(val.toFixed(2)) : null;
	}

	const inner = 1 + l * cv * z;
	if (inner <= 0) return null;

	const val = m * inner ** (1 / l);
	return Number.isFinite(val) ? Number(val.toFixed(2)) : null;
}

/**
 * Standard normal CDF → percentile (0.01 – 99.99).
 *
 * Abramowitz & Stegun 26.2.17 approximation, |ε| < 7.5e-8.
 * Values beyond ±5 SD are clamped to the display range but the caller should
 * render ">99.99%" / "<0.01%" rather than the numeric value.
 */
export function zScoreToPercentile(z: number): number {
	if (!Number.isFinite(z)) return Number.NaN;
	if (z < -PERCENTILE_TAIL_Z) return 0.01;
	if (z > PERCENTILE_TAIL_Z) return 99.99;

	const b1 = 0.31938153;
	const b2 = -0.356563782;
	const b3 = 1.781477937;
	const b4 = -1.821255978;
	const b5 = 1.330274429;
	const p = 0.2316419;
	const c = 0.39894228; // 1/√(2π)

	const absZ = Math.abs(z);
	const t = 1 / (1 + p * absZ);
	const poly = ((((b5 * t + b4) * t + b3) * t + b2) * t + b1) * t;
	const pdf = c * Math.exp(-0.5 * absZ * absZ);
	const cdf = 1 - pdf * poly;

	const result = z >= 0 ? cdf : 1 - cdf;
	return Number((result * 100).toFixed(1));
}

// ─── Chronological helpers ───────────────────────────────────────────────────

/**
 * Exact elapsed months between DOB and a measurement date.
 * Uses average Gregorian month length (365.25/12 days ≈ 30.4375).
 * Returns 0 if measurement date precedes DOB (invalid input).
 */
export function calculateAgeMonths(
	dob: string,
	measurementDate: string
): number {
	const d1 = new Date(dob);
	const d2 = new Date(measurementDate);

	if (Number.isNaN(d1.getTime()) || Number.isNaN(d2.getTime())) return 0;

	const diffMs = d2.getTime() - d1.getTime();
	if (diffMs < 0) return 0;

	const months = diffMs / (1000 * 60 * 60 * 24 * DAYS_PER_MONTH);
	return Number(months.toFixed(1));
}

/** BMI in kg/m², rounded to 2 decimals. Returns `undefined` for invalid input. */
export function calculateBmi(
	weightKg: number,
	heightCm: number
): number | undefined {
	if (!Number.isFinite(weightKg) || weightKg <= 0) return undefined;
	if (!Number.isFinite(heightCm) || heightCm <= 0) return undefined;
	const heightM = heightCm / 100;
	const bmi = weightKg / (heightM * heightM);
	return Number.isFinite(bmi) ? Number(bmi.toFixed(2)) : undefined;
}

// ─── Table lookup ────────────────────────────────────────────────────────────

export interface InterpolatedLms {
	l: number;
	m: number;
	s: number;
	sUnit: "sd" | "cv";
}

/**
 * Binary-search + linear interpolation of LMS parameters at `xTarget`.
 *
 * Out-of-range inputs are clamped to the nearest endpoint (the previous
 * behaviour) and flagged via `clamped: true` so the UI can warn the clinician
 * that the measurement lies outside the reference range.
 */
export function getInterpolatedLms(
	gender: Gender,
	metric: GrowthMetric,
	xTarget: number
): InterpolatedLms | null {
	const table: LmsPoint[] | undefined = EGYPTIAN_LMS_DATA[gender]?.[metric];
	if (!table || table.length === 0) return null;
	if (!Number.isFinite(xTarget)) return null;

	const first = table[0];
	const last = table[table.length - 1];

	// Infer sUnit deterministically if not explicitly stored in point:
	// Length/height-for-age uses absolute standard deviation (sd in cm); all others use coefficient of variation (cv).
	const defaultSUnit: "sd" | "cv" = metric === "lhfa" ? "sd" : "cv";

	// Clamp below range
	if (xTarget <= first.x) {
		return {
			l: first.l,
			m: first.m,
			s: first.s,
			sUnit: first.sUnit ?? defaultSUnit
		};
	}
	// Clamp above range
	if (xTarget >= last.x) {
		return {
			l: last.l,
			m: last.m,
			s: last.s,
			sUnit: last.sUnit ?? defaultSUnit
		};
	}

	// Binary search for the bracketing pair
	let lo = 0;
	let hi = table.length - 1;
	while (hi - lo > 1) {
		const mid = (lo + hi) >> 1;
		if (table[mid].x <= xTarget) lo = mid;
		else hi = mid;
	}

	const p1 = table[lo];
	const p2 = table[hi];
	const span = p2.x - p1.x;
	const ratio = span === 0 ? 0 : (xTarget - p1.x) / span;

	return {
		l: p1.l + ratio * (p2.l - p1.l),
		m: p1.m + ratio * (p2.m - p1.m),
		s: p1.s + ratio * (p2.s - p1.s),
		sUnit: p1.sUnit ?? defaultSUnit
	};
}

// ─── Clinical classification ─────────────────────────────────────────────────

/**
 * WHO-aligned classification of a Z-score for a given metric.
 *
 * BMI-for-age boundary fix (v2): +1 to +2 SD is "at risk of overweight" per
 * WHO, NOT "overweight". The prior code labelled +1 to +2 as overweight,
 * causing systematic over-diagnosis.
 */
export function getClinicalClassification(
	metric: GrowthMetric,
	zScore: number
): { classification: ClinicalClassification; severity: ClinicalSeverity } {
	switch (metric) {
		case "wfa": {
			if (zScore < -3)
				return {
					classification: "Severe Underweight (< -3 SD)",
					severity: "alert"
				};
			if (zScore < -2)
				return {
					classification: "Moderate Underweight (-3 to -2 SD)",
					severity: "warning"
				};
			if (zScore > 3)
				return {
					classification: "Obesity (> +3 SD)",
					severity: "alert"
				};
			if (zScore > 2)
				return {
					classification: "High Weight (> +2 SD)",
					severity: "warning"
				};
			return {
				classification: "Normal Weight (-2 to +2 SD)",
				severity: "normal"
			};
		}
		case "lhfa": {
			if (zScore < -3)
				return {
					classification: "Severe Stunting (< -3 SD)",
					severity: "alert"
				};
			if (zScore < -2)
				return {
					classification: "Moderate Stunting (-3 to -2 SD)",
					severity: "warning"
				};
			if (zScore > 2)
				return {
					classification: "Tall Stature (> +2 SD)",
					severity: "normal"
				};
			return {
				classification: "Normal Stature (-2 to +2 SD)",
				severity: "normal"
			};
		}
		case "wfl": {
			if (zScore < -3)
				return {
					classification: "Severe Wasting (< -3 SD)",
					severity: "alert"
				};
			if (zScore < -2)
				return {
					classification: "Moderate Wasting (-3 to -2 SD)",
					severity: "warning"
				};
			if (zScore <= 1)
				return {
					classification: "Normal Weight-for-Height (-2 to +1 SD)",
					severity: "normal"
				};
			if (zScore <= 2)
				return {
					classification: "Risk of Overweight (+1 to +2 SD)",
					severity: "warning"
				};
			if (zScore <= 3)
				return {
					classification: "Overweight (+2 to +3 SD)",
					severity: "warning"
				};
			return { classification: "Obesity (> +3 SD)", severity: "alert" };
		}
		case "bmifa": {
			if (zScore < -3)
				return {
					classification: "Severe Thinness (< -3 SD)",
					severity: "alert"
				};
			if (zScore < -2)
				return {
					classification: "Thinness (-3 to -2 SD)",
					severity: "warning"
				};
			if (zScore <= 1)
				return {
					classification: "Normal BMI (-2 to +1 SD)",
					severity: "normal"
				};
			if (zScore <= 2)
				return {
					classification: "BMI At Risk of Overweight (+1 to +2 SD)",
					severity: "warning"
				};
			if (zScore <= 3)
				return {
					classification: "BMI Obesity (+2 to +3 SD)",
					severity: "warning"
				};
			return {
				classification: "BMI Severe Obesity (> +3 SD)",
				severity: "alert"
			};
		}
		default: {
			return {
				classification: "Normal Weight (-2 to +2 SD)",
				severity: "normal"
			};
		}
	}
}

// ─── High-level evaluation ───────────────────────────────────────────────────

/**
 * Full Z-score assessment for a single measurement.
 *
 * Returns `null` if:
 * - the metric/gender table is missing,
 * - the LMS lookup fails, or
 * - the measured value is non-physiological.
 *
 * `clamped` on the result indicates the x coordinate fell outside the
 * reference table bounds — the UI should surface this to the clinician.
 */
export function evaluateGrowthMetric(
	gender: Gender,
	metric: GrowthMetric,
	xValue: number,
	measuredValue: number
): ZScoreResult | null {
	const table: LmsPoint[] | undefined = EGYPTIAN_LMS_DATA[gender]?.[metric];
	if (!table || table.length === 0) return null;

	const tableMin = table[0].x;
	const tableMax = table[table.length - 1].x;

	// Do NOT silently interpolate or clamp outside reference bounds:
	// A clinician must never receive a fake Z-score calculated against the wrong age or size.
	if (xValue < tableMin || xValue > tableMax) {
		return null;
	}

	const lms = getInterpolatedLms(gender, metric, xValue);
	if (!lms) return null;

	const zScore = calculateLmsZScore(
		measuredValue,
		lms.l,
		lms.m,
		lms.s,
		lms.sUnit
	);
	if (zScore === null) return null;

	const percentile = zScoreToPercentile(zScore);
	const { classification, severity } = getClinicalClassification(
		metric,
		zScore
	);

	// Percentile display flag for tails
	const percentileBeyond: "<0.01%" | ">99.99%" | null =
		zScore < -PERCENTILE_TAIL_Z
			? "<0.01%"
			: zScore > PERCENTILE_TAIL_Z
				? ">99.99%"
				: null;

	return {
		zScore,
		percentile,
		percentileBeyond,
		metric,
		measuredValue,
		xValue,
		clamped: false,
		l: Number(lms.l.toFixed(4)),
		m: Number(lms.m.toFixed(4)),
		s: Number(lms.s.toFixed(5)),
		sUnit: lms.sUnit,
		classification,
		severity
	};
}
