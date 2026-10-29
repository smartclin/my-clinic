// src/routes/_auth/app/tools/medications.tsx
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { MedicationCalculator } from "@/components/clinical/MedicationCalculator";
import { useActivePatientId } from "@/hooks/clinic-context.hooks";
import { usePatientDetail } from "@/hooks/patient.hooks";
import { measurementsByPatientQueryOptions } from "@/server/queries/measurements.queries";
import type { Measurement, Patient } from "@/types/growth";

const MedicationsPage = () => {
	const patientId = useActivePatientId();
	const { patient } = usePatientDetail(patientId ?? "");
	const { data: measurements = [] } = useQuery({
		...measurementsByPatientQueryOptions(patientId ?? ""),
		enabled: Boolean(patientId)
	});

	return (
		<MedicationCalculator
			measurements={measurements as unknown as Measurement[]}
			selectedPatient={(patient ?? null) as unknown as Patient | null}
		/>
	);
};

export const Route = createFileRoute("/_auth/app/tools/medications")({
	component: MedicationsPage
});
