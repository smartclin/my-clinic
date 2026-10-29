import { z } from "zod";

/**
 * Canonical role vocabulary.
 *
 * ⚠️ This is the single source of truth for user roles. `schemas/enums.ts`
 * re-exports `USER_ROLES` and `userRoleSchema` from here — do NOT define a
 * second list there. Two enums with the same members but different order
 * are structurally identical but nominally distinct under TypeScript, and
 * `UserRole`/`Role` would stop being assignable to each other.
 */
export const USER_ROLES = ["admin", "doctor", "patient", "staff"] as const;

export const userRoleSchema = z.enum(USER_ROLES);
export type Role = z.infer<typeof userRoleSchema>;

export const rolesMapSchema = z.record(z.string(), userRoleSchema);
export type RolesMap = z.infer<typeof rolesMapSchema>;

export const ROLES_MAP = {
	ADMIN: "admin",
	DOCTOR: "doctor",
	PATIENT: "patient",
	STAFF: "staff"
} as const satisfies RolesMap;

// export const DEFAULT_ROLE: Role = "doctor";
// export const ADMIN_ROLES: Role[] = ["admin"];
