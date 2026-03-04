"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function formatCurrency(cents: number) {
  return `KES ${(cents / 100).toLocaleString()}`;
}

export default function PartnerReportsPage() {
  const { isLoading } = useAuth();
  const report = useQuery(api.modules.portal.partner.queries.getSponsorshipReport, {});

  if (isLoading || report === undefined) {
    return <LoadingSkeleton variant="page" />;
  }

  const { students, totalInvestedCents, summary } = report;

  return (
    <div>
      <PageHeader
        title="Sponsorship Reports"
        description="Aggregated academic and financial summary for your sponsored students"
      />

      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Invested</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{formatCurrency(totalInvestedCents)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Students in Report</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{summary?.totalStudents ?? students?.length ?? 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">
              {summary?.averageScore != null ? summary.averageScore.toFixed(1) : "—"}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Per-student summary</CardTitle>
        </CardHeader>
        <CardContent>
          {!students?.length ? (
            <p className="text-sm text-muted-foreground">No sponsored students in this report.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Admission</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Avg score</TableHead>
                  <TableHead>Attendance %</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((s: any) => (
                  <TableRow key={s.studentId}>
                    <TableCell>{s.firstName} {s.lastName}</TableCell>
                    <TableCell>{s.admissionNumber}</TableCell>
                    <TableCell>{s.classId ?? "—"}</TableCell>
                    <TableCell>{s.averageScore != null ? s.averageScore.toFixed(1) : "—"}</TableCell>
                    <TableCell>{s.attendanceRate != null ? `${s.attendanceRate.toFixed(0)}%` : "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <p className="mt-4 text-sm text-muted-foreground">
        Downloadable PDF reports can be added in a future release.
      </p>
    </div>
  );
}
