/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Pediatric Emergency Resuscitation Calculation Engine
 * Aligned with AHA PALS (Pediatric Advanced Life Support),
 * ERC Guidelines, and Egyptian Pediatric Intensive Care Protocols.
 */

import type {
	AirwayEquipmentMatrix,
	ElectricalTherapyMatrix,
	EmergencyDrugCalculation,
	EmergencyResuscitationSummary
} from "../types/resuscitation.ts";

/**
 * Estimates pediatric age in months from weight in kg when age is unknown
 * based on standard WHO / Egyptian median growth percentiles.
 */
export function estimateAgeMonthsFromWeight(weightKg: number): number {
	if (weightKg <= 3.5) return 0; // Term newborn
	if (weightKg <= 5.5) return 2;
	if (weightKg <= 7.5) return 6;
	if (weightKg <= 9.0) return 9;
	if (weightKg <= 10.0) return 12; // 1 year
	if (weightKg <= 12.0) return 24; // 2 years
	if (weightKg <= 14.0) return 36; // 3 years
	if (weightKg <= 16.0) return 48; // 4 years
	if (weightKg <= 18.0) return 60; // 5 years
	if (weightKg <= 21.0) return 72; // 6 years
	if (weightKg <= 24.0) return 84; // 7 years
	if (weightKg <= 27.0) return 96; // 8 years
	if (weightKg <= 31.0) return 120; // 10 years
	if (weightKg <= 40.0) return 144; // 12 years
	return 180; // 15+ years
}

/**
 * Computes pediatric airway equipment sizes and insertion depths.
 */
