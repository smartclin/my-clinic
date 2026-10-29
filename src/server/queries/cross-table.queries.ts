// src/api/client/queries/cross-table.queries.ts

import { queryOptions } from "@tanstack/react-query";

import {
	$getMeasurementTimeline,
	$getPatientDashboard,
	$getPatientGrowthSummary
} from "@/server/functions";

import { queryKeys } from "./keys";
import { STALE } from "./stale-time";

export const patientDashboardQueryOptions = (patientId: string) =>
	queryOptions({
		queryFn: () => $getPatientDashboard({ data: { patientId } }),
		queryKey: queryKeys.crossTable.patientDashboard(patientId),
		staleTime: STALE.DASHBOARD
	});

export const measurementTimelineQueryOptions = (patientId: string) =>
	queryOptions({
		queryFn: () => $getMeasurementTimeline({ data: { patientId } }),
		queryKey: queryKeys.crossTable.measurementTimeline(patientId),
		staleTime: STALE.GROWTH
	});

export const patientGrowthSummaryQueryOptions = (patientId: string) =>
	queryOptions({
		queryFn: () => $getPatientGrowthSummary({ data: { patientId } }),
		queryKey: queryKeys.crossTable.growthSummary(patientId),
		staleTime: STALE.GROWTH
	});
