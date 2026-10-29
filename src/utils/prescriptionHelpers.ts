/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Helper functions and clinical constants for Pediatric Prescriptions and Medical Certificates
 */

import type { DrugFormularyItem } from "../types/medication.ts";
import type { PrescriptionItem } from "../types/prescription.ts";
import { calculateDrugDosage } from "./medicationCalculations.ts";

export const COMMON_PEDIATRIC_DIAGNOSES = [
	{ en: "Acute Bronchiolitis", ar: "التهاب القصيبات الهوائية الحاد" },
	{
		en: "Acute Streptococcal Pharyngotonsillitis",
		ar: "التهاب اللوزتين والحلق الحاد"
	},
	{ en: "Acute Otitis Media (AOM)", ar: "التهاب الأذن الوسطى الحاد" },
	{
		en: "Acute Gastroenteritis with Mild Dehydration",
		ar: "نزلات معوية حادة مع جفاف بسيط"
	},
	{ en: "Bronchial Asthma (Acute Exacerbation)", ar: "نوبة ربو شعبي حادة" },
	{
		en: "Viral Upper Respiratory Tract Infection (URTI)",
		ar: "التهاب فيروسي حاد بالجهاز التنفسي العلوي"
	},
	{
		en: "Community-Acquired Pneumonia (CAP)",
		ar: "التهاب رئوي مكتسب من المجتمع"
	},
	{ en: "Iron Deficiency Anemia", ar: "أنيميا نقص الحديد" },
	{
		en: "Nutritional Rickets / Vitamin D Deficiency",
		ar: "كساح نقص فيتامين (د)"
	},
	{
		en: "Pediatric Urinary Tract Infection (UTI)",
		ar: "التهاب مجرى البول لدى الأطفال"
	},
	{ en: "Atopic Dermatitis & Eczema", ar: "التهاب الجلد التأتبي والإكزيما" },
	{ en: "Acute Allergic Reaction / Urticaria", ar: "حساسية حادة وأرتيكاريا" },
	{ en: "Neonatal Jaundice / Hyperbilirubinemia", ar: "صفراء حديثي الولادة" },
	{
		en: "Post-NICU Bronchopulmonary Follow-up",
		ar: "متابعة ما بعد رعاية المبتسرين"
	}
];

export const COMMON_ALLERGIES = [
	"No Known Drug Allergies (NKDA) / لا يوجد حساسية دوائية معروفة",
	"Penicillin / Beta-lactams (حساسية بنسلين)",
	"Cephalosporins (حساسية السيفالوسبورينات)",
	"Sulfonamides / Bactrim (حساسية السلفا)",
	"G6PD Deficiency / Favism (نقص إنزيم الفوال - أنيميا الفول)",
	"Aspirin / NSAIDs (حساسية مسكنات)",
	"Cow's Milk Protein Allergy (CMPA) (حساسية بروتين لبن الأبقار)",
	"Egg Protein Allergy (حساسية البيض)"
];

export const COMMON_INSTRUCTIONS = [
	"Take after meals to avoid gastric upset.",
	"Shake bottle vigorously before each administration.",
	"Complete the full course even if symptoms improve.",
	"Keep refrigerated between 2°C and 8°C; discard unused portion after 14 days.",
	"Give plenty of oral fluids and oral rehydration solution (ORS).",
	"Use calibrated measuring syringe or spoon; do not use household spoons.",
	"Use PRN (as needed) only for body temperature > 38.5°C; minimum 6 hours between doses.",
	"Rinse mouth thoroughly with water after inhalation/spacer use."
];

/**
 * Calculates end date and return to school date based on start date and days of rest
 */
