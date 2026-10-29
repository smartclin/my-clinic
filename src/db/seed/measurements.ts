// src/db/seed/measurements.ts
import { evaluateGrowthMetric } from "@/utils/lmsCalculations";

import type { NewMeasurement, Patient } from "../schema";
import { SEED_ADMIN_ID } from "./user";

/**
 * Build measurements for one patient, computing Z-scores on the fly
 * from the Egyptian LMS reference data, so the DB stays authoritative.
 */
export function buildMeasurementsFor(
	patient: Pick<Patient, "id" | "gender">,
	createdBy: string = SEED_ADMIN_ID
): NewMeasurement[] {
	const raw = RAW_MEASUREMENTS.filter(m => m.patientId === patient.id);

	return raw.map(m => {
		const bmi =
			m.weight && m.height
				? Number((m.weight / (m.height / 100) ** 2).toFixed(2))
				: undefined;

		const wfaZ =
			m.weight && m.ageMonths <= 120
				? evaluateGrowthMetric(patient.gender, "wfa", m.ageMonths, m.weight)
						?.zScore
				: undefined;
		const lhfaZ =
			m.height && m.ageMonths <= 228
				? evaluateGrowthMetric(patient.gender, "lhfa", m.ageMonths, m.height)
						?.zScore
				: undefined;
		const bmifaZ =
			bmi && m.ageMonths <= 228
				? evaluateGrowthMetric(patient.gender, "bmifa", m.ageMonths, bmi)
						?.zScore
				: undefined;
		const wflZ =
			m.weight && m.height && m.height >= 45 && m.height <= 120
				? evaluateGrowthMetric(patient.gender, "wfl", m.height, m.weight)
						?.zScore
				: undefined;

		return {
			patientId: patient.id,
			date: m.date,
			ageMonths: m.ageMonths,
			weight: m.weight,
			height: m.height,
			headCircumference: m.headCircumference,
			bmi,
			weightForAgeZ: wfaZ,
			lengthForAgeZ: lhfaZ,
			bmiForAgeZ: bmifaZ,
			weightForLengthZ: wflZ,
			classification: buildClassification(wfaZ, lhfaZ, bmifaZ),
			notes: m.notes,
			createdBy
		};
	});
}

function buildClassification(
	wfaZ?: number,
	lhfaZ?: number,
	bmifaZ?: number
): string {
	if (wfaZ !== undefined && wfaZ < -2) return "Underweight";
	if (lhfaZ !== undefined && lhfaZ < -2) return "Stunted";
	if (bmifaZ !== undefined && bmifaZ > 2) return "Overweight";
	return "Normal";
}

// Complete raw anthropometric measurements for seeded patients
const RAW_MEASUREMENTS = [
	// ── 1. Youssef Ahmed (boy, DOB 2024-04-15) ─────────────────────────────
	{
		patientId: "00000000-0000-4000-8000-000000001001",
		date: "2024-04-15",
		ageMonths: 0,
		weight: 3.5,
		height: 50.0,
		headCircumference: 35.0,
		notes: "Birth assessment. Normal vigorous cry. Apgar 9/10."
	},
	{
		patientId: "00000000-0000-4000-8000-000000001001",
		date: "2024-06-15",
		ageMonths: 2,
		weight: 5.6,
		height: 58.0,
		headCircumference: 38.5,
		notes:
			"2-month well-child visit. Consistent weight gain along 50th percentile."
	},
	{
		patientId: "00000000-0000-4000-8000-000000001001",
		date: "2024-07-15",
		ageMonths: 3,
		weight: 6.6,
		height: 61.0,
		headCircumference: 40.5,
		notes: "3-month vaccination follow-up."
	},
	{
		patientId: "00000000-0000-4000-8000-000000001001",
		date: "2024-08-15",
		ageMonths: 4,
		weight: 7.2,
		height: 64.0,
		headCircumference: 41.5,
		notes: "4-month checkup. Steady linear growth and head circumference."
	},
	{
		patientId: "00000000-0000-4000-8000-000000001001",
		date: "2024-10-15",
		ageMonths: 6,
		weight: 8.1,
		height: 67.5,
		headCircumference: 43.0,
		notes: "6-month checkup. Acute otitis media evaluated. Weaning initiated."
	},
	{
		patientId: "00000000-0000-4000-8000-000000001001",
		date: "2025-01-15",
		ageMonths: 9,
		weight: 9.2,
		height: 72.0,
		headCircumference: 44.5,
		notes: "9-month milestone check. Crawling actively."
	},
	{
		patientId: "00000000-0000-4000-8000-000000001001",
		date: "2025-04-15",
		ageMonths: 12,
		weight: 10.3,
		height: 76.5,
		headCircumference: 46.0,
		notes: "1-year well-child examination. Standing with support."
	},

	// ── 2. Nour El-Din Hassan (girl, DOB 2022-08-10) ────────────────────────
	{
		patientId: "00000000-0000-4000-8000-000000001002",
		date: "2022-08-10",
		ageMonths: 0,
		weight: 3.2,
		height: 49.0,
		headCircumference: 34.0,
		notes: "Full-term spontaneous vaginal delivery. Uneventful neonatal period."
	},
	{
		patientId: "00000000-0000-4000-8000-000000001002",
		date: "2023-02-10",
		ageMonths: 6,
		weight: 7.2,
		height: 65.0,
		headCircumference: 42.0,
		notes: "6-month checkup. Sits with support."
	},
	{
		patientId: "00000000-0000-4000-8000-000000001002",
		date: "2023-08-10",
		ageMonths: 12,
		weight: 8.8,
		height: 73.0,
		headCircumference: 44.8,
		notes: "12-month checkup. Walking independently."
	},
	{
		patientId: "00000000-0000-4000-8000-000000001002",
		date: "2024-02-10",
		ageMonths: 18,
		weight: 9.5,
		height: 78.5,
		headCircumference: 46.0,
		notes:
			"Initial mild stunting noticed (HAZ -2.1 SD). Started zinc supplementation."
	},
	{
		patientId: "00000000-0000-4000-8000-000000001002",
		date: "2024-08-10",
		ageMonths: 24,
		weight: 11.6,
		height: 86.5,
		headCircumference: 47.5,
		notes:
			"Significant catch-up growth on zinc supplementation (HAZ normalized to -0.35 SD)."
	},

	// ── 3. Kareem Mostafa (boy, DOB 2025-09-01) ─────────────────────────────
	{
		patientId: "00000000-0000-4000-8000-000000001003",
		date: "2025-09-01",
		ageMonths: 0,
		weight: 3.4,
		height: 50.5,
		headCircumference: 34.8,
		notes: "Newborn evaluation in nursery. Healthy male infant."
	},
	{
		patientId: "00000000-0000-4000-8000-000000001003",
		date: "2025-10-01",
		ageMonths: 1,
		weight: 4.4,
		height: 54.5,
		headCircumference: 37.2,
		notes: "1-month visit. Exclusive breastfeeding. Infantile colic addressed."
	},
	{
		patientId: "00000000-0000-4000-8000-000000001003",
		date: "2025-11-01",
		ageMonths: 2,
		weight: 5.5,
		height: 58.5,
		headCircumference: 39.0,
		notes: "2-month visit. Excellent growth velocity."
	}
];
