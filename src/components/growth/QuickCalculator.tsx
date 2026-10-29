/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
	AlertCircle,
	AlertTriangle,
	Calculator,
	CheckCircle2,
	Info
} from "lucide-react";
import type React from "react";
import { useMemo, useState } from "react";

import {
	type Gender,
	GROWTH_METRIC_METADATA,
	type GrowthMetric
} from "@/data/egyptianLmsData.ts";
import { calculateBmi, evaluateGrowthMetric } from "@/utils/lmsCalculations.ts";

export const QuickCalculator: React.FC = () => {
	const [gender, setGender] = useState<Gender>("boy");
	const [metric, setMetric] = useState<GrowthMetric>("wfa");
	const [ageMonths, setAgeMonths] = useState<string>("24");
	const [lengthVal, setLengthVal] = useState<string>("85");
	const [measuredValue, setMeasuredValue] = useState<string>("12.5");

	// BMI helper inputs
	const [useBmiHelper, setUseBmiHelper] = useState(false);
	const [calcWeight, setCalcWeight] = useState("12.5");
	const [calcHeight, setCalcHeight] = useState("88");

	const meta = GROWTH_METRIC_METADATA[metric];

	// If using BMI helper, auto-update measuredValue
	const handleBmiCalc = (wt: string, ht: string) => {
		setCalcWeight(wt);
		setCalcHeight(ht);
		const w = Number.parseFloat(wt);
		const h = Number.parseFloat(ht);
		if (w > 0 && h > 0) {
			const b = calculateBmi(w, h);
			if (b) setMeasuredValue(b.toString());
		}
	};

	const xInputVal =
		metric === "wfl"
			? Number.parseFloat(lengthVal)
			: Number.parseFloat(ageMonths);
	const valInputVal = Number.parseFloat(measuredValue);

	const result = useMemo(() => {
		if (
			Number.isNaN(xInputVal) ||
			Number.isNaN(valInputVal) ||
			valInputVal <= 0
		)
			return null;
		return evaluateGrowthMetric(gender, metric, xInputVal, valInputVal);
	}, [gender, metric, xInputVal, valInputVal]);

	return (
		<div className='mx-auto max-w-4xl space-y-6'>
			{/* Intro Banner */}
			<div className='rounded-xl border border-slate-200 bg-white p-6 shadow-xs'>
				<div className='flex items-center gap-3'>
					<div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-700'>
						<Calculator className='h-5 w-5' />
					</div>
					<div>
						<h2 className='text-base font-bold text-slate-900'>
							Instant Egyptian LMS Growth & Z-Score Calculator
						</h2>
						<p className='mt-0.5 text-xs text-slate-500'>
							Input any child's age or height to lookup exact Egyptian reference
							L, M, S parameters and compute clinical Z-scores and percentiles.
						</p>
					</div>
				</div>
			</div>

			<div className='grid grid-cols-1 gap-6 md:grid-cols-12'>
				{/* Input Parameters Column */}
				<div className='space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-xs md:col-span-5'>
					<h3 className='border-b border-slate-100 pb-2 text-xs font-bold tracking-wider text-slate-900 uppercase'>
						Input Anthropometric Data
					</h3>

					{/* Gender */}
					<div>
						<label
							className='mb-1.5 block text-xs font-semibold text-slate-700'
							htmlFor={gender}
						>
							Child Gender
						</label>
						<div className='grid grid-cols-2 gap-2'>
							<button
								className={`rounded-lg border px-3 py-2 text-center text-xs font-semibold transition-all ${
									gender === "boy"
										? "border-blue-600 bg-blue-50 text-blue-700 shadow-xs"
										: "border-slate-200 text-slate-600 hover:bg-slate-50"
								}`}
								onClick={() => setGender("boy")}
								type='button'
							>
								Boy 👦
							</button>
							<button
								className={`rounded-lg border px-3 py-2 text-center text-xs font-semibold transition-all ${
									gender === "girl"
										? "border-pink-600 bg-pink-50 text-pink-700 shadow-xs"
										: "border-slate-200 text-slate-600 hover:bg-slate-50"
								}`}
								onClick={() => setGender("girl")}
								type='button'
							>
								Girl 👧
							</button>
						</div>
					</div>

					{/* Metric Selector */}
					<div>
						<p
							className='mb-1.5 block text-xs font-semibold text-slate-700'
							id='growth-metric-label'
						>
							Growth Metric
						</p>
						<div
							aria-labelledby='growth-metric-label'
							className='grid grid-cols-1 gap-1.5'
							role='group'
						>
							{(["wfa", "lhfa", "wfl", "bmifa"] as GrowthMetric[]).map(m => (
								<button
									className={`flex items-center justify-between rounded-lg border px-3 py-2 text-left text-xs font-medium transition-all ${
										metric === m
											? "border-teal-600 bg-teal-50 font-semibold text-teal-900 shadow-xs"
											: "border-slate-200 text-slate-700 hover:bg-slate-50"
									}`}
									key={m}
									onClick={() => {
										setMetric(m);
										if (m === "wfa") setMeasuredValue("12.5");
										else if (m === "lhfa") setMeasuredValue("87");
										else if (m === "wfl") {
											setLengthVal("85");
											setMeasuredValue("11.5");
										} else if (m === "bmifa") setMeasuredValue("16.2");
									}}
									type='button'
								>
									<span>{GROWTH_METRIC_METADATA[m].name}</span>
									<span className='font-mono text-[10px] text-slate-400'>
										({GROWTH_METRIC_METADATA[m].unit})
									</span>
								</button>
							))}
						</div>
					</div>

					{/* Predictor Input: Age or Length */}
					{metric === "wfl" ? (
						<div>
							<label
								className='mb-1 block text-xs font-semibold text-slate-700'
								htmlFor={String(length)}
							>
								Measured Length / Height (cm)
							</label>
							<input
								className='w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-sm focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20 focus:outline-none'
								max='120'
								min='45'
								onChange={e => setLengthVal(e.target.value)}
								step='0.5'
								type='number'
								value={lengthVal}
							/>
							<span className='mt-1 block text-[11px] text-slate-400'>
								Reference range: 45.0 to 120.0 cm
							</span>
						</div>
					) : (
						<div>
							<label
								className='mb-1 block text-xs font-semibold text-slate-700'
								htmlFor={ageMonths}
							>
								Age in Completed Months (0–{meta.maxX})
							</label>
							<div className='flex gap-2'>
								<input
									className='w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-sm focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20 focus:outline-none'
									max={meta.maxX}
									min='0'
									onChange={e => setAgeMonths(e.target.value)}
									step='0.5'
									type='number'
									value={ageMonths}
								/>
							</div>
							<span className='mt-1 block text-[11px] text-slate-400'>
								{Number.parseFloat(ageMonths) > 0 &&
									`≈ ${(Number.parseFloat(ageMonths) / 12).toFixed(1)} years old`}
							</span>
						</div>
					)}

					{/* Measured Value Input */}
					<div>
						<div className='mb-1 flex items-center justify-between'>
							<label
								className='text-xs font-semibold text-slate-700'
								htmlFor={measuredValue}
							>
								Measured Value ({meta.unit})
							</label>
							{metric === "bmifa" && (
								<button
									className='text-[11px] text-teal-600 underline hover:text-teal-700'
									onClick={() => setUseBmiHelper(!useBmiHelper)}
									type='button'
								>
									{useBmiHelper ? "Enter BMI directly" : "Calculate from Wt/Ht"}
								</button>
							)}
						</div>

						{metric === "bmifa" && useBmiHelper ? (
							<div className='mb-2 space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-2.5'>
								<div className='grid grid-cols-2 gap-2'>
									<div>
										<span className='block text-[10px] text-slate-500'>
											Weight (kg)
										</span>
										<input
											className='w-full rounded border border-slate-200 bg-white p-1.5 font-mono text-xs'
											onChange={e => handleBmiCalc(e.target.value, calcHeight)}
											step='0.1'
											type='number'
											value={calcWeight}
										/>
									</div>
									<div>
										<span className='block text-[10px] text-slate-500'>
											Height (cm)
										</span>
										<input
											className='w-full rounded border border-slate-200 bg-white p-1.5 font-mono text-xs'
											onChange={e => handleBmiCalc(calcWeight, e.target.value)}
											step='0.5'
											type='number'
											value={calcHeight}
										/>
									</div>
								</div>
							</div>
						) : null}

						<input
							className='w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-sm font-bold text-slate-900 focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20 focus:outline-none'
							onChange={e => setMeasuredValue(e.target.value)}
							step='0.01'
							type='number'
							value={measuredValue}
						/>
					</div>
				</div>

				{/* Results Calculation Column */}
				<div className='space-y-4 md:col-span-7'>
					{result ? (
						<div className='space-y-5 rounded-xl border border-slate-200 bg-white p-6 shadow-xs'>
							<div className='flex items-center justify-between border-b border-slate-100 pb-3'>
								<h3 className='text-sm font-bold text-slate-900'>
									Calculated LMS Growth Output
								</h3>
								<span
									className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold ${
										result.severity === "alert"
											? "border border-red-200 bg-red-50 text-red-700"
											: result.severity === "warning"
												? "border border-amber-200 bg-amber-50 text-amber-700"
												: "border border-emerald-200 bg-emerald-50 text-emerald-700"
									}`}
								>
									{result.severity === "alert" ? (
										<AlertCircle className='h-3.5 w-3.5' />
									) : result.severity === "warning" ? (
										<AlertTriangle className='h-3.5 w-3.5' />
									) : (
										<CheckCircle2 className='h-3.5 w-3.5' />
									)}
									<span>{result.classification}</span>
								</span>
							</div>

							{/* Big Metrics Split */}
							<div className='grid grid-cols-2 gap-4'>
								<div className='rounded-xl border border-teal-100 bg-teal-50/50 p-4 text-center'>
									<span className='block text-xs font-medium tracking-wider text-teal-800 uppercase'>
										Z-Score (SD)
									</span>
									<div className='mt-1 font-mono text-3xl font-extrabold text-teal-900'>
										{result.zScore > 0 ? `+${result.zScore}` : result.zScore}
									</div>
									<span className='mt-1 block text-[11px] text-teal-700'>
										Distance from Median
									</span>
								</div>

								<div className='rounded-xl border border-slate-200 bg-slate-50 p-4 text-center'>
									<span className='block text-xs font-medium tracking-wider text-slate-600 uppercase'>
										Percentile
									</span>
									<div className='mt-1 font-mono text-3xl font-extrabold text-slate-900'>
										{result.percentile}
										<span className='ml-0.5 text-sm font-normal text-slate-500'>
											%ile
										</span>
									</div>
									<span className='mt-1 block text-[11px] text-slate-500'>
										Egyptian population rank
									</span>
								</div>
							</div>

							{/* Visual SD Bell Gauge */}
							<div className='space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-4'>
								<div className='flex justify-between text-[11px] font-semibold text-slate-600'>
									<span>-3 SD</span>
									<span>-2 SD</span>
									<span>Median</span>
									<span>+2 SD</span>
									<span>+3 SD</span>
								</div>

								<div className='relative h-3 overflow-hidden rounded-full bg-slate-200'>
									{/* Normal green zone */}
									<div className='absolute right-[16.6%] left-[16.6%] h-full bg-emerald-300' />
									{/* Warning amber zones */}
									<div className='absolute left-0 h-full w-[16.6%] bg-amber-200' />
									<div className='absolute right-0 h-full w-[16.6%] bg-amber-200' />

									{/* Marker for current Z-score (range -3.5 to +3.5) */}
									{(() => {
										const clampedZ = Math.max(
											-3.5,
											Math.min(3.5, result.zScore)
										);
										const pct = ((clampedZ + 3.5) / 7) * 100;
										return (
											<div
												className='absolute top-0 bottom-0 w-2.5 -translate-x-1/2 rounded-full border border-white bg-slate-900 shadow-xs'
												style={{ left: `${pct}%` }}
											/>
										);
									})()}
								</div>
							</div>

							{/* Underlying Egyptian Reference LMS Table Parameters */}
							<div className='space-y-2 rounded-lg border border-slate-200 bg-white p-4 text-xs'>
								<div className='font-semibold text-slate-900'>
									Active Reference LMS Parameters at X = {result.xValue}{" "}
									{meta.xUnit}:
								</div>
								<div className='grid grid-cols-3 gap-2 font-mono text-[11px]'>
									<div className='rounded border border-slate-200 bg-slate-50 p-2'>
										<span className='block text-slate-400'>Lambda (L):</span>
										<strong className='text-slate-900'>{result.l}</strong>
									</div>
									<div className='rounded border border-slate-200 bg-slate-50 p-2'>
										<span className='block text-slate-400'>
											Mu / Median (M):
										</span>
										<strong className='text-slate-900'>{result.m}</strong>
									</div>
									<div className='rounded border border-slate-200 bg-slate-50 p-2'>
										<span className='block text-slate-400'>
											Sigma / CV (S):
										</span>
										<strong className='text-slate-900'>{result.s}</strong>
									</div>
								</div>

								<div className='flex items-start gap-1.5 pt-2 text-[11px] text-slate-500'>
									<Info className='mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400' />
									<span>
										Formula:{" "}
										{Math.abs(result.l) < 0.001
											? "Z = ln(X / M) / S (when L ≈ 0)"
											: "Z = ((X / M)^L - 1) / (L · S)"}
									</span>
								</div>
							</div>
						</div>
					) : (
						<div className='rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-400'>
							<Calculator className='mx-auto mb-2 h-8 w-8 opacity-50' />
							<p className='text-xs'>
								Enter valid values to calculate Z-score and percentile.
							</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};
