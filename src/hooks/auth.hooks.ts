import { useQuery, useSuspenseQuery } from "@tanstack/react-query";

import { authQueryOptions } from "../server/queries";

export function useAuth() {
	const { data: user, isPending } = useQuery(authQueryOptions());
	return { user: user ?? null, isPending };
}

export function useAuthSuspense() {
	const { data: user } = useSuspenseQuery(authQueryOptions());
	return { user: user ?? null };
}
