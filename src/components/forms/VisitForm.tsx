// src/components/forms/VisitForm.tsx
"use client";

import { useForm } from "@tanstack/react-form";
import { useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/auth.hooks";
import { $createVisit, $updateVisit } from "@/server/functions";

import { errorMessage, FieldError, FormError } from "./_shared";

export interface VisitFormProps {
	defaultPatientId?: string;
	defaultAppointmentId?: string;
	visit?: {
		id: string;
		patientId: string;
		clinicId: string;
		appointmentId?: string | null;
		visitedAt: string | Date;
		ageMonths: number;
		ageYears?: number | null;
		ageMonthsRemainder?: number | null;
	};
	onCancel?: () => void;
	onSuccess?: (visit: { id: string }) => void;
}

export function VisitForm({
	defaultPatientId,
	defaultAppointmentId,
	visit,
	onCancel,
	onSuccess
}: VisitFormProps) {
	const isEdit = Boolean(visit?.id);
	const createVisit = useServerFn($createVisit);
	const updateVisit = useServerFn($updateVisit);
	const queryClient = useQueryClient();
	const { user } = useAuth();

	const activePatientId = visit?.patientId ?? defaultPatientId ?? "";
	const activeClinicId =
		visit?.clinicId ?? (user as { clinicId?: string } | null)?.clinicId ?? "";

	const initialDate = visit?.visitedAt
		? typeof visit.visitedAt === "string"
			? visit.visitedAt.slice(0, 10)
			: visit.visitedAt.toISOString().slice(0, 10)
		: new Date().toISOString().slice(0, 10);

	const form = useForm({
		defaultValues: {
			patientId: activePatientId,
			clinicId: activeClinicId,
			appointmentId: visit?.appointmentId ?? defaultAppointmentId ?? "",
			visitedAt: initialDate,
			ageMonths: visit?.ageMonths ?? 12,
			ageYears: visit?.ageYears ?? 1,
			ageMonthsRemainder: visit?.ageMonthsRemainder ?? 0
		},
		validators: {
			onSubmit: ({ value }) => {
				if (!value.patientId) return "Patient ID is required";
				if (!value.clinicId) return "Clinic ID is required";
				if (!value.visitedAt) return "Visit date is required";
				if (value.ageMonths <= 0) return "Age in months must be positive";
				return undefined;
			},
			onSubmitAsync: async ({ value }) => {
				try {
					let result: { id: string };
					if (isEdit && visit?.id) {
						result = await updateVisit({
							data: {
								id: visit.id,
								data: {
									visitedAt: value.visitedAt,
									ageMonths: Number(value.ageMonths),
									ageYears: value.ageYears ? Number(value.ageYears) : null,
									ageMonthsRemainder:
										value.ageMonthsRemainder != null
											? Number(value.ageMonthsRemainder)
											: null
								}
							}
						});
					} else {
						result = await createVisit({
							data: {
								patientId: value.patientId,
								clinicId: value.clinicId,
								appointmentId: value.appointmentId || undefined,
								visitedAt: value.visitedAt,
								ageMonths: Number(value.ageMonths),
								ageYears: value.ageYears ? Number(value.ageYears) : undefined,
								ageMonthsRemainder:
									value.ageMonthsRemainder != null
										? Number(value.ageMonthsRemainder)
										: undefined
							}
						});
					}
					await queryClient.invalidateQueries({ queryKey: ["visits"] });
					toast.success(isEdit ? "Visit updated" : "Visit recorded");
					onSuccess?.(result);
				} catch (err) {
					return { form: errorMessage(err) };
				}
			}
		}
	});

	return (
		<form
			className='flex flex-col gap-4'
			onSubmit={e => {
				e.preventDefault();
				e.stopPropagation();
				void form.handleSubmit();
			}}
		>
			<form.Subscribe selector={s => s.errorMap.onSubmit}>
				{err => (err ? <FormError error={err} /> : null)}
			</form.Subscribe>

			<form.Field name='patientId'>
				{field => (
					<div className='flex flex-col gap-1.5'>
						<Label htmlFor={field.name}>Patient ID</Label>
						<Input
							disabled={Boolean(activePatientId)}
							id={field.name}
							name={field.name}
							onBlur={field.handleBlur}
							onChange={e => {
								field.handleChange(e.target.value);
							}}
							placeholder='UUID'
							value={field.state.value}
						/>
						<FieldError state={field.state} />
					</div>
				)}
			</form.Field>

			<div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
				<form.Field name='visitedAt'>
					{field => (
						<div className='flex flex-col gap-1.5'>
							<Label htmlFor={field.name}>Date of Visit</Label>
							<Input
								id={field.name}
								name={field.name}
								onBlur={field.handleBlur}
								onChange={e => {
									field.handleChange(e.target.value);
								}}
								type='date'
								value={field.state.value}
							/>
							<FieldError state={field.state} />
						</div>
					)}
				</form.Field>

				<form.Field name='ageMonths'>
					{field => (
						<div className='flex flex-col gap-1.5'>
							<Label htmlFor={field.name}>Age (Months)</Label>
							<Input
								id={field.name}
								min={0}
								name={field.name}
								onBlur={field.handleBlur}
								onChange={e => {
									field.handleChange(Number(e.target.value));
								}}
								step='0.1'
								type='number'
								value={field.state.value}
							/>
							<FieldError state={field.state} />
						</div>
					)}
				</form.Field>
			</div>

			<div className='flex justify-end gap-2 pt-2'>
				{onCancel ? (
					<Button
						onClick={onCancel}
						type='button'
						variant='outline'
					>
						Cancel
					</Button>
				) : null}
				<form.Subscribe selector={s => s.isSubmitting}>
					{isSubmitting => (
						<Button
							disabled={isSubmitting}
							type='submit'
						>
							{isSubmitting
								? "Saving…"
								: isEdit
									? "Save Changes"
									: "Record Visit"}
						</Button>
					)}
				</form.Subscribe>
			</div>
		</form>
	);
}
