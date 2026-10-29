/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, expect, it } from "vitest";

import { NEONATAL_PEDIATRIC_FORMULARY } from "#/data/neonatalDrugs.ts";

import {
	calculateDrugDosage,
	DoseValidationError
} from "./medicationCalculations.ts";

describe("Pediatric & Neonatal Medication Dosage Calculations", () => {
	const paracetamol = NEONATAL_PEDIATRIC_FORMULARY.find(
		(d: { id: string }) => d.id === "paracetamol"
	)!;
	const gentamicin = NEONATAL_PEDIATRIC_FORMULARY.find(
		d => d.id === "gentamicin"
	)!;
	const ampicillin = NEONATAL_PEDIATRIC_FORMULARY.find(
		d => d.id === "ampicillin"
	)!;
	const epinephrine = NEONATAL_PEDIATRIC_FORMULARY.find(
		d => d.id === "epinephrine"
	)!;

	it("correctly calculates Paracetamol single dose and liquid suspension volume for a 10 kg child", () => {
		// 10 kg * 15 mg/kg = 150 mg
		// 120 mg / 5 mL syrup -> (150 / 120) * 5 = 6.25 mL
		const result = calculateDrugDosage({
			weightKg: 10,
			drug: paracetamol,
			selectedDose: 15,
			selectedConcentrationId: "para-susp-120"
		});

		expect(result.singleDoseMg).toBe(150);
		expect(result.liquidVolumeMl).toBe(6.25);
		expect(result.dailyDoseMg).toBe(600); // 4 doses per day
		expect(result.isCappedBySingleLimit).toBe(false);
	});

	it("calculates infant drops for a 3.5 kg newborn on Paracetamol", () => {
		// 3.5 kg * 15 mg/kg = 52.5 mg
		// Infant drops: 100 mg / 1 mL -> (52.5 / 100) * 1 = 0.525 mL -> 0.53 mL
		const result = calculateDrugDosage({
			weightKg: 3.5,
			drug: paracetamol,
			selectedConcentrationId: "para-drops-100"
		});

		expect(result.singleDoseMg).toBe(52.5);
		expect(result.liquidVolumeMl).toBe(0.53);
	});

	it("calculates Gentamicin extended interval for a 2.0 kg preterm neonate", () => {
		// 2.0 kg * 4 mg/kg = 8.0 mg
		// Pediatric ampoule: 20 mg / 2 mL (10 mg/mL) -> 8.0 / 10 = 0.8 mL
		const result = calculateDrugDosage({
			weightKg: 2.0,
			drug: gentamicin,
			selectedDose: 4,
			selectedConcentrationId: "gent-amp-20"
		});

		expect(result.singleDoseMg).toBe(8);
		expect(result.liquidVolumeMl).toBe(0.8);
		expect(result.dailyDoseMg).toBe(8); // q24h = 1 dose/day
	});

	it("correctly calculates Ampicillin 50 mg/kg for a 3 kg neonate", () => {
		// 3.0 kg * 50 mg/kg = 150 mg
		// Vial: 100 mg / 1 mL -> 1.5 mL
		const result = calculateDrugDosage({
			weightKg: 3.0,
			drug: ampicillin,
			selectedDose: 50,
			selectedConcentrationId: "amp-vial-500"
		});

		expect(result.singleDoseMg).toBe(150);
		expect(result.liquidVolumeMl).toBe(1.5);
		expect(result.dailyDoseMg).toBe(300); // q12h = 2 doses/day
	});

	it("caps dosage at maxSingleDoseMg for high-weight patients", () => {
		// Paracetamol maxSingleDoseMg = 1000 mg
		// An 80 kg patient at 15 mg/kg would calculate to 1200 mg
		const result = calculateDrugDosage({
			weightKg: 80,
			drug: paracetamol,
			selectedDose: 15
		});

		expect(result.singleDoseMg).toBe(1000); // Capped at 1000 mg
		expect(result.isCappedBySingleLimit).toBe(true);
	});

	it("correctly handles mcg/kg/dose conversion for Epinephrine resuscitation", () => {
		// 3.0 kg neonate * 10 mcg/kg = 30 mcg = 0.03 mg
		// 1:10,000 solution (0.1 mg / 1 mL) -> 0.03 / 0.1 = 0.3 mL
		const result = calculateDrugDosage({
			weightKg: 3.0,
			drug: epinephrine,
			selectedDose: 10,
			selectedConcentrationId: "epi-1-10k"
		});

		expect(result.singleDoseMg).toBe(0.03);
		expect(result.liquidVolumeMl).toBe(0.3);
	});

	it("safely handles zero weight or negative values", () => {
		const result = calculateDrugDosage({
			weightKg: 0,
			drug: paracetamol
		});

		expect(result.singleDoseMg).toBe(0);
		expect(result.liquidVolumeMl).toBe(0);
		expect(result.isCappedBySingleLimit).toBe(false);
	});

	it("throws DoseValidationError when selectedDose is 0 or out of drug.minDose/maxDose range", () => {
		// Paracetamol range is 10 to 15 mg/kg/dose
		expect(() =>
			calculateDrugDosage({
				weightKg: 10,
				drug: paracetamol,
				selectedDose: 0
			})
		).toThrow(DoseValidationError);

		expect(() =>
			calculateDrugDosage({
				weightKg: 10,
				drug: paracetamol,
				selectedDose: 25 // Exceeds maxDose = 15
			})
		).toThrow(DoseValidationError);

		expect(() =>
			calculateDrugDosage({
				weightKg: 10,
				drug: paracetamol,
				selectedDose: 5 // Below minDose = 10
			})
		).toThrow(DoseValidationError);
	});

	it("distinguishes cappedBy as single, daily, or both", () => {
		// Drug with maxSingleDoseMg = 500, maxDailyDoseMg = 2000, dosesPerDay = 2
		// 50 kg at 15 mg/kg -> single = 750 mg (>500) -> capped at 500 mg. Daily = 2 * 500 = 1000 mg (<2000)
		const singleOnlyDrug = {
			...paracetamol,
			maxSingleDoseMg: 500,
			maxDailyDoseMg: 2000,
			dosesPerDay: 2
		};
		const singleCappedResult = calculateDrugDosage({
			weightKg: 50,
			drug: singleOnlyDrug,
			selectedDose: 15
		});
		expect(singleCappedResult.cappedBy).toBe("single");
		expect(singleCappedResult.isCappedBySingleLimit).toBe(true);
		expect(singleCappedResult.isCappedByDailyLimit).toBe(false);

		// An imaginary drug with maxDailyDoseMg = 200 mg, maxSingleDoseMg = 100 mg, dosesPerDay = 3
		// At 10 kg, dose = 15 mg/kg -> single = 150 mg (>100), daily = 450 mg (>200) -> both capped
		const bothCappedDrug = {
			...paracetamol,
			maxSingleDoseMg: 100,
			maxDailyDoseMg: 200,
			dosesPerDay: 3
		};
		const bothCappedResult = calculateDrugDosage({
			weightKg: 10,
			drug: bothCappedDrug,
			selectedDose: 15
		});
		expect(bothCappedResult.cappedBy).toBe("both");
	});

	it("surfaces requiresConcentrationConfirmation when non-default ampoule concentration is chosen", () => {
		// gent-amp-20 is default -> requiresConcentrationConfirmation: false
		const defaultResult = calculateDrugDosage({
			weightKg: 3.0,
			drug: gentamicin,
			selectedConcentrationId: "gent-amp-20"
		});
		expect(defaultResult.requiresConcentrationConfirmation).toBe(false);

		// gent-amp-80 is adult non-default -> requiresConcentrationConfirmation: true
		const adultAmpResult = calculateDrugDosage({
			weightKg: 3.0,
			drug: gentamicin,
			selectedConcentrationId: "gent-amp-80"
		});
		expect(adultAmpResult.requiresConcentrationConfirmation).toBe(true);
	});
});
