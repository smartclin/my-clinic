// src/components/growth/PatientGrowthPanel.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import {
	flaggedMeasurementsQueryOptions,
	growthBandQueryOptions,
	growthCurvesQueryOptions,
	indicatorSeriesQueryOptions
} from "#/server/queries/growthChart.queries.ts";
import {
	useGrowthActions,
	useGrowthFlaggedOnly,
	useGrowthFormOpen,
	useGrowthIndicator,
	useGrowthTimeframe
} from "#/stores/growth-store.ts";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import type { GrowthMetric } from "@/lib/growth/chartConfig";
import type { ChartBand, GrowthIndicator, Sex } from "@/lib/growth/lms-types";
import { DOMAIN } from "@/lib/growth/sheets";

import { MeasurementForm } from "../forms/MeasurementForm";
import { GrowthChart, type PatientGrowthPoint } from "./GrowthChart";
import { GrowthChartSkeleton } from "./GrowthChartSkeleton";

const INDICATORS: GrowthIndicator[] = [
	"weight-for-age",
	"length-for-age",
	"weight-for-length",
	"bmi-for-age"
];

const INDICATOR_LABELS: Record<GrowthIndicator, string> = {
	"bmi-for-age": "BMI-for-age",
	"length-for-age": "Length/height-for-age",
	"weight-for-age": "Weight-for-age",
	"weight-for-length": "Weight-for-length"
};

const INDICATOR_TO_METRIC: Record<GrowthIndicator, GrowthMetric> = {
	"bmi-for-age": "bmifa",
	"length-for-age": "lhfa",
	"weight-for-age": "wfa",
	"weight-for-length": "wfl"
};

function isGrowthIndicator(v: string | null): v is GrowthIndicator {
	return v !== null && (INDICATORS as readonly string[]).includes(v);
}

function growthRequestFor(indicator: GrowthIndicator, sex: Sex) {
	if (indicator === "weight-for-length") {
		const bounds = DOMAIN["weight-for-length"].length ?? { max: 120, min: 45 };
		return {
			indicator: "weight-for-length" as const,
			range: { max: bounds.max, min: bounds.min, xAxis: "length" as const },
			sex
		};
	}
	const bounds = DOMAIN[indicator].age ?? { max: 60, min: 0 };
	return {
		indicator,
		range: { max: bounds.max, min: bounds.min, xAxis: "age" as const },
		sex
	};
}

export interface PatientGrowthPanelProps {
	patientId: string;
	sex: Sex;
	latestVisitId?: string;
	latestAgeMonths?: number;
	latestLengthCm?: number;
	currentX?: number;
}

