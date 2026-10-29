// lib/auth/resolve.ts
//
// Single source of truth for "who is this request?".
//
// Every entry point — TanStack Start middleware, oRPC context, MCP context —
// calls `resolveAuth()` exactly once per request. Downstream code reads the
// normalized `ResolvedAuth` shape and adapts it to its own consumer if needed.
//
// Why not just call `auth.api.getSession` from each caller?
//   - Each call runs the customSession hook (a DB read for the role cache),
//     parses cookies, and verifies the session token.
//   - Multiple calls per request = multiple round-trips even with the
//     60s cookie cache warm.
//   - Auth logic (admin-cookie bypass, DB-offline fallback) is duplicated
//     three times and drifts whenever we touch it.

import { hasAdminSessionCookie, makeAdminSession } from "./admin-session";
import { type AuthUser, auth } from "./index";

/**
 * Normalized session shape consumed by all internal callers.
 *
 * Deliberately minimal: we carry only what downstream code needs.
 * `expiresAt` is the session's expiry (needed by some rate-limiters to
 * decide whether to refresh); `token` is the raw session token (used by
 * `auth.api.signOut` and any future session-revocation flow).
 */
export interface ResolvedAuth {
	sessionId: string;
	token: string;
	userId: string;
	expiresAt: Date;
	user: AuthUser;
}

/**
 * Resolve the current request's authentication.
 *
 * Order of resolution:
 *   1. Real Better Auth session (via cookie or bearer).
 *   2. Admin bypass cookie (dev / offline fallback).
 *   3. `null` — unauthenticated.
 *
 * Database failures are swallowed and fall through to step 2 — matches
 * the previous behavior where a dead DB still allowed the admin cookie
 * to work. Do not re-throw here; callers already distinguish null from
 * a thrown error via their own try/catch.
 *
 * `memoize` is a per-request memoization hook. Callers that might invoke
 * `resolveAuth` more than once per request (e.g. `getUser()` called from
 * a loader AND a route component) should pass a `Map`-backed memoizer
 * so the second call is a Map lookup, not another DB round-trip.
 */
export async function resolveAuth(
	request: Request,
	memoize?: Map<string, Promise<ResolvedAuth | null>>
): Promise<ResolvedAuth | null> {
	const cacheKey = "session";
	if (memoize) {
		const cached = memoize.get(cacheKey);
		if (cached) {
			return cached;
		}
	}

	const promise = resolveAuthUncached(request);
	memoize?.set(cacheKey, promise);
	return promise;
}

async function resolveAuthUncached(
	request: Request
): Promise<ResolvedAuth | null> {
	try {
		const result = await auth.api.getSession({ headers: request.headers });
		if (result?.user && result.session) {
			return {
				expiresAt: result.session.expiresAt,
				sessionId: result.session.id,
				token: result.session.token,
				user: result.user,
				userId: result.user.id
			};
		}
	} catch (err) {
		// DB offline — fall through to the admin-cookie bypass. Log so we
		// notice when production is silently running on the fallback.
		console.warn(
			"[auth] getSession failed, falling back to cookie check:",
			err
		);
	}

	const cookieHeader = request.headers.get("cookie") ?? "";
	if (hasAdminSessionCookie(cookieHeader)) {
		const admin = makeAdminSession();
		return {
			expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
			sessionId: admin.sessionId,
			token: admin.sessionId,
			user: admin.user,
			userId: admin.user.id
		};
	}

	return null;
}
