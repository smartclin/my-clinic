import { useForm } from "@tanstack/react-form";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { z } from "zod";

import { TextField } from "@/components/forms/text-field";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { authClient } from "@/lib/auth/client";
import { authQueryOptions } from "@/server/queries";

const signInSchema = z.object({
	email: z.email("Invalid email address"),
	password: z.string().min(8, "Password must be at least 8 characters")
});

interface SignInFormProps {
	onSwitchToSignUp: () => void;
}

export const SignInForm = ({ onSwitchToSignUp }: SignInFormProps) => {
	const navigate = useNavigate();
	const router = useRouter();
	const queryClient = useQueryClient();

	const form = useForm({
		defaultValues: {
			email: "",
			password: ""
		},
		validators: {
			onSubmit: signInSchema,
			onBlur: signInSchema
		},
		onSubmit: async ({ value }) => {
			const { error } = await authClient.signIn.email({
				email: value.email,
				password: value.password
			});

			if (error) {
				toast.add({
					type: "error",
					description: error.message ?? error.statusText ?? "Sign in failed"
				});
				return;
			}

			// Refresh cached session data *before* navigating so `_auth/route.tsx`
			// sees the authenticated user instead of the cached `null`.
			await queryClient.invalidateQueries({
				queryKey: authQueryOptions().queryKey
			});
			await router.invalidate();

			toast.add({ type: "success", description: "Sign in successful" });
			await navigate({ to: "/app" });
		}
	});

	return (
		<div className='mx-auto mt-10 w-full max-w-md p-6'>
			<h1 className='mb-6 text-center text-3xl font-bold'>Welcome Back</h1>

			<form
				className='space-y-4'
				onSubmit={e => {
					e.preventDefault();
					void form.handleSubmit();
				}}
			>
				<form.Field name='email'>
					{field => (
						<TextField
							autoComplete='email'
							errors={field.state.meta.errors}
							id={field.name}
							label='Email'
							onBlur={field.handleBlur}
							onChange={field.handleChange}
							type='email'
							value={field.state.value}
						/>
					)}
				</form.Field>

				<form.Field name='password'>
					{field => (
						<TextField
							autoComplete='current-password'
							errors={field.state.meta.errors}
							id={field.name}
							label='Password'
							onBlur={field.handleBlur}
							onChange={field.handleChange}
							type='password'
							value={field.state.value}
						/>
					)}
				</form.Field>

				<form.Subscribe
					selector={state => ({
						canSubmit: state.canSubmit,
						isSubmitting: state.isSubmitting
					})}
				>
					{({ canSubmit, isSubmitting }) => (
						<Button
							className='w-full'
							disabled={!canSubmit || isSubmitting}
							type='submit'
						>
							{isSubmitting ? "Signing in…" : "Sign In"}
						</Button>
					)}
				</form.Subscribe>
			</form>

			<div className='mt-4 text-center'>
				<Button
					className='text-primary hover:text-primary/80'
					onClick={onSwitchToSignUp}
					type='button'
					variant='link'
				>
					Need an account? Sign Up
				</Button>
			</div>
		</div>
	);
};
