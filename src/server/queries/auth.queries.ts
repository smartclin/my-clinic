// src/api/client/queries/auth.queries.ts

import { queryOptions } from "@tanstack/react-query";

import { getAuthUserFn } from "../functions/auth";
import { queryKeys } from "./keys";
import { STALE } from "./stale-time";

export const authUserQueryOptions = () =>
	queryOptions({
		queryFn: () => getAuthUserFn(),
		queryKey: queryKeys.auth.user(),
		staleTime: STALE.STATIC
	});

export const authQueryOptions = authUserQueryOptions;
