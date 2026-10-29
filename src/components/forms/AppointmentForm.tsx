// src/components/forms/AppointmentForm.tsx
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
import { appointmentInsertSchema } from "@/db/validations.ts";
import { createAppointmentFn, updateAppointmentFn } from "@/server/functions";
import { authQueryOptions } from "@/server/queries";

import { toast } from "../ui/toast";
import {
	errorMessage,
	FieldError,
	FormError,
	fromDateTimeLocalString,
	toDateTimeLocalString
} from "./_shared";

export interface AppointmentFormProps {
	patientId?: string;
	clinicId?: string;
	appointment?: {
		id: string;
		patientId?: string;
		clinicId?: string;
		scheduledAt?: Date | string;
		durationMinutes?: number | null;
		reason?: string | null;
		notes?: string | null;
		status?: "scheduled" | "completed" | "cancelled" | "no-show";
	};
	inline?: boolean;
	onCancel?: () => void;
	onSuccess?: (appointment: { id: string }) => void;
}

export function AppointmentForm({
	patientId,
	clinicId,
	appointment,
	inline = false,
	onCancel,
	onSuccess
}: AppointmentFormProps) {
	const [open, setOpen] = useState(false);
	const isEdit = Boolean(appointment?.id);
	const isInline = inline || Boolean(onCancel) || isEdit;

	const createAppointment = useServerFn(createAppointmentFn);
	const updateAppointment = useServerFn(updateAppointmentFn);
	const queryClient = useQueryClient();
	const { data: user } = useQuery(authQueryOptions());

	const activePatientId = appointment?.patientId ?? patientId ?? "";
	const activeClinicId =
		appointment?.clinicId ??
		clinicId ??
		(user as { clinicId?: string } | null)?.clinicId ??
		"";

	const form = useForm({
		defaultValues: {
			patientId: activePatientId,
			clinicId: activeClinicId,
			scheduledAt: appointment?.scheduledAt
				? new Date(appointment.scheduledAt)
				: new Date(),
			durationMinutes: appointment?.durationMinutes ?? 30,
			reason: appointment?.reason ?? "",
			notes: appointment?.notes ?? "",
			status: (appointment?.status ?? "scheduled") as
				| "scheduled"
				| "completed"
				| "cancelled"
				| "no-show"
		},
		validators: {
			onSubmit: ({ value }) => {
				const result = appointmentInsertSchema.safeParse({
					...value,
					scheduledAt: new Date(value.scheduledAt),
					reason: value.reason || null,
					notes: value.notes || null
				});
				return result.success ? undefined : result.error;
			},
			onSubmitAsync: async ({ value }) => {
				try {
					let result: { id: string };
					if (isEdit && appointment?.id) {
						result = await updateAppointment({
							data: {
								appointmentId: appointment.id,
								patch: {
									scheduledAt: new Date(value.scheduledAt).toISOString(),
									durationMinutes: value.durationMinutes,
									status: value.status,
									reason: value.reason || null,
									notes: value.notes || null
								}
							}
						});
					} else {
						result = await createAppointment({
							data: {
								patientId: value.patientId,
								clinicId: value.clinicId,
								scheduledAt: new Date(value.scheduledAt),
								durationMinutes: value.durationMinutes,
								status: value.status,
								reason: value.reason || null,
								notes: value.notes || null
							}
						});
					}
					await queryClient.invalidateQueries({
						queryKey: ["appointments"]
					});
					toast.add({
						type: "success",
						data: isEdit ? "Appointment updated" : "Appointment scheduled"
					});
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
							placeholder='e.g. uuid'
							value={field.state.value}
						/>
						<FieldError state={field.state} />
					</div>
				)}
			</form.Field>

			<div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
				<form.Field name='scheduledAt'>
					{field => (
						<div className='flex flex-col gap-1.5'>
							<Label htmlFor={field.name}>Date & Time</Label>
							<Input
								id={field.name}
								name={field.name}
								onBlur={field.handleBlur}
								onChange={e => {
									field.handleChange(fromDateTimeLocalString(e.target.value));
								}}
								type='datetime-local'
								value={toDateTimeLocalString(field.state.value)}
							/>
							<FieldError state={field.state} />
						</div>
					)}
				</form.Field>

				<form.Field name='durationMinutes'>
					{field => (
						<div className='flex flex-col gap-1.5'>
							<Label htmlFor={field.name}>Duration (minutes)</Label>
							<Input
								id={field.name}
								max={240}
								min={5}
								name={field.name}
								onBlur={field.handleBlur}
								onChange={e => {
									field.handleChange(Number(e.target.value));
								}}
								step={5}
								type='number'
								value={field.state.value}
							/>
							<FieldError state={field.state} />
						</div>
					)}
				</form.Field>
			</div>

			<form.Field name='status'>
				{field => (
					<div className='flex flex-col gap-1.5'>
						<Label htmlFor={field.name}>Status</Label>
						<Select
							onValueChange={v => {
								field.handleChange(
									v as "scheduled" | "completed" | "cancelled" | "no-show"
								);
							}}
							value={field.state.value}
						>
							<SelectTrigger id={field.name}>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value='scheduled'>Scheduled</SelectItem>
								<SelectItem value='completed'>Completed</SelectItem>
								<SelectItem value='cancelled'>Cancelled</SelectItem>
								<SelectItem value='no-show'>No Show</SelectItem>
							</SelectContent>
						</Select>
						<FieldError state={field.state} />
					</div>
				)}
			</form.Field>

			<form.Field name='reason'>
				{field => (
					<div className='flex flex-col gap-1.5'>
						<Label htmlFor={field.name}>Reason for Visit</Label>
						<Input
							id={field.name}
							name={field.name}
							onBlur={field.handleBlur}
							onChange={e => {
								field.handleChange(e.target.value);
							}}
							placeholder='e.g. Well-child check, fever'
							value={field.state.value}
						/>
						<FieldError state={field.state} />
					</div>
				)}
			</form.Field>

			<form.Field name='notes'>
				{field => (
					<div className='flex flex-col gap-1.5'>
						<Label htmlFor={field.name}>Notes</Label>
						<Textarea
							id={field.name}
							name={field.name}
							onBlur={field.handleBlur}
							onChange={e => {
								field.handleChange(e.target.value);
							}}
							placeholder='Any special instructions'
							rows={3}
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
					{isSubmitting => (
						<Button
							disabled={isSubmitting}
							type='submit'
						>
							{isSubmitting
								? "Saving…"
								: isEdit
									? "Save Changes"
									: "Schedule Appointment"}
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
			<DialogTrigger render={<Button />}>
				<Plus aria-hidden='true' />
				Schedule Appointment
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Schedule Appointment</DialogTitle>
				</DialogHeader>
				{formBody}
			</DialogContent>
		</Dialog>
	);
}
