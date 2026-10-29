import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";

import { toast } from "#/components/ui/toast.tsx";

function reportQueryError(message: string, metadata: Record<string, unknown>) {
	if (typeof globalThis.reportError === "function") {
		globalThis.reportError({ message, metadata });
		return;
	}

	console.warn(message, metadata);
}

export function getContext() {
	const queryClient = new QueryClient({
		defaultOptions: {
			mutations: { retry: false },
			queries: {
				gcTime: 5 * 60 * 1000, // 5 minutes
				refetchOnReconnect: true,
				refetchOnWindowFocus: false, // Clinic app: focus events are constant
				retry: (failureCount, error) => {
					const { status } = error as { status?: unknown };
					// Authentication/authorization failures won't recover by
					// Retrying the same request with the same session.
					if (status === 401 || status === 403) {
						return false;
					}
					return failureCount < 3;
				},
				staleTime: 30 * 1000 // 30 seconds
			}
		},

		mutationCache: new MutationCache({
			onError: (error, mutation) => {
				reportQueryError("[Mutation Error]", {
					error,
					mutationKey: (mutation as { options: { mutationKey?: unknown } })
						.options.mutationKey
				});
			}
		}),
		queryCache: new QueryCache({
			onError: (error, _query) => {
				const { status } = error as { status?: unknown };
				if (status === 401 || status === 403) {
					return;
				}
				toast.add({
					description: error.message,
					title: "Error",
					type: "error"
				});
			}
		})
	});

	return {
		queryClient
	};
}
export default function TanstackQueryProvider() {}
export const queryClient = getContext().queryClient;
