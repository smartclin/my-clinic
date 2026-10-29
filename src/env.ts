import { createEnv } from "@t3-oss/env-core";
import dotenv from "dotenv";
import { z } from "zod";

// Vite only exposes `VITE_`-prefixed vars on `import.meta.env`. Server-only
// vars (DATABASE_URL, BETTER_AUTH_SECRET) must be loaded explicitly before
// `createEnv` runs, or they will be `undefined` on `vite dev`.
//
// `.env.local` takes precedence over `.env` — same order as the seed script.
// `dotenv` is a no-op if the files are missing, so this is safe in production
// where the platform injects `process.env` directly.
dotenv.config({ path: [".env.local", ".env"] });

export const env = createEnv({
	server: {
		SERVER_URL: z.url().optional(),
		DATABASE_URL: z.url(),
		BETTER_AUTH_SECRET: z.string().min(32),
		BETTER_AUTH_URL: z.url().optional(),
		CORS_ORIGIN: z.string().optional()
	},

	clientPrefix: "VITE_",

	client: {
		VITE_APP_TITLE: z.string().min(1).optional(),
		VITE_BASE_URL: z.string().optional(),
		VITE_WEB_URL: z.string().optional(),
		VITE_SERVER_URL: z.string().optional()
	},

	// Merge both: server vars live on `process.env` (now populated by dotenv),
	// VITE_ vars live on `import.meta.env`. Neither object alone has both.
	runtimeEnv: { ...process.env, ...import.meta.env },

	emptyStringAsUndefined: true
});
