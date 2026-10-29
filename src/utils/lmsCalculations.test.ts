/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, expect, it } from "vitest";

import {
	calculateBmi,
	calculateLmsZScore,
	calculateValueFromZScore,
	evaluateGrowthMetric,
	getClinicalClassification,
	getInterpolatedLms,
	zScoreToPercentile
} from "./lmsCalculations.ts";

describe("Egyptian LMS Growth Calculation Engine", () => {
	describe("1. Standard Normal CDF & Percentile Accuracy", () => {
		it("accurately maps median (Z = 0) to exactly 50th percentile", () => {
			expect(zScoreToPercentile(0)).toBe(50);
		});

		it("matches known statistical normal distribution benchmarks (+/- 1, 2, 3 SD)", () => {
			// Z = 1 -> 84.13%
			const pPlus1 = zScoreToPercentile(1);
			expect(pPlus1).toBeCloseTo(84.1, 1);

			// Z = -1 -> 15.87%
			const pMinus1 = zScoreToPercentile(-1);
			expect(pMinus1).toBeCloseTo(15.9, 1);

			// Z = 2 -> 97.72%
			const pPlus2 = zScoreToPercentile(2);
			expect(pPlus2).toBeCloseTo(97.7, 1);

			// Z = -2 -> 2.28%
			const pMinus2 = zScoreToPercentile(-2);
			expect(pMinus2).toBeCloseTo(2.3, 1);

			// Z = 3 -> 99.87%
			const pPlus3 = zScoreToPercentile(3);
			expect(pPlus3).toBeCloseTo(99.9, 1);

			// Z = -3 -> 0.13%
			const pMinus3 = zScoreToPercentile(-3);
			expect(pMinus3).toBeCloseTo(0.1, 1);
		});

		it("gracefully handles extreme tail percentiles beyond +/- 5 SD without overflow", () => {
			expect(zScoreToPercentile(-6)).toBe(0.01);
			expect(zScoreToPercentile(-10)).toBe(0.01);
			expect(zScoreToPercentile(6)).toBe(99.99);
			expect(zScoreToPercentile(12)).toBe(99.99);
		});
	});

	describe("2. Exact Median Convergence (Z = 0)", () => {
		it("evaluates to Z = 0 when measured value equals M for any arbitrary L and S", () => {
			// Cole LMS formula: ((M/M)^L - 1) / (L*S) = (1 - 1) / (L*S) = 0
			const testCases = [
				{ l: 0.4589, m: 3.5125, s: 0.1563 },
				{ l: -0.25, m: 14.8, s: 0.12 },
				{ l: 1.0, m: 50.2, s: 2.1 },
				{ l: 0.00001, m: 16.5, s: 0.09 } // L ~ 0
			];

			for (const tc of testCases) {
				const z = calculateLmsZScore(tc.m, tc.l, tc.m, tc.s);
				expect(z).toBe(0);
			}
		});

		it("inverts Z = 0 back to exact M value via inverse LMS formula", () => {
			const m = 12.75;
			const l = 0.38;
			const s = 0.11;
			const recoveredVal = calculateValueFromZScore(0, l, m, s);
			expect(recoveredVal).toBeCloseTo(m, 2);
		});

		it("performs bidirectional roundtrip calculation (X -> Z -> X) accurately", () => {
			const m = 9.85;
			const l = 0.25;
			const s = 0.14;
			const originalX = 11.2;

			const z = calculateLmsZScore(originalX, l, m, s);
			const recoveredX = calculateValueFromZScore(z, l, m, s);
			expect(recoveredX).toBeCloseTo(originalX, 1);
		});
	});

	describe("3. Boundary Edge Cases (Month 0 to Month 228 & Extremes)", () => {
		it("correctly evaluates newborn boy and girl anthropometrics at birth (Month 0)", () => {
			// Month 0 Boy Weight-for-Age (Egyptian Table M = 3.5125 kg)
			const boyBirthWfa = evaluateGrowthMetric("boy", "wfa", 0, 3.5125);
			expect(boyBirthWfa).not.toBeNull();
			expect(boyBirthWfa?.zScore).toBe(0.0);
			expect(boyBirthWfa?.classification).toContain("Normal");

			// Month 0 Girl Length-for-Age (Egyptian Table M = 48.7088 cm)
			const girlBirthLhfa = evaluateGrowthMetric("girl", "lhfa", 0, 48.7088);
			expect(girlBirthLhfa).not.toBeNull();
			expect(girlBirthLhfa?.zScore).toBe(0.0);
		});

		it("correctly evaluates adolescent boundaries at month 228 (19 years)", () => {
			// Month 228 Boy Height-for-Age (Egyptian Table M = 175.8 cm)
			const boy19yHeight = evaluateGrowthMetric("boy", "lhfa", 228, 175.8);
			expect(boy19yHeight).not.toBeNull();
			expect(boy19yHeight?.zScore).toBe(0.0);

			// Month 228 Girl BMI-for-Age (Egyptian Table M = 23.5354 kg/m²)
			const girl19yBmi = evaluateGrowthMetric("girl", "bmifa", 228, 23.5354);
			expect(girl19yBmi).not.toBeNull();
			expect(girl19yBmi?.zScore).toBe(0.0);
		});

		it("handles Weight-for-Length boundaries at 45.0 cm and 120.0 cm", () => {
			// 45.0 cm Boy (Egyptian table M = 2.4598 kg)
			const wfl45 = evaluateGrowthMetric("boy", "wfl", 45.0, 2.4598);
			expect(wfl45).not.toBeNull();
			expect(wfl45?.zScore).toBe(0.0);

			// 120.0 cm Girl (Egyptian table M = 21.8632 kg)
			const wfl120 = evaluateGrowthMetric("girl", "wfl", 120.0, 21.8632);
			expect(wfl120).not.toBeNull();
			expect(wfl120?.zScore).toBe(0.0);
		});

		it("returns safe fallback for non-physiological or zero values", () => {
			expect(calculateLmsZScore(0, 0.5, 10, 0.1)).toBeNull();
			expect(calculateLmsZScore(-5, 0.5, 10, 0.1)).toBeNull();
			expect(calculateBmi(0, 100)).toBeUndefined();
			expect(calculateBmi(10, 0)).toBeUndefined();
		});
	});

	describe("4. Linear Interpolation Correctness", () => {
		it("interpolates exact midpoint parameters for fractional ages", () => {
			const month12 = getInterpolatedLms("boy", "wfa", 12);
			const month13 = getInterpolatedLms("boy", "wfa", 13);
			const month12_5 = getInterpolatedLms("boy", "wfa", 12.5);

			expect(month12).not.toBeNull();
			expect(month13).not.toBeNull();
			expect(month12_5).not.toBeNull();

			if (month12 && month13 && month12_5) {
				const expectedM = (month12.m + month13.m) / 2;
				const expectedL = (month12.l + month13.l) / 2;
				const expectedS = (month12.s + month13.s) / 2;

				expect(month12_5.m).toBeCloseTo(expectedM, 4);
				expect(month12_5.l).toBeCloseTo(expectedL, 4);
				expect(month12_5.s).toBeCloseTo(expectedS, 4);
			}
		});

		it("clamps gracefully to table boundaries when age or length is beyond limits", () => {
			const atZero = getInterpolatedLms("girl", "wfa", 0);
			const belowZero = getInterpolatedLms("girl", "wfa", -5);
			expect(belowZero?.m).toBe(atZero?.m);

			const atMax = getInterpolatedLms("girl", "wfa", 120);
			const beyondMax = getInterpolatedLms("girl", "wfa", 150);
			expect(beyondMax?.m).toBe(atMax?.m);
		});
	});

	describe("5. Clinical Triage Thresholds (WHO & Egyptian Standards)", () => {
		it("classifies Severe Acute Malnutrition (SAM) when WFL/BMI Z < -3", () => {
			const samResult = getClinicalClassification("wfl", -3.2);
			expect(samResult.classification).toBe("Severe Wasting (< -3 SD)");
			expect(samResult.severity).toBe("alert");
		});

		it("classifies Moderate Acute Malnutrition (MAM) when -3 <= Z < -2", () => {
			const mamResult = getClinicalClassification("wfl", -2.4);
			expect(mamResult.classification).toBe("Moderate Wasting (-3 to -2 SD)");
			expect(mamResult.severity).toBe("warning");
		});

		it("classifies Stunting when Length/Height-for-Age Z < -2", () => {
			const stuntingResult = getClinicalClassification("lhfa", -2.35);
			expect(stuntingResult.classification).toBe(
				"Moderate Stunting (-3 to -2 SD)"
			);
			expect(stuntingResult.severity).toBe("warning");

			const severeStunting = getClinicalClassification("lhfa", -3.5);
			expect(severeStunting.classification).toBe("Severe Stunting (< -3 SD)");
			expect(severeStunting.severity).toBe("alert");
		});

		it("classifies Underweight when Weight-for-Age Z < -2", () => {
			const underweight = getClinicalClassification("wfa", -2.2);
			expect(underweight.classification).toBe(
				"Moderate Underweight (-3 to -2 SD)"
			);
			expect(underweight.severity).toBe("warning");
		});

		it("classifies BMI Obesity (+2 to +3 SD) and Severe Obesity (> +3 SD)", () => {
			const obesity = getClinicalClassification("bmifa", 2.3);
			expect(obesity.classification).toBe("BMI Obesity (+2 to +3 SD)");
			expect(obesity.severity).toBe("warning");

			const severeObesity = getClinicalClassification("bmifa", 3.4);
			expect(severeObesity.classification).toBe("BMI Severe Obesity (> +3 SD)");
			expect(severeObesity.severity).toBe("alert");
		});
	});
});
