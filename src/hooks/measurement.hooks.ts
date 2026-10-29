import { useQuery } from "@tanstack/react-query";

import {
	chartPointsQueryOptions,
	latestMeasurementQueryOptions,
	measurementByDateQueryOptions,
	measurementsByPatientQueryOptions,
	measurementsInRangeQueryOptions,
	myRecentMeasurementsQueryOptions,
	myStuntedMeasurementsQueryOptions
} from "../server/queries/measurements.queries";

export function usePatientMeasurements(patientId: string) {
	return useQuery(measurementsByPatientQueryOptions(patientId));
}

export function useLatestMeasurement(patientId: string) {
	return useQuery(latestMeasurementQueryOptions(patientId));
}

export function useMeasurementsInRange(
	patientId: string,
	from: string,
	to: string
) {
	return useQuery(measurementsInRangeQueryOptions(patientId, from, to));
}

export function useMeasurementByDate(patientId: string, date: string) {
	return useQuery(measurementByDateQueryOptions(patientId, date));
}

export function useMyRecentMeasurements(limit = 10) {
	return useQuery(myRecentMeasurementsQueryOptions(limit));
}

export function useMyStuntedMeasurements() {
	return useQuery(myStuntedMeasurementsQueryOptions());
}

export function useChartPoints(
	patientId: string,
	metric: "weight" | "height" | "bmi" | "headCircumference" = "weight"
) {
	return useQuery(chartPointsQueryOptions(patientId, metric));
}
