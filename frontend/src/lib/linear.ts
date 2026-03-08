// ============================================================
// EduMyles — Linear API Integration
// ============================================================

import { LinearClient } from "@linear/sdk";

export interface LinearConfig {
  apiKey: string;
  teamId?: string;
  webhookSecret?: string;
}

export interface LinearIssue {
  id: string;
  identifier: string;
  title: string;
  description?: string;
  status: string;
  priority: number;
  assignee?: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
  };
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  labels: Array<{
    id: string;
    name: string;
    color: string;
  }>;
}

export interface LinearProject {
  id: string;
  name: string;
  description?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  url: string;
}

export interface LinearTeam {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

class LinearService {
  private client: LinearClient | null = null;
  private config: LinearConfig | null = null;

  /**
   * Initialize Linear client with API configuration
   */
  initialize(config: LinearConfig): void {
    this.config = config;
    this.client = new LinearClient({
      apiKey: config.apiKey,
    });
  }

  /**
   * Check if Linear is properly configured
   */
  isConfigured(): boolean {
    return !!this.client && !!this.config;
  }

  /**
   * Get all teams accessible to the user
   */
  async getTeams(): Promise<LinearTeam[]> {
    if (!this.client) {
      throw new Error("Linear client not initialized");
    }

    try {
      const teamsData = await this.client.teams();
      return teamsData.nodes.map((team: any) => ({
        id: team.id,
        name: team.name || "Unknown Team",
        description: team.description || undefined,
        createdAt: team.createdAt?.toISOString() || new Date().toISOString(),
        updatedAt: team.updatedAt?.toISOString() || new Date().toISOString(),
      }));
    } catch (error) {
      console.error("Error fetching Linear teams:", error);
      throw new Error("Failed to fetch Linear teams");
    }
  }

  /**
   * Get projects for a specific team
   */
  async getProjects(teamId?: string): Promise<LinearProject[]> {
    if (!this.client) {
      throw new Error("Linear client not initialized");
    }

    try {
      const projectsData = await this.client.projects({
        first: 50,
      });

      return projectsData.nodes.map((project: any) => ({
        id: project.id,
        name: project.name || "Unknown Project",
        description: project.description || undefined,
        status: typeof project.status === 'string' ? project.status : 'unknown',
        createdAt: project.createdAt?.toISOString() || new Date().toISOString(),
        updatedAt: project.updatedAt?.toISOString() || new Date().toISOString(),
        url: project.url || "",
      }));
    } catch (error) {
      console.error("Error fetching Linear projects:", error);
      throw new Error("Failed to fetch Linear projects");
    }
  }

  /**
   * Get issues with optional filtering
   */
  async getIssues(options: {
    teamId?: string;
    projectId?: string;
    status?: string;
    assigneeId?: string;
    first?: number;
  } = {}): Promise<LinearIssue[]> {
    if (!this.client) {
      throw new Error("Linear client not initialized");
    }

    try {
      const issuesData = await this.client.issues({
        first: options.first || 50,
      });

      return issuesData.nodes.map((issue: any) => ({
        id: issue.id,
        identifier: issue.identifier || "",
        title: issue.title || "Untitled Issue",
        description: issue.description || undefined,
        status: issue.state?.name || "Unknown",
        priority: issue.priority || 0,
        assignee: issue.assignee ? {
          id: issue.assignee.id,
          name: issue.assignee.name || "Unknown User",
          email: issue.assignee.email || "",
          avatarUrl: issue.assignee.avatarUrl || undefined,
        } : undefined,
        createdAt: issue.createdAt?.toISOString() || new Date().toISOString(),
        updatedAt: issue.updatedAt?.toISOString() || new Date().toISOString(),
        dueDate: issue.dueDate?.toISOString() || undefined,
        labels: (issue.labels?.nodes || []).map((label: any) => ({
          id: label.id,
          name: label.name || "Unknown Label",
          color: label.color || "#000000",
        })),
      }));
    } catch (error) {
      console.error("Error fetching Linear issues:", error);
      throw new Error("Failed to fetch Linear issues");
    }
  }

