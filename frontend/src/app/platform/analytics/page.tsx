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
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Building2,
  AlertTriangle,
  CheckCircle,
  Target,
  Brain,
  FileText,
  Download,
  Calendar,
  Filter,
  Plus,
  Settings,
  Eye,
  Mail,
  Smartphone,
  Clock,
  Zap,
  Activity,
  PieChart,
  LineChart,
  Globe,
  MapPin,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { usePlatformQuery } from "@/hooks/usePlatformQuery";
import { api } from "@/convex/_generated/api";

interface BusinessIntelligence {
  overview: {
    totalRevenue: number;
    revenueGrowth: number;
    activeTenants: number;
    newTenants: number;
    churnRate: number;
    customerLifetimeValue: number;
    averageRevenuePerUser: number;
    netPromoterScore: number;
  };
  revenueAnalytics: {
    monthlyRecurringRevenue: number;
    annualRecurringRevenue: number;
    revenueByPlan: Array<{
      plan: string;
      revenue: number;
      tenants: number;
      growth: number;
    }>;
    revenueByRegion: Array<{
      region: string;
      revenue: number;
      tenants: number;
    }>;
    revenueTrends: Array<{
      month: string;
      revenue: number;
      growth: number;
    }>;
  };
  tenantAnalytics: {
    cohortAnalysis: Array<{
      cohort: string;
      size: number;
      retention1Month: number;
      retention3Month: number;
      retention6Month: number | null;
    }>;
    tenantLifecycle: Array<{
      stage: string;
      count: number;
      conversionRate?: number;
      avgLifetime?: number;
      churnRisk?: number;
      recoveryRate?: number;
    }>;
    healthScores: Array<{
      tenantId: string;
      name: string;
      score: number;
      trend: string;
    }>;
  };
  usageAnalytics: {
    featureAdoption: Array<{
      feature: string;
      adoption: number;
      growth: number;
    }>;
    userEngagement: {
      dailyActiveUsers: number;
      monthlyActiveUsers: number;
      averageSessionDuration: number;
      pagesPerSession: number;
      bounceRate: number;
    };
    moduleUsage: Array<{
      module: string;
      usage: number;
      growth: number;
    }>;
  };
}

