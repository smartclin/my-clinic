/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * High-Performance Search and Clinical Calculation Engine for Egyptian National Formulary
 * - Multi-attribute & fuzzy clinical symptom search
 * - Weight-linked auto-dosing and liquid volume (mL) calculations
 * - Maximum dose cap safety enforcement
 * - Automated allergy screening & drug-drug interaction (Risk X / Risk D) checker
 */

import { EGYPTIAN_NATIONAL_FORMULARY } from "../data/egyptianNationalFormulary.ts";
import type {
	AWaReClassification,
	CommercialProductPresentation,
	DrugMonograph,
	FormularyRoute
} from "../types/formulary.ts";

export interface FormularySearchFilter {
	category?: string;
	route?: FormularyRoute;
	awareClassification?: AWaReClassification;
	minAgeMonths?: number;
}

/**
 * Normalizes text for case- and diacritic-insensitive search
 */
function normalize(str: string): string {
	return str
		.toLowerCase()
		.trim()
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "");
}

/**
 * Searches the Egyptian National Formulary across:
 * - Generic name
 * - Egyptian commercial brand names
 * - Pharmacological class
 * - Indications
 * - Clinical symptoms (e.g. "bronchiolitis", "otitis", "colic", "wheezing")
 */
export function searchFormulary(
	query: string,
	filter?: FormularySearchFilter,
	dataset: DrugMonograph[] = EGYPTIAN_NATIONAL_FORMULARY
): DrugMonograph[] {
	const q = normalize(query);

	return dataset.filter(drug => {
		// Category filter
		if (filter?.category && filter.category !== "All") {
			const catMatch = normalize(drug.pharmacologicalCategory).includes(
				normalize(filter.category)
			);
			if (!catMatch) return false;
		}

		// Route filter
		if (filter?.route) {
			if (!drug.routes.includes(filter.route)) return false;
		}

		// AWaRe filter
		if (
			filter?.awareClassification &&
			filter.awareClassification !== "Not Applicable"
		) {
			if (drug.awareClassification !== filter.awareClassification) return false;
		}

		// Age restriction filter
		if (
			typeof filter?.minAgeMonths === "number" &&
			drug.pediatricDosing.minAgeMonths !== undefined
		) {
			if (filter.minAgeMonths < drug.pediatricDosing.minAgeMonths) return false;
		}

		if (!q) return true;

		// Search query matches
		const genericMatch = normalize(drug.genericName).includes(q);
		if (genericMatch) return true;

		const brandMatch = drug.brandNamesEgypt.some(b => normalize(b).includes(q));
		if (brandMatch) return true;

		const categoryMatch = normalize(drug.pharmacologicalCategory).includes(q);
		if (categoryMatch) return true;

		const indicationMatch = drug.indications.some(ind =>
			normalize(ind).includes(q)
		);
		if (indicationMatch) return true;

		const symptomMatch = drug.clinicalSymptoms.some(sym =>
			normalize(sym).includes(q)
		);
		if (symptomMatch) return true;

		const presentationBrandMatch = drug.presentations.some(p =>
			p.commercialBrandsEgypt?.some(cb => normalize(cb).includes(q))
		);
		if (presentationBrandMatch) return true;

		return false;
	});
}

export interface CalculateFormularyDoseInput {
	drug: DrugMonograph;
	weightKg: number;
	ageMonths?: number;
	selectedPresentationId?: string;
	customDosePerKg?: number;
}

export interface FormularyDoseResult {
	weightKg: number;
	ageMonths?: number;
	singleDoseMg: number;
	dailyDoseMg: number;
	dosesPerDay: number;
	frequency: string;
	route: FormularyRoute;
	liquidVolumeMl?: number;
	liquidVolumePerDayMl?: number;
	selectedPresentation?: CommercialProductPresentation;
	isCappedBySingleLimit: boolean;
	isCappedByDailyLimit: boolean;
	cappedSingleDoseMg?: number;
	cappedDailyDoseMg?: number;
	ageContraindicated?: boolean;
	ageContraindicationReason?: string;
	prescriptionInstruction: string;
}

