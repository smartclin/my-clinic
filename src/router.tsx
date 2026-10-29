import { QueryClientProvider } from "@tanstack/react-query";
import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import type { ReactNode } from "react";

import Loader from "#/components/loader";
import {
	RootErrorComponent,
	RootNotFoundComponent
} from "#/components/root-components";

import {
	getContext,
	queryClient
} from "./integrations/tanstack-query/root-provider";
import { routeTree } from "./routeTree.gen";

function RouterWrap({ children }: { children: ReactNode }) {
	return (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
}

export function getRouter() {
	const context = getContext();

	const router = createTanStackRouter({
		Wrap: RouterWrap,
		context,
		defaultErrorComponent: RootErrorComponent,
		defaultNotFoundComponent: () => <RootNotFoundComponent />,
		defaultPendingComponent: () => <Loader />,
		defaultPreload: "intent",
		defaultPreloadStaleTime: 0,
		defaultStructuralSharing: true,
		routeTree,
		scrollRestoration: true
	});

	setupRouterSsrQueryIntegration({ router, queryClient: context.queryClient });

	return router;
}

declare module "@tanstack/react-router" {
	interface Register {
		router: ReturnType<typeof getRouter>;
	}
}
