// src/api/client/queries/audit-log.queries.ts

import { queryOptions } from "@tanstack/react-query";

import {
	$findAuditById,
	$listMyAuditForEntity,
	$listMyAuditLogs,
	$listMyBackupHistory
} from "@/server/functions";

import { queryKeys } from "./keys";
import { STALE } from "./stale-time";

export const myAuditLogsQueryOptions = (limit = 50) =>
	queryOptions({
		queryFn: () => $listMyAuditLogs({ data: { limit } }),
		queryKey: queryKeys.auditLog.mine(limit),
		staleTime: STALE.DASHBOARD
	});

export const myAuditForEntityQueryOptions = (
	entityType: string,
	entityId: string
) =>
	queryOptions({
		enabled: entityType.length > 0 && entityId.length > 0,
		queryFn: () => $listMyAuditForEntity({ data: { entityId, entityType } }),
		queryKey: queryKeys.auditLog.forEntity(entityType, entityId),
		staleTime: STALE.DETAIL
	});

export const myBackupHistoryQueryOptions = () =>
	queryOptions({
		queryFn: () => $listMyBackupHistory(),
		queryKey: queryKeys.auditLog.backupHistory(),
		staleTime: STALE.DASHBOARD
	});

export const auditLogDetailQueryOptions = (id: string) =>
	queryOptions({
		queryFn: () => $findAuditById({ data: { id } }),
		queryKey: queryKeys.auditLog.detail(id),
		staleTime: STALE.DETAIL
	});
