"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  ArrowLeft,
  DollarSign,
  Clock,
  CheckCircle
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function CreateInvoicePage() {
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
              title="Create Invoice"
              description="Generate billing invoice for tenants"
            />
          </div>
        </div>
      </div>

      {/* Coming Soon Card */}
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-em-warning-bg/20 rounded-full flex items-center justify-center mb-4">
            <FileText className="h-8 w-8 text-em-warning" />
          </div>
          <CardTitle className="text-2xl">Invoice Generation</CardTitle>
          <p className="text-muted-foreground">
            Create and manage billing invoices for tenant subscriptions
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-muted/30 border-border/50">
              <CardContent className="pt-4 text-center">
                <DollarSign className="h-8 w-8 text-em-success mx-auto mb-2" />
                <h3 className="font-medium text-sm">Automated Billing</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Generate invoices based on subscription plans
                </p>
              </CardContent>
            </Card>
            <Card className="bg-muted/30 border-border/50">
              <CardContent className="pt-4 text-center">
                <FileText className="h-8 w-8 text-em-info mx-auto mb-2" />
                <h3 className="font-medium text-sm">Custom Invoices</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Create one-time invoices for specific services
                </p>
              </CardContent>
            </Card>
            <Card className="bg-muted/30 border-border/50">
              <CardContent className="pt-4 text-center">
                <CheckCircle className="h-8 w-8 text-em-accent-dark mx-auto mb-2" />
                <h3 className="font-medium text-sm">Payment Tracking</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Track invoice status and payment history
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Status */}
          <Card className="bg-em-warning-bg/10 border-em-warning/20">
            <CardContent className="pt-4">
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-em-warning" />
                <div>
                  <h4 className="font-medium text-sm">Coming Soon</h4>
                  <p className="text-xs text-muted-foreground">
                    Invoice generation system is currently under development and will be available in the next release.
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
              onClick={() => router.push("/platform/billing")}
              className="bg-em-accent hover:bg-em-accent-dark"
            >
              <FileText className="h-4 w-4 mr-2" />
              View Billing
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
