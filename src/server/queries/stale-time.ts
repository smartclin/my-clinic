// src/api/client/queries/stale-time.ts
export const STALE = {
	STATIC: Number.POSITIVE_INFINITY,
	PATIENT_DEMOGRAPHICS: 5 * 60 * 1000,
	LIST: 2 * 60 * 1000,
	DETAIL: 60 * 1000,
	ENCOUNTERS: 30 * 1000,
	GROWTH: 60 * 1000,
	PRESCRIPTION: 30 * 1000,
	DASHBOARD: 60 * 1000
} as const;
