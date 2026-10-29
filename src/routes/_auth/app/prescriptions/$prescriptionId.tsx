import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeftIcon } from "lucide-react";

import { PageHeader } from "@/components/blocks/page-header";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { usePrescriptionDetail } from "@/hooks/prescription.hooks";
import { formatDate } from "@/lib/utils";
import { prescriptionDetailQueryOptions } from "@/server/queries/prescriptions.queries";

const PrescriptionDetailPage = () => {
	const { prescriptionId } = Route.useParams();
	const { data: rx } = usePrescriptionDetail(prescriptionId);
	if (!rx) return null;

	const medications = rx.medications ?? [];
	const firstMedName = medications[0]?.name ?? "Prescription";

	return (
		<div className='flex flex-col gap-6'>
			<Link
				className={buttonVariants({
					variant: "ghost",
					size: "sm",
					className: "w-fit"
				})}
				to='/app/prescriptions'
			>
				<ArrowLeftIcon aria-hidden='true' />
				Back to prescriptions
			</Link>

			<PageHeader
				actions={
					<Link
						className={buttonVariants({ variant: "outline" })}
						params={{ prescriptionId }}
						to='/app/prescriptions/$prescriptionId/edit'
					>
						Edit
					</Link>
				}
				description={`Prescribed ${formatDate(rx.prescriptionDate)}`}
				title={firstMedName}
			/>
			<Card className='p-6'>
				<dl className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
					<div>
						<dt className='text-muted-foreground text-sm'>Patient</dt>
						<dd>
							{rx.patient ? (
								<Link
									className='font-medium underline-offset-4 hover:underline'
									params={{ patientId: rx.patientId }}
									to='/app/patients/$patientId'
								>
									{rx.patient.name}
								</Link>
							) : (
								rx.patientId
							)}
						</dd>
					</div>
					<div>
						<dt className='text-muted-foreground text-sm'>Prescriber</dt>
						<dd>{rx.prescribedBy ?? "—"}</dd>
					</div>
					<div>
						<dt className='text-muted-foreground text-sm'>Status</dt>
						<dd>
							<Badge variant='outline'>{rx.status}</Badge>
						</dd>
					</div>
					<div className='sm:col-span-2'>
						<dt className='text-muted-foreground text-sm font-semibold'>
							Medications ({medications.length})
						</dt>
						<dd className='mt-2 space-y-2'>
							{medications.map((m, idx) => (
								<div
									className='bg-muted/50 rounded-md border p-3'
									key={m.drugId || idx}
								>
									<div className='font-medium'>{m.name}</div>
									<div className='text-muted-foreground text-sm'>
										Dose: {m.dose} · Freq: {m.frequency} · Duration:{" "}
										{m.duration} · Route: {m.route}
									</div>
									{m.instructions && (
										<div className='text-muted-foreground mt-1 text-xs'>
											{m.instructions}
										</div>
									)}
								</div>
							))}
						</dd>
					</div>
					<div className='sm:col-span-2'>
						<dt className='text-muted-foreground text-sm'>Instructions</dt>
						<dd className='whitespace-pre-wrap'>{rx.instructions ?? "—"}</dd>
					</div>
					{rx.notes && (
						<div className='sm:col-span-2'>
							<dt className='text-muted-foreground text-sm'>Notes</dt>
							<dd className='whitespace-pre-wrap'>{rx.notes}</dd>
						</div>
					)}
				</dl>
			</Card>
		</div>
	);
};

export const Route = createFileRoute(
	"/_auth/app/prescriptions/$prescriptionId"
)({
	loader: async ({ context, params }) =>
		await context.queryClient.query(
			prescriptionDetailQueryOptions(params.prescriptionId)
		),
	component: PrescriptionDetailPage
});
