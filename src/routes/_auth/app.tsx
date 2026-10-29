import { createFileRoute, Outlet } from "@tanstack/react-router";

import Header from "@/components/header";

export const Route = createFileRoute("/_auth/app")({
	component: AppLayout
});

function AppLayout() {
	return (
		<div className='bg-background min-h-screen'>
			<Header />
			<main className='container mx-auto px-4 py-6'>
				<Outlet />
			</main>
		</div>
	);
}
