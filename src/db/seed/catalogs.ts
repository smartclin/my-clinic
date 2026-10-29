// db/seed/catalogs.ts

import {
	EGYPTIAN_MOH_VACCINE_SCHEDULE,
	PEDIATRIC_MILESTONES
} from "@/types/immunization";

import type { NewMilestoneCatalogItem, NewVaccineCatalogItem } from "../schema";

export function buildVaccineCatalog(): NewVaccineCatalogItem[] {
	return EGYPTIAN_MOH_VACCINE_SCHEDULE.map(v => ({
		id: v.id, // 'birth-bcg' — varchar(64) ✅
		label: v.vaccineName,
		arabicLabel: v.arabicName,
		disease: v.targetDiseases,
		recommendedAgeMonths: v.ageMonths,
		recommendedAgeLabel: v.ageStage,
		schedule: "egypt-moh",
		isMandatoryMoh: v.isMandatoryMOH,
		notes: v.description
	}));
}

export function buildMilestoneCatalog(): NewMilestoneCatalogItem[] {
	return PEDIATRIC_MILESTONES.map(m => ({
		id: m.id, // 'm-2m-smile' — varchar(64) ✅
		label: m.title,
		arabicLabel: m.arabicTitle,
		domain: m.category, // already 'gross-motor' etc ✅
		expectedAgeMonths: m.ageMonths,
		ageLabel: `${m.ageMonths} months`,
		redFlagWarning: m.redFlagWarning,
		notes: m.description
	}));
}
