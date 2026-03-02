"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { useAuth } from "@/hooks/useAuth";
import { useTenant } from "@/hooks/useTenant";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Calendar, CreditCard } from "lucide-react";

export default function BillingSettingsPage() {
    const { isLoading } = useAuth();
    const { tenant, tier } = useTenant();

    if (isLoading) return <LoadingSkeleton variant="page" />;

    return (
        <div>
            <PageHeader
                title="Billing & Subscription"
                description="View your subscription and billing information"
            />

            <div className="mt-6 grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Current Plan</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <CreditCard className="h-4 w-4" />
                                Plan
                            </div>
                            <Badge variant="default" className="capitalize text-sm px-3 py-1">
                                {tier ?? tenant?.plan ?? "Free"}
                            </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                Status
                            </div>
                            <Badge variant={tenant?.status === "active" ? "default" : "destructive"}>
                                {tenant?.status ?? "—"}
                            </Badge>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Billing Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            Billing details and invoices will be available here once the billing system is fully configured. Contact platform support for billing inquiries.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
