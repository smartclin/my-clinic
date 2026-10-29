import { useQuery } from "@tanstack/react-query";

import {
	myOverdueVaccinePatientsQueryOptions,
	myPatientsByGenderQueryOptions,
	myPatientsPaginatedQueryOptions,
	myPatientsQueryOptions,
	myStuntedPatientsQueryOptions,
	patientByMrnQueryOptions,
	patientDetailQueryOptions,
	patientFullRecordQueryOptions,
	patientSearchQueryOptions,
	patientsByClinicQueryOptions
} from "../server/queries/patients.queries";

export function useMyPatients() {
	const { data: patients, isPending } = useQuery(myPatientsQueryOptions());
	return { patients, isPending };
}

export function usePatients(clinicId: string) {
	const { data: patients, isPending } = useQuery(
		patientsByClinicQueryOptions(clinicId)
	);
	return { patients, isPending };
}

export function usePatientDetail(patientId: string) {
	const { data: patient, isPending } = useQuery(
		patientDetailQueryOptions(patientId)
	);
	return { patient, isPending };
}

export function usePatientFullRecord(patientId: string) {
	return useQuery(patientFullRecordQueryOptions(patientId));
}

export function usePatientByMrn(mrn: string) {
	return useQuery(patientByMrnQueryOptions(mrn));
}

export function usePatientSearch(query: string) {
	return useQuery(patientSearchQueryOptions(query));
}

export function useMyPatientsPaginated(input: {
	limit?: number;
	cursor?: { createdAt: string; id: string };
}) {
	return useQuery(myPatientsPaginatedQueryOptions(input));
}

export function useMyPatientsByGender(gender: "boy" | "girl") {
	return useQuery(myPatientsByGenderQueryOptions(gender));
}

export function useMyStuntedPatients() {
	return useQuery(myStuntedPatientsQueryOptions());
}

export function useMyOverdueVaccinePatients() {
	return useQuery(myOverdueVaccinePatientsQueryOptions());
}
