// src/components/growth/growthStore.ts
//
// Per-patient UI state for the growth panel. One store instance per
// patientId so two patients opened in two tabs do not share indicator /
// timeframe state.
//
// Pattern: a Map<patientId, Store>. The `use*` hooks resolve the store
// lazily and subscribe with `useSelector`. Actions are built from the
// same store so they are safe to put in dependency arrays.

import { createStore, useSelector } from "@tanstack/react-store";
import { useMemo } from "react";

import type { TimeframeOption } from "@/lib/growth/chartConfig";
import type { GrowthIndicator } from "@/lib/growth/lms-types";

export interface GrowthPanelState {
	indicator: GrowthIndicator;
	flaggedOnly: boolean;
	formOpen: boolean;
	timeframe: TimeframeOption;
}

const DEFAULT_STATE: Readonly<GrowthPanelState> = Object.freeze({
	flaggedOnly: false,
	formOpen: false,
	indicator: "weight-for-age",
	timeframe: "0-5"
});

type GrowthStore = ReturnType<typeof createGrowthStore>;

function createGrowthStore() {
	return createStore<GrowthPanelState>({ ...DEFAULT_STATE });
}

// Map<patientId, store>. Module-level so re-mounts of the panel reuse the
// same store (preserves the user's selected tab / timeframe).
const stores = new Map<string, GrowthStore>();

function getGrowthStore(patientId: string): GrowthStore {
	let store = stores.get(patientId);
	if (!store) {
		store = createGrowthStore();
		stores.set(patientId, store);
	}
	return store;
}

// ── Hooks (one per slice) ───────────────────────────────────────────────

export function useGrowthIndicator(patientId: string): GrowthIndicator {
	return useSelector(getGrowthStore(patientId), s => s.indicator);
}

export function useGrowthFlaggedOnly(patientId: string): boolean {
	return useSelector(getGrowthStore(patientId), s => s.flaggedOnly);
}

export function useGrowthFormOpen(patientId: string): boolean {
	return useSelector(getGrowthStore(patientId), s => s.formOpen);
}

export function useGrowthTimeframe(patientId: string): TimeframeOption {
	return useSelector(getGrowthStore(patientId), s => s.timeframe);
}

// ── Actions ─────────────────────────────────────────────────────────────

export interface GrowthActions {
	setIndicator: (indicator: GrowthIndicator) => void;
	setFlaggedOnly: (flaggedOnly: boolean) => void;
	setFormOpen: (formOpen: boolean) => void;
	setTimeframe: (timeframe: TimeframeOption) => void;
	reset: () => void;
}

function makeGrowthActions(store: GrowthStore): GrowthActions {
	return {
		reset: () => {
			store.setState(() => ({ ...DEFAULT_STATE }));
		},
		setFlaggedOnly: flaggedOnly => {
			store.setState(s => ({ ...s, flaggedOnly }));
		},
		setFormOpen: formOpen => {
			store.setState(s => ({ ...s, formOpen }));
		},
		setIndicator: indicator => {
			store.setState(s => ({ ...s, indicator }));
		},
		setTimeframe: timeframe => {
			store.setState(s => ({ ...s, timeframe }));
		}
	};
}

export function useGrowthActions(patientId: string): GrowthActions {
	const store = getGrowthStore(patientId);
	// Stable per store instance — safe in dependency arrays.
	return useMemo(() => makeGrowthActions(store), [store]);
}
