"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const ROLES = [
    { role: "school_admin", level: 90, permissions: ["users:manage", "settings:write", "students:read/write", "staff:read/write", "finance:read", "reports:read"] },
    { role: "principal", level: 80, permissions: ["students:read/write", "staff:read", "grades:read/write", "attendance:read/write", "finance:read", "reports:read"] },
    { role: "bursar", level: 60, permissions: ["finance:read/write/approve", "students:read", "reports:read"] },
    { role: "hr_manager", level: 60, permissions: ["staff:read/write", "payroll:read/write/approve", "reports:read"] },
    { role: "librarian", level: 50, permissions: ["library:read/write", "students:read"] },
    { role: "transport_manager", level: 50, permissions: ["transport:read/write", "students:read"] },
    { role: "teacher", level: 40, permissions: ["students:read", "grades:read/write", "attendance:read/write"] },
    { role: "receptionist", level: 30, permissions: ["students:read", "attendance:read"] },
    { role: "parent", level: 20, permissions: ["students:read", "grades:read", "attendance:read", "finance:read"] },
    { role: "student", level: 10, permissions: ["grades:read", "attendance:read"] },
];

export default function RolesSettingsPage() {
    const { isLoading } = useAuth();

    if (isLoading) return <LoadingSkeleton variant="page" />;

    return (
        <div>
            <PageHeader
                title="Roles & Permissions"
                description="View role hierarchy and permission assignments"
            />

            <div className="mt-6 space-y-4">
                {ROLES.map(({ role, level, permissions }) => (
                    <Card key={role}>
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-base capitalize">{role.replace("_", " ")}</CardTitle>
                                <Badge variant="outline">Level {level}</Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {permissions.map((perm) => (
                                    <Badge key={perm} variant="secondary" className="text-xs">
                                        {perm}
                                    </Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
