// src/api/client/queries/milestone-catalog.queries.ts

import { queryOptions } from "@tanstack/react-query";

import {
	$findMilestoneById,
	$listMilestoneCatalog,
	$listMilestonesByDomain
} from "@/server/functions";

import { queryKeys } from "./keys";
import { STALE } from "./stale-time";

type Domain = "gross-motor" | "fine-motor" | "language" | "social-cognitive";

export const milestoneCatalogQueryOptions = () =>
	queryOptions({
		queryFn: () => $listMilestoneCatalog(),
		queryKey: queryKeys.milestoneCatalog.list(),
		staleTime: STALE.STATIC
	});

export const milestoneCatalogByDomainQueryOptions = (domain: Domain) =>
	queryOptions({
		queryFn: () => $listMilestonesByDomain({ data: { domain } }),
		queryKey: queryKeys.milestoneCatalog.byDomain(domain),
		staleTime: STALE.STATIC
	});

export const milestoneCatalogDetailQueryOptions = (id: string) =>
	queryOptions({
		enabled: id.length > 0,
		queryFn: () => $findMilestoneById({ data: { id } }),
		queryKey: queryKeys.milestoneCatalog.detail(id),
		staleTime: STALE.STATIC
	});