  /**
   * Create a new issue
   */
  async createIssue(data: {
    title: string;
    description?: string;
    teamId: string;
    projectId?: string;
    assigneeId?: string;
    priority?: number;
    dueDate?: string;
    labelIds?: string[];
  }): Promise<LinearIssue> {
    if (!this.client) {
      throw new Error("Linear client not initialized");
    }

    try {
      const issueData = await this.client.createIssue({
        title: data.title,
        description: data.description,
        teamId: data.teamId,
        projectId: data.projectId,
        assigneeId: data.assigneeId,
        priority: data.priority,
        dueDate: data.dueDate,
        labelIds: data.labelIds,
      });

      const issue = issueData.issue as any;
      return {
        id: issue?.id || "",
        identifier: issue?.identifier || "",
        title: issue?.title || "",
        description: issue?.description || undefined,
        status: issue?.state?.name || "Unknown",
        priority: issue?.priority || 0,
        assignee: issue?.assignee ? {
          id: issue.assignee.id,
          name: issue.assignee.name || "Unknown User",
          email: issue.assignee.email || "",
          avatarUrl: issue.assignee.avatarUrl || undefined,
        } : undefined,
        createdAt: issue?.createdAt?.toISOString() || new Date().toISOString(),
        updatedAt: issue?.updatedAt?.toISOString() || new Date().toISOString(),
        dueDate: issue?.dueDate?.toISOString() || undefined,
        labels: (issue?.labels?.nodes || []).map((label: any) => ({
          id: label.id,
          name: label.name || "Unknown Label",
          color: label.color || "#000000",
        })),
      };
    } catch (error) {
      console.error("Error creating Linear issue:", error);
      throw new Error("Failed to create Linear issue");
    }
  }

  /**
   * Update an existing issue
   */
  async updateIssue(issueId: string, data: {
    title?: string;
    description?: string;
    stateId?: string;
    assigneeId?: string;
    priority?: number;
    dueDate?: string;
  }): Promise<LinearIssue> {
    if (!this.client) {
      throw new Error("Linear client not initialized");
    }

    try {
      const issueData = await this.client.updateIssue(issueId, data);
      const issue = issueData.issue as any;

      if (!issue) {
        throw new Error("Issue not found");
      }

      return {
        id: issue.id,
        identifier: issue.identifier || "",
        title: issue.title || "",
        description: issue.description || undefined,
        status: issue.state?.name || "Unknown",
        priority: issue.priority || 0,
        assignee: issue.assignee ? {
          id: issue.assignee.id,
          name: issue.assignee.name || "Unknown User",
          email: issue.assignee.email || "",
          avatarUrl: issue.assignee.avatarUrl || undefined,
        } : undefined,
        createdAt: issue.createdAt?.toISOString() || new Date().toISOString(),
        updatedAt: issue.updatedAt?.toISOString() || new Date().toISOString(),
        dueDate: issue.dueDate?.toISOString() || undefined,
        labels: (issue.labels?.nodes || []).map((label: any) => ({
          id: label.id,
          name: label.name || "Unknown Label",
          color: label.color || "#000000",
        })),
      };
    } catch (error) {
      console.error("Error updating Linear issue:", error);
      throw new Error("Failed to update Linear issue");
    }
  }

  /**
   * Get issue statistics for dashboard
   */
  async getIssueStats(teamId?: string): Promise<{
    total: number;
    open: number;
    inProgress: number;
    completed: number;
    overdue: number;
  }> {
    if (!this.client) {
      throw new Error("Linear client not initialized");
    }

    try {
      const [totalIssues, openIssues, inProgressIssues, completedIssues] = await Promise.all([
        this.getIssues({ teamId, first: 1000 }),
        this.getIssues({ teamId, status: "Todo", first: 1000 }),
        this.getIssues({ teamId, status: "In Progress", first: 1000 }),
        this.getIssues({ teamId, status: "Done", first: 1000 }),
      ]);

      const now = new Date();
      const overdue = totalIssues.filter(issue => 
        issue.dueDate && new Date(issue.dueDate) < now && issue.status !== "Done"
      ).length;

      return {
        total: totalIssues.length,
        open: openIssues.length,
        inProgress: inProgressIssues.length,
        completed: completedIssues.length,
        overdue,
      };
    } catch (error) {
      console.error("Error fetching Linear issue stats:", error);
      throw new Error("Failed to fetch Linear issue stats");
    }
  }
}

// Export singleton instance
export const linearService = new LinearService();

// Helper function to initialize Linear from environment variables
export function initializeLinearFromEnv(): void {
  const apiKey = process.env.NEXT_PUBLIC_LINEAR_API_KEY;
  const teamId = process.env.NEXT_PUBLIC_LINEAR_TEAM_ID;
  const webhookSecret = process.env.LINEAR_WEBHOOK_SECRET;

  if (!apiKey) {
    console.warn("Linear API key not found in environment variables");
    return;
  }

  linearService.initialize({
    apiKey,
    teamId,
    webhookSecret,
  });
}
