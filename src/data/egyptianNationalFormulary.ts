/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Comprehensive Egyptian National Drug Formulary Dataset
 * Extracted and compiled from official Egyptian Drug Authority (EDA) monographs:
 * 1. Antimicrobial Formulary (EDA.DUPP.Formulary.001)
 * 2. Gastrointestinal Tract Medications Formulary (EDA.DUPP.Formulary.008)
 * 3. Respiratory System Medications Formulary (EDA.DUPP.Formulary.010)
 */

import type { DrugMonograph } from "@/types/formulary.ts";

export const EGYPTIAN_NATIONAL_FORMULARY: DrugMonograph[] = [
	// =========================================================================
	// SECTION 1: ANTIMICROBIALS & ANTIBIOTICS (EDA.DUPP.Formulary.001)
	// =========================================================================
	{
		id: "amikacin",
		genericName: "Amikacin",
		brandNamesEgypt: [
			"Amikin",
			"Mikacin",
			"Amikacin Kahira",
			"Amikacin Pharco"
		],
		pharmacologicalCategory: "Antibiotic, Aminoglycoside",
		atcCode: "J01GB06",
		awareClassification: "Access",
		indications: [
			"Serious gram-negative infections",
			"Neonatal sepsis",
			"Severe respiratory tract infections",
			"Intra-abdominal infections",
			"Complicated urinary tract infections",
			"Bone and joint infections"
		],
		clinicalSymptoms: [
			"fever",
			"sepsis",
			"severe infection",
			"urinary symptoms",
			"respiratory failure"
		],
		presentations: [
			{
				id: "amk-vial-100",
				form: "Vial",
				strength: "100 mg / 2 mL",
				concentrationMg: 50,
				volumeMl: 1,
				route: "IV"
			},
			{
				id: "amk-vial-250",
				form: "Vial",
				strength: "250 mg / 2 mL",
				concentrationMg: 125,
				volumeMl: 1,
				route: "IV"
			},
			{
				id: "amk-vial-500",
				form: "Vial",
				strength: "500 mg / 2 mL",
				concentrationMg: 250,
				volumeMl: 1,
				route: "IV",
				isDefault: true
			},
			{
				id: "amk-vial-1000",
				form: "Vial",
				strength: "1000 mg / 4 mL",
				concentrationMg: 250,
				volumeMl: 1,
				route: "IV"
			}
		],
		routes: ["IV", "IM"],
		pediatricDosing: {
			standardDosePerKg: 15,
			doseUnit: "mg/kg/day",
			frequency: "Every 24 hours (or divided q12h in neonates)",
			dosesPerDay: 1,
			minDosePerKg: 15,
			maxDosePerKg: 20,
			maxSingleDoseMg: 1500,
			maxDailyDoseMg: 1500,
			minAgeMonths: 0,
			guidelines:
				"Infants, Children, Adolescents: 15-20 mg/kg/day divided q8-12h or 15-20 mg/kg once daily. Neonates: 15 mg/kg once daily; TDM target peak 20-40 mcg/mL, trough <4-8 mcg/mL."
		},
		adultDosing: {
			standardDose: "15 mg/kg/day IV/IM once daily or divided q12h",
			maxDailyDose: "1500 mg/day",
			frequency: "Once daily or q12h",
			guidelines:
				"Obese patients: use 40% adjusted body weight [IBW + 0.4(TBW-IBW)]. Target peak 20-40 mg/L; trough <4-8 mg/L."
		},
		renalAdjustment: {
			crClNormal: "CrCl ≥60 mL/min: No adjustment.",
			crClMildToModerate:
				"CrCl 40-59 mL/min: 5-7.5 mg/kg q12h; CrCl 20-39 mL/min: 5-7.5 mg/kg q24h.",
			crClSevere: "CrCl <20 mL/min: 5-7.5 mg/kg q48-72h based on serum levels.",
			dialysis: "Intermittent HD: 5 mg/kg post-dialysis."
		},
		hepaticAdjustment: "No dosage adjustments needed.",
		foodCorrelation: "Not applicable (Parenteral administration).",
		preparationAndInfusion: {
			reconstitutionDiluent: "D5W or 0.9% NaCl",
			finalInfusionConcentration: "0.25 to 5 mg/mL",
			infusionRate: "Infuse over 30 to 60 minutes (1 to 2 hours in infants).",
			stability: "Stable for 24h at room temperature, 60 days at 4°C."
		},
		contraindications: [
			"Hypersensitivity to amikacin or other aminoglycosides."
		],
		blackBoxWarnings: [
			"Nephrotoxicity: May cause renal failure; usually reversible upon discontinuation.",
			"Ototoxicity: Auditory and vestibular ototoxicity; proportional to cumulative exposure.",
			"Neuromuscular blockade: Respiratory paralysis risk when given with muscle relaxants."
		],
		majorAdverseReactions: [
			"Nephrotoxicity",
			"Ototoxicity (hearing loss, tinnitus)",
			"Neurotoxicity",
			"Rash"
		],
		pregnancyCategory: "D",
		lactation:
			"Compatible with breastfeeding per WHO. Monitor infant for diarrhea and thrush.",
		riskXInteractions: [
			"Ataluren",
			"BCG",
			"Bacitracin",
			"Cisplatin",
			"Foscarnet",
			"Methoxyflurane",
			"Polymyxin B"
		],
		riskDInteractions: [
			"Colistimethate",
			"Vancomycin",
			"Sodium Picosulfate",
			"Typhoid Vaccine"
		],
		monitoringParameters: [
			"Urinalysis",
			"BUN",
			"Serum creatinine",
			"Peak and trough drug levels",
			"Audiometry"
		]
	},
	{
		id: "gentamicin",
		genericName: "Gentamicin",
		brandNamesEgypt: ["Garamycin", "Gentacin", "Genta-Cid", "Epigent"],
		pharmacologicalCategory: "Antibiotic, Aminoglycoside",
		atcCode: "J01GB03",
		awareClassification: "Access",
		indications: [
			"Neonatal sepsis and bacteremia",
			"Complicated intra-abdominal infections",
			"Infective endocarditis synergy",
			"Pyelonephritis and complicated UTIs",
			"Superficial ophthalmic and skin infections"
		],
		clinicalSymptoms: [
			"fever",
			"neonatal sepsis",
			"urinary burning",
			"eye redness",
			"abdominal infection"
		],
		presentations: [
			{
				id: "gen-amp-20",
				form: "Ampoule",
				strength: "20 mg / 2 mL",
				concentrationMg: 10,
				volumeMl: 1,
				route: "IV"
			},
			{
				id: "gen-amp-40",
				form: "Ampoule",
				strength: "40 mg / 1 mL",
				concentrationMg: 40,
				volumeMl: 1,
				route: "IV"
			},
			{
				id: "gen-amp-80",
				form: "Ampoule",
				strength: "80 mg / 2 mL",
				concentrationMg: 40,
				volumeMl: 1,
				route: "IV",
				isDefault: true
			},
			{
				id: "gen-drops-03",
				form: "Eye/Ear Drops",
				strength: "0.3% (3 mg/mL)",
				concentrationMg: 3,
				volumeMl: 1,
				route: "Ophthalmic"
			},
			{
				id: "gen-cream-01",
				form: "Topical Cream",
				strength: "0.1% (1 mg/g)",
				route: "Topical"
			}
		],
		routes: ["IV", "IM", "Ophthalmic", "Topical"],
		pediatricDosing: {
			standardDosePerKg: 2.5,
			doseUnit: "mg/kg/dose",
			frequency: "Every 8 hours (or 5 mg/kg once daily in older children)",
			dosesPerDay: 3,
			minDosePerKg: 2.0,
			maxDosePerKg: 2.5,
			maxSingleDoseMg: 240,
			maxDailyDoseMg: 500,
			minAgeMonths: 0,
			guidelines:
				"Premature/term neonates ≤1 week: 2.5 mg/kg q12h. Infants & Children: 2-2.5 mg/kg/dose q8h (or 5-7.5 mg/kg/day). Target peak 7-10 mcg/mL, trough <1 mcg/mL."
		},
		adultDosing: {
			standardDose: "3 to 5 mg/kg/day divided q8h or 5 to 7 mg/kg once daily",
			maxDailyDose: "7 mg/kg/day",
			frequency: "q8h or once daily",
			guidelines:
				"Once-daily extended interval preferred for gram-negative sepsis. Synergy: 1 mg/kg q8h."
		},
		renalAdjustment: {
			crClNormal: "CrCl ≥60 mL/min: Full dose q8h (or q24h extended).",
			crClMildToModerate:
				"CrCl 40-59 mL/min: q12h (or q36h extended); CrCl 20-39 mL/min: q24h (or q48h extended).",
			crClSevere:
				"CrCl <20 mL/min: q36-48h based on therapeutic drug monitoring.",
			dialysis: "Intermittent HD: 2 mg/kg post-dialysis."
		},
		hepaticAdjustment: "No dosage adjustments needed.",
		foodCorrelation: "Not applicable (Parenteral).",
		preparationAndInfusion: {
			reconstitutionDiluent: "0.9% NaCl or D5W",
			finalInfusionConcentration:
				"Pediatric concentration: 10 mg/mL; Adult: dilute in 50-200 mL",
			infusionRate: "Slow IV intermittent infusion over 30 to 60 minutes.",
			stability: "Stable for 48h at room temp and refrigeration."
		},
		contraindications: [
			"Hypersensitivity to gentamicin, other aminoglycosides, or excipients."
		],
		blackBoxWarnings: [
			"Nephrotoxicity: Risk increases with preexisting renal damage, dehydration, concomitant nephrotoxins.",
			"Ototoxicity: Irreversible bilateral hearing loss and vestibular injury.",
			"Neuromuscular blockade: Respiratory paralysis risk when co-administered with anesthetics."
		],
		majorAdverseReactions: [
			"Nephrotoxicity",
			"Ototoxicity",
			"Peripheral neuropathy",
			"Injection site phlebitis"
		],
		pregnancyCategory: "D",
		lactation:
			"Compatible with breastfeeding per WHO. Poor oral absorption limits infant systemic exposure.",
		riskXInteractions: [
			"Ataluren",
			"BCG",
			"Cisplatin",
			"Foscarnet",
			"Polymyxin B",
			"Methoxyflurane"
		],
		riskDInteractions: [
			"Vancomycin",
			"Colistimethate",
			"Sodium Picosulfate",
			"Typhoid Vaccine"
		],
		monitoringParameters: [
			"Serum creatinine",
			"BUN",
			"Peak level (7-10 mcg/mL)",
			"Trough level (<1 mcg/mL)",
			"Audiogram"
		]
	},
	{
		id: "neomycin",
		genericName: "Neomycin",
		brandNamesEgypt: ["Neomycin Sulphate Sedico", "Polyderm", "Cidocort"],
		pharmacologicalCategory: "Ammonium Detoxicant; Antibiotic, Aminoglycoside",
		atcCode: "A07AA01",
		awareClassification: "Watch",
		indications: [
			"Hepatic coma (portal-systemic encephalopathy) adjunctive treatment",
			"Preoperative bowel sterilization / surgical intestinal antisepsis",
			"Topical superficial bacterial skin infections"
		],
		clinicalSymptoms: [
			"hepatic encephalopathy",
			"preoperative prep",
			"skin infection"
		],
		presentations: [
			{
				id: "neo-tab-500",
				form: "Tablet",
				strength: "500 mg",
				route: "Oral",
				isDefault: true
			},
			{
				id: "neo-oint-comb",
				form: "Topical Ointment",
				strength: "5 mg/g (with polymyxin/dexamethasone)",
				route: "Topical"
			}
		],
		routes: ["Oral", "Topical"],
		pediatricDosing: {
			standardDosePerKg: 15,
			doseUnit: "mg/kg/dose",
			frequency:
				"Every 8 hours (or 50-100 mg/kg/day divided q6h for hepatic encephalopathy)",
			dosesPerDay: 3,
			minDosePerKg: 15,
			maxDosePerKg: 25,
			maxSingleDoseMg: 1000,
			maxDailyDoseMg: 2000,
			minAgeMonths: 12,
			guidelines:
				"Preoperative bowel antisepsis: 15 mg/kg/dose for 3 doses the day before surgery. Hepatic coma: 50-100 mg/kg/day divided q6h for ≤7 days."
		},
		adultDosing: {
			standardDose:
				"Hepatic encephalopathy: 4 to 12 g/day divided q4-6h for 5 to 6 days. Preop bowel prep: 1 g at 19h, 18h, and 9h before surgery.",
			maxDailyDose: "12 g/day",
			frequency: "q4h to q6h",
			guidelines:
				"Oral administration only. Do not administer parenterally due to fatal systemic toxicity."
		},
		renalAdjustment: {
			crClNormal: "No adjustment with intact mucosal barrier.",
			crClMildToModerate:
				"Use with caution; small amounts absorbed can cause toxicity.",
			crClSevere:
				"Dose reduction or discontinuation; high risk of ototoxicity and nephrotoxicity."
		},
		hepaticAdjustment:
			"No dosage adjustments needed. Exercise caution in severe liver disease.",
		foodCorrelation: "Administer without regard to meals.",
		contraindications: [
			"Hypersensitivity to neomycin or other aminoglycosides.",
			"Intestinal obstruction or ulcerative GI inflammatory disease.",
			"Parenteral administration is strictly contraindicated."
		],
		blackBoxWarnings: [
			"Systemic Toxicity: Highly nephrotoxic and ototoxic if absorbed systemically.",
			"Contraindicated Parenterally: Never inject parenterally."
		],
		majorAdverseReactions: [
			"Sore mouth",
			"Diarrhea",
			"Nausea",
			"Malabsorption syndrome with doses >12g/day",
			"Nephrotoxicity if absorbed"
		],
		pregnancyCategory: "D",
		lactation:
			"Poorly distributed into breast milk. Use caution and evaluate risk/benefit.",
		riskXInteractions: [
			"Aminoglycosides",
			"BCG",
			"Cisplatin",
			"Polymyxin B",
			"Sorafenib"
		],
		riskDInteractions: ["Vancomycin", "Colistimethate", "Sodium Picosulfate"],
		monitoringParameters: [
			"Serum creatinine",
			"BUN",
			"Audiometry with prolonged therapy"
		]
	},
	{
		id: "streptomycin",
		genericName: "Streptomycin",
		brandNamesEgypt: ["Streptomycin Cid", "Streptomycin Mepha"],
		pharmacologicalCategory: "Antibiotic, Aminoglycoside; Antitubercular Agent",
		atcCode: "J01GA01",
		awareClassification: "Watch",
		indications: [
			"Tuberculosis (in combination regimens)",
			"Brucellosis (with doxycycline)",
			"Tularemia and plague (Yersinia pestis)",
			"Enterococcal endocarditis (gentamicin-resistant strains)"
		],
		clinicalSymptoms: [
			"chronic cough",
			"night sweats",
			"brucellosis joint fever",
			"endocarditis"
		],
		presentations: [
			{
				id: "str-vial-1g",
				form: "Vial (Powder for Injection)",
				strength: "1 g",
				route: "IM",
				isDefault: true
			}
		],
		routes: ["IM"],
		pediatricDosing: {
			standardDosePerKg: 20,
			doseUnit: "mg/kg/day",
			frequency: "Once daily (or divided q12h)",
			dosesPerDay: 1,
			minDosePerKg: 20,
			maxDosePerKg: 40,
			maxSingleDoseMg: 1000,
			maxDailyDoseMg: 1000,
			minAgeMonths: 1,
			guidelines:
				"Infants & Children: 20-40 mg/kg/day IM (maximum 1,000 mg/dose; 2,000 mg/day). TB regimens: 15-20 mg/kg once daily."
		},
		adultDosing: {
			standardDose: "15 mg/kg once daily IM (or 1 g daily for brucellosis/TB)",
			maxDailyDose: "2 g/day",
			frequency: "Every 24 hours (or 2-3 times weekly in DOT)",
			guidelines:
				"Brucellosis: 1 g IM daily for 14-21 days with oral doxycycline."
		},
		renalAdjustment: {
			crClNormal: "CrCl >50 mL/min: Dose every 24 hours.",
			crClMildToModerate: "CrCl 10-50 mL/min: Dose every 24 to 72 hours.",
			crClSevere: "CrCl <10 mL/min: Dose every 72 to 96 hours.",
			dialysis: "IHD: 15 mg/kg 2-3 times weekly after hemodialysis."
		},
		hepaticAdjustment: "No dosage adjustments needed.",
		foodCorrelation: "Not applicable (IM).",
		preparationAndInfusion: {
			reconstitutionDiluent: "SWFI (3.2 mL to yield 250 mg/mL)",
			infusionRate: "Deep IM injection into large muscle mass."
		},
		contraindications: ["Hypersensitivity to streptomycin or aminoglycosides."],
		blackBoxWarnings: [
			"Ototoxicity: Severe vestibular and cochlear ototoxicity; vertigo and ataxia may be permanent.",
			"Nephrotoxicity: Renal tubular necrosis, proteinuria, rising BUN.",
			"Neuromuscular blockade: Respiratory paralysis risk."
		],
		majorAdverseReactions: [
			"Vestibular damage (vertigo, ataxia)",
			"Hearing loss",
			"Nephrotoxicity",
			"Facial paresthesia"
		],
		pregnancyCategory: "D",
		lactation:
			"Compatible with breastfeeding. Monitor infant for diarrhea and thrush.",
		riskXInteractions: [
			"Aminoglycosides",
			"Ataluren",
			"Cisplatin",
			"Foscarnet",
			"Polymyxin B"
		],
		riskDInteractions: ["Colistimethate", "Vancomycin", "Typhoid Vaccine"],
		monitoringParameters: [
			"Audiogram baseline and periodic",
			"Vestibular testing",
			"Serum creatinine",
			"BUN"
		]
	},
	{
		id: "tobramycin",
		genericName: "Tobramycin",
		brandNamesEgypt: ["Tobrex", "Tobrin", "Nebcin", "Tobral", "Bramitob"],
		pharmacologicalCategory: "Antibiotic, Aminoglycoside",
		atcCode: "J01GB01",
		awareClassification: "Watch",
		indications: [
			"Cystic fibrosis airway colonization by Pseudomonas aeruginosa",
			"Bacterial conjunctivitis, blepharitis, and keratitis",
			"Hospital-acquired gram-negative bronchopneumonia"
		],
		clinicalSymptoms: [
			"cystic fibrosis lung congestion",
			"eye discharge",
			"eye redness",
			"pseudomonas infection"
		],
		presentations: [
			{
				id: "tob-eye-drops-03",
				form: "Ophthalmic Solution",
				strength: "0.3% (3 mg/mL)",
				concentrationMg: 3,
				volumeMl: 1,
				route: "Ophthalmic",
				isDefault: true
			},
			{
				id: "tob-eye-oint-03",
				form: "Ophthalmic Ointment",
				strength: "0.3% (3 mg/g)",
				route: "Ophthalmic"
			},
			{
				id: "tob-inh-300",
				form: "Inhalation Solution",
				strength: "300 mg / 5 mL",
				concentrationMg: 60,
				volumeMl: 1,
				route: "Inhalation"
			}
		],
		routes: ["Ophthalmic", "Inhalation"],
		pediatricDosing: {
			standardDosePerKg: 300,
			doseUnit: "fixed_mg",
			frequency: "Every 12 hours for 28 days on, 28 days off",
			dosesPerDay: 2,
			maxSingleDoseMg: 300,
			maxDailyDoseMg: 600,
			minAgeMonths: 6,
			guidelines:
				"Cystic fibrosis: Inhalation: 300 mg q12h (at least 6 hours apart) in 28-day cycles. Ophthalmic: 1-2 drops q4h for mild-moderate infection."
		},
		adultDosing: {
			standardDose:
				"Inhalation: 300 mg q12h for 28 days. Ophthalmic: 1-2 drops q4h.",
			maxDailyDose: "600 mg/day (inhaled)",
			frequency: "q12h (inhalation) or q4h (drops)",
			guidelines:
				"Inhalation via approved nebulizer over 15 minutes. Administer bronchodilator prior to tobramycin."
		},
		renalAdjustment: {
			crClNormal:
				"Inhalation/Topical: Minimal systemic absorption; monitor levels if renal failure exists.",
			crClMildToModerate: "Use with caution if serum level >2 mcg/mL.",
			crClSevere: "Discontinue if serum trough exceeds 2 mcg/mL."
		},
		hepaticAdjustment: "No dosage adjustments needed.",
		foodCorrelation: "Not applicable (Inhalation/Ophthalmic).",
		contraindications: [
			"Hypersensitivity to tobramycin or any aminoglycoside."
		],
		majorAdverseReactions: [
			"Bronchospasm (inhalation)",
			"Cough",
			"Voice alteration/hoarseness",
			"Ocular hyperemia"
		],
		pregnancyCategory: "D",
		lactation:
			"Systemic absorption from ophthalmic drops is negligible; monitor for loose stools with inhalation.",
		riskXInteractions: [
			"Mannitol (Systemic) with inhaled tobramycin increases nephrotoxicity."
		],
		riskDInteractions: ["Loop Diuretics", "Neuromuscular Blocking Agents"],
		monitoringParameters: [
			"Serum tobramycin trough level (<2 mcg/mL)",
			"FEV1 / Pulmonary function",
			"Renal function"
		]
	},
	{
		id: "ampicillin",
		genericName: "Ampicillin",
		brandNamesEgypt: ["Epicocillin", "Ampicillin Cid", "Ampicillin Pharco"],
		pharmacologicalCategory: "Antibiotic, Penicillin",
		atcCode: "J01CA01",
		awareClassification: "Access",
		indications: [
			"Neonatal meningitis & Group B Streptococcus",
			"Listeria monocytogenes bacteremia",
			"Enterococcal endocarditis",
			"Pediatric community-acquired pneumonia",
			"Urinary tract infections"
		],
		clinicalSymptoms: [
			"fever",
			"neonatal sepsis",
			"meningitis",
			"cough",
			"dysuria"
		],
		presentations: [
			{ id: "amp-vial-250", form: "Vial", strength: "250 mg", route: "IV" },
			{ id: "amp-vial-500", form: "Vial", strength: "500 mg", route: "IV" },
			{
				id: "amp-vial-1000",
				form: "Vial",
				strength: "1000 mg",
				route: "IV",
				isDefault: true
			},
			{
				id: "amp-susp-125",
				form: "Oral Suspension",
				strength: "125 mg / 5 mL",
				concentrationMg: 125,
				volumeMl: 5,
				route: "Oral"
			},
			{
				id: "amp-susp-250",
				form: "Oral Suspension",
				strength: "250 mg / 5 mL",
				concentrationMg: 250,
				volumeMl: 5,
				route: "Oral"
			},
			{ id: "amp-cap-500", form: "Capsule", strength: "500 mg", route: "Oral" }
		],
		routes: ["IV", "IM", "Oral"],
		pediatricDosing: {
			standardDosePerKg: 100,
			doseUnit: "mg/kg/day",
			frequency: "Every 6 hours",
			dosesPerDay: 4,
			minDosePerKg: 50,
			maxDosePerKg: 200,
			maxSingleDoseMg: 2000,
			maxDailyDoseMg: 12000,
			minAgeMonths: 0,
			guidelines:
				"Mild-moderate: 50-100 mg/kg/day divided q6h. Severe (meningitis): 200-400 mg/kg/day IV divided q4-6h (max 12 g/day). Neonates ≤7 days: 50-100 mg/kg/day divided q12h."
		},
		adultDosing: {
			standardDose: "500 mg to 2 g IV every 4 to 6 hours or 500 mg oral q6h",
			maxDailyDose: "12 g/day IV",
			frequency: "Every 6 hours",
			guidelines: "Endocarditis/Meningitis: 2 g IV every 4 hours."
		},
		renalAdjustment: {
			crClNormal: "CrCl ≥50 mL/min: No adjustment.",
			crClMildToModerate: "CrCl 15-49 mL/min: Administer q8-12h.",
			crClSevere: "CrCl <15 mL/min: Administer q12-24h.",
			dialysis: "IHD: Dose every 24h; give dose after hemodialysis."
		},
		hepaticAdjustment: "No dosage adjustments needed.",
		foodCorrelation:
			"Oral: Administer on empty stomach (1 hour before or 2 hours after food).",
		preparationAndInfusion: {
			reconstitutionDiluent: "SWFI or 0.9% NaCl",
			finalInfusionConcentration:
				"Concentration should not exceed 30 mg/mL due to stability constraints",
			infusionRate:
				"Administer over 15 to 30 minutes. Rapid IV push can cause seizures.",
			stability: "Use within 1 hour after reconstitution."
		},
		contraindications: [
			"Hypersensitivity to ampicillin, penicillins, or other beta-lactams.",
			"Infections caused by penicillinase-producing organisms."
		],
		majorAdverseReactions: [
			"Nonallergic maculopapular rash (common in viral illness/mononucleosis)",
			"Diarrhea",
			"Anaphylaxis",
			"CDAD"
		],
		pregnancyCategory: "B",
		lactation:
			"Compatible with breastfeeding. Monitor infant for candidiasis and loose stools.",
		riskXInteractions: ["BCG", "Cholera Vaccine"],
		riskDInteractions: ["Chloroquine", "Sodium Picosulfate", "Typhoid Vaccine"],
		monitoringParameters: [
			"Renal function",
			"CBC with differential",
			"Anaphylaxis signs during first dose"
		],
		penicillinAllergyCrossReactive: true
	},
	{
		id: "amoxicillin-clavulanate",
		genericName: "Amoxicillin / Clavulanate (Augmentin)",
		brandNamesEgypt: [
			"Augmentin",
			"Curam",
			"Megamox",
			"Hibiotic",
			"E-Mox CLAV",
			"Clavimox"
		],
		pharmacologicalCategory:
			"Antibiotic, Penicillin & Beta-Lactamase Inhibitor",
		atcCode: "J01CR02",
		awareClassification: "Access",
		indications: [
			"Acute otitis media (first line)",
			"Acute bacterial rhinosinusitis",
			"Community-acquired pneumonia (outpatient)",
			"Bite wound infections",
			"Recurrent tonsillopharyngitis",
			"Complicated skin and soft-tissue infections"
		],
		clinicalSymptoms: [
			"earache",
			"sinus pressure",
			"fever",
			"productive cough",
			"sore throat",
			"facial pain"
		],
		presentations: [
			{
				id: "aug-susp-156",
				form: "Oral Suspension",
				strength: "156.25 mg / 5 mL (125/31.25)",
				concentrationMg: 125,
				volumeMl: 5,
				route: "Oral"
			},
			{
				id: "aug-susp-228",
				form: "Oral Suspension",
				strength: "228.5 mg / 5 mL (200/28.5)",
				concentrationMg: 200,
				volumeMl: 5,
				route: "Oral"
			},
			{
				id: "aug-susp-312",
				form: "Oral Suspension",
				strength: "312.5 mg / 5 mL (250/62.5)",
				concentrationMg: 250,
				volumeMl: 5,
				route: "Oral",
				isDefault: true
			},
			{
				id: "aug-susp-457",
				form: "Oral Suspension",
				strength: "457 mg / 5 mL (400/57)",
				concentrationMg: 400,
				volumeMl: 5,
				route: "Oral"
			},
			{
				id: "aug-susp-600",
				form: "Oral Suspension (ES)",
				strength: "600 mg / 42.9 mg per 5 mL",
				concentrationMg: 600,
				volumeMl: 5,
				route: "Oral"
			},
			{
				id: "aug-tab-625",
				form: "Film-coated Tablet",
				strength: "625 mg (500/125)",
				route: "Oral"
			},
			{
				id: "aug-tab-1000",
				form: "Film-coated Tablet",
				strength: "1000 mg (875/125)",
				route: "Oral"
			},
			{
				id: "aug-vial-600",
				form: "Vial",
				strength: "600 mg (500/100)",
				route: "IV"
			},
			{
				id: "aug-vial-1200",
				form: "Vial",
				strength: "1200 mg (1000/200)",
				route: "IV"
			}
		],
		routes: ["Oral", "IV"],
		pediatricDosing: {
			standardDosePerKg: 40,
			doseUnit: "mg/kg/day",
			frequency: "Every 12 hours (7:1 ratio) or Every 8 hours (4:1 ratio)",
			dosesPerDay: 2,
			minDosePerKg: 25,
			maxDosePerKg: 90,
			maxSingleDoseMg: 1000,
			maxDailyDoseMg: 2000,
			minAgeMonths: 2,
			guidelines:
				"Standard Otitis Media / Pneumonia: 40-45 mg/kg/day divided q12h. High-dose resistant S. pneumoniae (ES formulation 14:1): 80-90 mg/kg/day divided q12h (max 4,000 mg amoxicillin/day)."
		},
		adultDosing: {
			standardDose: "625 mg q8h or 1,000 mg q12h orally; IV: 1.2 g q8h",
			maxDailyDose: "2000 mg amoxicillin / day (oral)",
			frequency: "Every 8 or 12 hours",
			guidelines:
				"Take at the start of a meal to enhance clavulanate absorption and minimize gastrointestinal distress."
		},
		renalAdjustment: {
			crClNormal: "CrCl ≥30 mL/min: No adjustment needed.",
			crClMildToModerate:
				"CrCl 10-29 mL/min: 250-500 mg amoxicillin component q12h; do not use 875/125 tablet.",
			crClSevere: "CrCl <10 mL/min: 250-500 mg amoxicillin component q24h.",
			dialysis: "Hemodialysis: Administer additional dose after dialysis."
		},
		hepaticAdjustment:
			"Caution in hepatic dysfunction; cholestatic jaundice reported. Monitor liver enzymes.",
		foodCorrelation:
			"Administer at the start of meals to reduce nausea and diarrhea.",
		contraindications: [
			"Hypersensitivity to amoxicillin, clavulanic acid, or beta-lactams.",
			"History of amoxicillin/clavulanate-associated cholestatic jaundice or hepatic dysfunction."
		],
		majorAdverseReactions: [
			"Diarrhea (up to 34%)",
			"Diaper dermatitis",
			"Nausea/vomiting",
			"Cholestatic jaundice",
			"Candidiasis"
		],
		pregnancyCategory: "B",
		lactation:
			"Compatible with breastfeeding. Monitor infant for diarrhea and oral thrush.",
		riskXInteractions: ["BCG", "Cholera Vaccine"],
		riskDInteractions: [
			"Methotrexate",
			"Tolvaptan",
			"Typhoid Vaccine",
			"Sodium Picosulfate"
		],
		monitoringParameters: [
			"Renal function",
			"Liver function with prolonged therapy",
			"Bowel movement frequency"
		],
		penicillinAllergyCrossReactive: true
	},
	{
		id: "cefotaxime",
		genericName: "Cefotaxime",
		brandNamesEgypt: ["Claforan", "Cefotax", "Foxime", "Cefotaxime Pharco"],
		pharmacologicalCategory: "Antibiotic, Cephalosporin (Third Generation)",
		atcCode: "J01DD01",
		awareClassification: "Watch",
		indications: [
			"Neonatal bacterial sepsis and meningitis",
			"Severe pediatric community-acquired pneumonia",
			"Acute pyelonephritis and bacteremia",
			"Intra-abdominal infections",
			"Bone and joint infections in infants"
		],
		clinicalSymptoms: [
			"neonatal fever",
			"lethargy",
			"meningeal signs",
			"high fever",
			"respiratory distress"
		],
		presentations: [
			{ id: "ctx-vial-250", form: "Vial", strength: "250 mg", route: "IV" },
			{ id: "ctx-vial-500", form: "Vial", strength: "500 mg", route: "IV" },
			{
				id: "ctx-vial-1000",
				form: "Vial",
				strength: "1000 mg",
				route: "IV",
				isDefault: true
			},
			{ id: "ctx-vial-2000", form: "Vial", strength: "2000 mg", route: "IV" }
		],
		routes: ["IV", "IM"],
		pediatricDosing: {
			standardDosePerKg: 100,
			doseUnit: "mg/kg/day",
			frequency: "Every 6 to 8 hours (q12h in neonates ≤7 days)",
			dosesPerDay: 3,
			minDosePerKg: 50,
			maxDosePerKg: 200,
			maxSingleDoseMg: 2000,
			maxDailyDoseMg: 12000,
			minAgeMonths: 0,
			guidelines:
				"Neonates 0-7 days: 100 mg/kg/day divided q12h. Neonates >7 days: 150 mg/kg/day divided q8h. Meningitis: up to 200-300 mg/kg/day divided q6h (max 12 g/day). Preferred in neonates over ceftriaxone due to lack of kernicterus risk."
		},
		adultDosing: {
			standardDose:
				"1 to 2 g IV every 8 hours (up to 2 g q4h for life-threatening infections)",
			maxDailyDose: "12 g/day",
			frequency: "Every 6 to 8 hours",
			guidelines:
				"Uncomplicated UTI: 1 g IV/IM q12h. Severe sepsis: 2 g IV q6-8h."
		},
		renalAdjustment: {
			crClNormal: "CrCl ≥20 mL/min: No adjustment needed.",
			crClMildToModerate:
				"CrCl 10-19 mL/min: Reduce dose by 50% or extend interval to q12h.",
			crClSevere: "CrCl <10 mL/min: 50% of dose every 24 hours.",
			dialysis:
				"Hemodialysis: 0.5 to 2 g as single daily dose after hemodialysis."
		},
		hepaticAdjustment: "No dosage adjustments needed.",
		foodCorrelation: "Not applicable (Parenteral).",
		preparationAndInfusion: {
			reconstitutionDiluent: "SWFI (10 mL for 1 g vial)",
			finalInfusionConcentration: "10 to 40 mg/mL in NS or D5W",
			infusionRate:
				"Slow IV injection over 3-5 minutes, or intermittent infusion over 20-30 minutes. Rapid push (<60 sec) can cause arrhythmias.",
			stability: "Stable for 24h at room temp, 7-10 days refrigerated."
		},
		contraindications: [
			"Hypersensitivity to cefotaxime or other cephalosporins."
		],
		majorAdverseReactions: [
			"Diarrhea",
			"Rash",
			"Eosinophilia",
			"Injection site pain (IM)",
			"Elevated AST/ALT"
		],
		pregnancyCategory: "B",
		lactation:
			"Compatible with breastfeeding. Monitor infant for diarrhea and thrush.",
		riskXInteractions: ["BCG", "Cholera Vaccine"],
		riskDInteractions: ["Probenecid", "Sodium Picosulfate", "Typhoid Vaccine"],
		monitoringParameters: [
			"Renal function",
			"CBC with differential during prolonged therapy (>10 days)"
		],
		penicillinAllergyCrossReactive: true
	},
	{
		id: "ceftriaxone",
		genericName: "Ceftriaxone",
		brandNamesEgypt: [
			"Rocephin",
			"Cefaxone",
			"Triaxone",
			"Oframax",
			"Epicephin"
		],
		pharmacologicalCategory: "Antibiotic, Cephalosporin (Third Generation)",
		atcCode: "J01DD04",
		awareClassification: "Watch",
		indications: [
			"Bacterial meningitis in infants ≥1 month",
			"Community-acquired pneumonia (inpatient)",
			"Complicated urinary tract infections / acute pyelonephritis",
			"Acute otitis media (refractory single-dose)",
			"Gonococcal infections",
			"Bacteremia and sepsis"
		],
		clinicalSymptoms: [
			"high fever",
			"stiff neck",
			"chest indrawing",
			"ear pain",
			"dysuria"
		],
		presentations: [
			{ id: "cro-vial-250", form: "Vial", strength: "250 mg", route: "IV" },
			{ id: "cro-vial-500", form: "Vial", strength: "500 mg", route: "IV" },
			{
				id: "cro-vial-1000",
				form: "Vial",
				strength: "1000 mg",
				route: "IV",
				isDefault: true
			},
			{ id: "cro-vial-2000", form: "Vial", strength: "2000 mg", route: "IV" }
		],
		routes: ["IV", "IM"],
		pediatricDosing: {
			standardDosePerKg: 75,
			doseUnit: "mg/kg/day",
			frequency: "Every 24 hours (or divided q12h in meningitis)",
			dosesPerDay: 1,
			minDosePerKg: 50,
			maxDosePerKg: 100,
			maxSingleDoseMg: 2000,
			maxDailyDoseMg: 4000,
			minAgeMonths: 1,
			guidelines:
				"Mild-moderate: 50-75 mg/kg once daily (max 1 g/day). Meningitis / Severe: 100 mg/kg/day divided q12-24h (max 4 g/day). Refractory otitis media: 50 mg/kg IM single dose (max 1 g). CONTRAINDICATED in hyperbilirubinemic neonates and with IV calcium."
		},
		adultDosing: {
			standardDose: "1 to 2 g IV/IM once daily (2 g q12h in meningitis)",
			maxDailyDose: "4 g/day",
			frequency: "Every 24 hours (q12h in CNS infections)",
			guidelines: "Gonococcal urethritis/cervicitis: 500 mg IM single dose."
		},
		renalAdjustment: {
			crClNormal: "No adjustment needed for renal or hepatic alone.",
			crClMildToModerate:
				"Combined severe renal and hepatic failure: maximum 2 g daily.",
			crClSevere:
				"Combined severe renal and hepatic failure: maximum 2 g daily.",
			dialysis: "Not significantly dialyzable; supplemental dose not required."
		},
		hepaticAdjustment:
			"No adjustment needed unless combined with severe renal impairment (max 2 g/day).",
		foodCorrelation: "Not applicable (Parenteral).",
		preparationAndInfusion: {
			reconstitutionDiluent: "SWFI, NS, or 1% lidocaine for IM only",
			finalInfusionConcentration: "10 to 40 mg/mL in D5W or NS",
			infusionRate:
				"Infuse over 30 minutes (60 minutes in neonates). Never co-administer with IV calcium solutions.",
			stability: "Stable 2 days at room temp, 10 days refrigerated."
		},
		contraindications: [
			"Hypersensitivity to ceftriaxone or cephalosporins.",
			"Hyperbilirubinemic neonates (displaces bilirubin from albumin -> kernicterus).",
			"Concomitant IV calcium in neonates ≤28 days (fatal lung/kidney calcium-ceftriaxone precipitation).",
			"IV administration with lidocaine solvent."
		],
		blackBoxWarnings: [
			"Calcium Precipitation Warning: Fatal microvascular precipitates reported in neonates with calcium infusions."
		],
		majorAdverseReactions: [
			"Biliary sludging / pseudolithiasis",
			"Diarrhea",
			"Eosinophilia",
			"Rash",
			"Elevated transaminases"
		],
		pregnancyCategory: "B",
		lactation:
			"Compatible with breastfeeding. Monitor infant for diarrhea and thrush.",
		riskXInteractions: [
			"Calcium Salts (IV) in neonates",
			"BCG",
			"Cholera Vaccine"
		],
		riskDInteractions: [
			"Ringer's Lactate (contains calcium)",
			"Sodium Picosulfate",
			"Typhoid Vaccine"
		],
		monitoringParameters: [
			"Prothrombin time/INR",
			"Gallbladder ultrasound if abdominal symptoms occur",
			"Anaphylaxis signs"
		],
		penicillinAllergyCrossReactive: true
	},
	{
		id: "azithromycin",
		genericName: "Azithromycin",
		brandNamesEgypt: ["Zithrokan", "Xithrone", "Zisun", "Neozithro", "Azalide"],
		pharmacologicalCategory: "Antibiotic, Macrolide (Azalide)",
		atcCode: "J01FA10",
		awareClassification: "Watch",
		indications: [
			"Atypical pneumonia (Mycoplasma, Chlamydia)",
			"Pertussis (whooping cough)",
			"Acute streptococcal pharyngitis (penicillin-allergic patients)",
			"Acute otitis media (alternative)",
			"Trachoma and bacterial conjunctivitis"
		],
		clinicalSymptoms: [
			"dry hacking cough",
			"paroxysmal whooping cough",
			"fever",
			"sore throat",
			"eye redness"
		],
		presentations: [
			{
				id: "azm-susp-100",
				form: "Oral Suspension",
				strength: "100 mg / 5 mL",
				concentrationMg: 100,
				volumeMl: 5,
				route: "Oral"
			},
			{
				id: "azm-susp-200",
				form: "Oral Suspension",
				strength: "200 mg / 5 mL",
				concentrationMg: 200,
				volumeMl: 5,
				route: "Oral",
				isDefault: true
			},
			{ id: "azm-cap-250", form: "Capsule", strength: "250 mg", route: "Oral" },
			{
				id: "azm-tab-500",
				form: "Film-coated Tablet",
				strength: "500 mg",
				route: "Oral"
			},
			{ id: "azm-vial-500", form: "Vial", strength: "500 mg", route: "IV" },
			{
				id: "azm-drops-1",
				form: "Eye Drops",
				strength: "1%",
				route: "Ophthalmic"
			}
		],
		routes: ["Oral", "IV", "Ophthalmic"],
		pediatricDosing: {
			standardDosePerKg: 10,
			doseUnit: "mg/kg/dose",
			frequency: "Once daily for 3 to 5 days",
			dosesPerDay: 1,
			minDosePerKg: 10,
			maxDosePerKg: 12,
			maxSingleDoseMg: 500,
			maxDailyDoseMg: 500,
			minAgeMonths: 6,
			guidelines:
				"Day 1: 10 mg/kg once (max 500 mg). Days 2-5: 5 mg/kg once daily (max 250 mg). Alternatively, 10 mg/kg once daily for 3 days. Pertussis: 10 mg/kg once daily for 5 days."
		},
		adultDosing: {
			standardDose:
				"500 mg on day 1, then 250 mg once daily on days 2 to 5 (or 500 mg daily for 3 days)",
			maxDailyDose: "500 mg/day (1 g single dose for Chlamydia)",
			frequency: "Once daily",
			guidelines: "Single 1 g dose for uncomplicated genital Chlamydia."
		},
		renalAdjustment: {
			crClNormal: "No dosage adjustment necessary.",
			crClMildToModerate: "No adjustment needed.",
			crClSevere:
				"CrCl <10 mL/min: Use with caution; limited pharmacokinetic data."
		},
		hepaticAdjustment:
			"Predominantly hepatically eliminated. Use with caution in biliary/hepatic disease.",
		foodCorrelation:
			"Immediate-release suspension and tablets may be taken with or without food. Extended-release on empty stomach.",
		preparationAndInfusion: {
			reconstitutionDiluent: "SWFI 4.8 mL to yield 100 mg/mL",
			finalInfusionConcentration: "1 to 2 mg/mL in D5W or NS",
			infusionRate: "Infuse over 1 to 3 hours. Never administer as bolus or IM."
		},
		contraindications: [
			"Hypersensitivity to azithromycin, erythromycin, or any macrolide/ketolide.",
			"History of cholestatic jaundice/hepatic dysfunction with prior azithromycin use."
		],
		majorAdverseReactions: [
			"Diarrhea",
			"Nausea/vomiting",
			"Abdominal pain",
			"QTc prolongation",
			"Infantile hypertrophic pyloric stenosis in infants <6 weeks"
		],
		pregnancyCategory: "B",
		lactation:
			"Compatible with breastfeeding. Monitor infant for diarrhea and thrush.",
		riskXInteractions: [
			"Pimozide",
			"Fexinidazole",
			"Topotecan",
			"Vincristine",
			"Amiodarone"
		],
		riskDInteractions: [
			"Domperidone",
			"Colchicine",
			"Edoxaban",
			"Typhoid Vaccine"
		],
		monitoringParameters: [
			"Liver function tests",
			"ECG/QTc interval in patients with arrhythmia risk",
			"Pyloric stenosis signs in neonates"
		]
	},
	{
		id: "clarithromycin",
		genericName: "Clarithromycin",
		brandNamesEgypt: ["Klacid", "Klarimix", "Claricin", "Clacine"],
		pharmacologicalCategory: "Antibiotic, Macrolide",
		atcCode: "J01FA09",
		awareClassification: "Watch",
		indications: [
			"Community-acquired pneumonia",
			"Acute bacterial otitis media and sinusitis",
			"Helicobacter pylori eradication (triple therapy)",
			"Streptococcal tonsillopharyngitis",
			"Disseminated Mycobacterium avium complex (MAC)"
		],
		clinicalSymptoms: [
			"cough",
			"fever",
			"ear pain",
			"dyspepsia / H. pylori epigastric pain",
			"throat pain"
		],
		presentations: [
			{
				id: "clr-susp-125",
				form: "Oral Suspension",
				strength: "125 mg / 5 mL",
				concentrationMg: 125,
				volumeMl: 5,
				route: "Oral"
			},
			{
				id: "clr-susp-250",
				form: "Oral Suspension",
				strength: "250 mg / 5 mL",
				concentrationMg: 250,
				volumeMl: 5,
				route: "Oral",
				isDefault: true
			},
			{
				id: "clr-tab-250",
				form: "Film-coated Tablet",
				strength: "250 mg",
				route: "Oral"
			},
			{
				id: "clr-tab-500",
				form: "Film-coated Tablet",
				strength: "500 mg",
				route: "Oral"
			},
			{ id: "clr-vial-500", form: "Vial", strength: "500 mg", route: "IV" }
		],
		routes: ["Oral", "IV"],
		pediatricDosing: {
			standardDosePerKg: 15,
			doseUnit: "mg/kg/day",
			frequency: "Every 12 hours",
			dosesPerDay: 2,
			minDosePerKg: 15,
			maxDosePerKg: 15,
			maxSingleDoseMg: 500,
			maxDailyDoseMg: 1000,
			minAgeMonths: 6,
			guidelines:
				"Children: 15 mg/kg/day divided q12h (7.5 mg/kg/dose q12h). Max single dose 500 mg. Duration: 5-10 days."
		},
		adultDosing: {
			standardDose:
				"250 to 500 mg every 12 hours orally (or 1 g ER once daily)",
			maxDailyDose: "1000 mg/day (2 g/day in severe MAC)",
			frequency: "Every 12 hours",
			guidelines:
				"H. pylori eradication: 500 mg twice daily for 14 days in combination with amoxicillin and PPI."
		},
		renalAdjustment: {
			crClNormal: "CrCl ≥30 mL/min: No adjustment needed.",
			crClMildToModerate:
				"CrCl 10-29 mL/min: Reduce dose by 50% (4 mg/kg/dose q12h in pediatrics).",
			crClSevere: "CrCl <10 mL/min: 4 mg/kg/dose once daily.",
			dialysis: "Hemodialysis: Administer dose after dialysis."
		},
		hepaticAdjustment:
			"No adjustment needed if renal function normal; reduce dose in severe combined hepatic-renal impairment.",
		foodCorrelation:
			"Immediate-release tablets/suspension can be taken with or without food. Extended-release must be taken with food.",
		contraindications: [
			"Hypersensitivity to clarithromycin or other macrolides.",
			"Concomitant cisapride, pimozide, astemizole, terfenadine, ergotamine, lovastatin, simvastatin.",
			"History of cholestatic jaundice or QT prolongation.",
			"Severe hepatic impairment combined with renal impairment."
		],
		majorAdverseReactions: [
			"Dysgeusia (metallic taste: 3-7%)",
			"Nausea/vomiting",
			"Diarrhea",
			"QT prolongation / Arrhythmia",
			"Elevated LFTs"
		],
		pregnancyCategory: "C",
		lactation:
			"Present in breast milk. Use caution; monitor infant for diarrhea, rash, and somnolence.",
		riskXInteractions: [
			"Pimozide",
			"Simvastatin",
			"Lovastatin",
			"Ergotamine",
			"Colchicine in renal failure"
		],
		riskDInteractions: [
			"Warfarin",
			"Theophylline",
			"Carbamazepine",
			"Midazolam",
			"Sildenafil"
		],
		monitoringParameters: [
			"Liver enzymes",
			"ECG/QT interval",
			"Renal function tests"
		]
	},
	{
		id: "metronidazole",
		genericName: "Metronidazole",
		brandNamesEgypt: ["Flagyl", "Amrizole", "Dumazole", "Entocid", "Flagicure"],
		pharmacologicalCategory:
			"Amebicide; Antiprotozoal, Nitroimidazole; Antibiotic",
		atcCode: "J01XD01",
		awareClassification: "Access",
		indications: [
			"Intestinal and extraintestinal amebiasis (Entamoeba histolytica)",
			"Giardiasis",
			"Anaerobic bacterial infections (Bacteroides, Clostridium)",
			"Pseudomembranous colitis / C. difficile",
			"Trichomoniasis",
			"Colorectal surgical prophylaxis"
		],
		clinicalSymptoms: [
			"bloody diarrhea",
			"watery diarrhea",
			"foul stool",
			"abdominal cramps",
			"fever",
			"pelvic discharge"
		],
		presentations: [
			{
				id: "mtz-susp-125",
				form: "Oral Suspension",
				strength: "125 mg / 5 mL",
				concentrationMg: 125,
				volumeMl: 5,
				route: "Oral"
			},
			{
				id: "mtz-susp-200",
				form: "Oral Suspension",
				strength: "200 mg / 5 mL",
				concentrationMg: 200,
				volumeMl: 5,
				route: "Oral",
				isDefault: true
			},
			{
				id: "mtz-tab-250",
				form: "Film-coated Tablet",
				strength: "250 mg",
				route: "Oral"
			},
			{
				id: "mtz-tab-500",
				form: "Film-coated Tablet",
				strength: "500 mg",
				route: "Oral"
			},
			{
				id: "mtz-vial-500",
				form: "Vial (IV Infusion)",
				strength: "500 mg / 100 mL",
				concentrationMg: 5,
				volumeMl: 1,
				route: "IV"
			},
			{
				id: "mtz-supp-500",
				form: "Rectal Suppository",
				strength: "500 mg",
				route: "Rectal"
			}
		],
		routes: ["Oral", "IV", "Rectal"],
		pediatricDosing: {
			standardDosePerKg: 30,
			doseUnit: "mg/kg/day",
			frequency: "Every 8 hours",
			dosesPerDay: 3,
			minDosePerKg: 15,
			maxDosePerKg: 50,
			maxSingleDoseMg: 750,
			maxDailyDoseMg: 2250,
			minAgeMonths: 1,
			guidelines:
				"Amebiasis: 35-50 mg/kg/day divided q8h for 7-10 days. Anaerobic infections: 30 mg/kg/day divided q8h (IV or oral). Giardiasis: 15 mg/kg/day divided q8h for 5 days."
		},
		adultDosing: {
			standardDose: "500 mg orally or IV every 8 hours",
			maxDailyDose: "4000 mg/day IV",
			frequency: "Every 8 hours",
			guidelines:
				"Amebiasis: 750 mg q8h for 10 days. Trichomoniasis: 500 mg twice daily for 7 days or 2 g single dose."
		},
		renalAdjustment: {
			crClNormal: "CrCl ≥10 mL/min: No adjustment needed.",
			crClMildToModerate:
				"CrCl 10-50 mL/min: Monitor for metabolite accumulation with prolonged courses.",
			crClSevere: "CrCl <10 mL/min: Administer 50% of standard dose.",
			dialysis: "Hemodialysis: Administer full supplemental dose post-dialysis."
		},
		hepaticAdjustment:
			"Severe impairment (Child-Pugh C): Reduce dose by 50% to prevent CNS neurotoxicity.",
		foodCorrelation: "Administer with food or milk to minimize stomach upset.",
		preparationAndInfusion: {
			finalInfusionConcentration:
				"Ready-to-use infusion 5 mg/mL (500 mg / 100 mL)",
			infusionRate:
				"Infuse over 30 to 60 minutes. Do not use equipment containing aluminum."
		},
		contraindications: [
			"Hypersensitivity to metronidazole or nitroimidazoles.",
			"First trimester of pregnancy in trichomoniasis.",
			"Concomitant use with alcohol or disulfiram (within 14 days) -> severe disulfiram reaction.",
			"Cockayne syndrome (fatal acute liver failure reported)."
		],
		blackBoxWarnings: [
			"Carcinogenicity Warning: Carcinogenic in rodent bioassays; avoid unnecessary/prolonged use."
		],
		majorAdverseReactions: [
			"Metallic taste",
			"Darkened/red-brown urine",
			"Nausea/vomiting",
			"Peripheral sensory neuropathy",
			"Seizures/encephalopathy with high doses"
		],
		pregnancyCategory: "B",
		lactation:
			"Withhold breastfeeding for 12-24 hours after a single high 2 g dose; lower doses generally acceptable.",
		riskXInteractions: [
			"Alcohol (Ethyl)",
			"Disulfiram",
			"Propylene Glycol products",
			"Dronabinol",
			"Mebendazole"
		],
		riskDInteractions: ["Warfarin", "Busulfan", "Lithium", "Lopinavir"],
		monitoringParameters: [
			"Neurological exam (paresthesia, ataxia)",
			"CBC with differential on prolonged courses",
			"Liver function in Cockayne syndrome"
		]
	},
	{
		id: "vancomycin",
		genericName: "Vancomycin",
		brandNamesEgypt: ["Vancocin", "Vancomix", "Vancomycin Hospira", "Vancotex"],
		pharmacologicalCategory: "Antibiotic, Glycopeptide",
		atcCode: "J01XA01",
		awareClassification: "Watch",
		indications: [
			"Severe MRSA infections (bacteremia, pneumonia, endocarditis, osteomyelitis)",
			"Clostridioides difficile colitis (oral administration only)",
			"Empiric therapy for neonatal sepsis in hospitals with high MRSA incidence",
			"Febrile neutropenia"
		],
		clinicalSymptoms: [
			"refractory fever",
			"MRSA infection",
			"septic shock",
			"severe C. diff diarrhea"
		],
		presentations: [
			{
				id: "van-vial-500",
				form: "Vial",
				strength: "500 mg",
				route: "IV",
				isDefault: true
			},
			{
				id: "van-vial-1000",
				form: "Vial",
				strength: "1000 mg (1 g)",
				route: "IV"
			},
			{
				id: "van-cap-250",
				form: "Hard Capsule",
				strength: "250 mg",
				route: "Oral"
			}
		],
		routes: ["IV", "Oral"],
		pediatricDosing: {
			standardDosePerKg: 15,
			doseUnit: "mg/kg/dose",
			frequency: "Every 6 to 8 hours",
			dosesPerDay: 4,
			minDosePerKg: 10,
			maxDosePerKg: 20,
			maxSingleDoseMg: 1000,
			maxDailyDoseMg: 3600,
			minAgeMonths: 0,
			guidelines:
				"Systemic infections: IV: 45-60 mg/kg/day divided q6-8h. Severe MRSA (meningitis/sepsis): 60-80 mg/kg/day divided q6h. Neonates: 15 mg/kg loading, then 10 mg/kg q8-12h. Oral (C. diff only): 10 mg/kg/dose 4 times daily (max 125 mg/dose). Target trough 10-20 mcg/mL, AUC/MIC 400-600."
		},
		adultDosing: {
			standardDose:
				"15 to 20 mg/kg/dose IV every 8 to 12 hours (loading dose: 25-35 mg/kg in severe sepsis)",
			maxDailyDose: "4000 mg/day (unless guided by serum levels)",
			frequency: "Every 8 to 12 hours",
			guidelines:
				"C. diff colitis: Oral only: 125 to 500 mg 4 times daily for 10 days."
		},
		renalAdjustment: {
			crClNormal: "CrCl ≥90 mL/min: 15-20 mg/kg q8-12h.",
			crClMildToModerate:
				"CrCl 50-89 mL/min: 15-20 mg/kg q12-24h; CrCl 15-49 mL/min: 10-15 mg/kg q24-48h.",
			crClSevere:
				"CrCl <15 mL/min: Redose based on trough concentration (<15 mcg/mL).",
			dialysis:
				"Hemodialysis: Load 20-25 mg/kg, then re-dose post-dialysis per serum level."
		},
		hepaticAdjustment:
			"No specific adjustments; use caution in multiorgan failure.",
		foodCorrelation:
			"Oral: Administer without regard to meals (not absorbed systemically).",
		preparationAndInfusion: {
			reconstitutionDiluent: "SWFI (10 mL for 500 mg vial = 50 mg/mL)",
			finalInfusionConcentration:
				"≤5 mg/mL in NS or D5W (max 10 mg/mL in severe fluid restriction)",
			infusionRate:
				"Infuse over at least 60 minutes (≥30 min per 500 mg). Slow to 1.5-2 hours if red man syndrome occurs. Never give IM.",
			stability: "Stable 24h at room temp, 14 days refrigerated."
		},
		contraindications: ["Hypersensitivity to vancomycin or glycopeptides."],
		blackBoxWarnings: [
			"PEG 400 Excipient Warning: Certain injection formulations contain PEG 400 / NADA which are contraindicated in pregnancy."
		],
		majorAdverseReactions: [
			"Vancomycin Infusion Reaction / Red Man Syndrome (erythema, flushing, pruritus from histamine release)",
			"Nephrotoxicity (synergistic with aminoglycosides and piperacillin/tazobactam)",
			"Ototoxicity",
			"Neutropenia on prolonged therapy",
			"Phlebitis"
		],
		pregnancyCategory: "C",
		lactation:
			"Present in breast milk. Poor oral bioavailability makes systemic toxicity in infant unlikely.",
		riskXInteractions: ["BCG", "Cholera Vaccine"],
		riskDInteractions: [
			"Colistimethate",
			"Aminoglycosides",
			"Piperacillin/Tazobactam",
			"Sodium Picosulfate"
		],
		monitoringParameters: [
			"Serum trough concentration (10-20 mcg/mL)",
			"AUC/MIC target (400-600)",
			"Serum creatinine",
			"CBC weekly"
		]
	},
	{
		id: "fluconazole",
		genericName: "Fluconazole",
		brandNamesEgypt: ["Diflucan", "Fungican", "Flucand", "Trican", "Flazol"],
		pharmacologicalCategory: "Antifungal Agent, Azole Derivative",
		atcCode: "J02AC01",
		awareClassification: "Not Applicable",
		indications: [
			"Oropharyngeal and esophageal candidiasis",
			"Systemic candidiasis and candidemia",
			"Cryptococcal meningitis",
			"Fungal UTI and peritoneal candidiasis",
			"Antifungal prophylaxis in immunocompromised children"
		],
		clinicalSymptoms: [
			"oral thrush",
			"difficulty swallowing",
			"fungal diaper dermatitis",
			"persistent fever in neutropenia"
		],
		presentations: [
			{
				id: "flc-susp-50",
				form: "Oral Suspension",
				strength: "50 mg / 5 mL",
				concentrationMg: 50,
				volumeMl: 5,
				route: "Oral",
				isDefault: true
			},
			{
				id: "flc-susp-200",
				form: "Oral Suspension",
				strength: "200 mg / 5 mL",
				concentrationMg: 200,
				volumeMl: 5,
				route: "Oral"
			},
			{ id: "flc-cap-50", form: "Capsule", strength: "50 mg", route: "Oral" },
			{ id: "flc-cap-150", form: "Capsule", strength: "150 mg", route: "Oral" },
			{ id: "flc-cap-200", form: "Capsule", strength: "200 mg", route: "Oral" },
			{
				id: "flc-vial-2mg",
				form: "Vial (IV Infusion)",
				strength: "2 mg/mL (100 mL = 200 mg)",
				concentrationMg: 2,
				volumeMl: 1,
				route: "IV"
			}
		],
		routes: ["Oral", "IV"],
		pediatricDosing: {
			standardDosePerKg: 6,
			doseUnit: "mg/kg/dose",
			frequency: "Every 24 hours",
			dosesPerDay: 1,
			minDosePerKg: 3,
			maxDosePerKg: 12,
			maxSingleDoseMg: 400,
			maxDailyDoseMg: 600,
			minAgeMonths: 0,
			guidelines:
				"Oral candidiasis (thrush): Loading dose 6 mg/kg on day 1, then 3 mg/kg once daily for 14 days. Systemic candidiasis / Cryptococcus: 6-12 mg/kg/day once daily (max 600 mg/day). Neonates: extend interval to q48-72h based on gestational age."
		},
		adultDosing: {
			standardDose:
				"200 to 400 mg once daily (loading dose: 400 to 800 mg on day 1)",
			maxDailyDose: "800 mg/day (12 mg/kg/day)",
			frequency: "Every 24 hours",
			guidelines:
				"Vaginal candidiasis: 150 mg oral single dose. Oropharyngeal: 200 mg day 1, then 100-200 mg daily."
		},
		renalAdjustment: {
			crClNormal: "CrCl >50 mL/min: No adjustment needed (100% of dose).",
			crClMildToModerate:
				"CrCl ≤50 mL/min: Give standard loading dose on day 1, then reduce maintenance by 50%.",
			crClSevere:
				"CrCl <10 mL/min: Reduce maintenance by 50% and administer every 48 hours.",
			dialysis:
				"Hemodialysis: Administer full daily dose after each dialysis session."
		},
		hepaticAdjustment:
			"No specific adjustments needed; use caution in preexisting liver dysfunction.",
		foodCorrelation: "May be administered without regard to meals.",
		preparationAndInfusion: {
			finalInfusionConcentration: "Ready-to-use solution 2 mg/mL",
			infusionRate: "Do not exceed 200 mg/hour (infuse 200 mg over 60 minutes)."
		},
		contraindications: [
			"Hypersensitivity to fluconazole or other azoles.",
			"Coadministration with CYP3A4 substrates that prolong QT interval (cisapride, terfenadine, pimozide, quinidine, erythromycin)."
		],
		majorAdverseReactions: [
			"Headache",
			"Nausea/vomiting",
			"Abdominal pain",
			"Transient ALT/AST elevation",
			"QTc prolongation",
			"Exfoliative dermatitis (rare)"
		],
		pregnancyCategory: "D",
		lactation:
			"Compatible with breastfeeding per WHO in usual single or short-course doses.",
		riskXInteractions: [
			"Cisapride",
			"Pimozide",
			"Terfenadine",
			"Astemizole",
			"Domperidone",
			"Erythromycin",
			"Saccharomyces boulardii"
		],
		riskDInteractions: [
			"Warfarin",
			"Phenytoin",
			"Cyclosporine",
			"Tacrolimus",
			"Theophylline",
			"Midazolam"
		],
		monitoringParameters: [
			"Liver function tests (ALT, AST)",
			"Renal function",
			"Serum potassium and magnesium"
		]
	},

	// =========================================================================
	// SECTION 2: GASTROINTESTINAL TRACT MEDICATIONS (EDA.DUPP.Formulary.008)
	// =========================================================================
	{
		id: "loperamide",
		genericName: "Loperamide",
		brandNamesEgypt: ["Imodium", "Lopedium", "Vacontil", "Gastro-Stop"],
		pharmacologicalCategory: "Antidiarrheal, Opioid Receptor Agonist",
		atcCode: "A07DA03",
		indications: [
			"Symptomatic control of acute non-specific diarrhea in adults and children ≥12 years",
			"Chronic diarrhea associated with inflammatory bowel disease or IBS",
			"Reduction of ileostomy discharge volume"
		],
		clinicalSymptoms: ["watery diarrhea", "frequent loose stools", "cramps"],
		presentations: [
			{
				id: "lop-cap-2",
				form: "Capsule",
				strength: "2 mg",
				route: "Oral",
				isDefault: true
			},
			{
				id: "lop-odt-2",
				form: "Oro-dispersible Tablet",
				strength: "2 mg",
				route: "Oral"
			},
			{
				id: "lop-film-2",
				form: "Oro-dispersible Film",
				strength: "2 mg",
				route: "Oral"
			}
		],
		routes: ["Oral"],
		pediatricDosing: {
			standardDosePerKg: 0.1,
			doseUnit: "mg/kg/dose",
			frequency: "After each loose stool (max 3 times daily)",
			dosesPerDay: 3,
			maxSingleDoseMg: 2,
			maxDailyDoseMg: 6,
			minAgeMonths: 72, // ≥6 years
			guidelines:
				"CONTRAINDICATED in children <2 years. In Egypt EDA formulary: 6-8 years (20-30 kg): 2 mg twice daily (max 4 mg/day); 8-12 years (>30 kg): 2 mg 3 times daily (max 6 mg/day). >12 years: 2-4 mg initial, then 2 mg after each loose stool (max 8-16 mg/day)."
		},
		adultDosing: {
			standardDose:
				"Initial 4 mg orally, followed by 2 mg after each loose stool",
			maxDailyDose: "16 mg/day (prescription) / 8 mg/day (OTC)",
			frequency: "PRN after unformed stools",
			guidelines:
				"Discontinue if no improvement is seen within 48 hours. Maintain vigorous oral rehydration."
		},
		renalAdjustment: {
			crClNormal: "No dosage adjustment needed. Unlikely to be dialyzed."
		},
		hepaticAdjustment:
			"No pharmacokinetic data; use caution and monitor for CNS toxicity due to extensive first-pass metabolism.",
		foodCorrelation: "Administer with plenty of fluids to prevent dehydration.",
		contraindications: [
			"Children younger than 2 years of age (risk of paralytic ileus and toxic megacolon).",
			"Acute dysentery (characterized by blood in stools and high fever).",
			"Acute ulcerative colitis or pseudomembranous colitis.",
			"Bacterial enterocolitis caused by invasive organisms (Salmonella, Shigella, Campylobacter).",
			"Abdominal pain without diarrhea."
		],
		blackBoxWarnings: [
			"Cardiac Arrest and Torsades de Pointes: High doses or misuse as an opioid substitute can cause fatal QT prolongation and cardiac arrest."
		],
		majorAdverseReactions: [
			"Constipation",
			"Abdominal cramps",
			"Dizziness",
			"Nausea",
			"QTc prolongation at supra-therapeutic doses"
		],
		pregnancyCategory: "C",
		lactation:
			"Not recommended during lactation as small amounts may appear in breast milk.",
		riskXInteractions: ["Kratom"],
		riskDInteractions: ["Alvimopan", "Lonafarnib", "Sincalide"],
		monitoringParameters: [
			"Frequency of loose stools",
			"Hydration and electrolyte status",
			"Abdominal distension (rule out ileus)"
		]
	},
	{
		id: "ondansetron",
		genericName: "Ondansetron",
		brandNamesEgypt: ["Zofran", "Danset", "Emeset", "Onfran", "Ondalex"],
		pharmacologicalCategory: "Antiemetic; Selective 5-HT3 Receptor Antagonist",
		atcCode: "A04AA01",
		indications: [
			"Prevention and treatment of chemotherapy-induced nausea and vomiting (CINV)",
			"Prevention and treatment of radiotherapy-induced nausea and vomiting (RINV)",
			"Prevention and treatment of postoperative nausea and vomiting (PONV)",
			"Emergency department management of pediatric acute gastroenteritis vomiting"
		],
		clinicalSymptoms: ["vomiting", "nausea", "retching", "dehydration risk"],
		presentations: [
			{
				id: "ond-syr-4",
				form: "Oral Syrup",
				strength: "4 mg / 5 mL",
				concentrationMg: 4,
				volumeMl: 5,
				route: "Oral",
				isDefault: true
			},
			{
				id: "ond-tab-4",
				form: "Film-coated Tablet",
				strength: "4 mg",
				route: "Oral"
			},
			{
				id: "ond-tab-8",
				form: "Film-coated Tablet",
				strength: "8 mg",
				route: "Oral"
			},
			{
				id: "ond-odt-4",
				form: "Orally Disintegrating Tablet",
				strength: "4 mg",
				route: "Oral"
			},
			{
				id: "ond-amp-4",
				form: "Ampoule (IV/IM)",
				strength: "4 mg / 2 mL",
				concentrationMg: 2,
				volumeMl: 1,
				route: "IV"
			},
			{
				id: "ond-amp-8",
				form: "Ampoule (IV/IM)",
				strength: "8 mg / 4 mL",
				concentrationMg: 2,
				volumeMl: 1,
				route: "IV"
			},
			{
				id: "ond-supp-16",
				form: "Rectal Suppository",
				strength: "16 mg",
				route: "Rectal"
			}
		],
		routes: ["Oral", "IV", "IM", "Rectal"],
		pediatricDosing: {
			standardDosePerKg: 0.15,
			doseUnit: "mg/kg/dose",
			frequency: "Every 8 hours as needed",
			dosesPerDay: 3,
			minDosePerKg: 0.1,
			maxDosePerKg: 0.15,
			maxSingleDoseMg: 8,
			maxDailyDoseMg: 24,
			minAgeMonths: 6,
			guidelines:
				"Gastroenteritis/CINV: 0.15 mg/kg IV or oral (max 8 mg/dose). Alternatively weight bands: ≤10 kg: 2 mg syrup q12h; 10-20 kg: 4 mg syrup q12h; >20 kg: 8 mg q12h. Single IV dose must not exceed 16 mg (QT risk)."
		},
		adultDosing: {
			standardDose: "8 mg orally or IV twice to three times daily",
			maxDailyDose: "32 mg/day (single IV dose cap: 16 mg)",
			frequency: "Every 8 to 12 hours",
			guidelines:
				"PONV: 4 mg IV single dose at induction. CINV: 8 mg IV/oral 30 min before chemo."
		},
		renalAdjustment: {
			crClNormal:
				"No dosage adjustment needed for any degree of renal impairment."
		},
		hepaticAdjustment:
			"Severe hepatic impairment (Child-Pugh C): Maximum total daily dose is 8 mg (oral or IV).",
		foodCorrelation:
			"May be taken with or without food. Bioavailability slightly enhanced with food.",
		preparationAndInfusion: {
			finalInfusionConcentration:
				"Dilute in 25-50 mL (pediatric) or 50-100 mL (adult) NS or D5W",
			infusionRate:
				"Slow IV injection over 2 to 5 minutes or infusion over 15 minutes."
		},
		contraindications: [
			"Hypersensitivity to ondansetron or other 5-HT3 antagonists.",
			"Concomitant administration with apomorphine (causes profound hypotension and loss of consciousness).",
			"Congenital long QT syndrome."
		],
		majorAdverseReactions: [
			"Headache (9-24%)",
			"Constipation (9-11%)",
			"QT prolongation",
			"Fatigue/malaise",
			"Transient ALT/AST elevation"
		],
		pregnancyCategory: "B",
		lactation:
			"Not recommended during breastfeeding unless clearly indicated. Evaluate risk/benefit.",
		riskXInteractions: [
			"Apomorphine",
			"Domperidone",
			"Pimozide",
			"Piperaquine",
			"Thioridazine"
		],
		riskDInteractions: [
			"Amiodarone",
			"QT-prolonging Antiarrhythmics",
			"SSRIs/SNRIs (Serotonin Syndrome risk)"
		],
		monitoringParameters: [
			"ECG/QT interval in patients with electrolyte abnormalities or heart disease",
			"Bowel movement frequency",
			"Serum potassium and magnesium"
		]
	},
	{
		id: "granisetron",
		genericName: "Granisetron",
		brandNamesEgypt: ["Kytril", "Granitryl", "Graniset"],
		pharmacologicalCategory: "Antiemetic; Selective 5-HT3 Receptor Antagonist",
		atcCode: "A04AA02",
		indications: [
			"Prevention and treatment of acute and delayed nausea and vomiting associated with chemotherapy and radiotherapy",
			"Postoperative nausea and vomiting (PONV)"
		],
		clinicalSymptoms: ["vomiting", "chemotherapy emesis", "nausea"],
		presentations: [
			{
				id: "gra-amp-1",
				form: "Ampoule (IV)",
				strength: "1 mg / 1 mL",
				concentrationMg: 1,
				volumeMl: 1,
				route: "IV"
			},
			{
				id: "gra-amp-3",
				form: "Ampoule (IV)",
				strength: "3 mg / 3 mL",
				concentrationMg: 1,
				volumeMl: 1,
				route: "IV",
				isDefault: true
			},
			{
				id: "gra-tab-1",
				form: "Film-coated Tablet",
				strength: "1 mg",
				route: "Oral"
			},
			{
				id: "gra-tab-2",
				form: "Film-coated Tablet",
				strength: "2 mg",
				route: "Oral"
			},
			{
				id: "gra-sol-1",
				form: "Oral Solution",
				strength: "1 mg / 5 mL",
				concentrationMg: 1,
				volumeMl: 5,
				route: "Oral"
			},
			{
				id: "gra-patch-34",
				form: "Transdermal Patch",
				strength: "34.3 mg (worn up to 7 days)",
				route: "Topical"
			}
		],
		routes: ["IV", "Oral"],
		pediatricDosing: {
			standardDosePerKg: 20,
			doseUnit: "mcg/kg/dose",
			frequency: "Once before chemotherapy (max 2 doses/24h)",
			dosesPerDay: 1,
			minDosePerKg: 10,
			maxDosePerKg: 40,
			maxSingleDoseMg: 3,
			maxDailyDoseMg: 3,
			minAgeMonths: 24, // ≥2 years
			guidelines:
				"Children ≥2 years: IV: 10-40 mcg/kg (0.01-0.04 mg/kg) diluted in 10-30 mL saline infused over 5 minutes before chemotherapy (maximum 3 mg/dose)."
		},
		adultDosing: {
			standardDose:
				"Oral: 1-2 mg daily; IV: 1-3 mg (10-40 mcg/kg) as slow injection or infusion",
			maxDailyDose: "9 mg/day (chemo) / 3 mg/day (PONV)",
			frequency: "Once or twice daily",
			guidelines:
				"Oral: 1 mg twice daily or 2 mg once daily 1 hour before chemotherapy."
		},
		renalAdjustment: {
			crClNormal: "No dosage adjustment necessary."
		},
		hepaticAdjustment: "No dosage adjustment necessary.",
		foodCorrelation: "May be taken with or without food.",
		contraindications: [
			"Hypersensitivity to granisetron or other 5-HT3 antagonists."
		],
		majorAdverseReactions: [
			"Constipation (3-22%)",
			"Headache (9-21%)",
			"Asthenia",
			"QT prolongation",
			"Transient transaminase elevation"
		],
		pregnancyCategory: "B",
		lactation:
			"Discontinue breastfeeding during treatment; excretion in human milk unknown.",
		riskXInteractions: ["Apomorphine"],
		riskDInteractions: [
			"Amiodarone",
			"QT-prolonging Class IA/III Antiarrhythmics",
			"Serotonergic Agents"
		],
		monitoringParameters: [
			"ECG in patients with cardiac disease",
			"Bowel movement frequency",
			"Signs of Serotonin Syndrome"
		]
	},
	{
		id: "domperidone",
		genericName: "Domperidone",
		brandNamesEgypt: [
			"Motilium",
			"Gastromotil",
			"Motilat",
			"Farcomotil",
			"Dompidon"
		],
		pharmacologicalCategory:
			"Dopamine Antagonist; Gastrointestinal Agent, Prokinetic",
		atcCode: "A03FA03",
		indications: [
			"Relief of symptoms of nausea and vomiting in adults and adolescents ≥12 years and ≥35 kg",
			"Delayed gastric emptying and functional dyspepsia (short-term)"
		],
		clinicalSymptoms: ["nausea", "vomiting", "epigastric bloating", "fullness"],
		presentations: [
			{
				id: "dom-susp-5",
				form: "Oral Suspension",
				strength: "5 mg / 5 mL",
				concentrationMg: 5,
				volumeMl: 5,
				route: "Oral",
				isDefault: true
			},
			{
				id: "dom-tab-10",
				form: "Film-coated Tablet",
				strength: "10 mg",
				route: "Oral"
			},
			{
				id: "dom-odt-10",
				form: "Oro-dispersible Tablet",
				strength: "10 mg",
				route: "Oral"
			},
			{
				id: "dom-supp-30",
				form: "Rectal Suppository",
				strength: "30 mg",
				route: "Rectal"
			}
		],
		routes: ["Oral", "Rectal"],
		pediatricDosing: {
			standardDosePerKg: 0.25,
			doseUnit: "mg/kg/dose",
			frequency: "Three times daily before meals",
			dosesPerDay: 3,
			minDosePerKg: 0.25,
			maxDosePerKg: 0.25,
			maxSingleDoseMg: 10,
			maxDailyDoseMg: 30,
			minAgeMonths: 144, // ≥12 years and ≥35 kg per EDA
			guidelines:
				"EDA & EMA Advisory: Children <12 years and <35 kg are NOT recommended due to cardiac arrhythmia risks. Adolescents ≥12 years (≥35 kg): 10 mg up to 3 times daily (max 30 mg/day). Maximum treatment duration: 7 days."
		},
		adultDosing: {
			standardDose: "10 mg up to 3 times daily (max 30 mg/day)",
			maxDailyDose: "30 mg/day",
			frequency: "Three times daily before meals",
			guidelines:
				"Use lowest effective dose for maximum duration of 7 days. Take 15-30 minutes before meals."
		},
		renalAdjustment: {
			crClNormal: "No adjustment in mild impairment.",
			crClSevere:
				"Severe impairment: Reduce dosing frequency to once or twice daily."
		},
		hepaticAdjustment:
			"Mild impairment: No adjustment. Moderate to severe impairment (Child-Pugh B or C): CONTRAINDICATED.",
		foodCorrelation:
			"Administer 15 to 30 minutes before meals. Absorption delayed if taken after food.",
		contraindications: [
			"Children <12 years of age or weighing <35 kg (EDA safety restriction).",
			"Moderate to severe hepatic impairment.",
			"Existing prolongation of cardiac conduction intervals (QTc) or congestive heart failure.",
			"Coadministration with potent CYP3A4 inhibitors (ketoconazole, erythromycin, clarithromycin).",
			"Coadministration with QT-prolonging drugs.",
			"Prolactin-releasing pituitary tumor (prolactinoma).",
			"Gastrointestinal hemorrhage, mechanical obstruction, or perforation."
		],
		blackBoxWarnings: [
			"Ventricular Arrhythmia and Sudden Cardiac Death: Doses >30 mg/day or use in patients >60 years significantly increases risk of fatal ventricular arrhythmias."
		],
		majorAdverseReactions: [
			"QT prolongation / Arrhythmias",
			"Hyperprolactinemia (galactorrhea, gynecomastia)",
			"Dry mouth",
			"Headache",
			"Diarrhea"
		],
		pregnancyCategory: "C",
		lactation:
			"Passes into breast milk in small amounts (<0.1%). Caution regarding infant QTc prolongation.",
		riskXInteractions: [
			"Ketoconazole",
			"Erythromycin",
			"Clarithromycin",
			"Ondansetron",
			"Pimozide",
			"Amiodarone"
		],
		riskDInteractions: ["Moderate CYP3A4 Inhibitors", "Fusidic Acid"],
		monitoringParameters: [
			"Baseline ECG for QTc interval",
			"Serum potassium and magnesium",
			"Prolactin levels if symptomatic"
		]
	},
	{
		id: "metoclopramide",
		genericName: "Metoclopramide",
		brandNamesEgypt: ["Primperan", "Plasil", "Mepramide", "Primperam"],
		pharmacologicalCategory:
			"Antiemetic; Dopamine Antagonist; Prokinetic; 5-HT4 Agonist",
		atcCode: "A03FA01",
		indications: [
			"Symptomatic treatment of nausea and vomiting, including acute migraine-induced",
			"Prevention of delayed chemotherapy-induced nausea and vomiting (second-line)",
			"Postoperative nausea and vomiting (PONV)",
			"Diabetic gastroparesis and gastroesophageal reflux"
		],
		clinicalSymptoms: [
			"vomiting",
			"nausea",
			"migraine nausea",
			"delayed gastric emptying",
			"postop vomiting"
		],
		presentations: [
			{
				id: "met-syr-5",
				form: "Oral Syrup",
				strength: "5 mg / 5 mL (1 mg/mL)",
				concentrationMg: 5,
				volumeMl: 5,
				route: "Oral",
				isDefault: true
			},
			{
				id: "met-drops-2",
				form: "Oral Drops",
				strength: "2 mg / 1 mL",
				concentrationMg: 2,
				volumeMl: 1,
				route: "Oral"
			},
			{
				id: "met-tab-10",
				form: "Scored Tablet",
				strength: "10 mg",
				route: "Oral"
			},
			{
				id: "met-amp-10",
				form: "Ampoule (IM/IV)",
				strength: "10 mg / 2 mL",
				concentrationMg: 5,
				volumeMl: 1,
				route: "IV"
			},
			{
				id: "met-supp-10",
				form: "Rectal Suppository",
				strength: "10 mg",
				route: "Rectal"
			},
			{
				id: "met-supp-20",
				form: "Rectal Suppository",
				strength: "20 mg",
				route: "Rectal"
			}
		],
		routes: ["Oral", "IV", "IM", "Rectal"],
		pediatricDosing: {
			standardDosePerKg: 0.1,
			doseUnit: "mg/kg/dose",
			frequency: "Every 8 hours (minimum 6h interval)",
			dosesPerDay: 3,
			minDosePerKg: 0.1,
			maxDosePerKg: 0.15,
			maxSingleDoseMg: 10,
			maxDailyDoseMg: 0.5, // 0.5 mg/kg/day
			minAgeMonths: 12, // CONTRAINDICATED <1 year
			guidelines:
				"CONTRAINDICATED in infants <1 year (severe extrapyramidal dystonias & methemoglobinemia). Ages 1-18 years: 0.1 to 0.15 mg/kg/dose up to 3 times daily (max 0.5 mg/kg/day). Maximum duration: 48h for PONV, 5 days for CINV. Respect 6-hour minimum interval even if vomited."
		},
		adultDosing: {
			standardDose: "10 mg orally, IV, or IM up to 3 times daily",
			maxDailyDose: "30 mg/day (or 0.5 mg/kg/day)",
			frequency: "Every 8 hours (minimum 6 hours apart)",
			guidelines:
				"Maximum duration of therapy is 5 days (up to 12 weeks only in diabetic gastroparesis). Inject IV over at least 3 minutes."
		},
		renalAdjustment: {
			crClNormal: "CrCl >60 mL/min: No adjustment needed.",
			crClMildToModerate: "CrCl 15-60 mL/min: Reduce dose by 50%.",
			crClSevere: "CrCl <15 mL/min (ESRD): Reduce daily dose by 75%."
		},
		hepaticAdjustment:
			"Mild impairment: No adjustment. Severe impairment: Reduce dose by 50%.",
		foodCorrelation: "Administer 30 minutes before meals and at bedtime.",
		contraindications: [
			"Neonates and infants younger than 1 year of age.",
			"Gastrointestinal hemorrhage, mechanical obstruction, or perforation.",
			"Pheochromocytoma (risk of hypertensive crisis).",
			"History of neuroleptic or metoclopramide-induced tardive dyskinesia.",
			"Epilepsy or seizure disorders.",
			"Parkinson's disease or combination with levodopa/dopaminergic agonists.",
			"Known history of methemoglobinemia or NADH-cytochrome b5 deficiency."
		],
		blackBoxWarnings: [
			"Tardive Dyskinesia: Treatment beyond 12 weeks substantially increases risk of irreversible involuntary movements (tardive dyskinesia), especially in elderly females."
		],
		majorAdverseReactions: [
			"Drowsiness (10-70%)",
			"Acute dystonic reactions (facial spasms, oculogyric crisis)",
			"Restlessness / akathisia",
			"Hyperprolactinemia",
			"Neuroleptic Malignant Syndrome"
		],
		pregnancyCategory: "B",
		lactation:
			"Excreted in human milk; not recommended during lactation. Discontinue or choose alternative.",
		riskXInteractions: [
			"Levodopa",
			"Dopamine Agonists",
			"Antipsychotic Agents",
			"Promethazine",
			"Cabergoline",
			"Droperidol"
		],
		riskDInteractions: [
			"Strong CYP2D6 Inhibitors (fluoxetine, paroxetine)",
			"Atovaquone"
		],
		monitoringParameters: [
			"Extrapyramidal signs (dystonia, tremor)",
			"Renal and hepatic function",
			"Blood pressure during IV administration"
		]
	},
	{
		id: "simethicone",
		genericName: "Simethicone",
		brandNamesEgypt: [
			"Dentacarm",
			"Simethicone Pharco",
			"Baby Rest",
			"Disflatyl",
			"Salinal"
		],
		pharmacologicalCategory: "Antiflatulent, Surface-Active Inert Polymer",
		atcCode: "A03AX13",
		indications: [
			"Infantile colic and flatulence",
			"Abdominal bloating, wind pain, and gas distension",
			"Diagnostic bowel preparation adjunct for endoscopy/ultrasound"
		],
		clinicalSymptoms: [
			"infantile colic",
			"bloating",
			"gas cramps",
			"abdominal distension"
		],
		presentations: [
			{
				id: "sim-drops-40",
				form: "Oral Drops",
				strength: "40 mg / 1 mL",
				concentrationMg: 40,
				volumeMl: 1,
				route: "Oral",
				isDefault: true
			},
			{
				id: "sim-drops-20",
				form: "Oral Drops",
				strength: "20 mg / 1 mL",
				concentrationMg: 20,
				volumeMl: 1,
				route: "Oral"
			},
			{
				id: "sim-tab-40",
				form: "Chewable Tablet",
				strength: "40 mg",
				route: "Oral"
			},
			{
				id: "sim-tab-125",
				form: "Chewable Tablet",
				strength: "125 mg",
				route: "Oral"
			}
		],
		routes: ["Oral"],
		pediatricDosing: {
			standardDosePerKg: 20,
			doseUnit: "fixed_mg",
			frequency: "After feeds or meals (3 to 4 times daily)",
			dosesPerDay: 4,
			maxSingleDoseMg: 40,
			maxDailyDoseMg: 240,
			minAgeMonths: 0,
			guidelines:
				"Infants & Children <2 years: 20 mg (approx 0.5 mL drops) after feeds (max 240 mg/day). Children 2-12 years: 40 mg (1 mL drops or 1 chewable tab) 3-4 times daily."
		},
		adultDosing: {
			standardDose: "40 to 125 mg four times daily after meals and at bedtime",
			maxDailyDose: "500 mg/day",
			frequency: "3 to 4 times daily after meals",
			guidelines:
				"Chew tablets thoroughly before swallowing. Drops may be mixed with cool water or formula."
		},
		renalAdjustment: {
			crClNormal:
				"No dosage adjustment needed. Physiologically inert; not systemically absorbed."
		},
		hepaticAdjustment: "No dosage adjustment needed. Not absorbed.",
		foodCorrelation:
			"Administer after meals and at bedtime for maximum antifoaming efficacy.",
		contraindications: [
			"Hypersensitivity to simethicone or formulation excipients."
		],
		majorAdverseReactions: ["Loose stools (rare)", "Nausea (mild)"],
		pregnancyCategory: "C",
		lactation:
			"Not absorbed systemically; considered safe during pregnancy and lactation.",
		riskXInteractions: ["None identified."],
		riskDInteractions: ["None identified."],
		monitoringParameters: ["Relief of gas and infant crying time"]
	},
	{
		id: "hyoscine-butylbromide",
		genericName: "Hyoscine-N-butyl bromide (Scopolamine butylbromide)",
		brandNamesEgypt: ["Buscopan", "Spasmopan", "Scopex", "Buscapin"],
		pharmacologicalCategory: "Anticholinergic / Antispasmodic Agent",
		atcCode: "A03BA03",
		indications: [
			"Gastrointestinal tract smooth muscle spasm and colic",
			"Biliary and renal colic acute spasm",
			"Irritable bowel syndrome (IBS) cramping pain",
			"Diagnostic endoscopic and radiological spasm reduction"
		],
		clinicalSymptoms: [
			"abdominal colic",
			"severe cramps",
			"spasm",
			"irritable bowel pain"
		],
		presentations: [
			{
				id: "hyo-tab-10",
				form: "Tablet",
				strength: "10 mg",
				route: "Oral",
				isDefault: true
			},
			{
				id: "hyo-syr-5",
				form: "Oral Syrup",
				strength: "5 mg / 5 mL",
				concentrationMg: 5,
				volumeMl: 5,
				route: "Oral"
			},
			{
				id: "hyo-amp-20",
				form: "Solution for Injection (IM/IV/SC)",
				strength: "20 mg / 1 mL",
				concentrationMg: 20,
				volumeMl: 1,
				route: "IV"
			},
			{
				id: "hyo-supp-15",
				form: "Rectal Suppository",
				strength: "15 mg",
				route: "Rectal"
			}
		],
		routes: ["Oral", "IV", "IM", "Rectal"],
		pediatricDosing: {
			standardDosePerKg: 10,
			doseUnit: "fixed_mg",
			frequency: "Three times daily",
			dosesPerDay: 3,
			maxSingleDoseMg: 10,
			maxDailyDoseMg: 30,
			minAgeMonths: 72, // ≥6 years
			guidelines:
				"Children 6 to 12 years: Oral: 10 mg (or 10 mL syrup) three times daily. Not recommended for children <6 years unless supervised. Do not use continuously without diagnosis."
		},
		adultDosing: {
			standardDose:
				"Oral: 10-20 mg 3 to 4 times daily; Parenteral (IV/IM): 20 mg repeated after 30 min if needed",
			maxDailyDose: "100 mg/day (parenteral) / 80 mg/day (oral)",
			frequency: "3 to 4 times daily",
			guidelines:
				"Inject IV slowly over 1-2 minutes to prevent tachycardia and hypotension."
		},
		renalAdjustment: {
			crClNormal: "No dosage adjustments required. Use with caution."
		},
		hepaticAdjustment: "No dosage adjustments required. Use with caution.",
		foodCorrelation: "Administer with water before or after meals.",
		contraindications: [
			"Narrow-angle glaucoma.",
			"Mechanical stenosis of gastrointestinal tract or paralytic ileus.",
			"Megacolon.",
			"Myasthenia gravis.",
			"Prostatic hypertrophy with urinary retention.",
			"Tachycardia and unstable cardiovascular disease."
		],
		majorAdverseReactions: [
			"Xerostomia (dry mouth: 29-67%)",
			"Tachycardia",
			"Dizziness",
			"Blurred vision (mydriasis)",
			"Urinary retention"
		],
		pregnancyCategory: "C",
		lactation:
			"Not recommended during pregnancy and lactation due to limited data and anticholinergic effects.",
		riskXInteractions: [
			"Aclidinium",
			"Ipratropium",
			"Glycopyrrolate",
			"Tiotropium",
			"Potassium Chloride oral tabs"
		],
		riskDInteractions: [
			"Opioid Agonists",
			"Clozapine",
			"Hydroxyzine",
			"Zolpidem"
		],
		monitoringParameters: [
			"Heart rate",
			"Intraocular pressure in glaucoma",
			"Urinary output and bowel motility"
		]
	},
	{
		id: "mebeverine",
		genericName: "Mebeverine",
		brandNamesEgypt: [
			"Duspatalin",
			"Coloverin",
			"Spasmocolona",
			"Colona",
			"Mebafac"
		],
		pharmacologicalCategory: "Antispasmodic Agent, Gastrointestinal",
		atcCode: "A03AA04",
		indications: [
			"Irritable bowel syndrome (IBS) and chronic irritable colon",
			"Spastic constipation and mucous colitis",
			"Gastrointestinal spasms secondary to functional disorders"
		],
		clinicalSymptoms: [
			"IBS cramps",
			"abdominal bloating",
			"alternating constipation and diarrhea",
			"colonic spasm"
		],
		presentations: [
			{ id: "meb-tab-135", form: "Tablet", strength: "135 mg", route: "Oral" },
			{
				id: "meb-cap-200",
				form: "Modified Release Capsule",
				strength: "200 mg",
				route: "Oral",
				isDefault: true
			},
			{
				id: "meb-susp-50",
				form: "Oral Suspension",
				strength: "50 mg / 5 mL",
				concentrationMg: 50,
				volumeMl: 5,
				route: "Oral"
			}
		],
		routes: ["Oral"],
		pediatricDosing: {
			standardDosePerKg: 150,
			doseUnit: "fixed_mg",
			frequency: "Three times daily before meals",
			dosesPerDay: 3,
			maxSingleDoseMg: 150,
			maxDailyDoseMg: 450,
			minAgeMonths: 120, // ≥10 years
			guidelines:
				"Children ≥10 years: Oral suspension: 150 mg (15 mL) 3 times daily, 20 minutes before meals. Solid tablets/capsules are not recommended in children <18 years."
		},
		adultDosing: {
			standardDose:
				"135 mg three times daily (IR) or 200 mg twice daily (MR capsule)",
			maxDailyDose: "400 mg/day (MR) / 405 mg/day (IR)",
			frequency: "Twice daily (MR) or 3 times daily (IR)",
			guidelines:
				"Administer 20 minutes before meals. Swallow MR capsules whole with water; do not chew or crush."
		},
		renalAdjustment: {
			crClNormal: "No dosage adjustments necessary."
		},
		hepaticAdjustment: "No dosage adjustments necessary.",
		foodCorrelation: "Administer preferably 20 minutes before meals.",
		contraindications: [
			"Hypersensitivity to mebeverine or formulation ingredients.",
			"Paralytic ileus."
		],
		majorAdverseReactions: [
			"Urticaria and skin rash",
			"Angioedema",
			"Dizziness",
			"Headache"
		],
		pregnancyCategory: "B",
		lactation:
			"Not recommended during pregnancy and lactation due to limited clinical data.",
		riskXInteractions: ["No known significant interactions."],
		riskDInteractions: ["None identified."],
		monitoringParameters: ["Resolution of abdominal pain and cramping"]
	},
	{
		id: "ursodeoxycholic-acid",
		genericName: "Ursodeoxycholic acid",
		brandNamesEgypt: ["Ursofalk", "Ursogall", "Ursodiol", "Livago", "Biliver"],
		pharmacologicalCategory:
			"Gallstone Dissolution Agent; Hepatoprotective Bile Acid",
		atcCode: "A05AA02",
		indications: [
			"Hepatobiliary disorders associated with cystic fibrosis in children",
			"Neonatal cholestasis / total parenteral nutrition (TPN) cholestasis",
			"Primary biliary cholangitis (PBC)",
			"Dissolution of radiolucent cholesterol gallstones"
		],
		clinicalSymptoms: [
			"jaundice",
			"cholestasis",
			"pale stools",
			"pruritus",
			"cystic fibrosis liver disease"
		],
		presentations: [
			{
				id: "udc-susp-250",
				form: "Oral Suspension",
				strength: "250 mg / 5 mL",
				concentrationMg: 250,
				volumeMl: 5,
				route: "Oral",
				isDefault: true
			},
			{ id: "udc-cap-250", form: "Capsule", strength: "250 mg", route: "Oral" },
			{ id: "udc-tab-500", form: "Tablet", strength: "500 mg", route: "Oral" }
		],
		routes: ["Oral"],
		pediatricDosing: {
			standardDosePerKg: 20,
			doseUnit: "mg/kg/day",
			frequency: "Every 8 to 12 hours (in 2-3 divided doses)",
			dosesPerDay: 2,
			minDosePerKg: 15,
			maxDosePerKg: 30,
			maxSingleDoseMg: 500,
			maxDailyDoseMg: 1500,
			minAgeMonths: 1,
			guidelines:
				"Cystic fibrosis hepatobiliary disease & neonatal cholestasis: 20 mg/kg/day divided in 2-3 doses with meals, titrating up to 30 mg/kg/day if necessary."
		},
		adultDosing: {
			standardDose:
				"Primary Biliary Cholangitis: 12-16 mg/kg/day; Gallstones: 8-12 mg/kg/day",
			maxDailyDose: "1500 mg/day",
			frequency: "Divided 2-3 times daily or single evening dose",
			guidelines: "Take with food/meals. Do not chew capsules."
		},
		renalAdjustment: {
			crClNormal: "No dosage adjustment needed."
		},
		hepaticAdjustment:
			"No dosage adjustment needed. Discontinue if persistent worsening diarrhea occurs.",
		foodCorrelation: "Administer with food or milk.",
		contraindications: [
			"Acute inflammation of gallbladder or biliary tract.",
			"Complete occlusion of the biliary tract.",
			"Frequent episodes of biliary colic.",
			"Radio-opaque calcified gallstones.",
			"Non-functioning gallbladder."
		],
		majorAdverseReactions: [
			"Diarrhea (1-27%)",
			"Dyspepsia",
			"Nausea",
			"Pruritus exacerbation initially"
		],
		pregnancyCategory: "B",
		lactation:
			"Bile acid levels in breast milk are extremely low. Considered acceptable in nursing.",
		riskXInteractions: ["None identified."],
		riskDInteractions: [
			"Aluminum Hydroxide antacids",
			"Bile Acid Sequestrants (Cholestyramine)",
			"Sincalide"
		],
		monitoringParameters: [
			"Serum AST, ALT, GGT, bilirubin baseline and every 3 months",
			"Gallbladder ultrasound"
		]
	},
	{
		id: "famotidine",
		genericName: "Famotidine",
		brandNamesEgypt: ["Antod", "Famotin", "Gastrodine", "Famotak"],
		pharmacologicalCategory: "Histamine H2 Receptor Antagonist",
		atcCode: "A02BA03",
		indications: [
			"Gastroesophageal reflux disease (GERD) with or without esophagitis",
			"Duodenal and benign gastric ulcers treatment and relapse prevention",
			"Stress ulcer prophylaxis in critically ill pediatric patients",
			"Heartburn and acid indigestion"
		],
		clinicalSymptoms: [
			"heartburn",
			"acid regurgitation",
			"epigastric burning",
			"infant reflux irritability"
		],
		presentations: [
			{
				id: "fam-susp-40",
				form: "Oral Suspension",
				strength: "40 mg / 5 mL",
				concentrationMg: 40,
				volumeMl: 5,
				route: "Oral",
				isDefault: true
			},
			{
				id: "fam-tab-20",
				form: "Film-coated Tablet",
				strength: "20 mg",
				route: "Oral"
			},
			{
				id: "fam-tab-40",
				form: "Film-coated Tablet",
				strength: "40 mg",
				route: "Oral"
			},
			{
				id: "fam-vial-20",
				form: "Vial (IV/IM)",
				strength: "20 mg / 2 mL",
				concentrationMg: 10,
				volumeMl: 1,
				route: "IV"
			}
		],
		routes: ["Oral", "IV", "IM"],
		pediatricDosing: {
			standardDosePerKg: 0.5,
			doseUnit: "mg/kg/dose",
			frequency: "Every 12 hours (twice daily)",
			dosesPerDay: 2,
			minDosePerKg: 0.5,
			maxDosePerKg: 1.0,
			maxSingleDoseMg: 20,
			maxDailyDoseMg: 40,
			minAgeMonths: 1,
			guidelines:
				"GERD & Peptic ulcer in children 1-16 years: Oral: 0.5 mg/kg/dose twice daily (max 40 mg/day). IV: 0.25 mg/kg/dose q12h (max 40 mg/day). Infants <3 months: 0.5 mg/kg once daily."
		},
		adultDosing: {
			standardDose: "20 mg twice daily or 40 mg once daily at bedtime",
			maxDailyDose: "80 mg/day (up to 800 mg/day in Zollinger-Ellison)",
			frequency: "Once daily at bedtime or twice daily",
			guidelines:
				"Duodenal ulcer: 40 mg at bedtime for 4-8 weeks. GERD: 20-40 mg twice daily for 6-12 weeks."
		},
		renalAdjustment: {
			crClNormal: "CrCl ≥50 mL/min: No adjustment.",
			crClMildToModerate:
				"CrCl 30-49 mL/min: Reduce dose by 50% or extend interval to q36-48h.",
			crClSevere:
				"CrCl <30 mL/min: Administer 50% of dose or extend interval to every 36-48 hours.",
			dialysis: "Hemodialysis: Administer dose after dialysis session."
		},
		hepaticAdjustment: "No dosage adjustments needed.",
		foodCorrelation:
			"Administer with or without food. For heartburn, take 15-60 min before trigger food.",
		preparationAndInfusion: {
			reconstitutionDiluent: "0.9% NaCl or D5W",
			infusionRate:
				"IV push over at least 2 minutes; IV infusion over 15 to 30 minutes."
		},
		contraindications: [
			"Hypersensitivity to famotidine or other H2 receptor antagonists."
		],
		majorAdverseReactions: [
			"Headache",
			"Dizziness",
			"Constipation / diarrhea",
			"Agitation in infants",
			"CNS confusion in renal impairment"
		],
		pregnancyCategory: "B",
		lactation: "Excreted in human milk; use caution and consider risk/benefit.",
		riskXInteractions: [
			"Dasatinib",
			"Pazopanib",
			"Posaconazole",
			"Nirogacestat",
			"Sotorasib"
		],
		riskDInteractions: [
			"Atazanavir",
			"Cefuroxime",
			"Itraconazole",
			"Ketoconazole",
			"Ledipasvir"
		],
		monitoringParameters: [
			"Renal function baseline",
			"Symptomatic ulcer relief",
			"CBC in long-term high-dose therapy"
		]
	},
	{
		id: "esomeprazole",
		genericName: "Esomeprazole",
		brandNamesEgypt: ["Nexium", "Esofag", "Ezogast", "Nexicure", "Gastrazole"],
		pharmacologicalCategory: "Proton Pump Inhibitor (PPI)",
		atcCode: "A02BC05",
		indications: [
			"Gastroesophageal reflux disease (GERD) and erosive esophagitis",
			"Helicobacter pylori eradication (with amoxicillin and clarithromycin)",
			"NSAID-associated gastric ulcer healing and prophylaxis",
			"Zollinger-Ellison syndrome",
			"Prevention of rebleeding following peptic ulcer endoscopy"
		],
		clinicalSymptoms: [
			"acid reflux",
			"heartburn",
			"epigastric gnawing pain",
			"hematemesis",
			"vomiting"
		],
		presentations: [
			{
				id: "eso-sach-10",
				form: "Granules in Sachet",
				strength: "10 mg",
				route: "Oral",
				isDefault: true
			},
			{
				id: "eso-sach-20",
				form: "Granules in Sachet",
				strength: "20 mg",
				route: "Oral"
			},
			{
				id: "eso-tab-20",
				form: "Gastro-resistant Tablet",
				strength: "20 mg",
				route: "Oral"
			},
			{
				id: "eso-tab-40",
				form: "Gastro-resistant Tablet",
				strength: "40 mg",
				route: "Oral"
			},
			{
				id: "eso-vial-40",
				form: "Vial (IV Infusion)",
				strength: "40 mg",
				route: "IV"
			}
		],
		routes: ["Oral", "IV"],
		pediatricDosing: {
			standardDosePerKg: 10,
			doseUnit: "fixed_mg",
			frequency: "Once daily",
			dosesPerDay: 1,
			maxSingleDoseMg: 20,
			maxDailyDoseMg: 40,
			minAgeMonths: 1,
			guidelines:
				"Children 1-11 years: Weight <20 kg: 10 mg once daily for 8 weeks. Weight ≥20 kg: 10 to 20 mg once daily for 8 weeks. Adolescents ≥12 years: 20-40 mg once daily. Infants 1-11 months: 0.5 mg/kg once daily."
		},
		adultDosing: {
			standardDose: "20 to 40 mg once daily orally (or IV over 10-30 min)",
			maxDailyDose: "40 mg/day (up to 160 mg/day in Zollinger-Ellison)",
			frequency: "Once daily (divided twice daily if >80 mg)",
			guidelines:
				"Erosive esophagitis: 40 mg once daily for 4-8 weeks. Maintenance: 20 mg once daily."
		},
		renalAdjustment: {
			crClNormal:
				"No dosage adjustments required for any degree of renal impairment."
		},
		hepaticAdjustment:
			"Severe hepatic impairment (Child-Pugh C): Maximum dose 20 mg/day in adults; 10 mg/day in children 1-11 years.",
		foodCorrelation: "Administer at least 1 hour before meals in the morning.",
		preparationAndInfusion: {
			reconstitutionDiluent: "5 mL 0.9% NaCl, then dilute up to 100 mL",
			infusionRate:
				"IV injection over ≥3 minutes; IV infusion over 10 to 30 minutes.",
			stability: "Use within 12 hours at room temperature."
		},
		contraindications: [
			"Hypersensitivity to esomeprazole, substituted benzimidazoles, or PPIs.",
			"Coadministration with rilpivirine-containing products."
		],
		majorAdverseReactions: [
			"Headache",
			"Diarrhea (risk of Clostridioides difficile colitis)",
			"Abdominal pain",
			"Hypomagnesemia with long-term use (>3 months)",
			"Vitamin B12 malabsorption with long-term therapy (>3 years)",
			"Acute interstitial nephritis (TIN)"
		],
		pregnancyCategory: "B",
		lactation:
			"Not recommended during breastfeeding; excretion in human milk unknown.",
		riskXInteractions: [
			"Clopidogrel (decreases active antiplatelet metabolite)",
			"Rilpivirine",
			"Dasatinib",
			"Erlotinib",
			"Pazopanib",
			"St John's Wort"
		],
		riskDInteractions: [
			"Methotrexate (elevates methotrexate levels)",
			"Atazanavir",
			"Ketoconazole",
			"Posaconazole",
			"Ledipasvir"
		],
		monitoringParameters: [
			"Serum magnesium in prolonged use",
			"Serum calcium",
			"Bone density in long-term elderly therapy",
			"Complete symptom relief"
		]
	},
	{
		id: "omeprazole",
		genericName: "Omeprazole",
		brandNamesEgypt: [
			"Losec",
			"Gastrazole",
			"Omepak",
			"Gasec",
			"Hyposec",
			"Pepzol"
		],
		pharmacologicalCategory: "Proton Pump Inhibitor (PPI)",
		atcCode: "A02BC01",
		indications: [
			"Gastroesophageal reflux disease (GERD) and reflux esophagitis",
			"Duodenal and benign gastric ulcers treatment and prevention",
			"Eradication of H. pylori (with clarithromycin and amoxicillin)",
			"Zollinger-Ellison syndrome",
			"Acid aspiration prophylaxis before surgery"
		],
		clinicalSymptoms: [
			"heartburn",
			"acid regurgitation",
			"epigastric hunger pain",
			"gastric ulcer"
		],
		presentations: [
			{
				id: "ome-cap-10",
				form: "Delayed-release Capsule",
				strength: "10 mg",
				route: "Oral"
			},
			{
				id: "ome-cap-20",
				form: "Delayed-release Capsule",
				strength: "20 mg",
				route: "Oral",
				isDefault: true
			},
			{
				id: "ome-cap-40",
				form: "Delayed-release Capsule",
				strength: "40 mg",
				route: "Oral"
			},
			{
				id: "ome-vial-40",
				form: "Vial (IV Infusion)",
				strength: "40 mg",
				route: "IV"
			}
		],
		routes: ["Oral", "IV"],
		pediatricDosing: {
			standardDosePerKg: 1,
			doseUnit: "mg/kg/day",
			frequency: "Once daily in the morning",
			dosesPerDay: 1,
			minDosePerKg: 0.7,
			maxDosePerKg: 1.4,
			maxSingleDoseMg: 20,
			maxDailyDoseMg: 40,
			minAgeMonths: 12,
			guidelines:
				"Children ≥1 year: 0.7 to 1.4 mg/kg/day once daily in the morning (max 40 mg/day). Weight 10-20 kg: 10 mg once daily. Weight >20 kg: 20 mg once daily."
		},
		adultDosing: {
			standardDose:
				"20 mg once daily (40 mg in severe or refractory esophagitis)",
			maxDailyDose: "40 mg/day (up to 120 mg/day in Zollinger-Ellison)",
			frequency: "Once daily before breakfast",
			guidelines:
				"Duodenal ulcer: 20 mg once daily for 4-8 weeks. H. pylori: 20 mg twice daily with antibiotics."
		},
		renalAdjustment: {
			crClNormal:
				"No dosage adjustments needed for any degree of renal impairment."
		},
		hepaticAdjustment:
			"Oral: 10 to 20 mg once daily is usually sufficient in severe impairment.",
		foodCorrelation:
			"Administer in the morning before meals. Swallow capsule whole with water.",
		preparationAndInfusion: {
			reconstitutionDiluent:
				"Dissolve in 5 mL, then dilute in 100 mL 0.9% NaCl or D5W",
			infusionRate: "Infuse over 20 to 30 minutes.",
			stability: "Use within 12h in NaCl, 6h in D5W at room temp."
		},
		contraindications: [
			"Hypersensitivity to omeprazole or substituted benzimidazoles."
		],
		majorAdverseReactions: [
			"Headache (7%)",
			"Abdominal pain (5%)",
			"Diarrhea (4%)",
			"Hypomagnesemia",
			"Acute tubulointerstitial nephritis"
		],
		pregnancyCategory: "C",
		lactation:
			"Compatible with breastfeeding per clinical guidelines; minimal infant adverse effects.",
		riskXInteractions: [
			"Clopidogrel",
			"Rilpivirine",
			"Dasatinib",
			"Erlotinib",
			"St John's Wort"
		],
		riskDInteractions: [
			"Methotrexate",
			"Atazanavir",
			"Ketoconazole",
			"Posaconazole",
			"Citalopram"
		],
		monitoringParameters: [
			"Serum magnesium in long-term therapy",
			"CBC",
			"Bowel movement changes"
		]
	},
	{
		id: "pantoprazole",
		genericName: "Pantoprazole",
		brandNamesEgypt: [
			"Controloc",
			"Zurcal",
			"Pantoloc",
			"Protocid",
			"Pantozol"
		],
		pharmacologicalCategory: "Proton Pump Inhibitor (PPI)",
		atcCode: "A02BC02",
		indications: [
			"Short-term treatment and maintenance of erosive esophagitis in GERD",
			"Gastric and duodenal ulcers",
			"Pathological hypersecretion (Zollinger-Ellison syndrome)",
			"Prevention of NSAID-induced gastroduodenal ulcers in patients at risk",
			"Acute upper GI bleeding ulcer management (IV)"
		],
		clinicalSymptoms: [
			"severe heartburn",
			"bleeding ulcer",
			"epigastric pain",
			"erosive reflux"
		],
		presentations: [
			{
				id: "pan-tab-20",
				form: "Enteric-coated Tablet",
				strength: "20 mg",
				route: "Oral"
			},
			{
				id: "pan-tab-40",
				form: "Enteric-coated Tablet",
				strength: "40 mg",
				route: "Oral",
				isDefault: true
			},
			{
				id: "pan-vial-40",
				form: "Vial (IV Infusion)",
				strength: "40 mg",
				route: "IV"
			}
		],
		routes: ["Oral", "IV"],
		pediatricDosing: {
			standardDosePerKg: 20,
			doseUnit: "fixed_mg",
			frequency: "Once daily in the morning",
			dosesPerDay: 1,
			maxSingleDoseMg: 40,
			maxDailyDoseMg: 40,
			minAgeMonths: 60, // ≥5 years
			guidelines:
				"Children ≥5 years: Weight 15 to <40 kg: 20 mg once daily for up to 8 weeks. Weight ≥40 kg: 40 mg once daily. Pediatric IV: 0.8 mg/kg once daily for <12.5 kg."
		},
		adultDosing: {
			standardDose: "40 mg once daily orally (or IV over 15 minutes)",
			maxDailyDose: "80 mg/day (up to 240 mg/day in Zollinger-Ellison)",
			frequency: "Once daily before breakfast",
			guidelines:
				"Acute bleeding ulcer: 80 mg IV bolus over 30 min, then 8 mg/h continuous infusion for 72 hours."
		},
		renalAdjustment: {
			crClNormal:
				"No dosage adjustments needed for any degree of renal impairment."
		},
		hepaticAdjustment:
			"Severe hepatic impairment: Do not exceed 20 mg once daily orally; monitor liver enzymes.",
		foodCorrelation:
			"Administer in the morning before meals. Swallow tablets whole; do not chew or crush.",
		preparationAndInfusion: {
			reconstitutionDiluent:
				"Reconstitute 40 mg vial with 10 mL 0.9% NaCl, further dilute to 100 mL",
			infusionRate: "Administer over 2 to 15 minutes.",
			stability: "Use within 12-24 hours below 25°C."
		},
		contraindications: [
			"Hypersensitivity to pantoprazole or substituted benzimidazoles."
		],
		majorAdverseReactions: [
			"Headache (12%)",
			"Diarrhea (9%)",
			"Hypomagnesemia",
			"Bone fracture risk in prolonged use",
			"False-positive urine THC"
		],
		pregnancyCategory: "B",
		lactation:
			"Present in human milk. Discontinue breastfeeding or select alternative.",
		riskXInteractions: [
			"Rilpivirine",
			"Dasatinib",
			"Erlotinib",
			"Pazopanib",
			"Sotorasib"
		],
		riskDInteractions: [
			"Methotrexate",
			"Atazanavir",
			"Cefuroxime",
			"Itraconazole",
			"Warfarin"
		],
		monitoringParameters: [
			"Serum magnesium periodically",
			"Liver enzymes in severe hepatic dysfunction"
		]
	},
	{
		id: "mesalazine",
		genericName: "Mesalazine (Mesalamine)",
		brandNamesEgypt: ["Pentasa", "Salofalk", "Mesacol", "Asacol"],
		pharmacologicalCategory: "5-Aminosalicylic Acid (5-ASA) Derivative",
		atcCode: "A07EC02",
		indications: [
			"Induction and maintenance of remission in Ulcerative Colitis",
			"Mild-to-moderate active Crohn's ileocolitis",
			"Ulcerative proctitis (rectal formulations)"
		],
		clinicalSymptoms: [
			"bloody diarrhea",
			"tenesmus",
			"colitis flares",
			"mucus in stool"
		],
		presentations: [
			{
				id: "mes-tab-500",
				form: "Modified Release Tablet",
				strength: "500 mg",
				route: "Oral",
				isDefault: true
			},
			{
				id: "mes-gran-1g",
				form: "Prolonged Release Granules",
				strength: "1 g / sachet",
				route: "Oral"
			},
			{
				id: "mes-supp-1g",
				form: "Rectal Suppository",
				strength: "1 g",
				route: "Rectal"
			},
			{
				id: "mes-enema-1g",
				form: "Rectal Suspension (Enema)",
				strength: "1 g / 100 mL",
				route: "Rectal"
			}
		],
		routes: ["Oral", "Rectal"],
		pediatricDosing: {
			standardDosePerKg: 40,
			doseUnit: "mg/kg/day",
			frequency: "Every 8 to 12 hours (divided doses)",
			dosesPerDay: 2,
			minDosePerKg: 30,
			maxDosePerKg: 75,
			maxSingleDoseMg: 2000,
			maxDailyDoseMg: 4000,
			minAgeMonths: 72, // ≥6 years
			guidelines:
				"Children ≥6 years: Active UC: 30-50 mg/kg/day divided in 2-3 doses (max 4 g/day). Maintenance: 15-30 mg/kg/day divided (max 2 g/day)."
		},
		adultDosing: {
			standardDose:
				"Active UC: 1.5 to 4 g/day divided in 2-4 doses. Maintenance: 1.2 to 2 g/day.",
			maxDailyDose: "4.8 g/day",
			frequency: "Divided 2 to 4 times daily",
			guidelines:
				"Rectal proctitis: 1 g suppository once daily at bedtime for 3 to 6 weeks."
		},
		renalAdjustment: {
			crClNormal: "CrCl ≥50 mL/min: Extreme caution. Nephrotoxic potential.",
			crClSevere:
				"Severe renal impairment: CONTRAINDICATED. Discontinue if renal function deteriorates."
		},
		hepaticAdjustment: "Contraindicated in severe hepatic impairment.",
		foodCorrelation:
			"Administer with plenty of fluids. Swallow tablets/granules whole without chewing.",
		contraindications: [
			"Hypersensitivity to mesalazine, salicylates (aspirin allergy), or excipients.",
			"Severe renal impairment or severe hepatic failure."
		],
		majorAdverseReactions: [
			"Abdominal pain (1-21%)",
			"Headache (3-14%)",
			"Mesalamine-induced acute intolerance syndrome (bloody diarrhea, cramping, fever)",
			"Interstitial nephritis and nephrolithiasis",
			"Cholestatic hepatitis (rare)"
		],
		pregnancyCategory: "B",
		lactation:
			"Compatible with breastfeeding if benefits outweigh risks; monitor infant for diarrhea.",
		riskXInteractions: ["None significant."],
		riskDInteractions: [
			"Azathioprine / 6-Mercaptopurine (increases bone marrow suppression)",
			"NSAIDs",
			"Antacids"
		],
		monitoringParameters: [
			"Serum creatinine and urinalysis (baseline, every 3 months for year 1, then every 6 months)",
			"CBC with differential",
			"LFTs"
		]
	},
	{
		id: "lactulose",
		genericName: "Lactulose",
		brandNamesEgypt: ["Duphalac", "Sedalac", "Lactulose MIP", "Labilac"],
		pharmacologicalCategory: "Ammonium Detoxicant; Laxative, Osmotic",
		atcCode: "A06AD11",
		indications: [
			"Constipation in infants, children, and adults",
			"Prevention and treatment of hepatic encephalopathy and hepatic coma"
		],
		clinicalSymptoms: [
			"hard stools",
			"infrequent bowel movements",
			"straining",
			"confusion in liver cirrhosis"
		],
		presentations: [
			{
				id: "lac-syr-335",
				form: "Oral Syrup",
				strength: "3.35 g / 5 mL (67%)",
				concentrationMg: 670,
				volumeMl: 1,
				route: "Oral",
				isDefault: true
			},
			{
				id: "lac-sach-10",
				form: "Powder in Sachet",
				strength: "10 g",
				route: "Oral"
			}
		],
		routes: ["Oral"],
		pediatricDosing: {
			standardDosePerKg: 1,
			doseUnit: "mg/kg/day", // mL equivalent
			frequency: "Once or twice daily",
			dosesPerDay: 1,
			maxSingleDoseMg: 15,
			maxDailyDoseMg: 30,
			minAgeMonths: 1,
			guidelines:
				"Constipation: Infants <1 year: 2.5 to 5 mL/day. Children 1-6 years: 5 to 10 mL/day. Children 7-14 years: 10 to 15 mL/day (titrate to 2-3 soft stools/day)."
		},
		adultDosing: {
			standardDose:
				"Constipation: 15 to 45 mL/day in 1 or 2 doses. Hepatic encephalopathy: 30 to 45 mL 3-4 times daily.",
			maxDailyDose: "90 mL/day (hepatic encephalopathy)",
			frequency: "1 to 4 times daily",
			guidelines: "Titrate dose to achieve 2 to 3 soft bowel movements per day."
		},
		renalAdjustment: {
			crClNormal: "No dosage adjustments needed. Not systemically absorbed."
		},
		hepaticAdjustment: "No dosage adjustments needed.",
		foodCorrelation:
			"May be administered with or without food. Can be mixed with water, milk, or fruit juice.",
		contraindications: [
			"Galactosemia.",
			"Gastrointestinal obstruction or perforation.",
			"Acute surgical abdomen."
		],
		majorAdverseReactions: [
			"Flatulence and abdominal distension (common in first few days)",
			"Diarrhea with excessive doses",
			"Electrolyte imbalance (hypokalemia)"
		],
		pregnancyCategory: "B",
		lactation:
			"Compatible with breastfeeding. Virtually unabsorbed from the gut.",
		riskXInteractions: ["None identified."],
		riskDInteractions: ["None identified."],
		monitoringParameters: [
			"Bowel movement frequency and stool consistency",
			"Serum electrolytes in chronic high-dose therapy"
		]
	},
	{
		id: "macrogol",
		genericName: "Polyethylene glycol 3350 (Macrogol)",
		brandNamesEgypt: ["Movicol", "Forlax", "Peg-Lax", "Klean-Prep"],
		pharmacologicalCategory: "Laxative, Osmotic",
		atcCode: "A06AD65",
		indications: [
			"Chronic functional constipation in children 2 to 11 years",
			"Fecal impaction disimpaction in children ≥5 years and adults",
			"Colonoscopy bowel cleansing preparation in adults"
		],
		clinicalSymptoms: [
			"fecal impaction",
			"severe constipation",
			"soiling",
			"colonoscopy prep"
		],
		presentations: [
			{
				id: "mac-sach-65",
				form: "Powder for Oral Solution (Junior)",
				strength: "6.563 g / sachet",
				route: "Oral",
				isDefault: true
			},
			{
				id: "mac-sach-13",
				form: "Powder for Oral Solution (Adult)",
				strength: "13.125 g / sachet",
				route: "Oral"
			}
		],
		routes: ["Oral"],
		pediatricDosing: {
			standardDosePerKg: 1,
			doseUnit: "fixed_mg", // sachet count
			frequency: "Once to twice daily",
			dosesPerDay: 1,
			maxSingleDoseMg: 4,
			maxDailyDoseMg: 4,
			minAgeMonths: 24, // ≥2 years
			guidelines:
				"Chronic constipation: Children 2-6 years: 1 sachet (6.56 g) daily (max 4 sachets/day). Children 7-11 years: 2 sachets daily. Fecal impaction (≥5 years): Day 1: 4 sachets, Day 2: 6 sachets, Day 3: 8 sachets, Day 4: 10 sachets, Days 5-7: 12 sachets daily in divided doses over 12h."
		},
		adultDosing: {
			standardDose: "1 to 3 sachets (13.125 g) daily in divided doses",
			maxDailyDose: "4 sachets/day (constipation)",
			frequency: "1 to 3 times daily",
			guidelines:
				"Bowel prep (colonoscopy): 2 liters of reconstituted solution taken as split or single dose."
		},
		renalAdjustment: {
			crClNormal:
				"No dosage adjustments needed. Systemic absorption negligible."
		},
		hepaticAdjustment: "No dosage adjustments needed.",
		foodCorrelation:
			"Dissolve each junior sachet in 62.5 mL water; adult sachet in 125 mL water.",
		contraindications: [
			"Intestinal perforation or obstruction.",
			"Toxic megacolon / severe inflammatory bowel disease.",
			"G6PD deficiency (for 100g preparations containing ascorbate).",
			"Phenylketonuria (if containing aspartame)."
		],
		majorAdverseReactions: [
			"Abdominal distension",
			"Bloating",
			"Nausea",
			"Loose stools"
		],
		pregnancyCategory: "C",
		lactation:
			"Compatible with breastfeeding due to high molecular weight and zero oral absorption.",
		riskXInteractions: ["None significant."],
		riskDInteractions: [
			"Oral medications taken within 1 hour may have delayed absorption."
		],
		monitoringParameters: [
			"Stool frequency",
			"Hydration and electrolyte status during disimpaction"
		]
	},
	{
		id: "bisacodyl",
		genericName: "Bisacodyl",
		brandNamesEgypt: ["Dulcolax", "Bisco-Cid", "Laxacodyl", "Bekunis"],
		pharmacologicalCategory: "Laxative, Stimulant",
		atcCode: "A06AG02",
		indications: [
			"Short-term relief of occasional acute constipation",
			"Bowel evacuation before radiological and endoscopic procedures"
		],
		clinicalSymptoms: ["acute constipation", "bowel evacuation"],
		presentations: [
			{
				id: "bis-tab-5",
				form: "Enteric-coated Tablet",
				strength: "5 mg",
				route: "Oral",
				isDefault: true
			},
			{
				id: "bis-supp-5",
				form: "Suppository (Pediatric)",
				strength: "5 mg",
				route: "Rectal"
			},
			{
				id: "bis-supp-10",
				form: "Suppository (Adult)",
				strength: "10 mg",
				route: "Rectal"
			}
		],
		routes: ["Oral", "Rectal"],
		pediatricDosing: {
			standardDosePerKg: 5,
			doseUnit: "fixed_mg",
			frequency: "Once daily before bedtime",
			dosesPerDay: 1,
			maxSingleDoseMg: 5,
			maxDailyDoseMg: 10,
			minAgeMonths: 48, // ≥4 years
			guidelines:
				"Children 4-10 years: Oral: 5 mg at bedtime or 5 mg suppository for immediate effect (15-60 min). Children >10 years: 5 to 10 mg at bedtime. Do not use for >5 consecutive days without medical advice."
		},
		adultDosing: {
			standardDose: "5 to 10 mg orally at bedtime or 10 mg rectal suppository",
			maxDailyDose: "10 mg/day",
			frequency: "Once daily",
			guidelines:
				"Oral onset: 6 to 12 hours. Rectal suppository onset: 15 to 60 minutes."
		},
		renalAdjustment: {
			crClNormal: "No dosage adjustments needed."
		},
		hepaticAdjustment: "No dosage adjustments needed.",
		foodCorrelation:
			"Do not administer within 1 hour of milk, dairy, or antacids to avoid premature dissolution of enteric coating.",
		contraindications: [
			"Ileus or intestinal obstruction.",
			"Acute surgical abdominal conditions (acute appendicitis).",
			"Severe dehydration.",
			"Anal fissures or ulcerative proctitis (for rectal suppositories)."
		],
		majorAdverseReactions: [
			"Abdominal cramping",
			"Diarrhea",
			"Nausea",
			"Hypokalemia with prolonged use"
		],
		pregnancyCategory: "B",
		lactation:
			"Not absorbed into breast milk. Considered acceptable short term.",
		riskXInteractions: ["Sodium Sulfate"],
		riskDInteractions: [
			"Antacids (dissolves enteric coating prematurely)",
			"Polyethylene Glycol"
		],
		monitoringParameters: ["Bowel movements", "Hydration status"]
	},
	{
		id: "docusate-sodium",
		genericName: "Docusate Sodium",
		brandNamesEgypt: ["Waxsol", "Norgalax", "Docusate"],
		pharmacologicalCategory: "Laxative, Stool Softener; Surfactant",
		atcCode: "A06AA02",
		indications: [
			"Prevention and treatment of chronic constipation / painful hard stools",
			"Avoidance of straining after surgery or with anal fissures/hemorrhoids",
			"Earwax impaction softening (otic drops)"
		],
		clinicalSymptoms: [
			"hard painful stool",
			"straining",
			"anal fissure pain",
			"cerumen impaction"
		],
		presentations: [
			{
				id: "doc-syr-50",
				form: "Oral Syrup",
				strength: "50 mg / 5 mL (10 mg/mL)",
				concentrationMg: 50,
				volumeMl: 5,
				route: "Oral",
				isDefault: true
			},
			{ id: "doc-cap-100", form: "Capsule", strength: "100 mg", route: "Oral" },
			{
				id: "doc-otic-5",
				form: "Ear Drops",
				strength: "5% (5 g / 100 mL)",
				route: "Otic"
			}
		],
		routes: ["Oral", "Otic"],
		pediatricDosing: {
			standardDosePerKg: 12.5,
			doseUnit: "fixed_mg",
			frequency: "Three times daily with juice/milk",
			dosesPerDay: 3,
			maxSingleDoseMg: 25,
			maxDailyDoseMg: 75,
			minAgeMonths: 6,
			guidelines:
				"Infants ≥6 months: 12.5 mg (1.25 mL) 3 times daily. Children 2-12 years: 12.5 to 25 mg 3 times daily. Mix in glass of milk or fruit juice to mask bitter taste."
		},
		adultDosing: {
			standardDose: "100 to 200 mg daily in divided doses (up to 500 mg/day)",
			maxDailyDose: "500 mg/day",
			frequency: "1 to 3 times daily",
			guidelines:
				"Ensure adequate fluid intake (at least 1.5 to 2 liters daily)."
		},
		renalAdjustment: {
			crClNormal: "No dosage adjustments needed."
		},
		hepaticAdjustment: "No dosage adjustments needed.",
		foodCorrelation: "Administer with plenty of liquids (juice or milk).",
		contraindications: [
			"Intestinal obstruction or acute abdominal pain.",
			"Concomitant administration with mineral oil (increases mineral oil systemic absorption and hepatic granulomas).",
			"Perforated eardrum (for otic wax drops)."
		],
		majorAdverseReactions: [
			"Mild abdominal cramps",
			"Diarrhea",
			"Nausea",
			"Throat irritation (liquid syrup)"
		],
		pregnancyCategory: "C",
		lactation: "Excreted in small amounts in breast milk. Use with caution.",
		riskXInteractions: ["Mineral Oil (paraffin liquid)"],
		riskDInteractions: ["None identified."],
		monitoringParameters: ["Stool consistency", "Fluid intake"]
	},

	// =========================================================================
	// SECTION 3: RESPIRATORY SYSTEM MEDICATIONS (EDA.DUPP.Formulary.010)
	// =========================================================================
	{
		id: "cetirizine",
		genericName: "Cetirizine",
		brandNamesEgypt: [
			"Zyrtec",
			"Histazine-1",
			"Cetrak",
			"Cetrizet",
			"Allerban"
		],
		pharmacologicalCategory:
			"Antihistamine, Second Generation; Piperazine Derivative",
		atcCode: "R06AE07",
		indications: [
			"Seasonal and perennial allergic rhinitis",
			"Chronic idiopathic urticaria",
			"Allergic conjunctivitis itching",
			"Acute urticaria in children ≥6 months"
		],
		clinicalSymptoms: [
			"sneezing",
			"runny nose",
			"itchy watery eyes",
			"urticaria hives",
			"skin itching"
		],
		presentations: [
			{
				id: "cet-drops-10",
				form: "Oral Drops",
				strength: "10 mg / 1 mL (20 drops = 10 mg)",
				concentrationMg: 10,
				volumeMl: 1,
				route: "Oral",
				isDefault: true
			},
			{
				id: "cet-syr-5",
				form: "Oral Syrup",
				strength: "5 mg / 5 mL (1 mg/mL)",
				concentrationMg: 5,
				volumeMl: 5,
				route: "Oral"
			},
			{
				id: "cet-tab-10",
				form: "Film-coated Tablet",
				strength: "10 mg",
				route: "Oral"
			}
		],
		routes: ["Oral"],
		pediatricDosing: {
			standardDosePerKg: 2.5,
			doseUnit: "fixed_mg",
			frequency: "Once or twice daily",
			dosesPerDay: 1,
			maxSingleDoseMg: 10,
			maxDailyDoseMg: 10,
			minAgeMonths: 6,
			guidelines:
				"Children 6 months to 2 years: 2.5 mg (5 drops) once daily (up to 2.5 mg twice daily for atopic eczema). Children 2-6 years: 2.5 mg twice daily or 5 mg once daily. Children 6-12 years: 5 mg twice daily or 10 mg once daily. >12 years: 10 mg once daily."
		},
		adultDosing: {
			standardDose: "10 mg once daily orally (evening preferred)",
			maxDailyDose: "10 mg/day",
			frequency: "Once daily",
			guidelines: "5 mg once daily may be adequate for mild symptoms."
		},
		renalAdjustment: {
			crClNormal: "CrCl ≥80 mL/min: 10 mg once daily.",
			crClMildToModerate: "CrCl 30-49 mL/min: 5 mg once daily.",
			crClSevere:
				"CrCl <30 mL/min: 5 mg once every 2 days; CrCl <10 mL/min (ESRD): CONTRAINDICATED.",
			dialysis: "Hemodialysis: CONTRAINDICATED."
		},
		hepaticAdjustment:
			"Hepatic impairment with normal renal function: 5 mg once daily.",
		foodCorrelation: "Administer with or without food.",
		contraindications: [
			"Hypersensitivity to cetirizine, levocetirizine, or hydroxyzine.",
			"End-stage renal disease (eGFR <15 mL/min) or hemodialysis.",
			"Children <6 years with impaired renal or hepatic function."
		],
		majorAdverseReactions: [
			"Drowsiness / somnolence (mild compared to 1st gen)",
			"Headache",
			"Dry mouth",
			"Pharyngitis",
			"Fatigue"
		],
		pregnancyCategory: "B",
		lactation:
			"Excreted in breast milk; not recommended during lactation. Risk of sedation in infant.",
		riskXInteractions: ["Alcohol", "Pitolisant"],
		riskDInteractions: ["CNS Depressants", "Benzylpenicilloyl Polylysine"],
		monitoringParameters: [
			"Relief of allergic symptoms",
			"Sedation / mental alertness",
			"Discontinue 3 days before allergy skin tests"
		]
	},
	{
		id: "chlorpheniramine-maleate",
		genericName: "Chlorpheniramine maleate",
		brandNamesEgypt: [
			"Allergyl",
			"Anallerge",
			"Histop",
			"Polaramine",
			"Piriton"
		],
		pharmacologicalCategory:
			"Antihistamine, First Generation; Alkylamine Derivative",
		atcCode: "R06AB04",
		indications: [
			"Acute allergic reactions, urticaria, angioneurotic edema",
			"Allergic rhinitis and hay fever",
			"Relief of pruritus associated with chickenpox",
			"Emergency adjunctive therapy in anaphylaxis (IV/IM)"
		],
		clinicalSymptoms: [
			"itching",
			"hives",
			"chickenpox itch",
			"allergic rhinorrhea",
			"acute allergy"
		],
		presentations: [
			{
				id: "cpm-syr-2",
				form: "Oral Syrup",
				strength: "2 mg / 5 mL",
				concentrationMg: 2,
				volumeMl: 5,
				route: "Oral",
				isDefault: true
			},
			{ id: "cpm-tab-4", form: "Tablet", strength: "4 mg", route: "Oral" },
			{
				id: "cpm-amp-10",
				form: "Ampoule (IM/IV/SC)",
				strength: "10 mg / 1 mL",
				concentrationMg: 10,
				volumeMl: 1,
				route: "IV"
			}
		],
		routes: ["Oral", "IV", "IM", "SC"],
		pediatricDosing: {
			standardDosePerKg: 0.2,
			doseUnit: "mg/kg/day",
			frequency: "Every 4 to 6 hours",
			dosesPerDay: 4,
			maxSingleDoseMg: 2,
			maxDailyDoseMg: 12,
			minAgeMonths: 24, // CONTRAINDICATED <2 years
			guidelines:
				"CONTRAINDICATED in children <2 years and premature neonates (respiratory arrest & anticholinergic susceptibility). Children 2-6 years: 1 mg (2.5 mL syrup) q4-6h (max 6 mg/day). Children 6-12 years: 2 mg (5 mL) q4-6h (max 12 mg/day). >12 years: 4 mg q4-6h (max 24 mg/day)."
		},
		adultDosing: {
			standardDose:
				"4 mg orally every 4 to 6 hours (max 24 mg/day); IV/IM: 10 to 20 mg single dose (max 40 mg/day)",
			maxDailyDose: "24 mg/day (oral) / 40 mg/day (parenteral)",
			frequency: "Every 4 to 6 hours",
			guidelines:
				"Elderly: reduce to maximum 12 mg/24 hours due to anticholinergic confusion risk."
		},
		renalAdjustment: {
			crClNormal:
				"No specific adjustments; use with caution in severe renal impairment."
		},
		hepaticAdjustment:
			"Use with caution; avoid in severe liver disease / hepatic coma.",
		foodCorrelation: "Administer with or without food.",
		preparationAndInfusion: {
			reconstitutionDiluent: "0.9% NaCl",
			finalInfusionConcentration: "Dilute to 1 mg/mL for IV injection",
			infusionRate: "Inject slowly over at least 1 minute."
		},
		contraindications: [
			"Children <2 years of age and premature neonates.",
			"MAO inhibitors within the last 14 days.",
			"Acute asthma attacks.",
			"Narrow-angle glaucoma and urinary bladder neck obstruction."
		],
		majorAdverseReactions: [
			"Marked sedation and drowsiness",
			"Dry mouth and blurred vision",
			"Paradoxical excitation in young children (hyperactivity, insomnia)",
			"Urinary retention"
		],
		pregnancyCategory: "B",
		lactation:
			"Excreted in breast milk and may inhibit lactation; avoid during breastfeeding.",
		riskXInteractions: [
			"MAO Inhibitors",
			"Sedatives/Hypnotics",
			"Alcohol",
			"Ipratropium",
			"Potassium Chloride"
		],
		riskDInteractions: ["CNS Depressants", "Opioids"],
		monitoringParameters: [
			"Sedation and cognitive performance",
			"Urinary retention in susceptible patients"
		]
	},
	{
		id: "fexofenadine",
		genericName: "Fexofenadine",
		brandNamesEgypt: ["Telfast", "Fexodine", "Allerfen", "Fast-Tel"],
		pharmacologicalCategory:
			"Antihistamine, Second Generation; Piperidine Derivative",
		atcCode: "R06AX26",
		indications: [
			"Seasonal allergic rhinitis in adults and children ≥2 years",
			"Chronic idiopathic urticaria in adults and children ≥6 months"
		],
		clinicalSymptoms: [
			"sneezing",
			"runny nose",
			"itchy nose",
			"urticaria hives"
		],
		presentations: [
			{
				id: "fex-susp-30",
				form: "Oral Suspension",
				strength: "30 mg / 5 mL",
				concentrationMg: 30,
				volumeMl: 5,
				route: "Oral",
				isDefault: true
			},
			{
				id: "fex-tab-60",
				form: "Film-coated Tablet",
				strength: "60 mg",
				route: "Oral"
			},
			{
				id: "fex-tab-120",
				form: "Film-coated Tablet",
				strength: "120 mg",
				route: "Oral"
			},
			{
				id: "fex-tab-180",
				form: "Film-coated Tablet",
				strength: "180 mg",
				route: "Oral"
			}
		],
		routes: ["Oral"],
		pediatricDosing: {
			standardDosePerKg: 30,
			doseUnit: "fixed_mg",
			frequency: "Twice daily",
			dosesPerDay: 2,
			maxSingleDoseMg: 30,
			maxDailyDoseMg: 60,
			minAgeMonths: 6,
			guidelines:
				"Urticaria (6-23 months): 15 mg (2.5 mL) twice daily. Children 2 to 11 years: 30 mg (5 mL) twice daily. Adolescents ≥12 years: 60 mg twice daily or 120-180 mg once daily."
		},
		adultDosing: {
			standardDose:
				"Allergic rhinitis: 120 mg once daily (or 60 mg twice daily). Urticaria: 180 mg once daily.",
			maxDailyDose: "180 mg/day",
			frequency: "Once daily (120/180mg) or twice daily (60mg)",
			guidelines:
				"Take before meals with water. Avoid fruit juices (grapefruit, apple, orange) which decrease absorption by 36-70%."
		},
		renalAdjustment: {
			crClNormal: "eGFR ≥50 mL/min: No adjustment.",
			crClMildToModerate:
				"eGFR 10-49 mL/min: 60 mg once daily in adults; 30 mg once daily in children 2-11 years.",
			crClSevere: "eGFR <10 mL/min / Hemodialysis: 60 mg once every 24 hours."
		},
		hepaticAdjustment: "No dosage adjustments needed.",
		foodCorrelation:
			"Administer before meals with water. Do not take with fruit juices (apple, orange, grapefruit).",
		contraindications: ["Hypersensitivity to fexofenadine."],
		majorAdverseReactions: [
			"Headache (5-10%)",
			"Vomiting in infants (12%)",
			"Drowsiness (≤3%)",
			"Back pain",
			"Nausea"
		],
		pregnancyCategory: "C",
		lactation: "Not recommended during breastfeeding; passes into breast milk.",
		riskXInteractions: ["Pitolisant"],
		riskDInteractions: [
			"Aluminum/Magnesium antacids (separate by 2 hours)",
			"Fruit juices"
		],
		monitoringParameters: ["Relief of rhinitis and urticaria symptoms"]
	},
	{
		id: "loratadine",
		genericName: "Loratadine",
		brandNamesEgypt: [
			"Claritin",
			"Mosedin",
			"Roletra",
			"Restamine",
			"Clarinase"
		],
		pharmacologicalCategory:
			"Antihistamine, Second Generation; Piperidine Derivative",
		atcCode: "R06AX13",
		indications: [
			"Allergic rhinitis and hay fever symptoms",
			"Chronic idiopathic urticaria"
		],
		clinicalSymptoms: [
			"sneezing",
			"watery eyes",
			"allergic pruritus",
			"urticaria"
		],
		presentations: [
			{
				id: "lor-syr-5",
				form: "Oral Syrup",
				strength: "5 mg / 5 mL (1 mg/mL)",
				concentrationMg: 5,
				volumeMl: 5,
				route: "Oral",
				isDefault: true
			},
			{ id: "lor-tab-10", form: "Tablet", strength: "10 mg", route: "Oral" },
			{
				id: "lor-odt-10",
				form: "Orally Disintegrating Tablet",
				strength: "10 mg",
				route: "Oral"
			}
		],
		routes: ["Oral"],
		pediatricDosing: {
			standardDosePerKg: 5,
			doseUnit: "fixed_mg",
			frequency: "Once daily",
			dosesPerDay: 1,
			maxSingleDoseMg: 10,
			maxDailyDoseMg: 10,
			minAgeMonths: 24, // ≥2 years
			guidelines:
				"Children 2 to 6 years (or ≤30 kg): 5 mg (5 mL syrup) once daily. Children >6 years (or >30 kg): 10 mg (1 tablet or 10 mL syrup) once daily. Not established <2 years."
		},
		adultDosing: {
			standardDose: "10 mg once daily orally",
			maxDailyDose: "10 mg/day",
			frequency: "Once daily",
			guidelines:
				"Non-sedating antihistamine. Can be taken with or without food."
		},
		renalAdjustment: {
			crClNormal: "CrCl ≥30 mL/min: No adjustment.",
			crClMildToModerate: "CrCl <30 mL/min: 10 mg every 48 hours.",
			crClSevere: "CrCl <30 mL/min: 10 mg every other day."
		},
		hepaticAdjustment:
			"Severe liver impairment: Adults: 10 mg every other day. Children ≤30 kg: 5 mg every other day.",
		foodCorrelation: "May be taken without regard to meal time.",
		contraindications: [
			"Hypersensitivity to loratadine or formulation excipients."
		],
		majorAdverseReactions: [
			"Headache (12%)",
			"Somnolence (8%)",
			"Fatigue (2-4%)",
			"Dry mouth (3%)",
			"Gastritis"
		],
		pregnancyCategory: "B",
		lactation:
			"Excreted in breast milk in small amounts; not recommended during breastfeeding.",
		riskXInteractions: ["Pitolisant"],
		riskDInteractions: ["Amiodarone", "Benzylpenicilloyl Polylysine"],
		monitoringParameters: [
			"Discontinue 48 hours prior to allergy skin prick testing"
		]
	},
	{
		id: "ipratropium-bromide",
		genericName: "Ipratropium Bromide",
		brandNamesEgypt: ["Atrovent", "Ipratropium", "Berodual (with fenoterol)"],
		pharmacologicalCategory:
			"Anticholinergic Bronchodilator, SAMA (Short-Acting Muscarinic Antagonist)",
		atcCode: "R03BB01",
		indications: [
			"Acute exacerbation of bronchial asthma (adjunct to beta2-agonists)",
			"Reversible airway obstruction in COPD",
			"Acute severe wheezing in pediatrics"
		],
		clinicalSymptoms: [
			"acute wheezing",
			"asthma attack",
			"bronchospasm",
			"shortness of breath"
		],
		presentations: [
			{
				id: "ipr-neb-250",
				form: "Nebulizer Solution",
				strength: "250 mcg / 1 mL (0.25 mg)",
				concentrationMg: 0.25,
				volumeMl: 1,
				route: "Inhalation",
				isDefault: true
			},
			{
				id: "ipr-neb-500",
				form: "Nebulizer Solution",
				strength: "500 mcg / 2 mL (0.5 mg)",
				concentrationMg: 0.5,
				volumeMl: 2,
				route: "Inhalation"
			},
			{
				id: "ipr-mdi-20",
				form: "Metered Dose Inhaler (MDI)",
				strength: "20 mcg / actuation",
				route: "Inhalation"
			}
		],
		routes: ["Inhalation"],
		pediatricDosing: {
			standardDosePerKg: 250,
			doseUnit: "fixed_mcg",
			frequency: "Every 20 minutes for 3 doses in acute asthma, then q4-6h",
			dosesPerDay: 4,
			maxSingleDoseMg: 0.5,
			maxDailyDoseMg: 2,
			minAgeMonths: 1,
			guidelines:
				"Acute severe asthma: Children <6 years: 125 to 250 mcg (0.5-1 mL) mixed with salbutamol every 20 min x 3 doses. Children 6-12 years: 250 mcg nebulized. Maintenance: 250 mcg 3-4 times daily."
		},
		adultDosing: {
			standardDose:
				"500 mcg nebulized every 4 to 6 hours (or 2-4 puffs MDI 4 times daily)",
			maxDailyDose: "2 mg/day",
			frequency: "Every 6 hours",
			guidelines:
				"In acute asthma exacerbations, combine with short-acting beta2-agonist (salbutamol) in nebulizer."
		},
		renalAdjustment: {
			crClNormal: "No dosage adjustments needed."
		},
		hepaticAdjustment: "No dosage adjustments needed.",
		foodCorrelation: "Not applicable (Inhalation).",
		preparationAndInfusion: {
			reconstitutionDiluent:
				"May mix with 0.9% sterile saline or salbutamol nebulizer solution",
			infusionRate: "Nebulize with oxygen flow of 6-8 L/min over 10-15 minutes."
		},
		contraindications: [
			"Hypersensitivity to ipratropium, atropine derivatives, or excipients."
		],
		majorAdverseReactions: [
			"Dry mouth (xerostomia)",
			"Cough",
			"Headache",
			"Paradoxical bronchospasm (rare)",
			"Mydriasis / eye pain if leaked into eyes"
		],
		pregnancyCategory: "B",
		lactation:
			"Unlikely to reach infant in clinically significant amounts; use caution.",
		riskXInteractions: [
			"Other systemic Anticholinergic Agents",
			"Loxapine (inhaled)"
		],
		riskDInteractions: ["Methacholine"],
		monitoringParameters: [
			"Peak flow (PEF)",
			"FEV1",
			"Resolution of wheezing",
			"Intraocular pressure if glaucoma risk"
		]
	},
	{
		id: "tiotropium",
		genericName: "Tiotropium",
		brandNamesEgypt: ["Spiriva", "Tiotropium Boehringer", "Tiova", "Braltus"],
		pharmacologicalCategory:
			"Anticholinergic Agent, LAMA (Long-Acting Muscarinic Antagonist)",
		atcCode: "R03BB04",
		indications: [
			"Maintenance bronchodilator treatment of COPD (chronic bronchitis and emphysema)",
			"Add-on maintenance treatment in severe persistent asthma (Respimat)",
			"Reduction of COPD exacerbations"
		],
		clinicalSymptoms: [
			"chronic breathlessness",
			"COPD exacerbation",
			"persistent wheeze"
		],
		presentations: [
			{
				id: "tio-cap-18",
				form: "Dry Powder Inhaler (HandiHaler)",
				strength: "18 mcg / capsule",
				route: "Inhalation",
				isDefault: true
			},
			{
				id: "tio-resp-25",
				form: "Inhalation Solution (Respimat)",
				strength: "2.5 mcg / actuation",
				route: "Inhalation"
			}
		],
		routes: ["Inhalation"],
		pediatricDosing: {
			standardDosePerKg: 0,
			doseUnit: "fixed_mcg",
			frequency: "Once daily",
			dosesPerDay: 1,
			minAgeMonths: 72, // ≥6 years for severe asthma (Respimat)
			guidelines:
				"COPD: Not indicated in children <18 years. Severe asthma add-on (Respimat only): Children ≥6 years: 2 inhalations of 2.5 mcg (5 mcg total) once daily at the same time each day."
		},
		adultDosing: {
			standardDose:
				"Inhale contents of 1 capsule (18 mcg) once daily via HandiHaler device",
			maxDailyDose: "18 mcg/day (HandiHaler) / 5 mcg/day (Respimat)",
			frequency: "Once daily at the same time",
			guidelines:
				"Capsules are for inhalation only; DO NOT swallow. Pierce capsule once in device."
		},
		renalAdjustment: {
			crClNormal: "CrCl >50 mL/min: No adjustment.",
			crClMildToModerate:
				"CrCl ≤50 mL/min: Monitor closely for anticholinergic adverse effects."
		},
		hepaticAdjustment: "No dosage adjustments needed.",
		foodCorrelation: "Not applicable (Inhalation).",
		contraindications: [
			"Hypersensitivity to tiotropium, atropine, ipratropium, or milk protein (HandiHaler lactose)."
		],
		majorAdverseReactions: [
			"Xerostomia (dry mouth: 4-16%)",
			"Upper respiratory tract infection",
			"Pharyngitis",
			"Urinary retention in BPH",
			"Cataract / Glaucoma worsening"
		],
		pregnancyCategory: "C",
		lactation:
			"Safety not established in breastfeeding; evaluate risk/benefit.",
		riskXInteractions: [
			"Anticholinergic Agents",
			"Ipratropium",
			"Aclidinium",
			"Umeclidinium"
		],
		riskDInteractions: ["Methacholine", "Rivastigmine"],
		monitoringParameters: [
			"FEV1 / Peak Flow",
			"Urinary retention signs",
			"Glaucoma eye pain"
		]
	},
	{
		id: "salbutamol",
		genericName: "Salbutamol (Albuterol)",
		brandNamesEgypt: [
			"Ventolin",
			"Farcolin",
			"Asthalin",
			"Ventoline",
			"Bronchotec"
		],
		pharmacologicalCategory:
			"Selective Beta2-Adrenergic Agonist, Short-Acting (SABA)",
		atcCode: "R03AC02",
		indications: [
			"Relief and prevention of bronchospasm in acute asthma and COPD",
			"Prevention of exercise-induced bronchospasm (EIB)",
			"Adjunctive treatment for hyperkalemia",
			"Acute wheezing episodes in viral bronchiolitis"
		],
		clinicalSymptoms: [
			"acute wheezing",
			"dyspnea",
			"chest tightness",
			"cough with bronchospasm",
			"acute asthma"
		],
		presentations: [
			{
				id: "sal-syr-2",
				form: "Oral Syrup",
				strength: "2 mg / 5 mL",
				concentrationMg: 2,
				volumeMl: 5,
				route: "Oral"
			},
			{
				id: "sal-mdi-100",
				form: "Metered Dose Inhaler (MDI)",
				strength: "100 mcg / actuation (0.1 mg)",
				route: "Inhalation",
				isDefault: true
			},
			{
				id: "sal-neb-5mg",
				form: "Nebulizer Solution (Farcolin)",
				strength: "5 mg / 1 mL (0.5%)",
				concentrationMg: 5,
				volumeMl: 1,
				route: "Inhalation"
			},
			{ id: "sal-tab-2", form: "Tablet", strength: "2 mg", route: "Oral" },
			{ id: "sal-tab-4", form: "Tablet", strength: "4 mg", route: "Oral" },
			{
				id: "sal-amp-05",
				form: "Ampoule (SC/IM/IV)",
				strength: "0.5 mg / 1 mL",
				concentrationMg: 0.5,
				volumeMl: 1,
				route: "IV"
			}
		],
		routes: ["Inhalation", "Oral", "IV", "IM", "SC"],
		pediatricDosing: {
			standardDosePerKg: 0.15,
			doseUnit: "mg/kg/dose",
			frequency:
				"Every 4 to 6 hours as needed (or q20min in acute severe asthma)",
			dosesPerDay: 4,
			minDosePerKg: 0.1,
			maxDosePerKg: 0.15,
			maxSingleDoseMg: 5,
			maxDailyDoseMg: 20,
			minAgeMonths: 0,
			guidelines:
				"Nebulization: 0.15 mg/kg/dose (minimum 1.25 mg, max 5 mg/dose) diluted in 2-3 mL saline q4-6h. In acute asthma: 2.5 to 5 mg nebulized q20min for 3 doses. MDI: 2 to 4 puffs (with spacer) q4-6h. Oral syrup (2-6 yrs): 1-2 mg 3-4 times daily."
		},
		adultDosing: {
			standardDose:
				"Inhalation: 2 puffs (200 mcg) q4-6h PRN; Nebulizer: 2.5-5 mg q4-6h; Oral: 4 mg 3-4 times daily",
			maxDailyDose:
				"8 puffs/day (MDI outpatient) / 40 mg/day (hospital nebulization)",
			frequency: "Every 4 to 6 hours PRN",
			guidelines:
				"In acute severe bronchospasm, hospital nebulizer may be given continuously under cardiac monitoring."
		},
		renalAdjustment: {
			crClNormal: "No dosage adjustments needed."
		},
		hepaticAdjustment: "No dosage adjustments needed.",
		foodCorrelation: "Oral: Administer 1 hour before or 2 hours after meals.",
		preparationAndInfusion: {
			reconstitutionDiluent: "0.9% NaCl for nebulizer solution",
			infusionRate: "Nebulize with 6-8 L/min oxygen over 10-15 minutes."
		},
		contraindications: [
			"Hypersensitivity to salbutamol or adrenergic amines.",
			"IV tocolytic contraindicated in gestational age <22 weeks or ischemic heart disease."
		],
		majorAdverseReactions: [
			"Tremor (5-38%)",
			"Nervousness / excitement in children (2-20%)",
			"Tachycardia and palpitations (1-7%)",
			"Hypokalemia (potassium shift into cells)",
			"Hyperglycemia and lactic acidosis with high doses"
		],
		pregnancyCategory: "C",
		lactation:
			"Present in breast milk. Use only when benefits outweigh risks; monitor infant for tachycardia.",
		riskXInteractions: [
			"Nonselective Beta-Blockers (Propranolol blocks bronchodilation)",
			"Loxapine"
		],
		riskDInteractions: ["Linezolid", "Methacholine", "Cocaine"],
		monitoringParameters: [
			"Peak flow / FEV1",
			"Heart rate and pulse oximetry",
			"Serum potassium in high doses",
			"Blood glucose in diabetics"
		]
	},
	{
		id: "formoterol",
		genericName: "Formoterol",
		brandNamesEgypt: [
			"Foradil",
			"Oxis",
			"Symbicort (with budesonide)",
			"Formatris"
		],
		pharmacologicalCategory: "Beta2-Adrenergic Agonist, Long-Acting (LABA)",
		atcCode: "R03AC13",
		indications: [
			"Maintenance treatment of asthma in patients receiving inhaled corticosteroids",
			"Bronchoconstriction in Chronic Obstructive Pulmonary Disease (COPD)",
			"Prevention of exercise-induced bronchospasm (EIB) in children ≥6 years"
		],
		clinicalSymptoms: [
			"nocturnal asthma",
			"exercise-induced wheeze",
			"chronic COPD breathlessness"
		],
		presentations: [
			{
				id: "for-cap-12",
				form: "Inhalation Powder Capsule (Aerolizer)",
				strength: "12 mcg",
				route: "Inhalation",
				isDefault: true
			},
			{
				id: "for-pMDI-6",
				form: "Pressurized Inhalation Solution",
				strength: "6 mcg / actuation",
				route: "Inhalation"
			}
		],
		routes: ["Inhalation"],
		pediatricDosing: {
			standardDosePerKg: 12,
			doseUnit: "fixed_mcg",
			frequency: "Every 12 hours (always combined with ICS)",
			dosesPerDay: 2,
			maxSingleDoseMg: 0.012, // 12 mcg
			maxDailyDoseMg: 0.024, // 24 mcg
			minAgeMonths: 72, // ≥6 years
			guidelines:
				"Children 6 to 11 years: 12 mcg inhaled every 12 hours. MUST NEVER be used as monotherapy for asthma without an Inhaled Corticosteroid (ICS). Maximum: 24 mcg/day."
		},
		adultDosing: {
			standardDose: "12 mcg inhaled twice daily (morning and evening)",
			maxDailyDose: "24 mcg/day (up to 48 mcg/day short-term in COPD)",
			frequency: "Every 12 hours",
			guidelines: "EIB prophylaxis: 12 mcg inhaled 15 minutes before exercise."
		},
		renalAdjustment: {
			crClNormal: "No dosage adjustments needed."
		},
		hepaticAdjustment: "No dosage adjustments needed.",
		foodCorrelation: "Not applicable (Inhalation).",
		contraindications: [
			"Hypersensitivity to formoterol or components.",
			"Asthma monotherapy without concurrent inhaled corticosteroid.",
			"Acute severe asthma attack (use short-acting salbutamol for rescue)."
		],
		blackBoxWarnings: [
			"Asthma-Related Death Warning: LABA monotherapy without inhaled corticosteroids increases risk of asthma-related death and serious exacerbations."
		],
		majorAdverseReactions: [
			"Tremor",
			"Tachycardia and palpitations",
			"Headache",
			"Hypokalemia",
			"Muscle cramps"
		],
		pregnancyCategory: "C",
		lactation:
			"Detected in animal milk; breastfeeding not recommended during formoterol therapy.",
		riskXInteractions: ["Nonselective Beta-Blockers", "Kratom", "Loxapine"],
		riskDInteractions: ["Linezolid", "Methacholine", "QT-prolonging drugs"],
		monitoringParameters: [
			"Pulmonary function tests (FEV1)",
			"Heart rate",
			"Blood pressure",
			"Serum potassium"
		]
	},
	{
		id: "terbutaline",
		genericName: "Terbutaline",
		brandNamesEgypt: ["Bricanyl", "Aironyl", "Bronchotyl"],
		pharmacologicalCategory: "Beta2-Adrenoreceptor Agonist, Short-Acting",
		atcCode: "R03AC03",
		indications: [
			"Relief and prevention of severe bronchospasm in asthma and bronchitis",
			"Acute pediatric wheezing attacks"
		],
		clinicalSymptoms: ["wheezing", "severe bronchospasm", "acute asthma"],
		presentations: [
			{
				id: "ter-syr-15",
				form: "Oral Syrup",
				strength: "1.5 mg / 5 mL",
				concentrationMg: 1.5,
				volumeMl: 5,
				route: "Oral",
				isDefault: true
			},
			{
				id: "ter-neb-5",
				form: "Solution for Nebulizer",
				strength: "5 mg / 2 mL",
				concentrationMg: 2.5,
				volumeMl: 1,
				route: "Inhalation"
			},
			{ id: "ter-tab-25", form: "Tablet", strength: "2.5 mg", route: "Oral" }
		],
		routes: ["Oral", "Inhalation"],
		pediatricDosing: {
			standardDosePerKg: 0.075,
			doseUnit: "mg/kg/dose",
			frequency: "Three times daily",
			dosesPerDay: 3,
			minDosePerKg: 0.05,
			maxDosePerKg: 0.075,
			maxSingleDoseMg: 2.5,
			maxDailyDoseMg: 7.5,
			minAgeMonths: 12,
			guidelines:
				"Syrup (1.5 mg/5 mL): 0.075 mg/kg (0.25 mL/kg) 3 times daily (max 15 mL 3 times daily). Nebulizer: Children >25 kg: 5 mg 2-4 times daily. Tablets not recommended <12 years."
		},
		adultDosing: {
			standardDose:
				"Oral: 2.5 to 5 mg 3 times daily (max 15 mg/day). Nebulizer: 5 to 10 mg 2-4 times daily.",
			maxDailyDose: "15 mg/day (oral)",
			frequency: "Three times daily",
			guidelines: "Nebulizer ampoule must be used immediately upon opening."
		},
		renalAdjustment: {
			crClNormal: "No dosage adjustments necessary."
		},
		hepaticAdjustment:
			"Significant hepatic impairment: Not recommended due to unpredictable conversion.",
		foodCorrelation: "May be taken without regard to food.",
		contraindications: [
			"Hypersensitivity to terbutaline or other beta-agonists."
		],
		majorAdverseReactions: [
			"Tremor",
			"Nervousness",
			"Tachycardia and palpitations",
			"Hypokalemia",
			"Headache"
		],
		pregnancyCategory: "B",
		lactation:
			"Released in breast milk in small amounts; therapeutic doses unlikely to harm infant.",
		riskXInteractions: ["Domperidone", "Loxapine", "Pimozide", "Thioridazine"],
		riskDInteractions: ["Beta-Blockers", "Linezolid", "Methacholine"],
		monitoringParameters: [
			"Serum potassium",
			"Blood pressure and heart rate",
			"Blood glucose in diabetes"
		]
	},
	{
		id: "xylometazoline",
		genericName: "Xylometazoline",
		brandNamesEgypt: ["Otrivin", "Balkis", "Xylo-Acino", "Sinoclear"],
		pharmacologicalCategory:
			"Alpha-Adrenergic Agonist; Decongestant; Imidazoline Derivative",
		atcCode: "R01AA07",
		indications: [
			"Symptomatic relief of nasal congestion in acute rhinitis and common cold",
			"Perennial and seasonal allergic rhinitis congestion",
			"Sinusitis and Eustachian tube catarrh decongestion"
		],
		clinicalSymptoms: [
			"blocked nose",
			"nasal congestion",
			"rhinitis stuffiness"
		],
		presentations: [
			{
				id: "xylo-ped-005",
				form: "Pediatric Nasal Drops",
				strength: "0.05% (0.5 mg/mL)",
				concentrationMg: 0.5,
				volumeMl: 1,
				route: "Nasal",
				isDefault: true
			},
			{
				id: "xylo-adult-01",
				form: "Adult Nasal Drops",
				strength: "0.1% (1 mg/mL)",
				concentrationMg: 1.0,
				volumeMl: 1,
				route: "Nasal"
			},
			{
				id: "xylo-spray-01",
				form: "Adult Nasal Spray",
				strength: "0.1% (1 mg/mL)",
				concentrationMg: 1.0,
				volumeMl: 1,
				route: "Nasal"
			}
		],
		routes: ["Nasal"],
		pediatricDosing: {
			standardDosePerKg: 1,
			doseUnit: "drops",
			frequency: "Every 8 to 12 hours (max 2-3 times daily)",
			dosesPerDay: 2,
			maxSingleDoseMg: 0.1,
			maxDailyDoseMg: 0.3,
			minAgeMonths: 24, // ≥2 years (0.05% formulation)
			guidelines:
				"Children 2 to 6 years: 1-2 drops of 0.05% pediatric formulation in each nostril 1-2 times daily (max 2 times/day). Children 6-11 years: 1-2 drops of 0.05% 2-3 times daily. 0.1% formulation is CONTRAINDICATED in children <12 years. Maximum treatment duration: 3 to 5 days (strict limit to avoid rhinitis medicamentosa)."
		},
		adultDosing: {
			standardDose:
				"2 to 3 drops or 1 spray of 0.1% solution in each nostril every 8 to 10 hours",
			maxDailyDose: "3 applications per nostril / 24 hours",
			frequency: "Every 8 to 12 hours",
			guidelines:
				"Do not use for more than 5 to 7 consecutive days to prevent severe rebound congestion (rhinitis medicamentosa)."
		},
		renalAdjustment: {
			crClNormal: "No dose adjustments required."
		},
		hepaticAdjustment: "No dose adjustments required.",
		foodCorrelation: "Not applicable (Nasal topical).",
		contraindications: [
			"Children <2 years of age (0.05% drops) and children <12 years (0.1% drops/spray).",
			"Rhinitis sicca (atrophic rhinitis).",
			"Closed-angle glaucoma.",
			"Transsphenoidal hypophysectomy or post-dural skull surgeries.",
			"Coadministration with MAO inhibitors within 14 days."
		],
		majorAdverseReactions: [
			"Rebound nasal congestion (rhinitis medicamentosa)",
			"Nasal mucosal dryness and burning",
			"Headache",
			"Tachycardia and hypertension with excessive use"
		],
		pregnancyCategory: "C",
		lactation:
			"Safety in pregnancy and lactation not established; avoid during pregnancy due to systemic vasoconstriction.",
		riskXInteractions: ["MAO Inhibitors"],
		riskDInteractions: ["Esketamine", "Zavegepant"],
		monitoringParameters: ["Duration of use (strictly limit to ≤5 days)"]
	},
	{
		id: "montelukast",
		genericName: "Montelukast",
		brandNamesEgypt: ["Singulair", "Kast", "Sedokast", "Montelair", "Delkare"],
		pharmacologicalCategory: "Leukotriene Receptor Antagonist (LTRA)",
		atcCode: "R03DC03",
		indications: [
			"Prophylaxis and chronic maintenance treatment of bronchial asthma",
			"Prevention of exercise-induced bronchoconstriction (EIB) in children ≥6 years",
			"Symptomatic relief of seasonal and perennial allergic rhinitis"
		],
		clinicalSymptoms: [
			"nighttime asthma cough",
			"exercise wheeze",
			"allergic rhinitis sneezing",
			"chronic asthma"
		],
		presentations: [
			{
				id: "mon-gran-4",
				form: "Oral Granules (Sachet)",
				strength: "4 mg",
				route: "Oral",
				isDefault: true
			},
			{
				id: "mon-chew-4",
				form: "Chewable Tablet",
				strength: "4 mg",
				route: "Oral"
			},
			{
				id: "mon-chew-5",
				form: "Chewable Tablet",
				strength: "5 mg",
				route: "Oral"
			},
			{
				id: "mon-tab-10",
				form: "Film-coated Tablet",
				strength: "10 mg",
				route: "Oral"
			}
		],
		routes: ["Oral"],
		pediatricDosing: {
			standardDosePerKg: 4,
			doseUnit: "fixed_mg",
			frequency: "Once daily in the evening",
			dosesPerDay: 1,
			maxSingleDoseMg: 10,
			maxDailyDoseMg: 10,
			minAgeMonths: 6,
			guidelines:
				"Infants 6 to 23 months: 1 sachet (4 mg) oral granules daily in the evening. Children 2 to 5 years: 4 mg chewable tablet or granules once daily in the evening. Children 6 to 14 years: 5 mg chewable tablet once daily in the evening. Adolescents ≥15 years: 10 mg tablet once daily. NOT for acute asthma attacks."
		},
		adultDosing: {
			standardDose: "10 mg once daily in the evening",
			maxDailyDose: "10 mg/day",
			frequency: "Once daily in the evening",
			guidelines:
				"EIB prevention: Take 10 mg at least 2 hours before exercise. Do not take an additional dose within 24 hours."
		},
		renalAdjustment: {
			crClNormal: "No dosage adjustment necessary."
		},
		hepaticAdjustment:
			"Mild to moderate hepatic impairment: No adjustment needed. Severe: No clinical data.",
		foodCorrelation:
			"Granules can be given directly or mixed with cold/room temperature breast milk, formula, applesauce, or rice.",
		contraindications: ["Hypersensitivity to montelukast or excipients."],
		blackBoxWarnings: [
			"Serious Neuropsychiatric Events: Agitation, aggression, depression, sleep disturbances, hallucinations, and suicidal ideation/behavior reported across all age groups."
		],
		majorAdverseReactions: [
			"Neuropsychiatric symptoms (nightmares, aggression, anxiety, insomnia)",
			"Headache (≥2%)",
			"Abdominal pain (≥2%)",
			"Pharyngitis / cough",
			"Systemic eosinophilia / Churg-Strauss vasculitis (rare)"
		],
		pregnancyCategory: "B",
		lactation:
			"Excretion in human milk unknown; use only if clearly essential.",
		riskXInteractions: ["Loxapine (inhaled)"],
		riskDInteractions: ["None identified."],
		monitoringParameters: [
			"Neuropsychiatric behavior and mood changes (counsel parents)",
			"Asthma control"
		]
	},
	{
		id: "acetylcysteine",
		genericName: "Acetylcysteine (N-Acetylcysteine)",
		brandNamesEgypt: ["Fluimucil", "ACC", "Acetylcysteine Sedico", "Mucolator"],
		pharmacologicalCategory:
			"Mucolytic Agent; Antidote for Paracetamol Poisoning",
		atcCode: "R05CB01",
		indications: [
			"Mucolytic adjuvant for thick, viscous bronchial mucus hypersecretion in bronchitis and pneumonia",
			"Antidote for acute paracetamol (acetaminophen) hepatotoxic overdose (IV/Oral)",
			"Meconium ileus equivalent in cystic fibrosis"
		],
		clinicalSymptoms: [
			"thick sticky phlegm",
			"productive cough",
			"paracetamol overdose"
		],
		presentations: [
			{
				id: "nac-sach-200",
				form: "Granules in Sachet",
				strength: "200 mg",
				route: "Oral",
				isDefault: true
			},
			{
				id: "nac-sach-600",
				form: "Granules in Sachet / Effervescent",
				strength: "600 mg",
				route: "Oral"
			},
			{
				id: "nac-amp-300",
				form: "Solution for IV / Inhalation",
				strength: "300 mg / 3 mL (10%)",
				concentrationMg: 100,
				volumeMl: 1,
				route: "IV"
			},
			{
				id: "nac-vial-2g",
				form: "Vial for IV Infusion",
				strength: "2 g / 10 mL (20%)",
				concentrationMg: 200,
				volumeMl: 1,
				route: "IV"
			}
		],
		routes: ["Oral", "IV", "Inhalation"],
		pediatricDosing: {
			standardDosePerKg: 100,
			doseUnit: "fixed_mg",
			frequency: "Two to three times daily",
			dosesPerDay: 3,
			maxSingleDoseMg: 200,
			maxDailyDoseMg: 600,
			minAgeMonths: 24, // CONTRAINDICATED <2 years as mucolytic
			guidelines:
				"Mucolytic: CONTRAINDICATED in children <2 years (cannot expectorate loosened mucus -> respiratory obstruction). Children 2-12 years: 100 mg 3 times daily or 200 mg twice daily. Adolescents ≥12 years: 200 mg 3 times daily or 600 mg once daily. Paracetamol overdose (IV): 300 mg/kg over 21 hours (150 mg/kg in 1h, 50 mg/kg in 4h, 100 mg/kg in 16h)."
		},
		adultDosing: {
			standardDose:
				"Mucolytic: 600 mg once daily or 200 mg 3 times daily. Inhalation: 3-5 mL of 20% solution 3-4 times daily.",
			maxDailyDose: "600 mg/day (mucolytic)",
			frequency: "Once to three times daily",
			guidelines:
				"Encourage abundant oral fluid intake to support mucolytic breakdown of disulfide mucus bonds."
		},
		renalAdjustment: {
			crClNormal: "No dosage adjustments needed."
		},
		hepaticAdjustment: "No dosage adjustments needed for mucolytic use.",
		foodCorrelation:
			"Administer with or after meals. Dissolve sachet in 150 mL water and drink immediately.",
		preparationAndInfusion: {
			reconstitutionDiluent:
				"5% Dextrose or 0.9% NaCl for IV paracetamol antidote",
			infusionRate:
				"Paracetamol protocol: Loading 150 mg/kg over 1 hour; watch for anaphylactoid reactions."
		},
		contraindications: [
			"Children under 2 years of age for mucolytic indication (risk of bronchial obstruction).",
			"Active peptic ulcer disease (mucolytic disrupts gastric mucosal protective barrier)."
		],
		majorAdverseReactions: [
			"Bronchospasm in asthmatic patients (inhalation)",
			"Nausea and vomiting",
			"Flushing and anaphylactoid reactions with IV antidote"
		],
		pregnancyCategory: "B",
		lactation: "Compatible with breastfeeding. Minimal risk expected.",
		riskXInteractions: ["None significant."],
		riskDInteractions: [
			"Cough suppressants (dextromethorphan, codeine) inhibit expectoration of fluidified secretions."
		],
		monitoringParameters: [
			"Respiratory ease and cough efficacy",
			"Monitor asthma patients for bronchospasm",
			"LFTs and paracetamol levels in overdose"
		]
	},
	{
		id: "ambroxol",
		genericName: "Ambroxol",
		brandNamesEgypt: [
			"Mucosolvan",
			"Ambroxol Pharco",
			"Bronchopro",
			"Mucolyte"
		],
		pharmacologicalCategory: "Mucolytic Agent; Surfactant Stimulant",
		atcCode: "R05CB06",
		indications: [
			"Acute and chronic respiratory disorders with pathologically thickened mucus (bronchitis, bronchiectasis)",
			"Relief of acute sore throat pain (lozenges/buccal spray)"
		],
		clinicalSymptoms: ["thick chest phlegm", "wet cough", "sore throat pain"],
		presentations: [
			{
				id: "amb-syr-15",
				form: "Oral Syrup",
				strength: "15 mg / 5 mL",
				concentrationMg: 15,
				volumeMl: 5,
				route: "Oral",
				isDefault: true
			},
			{
				id: "amb-syr-30",
				form: "Oral Syrup",
				strength: "30 mg / 5 mL",
				concentrationMg: 30,
				volumeMl: 5,
				route: "Oral"
			},
			{
				id: "amb-drops-75",
				form: "Oral Drops",
				strength: "7.5 mg / 1 mL",
				concentrationMg: 7.5,
				volumeMl: 1,
				route: "Oral"
			},
			{ id: "amb-tab-30", form: "Tablet", strength: "30 mg", route: "Oral" },
			{
				id: "amb-cap-75",
				form: "Sustained-Release Capsule",
				strength: "75 mg",
				route: "Oral"
			}
		],
		routes: ["Oral"],
		pediatricDosing: {
			standardDosePerKg: 1.5,
			doseUnit: "mg/kg/day",
			frequency: "Every 8 to 12 hours",
			dosesPerDay: 3,
			minDosePerKg: 1.2,
			maxDosePerKg: 1.6,
			maxSingleDoseMg: 30,
			maxDailyDoseMg: 60,
			minAgeMonths: 24, // Recommended ≥2 years
			guidelines:
				"Children 2-6 years: 7.5 mg (2.5 mL of 15mg/5mL syrup) 3 times daily. Children 6-12 years: 15 mg (5 mL) 2 to 3 times daily. Adolescents ≥12 years: 30 mg 3 times daily."
		},
		adultDosing: {
			standardDose: "30 mg three times daily (or 75 mg SR capsule once daily)",
			maxDailyDose: "120 mg/day",
			frequency: "2 to 3 times daily",
			guidelines:
				"Increases bronchial surfactant production and enhances ciliary clearance."
		},
		renalAdjustment: {
			crClNormal:
				"No dosage adjustments needed. Use with caution in severe renal failure."
		},
		hepaticAdjustment: "Use with caution in severe hepatic impairment.",
		foodCorrelation:
			"May be administered with or without food. Drink abundant water.",
		contraindications: ["Hypersensitivity to ambroxol or bromhexine."],
		majorAdverseReactions: [
			"Dysgeusia",
			"Nausea",
			"Oral hypoesthesia",
			"Severe cutaneous adverse reactions (SJS/TEN rare)"
		],
		pregnancyCategory: "B",
		lactation:
			"Crosses placenta and passes into breast milk; avoid in first trimester and during lactation.",
		riskXInteractions: ["None identified."],
		riskDInteractions: [
			"Antitussives / cough suppressants (causes pooling of secretions)."
		],
		monitoringParameters: ["Sputum clearance and cough productivity"]
	},
	{
		id: "bromhexine",
		genericName: "Bromhexine",
		brandNamesEgypt: ["Bisolvon", "Solvex", "Muxol", "Bisolvon Elixir"],
		pharmacologicalCategory: "Mucolytic Agent",
		atcCode: "R05CB02",
		indications: [
			"Mucolytic therapy for respiratory tract conditions with excessive viscous phlegm",
			"Bronchitis and tracheobronchitis"
		],
		clinicalSymptoms: ["productive wet cough", "sticky mucus in airways"],
		presentations: [
			{
				id: "bro-syr-4",
				form: "Oral Syrup",
				strength: "4 mg / 5 mL",
				concentrationMg: 4,
				volumeMl: 5,
				route: "Oral",
				isDefault: true
			},
			{
				id: "bro-syr-8",
				form: "Oral Syrup",
				strength: "8 mg / 5 mL",
				concentrationMg: 8,
				volumeMl: 5,
				route: "Oral"
			},
			{ id: "bro-tab-8", form: "Tablet", strength: "8 mg", route: "Oral" },
			{
				id: "bro-drops-2",
				form: "Oral Drops",
				strength: "2 mg / 1 mL",
				concentrationMg: 2,
				volumeMl: 1,
				route: "Oral"
			}
		],
		routes: ["Oral"],
		pediatricDosing: {
			standardDosePerKg: 0.3,
			doseUnit: "mg/kg/day",
			frequency: "Every 8 to 12 hours",
			dosesPerDay: 3,
			maxSingleDoseMg: 8,
			maxDailyDoseMg: 24,
			minAgeMonths: 24, // ≥2 years
			guidelines:
				"Children 2 to 5 years: 4 mg (5 mL of 4mg/5mL syrup) twice daily. Children 6 to 11 years: 4 to 8 mg 3 times daily. Adolescents ≥12 years: 8 mg 3 times daily. Tablets not used in children <6 years."
		},
		adultDosing: {
			standardDose: "8 to 16 mg three times daily orally",
			maxDailyDose: "48 mg/day",
			frequency: "Three times daily",
			guidelines:
				"Metabolized to active metabolite ambroxol. Abundant fluid intake enhances mucolysis."
		},
		renalAdjustment: {
			crClNormal:
				"No dosage adjustments needed. Use with caution in severe renal failure."
		},
		hepaticAdjustment: "Use with caution in severe hepatic disease.",
		foodCorrelation: "Can be taken with or without food.",
		contraindications: ["Hypersensitivity to bromhexine or excipients."],
		majorAdverseReactions: [
			"Gastrointestinal discomfort",
			"Nausea/vomiting",
			"Transient ALT elevation",
			"Allergic rash"
		],
		pregnancyCategory: "A",
		lactation:
			"Avoid use during pregnancy (first trimester) and during lactation.",
		riskXInteractions: ["None identified."],
		riskDInteractions: ["Antitussives"],
		monitoringParameters: ["Relief of congestion and mucus expectoration"]
	},
	{
		id: "carbocisteine",
		genericName: "Carbocisteine (Carbocysteine)",
		brandNamesEgypt: [
			"Muciclar",
			"Avicocisteine",
			"Carbocisteine Pharco",
			"Rhinathiol"
		],
		pharmacologicalCategory: "Mucolytic Agent",
		atcCode: "R05CB03",
		indications: [
			"Adjunctive therapy of respiratory disorders characterized by excessive viscous mucus",
			"Chronic obstructive pulmonary disease and chronic bronchitis",
			"Glue ear (otitis media with effusion) adjunct"
		],
		clinicalSymptoms: [
			"thick phlegm",
			"chronic productive cough",
			"chest rattling"
		],
		presentations: [
			{
				id: "car-syr-100",
				form: "Oral Syrup (Pediatric)",
				strength: "100 mg / 5 mL (2%)",
				concentrationMg: 100,
				volumeMl: 5,
				route: "Oral",
				isDefault: true
			},
			{
				id: "car-syr-250",
				form: "Oral Syrup (Adult)",
				strength: "250 mg / 5 mL (5%)",
				concentrationMg: 250,
				volumeMl: 5,
				route: "Oral"
			},
			{ id: "car-cap-375", form: "Capsule", strength: "375 mg", route: "Oral" }
		],
		routes: ["Oral"],
		pediatricDosing: {
			standardDosePerKg: 20,
			doseUnit: "mg/kg/day",
			frequency: "Every 6 to 8 hours",
			dosesPerDay: 3,
			maxSingleDoseMg: 250,
			maxDailyDoseMg: 750,
			minAgeMonths: 24, // CONTRAINDICATED <2 years
			guidelines:
				"CONTRAINDICATED in children <2 years (risk of bronchial mucus flooding). Children 2 to 5 years: 62.5 to 125 mg 4 times daily (max 500 mg/day). Children 6 to 12 years: 250 mg 3 times daily (max 750 mg/day). Capsules are not recommended for children."
		},
		adultDosing: {
			standardDose:
				"750 mg three times daily, reducing to 1,500 mg daily in divided doses upon improvement",
			maxDailyDose: "2250 mg/day",
			frequency: "Three times daily",
			guidelines:
				"Take with water. Modifies mucin synthesis, reducing goblet cell hyperplasia."
		},
		renalAdjustment: {
			crClNormal: "No dosage adjustments required."
		},
		hepaticAdjustment: "No dosage adjustments required.",
		foodCorrelation: "Administer with water before or after meals.",
		contraindications: [
			"Children younger than 2 years of age.",
			"Active peptic ulceration (alters gastric mucus barrier)."
		],
		majorAdverseReactions: [
			"Gastric discomfort and nausea",
			"Diarrhea",
			"Gastrointestinal bleeding in ulcer patients (rare)"
		],
		pregnancyCategory: "B",
		lactation:
			"Not recommended during the first trimester or during breastfeeding.",
		riskXInteractions: [
			"Disulfiram",
			"Metronidazole (oral alcohol solvent interaction in some syrups)"
		],
		riskDInteractions: ["Cough suppressants (antitussives)"],
		monitoringParameters: [
			"Watch for gastric pain in patients with peptic ulcer history"
		]
	},
	{
		id: "guaifenesin",
		genericName: "Guaifenesin",
		brandNamesEgypt: [
			"Tussivan",
			"Guaiphenesin Sedico",
			"Mucinex",
			"Bronchotuss"
		],
		pharmacologicalCategory: "Expectorant",
		atcCode: "R05CA03",
		indications: [
			"Symptomatic relief of productive chest cough",
			"Loosens phlegm and thins bronchial secretions"
		],
		clinicalSymptoms: [
			"congested chest",
			"difficulty coughing up phlegm",
			"dry irritative cough"
		],
		presentations: [
			{
				id: "gua-syr-100",
				form: "Oral Syrup",
				strength: "100 mg / 5 mL",
				concentrationMg: 100,
				volumeMl: 5,
				route: "Oral",
				isDefault: true
			},
			{ id: "gua-tab-200", form: "Tablet", strength: "200 mg", route: "Oral" },
			{
				id: "gua-tab-600",
				form: "Extended-Release Tablet",
				strength: "600 mg",
				route: "Oral"
			}
		],
		routes: ["Oral"],
		pediatricDosing: {
			standardDosePerKg: 12,
			doseUnit: "mg/kg/day",
			frequency: "Every 4 to 6 hours",
			dosesPerDay: 4,
			maxSingleDoseMg: 100,
			maxDailyDoseMg: 600,
			minAgeMonths: 72, // Oral solution contraindicated <6 years per EDA
			guidelines:
				"Oral solution is CONTRAINDICATED in children <6 years; tablets contraindicated <12 years. Children 6-12 years: 100 mg (5 mL) up to 4 times daily (max 600 mg/day). Adolescents ≥12 years: 200-400 mg q4h (max 2,400 mg/day)."
		},
		adultDosing: {
			standardDose:
				"200 to 400 mg every 4 hours (IR) or 600 to 1200 mg every 12 hours (ER)",
			maxDailyDose: "2400 mg/day",
			frequency: "Every 4 hours (IR) or every 12 hours (ER)",
			guidelines:
				"Take each dose with a full glass of water to promote hydration and mucus thinning."
		},
		renalAdjustment: {
			crClNormal:
				"No specific adjustments; use caution in severe renal impairment."
		},
		hepaticAdjustment:
			"No specific adjustments; use caution in severe hepatic failure.",
		foodCorrelation:
			"Administer with or without food. Take with full glass of water.",
		contraindications: [
			"Children <6 years for liquid formulations; <12 years for tablets.",
			"Hypersensitivity to guaifenesin."
		],
		majorAdverseReactions: [
			"Dizziness",
			"Headache",
			"Nausea/vomiting",
			"Hypouricemia"
		],
		pregnancyCategory: "C",
		lactation: "Not recommended during lactation due to lack of safety data.",
		riskXInteractions: ["None identified."],
		riskDInteractions: [
			"Concomitant cough suppressants inhibit clearing of mobilized secretions."
		],
		monitoringParameters: ["Cough productivity and ease of expectoration"]
	},
	{
		id: "aminophylline",
		genericName: "Aminophylline",
		brandNamesEgypt: [
			"Aminophylline Misr",
			"Aminophylline Cid",
			"Phyllocontin"
		],
		pharmacologicalCategory:
			"Phosphodiesterase Enzyme Inhibitor, Nonselective (Xanthine)",
		atcCode: "R03DA05",
		indications: [
			"Severe acute asthma exacerbation refractory to beta-agonists and steroids",
			"Acute exacerbation of COPD with severe bronchospasm",
			"Paroxysmal nocturnal dyspnea associated with heart failure"
		],
		clinicalSymptoms: [
			"severe asthma attack",
			"refractory wheeze",
			"cardiac asthma dyspnea"
		],
		presentations: [
			{
				id: "amn-amp-250",
				form: "Ampoule (IV)",
				strength: "250 mg / 10 mL (25 mg/mL)",
				concentrationMg: 25,
				volumeMl: 1,
				route: "IV",
				isDefault: true
			}
		],
		routes: ["IV"],
		pediatricDosing: {
			standardDosePerKg: 6,
			doseUnit: "mg/kg/dose", // Loading dose
			frequency: "Continuous infusion following loading dose",
			dosesPerDay: 1,
			maxSingleDoseMg: 500,
			maxDailyDoseMg: 1500,
			minAgeMonths: 6, // NOT recommended <6 months
			guidelines:
				"CONTRAINDICATED in infants <6 months due to erratic metabolism. Loading dose (if not on theophylline): 6 mg/kg IV infused over 30 min (rate ≤25 mg/min). Maintenance infusion: 6 months to 9 years: 1 mg/kg/hour; 9 to 16 years: 0.8 mg/kg/hour. Target serum theophylline: 5-15 mcg/mL."
		},
		adultDosing: {
			standardDose:
				"Loading dose: 6 mg/kg IV over 30 min, then 0.5 mg/kg/hour maintenance infusion",
			maxDailyDose:
				"Guided by serum theophylline levels (levels >20 mcg/mL are toxic)",
			frequency: "Continuous IV infusion",
			guidelines:
				"Elderly: 0.3 mg/kg/hour. Infusion rate must never exceed 25 mg/minute to avoid fatal cardiac arrhythmias."
		},
		renalAdjustment: {
			crClNormal:
				"No dosage adjustments needed; use with caution in renal dysfunction."
		},
		hepaticAdjustment:
			"Reduced hepatic clearance; reduce maintenance dose by 50% and monitor levels closely.",
		foodCorrelation: "Not applicable (IV).",
		preparationAndInfusion: {
			reconstitutionDiluent: "0.9% NaCl or D5W",
			infusionRate:
				"Slow IV injection or continuous infusion; rate must not exceed 25 mg/minute.",
			stability: "Do not use if discolored or crystals are present."
		},
		contraindications: [
			"Hypersensitivity to aminophylline, theophylline, ethylenediamine, or xanthines.",
			"Children under 6 months of age.",
			"Active acute porphyria.",
			"Concomitant administration with other xanthines."
		],
		blackBoxWarnings: [
			"Narrow Therapeutic Index: Serum levels >20 mcg/mL can cause intractable seizures, fatal cardiac arrhythmias, and circulatory collapse."
		],
		majorAdverseReactions: [
			"Tachycardia and arrhythmias",
			"Seizures (can occur without prior warning symptoms)",
			"Nausea and vomiting",
			"Severe agitation and tremor",
			"Hypokalemia"
		],
		pregnancyCategory: "C",
		lactation:
			"Theophylline passes into breast milk and causes irritability/tachycardia in infants; avoid in breastfeeding.",
		riskXInteractions: ["Esketamine", "Riociguat", "Doxofylline", "Viloxazine"],
		riskDInteractions: [
			"Ciprofloxacin",
			"Erythromycin",
			"Clarithromycin (markedly elevates theophylline levels)",
			"Carbamazepine"
		],
		monitoringParameters: [
			"Serum theophylline concentration (target 5-15 mcg/mL)",
			"Heart rate and ECG",
			"Serum potassium and glucose"
		]
	},
	{
		id: "theophylline",
		genericName: "Theophylline",
		brandNamesEgypt: [
			"Uniphyllin Continus",
			"Theo-Dur",
			"Quibron-T",
			"Theophyl"
		],
		pharmacologicalCategory:
			"Phosphodiesterase Enzyme Inhibitor, Nonselective (Xanthine)",
		atcCode: "R03DA04",
		indications: [
			"Chronic maintenance treatment and prophylaxis of bronchial asthma",
			"Chronic obstructive pulmonary disease and chronic bronchitis"
		],
		clinicalSymptoms: [
			"chronic wheezing",
			"nighttime breathlessness",
			"asthma maintenance"
		],
		presentations: [
			{
				id: "theo-tab-200",
				form: "Sustained-Release Tablet",
				strength: "200 mg",
				route: "Oral",
				isDefault: true
			},
			{
				id: "theo-tab-300",
				form: "Sustained-Release Tablet",
				strength: "300 mg",
				route: "Oral"
			}
		],
		routes: ["Oral"],
		pediatricDosing: {
			standardDosePerKg: 10,
			doseUnit: "mg/kg/day",
			frequency: "Every 12 hours",
			dosesPerDay: 2,
			minDosePerKg: 10,
			maxDosePerKg: 16,
			maxSingleDoseMg: 300,
			maxDailyDoseMg: 600,
			minAgeMonths: 72, // ≥6 years
			guidelines:
				"CONTRAINDICATED in children <6 months; not first-line in children. Children ≥6 years: 9 to 16 mg/kg/day divided q12h (based on lean ideal body weight). Swallow sustained-release tablets whole; do not chew or crush."
		},
		adultDosing: {
			standardDose: "200 to 300 mg every 12 hours orally",
			maxDailyDose: "600 to 800 mg/day (guided by serum levels)",
			frequency: "Every 12 hours",
			guidelines:
				"Swallow whole with liquid. Do not crush or chew. Therapeutic serum range: 5 to 15 mcg/mL."
		},
		renalAdjustment: {
			crClNormal: "No dosage adjustment necessary."
		},
		hepaticAdjustment:
			"Clearance decreased by 50% in cirrhosis; reduce dose and monitor serum levels frequently.",
		foodCorrelation:
			"Take at regular times each day. High-fat meals may increase absorption rate for some SR brands.",
		contraindications: [
			"Hypersensitivity to theophylline or xanthines.",
			"Children under 6 months of age.",
			"Acute porphyria.",
			"Concomitant administration with ephedrine in children <6 years (<22 kg)."
		],
		blackBoxWarnings: [
			"Narrow Therapeutic Index: Serum theophylline >20 mcg/mL causes severe toxicity (ventricular arrhythmias, intractable seizures)."
		],
		majorAdverseReactions: [
			"Headache",
			"Insomnia",
			"Nausea/vomiting",
			"Palpitations/tachycardia",
			"Tremor",
			"Seizures with toxicity"
		],
		pregnancyCategory: "C",
		lactation:
			"Excreted in human milk; causes irritability and sleep disturbances in infants. Avoid during lactation.",
		riskXInteractions: ["Esketamine", "Riociguat", "Doxofylline", "Viloxazine"],
		riskDInteractions: [
			"Ciprofloxacin (inhibits CYP1A2 -> toxicity)",
			"Clarithromycin",
			"Erythromycin",
			"Cimetidine",
			"Carbamazepine"
		],
		monitoringParameters: [
			"Serum theophylline levels (5-15 mcg/mL)",
			"Heart rate",
			"Signs of toxicity (nausea, vomiting, tremor, agitation)"
		]
	}
];

/**
 * Total count of registered EDA drug monographs in this dataset
 */
export const FORMULARY_DRUG_COUNT = EGYPTIAN_NATIONAL_FORMULARY.length;
