// src/api/client/queries/certificates.queries.ts

import { queryOptions } from "@tanstack/react-query";

import {
	$findCertificateById,
	$listCertificatesByPatient
} from "@/server/functions";

import { queryKeys } from "./keys";
import { STALE } from "./stale-time";

export const certificatesByPatientQueryOptions = (patientId: string) =>
	queryOptions({
		queryFn: () => $listCertificatesByPatient({ data: { patientId } }),
		queryKey: queryKeys.certificates.byPatient(patientId),
		staleTime: STALE.LIST
	});

export const certificateDetailQueryOptions = (id: string) =>
	queryOptions({
		queryFn: () => $findCertificateById({ data: { id } }),
		queryKey: queryKeys.certificates.detail(id),
		staleTime: STALE.DETAIL
	});
