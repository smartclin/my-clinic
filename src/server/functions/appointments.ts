import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import {
	countAppointmentsByStatus,
	countAppointmentsForPatient,
	createAppointment,
	createManyAppointments,
	deleteAppointment,
	findAppointmentById,
	listAppointmentsByClinic,
	listAppointmentsByDoctor,
	listAppointmentsByPatient,
	listNoShowAppointments,
	listTodayAppointmentsForClinic,
	listUpcomingAppointments,
	markAppointmentCancelled,
	markAppointmentCompleted,
	markAppointmentNoShow,
	rescheduleAppointment,
	updateAppointment
} from "#/db/queries/appointments";
import { appointmentInsertSchema, StatusSchema } from "#/db/validations.ts";

import { requireSession } from "./_auth";

const appointmentStatusSchema = z
	.enum(["scheduled", "completed", "cancelled", "no-show", "noShow"])
	.transform(s => (s === "noShow" ? ("no-show" as const) : s));

export const $listAppointmentsByPatient = createServerFn({ method: "GET" })
	.validator(z.object({ patientId: z.uuid() }))
	.handler(async ({ data }) => {
		await requireSession();
		return listAppointmentsByPatient(data.patientId);
	});

export const fetchAppointmentById = createServerFn({ method: "GET" })
	.validator(z.object({ appointmentId: z.uuid() }))
	.handler(async ({ data }) => findAppointmentById(data.appointmentId));

export const fetchAppointmentsForPatient = createServerFn({ method: "GET" })
	.validator(
		z.object({
			patientId: z.uuid(),
			status: StatusSchema.optional()
		})
	)
	.handler(async ({ data }) =>
		listAppointmentsByPatient(data.patientId, { status: data.status })
	);

export const fetchTodayAppointments = createServerFn({ method: "GET" })
	.validator(z.object({ clinicId: z.uuid() }))
	.handler(async ({ data }) => listTodayAppointmentsForClinic(data.clinicId));

export const $listTodayAppointmentsForClinic = fetchTodayAppointments;

export const $listMyAppointments = createServerFn({ method: "GET" })
	.validator(
		z.object({
			from: z.string().transform(s => new Date(s)),
			to: z.string().transform(s => new Date(s))
		})
	)
	.handler(async ({ data }) => {
		const session = await requireSession();
		return listAppointmentsByDoctor(
			session.user.id,
			session.user.clinicId ?? "",
			{
				from: data.from,
				to: data.to
			}
		);
	});

export const $listAppointmentsByClinic = createServerFn({ method: "GET" })
	.validator(
		z.object({
			clinicId: z.uuid(),
			from: z.string().transform(s => new Date(s)),
			to: z.string().transform(s => new Date(s))
		})
	)
	.handler(async ({ data }) => {
		await requireSession();
		return listAppointmentsByClinic(data.clinicId, {
			from: data.from,
			to: data.to
		});
	});

export const $findAppointmentById = createServerFn({ method: "GET" })
	.validator(z.object({ id: z.uuid() }))
	.handler(async ({ data }) => {
		await requireSession();
		return findAppointmentById(data.id);
	});

export const $listMyUpcomingAppointments = createServerFn({ method: "GET" })
	.validator(z.object({ limit: z.number().int().min(1).max(50).default(10) }))
	.handler(async ({ data }) => {
		const session = await requireSession();
		return listUpcomingAppointments(
			session.user.id,
			session.user.clinicId ?? "",
			data.limit
		);
	});

export const $listNoShowAppointments = createServerFn({ method: "GET" })
	.validator(z.object({ clinicId: z.uuid() }))
	.handler(async ({ data }) => {
		await requireSession();
		return listNoShowAppointments(data.clinicId);
	});

export const $countMyAppointmentsByStatus = createServerFn({
	method: "GET"
})
	.validator(
		z.object({
			from: z.string().transform(s => new Date(s)),
			to: z.string().transform(s => new Date(s))
		})
	)
	.handler(async ({ data }) => {
		const session = await requireSession();
		return countAppointmentsByStatus(
			session.user.id,
			session.user.clinicId ?? "",
			{ from: data.from, to: data.to }
		);
	});

export const $createAppointment = createServerFn({ method: "POST" })
	.validator(
		z.object({
			patientId: z.uuid(),
			clinicId: z.uuid(),
			doctorId: z.string().optional(),
			scheduledAt: z.string().transform(s => new Date(s)),
			durationMinutes: z.number().int().min(5).max(240).default(15),
			reason: z.string().optional(),
			notes: z.string().optional()
		})
	)
	.handler(async ({ data }) => {
		const session = await requireSession();
		return createAppointment({
			...data,
			doctorId: data.doctorId ?? session.user.id
		});
	});

export const $createManyAppointments = createServerFn({ method: "POST" })
	.validator(
		z.array(
			z.object({
				patientId: z.uuid(),
				clinicId: z.uuid(),
				doctorId: z.string().optional(),
				scheduledAt: z.string().transform(s => new Date(s)),
				durationMinutes: z.number().int().min(5).max(240).default(15),
				reason: z.string().optional(),
				notes: z.string().optional()
			})
		)
	)
	.handler(async ({ data }) => {
		const session = await requireSession();
		return createManyAppointments(
			data.map(a => ({ ...a, doctorId: a.doctorId ?? session.user.id }))
		);
	});

