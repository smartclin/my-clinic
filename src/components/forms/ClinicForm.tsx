// src/components/forms/ClinicForm.tsx
"use client";

import { useForm } from "@tanstack/react-form";
import { useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Pencil, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

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
import { clinicInsertSchema } from "@/db/validations.ts";
import { createClinicFn, updateClinicFn } from "@/server/functions";

import { errorMessage, FieldError, FormError } from "./_shared";

export interface ClinicFormProps {
	clinic?: {
		id: string;
		name: string;
		address?: string | null;
		phone?: string | null;
		email?: string | null;
	};
	inline?: boolean;
	onCancel?: () => void;
	onSuccess?: (c: { id: string }) => void;
}

export function ClinicForm({
	clinic,
	inline = false,
	onCancel,
	onSuccess
}: ClinicFormProps) {
	const [open, setOpen] = useState(false);
	const isEdit = Boolean(clinic?.id);
	const createClinic = useServerFn(createClinicFn);
	const updateClinic = useServerFn(updateClinicFn);
	const queryClient = useQueryClient();

	const form = useForm({
		defaultValues: {
			name: clinic?.name ?? "",
			address: clinic?.address ?? "",
			phone: clinic?.phone ?? "",
			email: clinic?.email ?? ""
		},
		validators: {
			onSubmit: ({ value }) => {
				const result = clinicInsertSchema.safeParse({
					...value,
					address: value.address || null,
					phone: value.phone || null,
					email: value.email || null
				});
				return result.success ? undefined : result.error;
			},
			onSubmitAsync: async ({ value }) => {
				try {
					let result: { id: string };
					if (isEdit && clinic?.id) {
						result = await updateClinic({
							data: {
								id: clinic.id,
								name: value.name,
								address: value.address || null,
								phone: value.phone || null,
								email: value.email || null
							}
						});
					} else {
						result = await createClinic({
							data: {
								name: value.name,
								address: value.address || null,
								phone: value.phone || null,
								email: value.email || null
							}
						});
					}
					await queryClient.invalidateQueries({ queryKey: ["clinics"] });
					toast.success(isEdit ? "Clinic updated" : "Clinic created");
					setOpen(false);
					form.reset();
					onSuccess?.(result);
				} catch (err) {
					return {
						form: errorMessage(err)
					};
				}
			}
		}
	});

	const formBody = (
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

			<form.Field name='name'>
				{field => (
					<div className='flex flex-col gap-1.5'>
						<Label htmlFor={field.name}>Clinic Name</Label>
						<Input
							id={field.name}
							name={field.name}
							onBlur={field.handleBlur}
							onChange={e => {
								field.handleChange(e.target.value);
							}}
							placeholder='e.g. Cairo Pediatric Center'
							value={field.state.value}
						/>
						<FieldError state={field.state} />
					</div>
				)}
			</form.Field>

			<div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
				<form.Field name='phone'>
					{field => (
						<div className='flex flex-col gap-1.5'>
							<Label htmlFor={field.name}>Phone Number</Label>
							<Input
								id={field.name}
								name={field.name}
								onBlur={field.handleBlur}
								onChange={e => {
									field.handleChange(e.target.value);
								}}
								placeholder='e.g. +20 10 1234 5678'
								value={field.state.value}
							/>
							<FieldError state={field.state} />
						</div>
					)}
				</form.Field>

				<form.Field name='email'>
					{field => (
						<div className='flex flex-col gap-1.5'>
							<Label htmlFor={field.name}>Email Address</Label>
							<Input
								id={field.name}
								name={field.name}
								onBlur={field.handleBlur}
								onChange={e => {
									field.handleChange(e.target.value);
								}}
								placeholder='e.g. contact@clinic.com'
								type='email'
								value={field.state.value}
							/>
							<FieldError state={field.state} />
						</div>
					)}
				</form.Field>
			</div>

			<form.Field name='address'>
				{field => (
					<div className='flex flex-col gap-1.5'>
						<Label htmlFor={field.name}>Address</Label>
						<Input
							id={field.name}
							name={field.name}
							onBlur={field.handleBlur}
							onChange={e => {
								field.handleChange(e.target.value);
							}}
							placeholder='e.g. 12 El-Tahrir St, Cairo'
							value={field.state.value}
						/>
						<FieldError state={field.state} />
					</div>
				)}
			</form.Field>

			<div className='flex justify-end gap-2 pt-2'>
				{onCancel ? (
					<Button
						onClick={onCancel}
						type='button'
						variant='outline'
					>
						Cancel
					</Button>
				) : !inline ? (
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
					{isSubmitting => (
						<Button
							disabled={isSubmitting}
							type='submit'
						>
							{isSubmitting
								? "Saving…"
								: isEdit
									? "Save Changes"
									: "Create Clinic"}
						</Button>
					)}
				</form.Subscribe>
			</div>
		</form>
	);

	if (inline) {
		return formBody;
	}

	return (
		<Dialog
			onOpenChange={setOpen}
			open={open}
		>
			<DialogTrigger render={<Button />}>
				{isEdit ? (
					<>
						<Pencil aria-hidden='true' /> Edit Clinic
					</>
				) : (
					<>
						<Plus aria-hidden='true' /> Add Clinic
					</>
				)}
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{isEdit ? "Edit Clinic" : "Add Clinic"}</DialogTitle>
				</DialogHeader>
				{formBody}
			</DialogContent>
		</Dialog>
	);
}
