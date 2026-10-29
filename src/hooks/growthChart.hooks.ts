import { useQuery } from "@tanstack/react-query";

import type { GrowthIndicator } from "@/lib/growth/lms-types";

import {
	flaggedMeasurementsQueryOptions,
	growthBandQueryOptions,
	growthCurvesQueryOptions,
	indicatorSeriesQueryOptions
} from "../server/queries/growthChart.queries";

type GrowthRequest = Parameters<typeof growthCurvesQueryOptions>[0];

export function useGrowthCurves(request: GrowthRequest) {
	return useQuery(growthCurvesQueryOptions(request));
}

export function useGrowthBand(request: GrowthRequest & { x: number }) {
	return useQuery(growthBandQueryOptions(request));
}

export function useIndicatorSeries(
	patientId: string,
	indicator: GrowthIndicator
) {
	return useQuery(indicatorSeriesQueryOptions(patientId, indicator));
}

export function useFlaggedMeasurements(patientId: string, zThreshold = 2) {
	return useQuery(flaggedMeasurementsQueryOptions(patientId, zThreshold));
}