export default function AdvancedAnalyticsPage() {
  const { sessionToken } = useAuth();
  const [timeRange, setTimeRange] = useState("30d");
  const [selectedReport, setSelectedReport] = useState("");
  const [isCreateReportOpen, setIsCreateReportOpen] = useState(false);

  // Mock data - replace with actual queries
  const businessIntelligence: BusinessIntelligence = {
    overview: {
      totalRevenue: 2456780,
      revenueGrowth: 15.6,
      activeTenants: 124,
      newTenants: 8,
      churnRate: 2.1,
      customerLifetimeValue: 12450,
      averageRevenuePerUser: 198,
      netPromoterScore: 72,
    },
    revenueAnalytics: {
      monthlyRecurringRevenue: 245678,
      annualRecurringRevenue: 2948136,
      revenueByPlan: [
        { plan: "starter", revenue: 45678, tenants: 45, growth: 12.3 },
        { plan: "growth", revenue: 123456, tenants: 56, growth: 18.7 },
        { plan: "enterprise", revenue: 76544, tenants: 23, growth: 22.1 },
      ],
      revenueByRegion: [
        { region: "Nairobi", revenue: 98765, tenants: 48 },
        { region: "Mombasa", revenue: 65432, tenants: 32 },
        { region: "Kisumu", revenue: 43210, tenants: 21 },
        { region: "Nakuru", revenue: 38471, tenants: 23 },
      ],
      revenueTrends: [
        { month: "Jan", revenue: 198765, growth: 0 },
        { month: "Feb", revenue: 212345, growth: 6.8 },
        { month: "Mar", revenue: 234567, growth: 10.5 },
        { month: "Apr", revenue: 245678, growth: 4.7 },
      ],
    },
    tenantAnalytics: {
      cohortAnalysis: [
        { cohort: "2024-01", size: 12, retention1Month: 91.7, retention3Month: 83.3, retention6Month: 75.0 },
        { cohort: "2024-02", size: 15, retention1Month: 93.3, retention3Month: 86.7, retention6Month: null },
        { cohort: "2024-03", size: 18, retention1Month: 94.4, retention3Month: 88.9, retention6Month: null },
      ],
      tenantLifecycle: [
        { stage: "trial", count: 8, conversionRate: 75.0 },
        { stage: "active", count: 124, avgLifetime: 18.5 },
        { stage: "at_risk", count: 6, churnRisk: 45.2 },
        { stage: "churned", count: 3, recoveryRate: 12.5 },
      ],
      healthScores: [
        { tenantId: "tenant_1", name: "St. John's Academy", score: 92, trend: "improving" },
        { tenantId: "tenant_2", name: "Elite High School", score: 78, trend: "stable" },
        { tenantId: "tenant_3", name: "Sunshine Primary", score: 65, trend: "declining" },
      ],
    },
    usageAnalytics: {
      featureAdoption: [
        { feature: "academics", adoption: 98.5, growth: 2.1 },
        { feature: "communications", adoption: 87.3, growth: 8.7 },
        { feature: "billing", adoption: 92.1, growth: 1.5 },
        { feature: "hr", adoption: 67.8, growth: 12.3 },
        { feature: "library", adoption: 45.2, growth: 15.6 },
      ],
      userEngagement: {
        dailyActiveUsers: 8456,
        monthlyActiveUsers: 12450,
        averageSessionDuration: 23.5,
        pagesPerSession: 8.7,
        bounceRate: 23.4,
      },
      moduleUsage: [
        { module: "Student Management", usage: 12450, growth: 5.6 },
        { module: "Gradebook", usage: 11234, growth: 8.9 },
        { module: "Attendance", usage: 10987, growth: 3.2 },
        { module: "Timetable", usage: 9876, growth: 12.1 },
      ],
    },
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const getTrendIcon = (trend: number) => {
    return trend > 0 ? (
      <TrendingUp className="h-4 w-4 text-green-600" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-600" />
    );
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-100";
    if (score >= 60) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const BusinessIntelligenceTab = () => (
    <div className="space-y-6">
      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(businessIntelligence.overview.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              {getTrendIcon(businessIntelligence.overview.revenueGrowth)}
              <span className="ml-1">+{businessIntelligence.overview.revenueGrowth}% from last period</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tenants</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{businessIntelligence.overview.activeTenants}</div>
            <p className="text-xs text-muted-foreground">
              +{businessIntelligence.overview.newTenants} new this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Churn Rate</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{businessIntelligence.overview.churnRate}%</div>
            <p className="text-xs text-muted-foreground">
              Below industry average
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">NPS Score</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{businessIntelligence.overview.netPromoterScore}</div>
            <p className="text-xs text-muted-foreground">
              Good customer satisfaction
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Plan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {businessIntelligence.revenueAnalytics.revenueByPlan.map((plan) => (
              <div key={plan.plan} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="capitalize font-medium">{plan.plan}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">{plan.tenants} tenants</span>
                    <div className="flex items-center space-x-1">
                      {getTrendIcon(plan.growth)}
                      <span className="text-sm">{plan.growth}%</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Revenue</span>
                    <span className="font-medium">{formatCurrency(plan.revenue)}</span>
                  </div>
                  <Progress 
                    value={(plan.revenue / businessIntelligence.revenueAnalytics.monthlyRecurringRevenue) * 100} 
                    className="h-2" 
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue by Region</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {businessIntelligence.revenueAnalytics.revenueByRegion.map((region) => (
              <div key={region.region} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{region.region}</span>
                </div>
                <div className="text-right">
                  <div className="font-medium">{formatCurrency(region.revenue)}</div>
                  <div className="text-sm text-muted-foreground">{region.tenants} schools</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Tenant Health Scores */}
      <Card>
        <CardHeader>
          <CardTitle>Tenant Health Scores</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {businessIntelligence.tenantAnalytics.healthScores.map((tenant) => (
              <div key={tenant.tenantId} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getHealthScoreColor(tenant.score)}`}>
                    {tenant.score}
                  </div>
                  <div>
                    <div className="font-medium">{tenant.name}</div>
                    <div className="text-sm text-muted-foreground capitalize">{tenant.trend}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Progress value={tenant.score} className="w-20 h-2" />
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const PredictiveAnalyticsTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Churn Prediction */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <span>Churn Risk Analysis</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="font-medium">Predicted Churn (Next Month)</span>
                <span className="text-2xl font-bold text-orange-600">2.1%</span>
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                85% confidence level
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium">At-Risk Tenants</h4>
              {[
                { name: "Hillside Academy", risk: 78, factors: ["Low Usage", "Support Tickets"] },
                { name: "Kisumu International", risk: 65, factors: ["Declining Engagement"] },
                { name: "Nakuru Day School", risk: 52, factors: ["Payment Issues"] },
              ].map((tenant, index) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <div className="font-medium text-sm">{tenant.name}</div>
                    <div className="text-xs text-muted-foreground">{tenant.factors.join(", ")}</div>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs font-medium ${
                    tenant.risk > 70 ? 'bg-red-100 text-red-700' :
                    tenant.risk > 50 ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {tenant.risk}% risk
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Revenue Forecast */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span>Revenue Forecast</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {[
                { month: "May", predicted: 256789, confidence: 92 },
                { month: "Jun", predicted: 268901, confidence: 88 },
                { month: "Jul", predicted: 275432, confidence: 85 },
              ].map((forecast, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{forecast.month}</div>
                    <div className="text-sm text-muted-foreground">{forecast.confidence}% confidence</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{formatCurrency(forecast.predicted)}</div>
                    <Progress value={forecast.confidence} className="w-16 h-1" />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="font-medium text-green-800">Growth Opportunities</div>
              <div className="text-sm text-green-600 mt-1">
                • Upsell potential: KES 45,678<br/>
                • Cross-sell potential: KES 23,456<br/>
                • Market expansion: KES 67,890
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-purple-600" />
            <span>AI-Powered Insights</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="font-medium">High-Performing Feature</span>
              </div>
              <div className="text-sm text-muted-foreground">
                Communications module shows 87.3% adoption with 8.7% growth. Consider expanding features.
              </div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <span className="font-medium">Engagement Alert</span>
              </div>
              <div className="text-sm text-muted-foreground">
                HR module adoption at 67.8% but growing 12.3%. Invest in training to accelerate adoption.
              </div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Target className="h-4 w-4 text-blue-600" />
                <span className="font-medium">Growth Opportunity</span>
              </div>
              <div className="text-sm text-muted-foreground">
                Rural schools show 45% lower adoption. Create targeted marketing campaign.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const CustomReportsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 90 Days</SelectItem>
              <SelectItem value="1y">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>
        <Dialog open={isCreateReportOpen} onOpenChange={setIsCreateReportOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Report
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Custom Report</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="report-name">Report Name</Label>
                <Input id="report-name" placeholder="Enter report name" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="report-description">Description</Label>
                <Textarea id="report-description" placeholder="Describe your report" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Report Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="financial">Financial</SelectItem>
                      <SelectItem value="operational">Operational</SelectItem>
                      <SelectItem value="usage">Usage Analytics</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Format</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="excel">Excel</SelectItem>
                      <SelectItem value="csv">CSV</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Schedule</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select schedule" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="once">Run Once</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Recipients</Label>
                <Input placeholder="Enter email addresses (comma separated)" />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsCreateReportOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsCreateReportOpen(false)}>
                Create Report
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Available Reports */}
      <div className="grid gap-4">
        {[
          {
            name: "Revenue Summary Report",
            description: "Comprehensive revenue analysis by plan, region, and time",
            category: "financial",
            lastGenerated: "2 hours ago",
            schedule: "weekly",
            format: "PDF",
          },
          {
            name: "Tenant Performance Dashboard",
            description: "Detailed tenant health and performance metrics",
            category: "operational",
            lastGenerated: "6 hours ago",
            schedule: "daily",
            format: "Dashboard",
          },
          {
            name: "Product Usage Analytics",
            description: "Feature adoption and user engagement analysis",
            category: "product",
            lastGenerated: "1 day ago",
            schedule: "monthly",
            format: "Excel",
          },
        ].map((report, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold">{report.name}</h3>
                    <Badge variant="secondary">{report.category}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{report.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span>Last generated: {report.lastGenerated}</span>
                    <span>Schedule: {report.schedule}</span>
                    <span>Format: {report.format}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    Preview
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-1" />
                    Configure
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Advanced Analytics & Business Intelligence" 
        description="Comprehensive analytics, predictive insights, and custom reporting"
        breadcrumbs={[
          { label: "Platform", href: "/platform" },
          { label: "Advanced Analytics", href: "/platform/analytics" }
        ]}
      />

      <Tabs defaultValue="business-intelligence">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="business-intelligence">Business Intelligence</TabsTrigger>
          <TabsTrigger value="predictive-analytics">Predictive Analytics</TabsTrigger>
          <TabsTrigger value="custom-reports">Custom Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="business-intelligence">
          <BusinessIntelligenceTab />
        </TabsContent>
        
        <TabsContent value="predictive-analytics">
          <PredictiveAnalyticsTab />
        </TabsContent>
        
        <TabsContent value="custom-reports">
          <CustomReportsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
