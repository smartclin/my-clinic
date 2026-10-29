/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Comprehensive Neonatal & Pediatric Drug Formulary
 * Clinical reference dataset based on Egyptian Pediatric Association & WHO neonatal protocols.
 */

import type { DrugFormularyItem } from "../types/medication.ts";

export const NEONATAL_PEDIATRIC_FORMULARY: DrugFormularyItem[] = [
	// 1. AMPICILLIN
	{
		id: "ampicillin",
		name: "Ampicillin",
		genericName: "Ampicillin Sodium",
		category: "Antibiotic",
		indication:
			"Empiric neonatal sepsis (combined with Gentamicin), Listeria, group B Strep",
		standardDose: 50,
		minDose: 25,
		maxDose: 100,
		doseUnit: "mg/kg/dose",
		frequency: "q12h (<7 days) or q8h (≥7 days)",
		dosesPerDay: 2,
		routes: ["IV", "IM"],
		maxSingleDoseMg: 2000,
		maxDailyDoseMg: 12000,
		concentrations: [
			{
				id: "amp-vial-500",
				label: "Vial 500 mg reconstituted in 5 mL (100 mg/mL)",
				mg: 100,
				ml: 1,
				route: "IV",
				isDefault: true
			},
			{
				id: "amp-vial-1000",
				label: "Vial 1000 mg reconstituted in 10 mL (100 mg/mL)",
				mg: 100,
				ml: 1,
				route: "IV"
			},
			{
				id: "amp-susp-250",
				label: "Oral Suspension 250 mg / 5 mL (50 mg/mL)",
				mg: 250,
				ml: 5,
				route: "Oral"
			}
		],
		dilutionGuideline:
			"Dilute in Normal Saline or D5W to a maximum concentration of 30 mg/mL. Infuse over 15 to 30 minutes.",
		safetyWarnings: {
			renalAdjustment:
				"Extend dosing interval to q12h-q24h if GFR < 30 mL/min/1.73m² or severe oliguria.",
			hepaticAdjustment:
				"No primary dose adjustment required in mild-to-moderate hepatic impairment.",
			neonatalContraindications:
				"Known hypersensitivity to penicillins or beta-lactam antibiotics.",
			monitoringNotes:
				"Inspect IV access site regularly for signs of phlebitis or extravasation."
		}
	},

	// 2. GENTAMICIN
	{
		id: "gentamicin",
		name: "Gentamicin",
		genericName: "Gentamicin Sulfate",
		category: "Antibiotic",
		indication:
			"Gram-negative neonatal sepsis, suspected UTI, hospital-acquired infections",
		standardDose: 4,
		minDose: 3.5,
		maxDose: 5,
		doseUnit: "mg/kg/dose",
		frequency: "q24h (extended interval) or q36h-q48h in premature infants",
		dosesPerDay: 1,
		routes: ["IV", "IM"],
		maxSingleDoseMg: 160,
		maxDailyDoseMg: 160,
		concentrations: [
			{
				id: "gent-amp-20",
				label: "Pediatric Ampoule 20 mg / 2 mL (10 mg/mL)",
				mg: 20,
				ml: 2,
				route: "IV",
				isDefault: true
			},
			{
				id: "gent-amp-80",
				label: "Adult Ampoule 80 mg / 2 mL (40 mg/mL)",
				mg: 80,
				ml: 2,
				route: "IV"
			}
		],
		dilutionGuideline:
			"Dilute with D5W or NS to concentration ≤ 2 mg/mL. Infuse slowly over 30 to 60 minutes via syringe pump.",
		safetyWarnings: {
			renalAdjustment:
				"CRITICAL: Extend interval to q36h–q48h based on serum trough levels (< 1 mcg/mL) in renal impairment.",
			hepaticAdjustment: "No dose adjustment required.",
			neonatalContraindications:
				"Concurrent administration with other ototoxic or nephrotoxic agents (e.g. furosemide) increases hearing loss risk.",
			monitoringNotes:
				"Therapeutic Drug Monitoring: Trough < 1 mcg/mL before next dose; target peak 5–10 mcg/mL."
		}
	},

	// 3. CEFOTAXIME
	{
		id: "cefotaxime",
		name: "Cefotaxime",
		genericName: "Cefotaxime Sodium",
		category: "Antibiotic",
		indication:
			"Neonatal meningitis, severe Gram-negative sepsis, hospital-acquired pneumonia",
		standardDose: 50,
		minDose: 25,
		maxDose: 100,
		doseUnit: "mg/kg/dose",
		frequency:
			"q12h (age 0-7 days) or q8h (age 8-28 days); q6h in severe meningitis",
		dosesPerDay: 2,
		routes: ["IV", "IM"],
		maxSingleDoseMg: 2000,
		maxDailyDoseMg: 8000,
		concentrations: [
			{
				id: "cefotax-500",
				label: "Vial 500 mg reconstituted in 5 mL (100 mg/mL)",
				mg: 100,
				ml: 1,
				route: "IV",
				isDefault: true
			},
			{
				id: "cefotax-1000",
				label: "Vial 1000 mg reconstituted in 10 mL (100 mg/mL)",
				mg: 100,
				ml: 1,
				route: "IV"
			}
		],
		dilutionGuideline:
			"Reconstitute with Sterile Water, then dilute in D5W or NS. Infuse over 20 to 30 minutes.",
		safetyWarnings: {
			renalAdjustment:
				"Reduce dose by 50% or extend dosing interval if GFR < 20 mL/min.",
			hepaticAdjustment: "No dosage change needed.",
			neonatalContraindications:
				"Preferred over Ceftriaxone in neonates due to low risk of bilirubin displacement.",
			monitoringNotes:
				"Watch for opportunistic fungal superinfections or diarrhea with prolonged courses."
		}
	},

	// 4. CEFTRIAXONE
	{
		id: "ceftriaxone",
		name: "Ceftriaxone",
		genericName: "Ceftriaxone Sodium",
		category: "Antibiotic",
		indication:
			"Pediatric pneumonia, bacterial meningitis, acute otitis media (>1 month old)",
		standardDose: 50,
		minDose: 50,
		maxDose: 100,
		doseUnit: "mg/kg/day",
		frequency: "Once daily (q24h) or divided q12h for meningitis",
		dosesPerDay: 1,
		routes: ["IV", "IM"],
		maxSingleDoseMg: 2000,
		maxDailyDoseMg: 4000,
		concentrations: [
			{
				id: "cef-vial-500",
				label: "Vial 500 mg reconstituted in 5 mL (100 mg/mL)",
				mg: 100,
				ml: 1,
				route: "IV",
				isDefault: true
			},
			{
				id: "cef-vial-1000",
				label: "Vial 1000 mg reconstituted in 10 mL (100 mg/mL)",
				mg: 100,
				ml: 1,
				route: "IV"
			}
		],
		dilutionGuideline:
			"Dilute in D5W or 0.9% NaCl. Infuse over 30 minutes. NEVER mix with Calcium-containing solutions.",
		safetyWarnings: {
			renalAdjustment:
				"No reduction unless concurrent severe hepatic and renal failure exists.",
			hepaticAdjustment: "Monitor carefully if bilirubin is elevated.",
			neonatalContraindications:
				"CONTRAINDICATED in hyperbilirubinemic neonates and with IV calcium (fatal pulmonary/renal precipitates).",
			monitoringNotes: "Avoid in infants < 28 days corrected gestational age."
		}
	},

	// 5. AMOXICILLIN / CLAVULANATE (AUGMENTIN)
	{
		id: "amoxicillin-clavulanate",
		name: "Amoxicillin / Clavulanate (Augmentin)",
		genericName: "Amoxicillin + Clavulanic Acid",
		category: "Antibiotic",
		indication:
			"Acute otitis media, community-acquired pneumonia, sinusitis, animal bites",
		standardDose: 40,
		minDose: 25,
		maxDose: 90,
		doseUnit: "mg/kg/day",
		frequency:
			"q8h (125/31.25 or 250/62.5 formulations) or q12h (200/28 or 400/57)",
		dosesPerDay: 2,
		routes: ["Oral"],
		maxSingleDoseMg: 1000,
		maxDailyDoseMg: 2000,
		concentrations: [
			{
				id: "aug-susp-156",
				label: "Oral Suspension 156.25 mg / 5 mL (125 mg amox)",
				mg: 125,
				ml: 5,
				route: "Oral"
			},
			{
				id: "aug-susp-312",
				label: "Oral Suspension 312.5 mg / 5 mL (250 mg amox)",
				mg: 250,
				ml: 5,
				route: "Oral",
				isDefault: true
			},
			{
				id: "aug-susp-457",
				label: "Oral Suspension 457 mg / 5 mL (400 mg amox, q12h)",
				mg: 400,
				ml: 5,
				route: "Oral"
			}
		],
		safetyWarnings: {
			renalAdjustment:
				"Reduce frequency if GFR < 30 mL/min; avoid 875 mg or high-dose formulation.",
			hepaticAdjustment:
				"Caution in patients with past cholestatic jaundice or amoxicillin-clavulanate hepatotoxicity.",
			neonatalContraindications:
				"High clavulanate ratio can trigger severe osmotic diarrhea in young neonates.",
			monitoringNotes:
				"Take at the start of meals to minimize gastrointestinal discomfort."
		}
	},

	// 6. VANCOMYCIN
	{
		id: "vancomycin",
		name: "Vancomycin",
		genericName: "Vancomycin Hydrochloride",
		category: "Antibiotic",
		indication:
			"MRSA sepsis, coagulase-negative staphylococcus (CONS), central-line infections in NICU",
		standardDose: 15,
		minDose: 10,
		maxDose: 20,
		doseUnit: "mg/kg/dose",
		frequency: "q12h (neonates <1.2kg or GFR low) or q8h (term infants)",
		dosesPerDay: 2,
		routes: ["IV"],
		maxSingleDoseMg: 1000,
		maxDailyDoseMg: 3000,
		concentrations: [
			{
				id: "vanc-500",
				label:
					"Vial 500 mg reconstituted to 50 mg/mL, further diluted to 5 mg/mL",
				mg: 5,
				ml: 1,
				route: "IV",
				isDefault: true
			}
		],
		dilutionGuideline:
			"Final concentration must not exceed 5 mg/mL. Infuse over at least 60 minutes (rate ≤ 10 mg/min) to prevent Red Man Syndrome.",
		safetyWarnings: {
			renalAdjustment:
				"Adjust interval strictly according to trough levels and serum creatinine clearance.",
			hepaticAdjustment: "No routine dose modification.",
			neonatalContraindications:
				"Rapid bolus IV injection is strictly contraindicated.",
			monitoringNotes:
				"Target serum trough: 10–15 mcg/mL for bacteremia; 15–20 mcg/mL for meningitis or severe MRSA pneumonia."
		}
	},

	// 7. PARACETAMOL (ACETAMINOPHEN)
	{
		id: "paracetamol",
		name: "Paracetamol (Acetaminophen)",
		genericName: "Acetaminophen / Paracetamol",
		category: "Antipyretic/Analgesic",
		indication:
			"Fever reduction, mild-to-moderate pediatric pain, closure of patent ductus arteriosus (PDA)",
		standardDose: 15,
		minDose: 10,
		maxDose: 15,
		doseUnit: "mg/kg/dose",
		frequency: "q4h–q6h as needed (maximum 4–5 doses per 24 hours)",
		dosesPerDay: 4,
		routes: ["Oral", "PR", "IV"],
		maxSingleDoseMg: 1000,
		maxDailyDoseMg: 4000,
		concentrations: [
			{
				id: "para-drops-100",
				label: "Infant Oral Drops 100 mg / 1 mL (Cetal / Adol)",
				mg: 100,
				ml: 1,
				route: "Oral",
				isDefault: true
			},
			{
				id: "para-susp-120",
				label: "Oral Syrup / Suspension 120 mg / 5 mL (24 mg/mL)",
				mg: 120,
				ml: 5,
				route: "Oral"
			},
			{
				id: "para-susp-250",
				label: "Forte Oral Suspension 250 mg / 5 mL (50 mg/mL)",
				mg: 250,
				ml: 5,
				route: "Oral"
			},
			{
				id: "para-iv-10mg",
				label: "IV Infusion 1000 mg / 100 mL (Perfalgan 10 mg/mL)",
				mg: 10,
				ml: 1,
				route: "IV"
			}
		],
		dilutionGuideline:
			"IV formulation is administered neat over 15 minutes. In neonates ≤ 10 kg, withdraw correct mL volume into syringe.",
		safetyWarnings: {
			renalAdjustment: "Extend interval to q8h if GFR < 10 mL/min.",
			hepaticAdjustment:
				"Absolute contraindication in acute liver failure; reduce dose by 50% in active chronic hepatic dysfunction.",
			neonatalContraindications:
				"In preterm neonates, maximum daily dose should not exceed 60 mg/kg/day due to reduced glucuronidation.",
			monitoringNotes:
				"Ensure total daily paracetamol from all combination cough/cold medications is accounted for."
		}
	},

	// 8. IBUPROFEN
	{
		id: "ibuprofen",
		name: "Ibuprofen",
		genericName: "Ibuprofen",
		category: "Antipyretic/Analgesic",
		indication:
			"Fever and inflammatory pain in infants ≥6 months; IV formulation for PDA closure in NICU",
		standardDose: 10,
		minDose: 5,
		maxDose: 10,
		doseUnit: "mg/kg/dose",
		frequency: "q6h–q8h with milk/food (maximum 40 mg/kg/day)",
		dosesPerDay: 3,
		routes: ["Oral", "IV"],
		maxSingleDoseMg: 400,
		maxDailyDoseMg: 1200,
		concentrations: [
			{
				id: "ibu-susp-100",
				label: "Pediatric Suspension 100 mg / 5 mL (Brufen / Marcofen)",
				mg: 100,
				ml: 5,
				route: "Oral",
				isDefault: true
			},
			{
				id: "ibu-iv-10mg",
				label: "IV Solution for PDA 10 mg / 1 mL (Pedea)",
				mg: 10,
				ml: 1,
				route: "IV"
			}
		],
		dilutionGuideline:
			"For oral syrup, give with food or milk to prevent gastric irritation. IV Pedea is infused over 15 minutes.",
		safetyWarnings: {
			renalAdjustment:
				"Avoid in acute kidney injury or severe volume depletion (prerenal azotemia).",
			hepaticAdjustment:
				"Use with caution in moderate hepatic impairment; contraindicated in severe liver disease.",
			neonatalContraindications:
				"Oral OTC forms contraindicated in infants under 3 months or < 5 kg. For PDA in NICU: monitor platelets & urine output.",
			monitoringNotes:
				"Watch for gastrointestinal bleeding, oliguria, or worsening of asthma symptoms."
		}
	},

	// 9. CAFFEINE CITRATE
	{
		id: "caffeine-citrate",
		name: "Caffeine Citrate",
		genericName: "Caffeine Citrate",
		category: "Respiratory",
		indication:
			"Apnea of prematurity in preterm infants (<33 weeks gestation), facilitating extubation",
		standardDose: 5, // Maintenance: 5 mg/kg/day (equivalent to 2.5 mg/kg base). Loading is 20 mg/kg
		minDose: 5,
		maxDose: 10,
		doseUnit: "mg/kg/day",
		frequency:
			"Once daily (q24h) maintenance; loading dose is 20 mg/kg single stat dose",
		dosesPerDay: 1,
		routes: ["IV", "Oral"],
		maxSingleDoseMg: 40,
		maxDailyDoseMg: 40,
		concentrations: [
			{
				id: "caff-amp-20",
				label: "Ampoule 20 mg / 1 mL (Peyona / Cafcit)",
				mg: 20,
				ml: 1,
				route: "IV",
				isDefault: true
			}
		],
		dilutionGuideline:
			"May be administered undiluted or diluted in D5W. Infuse maintenance dose over 10 minutes (loading dose over 30 minutes).",
		safetyWarnings: {
			renalAdjustment:
				"Reduce maintenance dose by 50% in severe renal impairment.",
			hepaticAdjustment:
				"Caution in severe hepatic impairment due to prolonged elimination half-life.",
			neonatalContraindications:
				"Underlying cardiac arrhythmias or refractory tachycardia (heart rate > 180 bpm).",
			monitoringNotes:
				"Monitor heart rate and feeding tolerance. Therapeutic range for caffeine: 8 to 20 mcg/mL."
		}
	},

	// 10. EPINEPHRINE (ADRENALINE)
	{
		id: "epinephrine",
		name: "Epinephrine (Adrenaline)",
		genericName: "Epinephrine Hydrochloride",
		category: "Emergency/Resuscitation",
		indication:
			"Neonatal resuscitation, pediatric cardiac arrest, anaphylaxis, severe croup (racemic/L-epinephrine)",
		standardDose: 10, // 10 mcg/kg (0.01 mg/kg) = 0.1 mL/kg of 1:10,000 solution
		minDose: 10,
		maxDose: 30,
		doseUnit: "mcg/kg/dose",
		frequency: "Repeat every 3 to 5 minutes as needed during cardiac arrest",
		dosesPerDay: 1,
		routes: ["IV", "IM", "Inhalation"],
		maxSingleDoseMg: 1,
		maxDailyDoseMg: 5,
		concentrations: [
			{
				id: "epi-1-10k",
				label: "Resuscitation 1:10,000 (0.1 mg/mL = 100 mcg/mL)",
				mg: 0.1,
				ml: 1,
				route: "IV",
				isDefault: true
			},
			{
				id: "epi-1-1k",
				label: "Anaphylaxis IM 1:1,000 (1.0 mg/mL = 1000 mcg/mL)",
				mg: 1.0,
				ml: 1,
				route: "IM"
			}
		],
		dilutionGuideline:
			"For neonatal resuscitation IV: USE ONLY 1:10,000 solution. Push rapidly followed by normal saline flush.",
		safetyWarnings: {
			renalAdjustment: "No dose adjustment in acute resuscitation emergencies.",
			hepaticAdjustment: "No dose adjustment in acute resuscitation.",
			neonatalContraindications:
				"NEVER administer 1:1,000 formulation directly via IV without 10-fold dilution.",
			monitoringNotes:
				"Continuous ECG, heart rate, and arterial blood pressure monitoring required."
		}
	},

	// 11. PHENOBARBITAL
	{
		id: "phenobarbital",
		name: "Phenobarbital",
		genericName: "Phenobarbital Sodium",
		category: "Anticonvulsant",
		indication:
			"First-line therapy for neonatal seizures, status epilepticus in infants",
		standardDose: 3.5, // Maintenance: 3-5 mg/kg/day. Loading dose: 20 mg/kg
		minDose: 2.5,
		maxDose: 5,
		doseUnit: "mg/kg/day",
		frequency: "q12h or q24h; Loading dose: 20 mg/kg single stat dose",
		dosesPerDay: 2,
		routes: ["IV", "Oral", "IM"],
		maxSingleDoseMg: 300,
		maxDailyDoseMg: 300,
		concentrations: [
			{
				id: "pheno-amp-40",
				label: "Ampoule 40 mg / 1 mL",
				mg: 40,
				ml: 1,
				route: "IV",
				isDefault: true
			},
			{
				id: "pheno-amp-200",
				label: "Ampoule 200 mg / 1 mL",
				mg: 200,
				ml: 1,
				route: "IV"
			},
			{
				id: "pheno-elixir-15",
				label: "Oral Elixir 15 mg / 5 mL (Sominal)",
				mg: 15,
				ml: 5,
				route: "Oral"
			}
		],
		dilutionGuideline:
			"Dilute in Sterile Water or NS. Infuse loading dose at a rate not exceeding 1 mg/kg/minute (over 20-30 min).",
		safetyWarnings: {
			renalAdjustment: "Reduce maintenance dose by 25-50% if GFR < 10 mL/min.",
			hepaticAdjustment:
				"Use with extreme caution in hepatic coma or severe liver disease.",
			neonatalContraindications:
				"Severe respiratory depression (unless patient is intubated and mechanically ventilated).",
			monitoringNotes:
				"Therapeutic serum level: 15–40 mcg/mL. Monitor for sedation, respiratory depression, and hypotension."
		}
	},

	// 12. LEVETIRACETAM (KEPPRA)
	{
		id: "levetiracetam",
		name: "Levetiracetam (Keppra)",
		genericName: "Levetiracetam",
		category: "Anticonvulsant",
		indication:
			"Second-line neonatal seizures, refractory status epilepticus, focal/generalized pediatric seizures",
		standardDose: 20, // 20-30 mg/kg/dose initial; max 60 mg/kg/day
		minDose: 10,
		maxDose: 30,
		doseUnit: "mg/kg/dose",
		frequency: "q12h (twice daily)",
		dosesPerDay: 2,
		routes: ["IV", "Oral"],
		maxSingleDoseMg: 1500,
		maxDailyDoseMg: 3000,
		concentrations: [
			{
				id: "keppra-oral-100",
				label: "Oral Solution 100 mg / 1 mL (Keppra / Tiratam)",
				mg: 100,
				ml: 1,
				route: "Oral",
				isDefault: true
			},
			{
				id: "keppra-iv-100",
				label: "IV Vial 500 mg / 5 mL (100 mg/mL)",
				mg: 100,
				ml: 1,
				route: "IV"
			}
		],
		dilutionGuideline:
			"Dilute in at least 100 mL NS or D5W for larger children, or 1:1 with NS in neonates. Infuse over 15 minutes.",
		safetyWarnings: {
			renalAdjustment:
				"Dose must be reduced by 50% if GFR 30–50 mL/min, and by 75% if GFR < 30 mL/min.",
			hepaticAdjustment: "No adjustment in mild-moderate hepatic impairment.",
			neonatalContraindications:
				"Known hypersensitivity to pyrrolidone derivatives.",
			monitoringNotes:
				"Lower risk of sedation and cardiovascular depression compared to phenobarbital."
		}
	},

	// 13. FUROSEMIDE (LASIX)
	{
		id: "furosemide",
		name: "Furosemide (Lasix)",
		genericName: "Furosemide",
		category: "Cardiovascular/Diuretic",
		indication:
			"Fluid overload, congestive heart failure, bronchopulmonary dysplasia (BPD), acute pulmonary edema",
		standardDose: 1,
		minDose: 0.5,
		maxDose: 2,
		doseUnit: "mg/kg/dose",
		frequency: "q12h to q24h as needed",
		dosesPerDay: 1,
		routes: ["IV", "Oral", "IM"],
		maxSingleDoseMg: 40,
		maxDailyDoseMg: 80,
		concentrations: [
			{
				id: "lasix-amp-20",
				label: "Ampoule 20 mg / 2 mL (10 mg/mL)",
				mg: 20,
				ml: 2,
				route: "IV",
				isDefault: true
			},
			{
				id: "lasix-oral-10",
				label: "Oral Liquid 10 mg / 1 mL (Lasix syrup)",
				mg: 10,
				ml: 1,
				route: "Oral"
			}
		],
		dilutionGuideline:
			"Administer undiluted or diluted in NS over 5 to 15 minutes. Infusion rate should not exceed 4 mg/minute.",
		safetyWarnings: {
			renalAdjustment:
				"Caution in anuric renal failure; high doses may cause ototoxicity.",
			hepaticAdjustment:
				"Electrolyte shifts can precipitate hepatic encephalopathy in liver failure.",
			neonatalContraindications:
				"Severe hypovolemia, uncorrected electrolyte depletion (hyponatremia, hypokalemia).",
			monitoringNotes:
				"Monitor serum electrolytes (K+, Na+, Cl-), renal function, and hearing. Chronic use in neonates causes nephrocalcinosis."
		}
	},

	// 14. SALBUTAMOL (ALBUTEROL)
	{
		id: "salbutamol",
		name: "Salbutamol (Albuterol)",
		genericName: "Salbutamol Sulfate",
		category: "Respiratory",
		indication:
			"Acute bronchospasm, asthma exacerbation, viral wheeze (>12 months of age)",
		standardDose: 0.15,
		minDose: 0.1,
		maxDose: 0.3,
		doseUnit: "mg/kg/dose",
		frequency: "q20min for 3 doses in acute crisis, then q4h–q6h",
		dosesPerDay: 4,
		routes: ["Inhalation", "Oral"],
		maxSingleDoseMg: 5,
		maxDailyDoseMg: 20,
		concentrations: [
			{
				id: "salb-resp-5",
				label: "Nebulizer Solution 5 mg / 1 mL (Ventolin 0.5%)",
				mg: 5,
				ml: 1,
				route: "Inhalation",
				isDefault: true
			},
			{
				id: "salb-syrup-2",
				label: "Oral Syrup 2 mg / 5 mL (0.4 mg/mL)",
				mg: 2,
				ml: 5,
				route: "Oral"
			}
		],
		dilutionGuideline:
			"Dilute calculated dose in 2.5 to 3 mL Normal Saline and nebulize with high-flow oxygen (6-8 L/min).",
		safetyWarnings: {
			renalAdjustment: "No dose adjustment required.",
			hepaticAdjustment: "No dose adjustment required.",
			neonatalContraindications:
				"Not recommended for routine bronchiolitis in infants < 6 months due to lack of beta-2 receptor maturity.",
			monitoringNotes:
				"Monitor for tachycardia, tremors, hypokalemia, and oxygen saturation."
		}
	},

	// 15. DEXAMETHASONE
	{
		id: "dexamethasone",
		name: "Dexamethasone",
		genericName: "Dexamethasone Sodium Phosphate",
		category: "Respiratory",
		indication:
			"Acute viral croup (laryngotracheobronchitis), post-extubation stridor in PICU/NICU, bacterial meningitis adjunct",
		standardDose: 0.15, // Croup dose: 0.15 mg/kg (single dose, up to 0.6 mg/kg)
		minDose: 0.15,
		maxDose: 0.6,
		doseUnit: "mg/kg/dose",
		frequency: "Single stat dose for croup; q6h-q12h for extubation edema",
		dosesPerDay: 1,
		routes: ["Oral", "IV", "IM"],
		maxSingleDoseMg: 16,
		maxDailyDoseMg: 16,
		concentrations: [
			{
				id: "dex-amp-8",
				label: "Ampoule 8 mg / 2 mL (4 mg/mL)",
				mg: 8,
				ml: 2,
				route: "IV",
				isDefault: true
			},
			{
				id: "dex-oral-2",
				label: "Oral Solution 2 mg / 5 mL (0.4 mg/mL)",
				mg: 2,
				ml: 5,
				route: "Oral"
			}
		],
		dilutionGuideline:
			"May be given slow IV push over 3 to 5 minutes or diluted in D5W or NS for short infusion.",
		safetyWarnings: {
			renalAdjustment: "No adjustment needed.",
			hepaticAdjustment: "No adjustment for short courses.",
			neonatalContraindications:
				"Systemic fungal infections. Avoid routine high-dose dexamethasone in preterm infants due to neurodevelopmental concerns.",
			monitoringNotes:
				"Check blood glucose and blood pressure if given for > 48 hours."
		}
	},

	// 16. ONDANSETRON
	{
		id: "ondansetron",
		name: "Ondansetron",
		genericName: "Ondansetron Hydrochloride",
		category: "Gastrointestinal",
		indication:
			"Persistent vomiting in acute gastroenteritis (>6 months), post-chemotherapy emesis",
		standardDose: 0.15,
		minDose: 0.1,
		maxDose: 0.2,
		doseUnit: "mg/kg/dose",
		frequency:
			"q8h as needed (or weight-banded single oral dose in dehydration protocols)",
		dosesPerDay: 3,
		routes: ["Oral", "IV"],
		maxSingleDoseMg: 4,
		maxDailyDoseMg: 12,
		concentrations: [
			{
				id: "ond-syrup-4",
				label: "Oral Syrup 4 mg / 5 mL (0.8 mg/mL - Zofran / Danset)",
				mg: 4,
				ml: 5,
				route: "Oral",
				isDefault: true
			},
			{
				id: "ond-amp-4",
				label: "Ampoule 4 mg / 2 mL (2 mg/mL)",
				mg: 4,
				ml: 2,
				route: "IV"
			}
		],
		dilutionGuideline:
			"Slow IV push over 2 to 5 minutes, or dilute in 50 mL NS/D5W over 15 minutes.",
		safetyWarnings: {
			renalAdjustment: "No adjustment necessary.",
			hepaticAdjustment:
				"Maximum 8 mg/day in severe hepatic impairment (Child-Pugh score ≥ 10).",
			neonatalContraindications:
				"Not recommended in infants under 6 months of age.",
			monitoringNotes:
				"Avoid in patients with prolonged congenital QT syndrome or receiving other QT-prolonging agents."
		}
	}
];
