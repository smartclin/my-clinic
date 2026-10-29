import { z } from "zod";

export type VaccineStatus =
	| "completed"
	| "due"
	| "overdue"
	| "exempt"
	| "upcoming";

export interface VaccineScheduleItem {
	id: string;
	ageStage: string;
	ageMonths: number;
	vaccineName: string;
	arabicName: string;
	targetDiseases: string;
	doseNumber: string;
	route: "Intradermal" | "Intramuscular" | "Oral" | "Subcutaneous";
	site: string;
	isMandatoryMOH: boolean;
	description: string;
}

export interface PatientVaccinationRecord {
	id: string;
	patientId: string;
	vaccineId: string;
	status: VaccineStatus;
	administeredDate?: string;
	batchNumber?: string;
	administeredBy?: string;
	facility?: string;
	adverseReactions?: string;
	notes?: string;
	updatedAt: string;
}

export const PatientVaccinationRecordSchema = z.object({
	id: z.uuid(),
	patientId: z.uuid(),
	vaccineId: z.string(),
	status: z.enum(["completed", "due", "overdue", "exempt", "upcoming"]),
	administeredDate: z
		.string()
		.regex(/^\d{4}-\d{2}-\d{2}$/)
		.optional(),
	batchNumber: z.string().optional(),
	administeredBy: z.string().optional(),
	facility: z.string().optional(),
	adverseReactions: z.string().optional(),
	notes: z.string().optional(),
	updatedAt: z.string()
});

export type MilestoneCategory =
	| "gross-motor"
	| "fine-motor"
	| "language"
	| "social-cognitive";

export interface MilestoneItem {
	id: string;
	ageMonths: number;
	category: MilestoneCategory;
	title: string;
	arabicTitle: string;
	description: string;
	redFlagWarning?: string;
}

export interface PatientMilestoneRecord {
	id: string;
	patientId: string;
	milestoneId: string;
	isAchieved: boolean;
	achievedDate?: string;
	notes?: string;
	updatedAt: string;
}

export const PatientMilestoneRecordSchema = z.object({
	id: z.uuid(),
	patientId: z.uuid(),
	milestoneId: z.string(),
	isAchieved: z.boolean(),
	achievedDate: z
		.string()
		.regex(/^\d{4}-\d{2}-\d{2}$/)
		.optional(),
	notes: z.string().optional(),
	updatedAt: z.string()
});

/**
 * Official Egyptian Ministry of Health Childhood Vaccination Schedule
 * Comprehensive registry based on National Expanded Programme on Immunization (EPI)
 */
