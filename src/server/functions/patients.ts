import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import {
	createManyPatients,
	createPatient,
	findPatientById,
	findPatientByMrn,
	getPatientFullRecord,
	hardDeletePatient,
	listPatientsByClinic,
	listPatientsByGender,
	listPatientsByOwner,
	listPatientsPaginated,
	listPatientsWithOverdueVaccines,
	listStuntedPatients,
	restorePatient,
	searchPatientsByOwner,
	softDeletePatient,
	updatePatient,
	updatePatientWithVersion
} from "#/db/queries/patients";
import { patientInsertSchema, patientUpdateSchema } from "#/db/validations";

import { requireSession } from "./_auth";

const genderSchema = z.enum(["boy", "girl"]);
const dobSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

export const $listMyPatients = createServerFn({ method: "GET" }).handler(
	async () => {
		const session = await requireSession();
		return listPatientsByOwner(session.user.id);
	}
);

export const $listPatientsByClinic = createServerFn({ method: "GET" })
	.validator(z.object({ clinicId: z.uuid() }))
	.handler(async ({ data }) => {
		await requireSession();
		return listPatientsByClinic(data.clinicId);
	});

export const $findPatientById = createServerFn({ method: "GET" })
	.validator(z.object({ id: z.uuid() }))
	.handler(async ({ data }) => {
		await requireSession();
		return findPatientById(data.id);
	});

export const $findPatientByMrn = createServerFn({ method: "GET" })
	.validator(z.object({ mrn: z.string().min(1) }))
	.handler(async ({ data }) => {
		await requireSession();
		return findPatientByMrn(data.mrn);
	});

export const $getPatientFullRecord = createServerFn({ method: "GET" })
	.validator(z.object({ id: z.uuid() }))
	.handler(async ({ data }) => {
		await requireSession();
		return getPatientFullRecord(data.id);
	});

export const $searchMyPatients = createServerFn({ method: "GET" })
	.validator(z.object({ query: z.string().min(1) }))
	.handler(async ({ data }) => {
		const session = await requireSession();
		return searchPatientsByOwner(session.user.id, data.query);
	});

export const $listMyPatientsByGender = createServerFn({ method: "GET" })
	.validator(z.object({ gender: genderSchema }))
	.handler(async ({ data }) => {
		const session = await requireSession();
		return listPatientsByGender(session.user.id, data.gender);
	});

export const $listMyStuntedPatients = createServerFn({ method: "GET" }).handler(
	async () => {
		const session = await requireSession();
		return listStuntedPatients(session.user.id);
	}
);

export const $listMyPatientsWithOverdueVaccines = createServerFn({
	method: "GET"
}).handler(async () => {
	const session = await requireSession();
	return listPatientsWithOverdueVaccines(session.user.id);
});

export const $listMyPatientsPaginated = createServerFn({ method: "GET" })
	.validator(
		z.object({
			limit: z.number().int().min(1).max(100).default(20),
			cursor: z
				.object({
					createdAt: z.string().transform(s => new Date(s)),
					id: z.uuid()
				})
				.optional()
		})
	)
	.handler(async ({ data }) => {
		const session = await requireSession();
		return listPatientsPaginated(session.user.id, {
			limit: data.limit,
			cursor: data.cursor
		});
	});

export const $createPatient = createServerFn({ method: "POST" })
	.validator(
		z.object({
			name: z.string().min(2),
			gender: genderSchema,
			dob: dobSchema,
			medicalRecordNumber: z.string().min(1),
			notes: z.string().optional(),
			guardianName: z.string().optional(),
			guardianPhone: z.string().optional(),
			allergies: z.string().optional(),
			clinicId: z.uuid().optional()
		})
	)
	.handler(async ({ data }) => {
		const session = await requireSession();
		return createPatient({
			...data,
			ownerId: session.user.id,
			createdBy: session.user.id
		});
	});

export const $createManyPatients = createServerFn({ method: "POST" })
	.validator(
		z.array(
			z.object({
				name: z.string().min(2),
				gender: genderSchema,
				dob: dobSchema,
				medicalRecordNumber: z.string().min(1),
				notes: z.string().optional(),
				guardianName: z.string().optional(),
				guardianPhone: z.string().optional(),
				allergies: z.string().optional(),
				clinicId: z.uuid().optional()
			})
		)
	)
	.handler(async ({ data }) => {
		const session = await requireSession();
		return createManyPatients(
			data.map(p => ({
				...p,
				ownerId: session.user.id,
				createdBy: session.user.id
			}))
		);
	});

export const $updatePatient = createServerFn({ method: "POST" })
	.validator(
		z.object({
			id: z.uuid(),
			data: z.object({
				name: z.string().min(2).optional(),
				gender: genderSchema.optional(),
				dob: dobSchema.optional(),
				medicalRecordNumber: z.string().min(1).optional(),
				notes: z.string().nullable().optional(),
				guardianName: z.string().nullable().optional(),
				guardianPhone: z.string().nullable().optional(),
				allergies: z.string().nullable().optional()
			})
		})
	)
	.handler(async ({ data }) => {
		const session = await requireSession();
		return updatePatient(data.id, {
			...data.data,
			updatedBy: session.user.id
		});
	});

export const $updatePatientWithVersion = createServerFn({ method: "POST" })
	.validator(
		z.object({
			id: z.uuid(),
			expectedVersion: z.number().int().min(1),
			data: z.object({
				name: z.string().min(2).optional(),
				gender: genderSchema.optional(),
				dob: dobSchema.optional(),
				medicalRecordNumber: z.string().min(1).optional(),
				notes: z.string().nullable().optional(),
				guardianName: z.string().nullable().optional(),
				guardianPhone: z.string().nullable().optional(),
				allergies: z.string().nullable().optional()
			})
		})
	)
	.handler(async ({ data }) => {
		const session = await requireSession();
		return updatePatientWithVersion(data.id, data.expectedVersion, {
			...data.data,
			updatedBy: session.user.id
		});
	});

export const $softDeletePatient = createServerFn({ method: "POST" })
	.validator(z.object({ id: z.uuid() }))
	.handler(async ({ data }) => {
		await requireSession();
		return softDeletePatient(data.id);
	});

export const $restorePatient = createServerFn({ method: "POST" })
	.validator(z.object({ id: z.uuid() }))
	.handler(async ({ data }) => {
		await requireSession();
		return restorePatient(data.id);
	});

export const $hardDeletePatient = createServerFn({ method: "POST" })
	.validator(z.object({ id: z.uuid() }))
	.handler(async ({ data }) => {
		await requireSession();
		await hardDeletePatient(data.id);
		return { success: true };
	});

export const createPatientFn = createServerFn({ method: "POST" })
	.validator(patientInsertSchema)
	.handler(async ({ data }) => {
		const session = await requireSession();
		return createPatient({
			...data,
			ownerId: data.ownerId ?? session.user.id,
			createdBy: session.user.id
		});
	});

export const updatePatientFn = createServerFn({ method: "POST" })
	.validator(patientUpdateSchema)
	.handler(async ({ data }) => {
		const session = await requireSession();
		const { id, ...rest } = data;
		if (!id) {
			throw new Error("Patient ID is required for update");
		}
		return updatePatient(id, {
			...rest,
			updatedBy: session.user.id
		});
	});

export const fetchPatientsByClinic = $listPatientsByClinic;
