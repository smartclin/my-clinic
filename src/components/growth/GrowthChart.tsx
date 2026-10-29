// components/growth/GrowthChart.tsx
"use client";

import {
	areaY,
	type ChartPoint,
	d3Curve,
	defineChart,
	lineY
} from "@tanstack/charts";
import { motion } from "@tanstack/charts/motion";
import { RendererChart } from "@tanstack/charts/react/tooltip";
import { tooltip } from "@tanstack/charts/tooltip";
import { scaleLinear } from "d3-scale";
import { curveLinear } from "d3-shape";
import { Download, ZoomIn } from "lucide-react";
import * as React from "react";

import {
	curveColor,
	FILL_BANDS,
	filterLmsByTimeframe,
	GROWTH_METRIC_METADATA,
	type GrowthMetric,
	PATIENT_COLOR,
	SD_BANDS,
	TIMEFRAME_WINDOWS,
	type TimeframeOption
} from "@/lib/growth/chartConfig";
import type { ChartCurves } from "@/lib/growth/lms-types";
import { cn } from "@/lib/utils";

const LINEAR_CURVE = d3Curve(curveLinear);

// ── Typed row shapes ─────────────────────────────────────────────────────
// These exist so the `lineY` / `areaY` accessors can be inferred. Without
// them, `lineY(rows, { x: (p) => p.x })` falls back to `ChannelAccessor<
// unknown, …>` and every callback is `implicit any`.
interface SdRow {
	x: number;
	y: number;
}

interface BandRow {
	x: number;
	lower: number;
	upper: number;
}

// ── Props ───────────────────────────────────────────────────────────────
export interface PatientGrowthPoint {
	id: string;
	date: string;
	xValue: number;
	value: number;
	zScore: number;
	percentile: number;
	classification: string;
}

interface GrowthChartProps {
	sex: "male" | "female";
	metric: GrowthMetric;
	curves: ChartCurves;
	patientPoints: PatientGrowthPoint[];
	onSelectMetric: (m: GrowthMetric) => void;
	timeframe: TimeframeOption;
	onSelectTimeframe: (t: TimeframeOption) => void;
	className?: string;
}

