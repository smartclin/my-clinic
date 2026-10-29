// src/db/seed/index.ts
import dotenv from "dotenv";

dotenv.config({ path: [".env.local", ".env"] });

import { closeConnection, db, sql } from "..";
import * as schema from "../schema";
import { buildAppointments } from "./appointments";
import { buildMilestoneCatalog, buildVaccineCatalog } from "./catalogs";
import { buildClinics } from "./clinics";
import { seedDrugFormulary } from "./formulary";
import { seedLmsReference } from "./lms";
import { buildMeasurementsFor } from "./measurements";
import { buildMilestones } from "./milestones";
import { seedNeonatalFormulary } from "./neonatal-formulary";
import { buildPatients } from "./patients";
import { buildPrescriptions } from "./prescriptions";
import { ensureAdminUser } from "./user";
import { buildVaccinations } from "./vaccinations";
import { buildVisits } from "./visits";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is not set");

async function main() {
	console.log(
		"🌱 Starting Egyptian Pediatric Growth Tracker & Formulary seed…\n"
	);

	// Safety guard for full reset
	if (process.env.SEED_RESET === "true") {
		console.log("⚠️  SEED_RESET=true → truncating tables…");
		await db.execute(sql`
			TRUNCATE TABLE
    audit_log, certificates, prescriptions, milestones,
    vaccinations, measurements, visits, appointments,
    patients, clinics, vaccine_catalog, milestone_catalog,
    lms_reference,                                  -- ← ADD
    "session", "account", "user"
RESTART IDENTITY CASCADE
		`);
	}

	// 1. Admin User (DrHazem - clinysmart@gmail.com)
	console.log("→ Seeding Admin User (DrHazem)…");
	const adminUser = await ensureAdminUser(db);
	const adminId = adminUser.id;
	console.log(
		`   ✓ Admin user ready: ${adminUser.name} (${adminUser.email}) [id: ${adminId}, role: ${adminUser.role}]`
	);

	// 2. Clinics
	console.log("→ Seeding clinics…");
	const clinics = buildClinics();
	for (const c of clinics) {
		await db.insert(schema.clinics).values(c).onConflictDoNothing();
	}

	// 3. Catalogs (no FK — can be re-run anytime)
	console.log("→ Seeding vaccine_catalog…");
	const vaccines = buildVaccineCatalog();
	for (const v of vaccines) {
		await db
			.insert(schema.vaccineCatalog)
			.values(v)
			.onConflictDoUpdate({ target: schema.vaccineCatalog.id, set: v });
	}

	console.log("→ Seeding milestone_catalog…");
	const milestonesCat = buildMilestoneCatalog();
	for (const m of milestonesCat) {
		await db
			.insert(schema.milestoneCatalog)
			.values(m)
			.onConflictDoUpdate({ target: schema.milestoneCatalog.id, set: m });
	}

	// ── Drug formulary (Egyptian National Drug Formulary) ────────────
	console.log("→ Seeding drug_formulary (EDA monographs)…");
	await seedDrugFormulary(db);

	console.log("→ Seeding neonatal_formulary (NICU cheat sheet)…"); // ← ADD
	await seedNeonatalFormulary(db);
	// ── LMS reference data ───────────────────────────────────────────
	console.log("→ Seeding lms_reference (Egyptian growth standards)…");
	await seedLmsReference(db);

	// 4. Patients
	console.log("→ Seeding patients…");
	const patients = buildPatients(adminId);
	for (const p of patients) {
		await db.insert(schema.patients).values(p).onConflictDoNothing();
	}

	// 5. Appointments & Visits
	console.log("→ Seeding appointments…");
	const appointments = buildAppointments(adminId);
	for (const a of appointments) {
		await db.insert(schema.appointments).values(a).onConflictDoNothing();
	}

	console.log("→ Seeding clinical visits…");
	const visits = buildVisits(adminId);
	for (const v of visits) {
		await db.insert(schema.visits).values(v).onConflictDoNothing();
	}

	// 6. Measurements (Z-scores computed inline from Egyptian LMS standards)
	console.log("→ Seeding measurements (computing Egyptian LMS Z-scores)…");
	for (const patient of patients) {
		if (!patient.id) continue;
		const ms = buildMeasurementsFor(
			{
				id: patient.id,
				gender: patient.gender
			},
			adminId
		);
		if (ms.length === 0) continue;
		for (const m of ms) {
			await db.insert(schema.measurements).values(m).onConflictDoNothing();
		}
		console.log(
			`   ✓ ${ms.length} measurements calculated for ${patient.name}`
		);
	}

	// 7. Vaccinations
	console.log("→ Seeding vaccinations…");
	const vax = buildVaccinations(adminId);
	for (const v of vax) {
		await db.insert(schema.vaccinations).values(v).onConflictDoNothing();
	}

	// 8. Milestones
	console.log("→ Seeding milestone records…");
	const ml = buildMilestones(adminId);
	for (const m of ml) {
		await db.insert(schema.milestones).values(m).onConflictDoNothing();
	}

	// 9. Prescriptions (using Egyptian National Formulary & Neonatal Drugs)
	console.log("→ Seeding prescriptions (from Egyptian Drug Formularies)…");
	const rx = buildPrescriptions(adminId);
	for (const r of rx) {
		await db.insert(schema.prescriptions).values(r).onConflictDoNothing();
	}

	// 10. Verify record counts
	const counts = await Promise.all([
		db.select({ c: sql<number>`count(*)` }).from(schema.user),
		db.select({ c: sql<number>`count(*)` }).from(schema.clinics),
		db.select({ c: sql<number>`count(*)` }).from(schema.patients),
		db.select({ c: sql<number>`count(*)` }).from(schema.appointments),
		db.select({ c: sql<number>`count(*)` }).from(schema.visits),
		db.select({ c: sql<number>`count(*)` }).from(schema.measurements),
		db.select({ c: sql<number>`count(*)` }).from(schema.vaccinations),
		db.select({ c: sql<number>`count(*)` }).from(schema.milestones),
		db.select({ c: sql<number>`count(*)` }).from(schema.prescriptions),
		db.select({ c: sql<number>`count(*)` }).from(schema.vaccineCatalog),
		db.select({ c: sql<number>`count(*)` }).from(schema.milestoneCatalog),
		db.select({ c: sql<number>`count(*)` }).from(schema.lmsReference),
		db.select({ c: sql<number>`count(*)` }).from(schema.drugFormulary),
		db.select({ c: sql<number>`count(*)` }).from(schema.neonatalFormulary)
	]);

	console.log("\n✅ Egyptian Pediatric Tracker & Formulary Seed Complete:");
	console.table({
		users: counts[0][0].c,
		clinics: counts[1][0].c,
		patients: counts[2][0].c,
		appointments: counts[3][0].c,
		visits: counts[4][0].c,
		measurements: counts[5][0].c,
		vaccinations: counts[6][0].c,
		milestones: counts[7][0].c,
		prescriptions: counts[8][0].c,
		vaccine_catalog: counts[9][0].c,
		milestone_catalog: counts[10][0].c,
		lms_reference: counts[11][0].c,
		drug_formulary: counts[12][0].c,
		neonatal_formulary: counts[13][0].c
	});

	await closeConnection();
}

main().catch(err => {
	console.error("❌ Seed failed:", err);
	process.exit(1);
});
