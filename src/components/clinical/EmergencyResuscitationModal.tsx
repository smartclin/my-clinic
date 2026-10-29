/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Pediatric Code Blue & Emergency Resuscitation Modal
 * High-Visibility, Rapid-Access Clinical Resuscitation System
 * Aligned with AHA PALS & ERC Emergency Guidelines.
 */

import {
	Activity,
	AlertTriangle,
	Check,
	Copy,
	Flame,
	HeartPulse,
	Pause,
	Pill,
	Play,
	Printer,
	RotateCcw,
	Scale,
	ShieldAlert,
	Sliders,
	Syringe,
	Timer,
	Volume2,
	VolumeX,
	Wind,
	X,
	Zap
} from "lucide-react";
import type React from "react";
import { useEffect, useMemo, useRef, useState } from "react";

import type { Measurement, Patient } from "#/types/growth";
import { calculateAgeMonths } from "#/utils/lmsCalculations";
import { generateEmergencyResuscitationSummary } from "#/utils/resuscitationCalculations";

interface EmergencyResuscitationModalProps {
	isOpen: boolean;
	onClose: () => void;
	selectedPatient: Patient | null;
	measurements: Measurement[];
}

// Quick Broselow / Pediatric standard weight presets in kg
const QUICK_WEIGHT_PRESETS = [
	{
		label: "Neonate (3 kg)",
		weight: 3.0,
		age: "0 mo",
		color: "border-pink-300 bg-pink-50 text-pink-900"
	},
	{
		label: "Infant (5 kg)",
		weight: 5.0,
		age: "2 mo",
		color: "border-rose-300 bg-rose-50 text-rose-900"
	},
	{
		label: "6 mo (7 kg)",
		weight: 7.0,
		age: "6 mo",
		color: "border-amber-300 bg-amber-50 text-amber-900"
	},
	{
		label: "1 yr (10 kg)",
		weight: 10.0,
		age: "1 yr",
		color: "border-purple-300 bg-purple-50 text-purple-900"
	},
	{
		label: "3 yr (14 kg)",
		weight: 14.0,
		age: "3 yr",
		color: "border-blue-300 bg-blue-50 text-blue-900"
	},
	{
		label: "5 yr (18 kg)",
		weight: 18.0,
		age: "5 yr",
		color: "border-teal-300 bg-teal-50 text-teal-900"
	},
	{
		label: "7 yr (24 kg)",
		weight: 24.0,
		age: "7 yr",
		color: "border-emerald-300 bg-emerald-50 text-emerald-900"
	},
	{
		label: "9 yr (30 kg)",
		weight: 30.0,
		age: "9 yr",
		color: "border-cyan-300 bg-cyan-50 text-cyan-900"
	},
	{
		label: "12 yr (40 kg)",
		weight: 40.0,
		age: "12 yr",
		color: "border-indigo-300 bg-indigo-50 text-indigo-900"
	},
	{
		label: "Adolescent (50 kg)",
		weight: 50.0,
		age: "14+ yr",
		color: "border-slate-300 bg-slate-50 text-slate-900"
	}
];

export const EmergencyResuscitationModal: React.FC<
	EmergencyResuscitationModalProps