export function calculateAirwayEquipment(
	weightKg: number,
	ageMonths?: number
): AirwayEquipmentMatrix {
	const safeWeight = Math.max(0.5, Number(weightKg) || 10);
	const safeAgeMonths =
		typeof ageMonths === "number" && ageMonths >= 0
			? ageMonths
			: estimateAgeMonthsFromWeight(safeWeight);

	const ageYears = safeAgeMonths / 12;

	let cuffedEtTubeSize: number;
	let uncuffedEtTubeSize: number;
	let insertionDepthLipCm: number;
	let laryngoscopeBladeSize: string;
	let laryngoscopeBladeType:
		| "Miller (Straight)"
		| "Macintosh (Curved)"
		| "Either";
	let suctionCatheterFr: number;
	let bagValveMaskSize: "Neonatal" | "Infant" | "Pediatric" | "Adult";
	let chestTubeSizeFr: string;
	let lmaSize: string;

	if (safeWeight < 1.0) {
		// Extreme Preterm (<1000g)
		cuffedEtTubeSize = 2.5;
		uncuffedEtTubeSize = 2.5;
		insertionDepthLipCm = 6.5;
		laryngoscopeBladeSize = "Miller 00 / 0";
		laryngoscopeBladeType = "Miller (Straight)";
		suctionCatheterFr = 5;
		bagValveMaskSize = "Neonatal";
		chestTubeSizeFr = "8 - 10 Fr";
		lmaSize = "Size 1 (Caution)";
	} else if (safeWeight < 2.5) {
		// Preterm / Low Birth Weight
		cuffedEtTubeSize = 3.0;
		uncuffedEtTubeSize = 3.0;
		insertionDepthLipCm = safeWeight + 6; // Tochen formula for neonates: wt (kg) + 6 cm
		laryngoscopeBladeSize = "Miller 0";
		laryngoscopeBladeType = "Miller (Straight)";
		suctionCatheterFr = 6;
		bagValveMaskSize = "Neonatal";
		chestTubeSizeFr = "8 - 10 Fr";
		lmaSize = "Size 1";
	} else if (safeAgeMonths < 12 || safeWeight < 10) {
		// Term Infant (0 - 12 Months)
		if (safeAgeMonths < 3 || safeWeight < 4.5) {
			cuffedEtTubeSize = 3.0;
			uncuffedEtTubeSize = 3.5;
			insertionDepthLipCm = 9.5;
			laryngoscopeBladeSize = "Miller 0 or 1";
			laryngoscopeBladeType = "Miller (Straight)";
			suctionCatheterFr = 6;
			bagValveMaskSize = "Infant";
			chestTubeSizeFr = "10 - 12 Fr";
			lmaSize = "Size 1 (up to 5 kg)";
		} else {
			cuffedEtTubeSize = 3.5;
			uncuffedEtTubeSize = 4.0;
			insertionDepthLipCm = 10.5;
			laryngoscopeBladeSize = "Miller 1";
			laryngoscopeBladeType = "Miller (Straight)";
			suctionCatheterFr = 8;
			bagValveMaskSize = "Infant";
			chestTubeSizeFr = "10 - 12 Fr";
			lmaSize = "Size 1.5 (5 - 10 kg)";
		}
	} else {
		// Child 1 Year and Older: PALS Modified Khine Formulas
		// Cuffed formula: (Age / 4) + 3.5
		const rawCuffed = ageYears / 4 + 3.5;
		cuffedEtTubeSize = Math.round(rawCuffed * 2) / 2; // Snap to 0.5 mm steps
		cuffedEtTubeSize = Math.min(8.0, Math.max(3.0, cuffedEtTubeSize));

		// Uncuffed formula: (Age / 4) + 4.0
		const rawUncuffed = ageYears / 4 + 4.0;
		uncuffedEtTubeSize = Math.round(rawUncuffed * 2) / 2;
		uncuffedEtTubeSize = Math.min(8.5, Math.max(3.5, uncuffedEtTubeSize));

		// Lip Depth: 3 x internal diameter or (Age / 2) + 12
		const calcDepth = uncuffedEtTubeSize * 3;
		insertionDepthLipCm = Math.round(calcDepth * 10) / 10;

		// Airway equipment based on age & weight
		if (ageYears < 2) {
			laryngoscopeBladeSize = "Miller 1 or Wis-Hipple 1.5";
			laryngoscopeBladeType = "Miller (Straight)";
			suctionCatheterFr = 8;
			bagValveMaskSize = "Pediatric";
			chestTubeSizeFr = "12 - 14 Fr";
			lmaSize = "Size 1.5 or 2";
		} else if (ageYears < 5) {
			laryngoscopeBladeSize = "Miller 2 or Macintosh 2";
			laryngoscopeBladeType = "Either";
			suctionCatheterFr = 8;
			bagValveMaskSize = "Pediatric";
			chestTubeSizeFr = "14 - 18 Fr";
			lmaSize = "Size 2 (10 - 20 kg)";
		} else if (ageYears < 8) {
			laryngoscopeBladeSize = "Macintosh 2";
			laryngoscopeBladeType = "Macintosh (Curved)";
			suctionCatheterFr = 10;
			bagValveMaskSize = "Pediatric";
			chestTubeSizeFr = "16 - 20 Fr";
			lmaSize = "Size 2.5 (20 - 30 kg)";
		} else if (ageYears < 12) {
			laryngoscopeBladeSize = "Macintosh 3";
			laryngoscopeBladeType = "Macintosh (Curved)";
			suctionCatheterFr = 10;
			bagValveMaskSize = "Adult";
			chestTubeSizeFr = "20 - 24 Fr";
			lmaSize = "Size 3 (30 - 50 kg)";
		} else {
			laryngoscopeBladeSize = "Macintosh 3 or 4";
			laryngoscopeBladeType = "Macintosh (Curved)";
			suctionCatheterFr = 12;
			bagValveMaskSize = "Adult";
			chestTubeSizeFr = "24 - 32 Fr";
			lmaSize = "Size 4 (> 50 kg)";
		}
	}

	return {
		cuffedEtTubeSize,
		uncuffedEtTubeSize,
		insertionDepthLipCm,
		insertionDepthNoseCm: Math.round((insertionDepthLipCm + 2.5) * 10) / 10,
		laryngoscopeBladeSize,
		laryngoscopeBladeType,
		suctionCatheterFr,
		bagValveMaskSize,
		chestTubeSizeFr,
		lmaSize
	};
}

/**
 * Computes defibrillation and synchronized cardioversion energy levels (Joules).
 */