export const $updateAppointment = createServerFn({ method: "POST" })
	.validator(
		z.object({
			id: z.uuid(),
			data: z.object({
				scheduledAt: z
					.string()
					.transform(s => new Date(s))
					.optional(),
				durationMinutes: z.number().int().min(5).max(240).optional(),
				status: appointmentStatusSchema.optional(),
				reason: z.string().nullable().optional(),
				notes: z.string().nullable().optional()
			})
		})
	)
	.handler(async ({ data }) => {
		await requireSession();
		return updateAppointment(data.id, data.data);
	});

export const $markAppointmentCompleted = createServerFn({ method: "POST" })
	.validator(z.object({ id: z.uuid() }))
	.handler(async ({ data }) => {
		await requireSession();
		return markAppointmentCompleted(data.id);
	});

export const $markAppointmentNoShow = createServerFn({ method: "POST" })
	.validator(z.object({ id: z.uuid() }))
	.handler(async ({ data }) => {
		await requireSession();
		return markAppointmentNoShow(data.id);
	});

export const $rescheduleAppointment = createServerFn({ method: "POST" })
	.validator(
		z.object({
			id: z.uuid(),
			newTime: z.string().transform(s => new Date(s))
		})
	)
	.handler(async ({ data }) => {
		await requireSession();
		return rescheduleAppointment(data.id, data.newTime);
	});

export const $deleteAppointment = createServerFn({ method: "POST" })
	.validator(z.object({ id: z.uuid() }))
	.handler(async ({ data }) => {
		await requireSession();
		await deleteAppointment(data.id);
		return { success: true };
	});

export const $markAppointmentCancelled = createServerFn({ method: "POST" })
	.validator(z.object({ id: z.uuid() }))
	.handler(async ({ data }) => {
		await requireSession();
		return markAppointmentCancelled(data.id);
	});

export const fetchAppointmentsInRange = $listAppointmentsByClinic;

export const cancelAppointmentFn = createServerFn({ method: "POST" })
	.validator(z.object({ appointmentId: z.uuid() }))
	.handler(async ({ data }) => {
		await requireSession();
		return markAppointmentCancelled(data.appointmentId);
	});

export const completeAppointmentFn = createServerFn({ method: "POST" })
	.validator(z.object({ appointmentId: z.uuid() }))
	.handler(async ({ data }) => {
		await requireSession();
		return markAppointmentCompleted(data.appointmentId);
	});

export const markAppointmentNoShowFn = createServerFn({ method: "POST" })
	.validator(z.object({ appointmentId: z.uuid() }))
	.handler(async ({ data }) => {
		await requireSession();
		return markAppointmentNoShow(data.appointmentId);
	});

export const deleteAppointmentFn = createServerFn({ method: "POST" })
	.validator(z.object({ appointmentId: z.uuid() }))
	.handler(async ({ data }) => {
		await requireSession();
		await deleteAppointment(data.appointmentId);
		return { success: true };
	});

export const updateAppointmentFn = createServerFn({ method: "POST" })
	.validator(
		z.object({
			appointmentId: z.uuid(),
			patch: z.object({
				scheduledAt: z
					.string()
					.transform(s => new Date(s))
					.optional(),
				durationMinutes: z.number().int().min(5).max(240).optional(),
				status: appointmentStatusSchema.optional(),
				reason: z.string().nullable().optional(),
				notes: z.string().nullable().optional(),
				doctorId: z.string().nullable().optional()
			})
		})
	)
	.handler(async ({ data }) => {
		await requireSession();
		return updateAppointment(data.appointmentId, data.patch);
	});

export const fetchUpcomingForDoctor = createServerFn({ method: "GET" })
	.validator(
		z.object({
			doctorId: z.string(),
			clinicId: z.string().optional(),
			limit: z.number().optional()
		})
	)
	.handler(async ({ data }) => {
		const session = await requireSession();
		const clinicId =
			data.clinicId ?? (session.user as { clinicId?: string })?.clinicId ?? "";
		return listUpcomingAppointments(data.doctorId, clinicId, data.limit ?? 10);
	});

export const fetchAppointmentStatusCounts = createServerFn({ method: "GET" })
	.validator(
		z.object({
			doctorId: z.string().optional(),
			clinicId: z.string(),
			from: z.string(),
			to: z.string()
		})
	)
	.handler(async ({ data }) => {
		const session = await requireSession();
		const doctorId = data.doctorId ?? session.user.id;
		return countAppointmentsByStatus(doctorId, data.clinicId, {
			from: new Date(data.from),
			to: new Date(data.to)
		});
	});

export const fetchPatientAppointmentCount = createServerFn({ method: "GET" })
	.validator(z.object({ patientId: z.string() }))
	.handler(async ({ data }) => {
		await requireSession();
		return countAppointmentsForPatient(data.patientId);
	});

export const createAppointmentFn = createServerFn({ method: "POST" })
	.validator(appointmentInsertSchema)
	.handler(async ({ data }) => {
		const session = await requireSession();
		return createAppointment({
			...data,
			doctorId: data.doctorId ?? session.user.id
		});
	});
