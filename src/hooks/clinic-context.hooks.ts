// lib/stores/clinic-context.hooks.ts

import { useSelector } from "@tanstack/react-store";

import { clinicContextStore } from "#/stores/context.ts";

export const useActiveClinicId = () =>
	useSelector(clinicContextStore, state => state.activeClinicId);

export const useActivePatientId = () =>
	useSelector(clinicContextStore, state => state.activePatientId);

export const useDateRange = () =>
	useSelector(clinicContextStore, state => state.dateRange);

export const useClinicContext = () =>
	useSelector(clinicContextStore, state => state);
