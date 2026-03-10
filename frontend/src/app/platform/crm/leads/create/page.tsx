"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  ArrowLeft,
  Target,
  TrendingUp,
  Clock,
  CheckCircle
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function CreateLeadPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <PageHeader
              title="Add Lead"
              description="Add new lead to CRM pipeline"
            />
          </div>
        </div>
      </div>

      {/* Coming Soon Card */}
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-em-success-bg/20 rounded-full flex items-center justify-center mb-4">
            <Users className="h-8 w-8 text-em-success" />
          </div>
          <CardTitle className="text-2xl">CRM Lead Management</CardTitle>
          <p className="text-muted-foreground">
            Manage sales pipeline and track potential customers
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-muted/30 border-border/50">
              <CardContent className="pt-4 text-center">
                <Target className="h-8 w-8 text-em-info mx-auto mb-2" />
                <h3 className="font-medium text-sm">Lead Tracking</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Track leads through sales pipeline stages
                </p>
              </CardContent>
            </Card>
            <Card className="bg-muted/30 border-border/50">
              <CardContent className="pt-4 text-center">
                <TrendingUp className="h-8 w-8 text-em-success mx-auto mb-2" />
                <h3 className="font-medium text-sm">Conversion Analytics</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Monitor conversion rates and pipeline health
                </p>
              </CardContent>
            </Card>
            <Card className="bg-muted/30 border-border/50">
              <CardContent className="pt-4 text-center">
                <Users className="h-8 w-8 text-em-accent-dark mx-auto mb-2" />
                <h3 className="font-medium text-sm">Contact Management</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Centralized contact information and history
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Pipeline Stages */}
          <Card className="bg-muted/30 border-border/50">
            <CardContent className="pt-4">
              <h4 className="font-medium text-sm mb-3">Sales Pipeline Stages</h4>
              <div className="space-y-2">
                {[
                  { stage: "Lead", color: "bg-em-info-bg text-em-info" },
                  { stage: "Qualified", color: "bg-em-accent-bg text-em-accent-dark" },
                  { stage: "Proposal", color: "bg-em-warning-bg text-em-accent-dark" },
                  { stage: "Negotiation", color: "bg-em-warning-bg text-em-accent-dark" },
                  { stage: "Closed Won", color: "bg-em-success-bg text-em-success" },
                  { stage: "Closed Lost", color: "bg-em-danger-bg text-em-danger" },
                ].map((item) => (
                  <div key={item.stage} className="flex items-center space-x-2">
                    <Badge className={item.color} variant="secondary">
                      {item.stage}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      Track progress through this stage
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Status */}
          <Card className="bg-em-warning-bg/10 border-em-warning/20">
            <CardContent className="pt-4">
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-em-warning" />
                <div>
                  <h4 className="font-medium text-sm">Coming Soon</h4>
                  <p className="text-xs text-muted-foreground">
                    CRM lead management system is currently under development and will be available in the next release.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex items-center justify-center space-x-4">
            <Button variant="outline" onClick={() => router.back()}>
              Go Back
            </Button>
            <Button 
              onClick={() => router.push("/platform/crm")}
              className="bg-em-accent hover:bg-em-accent-dark"
            >
              <Users className="h-4 w-4 mr-2" />
              View CRM
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
