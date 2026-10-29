// src/db/seed/milestones.ts
import type { NewMilestone } from "../schema";
import { SEED_ADMIN_ID } from "./user";

const PATIENT_YOUSSEF = "00000000-0000-4000-8000-000000001001";
const PATIENT_NOUR = "00000000-0000-4000-8000-000000001002";
const PATIENT_KAREEM = "00000000-0000-4000-8000-000000001003";

export function buildMilestones(
	createdBy: string = SEED_ADMIN_ID
): NewMilestone[] {
	return [
		// ── 1. Youssef Ahmed (born 2024-04-15) ──────────────────────────────
		{
			patientId: PATIENT_YOUSSEF,
			milestoneId: "m-2m-smile",
			isAchieved: true,
			achievedDate: "2024-06-10",
			notes: "Smiles warmly in response to parent voices.",
			createdBy
		},
		{
			patientId: PATIENT_YOUSSEF,
			milestoneId: "m-2m-track",
			isAchieved: true,
			achievedDate: "2024-06-12",
			notes: "Follows objects smoothly across midline past 90 degrees.",
			createdBy
		},
		{
			patientId: PATIENT_YOUSSEF,
			milestoneId: "m-4m-head",
			isAchieved: true,
			achievedDate: "2024-08-12",
			notes: "Good steady head control on pull-to-sit. No head lag.",
			createdBy
		},
		{
			patientId: PATIENT_YOUSSEF,
			milestoneId: "m-4m-reach",
			isAchieved: true,
			achievedDate: "2024-08-14",
			notes: "Reaches out with both hands for dangling toys.",
			createdBy
		},
		{
			patientId: PATIENT_YOUSSEF,
			milestoneId: "m-6m-sit",
			isAchieved: true,
			achievedDate: "2024-10-10",
			notes: "Sits momentarily leaning forward on hands (tripod sitting).",
			createdBy
		},
		{
			patientId: PATIENT_YOUSSEF,
			milestoneId: "m-6m-babble",
			isAchieved: true,
			achievedDate: "2024-10-12",
			notes:
				"Babbles melodically with repetitive consonant sounds (ba-ba, da-da).",
			createdBy
		},

		// ── 2. Nour El-Din Hassan (born 2022-08-10) ─────────────────────────
		{
			patientId: PATIENT_NOUR,
			milestoneId: "m-6m-sit",
			isAchieved: true,
			achievedDate: "2023-02-15",
			notes: "Good trunk balance while sitting without hand support.",
			createdBy
		},
		{
			patientId: PATIENT_NOUR,
			milestoneId: "m-12m-stand",
			isAchieved: true,
			achievedDate: "2023-08-20",
			notes: "Stands momentarily without support. Cruises along furniture.",
			createdBy
		},
		{
			patientId: PATIENT_NOUR,
			milestoneId: "m-15m-walk",
			isAchieved: true,
			achievedDate: "2023-11-15",
			notes: "Walks independently across room with steady gait.",
			createdBy
		},
		{
			patientId: PATIENT_NOUR,
			milestoneId: "m-18m-words",
			isAchieved: true,
			achievedDate: "2024-02-12",
			notes: "Uses 10+ single words with communicative intent.",
			createdBy
		},
		{
			patientId: PATIENT_NOUR,
			milestoneId: "m-24m-phrases",
			isAchieved: true,
			achievedDate: "2024-08-10",
			notes: "Combines 2 words spontaneously (e.g., 'baba rooh', 'more milk').",
			createdBy
		},
		{
			patientId: PATIENT_NOUR,
			milestoneId: "m-24m-stairs",
			isAchieved: true,
			achievedDate: "2024-08-15",
			notes: "Walks up and down stairs holding railing, 2 feet per step.",
			createdBy
		},

		// ── 3. Kareem Mostafa (born 2025-09-01) ─────────────────────────────
		{
			patientId: PATIENT_KAREEM,
			milestoneId: "m-2m-track",
			isAchieved: true,
			achievedDate: "2025-10-25",
			notes: "Tracks colorful toy and turns head toward maternal voice.",
			createdBy
		}
	];
}
