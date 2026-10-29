// src/routes/_guest/signup.tsx
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { LoaderCircleIcon, UserPlus } from "lucide-react";
import * as React from "react";

import { SocialSignInButtons } from "@/components/sign-in-social-buttons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toast";
import { authClient } from "@/lib/auth/client";
import { authQueryOptions } from "@/server/queries";

const SignupForm = () => {
	const { redirectUrl } = Route.useRouteContext();
	const queryClient = useQueryClient();
	const navigate = useNavigate();
	const [error, setError] = React.useState<string | null>(null);
	const errorId = React.useId();

	const { mutate: signupMutate, isPending } = useMutation({
		mutationFn: async (data: {
			name: string;
			email: string;
			password: string;
		}) => {
			await authClient.signUp.email(
				{ ...data, callbackURL: redirectUrl },
				{
					onError: ({ error: authError }) => {
						const message =
							authError.message ||
							"An error occurred while creating your account.";
						setError(message);
						toast.add({ type: "error", description: message });
					}
				}
			);
		},
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
		const name = formData.get("name");
		const email = formData.get("email");
		const password = formData.get("password");
		const confirmPassword = formData.get("confirm_password");

		if (
			typeof name !== "string" ||
			!name.trim() ||
			typeof email !== "string" ||
			!email ||
			typeof password !== "string" ||
			!password ||
			typeof confirmPassword !== "string" ||
			!confirmPassword
		) {
			setError("Please fill out all fields.");
			return;
		}

		if (password.length < 8) {
			setError("Password must be at least 8 characters long.");
			return;
		}

		if (password !== confirmPassword) {
			setError("Passwords do not match.");
			return;
		}

		signupMutate({ name: name.trim(), email, password });
	};

	return (
		<div className='flex flex-col gap-6'>
			<div className='space-y-1.5 text-center'>
				<h2 className='text-foreground text-xl font-bold tracking-tight'>
					Create an account
				</h2>
				<p className='text-muted-foreground text-sm'>
					Join the clinic portal to get started.
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
						<Label htmlFor='name'>Full name</Label>
						<Input
							aria-describedby={error ? errorId : undefined}
							aria-invalid={error ? true : undefined}
							autoComplete='name'
							className='h-11'
							id='name'
							name='name'
							placeholder='Dr. Hazem Ali'
							readOnly={isPending}
							required
							type='text'
						/>
					</div>
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
						<Label htmlFor='password'>Password</Label>
						<Input
							aria-describedby={error ? errorId : undefined}
							aria-invalid={error ? true : undefined}
							autoComplete='new-password'
							className='h-11'
							id='password'
							name='password'
							placeholder='At least 8 characters'
							readOnly={isPending}
							required
							type='password'
						/>
					</div>
					<div className='grid gap-2'>
						<Label htmlFor='confirm_password'>Confirm password</Label>
						<Input
							aria-describedby={error ? errorId : undefined}
							aria-invalid={error ? true : undefined}
							autoComplete='new-password'
							className='h-11'
							id='confirm_password'
							name='confirm_password'
							placeholder='Repeat your password'
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
							<UserPlus
								aria-hidden='true'
								className='size-5'
							/>
						)}
						{isPending ? "Creating account..." : "Create Account"}
					</Button>
				</div>

				<SocialSignInButtons
					callbackURL={redirectUrl}
					disabled={isPending}
				/>
			</form>

			<p className='text-muted-foreground text-center text-sm'>
				Already have an account?{" "}
				<Link
					className='text-primary font-semibold hover:underline'
					to='/login'
				>
					Sign in
				</Link>
			</p>
		</div>
	);
};

export const Route = createFileRoute("/_guest/signup")({
	component: SignupForm
});
