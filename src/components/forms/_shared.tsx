// src/components/forms/_shared.tsx
"use client";

export function errorMessage(error: unknown): string {
	if (error instanceof Error) return error.message;
	if (typeof error === "string") return error;
	if (typeof error === "object" && error !== null) {
		const err = error as Record<string, unknown>;
		if (typeof err.form === "string") {
			return err.form;
		}
		if (typeof err.message === "string") {
			return err.message;
		}
	}
	return "Something went wrong";
}

export function FormError({
	error,
	message
}: {
	error?: unknown;
	message?: string;
}) {
	const msg = message ?? (error ? errorMessage(error) : undefined);
	if (!msg) return null;
	return (
		<p
			className='text-destructive text-sm'
			role='alert'
		>
			{msg}
		</p>
	);
}

export function FieldError({
	field,
	state
}: {
	field?: { state: { meta: { errors: unknown[] } } };
	state?: { meta: { errors: unknown[] } };
}) {
	const errors = field?.state?.meta?.errors ?? state?.meta?.errors;
	const first = errors?.[0] as { message?: string } | string | undefined;
	if (!first) return null;
	const msg = typeof first === "string" ? first : first.message;
	return msg ? <p className='text-destructive text-sm'>{msg}</p> : null;
}

const pad = (n: number) => String(n).padStart(2, "0");

export function toDateTimeLocalString(date: Date): string {
	if (Number.isNaN(date.getTime())) return "";
	return (
		`${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
		`T${pad(date.getHours())}:${pad(date.getMinutes())}`
	);
}

export function fromDateTimeLocalString(value: string): Date {
	return new Date(value);
}

export function splitAgeMonths(total: number): {
	ageYears: number;
	ageMonthsRemainder: number;
} {
	const years = Math.floor(total / 12);
	const months = Math.round(total - years * 12);
	return months >= 12
		? { ageYears: years + 1, ageMonthsRemainder: 0 }
		: { ageYears: years, ageMonthsRemainder: months };
}
