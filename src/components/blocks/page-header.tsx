// components/blocks/page-header.tsx

import type * as React from "react";

import { cn } from "@/lib/utils";

interface PageHeaderProps {
	/** Primary heading. Required. */
	title: string;

	/** Optional supporting sentence. Clamped to a readable width. */
	description?: string;

	/** Right-aligned actions. Usually buttons or a dropdown menu. */
	actions?: React.ReactNode;

	/**
	 * Optional leading icon. Rendered in a muted tile to the left of the
	 * title. Useful on detail pages where the icon identifies the entity
	 * (stethoscope for a visit, user-round for a patient).
	 */
	icon?: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;

	/**
	 * Heading element. Defaults to `h1`. Use `h2` when the page header
	 * lives inside a modal or a section that already has an h1.
	 */
	titleAs?: "h1" | "h2" | "h3";

	/**
	 * Renders the header inside a sticky container. The offset is chosen so
	 * the header sits flush with the top of the content area under the
	 * `AppShell`'s inset top bar. Only enable this on pages whose body
	 * scrolls (tables, long forms).
	 */
	sticky?: boolean;

	/**
	 * Content rendered below the title row. Breadcrumbs, tab bars, filter
	 * chips — anything that's part of the header but not the title/actions
	 * line.
	 */
	children?: React.ReactNode;

	className?: string;
}

export const PageHeader = ({
	title,
	description,
	actions,
	icon: Icon,
	titleAs: TitleTag = "h1",
	sticky = false,
	children,
	className
}: PageHeaderProps) => (
	<div
		className={cn(
			"flex flex-col gap-4",
			sticky &&
				"bg-background/95 supports-backdrop-filter:bg-background/80 sticky top-0 z-10 -mx-6 border-b px-6 pt-4 pb-3 backdrop-blur md:-mx-10 md:px-10",
			className
		)}
	>
		<div className='flex flex-wrap items-start justify-between gap-4'>
			<div className='flex min-w-0 items-start gap-3'>
				{Icon ? (
					<span
						aria-hidden='true'
						className='bg-muted text-muted-foreground mt-0.5 grid size-9 shrink-0 place-items-center rounded-lg'
					>
						<Icon className='size-4' />
					</span>
				) : null}

				<div className='flex min-w-0 flex-col gap-1'>
					<TitleTag className='text-lg font-semibold tracking-tight text-balance'>
						{title}
					</TitleTag>
					{description ? (
						<p className='text-muted-foreground max-w-xl text-sm text-pretty'>
							{description}
						</p>
					) : null}
				</div>
			</div>

			{actions ? (
				<div className='flex shrink-0 items-center gap-2'>{actions}</div>
			) : null}
		</div>

		{children ? <div className='flex flex-col gap-3'>{children}</div> : null}
	</div>
);
