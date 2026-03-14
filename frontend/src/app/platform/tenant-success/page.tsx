"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  TrendingUp,
  TrendingDown,
  Users,
  Target,
  Award,
  AlertTriangle,
  CheckCircle,
  Clock,
  Calendar,
  BarChart3,
  Activity,
  Zap,
  Star,
  Plus,
  Search,
  Filter,
  Download,
  RefreshCw,
  Settings,
  Eye,
  Edit,
  Trash2,
  Play,
  Pause,
  Square,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Heart,
  Shield,
  Brain,
  DollarSign,
  Headphones,
  Wrench,
  GraduationCap,
  Rocket,
  Flag,
  Timer,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { usePlatformQuery } from "@/hooks/usePlatformQuery";
import { api } from "@/convex/_generated/api";

interface TenantHealthScore {
  _id: string;
  tenantId: string;
  tenantName: string;
  category: string;
  score: number;
  grade: "A" | "B" | "C" | "D" | "F";
  metrics: Record<string, number>;
  factors: Array<{
    name: string;
    weight: number;
    value: number;
    impact: string;
  }>;
  recommendations: string[];
  trends: Array<{
    date: string;
    score: number;
  }>;
  calculatedAt: number;
  calculatedBy: string;
  previousScore: number;
  scoreChange: number;
}

interface SuccessInitiative {
  _id: string;
  tenantId: string;
  tenantName: string;
  title: string;
  description: string;
  category: string;
  priority: "high" | "medium" | "low";
  targetScore: number;
  currentScore: number;
  progress: number;
  actions: Array<{
    id: string;
    title: string;
    description: string;
    assignee: string;
    dueDate: number;
    status: "pending" | "in_progress" | "completed";
    completedAt?: number;
  }>;
  milestones: Array<{
    id: string;
    title: string;
    description: string;
    targetDate: number;
    completed: boolean;
    completedAt?: number;
  }>;
  createdBy: string;
  assignedTo: string;
  startDate: number;
  targetDate: number;
  status: "planned" | "active" | "completed" | "cancelled";
  createdAt: number;
  updatedAt: number;
}

interface SuccessMetric {
  _id: string;
  tenantId: string;
  tenantName: string;
  name: string;
  description: string;
  category: string;
  unit: string;
  targetValue: number;
  currentValue: number;
  baselineValue: number;
  calculationMethod: string;
  frequency: string;
  isActive: boolean;
  trend: string;
  lastUpdated: number;
  history: Array<{
    date: string;
    value: number;
  }>;
  createdBy: string;
  createdAt: number;
  updatedAt: number;
}

