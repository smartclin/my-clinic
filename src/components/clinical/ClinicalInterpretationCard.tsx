/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
	AlertTriangle,
	Info,
	ShieldAlert,
	ShieldCheck,
	Stethoscope,
	TrendingUp
} from "lucide-react";
import type React from "react";

import type { Measurement, Patient } from "#/types/growth";
import { evaluateGrowthMetric } from "#/utils/lmsCalculations";

interface ClinicalInterpretationCardProps {
	patient: Patient;
	measurements: Measurement[];
}

export interface ClinicalTriage {
	category: "wasting" | "stunting" | "underweight" | "bmi";
	title: string;
	metricLabel: string;
	zScore: number | null;
	percentile: number | null;
	percentileBeyond?: "<0.01%" | ">99.99%" | null;
	status: string;
	badgeLabel: string;
	severity: "normal" | "warning" | "alert";
	measuredText: string;
	clinicalAction: string;
}

export const ClinicalInterpretationCard: React.FC<
	ClinicalInterpretationCardProps
> = ({ patient, measurements }) => {
	const sorted = [...measurements].sort(
		(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
	);
	const latest = sorted[0];
	const previous = sorted[1];

	if (!latest) {
		return (
			<div className='rounded-xl border border-slate-200 bg-white p-6 text-center shadow-xs'>
				<Info className='mx-auto mb-2.5 h-8 w-8 text-slate-400' />
				<h3 className='text-sm font-semibold text-slate-800'>
					No Clinical Measurements Recorded
				</h3>
				<p className='mx-auto mt-1 max-w-sm text-xs leading-relaxed text-slate-500'>
					Record the child's weight, height, or head circumference to generate
					automated Egyptian LMS Z-score triage and nutritional assessments.
				</p>
			</div>
		);
	}

	// 1. Stunting Evaluation (Length/Height-for-Age)
	const lhfaEval =
		latest.height && latest.ageMonths <= 228
			? evaluateGrowthMetric(
					patient.gender,
					"lhfa",
					latest.ageMonths,
					latest.height
				)
			: null;

	// 2. Underweight Evaluation (Weight-for-Age)
	const wfaEval =
		latest.weight && latest.ageMonths <= 120
			? evaluateGrowthMetric(
					patient.gender,
					"wfa",
					latest.ageMonths,
					latest.weight
				)
			: null;

	// 3. Acute Wasting / SAM / MAM (Weight-for-Height or BMI if age > 5y)
	const wflEval =
		latest.weight &&
		latest.height &&
		latest.height >= 45 &&
		latest.height <= 120
			? evaluateGrowthMetric(
					patient.gender,
					"wfl",
					latest.height,
					latest.weight
				)
			: null;

	// 4. Overweight / Obesity (BMI-for-Age)
	const bmifaEval =
		latest.bmi && latest.ageMonths <= 228
			? evaluateGrowthMetric(
					patient.gender,
					"bmifa",
					latest.ageMonths,
					latest.bmi
				)
			: null;

	// Build Structured Clinical Triages
	const triageItems: ClinicalTriage[] = [];

	// 1. Acute Wasting (SAM / MAM / Normal)
	if (wflEval) {
		const z = wflEval.zScore;
		let severity: "normal" | "warning" | "alert" = "normal";
		let status = "Normal Weight-for-Length";
		let badgeLabel = "Adequate";
		let clinicalAction =
			"Child is well-nourished. Continue standard age-appropriate feeding practices.";

		if (z < -3) {
			severity = "alert";
			status = "Severe Acute Malnutrition (SAM)";
			badgeLabel = "SAM Alert";
			clinicalAction =
				"Urgent: Refer for SAM management protocol. Assess for bilateral pitting edema, perform appetite test with RUTF, check for medical complications.";
		} else if (z < -2) {
			severity = "warning";
			status = "Moderate Acute Malnutrition (MAM)";
			badgeLabel = "MAM (Wasting)";
			clinicalAction =
				"Enroll in Supplementary Feeding Program (SFP). Provide counseling on energy-dense feeds and micronutrients. Re-evaluate in 14 days.";
		} else if (z > 3) {
			severity = "alert";
			status = "Severe Obesity for Length";
			badgeLabel = "Severe Obesity";
			clinicalAction =
				"Evaluate caloric intake, avoid formula over-concentration, promote active physical movement.";
		} else if (z > 2) {
			severity = "warning";
			status = "Overweight for Length";
			badgeLabel = "Overweight";
			clinicalAction = "Monitor feeding volume and complementary diet balance.";
		}

		triageItems.push({
			category: "wasting",
			title: "Acute Wasting / Malnutrition",
			metricLabel: "Weight-for-Height/Length",
			zScore: z,
			percentile: wflEval.percentile,
			percentileBeyond: wflEval.percentileBeyond,
			status,
			badgeLabel,
			severity,
			measuredText: `${latest.weight} kg @ ${latest.height} cm`,
			clinicalAction
		});
	} else if (latest.ageMonths > 60 && bmifaEval) {
		// For children > 5 years, use BMI-for-Age for acute thinness/wasting
		const z = bmifaEval.zScore;
		let severity: "normal" | "warning" | "alert" = "normal";
		let status = "Normal Body Habitus";
		let badgeLabel = "Adequate";
		let clinicalAction = "Routine physical activity and balanced diet.";

		if (z < -3) {
			severity = "alert";
			status = "Severe Thinness / SAM";
			badgeLabel = "Severe Thinness";
			clinicalAction =
				"Evaluate for underlying chronic illness, malabsorption, or eating disorders. Urgent pediatric referral.";
		} else if (z < -2) {
			severity = "warning";
			status = "Moderate Thinness";
			badgeLabel = "Thinness";
			clinicalAction =
				"Nutritional support, caloric density increase, rule out systemic causes.";
		}

		if (z < -2) {
			triageItems.push({
				category: "wasting",
				title: "Acute Thinness Status",
				metricLabel: "BMI-for-Age",
				zScore: z,
				percentile: bmifaEval.percentile,
				percentileBeyond: bmifaEval.percentileBeyond,
				status,
				badgeLabel,
				severity,
				measuredText: `BMI ${latest.bmi} kg/m²`,
				clinicalAction
			});
		}
	}

	// 2. Stunting (Chronic Malnutrition)
	if (lhfaEval) {
		const z = lhfaEval.zScore;
		let severity: "normal" | "warning" | "alert" = "normal";
		let status = "Normal Stature";
		let badgeLabel = "Normal Height";
		let clinicalAction =
			"Linear growth tracking on Egyptian reference trajectory.";

		if (z < -3) {
			severity = "alert";
			status = "Severe Stunting (Chronic)";
			badgeLabel = "Severe Stunting";
			clinicalAction =
				"Comprehensive evaluation for chronic conditions: celiac disease, thyroid disorder, renal tubular acidosis, recurrent infections, or zinc deficiency.";
		} else if (z < -2) {
			severity = "warning";
			status = "Moderate Stunting";
			badgeLabel = "Stunting";
			clinicalAction =
				"Screen for environmental enteropathy, optimize high-protein diet with zinc, iron, and vitamin D. Monitor velocity closely.";
		} else if (z > 2) {
			severity = "normal";
			status = "Tall Stature";
			badgeLabel = "Tall Stature";
			clinicalAction =
				"Assess familial mid-parental target height and constitutional patterns.";
		}

		triageItems.push({
			category: "stunting",
			title: "Stunting (Linear Growth)",
			metricLabel: "Length/Height-for-Age",
			zScore: z,
			percentile: lhfaEval.percentile,
			percentileBeyond: lhfaEval.percentileBeyond,
			status,
			badgeLabel,
			severity,
			measuredText: `${latest.height} cm (${latest.ageMonths.toFixed(1)} mo)`,
			clinicalAction
		});
	}

	// 3. Underweight (Weight-for-Age)
	if (wfaEval) {
		const z = wfaEval.zScore;
		let severity: "normal" | "warning" | "alert" = "normal";
		let status = "Normal Weight-for-Age";
		let badgeLabel = "Normal Weight";
		let clinicalAction =
			"Weight progressing along normal Egyptian percentile bands.";

		if (z < -3) {
			severity = "alert";
			status = "Severe Underweight";
			badgeLabel = "Severe Underweight";
			clinicalAction =
				"Intensive caloric supplementation. Review daily meal frequency and breastmilk/formula intake. Check hydration and vital signs.";
		} else if (z < -2) {
			severity = "warning";
			status = "Moderate Underweight";
			badgeLabel = "Underweight";
			clinicalAction =
				"Assess complementary feeding quality. Encourage fortified porridge, eggs, lentils, or dairy. Monthly weight check.";
		} else if (z > 2) {
			severity = "warning";
			status = "High Weight-for-Age";
			badgeLabel = "High Weight";
			clinicalAction =
				"Correlate with Length/Height and BMI-for-Age to differentiate muscular build from excess adiposity.";
		}

		triageItems.push({
			category: "underweight",
			title: "Weight-for-Age Assessment",
			metricLabel: "Weight-for-Age",
			zScore: z,
			percentile: wfaEval.percentile,
			percentileBeyond: wfaEval.percentileBeyond,
			status,
			badgeLabel,
			severity,
			measuredText: `${latest.weight} kg (${latest.ageMonths.toFixed(1)} mo)`,
			clinicalAction
		});
	}

	// 4. Overweight & Obesity (BMI-for-Age)
	if (bmifaEval) {
		const z = bmifaEval.zScore;
		let severity: "normal" | "warning" | "alert" = "normal";
		let status = "Normal Adiposity";
		let badgeLabel = "Healthy BMI";
		let clinicalAction =
			"Continue balanced nutritional habits and 60+ minutes of daily physical play.";

		if (z > 3) {
			severity = "alert";
			status = "Childhood Obesity (Severe)";
			badgeLabel = "Obesity (Z > +3)";
			clinicalAction =
				"Structured lifestyle intervention: eliminate sugary beverages, cap recreational screen time (<1h/day), evaluate blood pressure, fasting lipid panel, and ALT.";
		} else if (z > 2) {
			severity = "warning";
			status = "Childhood Overweight";
			badgeLabel = "Overweight (Z > +2)";
			clinicalAction =
				"Family-based dietary modification, whole grains, increased vegetable intake, promote active sports.";
		} else if (z < -2) {
			// Thinness already handled in wasting if applicable, or flag here
			severity = z < -3 ? "alert" : "warning";
			status = z < -3 ? "Severe Thinness" : "Thinness";
			badgeLabel = z < -3 ? "Severe Thinness" : "Thinness";
			clinicalAction =
				"Nutritional review, rule out inadequate caloric intake or malabsorption.";
		}

		triageItems.push({
			category: "bmi",
			title: "Body Mass Index (Adiposity)",
			metricLabel: "BMI-for-Age",
			zScore: z,
			percentile: bmifaEval.percentile,
			percentileBeyond: bmifaEval.percentileBeyond,
			status,
			badgeLabel,
			severity,
			measuredText: `BMI ${latest.bmi} kg/m²`,
			clinicalAction
		});
	}

	// Highest overall alert level
	const hasAlert = triageItems.some(t => t.severity === "alert");
	const hasWarning = triageItems.some(t => t.severity === "warning");

	// Velocity comparison
	let velocityNote: string | null = null;
	if (previous && latest.date !== previous.date) {
		const monthsDelta = Math.max(0.1, latest.ageMonths - previous.ageMonths);
		if (latest.weight && previous.weight) {
			const wtGain = latest.weight - previous.weight;
			const rateMonth = (wtGain / monthsDelta).toFixed(2);
			velocityNote = `Weight change: ${wtGain >= 0 ? "+" : ""}${wtGain.toFixed(2)} kg in ${monthsDelta.toFixed(1)} mo (${rateMonth} kg/mo)`;
		}
	}

	return (
		<div className='overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs'>
			{/* Triage Header Banner */}
			<div
				className={`flex flex-col justify-between gap-3 border-b px-5 py-4 sm:flex-row sm:items-center ${
					hasAlert
						? "border-rose-200 bg-rose-50/80 text-rose-950"
						: hasWarning
							? "border-amber-200 bg-amber-50/80 text-amber-950"
							: "border-emerald-200 bg-emerald-50/80 text-emerald-950"
				}`}
			>
				<div className='flex items-center gap-3'>
					<div
						className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
							hasAlert
								? "bg-rose-600 text-white shadow-xs"
								: hasWarning
									? "bg-amber-500 text-white shadow-xs"
									: "bg-emerald-600 text-white shadow-xs"
						}`}
					>
						{hasAlert ? (
							<ShieldAlert className='h-5 w-5' />
						) : hasWarning ? (
							<AlertTriangle className='h-5 w-5' />
						) : (
							<ShieldCheck className='h-5 w-5' />
						)}
					</div>
					<div>
						<div className='flex items-center gap-2'>
							<h3 className='text-sm font-bold tracking-tight'>
								{hasAlert
									? "Clinical Alert: High-Risk Growth Finding"
									: hasWarning
										? "Clinical Attention Required: Moderate Growth Deviation"
										: "Normal Pediatric Growth Profile"}
							</h3>
							<span className='rounded-full border bg-white/70 px-2 py-0.5 font-mono text-[11px] font-semibold'>
								Visit: {latest.date}
							</span>
						</div>
						<p className='mt-0.5 text-xs opacity-80'>
							Automated WHO & Egyptian National Growth Standard clinical triage
						</p>
					</div>
				</div>

				{velocityNote && (
					<div className='flex shrink-0 items-center gap-2 self-start rounded-lg border border-slate-200 bg-white/80 px-3 py-1.5 text-xs font-medium text-slate-700 sm:self-auto'>
						<TrendingUp className='h-4 w-4 text-teal-600' />
						<span>{velocityNote}</span>
					</div>
				)}
			</div>

			{/* 4 Core Pillars Grid */}
			<div className='grid grid-cols-1 gap-4 p-5 md:grid-cols-2'>
				{triageItems.map(item => {
					const isAlert = item.severity === "alert";
					const isWarning = item.severity === "warning";

					const cardBg = isAlert
						? "bg-rose-50/40 border-rose-200"
						: isWarning
							? "bg-amber-50/40 border-amber-200"
							: "bg-slate-50/70 border-slate-200";

					const badgeClass = isAlert
						? "bg-rose-100 text-rose-800 border-rose-200 font-bold"
						: isWarning
							? "bg-amber-100 text-amber-800 border-amber-200 font-bold"
							: "bg-emerald-100 text-emerald-800 border-emerald-200 font-semibold";

					return (
						<div
							className={`flex flex-col justify-between rounded-xl border p-4 transition-all ${cardBg}`}
							key={item.category}
						>
							<div>
								<div className='mb-2 flex items-start justify-between gap-2'>
									<div>
										<span className='text-[11px] font-semibold tracking-wider text-slate-500 uppercase'>
											{item.title}
										</span>
										<h4 className='mt-0.5 flex items-center gap-1.5 text-sm font-bold text-slate-900'>
											<span>{item.status}</span>
										</h4>
									</div>
									<span
										className={`shrink-0 rounded-md border px-2.5 py-1 text-[11px] tracking-wide uppercase ${badgeClass}`}
									>
										{item.badgeLabel}
									</span>
								</div>

								{/* Score Line */}
								<div className='mt-2 flex items-baseline gap-2 border-t border-slate-200/60 pt-2 font-mono'>
									{item.zScore !== null ? (
										<>
											<span className='text-xl font-extrabold text-slate-900'>
												{item.zScore > 0
													? `+${item.zScore.toFixed(2)}`
													: item.zScore.toFixed(2)}
											</span>
											<span className='font-sans text-xs text-slate-500'>
												SD (Z-score)
											</span>
											<span className='text-slate-300'>|</span>
											<span className='font-sans text-xs text-slate-600'>
												{item.percentileBeyond ??
													(item.percentile !== null
														? `${item.percentile.toFixed(1)}th %ile`
														: "—")}
											</span>
										</>
									) : (
										<span className='text-xs text-slate-400 italic'>
											Not evaluated
										</span>
									)}
									<span className='ml-auto font-sans text-xs font-medium text-slate-500'>
										{item.measuredText}
									</span>
								</div>
							</div>

							{/* Actionable Clinical Protocol */}
							<div className='mt-3 flex items-start gap-2 border-t border-slate-200/60 pt-2.5 text-xs'>
								<Stethoscope
									className={`mt-0.5 h-4 w-4 shrink-0 ${
										isAlert
											? "text-rose-600"
											: isWarning
												? "text-amber-600"
												: "text-teal-600"
									}`}
								/>
								<p className='leading-relaxed font-normal text-slate-700'>
									<strong className='font-medium text-slate-900'>
										Protocol:{" "}
									</strong>
									{item.clinicalAction}
								</p>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};