> = ({ isOpen, onClose, selectedPatient, measurements }) => {
	// Determine patient's latest measured weight
	const latestMeasurement = useMemo(() => {
		if (!measurements || measurements.length === 0) return null;
		return [...measurements].sort(
			(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
		)[0];
	}, [measurements]);

	const patientAgeMonths = useMemo(() => {
		if (!selectedPatient?.dob) return undefined;
		const today = new Date().toISOString().split("T")[0];
		return calculateAgeMonths(selectedPatient.dob, today);
	}, [selectedPatient]);

	// Active Weight state (synchronized with patient, but immediately modifiable)
	const initialWeight = latestMeasurement?.weight || 10.0;
	const [activeWeight, setActiveWeight] = useState<number>(initialWeight);
	const [copiedAll, setCopiedAll] = useState(false);

	// Sync weight whenever modal opens or patient changes
	useEffect(() => {
		if (isOpen) {
			if (latestMeasurement?.weight) {
				setActiveWeight(latestMeasurement.weight);
			} else {
				setActiveWeight(10.0);
			}
		}
	}, [isOpen, latestMeasurement]);

	// Derived emergency resuscitation matrix
	const summary = useMemo(() => {
		return generateEmergencyResuscitationSummary(
			activeWeight,
			patientAgeMonths
		);
	}, [activeWeight, patientAgeMonths]);

	// -------------------------------------------------------------
	// CPR Cycle Timer & Epinephrine Reminder (2-Minute Cycle)
	// -------------------------------------------------------------
	const [cprRunning, setCprRunning] = useState(false);
	const [cprSeconds, setCprSeconds] = useState(0);
	const [epiCycleSeconds, setEpiCycleSeconds] = useState(0);
	const [epiDoseCount, setEpiDoseCount] = useState(0);
	const [isMetronomeActive, setIsMetronomeActive] = useState(false);
	const [metronomeSound, setMetronomeSound] = useState(false);

	const audioCtxRef = useRef<AudioContext | null>(null);

	// CPR Timer tick
	useEffect(() => {
		let interval: ReturnType<typeof setInterval> | null = null;
		if (cprRunning) {
			interval = setInterval(() => {
				setCprSeconds(s => s + 1);
				setEpiCycleSeconds(s => s + 1);
			}, 1000);
		}
		return () => {
			if (interval) clearInterval(interval);
		};
	}, [cprRunning]);

	// Metronome click via Web Audio API (105 BPM)
	useEffect(() => {
		let metronomeInterval: ReturnType<typeof setInterval> | null = null;
		if (isMetronomeActive) {
			// 105 beats per minute -> 60000 / 105 = 571 ms
			const intervalMs = Math.round(60000 / 105);

			metronomeInterval = setInterval(() => {
				if (metronomeSound) {
					try {
						if (!audioCtxRef.current) {
							const AudioContextClass =
								window.AudioContext ||
								(
									window as Window & {
										webkitAudioContext?: typeof AudioContext;
									}
								).webkitAudioContext;
							if (AudioContextClass) {
								audioCtxRef.current = new AudioContextClass();
							}
						}
						if (
							audioCtxRef.current &&
							audioCtxRef.current.state === "suspended"
						) {
							audioCtxRef.current.resume();
						}
						if (audioCtxRef.current) {
							const osc = audioCtxRef.current.createOscillator();
							const gain = audioCtxRef.current.createGain();
							osc.type = "sine";
							osc.frequency.setValueAtTime(
								880,
								audioCtxRef.current.currentTime
							); // High pitch click
							gain.gain.setValueAtTime(0.3, audioCtxRef.current.currentTime);
							gain.gain.exponentialRampToValueAtTime(
								0.001,
								audioCtxRef.current.currentTime + 0.05
							);
							osc.connect(gain);
							gain.connect(audioCtxRef.current.destination);
							osc.start();
							osc.stop(audioCtxRef.current.currentTime + 0.05);
						}
					} catch {
						// Audio context policy fallback
					}
				}
			}, intervalMs);
		}
		return () => {
			if (metronomeInterval) clearInterval(metronomeInterval);
		};
	}, [isMetronomeActive, metronomeSound]);

	const handleRecordEpinephrineGiven = () => {
		setEpiDoseCount(c => c + 1);
		setEpiCycleSeconds(0);
	};

	const resetCprTimer = () => {
		setCprSeconds(0);
		setEpiCycleSeconds(0);
		setEpiDoseCount(0);
		setCprRunning(false);
	};

	const formatTimerMinutes = (totalSec: number) => {
		const mins = Math.floor(totalSec / 60);
		const secs = totalSec % 60;
		return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
	};

	// Two-minute cycle warning
	const cprCycleRemainder = cprSeconds % 120;
	const isPulseCheckDue =
		cprRunning && cprSeconds > 0 && cprCycleRemainder >= 110;
	const isEpiDue = cprRunning && epiCycleSeconds >= 180; // 3-5 minutes

	// Print & Copy Actions
	const handlePrint = () => {
		window.print();
	};

	const handleCopySummary = () => {
		const lines = [
			"*** PEDIATRIC CODE BLUE RESUSCITATION SHEET ***",
			`Patient: ${selectedPatient?.name || "Emergency Arrival"} | Weight: ${activeWeight} kg | Age: ${summary.estimatedAgeMonths} months`,
			`Date/Time: ${new Date().toLocaleString()}`,
			"",
			"[ELECTRICAL THERAPY]",
			`• Initial Defibrillation (2 J/kg): ${summary.electrical.defibrillationInitialJ} Joules`,
			`• Subsequent Defibrillation (4 J/kg): ${summary.electrical.defibrillationSubsequentJ} Joules`,
			`• Synchronized Cardioversion: Initial ${summary.electrical.cardioversionInitialJ} J | Subsequent ${summary.electrical.cardioversionSubsequentJ} J`,
			"",
			"[AIRWAY EQUIPMENT]",
			`• ETT Cuffed: ${summary.airway.cuffedEtTubeSize} mm ID | Uncuffed: ${summary.airway.uncuffedEtTubeSize} mm ID`,
			`• Depth at Lip: ${summary.airway.insertionDepthLipCm} cm`,
			`• Laryngoscope Blade: ${summary.airway.laryngoscopeBladeSize} (${summary.airway.laryngoscopeBladeType})`,
			`• Suction Catheter: ${summary.airway.suctionCatheterFr} Fr | BVM: ${summary.airway.bagValveMaskSize}`,
			"",
			"[EMERGENCY DRUGS]",
			...summary.drugs.map(
				d =>
					`• ${d.name}: ${d.volumeMl} mL (${d.doseMg} mg) [${d.route}] - ${d.doseFormula}`
			)
		];
		navigator.clipboard.writeText(lines.join("\n"));
		setCopiedAll(true);
		setTimeout(() => setCopiedAll(false), 2500);
	};

	if (!isOpen) return null;

	return (
		<div className='animate-in fade-in fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/80 p-2 backdrop-blur-md duration-200 sm:p-4'>
			<div className='flex max-h-[94vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border-2 border-rose-600 bg-slate-900 font-sans text-slate-100 shadow-2xl'>
				{/* Top Header Zone: High-Visibility CODE BLUE Banner */}
				<div className='flex shrink-0 flex-wrap items-center justify-between gap-4 border-b border-rose-700/80 bg-gradient-to-r from-rose-900 via-rose-800 to-slate-900 p-4'>
					<div className='flex items-center gap-3'>
						<div className='flex h-12 w-12 animate-pulse items-center justify-center rounded-xl bg-rose-600 font-black text-white shadow-lg shadow-rose-900/50'>
							<Flame className='h-7 w-7' />
						</div>
						<div>
							<div className='flex flex-wrap items-center gap-2'>
								<span className='rounded-full bg-rose-500 px-2.5 py-0.5 text-xs font-black tracking-widest text-white uppercase shadow-xs'>
									CODE BLUE
								</span>
								<h1 className='text-xl font-black tracking-tight text-white'>
									Pediatric Resuscitation & Emergency Matrix
								</h1>
								<span className='rounded border border-rose-700/50 bg-rose-950/80 px-2 py-0.5 text-xs font-bold text-rose-200'>
									AHA PALS / ERC Standards
								</span>
							</div>
							<p className='mt-0.5 text-xs font-medium text-rose-200'>
								{selectedPatient ? (
									<>
										Active Patient:{" "}
										<strong className='text-white underline'>
											{selectedPatient.name}
										</strong>{" "}
										• MRN: {selectedPatient.medicalRecordNumber || "N/A"} • DOB:{" "}
										{selectedPatient.dob}
									</>
								) : (
									"Emergency Unregistered Arrival • Rapid Weight Synchronization Active"
								)}
							</p>
						</div>
					</div>

					{/* Action buttons (Print, Copy, Close) */}
					<div className='flex items-center gap-2'>
						<button
							className='flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-bold text-slate-200 transition-colors hover:bg-slate-700'
							onClick={handleCopySummary}
							title='Copy formatted resuscitation sheet to clipboard'
							type='button'
						>
							{copiedAll ? (
								<Check className='h-4 w-4 text-emerald-400' />
							) : (
								<Copy className='h-4 w-4' />
							)}
							<span>{copiedAll ? "Copied" : "Copy Sheet"}</span>
						</button>
						<button
							className='flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-bold text-slate-200 transition-colors hover:bg-slate-700'
							onClick={handlePrint}
							title='Print Bedside Emergency Card'
							type='button'
						>
							<Printer className='h-4 w-4 text-rose-400' />
							<span>Print A4 Card</span>
						</button>
						<button
							aria-label='Close Code Blue Modal'
							className='ml-1 flex h-9 w-9 items-center justify-center rounded-lg border border-rose-700 bg-rose-950/80 text-white transition-colors hover:bg-rose-700'
							onClick={onClose}
							type='button'
						>
							<X className='h-5 w-5' />
						</button>
					</div>
				</div>

				{/* CPR Metronome & Cycle Timer Bar */}
				<div className='flex shrink-0 flex-wrap items-center justify-between gap-4 border-b border-slate-800 bg-slate-950 px-4 py-3'>
					{/* CPR Cycle Stopwatch */}
					<div className='flex items-center gap-3'>
						<div className='flex items-center gap-2'>
							<Timer className='h-5 w-5 animate-pulse text-rose-500' />
							<span className='text-xs font-bold tracking-wider text-slate-400 uppercase'>
								CPR Timer:
							</span>
							<span
								className={`font-mono text-2xl font-black ${isPulseCheckDue ? "animate-ping text-amber-400" : "text-white"}`}
							>
								{formatTimerMinutes(cprSeconds)}
							</span>
						</div>

						<div className='flex items-center gap-1'>
							{!cprRunning ? (
								<button
									className='flex items-center gap-1 rounded bg-emerald-600 px-3 py-1 text-xs font-bold text-white transition-colors hover:bg-emerald-500'
									onClick={() => setCprRunning(true)}
									type='button'
								>
									<Play className='h-3.5 w-3.5' />
									<span>Start CPR</span>
								</button>
							) : (
								<button
									className='flex items-center gap-1 rounded bg-amber-600 px-3 py-1 text-xs font-bold text-white transition-colors hover:bg-amber-500'
									onClick={() => setCprRunning(false)}
									type='button'
								>
									<Pause className='h-3.5 w-3.5' />
									<span>Pause</span>
								</button>
							)}
							<button
								className='rounded bg-slate-800 p-1.5 text-slate-400 transition-colors hover:bg-slate-700 hover:text-white'
								onClick={resetCprTimer}
								title='Reset Resuscitation Timers'
								type='button'
							>
								<RotateCcw className='h-3.5 w-3.5' />
							</button>
						</div>

						{/* 2-Minute Rhythm Check Indicator */}
						{isPulseCheckDue && (
							<span className='flex animate-bounce items-center gap-1 rounded-md bg-amber-500 px-2.5 py-1 text-xs font-black text-slate-950'>
								<AlertTriangle className='h-4 w-4' />
								<span>2-MIN PULSE / RHYTHM CHECK DUE!</span>
							</span>
						)}
					</div>

					{/* Epinephrine Tracker & Metronome */}
					<div className='flex flex-wrap items-center gap-4'>
						{/* Epinephrine Cycle */}
						<div className='flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1'>
							<Syringe className='h-4 w-4 text-rose-400' />
							<span className='text-xs font-semibold text-slate-300'>
								Last Epi:{" "}
								<strong className='font-mono text-white'>
									{formatTimerMinutes(epiCycleSeconds)}
								</strong>
							</span>
							<span className='text-[11px] text-slate-400'>
								({epiDoseCount} given)
							</span>
							<button
								className='ml-1 rounded bg-rose-700 px-2 py-0.5 text-[11px] font-bold text-white transition-colors hover:bg-rose-600'
								onClick={handleRecordEpinephrineGiven}
								type='button'
							>
								+ Log Dose
							</button>
							{isEpiDue && (
								<span className='animate-pulse rounded bg-rose-600 px-2 py-0.5 text-[10px] font-black text-white'>
									EPI DUE!
								</span>
							)}
						</div>

						{/* 105 BPM Metronome */}
						<div className='flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1'>
							<button
								className={`flex items-center gap-1 rounded px-2 py-1 text-xs font-bold transition-colors ${
									isMetronomeActive
										? "bg-rose-600 text-white shadow-xs"
										: "bg-slate-800 text-slate-400 hover:text-white"
								}`}
								onClick={() => setIsMetronomeActive(!isMetronomeActive)}
								type='button'
							>
								<Activity
									className={`h-3.5 w-3.5 ${isMetronomeActive ? "animate-spin" : ""}`}
								/>
								<span>105 BPM Metronome</span>
							</button>

							{isMetronomeActive && (
								<button
									className={`rounded p-1 text-xs transition-colors ${
										metronomeSound
											? "bg-rose-950 text-rose-400"
											: "text-slate-500 hover:text-slate-300"
									}`}
									onClick={() => setMetronomeSound(!metronomeSound)}
									title={
										metronomeSound ? "Mute Audio Beep" : "Enable Audio Beep"
									}
									type='button'
								>
									{metronomeSound ? (
										<Volume2 className='h-4 w-4' />
									) : (
										<VolumeX className='h-4 w-4' />
									)}
								</button>
							)}
						</div>
					</div>
				</div>

				{/* Emergency Weight Dial & Broselow Quick Jump Buttons */}
				<div className='shrink-0 space-y-3 border-b border-slate-800 bg-slate-900/90 p-4'>
					<div className='flex flex-col justify-between gap-4 sm:flex-row sm:items-center'>
						<div className='flex items-center gap-3'>
							<div className='flex h-10 w-10 items-center justify-center rounded-xl border border-rose-500/40 bg-rose-600/20 font-bold text-rose-400'>
								<Scale className='h-5 w-5' />
							</div>
							<div>
								<span className='block text-xs font-bold tracking-wider text-slate-400 uppercase'>
									Resuscitation Dosing Weight:
								</span>
								<div className='flex items-baseline gap-2'>
									<span className='font-mono text-3xl font-black tracking-tight text-rose-400'>
										{activeWeight}
									</span>
									<span className='text-base font-bold text-slate-300'>kg</span>
									<span className='ml-2 text-xs font-medium text-slate-400'>
										(Est. Age:{" "}
										<strong className='text-slate-200'>
											{typeof summary.estimatedAgeMonths === "number"
												? `${summary.estimatedAgeMonths} months / ${(summary.estimatedAgeMonths / 12).toFixed(1)} yrs`
												: "Unknown"}
										</strong>
										)
									</span>
								</div>
							</div>
						</div>

						{/* Manual Slider & Quick Input */}
						<div className='flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950 p-2'>
							<input
								className='w-36 cursor-pointer accent-rose-500 sm:w-48'
								max='80.0'
								min='1.0'
								onChange={e =>
									setActiveWeight(Number.parseFloat(e.target.value) || 10)
								}
								step='0.5'
								type='range'
								value={activeWeight}
							/>
							<div className='flex items-center gap-1'>
								<input
									className='w-20 rounded border border-slate-700 bg-slate-900 px-2 py-1 text-center text-sm font-black text-rose-400 focus:border-rose-500 focus:outline-none'
									max='120'
									min='0.5'
									onChange={e => {
										const val = Number.parseFloat(e.target.value);
										if (!Number.isNaN(val) && val > 0) setActiveWeight(val);
									}}
									step='0.1'
									type='number'
									value={activeWeight}
								/>
								<span className='text-xs font-bold text-slate-400'>kg</span>
							</div>
							{latestMeasurement?.weight &&
								activeWeight !== latestMeasurement.weight && (
									<button
										className='ml-1 text-xs font-bold text-rose-400 underline hover:text-rose-300'
										onClick={() => {
											if (latestMeasurement?.weight) {
												setActiveWeight(latestMeasurement.weight);
											}
										}}
										title='Reset to patient chart weight'
										type='button'
									>
										Reset ({latestMeasurement.weight} kg)
									</button>
								)}
						</div>
					</div>

					{/* Broselow / Quick Jump Weight Presets */}
					<div className='flex items-center gap-1.5 overflow-x-auto pb-1 text-xs'>
						<span className='mr-1 flex shrink-0 items-center gap-1 text-[11px] font-bold text-slate-400'>
							<Sliders className='h-3.5 w-3.5 text-rose-400' />
							<span>Quick Jumps:</span>
						</span>
						{QUICK_WEIGHT_PRESETS.map(p => {
							const isSelected = activeWeight === p.weight;
							return (
								<button
									className={`rounded-md border px-2.5 py-1 text-xs font-bold whitespace-nowrap transition-all ${
										isSelected
											? "scale-105 border-rose-500 bg-rose-600 text-white shadow-md shadow-rose-900/40"
											: "border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
									}`}
									key={p.weight}
									onClick={() => setActiveWeight(p.weight)}
									type='button'
								>
									{p.label}
								</button>
							);
						})}
					</div>
				</div>

				{/* Scrollable Clinical Matrix Workspace */}
				<div className='flex-1 space-y-6 overflow-y-auto bg-slate-950/50 p-4 sm:p-6'>
					{/* TOP DUAL HERO: ELECTRICAL DEFIBRILLATION & AIRWAY INTUBATION */}
					<div className='grid grid-cols-1 gap-5 lg:grid-cols-12'>
						{/* 1. Electrical Defibrillation & Cardioversion (5 cols) */}
						<div className='space-y-4 rounded-2xl border-2 border-amber-600/70 bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-900 p-5 shadow-xl lg:col-span-5'>
							<div className='flex items-center justify-between border-b border-amber-600/30 pb-3'>
								<div className='flex items-center gap-2'>
									<div className='flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 font-black text-slate-950'>
										<Zap className='h-5 w-5 fill-slate-950' />
									</div>
									<div>
										<h2 className='text-base font-black tracking-tight text-amber-400'>
											DEFIBRILLATION & SHOCK
										</h2>
										<span className='text-[11px] font-semibold text-amber-200/80'>
											VF / Pulseless VT (Manual Defibrillator)
										</span>
									</div>
								</div>
								<span className='rounded border border-amber-500/40 bg-amber-500/20 px-2 py-0.5 text-[10px] font-black text-amber-300 uppercase'>
									Joules
								</span>
							</div>

							{/* Shock Energy Cards */}
							<div className='grid grid-cols-2 gap-3'>
								{/* 1st Shock */}
								<div className='space-y-1 rounded-xl border border-amber-500/40 bg-slate-950/80 p-3.5 text-center'>
									<span className='block text-[11px] font-bold tracking-wider text-amber-300 uppercase'>
										1st Shock (2 J/kg)
									</span>
									<div className='font-mono text-4xl font-black text-amber-400'>
										{summary.electrical.defibrillationInitialJ}
									</div>
									<span className='block text-xs font-bold text-slate-400'>
										Joules
									</span>
								</div>

								{/* 2nd & Subsequent Shocks */}
								<div className='space-y-1 rounded-xl border border-rose-500/50 bg-slate-950/80 p-3.5 text-center'>
									<span className='block text-[11px] font-bold tracking-wider text-rose-300 uppercase'>
										Subsequent (4 J/kg)
									</span>
									<div className='font-mono text-4xl font-black text-rose-400'>
										{summary.electrical.defibrillationSubsequentJ}
									</div>
									<span className='block text-xs font-bold text-slate-400'>
										Joules (max 200 J)
									</span>
								</div>
							</div>

							{/* Synchronized Cardioversion for SVT / VT with pulse */}
							<div className='space-y-2 rounded-xl border border-amber-700/50 bg-amber-950/30 p-3 text-xs'>
								<span className='flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-amber-300 uppercase'>
									<HeartPulse className='h-4 w-4 text-amber-400' />
									<span>Synchronized Cardioversion (SVT / Unstable VT)</span>
								</span>
								<div className='flex items-center justify-between pt-1'>
									<div>
										<span className='block text-slate-400'>
											Initial (0.5–1 J/kg):
										</span>
										<strong className='font-mono text-lg text-white'>
											{summary.electrical.cardioversionInitialJ} J
										</strong>
									</div>
									<div>
										<span className='block text-slate-400'>
											Subsequent (2 J/kg):
										</span>
										<strong className='font-mono text-lg text-white'>
											{summary.electrical.cardioversionSubsequentJ} J
										</strong>
									</div>
									<div className='text-right'>
										<span className='block text-[10px] text-amber-300'>
											Sync Button:
										</span>
										<span className='text-xs font-black text-emerald-400'>
											ENGAGED
										</span>
									</div>
								</div>
							</div>
						</div>

						{/* 2. Airway & Intubation Equipment Matrix (7 cols) */}
						<div className='space-y-4 rounded-2xl border-2 border-teal-600/70 bg-gradient-to-br from-teal-950/40 via-slate-900 to-slate-900 p-5 shadow-xl lg:col-span-7'>
							<div className='flex items-center justify-between border-b border-teal-600/30 pb-3'>
								<div className='flex items-center gap-2'>
									<div className='flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500 font-black text-slate-950'>
										<Wind className='h-5 w-5' />
									</div>
									<div>
										<h2 className='text-base font-black tracking-tight text-teal-400'>
											AIRWAY & INTUBATION MATRIX
										</h2>
										<span className='text-[11px] font-semibold text-teal-200/80'>
											Standardized Equipment Sizing for {activeWeight} kg
										</span>
									</div>
								</div>
								<span className='rounded border border-teal-500/40 bg-teal-500/20 px-2 py-0.5 text-[10px] font-black text-teal-300 uppercase'>
									Lip Depth: {summary.airway.insertionDepthLipCm} cm
								</span>
							</div>

							{/* Primary Tube Sizing */}
							<div className='grid grid-cols-3 gap-3'>
								<div className='rounded-xl border border-teal-500/40 bg-slate-950/80 p-3 text-center'>
									<span className='block text-[11px] font-bold tracking-wider text-teal-300 uppercase'>
										Cuffed ETT
									</span>
									<div className='my-1 font-mono text-3xl font-black text-white'>
										{summary.airway.cuffedEtTubeSize}
									</div>
									<span className='text-[11px] font-semibold text-teal-400'>
										mm ID
									</span>
								</div>

								<div className='rounded-xl border border-teal-500/40 bg-slate-950/80 p-3 text-center'>
									<span className='block text-[11px] font-bold tracking-wider text-teal-300 uppercase'>
										Uncuffed ETT
									</span>
									<div className='my-1 font-mono text-3xl font-black text-white'>
										{summary.airway.uncuffedEtTubeSize}
									</div>
									<span className='text-[11px] font-semibold text-teal-400'>
										mm ID
									</span>
								</div>

								<div className='rounded-xl border border-emerald-500/40 bg-slate-950/80 p-3 text-center'>
									<span className='block text-[11px] font-bold tracking-wider text-emerald-300 uppercase'>
										Lip Depth
									</span>
									<div className='my-1 font-mono text-3xl font-black text-emerald-400'>
										{summary.airway.insertionDepthLipCm}
									</div>
									<span className='text-[11px] font-semibold text-emerald-300'>
										cm at lip
									</span>
								</div>
							</div>

							{/* Secondary Airway Equipment Details Grid */}
							<div className='grid grid-cols-2 gap-2.5 text-xs sm:grid-cols-4'>
								<div className='rounded-lg border border-slate-800 bg-slate-950/60 p-2.5'>
									<span className='block text-[10px] font-bold text-slate-400 uppercase'>
										Blade:
									</span>
									<strong className='mt-0.5 block text-xs font-semibold text-teal-300'>
										{summary.airway.laryngoscopeBladeSize}
									</strong>
									<span className='block text-[10px] text-slate-500'>
										({summary.airway.laryngoscopeBladeType})
									</span>
								</div>

								<div className='rounded-lg border border-slate-800 bg-slate-950/60 p-2.5'>
									<span className='block text-[10px] font-bold text-slate-400 uppercase'>
										Suction Cath:
									</span>
									<strong className='mt-0.5 block text-xs font-semibold text-teal-300'>
										{summary.airway.suctionCatheterFr} Fr
									</strong>
									<span className='block text-[10px] text-slate-500'>
										Vacuum source
									</span>
								</div>

								<div className='rounded-lg border border-slate-800 bg-slate-950/60 p-2.5'>
									<span className='block text-[10px] font-bold text-slate-400 uppercase'>
										BVM Resuscitator:
									</span>
									<strong className='mt-0.5 block text-xs font-semibold text-teal-300'>
										{summary.airway.bagValveMaskSize}
									</strong>
									<span className='block text-[10px] text-slate-500'>
										100% O₂ Reservoir
									</span>
								</div>

								<div className='rounded-lg border border-slate-800 bg-slate-950/60 p-2.5'>
									<span className='block text-[10px] font-bold text-slate-400 uppercase'>
										LMA Rescue:
									</span>
									<strong className='mt-0.5 block text-xs font-semibold text-teal-300'>
										{summary.airway.lmaSize}
									</strong>
									<span className='block text-[10px] text-slate-500'>
										Supraglottic
									</span>
								</div>
							</div>
						</div>
					</div>

					{/* EMERGENCY MEDICATIONS LIST (HIGH-VISIBILITY DOSING MATRIX) */}
					<div className='space-y-4'>
						<div className='flex items-center justify-between border-b border-slate-800 pb-2'>
							<div className='flex items-center gap-2'>
								<Pill className='h-5 w-5 text-rose-500' />
								<h2 className='text-base font-black tracking-tight text-white'>
									EMERGENCY CODE BLUE MEDICATIONS ({activeWeight} kg)
								</h2>
							</div>
							<span className='text-xs font-semibold text-slate-400'>
								All concentrations verified against Egyptian Hospital
								Formularies
							</span>
						</div>

						{/* Drug Cards Grid */}
						<div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
							{summary.drugs.map(drug => {
								const isArrest = drug.priorityCategory === "cardiac_arrest";
								const isFluid = drug.priorityCategory === "fluids_glucose";
								const isEpi = drug.id === "epinephrine-arrest";

								return (
									<div
										className={`flex flex-col justify-between rounded-xl border p-4 shadow-md transition-all ${
											isEpi
												? "border-rose-500 bg-rose-950/50 ring-2 shadow-rose-950/50 ring-rose-500/40"
												: isArrest
													? "border-rose-800/80 bg-slate-900 hover:border-rose-500"
													: isFluid
														? "border-cyan-800/80 bg-slate-900 hover:border-cyan-500"
														: "border-slate-800 bg-slate-900 hover:border-slate-700"
										}`}
										key={drug.id}
									>
										{/* Top zone: Name & Indication */}
										<div className='space-y-1.5'>
											<div className='flex items-start justify-between gap-2'>
												<h3 className='text-sm leading-tight font-black text-white'>
													{drug.name}
												</h3>
												<span
													className={`shrink-0 rounded px-2 py-0.5 text-[10px] font-black uppercase ${
														isEpi
															? "animate-pulse bg-rose-600 text-white"
															: isArrest
																? "border border-rose-700 bg-rose-950 text-rose-300"
																: "bg-slate-800 text-slate-300"
													}`}
												>
													{drug.route}
												</span>
											</div>
											<p className='text-[11px] leading-tight font-semibold text-rose-300/90'>
												{drug.indication}
											</p>
											<div className='font-mono text-[10px] text-slate-400'>
												{drug.concentrationString}
											</div>
										</div>

										{/* Middle zone: Calculated Dose in mL and mg */}
										<div className='my-3 flex items-baseline justify-between rounded-xl border border-slate-800 bg-slate-950/80 px-3 py-2.5'>
											<div>
												<span className='block text-[10px] font-bold text-slate-400 uppercase'>
													Give Volume:
												</span>
												<div className='flex items-baseline gap-1'>
													<span
														className={`font-mono text-3xl font-black ${isEpi ? "text-rose-400" : "text-white"}`}
													>
														{drug.volumeMl}
													</span>
													<span className='text-xs font-bold text-slate-300'>
														mL
													</span>
												</div>
											</div>

											<div className='text-right'>
												<span className='block text-[10px] font-bold text-slate-400 uppercase'>
													Exact Dose:
												</span>
												<span className='font-mono text-sm font-bold text-slate-200'>
													{drug.doseMg}{" "}
													{drug.id.includes("saline") ||
													drug.id.includes("dextrose")
														? "mL"
														: "mg"}
												</span>
												<span className='block text-[10px] text-slate-400'>
													{drug.doseFormula}
												</span>
											</div>
										</div>

										{/* Bottom notes & Safety warning */}
										<div className='space-y-1 text-[11px] text-slate-400'>
											<p className='leading-tight'>{drug.notes}</p>
											{drug.isCapped && (
												<div className='flex items-center gap-1 rounded border border-amber-600 bg-amber-950/80 p-1 text-[10px] font-bold text-amber-300'>
													<AlertTriangle className='h-3.5 w-3.5 shrink-0' />
													<span>Dose hit maximum safety limit (Capped)</span>
												</div>
											)}
										</div>
									</div>
								);
							})}
						</div>
					</div>
				</div>

				{/* Modal Bottom Footer / Emergency Hotline & Fast Exit */}
				<div className='flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-slate-800 bg-slate-950 p-4'>
					<div className='flex items-center gap-2 text-xs text-slate-400'>
						<ShieldAlert className='h-4 w-4 shrink-0 text-rose-500' />
						<span>
							Always verify patient rhythm before delivery. For refractory
							ventricular fibrillation, confirm paddle position (anterolateral /
							apex-sternum).
						</span>
					</div>

					<button
						className='rounded-xl border border-slate-700 bg-slate-800 px-5 py-2 text-xs font-bold text-white transition-colors hover:bg-slate-700'
						onClick={onClose}
						type='button'
					>
						Close Emergency Panel
					</button>
				</div>
			</div>
		</div>
	);
};
