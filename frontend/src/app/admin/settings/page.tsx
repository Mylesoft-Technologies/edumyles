"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { useAuth } from "@/hooks/useAuth";
import { useTenant } from "@/hooks/useTenant";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Globe, Mail, Phone, BookOpen, Calendar } from "lucide-react";

export default function SchoolSettingsPage() {
    const { isLoading } = useAuth();
    const { tenant, organization, tier } = useTenant();

    if (isLoading) return <LoadingSkeleton variant="page" />;

    return (
        <div>
            <PageHeader
                title="School Settings"
                description="View and manage your school configuration"
            />

            <div className="mt-6 grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">School Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <InfoRow icon={Building2} label="School Name" value={tenant?.name ?? "—"} />
                        <InfoRow icon={Globe} label="Subdomain" value={tenant?.subdomain ? `${tenant.subdomain}.edumyles.com` : "—"} />
                        <InfoRow icon={Mail} label="Email" value={tenant?.email ?? "—"} />
                        <InfoRow icon={Phone} label="Phone" value={tenant?.phone ?? "—"} />
                        <InfoRow icon={Globe} label="Country" value={tenant?.country ?? "—"} />
                        <InfoRow icon={Building2} label="County" value={tenant?.county ?? "—"} />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Subscription</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Current Plan</span>
                            <Badge variant="default" className="capitalize">{tier ?? tenant?.plan ?? "Free"}</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Status</span>
                            <Badge variant={tenant?.status === "active" ? "default" : "destructive"}>
                                {tenant?.status ?? "—"}
                            </Badge>
                        </div>
                        {organization && (
                            <InfoRow icon={Building2} label="Organization" value={organization.name} />
                        )}
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
