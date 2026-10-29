// src/routes/_auth/app/tools/lms-calculator.tsx
import { createFileRoute } from "@tanstack/react-router";

import { PageHeader } from "@/components/blocks/page-header";
import { QuickCalculator } from "@/components/growth/QuickCalculator";

const LmsCalculatorPage = () => (
	<div className='flex flex-col gap-6'>
		<PageHeader
			description='Compute Z-scores and percentiles from the Egyptian 2021 growth standards.'
			title='Instant Egyptian LMS Calculator'
		/>
		<QuickCalculator />
	</div>
);

export const Route = createFileRoute("/_auth/app/tools/lms-calculator")({
	component: LmsCalculatorPage
});
