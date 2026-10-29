import { createFileRoute } from "@tanstack/react-router";

import { PageHeader } from "@/components/blocks/page-header";
import { ModeToggle } from "@/components/mode-toggle";
import { SignOutButton } from "@/components/sign-out-button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/auth.hooks";

const SettingsPage = () => {
	const { user } = useAuth();

	return (
		<div className='flex flex-col gap-6'>
			<PageHeader title='Settings' />

			<Card className='flex flex-col gap-4 p-6'>
				<div>
					<Label className='text-muted-foreground text-sm'>Signed in as</Label>
					<p className='font-medium'>{user?.name ?? "—"}</p>
					<p className='text-muted-foreground text-sm'>{user?.email ?? ""}</p>
				</div>
				<Separator />
				<div className='flex items-center justify-between'>
					<div>
						<p className='font-medium'>Appearance</p>
						<p className='text-muted-foreground text-sm'>
							Switch between light and dark mode.
						</p>
					</div>
					<div className='flex items-center gap-2'>
						<ModeToggle />
					</div>
				</div>
				<Separator />
				<div>
					<SignOutButton />
				</div>
			</Card>
		</div>
	);
};

export const Route = createFileRoute("/_auth/app/settings/")({
	component: SettingsPage
});
