/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Pediatric Drug Dosage & Neonatal Medication Calculator
 * Weight-linked, card-based clinical calculator with renal/hepatic safety flags,
 * max dose cap protection, and liquid suspension volume calculators.
 */

import {
	AlertTriangle,
	Check,
	ChevronDown,
	ChevronUp,
	Copy,
	Filter,
	FlaskConical,
	Info,
	Pill,
	RotateCcw,
	Scale,
	Search,
	ShieldAlert,
	Sliders,
	Syringe
} from "lucide-react";
import React, { useMemo, useState } from "react";

import { NEONATAL_PEDIATRIC_FORMULARY } from "#/data/neonatalDrugs.ts";
import type { Measurement, Patient } from "#/types/growth.ts";
import type { DrugCategory } from "#/types/medication.ts";
import { calculateDrugDosage } from "#/utils/medicationCalculations.ts";

import { FormularyExplorer } from "./FormularyExplorer.tsx";

interface MedicationCalculatorProps {
	selectedPatient: Patient | null;
	measurements: Measurement[];
	onOpenPatientModal?: () => void;
}

const CATEGORIES: { label: string; value: DrugCategory | "All" }[] = [
	{ label: "All Medications", value: "All" },
	{ label: "Antibiotics", value: "Antibiotic" },
	{ label: "Antipyretics / Analgesics", value: "Antipyretic/Analgesic" },
	{ label: "Emergency / Resuscitation", value: "Emergency/Resuscitation" },
	{ label: "Anticonvulsants", value: "Anticonvulsant" },
	{ label: "Cardiac & Diuretics", value: "Cardiovascular/Diuretic" },
	{ label: "Respiratory", value: "Respiratory" },
	{ label: "Gastrointestinal", value: "Gastrointestinal" }
];

const WEIGHT_PRESETS = [
	{ label: "Preterm (1.5 kg)", weight: 1.5 },
	{ label: "Neonate (3.5 kg)", weight: 3.5 },
	{ label: "Infant (6.0 kg)", weight: 6.0 },
	{ label: "Toddler (10.0 kg)", weight: 10.0 },
	{ label: "Child (18.0 kg)", weight: 18.0 },
	{ label: "Adolescent (35.0 kg)", weight: 35.0 }
];

