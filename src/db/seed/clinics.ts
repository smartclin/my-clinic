// db/seed/clinics.ts
import type { NewClinic } from "../schema";

export function buildClinics(): NewClinic[] {
	return [
		{
			id: "00000000-0000-4000-8000-000000000001", // stable, valid UUIDv4
			name: "General Hospital, Hurghada — Pediatric Department",
			address: "El-Ahaya, Hurghada, Red Sea Governorate, Egypt",
			phone: "+20 65 344 1234",
			email: "peds@hurghada-moh.gov.eg"
		},
		{
			id: "00000000-0000-4000-8000-000000000002",
			name: "Cairo University Pediatric Hospital — Outpatient",
			address: "Al-Saray St, Al-Manial, Cairo, Egypt",
			phone: "+20 2 2365 4444",
			email: "opd@cu-peds.edu.eg"
		},
		{
			id: "00000000-0000-4000-8000-000000000003",
			name: "Alexandria MOH Family Health Unit",
			address: "El-Horreya Rd, Alexandria, Egypt",
			phone: "+20 3 4beled 5555",
			email: "fhu@alex-moh.gov.eg"
		}
	];
}
