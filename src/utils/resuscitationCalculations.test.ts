/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, expect, it } from "vitest";

import {
	calculateAirwayEquipment,
	calculateElectricalTherapy,
	calculateEmergencyDrugs,
	estimateAgeMonthsFromWeight,
	generateEmergencyResuscitationSummary
} from "./resuscitationCalculations.ts";

describe("Pediatric Emergency Resuscitation Calculations", () => {
	describe("Age Estimation from Weight", () => {
		it("estimates newborn age for weights <= 3.5 kg", () => {
			expect(estimateAgeMonthsFromWeight(3.0)).toBe(0);
			expect(estimateAgeMonthsFromWeight(1.8)).toBe(0);
		});

		it("estimates infant age for weights between 5 and 10 kg", () => {
			expect(estimateAgeMonthsFromWeight(5.5)).toBe(2);
			expect(estimateAgeMonthsFromWeight(7.5)).toBe(6);
			expect(estimateAgeMonthsFromWeight(10.0)).toBe(12);
		});

		it("estimates childhood age for weights >= 12 kg", () => {
			expect(estimateAgeMonthsFromWeight(12.0)).toBe(24);
			expect(estimateAgeMonthsFromWeight(18.0)).toBe(60);
			expect(estimateAgeMonthsFromWeight(40.0)).toBe(144);
		});
	});

	describe("Airway Equipment Matrix", () => {
		it("calculates preterm infant airway sizing (<2.5 kg)", () => {
			const airway = calculateAirwayEquipment(2.0, 0);
			expect(airway.uncuffedEtTubeSize).toBe(3.0);
			expect(airway.cuffedEtTubeSize).toBe(3.0);
			expect(airway.insertionDepthLipCm).toBe(8.0); // 2.0 kg + 6 cm
			expect(airway.laryngoscopeBladeSize).toContain("Miller 0");
			expect(airway.bagValveMaskSize).toBe("Neonatal");
		});

		it("calculates term infant airway sizing (3.5 kg, 0 months)", () => {
			const airway = calculateAirwayEquipment(3.5, 0);
			expect(airway.uncuffedEtTubeSize).toBe(3.5);
			expect(airway.cuffedEtTubeSize).toBe(3.0);
			expect(airway.insertionDepthLipCm).toBe(9.5);
			expect(airway.bagValveMaskSize).toBe("Infant");
		});

		it("calculates 4-year-old child airway sizing (16 kg, 48 months)", () => {
			// Age = 4 years
			// Cuffed: (4/4) + 3.5 = 4.5 mm
			// Uncuffed: (4/4) + 4.0 = 5.0 mm
			// Depth: 5.0 * 3 = 15.0 cm
			const airway = calculateAirwayEquipment(16, 48);
			expect(airway.cuffedEtTubeSize).toBe(4.5);
			expect(airway.uncuffedEtTubeSize).toBe(5.0);
			expect(airway.insertionDepthLipCm).toBe(15.0);
			expect(airway.bagValveMaskSize).toBe("Pediatric");
			expect(airway.suctionCatheterFr).toBe(8);
		});

		it("caps adolescent airway sizing at maximum physiological sizes", () => {
			const airway = calculateAirwayEquipment(70, 192); // 16 years
			expect(airway.cuffedEtTubeSize).toBeLessThanOrEqual(8.0);
			expect(airway.uncuffedEtTubeSize).toBeLessThanOrEqual(8.5);
			expect(airway.bagValveMaskSize).toBe("Adult");
		});
	});

	describe("Electrical Therapy Matrix", () => {
		it("calculates 2 J/kg initial and 4 J/kg subsequent defibrillation for a 10 kg child", () => {
			const shock = calculateElectricalTherapy(10);
			expect(shock.defibrillationInitialJ).toBe(20);
			expect(shock.defibrillationSubsequentJ).toBe(40);
			expect(shock.cardioversionInitialJ).toBe(10);
			expect(shock.cardioversionSubsequentJ).toBe(20);
		});

		it("caps defibrillation shocks at 200 J adult maximum for high weights", () => {
			const shock = calculateElectricalTherapy(75);
			// 75 kg * 2 J/kg = 150 J (under cap)
			expect(shock.defibrillationInitialJ).toBe(150);
			// 75 kg * 4 J/kg = 300 J -> capped at 200 J
			expect(shock.defibrillationSubsequentJ).toBe(200);
			expect(shock.cardioversionSubsequentJ).toBe(150);
		});
	});

	describe("Emergency Drugs Calculation Matrix", () => {
		it("calculates exact Epinephrine 1:10,000 for a 10 kg child (0.1 mL/kg = 1.0 mL)", () => {
			const drugs = calculateEmergencyDrugs(10, 12);
			const epi = drugs.find(d => d.id === "epinephrine-arrest");

			expect(epi).toBeDefined();
			expect(epi!.doseMg).toBe(0.1); // 0.01 mg/kg * 10 kg
			expect(epi!.volumeMl).toBe(1.0); // 1.0 mL of 1:10,000
			expect(epi!.isCapped).toBe(false);
		});

		it("caps Epinephrine 1:10,000 at 1.0 mg (10 mL) for adults/adolescents", () => {
			const drugs = calculateEmergencyDrugs(120, 192);
			const epi = drugs.find(d => d.id === "epinephrine-arrest");

			expect(epi).toBeDefined();
			expect(epi!.doseMg).toBe(1.0);
			expect(epi!.volumeMl).toBe(10.0);
			expect(epi!.isCapped).toBe(true);
		});

		it("calculates Amiodarone 5 mg/kg (0.1 mL/kg) and enforces 300 mg cap", () => {
			const childDrugs = calculateEmergencyDrugs(15, 36);
			const childAmio = childDrugs.find(d => d.id === "amiodarone-arrest");
			expect(childAmio!.doseMg).toBe(75); // 15 kg * 5 mg/kg
			expect(childAmio!.volumeMl).toBe(1.5); // 75 mg / 50 mg/mL = 1.5 mL
			expect(childAmio!.isCapped).toBe(false);

			const adultDrugs = calculateEmergencyDrugs(80, 192);
			const adultAmio = adultDrugs.find(d => d.id === "amiodarone-arrest");
			expect(adultAmio!.doseMg).toBe(300);
			expect(adultAmio!.volumeMl).toBe(6.0);
			expect(adultAmio!.isCapped).toBe(true);
		});

		it("enforces Atropine minimum dose of 0.1 mg for small infants", () => {
			const drugs = calculateEmergencyDrugs(3.0, 1);
			const atropine = drugs.find(d => d.id === "atropine-bradycardia");

			// 3 kg * 0.02 = 0.06 mg -> must be clamped up to 0.1 mg to prevent paradoxical bradycardia
			expect(atropine!.doseMg).toBe(0.1);
			expect(atropine!.volumeMl).toBe(1.0);
		});

		it("provides 4.2% Sodium Bicarbonate dilution for neonates and 8.4% for older children", () => {
			const neonateDrugs = calculateEmergencyDrugs(3.0, 0);
			const neonateBicarb = neonateDrugs.find(d =>
				d.id.includes("sodium-bicarbonate")
			);
			expect(neonateBicarb!.id).toBe("sodium-bicarbonate-neonate");
			expect(neonateBicarb!.name).toContain("4.2%");
			expect(neonateBicarb!.volumeMl).toBe(6.0); // 3 mEq / 0.5 mEq/mL = 6 mL

			const childDrugs = calculateEmergencyDrugs(10.0, 12);
			const childBicarb = childDrugs.find(d =>
				d.id.includes("sodium-bicarbonate")
			);
			expect(childBicarb!.id).toBe("sodium-bicarbonate");
			expect(childBicarb!.name).toContain("8.4%");
			expect(childBicarb!.volumeMl).toBe(10.0); // 10 mEq / 1.0 mEq/mL = 10 mL
		});

		it("uses 8.4% bicarbonate for a 4.0 kg, 6-month-old infant (not neonatal 4.2%)", () => {
			// A 4.0 kg 6-month-old infant is not a neonate: should receive 8.4% bicarbonate
			const drugs = calculateEmergencyDrugs(4.0, 6);
			const bicarb = drugs.find(d => d.id.includes("sodium-bicarbonate"));
			expect(bicarb).toBeDefined();
			expect(bicarb!.id).toBe("sodium-bicarbonate");
			expect(bicarb!.name).toContain("8.4%");
			expect(bicarb!.volumeMl).toBe(4.0); // 4 mEq / 1.0 mEq/mL = 4 mL
		});

		it("calculates D10W bolus (2.5 mL/kg) and Normal Saline shock boluses (20 mL/kg & 10 mL/kg)", () => {
			const drugs = calculateEmergencyDrugs(8.0, 9);
			const d10 = drugs.find(d => d.id === "dextrose-10")!;
			const ns20 = drugs.find(d => d.id === "saline-bolus-standard")!;
			const ns10 = drugs.find(d => d.id === "saline-bolus-cautious")!;

			expect(d10.volumeMl).toBe(20.0); // 8 kg * 2.5 mL/kg
			expect(ns20.volumeMl).toBe(160); // 8 kg * 20 mL/kg
			expect(ns10.volumeMl).toBe(80); // 8 kg * 10 mL/kg
		});
	});

	describe("Integrated Resuscitation Summary", () => {
		it("generates complete emergency summary for a 12 kg toddler", () => {
			const summary = generateEmergencyResuscitationSummary(12, 24);
			expect(summary.weightKg).toBe(12);
			expect(summary.airway.cuffedEtTubeSize).toBeGreaterThan(3.5);
			expect(summary.electrical.defibrillationInitialJ).toBe(24);
			expect(summary.electrical.defibrillationSubsequentJ).toBe(48);
			expect(summary.drugs.length).toBeGreaterThanOrEqual(10);
		});
	});
});
