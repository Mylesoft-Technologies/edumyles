"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable, Column } from "@/components/shared/DataTable";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { useAuth } from "@/hooks/useAuth";
import { useTenant } from "@/hooks/useTenant";
import { useQuery } from "@/hooks/useSSRSafeConvex";
import { api } from "@/convex/_generated/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getRoleLabel } from "@/lib/routes";
import Link from "next/link";
import { Plus } from "lucide-react";
import { useState } from "react";

type UserRecord = {
    _id: string;
    firstName?: string;
    lastName?: string;
    email: string;
    role: string;
    isActive: boolean;
    createdAt: number;
};

export default function UsersPage() {
    const { isLoading, sessionToken } = useAuth();
    const { tenantId } = useTenant();
    const [roleFilter, setRoleFilter] = useState<string>("all");

    const users = useQuery(
        api.users.listTenantUsers,
        sessionToken && tenantId
            ? { tenantId, role: roleFilter === "all" ? undefined : roleFilter }
            : "skip"
    );

    if (isLoading) return <LoadingSkeleton variant="page" />;

    const columns: Column<UserRecord>[] = [
        {
            key: "name",
            header: "Name",
            cell: (row) => {
                const name = [row.firstName, row.lastName].filter(Boolean).join(" ");
                return name || row.email;
            },
            sortable: true,
        },
        {
            key: "email",
            header: "Email",
            cell: (row) => row.email,
        },
        {
            key: "role",
            header: "Role",
            cell: (row) => (
                <Badge variant="outline">{getRoleLabel(row.role)}</Badge>
            ),
        },
        {
            key: "status",
            header: "Status",
            cell: (row) => (
                <Badge variant={row.isActive ? "default" : "destructive"}>
                    {row.isActive ? "Active" : "Inactive"}
                </Badge>
            ),
        },
        {
            key: "joined",
            header: "Joined",
            cell: (row) => new Date(row.createdAt).toLocaleDateString(),
            sortable: true,
        },
    ];

    return (
        <div>
            <PageHeader
                title="User Management"
                description="Manage users within your school"
                actions={
                    <Link href="/admin/users/invite">
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" />
                            Invite User
                        </Button>
                    </Link>
                }
            />

            <div className="mb-4">
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Filter by role" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Roles</SelectItem>
                        <SelectItem value="school_admin">School Admin</SelectItem>
                        <SelectItem value="principal">Principal</SelectItem>
                        <SelectItem value="teacher">Teacher</SelectItem>
                        <SelectItem value="bursar">Bursar</SelectItem>
                        <SelectItem value="hr_manager">HR Manager</SelectItem>
                        <SelectItem value="parent">Parent</SelectItem>
                        <SelectItem value="student">Student</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <DataTable
                data={(users as UserRecord[]) ?? []}
                columns={columns}
                searchable
                searchPlaceholder="Search by name or email..."
                searchKey={(row) => `${row.firstName ?? ""} ${row.lastName ?? ""} ${row.email}`}
                emptyTitle="No users found"
                emptyDescription="Invite users to your school to get started."
            />
        </div>
    );
}