export function calculateElectricalTherapy(
	weightKg: number
): ElectricalTherapyMatrix {
	const safeWeight = Math.max(0.5, Number(weightKg) || 10);

	// Initial defibrillation: 2 J/kg (capped at 200 J)
	const defibrillationInitialJ = Math.min(
		200,
		Math.max(2, Math.round(safeWeight * 2))
	);

	// Subsequent defibrillation: 4 J/kg (capped at 200 J biphasic / 360 J monophasic)
	const defibrillationSubsequentJ = Math.min(
		200,
		Math.max(4, Math.round(safeWeight * 4))
	);

	// Synchronized cardioversion: Initial 0.5 - 1.0 J/kg, subsequent 2 J/kg
	const cardioversionInitialJ = Math.min(
		100,
		Math.max(1, Math.round(safeWeight * 1.0))
	);
	const cardioversionSubsequentJ = Math.min(
		200,
		Math.max(2, Math.round(safeWeight * 2.0))
	);

	return {
		defibrillationInitialJ,
		defibrillationSubsequentJ,
		defibrillationMaxJ: 200,
		cardioversionInitialJ,
		cardioversionSubsequentJ
	};
}

/**
 * Computes all emergency resuscitation medications with exact milligram doses,
 * clinical solution volumes in mL, routes, dose caps, and priority categorizations.
 */
