"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Users, GraduationCap, DollarSign, CalendarCheck, ClipboardList, UserCog } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdminDashboardPage() {
  const { isLoading, sessionToken } = useAuth();

  const studentStats = useQuery(
    api.modules.sis.queries.getStudentStats,
    sessionToken ? {} : "skip"
  );

  const staffStats = useQuery(
    api.modules.hr.queries.getStaffStats,
    sessionToken ? {} : "skip"
  );

  const admissionStats = useQuery(
    api.modules.admissions.queries.getApplicationStats,
    sessionToken ? {} : "skip"
  );

  if (isLoading) return <LoadingSkeleton variant="page" />;

  return (
    <div>
      <PageHeader
        title="School Dashboard"
        description="Overview of your school's key metrics"
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Students"
          value={studentStats?.total?.toString() ?? "--"}
          icon={GraduationCap}
          description={studentStats ? `${studentStats.active} active` : undefined}
        />
        <StatCard
          label="Total Staff"
          value={staffStats?.total?.toString() ?? "--"}
          icon={Users}
          description={staffStats ? `${staffStats.active} active` : undefined}
        />
        <StatCard
          label="Applications"
          value={admissionStats?.total?.toString() ?? "--"}
          icon={ClipboardList}
          description={
            admissionStats?.byStatus?.submitted
              ? `${admissionStats.byStatus.submitted} pending review`
              : undefined
          }
        />
        <StatCard
          label="Attendance Rate"
          value="--"
          icon={CalendarCheck}
          description="Coming soon"
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            <Link href="/admin/students/create">
              <Button variant="outline" className="w-full justify-start gap-2">
                <GraduationCap className="h-4 w-4" />
                Enroll Student
              </Button>
            </Link>
            <Link href="/admin/staff/create">
              <Button variant="outline" className="w-full justify-start gap-2">
                <UserCog className="h-4 w-4" />
                Add Staff
              </Button>
            </Link>
            <Link href="/admin/classes/create">
              <Button variant="outline" className="w-full justify-start gap-2">
                <Users className="h-4 w-4" />
                Create Class
              </Button>
            </Link>
            <Link href="/admin/admissions">
              <Button variant="outline" className="w-full justify-start gap-2">
                <ClipboardList className="h-4 w-4" />
                View Applications
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Student Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            {studentStats ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Active</span>
                  <Badge variant="default">{studentStats.active}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Graduated</span>
                  <Badge variant="secondary">{studentStats.graduated}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Suspended</span>
                  <Badge variant="destructive">{studentStats.suspended}</Badge>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Install the SIS module to view student data.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
