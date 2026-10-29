// src/stores/ui-store.ts
//
// Global UI state for the clinic app shell. This store is deliberately
// narrow: it holds *only* cross-tree UI state (which modal is open, which
// tab is active, which patient is selected). Per-screen state stays in
// the component (useState) or in React Query.
//
// Why a TanStack Store and not React Context:
//   - Selector-based subscriptions (`useSelector(store, s => s.foo)`) mean
//     a component only re-renders when the slice it reads changes. Context
//     re-renders every consumer on every state change.
//   - The store is usable from non-React code (loaders, server fns, side
//     effects) — `uiStore.state.activeTab` works anywhere.
//   - It composes with TanStack Router's `beforeLoad` for redirect logic
//     without mounting a provider.

import { batch, createStore } from "@tanstack/store";

// ── Tab taxonomy ────────────────────────────────────────────────────────
// The tab list is the single source of truth. `ActiveTab` is derived from
// it, and the tab bar component imports `TABS` so adding a tab is a
// one-line change here.
export const TABS = [
	{ id: "patients", label: "Patients" },
	{ id: "immunizations", label: "Immunizations" },
	{ id: "medications", label: "Medications" },
	{ id: "prescriptions", label: "Prescriptions" }
] as const;

export type ActiveTab = (typeof TABS)[number]["id"];

// ── State shape ─────────────────────────────────────────────────────────
export interface UiState {
	selectedPatientId: string | null;
	activeTab: ActiveTab;
	isPatientModalOpen: boolean;
	isMeasurementModalOpen: boolean;
	isBackupModalOpen: boolean;
}

// Frozen so nothing can accidentally mutate the default in place.
const DEFAULT_STATE: Readonly<UiState> = Object.freeze({
	activeTab: "patients",
	isBackupModalOpen: false,
	isMeasurementModalOpen: false,
	isPatientModalOpen: false,
	selectedPatientId: null
});

export const uiStore = createStore<UiState>({ ...DEFAULT_STATE });

// ── Actions ─────────────────────────────────────────────────────────────
//
// Every action returns `void` and takes the minimum information it needs.
// No action reads `state` for a condition the caller could check — that
// leads to surprising side effects.
//
// Invariant enforced here:
//   - `openMeasurementModal()` throws if no patient is selected. The
//     measurement form cannot submit without a patient, so opening the
//     modal without one guarantees a broken submit path.
//
// Invariant enforced by convention in callers:
//   - `setSelectedPatient(null)` should close the measurement modal in
//     the same `batch()` call. The `clearSelectedPatient()` action does
//     this for you.

export const uiActions = {
	// ── Patient selection ────────────────────────────────────────────────
	setSelectedPatient(patientId: string | null) {
		uiStore.setState(s => ({ ...s, selectedPatientId: patientId }));
	},

	/**
	 * Clear the selected patient AND close any patient-scoped modal.
	 * Use this on sign-out, or when navigating back to the patient list.
	 *
	 * Batched so `useSelector` consumers see one transition, not two.
	 */
	clearSelectedPatient() {
		batch(() => {
			uiStore.setState(s => ({ ...s, selectedPatientId: null }));
			uiStore.setState(s => ({ ...s, isMeasurementModalOpen: false }));
		});
	},

	// ── Tabs ─────────────────────────────────────────────────────────────
	setActiveTab(tab: ActiveTab) {
		uiStore.setState(s => ({ ...s, activeTab: tab }));
	},

	// ── Patient modal ────────────────────────────────────────────────────
	openPatientModal() {
		uiStore.setState(s => ({ ...s, isPatientModalOpen: true }));
	},
	closePatientModal() {
		uiStore.setState(s => ({ ...s, isPatientModalOpen: false }));
	},

	// ── Measurement modal ────────────────────────────────────────────────
	/**
	 * Open the measurement modal. Requires a selected patient.
	 *
	 * @throws if `selectedPatientId` is null — the measurement form cannot
	 *   render a valid submission without it. Callers should guard, or
	 *   select a patient first.
	 */
	openMeasurementModal() {
		if (uiStore.state.selectedPatientId === null) {
			throw new Error(
				"openMeasurementModal called with no selected patient. " +
					"Call uiActions.setSelectedPatient(patientId) first."
			);
		}
		uiStore.setState(s => ({ ...s, isMeasurementModalOpen: true }));
	},
	closeMeasurementModal() {
		uiStore.setState(s => ({ ...s, isMeasurementModalOpen: false }));
	},

	// ── Backup modal ─────────────────────────────────────────────────────
	openBackupModal() {
		uiStore.setState(s => ({ ...s, isBackupModalOpen: true }));
	},
	closeBackupModal() {
		uiStore.setState(s => ({ ...s, isBackupModalOpen: false }));
	},

	// ── Bulk reset ───────────────────────────────────────────────────────
	/**
	 * Reset every field to the initial state. Called on sign-out and on
	 * clinic switch (the user should not carry one clinic's selected
	 * patient into the next clinic's session).
	 */
	reset() {
		uiStore.setState(() => ({ ...DEFAULT_STATE }));
	}
};

// ── Selectors ───────────────────────────────────────────────────────────
//
// Standalone selector functions rather than inline arrow functions at
// every call site. Two benefits:
//   1. `useSelector(uiStore, selectActiveTab)` is a stable callback, so
//      no re-subscribe on every render.
//   2. The selector name appears in React DevTools' Profiler as the
//      component's input, which is invaluable when the tree gets deep.

export const selectSelectedPatientId = (s: UiState) => s.selectedPatientId;
export const selectActiveTab = (s: UiState) => s.activeTab;
export const selectIsPatientModalOpen = (s: UiState) => s.isPatientModalOpen;
export const selectIsMeasurementModalOpen = (s: UiState) =>
	s.isMeasurementModalOpen;
export const selectIsBackupModalOpen = (s: UiState) => s.isBackupModalOpen;

// Convenience: is any modal open? Used by the shell to decide whether to
// trap keyboard shortcuts (Ctrl+K, etc.) so they don't fire while typing
// in a modal.
export const selectAnyModalOpen = (s: UiState) =>
	s.isPatientModalOpen || s.isMeasurementModalOpen || s.isBackupModalOpen;
