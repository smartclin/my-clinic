// src/components/forms/PrescriptionForm.tsx
"use client";

import { useForm } from "@tanstack/react-form";
import { useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Plus, Trash2 } from "lucide-react";
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
import { prescriptionInsertSchema } from "@/db/validations.ts";
import { createPrescriptionFn } from "@/server/functions";

import { toast } from "../ui/toast";
import { errorMessage, FieldError, FormError } from "./_shared";

export interface PrescriptionFormProps {
	patientId?: string;
	visitId?: string;
	prescription?: {
		id: string;
		patientId: string;
		prescriptionDate?: string;
		status?: "active" | "completed" | "cancelled";
		instructions?: string | null;
		notes?: string | null;
		medications?: Array<{
			drugId?: string;
			name: string;
			dose: string;
			frequency: string;
			duration: string;
			route: "IV" | "IM" | "Oral" | "Inhalation" | "PR";
			instructions?: string | null;
		}> | null;
	};
	inline?: boolean;
	onCancel?: () => void;
	onSuccess?: (p: { id: string }) => void;
}

export function PrescriptionForm({
	patientId,
	prescription,
	inline = false,
	onCancel,
	onSuccess
}: PrescriptionFormProps) {
	const [open, setOpen] = useState(false);
	const isEdit = Boolean(prescription?.id);
	const isInline = inline || Boolean(onCancel) || isEdit;
	const createPrescription = useServerFn(createPrescriptionFn);
	const queryClient = useQueryClient();

	const activePatientId = prescription?.patientId ?? patientId ?? "";

	const form = useForm({
		defaultValues: {
			patientId: activePatientId,
			prescriptionDate:
				prescription?.prescriptionDate ?? new Date().toISOString().slice(0, 10),
			status: (prescription?.status ?? "active") as
				| "active"
				| "completed"
				| "cancelled",
			instructions: prescription?.instructions ?? "",
			notes: prescription?.notes ?? "",
			medications: prescription?.medications?.length
				? prescription.medications.map(m => ({
						drugId: m.drugId ?? "med-1",
						name: m.name ?? "",
						dose: m.dose ?? "",
						frequency: m.frequency ?? "",
						duration: m.duration ?? "",
						route: m.route ?? "Oral",
						instructions: m.instructions ?? ""
					}))
				: [
						{
							drugId: "med-1",
							name: "",
							dose: "",
							frequency: "",
							duration: "",
							route: "Oral" as const,
							instructions: ""
						}
					]
		},
		validators: {
			onSubmit: ({ value }) => {
				const result = prescriptionInsertSchema.safeParse({
					patientId: value.patientId,
					prescriptionDate: value.prescriptionDate,
					status: value.status,
					instructions: value.instructions || null,
					notes: value.notes || null,
					medications: value.medications.map((m, idx) => ({
						drugId: m.drugId || `med-${idx + 1}`,
						name: m.name,
						dose: m.dose,
						frequency: m.frequency,
						duration: m.duration,
						route: m.route,
						instructions: m.instructions || undefined
					}))
				});
				return result.success ? undefined : result.error;
			},
			onSubmitAsync: async ({ value }) => {
				try {
					const result = await createPrescription({
						data: {
							patientId: value.patientId,
							prescriptionDate: value.prescriptionDate,
							status: value.status,
							instructions: value.instructions || null,
							notes: value.notes || null,
							medications: value.medications.map((m, idx) => ({
								drugId: m.drugId || `med-${idx + 1}`,
								name: m.name,
								dose: m.dose,
								frequency: m.frequency,
								duration: m.duration,
								route: m.route,
								instructions: m.instructions || undefined
							}))
						}
					});
					await queryClient.invalidateQueries({
						queryKey: ["prescriptions", patientId]
					});
					toast.add({ type: "success", description: "Prescription issued" });
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
			<form.Field name='prescriptionDate'>
				{field => (
					<div className='grid gap-2'>
						<Label>Prescription Date</Label>
						<Input
							onChange={e => field.handleChange(e.target.value)}
							type='date'
							value={field.state.value}
						/>
						<FieldError field={field} />
					</div>
				)}
			</form.Field>

			<form.Field
				mode='array'
				name='medications'
			>
				{field => (
					<div className='grid gap-3'>
						<div className='flex items-center justify-between'>
							<Label>Medications</Label>
							<Button
								onClick={() =>
									field.pushValue({
										drugId: `med-${field.state.value.length + 1}`,
										name: "",
										dose: "",
										frequency: "",
										duration: "7 days",
										route: "Oral",
										instructions: ""
									})
								}
								size='sm'
								type='button'
								variant='outline'
							>
								<Plus /> Add Medication
							</Button>
						</div>
						{field.state.value.map((_, i) => (
							<div
								className='grid gap-2 rounded-md border p-3'
								key={i}
							>
								<div className='grid grid-cols-2 gap-2'>
									<form.Field name={`medications[${i}].name`}>
										{f => (
											<div className='grid gap-1'>
												<Label className='text-xs'>Medication Name</Label>
												<Input
													onChange={e => f.handleChange(e.target.value)}
													placeholder='e.g. Amoxicillin'
													value={f.state.value}
												/>
											</div>
										)}
									</form.Field>
									<form.Field name={`medications[${i}].dose`}>
										{f => (
											<div className='grid gap-1'>
												<Label className='text-xs'>Dose</Label>
												<Input
													onChange={e => f.handleChange(e.target.value)}
													placeholder='e.g. 250mg or 5ml'
													value={f.state.value}
												/>
											</div>
										)}
									</form.Field>
								</div>
								<div className='grid grid-cols-3 gap-2'>
									<form.Field name={`medications[${i}].frequency`}>
										{f => (
											<div className='grid gap-1'>
												<Label className='text-xs'>Frequency</Label>
												<Input
													onChange={e => f.handleChange(e.target.value)}
													placeholder='e.g. TID / Q8H'
													value={f.state.value}
												/>
											</div>
										)}
									</form.Field>
									<form.Field name={`medications[${i}].duration`}>
										{f => (
											<div className='grid gap-1'>
												<Label className='text-xs'>Duration</Label>
												<Input
													onChange={e => f.handleChange(e.target.value)}
													placeholder='e.g. 7 days'
													value={f.state.value}
												/>
											</div>
										)}
									</form.Field>
									<form.Field name={`medications[${i}].route`}>
										{f => (
											<div className='grid gap-1'>
												<Label className='text-xs'>Route</Label>
												<Select
													onValueChange={(v: string) =>
														f.handleChange(v as typeof f.state.value)
													}
													value={f.state.value}
												>
													<SelectTrigger>
														<SelectValue />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value='Oral'>Oral</SelectItem>
														<SelectItem value='IV'>IV</SelectItem>
														<SelectItem value='IM'>IM</SelectItem>
														<SelectItem value='Inhalation'>
															Inhalation
														</SelectItem>
														<SelectItem value='PR'>PR</SelectItem>
													</SelectContent>
												</Select>
											</div>
										)}
									</form.Field>
								</div>
								<form.Field name={`medications[${i}].instructions`}>
									{f => (
										<div className='grid gap-1'>
											<Label className='text-xs'>Instructions (optional)</Label>
											<Input
												onChange={e => f.handleChange(e.target.value)}
												placeholder='e.g. Take after meals'
												value={f.state.value ?? ""}
											/>
										</div>
									)}
								</form.Field>
								{field.state.value.length > 1 && (
									<Button
										className='justify-self-start'
										onClick={() => field.removeValue(i)}
										size='sm'
										type='button'
										variant='ghost'
									>
										<Trash2 className='mr-1 h-3 w-3' /> Remove
									</Button>
								)}
							</div>
						))}
					</div>
				)}
			</form.Field>

			<form.Field name='instructions'>
				{field => (
					<div className='grid gap-2'>
						<Label>General Instructions</Label>
						<Textarea
							onChange={e => field.handleChange(e.target.value)}
							placeholder='e.g. Drink plenty of water and rest'
							value={field.state.value}
						/>
						<FieldError field={field} />
					</div>
				)}
			</form.Field>

			<form.Field name='notes'>
				{field => (
					<div className='grid gap-2'>
						<Label>Internal Notes (optional)</Label>
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
							{s ? "Saving…" : isEdit ? "Save Changes" : "Issue Prescription"}
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
						New Prescription
					</Button>
				}
			/>
			<DialogContent className='max-h-[90vh] overflow-y-auto sm:max-w-[600px]'>
				<DialogHeader>
					<DialogTitle>
						{isEdit ? "Edit Prescription" : "Issue Prescription"}
					</DialogTitle>
				</DialogHeader>
				{formBody}
			</DialogContent>
		</Dialog>
	);
}
