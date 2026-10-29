import type { z } from "zod";

import {
	measurementSelectSchema,
	patientSelectSchema
} from "#/db/validations.ts";

export type Gender = "boy" | "girl";
export type GrowthMetric = "wfa" | "lhfa" | "wfl" | "bmifa";

export const PatientSchema = patientSelectSchema;

export type Patient = z.infer<typeof PatientSchema>;

export const MeasurementSchema = measurementSelectSchema;

export type Measurement = z.infer<typeof MeasurementSchema>;

export type ClinicalSeverity = "normal" | "warning" | "alert";

export interface ZScoreResult {
	zScore: number;
	percentile: number;
	percentileBeyond: "<0.01%" | ">99.99%" | null;
	metric: GrowthMetric;
	measuredValue: number;
	xValue: number;
	clamped: boolean;
	l: number;
	m: number;
	s: number;
	sUnit: "sd" | "cv";
	classification: ClinicalClassification;
	severity: ClinicalSeverity;
}

export type ClinicalClassification =
	| "Severe Underweight (< -3 SD)"
	| "Moderate Underweight (-3 to -2 SD)"
	| "Normal Weight (-2 to +2 SD)"
	| "High Weight (> +2 SD)"
	| "Severe Stunting (< -3 SD)"
	| "Moderate Stunting (-3 to -2 SD)"
	| "Normal Stature (-2 to +2 SD)"
	| "Tall Stature (> +2 SD)"
	| "Severe Wasting (< -3 SD)"
	| "Moderate Wasting (-3 to -2 SD)"
	| "Normal Weight-for-Height (-2 to +1 SD)"
	| "Risk of Overweight (+1 to +2 SD)"
	| "Overweight (+2 to +3 SD)"
	| "Obesity (> +3 SD)"
	| "Severe Thinness (< -3 SD)"
	| "Thinness (-3 to -2 SD)"
	| "Normal BMI (-2 to +1 SD)"
	| "BMI At Risk of Overweight (+1 to +2 SD)"
	| "BMI Overweight (+1 to +2 SD)"
	| "BMI Obesity (+2 to +3 SD)"
	| "BMI Severe Obesity (> +3 SD)"
	| "Out of Reference Range";

export interface PatientGrowthSummary {
	patient: Patient;
	measurements: Measurement[];
	latestMeasurement?: Measurement;
	latestZScores?: {
		wfa?: ZScoreResult;
		lhfa?: ZScoreResult;
		wfl?: ZScoreResult;
		bmifa?: ZScoreResult;
	};
}
