// oxlint-disable shadcn/no-arbitrary-values
// src/routes/_guest/route.tsx
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { HeartPulse } from "lucide-react";

import { authQueryOptions } from "@/server/queries";

const CURRENT_YEAR = new Date().getFullYear();

const GuestLayout = () => (
	<div className='bg-sidebar relative flex min-h-svh flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8'>
		{/* Decorative Background */}
		<div className='absolute inset-0 -z-10 h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] [background-size:24px_24px] dark:bg-[radial-gradient(#27272a_1px,transparent_1px)]' />

		<div className='flex w-full max-w-[420px] flex-col gap-8'>
			{/* Brand Header */}
			<div className='flex flex-col items-center gap-4 text-center'>
				<div className='bg-card ring-foreground/5 flex size-24 items-center justify-center overflow-hidden rounded-3xl shadow-xl ring-1'>
					<img
						alt='Dr. Hazem Ali Clinic Logo'
						className='size-full object-cover'
						src='/brand/logo-192.png'
					/>
				</div>
				<div className='space-y-1'>
					<h1 className='text-foreground text-2xl font-bold tracking-tight'>
						Dr. Hazem Ali
					</h1>
					<p className='text-muted-foreground text-xs font-medium'>
						Pediatrician &bull; Neonatologist &bull; IBCLC
					</p>
				</div>
			</div>

			{/* Auth Form Card */}
			<div className='border-border/80 bg-card/80 rounded-3xl border p-6 shadow-2xl backdrop-blur-xl sm:p-8'>
				<Outlet />
			</div>

			{/* Footer */}
			<div className='text-muted-foreground flex items-center justify-center gap-2 text-xs'>
				<HeartPulse className='size-3.5' />
				<span>Secure Medical Portal &copy; {CURRENT_YEAR}</span>
			</div>
		</div>
	</div>
);

export const Route = createFileRoute("/_guest")({
	component: GuestLayout,
	beforeLoad: async ({ context }) => {
		const REDIRECT_URL = "/app";

		const user = await context.queryClient.fetchQuery(authQueryOptions());

		if (user) {
			throw redirect({ to: REDIRECT_URL });
		}

		return { redirectUrl: REDIRECT_URL };
	}
});
