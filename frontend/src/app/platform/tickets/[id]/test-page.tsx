"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Clock, 
  AlertTriangle, 
  MessageSquare, 
  User,
  Calendar,
  Paperclip,
  Building,
  Users,
  FileText,
  Settings,
  Archive,
  Mail,
  Link,
  Info,
  Zap
} from "lucide-react";

interface Comment {
  _id: string;
  authorId: string;
  authorEmail: string;
  authorRole: string;
  content: string;
  isInternal: boolean;
  attachments?: string[];
  createdAt: number;
}

interface Ticket {
  _id: string;
  title: string;
  body: string;
  category: string;
  priority: string;
  status: string;
  tenantName: string;
  createdAt: number;
  slaResolutionDL: number;
  slaFirstResponseDL: number;
  slaBreached?: boolean;
  assignedTo?: string;
  firstResponseAt?: number;
  resolvedAt?: number;
  comments: Comment[];
  attachments?: string[];
}

export default function TestTicketPage() {
  const params = useParams();
  const ticketId = params.id as string;

  // Mock ticket data
  const mockTicket: Ticket = {
    _id: ticketId,
    title: "Unable to access student attendance reports",
    body: "Hello,\n\nI'm having trouble accessing the student attendance reports for the past month. When I try to generate the report, I get an error message saying 'Insufficient permissions' even though I'm the school administrator.\n\nI need this report urgently for our upcoming board meeting scheduled for next week. The attendance data is crucial for our compliance reporting.\n\nI've tried:\n1. Logging out and back in\n2. Clearing browser cache\n3. Using a different browser\n4. Asking other staff members to try (they get the same error)\n\nThis is affecting our ability to track student attendance and could impact our funding requirements.\n\nPlease help resolve this as soon as possible.\n\nThank you,\nSarah Johnson\nSchool Administrator",
    category: "Technical Issue",
    priority: "P1",
    status: "in_progress",
    tenantName: "Nairobi International Academy",
    createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
    slaResolutionDL: Date.now() + 3 * 24 * 60 * 60 * 1000,
    slaFirstResponseDL: Date.now() - 4 * 60 * 60 * 1000,
    slaBreached: true,
    assignedTo: "agent1@edumyles.com",
    firstResponseAt: Date.now() - 5 * 60 * 60 * 1000,
    resolvedAt: undefined,
    attachments: [
      "screenshot_error.png",
      "browser_console.log",
      "permission_settings.pdf"
    ],
    comments: [
      {
        _id: "1",
        authorId: "agent1",
        authorEmail: "michael.chen@edumyles.com",
        authorRole: "Support Agent",
        content: "Hi Sarah,\n\nThank you for reporting this issue. I understand this is urgent for your board meeting.\n\nI've checked your account permissions and can see there might be a configuration issue with your role settings. I'm escalating this to our technical team for immediate resolution.\n\nBest regards,\nMichael Chen",
        isInternal: false,
        attachments: [],
        createdAt: Date.now() - 5 * 60 * 60 * 1000
      }
    ]
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "P0": return "bg-red-100 text-red-700 border-red-200";
      case "P1": return "bg-orange-100 text-orange-700 border-orange-200";
      case "P2": return "bg-blue-100 text-blue-700 border-blue-200";
      case "P3": return "bg-gray-100 text-gray-700 border-gray-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open": return "bg-blue-100 text-blue-700 border-blue-200";
      case "in_progress": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "pending_school": return "bg-purple-100 text-purple-700 border-purple-200";
      case "resolved": return "bg-green-100 text-green-700 border-green-200";
      case "closed": return "bg-gray-100 text-gray-700 border-gray-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const formatTimeRemaining = (deadline: number) => {
    const now = Date.now();
    const timeLeft = deadline - now;
    
    if (timeLeft < 0) {
      return { text: "Overdue", color: "text-red-600" };
    }
    
    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return { text: `${days}d ${hours % 24}h`, color: "text-yellow-600" };
    }
    
    return { text: `${hours}h ${minutes}m`, color: hours < 2 ? "text-red-600" : "text-yellow-600" };
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title={mockTicket.title} 
        description={`Ticket #${ticketId} • ${mockTicket.category}`}
        breadcrumbs={[
          { label: "Tickets", href: "/platform/tickets" },
          { label: mockTicket.title, href: `/platform/tickets/${ticketId}` }
        ]}
      />

      {/* 3-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column - Info Panel (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Info className="h-5 w-5" />
                Ticket Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Status & Priority */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Status</span>
                  <Badge className={getStatusColor(mockTicket.status)}>
                    {mockTicket.status.replace("_", " ")}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Priority</span>
                  <Badge className={getPriorityColor(mockTicket.priority)}>
                    {mockTicket.priority}
                  </Badge>
                </div>
              </div>

              <Separator />

              {/* School Information */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">School</span>
                </div>
                <p className="text-sm text-muted-foreground">{mockTicket.tenantName}</p>
                
                <div className="flex items-center gap-2 mt-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">450 Students</span>
                </div>
              </div>

              <Separator />

              {/* SLA Status */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">SLA Status</span>
                </div>
                
                <div className="space-y-2">
                  <div>
                    <div className="flex items-center justify-between text-xs">
                      <span>First Response</span>
                      <span className={formatTimeRemaining(mockTicket.slaFirstResponseDL).color}>
                        {formatTimeRemaining(mockTicket.slaFirstResponseDL).text}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div className="bg-blue-600 h-1.5 rounded-full w-3/4"></div>
                    </div>
                  </div>
                </div>

                {mockTicket.slaBreached && (
                  <div className="flex items-center gap-2 p-2 bg-red-50 rounded-lg">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <span className="text-sm font-medium text-red-700">SLA Breached</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Middle Column - Thread (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          {/* Ticket Description */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Description
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-wrap">{mockTicket.body}</p>
              
              {mockTicket.attachments && mockTicket.attachments.length > 0 && (
                <div className="mt-4 p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 text-sm font-medium mb-2">
                    <Paperclip className="h-4 w-4" />
                    Attachments ({mockTicket.attachments.length})
                  </div>
                  <div className="space-y-2">
                    {mockTicket.attachments.map((attachment, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          <span className="text-sm">{attachment}</span>
                        </div>
                        <Button variant="ghost" size="sm">
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Comments Thread */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Thread ({mockTicket.comments?.length || 0} comments)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Comments List */}
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {mockTicket.comments?.map((comment, index) => (
                  <div key={comment._id} className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-sm font-bold">
                          {comment.authorEmail.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{comment.authorEmail}</span>
                            <Badge variant="outline" className="text-xs">
                              {comment.authorRole}
                            </Badge>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {new Date(comment.createdAt).toLocaleString()}
                          </span>
                        </div>
                        
                        <div className={`p-3 rounded-lg ${
                          comment.isInternal 
                            ? "bg-amber-50 border border-amber-200" 
                            : "bg-muted"
                        }`}>
                          <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Actions (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full justify-start" variant="outline">
                Create Related Ticket
              </Button>
              <Button className="w-full justify-start" variant="outline">
                View School Details
              </Button>
              <Button className="w-full justify-start" variant="outline">
                Archive Ticket
              </Button>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-1"></div>
                  <div>
                    <p className="text-sm font-medium">Ticket Created</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(mockTicket.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
