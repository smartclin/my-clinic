// src/routes/index.tsx
//
// The one and only route that owns the `/` path. `_auth/route.tsx` is a
// pathless layout (`'/_auth'`), so it does not conflict with this file —
// but if you ever change that id to `'/_auth/'`, the generator will
// throw "Conflicting configuration paths for '/'".

import { createFileRoute, redirect } from "@tanstack/react-router";

import { authUserQueryOptions } from "../server/queries";

export const Route = createFileRoute("/")({
	beforeLoad: async ({ context }) => {
		// `authUserQueryOptions` is cached (staleTime: STATIC), so this is a
		// single fetch on first navigation and a cache hit thereafter. The
		// `_auth` layout runs the same query — this one just decides where
		// to send the user before the layout ever mounts.
		const user = await context.queryClient.fetchQuery(authUserQueryOptions());

		throw redirect({ to: user ? "/app" : "/login" });
	}
});
