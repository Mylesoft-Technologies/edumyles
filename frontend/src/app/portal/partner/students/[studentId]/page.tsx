"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

function formatCurrency(cents: number, currency: string) {
  return `${currency} ${(cents / 100).toLocaleString()}`;
}

export default function PartnerStudentReportPage() {
  const { isLoading } = useAuth();
  const params = useParams();
  const studentId = params.studentId as string;
  const data = useQuery(
    api.modules.portal.partner.queries.getSponsoredStudentReport,
    studentId ? { studentId } : "skip"
  );

  if (isLoading || (studentId && data === undefined)) {
    return <LoadingSkeleton variant="page" />;
  }

  if (!data) {
    return (
      <div>
        <PageHeader title="Student Report" description="Sponsored student report" />
        <p className="text-muted-foreground">Student not found or not under your sponsorship.</p>
        <Button asChild variant="outline" className="mt-4">
          <Link href="/portal/partner/students">Back to students</Link>
        </Button>
      </div>
    );
  }

  const { student, sponsorship, grades, attendance } = data;

  return (
    <div>
      <PageHeader
        title={`${student.firstName} ${student.lastName}`}
        description={`Admission: ${student.admissionNumber} — read-only academic & attendance report`}
      />

      <div className="mb-4">
        <Button asChild variant="outline" size="sm">
          <Link href="/portal/partner/students">← Back to students</Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Sponsorship</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-1">
            <p>Amount: {formatCurrency(sponsorship.amountCents, sponsorship.currency)}</p>
            <p>Status: <Badge variant="secondary">{sponsorship.status}</Badge></p>
            <p>From: {new Date(sponsorship.startDate).toLocaleDateString()}</p>
            {sponsorship.endDate && (
              <p>To: {new Date(sponsorship.endDate).toLocaleDateString()}</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Student</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-1">
            <p>Class: {student.classId ?? "—"}</p>
            <p>Status: {student.status}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Grades</CardTitle>
        </CardHeader>
        <CardContent>
          {!grades?.length ? (
            <p className="text-sm text-muted-foreground">No grades recorded yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Term</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Grade</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {grades.slice(0, 30).map((g: any) => (
                  <TableRow key={g._id}>
                    <TableCell>{g.term} {g.academicYear}</TableCell>
                    <TableCell>{g.subjectId}</TableCell>
                    <TableCell>{g.score}</TableCell>
                    <TableCell>{g.grade}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Recent Attendance</CardTitle>
        </CardHeader>
        <CardContent>
          {!attendance?.length ? (
            <p className="text-sm text-muted-foreground">No attendance records yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendance.slice(0, 30).map((a: any) => (
                  <TableRow key={a._id}>
                    <TableCell>{a.date}</TableCell>
                    <TableCell><Badge variant={a.status === "present" ? "default" : "secondary"}>{a.status}</Badge></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
