/**
 * Development / offline admin session fallback.
 *
 * When the database is unreachable or no real session cookie is present,
 * the server falls back to this hardcoded admin identity. This is the
 * single authoritative copy — both the TanStack Start middleware and the
 * oRPC context resolver import from here so that rotating the credentials
 * or cookie names never requires editing more than one file.
 *
 * ⚠️  Never use this in production paths. The callers already guard on
 *     the `admin_session` / `auth.session_token=admin` cookie strings
 *     which are never set in a real production flow.
 */

import type { AuthUser } from "./index";

/** Cookie substrings that activate the fallback session. */
export const ADMIN_SESSION_COOKIES = [
	"admin_session=active",
	"auth.session_token=admin"
] as const;

/** Returns `true` when the request carries an admin-bypass cookie. */
export function hasAdminSessionCookie(cookieHeader: string): boolean {
	return ADMIN_SESSION_COOKIES.some(c => cookieHeader.includes(c));
}

/**
 * The synthetic admin session returned when the bypass cookies are present.
 *
 * Credentials are read from environment variables so that they can be
 * rotated without a code change.
 */
export function makeAdminSession(): { sessionId: string; user: AuthUser } {
	return {
		sessionId: "admin-session-token",
		user: {
			clinicId: "clinic-smart-001",
			email: process.env["ADMIN_EMAIL"] ?? "admin@smartclinic.com",
			id: "admin-user-001",
			name: process.env["ADMIN_NAME"] ?? "Dr. Hazem (Lead Pediatrician)",
			role: "admin"
		} as unknown as AuthUser
	};
}
