// src/db/seed/user.ts
import { eq } from "drizzle-orm";

import { auth } from "#/lib/auth/index.ts";

import type { DB } from "../index";
import * as schema from "../schema";

export const SEED_ADMIN_ID = "00000000-0000-4000-8000-0000000000a1";
export const CLINIC_HURGHADA_ID = "00000000-0000-4000-8000-000000000001";

const ADMIN_CONFIG = {
	id: SEED_ADMIN_ID,
	name: "DrHazem",
	email: "clinysmart@gmail.com",
	password: "HealthF@27",
	role: "admin" as const,
	clinicId: CLINIC_HURGHADA_ID,
	username: "drhazem",
	displayUsername: "DrHazem",
	clinicName: "Hurghada General Hospital — Pediatric Clinic",
	clinicPhone: "+20 65 344 0000",
	clinicAddress: "El Nasr St., Hurghada, Red Sea Governorate"
} as const;

type UserRow = typeof schema.user.$inferSelect;

// ── Clinic ───────────────────────────────────────────────────────────────

async function ensureClinic(db: DB) {
	const existing = await db.query.clinics.findFirst({
		where: { id: ADMIN_CONFIG.clinicId }
	});
	if (existing) return existing;

	const [created] = await db
		.insert(schema.clinics)
		.values({
			id: ADMIN_CONFIG.clinicId,
			name: ADMIN_CONFIG.clinicName,
			address: ADMIN_CONFIG.clinicAddress,
			phone: ADMIN_CONFIG.clinicPhone,
			email: ADMIN_CONFIG.email
		})
		.returning();

	console.info(`[seed] created clinic ${created.id}`);
	return created;
}

// ── Admin ────────────────────────────────────────────────────────────────

export async function ensureAdminUser(db: DB): Promise<UserRow> {
	const ctx = await auth.$context;
	const email = ADMIN_CONFIG.email.toLowerCase();

	// ── 1. Clinic ────────────────────────────────────────────────────────
	const clinic = await ensureClinic(db);

	// ── 2. Locate the admin row ──────────────────────────────────────────
	let userRow: UserRow | null =
		(await db.query.user.findFirst({
			where: { email }
		})) ??
		(await db.query.user.findFirst({
			where: { id: ADMIN_CONFIG.id }
		})) ??
		null;
	const hashedPassword = await ctx.password.hash(ADMIN_CONFIG.password);

	// ── 3. Create or heal ────────────────────────────────────────────────
	if (!userRow) {
		await auth.api.createUser({
			body: {
				email,
				name: ADMIN_CONFIG.name,
				password: ADMIN_CONFIG.password,
				role: ADMIN_CONFIG.role
			}
		});

		userRow =
			(await db.query.user.findFirst({
				where: { email }
			})) ?? null;

		if (!userRow) {
			throw new Error("[seed] auth.api.createUser did not persist a row");
		}

		const [updated] = await db
			.update(schema.user)
			.set({
				clinicId: clinic.id,
				emailVerified: true,
				username: ADMIN_CONFIG.username,
				displayUsername: ADMIN_CONFIG.displayUsername
			})
			.where(eq(schema.user.id, userRow.id))
			.returning();
		userRow = updated;

		console.info(`[seed] created admin ${email}`);
	} else {
		const needsUpdate =
			userRow.email !== email ||
			userRow.role !== ADMIN_CONFIG.role ||
			userRow.clinicId !== clinic.id ||
			userRow.emailVerified !== true ||
			userRow.username !== ADMIN_CONFIG.username ||
			userRow.displayUsername !== ADMIN_CONFIG.displayUsername;

		if (needsUpdate) {
			const [updated] = await db
				.update(schema.user)
				.set({
					email,
					role: ADMIN_CONFIG.role,
					clinicId: clinic.id,
					emailVerified: true,
					username: ADMIN_CONFIG.username,
					displayUsername: ADMIN_CONFIG.displayUsername
				})
				.where(eq(schema.user.id, userRow.id))
				.returning();
			userRow = updated;
			console.info(`[seed] healed admin fields for ${email}`);
		}
	}

	// ── 4. Credential account ────────────────────────────────────────────
	const existingAccount = await db.query.account.findFirst({
		where: {
			userId: userRow.id,
			providerId: "credential"
		}
	});

	if (!existingAccount) {
		await ctx.internalAdapter.linkAccount({
			userId: userRow.id,
			providerId: "credential",
			// Better Auth's signUpEmail writes `accountId: user.id`, not
			// `user.email`. signIn.email looks up by (userId, providerId),
			// so either value logs in — but keeping this consistent with
			// Better Auth's own writer avoids audit-trail surprises later.
			accountId: userRow.id,
			password: hashedPassword
		});
		console.info(`[seed] linked credential account for ${email}`);
	} else {
		const matches =
			existingAccount.password != null &&
			(await ctx.password.verify({
				hash: existingAccount.password,
				password: ADMIN_CONFIG.password
			}));

		if (!matches) {
			await db
				.update(schema.account)
				.set({ password: hashedPassword })
				.where(eq(schema.account.id, existingAccount.id));
			console.warn(
				`[seed] rotated admin password for ${email} (drift detected)`
			);
		}
	}

	// ── 5. Fail-loud verification ────────────────────────────────────────
	// Green seed must mean "login works", not just "INSERT succeeded".
	// If the auth config's password hasher changes across a deploy, this is
	// the line that catches it — otherwise QA discovers it at the login page.
	const stored = await db.query.account.findFirst({
		where: { userId: userRow.id, providerId: "credential" },
		columns: { password: true }
	});

	const verified =
		stored?.password != null &&
		(await ctx.password.verify({
			hash: stored.password,
			password: ADMIN_CONFIG.password
		}));

	if (!verified) {
		throw new Error(
			`[seed] credential verification failed for ${email}. ` +
				"The auth instance's password hasher likely changed — " +
				"check lib/auth/index.ts emailAndPassword.password."
		);
	}

	return userRow;
}
