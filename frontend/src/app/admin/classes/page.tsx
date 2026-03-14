"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable, Column } from "@/components/shared/DataTable";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@/hooks/useSSRSafeConvex";
import { api } from "@/convex/_generated/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

type ClassWithCount = {
    _id: string;
    name: string;
    level?: string;
    stream?: string;
    teacherId?: string;
    capacity?: number;
    academicYear?: string;
    studentCount: number;
};

export default function ClassesPage() {
    const { isLoading, sessionToken } = useAuth();

    const classes = useQuery(
        api.modules.sis.queries.listClasses,
        sessionToken ? { sessionToken } : "skip"
    );

    if (isLoading) return <LoadingSkeleton variant="page" />;

    const columns: Column<ClassWithCount>[] = [
        {
            key: "name",
            header: "Class Name",
            cell: (row) => (
                <Link href={`/admin/classes/${row._id}`} className="font-medium text-primary hover:underline">
                    {row.name}
                </Link>
            ),
            sortable: true,
        },
        {
            key: "level",
            header: "Level",
            cell: (row) => row.level ?? "—",
        },
        {
            key: "stream",
            header: "Stream",
            cell: (row) => row.stream ?? "—",
        },
        {
            key: "students",
            header: "Students",
            cell: (row) => (
                <div className="flex items-center gap-2">
                    <span>{row.studentCount}</span>
                    {row.capacity && (
                        <span className="text-muted-foreground">/ {row.capacity}</span>
                    )}
                </div>
            ),
            sortable: true,
        },
        {
            key: "year",
            header: "Academic Year",
            cell: (row) => row.academicYear ?? "—",
        },
        {
            key: "actions",
            header: "",
            cell: (row) => (
                <Link href={`/admin/classes/${row._id}`}>
                    <Button variant="ghost" size="sm">View</Button>
                </Link>
            ),
        },
    ];

    return (
        <div>
            <PageHeader
                title="Classes"
                description="Manage school classes and streams"
                actions={
                    <Link href="/admin/classes/create">
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" />
                            Create Class
                        </Button>
                    </Link>
                }
            />

            <DataTable
                data={(classes as ClassWithCount[]) ?? []}
                columns={columns}
                searchable
                searchPlaceholder="Search classes..."
                searchKey={(row) => `${row.name} ${row.level ?? ""} ${row.stream ?? ""}`}
                emptyTitle="No classes found"
                emptyDescription="Create your first class to get started."
            />
        </div>
    );
}