export const EGYPTIAN_MOH_VACCINE_SCHEDULE: VaccineScheduleItem[] = [
	// At Birth (First 24-48 hours)
	{
		id: "birth-bcg",
		ageStage: "At Birth (0–40 days)",
		ageMonths: 0,
		vaccineName: "BCG (Bacillus Calmette–Guérin)",
		arabicName: "طعم الدرن (بي سي جي)",
		targetDiseases: "Tuberculosis (Meningitis & Miliary TB)",
		doseNumber: "Single Dose (0.05 ml)",
		route: "Intradermal",
		site: "Left upper deltoid",
		isMandatoryMOH: true,
		description:
			"Given within the first month. Leaves a characteristic small scar."
	},
	{
		id: "birth-hepb",
		ageStage: "At Birth (Within 24 hours)",
		ageMonths: 0,
		vaccineName: "Hepatitis B (Zero Birth Dose)",
		arabicName: "طعم الالتهاب الكبدي ب (جرعة الميلاد)",
		targetDiseases: "Hepatitis B Virus (Perinatal transmission)",
		doseNumber: "Birth Dose (0.5 ml)",
		route: "Intramuscular",
		site: "Anterolateral right thigh",
		isMandatoryMOH: true,
		description:
			"Critical within first 24 hours to prevent maternal-fetal transmission."
	},
	{
		id: "birth-opv",
		ageStage: "At Birth",
		ageMonths: 0,
		vaccineName: "Oral Polio Vaccine (bOPV Zero Dose)",
		arabicName: "طعم شلل الأطفال الفموي (جرعة الصفر)",
		targetDiseases: "Poliomyelitis (Wild & VDPV)",
		doseNumber: "Zero Dose (2 drops)",
		route: "Oral",
		site: "Mouth",
		isMandatoryMOH: true,
		description: "Bivalent oral polio drops given at birth."
	},

	// 2 Months (8 Weeks)
	{
		id: "2m-penta",
		ageStage: "2 Months",
		ageMonths: 2,
		vaccineName: "Pentavalent Vaccine 1 (DTaP-HepB-Hib)",
		arabicName: "الطعم الخماسي (الجرعة الأولى)",
		targetDiseases:
			"Diphtheria, Tetanus, Pertussis, Hepatitis B, Haemophilus influenzae b",
		doseNumber: "1st Dose (0.5 ml)",
		route: "Intramuscular",
		site: "Anterolateral left thigh",
		isMandatoryMOH: true,
		description: "Primary immunization series dose 1."
	},
	{
		id: "2m-ipv",
		ageStage: "2 Months",
		ageMonths: 2,
		vaccineName: "Inactivated Polio Vaccine (IPV 1)",
		arabicName: "طعم شلل الأطفال بالحقن (سولك - الأولى)",
		targetDiseases: "Poliomyelitis Types 1, 2, 3",
		doseNumber: "1st Dose (0.5 ml)",
		route: "Intramuscular",
		site: "Anterolateral right thigh",
		isMandatoryMOH: true,
		description: "Injectable Salk polio vaccine."
	},
	{
		id: "2m-opv",
		ageStage: "2 Months",
		ageMonths: 2,
		vaccineName: "Oral Polio Vaccine (bOPV 1)",
		arabicName: "طعم شلل الأطفال الفموي (سابين - الأولى)",
		targetDiseases: "Poliomyelitis",
		doseNumber: "1st Dose (2 drops)",
		route: "Oral",
		site: "Mouth",
		isMandatoryMOH: true,
		description: "Sabin live attenuated oral drops."
	},
	{
		id: "2m-rotavirus",
		ageStage: "2 Months",
		ageMonths: 2,
		vaccineName: "Rotavirus Vaccine (1st Dose)",
		arabicName: "طعم الروتا (الجرعة الأولى)",
		targetDiseases: "Rotaviral Severe Gastroenteritis & Dehydration",
		doseNumber: "1st Dose (Oral liquid)",
		route: "Oral",
		site: "Mouth",
		isMandatoryMOH: false,
		description: "Recommended pediatric clinical preventive vaccine."
	},
	{
		id: "2m-pcv",
		ageStage: "2 Months",
		ageMonths: 2,
		vaccineName: "Pneumococcal Conjugate Vaccine (PCV 1)",
		arabicName: "طعم المكورات الرئوية (الجرعة الأولى)",
		targetDiseases:
			"Streptococcus pneumoniae (Meningitis, Bacteremia, Pneumonia, Otitis)",
		doseNumber: "1st Dose (0.5 ml)",
		route: "Intramuscular",
		site: "Anterolateral thigh",
		isMandatoryMOH: false,
		description: "Recommended conjugate vaccine (Synflorix / Prevenar)."
	},

	// 4 Months (16 Weeks)
	{
		id: "4m-penta",
		ageStage: "4 Months",
		ageMonths: 4,
		vaccineName: "Pentavalent Vaccine 2 (DTaP-HepB-Hib)",
		arabicName: "الطعم الخماسي (الجرعة الثانية)",
		targetDiseases: "Diphtheria, Tetanus, Pertussis, Hepatitis B, Hib",
		doseNumber: "2nd Dose (0.5 ml)",
		route: "Intramuscular",
		site: "Anterolateral left thigh",
		isMandatoryMOH: true,
		description: "Second dose of pentavalent series."
	},
	{
		id: "4m-ipv",
		ageStage: "4 Months",
		ageMonths: 4,
		vaccineName: "Inactivated Polio Vaccine (IPV 2)",
		arabicName: "طعم شلل الأطفال بالحقن (سولك - الثانية)",
		targetDiseases: "Poliomyelitis Types 1, 2, 3",
		doseNumber: "2nd Dose (0.5 ml)",
		route: "Intramuscular",
		site: "Anterolateral right thigh",
		isMandatoryMOH: true,
		description: "Second injectable polio dose."
	},
	{
		id: "4m-opv",
		ageStage: "4 Months",
		ageMonths: 4,
		vaccineName: "Oral Polio Vaccine (bOPV 2)",
		arabicName: "طعم شلل الأطفال الفموي (سابين - الثانية)",
		targetDiseases: "Poliomyelitis",
		doseNumber: "2nd Dose (2 drops)",
		route: "Oral",
		site: "Mouth",
		isMandatoryMOH: true,
		description: "Second oral polio drops."
	},
	{
		id: "4m-rotavirus",
		ageStage: "4 Months",
		ageMonths: 4,
		vaccineName: "Rotavirus Vaccine (2nd Dose)",
		arabicName: "طعم الروتا (الجرعة الثانية)",
		targetDiseases: "Rotaviral Dehydrating Diarrhea",
		doseNumber: "2nd Dose (Oral liquid)",
		route: "Oral",
		site: "Mouth",
		isMandatoryMOH: false,
		description: "Second dose (must be given before 6-8 months)."
	},
	{
		id: "4m-pcv",
		ageStage: "4 Months",
		ageMonths: 4,
		vaccineName: "Pneumococcal Conjugate Vaccine (PCV 2)",
		arabicName: "طعم المكورات الرئوية (الجرعة الثانية)",
		targetDiseases: "Invasive Pneumococcal Disease",
		doseNumber: "2nd Dose (0.5 ml)",
		route: "Intramuscular",
		site: "Anterolateral thigh",
		isMandatoryMOH: false,
		description: "Second dose of pneumococcal conjugate."
	},

	// 6 Months (24 Weeks)
	{
		id: "6m-penta",
		ageStage: "6 Months",
		ageMonths: 6,
		vaccineName: "Pentavalent Vaccine 3 (DTaP-HepB-Hib)",
		arabicName: "الطعم الخماسي (الجرعة الثالثة)",
		targetDiseases: "Diphtheria, Tetanus, Pertussis, Hepatitis B, Hib",
		doseNumber: "3rd Dose (0.5 ml)",
		route: "Intramuscular",
		site: "Anterolateral left thigh",
		isMandatoryMOH: true,
		description: "Completes primary infant pentavalent series."
	},
	{
		id: "6m-ipv",
		ageStage: "6 Months",
		ageMonths: 6,
		vaccineName: "Inactivated Polio Vaccine (IPV 3)",
		arabicName: "طعم شلل الأطفال بالحقن (سولك - الثالثة)",
		targetDiseases: "Poliomyelitis Types 1, 2, 3",
		doseNumber: "3rd Dose (0.5 ml)",
		route: "Intramuscular",
		site: "Anterolateral right thigh",
		isMandatoryMOH: true,
		description: "Third injectable polio dose."
	},
	{
		id: "6m-opv",
		ageStage: "6 Months",
		ageMonths: 6,
		vaccineName: "Oral Polio Vaccine (bOPV 3)",
		arabicName: "طعم شلل الأطفال الفموي (سابين - الثالثة)",
		targetDiseases: "Poliomyelitis",
		doseNumber: "3rd Dose (2 drops)",
		route: "Oral",
		site: "Mouth",
		isMandatoryMOH: true,
		description: "Third oral polio drops."
	},
	{
		id: "6m-pcv",
		ageStage: "6 Months",
		ageMonths: 6,
		vaccineName: "Pneumococcal Conjugate Vaccine (PCV 3)",
		arabicName: "طعم المكورات الرئوية (الجرعة الثالثة)",
		targetDiseases: "Invasive Pneumococcal Disease",
		doseNumber: "3rd Dose (0.5 ml)",
		route: "Intramuscular",
		site: "Anterolateral thigh",
		isMandatoryMOH: false,
		description: "Third dose of infant pneumococcal series."
	},

	// 9 Months
	{
		id: "9m-opv",
		ageStage: "9 Months",
		ageMonths: 9,
		vaccineName: "Oral Polio Vaccine (bOPV 4)",
		arabicName: "طعم شلل الأطفال الفموي (الجرعة الرابعة)",
		targetDiseases: "Poliomyelitis",
		doseNumber: "4th Dose (2 drops)",
		route: "Oral",
		site: "Mouth",
		isMandatoryMOH: true,
		description: "Nine-month booster dose under Egyptian MOH guidelines."
	},
	{
		id: "9m-measles",
		ageStage: "9 Months",
		ageMonths: 9,
		vaccineName: "Measles Single Antigen / Vitamin A Capsule",
		arabicName: "طعم الحصبة المنفرد + كبسولة فيتامين أ (100,000 وحدة)",
		targetDiseases: "Measles Virus, Vitamin A Deficiency",
		doseNumber: "1st Dose (0.5 ml) + 1 Blue Capsule",
		route: "Subcutaneous",
		site: "Upper arm + Oral capsule",
		isMandatoryMOH: true,
		description:
			"Early measles protection + oral Vitamin A 100,000 IU to boost mucosal immunity."
	},

	// 12 Months (1 Year)
	{
		id: "12m-mmr",
		ageStage: "12 Months (1 Year)",
		ageMonths: 12,
		vaccineName: "MMR Vaccine (1st Dose)",
		arabicName: "طعم الحصبة والنكاف والحصبة الألمانية (الأولى)",
		targetDiseases: "Measles, Mumps, Rubella",
		doseNumber: "1st Dose (0.5 ml)",
		route: "Subcutaneous",
		site: "Upper right arm",
		isMandatoryMOH: true,
		description: "Primary triple viral MMR vaccine."
	},
	{
		id: "12m-opv",
		ageStage: "12 Months",
		ageMonths: 12,
		vaccineName: "Oral Polio Vaccine (bOPV 5)",
		arabicName: "طعم شلل الأطفال الفموي (الجرعة الخامسة)",
		targetDiseases: "Poliomyelitis",
		doseNumber: "5th Dose (2 drops)",
		route: "Oral",
		site: "Mouth",
		isMandatoryMOH: true,
		description: "Annual routine polio immunization."
	},
	{
		id: "12m-varicella",
		ageStage: "12 Months",
		ageMonths: 12,
		vaccineName: "Varicella (Chickenpox 1st Dose)",
		arabicName: "طعم الجديري المائي (الجرعة الأولى)",
		targetDiseases: "Varicella Zoster Virus",
		doseNumber: "1st Dose (0.5 ml)",
		route: "Subcutaneous",
		site: "Upper outer arm",
		isMandatoryMOH: false,
		description: "Optional clinical recommendation for Varicella prevention."
	},
	{
		id: "12m-hepa",
		ageStage: "12 Months",
		ageMonths: 12,
		vaccineName: "Hepatitis A Vaccine (1st Dose)",
		arabicName: "طعم الالتهاب الكبدي أ (الجرعة الأولى)",
		targetDiseases: "Hepatitis A Virus",
		doseNumber: "1st Dose (0.5 ml)",
		route: "Intramuscular",
		site: "Deltoid muscle",
		isMandatoryMOH: false,
		description: "Pediatric recommendation; 2nd dose given 6 months later."
	},

	// 18 Months (1.5 Years)
	{
		id: "18m-booster-dpt",
		ageStage: "18 Months",
		ageMonths: 18,
		vaccineName: "DTP Booster Dose (Diphtheria, Tetanus, Pertussis)",
		arabicName: "طعم الثلاثي البكتيري (الجرعة المنشطة الأولى)",
		targetDiseases: "Diphtheria, Tetanus, Pertussis",
		doseNumber: "1st Booster (0.5 ml)",
		route: "Intramuscular",
		site: "Left upper deltoid",
		isMandatoryMOH: true,
		description: "Toddler booster reinforcing cellular & humoral immunity."
	},
	{
		id: "18m-booster-mmr",
		ageStage: "18 Months",
		ageMonths: 18,
		vaccineName: "MMR Booster (2nd Dose)",
		arabicName: "طعم الحصبة والنكاف والحصبة الألمانية (المنشطة)",
		targetDiseases: "Measles, Mumps, Rubella",
		doseNumber: "2nd Dose (0.5 ml)",
		route: "Subcutaneous",
		site: "Right upper deltoid",
		isMandatoryMOH: true,
		description: "Mandatory second dose completing lifelong MMR immunity."
	},
	{
		id: "18m-booster-opv",
		ageStage: "18 Months",
		ageMonths: 18,
		vaccineName: "Oral Polio Booster (bOPV 6) + Vitamin A",
		arabicName: "طعم شلل الأطفال المنشط + كبسولة فيتامين أ (200,000 وحدة)",
		targetDiseases: "Poliomyelitis, Vitamin A Deficiency",
		doseNumber: "Booster (2 drops) + 2 Red Capsules",
		route: "Oral",
		site: "Mouth",
		isMandatoryMOH: true,
		description:
			"Reinforces gut mucosal polio resistance + 200,000 IU Vitamin A."
	},
	{
		id: "18m-hepa-booster",
		ageStage: "18 Months",
		ageMonths: 18,
		vaccineName: "Hepatitis A (2nd Dose Booster)",
		arabicName: "طعم الالتهاب الكبدي أ (الجرعة الثانية المنشطة)",
		targetDiseases: "Hepatitis A Virus",
		doseNumber: "2nd Dose (0.5 ml)",
		route: "Intramuscular",
		site: "Deltoid muscle",
		isMandatoryMOH: false,
		description: "Completes lifelong immunity against Hepatitis A."
	},

	// School Entry (4 to 6 Years)
	{
		id: "school-dpt",
		ageStage: "School Entry (4–6 Years)",
		ageMonths: 48,
		vaccineName: "DTP / Td School Booster",
		arabicName: "جرعة منشطة لدخول المدارس (ثنائي أو ثلاثي)",
		targetDiseases: "Diphtheria, Tetanus, Pertussis",
		doseNumber: "2nd Booster (0.5 ml)",
		route: "Intramuscular",
		site: "Left deltoid",
		isMandatoryMOH: true,
		description: "Administered before primary school admission."
	},
	{
		id: "school-opv",
		ageStage: "School Entry (4–6 Years)",
		ageMonths: 48,
		vaccineName: "Oral Polio Booster (School Entry)",
		arabicName: "طعم شلل الأطفال المنشط لدخول المدارس",
		targetDiseases: "Poliomyelitis",
		doseNumber: "Final Booster (2 drops)",
		route: "Oral",
		site: "Mouth",
		isMandatoryMOH: true,
		description: "Final childhood routine OPV booster."
	}
];

