// src/components/forms/VaccinationForm.tsx
"use client";

import { useForm } from "@tanstack/react-form";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { vaccinationInsertSchema } from "@/db/validations.ts";
import { createVaccinationFn } from "@/server/functions";
import { vaccineCatalogQueryOptions } from "@/server/queries";

import { toast } from "../ui/toast";
import { errorMessage, FieldError, FormError } from "./_shared";

interface VaccinationFormProps {
	patientId: string;
	onSuccess?: (v: { id: string }) => void;
}

export function VaccinationForm({
	patientId,
	onSuccess
}: VaccinationFormProps) {
	const [open, setOpen] = useState(false);
	const createVaccination = useServerFn(createVaccinationFn);
	const queryClient = useQueryClient();
	const { data: catalog = [] } = useQuery(vaccineCatalogQueryOptions());

	const form = useForm({
		defaultValues: {
			patientId,
			vaccineId: "",
			status: "completed" as
				| "due"
				| "scheduled"
				| "completed"
				| "missed"
				| "refused"
				| "contraindicated",
			administeredDate: new Date().toISOString().slice(0, 10),
			batchNumber: "",
			administeredBy: "",
			facility: "",
			adverseReactions: "",
			notes: ""
		},
		validators: {
			onSubmit: ({ value }) => {
				const result = vaccinationInsertSchema.safeParse({
					patientId: value.patientId,
					vaccineId: value.vaccineId,
					status: value.status,
					administeredDate: value.administeredDate || null,
					batchNumber: value.batchNumber || null,
					administeredBy: value.administeredBy || null,
					facility: value.facility || null,
					adverseReactions: value.adverseReactions || null,
					notes: value.notes || null
				});
				return result.success ? undefined : result.error;
			},
			onSubmitAsync: async ({ value }) => {
				try {
					const result = await createVaccination({
						data: {
							patientId: value.patientId,
							vaccineId: value.vaccineId,
							status: value.status,
							administeredDate: value.administeredDate || null,
							batchNumber: value.batchNumber || null,
							administeredBy: value.administeredBy || null,
							facility: value.facility || null,
							adverseReactions: value.adverseReactions || null,
							notes: value.notes || null
						}
					});
					await queryClient.invalidateQueries({
						queryKey: ["vaccinations", patientId]
					});
					toast.add({ type: "success", description: "Vaccination recorded" });
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
			<form.Field name='vaccineId'>
				{field => (
					<div className='grid gap-2'>
						<Label>Vaccine</Label>
						<Select
							onValueChange={field.handleChange}
							value={field.state.value}
						>
							<SelectTrigger>
								<SelectValue placeholder='Select vaccine…' />
							</SelectTrigger>
							<SelectContent>
								{catalog.map(v => (
									<SelectItem
										key={v.id}
										value={v.id}
									>
										{v.label} {v.disease ? `(${v.disease})` : ""}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<FieldError field={field} />
					</div>
				)}
			</form.Field>

			<div className='grid grid-cols-2 gap-4'>
				<form.Field name='status'>
					{field => (
						<div className='grid gap-2'>
							<Label>Status</Label>
							<Select
								onValueChange={(v: string) =>
									field.handleChange(v as typeof field.state.value)
								}
								value={field.state.value}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='completed'>Completed</SelectItem>
									<SelectItem value='due'>Due</SelectItem>
									<SelectItem value='scheduled'>Scheduled</SelectItem>
									<SelectItem value='missed'>Missed</SelectItem>
									<SelectItem value='refused'>Refused</SelectItem>
									<SelectItem value='contraindicated'>
										Contraindicated
									</SelectItem>
								</SelectContent>
							</Select>
							<FieldError field={field} />
						</div>
					)}
				</form.Field>

				<form.Field name='administeredDate'>
					{field => (
						<div className='grid gap-2'>
							<Label>Administered Date</Label>
							<Input
								onChange={e => field.handleChange(e.target.value)}
								type='date'
								value={field.state.value}
							/>
							<FieldError field={field} />
						</div>
					)}
				</form.Field>
			</div>

			<div className='grid grid-cols-2 gap-4'>
				<form.Field name='batchNumber'>
					{field => (
						<div className='grid gap-2'>
							<Label>Batch #</Label>
							<Input
								onChange={e => field.handleChange(e.target.value)}
								value={field.state.value ?? ""}
							/>
							<FieldError field={field} />
						</div>
					)}
				</form.Field>

				<form.Field name='administeredBy'>
					{field => (
						<div className='grid gap-2'>
							<Label>Administered By</Label>
							<Input
								onChange={e => field.handleChange(e.target.value)}
								value={field.state.value ?? ""}
							/>
							<FieldError field={field} />
						</div>
					)}
				</form.Field>
			</div>

			<form.Field name='facility'>
				{field => (
					<div className='grid gap-2'>
						<Label>Facility (optional)</Label>
						<Input
							onChange={e => field.handleChange(e.target.value)}
							placeholder='e.g. Clinic A'
							value={field.state.value ?? ""}
						/>
						<FieldError field={field} />
					</div>
				)}
			</form.Field>

			<form.Field name='adverseReactions'>
				{field => (
					<div className='grid gap-2'>
						<Label>Adverse Reactions (optional)</Label>
						<Input
							onChange={e => field.handleChange(e.target.value)}
							placeholder='e.g. Mild fever'
							value={field.state.value ?? ""}
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
							value={field.state.value ?? ""}
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

			<form.Subscribe selector={s => s.isSubmitting}>
				{s => (
					<Button
						disabled={s}
						type='submit'
					>
						{s ? "Saving…" : "Record Vaccination"}
					</Button>
				)}
			</form.Subscribe>
		</form>
	);

	return (
		<Dialog
			onOpenChange={setOpen}
			open={open}
		>
			<DialogTrigger
				render={
					<Button>
						<Plus />
						Record Vaccination
					</Button>
				}
			/>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Record Vaccination</DialogTitle>
				</DialogHeader>
				{formBody}
			</DialogContent>
		</Dialog>
	);
}
