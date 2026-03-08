"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { EmailComposer } from "@/components/communications/EmailComposer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Send, Clock, CheckCircle, AlertCircle } from "lucide-react";

// Mock email history data
const emailHistory = [
  {
    id: '1',
    to: 'parent1@example.com',
    subject: 'Fee Payment Reminder - John Doe',
    template: 'fee_reminder',
    status: 'delivered',
    sentAt: Date.now() - 3600000, // 1 hour ago
    openedAt: Date.now() - 1800000, // 30 minutes ago
  },
  {
    id: '2',
    to: ['parent2@example.com', 'parent3@example.com'],
    subject: 'Exam Results Available - Term 1 2024',
    template: 'exam_results',
    status: 'delivered',
    sentAt: Date.now() - 7200000, // 2 hours ago
    openedAt: Date.now() - 3600000, // 1 hour ago
  },
  {
    id: '3',
    to: 'teacher1@example.com',
    subject: 'Welcome to EduMyles School',
    template: 'welcome_email',
    status: 'pending',
    sentAt: Date.now() - 1800000, // 30 minutes ago
    openedAt: null,
  },
  {
    id: '4',
    to: 'parent4@example.com',
    subject: 'Attendance Alert - Jane Doe',
    template: 'attendance_alert',
    status: 'failed',
    sentAt: Date.now() - 10800000, // 3 hours ago
    openedAt: null,
  },
];

const statusConfig = {
  delivered: {
    icon: CheckCircle,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    label: 'Delivered'
  },
  pending: {
    icon: Clock,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    label: 'Pending'
  },
  failed: {
    icon: AlertCircle,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    label: 'Failed'
  },
};

export default function EmailPage() {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const formatRecipients = (to: string | string[]) => {
    if (Array.isArray(to)) {
      return `${to.length} recipients`;
    }
    return to;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Email Communications"
        description="Send emails to parents, students, and staff"
        actions={[]}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Email Composer */}
        <EmailComposer />
        
        {/* Email History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Recent Email Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {emailHistory.map((email) => {
                const status = statusConfig[email.status as keyof typeof statusConfig];
                const StatusIcon = status.icon;
                
                return (
                  <div
                    key={email.id}
                    className="flex items-start gap-3 p-3 rounded-lg border bg-card"
                  >
                    <div className={`p-2 rounded-full ${status.bgColor}`}>
                      <StatusIcon className={`h-4 w-4 ${status.color}`} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-medium truncate">
                          {email.subject}
                        </p>
                        <Badge variant="secondary" className="text-xs">
                          {email.template}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>To: {formatRecipients(email.to)}</span>
                        <span>Sent: {formatDate(email.sentAt)}</span>
                        {email.openedAt && (
                          <span>Opened: {formatDate(email.openedAt)}</span>
                        )}
                      </div>
                    </div>
                    
                    <Badge 
                      variant="outline" 
                      className={`${status.color} border-current`}
                    >
                      {status.label}
                    </Badge>
                  </div>
                );
              })}
              
              {emailHistory.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No emails sent yet</p>
                  <p className="text-sm">Start by sending your first email</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Email Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Send className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">1,247</p>
                <p className="text-sm text-muted-foreground">Total Sent</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-2xl font-bold">96%</p>
                <p className="text-sm text-muted-foreground">Delivery Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">78%</p>
                <p className="text-sm text-muted-foreground">Open Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <div>
                <p className="text-2xl font-bold">12</p>
                <p className="text-sm text-muted-foreground">Failed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
