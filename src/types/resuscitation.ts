/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Pediatric Code Blue & Emergency Resuscitation Types
 * Clinical standards aligned with AHA PALS (Pediatric Advanced Life Support),
 * ERC (European Resuscitation Council), and Egyptian Emergency Protocols.
 */

export interface AirwayEquipmentMatrix {
	cuffedEtTubeSize: number; // mm ID
	uncuffedEtTubeSize: number; // mm ID
	insertionDepthLipCm: number; // cm at lip
	insertionDepthNoseCm?: number; // cm at nostril
	laryngoscopeBladeSize: string; // e.g. "Miller 0 / 1", "Macintosh 2"
	laryngoscopeBladeType: "Miller (Straight)" | "Macintosh (Curved)" | "Either";
	suctionCatheterFr: number; // French gauge
	bagValveMaskSize: "Neonatal" | "Infant" | "Pediatric" | "Adult";
	chestTubeSizeFr: string; // e.g. "10 - 12 Fr"
	lmaSize: string; // Laryngeal Mask Airway size, e.g. "1.5", "2"
}

export interface ElectricalTherapyMatrix {
	defibrillationInitialJ: number; // 2 J/kg
	defibrillationSubsequentJ: number; // 4 J/kg
	defibrillationMaxJ: number; // Cap (adult max 200J biphasic / 360J monophasic)
	cardioversionInitialJ: number; // 0.5 - 1.0 J/kg
	cardioversionSubsequentJ: number; // 2 J/kg
}

export interface EmergencyDrugCalculation {
	id: string;
	name: string;
	indication: string;
	concentrationString: string;
	concentrationMgPerMl: number;
	doseFormula: string; // e.g. "0.01 mg/kg (0.1 mL/kg)"
	doseMg: number;
	volumeMl: number;
	route: "IV/IO" | "IV/IO/IM" | "IV/IO/ETT" | "Inhalation" | "Rectal";
	maxDoseCapMg?: number;
	maxDoseCapMl?: number;
	notes: string;
	isCapped: boolean;
	priorityCategory:
		| "cardiac_arrest"
		| "fluids_glucose"
		| "antiarrhythmic"
		| "anaphylaxis_airway"
		| "antidote_electrolyte";
}

export interface EmergencyResuscitationSummary {
	weightKg: number;
	estimatedAgeMonths?: number;
	airway: AirwayEquipmentMatrix;
	electrical: ElectricalTherapyMatrix;
	drugs: EmergencyDrugCalculation[];
}
