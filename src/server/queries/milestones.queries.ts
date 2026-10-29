// src/api/client/queries/milestones.queries.ts

import { queryOptions } from "@tanstack/react-query";

import {
	$listAchievedMilestones,
	$listMilestonesByPatient,
	$listMyDelayedMilestones,
	$listPatientMilestonesByDomain
} from "@/server/functions";

import { queryKeys } from "./keys";
import { STALE } from "./stale-time";

type Domain = "gross-motor" | "fine-motor" | "language" | "social-cognitive";

export const milestonesByPatientQueryOptions = (patientId: string) =>
	queryOptions({
		queryFn: () => $listMilestonesByPatient({ data: { patientId } }),
		queryKey: queryKeys.milestones.byPatient(patientId),
		staleTime: STALE.ENCOUNTERS
	});

export const achievedMilestonesQueryOptions = (patientId: string) =>
	queryOptions({
		queryFn: () => $listAchievedMilestones({ data: { patientId } }),
		queryKey: queryKeys.milestones.achieved(patientId),
		staleTime: STALE.ENCOUNTERS
	});

export const patientMilestonesByDomainQueryOptions = (
	patientId: string,
	domain: Domain
) =>
	queryOptions({
		queryFn: () =>
			$listPatientMilestonesByDomain({ data: { domain, patientId } }),
		queryKey: queryKeys.milestones.byDomain(patientId, domain),
		staleTime: STALE.ENCOUNTERS
	});

export const myDelayedMilestonesQueryOptions = (currentAgeMonths: number) =>
	queryOptions({
		queryFn: () => $listMyDelayedMilestones({ data: { currentAgeMonths } }),
		queryKey: queryKeys.milestones.delayed("me", currentAgeMonths),
		staleTime: STALE.DASHBOARD
	});
