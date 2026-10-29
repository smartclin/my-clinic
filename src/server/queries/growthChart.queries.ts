// src/server/queries/growthChart.queries.ts

import { queryOptions } from "@tanstack/react-query";

import type { GrowthIndicator, Sex, XAxis } from "@/lib/growth/lms-types";
import {
	$fetchFlaggedMeasurements,
	$fetchGrowthChartBand,
	$fetchGrowthChartCurves,
	$fetchIndicatorSeries
} from "@/server/functions";

import { queryKeys } from "./keys";
import { STALE } from "./stale-time";

type GrowthRequest = {
	indicator: GrowthIndicator;
	sex: Sex;
	range: {
		max: number;
		min: number;
		xAxis: XAxis;
	};
};

export const growthCurvesQueryOptions = (request: GrowthRequest) =>
	queryOptions({
		queryFn: () =>
			$fetchGrowthChartCurves({
				data: {
					indicator: request.indicator,
					range: JSON.stringify(request.range),
					sex: request.sex
				}
			}),
		queryKey: queryKeys.growth.curves({
			indicator: request.indicator,
			sex: request.sex,
			range: request.range
		}),
		staleTime: STALE.STATIC
	});

export const growthBandQueryOptions = (
	request: GrowthRequest & { x: number }
) =>
	queryOptions({
		queryFn: () =>
			$fetchGrowthChartBand({
				data: {
					indicator: request.indicator,
					range: JSON.stringify(request.range),
					sex: request.sex,
					x: request.x
				}
			}),
		queryKey: queryKeys.growth.band(request),
		staleTime: STALE.STATIC
	});

export const indicatorSeriesQueryOptions = (
	patientId: string,
	indicator: GrowthIndicator
) =>
	queryOptions({
		queryFn: () =>
			$fetchIndicatorSeries({
				data: { indicator, patientId }
			}),
		queryKey: queryKeys.measurements.series(patientId, indicator),
		staleTime: STALE.GROWTH
	});

export const flaggedMeasurementsQueryOptions = (
	patientId: string,
	zThreshold = 2
) =>
	queryOptions({
		queryFn: () =>
			$fetchFlaggedMeasurements({
				data: { patientId, zThreshold }
			}),
		queryKey: queryKeys.measurements.flagged(patientId, zThreshold),
		staleTime: STALE.DASHBOARD
	});
