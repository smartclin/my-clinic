// src/routes/_auth/route.tsx
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { authQueryOptions } from "@/server/queries";

export const Route = createFileRoute("/_auth")({
	beforeLoad: async ({ context, location }) => {
		const user = await context.queryClient.fetchQuery({
			...authQueryOptions(),
			staleTime: Number.POSITIVE_INFINITY // avoid refetch on every route enter
		});
		if (!user) {
			throw redirect({ to: "/login", search: { redirect: location.href } });
		}
		return { user };
	},
	component: () => <Outlet />
});
