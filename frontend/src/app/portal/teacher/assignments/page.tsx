"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { DataTable } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, FileText, ChevronRight } from "lucide-react";

export default function AssignmentsPage() {
    const { user, isLoading: authLoading } = useAuth();

    const classes = useQuery(
        api.modules.academics.queries.getTeacherClasses,
        {}
    );

    const assignments = useQuery(
        api.modules.academics.queries.getAssignments,
        classes?.[0]?._id ? { tenantId: user?.tenantId || "", classId: classes[0]._id } : "skip"
    );

    if (authLoading || classes === undefined || assignments === undefined) {
        return <LoadingSkeleton variant="page" />;
    }

    const columns = [
        {
            header: "Title",
            accessorKey: "title",
        },
        {
            header: "Class",
            accessorKey: "className",
        },
        {
            header: "Due Date",
            accessorKey: "dueDate",
        },
        {
            header: "Type",
            accessorKey: "type",
        },
        {
            header: "Max Score",
            accessorKey: "maxScore",
        },
        {
            id: "actions",
            cell: (row: any) => (
                <Button variant="outline" size="sm" asChild>
                    <Link href={`/portal/teacher/assignments/${row.original._id}`}>
                        View
                    </Link>
                </Button>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            <PageHeader
                title="Assignments"
                description="Manage your class assignments"
                breadcrumbs={[
                    { label: "Teacher Portal", href: "/portal/teacher" },
                    { label: "Assignments" }
                ]}
            />

            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-semibold">Your Assignments</h3>
                    <p className="text-sm text-muted-foreground">
                        {assignments.length} assignment{assignments.length !== 1 ? "s" : ""} total
                    </p>
                </div>
                <Button asChild>
                    <Link href="/portal/teacher/assignments/create">
                        <Plus className="h-4 w-4 mr-2" />
                        Create Assignment
                    </Link>
                </Button>
            </div>

            {assignments.length === 0 ? (
                <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No assignments yet</h3>
                    <p className="text-muted-foreground mb-4">
                        Create your first assignment to get started
                    </p>
                    <Button asChild>
                        <Link href="/portal/teacher/assignments/create">
                            <Plus className="h-4 w-4 mr-2" />
                            Create Assignment
                        </Link>
                    </Button>
                </div>
            ) : (
                <DataTable
                    columns={columns}
                    data={assignments}
                    searchKey="title"
                />
            )}
        </div>
    );
}
