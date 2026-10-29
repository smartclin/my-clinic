// src/lib/collections/client.ts
//
// One DbClient per browser tab. The `queryClient` dependency is what
// `queryCollectionOptions` uses to populate collections from TanStack
// Query; sharing it with the app's existing `queryClient` means a
// collection read and a `useQuery` read of the same endpoint hit the
// same cache entry.
//
// The `requireDependency` call in each collection is what enforces the
// dependency is present at collection-construction time (instead of
// failing later with `undefined`).

import { DbClient } from "@tanstack/react-db";

import { queryClient } from "#/integrations/tanstack-query/root-provider.tsx";

export const dbClient = new DbClient({
	queryClient
});

export type DbClientType = typeof dbClient;
