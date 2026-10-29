// src/components/forms/MilestoneForm.tsx
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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { milestoneInsertSchema } from "@/db/validations.ts";
import { createMilestoneFn } from "@/server/functions";
import { milestoneCatalogQueryOptions } from "@/server/queries";

import { toast } from "../ui/toast";
import { errorMessage, FieldError, FormError } from "./_shared";

interface MilestoneFormProps {
	patientId: string;
	onSuccess?: (m: { id: string }) => void;
}

export function MilestoneForm({ patientId, onSuccess }: MilestoneFormProps) {
	const [open, setOpen] = useState(false);
	const createMilestone = useServerFn(createMilestoneFn);
	const queryClient = useQueryClient();
	const { data: catalog = [] } = useQuery(milestoneCatalogQueryOptions());

	const form = useForm({
		defaultValues: {
			patientId,
			milestoneId: "",
			isAchieved: true,
			achievedDate: new Date().toISOString().slice(0, 10),
			notes: ""
		},
		validators: {
			onSubmit: ({ value }) => {
				const result = milestoneInsertSchema.safeParse({
					patientId: value.patientId,
					milestoneId: value.milestoneId,
					isAchieved: value.isAchieved,
					achievedDate: value.isAchieved ? value.achievedDate : null,
					notes: value.notes || null
				});
				return result.success ? undefined : result.error;
			},
			onSubmitAsync: async ({ value }) => {
				try {
					const result = await createMilestone({
						data: {
							patientId: value.patientId,
							milestoneId: value.milestoneId,
							isAchieved: value.isAchieved,
							achievedDate: value.isAchieved ? value.achievedDate : null,
							notes: value.notes || null
						}
					});
					await queryClient.invalidateQueries({
						queryKey: ["milestones", patientId]
					});
					toast.add({ type: "success", description: "Milestone recorded" });
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
			<form.Field name='milestoneId'>
				{field => (
					<div className='grid gap-2'>
						<Label>Milestone</Label>
						<Select
							onValueChange={field.handleChange}
							value={field.state.value}
						>
							<SelectTrigger>
								<SelectValue placeholder='Select milestone…' />
							</SelectTrigger>
							<SelectContent>
								{catalog.map(m => (
									<SelectItem
										key={m.id}
										value={m.id}
									>
										{m.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<FieldError field={field} />
					</div>
				)}
			</form.Field>

			<form.Field name='isAchieved'>
				{field => (
					<div className='flex items-center gap-3'>
						<Switch
							checked={field.state.value}
							onCheckedChange={field.handleChange}
						/>
						<Label>Achieved</Label>
					</div>
				)}
			</form.Field>

			<form.Field name='achievedDate'>
				{field => (
					<div className='grid gap-2'>
						<Label>Achieved Date</Label>
						<Input
							onChange={e => field.handleChange(e.target.value)}
							type='date'
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
						{s ? "Saving…" : "Record Milestone"}
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
						New Milestone
					</Button>
				}
			/>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Record Milestone</DialogTitle>
				</DialogHeader>
				{formBody}
			</DialogContent>
		</Dialog>
	);
}
