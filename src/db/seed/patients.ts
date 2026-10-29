// src/db/seed/patients.ts
import type { NewPatient } from "../schema";
import { CLINIC_HURGHADA_ID, SEED_ADMIN_ID } from "./user";

export function buildPatients(ownerId: string = SEED_ADMIN_ID): NewPatient[] {
	return [
		{
			id: "00000000-0000-4000-8000-000000001001",
			clinicId: CLINIC_HURGHADA_ID,
			ownerId,
			name: "Youssef Ahmed",
			gender: "boy",
			dob: "2024-04-15",
			medicalRecordNumber: "EGY-CAI-2024-0981",
			guardianName: "Ahmed Hassan",
			guardianPhone: "+20 100 123 4567",
			allergies: "NKDA",
			notes:
				"Follow-up for well-child pediatric checkups. Good nutritional intake."
		},
		{
			id: "00000000-0000-4000-8000-000000001002",
			clinicId: CLINIC_HURGHADA_ID,
			ownerId,
			name: "Nour El-Din Hassan",
			gender: "girl",
			dob: "2022-08-10",
			medicalRecordNumber: "EGY-ALX-2022-4412",
			guardianName: "Hassan Mahmoud",
			guardianPhone: "+20 100 987 6543",
			allergies: "NKDA",
			notes:
				"Initial mild stunting at 18 mo; documented catch-up growth on zinc supplementation."
		},
		{
			id: "00000000-0000-4000-8000-000000001003",
			clinicId: CLINIC_HURGHADA_ID,
			ownerId,
			name: "Kareem Mostafa",
			gender: "boy",
			dob: "2025-09-01",
			medicalRecordNumber: "EGY-GIZ-2025-1104",
			guardianName: "Mostafa Ibrahim",
			guardianPhone: "+20 122 555 0123",
			allergies: "NKDA",
			notes:
				"Infant visit series. Exclusive breastfeeding. Post-nursery follow-up."
		}
	];
}
