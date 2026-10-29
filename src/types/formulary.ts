import { z } from "zod";

export type AWaReClassification =
	| "Access"
	| "Watch"
	| "Reserve"
	| "Not Applicable";

export type FormularyRoute =
	| "Oral"
	| "IV"
	| "IM"
	| "SC"
	| "Inhalation"
	| "Ophthalmic"
	| "Topical"
	| "Rectal"
	| "Subcutaneous"
	| "Nasal"
	| "Intratracheal"
	| "Otic";

export type DoseUnitType =
	| "mg/kg/dose"
	| "mg/kg/day"
	| "mcg/kg/dose"
	| "mcg/kg/day"
	| "fixed_mg"
	| "fixed_mcg"
	| "g/day"
	| "drops"
	| "puffs";

export type PregnancyCategoryType =
	| "A"
	| "B"
	| "C"
	| "D"
	| "X"
	| "Not Assigned";

export interface CommercialProductPresentation {
	id: string;
	form: string; // e.g. "Oral Suspension", "Vial", "Tablet", "Oral Drops", "Dry Powder Inhaler"
	strength: string; // e.g. "312.5 mg / 5 mL", "1000 mg", "100 mg / 1 mL"
	concentrationMg?: number; // active mg per unit volume (e.g. 250 mg)
	volumeMl?: number; // unit volume (e.g. 5 mL)
	route: FormularyRoute;
	commercialBrandsEgypt?: string[]; // e.g. ["Augmentin", "Curam", "Megamox", "Hibiotic"]
	isDefault?: boolean;
}

export interface PediatricDosingRule {
	standardDosePerKg?: number;
	doseUnit: DoseUnitType;
	frequency: string; // e.g., "q8h", "q12h", "q24h", "PRN"
	dosesPerDay: number; // e.g., 3 for q8h, 2 for q12h
	minDosePerKg?: number;
	maxDosePerKg?: number;
	maxSingleDoseMg?: number;
	maxDailyDoseMg?: number;
	minAgeMonths?: number;
	maxAgeMonths?: number;
	guidelines: string;
}

export interface AdultDosingRule {
	standardDose: string;
	maxDailyDose?: string;
	frequency: string;
	guidelines: string;
}

export interface RenalDoseAdjustment {
	crClNormal?: string; // e.g. "CrCl >= 50 mL/min: No adjustment"
	crClMildToModerate?: string; // e.g. "CrCl 10-50 mL/min: 50% of dose or q12-24h"
	crClSevere?: string; // e.g. "CrCl < 10 mL/min: 25% of dose or q24-48h"
	dialysis?: string; // e.g. "Dose after hemodialysis"
}

export interface PreparationAndInfusion {
	reconstitutionDiluent?: string; // e.g. "SWFI, 0.9% NaCl"
	reconstitutionVolumeMl?: number;
	finalInfusionConcentration?: string; // e.g. "0.5 to 5 mg/mL in D5W or NS"
	infusionRate?: string; // e.g. "Infuse over 30 to 60 minutes"
	stability?: string; // e.g. "Stable for 24h at room temp"
}

export interface DrugMonograph {
	id: string;
	genericName: string;
	brandNamesEgypt: string[];
	pharmacologicalCategory: string;
	atcCode: string;
	awareClassification?: AWaReClassification;
	indications: string[];
	clinicalSymptoms: string[]; // e.g. ["fever", "cough", "earache", "diarrhea", "vomiting", "wheezing"]
	presentations: CommercialProductPresentation[];
	routes: FormularyRoute[];
	pediatricDosing: PediatricDosingRule;
	adultDosing: AdultDosingRule;
	renalAdjustment: RenalDoseAdjustment;
	hepaticAdjustment: string;
	foodCorrelation: string; // e.g., "Administer with food", "Take on empty stomach 1h before meal"
	preparationAndInfusion?: PreparationAndInfusion;
	contraindications: string[];
	blackBoxWarnings?: string[];
	majorAdverseReactions: string[];
	pregnancyCategory: PregnancyCategoryType;
	lactation: string;
	riskXInteractions: string[]; // Avoid combination
	riskDInteractions: string[]; // Consider therapy modification
	monitoringParameters: string[];
	g6pdWarning?: boolean;
	penicillinAllergyCrossReactive?: boolean;
}