/**
 * Calculates exact single and daily dosages, enforces safety caps,
 * and determines precise liquid volume in mL according to Egyptian concentrations.
 */
export function calculateFormularyDosage(
	input: CalculateFormularyDoseInput
): FormularyDoseResult {
	const { drug, weightKg, ageMonths, selectedPresentationId, customDosePerKg } =
		input;
	const safeWeight = Math.max(0.1, Number(weightKg) || 10);
	const dosing = drug.pediatricDosing;

	// Resolve presentation
	const presentation: CommercialProductPresentation | undefined =
		drug.presentations.find(p => p.id === selectedPresentationId) ||
		drug.presentations.find(p => p.isDefault) ||
		drug.presentations[0];

	const route: FormularyRoute = presentation?.route || drug.routes[0] || "Oral";

	// Check age contraindications
	let ageContraindicated = false;
	let ageContraindicationReason: string | undefined;

	if (typeof ageMonths === "number" && dosing.minAgeMonths !== undefined) {
		if (ageMonths < dosing.minAgeMonths) {
			ageContraindicated = true;
			ageContraindicationReason = `${drug.genericName} is not recommended or contraindicated in infants younger than ${dosing.minAgeMonths} months.`;
		}
	}

	// Determine target dose per kg
	const activeDosePerKg =
		typeof customDosePerKg === "number" && !Number.isNaN(customDosePerKg)
			? customDosePerKg
			: (dosing.standardDosePerKg ?? 10);

	const dosesPerDay = Math.max(1, dosing.dosesPerDay || 1);

	let rawSingleMg = 0;
	let rawDailyMg = 0;

	switch (dosing.doseUnit) {
		case "mg/kg/dose":
			rawSingleMg = safeWeight * activeDosePerKg;
			rawDailyMg = rawSingleMg * dosesPerDay;
			break;

		case "mg/kg/day":
			rawDailyMg = safeWeight * activeDosePerKg;
			rawSingleMg = rawDailyMg / dosesPerDay;
			break;

		case "mcg/kg/dose":
			rawSingleMg = (safeWeight * activeDosePerKg) / 1000;
			rawDailyMg = rawSingleMg * dosesPerDay;
			break;

		case "mcg/kg/day":
			rawDailyMg = (safeWeight * activeDosePerKg) / 1000;
			rawSingleMg = rawDailyMg / dosesPerDay;
			break;

		case "fixed_mg":
			rawSingleMg = activeDosePerKg;
			rawDailyMg = rawSingleMg * dosesPerDay;
			break;

		case "fixed_mcg":
			rawSingleMg = activeDosePerKg / 1000;
			rawDailyMg = rawSingleMg * dosesPerDay;
			break;

		default:
			rawSingleMg = safeWeight * activeDosePerKg;
			rawDailyMg = rawSingleMg * dosesPerDay;
			break;
	}

	// Safety Dose Capping
	const isCappedBySingleLimit = Boolean(
		dosing.maxSingleDoseMg && rawSingleMg > dosing.maxSingleDoseMg
	);
	const isCappedByDailyLimit = Boolean(
		dosing.maxDailyDoseMg && rawDailyMg > dosing.maxDailyDoseMg
	);

	let singleDoseMg = rawSingleMg;
	let dailyDoseMg = rawDailyMg;

	if (dosing.maxSingleDoseMg && singleDoseMg > dosing.maxSingleDoseMg) {
		singleDoseMg = dosing.maxSingleDoseMg;
	}

	dailyDoseMg = singleDoseMg * dosesPerDay;

	if (dosing.maxDailyDoseMg && dailyDoseMg > dosing.maxDailyDoseMg) {
		dailyDoseMg = dosing.maxDailyDoseMg;
		singleDoseMg = Math.min(singleDoseMg, dailyDoseMg / dosesPerDay);
	}

	// Liquid suspension / drops volume calculation
	let liquidVolumeMl: number | undefined;
	let liquidVolumePerDayMl: number | undefined;

	if (presentation?.concentrationMg && presentation.volumeMl) {
		const vol =
			(singleDoseMg / presentation.concentrationMg) * presentation.volumeMl;
		liquidVolumeMl = Math.round(vol * 100) / 100;
		liquidVolumePerDayMl = Math.round(liquidVolumeMl * dosesPerDay * 100) / 100;
	}

	// Format Instruction string
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

	let prescriptionInstruction = "";
	if (volFormatted !== null && presentation) {
		prescriptionInstruction = `${drug.genericName} (${presentation.strength}): Administer ${volFormatted} mL (${singleFormatted} mg) ${route} ${dosing.frequency}.`;
	} else {
		prescriptionInstruction = `${drug.genericName} (${presentation?.strength || "Standard"}): Administer ${singleFormatted} mg ${route} ${dosing.frequency}.`;
	}

	return {
		weightKg: safeWeight,
		ageMonths,
		singleDoseMg: Math.round(singleDoseMg * 100) / 100,
		dailyDoseMg: Math.round(dailyDoseMg * 100) / 100,
		dosesPerDay,
		frequency: dosing.frequency,
		route,
		liquidVolumeMl,
		liquidVolumePerDayMl,
		selectedPresentation: presentation,
		isCappedBySingleLimit,
		isCappedByDailyLimit,
		cappedSingleDoseMg: dosing.maxSingleDoseMg,
		cappedDailyDoseMg: dosing.maxDailyDoseMg,
		ageContraindicated,
		ageContraindicationReason,
		prescriptionInstruction
	};
}

