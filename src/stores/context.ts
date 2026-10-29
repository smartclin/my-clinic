// lib/stores/clinic-context.ts (extract relevant part)

import { createStore } from "@tanstack/react-store";

import { resetClinicScopedCollections } from "#/db-collections/registry.ts";

export interface ClinicContextState {
	activeClinicId: string | null;
	activePatientId: string | null;
	dateRange: { from: string; to: string };
}

function defaultRange(): { from: string; to: string } {
	const today = new Date().toISOString().slice(0, 10);
	return { from: today, to: today };
}

export const clinicContextStore = createStore<ClinicContextState>({
	activeClinicId: null,
	activePatientId: null,
	dateRange: defaultRange()
});

export const clinicContextActions = {
	setClinic(clinicId: string | null) {
		const previous = clinicContextStore.state.activeClinicId;
		if (previous === clinicId) return;

		// Reset clinic-scoped collections *before* the store updates, so the
		// next read (usePatientsCollection() etc.) creates a fresh instance
		// keyed to the new clinic.
		resetClinicScopedCollections();

		clinicContextStore.setState(s => ({
			...s,
			activeClinicId: clinicId,
			activePatientId: null
		}));
	},

	setPatient(patientId: string | null) {
		clinicContextStore.setState(s => ({ ...s, activePatientId: patientId }));
	},

	setDateRange(range: { from: string; to: string }) {
		clinicContextStore.setState(s => ({ ...s, dateRange: range }));
	},

	reset() {
		resetClinicScopedCollections();
		clinicContextStore.setState(() => ({
			activeClinicId: null,
			activePatientId: null,
			dateRange: defaultRange()
		}));
	}
};
