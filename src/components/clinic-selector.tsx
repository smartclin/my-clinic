// src/components/clinic-selector.tsx
"use client";

import { useQuery } from "@tanstack/react-query";

import { useActiveClinicId } from "#/hooks/clinic-context.hooks.ts";
import { clinicContextActions } from "#/stores/context.ts";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";

import { clinicsListQueryOptions } from "../server/queries";

export const ClinicSelector = () => {
	// `useClinics` was a wrapper; call the query directly so the return type
	// is inferred from `clinicsListQueryOptions` instead of being `unknown`.
	const { data: clinics, isPending } = useQuery(clinicsListQueryOptions());
	const activeId = useActiveClinicId();

	if (isPending) {
		return (
			<Skeleton
				aria-busy='true'
				aria-label='Loading clinics'
				className='h-8 w-40'
			/>
		);
	}

	// `clinics` is `Awaited<typeof $listClinics>`, so `c` below is typed.
	const list = clinics ?? [];
	const active = list.find(c => c.id === activeId);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				render={
					<Button
						className='max-w-56 justify-between'
						variant='outline'
					/>
				}
			>
				<span className='truncate'>{active?.name ?? "Select clinic"}</span>
			</DropdownMenuTrigger>
			<DropdownMenuContent className='bg-card w-56'>
				<DropdownMenuLabel>Clinic</DropdownMenuLabel>
				<DropdownMenuSeparator />
				{list.length === 0 && (
					<DropdownMenuItem disabled>No clinics yet</DropdownMenuItem>
				)}
				{list.map(c => (
					<DropdownMenuItem
						className={c.id === activeId ? "font-medium" : undefined}
						key={c.id}
						onClick={() => {
							clinicContextActions.setClinic(c.id);
						}}
					>
						{c.name}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
