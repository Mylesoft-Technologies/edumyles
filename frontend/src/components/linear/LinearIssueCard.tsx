// ============================================================
// EduMyles — Linear Issue Card Component
// ============================================================

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  ExternalLink, 
  Calendar, 
  User, 
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowRight
} from "lucide-react";
import { LinearIssue } from "@/lib/linear";
import { formatDistanceToNow } from "date-fns";

interface LinearIssueCardProps {
  issue: LinearIssue;
  onViewDetails?: (issue: LinearIssue) => void;
  onStatusChange?: (issueId: string, newStatus: string) => void;
  compact?: boolean;
}

const priorityColors = {
  1: "bg-red-100 text-red-800 border-red-200",
  2: "bg-orange-100 text-orange-800 border-orange-200", 
  3: "bg-yellow-100 text-yellow-800 border-yellow-200",
  4: "bg-blue-100 text-blue-800 border-blue-200",
  0: "bg-gray-100 text-gray-800 border-gray-200",
};

const statusIcons = {
  "Todo": Clock,
  "In Progress": ArrowRight,
  "Done": CheckCircle,
  "Blocked": AlertTriangle,
};

const statusColors = {
  "Todo": "bg-gray-100 text-gray-800",
  "In Progress": "bg-blue-100 text-blue-800",
  "Done": "bg-green-100 text-green-800",
  "Blocked": "bg-red-100 text-red-800",
};

export function LinearIssueCard({ 
  issue, 
  onViewDetails, 
  onStatusChange,
  compact = false 
}: LinearIssueCardProps) {
  const StatusIcon = statusIcons[issue.status as keyof typeof statusIcons] || Clock;
  const isOverdue = issue.dueDate && new Date(issue.dueDate) < new Date() && issue.status !== "Done";

  if (compact) {
    return (
      <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <div className="flex-shrink-0">
            <StatusIcon className="h-4 w-4 text-gray-500" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-900 truncate">
                {issue.identifier}
              </span>
              <Badge 
                variant="outline" 
                className={`text-xs ${priorityColors[issue.priority as keyof typeof priorityColors] || priorityColors[0]}`}
              >
                P{issue.priority}
              </Badge>
            </div>
            <p className="text-sm text-gray-600 truncate">{issue.title}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {issue.assignee && (
            <Avatar className="h-6 w-6">
              <AvatarImage src={issue.assignee.avatarUrl} />
              <AvatarFallback className="text-xs">
                {issue.assignee.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
          )}
          {isOverdue && (
            <AlertTriangle className="h-4 w-4 text-red-500" />
          )}
        </div>
      </div>
    );
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-sm font-mono text-gray-500">
                {issue.identifier}
              </span>
              <Badge 
                variant="outline" 
                className={`text-xs ${priorityColors[issue.priority as keyof typeof priorityColors] || priorityColors[0]}`}
              >
                Priority {issue.priority}
              </Badge>
              <Badge 
                variant="secondary" 
                className={`text-xs ${statusColors[issue.status as keyof typeof statusColors] || "bg-gray-100 text-gray-800"}`}
              >
                <StatusIcon className="h-3 w-3 mr-1" />
                {issue.status}
              </Badge>
              {isOverdue && (
                <Badge variant="destructive" className="text-xs">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Overdue
                </Badge>
              )}
            </div>
            <CardTitle className="text-lg leading-tight">{issue.title}</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.open(`https://linear.app/issue/${issue.id}`, '_blank')}
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {issue.description && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {issue.description}
          </p>
        )}
        
        <div className="flex flex-wrap gap-1 mb-4">
          {issue.labels.map((label) => (
            <Badge
              key={label.id}
              variant="outline"
              className="text-xs"
              style={{ borderColor: label.color, color: label.color }}
            >
              {label.name}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            {issue.assignee && (
              <div className="flex items-center space-x-1">
                <User className="h-4 w-4" />
                <Avatar className="h-5 w-5">
                  <AvatarImage src={issue.assignee.avatarUrl} />
                  <AvatarFallback className="text-xs">
                    {issue.assignee.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span className="truncate max-w-20">{issue.assignee.name}</span>
              </div>
            )}
            
            {issue.dueDate && (
              <div className={`flex items-center space-x-1 ${isOverdue ? 'text-red-600' : ''}`}>
                <Calendar className="h-4 w-4" />
                <span>{formatDistanceToNow(new Date(issue.dueDate), { addSuffix: true })}</span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {onStatusChange && (
              <select
                value={issue.status}
                onChange={(e) => onStatusChange(issue.id, e.target.value)}
                className="text-xs border rounded px-2 py-1"
              >
                <option value="Todo">Todo</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
                <option value="Blocked">Blocked</option>
              </select>
            )}
            
            {onViewDetails && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewDetails(issue)}
              >
                View Details
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
