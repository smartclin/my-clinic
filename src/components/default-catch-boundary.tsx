import type { ErrorComponentProps } from "@tanstack/react-router";
import {
	ErrorComponent,
	Link,
	rootRouteId,
	useMatch,
	useRouter
} from "@tanstack/react-router";

import { Button } from "./ui/button";

export const DefaultCatchBoundary = ({
	error
}: Readonly<ErrorComponentProps>) => {
	const router = useRouter();
	const isRoot = useMatch({
		strict: false,
		select: state => state.id === rootRouteId
	});

	console.error(error);

	// In production, render a generic message to prevent sensitive server
	// internals (stack traces, env var names) from leaking to the client.
	const isDev = import.meta.env.DEV;

	return (
		<div className='flex min-w-0 flex-1 flex-col items-center justify-center gap-6 p-4'>
			{isDev ? (
				<ErrorComponent error={error} />
			) : (
				<p className='text-destructive text-sm font-medium'>
					Something went wrong. Please try again.
				</p>
			)}
			<div className='flex flex-wrap items-center gap-2'>
				<Button
					onClick={() => {
						void router.invalidate();
					}}
					type='button'
				>
					Try Again
				</Button>
				{isRoot ? (
					<Button
						nativeButton={false}
						render={<Link to='/' />}
						variant='secondary'
					>
						Home
					</Button>
				) : (
					<Button
						nativeButton={false}
						render={
							<Link
								onClick={e => {
									e.preventDefault();
									window.history.back();
								}}
								to='/'
							/>
						}
						variant='secondary'
					>
						Go Back
					</Button>
				)}
			</div>
		</div>
	);
};
