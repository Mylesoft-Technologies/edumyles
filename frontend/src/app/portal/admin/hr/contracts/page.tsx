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
  FileText,
  Plus,
  Edit,
  Download,
  Calendar,
  DollarSign,
  User,
  AlertTriangle
} from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";

export default function HRContractsPage() {
  const { user, isLoading } = useAuth();
  const [selectedStaff, setSelectedStaff] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const staff = useQuery(
    api.modules.hr.queries.listStaff,
    user ? { status: "active" } : "skip"
  );

  const contracts = useQuery(
    api.modules.hr.queries.listContracts,
    user ? { staffId: selectedStaff || undefined } : "skip"
  );

  const createContract = useMutation(api.modules.hr.mutations.createContract);

  const handleCreateContract = async (staffId: string) => {
    try {
      await createContract({
        staffId,
        type: "permanent",
        startDate: new Date().toISOString().split('T')[0],
        salaryCents: 50000,
        currency: "KES",
      });

      toast({
        title: "Success",
        description: "Contract created successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create contract",
        variant: "destructive"
      });
    }
  };

  if (isLoading) return <LoadingSkeleton variant="page" />;

  return (
    <div>
      <PageHeader
        title="Contract Management"
        description="Manage staff contracts and employment agreements"
      />

      <div className="space-y-6">
        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="staff">Staff Member</Label>
                <Select value={selectedStaff} onValueChange={setSelectedStaff}>
                  <SelectTrigger>
                    <SelectValue placeholder="All staff" />
                  </SelectTrigger>
                  <SelectContent>
                    {(staff as any[])?.map((member) => (
                      <SelectItem key={member._id} value={member._id}>
                        {member.firstName} {member.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Contract Status</Label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                    <SelectItem value="terminated">Terminated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contracts List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Contracts ({contracts?.length || 0})
              </div>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Contract
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {contracts?.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Contracts Found</h3>
                <p className="text-muted-foreground">
                  No contracts match your current filters.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {(contracts as any[])?.map((contract) => (
                  <div key={contract._id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">Contract #{contract._id.slice(-6)}</h4>
                          <Badge variant={contract.status === "active" ? "default" : "secondary"}>
                            {contract.status}
                          </Badge>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <p className="text-sm text-muted-foreground">Type</p>
                            <p className="font-medium capitalize">{contract.type}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Salary</p>
                            <p className="font-medium">
                              {contract.currency} {(contract.salaryCents / 100).toLocaleString()}/month
                            </p>
                          </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <p className="text-sm text-muted-foreground">Start Date</p>
                            <p className="font-medium">
                              {format(new Date(contract.startDate), "PPP")}
                            </p>
                          </div>
                          {contract.endDate && (
                            <div>
                              <p className="text-sm text-muted-foreground">End Date</p>
                              <p className="font-medium">
                                {format(new Date(contract.endDate), "PPP")}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
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

        {/* Contract Creation Helper */}
        {selectedStaff && (
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <Button onClick={() => handleCreateContract(selectedStaff)}>
                  <FileText className="h-4 w-4 mr-2" />
                  Create Contract for Selected Staff
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export Contracts
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
