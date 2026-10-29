// src/db/seed/vaccinations.ts
import type { NewVaccination } from "../schema";
import { SEED_ADMIN_ID } from "./user";

const PATIENT_YOUSSEF = "00000000-0000-4000-8000-000000001001";
const PATIENT_NOUR = "00000000-0000-4000-8000-000000001002";
const PATIENT_KAREEM = "00000000-0000-4000-8000-000000001003";

export function buildVaccinations(
	createdBy: string = SEED_ADMIN_ID
): NewVaccination[] {
	return [
		// ── 1. Youssef Ahmed (boy, born 2024-04-15) ──────────────────────────
		{
			patientId: PATIENT_YOUSSEF,
			vaccineId: "birth-bcg",
			status: "completed",
			administeredDate: "2024-04-16",
			batchNumber: "BCG-EGY-8921",
			administeredBy: "DrHazem",
			facility: "General Hospital, Hurghada",
			notes: "Normal wheal formed. No complications.",
			createdBy
		},
		{
			patientId: PATIENT_YOUSSEF,
			vaccineId: "birth-hepb",
			status: "completed",
			administeredDate: "2024-04-15",
			batchNumber: "HEP-B-2024-11",
			administeredBy: "DrHazem",
			facility: "General Hospital, Hurghada",
			createdBy
		},
		{
			patientId: PATIENT_YOUSSEF,
			vaccineId: "birth-opv",
			status: "completed",
			administeredDate: "2024-04-15",
			batchNumber: "OPV-2024-01",
			administeredBy: "Staff Nurse Fatima",
			facility: "General Hospital, Hurghada",
			createdBy
		},
		{
			patientId: PATIENT_YOUSSEF,
			vaccineId: "2m-penta",
			status: "completed",
			administeredDate: "2024-06-15",
			batchNumber: "PNT-2024-88",
			administeredBy: "DrHazem",
			facility: "General Hospital, Hurghada",
			notes: "Mild fever managed with paracetamol drops.",
			createdBy
		},
		{
			patientId: PATIENT_YOUSSEF,
			vaccineId: "2m-ipv",
			status: "completed",
			administeredDate: "2024-06-15",
			batchNumber: "IPV-2024-34",
			administeredBy: "DrHazem",
			facility: "General Hospital, Hurghada",
			createdBy
		},
		{
			patientId: PATIENT_YOUSSEF,
			vaccineId: "2m-opv",
			status: "completed",
			administeredDate: "2024-06-15",
			batchNumber: "OPV-2024-15",
			administeredBy: "Staff Nurse Fatima",
			facility: "General Hospital, Hurghada",
			createdBy
		},
		{
			patientId: PATIENT_YOUSSEF,
			vaccineId: "4m-penta",
			status: "completed",
			administeredDate: "2024-08-15",
			batchNumber: "PNT-2024-102",
			administeredBy: "DrHazem",
			facility: "General Hospital, Hurghada",
			createdBy
		},
		{
			patientId: PATIENT_YOUSSEF,
			vaccineId: "4m-ipv",
			status: "completed",
			administeredDate: "2024-08-15",
			batchNumber: "IPV-2024-67",
			administeredBy: "DrHazem",
			facility: "General Hospital, Hurghada",
			createdBy
		},
		{
			patientId: PATIENT_YOUSSEF,
			vaccineId: "4m-opv",
			status: "completed",
			administeredDate: "2024-08-15",
			batchNumber: "OPV-2024-28",
			administeredBy: "Staff Nurse Fatima",
			facility: "General Hospital, Hurghada",
			createdBy
		},
		{
			patientId: PATIENT_YOUSSEF,
			vaccineId: "6m-penta",
			status: "completed",
			administeredDate: "2024-10-15",
			batchNumber: "PNT-2024-210",
			administeredBy: "DrHazem",
			facility: "General Hospital, Hurghada",
			createdBy
		},
		{
			patientId: PATIENT_YOUSSEF,
			vaccineId: "6m-opv",
			status: "completed",
			administeredDate: "2024-10-15",
			batchNumber: "OPV-2024-45",
			administeredBy: "Staff Nurse Fatima",
			facility: "General Hospital, Hurghada",
			createdBy
		},

		// ── 2. Nour El-Din Hassan (girl, born 2022-08-10) ────────────────────
		{
			patientId: PATIENT_NOUR,
			vaccineId: "birth-bcg",
			status: "completed",
			administeredDate: "2022-08-11",
			batchNumber: "BCG-EGY-6211",
			administeredBy: "DrHazem",
			facility: "General Hospital, Hurghada",
			createdBy
		},
		{
			patientId: PATIENT_NOUR,
			vaccineId: "birth-hepb",
			status: "completed",
			administeredDate: "2022-08-10",
			batchNumber: "HEP-B-2022-05",
			administeredBy: "DrHazem",
			facility: "General Hospital, Hurghada",
			createdBy
		},
		{
			patientId: PATIENT_NOUR,
			vaccineId: "2m-penta",
			status: "completed",
			administeredDate: "2022-10-10",
			batchNumber: "PNT-2022-44",
			administeredBy: "DrHazem",
			facility: "General Hospital, Hurghada",
			createdBy
		},
		{
			patientId: PATIENT_NOUR,
			vaccineId: "4m-penta",
			status: "completed",
			administeredDate: "2022-12-10",
			batchNumber: "PNT-2022-89",
			administeredBy: "DrHazem",
			facility: "General Hospital, Hurghada",
			createdBy
		},
		{
			patientId: PATIENT_NOUR,
			vaccineId: "6m-penta",
			status: "completed",
			administeredDate: "2023-02-10",
			batchNumber: "PNT-2023-12",
			administeredBy: "DrHazem",
			facility: "General Hospital, Hurghada",
			createdBy
		},
		{
			patientId: PATIENT_NOUR,
			vaccineId: "9m-measles",
			status: "completed",
			administeredDate: "2023-05-10",
			batchNumber: "MSL-2023-08",
			administeredBy: "DrHazem",
			facility: "General Hospital, Hurghada",
			createdBy
		},
		{
			patientId: PATIENT_NOUR,
			vaccineId: "12m-mmr",
			status: "completed",
			administeredDate: "2023-08-10",
			batchNumber: "MMR-2023-77",
			administeredBy: "DrHazem",
			facility: "General Hospital, Hurghada",
			createdBy
		},
		{
			patientId: PATIENT_NOUR,
			vaccineId: "18m-booster-dpt",
			status: "completed",
			administeredDate: "2024-02-10",
			batchNumber: "DPT-2024-03",
			administeredBy: "DrHazem",
			facility: "General Hospital, Hurghada",
			createdBy
		},
		{
			patientId: PATIENT_NOUR,
			vaccineId: "18m-booster-mmr",
			status: "completed",
			administeredDate: "2024-02-10",
			batchNumber: "MMR-2024-19",
			administeredBy: "DrHazem",
			facility: "General Hospital, Hurghada",
			createdBy
		},

		// ── 3. Kareem Mostafa (boy, born 2025-09-01) ─────────────────────────
		{
			patientId: PATIENT_KAREEM,
			vaccineId: "birth-bcg",
			status: "completed",
			administeredDate: "2025-09-02",
			batchNumber: "BCG-EGY-9941",
			administeredBy: "DrHazem",
			facility: "General Hospital, Hurghada",
			notes: "Administered prior to nursery discharge.",
			createdBy
		},
		{
			patientId: PATIENT_KAREEM,
			vaccineId: "birth-hepb",
			status: "completed",
			administeredDate: "2025-09-01",
			batchNumber: "HEP-B-2025-33",
			administeredBy: "DrHazem",
			facility: "General Hospital, Hurghada",
			createdBy
		},
		{
			patientId: PATIENT_KAREEM,
			vaccineId: "2m-penta",
			status: "due",
			dueDate: "2025-11-01",
			notes: "Scheduled for 2-month clinic visit.",
			createdBy
		}
	];
}
