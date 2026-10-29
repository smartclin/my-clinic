import { cn } from "cn";
import { MoreHorizontal } from "lucide-react";
import type * as React from "react";

import { buttonVariants } from "@/components/ui/button";

function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
	return (
		<nav
			aria-label='pagination'
			className={cn("mx-auto flex w-full justify-center", className)}
			data-slot='pagination'
			{...props}
		/>
	);
}

function PaginationContent({
	className,
	...props
}: React.ComponentProps<"ul">) {
	return (
		<ul
			className={cn("flex flex-row items-center gap-1", className)}
			data-slot='pagination-content'
			{...props}
		/>
	);
}

function PaginationItem({ className, ...props }: React.ComponentProps<"li">) {
	return (
		<li
			className={cn("", className)}
			data-slot='pagination-item'
			{...props}
		/>
	);
}

type PaginationLinkProps = {
	isActive?: boolean;
} & React.ComponentProps<"a">;

function PaginationLink({
	className,
	isActive,
	...props
}: PaginationLinkProps) {
	return (
		<a
			aria-current={isActive ? "page" : undefined}
			className={cn(
				buttonVariants({
					variant: isActive ? "outline" : "ghost",
					size: "sm"
				}),
				className
			)}
			data-slot='pagination-link'
			{...props}
		/>
	);
}

function PaginationEllipsis({
	className,
	...props
}: React.ComponentProps<"span">) {
	return (
		<span
			aria-hidden
			className={cn("flex size-9 items-center justify-center", className)}
			data-slot='pagination-ellipsis'
			{...props}
		>
			<MoreHorizontal className='size-4' />
			<span className='sr-only'>More pages</span>
		</span>
	);
}

export {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink
};
