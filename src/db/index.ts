import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import { env } from "#/env.ts";

import { relations } from "./relations";

// ── Client ──────────────────────────────────────────────────────────────
// A single pool per process. PGlite's `dataDir` is replaced by a real
// Postgres URL (e.g. postgresql://user:pass@host:5432/db).
export const dbClient = new Pool({
	connectionString: env.DATABASE_URL,
	max: 10, // tune to Postgres max_connections / instance count
	idleTimeoutMillis: 30_000,
	connectionTimeoutMillis: 5_000
});

export const db = drizzle({ client: dbClient, relations });

export type DB = typeof db;
export type Transaction = Parameters<Parameters<typeof db.transaction>[0]>[0];
export type DBOrTx = DB | Transaction;

// ── Readiness ───────────────────────────────────────────────────────────
let isClosed = false;

export async function checkIsDbReady(): Promise<boolean> {
	if (isClosed) return false;
	try {
		// `pool.query` borrows and returns a client immediately.
		await dbClient.query("SELECT 1");
		return true;
	} catch (error) {
		console.error("Database readiness check failed", error);
		return false;
	}
}

// ── Shutdown ────────────────────────────────────────────────────────────
export async function closeConnection(): Promise<void> {
	if (isClosed) return;
	isClosed = true;
	try {
		await dbClient.end(); // `end()`, not `close()` — that's the pg API.
		console.warn("Database pool closed");
	} catch (error) {
		console.error("Error closing database pool", error);
	}
}

// ── Transactions ────────────────────────────────────────────────────────
export type TransactionOptions = {
	isolationLevel?: "read committed" | "repeatable read" | "serializable";
	accessMode?: "read only" | "read write";
	deferrable?: boolean;
};

export type RunWithDbOptions = {
	isolationLevel?: TransactionOptions["isolationLevel"];
	accessMode?: TransactionOptions["accessMode"];
	maxRetries?: number;
};

const RETRYABLE_PG_CODES = new Set<string>([
	"40001", // serialization_failure
	"40P01", // deadlock_detected
	"53300", // too_many_connections
	"57P03" // cannot_connect_now
]);

function isRetryableTxError(error: unknown): boolean {
	if (typeof error !== "object" || error === null) return false;
	const code = (error as { code?: unknown }).code;
	return typeof code === "string" && RETRYABLE_PG_CODES.has(code);
}

const MAX_BACKOFF_MS = 2_000;

export async function withTransaction<T>(
	fn: (tx: Transaction) => Promise<T>,
	options: RunWithDbOptions = {}
): Promise<T> {
	const { maxRetries = 1, isolationLevel, accessMode } = options;

	const txConfig =
		isolationLevel !== undefined || accessMode !== undefined
			? {
					...(isolationLevel !== undefined ? { isolationLevel } : {}),
					...(accessMode !== undefined ? { accessMode } : {})
				}
			: undefined;

	const run = () =>
		txConfig !== undefined
			? db.transaction(fn as never, txConfig)
			: db.transaction(fn as never);

	let attempt = 0;
	for (;;) {
		try {
			return (await run()) as T;
		} catch (error: unknown) {
			if (attempt >= maxRetries || !isRetryableTxError(error)) throw error;
			attempt += 1;
			const backoff = Math.min(50 * 2 ** (attempt - 1), MAX_BACKOFF_MS);
			await new Promise(resolve =>
				setTimeout(resolve, backoff + Math.random() * 50)
			);
		}
	}
}

export async function runWithDb<T>(
	fn: (executor: DBOrTx) => Promise<T>,
	options: RunWithDbOptions = {}
): Promise<T> {
	const hasTxOptions =
		options.isolationLevel !== undefined ||
		options.accessMode !== undefined ||
		options.maxRetries !== undefined;
	return hasTxOptions ? withTransaction(fn, options) : fn(db);
}

// ── Re-exports ──────────────────────────────────────────────────────────
export {
	and,
	asc,
	count,
	desc,
	eq,
	getTableColumns,
	getTableName,
	gt,
	gte,
	ilike,
	inArray,
	isNotNull,
	isNull,
	like,
	lt,
	lte,
	ne,
	not,
	or,
	type SQL,
	type SQLWrapper,
	sql
} from "drizzle-orm";