// Zod Validation Schemas
export const CommercialProductPresentationSchema = z.object({
	id: z.string(),
	form: z.string(),
	strength: z.string(),
	concentrationMg: z.number().optional(),
	volumeMl: z.number().optional(),
	route: z.enum([
		"Oral",
		"IV",
		"IM",
		"SC",
		"Inhalation",
		"Ophthalmic",
		"Topical",
		"Rectal",
		"Subcutaneous",
		"Nasal",
		"Intratracheal",
		"Otic"
	]),
	commercialBrandsEgypt: z.array(z.string()).optional(),
	isDefault: z.boolean().optional()
});

export const PediatricDosingRuleSchema = z.object({
	standardDosePerKg: z.number().optional(),
	doseUnit: z.enum([
		"mg/kg/dose",
		"mg/kg/day",
		"mcg/kg/dose",
		"mcg/kg/day",
		"fixed_mg",
		"fixed_mcg",
		"g/day",
		"drops",
		"puffs"
	]),
	frequency: z.string(),
	dosesPerDay: z.number(),
	minDosePerKg: z.number().optional(),
	maxDosePerKg: z.number().optional(),
	maxSingleDoseMg: z.number().optional(),
	maxDailyDoseMg: z.number().optional(),
	minAgeMonths: z.number().optional(),
	maxAgeMonths: z.number().optional(),
	guidelines: z.string()
});

export const AdultDosingRuleSchema = z.object({
	standardDose: z.string(),
	maxDailyDose: z.string().optional(),
	frequency: z.string(),
	guidelines: z.string()
});

export const RenalDoseAdjustmentSchema = z.object({
	crClNormal: z.string().optional(),
	crClMildToModerate: z.string().optional(),
	crClSevere: z.string().optional(),
	dialysis: z.string().optional()
});

export const PreparationAndInfusionSchema = z.object({
	reconstitutionDiluent: z.string().optional(),
	reconstitutionVolumeMl: z.number().optional(),
	finalInfusionConcentration: z.string().optional(),
	infusionRate: z.string().optional(),
	stability: z.string().optional()
});

export const DrugMonographSchema = z.object({
	id: z.string(),
	genericName: z.string(),
	brandNamesEgypt: z.array(z.string()),
	pharmacologicalCategory: z.string(),
	atcCode: z.string(),
	awareClassification: z
		.enum(["Access", "Watch", "Reserve", "Not Applicable"])
		.optional(),
	indications: z.array(z.string()),
	clinicalSymptoms: z.array(z.string()),
	presentations: z.array(CommercialProductPresentationSchema),
	routes: z.array(
		z.enum([
			"Oral",
			"IV",
			"IM",
			"SC",
			"Inhalation",
			"Ophthalmic",
			"Topical",
			"Rectal",
			"Subcutaneous",
			"Nasal",
			"Intratracheal",
			"Otic"
		])
	),
	pediatricDosing: PediatricDosingRuleSchema,
	adultDosing: AdultDosingRuleSchema,
	renalAdjustment: RenalDoseAdjustmentSchema,
	hepaticAdjustment: z.string(),
	foodCorrelation: z.string(),
	preparationAndInfusion: PreparationAndInfusionSchema.optional(),
	contraindications: z.array(z.string()),
	blackBoxWarnings: z.array(z.string()).optional(),
	majorAdverseReactions: z.array(z.string()),
	pregnancyCategory: z.enum(["A", "B", "C", "D", "X", "Not Assigned"]),
	lactation: z.string(),
	riskXInteractions: z.array(z.string()),
	riskDInteractions: z.array(z.string()),
	monitoringParameters: z.array(z.string()),
	g6pdWarning: z.boolean().optional(),
	penicillinAllergyCrossReactive: z.boolean().optional()
});

export type DrugMonographValidated = z.infer<typeof DrugMonographSchema>;
