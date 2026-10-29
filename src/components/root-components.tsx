// Src/components/root-components.tsx
import { type ErrorComponentProps, Link } from "@tanstack/react-router";

/**
 * Root-level error boundary.
 *
 * Rendered by the router when a route throws. TanStack Router passes
 * `{ error, reset, info, router }` — we use `error` for display and
 * `reset` to retry the failed route without a full page reload.
 *
 * Prefer `reset()` over `window.location.reload()`: it re-runs the
 * route's loaders and components in place, preserving router state
 * (scroll position, query cache, sibling route data).
 */
export function RootErrorComponent({ error, reset }: ErrorComponentProps) {
	// In production, forward to your error reporter here.
	if (import.meta.env.DEV) {
		console.error("[RootErrorComponent]", error);
	}

	return (
		<main className='page-wrap flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center'>
			<h1 className='display-title text-3xl font-bold tracking-tight'>
				Something went wrong.
			</h1>
			<p className='mt-3 max-w-md text-sm text-[var(--muted-foreground)]'>
				{error instanceof Error
					? error.message
					: "The page failed to load. This has been logged. Try reloading, or head back to the dashboard."}
			</p>
			<div className='mt-6 flex gap-3'>
				<button
					className='btn-primary px-4 py-2 text-xs font-bold'
					onClick={reset}
					type='button'
				>
					Try again
				</button>
				<Link
					className='btn-ghost px-4 py-2 text-xs font-bold'
					to='/app'
				>
					Go to dashboard
				</Link>
			</div>
		</main>
	);
}

/**
 * Root-level 404.
 *
 * Rendered when a URL matches no route. Kept as a separate component
 * from `components/NotFound.tsx` so the router can register it as
 * `notFoundComponent` on the root route without a circular import
 * (NotFound.tsx itself imports `useRouter` from the router package).
 */
export function RootNotFoundComponent() {
	return (
		<main className='page-wrap flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center'>
			<p className='kicker mb-2'>404</p>
			<h1 className='display-title text-3xl font-bold tracking-tight'>
				We couldn't find that page.
			</h1>
			<p className='mt-3 max-w-md text-sm text-[var(--muted-foreground)]'>
				The link may be broken, or the page may have been moved.
			</p>
			<Link
				className='btn-ghost mt-6 px-4 py-2 text-xs font-bold'
				to='/app'
			>
				Go to dashboard
			</Link>
		</main>
	);
}
