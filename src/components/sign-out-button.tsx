import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { useState } from "react";

import { resetAllCollections } from "#/db-collections/registry.ts";
import { authClient } from "@/lib/auth/client";
import { authQueryOptions } from "@/server/queries";

import { Button } from "./ui/button";

export const SignOutButton = () => {
	const queryClient = useQueryClient();
	const router = useRouter();
	const [isPending, setIsPending] = useState(false);

	const handleSignOut = async () => {
		setIsPending(true);
		try {
			const { error } = await authClient.signOut();

			if (error) {
				// Leave the session intact; surface the failure to the caller if desired.
				console.error("Sign out failed", error);
				return;
			}

			// Order matters: clear the auth cache first so any collections or
			// route guards reacting to it see the signed-out state, then reset
			// collection state, then re-run loaders.
			queryClient.setQueryData(authQueryOptions().queryKey, null);
			resetAllCollections();
			await router.invalidate();
		} finally {
			setIsPending(false);
		}
	};

	return (
		<Button
			aria-busy={isPending}
			className='w-fit'
			disabled={isPending}
			onClick={() => {
				void handleSignOut();
			}}
			size='sm'
			type='button'
			variant='destructive'
		>
			{isPending ? "Signing out…" : "Sign out"}
		</Button>
	);
};
