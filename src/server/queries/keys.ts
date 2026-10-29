// src/api/client/queries/keys.ts
//
// Centralized query keys. Every `queryOptions` in this folder builds its
// `queryKey` from one of these factories, and every mutation invalidates
// the *smallest* prefix that covers its effect. Never call
// `queryClient.invalidateQueries()` with no filter.
//
// Prefix rules:
//   patients.all          ⊃ patients.list         (all patient lists)
//   patients.all          ⊃ patients.detail(id)   (one patient)
//   patients.detail(id)   ⊃ patients.visits(id)
//   patients.detail(id)   ⊃ patients.measurements(id)
//   patients.detail(id)   ⊃ patients.vaccinations(id)
//   ...

export const queryKeys = {
	// ── Auth ───────────────────────────────────────────────────────────────
	auth: {
		all: ["auth"] as const,
		user: () => [...queryKeys.auth.all, "user"] as const
	},

	// ── Clinics ────────────────────────────────────────────────────────────
	clinics: {
		all: ["clinics"] as const,
		list: () => [...queryKeys.clinics.all, "list"] as const,
		search: (query: string) =>
			[...queryKeys.clinics.all, "search", query] as const,
		detail: (id: string) => [...queryKeys.clinics.all, "detail", id] as const,
		details: (id: string) => [...queryKeys.clinics.all, "details", id] as const,
		counts: () => [...queryKeys.clinics.all, "patient-counts"] as const
	},

	// ── Patients ───────────────────────────────────────────────────────────
	patients: {
		all: ["patients"] as const,
		list: (filters: { clinicId?: string; ownerId?: string; gender?: string }) =>
			[...queryKeys.patients.all, "list", filters] as const,
		paginated: (ownerId: string, limit: number, cursor?: unknown) =>
			[...queryKeys.patients.all, "paginated", ownerId, limit, cursor] as const,
		search: (ownerId: string, query: string) =>
			[...queryKeys.patients.all, "search", ownerId, query] as const,
		detail: (id: string) => [...queryKeys.patients.all, "detail", id] as const,
		fullRecord: (id: string) =>
			[...queryKeys.patients.all, "full-record", id] as const,
		stunted: (ownerId: string) =>
			[...queryKeys.patients.all, "stunted", ownerId] as const,
		overdueVaccines: (ownerId: string) =>
			[...queryKeys.patients.all, "overdue-vaccines", ownerId] as const
	},

	// ── Appointments ───────────────────────────────────────────────────────
	appointments: {
		all: ["appointments"] as const,
		byPatient: (patientId: string, status?: string) =>
			[...queryKeys.appointments.all, "patient", patientId, status] as const,
		byClinic: (clinicId: string, from: string, to: string) =>
			[...queryKeys.appointments.all, "clinic", clinicId, from, to] as const,
		byDoctor: (doctorId: string, clinicId: string, from: string, to: string) =>
			[
				...queryKeys.appointments.all,
				"doctor",
				doctorId,
				clinicId,
				from,
				to
			] as const,
		today: (clinicId: string) =>
			[...queryKeys.appointments.all, "today", clinicId] as const,
		upcoming: (doctorId: string, clinicId: string) =>
			[...queryKeys.appointments.all, "upcoming", doctorId, clinicId] as const,
		noShow: (clinicId: string) =>
			[...queryKeys.appointments.all, "no-show", clinicId] as const,
		detail: (id: string) =>
			[...queryKeys.appointments.all, "detail", id] as const,
		statusCounts: (
			doctorId: string,
			clinicId: string,
			from: string,
			to: string
		) =>
			[
				...queryKeys.appointments.all,
				"status-counts",
				doctorId,
				clinicId,
				from,
				to
			] as const
	},

	// ── Visits ─────────────────────────────────────────────────────────────
	visits: {
		all: ["visits"] as const,
		byPatient: (patientId: string) =>
			[...queryKeys.visits.all, "patient", patientId] as const,
		byClinic: (clinicId: string, from: string, to: string) =>
			[...queryKeys.visits.all, "clinic", clinicId, from, to] as const,
		byDoctor: (doctorId: string, from: string, to: string) =>
			[...queryKeys.visits.all, "doctor", doctorId, from, to] as const,
		byAppointment: (appointmentId: string) =>
			[...queryKeys.visits.all, "appointment", appointmentId] as const,
		dailyCounts: (clinicId: string, from: string, to: string) =>
			[...queryKeys.visits.all, "daily-counts", clinicId, from, to] as const,
		detail: (id: string) => [...queryKeys.visits.all, "detail", id] as const
	},

	// ── Measurements ───────────────────────────────────────────────────────
	measurements: {
		all: ["measurements"] as const,
		byPatient: (patientId: string) =>
			[...queryKeys.measurements.all, "patient", patientId] as const,
		inRange: (patientId: string, from: string, to: string) =>
			[...queryKeys.measurements.all, "range", patientId, from, to] as const,
		latest: (patientId: string) =>
			[...queryKeys.measurements.all, "latest", patientId] as const,
		byDate: (patientId: string, date: string) =>
			[...queryKeys.measurements.all, "date", patientId, date] as const,
		recent: (ownerId: string, limit: number) =>
			[...queryKeys.measurements.all, "recent", ownerId, limit] as const,
		stunted: (ownerId: string) =>
			[...queryKeys.measurements.all, "stunted", ownerId] as const,
		chartPoints: (patientId: string, metric: string) =>
			[
				...queryKeys.measurements.all,
				"chart-points",
				patientId,
				metric
			] as const,
		// Growth-specific (subkeys under `series` / `flagged` so
		// growthChart.queries.ts and measurements.queries.ts stay in sync)
		series: (patientId: string, indicator: string) =>
			[...queryKeys.measurements.all, "series", patientId, indicator] as const,
		flagged: (patientId: string, zThreshold: number) =>
			[...queryKeys.measurements.all, "flagged", patientId, zThreshold] as const
	},

	// ── Growth chart (reference data) ─────────────────────────────────────
	growth: {
		all: ["growth"] as const,
		curves: (request: { indicator: string; sex: string; range: unknown }) =>
			[...queryKeys.growth.all, "curves", request] as const,
		band: (request: {
			indicator: string;
			sex: string;
			range: unknown;
			x: number;
		}) => [...queryKeys.growth.all, "band", request] as const
	},

	// ── Vaccine catalog ────────────────────────────────────────────────────
	vaccineCatalog: {
		all: ["vaccine-catalog"] as const,
		list: () => [...queryKeys.vaccineCatalog.all, "list"] as const,
		mandatory: () => [...queryKeys.vaccineCatalog.all, "mandatory"] as const,
		detail: (id: string) =>
			[...queryKeys.vaccineCatalog.all, "detail", id] as const
	},

	// ── Vaccinations ───────────────────────────────────────────────────────
	vaccinations: {
		all: ["vaccinations"] as const,
		byPatient: (patientId: string) =>
			[...queryKeys.vaccinations.all, "patient", patientId] as const,
		byStatus: (patientId: string, status: string) =>
			[...queryKeys.vaccinations.all, "status", patientId, status] as const,
		record: (patientId: string, vaccineId: string) =>
			[...queryKeys.vaccinations.all, "record", patientId, vaccineId] as const,
		overdue: (ownerId: string) =>
			[...queryKeys.vaccinations.all, "overdue", ownerId] as const,
		upcoming: (patientId: string, daysAhead: number) =>
			[
				...queryKeys.vaccinations.all,
				"upcoming",
				patientId,
				daysAhead
			] as const,
		coverage: (patientId: string) =>
			[...queryKeys.vaccinations.all, "coverage", patientId] as const
	},

	// ── Milestone catalog ──────────────────────────────────────────────────
	milestoneCatalog: {
		all: ["milestone-catalog"] as const,
		list: () => [...queryKeys.milestoneCatalog.all, "list"] as const,
		byDomain: (domain: string) =>
			[...queryKeys.milestoneCatalog.all, "domain", domain] as const,
		detail: (id: string) =>
			[...queryKeys.milestoneCatalog.all, "detail", id] as const
	},

	// ── Milestones ─────────────────────────────────────────────────────────
	milestones: {
		all: ["milestones"] as const,
		byPatient: (patientId: string) =>
			[...queryKeys.milestones.all, "patient", patientId] as const,
		achieved: (patientId: string) =>
			[...queryKeys.milestones.all, "achieved", patientId] as const,
		byDomain: (patientId: string, domain: string) =>
			[...queryKeys.milestones.all, "domain", patientId, domain] as const,
		delayed: (ownerId: string, currentAgeMonths: number) =>
			[
				...queryKeys.milestones.all,
				"delayed",
				ownerId,
				currentAgeMonths
			] as const
	},

	// ── Prescriptions ──────────────────────────────────────────────────────
	prescriptions: {
		all: ["prescriptions"] as const,
		byPatient: (patientId: string) =>
			[...queryKeys.prescriptions.all, "patient", patientId] as const,
		active: (patientId: string) =>
			[...queryKeys.prescriptions.all, "active", patientId] as const,
		inRange: (patientId: string, from: string, to: string) =>
			[...queryKeys.prescriptions.all, "range", patientId, from, to] as const,
		detail: (id: string) =>
			[...queryKeys.prescriptions.all, "detail", id] as const
	},

	// ── Certificates ───────────────────────────────────────────────────────
	certificates: {
		all: ["certificates"] as const,
		byPatient: (patientId: string) =>
			[...queryKeys.certificates.all, "patient", patientId] as const,
		detail: (id: string) =>
			[...queryKeys.certificates.all, "detail", id] as const
	},

	// ── Audit log ──────────────────────────────────────────────────────────
	auditLog: {
		all: ["audit-log"] as const,
		mine: (limit: number) =>
			[...queryKeys.auditLog.all, "mine", limit] as const,
		forEntity: (entityType: string, entityId: string) =>
			[...queryKeys.auditLog.all, "entity", entityType, entityId] as const,
		backupHistory: () => [...queryKeys.auditLog.all, "backup-history"] as const,
		detail: (id: string) => [...queryKeys.auditLog.all, "detail", id] as const
	},

	// ── Cross-table (dashboard) ────────────────────────────────────────────
	crossTable: {
		all: ["cross-table"] as const,
		patientDashboard: (patientId: string) =>
			[...queryKeys.crossTable.all, "dashboard", patientId] as const,
		measurementTimeline: (patientId: string) =>
			[...queryKeys.crossTable.all, "timeline", patientId] as const,
		growthSummary: (patientId: string) =>
			[...queryKeys.crossTable.all, "growth-summary", patientId] as const
	}
} as const;
