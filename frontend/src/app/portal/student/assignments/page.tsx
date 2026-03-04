"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, FileText, Clock, CheckCircle } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export default function StudentAssignmentsPage() {
  const { user, isLoading } = useAuth();

  const assignments = useQuery(
    api.modules.portal.student.queries.getMyAssignments,
    {} // No args needed for getting all assignments
  );

  if (isLoading || assignments === undefined) {
    return <LoadingSkeleton variant="page" />;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "submitted":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "graded":
        return "bg-green-100 text-green-800 border-green-200";
      case "overdue":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "submitted":
        return <FileText className="h-4 w-4" />;
      case "graded":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  return (
    <div>
      <PageHeader
        title="My Assignments"
        description="View and submit your assignments"
      />

      <div className="space-y-6">
        {assignments.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Assignments</h3>
              <p className="text-muted-foreground text-center max-w-md">
                You don't have any assignments at the moment. Check back later for new assignments from your teachers.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {assignments.map((assignment: any) => (
              <Card key={assignment._id} className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{assignment.title}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {assignment.subject} • {assignment.className}
                    </p>
                  </div>
                  <Badge 
                    className={`ml-4 ${getStatusColor(assignment.status)}`}
                    variant="outline"
                  >
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(assignment.status)}
                      <span className="capitalize">{assignment.status}</span>
                    </div>
                  </Badge>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Due: {format(new Date(assignment.dueDate), "PPP")}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>Assigned: {format(new Date(assignment.createdAt), "PPP")}</span>
                    </div>

                    {assignment.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {assignment.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="text-sm text-muted-foreground">
                        {assignment.status === "graded" && assignment.grade && (
                          <span className="font-medium text-green-600">
                            Grade: {assignment.grade}/{assignment.maxGrade}
                          </span>
                        )}
                        {assignment.status === "submitted" && (
                          <span className="text-blue-600">Submitted</span>
                        )}
                        {assignment.status === "pending" && (
                          <span className="text-yellow-600">Pending Submission</span>
                        )}
                      </div>
                      
                      <Link href={`/portal/student/assignments/${assignment._id}`}>
                        <Button 
                          variant={assignment.status === "pending" ? "default" : "outline"}
                          disabled={assignment.status === "graded"}
                        >
                          {assignment.status === "pending" ? "Submit Assignment" : "View Details"}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
