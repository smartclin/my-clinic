/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Pure Medication Dosage Calculation Functions
 * Decoupled, unit-tested mathematical engine for pediatric & neonatal dosing.
 */

import type {
	CalculatedDosageResult,
	DoseSemantics,
	DrugConcentration,
	DrugFormularyItem
} from "../types/medication.ts";

export class DoseValidationError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "DoseValidationError";
	}
}

export interface CalculationInput {
	weightKg: number;
	drug: DrugFormularyItem;
	selectedDose?: number; // Optional override; defaults to drug.standardDose
	selectedConcentrationId?: string; // Optional concentration ID
}

/**
 * Calculates exact single and daily dosages, applies safety caps, and computes liquid suspension volume in mL.
 */
export function calculateDrugDosage(
	input: CalculationInput
): CalculatedDosageResult {
	const { weightKg, drug } = input;
	const safeWeight = Math.max(0, Number(weightKg) || 0);

	if (typeof input.selectedDose === "number") {
		if (
			input.selectedDose <= 0 ||
			Number.isNaN(input.selectedDose) ||
			input.selectedDose < drug.minDose ||
			input.selectedDose > drug.maxDose
		) {
			throw new DoseValidationError(
				`Selected dose ${input.selectedDose} is out of safe range [${drug.minDose}, ${drug.maxDose}] ${drug.doseUnit} for ${drug.name}.`
			);
		}
	}

	const dose =
		typeof input.selectedDose === "number" && !Number.isNaN(input.selectedDose)
			? input.selectedDose
			: drug.standardDose;

	// Resolve selected concentration
	const concentration: DrugConcentration | undefined =
		drug.concentrations.find(c => c.id === input.selectedConcentrationId) ||
		drug.concentrations.find(c => c.isDefault) ||
		drug.concentrations[0];

	// Flag if selected concentration is non-default (e.g. Adult ampoule on NICU cart)
	const requiresConcentrationConfirmation = Boolean(
		concentration && !concentration.isDefault
	);

	let semantics: DoseSemantics;
	switch (drug.doseUnit) {
		case "mg/kg/dose": {
			const rawSingleMg = safeWeight * dose;
			semantics = {
				kind: "per_dose",
				rawSingleMg,
				rawDailyMg: rawSingleMg * (drug.dosesPerDay || 1)
			};
			break;
		}
		case "mg/kg/day": {
			const rawDailyMg = safeWeight * dose;
			semantics = {
				kind: "per_day",
				rawDailyMg,
				rawSingleMg:
					drug.dosesPerDay > 0 ? rawDailyMg / drug.dosesPerDay : rawDailyMg
			};
			break;
		}
		case "mcg/kg/dose": {
			const rawSingleMg = (safeWeight * dose) / 1000;
			semantics = {
				kind: "per_dose",
				rawSingleMg,
				rawDailyMg: rawSingleMg * (drug.dosesPerDay || 1)
			};
			break;
		}
		case "mcg/kg/min": {
			// Continuous infusion (e.g. Inotropes)
			const rawSingleMcg = safeWeight * dose;
			semantics = {
				kind: "per_minute",
				rawSingleMg: rawSingleMcg / 1000,
				rawDailyMg: (rawSingleMcg * 60 * 24) / 1000
			};
			break;
		}
		default: {
			semantics = {
				kind: "fixed",
				rawSingleMg: dose,
				rawDailyMg: dose * (drug.dosesPerDay || 1)
			};
			break;
		}
	}

	const { rawSingleMg, rawDailyMg } = semantics;

	// Safety Dose Capping tracking
	let singleDoseMg = rawSingleMg;
	let dailyDoseMg = rawDailyMg;
	let singleCapHit = false;
	let dailyCapHit = false;

	if (drug.maxSingleDoseMg && singleDoseMg > drug.maxSingleDoseMg) {
		singleDoseMg = drug.maxSingleDoseMg;
		singleCapHit = true;
		dailyDoseMg = singleDoseMg * (drug.dosesPerDay || 1);
	}

	if (
		drug.maxDailyDoseMg &&
		(rawDailyMg > drug.maxDailyDoseMg || dailyDoseMg > drug.maxDailyDoseMg)
	) {
		dailyDoseMg = drug.maxDailyDoseMg;
		dailyCapHit = true;
		if (drug.dosesPerDay > 0) {
			singleDoseMg = dailyDoseMg / drug.dosesPerDay;
		}
	}

	const cappedBy: "single" | "daily" | "both" | null =
		singleCapHit && dailyCapHit
			? "both"
			: singleCapHit
				? "single"
				: dailyCapHit
					? "daily"
					: null;

	const isCappedBySingleLimit = singleCapHit;
	const isCappedByDailyLimit = dailyCapHit;

	// Liquid suspension volume calculation
	let liquidVolumeMl: number | undefined;
	if (concentration && concentration.mg > 0 && concentration.ml > 0) {
		const volume = (singleDoseMg / concentration.mg) * concentration.ml;
		// Format to 2 decimal places for accuracy
		liquidVolumeMl = Math.round(volume * 100) / 100;
	}

	// Generate unambiguous clinical prescription instruction
	const singleFormatted =
		singleDoseMg >= 1
			? singleDoseMg.toFixed(1).replace(/\.0$/, "")
			: singleDoseMg.toFixed(2);
	const volFormatted =
		typeof liquidVolumeMl === "number"
			? liquidVolumeMl >= 10
				? liquidVolumeMl.toFixed(1).replace(/\.0$/, "")
				: liquidVolumeMl.toFixed(2).replace(/\.00$/, "")
			: null;

	const prescriptionText =
		concentration && volFormatted !== null
			? `${drug.name} (${concentration.label}): Administer ${volFormatted} mL (${singleFormatted} mg) ${concentration.route} ${drug.frequency}.`
			: `${drug.name}: Administer ${singleFormatted} mg ${drug.routes[0] || "IV"} ${drug.frequency}.`;

	return {
		weightKg: safeWeight,
		selectedDose: dose,
		doseUnit: drug.doseUnit,
		singleDoseMg: Math.round(singleDoseMg * 100) / 100,
		dailyDoseMg: Math.round(dailyDoseMg * 100) / 100,
		isCappedBySingleLimit,
		isCappedByDailyLimit,
		cappedBy,
		cappedSingleDoseMg: drug.maxSingleDoseMg,
		cappedDailyDoseMg: drug.maxDailyDoseMg,
		requiresConcentrationConfirmation,
		liquidVolumeMl,
		selectedConcentration: concentration,
		prescriptionText
	};
}
