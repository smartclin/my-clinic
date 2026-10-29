import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface TextFieldProps {
	id: string;
	label: string;
	type: string;
	value: string;
	errors: unknown[];
	onChange: (value: string) => void;
	onBlur?: () => void;
	autoComplete?: string;
}

export function TextField({
	id,
	label,
	type,
	value,
	errors,
	onChange,
	onBlur,
	autoComplete
}: TextFieldProps) {
	const firstError = errors[0] as { message?: string } | string | undefined;
	const errorMessage =
		typeof firstError === "string" ? firstError : firstError?.message;

	return (
		<div className='space-y-1'>
			<Label htmlFor={id}>{label}</Label>
			<Input
				autoComplete={autoComplete}
				id={id}
				name={id}
				onBlur={onBlur}
				onChange={e => onChange(e.target.value)}
				type={type}
				value={value}
			/>
			{errorMessage && (
				<p
					className='text-destructive text-sm'
					role='alert'
				>
					{errorMessage}
				</p>
			)}
		</div>
	);
}