export interface AllergyAlert {
	drugName: string;
	allergyTrigger: string;
	severity: "critical" | "warning";
	message: string;
}

export interface DrugInteractionAlert {
	drugA: string;
	drugB: string;
	level: "Risk X" | "Risk D";
	message: string;
}

export interface ContraindicationAlert {
	drugName: string;
	reason: string;
}

export interface SafetyCheckResult {
	hasSevereWarning: boolean;
	allergyAlerts: AllergyAlert[];
	interactionAlerts: DrugInteractionAlert[];
	contraindicationAlerts: ContraindicationAlert[];
	g6pdSource: "structured" | "free_text" | null;
}

export function getInteractionKey(idA: string, idB: string): string {
	return idA < idB ? `${idA}::${idB}` : `${idB}::${idA}`;
}

export const INTERACTION_TABLE = new Map<
	string,
	{ level: "Risk X" | "Risk D"; message: string }
>();

function registerInteraction(
	idA: string,
	idB: string,
	level: "Risk X" | "Risk D",
	message: string
): void {
	INTERACTION_TABLE.set(getInteractionKey(idA, idB), { level, message });
}

// Populate curated clinical interaction pairs using unambiguous drug IDs
registerInteraction(
	"domperidone",
	"ondansetron",
	"Risk X",
	"AVOID COMBINATION (Risk X): Coadministration of Domperidone and Ondansetron produces critical additive cardiac QT interval prolongation and life-threatening ventricular arrhythmias (Torsades de Pointes)."
);
registerInteraction(
	"domperidone",
	"clarithromycin",
	"Risk X",
	"AVOID COMBINATION (Risk X): Clarithromycin is a potent CYP3A4 inhibitor that markedly increases Domperidone concentrations, dramatically increasing the risk of lethal QT prolongation and sudden cardiac arrest."
);
registerInteraction(
	"fluconazole",
	"domperidone",
	"Risk X",
	"AVOID COMBINATION (Risk X): Fluconazole inhibits Domperidone metabolism, compounding QT prolongation risk."
);
registerInteraction(
	"fluconazole",
	"ondansetron",
	"Risk X",
	"AVOID COMBINATION (Risk X): Additive QT-prolonging effects."
);
registerInteraction(
	"terbutaline",
	"domperidone",
	"Risk X",
	"AVOID COMBINATION (Risk X): Additive QT prolongation and cardiovascular adverse effects."
);
registerInteraction(
	"ipratropium-bromide",
	"tiotropium",
	"Risk X",
	"AVOID COMBINATION (Risk X): Simultaneous administration of short- and long-acting inhaled anticholinergics produces excessive muscarinic blockade with no additive clinical efficacy."
);
registerInteraction(
	"theophylline",
	"clarithromycin",
	"Risk D",
	"CONSIDER THERAPY MODIFICATION (Risk D): Clarithromycin inhibits hepatic theophylline clearance, resulting in elevated serum theophylline levels and potential toxicity (nausea, tachycardia, seizures). Monitor theophylline levels."
);
registerInteraction(
	"aminophylline",
	"clarithromycin",
	"Risk D",
	"CONSIDER THERAPY MODIFICATION (Risk D): Macrolides inhibit theophylline metabolism. Reduce dose by 25–50% and monitor therapeutic serum concentrations."
);
registerInteraction(
	"gentamicin",
	"vancomycin",
	"Risk D",
	"CONSIDER THERAPY MODIFICATION (Risk D): Concomitant use of Aminoglycosides and Vancomycin increases the incidence of acute kidney injury (nephrotoxicity) and ototoxicity. Ensure therapeutic drug monitoring and daily renal panel."
);
registerInteraction(
	"amikacin",
	"vancomycin",
	"Risk D",
	"CONSIDER THERAPY MODIFICATION (Risk D): Synergistic nephrotoxicity and ototoxicity. Require serial serum creatinine and peak/trough drug concentrations."
);

