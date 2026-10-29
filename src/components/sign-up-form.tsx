import { useForm } from "@tanstack/react-form";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { z } from "zod";

import { TextField } from "@/components/forms/text-field";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { authClient } from "@/lib/auth/client";
import { authQueryOptions } from "@/server/queries";

const signUpSchema = z.object({
	name: z.string().min(2, "Name must be at least 2 characters"),
	email: z.email("Invalid email address"),
	password: z.string().min(8, "Password must be at least 8 characters")
});

interface SignUpFormProps {
	onSwitchToSignIn: () => void;
}

export const SignUpForm = ({ onSwitchToSignIn }: SignUpFormProps) => {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const router = useRouter();

	const form = useForm({
		defaultValues: {
			name: "",
			email: "",
			password: ""
		},
		validators: {
			onSubmit: signUpSchema,
			onBlur: signUpSchema
		},
		onSubmit: async ({ value }) => {
			const { error } = await authClient.signUp.email({
				email: value.email,
				password: value.password,
				name: value.name
			});

			if (error) {
				toast.add({
					type: "error",
					description: error.message ?? error.statusText ?? "Sign up failed"
				});
				return;
			}

			// Refresh the session and cached queries before navigating so the route
			// guards in `_auth` see the new user instead of the cached `null`.
			await queryClient.invalidateQueries({
				queryKey: authQueryOptions().queryKey
			});
			await router.invalidate();

			toast.add({ type: "success", description: "Sign up successful" });
			await navigate({ to: "/app" });
		}
	});

	return (
		<div className='mx-auto mt-10 w-full max-w-md p-6'>
			<h1 className='mb-6 text-center text-3xl font-bold'>Create Account</h1>

			<form
				className='space-y-4'
				onSubmit={e => {
					e.preventDefault();
					void form.handleSubmit();
				}}
			>
				<form.Field name='name'>
					{field => (
						<TextField
							autoComplete='name'
							errors={field.state.meta.errors}
							id={field.name}
							label='Full Name'
							onBlur={field.handleBlur}
							onChange={field.handleChange}
							type='text'
							value={field.state.value}
						/>
					)}
				</form.Field>

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
							autoComplete='new-password'
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
							{isSubmitting ? "Creating account…" : "Sign Up"}
						</Button>
					)}
				</form.Subscribe>
			</form>

			<div className='mt-4 text-center'>
				<Button
					className='text-primary hover:text-primary/80'
					onClick={onSwitchToSignIn}
					type='button'
					variant='link'
				>
					Already have an account? Sign In
				</Button>
			</div>
		</div>
	);
};