export const MedicationCalculator: React.FC<MedicationCalculatorProps> = ({
	selectedPatient,
	measurements
}) => {
	// Determine patient's latest weight
	const latestMeasurement = useMemo(() => {
		if (!measurements || measurements.length === 0) return null;
		return [...measurements].sort(
			(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
		)[0];
	}, [measurements]);

	const defaultWeight = latestMeasurement?.weight || 10.0;
	const [activeWeight, setActiveWeight] = useState<number>(defaultWeight);
	const [isWeightOverridden, setIsWeightOverridden] = useState(false);

	// Search & Filter state
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategory, setSelectedCategory] = useState<
		DrugCategory | "All"
	>("All");

	// Formulary database selection: EDA vs NICU
	const [formularyMode, setFormularyMode] = useState<"eda" | "nicu">("eda");

	// Per-drug interactive custom dose & concentration selections
	const [drugCustomDoses, setDrugCustomDoses] = useState<
		Record<string, number>
	>({});
	const [drugCustomConcentrations, setDrugCustomConcentrations] = useState<
		Record<string, string>
	>({});
	const [expandedSafety, setExpandedSafety] = useState<Record<string, boolean>>(
		{}
	);
	const [confirmedConcentrations, setConfirmedConcentrations] = useState<
		Record<string, boolean>
	>({});
	const [copiedId, setCopiedId] = useState<string | null>(null);

	// Sync weight if patient changes and no manual override is active
	React.useEffect(() => {
		if (latestMeasurement?.weight && !isWeightOverridden) {
			setActiveWeight(latestMeasurement.weight);
		}
	}, [latestMeasurement, isWeightOverridden]);

	// Filtered drug formulary list
	const filteredDrugs = useMemo(() => {
		return NEONATAL_PEDIATRIC_FORMULARY.filter(drug => {
			const matchesCategory =
				selectedCategory === "All" || drug.category === selectedCategory;
			const query = searchQuery.toLowerCase().trim();
			const matchesSearch =
				!query ||
				drug.name.toLowerCase().includes(query) ||
				drug.genericName.toLowerCase().includes(query) ||
				drug.indication.toLowerCase().includes(query) ||
				drug.routes.some(r => r.toLowerCase().includes(query));
			return matchesCategory && matchesSearch;
		});
	}, [searchQuery, selectedCategory]);

	const handleCopyPrescription = (drugId: string, text: string) => {
		navigator.clipboard.writeText(text);
		setCopiedId(drugId);
		setTimeout(() => {
			setCopiedId(current => (current === drugId ? null : current));
		}, 2000);
	};

	const handleResetWeight = () => {
		if (latestMeasurement?.weight) {
			setActiveWeight(latestMeasurement.weight);
			setIsWeightOverridden(false);
		} else {
			setActiveWeight(10.0);
			setIsWeightOverridden(false);
		}
	};

	const toggleSafetyExpand = (drugId: string) => {
		setExpandedSafety(prev => ({ ...prev, [drugId]: !prev[drugId] }));
	};

	return (
		<div className='mx-auto max-w-7xl space-y-6'>
			{/* Formulary Database Selector Tabs */}
			<div className='flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3'>
				<button
					className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all ${
						formularyMode === "eda"
							? "bg-teal-600 text-white shadow-xs"
							: "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900"
					}`}
					onClick={() => setFormularyMode("eda")}
					type='button'
				>
					<FlaskConical className='h-4 w-4' />
					<span>Egyptian National Drug Formulary (EDA)</span>
					<span
						className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold ${
							formularyMode === "eda"
								? "bg-white/20 text-white"
								: "border border-teal-200 bg-teal-50 text-teal-700"
						}`}
					>
						50 Monographs
					</span>
				</button>

				<button
					className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all ${
						formularyMode === "nicu"
							? "bg-teal-600 text-white shadow-xs"
							: "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900"
					}`}
					onClick={() => setFormularyMode("nicu")}
					type='button'
				>
					<Pill className='h-4 w-4' />
					<span>NICU & Emergency Quick Reference</span>
					<span
						className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold ${
							formularyMode === "nicu"
								? "bg-white/20 text-white"
								: "bg-slate-100 text-slate-600"
						}`}
					>
						{NEONATAL_PEDIATRIC_FORMULARY.length} Drugs
					</span>
				</button>
			</div>

			{formularyMode === "eda" ? (
				<FormularyExplorer
					measurements={measurements}
					selectedPatient={selectedPatient}
				/>
			) : (
				<>
					{/* Top Patient & Weight Synchronizer Bar */}
					<div className='rounded-xl border border-slate-200 bg-white p-5 shadow-xs'>
						<div className='flex flex-col justify-between gap-4 lg:flex-row lg:items-center'>
							{/* Patient Details */}
							<div className='flex items-center gap-3'>
								<div className='flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-teal-100 bg-teal-50 text-teal-700'>
									<Pill className='h-5 w-5 text-teal-600' />
								</div>
								<div>
									<div className='flex items-center gap-2'>
										<h2 className='text-base font-bold text-slate-900'>
											Pediatric & Neonatal Medication Calculator
										</h2>
										<span className='rounded-full border border-teal-200 bg-teal-50 px-2 py-0.5 text-[11px] font-semibold text-teal-700'>
											Formulary: {NEONATAL_PEDIATRIC_FORMULARY.length} Drugs
										</span>
									</div>
									<p className='mt-0.5 text-xs text-slate-500'>
										{selectedPatient ? (
											<>
												Linked Patient:{" "}
												<strong className='text-slate-800'>
													{selectedPatient.name}
												</strong>{" "}
												({selectedPatient.gender}, DOB: {selectedPatient.dob})
											</>
										) : (
											"No patient selected. Utilizing standalone clinical dosage calculator."
										)}
									</p>
								</div>
							</div>

							{/* Active Weight Input & Presets */}
							<div className='flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-2.5'>
								<div className='flex items-center gap-2'>
									<Scale className='h-4 w-4 shrink-0 text-teal-600' />
									<label
										className='text-xs font-bold whitespace-nowrap text-slate-700'
										htmlFor='active-weight'
									>
										Patient Weight:
									</label>
									<div className='relative'>
										<input
											className='w-24 rounded-lg border border-slate-300 bg-white px-2.5 py-1 pr-7 text-right text-sm font-bold text-teal-900 focus:ring-2 focus:ring-teal-500 focus:outline-hidden'
											id='active-weight'
											max='120'
											min='0.4'
											onChange={e => {
												setActiveWeight(Number.parseFloat(e.target.value) || 0);
												setIsWeightOverridden(true);
											}}
											step='0.05'
											type='number'
											value={activeWeight}
										/>
										<span className='pointer-events-none absolute top-1.5 right-2 text-xs font-semibold text-slate-400'>
											kg
										</span>
									</div>
								</div>

								{/* Reset to DB weight if overridden */}
								{isWeightOverridden && latestMeasurement?.weight && (
									<button
										className='flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100'
										onClick={handleResetWeight}
										title='Reset to latest recorded measurement weight'
										type='button'
									>
										<RotateCcw className='h-3 w-3 text-slate-500' />
										<span>Reset to {latestMeasurement.weight} kg</span>
									</button>
								)}

								{/* Quick Weight Presets */}
								<div className='hidden items-center gap-1 border-l border-slate-200 pl-3 sm:flex'>
									<span className='mr-1 text-[10px] font-semibold tracking-wider text-slate-400 uppercase'>
										Presets:
									</span>
									{WEIGHT_PRESETS.slice(0, 4).map(p => (
										<button
											className={`rounded px-2 py-0.5 text-[11px] font-medium transition-colors ${
												activeWeight === p.weight
													? "bg-teal-600 text-white"
													: "border border-slate-200 bg-white text-slate-600 hover:bg-slate-200"
											}`}
											key={p.label}
											onClick={() => {
												setActiveWeight(p.weight);
												setIsWeightOverridden(true);
											}}
											type='button'
										>
											{p.weight} kg
										</button>
									))}
								</div>
							</div>
						</div>
					</div>

					{/* Filter & Search Bar */}
					<div className='space-y-3'>
						<div className='flex flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-center'>
							{/* Search Box */}
							<div className='relative max-w-md flex-1'>
								<Search className='pointer-events-none absolute top-3 left-3 h-4 w-4 text-slate-400' />
								<input
									className='w-full rounded-xl border border-slate-200 bg-white py-2 pr-4 pl-9 text-xs shadow-2xs focus:ring-2 focus:ring-teal-500 focus:outline-hidden'
									onChange={e => setSearchQuery(e.target.value)}
									placeholder='Search by drug name, generic, indication (e.g., Gentamicin, Sepsis, Croup)...'
									type='text'
									value={searchQuery}
								/>
							</div>

							<div className='text-xs font-medium text-slate-500'>
								Showing{" "}
								<strong className='text-slate-800'>
									{filteredDrugs.length}
								</strong>{" "}
								of {NEONATAL_PEDIATRIC_FORMULARY.length} clinical medications
							</div>
						</div>

						{/* Category Filter Pills */}
						<div className='flex items-center gap-1.5 overflow-x-auto pb-1 text-xs'>
							<Filter className='mr-1 ml-1 h-3.5 w-3.5 shrink-0 text-slate-400' />
							{CATEGORIES.map(cat => (
								<button
									className={`shrink-0 rounded-lg px-3 py-1.5 font-medium whitespace-nowrap transition-colors ${
										selectedCategory === cat.value
											? "bg-teal-700 text-white shadow-2xs"
											: "border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
									}`}
									key={cat.value}
									onClick={() => setSelectedCategory(cat.value)}
									type='button'
								>
									{cat.label}
								</button>
							))}
						</div>
					</div>

					{/* Drug Cards Grid */}
					{filteredDrugs.length === 0 ? (
						<div className='space-y-3 rounded-xl border border-slate-200 bg-white p-12 text-center'>
							<div className='mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400'>
								<Pill className='h-6 w-6' />
							</div>
							<h3 className='text-sm font-bold text-slate-800'>
								No matching medications found
							</h3>
							<p className='mx-auto max-w-md text-xs text-slate-500'>
								Try adjusting your search keywords or reset category filters to
								view all neonatal and pediatric formulary drugs.
							</p>
							<button
								className='rounded-lg bg-teal-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-teal-700'
								onClick={() => {
									setSearchQuery("");
									setSelectedCategory("All");
								}}
								type='button'
							>
								Clear Filters
							</button>
						</div>
					) : (
						<div className='grid grid-cols-1 gap-5 lg:grid-cols-2'>
							{filteredDrugs.map(drug => {
								const currentDose =
									drugCustomDoses[drug.id] ?? drug.standardDose;
								const currentConcentrationId =
									drugCustomConcentrations[drug.id] ??
									drug.concentrations.find(c => c.isDefault)?.id ??
									drug.concentrations[0]?.id;

								const calc = calculateDrugDosage({
									weightKg: activeWeight,
									drug,
									selectedDose: currentDose,
									selectedConcentrationId: currentConcentrationId
								});

								const isSafetyOpen = Boolean(expandedSafety[drug.id]);
								const hasSafetyAlert =
									calc.isCappedBySingleLimit ||
									calc.isCappedByDailyLimit ||
									Boolean(drug.safetyWarnings.renalAdjustment) ||
									Boolean(drug.safetyWarnings.neonatalContraindications);

								return (
									<div
										className='flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs transition-all hover:border-slate-300'
										key={drug.id}
									>
										{/* Card Header */}
										<div className='border-b border-slate-200 bg-slate-50/70 p-4'>
											<div className='flex items-start justify-between gap-3'>
												<div>
													<div className='flex flex-wrap items-center gap-1.5'>
														<h3 className='text-sm leading-tight font-bold text-slate-900'>
															{drug.name}
														</h3>
														<span className='rounded-md border border-teal-200 bg-teal-50 px-2 py-0.5 text-[10px] font-semibold text-teal-800'>
															{drug.category}
														</span>
													</div>
													<p className='mt-0.5 font-mono text-xs text-slate-500'>
														{drug.genericName}
													</p>
												</div>

												{/* Route badges */}
												<div className='flex shrink-0 items-center gap-1'>
													{drug.routes.map(route => (
														<span
															className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
																route === "IV"
																	? "border border-rose-200 bg-rose-50 text-rose-700"
																	: route === "Oral"
																		? "border border-blue-200 bg-blue-50 text-blue-700"
																		: route === "Inhalation"
																			? "border border-purple-200 bg-purple-50 text-purple-700"
																			: "border border-slate-200 bg-slate-100 text-slate-700"
															}`}
															key={route}
														>
															{route}
														</span>
													))}
												</div>
											</div>

											{/* Indication */}
											<div className='mt-2 line-clamp-2 text-xs text-slate-600'>
												<span className='font-semibold text-slate-700'>
													Indication:{" "}
												</span>
												{drug.indication}
											</div>
										</div>

										{/* Card Body: Dosage Adjustments & Preparation Selection */}
										<div className='flex-1 space-y-4 p-4'>
											{/* Dose slider & value */}
											<div className='space-y-1.5'>
												<div className='flex items-center justify-between text-xs'>
													<span className='flex items-center gap-1 font-semibold text-slate-700'>
														<Sliders className='h-3.5 w-3.5 text-teal-600' />
														<span>Prescribed Dose:</span>
													</span>
													<div className='flex items-center gap-1.5 font-mono'>
														<span className='text-xs font-bold text-teal-800'>
															{currentDose} {drug.doseUnit}
														</span>
														<span className='text-[11px] text-slate-400'>
															(Rec: {drug.minDose}–{drug.maxDose})
														</span>
													</div>
												</div>

												<div className='flex items-center gap-3'>
													<input
														className='h-1.5 flex-1 cursor-pointer rounded-lg bg-slate-200 accent-teal-600'
														max={drug.maxDose}
														min={drug.minDose}
														onChange={e =>
															setDrugCustomDoses(prev => ({
																...prev,
																[drug.id]: Number.parseFloat(e.target.value)
															}))
														}
														step={drug.maxDose - drug.minDose > 10 ? 1 : 0.1}
														type='range'
														value={currentDose}
													/>
													<button
														className='rounded px-1.5 py-0.5 text-[10px] font-semibold text-slate-500 transition-colors hover:bg-slate-100 hover:text-teal-700'
														onClick={() =>
															setDrugCustomDoses(prev => ({
																...prev,
																[drug.id]: drug.standardDose
															}))
														}
														title='Reset to standard dose'
														type='button'
													>
														Default
													</button>
												</div>
											</div>

											{/* Formulation / Concentration Selector */}
											<div className='space-y-1'>
												<label
													className='block text-xs font-semibold text-slate-700'
													htmlFor={`formulation-${drug.id}`}
												>
													Formulation & Concentration:
												</label>
												<select
													className='w-full rounded-lg border border-slate-300 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-teal-500 focus:outline-hidden'
													id={`formulation-${drug.id}`}
													onChange={e =>
														setDrugCustomConcentrations(prev => ({
															...prev,
															[drug.id]: e.target.value
														}))
													}
													value={currentConcentrationId}
												>
													{drug.concentrations.map(c => (
														<option
															key={c.id}
															value={c.id}
														>
															{c.label} ({c.route})
														</option>
													))}
												</select>
											</div>

											{/* Calculated Results Box */}
											<div className='space-y-2 rounded-xl border border-teal-200/80 bg-gradient-to-br from-teal-50 to-emerald-50/50 p-3.5'>
												<div className='grid grid-cols-2 gap-2 text-center'>
													{/* Single Dose Result */}
													<div className='rounded-lg border border-teal-100 bg-white/90 p-2 shadow-2xs'>
														<span className='block text-[10px] font-bold tracking-wider text-slate-500 uppercase'>
															Single Dose
														</span>
														<div className='mt-0.5 text-base font-extrabold text-teal-950'>
															{calc.singleDoseMg >= 1
																? calc.singleDoseMg
																: calc.singleDoseMg.toFixed(2)}{" "}
															<span className='text-xs font-medium text-teal-700'>
																mg
															</span>
														</div>
														{calc.cappedBy && (
															<span className='mt-0.5 block text-[10px] font-semibold text-rose-600'>
																{calc.cappedBy === "both"
																	? "Capped at Single & Daily Limits"
																	: calc.cappedBy === "single"
																		? "Capped at Max Single"
																		: "Capped at Max Daily"}
															</span>
														)}
													</div>

													{/* Liquid Volume Result */}
													<div className='rounded-lg bg-teal-600 p-2 text-white shadow-2xs'>
														<span className='block flex items-center justify-center gap-1 text-[10px] font-bold tracking-wider text-teal-100 uppercase'>
															<Syringe className='h-3 w-3 text-teal-200' />
															<span>Administer Volume</span>
														</span>
														<div className='mt-0.5 text-base font-extrabold text-white'>
															{calc.liquidVolumeMl !== undefined
																? calc.liquidVolumeMl
																: "—"}{" "}
															<span className='text-xs font-medium text-teal-100'>
																mL
															</span>
														</div>
														<span className='block truncate text-[10px] text-teal-100'>
															{calc.selectedConcentration?.route || "Dose"}
														</span>
													</div>
												</div>

												{/* Schedule & Daily Total */}
												<div className='flex items-center justify-between border-t border-teal-200/40 px-1 pt-1 text-xs text-slate-700'>
													<div>
														<span className='text-slate-500'>Frequency: </span>
														<strong className='text-slate-900'>
															{drug.frequency}
														</strong>
													</div>
													<div>
														<span className='text-slate-500'>
															Daily Total:{" "}
														</span>
														<strong className='text-slate-900'>
															{calc.dailyDoseMg} mg/day
														</strong>
													</div>
												</div>
											</div>

											{/* Max Dose Capping Safety Warning */}
											{(calc.isCappedBySingleLimit ||
												calc.isCappedByDailyLimit) && (
												<div className='flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 p-2.5 text-xs text-rose-800'>
													<ShieldAlert className='mt-0.5 h-4 w-4 shrink-0 text-rose-600' />
													<div>
														<strong className='block font-semibold'>
															Maximum Dose Safety Limit Enforced:
														</strong>
														<span>
															The calculated weight-based dosage exceeded the
															recommended safe adult/pediatric ceiling (
															{calc.isCappedBySingleLimit &&
																`Max Single: ${drug.maxSingleDoseMg} mg`}
															{calc.isCappedByDailyLimit &&
																` Max Daily: ${drug.maxDailyDoseMg} mg`}
															) and was safely capped.
														</span>
													</div>
												</div>
											)}

											{/* Collapsible Clinical & Renal/Hepatic Safety Details */}
											<div className='overflow-hidden rounded-lg border border-slate-200'>
												<button
													className='flex w-full items-center justify-between bg-slate-50 px-3 py-2 text-left text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100'
													onClick={() => toggleSafetyExpand(drug.id)}
													type='button'
												>
													<div className='flex items-center gap-1.5'>
														<AlertTriangle
															className={`h-3.5 w-3.5 ${hasSafetyAlert ? "text-amber-500" : "text-slate-400"}`}
														/>
														<span>Clinical Safety & Dilution Protocol</span>
													</div>
													{isSafetyOpen ? (
														<ChevronUp className='h-4 w-4 text-slate-400' />
													) : (
														<ChevronDown className='h-4 w-4 text-slate-400' />
													)}
												</button>

												{isSafetyOpen && (
													<div className='space-y-2.5 border-t border-slate-200 bg-white p-3 text-xs text-slate-600'>
														{/* Dilution guidelines */}
														{drug.dilutionGuideline && (
															<div>
																<span className='block font-semibold text-slate-800'>
																	Dilution & Administration:
																</span>
																<p className='mt-0.5 text-slate-600'>
																	{drug.dilutionGuideline}
																</p>
															</div>
														)}

														{/* Renal adjustment */}
														{drug.safetyWarnings.renalAdjustment && (
															<div className='rounded border border-amber-200/70 bg-amber-50/70 p-2 text-amber-900'>
																<span className='flex items-center gap-1 font-bold'>
																	<Info className='h-3.5 w-3.5 text-amber-600' />
																	<span>Renal Adjustment:</span>
																</span>
																<p className='mt-0.5 text-[11px] leading-relaxed text-amber-800'>
																	{drug.safetyWarnings.renalAdjustment}
																</p>
															</div>
														)}

														{/* Neonatal contraindications */}
														{drug.safetyWarnings.neonatalContraindications && (
															<div className='rounded border border-rose-200/70 bg-rose-50/70 p-2 text-rose-900'>
																<span className='flex items-center gap-1 font-bold'>
																	<ShieldAlert className='h-3.5 w-3.5 text-rose-600' />
																	<span>
																		Neonatal Caution / Contraindication:
																	</span>
																</span>
																<p className='mt-0.5 text-[11px] leading-relaxed text-rose-800'>
																	{
																		drug.safetyWarnings
																			.neonatalContraindications
																	}
																</p>
															</div>
														)}

														{/* Therapeutic monitoring */}
														{drug.safetyWarnings.monitoringNotes && (
															<div>
																<span className='block font-semibold text-slate-800'>
																	Therapeutic Monitoring:
																</span>
																<p className='mt-0.5 text-[11px] text-slate-600'>
																	{drug.safetyWarnings.monitoringNotes}
																</p>
															</div>
														)}
													</div>
												)}
											</div>
										</div>

										{/* Non-default concentration bedside confirmation */}
										{calc.requiresConcentrationConfirmation && (
											<div className='flex items-center gap-2 border-t border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900'>
												<input
													checked={Boolean(confirmedConcentrations[drug.id])}
													className='h-4 w-4 rounded border-amber-400 text-amber-600 focus:ring-amber-500'
													id={`confirm-conc-${drug.id}`}
													onChange={e =>
														setConfirmedConcentrations(prev => ({
															...prev,
															[drug.id]: e.target.checked
														}))
													}
													type='checkbox'
												/>
												<label
													className='cursor-pointer text-[11px] font-medium'
													htmlFor={`confirm-conc-${drug.id}`}
												>
													I confirm bedside availability of{" "}
													<strong>{calc.selectedConcentration?.label}</strong>{" "}
													(non-default concentration).
												</label>
											</div>
										)}

										{/* Card Footer: Prescription Summary & Copy Button */}
										<div className='flex items-center justify-between gap-2 border-t border-slate-200 bg-slate-50/90 p-3'>
											<div
												className='flex-1 truncate font-mono text-[11px] text-slate-600'
												title={calc.prescriptionText}
											>
												{calc.prescriptionText}
											</div>
											<button
												className={`flex shrink-0 items-center gap-1 rounded px-2.5 py-1 text-xs font-semibold transition-colors ${
													calc.requiresConcentrationConfirmation &&
													!confirmedConcentrations[drug.id]
														? "cursor-not-allowed border border-slate-200 bg-slate-100 text-slate-400"
														: copiedId === drug.id
															? "bg-emerald-600 text-white"
															: "border border-slate-300 bg-white text-slate-700 hover:bg-slate-200"
												}`}
												disabled={
													calc.requiresConcentrationConfirmation &&
													!confirmedConcentrations[drug.id]
												}
												onClick={() =>
													handleCopyPrescription(drug.id, calc.prescriptionText)
												}
												title={
													calc.requiresConcentrationConfirmation &&
													!confirmedConcentrations[drug.id]
														? "Check bedside concentration confirmation to enable copy"
														: "Copy prescription text"
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
										</div>
									</div>
								);
							})}
						</div>
					)}
				</>
			)}
		</div>
	);
};
