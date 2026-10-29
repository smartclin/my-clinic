/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Chronological age helpers used across the app. Single source of truth so
 * the modal, dashboard, and triage card never disagree on a child's age.
 */

export interface AgeBreakdown {
	totalMonths: number;
	years: number;
	months: number;
	days: number;
	formattedString: string;
}

const EMPTY_AGE: AgeBreakdown = {
	totalMonths: 0,
	years: 0,
	months: 0,
	days: 0,
	formattedString: "0 mo"
};

const DAYS_PER_MONTH = 30.4375;

/**
 * Exact calendar breakdown between a DOB and a visit date.
 * Handles month-length variation (e.g. Jan 31 → Feb 1) correctly.
 */
export function getExactAgeBreakdown(
	dobStr: string,
	visitDateStr: string
): AgeBreakdown {
	const dob = new Date(dobStr);
	const visit = new Date(visitDateStr);

	if (
		Number.isNaN(dob.getTime()) ||
		Number.isNaN(visit.getTime()) ||
		visit < dob
	) {
		return EMPTY_AGE;
	}

	let years = visit.getFullYear() - dob.getFullYear();
	let months = visit.getMonth() - dob.getMonth();
	let days = visit.getDate() - dob.getDate();

	if (days < 0) {
		months -= 1;
		const prevMonthDays = new Date(
			visit.getFullYear(),
			visit.getMonth(),
			0
		).getDate();
		days += prevMonthDays;
	}
	if (months < 0) {
		years -= 1;
		months += 12;
	}

	const diffMs = visit.getTime() - dob.getTime();
	const totalDays = diffMs / (1000 * 60 * 60 * 24);
	const totalMonths = Number((totalDays / DAYS_PER_MONTH).toFixed(1));

	const parts: string[] = [];
	if (years > 0) parts.push(`${years}y`);
	if (months > 0 || years > 0) parts.push(`${months}m`);
	parts.push(`${days}d`);

	return {
		totalMonths,
		years,
		months,
		days,
		formattedString: `${parts.join(" ")} (${totalMonths} mo)`
	};
}

/** Convenience: current age in months, at today's date. */
export function currentAgeMonths(dob: string): number {
	return getExactAgeBreakdown(dob, new Date().toISOString().slice(0, 10))
		.totalMonths;
}
