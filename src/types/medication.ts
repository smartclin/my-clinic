/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Clinical Medication & Dosage Calculation Types
 * Designed for neonatal intensive care (NICU) and pediatric outpatient/inpatient therapy.
 */

export type DrugCategory =
	| "Antibiotic"
	| "Antipyretic/Analgesic"
	| "Emergency/Resuscitation"
	| "Anticonvulsant"
	| "Cardiovascular/Diuretic"
	| "Respiratory"
	| "Gastrointestinal";

export type DoseUnit =
	| "mg/kg/dose"
	| "mg/kg/day"
	| "mcg/kg/dose"
	| "mcg/kg/min";

export type DrugRoute = "IV" | "IM" | "Oral" | "Inhalation" | "PR";

export interface DrugConcentration {
	id: string;
	label: string; // e.g. "Oral Suspension 120 mg / 5 mL"
	mg: number; // e.g. 120
	ml: number; // e.g. 5
	route: DrugRoute;
	isDefault?: boolean;
}

export interface DrugFormularyItem {
	id: string;
	name: string;
	genericName: string;
	category: DrugCategory;
	indication: string;
	standardDose: number; // Default recommended dose in doseUnit
	minDose: number;
	maxDose: number;
	doseUnit: DoseUnit;
	frequency: string; // e.g., "q8h (every 8 hours)"
	dosesPerDay: number; // Number of divided doses per day (e.g., 3 for q8h, 1 for q24h)
	routes: DrugRoute[];
	maxSingleDoseMg?: number;
	maxDailyDoseMg?: number;
	concentrations: DrugConcentration[];
	dilutionGuideline?: string;
	infusionRate?: string;
	safetyWarnings: {
		renalAdjustment?: string;
		hepaticAdjustment?: string;
		neonatalContraindications?: string;
		monitoringNotes?: string;
	};
}

export type DoseSemanticsKind = "per_dose" | "per_day" | "per_minute" | "fixed";

export type DoseSemantics =
	| { kind: "per_dose"; rawSingleMg: number; rawDailyMg: number }
	| { kind: "per_day"; rawSingleMg: number; rawDailyMg: number }
	| { kind: "per_minute"; rawSingleMg: number; rawDailyMg: number }
	| { kind: "fixed"; rawSingleMg: number; rawDailyMg: number };

export interface CalculatedDosageResult {
	weightKg: number;
	selectedDose: number;
	doseUnit: DoseUnit;
	singleDoseMg: number;
	dailyDoseMg: number;
	isCappedBySingleLimit: boolean;
	isCappedByDailyLimit: boolean;
	cappedBy: "single" | "daily" | "both" | null;
	cappedSingleDoseMg?: number;
	cappedDailyDoseMg?: number;
	requiresConcentrationConfirmation?: boolean;
	liquidVolumeMl?: number;
	selectedConcentration?: DrugConcentration;
	prescriptionText: string;
}
