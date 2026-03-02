"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { ArrowLeft, UserCircle, Mail, Phone, Calendar, GraduationCap } from "lucide-react";
import Link from "next/link";

const statusColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    draft: "outline",
    submitted: "default",
    under_review: "secondary",
    accepted: "default",
    rejected: "destructive",
    waitlisted: "outline",
    enrolled: "secondary",
};

const VALID_TRANSITIONS: Record<string, { label: string; status: string; variant?: "default" | "destructive" | "outline" }[]> = {
    draft: [{ label: "Submit", status: "submitted" }],
    submitted: [
        { label: "Start Review", status: "under_review" },
        { label: "Reject", status: "rejected", variant: "destructive" },
    ],
    under_review: [
        { label: "Accept", status: "accepted" },
        { label: "Waitlist", status: "waitlisted", variant: "outline" },
        { label: "Reject", status: "rejected", variant: "destructive" },
    ],
    accepted: [
        { label: "Enroll Student", status: "enrolled" },
        { label: "Reject", status: "rejected", variant: "destructive" },
    ],
    waitlisted: [
        { label: "Accept", status: "accepted" },
        { label: "Reject", status: "rejected", variant: "destructive" },
    ],
};

export default function ApplicationDetailPage() {
    const { appId } = useParams<{ appId: string }>();
    const { isLoading, sessionToken } = useAuth();
    const router = useRouter();
    const [pendingAction, setPendingAction] = useState<{ label: string; status: string } | null>(null);

    const application = useQuery(
        api.modules.admissions.queries.getApplication,
        sessionToken && appId ? { applicationId: appId as Id<"admissionApplications"> } : "skip"
    );

    const updateStatus = useMutation(api.modules.admissions.mutations.updateApplicationStatus);
    const enrollFromApplication = useMutation(api.modules.admissions.mutations.enrollFromApplication);

    if (isLoading || application === undefined) return <LoadingSkeleton variant="page" />;

    if (!application) {
        return (
            <div className="flex flex-col items-center justify-center py-12">
                <p className="text-muted-foreground">Application not found.</p>
                <Link href="/admin/admissions">
                    <Button variant="outline" className="mt-4">Back to Admissions</Button>
                </Link>
            </div>
        );
    }

    const handleAction = async () => {
        if (!pendingAction) return;

        if (pendingAction.status === "enrolled") {
            await enrollFromApplication({
                applicationId: appId as Id<"admissionApplications">,
            });
        } else {
            await updateStatus({
                applicationId: appId as Id<"admissionApplications">,
                status: pendingAction.status,
            });
        }
        setPendingAction(null);
    };

    const transitions = VALID_TRANSITIONS[application.status] ?? [];

    return (
        <div>
            <div className="mb-4">
                <Link href="/admin/admissions" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="h-4 w-4" /> Back to Admissions
                </Link>
            </div>

            <PageHeader
                title={`${application.firstName} ${application.lastName}`}
                description={`Application ID: ${application.applicationId}`}
                actions={
                    <div className="flex items-center gap-2">
                        <Badge variant={statusColors[application.status] ?? "outline"} className="text-sm px-3 py-1">
                            {application.status.replace("_", " ")}
                        </Badge>
                    </div>
                }
            />

            {/* Action buttons */}
            {transitions.length > 0 && (
                <div className="mt-4 flex gap-2">
                    {transitions.map((t) => (
                        <Button
                            key={t.status}
                            variant={t.variant ?? "default"}
                            onClick={() => setPendingAction(t)}
                        >
                            {t.status === "enrolled" && <GraduationCap className="mr-2 h-4 w-4" />}
                            {t.label}
                        </Button>
                    ))}
                </div>
            )}

            <div className="mt-6 grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Applicant Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <InfoRow icon={UserCircle} label="Full Name" value={`${application.firstName} ${application.lastName}`} />
                        <InfoRow icon={Calendar} label="Date of Birth" value={application.dateOfBirth} />
                        <InfoRow icon={UserCircle} label="Gender" value={application.gender} />
                        <InfoRow icon={GraduationCap} label="Requested Grade" value={application.requestedGrade} />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Guardian Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <InfoRow icon={UserCircle} label="Guardian Name" value={application.guardianName} />
                        <InfoRow icon={Mail} label="Guardian Email" value={application.guardianEmail} />
                        <InfoRow icon={Phone} label="Guardian Phone" value={application.guardianPhone} />
                    </CardContent>
                </Card>

                {application.notes && (
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle className="text-base">Notes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">{application.notes}</p>
                        </CardContent>
                    </Card>
                )}

                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-base">Timeline</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Created</span>
                            <span>{new Date(application.createdAt).toLocaleString()}</span>
                        </div>
                        {application.submittedAt && (
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Submitted</span>
                                <span>{new Date(application.submittedAt).toLocaleString()}</span>
                            </div>
                        )}
                        {application.reviewedAt && (
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Last Reviewed</span>
                                <span>{new Date(application.reviewedAt).toLocaleString()}</span>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <ConfirmDialog
                open={!!pendingAction}
                onOpenChange={(open) => !open && setPendingAction(null)}
                title={`${pendingAction?.label} Application`}
                description={`Are you sure you want to ${pendingAction?.label?.toLowerCase()} this application for ${application.firstName} ${application.lastName}?`}
                onConfirm={handleAction}
                confirmLabel={pendingAction?.label ?? "Confirm"}
                variant={pendingAction?.status === "rejected" ? "destructive" : "default"}
            />
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
