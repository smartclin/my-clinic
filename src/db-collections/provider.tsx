// src/lib/collections/provider.tsx
"use client";

import { DbProvider } from "@tanstack/react-db";
import type { ReactNode } from "react";

import { dbClient } from "./client";

export function CollectionsProvider({ children }: { children: ReactNode }) {
	return <DbProvider client={dbClient}>{children}</DbProvider>;
}