export function calculateLeaveDates(
	startDateStr: string,
	durationDays: number
): {
	endDate: string;
	returnDate: string;
} {
	const safeDays = Math.max(1, Math.round(durationDays) || 1);
	const start = new Date(startDateStr);
	if (Number.isNaN(start.getTime())) {
		const today = new Date();
		const todayStr = today.toISOString().split("T")[0];
		return calculateLeaveDates(todayStr, safeDays);
	}

	// End date is (startDate + safeDays - 1)
	const end = new Date(start);
	end.setDate(end.getDate() + safeDays - 1);

	// Return date is the day after end date
	const ret = new Date(end);
	ret.setDate(ret.getDate() + 1);

	const formatDate = (d: Date) => d.toISOString().split("T")[0];

	return {
		endDate: formatDate(end),
		returnDate: formatDate(ret)
	};
}

/**
 * Creates a formatted prescription item populated with calculated doses from formulary
 */
export function createPrescriptionItemFromDrug(
	drug: DrugFormularyItem,
	weightKg: number,
	concentrationId?: string,
	overrides?: Partial<PrescriptionItem>
): PrescriptionItem {
	const result = calculateDrugDosage({
		weightKg,
		drug,
		selectedConcentrationId: concentrationId
	});

	const selectedConc = result.selectedConcentration;
	const formulationLabel = selectedConc
		? selectedConc.label
		: `${drug.name} Standard Form`;
	const route = selectedConc ? selectedConc.route : drug.routes[0] || "Oral";

	let doseVolumeText = "";
	if (result.liquidVolumeMl !== undefined) {
		doseVolumeText = `${result.liquidVolumeMl} mL`;
	} else if (result.singleDoseMg) {
		doseVolumeText = `${result.singleDoseMg} mg`;
	}

	let defaultInstructions = "Take as prescribed by the pediatrician.";
	if (route === "Oral") {
		defaultInstructions =
			"Shake bottle thoroughly before use. Administer with calibrated measuring syringe.";
	} else if (route === "Inhalation") {
		defaultInstructions =
			"Administer via pediatric aerochamber/spacer mask. Rinse mouth with water after use.";
	} else if (drug.category === "Antibiotic") {
		defaultInstructions =
			"Complete the full prescribed course. Do not stop early without physician approval.";
	} else if (drug.category === "Antipyretic/Analgesic") {
		defaultInstructions =
			"Use as needed for fever > 38.5°C. Maintain minimum 6-hour interval between doses.";
	}

	let duration = "5 days";
	if (drug.category === "Antibiotic") {
		duration = "7 days";
	} else if (drug.category === "Antipyretic/Analgesic") {
		duration = "3 days (PRN)";
	} else if (drug.category === "Emergency/Resuscitation") {
		duration = "Immediate / Single dose";
	}

	const baseItem: PrescriptionItem = {
		id: crypto.randomUUID
			? crypto.randomUUID()
			: `rx-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
		drugId: drug.id,
		name: drug.name,
		genericName: drug.genericName,
		formulation: formulationLabel,
		doseMg: result.singleDoseMg,
		doseVolume: doseVolumeText,
		route,
		frequency: drug.frequency,
		duration,
		instructions: defaultInstructions
	};

	return {
		...baseItem,
		...overrides
	};
}

/**
 * Formats a single medication into a concise clinical prescription string
 */
export function formatPrescriptionItemText(item: PrescriptionItem): string {
	const parts: string[] = [];
	parts.push(`${item.name} (${item.formulation})`);
	if (item.doseVolume && item.doseMg) {
		parts.push(`- Dose: ${item.doseVolume} (${item.doseMg} mg)`);
	} else if (item.doseVolume) {
		parts.push(`- Dose: ${item.doseVolume}`);
	} else if (item.doseMg) {
		parts.push(`- Dose: ${item.doseMg} mg`);
	}
	parts.push(`Route: ${item.route}`);
	parts.push(`Freq: ${item.frequency}`);
	parts.push(`Duration: ${item.duration}`);
	if (item.instructions) {
		parts.push(`Instructions: ${item.instructions}`);
	}
	return parts.join(" | ");
}
