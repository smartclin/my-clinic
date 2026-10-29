/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, expect, it } from "vitest";

import { NEONATAL_PEDIATRIC_FORMULARY } from "../data/neonatalDrugs.ts";
import {
	calculateLeaveDates,
	createPrescriptionItemFromDrug,
	formatPrescriptionItemText
} from "./prescriptionHelpers.ts";

describe("Prescription & Certificate Helpers", () => {
	it("calculates leave end date and return date accurately", () => {
		// 3 days starting on 2026-10-01: ends on 2026-10-03, returns on 2026-10-04
		const result = calculateLeaveDates("2026-10-01", 3);
		expect(result.endDate).toBe("2026-10-03");
		expect(result.returnDate).toBe("2026-10-04");
	});

	it("handles 1 day of leave", () => {
		const result = calculateLeaveDates("2026-11-15", 1);
		expect(result.endDate).toBe("2026-11-15");
		expect(result.returnDate).toBe("2026-11-16");
	});

	it("creates prescription item from formulary drug with weight-based dose", () => {
		const paracetamol = NEONATAL_PEDIATRIC_FORMULARY.find(
			d => d.id === "paracetamol"
		)!;
		expect(paracetamol).toBeDefined();

		// 10 kg child: standard dose 15 mg/kg = 150 mg.
		// Default concentration is Infant Oral Drops 100 mg / 1 mL -> (150 / 100) * 1 = 1.5 mL
		const item = createPrescriptionItemFromDrug(paracetamol, 10);
		expect(item.name).toBe("Paracetamol (Acetaminophen)");
		expect(item.doseMg).toBe(150);
		expect(item.doseVolume).toBe("1.5 mL");
		expect(item.route).toBe("Oral");
		expect(item.duration).toBe("3 days (PRN)");

		// With explicit syrup concentration: 120 mg / 5 mL -> (150 / 120) * 5 = 6.25 mL
		const syrupItem = createPrescriptionItemFromDrug(
			paracetamol,
			10,
			"para-susp-120"
		);
		expect(syrupItem.doseVolume).toBe("6.25 mL");

		// With custom overrides (e.g. customized duration & instructions)
		const overriddenItem = createPrescriptionItemFromDrug(
			paracetamol,
			10,
			"para-susp-120",
			{
				duration: "5 days for post-vaccine fever",
				instructions: "Give 6.25 mL every 6 hours as needed."
			}
		);
		expect(overriddenItem.duration).toBe("5 days for post-vaccine fever");
		expect(overriddenItem.instructions).toBe(
			"Give 6.25 mL every 6 hours as needed."
		);
	});

	it("formats prescription item into text summary cleanly", () => {
		const item = {
			id: "test-1",
			name: "Amoxicillin/Clavulanate (Augmentin)",
			formulation: "Oral Suspension 457 mg / 5 mL",
			doseMg: 350,
			doseVolume: "3.8 mL",
			route: "Oral",
			frequency: "q12h (every 12 hours)",
			duration: "7 days",
			instructions: "Take with food."
		};

		const text = formatPrescriptionItemText(item);
		expect(text).toContain("Augmentin");
		expect(text).toContain("3.8 mL");
		expect(text).toContain("350 mg");
		expect(text).toContain("7 days");
	});
});
