import { useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useRouter } from "@tanstack/react-router";
import { useState } from "react";

import { resetAllCollections } from "#/db-collections/registry.ts";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth/client";

import { authQueryOptions } from "../server/queries";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";

export const UserMenu = () => {
	const navigate = useNavigate();
	const router = useRouter();
	const queryClient = useQueryClient();
	const { data: session, isPending } = authClient.useSession();
	const [isSigningOut, setIsSigningOut] = useState(false);

	const handleSignOut = async () => {
		setIsSigningOut(true);
		try {
			const { error } = await authClient.signOut();
			if (error) {
				console.error("Sign out failed", error);
				return;
			}

			// Clear auth cache *before* routing so `_guest/route.tsx` doesn't
			// redirect the user straight back to `/app` from a stale session.
			queryClient.setQueryData(authQueryOptions().queryKey, null);
			resetAllCollections();
			await router.invalidate();

			await navigate({ to: "/" });
		} finally {
			setIsSigningOut(false);
		}
	};

	if (isPending) {
		return (
			<Skeleton
				aria-busy='true'
				aria-label='Loading account menu'
				className='h-9 w-24'
			/>
		);
	}

	if (!session) {
		return (
			<Button
				render={<Link to='/login' />}
				variant='outline'
			>
				Sign In
			</Button>
		);
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger render={<Button variant='outline' />}>
				{session.user.name}
			</DropdownMenuTrigger>
			<DropdownMenuContent className='bg-card'>
				<DropdownMenuGroup>
					<DropdownMenuLabel>My Account</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<div className='text-muted-foreground px-2 py-1.5 text-sm'>
						{session.user.email}
					</div>
					<DropdownMenuItem
						disabled={isSigningOut}
						onClick={() => {
							void handleSignOut();
						}}
						variant='destructive'
					>
						{isSigningOut ? "Signing out…" : "Sign Out"}
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
