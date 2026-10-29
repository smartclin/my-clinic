// src/components/forms/AuditLogFilterForm.tsx
"use client";

import { useForm } from "@tanstack/react-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface AuditLogFilters {
	userId?: string;
	action?: string;
	from?: Date;
	to?: Date;
}

export function AuditLogFilterForm({
	onApply
}: {
	onApply: (filters: AuditLogFilters) => void;
}) {
	const form = useForm({
		defaultValues: {
			userId: "",
			action: "",
			from: new Date(Date.now() - 7 * 86400_000),
			to: new Date()
		} as AuditLogFilters & { from: Date; to: Date },
		onSubmit: ({ value }) => {
			onApply({
				userId: value.userId || undefined,
				action: value.action || undefined,
				from: value.from,
				to: value.to
			});
		}
	});

	return (
		<form
			className='grid gap-3 md:grid-cols-4'
			onSubmit={e => {
				e.preventDefault();
				void form.handleSubmit();
			}}
		>
			<form.Field name='userId'>
				{f => (
					<div className='grid gap-2'>
						<Label>User ID</Label>
						<Input
							onChange={e => f.handleChange(e.target.value)}
							value={f.state.value ?? ""}
						/>
					</div>
				)}
			</form.Field>
			<form.Field name='action'>
				{f => (
					<div className='grid gap-2'>
						<Label>Action</Label>
						<Input
							onChange={e => f.handleChange(e.target.value)}
							value={f.state.value ?? ""}
						/>
					</div>
				)}
			</form.Field>
			<form.Field name='from'>
				{f => (
					<div className='grid gap-2'>
						<Label>From</Label>
						<Input
							onChange={e => f.handleChange(new Date(e.target.value))}
							type='date'
							value={f.state.value.toISOString().split("T")[0]}
						/>
					</div>
				)}
			</form.Field>
			<form.Field name='to'>
				{f => (
					<div className='grid gap-2'>
						<Label>To</Label>
						<Input
							onChange={e => f.handleChange(new Date(e.target.value))}
							type='date'
							value={f.state.value.toISOString().split("T")[0]}
						/>
					</div>
				)}
			</form.Field>
			<form.Subscribe selector={s => s.isSubmitting}>
				{s => (
					<Button
						className='self-end'
						disabled={s}
						type='submit'
					>
						{s ? "Applying…" : "Apply Filters"}
					</Button>
				)}
			</form.Subscribe>
		</form>
	);
}