export function calculateEmergencyDrugs(
	weightKg: number,
	_ageMonths?: number,
	isNeonate: boolean = Number(weightKg) < 3.5
): EmergencyDrugCalculation[] {
	const safeWeight = Math.max(0.5, Number(weightKg) || 10);

	const drugs: EmergencyDrugCalculation[] = [];

	// 1. Epinephrine 1:10,000 (0.1 mg/mL) - Cardiac Arrest
	{
		const rawMg = safeWeight * 0.01;
		const maxMg = 1.0;
		const isCapped = rawMg > maxMg;
		const doseMg = Math.min(rawMg, maxMg);
		// 0.1 mg/mL -> mL = mg / 0.1 = mg * 10 = 0.1 mL/kg
		const volumeMl = Math.round((doseMg / 0.1) * 100) / 100;

		drugs.push({
			id: "epinephrine-arrest",
			name: "Epinephrine 1:10,000 (0.1 mg/mL)",
			indication:
				"Cardiac Arrest (VF / pVT / Asystole / PEA), Severe Bradycardia",
			concentrationString: "0.1 mg/mL (1:10,000 solution)",
			concentrationMgPerMl: 0.1,
			doseFormula: "0.01 mg/kg (0.1 mL/kg)",
			doseMg: Math.round(doseMg * 1000) / 1000,
			volumeMl,
			route: "IV/IO",
			maxDoseCapMg: maxMg,
			maxDoseCapMl: 10.0,
			notes:
				"Repeat every 3–5 minutes. Flush with 5 mL normal saline after administration.",
			isCapped,
			priorityCategory: "cardiac_arrest"
		});
	}

	// 2. Amiodarone (50 mg/mL) - Refractory VF / Pulseless VT
	{
		const rawMg = safeWeight * 5.0;
		const maxMg = 300.0;
		const isCapped = rawMg > maxMg;
		const doseMg = Math.min(rawMg, maxMg);
		const volumeMl = Math.round((doseMg / 50.0) * 100) / 100;

		drugs.push({
			id: "amiodarone-arrest",
			name: "Amiodarone (50 mg/mL)",
			indication: "Shock-Refractory VF / Pulseless VT (after 3rd shock)",
			concentrationString: "50 mg/mL ampoule",
			concentrationMgPerMl: 50.0,
			doseFormula: "5 mg/kg rapid IV/IO push (0.1 mL/kg)",
			doseMg: Math.round(doseMg * 10) / 10,
			volumeMl,
			route: "IV/IO",
			maxDoseCapMg: maxMg,
			maxDoseCapMl: 6.0,
			notes:
				"Rapid bolus in cardiac arrest. Can repeat 5 mg/kg once (max cumulative 15 mg/kg). Dilute in D5W for non-arrest perfusing arrhythmias.",
			isCapped,
			priorityCategory: "cardiac_arrest"
		});
	}

	// 3. Atropine (0.1 mg/mL) - Symptomatic Bradycardia
	{
		const rawMg = safeWeight * 0.02;
		const minMg = 0.1; // Minimum dose to avoid paradoxical bradycardia
		const maxMg = safeWeight > 25 ? 1.0 : 0.5;
		let doseMg = Math.max(minMg, rawMg);
		const isCapped = doseMg > maxMg;
		doseMg = Math.min(doseMg, maxMg);
		const volumeMl = Math.round((doseMg / 0.1) * 100) / 100;

		drugs.push({
			id: "atropine-bradycardia",
			name: "Atropine (0.1 mg/mL)",
			indication: "Symptomatic Bradycardia (vagal-induced or primary AV block)",
			concentrationString: "0.1 mg/mL prefilled syringe or diluted ampoule",
			concentrationMgPerMl: 0.1,
			doseFormula: "0.02 mg/kg (min 0.1 mg, max 0.5–1.0 mg)",
			doseMg: Math.round(doseMg * 1000) / 1000,
			volumeMl,
			route: "IV/IO",
			maxDoseCapMg: maxMg,
			maxDoseCapMl: maxMg / 0.1,
			notes:
				"Do not give less than 0.1 mg (can cause paradoxical worsening of bradycardia).",
			isCapped,
			priorityCategory: "cardiac_arrest"
		});
	}

	// 4. Sodium Bicarbonate (8.4% or 4.2% for neonates)
	{
		const rawMeq = safeWeight * 1.0;
		const maxMeq = 50.0;
		const isCapped = rawMeq > maxMeq;
		const doseMeq = Math.min(rawMeq, maxMeq);

		if (isNeonate) {
			// Dilute 1:1 with sterile water to 4.2% (0.5 mEq/mL) to reduce hyperosmolar intraventricular hemorrhage risk
			const volumeMl = Math.round((doseMeq / 0.5) * 10) / 10;
			drugs.push({
				id: "sodium-bicarbonate-neonate",
				name: "Sodium Bicarbonate 4.2% (Neonatal Dilution)",
				indication: "Prolonged arrest, Severe Metabolic Acidosis, Hyperkalemia",
				concentrationString:
					"4.2% solution (0.5 mEq/mL) [Dilute 8.4% 1:1 with sterile water]",
				concentrationMgPerMl: 42.0,
				doseFormula: "1 mEq/kg slow IV push over 2 minutes (2 mL/kg)",
				doseMg: doseMeq,
				volumeMl,
				route: "IV/IO",
				maxDoseCapMg: maxMeq,
				maxDoseCapMl: 100.0,
				notes:
					"Mandatory dilution to 4.2% in neonates to avoid intraventricular hemorrhage. Ensure adequate ventilation first.",
				isCapped,
				priorityCategory: "cardiac_arrest"
			});
		} else {
			const volumeMl = Math.round((doseMeq / 1.0) * 10) / 10;
			drugs.push({
				id: "sodium-bicarbonate",
				name: "Sodium Bicarbonate 8.4%",
				indication: "Prolonged cardiac arrest, Hyperkalemia, TCA overdose",
				concentrationString: "8.4% standard solution (1.0 mEq/mL)",
				concentrationMgPerMl: 84.0,
				doseFormula: "1 mEq/kg slow IV push (1 mL/kg)",
				doseMg: doseMeq,
				volumeMl,
				route: "IV/IO",
				maxDoseCapMg: maxMeq,
				maxDoseCapMl: 50.0,
				notes:
					"Incompatible with calcium salts in same line. Ensure effective chest compressions and ventilation.",
				isCapped,
				priorityCategory: "cardiac_arrest"
			});
		}
	}

	// 5. 10% Dextrose (D10W) - Acute Hypoglycemia
	{
		// 2.5 mL/kg (0.25 g/kg) to 5 mL/kg (0.5 g/kg)
		const rawMl = safeWeight * 2.5;
		const maxMl = 250.0;
		const isCapped = rawMl > maxMl;
		const volumeMl = Math.min(rawMl, maxMl);
		const doseGrams = volumeMl * 0.1;

		drugs.push({
			id: "dextrose-10",
			name: "Dextrose 10% (D10W)",
			indication:
				"Acute Hypoglycemia (< 45 mg/dL in neonate, < 60 mg/dL in child)",
			concentrationString: "10% Dextrose in Water (100 mg/mL = 0.1 g/mL)",
			concentrationMgPerMl: 100.0,
			doseFormula: "2.5 mL/kg (0.25 g/kg) slow IV push",
			doseMg: Math.round(doseGrams * 10) / 10,
			volumeMl: Math.round(volumeMl * 10) / 10,
			route: "IV/IO",
			maxDoseCapMg: 25.0,
			maxDoseCapMl: maxMl,
			notes:
				"Never administer D50W to infants/children due to vein sclerosis and hyperosmolality. Follow with continuous dextrose infusion.",
			isCapped,
			priorityCategory: "fluids_glucose"
		});
	}

	// 6. Normal Saline 0.9% - Rapid Fluid Bolus (Standard Shock 20 mL/kg)
	{
		const rawMl = safeWeight * 20.0;
		const maxMl = 1000.0;
		const isCapped = rawMl > maxMl;
		const volumeMl = Math.min(rawMl, maxMl);

		drugs.push({
			id: "saline-bolus-standard",
			name: "Normal Saline 0.9% (Standard Shock Bolus)",
			indication: "Hypovolemic Shock, Septic Shock, Severe Dehydration",
			concentrationString: "0.9% Sodium Chloride (Isotonic crystalloid)",
			concentrationMgPerMl: 9.0,
			doseFormula: "20 mL/kg rapid push over 5–10 minutes",
			doseMg: volumeMl,
			volumeMl: Math.round(volumeMl),
			route: "IV/IO",
			maxDoseCapMg: maxMl,
			maxDoseCapMl: maxMl,
			notes:
				"Push using 20 mL/50 mL syringe via 3-way stopcock or pressure bag. Reassess lung sounds and liver edge after each bolus.",
			isCapped,
			priorityCategory: "fluids_glucose"
		});
	}

	// 7. Normal Saline 0.9% - Cautious Fluid Bolus (10 mL/kg)
	{
		const rawMl = safeWeight * 10.0;
		const maxMl = 500.0;
		const isCapped = rawMl > maxMl;
		const volumeMl = Math.min(rawMl, maxMl);

		drugs.push({
			id: "saline-bolus-cautious",
			name: "Normal Saline 0.9% (Cautious 10 mL/kg Bolus)",
			indication:
				"Cardiogenic Shock, Diabetic Ketoacidosis (DKA), Severe Acute Malnutrition (SAM)",
			concentrationString: "0.9% Sodium Chloride",
			concentrationMgPerMl: 9.0,
			doseFormula: "10 mL/kg slow infusion over 20–30 minutes",
			doseMg: volumeMl,
			volumeMl: Math.round(volumeMl),
			route: "IV/IO",
			maxDoseCapMg: maxMl,
			maxDoseCapMl: maxMl,
			notes:
				"Use 10 mL/kg in patients with suspected myocarditis, congenital heart disease, or pulmonary edema risk.",
			isCapped,
			priorityCategory: "fluids_glucose"
		});
	}

	// 8. Calcium Gluconate 10%
	{
		const rawMg = safeWeight * 60.0;
		const maxMg = 2000.0;
		const isCapped = rawMg > maxMg;
		const doseMg = Math.min(rawMg, maxMg);
		// 10% = 100 mg/mL -> 0.6 mL/kg
		const volumeMl = Math.round((doseMg / 100.0) * 10) / 10;

		drugs.push({
			id: "calcium-gluconate",
			name: "Calcium Gluconate 10%",
			indication:
				"Hyperkalemia cardiac toxicity, Symptomatic Hypocalcemia, CCB Toxicity",
			concentrationString: "10% solution (100 mg/mL)",
			concentrationMgPerMl: 100.0,
			doseFormula: "60 mg/kg (0.6 mL/kg) slow IV over 5–10 minutes",
			doseMg: Math.round(doseMg),
			volumeMl,
			route: "IV/IO",
			maxDoseCapMg: maxMg,
			maxDoseCapMl: 20.0,
			notes:
				"Continuous ECG monitoring required; stop if bradycardia develops. Flush line before and after.",
			isCapped,
			priorityCategory: "antidote_electrolyte"
		});
	}

	// 9. Magnesium Sulfate 50%
	{
		const rawMg = safeWeight * 30.0; // 25 - 50 mg/kg
		const maxMg = 2000.0;
		const isCapped = rawMg > maxMg;
		const doseMg = Math.min(rawMg, maxMg);
		// 50% = 500 mg/mL
		const volumeMl = Math.round((doseMg / 500.0) * 100) / 100;

		drugs.push({
			id: "magnesium-sulfate",
			name: "Magnesium Sulfate 50%",
			indication:
				"Torsades de Pointes, Refractory Status Asthmaticus, Hypomagnesemia",
			concentrationString: "50% solution (500 mg/mL)",
			concentrationMgPerMl: 500.0,
			doseFormula: "25–50 mg/kg (30 mg/kg) IV/IO over 10–20 minutes",
			doseMg: Math.round(doseMg),
			volumeMl,
			route: "IV/IO",
			maxDoseCapMg: maxMg,
			maxDoseCapMl: 4.0,
			notes:
				"In pulseless Torsades, give rapid IV push. In asthma, infuse over 20 minutes in 50–100 mL D5W or NS.",
			isCapped,
			priorityCategory: "antiarrhythmic"
		});
	}

	// 10. Naloxone (0.4 mg/mL) - Opioid Reversal
	{
		const isSmallChild = safeWeight < 20;
		const rawMg = isSmallChild ? safeWeight * 0.1 : 2.0;
		const maxMg = 2.0;
		const isCapped = rawMg > maxMg;
		const doseMg = Math.min(rawMg, maxMg);
		const volumeMl = Math.round((doseMg / 0.4) * 100) / 100;

		drugs.push({
			id: "naloxone",
			name: "Naloxone (0.4 mg/mL)",
			indication: "Opioid Toxicity / Respiratory Depression / Apnea",
			concentrationString: "0.4 mg/mL ampoule",
			concentrationMgPerMl: 0.4,
			doseFormula: isSmallChild
				? "0.1 mg/kg (0.25 mL/kg)"
				: "2.0 mg (5 mL) fixed dose",
			doseMg: Math.round(doseMg * 100) / 100,
			volumeMl,
			route: "IV/IO/IM",
			maxDoseCapMg: maxMg,
			maxDoseCapMl: 5.0,
			notes:
				"May repeat every 2–3 minutes if no response. May precipitate acute withdrawal in opioid-dependent neonates.",
			isCapped,
			priorityCategory: "antidote_electrolyte"
		});
	}

	// 11. Epinephrine 1:1,000 (1 mg/mL) - IM Anaphylaxis
	{
		const rawMg = safeWeight * 0.01;
		const maxMg = 0.5;
		const isCapped = rawMg > maxMg;
		const doseMg = Math.min(rawMg, maxMg);
		// 1 mg/mL -> mL = mg
		const volumeMl = Math.round(doseMg * 100) / 100;

		drugs.push({
			id: "epinephrine-im-anaphylaxis",
			name: "Epinephrine 1:1,000 (1 mg/mL) — IM ONLY",
			indication: "Severe Anaphylaxis, Acute Laryngeal Angioedema",
			concentrationString:
				"1 mg/mL (1:1,000 ampoule) — NEVER give IV undiluted!",
			concentrationMgPerMl: 1.0,
			doseFormula: "0.01 mg/kg IM anterolateral mid-thigh (0.01 mL/kg)",
			doseMg: Math.round(doseMg * 100) / 100,
			volumeMl,
			route: "IV/IO/IM",
			maxDoseCapMg: maxMg,
			maxDoseCapMl: 0.5,
			notes:
				"Administer IM into anterolateral mid-thigh. Repeat in 5–15 min if needed. NEVER inject 1:1,000 directly IV.",
			isCapped,
			priorityCategory: "anaphylaxis_airway"
		});
	}

	return drugs;
}

/**
 * Builds the complete emergency resuscitation summary for a given weight and optional age.
 */
export function generateEmergencyResuscitationSummary(
	weightKg: number,
	ageMonths?: number,
	isNeonate?: boolean
): EmergencyResuscitationSummary {
	const safeWeight = Math.max(0.5, Number(weightKg) || 10);
	const estimatedAgeMonths =
		typeof ageMonths === "number" && ageMonths >= 0
			? ageMonths
			: estimateAgeMonthsFromWeight(safeWeight);

	return {
		weightKg: safeWeight,
		estimatedAgeMonths,
		airway: calculateAirwayEquipment(safeWeight, estimatedAgeMonths),
		electrical: calculateElectricalTherapy(safeWeight),
		drugs: calculateEmergencyDrugs(
			safeWeight,
			estimatedAgeMonths,
			typeof isNeonate === "boolean" ? isNeonate : safeWeight < 3.5
		)
	};
}
