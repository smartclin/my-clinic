// src/routes/_guest/login.tsx
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, LoaderCircleIcon } from "lucide-react";
import * as React from "react";

import { SocialSignInButtons } from "@/components/sign-in-social-buttons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toast";
import { authClient } from "@/lib/auth/client";
import { authQueryOptions } from "@/server/queries";

const LoginForm = () => {
	const { redirectUrl } = Route.useRouteContext();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const [error, setError] = React.useState<string | null>(null);
	const errorId = React.useId();

	const { mutate: emailLoginMutate, isPending } = useMutation({
		mutationFn: async (data: { email: string; password: string }) =>
			await authClient.signIn.email(
				{ ...data, callbackURL: redirectUrl },
				{
					onError: ({ error: authError }) => {
						const message = authError.message || "Invalid email or password.";
						setError(message);
						toast.add({ type: "error", description: message });
					}
				}
			),
		onSuccess: () => {
			void queryClient.invalidateQueries({
				queryKey: authQueryOptions().queryKey
			});
			void navigate({ to: redirectUrl });
		}
	});

	const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (isPending) return;
		setError(null);

		const formData = new FormData(e.currentTarget);
		const email = formData.get("email");
		const password = formData.get("password");

		if (
			typeof email !== "string" ||
			typeof password !== "string" ||
			!email ||
			!password
		) {
			setError("Please enter both your email and password.");
			return;
		}

		emailLoginMutate({ email, password });
	};

	return (
		<div className='flex flex-col gap-6'>
			<div className='space-y-1.5 text-center'>
				<h2 className='text-foreground text-xl font-bold tracking-tight'>
					Welcome back
				</h2>
				<p className='text-muted-foreground text-sm'>
					Sign in to manage your clinic.
				</p>
			</div>

			<form
				aria-busy={isPending}
				className='space-y-6'
				noValidate
				onSubmit={handleSubmit}
			>
				<div className='space-y-4'>
					<div className='grid gap-2'>
						<Label htmlFor='email'>Email address</Label>
						<Input
							aria-describedby={error ? errorId : undefined}
							aria-invalid={error ? true : undefined}
							autoComplete='email'
							className='h-11'
							id='email'
							name='email'
							placeholder='doctor@clinic.com'
							readOnly={isPending}
							required
							type='email'
						/>
					</div>
					<div className='grid gap-2'>
						<div className='flex items-center justify-between'>
							<Label htmlFor='password'>Password</Label>
							<Link
								className='text-primary text-xs font-medium hover:underline'
								to='/login'
							>
								Forgot password?
							</Link>
						</div>
						<Input
							aria-describedby={error ? errorId : undefined}
							aria-invalid={error ? true : undefined}
							autoComplete='current-password'
							className='h-11'
							id='password'
							name='password'
							placeholder='••••••••'
							readOnly={isPending}
							required
							type='password'
						/>
					</div>

					{error && (
						<p
							className='animate-in text-destructive fade-in slide-in-from-top-1 text-sm font-medium'
							id={errorId}
							role='alert'
						>
							{error}
						</p>
					)}

					<Button
						className='mt-2 h-11 w-full text-base font-semibold'
						disabled={isPending}
						type='submit'
					>
						{isPending ? (
							<LoaderCircleIcon
								aria-hidden='true'
								className='size-5 animate-spin'
							/>
						) : (
							<ArrowRight
								aria-hidden='true'
								className='size-5'
							/>
						)}
						{isPending ? "Signing in..." : "Sign In"}
					</Button>
				</div>

				<SocialSignInButtons
					callbackURL={redirectUrl}
					disabled={isPending}
				/>
			</form>

			<p className='text-muted-foreground text-center text-sm'>
				Don&apos;t have an account?{" "}
				<Link
					className='text-primary font-semibold hover:underline'
					to='/signup'
				>
					Create one
				</Link>
			</p>
		</div>
	);
};

export const Route = createFileRoute("/_guest/login")({
	component: LoginForm
});
