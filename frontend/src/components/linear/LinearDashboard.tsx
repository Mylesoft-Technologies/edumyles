// ============================================================
// EduMyles — Linear Dashboard Component
// ============================================================

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Plus, 
  ExternalLink, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Users,
  FolderOpen,
  RefreshCw
} from "lucide-react";
import { LinearIssueCard } from "./LinearIssueCard";
import { linearService, LinearIssue, LinearProject, LinearTeam } from "@/lib/linear";

interface LinearDashboardProps {
  onCreateIssue?: () => void;
  onViewIssue?: (issue: LinearIssue) => void;
}

export function LinearDashboard({ onCreateIssue, onViewIssue }: LinearDashboardProps) {
  const [issues, setIssues] = useState<LinearIssue[]>([]);
  const [projects, setProjects] = useState<LinearProject[]>([]);
  const [teams, setTeams] = useState<LinearTeam[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<string>("");
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    inProgress: 0,
    completed: 0,
    overdue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    if (!linearService.isConfigured()) {
      setError("Linear is not configured. Please add your API key.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const [issuesData, projectsData, teamsData, statsData] = await Promise.all([
        linearService.getIssues({ 
          teamId: selectedTeam || undefined,
          projectId: selectedProject || undefined,
          first: 20 
        }),
        linearService.getProjects(selectedTeam || undefined),
        linearService.getTeams(),
        linearService.getIssueStats(selectedTeam || undefined),
      ]);

      setIssues(issuesData);
      setProjects(projectsData);
      setTeams(teamsData);
      setStats(statsData);
    } catch (err) {
      console.error("Error loading Linear data:", err);
      setError(err instanceof Error ? err.message : "Failed to load Linear data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedTeam, selectedProject]);

  const handleStatusChange = async (issueId: string, newStatus: string) => {
    try {
      // Map status names to Linear state IDs (you'll need to fetch these from your Linear workspace)
      const statusMap: Record<string, string> = {
        "Todo": "todo-state-id",
        "In Progress": "progress-state-id",
        "Done": "done-state-id",
        "Blocked": "blocked-state-id",
      };

      await linearService.updateIssue(issueId, {
        stateId: statusMap[newStatus],
      });

      // Refresh the issues list
      loadData();
    } catch (err) {
      console.error("Error updating issue status:", err);
      setError(err instanceof Error ? err.message : "Failed to update issue status");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Linear Integration Error</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={loadData}>Retry</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Linear Integration</h2>
          <p className="text-gray-600">Manage your Linear issues and projects</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={loadData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={onCreateIssue}>
            <Plus className="h-4 w-4 mr-2" />
            Create Issue
          </Button>
          <Button
            variant="outline"
            onClick={() => window.open("https://linear.app", "_blank")}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Open Linear
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-gray-600">Total Issues</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-8 w-8 text-gray-500" />
              <div>
                <p className="text-2xl font-bold">{stats.open}</p>
                <p className="text-sm text-gray-600">Open</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <RefreshCw className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{stats.inProgress}</p>
                <p className="text-sm text-gray-600">In Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{stats.completed}</p>
                <p className="text-sm text-gray-600">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-8 w-8 text-red-500" />
              <div>
                <p className="text-2xl font-bold">{stats.overdue}</p>
                <p className="text-sm text-gray-600">Overdue</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Users className="h-4 w-4 text-gray-500" />
          <Select value={selectedTeam} onValueChange={setSelectedTeam}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select Team" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Teams</SelectItem>
              {teams.map((team) => (
                <SelectItem key={team.id} value={team.id}>
                  {team.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <FolderOpen className="h-4 w-4 text-gray-500" />
          <Select value={selectedProject} onValueChange={setSelectedProject}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select Project" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Projects</SelectItem>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Issues List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Issues</CardTitle>
        </CardHeader>
        <CardContent>
          {issues.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No issues found</p>
              <Button onClick={onCreateIssue} className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Issue
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {issues.map((issue) => (
                <LinearIssueCard
                  key={issue.id}
                  issue={issue}
                  onViewDetails={onViewIssue}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
