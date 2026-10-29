import { createServerFn } from "@tanstack/react-start";

import { getOptionalSession } from "./_auth";

export const getAuthUserFn = createServerFn({ method: "GET" }).handler(
	async () => {
		const session = await getOptionalSession();
		if (!session?.user) return null;
		return {
			id: session.user.id,
			name: session.user.name,
			email: session.user.email,
			image: session.user.image ?? null,
			clinicId: session.user.clinicId ?? null,
			role: (session.user as unknown as { role?: string | null }).role ?? null
		};
	}
);

export const $getAuthUser = getAuthUserFn;