// ── Component ───────────────────────────────────────────────────────────
export const GrowthChart: React.FC<GrowthChartProps> = ({
	sex,
	metric,
	curves,
	patientPoints,
	onSelectMetric,
	timeframe,
	onSelectTimeframe,
	className
}) => {
	const meta = GROWTH_METRIC_METADATA[metric];

	// `motion` renderer was missing from the previous version. `RendererChart`
	// requires it. Memoize so the renderer object identity is stable across
	// re-renders.
	const renderer = React.useMemo(
		() =>
			motion({
				initial: "always",
				transition: { damping: 18, mass: 1, stiffness: 170, type: "spring" }
			}),
		[]
	);

	const definition = React.useMemo(() => {
		// ── Fill bands ────────────────────────────────────────────────────
		// A "band" is a closed polygon between two SD curves. `areaY` with
		// two y-accessors produces exactly that: fill from `y1` to `y2`.
		const fills = FILL_BANDS.map(band => {
			const rows: BandRow[] = curves.points
				.filter(
					p =>
						typeof p[band.lower] === "number" &&
						typeof p[band.upper] === "number"
				)
				.map(p => ({
					lower: p[band.lower],
					upper: p[band.upper],
					x: p.x
				}));

			if (rows.length === 0) return null;

			return areaY(rows, {
				fill: `var(${band.cssVar})`,
				fillOpacity: band.opacity,
				id: `band-${band.lower}-${band.upper}`,
				key: (p: BandRow) => `band-${band.lower}-${band.upper}-${p.x}`,
				stroke: "none",
				x: (p: BandRow) => p.x,
				y1: (p: BandRow) => p.lower,
				y2: (p: BandRow) => p.upper
			});
		}).filter((m): m is NonNullable<typeof m> => m !== null);

		// ── SD lines ─────────────────────────────────────────────────────
		const lines = SD_BANDS.map(band => {
			const rows: SdRow[] = curves.points
				.filter(p => typeof p[band.key] === "number")
				.map(p => ({ x: p.x, y: p[band.key] as number }));

			if (rows.length === 0) return null;

			const color = curveColor(band.style);
			const isMedian = band.style === "median";

			return lineY(rows, {
				curve: LINEAR_CURVE,
				id: `sd-${band.key}`,
				key: (p: SdRow) => `sd-${band.key}-${p.x}`,
				stroke: color,
				strokeDasharray: isMedian ? undefined : "4 3",
				strokeWidth: isMedian ? 2.2 : 1.4,
				x: (p: SdRow) => p.x,
				y: (p: SdRow) => p.y
			});
		}).filter((m): m is NonNullable<typeof m> => m !== null);

		// ── Patient line ─────────────────────────────────────────────────
		const patientLine =
			patientPoints.length > 1
				? lineY(patientPoints, {
						curve: LINEAR_CURVE,
						id: "patient-line",
						key: p => `pt-${p.id}`,
						stroke: PATIENT_COLOR,
						strokeWidth: 2.4,
						x: p => p.xValue,
						y: p => p.value
					})
				: null;

		return defineChart(
			{
				marks: [...fills, ...lines, ...(patientLine ? [patientLine] : [])],
				scales: {
					x: {
						axis: {
							label: `${meta.xLabel} (${meta.xUnit})`,
							line: false,
							ticks: { padding: 8, size: 0 }
						},
						domain: [
							curves.points[0]?.x ?? meta.minX,
							curves.points.at(-1)?.x ?? meta.maxX
						],
						nice: true,
						scale: scaleLinear
					},
					y: {
						axis: { label: `${meta.name} (${meta.unit})` },
						grid: true,
						nice: true,
						scale: scaleLinear
					}
				},
				margin: { bottom: 48, left: 56, right: 36, top: 28 },
				theme: {
					background: "transparent",
					foreground: "var(--muted-foreground)",
					grid: "var(--border)"
				}
			},
			{
				focus: "group-x",
				svgAnimation: false,
				tooltip: {
					anchor: "group-center",
					className: "sc-chart-tooltip",
					content: points => growthTooltip(points, meta, patientPoints),
					placement: "auto",
					sort: "color-domain",
					use: tooltip
				}
			}
		);
	}, [curves.points, patientPoints, meta]);

	// ── Timeframe buttons ──────────────────────────────────────────────
	// `Object.keys(TIMEFRAME_WINDOWS)` returns `"0-19" | "0-2" | "0-5" |
	// "5-10"`, which does NOT include `"all"`. Building the array as
	// `TimeframeOption[]` first prevents the `concat("all")` type error.
	const timeframeOptions: TimeframeOption[] = [
		...(Object.keys(TIMEFRAME_WINDOWS) as Exclude<TimeframeOption, "all">[]),
		"all"
	];

	return (
		<div
			className={cn(
				"bg-background overflow-hidden rounded-xl border shadow-xs",
				className
			)}
		>
			{/* Header */}
			<div className='flex flex-col justify-between gap-4 border-b p-4 sm:p-5 md:flex-row md:items-center'>
				<div className='bg-muted flex flex-wrap items-center gap-1.5 rounded-lg p-1'>
					{(Object.keys(GROWTH_METRIC_METADATA) as GrowthMetric[]).map(m => (
						<button
							className={cn(
								"shrink-0 rounded-md px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors",
								metric === m
									? "bg-background text-foreground shadow-xs"
									: "text-muted-foreground hover:text-foreground"
							)}
							key={m}
							onClick={() => onSelectMetric(m)}
							type='button'
						>
							{GROWTH_METRIC_METADATA[m].name}
						</button>
					))}
				</div>

				<div className='flex items-center gap-2'>
					{!meta.fixedRange && (
						<div className='bg-muted/50 text-muted-foreground flex items-center gap-1 rounded-md border p-1 text-xs'>
							<ZoomIn className='text-muted-foreground ml-1 size-3.5' />
							{timeframeOptions.map(tf => (
								<button
									className={cn(
										"rounded px-2 py-1 font-medium transition-colors",
										timeframe === tf
											? "bg-primary text-primary-foreground font-semibold"
											: "text-foreground/80 hover:bg-muted"
									)}
									key={tf}
									onClick={() => onSelectTimeframe(tf)}
									type='button'
								>
									{tf === "all" ? "All (0–19y)" : `${tf.replace("-", "–")}y`}
								</button>
							))}
						</div>
					)}

					<button
						className='text-muted-foreground hover:bg-muted hover:text-foreground flex items-center gap-1.5 rounded-md border p-2 text-xs font-medium transition-colors'
						onClick={() => window.print()}
						title='Print or export chart report'
						type='button'
					>
						<Download className='size-3.5' />
						<span className='hidden sm:inline'>Export</span>
					</button>
				</div>
			</div>

			{/* Canvas */}
			<div className='bg-muted/30 relative p-2 sm:p-4'>
				<RendererChart
					ariaLabel={`${meta.name} growth chart for ${sex === "male" ? "boy" : "girl"}`}
					definition={definition}
					height={480}
					initialWidth={800}
					renderer={renderer}
				/>
			</div>

			{/* Legend */}
			<div className='bg-background flex flex-wrap items-center justify-between gap-4 border-t p-4 text-xs'>
				<div className='text-muted-foreground flex flex-wrap items-center gap-4'>
					<div className='flex items-center gap-1.5'>
						<span className='bg-chart-band-median inline-block h-0.5 w-3.5' />
						<span className='text-foreground font-medium'>
							Median (50th %ile)
						</span>
					</div>
					<div className='flex items-center gap-1.5'>
						<span className='border-chart-band-inner inline-block w-3.5 border-t border-dashed' />
						<span>±2 SD (3rd & 97th %ile)</span>
					</div>
					<div className='flex items-center gap-1.5'>
						<span className='border-chart-band-outer inline-block w-3.5 border-t border-dashed' />
						<span>±3 SD (Severe threshold)</span>
					</div>
					<div className='flex items-center gap-1.5'>
						<span
							className='inline-block size-3 rounded-full border-2'
							style={{
								backgroundColor: "var(--chart-patient)",
								borderColor: "var(--chart-patient)"
							}}
						/>
						<span className='text-foreground font-semibold'>
							Patient measurements ({patientPoints.length})
						</span>
					</div>
				</div>
				<div className='text-muted-foreground text-[11px]'>
					Standard: Egyptian Pediatric LMS Growth Reference
				</div>
			</div>
		</div>
	);
};

