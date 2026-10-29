import { useQuery } from "@tanstack/react-query";

import {
	type AppointmentStatus,
	appointmentDetailQueryOptions,
	appointmentStatusCountsQueryOptions,
	appointmentsQueryOptions,
	doctorUpcomingQueryOptions,
	patientAppointmentCountQueryOptions,
	patientAppointmentsQueryOptions
} from "../server/queries";

export function useAppointments(
	clinicId: string,
	startDate?: string,
	endDate?: string
) {
	const { data: appointments, isPending } = useQuery(
		appointmentsQueryOptions(clinicId, startDate, endDate)
	);
	return { appointments, isPending };
}

export function useAppointmentDetail(appointmentId: string) {
	return useQuery(appointmentDetailQueryOptions(appointmentId));
}

export function usePatientAppointments(
	patientId: string,
	status?: AppointmentStatus
) {
	return useQuery(patientAppointmentsQueryOptions(patientId, status));
}

export function useDoctorUpcoming(doctorId: string, limit = 50) {
	return useQuery(doctorUpcomingQueryOptions(doctorId, limit));
}

export function useAppointmentStatusCounts(
	clinicId: string,
	from: string,
	to: string
) {
	return useQuery(appointmentStatusCountsQueryOptions(clinicId, from, to));
}

export function usePatientAppointmentCount(patientId: string) {
	return useQuery(patientAppointmentCountQueryOptions(patientId));
}
