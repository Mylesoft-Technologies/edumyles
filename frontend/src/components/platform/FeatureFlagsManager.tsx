"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Flag,
  Shield,
  Users,
  Globe,
  Zap,
  AlertTriangle,
  CheckCircle2,
  Settings,
  Rocket,
  ToggleLeft,
  ToggleRight,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Copy,
  Eye,
  EyeOff,
  Info,
  Save,
  X
} from "lucide-react";

interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  type: "global" | "module" | "tenant" | "beta";
  status: "active" | "inactive" | "disabled";
  value: boolean | string | number;
  conditions?: {
    tenantIds?: string[];
    plans?: string[];
    counties?: string[];
    rolloutPercentage?: number;
  };
  metadata: {
    createdBy: string;
    createdAt: number;
    updatedAt: number;
    lastModifiedBy: string;
    category: string;
    tags: string[];
  };
  tags?: string[]; // Add this for backward compatibility
}

interface FeatureFlagsManagerProps {
  className?: string;
}

const MOCK_FEATURE_FLAGS: FeatureFlag[] = [
  {
    id: "global-maintenance-mode",
    name: "Global Maintenance Mode",
    description: "Disable the entire platform for maintenance",
    type: "global",
    status: "inactive",
    value: false,
    metadata: {
      createdBy: "admin@edumyles.co.ke",
      createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
      updatedAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
      lastModifiedBy: "admin@edumyles.co.ke",
      category: "System",
      tags: ["maintenance", "global", "critical"]
    }
  },
  {
    id: "module-academics-v2",
    name: "Academics Module V2",
    description: "Enable new academics module with enhanced features",
    type: "module",
    status: "active",
    value: true,
    conditions: {
      rolloutPercentage: 75
    },
    metadata: {
      createdBy: "dev@edumyles.co.ke",
      createdAt: Date.now() - 15 * 24 * 60 * 60 * 1000,
      updatedAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
      lastModifiedBy: "dev@edumyles.co.ke",
      category: "Features",
      tags: ["academics", "v2", "gradual-rollout"]
    }
  },
  {
    id: "beta-ai-assistant",
    name: "AI Assistant (Beta)",
    description: "Enable AI-powered teaching assistant for select schools",
    type: "beta",
    status: "active",
    value: true,
    conditions: {
      tenantIds: ["st-johns-academy", "elite-high-school"],
      plans: ["growth", "pro", "enterprise"],
      rolloutPercentage: 25
    },
    metadata: {
      createdBy: "product@edumyles.co.ke",
      createdAt: Date.now() - 7 * 24 * 60 * 60 * 1000,
      updatedAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
      lastModifiedBy: "product@edumyles.co.ke",
      category: "Beta",
      tags: ["ai", "assistant", "beta", "innovation"]
    }
  },
  {
    id: "tenant-stjohns-custom-theme",
    name: "St. John's Custom Theme",
    description: "Enable custom branding for St. John's Academy",
    type: "tenant",
    status: "active",
    value: true,
    conditions: {
      tenantIds: ["st-johns-academy"]
    },
    metadata: {
      createdBy: "support@edumyles.co.ke",
      createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
      updatedAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
      lastModifiedBy: "support@edumyles.co.ke",
      category: "Customization",
      tags: ["theme", "branding", "tenant-specific"]
    }
  },
  {
    id: "killswitch-payments",
    name: "Payment Processing Killswitch",
    description: "Emergency disable all payment processing",
    type: "global",
    status: "inactive",
    value: false,
    metadata: {
      createdBy: "ops@edumyles.co.ke",
      createdAt: Date.now() - 45 * 24 * 60 * 60 * 1000,
      updatedAt: Date.now() - 45 * 24 * 60 * 60 * 1000,
      lastModifiedBy: "ops@edumyles.co.ke",
      category: "Emergency",
      tags: ["payments", "killswitch", "emergency", "critical"]
    }
  }
];

