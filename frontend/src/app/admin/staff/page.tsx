"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable, Column } from "@/components/shared/DataTable";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@/hooks/useSSRSafeConvex";
import { api } from "@/convex/_generated/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import { Plus } from "lucide-react";
import { useState } from "react";

type StaffMember = {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    role: string;
    department?: string;
    employeeId: string;
    status: string;
    joinDate: string;
};

const statusColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    active: "default",
    inactive: "secondary",
    on_leave: "outline",
    terminated: "destructive",
};

export default function StaffPage() {
    const { isLoading, sessionToken } = useAuth();
    const [roleFilter, setRoleFilter] = useState<string>("all");

    const staff = useQuery(
        api.modules.hr.queries.listStaff,
        sessionToken
            ? { role: roleFilter === "all" ? undefined : roleFilter }
            : "skip"
    );

    if (isLoading) return <LoadingSkeleton variant="page" />;

    const columns: Column<StaffMember>[] = [
        {
            key: "employeeId",
            header: "Employee ID",
            cell: (row) => (
                <Link href={`/admin/staff/${row._id}`} className="font-medium text-primary hover:underline">
                    {row.employeeId}
                </Link>
            ),
        },
        {
            key: "name",
            header: "Name",
            cell: (row) => `${row.firstName} ${row.lastName}`,
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
            cell: (row) => <Badge variant="outline">{row.role.replace("_", " ")}</Badge>,
        },
        {
            key: "department",
            header: "Department",
            cell: (row) => row.department ?? "—",
        },
        {
            key: "status",
            header: "Status",
            cell: (row) => <Badge variant={statusColors[row.status] ?? "outline"}>{row.status.replace("_", " ")}</Badge>,
        },
        {
            key: "actions",
            header: "",
            cell: (row) => (
                <Link href={`/admin/staff/${row._id}`}>
                    <Button variant="ghost" size="sm">View</Button>
                </Link>
            ),
        },
    ];

    return (
        <div>
            <PageHeader
                title="Staff Directory"
                description="Manage school staff members"
                actions={
                    <Link href="/admin/staff/create">
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" />
                            Add Staff
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
                        <SelectItem value="teacher">Teacher</SelectItem>
                        <SelectItem value="principal">Principal</SelectItem>
                        <SelectItem value="bursar">Bursar</SelectItem>
                        <SelectItem value="hr_manager">HR Manager</SelectItem>
                        <SelectItem value="librarian">Librarian</SelectItem>
                        <SelectItem value="transport_manager">Transport Manager</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <DataTable
                data={(staff as StaffMember[]) ?? []}
                columns={columns}
                searchable
                searchPlaceholder="Search by name, email, or employee ID..."
                searchKey={(row) => `${row.firstName} ${row.lastName} ${row.email} ${row.employeeId}`}
                emptyTitle="No staff found"
                emptyDescription="Add your first staff member to get started."
            />
        </div>
    );
}
