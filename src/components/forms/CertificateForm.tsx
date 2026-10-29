// src/components/forms/CertificateForm.tsx
"use client";

import { useForm } from "@tanstack/react-form";
import { useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { FileBadge } from "lucide-react";
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
import { certificateInsertSchema } from "@/db/validations.ts";
import { createCertificateFn } from "@/server/functions";

import { toast } from "../ui/toast";
import { errorMessage, FieldError, FormError } from "./_shared";

interface CertificateFormProps {
	patientId: string;
	visitId?: string;
	type: "medical" | "school" | "travel" | "fitness" | "absence";
	onSuccess?: (c: { id: string }) => void;
}

export function CertificateForm({
	patientId,
	type,
	onSuccess
}: CertificateFormProps) {
	const [open, setOpen] = useState(false);
	const createCertificate = useServerFn(createCertificateFn);
	const queryClient = useQueryClient();

	const form = useForm({
		defaultValues: {
			patientId,
			certificateType: type,
			title: `${type.charAt(0).toUpperCase() + type.slice(1)} Certificate`,
			issueDate: new Date().toISOString().slice(0, 10),
			body: "",
			issuedBy: "",
			notes: ""
		},
		validators: {
			onSubmit: ({ value }) => {
				const result = certificateInsertSchema.safeParse({
					...value,
					issuedBy: value.issuedBy || null,
					notes: value.notes || null
				});
				return result.success ? undefined : result.error;
			},
			onSubmitAsync: async ({ value }) => {
				try {
					const result = await createCertificate({
						data: {
							patientId: value.patientId,
							certificateType: value.certificateType,
							title: value.title,
							issueDate: value.issueDate,
							body: value.body,
							issuedBy: value.issuedBy || null,
							notes: value.notes || null
						}
					});
					await queryClient.invalidateQueries({
						queryKey: ["certificates", patientId]
					});
					toast.add({ type: "success", description: "Certificate issued" });
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
			<form.Field name='title'>
				{field => (
					<div className='grid gap-2'>
						<Label>Title</Label>
						<Input
							onChange={e => field.handleChange(e.target.value)}
							value={field.state.value}
						/>
						<FieldError field={field} />
					</div>
				)}
			</form.Field>

			<form.Field name='issueDate'>
				{field => (
					<div className='grid gap-2'>
						<Label>Issue Date</Label>
						<Input
							onChange={e => field.handleChange(e.target.value)}
							type='date'
							value={field.state.value}
						/>
						<FieldError field={field} />
					</div>
				)}
			</form.Field>

			<form.Field name='body'>
				{field => (
					<div className='grid gap-2'>
						<Label>Certificate Body</Label>
						<Textarea
							className='min-h-[160px]'
							onChange={e => field.handleChange(e.target.value)}
							placeholder='To whom it may concern…'
							value={field.state.value}
						/>
						<FieldError field={field} />
					</div>
				)}
			</form.Field>

			<form.Field name='issuedBy'>
				{field => (
					<div className='grid gap-2'>
						<Label>Issued By (optional)</Label>
						<Input
							onChange={e => field.handleChange(e.target.value)}
							value={field.state.value}
						/>
						<FieldError field={field} />
					</div>
				)}
			</form.Field>

			<form.Field name='notes'>
				{field => (
					<div className='grid gap-2'>
						<Label>Internal Notes</Label>
						<Textarea
							onChange={e => field.handleChange(e.target.value)}
							value={field.state.value}
						/>
						<FieldError field={field} />
					</div>
				)}
			</form.Field>

			<form.Subscribe selector={s => s.errorMap.onSubmit}>
				{e => (
					<FormError
						message={
							typeof e === "object" && e !== null && "form" in e
								? String(e.form)
								: typeof e === "string"
									? e
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
						{s ? "Issuing…" : "Issue Certificate"}
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
					<Button variant='outline'>
						<FileBadge />
						New {type} certificate
					</Button>
				}
			/>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Issue {type} Certificate</DialogTitle>
				</DialogHeader>
				{formBody}
			</DialogContent>
		</Dialog>
	);
}