const MODULE_OPTIONS = [
  { id: "academics", name: "Academics", icon: "📚" },
  { id: "communications", name: "Communications", icon: "📧" },
  { id: "billing", name: "Billing", icon: "💳" },
  { id: "hr", name: "HR Management", icon: "👥" },
  { id: "library", name: "Library", icon: "📖" },
  { id: "transport", name: "Transport", icon: "🚌" },
  { id: "inventory", name: "Inventory", icon: "📦" },
  { id: "hostel", name: "Hostel", icon: "🏠" }
];

const PLAN_OPTIONS = ["starter", "growth", "pro", "enterprise"];
const COUNTY_OPTIONS = ["Nairobi", "Mombasa", "Kisumu", "Nakuru", "Kiambu", "Machakos"];
const CATEGORIES = ["System", "Features", "Beta", "Customization", "Emergency", "Performance", "Security"];

export function FeatureFlagsManager({ className = "" }: FeatureFlagsManagerProps) {
  const [flags, setFlags] = useState<FeatureFlag[]>(MOCK_FEATURE_FLAGS);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [editingFlag, setEditingFlag] = useState<FeatureFlag | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const filteredFlags = flags.filter(flag => {
    const matchesSearch = flag.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         flag.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         flag.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = selectedType === "all" || flag.type === selectedType;
    const matchesCategory = selectedCategory === "all" || flag.metadata.category === selectedCategory;
    return matchesSearch && matchesType && matchesCategory;
  });

  const toggleFlag = (flagId: string) => {
    setFlags(prev => prev.map(flag => 
      flag.id === flagId 
        ? { 
            ...flag, 
            status: flag.status === "active" ? "inactive" : "active",
            value: typeof flag.value === "boolean" ? !flag.value : flag.value,
            metadata: {
              ...flag.metadata,
              updatedAt: Date.now(),
              lastModifiedBy: "current-user@edumyles.co.ke"
            }
          }
        : flag
    ));
  };

  const deleteFlag = (flagId: string) => {
    setFlags(prev => prev.filter(flag => flag.id !== flagId));
  };

  const duplicateFlag = (flag: FeatureFlag) => {
    const newFlag: FeatureFlag = {
      ...flag,
      id: `${flag.id}-copy-${Date.now()}`,
      name: `${flag.name} (Copy)`,
      metadata: {
        ...flag.metadata,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        lastModifiedBy: "current-user@edumyles.co.ke"
      }
    };
    setFlags(prev => [...prev, newFlag]);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "global": return <Globe className="h-4 w-4" />;
      case "module": return <Settings className="h-4 w-4" />;
      case "tenant": return <Users className="h-4 w-4" />;
      case "beta": return <Rocket className="h-4 w-4" />;
      default: return <Flag className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "global": return "bg-red-100 text-red-700 border-red-200";
      case "module": return "bg-blue-100 text-blue-700 border-blue-200";
      case "tenant": return "bg-green-100 text-green-700 border-green-200";
      case "beta": return "bg-purple-100 text-purple-700 border-purple-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-em-success/10 text-em-success border-em-success/20";
      case "inactive": return "bg-gray-100 text-gray-600 border-gray-200";
      case "disabled": return "bg-red-100 text-red-600 border-red-200";
      default: return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  const renderFlagCard = (flag: FeatureFlag) => (
    <Card key={flag.id} className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-lg">{flag.name}</h3>
              <Badge className={getTypeColor(flag.type)}>
                {getTypeIcon(flag.type)}
                <span className="ml-1 capitalize">{flag.type}</span>
              </Badge>
              <Badge className={getStatusColor(flag.status)}>
                {flag.status === "active" ? <CheckCircle2 className="h-3 w-3 mr-1" /> : <ToggleLeft className="h-3 w-3 mr-1" />}
                <span className="capitalize">{flag.status}</span>
              </Badge>
            </div>
            <p className="text-muted-foreground text-sm mb-3">{flag.description}</p>
            
            <div className="flex flex-wrap gap-1 mb-3">
              {flag.metadata.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  #{tag}
                </Badge>
              ))}
            </div>

            {flag.conditions && (
              <div className="space-y-2 text-sm">
                {flag.conditions.tenantIds && (
                  <div className="flex items-center gap-2">
                    <Users className="h-3 w-3 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {flag.conditions.tenantIds.length} tenant{flag.conditions.tenantIds.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                )}
                {flag.conditions.plans && (
                  <div className="flex items-center gap-2">
                    <Shield className="h-3 w-3 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      Plans: {flag.conditions.plans.join(", ")}
                    </span>
                  </div>
                )}
                {flag.conditions.rolloutPercentage !== undefined && (
                  <div className="flex items-center gap-2">
                    <Zap className="h-3 w-3 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      Rollout: {flag.conditions.rolloutPercentage}%
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 ml-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleFlag(flag.id)}
              className={flag.status === "active" ? "text-em-success" : "text-muted-foreground"}
            >
              {flag.status === "active" ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setEditingFlag(flag)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => duplicateFlag(flag)}>
              <Copy className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => deleteFlag(flag.id)} className="text-red-500">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t">
          <span>
            Created: {new Date(flag.metadata.createdAt).toLocaleDateString()} by {flag.metadata.createdBy}
          </span>
          <span>
            Updated: {new Date(flag.metadata.updatedAt).toLocaleDateString()} by {flag.metadata.lastModifiedBy}
          </span>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Feature Flags</h2>
          <p className="text-muted-foreground">Manage feature flags, module toggles, and rollout configurations</p>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Flag
        </Button>
      </div>

      {/* Alert for Global Flags */}
      {flags.filter(f => f.type === "global" && f.status === "active").length > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-700">
            <strong>Warning:</strong> {flags.filter(f => f.type === "global" && f.status === "active").length} global feature flag(s) are currently active. These may affect all users.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Flags</TabsTrigger>
          <TabsTrigger value="global">Global</TabsTrigger>
          <TabsTrigger value="modules">Modules</TabsTrigger>
          <TabsTrigger value="tenants">Tenants</TabsTrigger>
          <TabsTrigger value="beta">Beta</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search flags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="global">Global</SelectItem>
                <SelectItem value="module">Module</SelectItem>
                <SelectItem value="tenant">Tenant</SelectItem>
                <SelectItem value="beta">Beta</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Flags Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredFlags.map(renderFlagCard)}
          </div>

          {filteredFlags.length === 0 && (
            <div className="text-center py-12">
              <Flag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No feature flags found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || selectedType !== "all" || selectedCategory !== "all"
                  ? "Try adjusting your filters or search terms"
                  : "Get started by creating your first feature flag"
                }
              </p>
              <Button onClick={() => setShowCreateForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Flag
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="global" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {flags.filter(f => f.type === "global").map(renderFlagCard)}
          </div>
        </TabsContent>

        <TabsContent value="modules" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {flags.filter(f => f.type === "module").map(renderFlagCard)}
          </div>
        </TabsContent>

        <TabsContent value="tenants" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {flags.filter(f => f.type === "tenant").map(renderFlagCard)}
          </div>
        </TabsContent>

        <TabsContent value="beta" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {flags.filter(f => f.type === "beta").map(renderFlagCard)}
          </div>
        </TabsContent>
      </Tabs>

      {/* Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Feature Flags Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{flags.length}</div>
              <div className="text-sm text-muted-foreground">Total Flags</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-em-success">
                {flags.filter(f => f.status === "active").length}
              </div>
              <div className="text-sm text-muted-foreground">Active</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {flags.filter(f => f.type === "global" && f.status === "active").length}
              </div>
              <div className="text-sm text-muted-foreground">Global Active</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {flags.filter(f => f.type === "beta").length}
              </div>
              <div className="text-sm text-muted-foreground">Beta Features</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
