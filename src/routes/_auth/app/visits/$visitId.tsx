import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeftIcon } from "lucide-react";

import { PageHeader } from "@/components/blocks/page-header";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useVisitSnapshot } from "@/hooks/visit.hooks";
import { formatDate } from "@/lib/utils";
import { visitSnapshotQueryOptions } from "@/server/queries/visits.queries";

interface PatientMeasurementSummary {
	id: string;
	indicator?: string;
	value?: number | string;
	weight?: number | string;
	height?: number | string;
	zScore?: number | string;
	percentile?: number | string;
	classification?: string;
}

interface PatientPrescriptionSummary {
	id: string;
	medicationName?: string;
	dosage?: string;
	frequency?: string;
	durationDays?: number;
}

const VisitDetailPage = () => {
	const { visitId } = Route.useParams();
	const { data: visit } = useVisitSnapshot(visitId);
	if (!visit) return null;

	const patientRecord = visit.patient as
		| {
				measurements?: PatientMeasurementSummary[];
				prescriptions?: PatientPrescriptionSummary[];
		  }
		| null
		| undefined;
	const measurements = patientRecord?.measurements ?? [];
	const prescriptions = patientRecord?.prescriptions ?? [];

	return (
		<div className='flex flex-col gap-6'>
			<div className='flex items-center gap-2'>
				{visit.patientId ? (
					<Link
						className={buttonVariants({
							variant: "ghost",
							size: "sm",
							className: "w-fit"
						})}
						params={{ patientId: visit.patientId }}
						to='/app/patients/$patientId'
					>
						<ArrowLeftIcon aria-hidden='true' />
						Back to patient
					</Link>
				) : (
					<Link
						className={buttonVariants({
							variant: "ghost",
							size: "sm",
							className: "w-fit"
						})}
						to='/app/visits'
					>
						<ArrowLeftIcon aria-hidden='true' />
						Back to visits
					</Link>
				)}
			</div>

			<PageHeader
				actions={
					<Link
						className={buttonVariants({ variant: "outline" })}
						params={{ visitId }}
						to='/app/visits/$visitId/edit'
					>
						Edit
					</Link>
				}
				description={formatDate(visit.visitedAt)}
				title={visit.patient?.name ? `Visit · ${visit.patient.name}` : "Visit"}
			/>

			<Tabs defaultValue='measurements'>
				<TabsList>
					<TabsTrigger value='measurements'>
						Measurements ({measurements.length})
					</TabsTrigger>
					<TabsTrigger value='prescriptions'>
						Prescriptions ({prescriptions.length})
					</TabsTrigger>
				</TabsList>

				<TabsContent
					className='flex flex-col gap-3'
					value='measurements'
				>
					<div className='flex justify-end'>
						<Link
							className={buttonVariants({ size: "sm" })}
							params={{ visitId }}
							to='/app/visits/$visitId/measurement/new'
						>
							Add measurement
						</Link>
					</div>
					<Card className='divide-y'>
						{measurements.length === 0 ? (
							<p className='text-muted-foreground p-4 text-sm'>
								No measurements recorded.
							</p>
						) : (
							measurements.map((m: PatientMeasurementSummary) => (
								<div
									className='flex items-center justify-between p-4'
									key={m.id}
								>
									<div>
										<div className='font-medium capitalize'>
											{(m.indicator || "Measurement").replaceAll("-", " ")}
										</div>
										<div className='text-muted-foreground text-sm'>
											Value: {m.value ?? m.weight ?? m.height}
											{m.zScore != null
												? ` · Z-score: ${Number(m.zScore).toFixed(2)}`
												: ""}
											{m.percentile != null
												? ` · Percentile: ${Number(m.percentile).toFixed(1)}%`
												: ""}
										</div>
									</div>
									{m.classification ? (
										<span className='text-muted-foreground text-xs'>
											{m.classification}
										</span>
									) : null}
								</div>
							))
						)}
					</Card>
				</TabsContent>

				<TabsContent
					className='flex flex-col gap-3'
					value='prescriptions'
				>
					<div className='flex justify-end'>
						<Link
							className={buttonVariants({ size: "sm" })}
							to='/app/prescriptions'
						>
							Prescriptions
						</Link>
					</div>
					<Card className='divide-y'>
						{prescriptions.length === 0 ? (
							<p className='text-muted-foreground p-4 text-sm'>
								No prescriptions.
							</p>
						) : (
							prescriptions.map((p: PatientPrescriptionSummary) => (
								<div
									className='p-4'
									key={p.id}
								>
									<div className='font-medium'>{p.medicationName}</div>
									<div className='text-muted-foreground text-sm'>
										{p.dosage} · {p.frequency}
										{p.durationDays ? ` · ${p.durationDays} days` : ""}
									</div>
								</div>
							))
						)}
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
};

export const Route = createFileRoute("/_auth/app/visits/$visitId")({
	loader: async ({ context, params }) =>
		await context.queryClient.query(visitSnapshotQueryOptions(params.visitId)),
	component: VisitDetailPage
});