// ── Tooltip formatter ───────────────────────────────────────────────────
function growthTooltip(
	points: readonly ChartPoint[],
	meta: (typeof GROWTH_METRIC_METADATA)[GrowthMetric],
	patientPoints: PatientGrowthPoint[]
) {
	const [first] = points;
	const patient = points.find(p => p.group === "patient-line");

	const patientData = patient
		? patientPoints.find(p => Math.abs(p.xValue - Number(first?.xValue)) < 0.01)
		: undefined;

	// `toSorted` requires ES2023. Use spread + sort to stay compatible with
	// the project's current `lib` target (ES2022 or earlier).
	const sdRows = points
		.filter(p => typeof p.group === "string" && p.group.startsWith("sd-"))
		.map(p => {
			const band = SD_BANDS.find(b => `sd-${b.key}` === p.markId);
			return {
				color: p.color ?? "var(--muted-foreground)",
				label: band?.label ?? String(p.markId).replace("sd-", ""),
				value: Number(p.yValue ?? 0).toFixed(1)
			};
		})
		.sort((a, b) => Number.parseFloat(b.value) - Number.parseFloat(a.value));

	const rows = [
		...(patientData
			? [
					{
						color: "var(--chart-patient)",
						label: `Patient (${meta.unit})`,
						value: `${patientData.value} ${meta.unit}`
					},
					{
						color: "var(--chart-patient)",
						label: "Z-score",
						value: `${patientData.zScore > 0 ? "+" : ""}${patientData.zScore.toFixed(2)} SD`
					},
					{
						color: "var(--chart-patient)",
						label: "Percentile",
						value: `${patientData.percentile.toFixed(1)}%`
					},
					{
						color: "var(--chart-patient)",
						label: "Classification",
						value: patientData.classification
					}
				]
			: []),
		...sdRows
	];

	return {
		rows,
		title: `${meta.xLabel}: ${first?.xValue ?? ""} ${meta.xUnit}`
	};
}

// Re-export so callers can share the same filter as the chart.
export { filterLmsByTimeframe };
