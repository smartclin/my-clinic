// Src/lib/auth/test-guard.ts
// Imported by __root.tsx. Does nothing unless E2E_TEST_MODE is on.
export function getTestSession(): { user: Record<string, unknown> } | null {
	if (typeof globalThis === "undefined") {
		return null;
	}
	const g = globalThis as {
		__E2E_SESSION__?: unknown;
		process?: { env?: Record<string, string | undefined> };
	};
	if (g.process?.env?.["E2E_TEST_MODE"] !== "true") {
		return null;
	}
	const s = g.__E2E_SESSION__;
	return s && typeof s === "object"
		? (s as { user: Record<string, unknown> })
		: null;
}
