import {
	adminClient,
	customSessionClient,
	inferAdditionalFields,
	magicLinkClient,
	organizationClient,
	twoFactorClient
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

import type { auth } from "@/lib/auth";
import { ac, roles } from "@/lib/auth/permissions";

export const authClient = createAuthClient({
	baseURL: import.meta.env.VITE_BASE_URL,

	plugins: [
		magicLinkClient(),
		customSessionClient<typeof auth>(),
		adminClient({ ac, roles }),
		twoFactorClient(),
		organizationClient(),
		inferAdditionalFields<typeof auth>()
	]
});

// Export the full client as well
export type AuthSession = ReturnType<typeof authClient.getSession>;
export type AuthUser = AuthSession["user"];
export type AuthRole = AuthUser["role"];