export default function TenantSuccessPage() {
  const { sessionToken } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedTenant, setSelectedTenant] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isCreateInitiativeOpen, setIsCreateInitiativeOpen] = useState(false);
  const [isCreateMetricOpen, setIsCreateMetricOpen] = useState(false);

  // Mock data - replace with actual queries
  const tenantSuccessOverview = {
    overview: {
      totalTenants: 156,
      activeTenants: 142,
      averageHealthScore: 83.7,
      gradeDistribution: {
        A: 45,
        B: 67,
        C: 28,
        D: 12,
        F: 4,
      },
      totalInitiatives: 89,
      activeInitiatives: 34,
      completedInitiatives: 45,
      averageInitiativeProgress: 72.4,
    },
    trends: {
      healthScores: [
        { date: "2024-01-01", score: 81.2 },
        { date: "2024-02-01", score: 82.5 },
        { date: "2024-03-01", score: 83.1 },
        { date: "2024-04-01", score: 83.7 },
      ],
      initiativeCompletions: [
        { date: "2024-01-01", completed: 8 },
        { date: "2024-02-01", completed: 12 },
        { date: "2024-03-01", completed: 15 },
        { date: "2024-04-01", completed: 10 },
      ],
      engagementMetrics: [
        { date: "2024-01-01", adoption: 78.5, engagement: 71.2 },
        { date: "2024-02-01", adoption: 81.3, engagement: 74.8 },
        { date: "2024-03-01", adoption: 84.1, engagement: 78.5 },
        { date: "2024-04-01", adoption: 86.7, engagement: 81.9 },
      ],
    },
    topPerformers: {
      tenants: [
        {
          tenantId: "tenant_2",
          tenantName: "Mombasa International School",
          healthScore: 91.8,
          grade: "A",
          initiativesCompleted: 8,
          trend: "improving",
        },
        {
          tenantId: "tenant_5",
          tenantName: "Eldoret Academy",
          healthScore: 89.4,
          grade: "B",
          initiativesCompleted: 6,
          trend: "stable",
        },
        {
          tenantId: "tenant_8",
          tenantName: "Nakuru High School",
          healthScore: 87.9,
          grade: "B",
          initiativesCompleted: 7,
          trend: "improving",
        },
      ],
      initiatives: [
        {
          initiativeId: "initiative_3",
          title: "Support Optimization Initiative",
          tenantName: "Mombasa International School",
          progress: 94.2,
          impact: "Reduced support tickets by 30%",
          category: "support",
        },
        {
          initiativeId: "initiative_7",
          title: "User Training Program",
          tenantName: "Eldoret Academy",
          progress: 88.5,
          impact: "Increased feature adoption by 25%",
          category: "training",
        },
        {
          initiativeId: "initiative_12",
          title: "Engagement Campaign",
          tenantName: "Nakuru High School",
          progress: 82.1,
          impact: "Daily active users increased by 40%",
          category: "engagement",
        },
      ],
    },
    atRiskTenants: [
      {
        tenantId: "tenant_3",
        tenantName: "Kisumu High School",
        healthScore: 76.2,
        grade: "C",
        riskFactors: ["Low engagement", "High support volume", "Payment delays"],
        recommendedActions: ["Training program", "Support optimization", "Financial review"],
      },
      {
        tenantId: "tenant_11",
        tenantName: "Thika Girls School",
        healthScore: 71.8,
        grade: "C",
        riskFactors: ["Declining adoption", "Technical issues", "Low satisfaction"],
        recommendedActions: ["Technical audit", "User training", "Feature optimization"],
      },
    ],
    categoryBreakdown: [
      {
        category: "adoption",
        averageScore: 85.3,
        trend: "improving",
        keyDrivers: ["Training programs", "Feature improvements", "User support"],
      },
      {
        category: "engagement",
        averageScore: 79.8,
        trend: "stable",
        keyDrivers: ["Gamification", "Content relevance", "User experience"],
      },
      {
        category: "support",
        averageScore: 81.4,
        trend: "improving",
        keyDrivers: ["Self-service resources", "Chatbot support", "Documentation"],
      },
      {
        category: "technical",
        averageScore: 88.7,
        trend: "stable",
        keyDrivers: ["System stability", "Performance optimization", "Uptime"],
      },
      {
        category: "financial",
        averageScore: 84.2,
        trend: "stable",
        keyDrivers: ["Payment processing", "Billing clarity", "Cost optimization"],
      },
    ],
  };

  const tenantHealthScores: TenantHealthScore[] = [
    {
      _id: "health_1",
      tenantId: "tenant_1",
      tenantName: "Nairobi Academy",
      category: "overall",
      score: 87.5,
      grade: "B",
      metrics: {
        adoption: 92.3,
        engagement: 85.7,
        support: 78.9,
        technical: 91.2,
        financial: 88.4,
      },
      factors: [
        {
          name: "User Adoption Rate",
          weight: 0.25,
          value: 92.3,
          impact: "High adoption of core features indicates successful onboarding",
        },
        {
          name: "Daily Active Users",
          weight: 0.20,
          value: 85.7,
          impact: "Good engagement levels with consistent daily usage",
        },
        {
          name: "Support Ticket Volume",
          weight: 0.15,
          value: 78.9,
          impact: "Moderate support needs indicate room for improvement",
        },
        {
          name: "System Performance",
          weight: 0.20,
          value: 91.2,
          impact: "Excellent technical performance with minimal downtime",
        },
        {
          name: "Payment Timeliness",
          weight: 0.20,
          value: 88.4,
          impact: "Good financial health with timely payments",
        },
      ],
      recommendations: [
        "Implement proactive user training to increase engagement",
        "Create self-service help resources to reduce support volume",
        "Develop advanced feature adoption campaigns",
        "Schedule regular system health check-ins",
      ],
      trends: [
        { date: "2024-01-01", score: 82.3 },
        { date: "2024-02-01", score: 84.1 },
        { date: "2024-03-01", score: 86.7 },
        { date: "2024-04-01", score: 87.5 },
      ],
      calculatedAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
      calculatedBy: "success_manager@edumyles.com",
      previousScore: 86.7,
      scoreChange: 0.8,
    },
    {
      _id: "health_2",
      tenantId: "tenant_2",
      tenantName: "Mombasa International School",
      category: "overall",
      score: 91.8,
      grade: "A",
      metrics: {
        adoption: 95.7,
        engagement: 93.2,
        support: 89.5,
        technical: 94.1,
        financial: 92.8,
      },
      factors: [
        {
          name: "User Adoption Rate",
          weight: 0.25,
          value: 95.7,
          impact: "Exceptional adoption across all user groups",
        },
        {
          name: "Daily Active Users",
          weight: 0.20,
          value: 93.2,
          impact: "Outstanding engagement with high daily usage",
        },
        {
          name: "Support Ticket Volume",
          weight: 0.15,
          value: 89.5,
          impact: "Low support needs indicate high user satisfaction",
        },
        {
          name: "System Performance",
          weight: 0.20,
          value: 94.1,
          impact: "Superior technical performance with excellent uptime",
        },
        {
          name: "Payment Timeliness",
          weight: 0.20,
          value: 92.8,
          impact: "Excellent financial health with consistent payments",
        },
      ],
      recommendations: [
        "Maintain current success strategies",
        "Share best practices with other tenants",
        "Consider advanced feature adoption",
        "Explore expansion opportunities",
      ],
      trends: [
        { date: "2024-01-01", score: 88.2 },
        { date: "2024-02-01", score: 89.7 },
        { date: "2024-03-01", score: 90.5 },
        { date: "2024-04-01", score: 91.8 },
      ],
      calculatedAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
      calculatedBy: "success_manager@edumyles.com",
      previousScore: 90.5,
      scoreChange: 1.3,
    },
  ];

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "A": return "bg-green-100 text-green-700 border-green-200";
      case "B": return "bg-blue-100 text-blue-700 border-blue-200";
      case "C": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "D": return "bg-orange-100 text-orange-700 border-orange-200";
      case "F": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-blue-600";
    if (score >= 70) return "text-yellow-600";
    if (score >= 60) return "text-orange-600";
    return "text-red-600";
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "improving": return <ArrowUpRight className="h-4 w-4 text-green-600" />;
      case "declining": return <ArrowDownRight className="h-4 w-4 text-red-600" />;
      case "stable": return <Minus className="h-4 w-4 text-gray-600" />;
      default: return <Minus className="h-4 w-4 text-gray-600" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "adoption": return <Users className="h-4 w-4" />;
      case "engagement": return <Heart className="h-4 w-4" />;
      case "support": return <Headphones className="h-4 w-4" />;
      case "technical": return <Wrench className="h-4 w-4" />;
      case "financial": return <DollarSign className="h-4 w-4" />;
      case "onboarding": return <GraduationCap className="h-4 w-4" />;
      case "training": return <Brain className="h-4 w-4" />;
      case "optimization": return <Zap className="h-4 w-4" />;
      case "retention": return <Shield className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const formatRelativeTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return "Just now";
  };

  const OverviewTab = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tenants</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tenantSuccessOverview.overview.totalTenants}</div>
            <p className="text-xs text-muted-foreground">{tenantSuccessOverview.overview.activeTenants} active</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Health Score</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{tenantSuccessOverview.overview.averageHealthScore}</div>
            <p className="text-xs text-muted-foreground">+2.5 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Initiatives</CardTitle>
            <Rocket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tenantSuccessOverview.overview.activeInitiatives}</div>
            <p className="text-xs text-muted-foreground">{tenantSuccessOverview.overview.completedInitiatives} completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Progress</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tenantSuccessOverview.overview.averageInitiativeProgress}%</div>
            <p className="text-xs text-muted-foreground">Across all initiatives</p>
          </CardContent>
        </Card>
      </div>

      {/* Grade Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Grade Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(tenantSuccessOverview.overview.gradeDistribution).map(([grade, count]) => (
              <div key={grade} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge className={getGradeColor(grade)}>{grade}</Badge>
                  <span className="text-sm text-muted-foreground">{count} tenants</span>
                </div>
                <Progress 
                  value={(count / tenantSuccessOverview.overview.totalTenants) * 100} 
                  className="w-32"
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Performers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {tenantSuccessOverview.topPerformers.tenants.map((tenant) => (
              <div key={tenant.tenantId} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    {getTrendIcon(tenant.trend)}
                    <div>
                      <div className="font-medium">{tenant.tenantName}</div>
                      <div className="text-sm text-muted-foreground">{tenant.healthScore} points</div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getGradeColor(tenant.grade)}>{tenant.grade}</Badge>
                  <span className="text-sm text-muted-foreground">{tenant.initiativesCompleted} initiatives</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* At Risk Tenants */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            <span>At Risk Tenants</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tenantSuccessOverview.atRiskTenants.map((tenant) => (
              <div key={tenant.tenantId} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-semibold">{tenant.tenantName}</h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`text-lg font-bold ${getScoreColor(tenant.healthScore)}`}>
                        {tenant.healthScore}
                      </span>
                      <Badge className={getGradeColor(tenant.grade)}>{tenant.grade}</Badge>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    View Details
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium mb-2">Risk Factors</div>
                    <div className="space-y-1">
                      {tenant.riskFactors.map((factor, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <AlertTriangle className="h-3 w-3 text-orange-500" />
                          <span className="text-sm text-muted-foreground">{factor}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium mb-2">Recommended Actions</div>
                    <div className="space-y-1">
                      {tenant.recommendedActions.map((action, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Target className="h-3 w-3 text-blue-500" />
                          <span className="text-sm text-muted-foreground">{action}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const HealthScoresTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tenants..."
              className="pl-10 w-80"
            />
          </div>
          <Select value={selectedGrade} onValueChange={setSelectedGrade}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Grade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Grades</SelectItem>
              <SelectItem value="A">A</SelectItem>
              <SelectItem value="B">B</SelectItem>
              <SelectItem value="C">C</SelectItem>
              <SelectItem value="D">D</SelectItem>
              <SelectItem value="F">F</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="adoption">Adoption</SelectItem>
              <SelectItem value="engagement">Engagement</SelectItem>
              <SelectItem value="support">Support</SelectItem>
              <SelectItem value="technical">Technical</SelectItem>
              <SelectItem value="financial">Financial</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Health Scores List */}
      <div className="space-y-4">
        {tenantHealthScores.map((healthScore) => (
          <Card key={healthScore._id}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-4">
                  <div className="flex items-center space-x-2">
                    <Badge className={getGradeColor(healthScore.grade)}>
                      {healthScore.grade} Grade
                    </Badge>
                    <div className="flex items-center space-x-1">
                      <span className={`text-2xl font-bold ${getScoreColor(healthScore.score)}`}>
                        {healthScore.score}
                      </span>
                      <span className="text-sm text-muted-foreground">points</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      {healthScore.scoreChange > 0 ? (
                        <ArrowUpRight className="h-4 w-4 text-green-600" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 text-red-600" />
                      )}
                      <span className="text-sm text-muted-foreground">
                        {Math.abs(healthScore.scoreChange)} from previous
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg">{healthScore.tenantName}</h3>
                    <p className="text-muted-foreground">Calculated {formatRelativeTime(healthScore.calculatedAt)} by {healthScore.calculatedBy}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {Object.entries(healthScore.metrics).map(([metric, value]) => (
                      <div key={metric} className="text-center">
                        <div className={`text-lg font-semibold ${getScoreColor(value)}`}>
                          {value}
                        </div>
                        <div className="text-xs text-muted-foreground capitalize">{metric}</div>
                      </div>
                    ))}
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium mb-2">Key Factors</div>
                    <div className="space-y-2">
                      {healthScore.factors.slice(0, 3).map((factor) => (
                        <div key={factor.name} className="flex items-center justify-between text-sm">
                          <span>{factor.name}</span>
                          <div className="flex items-center space-x-2">
                            <span className={getScoreColor(factor.value)}>{factor.value}</span>
                            <span className="text-muted-foreground">({(factor.weight * 100).toFixed(0)}%)</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium mb-2">Recommendations</div>
                    <div className="space-y-1">
                      {healthScore.recommendations.slice(0, 3).map((rec, index) => (
                        <div key={index} className="flex items-center space-x-2 text-sm">
                          <Target className="h-3 w-3 text-blue-500" />
                          <span className="text-muted-foreground">{rec}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    View Details
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const InitiativesTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search initiatives..."
              className="pl-10 w-80"
            />
          </div>
          <Select>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="planned">Planned</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="onboarding">Onboarding</SelectItem>
              <SelectItem value="training">Training</SelectItem>
              <SelectItem value="optimization">Optimization</SelectItem>
              <SelectItem value="support">Support</SelectItem>
              <SelectItem value="engagement">Engagement</SelectItem>
              <SelectItem value="retention">Retention</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Dialog open={isCreateInitiativeOpen} onOpenChange={setIsCreateInitiativeOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Initiative
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Success Initiative</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="initiative-title">Initiative Title</Label>
                  <Input id="initiative-title" placeholder="Enter initiative title" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="initiative-description">Description</Label>
                  <Textarea id="initiative-description" placeholder="Describe the initiative" rows={3} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Category</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="onboarding">Onboarding</SelectItem>
                        <SelectItem value="training">Training</SelectItem>
                        <SelectItem value="optimization">Optimization</SelectItem>
                        <SelectItem value="support">Support</SelectItem>
                        <SelectItem value="engagement">Engagement</SelectItem>
                        <SelectItem value="retention">Retention</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Priority</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Target Score</Label>
                    <Input type="number" placeholder="Enter target score" />
                  </div>
                  <div className="grid gap-2">
                    <Label>Assigned To</Label>
                    <Input placeholder="Enter assignee email" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Start Date</Label>
                    <Input type="date" />
                  </div>
                  <div className="grid gap-2">
                    <Label>Target Date</Label>
                    <Input type="date" />
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreateInitiativeOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsCreateInitiativeOpen(false)}>
                  Create Initiative
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Top Initiatives */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Initiatives</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tenantSuccessOverview.topPerformers.initiatives.map((initiative) => (
              <div key={initiative.initiativeId} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-semibold">{initiative.title}</h4>
                    <Badge variant="outline">{initiative.category}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{initiative.tenantName}</p>
                  <p className="text-sm text-muted-foreground">{initiative.impact}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-lg font-semibold">{initiative.progress}%</div>
                    <div className="text-sm text-muted-foreground">Progress</div>
                  </div>
                  <Progress value={initiative.progress} className="w-24" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Tenant Success Platform" 
        description="Comprehensive tenant health scoring and success management platform"
        breadcrumbs={[
          { label: "Platform", href: "/platform" },
          { label: "Tenant Success", href: "/platform/tenant-success" }
        ]}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="health-scores">Health Scores</TabsTrigger>
          <TabsTrigger value="initiatives">Initiatives</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <OverviewTab />
        </TabsContent>
        
        <TabsContent value="health-scores">
          <HealthScoresTab />
        </TabsContent>
        
        <TabsContent value="initiatives">
          <InitiativesTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