export const PatientGrowthPanel = ({
	patientId,
	sex,
	latestVisitId,
	latestAgeMonths,
	latestLengthCm,
	currentX
}: PatientGrowthPanelProps) => {
	const indicator = useGrowthIndicator(patientId);
	const flaggedOnly = useGrowthFlaggedOnly(patientId);
	const formOpen = useGrowthFormOpen(patientId);
	const timeframe = useGrowthTimeframe(patientId);
	const actions = useGrowthActions(patientId);

	const growthRequest = useMemo(
		() => growthRequestFor(indicator, sex),
		[indicator, sex]
	);
	const bandX = currentX ?? null;

	const curvesQ = useQuery(growthCurvesQueryOptions(growthRequest));
	const seriesQ = useQuery(indicatorSeriesQueryOptions(patientId, indicator));
	const flaggedQ = useQuery({
		...flaggedMeasurementsQueryOptions(patientId, 2),
		enabled: flaggedOnly
	});
	const bandQ = useQuery({
		...growthBandQueryOptions({ ...growthRequest, x: bandX ?? 0 }),
		enabled: bandX != null
	});

	const points: PatientGrowthPoint[] = useMemo(() => {
		if (indicator === "weight-for-length") return [];

		const rows = seriesQ.data ?? [];
		const allowed =
			flaggedOnly && flaggedQ.data
				? new Set(flaggedQ.data.map(r => r.id))
				: null;
		const filtered = allowed ? rows.filter(r => allowed.has(r.id)) : rows;

		const collected: PatientGrowthPoint[] = [];
		for (const r of filtered) {
			const age = r.visit?.ageMonths;
			if (age == null) continue;
			collected.push({
				classification: r.classification ?? "—",
				date: r.visit?.visitedAt ? String(r.visit.visitedAt) : "",
				id: r.id,
				percentile: r.percentile ?? 0,
				value: r.value,
				xValue: age,
				zScore: r.zScore ?? 0
			});
		}
		// `.toSorted` requires ES2023. Use spread + sort for lib compat.
		return [...collected].sort((a, b) => a.xValue - b.xValue);
	}, [seriesQ.data, flaggedQ.data, flaggedOnly, indicator]);

	const currentBand: ChartBand | null = bandQ.data ?? null;
	void currentBand;

	let chartContent;
	if (curvesQ.isError) {
		chartContent = (
			<div
				className='border-destructive/40 bg-destructive/10 text-destructive rounded-md border p-4 text-sm'
				role='alert'
			>
				Could not load reference curves:{" "}
				{curvesQ.error instanceof Error
					? curvesQ.error.message
					: String(curvesQ.error)}
			</div>
		);
	} else if (curvesQ.isLoading || !curvesQ.data) {
		chartContent = <GrowthChartSkeleton />;
	} else {
		chartContent = (
			<GrowthChart
				curves={curvesQ.data}
				metric={INDICATOR_TO_METRIC[indicator]}
				onSelectMetric={m => {
					const next = (
						Object.keys(INDICATOR_TO_METRIC) as GrowthIndicator[]
					).find(k => INDICATOR_TO_METRIC[k] === m);
					if (next) actions.setIndicator(next);
				}}
				onSelectTimeframe={actions.setTimeframe}
				patientPoints={points}
				sex={sex}
				timeframe={timeframe}
			/>
		);
	}

	return (
		<section className='space-y-4'>
			<div className='flex flex-wrap items-end gap-4'>
				<div className='flex flex-col gap-1.5'>
					<Label htmlFor='indicator-select'>Indicator</Label>
					<div className='w-64'>
						<Select
							onValueChange={(v: string | null) => {
								if (isGrowthIndicator(v)) actions.setIndicator(v);
							}}
							value={indicator}
						>
							<SelectTrigger id='indicator-select'>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{INDICATORS.map(i => (
									<SelectItem
										key={i}
										value={i}
									>
										{INDICATOR_LABELS[i]}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>

				<div className='flex items-center gap-2'>
					<Switch
						checked={flaggedOnly}
						id='flagged-only'
						onCheckedChange={actions.setFlaggedOnly}
					/>
					<Label htmlFor='flagged-only'>Show flagged points only</Label>
				</div>

				<Button
					onClick={() => {
						actions.setFormOpen(!formOpen);
					}}
					type='button'
				>
					{formOpen ? "Close form" : "Add measurement"}
				</Button>
			</div>

			{indicator === "weight-for-length" && (
				<p className='text-destructive text-sm'>
					Patient overlay is hidden for weight-for-length until the schema
					stores the length-at-measurement. Reference curves render.
				</p>
			)}

			{chartContent}

			{formOpen &&
				latestVisitId != null &&
				latestVisitId !== "" &&
				latestAgeMonths !== undefined && (
					<MeasurementForm
						ageMonths={latestAgeMonths}
						lengthCm={latestLengthCm}
						patientId={patientId}
						patientSex={sex}
						visitId={latestVisitId}
					/>
				)}
			{formOpen &&
				(latestVisitId == null ||
					latestVisitId === "" ||
					latestAgeMonths === undefined) && (
					<p className='text-muted-foreground text-sm'>
						Record a visit before adding measurements.
					</p>
				)}
		</section>
	);
};
