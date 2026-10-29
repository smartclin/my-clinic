// src/api/client/queries/errors.ts
//
// Narrowing helpers for errors that cross the TanStack Start boundary.
// Server functions serialize errors as plain objects, so `instanceof` is
// NOT reliable on the client — an error thrown on the server arrives as
// `{ message, code, ... }`, not as an `Error` instance. These guards read
// the shape, not the prototype.

export interface CodedError {
	message: string;
	code: string;
	[key: string]: unknown;
}

export function isCodedError(err: unknown): err is CodedError {
	return (
		typeof err === "object" &&
		err !== null &&
		"message" in err &&
		typeof (err as { message: unknown }).message === "string" &&
		"code" in err &&
		typeof (err as { code: unknown }).code === "string"
	);
}

export function hasErrorCode(err: unknown, code: string): err is CodedError {
	return isCodedError(err) && err.code === code;
}

export function errorMessage(
	err: unknown,
	fallback = "Something went wrong"
): string {
	if (err instanceof Error) return err.message;
	if (typeof err === "string") return err;
	if (isCodedError(err)) return err.message;
	return fallback;
}

export const isVersionConflict = (
	err: unknown
): err is CodedError & {
	code: "VERSION_CONFLICT";
} => hasErrorCode(err, "VERSION_CONFLICT");
