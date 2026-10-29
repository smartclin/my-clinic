/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Egyptian National Drug Formulary Explorer & Calculator
 * Official Egyptian Drug Authority (EDA) Guidelines:
 * - Antimicrobial Formulary (EDA.DUPP.Formulary.001)
 * - Gastrointestinal Tract Medications Formulary (EDA.DUPP.Formulary.008)
 * - Respiratory System Medications Formulary (EDA.DUPP.Formulary.010)
 */

import {
	AlertTriangle,
	Building2,
	Check,
	ChevronDown,
	ChevronUp,
	Copy,
	FlaskConical,
	Info,
	Pill,
	Scale,
	Search,
	ShieldAlert,
	Sparkles,
	Syringe,
	Utensils
} from "lucide-react";
import React, { useMemo, useState } from "react";

import { EGYPTIAN_NATIONAL_FORMULARY } from "#/data/egyptianNationalFormulary.ts";
import type { Measurement, Patient } from "#/db/schema.ts";
import type { DrugMonograph } from "#/types/formulary.ts";
import {
	calculateFormularyDosage,
	type FormularyDoseResult,
	searchFormulary
} from "#/utils/formularySearch.ts";
import { calculateAgeMonths } from "#/utils/lmsCalculations.ts";

interface FormularyExplorerProps {
	selectedPatient: Patient | null;
	measurements: Measurement[];
	onSelectDrugForPrescription?: (
		drug: DrugMonograph,
		result: FormularyDoseResult
	) => void;
}

type FormularyCategoryFilter =
	| "All"
	| "Antimicrobial"
	| "Gastrointestinal"
	| "Respiratory";
type AwareFilter = "All" | "Access" | "Watch" | "Reserve";

