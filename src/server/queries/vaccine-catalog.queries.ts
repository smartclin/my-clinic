// src/api/client/queries/vaccine-catalog.queries.ts

import { queryOptions } from "@tanstack/react-query";

import {
	$findVaccineById,
	$listMandatoryVaccines,
	$listVaccineCatalog
} from "@/server/functions";

import { queryKeys } from "./keys";
import { STALE } from "./stale-time";

export const vaccineCatalogQueryOptions = () =>
	queryOptions({
		queryFn: () => $listVaccineCatalog(),
		queryKey: queryKeys.vaccineCatalog.list(),
		staleTime: STALE.STATIC
	});

export const mandatoryVaccinesQueryOptions = () =>
	queryOptions({
		queryFn: () => $listMandatoryVaccines(),
		queryKey: queryKeys.vaccineCatalog.mandatory(),
		staleTime: STALE.STATIC
	});

export const vaccineByIdQueryOptions = (id: string) =>
	queryOptions({
		enabled: id.length > 0,
		queryFn: () => $findVaccineById({ data: { id } }),
		queryKey: queryKeys.vaccineCatalog.detail(id),
		staleTime: STALE.STATIC
	});
