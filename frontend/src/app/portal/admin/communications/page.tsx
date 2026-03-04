"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageSquare, Mail, Send, Users, Clock, CheckCircle, AlertCircle, Filter } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";

export default function CommunicationsPage() {
  const { user, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("announcements");

  if (isLoading) return <LoadingSkeleton variant="page" />;

  return (
    <div>
      <PageHeader
        title="Communications"
        description="Manage announcements, message templates, and delivery tracking"
      />

      <div className="space-y-6">
        {/* Tab Navigation */}
        <div className="flex space-x-1 border-b">
          <button
            onClick={() => setActiveTab("announcements")}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
              activeTab === "announcements"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Announcements
          </button>
          <button
            onClick={() => setActiveTab("templates")}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
              activeTab === "templates"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Mail className="h-4 w-4 mr-2" />
            Templates
          </button>
          <button
            onClick={() => setActiveTab("queue")}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
              activeTab === "queue"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Send className="h-4 w-4 mr-2" />
            Message Queue
          </button>
          <button
            onClick={() => setActiveTab("reports")}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
              activeTab === "reports"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Filter className="h-4 w-4 mr-2" />
            Delivery Reports
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "announcements" && (
          <Card>
            <CardHeader>
              <CardTitle>Announcements Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Coming Soon</h3>
                <p className="text-muted-foreground max-w-md">
                  Announcement management features will be available here. You'll be able to create, edit, and schedule announcements for different audiences.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "templates" && (
          <Card>
            <CardHeader>
              <CardTitle>Message Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Coming Soon</h3>
                <p className="text-muted-foreground max-w-md">
                  Create and manage reusable message templates for SMS, email, and push notifications. Include variables like {{studentName}}, {{grade}}, etc.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "queue" && (
          <Card>
            <CardHeader>
              <CardTitle>Message Queue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Send className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Coming Soon</h3>
                <p className="text-muted-foreground max-w-md">
                  Monitor outgoing messages, track delivery status, and manage failed messages. Real-time delivery tracking and retry mechanisms.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "reports" && (
          <Card>
            <CardHeader>
              <CardTitle>Delivery Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Coming Soon</h3>
                <p className="text-muted-foreground max-w-md">
                  Comprehensive delivery analytics and reporting. Track delivery rates, failure reasons, and performance metrics across all communication channels.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
