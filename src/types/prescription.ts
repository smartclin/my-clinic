/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Types for Egyptian Pediatric Prescription & Medical Certificate Generator
 */

export interface PrescriptionItem {
	id: string;
	drugId?: string;
	name: string;
	genericName?: string;
	formulation: string; // e.g., "Oral Suspension 120 mg / 5 mL", "Syrup", "Tablet 250mg", "IV Infusion"
	doseMg?: number;
	doseVolume?: string; // e.g., "5 mL", "2 drops", "1 puff"
	route: string; // "Oral", "IV", "IM", "Inhalation", "Topical", "PR", "Nasal", "Ophthalmic"
	frequency: string; // e.g., "Every 8 hours (TDS)", "Every 12 hours (BD)", "Once daily (OD)", "PRN (As needed)"
	duration: string; // e.g., "5 days", "7 days", "10 days", "Until finished"
	instructions: string; // e.g., "Take after meals. Shake bottle well. Complete entire course."
}

export interface PrescriptionRecord {
	id: string;
	patientId: string;
	patientName: string;
	patientGender: "boy" | "girl";
	patientDob: string;
	patientAge: string;
	patientMrn?: string;
	weightKg: number;
	heightCm?: number;
	prescriptionDate: string;
	diagnosis: string;
	allergies: string;
	items: PrescriptionItem[];
	clinicalNotes?: string;
	physicianName: string;
	physicianTitle: string;
	physicianRegNo: string;
	hospitalName: string;
	departmentName: string;
}

export type CertificateType =
	| "sick_leave"
	| "school_fitness"
	| "sports_exemption";

export interface MedicalCertificateRecord {
	id: string;
	patientId: string;
	patientName: string;
	patientGender: "boy" | "girl";
	patientDob: string;
	patientAge: string;
	patientMrn?: string;
	issueDate: string;
	diagnosis: string;
	certificateType: CertificateType;
	recipient: string; // "To Whom It May Concern / إلى من يهمه الأمر" or "School Administration / إدارة المدرسة"
	startDate: string;
	durationDays: number;
	endDate: string;
	returnDate: string;
	activityRestrictions?: string;
	clinicalNotes?: string;
	physicianName: string;
	physicianTitle: string;
	physicianRegNo: string;
	hospitalName: string;
	departmentName: string;
}
