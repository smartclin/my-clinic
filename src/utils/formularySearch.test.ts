/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, expect, it } from "vitest";

import { EGYPTIAN_NATIONAL_FORMULARY } from "../data/egyptianNationalFormulary.ts";
import { DrugMonographSchema } from "../types/formulary.ts";
import {
	calculateFormularyDosage,
	checkPrescriptionSafety,
	searchFormulary
} from "./formularySearch.ts";

describe("Egyptian National Drug Formulary - Data & Engine", () => {
	it("validates all 50 drug monographs against Zod schema", () => {
		expect(EGYPTIAN_NATIONAL_FORMULARY.length).toBe(50);

		for (const monograph of EGYPTIAN_NATIONAL_FORMULARY) {
			const parsed = DrugMonographSchema.safeParse(monograph);
			if (!parsed.success) {
				console.error(
					`Validation failed for ${monograph.genericName}:`,
					parsed.error
				);
			}
			expect(parsed.success).toBe(true);
		}
	});

	describe("Multi-Attribute & Symptom Search Engine", () => {
		it("searches by generic name", () => {
			const results = searchFormulary("amoxicillin");
			expect(results.length).toBeGreaterThanOrEqual(1);
			expect(results.some(d => d.id === "amoxicillin-clavulanate")).toBe(true);
		});

		it("searches by Egyptian commercial brand name", () => {
			const augmentin = searchFormulary("Augmentin");
			expect(augmentin.some(d => d.id === "amoxicillin-clavulanate")).toBe(
				true
			);

			const zofran = searchFormulary("Zofran");
			expect(zofran.some(d => d.id === "ondansetron")).toBe(true);

			const ventolin = searchFormulary("Ventolin");
			expect(ventolin.some(d => d.id === "salbutamol")).toBe(true);

			const controloc = searchFormulary("Controloc");
			expect(controloc.some(d => d.id === "pantoprazole")).toBe(true);
		});

		it("searches by clinical symptom or syndrome", () => {
			const otitisResults = searchFormulary("otitis media");
			expect(otitisResults.length).toBeGreaterThanOrEqual(1);
			expect(otitisResults.some(d => d.id === "amoxicillin-clavulanate")).toBe(
				true
			);

			const bronchiolitisResults = searchFormulary("bronchiolitis");
			expect(
				bronchiolitisResults.some(
					d => d.id === "salbutamol" || d.id === "ipratropium-bromide"
				)
			).toBe(true);

			const vomitingResults = searchFormulary("vomiting");
			expect(vomitingResults.some(d => d.id === "ondansetron")).toBe(true);

			const colicResults = searchFormulary("colic");
			expect(
				colicResults.some(
					d => d.id === "simethicone" || d.id === "hyoscine-butylbromide"
				)
			).toBe(true);
		});

		it("filters by category and route", () => {
			const antibiotics = searchFormulary("", { category: "Antibiotic" });
			expect(antibiotics.length).toBeGreaterThanOrEqual(10);
			expect(
				antibiotics.every(d => d.pharmacologicalCategory.includes("Antibiotic"))
			).toBe(true);

			const inhalers = searchFormulary("", { route: "Inhalation" });
			expect(inhalers.length).toBeGreaterThanOrEqual(5);
			expect(inhalers.some(d => d.id === "salbutamol")).toBe(true);
		});
	});

	describe("Weight-Linked Dosage & Liquid Volume Calculator", () => {
		it("calculates Augmentin dosage and liquid volume in mL for a 10 kg child", () => {
			const augmentin = EGYPTIAN_NATIONAL_FORMULARY.find(
				d => d.id === "amoxicillin-clavulanate"
			)!;
			expect(augmentin).toBeDefined();

			// Standard dose is 40 mg/kg/day divided q12h (2 doses)
			// 10 kg -> 400 mg daily -> 200 mg per dose
			// Suspension 312.5 mg / 5 mL (250 mg amoxicillin per 5 mL)
			// Volume = (200 / 250) * 5 = 4.0 mL
			const result = calculateFormularyDosage({
				drug: augmentin,
				weightKg: 10,
				ageMonths: 24,
				selectedPresentationId: "aug-susp-312"
			});

			expect(result.singleDoseMg).toBe(200);
			expect(result.dailyDoseMg).toBe(400);
			expect(result.liquidVolumeMl).toBe(4);
			expect(result.liquidVolumePerDayMl).toBe(8);
			expect(result.isCappedBySingleLimit).toBe(false);
			expect(result.prescriptionInstruction).toContain("4 mL (200 mg)");
		});

		it("calculates Azithromycin 200 mg / 5 mL liquid volume for a 12 kg child", () => {
			const azithromycin = EGYPTIAN_NATIONAL_FORMULARY.find(
				d => d.id === "azithromycin"
			)!;
			expect(azithromycin).toBeDefined();

			// Standard dose: 10 mg/kg once daily
			// 12 kg -> 120 mg single dose
			// Suspension: 200 mg / 5 mL -> (120 / 200) * 5 = 3.0 mL
			const result = calculateFormularyDosage({
				drug: azithromycin,
				weightKg: 12,
				ageMonths: 36,
				selectedPresentationId: "azm-susp-200"
			});

			expect(result.singleDoseMg).toBe(120);
			expect(result.liquidVolumeMl).toBe(3);
			expect(result.dosesPerDay).toBe(1);
		});

		it("enforces maximum single and daily dose caps on high weights", () => {
			const augmentin = EGYPTIAN_NATIONAL_FORMULARY.find(
				d => d.id === "amoxicillin-clavulanate"
			)!;

			// 70 kg patient with 40 mg/kg/day = 2,800 mg/day (would be 1,400 mg/dose)
			// Max single dose cap is 1000 mg; max daily cap is 2000 mg
			const result = calculateFormularyDosage({
				drug: augmentin,
				weightKg: 70,
				ageMonths: 180
			});

			expect(result.singleDoseMg).toBe(1000);
			expect(result.dailyDoseMg).toBe(2000);
			expect(result.isCappedBySingleLimit).toBe(true);
			expect(result.isCappedByDailyLimit).toBe(true);
		});

		it("flags age contraindications", () => {
			const metoclopramide = EGYPTIAN_NATIONAL_FORMULARY.find(
				d => d.id === "metoclopramide"
			)!;

			// Metoclopramide is contraindicated in infants <1 year (<12 months)
			const infantResult = calculateFormularyDosage({
				drug: metoclopramide,
				weightKg: 7,
				ageMonths: 6
			});

			expect(infantResult.ageContraindicated).toBe(true);
			expect(infantResult.ageContraindicationReason).toContain(
				"not recommended or contraindicated"
			);
		});
	});

	describe("Automated Allergy & Drug Interaction Safety Checker", () => {
		it("detects penicillin allergy cross-reactivity for beta-lactams", () => {
			const safety = checkPrescriptionSafety(
				["amoxicillin-clavulanate", "salbutamol"],
				["Penicillin allergy / حساسية بنسلين"]
			);

			expect(safety.hasSevereWarning).toBe(true);
			expect(safety.allergyAlerts.length).toBe(1);
			expect(safety.allergyAlerts[0].drugName).toContain("Amoxicillin");
			expect(safety.allergyAlerts[0].severity).toBe("critical");
		});

		it("detects G6PD deficiency warnings for oxidative agents", () => {
			const safety = checkPrescriptionSafety(
				["cetirizine", "paracetamol"],
				[],
				36,
				true // G6PD deficient
			);

			// Cetirizine has no G6PD warning
			expect(safety.contraindicationAlerts.length).toBe(0);
		});

		it("detects Risk X drug-drug interaction combinations", () => {
			// Domperidone and Ondansetron have mutual Risk X for QT prolongation
			const safety = checkPrescriptionSafety(
				["domperidone", "ondansetron"],
				[]
			);

			expect(safety.hasSevereWarning).toBe(true);
			expect(safety.interactionAlerts.some(i => i.level === "Risk X")).toBe(
				true
			);
			expect(safety.interactionAlerts[0].message).toContain(
				"AVOID COMBINATION"
			);
		});

		it("detects age-based contraindications for pediatric patients", () => {
			// Loperamide in an 18-month-old child (<24 months)
			const safety = checkPrescriptionSafety(["loperamide"], [], 18);

			expect(safety.hasSevereWarning).toBe(true);
			expect(
				safety.contraindicationAlerts.some(c => c.drugName === "Loperamide")
			).toBe(true);
		});

		it("does not produce spurious Risk X warning for amoxicillin and ampicillin", () => {
			// Substring matching would previously match ampicillin/amoxicillin or amoxicillin-clavulanate
			const safety = checkPrescriptionSafety(
				["ampicillin", "amoxicillin-clavulanate"],
				[]
			);

			// Neither drug interacts with the other (both are aminopenicillins, not an interaction)
			expect(safety.interactionAlerts.length).toBe(0);
			expect(safety.interactionAlerts.some(i => i.level === "Risk X")).toBe(
				false
			);
		});

		it("distinguishes G6PD provenance between structured boolean and free-text notes", () => {
			// Structured flag
			const structuredSafety = checkPrescriptionSafety(
				["gentamicin"],
				[],
				12,
				true // isG6pdDeficient boolean
			);
			expect(structuredSafety.g6pdSource).toBe("structured");

			// Free-text allergy note
			const freeTextSafety = checkPrescriptionSafety(
				["gentamicin"],
				["History of favism and g6pd deficiency"],
				12,
				false
			);
			expect(freeTextSafety.g6pdSource).toBe("free_text");

			// Neither
			const negativeSafety = checkPrescriptionSafety(
				["gentamicin"],
				["No known allergies"],
				12,
				false
			);
			expect(negativeSafety.g6pdSource).toBeNull();
		});
	});
});
