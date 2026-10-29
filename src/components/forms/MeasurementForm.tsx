// src/components/forms/MeasurementForm.tsx
"use client";

import { useForm } from "@tanstack/react-form";
import { useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Plus } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { measurementInsertSchema } from "@/db/validations.ts";
import type { Sex } from "@/lib/growth/lms-types";
import { createMeasurementFn } from "@/server/functions";

import { toast } from "../ui/toast";
import { errorMessage, FieldError, FormError } from "./_shared";

export interface MeasurementFormProps {
	patientId: string;
	visitId?: string;
	defaultAgeMonths?: number;
	ageMonths?: number;
	lengthCm?: number;
	patientSex?: Sex;
	dateOfBirth?: string;
	sex?: Sex | "boy" | "girl";
	visitDate?: string | Date;
	inline?: boolean;
	onCancel?: () => void;
	onSuccess?: (m: { id: string }) => void;
}

export function MeasurementForm({
	patientId,
	visitId: _visitId,
	defaultAgeMonths,
	ageMonths,
	lengthCm,
	patientSex: _patientSex,
	dateOfBirth: _dateOfBirth,
	sex: _sex,
	visitDate,
	inline = false,
	onCancel,
	onSuccess
}: MeasurementFormProps) {
	const [open, setOpen] = useState(false);
	const isInline = inline || Boolean(onCancel);
	const createMeasurement = useServerFn(createMeasurementFn);
	const queryClient = useQueryClient();

	const initialDate = visitDate
		? typeof visitDate === "string"
			? visitDate.slice(0, 10)
			: visitDate.toISOString().slice(0, 10)
		: new Date().toISOString().slice(0, 10);

	const form = useForm({
		defaultValues: {
			patientId,
			date: initialDate,
			ageMonths: ageMonths ?? defaultAgeMonths ?? 0,
			height: (lengthCm ?? "") as unknown as number,
			weight: "" as unknown as number,
			headCircumference: "" as unknown as number,
			notes: ""
		},
		validators: {
			onSubmit: ({ value }) => {
				const heightNum = Number(value.height) || undefined;
				const weightNum = Number(value.weight) || undefined;
				const headNum = Number(value.headCircumference) || undefined;
				const bmi =
					heightNum && heightNum > 0 && weightNum && weightNum > 0
						? +(weightNum / (heightNum / 100) ** 2).toFixed(2)
						: undefined;

				const result = measurementInsertSchema.safeParse({
					patientId: value.patientId,
					date: value.date,
					ageMonths: Number(value.ageMonths) || 0,
					height: heightNum,
					weight: weightNum,
					headCircumference: headNum,
					bmi,
					notes: value.notes || null
				});
				return result.success ? undefined : result.error;
			},
			onSubmitAsync: async ({ value }) => {
				try {
					const heightNum = Number(value.height) || null;
					const weightNum = Number(value.weight) || null;
					const headNum = Number(value.headCircumference) || null;
					const bmi =
						heightNum && heightNum > 0 && weightNum && weightNum > 0
							? +(weightNum / (heightNum / 100) ** 2).toFixed(2)
							: null;

					const result = await createMeasurement({
						data: {
							patientId: value.patientId,
							date: value.date,
							ageMonths: Number(value.ageMonths) || 0,
							height: heightNum,
							weight: weightNum,
							headCircumference: headNum,
							bmi,
							notes: value.notes || null
						}
					});
					await queryClient.invalidateQueries({
						queryKey: ["measurements", patientId]
					});
					toast.add({ type: "success", description: "Measurement recorded" });
					form.reset();
					setOpen(false);
					onSuccess?.(result);
					return undefined;
				} catch (error) {
					return { form: errorMessage(error) };
				}
			}
		}
	});

	const formBody = (
		<form
			className='grid gap-4'
			onSubmit={e => {
				e.preventDefault();
				void form.handleSubmit();
			}}
		>
			<form.Field name='date'>
				{field => (
					<div className='grid gap-2'>
						<Label>Measured Date</Label>
						<Input
							onChange={e => field.handleChange(e.target.value)}
							type='date'
							value={field.state.value}
						/>
						<FieldError field={field} />
					</div>
				)}
			</form.Field>

			<form.Field name='ageMonths'>
				{field => (
					<div className='grid gap-2'>
						<Label>Age (months)</Label>
						<Input
							min={0}
							onChange={e => field.handleChange(e.target.valueAsNumber || 0)}
							step={0.01}
							type='number'
							value={field.state.value}
						/>
						<FieldError field={field} />
					</div>
				)}
			</form.Field>

			<div className='grid grid-cols-2 gap-4'>
				<form.Field name='height'>
					{field => (
						<div className='grid gap-2'>
							<Label>Height (cm)</Label>
							<Input
								min={0}
								onChange={e => field.handleChange(e.target.valueAsNumber || 0)}
								step={0.1}
								type='number'
								value={field.state.value}
							/>
							<FieldError field={field} />
						</div>
					)}
				</form.Field>

				<form.Field name='weight'>
					{field => (
						<div className='grid gap-2'>
							<Label>Weight (kg)</Label>
							<Input
								min={0}
								onChange={e => field.handleChange(e.target.valueAsNumber || 0)}
								step={0.01}
								type='number'
								value={field.state.value}
							/>
							<FieldError field={field} />
						</div>
					)}
				</form.Field>
			</div>

			<form.Field name='headCircumference'>
				{field => (
					<div className='grid gap-2'>
						<Label>Head Circumference (cm, optional)</Label>
						<Input
							min={0}
							onChange={e => field.handleChange(e.target.valueAsNumber || 0)}
							step={0.1}
							type='number'
							value={field.state.value}
						/>
						<FieldError field={field} />
					</div>
				)}
			</form.Field>

			<form.Field name='notes'>
				{field => (
					<div className='grid gap-2'>
						<Label>Notes (optional)</Label>
						<Textarea
							onChange={e => field.handleChange(e.target.value)}
							value={field.state.value}
						/>
						<FieldError field={field} />
					</div>
				)}
			</form.Field>

			<form.Subscribe selector={s => s.errorMap.onSubmit}>
				{error => (
					<FormError
						message={
							typeof error === "object" && error !== null && "form" in error
								? String(error.form)
								: typeof error === "string"
									? error
									: undefined
						}
					/>
				)}
			</form.Subscribe>

			<div className='flex justify-end gap-2 pt-2'>
				{onCancel ? (
					<Button
						onClick={onCancel}
						type='button'
						variant='outline'
					>
						Cancel
					</Button>
				) : !isInline ? (
					<Button
						onClick={() => {
							setOpen(false);
						}}
						type='button'
						variant='outline'
					>
						Cancel
					</Button>
				) : null}
				<form.Subscribe selector={s => s.isSubmitting}>
					{s => (
						<Button
							disabled={s}
							type='submit'
						>
							{s ? "Saving…" : "Record Measurement"}
						</Button>
					)}
				</form.Subscribe>
			</div>
		</form>
	);

	if (isInline) {
		return formBody;
	}

	return (
		<Dialog
			onOpenChange={setOpen}
			open={open}
		>
			<DialogTrigger
				render={
					<Button>
						<Plus />
						Add Measurement
					</Button>
				}
			/>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Record Measurement</DialogTitle>
				</DialogHeader>
				{formBody}
			</DialogContent>
		</Dialog>
	);
}
