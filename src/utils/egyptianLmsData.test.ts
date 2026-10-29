import { describe, expect, it } from "vitest";

import { EGYPTIAN_LMS_DATA } from "../data/egyptianLmsData.ts";

describe("Egyptian LMS Data Integrity Test Suite", () => {
	it("satisfies physiological parameter bounds (m > 0, s > 0, -2.5 <= l <= 1.5)", () => {
		for (const [gender, metrics] of Object.entries(EGYPTIAN_LMS_DATA)) {
			for (const [metric, points] of Object.entries(metrics)) {
				for (const point of points) {
					expect(point.m).toBeGreaterThan(0);
					expect(point.s).toBeGreaterThan(0);
					expect(point.l).toBeGreaterThanOrEqual(-2.5);
					expect(point.l).toBeLessThanOrEqual(1.5);
				}
			}
		}
	});

	it("maintains strict median monotonicity for metrics where length/height and weight increase with age", () => {
		for (const [gender, metrics] of Object.entries(EGYPTIAN_LMS_DATA)) {
			for (const [metric, points] of Object.entries(metrics)) {
				if (metric === "wfl" || metric === "bmifa") continue;

				for (let i = 1; i < points.length; i++) {
					const prev = points[i - 1];
					const curr = points[i];
					expect(
						curr.m,
						`Monotonicity failed for ${gender} ${metric} at x=${curr.x}: prev m=${prev.m}, curr m=${curr.m}`
					).toBeGreaterThanOrEqual(prev.m);
				}
			}
		}
	});

	it("contains no outlier row deviating from neighbor average by > 15%", () => {
		for (const [gender, metrics] of Object.entries(EGYPTIAN_LMS_DATA)) {
			for (const [metric, points] of Object.entries(metrics)) {
				for (let i = 1; i < points.length - 1; i++) {
					const prev = points[i - 1];
					const curr = points[i];
					const next = points[i + 1];

					const avgNeighbors = (prev.m + next.m) / 2;
					const relativeDiff = Math.abs(curr.m - avgNeighbors) / avgNeighbors;

					expect(
						relativeDiff,
						`Outlier detected for ${gender} ${metric} at x=${curr.x}: m=${curr.m}, neighbors avg=${avgNeighbors}, diff=${(relativeDiff * 100).toFixed(2)}%`
					).toBeLessThanOrEqual(0.15);
				}
			}
		}
	});
});
