// src/db/seed/prescriptions.ts
import { EGYPTIAN_NATIONAL_FORMULARY } from "@/data/egyptianNationalFormulary";
import { NEONATAL_PEDIATRIC_FORMULARY } from "@/data/neonatalDrugs";

import type { NewPrescription, PrescriptionMedication } from "../schema";
import { SEED_ADMIN_ID } from "./user";

const PATIENT_YOUSSEF = "00000000-0000-4000-8000-000000001001";
const PATIENT_NOUR = "00000000-0000-4000-8000-000000001002";
const PATIENT_KAREEM = "00000000-0000-4000-8000-000000001003";

// Helper to look up drug from Egyptian National Formulary
function getFormularyDrug(id: string) {
	return EGYPTIAN_NATIONAL_FORMULARY.find(d => d.id === id);
}

// Helper to look up drug from Neonatal Formulary
function getNeonatalDrug(id: string) {
	return NEONATAL_PEDIATRIC_FORMULARY.find(d => d.id === id);
}

export function buildPrescriptions(
	prescribedBy: string = SEED_ADMIN_ID
): NewPrescription[] {
	const augmentin = getFormularyDrug("amoxicillin-clavulanate") ?? {
		id: "amoxicillin-clavulanate",
		genericName: "Amoxicillin / Clavulanic Acid"
	};
	const ampicillin = getNeonatalDrug("ampicillin") ?? {
		id: "ampicillin",
		genericName: "Ampicillin Sodium"
	};
	const gentamicin = getNeonatalDrug("gentamicin") ?? {
		id: "gentamicin",
		genericName: "Gentamicin Sulfate"
	};

	return [
		// 1. Patient Youssef (2-month routine well-child + post-vaccine fever)
		{
			id: "00000000-0000-4000-8000-000000003001",
			patientId: PATIENT_YOUSSEF,
			prescriptionDate: "2024-06-15",
			status: "completed",
			medications: [
				{
					drugId: "paracetamol",
					name: "Paracetamol Drops (Cetal / Paramol 100 mg / 1 mL)",
					dose: "15 mg/kg (84 mg = 0.8 mL)",
					frequency: "Every 6 hours PRN for fever",
					duration: "3 days",
					route: "Oral",
					instructions:
						"Give with feed or immediately after for post-vaccination fever."
				},
				{
					drugId: "vitamin-d3",
					name: "Vitamin D3 Drops (Vi-Drop 2800 IU / 1 mL)",
					dose: "400 IU (4 drops)",
					frequency: "Once daily (OD)",
					duration: "Ongoing",
					route: "Oral",
					instructions:
						"Routine Egyptian MOH rickets prophylaxis. Daily administration."
				}
			] satisfies PrescriptionMedication[],
			instructions:
				"Ensure adequate hydration. Contact clinic if fever exceeds 38.5°C.",
			notes: "Routine 2-month well-child post-vaccination care.",
			prescribedBy,
			createdBy: prescribedBy
		},

		// 2. Patient Youssef (6-month acute bilateral otitis media)
		{
			id: "00000000-0000-4000-8000-000000003002",
			patientId: PATIENT_YOUSSEF,
			prescriptionDate: "2024-10-15",
			status: "active",
			medications: [
				{
					drugId: augmentin.id,
					name: `${augmentin.genericName} (Augmentin Suspension 312.5 mg / 5 mL)`,
					dose: "45 mg/kg/day (180 mg = 2.9 mL)",
					frequency: "Every 12 hours (BD)",
					duration: "7 days",
					route: "Oral",
					instructions:
						"Take at start of meals to minimize GI distress. Complete entire 7-day course."
				},
				{
					drugId: "salbutamol",
					name: "Salbutamol Inhaler (Ventolin 100 mcg)",
					dose: "2 puffs with spacer mask",
					frequency: "Every 4 to 6 hours PRN",
					duration: "5 days",
					route: "Inhalation",
					instructions:
						"Use with pediatric aerochamber spacer. Offer water or breastfeeding afterwards."
				}
			] satisfies PrescriptionMedication[],
			instructions:
				"Complete the full antibiotic course even if symptoms resolve earlier.",
			notes: "Acute otitis media with mild viral bronchitis.",
			prescribedBy,
			createdBy: prescribedBy
		},

		// 3. Patient Nour El-Din (18-month nutritional rehabilitation for borderline stunting)
		{
			id: "00000000-0000-4000-8000-000000003003",
			patientId: PATIENT_NOUR,
			prescriptionDate: "2024-02-10",
			status: "completed",
			medications: [
				{
					drugId: "zinc-sulfate",
					name: "Zinc Sulfate Syrup (Zincat 10 mg / 5 mL)",
					dose: "10 mg elemental zinc (5 mL)",
					frequency: "Once daily (OD)",
					duration: "90 days",
					route: "Oral",
					instructions:
						"Take between meals. Crucial for linear height catch-up."
				},
				{
					drugId: "multivitamin-iron",
					name: "Pediatric Multivitamin with Iron (Feroglobin B12 Syrup)",
					dose: "2.5 mL",
					frequency: "Once daily with breakfast",
					duration: "60 days",
					route: "Oral",
					instructions: "Avoid giving with dairy/calcium."
				}
			] satisfies PrescriptionMedication[],
			instructions:
				"High-protein dietary plan provided. Monthly anthropometric follow-up required.",
			notes: "Catch-up growth protocol initiated for stunting (HAZ < -2 SD).",
			prescribedBy,
			createdBy: prescribedBy
		},

		// 4. Patient Nour El-Din (24-month respiratory tract infection)
		{
			id: "00000000-0000-4000-8000-000000003004",
			patientId: PATIENT_NOUR,
			prescriptionDate: "2024-08-10",
			status: "completed",
			medications: [
				{
					drugId: "azithromycin",
					name: "Azithromycin Oral Suspension (Zithrokan 200 mg / 5 mL)",
					dose: "10 mg/kg (115 mg = 2.9 mL)",
					frequency: "Once daily (OD)",
					duration: "3 days",
					route: "Oral",
					instructions:
						"Administer 1 hour before or 2 hours after meals with water."
				}
			] satisfies PrescriptionMedication[],
			instructions:
				"3-day single daily dose therapy. Stunting catch-up confirmed successful.",
			notes: "Atypical respiratory infection; well-controlled.",
			prescribedBy,
			createdBy: prescribedBy
		},

		// 5. Patient Kareem Mostafa (Day 2 neonate empiric sepsis coverage)
		{
			id: "00000000-0000-4000-8000-000000003005",
			patientId: PATIENT_KAREEM,
			prescriptionDate: "2025-09-02",
			status: "completed",
			medications: [
				{
					drugId: ampicillin.id,
					name: `${ampicillin.genericName} (Ampicillin 500 mg Vial)`,
					dose: "50 mg/kg/dose (170 mg in 1.7 mL NS)",
					frequency: "Every 12 hours (q12h)",
					duration: "5 days",
					route: "IV",
					instructions:
						"Slow IV push over 5 minutes. Empiric neonatal sepsis protocol."
				},
				{
					drugId: gentamicin.id,
					name: `${gentamicin.genericName} (Gentamicin 20 mg/2 mL Ampoule)`,
					dose: "4 mg/kg/dose (13.6 mg in 1.36 mL NS)",
					frequency: "Every 24 hours (q24h)",
					duration: "5 days",
					route: "IV",
					instructions:
						"Infuse over 30 minutes in syringe pump. Monitor serum creatinine and urine output."
				}
			] satisfies PrescriptionMedication[],
			instructions:
				"NICU protocol for premature rupture of membranes. Discontinued upon negative blood cultures.",
			notes: "Empiric antibiotic therapy in neonatal nursery.",
			prescribedBy,
			createdBy: prescribedBy
		},

		// 6. Patient Kareem Mostafa (1-month outpatient colic and wellness)
		{
			id: "00000000-0000-4000-8000-000000003006",
			patientId: PATIENT_KAREEM,
			prescriptionDate: "2025-10-01",
			status: "active",
			medications: [
				{
					drugId: "simethicone",
					name: "Simethicone Infant Drops (Dentinox / Salinal 40 mg / 1 mL)",
					dose: "20 mg (0.5 mL)",
					frequency: "Before feeds up to 4 times daily PRN",
					duration: "14 days",
					route: "Oral",
					instructions: "Shake well. Administer directly into cheek pouch."
				},
				{
					drugId: "vitamin-d3",
					name: "Vitamin D3 Drops (Vi-Drop 2800 IU / 1 mL)",
					dose: "400 IU (4 drops)",
					frequency: "Once daily (OD)",
					duration: "1 year",
					route: "Oral",
					instructions:
						"Daily routine rickets prophylaxis for exclusive breastfeeding."
				}
			] satisfies PrescriptionMedication[],
			instructions:
				"Burp thoroughly after feeds. Keep upright for 15 minutes after feeding.",
			notes: "Infantile colic management and wellness checkup.",
			prescribedBy,
			createdBy: prescribedBy
		}
	];
}
