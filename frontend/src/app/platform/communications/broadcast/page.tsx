"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Send, 
  Users, 
  MessageSquare, 
  Target,
  ArrowLeft,
  Clock,
  CheckCircle
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function BroadcastPage() {
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
              title="Send Broadcast"
              description="Send messages to multiple tenants or users"
            />
          </div>
        </div>
      </div>

      {/* Coming Soon Card */}
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-em-accent-bg/20 rounded-full flex items-center justify-center mb-4">
            <Send className="h-8 w-8 text-em-accent-dark" />
          </div>
          <CardTitle className="text-2xl">Broadcast Messages</CardTitle>
          <p className="text-muted-foreground">
            Send targeted communications to specific tenant segments
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-muted/30 border-border/50">
              <CardContent className="pt-4 text-center">
                <Users className="h-8 w-8 text-em-info mx-auto mb-2" />
                <h3 className="font-medium text-sm">Audience Segmentation</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Target by plan, status, county, school type
                </p>
              </CardContent>
            </Card>
            <Card className="bg-muted/30 border-border/50">
              <CardContent className="pt-4 text-center">
                <MessageSquare className="h-8 w-8 text-em-success mx-auto mb-2" />
                <h3 className="font-medium text-sm">Multi-channel</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Email, SMS, and in-app notifications
                </p>
              </CardContent>
            </Card>
            <Card className="bg-muted/30 border-border/50">
              <CardContent className="pt-4 text-center">
                <Target className="h-8 w-8 text-em-accent-dark mx-auto mb-2" />
                <h3 className="font-medium text-sm">Personalization</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Dynamic content with variables
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
                    This feature is currently under development and will be available in the next release.
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
              onClick={() => router.push("/platform/communications")}
              className="bg-em-accent hover:bg-em-accent-dark"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              View Communications
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
