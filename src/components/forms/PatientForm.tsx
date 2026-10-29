// src/components/forms/PatientForm.tsx
"use client";

import { useForm } from "@tanstack/react-form";
import { useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Pencil, Plus } from "lucide-react";
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { patientInsertSchema, patientUpdateSchema } from "@/db/validations.ts";
import { createPatientFn, updatePatientFn } from "@/server/functions";

import { toast } from "../ui/toast";
import { errorMessage, FieldError, FormError } from "./_shared";

interface PatientFormProps {
	patient?: {
		id: string;
		name?: string;
		firstName?: string;
		lastName?: string;
		dob?: string;
		dateOfBirth?: Date | string;
		gender?: "boy" | "girl";
		sex?: "male" | "female" | "other" | "boy" | "girl";
		medicalRecordNumber?: string;
		guardianName?: string | null;
		guardianPhone?: string | null;
		allergies?: string | null;
		notes?: string | null;
	};
	clinicId?: string;
	inline?: boolean;
	onSuccess?: (patient: { id: string }) => void;
}

export function PatientForm({
	patient,
	inline = false,
	onSuccess
}: PatientFormProps) {
	const [open, setOpen] = useState(false);
	const isEdit = Boolean(patient?.id);
	const createPatient = useServerFn(createPatientFn);
	const updatePatient = useServerFn(updatePatientFn);
	const queryClient = useQueryClient();

	const initialName =
		patient?.name ??
		[patient?.firstName, patient?.lastName].filter(Boolean).join(" ");

	const initialDob = patient?.dob
		? patient.dob
		: patient?.dateOfBirth
			? patient.dateOfBirth instanceof Date
				? patient.dateOfBirth.toISOString().slice(0, 10)
				: String(patient.dateOfBirth).slice(0, 10)
			: new Date().toISOString().slice(0, 10);

	const initialGender =
		patient?.gender ??
		(patient?.sex === "female" || patient?.sex === "girl" ? "girl" : "boy");

	const form = useForm({
		defaultValues: {
			name: initialName,
			gender: initialGender as "boy" | "girl",
			dob: initialDob,
			medicalRecordNumber: patient?.medicalRecordNumber ?? "",
			guardianName: patient?.guardianName ?? "",
			guardianPhone: patient?.guardianPhone ?? "",
			allergies: patient?.allergies ?? "",
			notes: patient?.notes ?? ""
		},
		validators: {
			onSubmit: ({ value }) => {
				const payload = {
					...value,
					guardianName: value.guardianName || null,
					guardianPhone: value.guardianPhone || null,
					allergies: value.allergies || null,
					notes: value.notes || null
				};
				const result = isEdit
					? patientUpdateSchema.safeParse(payload)
					: patientInsertSchema.safeParse(payload);
				return result.success ? undefined : result.error;
			},
			onSubmitAsync: async ({ value }) => {
				try {
					const payload = {
						...value,
						guardianName: value.guardianName || null,
						guardianPhone: value.guardianPhone || null,
						allergies: value.allergies || null,
						notes: value.notes || null
					};
					const result =
						isEdit && patient
							? await updatePatient({ data: { id: patient.id, ...payload } })
							: await createPatient({ data: payload });
					await queryClient.invalidateQueries({ queryKey: ["patients"] });
					if (patient?.id) {
						await queryClient.invalidateQueries({
							queryKey: ["patient", patient.id]
						});
					}
					toast.add({
						type: "success",
						description: isEdit ? "Patient updated" : "Patient created"
					});
					if (!isEdit) form.reset();
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
			<form.Field name='name'>
				{field => (
					<div className='grid gap-2'>
						<Label htmlFor={field.name}>Full Name</Label>
						<Input
							aria-invalid={field.state.meta.errors.length > 0}
							id={field.name}
							onBlur={field.handleBlur}
							onChange={e => field.handleChange(e.target.value)}
							value={field.state.value}
						/>
						<FieldError field={field} />
					</div>
				)}
			</form.Field>

			<div className='grid grid-cols-2 gap-4'>
				<form.Field name='gender'>
					{field => (
						<div className='grid gap-2'>
							<Label htmlFor={field.name}>Gender</Label>
							<Select
								onValueChange={(v: string) =>
									field.handleChange(v as typeof field.state.value)
								}
								value={field.state.value}
							>
								<SelectTrigger id={field.name}>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='boy'>Boy</SelectItem>
									<SelectItem value='girl'>Girl</SelectItem>
								</SelectContent>
							</Select>
							<FieldError field={field} />
						</div>
					)}
				</form.Field>

				<form.Field name='dob'>
					{field => (
						<div className='grid gap-2'>
							<Label htmlFor={field.name}>Date of Birth</Label>
							<Input
								aria-invalid={field.state.meta.errors.length > 0}
								id={field.name}
								onChange={e => field.handleChange(e.target.value)}
								type='date'
								value={field.state.value}
							/>
							<FieldError field={field} />
						</div>
					)}
				</form.Field>
			</div>

			<form.Field name='medicalRecordNumber'>
				{field => (
					<div className='grid gap-2'>
						<Label htmlFor={field.name}>Medical Record Number (MRN)</Label>
						<Input
							aria-invalid={field.state.meta.errors.length > 0}
							id={field.name}
							onChange={e => field.handleChange(e.target.value)}
							value={field.state.value}
						/>
						<FieldError field={field} />
					</div>
				)}
			</form.Field>

			<div className='grid grid-cols-2 gap-4'>
				<form.Field name='guardianName'>
					{field => (
						<div className='grid gap-2'>
							<Label htmlFor={field.name}>Guardian Name</Label>
							<Input
								id={field.name}
								onChange={e => field.handleChange(e.target.value)}
								value={field.state.value ?? ""}
							/>
						</div>
					)}
				</form.Field>

				<form.Field name='guardianPhone'>
					{field => (
						<div className='grid gap-2'>
							<Label htmlFor={field.name}>Guardian Phone</Label>
							<Input
								id={field.name}
								onChange={e => field.handleChange(e.target.value)}
								type='tel'
								value={field.state.value ?? ""}
							/>
						</div>
					)}
				</form.Field>
			</div>

			<form.Field name='allergies'>
				{field => (
					<div className='grid gap-2'>
						<Label htmlFor={field.name}>Allergies</Label>
						<Input
							id={field.name}
							onChange={e => field.handleChange(e.target.value)}
							placeholder='e.g. Penicillin, Peanuts'
							value={field.state.value ?? ""}
						/>
					</div>
				)}
			</form.Field>

			<form.Field name='notes'>
				{field => (
					<div className='grid gap-2'>
						<Label htmlFor={field.name}>Notes</Label>
						<Textarea
							id={field.name}
							onChange={e => field.handleChange(e.target.value)}
							value={field.state.value ?? ""}
						/>
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

			<form.Subscribe selector={s => s.isSubmitting}>
				{isSubmitting => (
					<Button
						disabled={isSubmitting}
						type='submit'
					>
						{isSubmitting
							? "Saving…"
							: isEdit
								? "Save Patient"
								: "Create Patient"}
					</Button>
				)}
			</form.Subscribe>
		</form>
	);

	if (inline) return formBody;

	return (
		<Dialog
			onOpenChange={setOpen}
			open={open}
		>
			<DialogTrigger
				render={
					<Button>
						{isEdit ? <Pencil /> : <Plus />}
						{isEdit ? "Edit Patient" : "New Patient"}
					</Button>
				}
			/>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{isEdit ? "Edit Patient" : "New Patient"}</DialogTitle>
				</DialogHeader>
				{formBody}
			</DialogContent>
		</Dialog>
	);
}
