// src/api/client/queries/measurements.queries.ts

import { queryOptions } from "@tanstack/react-query";

import {
	$findLatestMeasurement,
	$findMeasurementByDate,
	$getChartPoints,
	$listMeasurementsByPatient,
	$listMeasurementsInRange,
	$listMyRecentMeasurements,
	$listMyStuntedMeasurements
} from "@/server/functions";

import { queryKeys } from "./keys";
import { STALE } from "./stale-time";

export const measurementsByPatientQueryOptions = (patientId: string) =>
	queryOptions({
		queryFn: () => $listMeasurementsByPatient({ data: { patientId } }),
		queryKey: queryKeys.measurements.byPatient(patientId),
		staleTime: STALE.GROWTH
	});

export const measurementsInRangeQueryOptions = (
	patientId: string,
	from: string,
	to: string
) =>
	queryOptions({
		queryFn: () => $listMeasurementsInRange({ data: { patientId, from, to } }),
		queryKey: queryKeys.measurements.inRange(patientId, from, to),
		staleTime: STALE.GROWTH
	});

export const latestMeasurementQueryOptions = (patientId: string) =>
	queryOptions({
		queryFn: () => $findLatestMeasurement({ data: { patientId } }),
		queryKey: queryKeys.measurements.latest(patientId),
		staleTime: STALE.ENCOUNTERS
	});

export const measurementByDateQueryOptions = (
	patientId: string,
	date: string
) =>
	queryOptions({
		enabled: date.length > 0,
		queryFn: () => $findMeasurementByDate({ data: { patientId, date } }),
		queryKey: queryKeys.measurements.byDate(patientId, date),
		staleTime: STALE.ENCOUNTERS
	});

export const myRecentMeasurementsQueryOptions = (limit = 10) =>
	queryOptions({
		queryFn: () => $listMyRecentMeasurements({ data: { limit } }),
		queryKey: queryKeys.measurements.recent("me", limit),
		staleTime: STALE.DASHBOARD
	});

export const myStuntedMeasurementsQueryOptions = () =>
	queryOptions({
		queryFn: () => $listMyStuntedMeasurements(),
		queryKey: queryKeys.measurements.stunted("me"),
		staleTime: STALE.DASHBOARD
	});

export const chartPointsQueryOptions = (
	patientId: string,
	metric: "weight" | "height" | "bmi" | "headCircumference"
) =>
	queryOptions({
		queryFn: () => $getChartPoints({ data: { metric, patientId } }),
		queryKey: queryKeys.measurements.chartPoints(patientId, metric),
		staleTime: STALE.GROWTH
	});
