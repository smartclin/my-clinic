// src/db/seed/visits.ts
import type { NewVisit } from "../schema";
import { CLINIC_HURGHADA_ID, SEED_ADMIN_ID } from "./user";

const PATIENT_YOUSSEF = "00000000-0000-4000-8000-000000001001";
const PATIENT_NOUR = "00000000-0000-4000-8000-000000001002";
const PATIENT_KAREEM = "00000000-0000-4000-8000-000000001003";

export function buildVisits(doctorId: string = SEED_ADMIN_ID): NewVisit[] {
	return [
		// Youssef Ahmed
		{
			id: "00000000-0000-4000-8000-000000005001",
			patientId: PATIENT_YOUSSEF,
			clinicId: CLINIC_HURGHADA_ID,
			appointmentId: "00000000-0000-4000-8000-000000004001",
			doctorId,
			visitedAt: new Date("2024-04-15T09:00:00Z"),
			ageMonths: 0,
			ageYears: 0,
			ageMonthsRemainder: 0
		},
		{
			id: "00000000-0000-4000-8000-000000005002",
			patientId: PATIENT_YOUSSEF,
			clinicId: CLINIC_HURGHADA_ID,
			appointmentId: "00000000-0000-4000-8000-000000004002",
			doctorId,
			visitedAt: new Date("2024-06-15T10:00:00Z"),
			ageMonths: 2,
			ageYears: 0,
			ageMonthsRemainder: 2
		},
		{
			id: "00000000-0000-4000-8000-000000005003",
			patientId: PATIENT_YOUSSEF,
			clinicId: CLINIC_HURGHADA_ID,
			appointmentId: "00000000-0000-4000-8000-000000004003",
			doctorId,
			visitedAt: new Date("2024-08-15T10:30:00Z"),
			ageMonths: 4,
			ageYears: 0,
			ageMonthsRemainder: 4
		},
		{
			id: "00000000-0000-4000-8000-000000005004",
			patientId: PATIENT_YOUSSEF,
			clinicId: CLINIC_HURGHADA_ID,
			appointmentId: "00000000-0000-4000-8000-000000004004",
			doctorId,
			visitedAt: new Date("2024-10-15T11:00:00Z"),
			ageMonths: 6,
			ageYears: 0,
			ageMonthsRemainder: 6
		},

		// Nour El-Din Hassan
		{
			id: "00000000-0000-4000-8000-000000005005",
			patientId: PATIENT_NOUR,
			clinicId: CLINIC_HURGHADA_ID,
			appointmentId: "00000000-0000-4000-8000-000000004005",
			doctorId,
			visitedAt: new Date("2024-02-10T11:30:00Z"),
			ageMonths: 18,
			ageYears: 1,
			ageMonthsRemainder: 6
		},
		{
			id: "00000000-0000-4000-8000-000000005006",
			patientId: PATIENT_NOUR,
			clinicId: CLINIC_HURGHADA_ID,
			appointmentId: "00000000-0000-4000-8000-000000004006",
			doctorId,
			visitedAt: new Date("2024-08-10T12:00:00Z"),
			ageMonths: 24,
			ageYears: 2,
			ageMonthsRemainder: 0
		},

		// Kareem Mostafa
		{
			id: "00000000-0000-4000-8000-000000005007",
			patientId: PATIENT_KAREEM,
			clinicId: CLINIC_HURGHADA_ID,
			appointmentId: "00000000-0000-4000-8000-000000004007",
			doctorId,
			visitedAt: new Date("2025-09-02T10:00:00Z"),
			ageMonths: 0,
			ageYears: 0,
			ageMonthsRemainder: 0
		},
		{
			id: "00000000-0000-4000-8000-000000005008",
			patientId: PATIENT_KAREEM,
			clinicId: CLINIC_HURGHADA_ID,
			appointmentId: "00000000-0000-4000-8000-000000004008",
			doctorId,
			visitedAt: new Date("2025-10-01T10:30:00Z"),
			ageMonths: 1,
			ageYears: 0,
			ageMonthsRemainder: 1
		}
	];
}
