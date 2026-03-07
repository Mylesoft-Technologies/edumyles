"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@/hooks/useSSRSafeConvex";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

function formatCurrency(cents: number, currency: string) {
  return `${currency} ${(cents / 100).toLocaleString()}`;
}

export default function PartnerStudentsPage() {
  const { isLoading } = useAuth();
  const students = useQuery(api.modules.portal.partner.queries.getSponsoredStudents, {});

  if (isLoading || students === undefined) {
    return <LoadingSkeleton variant="page" />;
  }

  return (
    <div>
      <PageHeader
        title="Sponsored Students"
        description="Students under your sponsorship — view read-only academic and attendance reports"
      />

      {!students?.length ? (
        <p className="text-sm text-muted-foreground">No sponsored students are linked to your account.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {students.map((s: any) => (
            <Card key={s._id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{s.firstName} {s.lastName}</span>
                  <Badge variant="secondary">{s.status}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-1">
                <p>Admission: {s.admissionNumber}</p>
                {s.sponsorshipAmountCents != null && (
                  <p>Sponsorship: {formatCurrency(s.sponsorshipAmountCents, s.sponsorshipCurrency ?? "KES")}</p>
                )}
                <Button asChild size="sm" className="mt-3">
                  <Link href={`/portal/partner/students/${s._id}`}>View report</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