/**
 * Automated clinical safety screening:
 * - Penicillin and Beta-lactam cross-reactivity
 * - G6PD deficiency warnings with structured vs free-text provenance
 * - Drug-Drug Interactions (Risk X Avoid, Risk D Therapy Modification) via deterministic ID lookup
 * - Age-specific contraindications
 */
export function checkPrescriptionSafety(
	prescribedDrugIds: string[],
	patientAllergies: string[] = [],
	patientAgeMonths?: number,
	isG6pdDeficient = false,
	dataset: DrugMonograph[] = EGYPTIAN_NATIONAL_FORMULARY
): SafetyCheckResult {
	const allergyAlerts: AllergyAlert[] = [];
	const interactionAlerts: DrugInteractionAlert[] = [];
	const contraindicationAlerts: ContraindicationAlert[] = [];

	// Fast O(1) id -> monograph index
	const drugMap = new Map<string, DrugMonograph>();
	for (const d of dataset) {
		drugMap.set(d.id, d);
	}

	const drugs = prescribedDrugIds
		.map(id => drugMap.get(id))
		.filter((d): d is DrugMonograph => Boolean(d));

	const allergyString = patientAllergies.join(" ").toLowerCase();
	const hasPenicillinAllergy =
		allergyString.includes("penicillin") || allergyString.includes("بنسلين");
	const hasSulfaAllergy =
		allergyString.includes("sulfa") || allergyString.includes("سلفا");
	const hasCephalosporinAllergy =
		allergyString.includes("cephalosporin") ||
		allergyString.includes("سيفالوسبورين");
	const hasMacrolideAllergy =
		allergyString.includes("macrolide") || allergyString.includes("ماكروليد");

	for (const drug of drugs) {
		// 1. Penicillin allergy cross-reactivity check
		if (hasPenicillinAllergy && drug.penicillinAllergyCrossReactive) {
			allergyAlerts.push({
				drugName: drug.genericName,
				allergyTrigger: "Penicillin / Beta-lactams",
				severity: "critical",
				message: `Patient has a documented Penicillin allergy. ${drug.genericName} is a beta-lactam and carries high risk of allergic cross-reaction or anaphylaxis.`
			});
		}

		// 2. Cephalosporin allergy check
		if (
			hasCephalosporinAllergy &&
			drug.pharmacologicalCategory.toLowerCase().includes("cephalosporin")
		) {
			allergyAlerts.push({
				drugName: drug.genericName,
				allergyTrigger: "Cephalosporins",
				severity: "critical",
				message: `Patient has a documented Cephalosporin allergy. ${drug.genericName} is directly contraindicated.`
			});
		}

		// 3. Sulfa allergy check
		if (
			hasSulfaAllergy &&
			drug.pharmacologicalCategory.toLowerCase().includes("sulfonamide")
		) {
			allergyAlerts.push({
				drugName: drug.genericName,
				allergyTrigger: "Sulfonamides",
				severity: "critical",
				message: `Patient has a documented Sulfa allergy. ${drug.genericName} contains sulfonamide and may trigger severe hypersensitivity/SCAR.`
			});
		}

		// 4. Macrolide allergy check
		if (
			hasMacrolideAllergy &&
			drug.pharmacologicalCategory.toLowerCase().includes("macrolide")
		) {
			allergyAlerts.push({
				drugName: drug.genericName,
				allergyTrigger: "Macrolides",
				severity: "critical",
				message: `Patient has a documented Macrolide allergy. Avoid ${drug.genericName}.`
			});
		}

		// 5. Age-specific contraindications
		if (
			typeof patientAgeMonths === "number" &&
			drug.pediatricDosing.minAgeMonths !== undefined
		) {
			if (patientAgeMonths < drug.pediatricDosing.minAgeMonths) {
				contraindicationAlerts.push({
					drugName: drug.genericName,
					reason: `${drug.genericName} is contraindicated/unapproved in pediatric patients under ${drug.pediatricDosing.minAgeMonths} months of age.`
				});
			}
		}
	}

	// 6. G6PD Deficiency hemolytic risk check with source tracking
	let g6pdSource: "structured" | "free_text" | null = null;
	if (isG6pdDeficient) {
		g6pdSource = "structured";
	} else if (
		allergyString.includes("g6pd") ||
		allergyString.includes("favism") ||
		allergyString.includes("فوال")
	) {
		g6pdSource = "free_text";
	}

	if (g6pdSource !== null) {
		for (const drug of drugs) {
			if (
				drug.g6pdWarning ||
				drug.genericName.toLowerCase().includes("sulfamethoxazole")
			) {
				const sourceNote =
					g6pdSource === "free_text"
						? " [Notice: G6PD deficiency flagged from free-text allergy notes; verify with quantitative assay or clinical record]"
						: "";
				contraindicationAlerts.push({
					drugName: drug.genericName,
					reason: `CRITICAL G6PD DEFICIENCY CAUTION: ${drug.genericName} can precipitate acute oxidative hemolysis and severe hemolytic anemia in G6PD-deficient children.${sourceNote}`
				});
			}
		}
	}

	// 7. Drug-Drug Interactions (Deterministic Pairwise ID check via INTERACTION_TABLE)
	for (let i = 0; i < drugs.length; i++) {
		for (let j = i + 1; j < drugs.length; j++) {
			const drugA = drugs[i];
			const drugB = drugs[j];

			const key = getInteractionKey(drugA.id, drugB.id);
			const alert = INTERACTION_TABLE.get(key);

			if (alert) {
				interactionAlerts.push({
					drugA: drugA.genericName,
					drugB: drugB.genericName,
					level: alert.level,
					message: alert.message
				});
			}
		}
	}

	const hasSevereWarning =
		allergyAlerts.some(a => a.severity === "critical") ||
		contraindicationAlerts.length > 0 ||
		interactionAlerts.some(i => i.level === "Risk X");

	return {
		hasSevereWarning,
		allergyAlerts,
		interactionAlerts,
		contraindicationAlerts,
		g6pdSource
	};
}
