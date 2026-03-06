"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Calculator,
  Plus,
  Download,
  CheckCircle,
  Clock,
  DollarSign,
  Users,
  TrendingUp,
  AlertTriangle
} from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";

export default function HRPayrollPage() {
  const { user, isLoading } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState("current");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const payrollRuns = useQuery(
    api.modules.hr.queries.listPayrollRuns,
    user ? { status: selectedStatus === "all" ? undefined : selectedStatus } : "skip"
  );

  const payslips = useQuery(
    api.modules.hr.queries.listPayslips,
    user ? {} : "skip"
  );

  const createPayrollRun = useMutation(api.modules.hr.mutations.createPayrollRun);
  const approvePayrollRun = useMutation(api.modules.hr.mutations.approvePayrollRun);

  const handleCreatePayrollRun = async () => {
    try {
      const now = new Date();
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      await createPayrollRun({
        periodLabel: `${now.toLocaleString('default', { month: 'long' })} ${now.getFullYear()}`,
        startDate: firstDay.toISOString().split('T')[0],
        endDate: lastDay.toISOString().split('T')[0],
      });

      toast({
        title: "Success",
        description: "Payroll run created successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create payroll run",
        variant: "destructive"
      });
    }
  };

  const handleApprovePayrollRun = async (payrollRunId: string) => {
    try {
      await approvePayrollRun({ payrollRunId });
      toast({
        title: "Success",
        description: "Payroll run approved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve payroll run",
        variant: "destructive"
      });
    }
  };

  const calculatePayrollStats = () => {
    const totalRuns = payrollRuns?.length || 0;
    const approvedRuns = (payrollRuns as any[])?.filter(run => run.status === "approved").length || 0;
    const draftRuns = (payrollRuns as any[])?.filter(run => run.status === "draft").length || 0;

    // Calculate total payroll amount (simplified)
    const totalPayroll = (payslips as any[])?.reduce((sum, slip) => sum + slip.netCents, 0) || 0;

    return {
      totalRuns,
      approvedRuns,
      draftRuns,
      totalPayroll,
      averagePayroll: approvedRuns > 0 ? totalPayroll / approvedRuns : 0,
    };
  };

  const payrollStats = calculatePayrollStats();

  if (isLoading) return <LoadingSkeleton variant="page" />;

  return (
    <div>
      <PageHeader
        title="Payroll Management"
        description="Process and manage payroll runs and payslips"
      />

      <div className="space-y-6">
        {/* Payroll Statistics */}
        <div className="grid gap-6 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Runs</CardTitle>
              <Calculator className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{payrollStats.totalRuns}</div>
              <p className="text-xs text-muted-foreground">All payroll periods</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{payrollStats.approvedRuns}</div>
              <p className="text-xs text-muted-foreground">Completed runs</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Draft</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{payrollStats.draftRuns}</div>
              <p className="text-xs text-muted-foreground">Pending runs</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Payroll</CardTitle>
              <DollarSign className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                KES {(payrollStats.totalPayroll / 100).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">YTD total</p>
            </CardContent>
          </Card>
        </div>

        {/* Payroll Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Payroll Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="period">Period</Label>
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="current">Current Month</SelectItem>
                    <SelectItem value="last">Last Month</SelectItem>
                    <SelectItem value="quarter">This Quarter</SelectItem>
                    <SelectItem value="year">This Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Quick Actions</Label>
                <div className="flex gap-2">
                  <Button onClick={handleCreatePayrollRun}>
                    <Plus className="h-4 w-4 mr-2" />
                    New Run
                  </Button>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payroll Runs List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Payroll Runs ({payrollRuns?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {payrollRuns?.length === 0 ? (
              <div className="text-center py-8">
                <Calculator className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Payroll Runs Found</h3>
                <p className="text-muted-foreground">
                  Create your first payroll run to get started.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {(payrollRuns as any[]).map((run) => (
                  <div key={run._id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{run.periodLabel}</h4>
                          <Badge
                            variant={run.status === "approved" ? "default" : "secondary"}
                          >
                            {run.status}
                          </Badge>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <p className="text-sm text-muted-foreground">Period</p>
                            <p className="font-medium">
                              {format(new Date(run.startDate), "PPP")} - {format(new Date(run.endDate), "PPP")}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Created</p>
                            <p className="font-medium">
                              {format(new Date(run.createdAt), "PPP")}
                            </p>
                          </div>
                        </div>

                        {run.status === "approved" && (
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-green-600">Approved by {run.approvedBy}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex space-x-2">
                        {run.status === "draft" && (
                          <Button
                            size="sm"
                            onClick={() => handleApprovePayrollRun(run._id)}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve
                          </Button>
                        )}
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Payslips */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Recent Payslips
            </CardTitle>
          </CardHeader>
          <CardContent>
            {payslips?.length === 0 ? (
              <div className="text-center py-8">
                <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Payslips Found</h3>
                <p className="text-muted-foreground">
                  Payslips will appear here once payroll runs are processed.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {(payslips as any[])?.slice(0, 5).map((payslip) => (
                  <div key={payslip._id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">Payslip #{payslip._id.slice(-6)}</h4>
                          <Badge variant={payslip.status === "approved" ? "default" : "secondary"}>
                            {payslip.status}
                          </Badge>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <p className="text-sm text-muted-foreground">Basic Salary</p>
                            <p className="font-medium">
                              {payslip.currency} {(payslip.basicCents / 100).toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Net Pay</p>
                            <p className="font-medium">
                              {payslip.currency} {(payslip.netCents / 100).toLocaleString()}
                            </p>
                          </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <p className="text-sm text-muted-foreground">Allowances</p>
                            <p className="font-medium">
                              {payslip.currency} {(payslip.allowancesCents / 100).toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Deductions</p>
                            <p className="font-medium">
                              {payslip.currency} {(payslip.deductionsCents / 100).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                {payslips?.length > 5 && (
                  <Button variant="outline" className="w-full mt-4">
                    View All Payslips ({payslips?.length - 5} more)
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
