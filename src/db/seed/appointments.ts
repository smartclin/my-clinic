// src/db/seed/appointments.ts
import type { NewAppointment } from "../schema";
import { CLINIC_HURGHADA_ID, SEED_ADMIN_ID } from "./user";

const PATIENT_YOUSSEF = "00000000-0000-4000-8000-000000001001";
const PATIENT_NOUR = "00000000-0000-4000-8000-000000001002";
const PATIENT_KAREEM = "00000000-0000-4000-8000-000000001003";

export function buildAppointments(
	doctorId: string = SEED_ADMIN_ID
): NewAppointment[] {
	return [
		// Youssef Ahmed
		{
			id: "00000000-0000-4000-8000-000000004001",
			patientId: PATIENT_YOUSSEF,
			clinicId: CLINIC_HURGHADA_ID,
			doctorId,
			scheduledAt: new Date("2024-04-15T09:00:00Z"),
			durationMinutes: 30,
			status: "completed",
			reason: "Newborn initial well-child assessment",
			notes: "Full physical examination, neonatal reflexes, BCG vaccination."
		},
		{
			id: "00000000-0000-4000-8000-000000004002",
			patientId: PATIENT_YOUSSEF,
			clinicId: CLINIC_HURGHADA_ID,
			doctorId,
			scheduledAt: new Date("2024-06-15T10:00:00Z"),
			durationMinutes: 20,
			status: "completed",
			reason: "2-month well-child & vaccination visit",
			notes: "Penta 1, OPV, IPV administered. Growth on track."
		},
		{
			id: "00000000-0000-4000-8000-000000004003",
			patientId: PATIENT_YOUSSEF,
			clinicId: CLINIC_HURGHADA_ID,
			doctorId,
			scheduledAt: new Date("2024-08-15T10:30:00Z"),
			durationMinutes: 20,
			status: "completed",
			reason: "4-month milestone and vaccine review",
			notes: "Steady head control observed. Penta 2 given."
		},
		{
			id: "00000000-0000-4000-8000-000000004004",
			patientId: PATIENT_YOUSSEF,
			clinicId: CLINIC_HURGHADA_ID,
			doctorId,
			scheduledAt: new Date("2024-10-15T11:00:00Z"),
			durationMinutes: 20,
			status: "completed",
			reason: "6-month checkup, acute ear examination",
			notes: "Bilateral otitis media diagnosed; Augmentin initiated."
		},

		// Nour El-Din Hassan
		{
			id: "00000000-0000-4000-8000-000000004005",
			patientId: PATIENT_NOUR,
			clinicId: CLINIC_HURGHADA_ID,
			doctorId,
			scheduledAt: new Date("2024-02-10T11:30:00Z"),
			durationMinutes: 30,
			status: "completed",
			reason: "18-month nutritional & growth assessment",
			notes: "Mild stunting identified. Zinc supplementation plan initiated."
		},
		{
			id: "00000000-0000-4000-8000-000000004006",
			patientId: PATIENT_NOUR,
			clinicId: CLINIC_HURGHADA_ID,
			doctorId,
			scheduledAt: new Date("2024-08-10T12:00:00Z"),
			durationMinutes: 20,
			status: "completed",
			reason: "24-month well-child & milestone review",
			notes: "Excellent catch-up growth. Two-word phrases achieved."
		},

		// Kareem Mostafa
		{
			id: "00000000-0000-4000-8000-000000004007",
			patientId: PATIENT_KAREEM,
			clinicId: CLINIC_HURGHADA_ID,
			doctorId,
			scheduledAt: new Date("2025-09-02T10:00:00Z"),
			durationMinutes: 30,
			status: "completed",
			reason: "Post-discharge NICU follow-up",
			notes: "Full feeding tolerance, sepsis workup negative."
		},
		{
			id: "00000000-0000-4000-8000-000000004008",
			patientId: PATIENT_KAREEM,
			clinicId: CLINIC_HURGHADA_ID,
			doctorId,
			scheduledAt: new Date("2025-10-01T10:30:00Z"),
			durationMinutes: 20,
			status: "completed",
			reason: "1-month wellness checkup & colic assessment",
			notes: "Colic advised with simethicone; weight gain 1 kg/month."
		},
		{
			id: "00000000-0000-4000-8000-000000004009",
			patientId: PATIENT_YOUSSEF,
			clinicId: CLINIC_HURGHADA_ID,
			doctorId,
			scheduledAt: new Date("2026-11-15T10:00:00Z"),
			durationMinutes: 20,
			status: "scheduled",
			reason: "Pediatric well-child annual checkup",
			notes: "Scheduled routine examination."
		}
	];
}