export const FormularyExplorer: React.FC<FormularyExplorerProps> = ({
	selectedPatient,
	measurements,
	onSelectDrugForPrescription
}) => {
	// Determine patient's latest weight & age
	const latestMeasurement = useMemo(() => {
		if (!measurements || measurements.length === 0) return null;
		return [...measurements].sort(
			(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
		)[0];
	}, [measurements]);

	const patientAgeMonths = useMemo(() => {
		if (!selectedPatient?.dob) return 24; // default 2 years if none
		const today = new Date().toISOString().split("T")[0];
		return calculateAgeMonths(selectedPatient.dob, today);
	}, [selectedPatient]);

	const defaultWeight = latestMeasurement?.weight || 12.0;
	const [activeWeight, setActiveWeight] = useState<number>(defaultWeight);
	const [isWeightOverridden, setIsWeightOverridden] = useState(false);

	// Search & Filter state
	const [searchQuery, setSearchQuery] = useState("");
	const [categoryFilter, setCategoryFilter] =
		useState<FormularyCategoryFilter>("All");
	const [awareFilter, setAwareFilter] = useState<AwareFilter>("All");

	// Per-drug presentation and custom dose selections
	const [selectedPresentations, setSelectedPresentations] = useState<
		Record<string, string>
	>({});
	const [customDoses] = useState<Record<string, number>>({});
	const [expandedSections, setExpandedSections] = useState<
		Record<string, boolean>
	>({});
	const [copiedId, setCopiedId] = useState<string | null>(null);

	// Sync weight if patient changes and no manual override is active
	React.useEffect(() => {
		if (latestMeasurement?.weight && !isWeightOverridden) {
			setActiveWeight(latestMeasurement.weight);
		}
	}, [latestMeasurement, isWeightOverridden]);

	// Filtered drugs using unified searchFormulary
	const filteredDrugs = useMemo(() => {
		return searchFormulary(
			searchQuery,
			{
				category: categoryFilter,
				awareClassification: awareFilter !== "All" ? awareFilter : undefined
			},
			EGYPTIAN_NATIONAL_FORMULARY
		);
	}, [categoryFilter, awareFilter, searchQuery]);

	const handleCopy = (drugId: string, text: string) => {
		navigator.clipboard.writeText(text);
		setCopiedId(drugId);
		setTimeout(() => {
			setCopiedId(curr => (curr === drugId ? null : curr));
		}, 2000);
	};

	const toggleExpand = (drugId: string) => {
		setExpandedSections(prev => ({ ...prev, [drugId]: !prev[drugId] }));
	};

	const getAwareBadge = (aware?: string) => {
		switch (aware) {
			case "Access":
				return (
					<span className='inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-800'>
						<span className='h-1.5 w-1.5 rounded-full bg-emerald-600' />
						AWaRe: Access
					</span>
				);
			case "Watch":
				return (
					<span className='inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-100 px-2 py-0.5 text-[11px] font-bold text-amber-800'>
						<span className='h-1.5 w-1.5 rounded-full bg-amber-600' />
						AWaRe: Watch
					</span>
				);
			case "Reserve":
				return (
					<span className='inline-flex animate-pulse items-center gap-1 rounded-full border border-rose-200 bg-rose-100 px-2 py-0.5 text-[11px] font-bold text-rose-800'>
						<span className='h-1.5 w-1.5 rounded-full bg-rose-600' />
						AWaRe: Reserve
					</span>
				);
			default:
				return null;
		}
	};

	return (
		<div className='space-y-6'>
			{/* Official Header & Weight Synchronizer */}
			<div className='rounded-xl border border-slate-200 bg-white p-5 shadow-xs'>
				<div className='flex flex-col justify-between gap-4 lg:flex-row lg:items-center'>
					<div className='flex items-center gap-3'>
						<div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-600 text-white shadow-xs'>
							<FlaskConical className='h-6 w-6' />
						</div>
						<div>
							<div className='flex items-center gap-2'>
								<h2 className='text-base font-bold text-slate-900'>
									Egyptian National Drug Formulary (EDA)
								</h2>
								<span className='rounded border border-teal-200 bg-teal-50 px-2 py-0.5 text-[11px] font-semibold text-teal-700'>
									50 Monographs
								</span>
							</div>
							<p className='mt-0.5 text-xs text-slate-500'>
								Official Egyptian monographs for Antimicrobial,
								Gastrointestinal, and Respiratory medicines with commercial
								brand names registered in Egypt.
							</p>
						</div>
					</div>

					{/* Patient Weight Controller */}
					<div className='flex shrink-0 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-2.5'>
						<div className='flex items-center gap-2'>
							<Scale className='h-4 w-4 text-teal-600' />
							<span className='text-xs font-bold text-slate-700'>
								Dosing Weight:
							</span>
						</div>
						<div className='flex items-center gap-1.5'>
							<input
								className='w-18 rounded-md border border-slate-300 bg-white px-2 py-1 text-center text-sm font-bold text-slate-900 focus:ring-2 focus:ring-teal-500/20 focus:outline-none'
								max='120'
								min='0.5'
								onChange={e => {
									const val = Number.parseFloat(e.target.value);
									setActiveWeight(Number.isNaN(val) ? 10 : val);
									setIsWeightOverridden(true);
								}}
								step='0.1'
								type='number'
								value={activeWeight}
							/>
							<span className='text-xs font-semibold text-slate-600'>kg</span>
						</div>
						{isWeightOverridden && latestMeasurement?.weight && (
							<button
								className='ml-1 text-[11px] font-semibold text-teal-600 underline hover:text-teal-700'
								onClick={() => {
									if (latestMeasurement?.weight) {
										setActiveWeight(latestMeasurement.weight);
										setIsWeightOverridden(false);
									}
								}}
								title='Reset to latest clinical measurement'
								type='button'
							>
								Reset ({latestMeasurement.weight} kg)
							</button>
						)}
					</div>
				</div>

				{/* Filter Controls Bar */}
				<div className='mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4'>
					{/* Search box */}
					<div className='relative min-w-[260px] flex-1'>
						<input
							className='w-full rounded-lg border border-slate-200 bg-slate-50 py-1.5 pr-3 pl-9 text-xs focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20 focus:outline-none'
							onChange={e => setSearchQuery(e.target.value)}
							placeholder='Search generic, Egyptian brands (e.g. Augmentin, Nexium, Ventolin), symptoms...'
							type='text'
							value={searchQuery}
						/>
						<Search className='absolute top-2 left-3 h-4 w-4 text-slate-400' />
					</div>

					{/* Category Tabs */}
					<div className='flex items-center gap-1 rounded-lg bg-slate-100 p-1 text-xs font-medium text-slate-600'>
						{(
							[
								"All",
								"Antimicrobial",
								"Gastrointestinal",
								"Respiratory"
							] as FormularyCategoryFilter[]
						).map(cat => (
							<button
								className={`rounded px-3 py-1 transition-colors ${
									categoryFilter === cat
										? "bg-white font-bold text-slate-900 shadow-xs"
										: "hover:text-slate-900"
								}`}
								key={cat}
								onClick={() => setCategoryFilter(cat)}
								type='button'
							>
								{cat}
							</button>
						))}
					</div>

					{/* AWaRe filter (only for antibiotics) */}
					{categoryFilter === "Antimicrobial" && (
						<div className='flex items-center gap-1 rounded-lg bg-slate-100 p-1 text-xs font-medium text-slate-600'>
							<span className='px-2 text-[10px] font-bold tracking-wider text-slate-400 uppercase'>
								AWaRe:
							</span>
							{(["All", "Access", "Watch", "Reserve"] as AwareFilter[]).map(
								aw => (
									<button
										className={`rounded px-2.5 py-1 text-[11px] transition-colors ${
											awareFilter === aw
												? "bg-white font-bold text-slate-900 shadow-xs"
												: "hover:text-slate-900"
										}`}
										key={aw}
										onClick={() => setAwareFilter(aw)}
										type='button'
									>
										{aw}
									</button>
								)
							)}
						</div>
					)}
				</div>
			</div>

			{/* Drug Cards Grid */}
			{filteredDrugs.length === 0 ? (
				<div className='rounded-xl border border-slate-200 bg-white p-12 text-center text-slate-400'>
					<Pill className='mx-auto mb-2 h-10 w-10 text-slate-300' />
					<h3 className='text-base font-bold text-slate-800'>
						No Medications Found
					</h3>
					<p className='mt-1 text-xs text-slate-500'>
						Try adjusting your search query, commercial brand name, or category
						filter.
					</p>
				</div>
			) : (
				<div className='grid grid-cols-1 gap-5 md:grid-cols-2'>
					{filteredDrugs.map(drug => {
						const selectedPresId =
							selectedPresentations[drug.id] ||
							drug.presentations.find(p => p.isDefault)?.id ||
							drug.presentations[0]?.id;
						const customDose = customDoses[drug.id];

						const calc = calculateFormularyDosage({
							drug,
							weightKg: activeWeight,
							ageMonths: patientAgeMonths,
							selectedPresentationId: selectedPresId,
							customDosePerKg: customDose
						});

						const isExpanded = expandedSections[drug.id];
						const blackBoxList =
							drug.blackBoxWarnings && drug.blackBoxWarnings.length > 0
								? drug.blackBoxWarnings
								: null;
						const hasG6PD = Boolean(drug.g6pdWarning);
						const hasPenicillinCross = Boolean(
							drug.penicillinAllergyCrossReactive
						);

						return (
							<div
								className='flex flex-col justify-between overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs transition-colors hover:border-teal-300'
								key={drug.id}
							>
								{/* Header Zone */}
								<div className='space-y-2 border-b border-slate-100 p-4'>
									<div className='flex items-start justify-between gap-3'>
										<div>
											<div className='flex flex-wrap items-center gap-2'>
												<h3 className='text-base leading-tight font-bold text-slate-900'>
													{drug.genericName}
												</h3>
												{getAwareBadge(drug.awareClassification)}
												<span className='rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 uppercase'>
													{drug.atcCode}
												</span>
											</div>
											<div className='mt-1 flex flex-wrap items-center gap-1.5 text-xs font-medium text-teal-700'>
												<Building2 className='h-3.5 w-3.5 shrink-0 text-teal-600' />
												<span>Egyptian Brands:</span>
												<span className='font-semibold text-slate-800'>
													{drug.brandNamesEgypt.join(", ")}
												</span>
											</div>
										</div>
										<span className='shrink-0 rounded bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700'>
											{drug.routes.join(", ")}
										</span>
									</div>

									{/* Pharmacological Category & Indications */}
									<p className='line-clamp-1 text-xs text-slate-500'>
										<span className='font-semibold text-slate-700'>
											{drug.pharmacologicalCategory}
										</span>{" "}
										• {drug.indications.slice(0, 3).join(", ")}
									</p>
								</div>

								{/* Body Zone: Dosing & Calculations */}
								<div className='space-y-4 p-4'>
									{/* Presentation Selector */}
									<div className='space-y-1'>
										<label
											className='flex items-center justify-between text-xs font-bold text-slate-700'
											htmlFor={`presentation-${drug.id}`}
										>
											<span>Available Egyptian Strengths & Forms:</span>
											<span className='text-[10px] font-medium text-slate-400'>
												{drug.presentations.length} Presentation
												{drug.presentations.length > 1 ? "s" : ""}
											</span>
										</label>
										<select
											className='w-full rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-teal-500/20 focus:outline-none'
											id={`presentation-${drug.id}`}
											onChange={e =>
												setSelectedPresentations(prev => ({
													...prev,
													[drug.id]: e.target.value
												}))
											}
											value={selectedPresId}
										>
											{drug.presentations.map(p => (
												<option
													key={p.id}
													value={p.id}
												>
													{p.form} — {p.strength} ({p.route})
													{p.commercialBrandsEgypt
														? ` [${p.commercialBrandsEgypt.join(", ")}]`
														: ""}
												</option>
											))}
										</select>
									</div>

									{/* Calculated Dose Highlight */}
									<div className='space-y-2 rounded-xl border border-teal-200/80 bg-teal-50/70 p-3.5'>
										<div className='flex items-center justify-between'>
											<span className='flex items-center gap-1.5 text-xs font-bold tracking-wider text-teal-900 uppercase'>
												<Sparkles className='h-3.5 w-3.5 text-teal-600' />
												Calculated Pediatric Dose ({activeWeight} kg)
											</span>
											<span className='text-xs font-semibold text-teal-700'>
												{calc.frequency}
											</span>
										</div>

										<div className='flex items-baseline justify-between gap-3 pt-1'>
											<div>
												<div className='flex items-baseline gap-1.5'>
													<span className='text-2xl font-black text-teal-950'>
														{calc.singleDoseMg}
													</span>
													<span className='text-xs font-bold text-teal-800'>
														mg / dose
													</span>
												</div>
												<span className='text-[11px] font-semibold text-teal-700'>
													Total Daily: {calc.dailyDoseMg} mg/day (
													{calc.dosesPerDay} doses)
												</span>
											</div>

											{/* Liquid Volume if suspension/drops */}
											{typeof calc.liquidVolumeMl === "number" && (
												<div className='text-right'>
													<div className='flex items-baseline justify-end gap-1'>
														<span className='text-2xl font-black text-emerald-800'>
															{calc.liquidVolumeMl}
														</span>
														<span className='text-xs font-bold text-emerald-800'>
															mL
														</span>
													</div>
													<span className='text-[11px] font-semibold text-emerald-700'>
														{calc.liquidVolumePerDayMl} mL / day
													</span>
												</div>
											)}
										</div>

										{/* Dose Capping Warnings */}
										{(calc.isCappedBySingleLimit ||
											calc.isCappedByDailyLimit) && (
											<div className='mt-2 flex items-center gap-1.5 rounded border border-amber-300 bg-amber-100/90 p-2 text-xs font-semibold text-amber-900'>
												<AlertTriangle className='h-4 w-4 shrink-0 text-amber-700' />
												<span>
													Dose capped at maximum safety limit:{" "}
													{drug.pediatricDosing.maxSingleDoseMg
														? `${drug.pediatricDosing.maxSingleDoseMg} mg/single`
														: ""}
													{drug.pediatricDosing.maxDailyDoseMg
														? ` | ${drug.pediatricDosing.maxDailyDoseMg} mg/day`
														: ""}
												</span>
											</div>
										)}

										{/* Age Contraindication */}
										{calc.ageContraindicated && (
											<div className='mt-2 flex items-center gap-1.5 rounded border border-rose-300 bg-rose-100 p-2 text-xs font-bold text-rose-900'>
												<ShieldAlert className='h-4 w-4 shrink-0 text-rose-700' />
												<span>{calc.ageContraindicationReason}</span>
											</div>
										)}
									</div>

									{/* Black Box & High Risk Warnings */}
									{blackBoxList && (
										<div className='space-y-1 rounded-lg border border-rose-200 bg-rose-50 p-2.5 text-xs text-rose-900'>
											<div className='flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-rose-800 uppercase'>
												<ShieldAlert className='h-4 w-4 text-rose-600' />
												<span>Black Box Safety Warning</span>
											</div>
											<p className='text-[11px] leading-relaxed text-rose-800'>
												{blackBoxList.join(" ")}
											</p>
										</div>
									)}

									{/* Food & Allergy Alerts */}
									<div className='flex flex-wrap gap-2 text-[11px]'>
										<div className='inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-1 font-medium text-slate-700'>
											<Utensils className='h-3.5 w-3.5 text-slate-500' />
											<span>{drug.foodCorrelation}</span>
										</div>

										{hasG6PD && (
											<div className='inline-flex items-center gap-1 rounded border border-amber-200 bg-amber-50 px-2 py-1 font-semibold text-amber-800'>
												<AlertTriangle className='h-3.5 w-3.5 text-amber-600' />
												<span>G6PD Hemolysis Risk</span>
											</div>
										)}

										{hasPenicillinCross && (
											<div className='inline-flex items-center gap-1 rounded border border-rose-200 bg-rose-50 px-2 py-1 font-semibold text-rose-800'>
												<ShieldAlert className='h-3.5 w-3.5 text-rose-600' />
												<span>Penicillin Cross-Allergy</span>
											</div>
										)}
									</div>

									{/* Expandable Clinical Details (Renal, Hepatic, Dilution, Interactions) */}
									<div className='overflow-hidden rounded-lg border border-slate-200'>
										<button
											className='flex w-full items-center justify-between bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100'
											onClick={() => toggleExpand(drug.id)}
											type='button'
										>
											<span className='flex items-center gap-1.5'>
												<Info className='h-3.5 w-3.5 text-teal-600' />
												<span>
													Monograph Details (Renal, Hepatic & Dilution)
												</span>
											</span>
											{isExpanded ? (
												<ChevronUp className='h-4 w-4 text-slate-400' />
											) : (
												<ChevronDown className='h-4 w-4 text-slate-400' />
											)}
										</button>

										{isExpanded && (
											<div className='space-y-3 border-t border-slate-200 bg-white p-3 text-xs text-slate-600'>
												{/* Renal adjustment */}
												<div>
													<span className='block font-bold text-slate-800'>
														Renal Dose Adjustment:
													</span>
													<div className='mt-1 space-y-1 text-[11px] text-slate-700'>
														{drug.renalAdjustment.crClNormal && (
															<div>
																• Normal: {drug.renalAdjustment.crClNormal}
															</div>
														)}
														{drug.renalAdjustment.crClMildToModerate && (
															<div>
																• Mild-Moderate:{" "}
																{drug.renalAdjustment.crClMildToModerate}
															</div>
														)}
														{drug.renalAdjustment.crClSevere && (
															<div>
																• Severe: {drug.renalAdjustment.crClSevere}
															</div>
														)}
														{drug.renalAdjustment.dialysis && (
															<div>
																• Dialysis: {drug.renalAdjustment.dialysis}
															</div>
														)}
													</div>
												</div>

												{/* Hepatic adjustment */}
												<div>
													<span className='block font-bold text-slate-800'>
														Hepatic Adjustment:
													</span>
													<p className='mt-0.5 text-slate-700'>
														{drug.hepaticAdjustment}
													</p>
												</div>

												{/* Reconstitution & Preparation */}
												{drug.preparationAndInfusion && (
													<div className='space-y-1 rounded border border-slate-200 bg-slate-50 p-2'>
														<span className='flex items-center gap-1 font-bold text-slate-800'>
															<Syringe className='h-3.5 w-3.5 text-teal-600' />
															<span>Infusion / Reconstitution:</span>
														</span>
														{drug.preparationAndInfusion
															.reconstitutionDiluent && (
															<p className='text-[11px] text-slate-600'>
																Diluent:{" "}
																{
																	drug.preparationAndInfusion
																		.reconstitutionDiluent
																}
															</p>
														)}
														{drug.preparationAndInfusion.infusionRate && (
															<p className='text-[11px] text-slate-600'>
																Rate: {drug.preparationAndInfusion.infusionRate}
															</p>
														)}
														{drug.preparationAndInfusion.stability && (
															<p className='text-[11px] text-slate-600'>
																Stability:{" "}
																{drug.preparationAndInfusion.stability}
															</p>
														)}
													</div>
												)}

												{/* Key Adverse Reactions */}
												<div>
													<span className='block font-bold text-slate-800'>
														Adverse Reactions:
													</span>
													<p className='mt-0.5 text-slate-600'>
														{drug.majorAdverseReactions.join("; ")}
													</p>
												</div>

												{/* Severe Interactions (Risk X / D) */}
												{((drug.riskXInteractions &&
													drug.riskXInteractions.length > 0) ||
													(drug.riskDInteractions &&
														drug.riskDInteractions.length > 0)) && (
													<div>
														<span className='block font-bold text-rose-800'>
															Interactions (Risk X/D):
														</span>
														<div className='mt-1 space-y-1'>
															{drug.riskXInteractions?.map((int, i) => (
																<div
																	className='rounded border border-rose-200/60 bg-rose-50/60 p-1.5 text-[11px] text-rose-900'
																	key={`x-${i}`}
																>
																	<span className='font-bold'>
																		[Risk X - Avoid]:
																	</span>{" "}
																	{int}
																</div>
															))}
															{drug.riskDInteractions?.map((int, i) => (
																<div
																	className='rounded border border-amber-200/60 bg-amber-50/60 p-1.5 text-[11px] text-amber-900'
																	key={`d-${i}`}
																>
																	<span className='font-bold'>
																		[Risk D - Modify]:
																	</span>{" "}
																	{int}
																</div>
															))}
														</div>
													</div>
												)}
											</div>
										)}
									</div>
								</div>

								{/* Footer Zone: Instruction & Action Buttons */}
								<div className='flex items-center justify-between gap-2 border-t border-slate-200 bg-slate-50 p-3'>
									<div
										className='flex-1 truncate font-mono text-[11px] text-slate-700'
										title={calc.prescriptionInstruction}
									>
										{calc.prescriptionInstruction}
									</div>
									<div className='flex shrink-0 items-center gap-1.5'>
										<button
											className={`flex items-center gap-1 rounded px-2.5 py-1 text-xs font-semibold transition-colors ${
												copiedId === drug.id
													? "bg-emerald-600 text-white"
													: "border border-slate-300 bg-white text-slate-700 hover:bg-slate-200"
											}`}
											onClick={() =>
												handleCopy(drug.id, calc.prescriptionInstruction)
											}
											type='button'
										>
											{copiedId === drug.id ? (
												<>
													<Check className='h-3.5 w-3.5' />
													<span>Copied</span>
												</>
											) : (
												<>
													<Copy className='h-3.5 w-3.5' />
													<span>Copy Rx</span>
												</>
											)}
										</button>

										{onSelectDrugForPrescription && (
											<button
												className='flex items-center gap-1 rounded bg-teal-600 px-2.5 py-1 text-xs font-semibold text-white transition-colors hover:bg-teal-700'
												onClick={() => onSelectDrugForPrescription(drug, calc)}
												type='button'
											>
												<Pill className='h-3.5 w-3.5' />
												<span>Use in Rx</span>
											</button>
										)}
									</div>
								</div>
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
};
