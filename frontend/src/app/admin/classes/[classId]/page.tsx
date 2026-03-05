"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { DataTable, Column } from "@/components/shared/DataTable";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { ArrowLeft, Users, UserCircle, BookOpen } from "lucide-react";
import Link from "next/link";

export default function ClassDetailPage() {
    const { classId } = useParams<{ classId: string }>();
    const { isLoading, sessionToken } = useAuth();

    const classes = useQuery(
        api.modules.sis.queries.listClasses,
        sessionToken ? {} : "skip"
    );

    const students = useQuery(
        api.modules.sis.queries.listStudents,
        sessionToken && classId ? { classId } : "skip"
    );

    if (isLoading || classes === undefined) return <LoadingSkeleton variant="page" />;

    const classInfo = (classes as any[])?.find((c) => c._id === classId);

    if (!classInfo) {
        return (
            <div className="flex flex-col items-center justify-center py-12">
                <p className="text-muted-foreground">Class not found.</p>
                <Link href="/admin/classes">
                    <Button variant="outline" className="mt-4">Back to Classes</Button>
                </Link>
            </div>
        );
    }

    type StudentRow = {
        _id: string;
        firstName: string;
        lastName: string;
        admissionNumber: string;
        status: string;
        gender: string;
    };

    const studentColumns: Column<StudentRow>[] = [
        {
            key: "admissionNumber",
            header: "Adm. No.",
            cell: (row) => (
                <Link href={`/admin/students/${row._id}`} className="font-medium text-primary hover:underline">
                    {row.admissionNumber}
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
            key: "gender",
            header: "Gender",
            cell: (row) => row.gender,
        },
        {
            key: "status",
            header: "Status",
            cell: (row) => <Badge variant={row.status === "active" ? "default" : "secondary"}>{row.status}</Badge>,
        },
    ];

    return (
        <div>
            <div className="mb-4">
                <Link href="/admin/classes" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="h-4 w-4" /> Back to Classes
                </Link>
            </div>

            <PageHeader
                title={classInfo.name}
                description={[classInfo.level, classInfo.stream, classInfo.academicYear].filter(Boolean).join(" • ") || "Class details"}
            />

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <Card>
                    <CardContent className="flex items-center gap-3 pt-6">
                        <Users className="h-8 w-8 text-primary" />
                        <div>
                            <p className="text-2xl font-bold">{classInfo.studentCount}</p>
                            <p className="text-sm text-muted-foreground">
                                Students {classInfo.capacity ? `/ ${classInfo.capacity} capacity` : ""}
                            </p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="flex items-center gap-3 pt-6">
                        <BookOpen className="h-8 w-8 text-primary" />
                        <div>
                            <p className="text-sm font-medium">{classInfo.level ?? "—"}</p>
                            <p className="text-sm text-muted-foreground">Level</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="flex items-center gap-3 pt-6">
                        <UserCircle className="h-8 w-8 text-primary" />
                        <div>
                            <p className="text-sm font-medium">{classInfo.stream ?? "—"}</p>
                            <p className="text-sm text-muted-foreground">Stream</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="mt-6">
                <h3 className="mb-4 text-lg font-semibold">Class Roster</h3>
                <DataTable
                    data={(students as StudentRow[]) ?? []}
                    columns={studentColumns}
                    searchable
                    searchPlaceholder="Search students in class..."
                    searchKey={(row) => `${row.firstName} ${row.lastName} ${row.admissionNumber}`}
                    emptyTitle="No students in this class"
                    emptyDescription="Assign students to this class from the student management page."
                />
            </div>
        </div>
    );
}
