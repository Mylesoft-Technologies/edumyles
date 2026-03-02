"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable, Column } from "@/components/shared/DataTable";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { useAuth } from "@/hooks/useAuth";
import { useTenant } from "@/hooks/useTenant";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

type AuditLogEntry = {
    _id: string;
    userId: string;
    action: string;
    targetId?: string;
    targetType?: string;
    details: Record<string, unknown>;
    createdAt: number;
};

const actionColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    created: "default",
    updated: "secondary",
    deleted: "destructive",
    installed: "default",
    uninstalled: "destructive",
    submitted: "default",
    enrolled: "default",
};

function getActionColor(action: string): "default" | "secondary" | "destructive" | "outline" {
    for (const [key, color] of Object.entries(actionColors)) {
        if (action.includes(key)) return color;
    }
    return "outline";
}

export default function AuditLogPage() {
    const { isLoading, sessionToken } = useAuth();
    const { tenantId } = useTenant();
    const [actionFilter, setActionFilter] = useState<string>("all");

    const auditLogs = useQuery(
        api.users.listAuditLogs,
        sessionToken && tenantId
            ? { tenantId, action: actionFilter === "all" ? undefined : actionFilter }
            : "skip"
    );

    if (isLoading) return <LoadingSkeleton variant="page" />;

    const columns: Column<AuditLogEntry>[] = [
        {
            key: "timestamp",
            header: "Timestamp",
            cell: (row) => new Date(row.createdAt).toLocaleString(),
            sortable: true,
        },
        {
            key: "action",
            header: "Action",
            cell: (row) => (
                <Badge variant={getActionColor(row.action)}>
                    {row.action}
                </Badge>
            ),
        },
        {
            key: "targetType",
            header: "Entity Type",
            cell: (row) => row.targetType ?? "—",
        },
        {
            key: "targetId",
            header: "Entity ID",
            cell: (row) => (
                <span className="font-mono text-xs">{row.targetId ? row.targetId.substring(0, 16) + "..." : "—"}</span>
            ),
        },
        {
            key: "userId",
            header: "Actor",
            cell: (row) => (
                <span className="font-mono text-xs">{row.userId.substring(0, 12)}...</span>
            ),
        },
        {
            key: "details",
            header: "Details",
            cell: (row) => {
                const details = row.details;
                if (!details || Object.keys(details).length === 0) return "—";
                return (
                    <span className="text-xs text-muted-foreground max-w-[200px] truncate block">
                        {JSON.stringify(details).substring(0, 80)}...
                    </span>
                );
            },
        },
    ];

    return (
        <div>
            <PageHeader
                title="Audit Log"
                description="Track all changes and actions within your school"
            />

            <div className="mb-4">
                <Select value={actionFilter} onValueChange={setActionFilter}>
                    <SelectTrigger className="w-[220px]">
                        <SelectValue placeholder="Filter by action" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Actions</SelectItem>
                        <SelectItem value="student">Student Actions</SelectItem>
                        <SelectItem value="staff">Staff Actions</SelectItem>
                        <SelectItem value="admission">Admission Actions</SelectItem>
                        <SelectItem value="module">Module Actions</SelectItem>
                        <SelectItem value="class">Class Actions</SelectItem>
                        <SelectItem value="settings">Settings Actions</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <DataTable
                data={(auditLogs as AuditLogEntry[]) ?? []}
                columns={columns}
                searchable
                searchPlaceholder="Search audit logs..."
                searchKey={(row) => `${row.action} ${row.targetType ?? ""} ${row.targetId ?? ""}`}
                emptyTitle="No audit logs found"
                emptyDescription="Actions performed in the system will be logged here."
            />
        </div>
    );
}