/**
 * Key Pediatric Developmental Milestones (WHO & Egyptian Clinical Guidelines)
 */
export const PEDIATRIC_MILESTONES: MilestoneItem[] = [
	// 2 Months
	{
		id: "m-2m-smile",
		ageMonths: 2,
		category: "social-cognitive",
		title: "Social Smile",
		arabicTitle: "الابتسامة الاجتماعية",
		description: "Smiles responsively to parents faces and familiar voices.",
		redFlagWarning: "No responsive smile or eye contact by 8-10 weeks."
	},
	{
		id: "m-2m-track",
		ageMonths: 2,
		category: "fine-motor",
		title: "Visual Tracking to Midline",
		arabicTitle: "تتبع الأشياء بالعين",
		description:
			"Follows colorful objects or human faces smoothly past the midline."
	},

	// 4 Months
	{
		id: "m-4m-head",
		ageMonths: 4,
		category: "gross-motor",
		title: "Steady Head Control",
		arabicTitle: "التحكم التام في الرأس",
		description:
			"Holds head steady and erect without head lag when pulled to sit.",
		redFlagWarning:
			"Prominent head lag at 4 months requires neurological check."
	},
	{
		id: "m-4m-reach",
		ageMonths: 4,
		category: "fine-motor",
		title: "Reaches for Objects",
		arabicTitle: "الوصول للأشياء والإمساك بها",
		description:
			"Reaches out with both hands towards toys and brings hands to mouth."
	},

	// 6 Months
	{
		id: "m-6m-sit",
		ageMonths: 6,
		category: "gross-motor",
		title: "Sits Unsupported",
		arabicTitle: "الجلوس بدون مساعدة",
		description:
			"Sits independently with back straight for at least 30 seconds.",
		redFlagWarning: "Inability to sit with support by 7-8 months."
	},
	{
		id: "m-6m-transfer",
		ageMonths: 6,
		category: "fine-motor",
		title: "Transfers Hand-to-Hand",
		arabicTitle: "نقل الألعاب من يد لأخرى",
		description: "Smoothly passes a block or rattle from one hand to the other."
	},
	{
		id: "m-6m-babble",
		ageMonths: 6,
		category: "language",
		title: "Polysyllabic Babbling",
		arabicTitle: "المناغاة وتكرار المقاطع",
		description:
			'Strings vowels and consonants together ("ba-ba", "da-da", "ma-ma").'
	},

	// 9 Months
	{
		id: "m-9m-pincer",
		ageMonths: 9,
		category: "fine-motor",
		title: "Inferior Pincer Grasp",
		arabicTitle: "التقاط الأشياء الدقيقة بالإبهام والسبابة",
		description: "Picks up small objects using thumb and index finger pads."
	},
	{
		id: "m-9m-crawl",
		ageMonths: 9,
		category: "gross-motor",
		title: "Crawling & Pulling to Stand",
		arabicTitle: "الحبو والوقوف مستنداً",
		description:
			"Crawls forwards on hands and knees; pulls up to stand against furniture."
	},
	{
		id: "m-9m-object-permanence",
		ageMonths: 9,
		category: "social-cognitive",
		title: "Object Permanence & Peek-a-boo",
		arabicTitle: "إدراك بقاء الأشياء ولعبة الاستغماية",
		description: "Looks for dropped toys; laughs and anticipates peek-a-boo."
	},

	// 12 Months (1 Year)
	{
		id: "m-12m-words",
		ageMonths: 12,
		category: "language",
		title: "First Specific Words",
		arabicTitle: "أولى الكلمات المحددة المعنى",
		description:
			'Says 1–3 specific words with meaning (e.g., "Mama", "Baba", "No").',
		redFlagWarning: "No single words or pointing gestures by 15 months."
	},
	{
		id: "m-12m-stand",
		ageMonths: 12,
		category: "gross-motor",
		title: "Stands Momentarily Alone",
		arabicTitle: "الوقوف منفرداً لعدة ثوانٍ",
		description:
			"Stands alone unsupported for 5–10 seconds; cruises along furniture."
	},
	{
		id: "m-12m-wave",
		ageMonths: 12,
		category: "social-cognitive",
		title: "Waves Bye-Bye & Points",
		arabicTitle: "الإشارة باليد والتوديع (باي باي)",
		description:
			"Uses proto-declarative pointing to show interest; waves goodbye."
	},

	// 15–18 Months
	{
		id: "m-15m-walk",
		ageMonths: 15,
		category: "gross-motor",
		title: "Walks Independently",
		arabicTitle: "المشي منفرداً بثبات",
		description: "Walks well without holding hands or furniture.",
		redFlagWarning:
			"Not walking independently by 18 months requires evaluation."
	},
	{
		id: "m-18m-words",
		ageMonths: 18,
		category: "language",
		title: "Vocabulary of 10–20 Words",
		arabicTitle: "حصيلة 10 إلى 20 كلمة",
		description:
			"Speaks at least 10 recognizable words; points to 2 body parts."
	},
	{
		id: "m-18m-spoon",
		ageMonths: 18,
		category: "fine-motor",
		title: "Uses Spoon & Drinks from Cup",
		arabicTitle: "الأكل بالملعقة والشرب من الكوب",
		description:
			"Manages a spoon with minor spilling; stacks a tower of 3–4 cubes."
	},

	// 24 Months (2 Years)
	{
		id: "m-24m-phrases",
		ageMonths: 24,
		category: "language",
		title: "Two-Word Meaningful Phrases",
		arabicTitle: "تكوين جمل من كلمتين",
		description: 'Combines two words ("want milk", "go car", "baba come").',
		redFlagWarning: "Lack of 2-word spontaneous phrases by 24 months."
	},
	{
		id: "m-24m-stairs",
		ageMonths: 24,
		category: "gross-motor",
		title: "Runs & Climbs Stairs",
		arabicTitle: "الجري وصعود السلالم",
		description:
			"Runs steadily without falling; walks up stairs holding railing."
	}
];
