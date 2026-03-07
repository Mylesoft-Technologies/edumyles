"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@/hooks/useSSRSafeConvex";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import { ArrowLeft, Mail, Phone, UserCircle, Calendar, Briefcase } from "lucide-react";
import Link from "next/link";

export default function StaffProfilePage() {
    const { staffId } = useParams<{ staffId: string }>();
    const { isLoading, sessionToken } = useAuth();

    const staff = useQuery(
        api.modules.hr.queries.getStaffMember,
        sessionToken && staffId ? { staffId: staffId as Id<"staff"> } : "skip"
    );

    if (isLoading || staff === undefined) return <LoadingSkeleton variant="page" />;

    if (!staff) {
        return (
            <div className="flex flex-col items-center justify-center py-12">
                <p className="text-muted-foreground">Staff member not found.</p>
                <Link href="/admin/staff">
                    <Button variant="outline" className="mt-4">Back to Staff</Button>
                </Link>
            </div>
        );
    }

    const statusColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
        active: "default",
        inactive: "secondary",
        on_leave: "outline",
        terminated: "destructive",
    };

    return (
        <div>
            <div className="mb-4">
                <Link href="/admin/staff" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="h-4 w-4" /> Back to Staff
                </Link>
            </div>

            <PageHeader
                title={`${staff.firstName} ${staff.lastName}`}
                description={`Employee ID: ${staff.employeeId}`}
                actions={
                    <Button variant="outline">Edit Profile</Button>
                }
            />

            <div className="mt-6 grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Personal Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <InfoRow icon={UserCircle} label="Full Name" value={`${staff.firstName} ${staff.lastName}`} />
                        <InfoRow icon={Mail} label="Email" value={staff.email} />
                        <InfoRow icon={Phone} label="Phone" value={staff.phone ?? "—"} />
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Status</span>
                            <Badge variant={statusColors[staff.status] ?? "outline"}>
                                {staff.status.replace("_", " ")}
                            </Badge>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Employment Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <InfoRow icon={Briefcase} label="Role" value={staff.role.replace("_", " ")} />
                        <InfoRow icon={Briefcase} label="Department" value={staff.department ?? "—"} />
                        <InfoRow icon={UserCircle} label="Qualification" value={staff.qualification ?? "—"} />
                        <InfoRow icon={Calendar} label="Join Date" value={staff.joinDate} />
                        <InfoRow icon={UserCircle} label="Employee ID" value={staff.employeeId} />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function InfoRow({
    icon: Icon,
    label,
    value,
}: {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    value: string;
}) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Icon className="h-4 w-4" />
                {label}
            </div>
            <span className="text-sm font-medium">{value}</span>
        </div>
    );
}
