import { drizzleAdapter } from "@better-auth/drizzle-adapter/relations-v2";
import { APIError, betterAuth } from "better-auth";
import {
	admin as adminPlugin,
	customSession,
	magicLink,
	multiSession as multiSessionPlugin,
	openAPI as openAPIPlugin,
	organization,
	type Role,
	twoFactor,
	username as usernamePlugin
} from "better-auth/plugins";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import dotenv from "dotenv";
import { eq } from "drizzle-orm";

import { db } from "#/db/index.ts";
import * as schema from "@/db/schema";
import { env } from "@/env";

import { ac, roles } from "./permissions";
import {
	EMAIL_REGEX,
	getCachedRole,
	setCachedRole,
	sweepRoleCache
} from "./utils";

dotenv.config({ path: [".env.local", ".env"] });

/**
 * Role cache sweep. Runs every 60s to evict expired entries. Lazy expiry
 * (inside `getCachedRole`) already handles correctness; this is just a
 * memory hygiene timer. `.unref()` so it doesn't keep the process alive.
 */
const ROLE_CACHE_SWEEP_MS = 60_000;
setInterval(sweepRoleCache, ROLE_CACHE_SWEEP_MS).unref?.();

export function createAuth() {
	return betterAuth({
		account: {
			accountLinking: {
				enabled: true,
				trustedProviders: ["github"]
			},
			encryptOAuthTokens: true
		},

		advanced: {
			cookiePrefix: "auth",
			crossSubDomainCookies: {
				domain:
					process.env.NODE_ENV === "production" ? ".clinic.com" : "localhost",
				enabled: true
			},
			database: {
				defaultFindManyLimit: 50,
				generateId: "uuid",
				joins: true
			},
			defaultCookieAttributes: {
				httpOnly: true,
				// "none" + secure only works on HTTPS or localhost. In dev,
				// "lax" avoids the secure-cookie edge cases entirely.
				sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
				secure: process.env.NODE_ENV === "production"
			},
			useSecureCookies: process.env.NODE_ENV === "production"
		},
		baseURL: env.BETTER_AUTH_URL,
		database: drizzleAdapter(db, {
			provider: "pg",
			schema
		}),

		databaseHooks: {
			user: {
				create: {
					before: async user => {
						const email = user.email.trim().toLowerCase();
						if (!EMAIL_REGEX.test(email)) {
							throw new APIError("BAD_REQUEST", {
								message: "Invalid email format"
							});
						}
						return {
							data: {
								...user,
								email,
								name: user.name.trim() || "Unnamed User",
								// Preserve an explicit role (admin-created users).
								// Only default when the caller didn't set one —
								// The previous version hard-coded "patient",
								// Which silently broke admin.createUser.
								role: user["role"] ?? "patient"
							}
						};
					}
				}
			}
		},
		emailAndPassword: {
			enabled: true,
			minPasswordLength: 8,
			maxPasswordLength: 128,
			requireEmailVerification: process.env.NODE_ENV === "production"
		},
		logger: {
			disabled: false,
			level: process.env.NODE_ENV === "production" ? "error" : "info"
		},
		plugins: [
			adminPlugin({
				ac,
				adminRoles: ["admin"],
				defaultRole: "patient",
				roles
			}),
			multiSessionPlugin(),
			openAPIPlugin(),
			usernamePlugin(),
			twoFactor(),

			customSession(async ({ user, session }) => {
				// Read the role from cache first. The cache is swept by a
				// Timer (see top of file); expired entries are also evicted
				// Lazily inside `getCachedRole`. Do NOT clear the whole
				// Cache here — that would defeat the point.
				let dbUser = getCachedRole(user.id);

				if (!dbUser) {
					const [row] = await db
						.select({
							banExpires: schema.user.banExpires,
							banReason: schema.user.banReason, // ← add
							banned: schema.user.banned, // ← add
							clinicId: schema.user.clinicId,
							role: schema.user.role
						})
						.from(schema.user)
						.where(eq(schema.user.id, user.id))
						.limit(1);

					if (row?.role) {
						dbUser = {
							banExpires: null,
							banReason: null,
							banned: false,
							clinicId: row.clinicId ?? null,
							role: row.role
						};
						setCachedRole(
							user.id,
							row.role,
							row.clinicId ?? null,
							dbUser.banned,
							dbUser.banReason,
							dbUser.banExpires
						);
					}
				}

				// Narrow to the role union. `?? "patient"` matches the DB
				// Default; `as Role` is safe because the cache only stores
				// Values validated against `USER_ROLES`.
				const role: Role = (dbUser?.role as unknown as Role) ?? "patient";

				return {
					session,
					user: {
						...user,
						banExpires: dbUser?.banExpires ?? null,
						banReason: dbUser?.banReason ?? null,
						banned: dbUser?.banned ?? false,
						clinicId: dbUser?.clinicId ?? null,
						role
					}
				};
			}),

			magicLink({
				sendMagicLink: ({ email, url }) => {
					console.warn({ email, msg: "Magic link dispatched" });
					if (process.env.NODE_ENV !== "production") {
						console.warn({
							msg: "Dev-mode magic link available",
							urlLength: url.length
						});
					}
				}
			}),

			organization({
				ac,
				dynamicAccessControl: { enabled: true },
				roles
			}),

			tanstackStartCookies()
		],
		rateLimit: {
			modelName: "rateLimit",
			storage: "database"
		},
		secret: env.BETTER_AUTH_SECRET,
		session: {
			cookieCache: {
				enabled: true,
				maxAge: 60
			},
			expiresIn: 60 * 60 * 24 * 7,
			storeSessionInDatabase: true,
			updateAge: 60 * 60 * 24
		},
		telemetry: { enabled: false },
		trustedOrigins: [
			...new Set(
				[env.CORS_ORIGIN, env.VITE_WEB_URL, env.VITE_SERVER_URL].filter(
					(v): v is string => Boolean(v)
				)
			)
		],
		user: {
			additionalFields: {
				address: { input: true, required: false, type: "string" },
				apiKey: { input: false, required: false, type: "string" },
				clinicId: {
					input: false,
					required: false,
					type: "string"
				},
				phone: { input: true, required: false, type: "string" },
				role: {
					defaultValue: "patient",
					input: false,
					required: true,
					// `required: true` + `defaultValue` makes `session.user.role`
					// A required `Role` in the inferred type — no casts needed
					// Downstream. The DB column stays nullable for safety.
					type: ["doctor", "admin", "patient", "staff"]
				}
			},
			deleteUser: {
				beforeDelete: async user => {
					const [fullUser] = await db
						.select({ role: schema.user.role })
						.from(schema.user)
						.where(eq(schema.user.id, user.id))
						.limit(1);

					if (fullUser?.role?.toLowerCase() === "doctor") {
						const hasPatients = await db
							.select({ id: schema.patients.id })
							.from(schema.patients)
							.where(eq(schema.patients.ownerId, user.id))
							.limit(1)
							.then(rows => rows.length > 0);

						if (hasPatients) {
							throw new APIError("BAD_REQUEST", {
								message: "Doctor has active patients and cannot be deleted"
							});
						}
					}
				},
				enabled: true
			}
		}
	});
}

const auth = createAuth();

/**
 * The base session shape, as inferred by Better Auth. `user.role` is a
 * literal union, `user.clinicId` is `string | null`.
 *
 * Note: this reflects the shape **after** `customSession` normalization
 * because `customSession` is registered as a plugin and Better Auth
 * merges plugin contributions into `$Infer`.
 */
export type Session = typeof auth.$Infer.Session;
export type AuthUser = Session["user"];

/**
 * Public `Role` alias. Re-exported from the schema module so there is
 * exactly ONE source of truth. Do not re-declare the union here.
 */

export { auth };
