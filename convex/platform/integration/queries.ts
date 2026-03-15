import { query } from "../../_generated/server";
import { v } from "convex/values";
import { Id } from "../../_generated/dataModel";
import { requirePlatformSession } from "../../helpers/platformGuard";

/**
 * Get available integrations from marketplace
 */
export const getAvailableIntegrations = query({
  args: {
    sessionToken: v.string(),
    category: v.optional(v.union(
      v.literal("crm"),
      v.literal("communication"),
      v.literal("analytics"),
      v.literal("payment"),
      v.literal("storage"),
      v.literal("security"),
      v.literal("productivity"),
      v.literal("development"),
      v.literal("other")
    )),
    search: v.optional(v.string()),
    featured: v.optional(v.boolean()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { tenantId } = await requirePlatformSession(ctx, { sessionToken: args.sessionToken });

    let integrationsQuery = ctx.db
      .query("integrations")
      .withIndex("by_status", (q) => q.eq("status", "published"));

    if (args.category) {
      integrationsQuery = integrationsQuery.filter((q) => q.eq(q.field("category"), args.category));
    }

    if (args.featured) {
      integrationsQuery = integrationsQuery.filter((q) => q.eq(q.field("isFeatured"), true));
    }

    let integrations = await integrationsQuery.order("desc").take(args.limit || 200);

    // JS-level search filter (q.contains doesn't exist in Convex)
    if (args.search) {
      const searchLower = args.search.toLowerCase();
      integrations = integrations.filter((i: any) =>
        i.name?.toLowerCase().includes(searchLower) ||
        i.description?.toLowerCase().includes(searchLower) ||
        (Array.isArray(i.tags) && i.tags.some((t: string) => t.toLowerCase().includes(searchLower)))
      );
    }

    const limited = integrations.slice(0, args.limit || 50);

    // Enrich with installation status
    const enrichedIntegrations = await Promise.all(
      limited.map(async (integration) => {
        const installation = await ctx.db
          .query("integrationInstallations")
          .withIndex("by_tenant_integration", (q) =>
            q.eq("tenantId", tenantId).eq("integrationId", integration._id)
          )
          .first();

        return {
          ...integration,
          isInstalled: !!installation,
          installation: installation ?? null,
        };
      })
    );

    return enrichedIntegrations;
  },
});

/**
 * Get installed integrations for tenant
 */
export const getInstalledIntegrations = query({
  args: {
    sessionToken: v.string(),
    status: v.optional(v.union(v.literal("active"), v.literal("disabled"), v.literal("error"), v.literal("all"))),
    category: v.optional(v.union(
      v.literal("crm"),
      v.literal("communication"),
      v.literal("analytics"),
      v.literal("payment"),
      v.literal("storage"),
      v.literal("security"),
      v.literal("productivity"),
      v.literal("development"),
      v.literal("other")
    )),
  },
  handler: async (ctx, args) => {
    const { tenantId } = await requirePlatformSession(ctx, { sessionToken: args.sessionToken });

    let installations = await ctx.db
      .query("integrationInstallations")
      .withIndex("by_tenant", (q) => q.eq("tenantId", tenantId))
      .order("desc")
      .collect();

    // JS-level status filter (can't chain withIndex)
    if (args.status && args.status !== "all") {
      installations = installations.filter((i) => i.status === args.status);
    }

    // Enrich with integration details
    const enrichedInstallations = await Promise.all(
      installations.map(async (installation) => {
        const integration = await ctx.db.get(installation.integrationId as Id<"integrations">);
        const timeline = await ctx.db
          .query("integrationInstallationTimeline")
          .withIndex("by_installationId", (q) => q.eq("installationId", installation._id))
          .order("desc")
          .take(10);

        return {
          ...installation,
          integration,
          timeline,
        };
      })
    );

    return enrichedInstallations;
  },
});

/**
 * Get integration installation details
 */
export const getIntegrationDetails = query({
  args: {
    sessionToken: v.string(),
    installationId: v.string(),
  },
  handler: async (ctx, args) => {
    const { tenantId } = await requirePlatformSession(ctx, { sessionToken: args.sessionToken });

    const installation = await ctx.db.get(args.installationId as Id<"integrationInstallations">);
    if (!installation || installation.tenantId !== tenantId) {
      throw new Error("Installation not found");
    }

    const integration = await ctx.db.get(installation.integrationId as Id<"integrations">);
    if (!integration) {
      throw new Error("Integration not found");
    }

    const timeline = await ctx.db
      .query("integrationInstallationTimeline")
      .withIndex("by_installationId", (q) => q.eq("installationId", args.installationId))
      .order("desc")
      .collect();

    const syncHistory = timeline.filter(entry => entry.type === "sync_completed");

    const usageStats = {
      totalApiCalls: installation.usage?.apiCalls || 0,
      totalDataTransferred: installation.usage?.dataTransferred || 0,
      totalErrors: installation.usage?.errors || 0,
      lastSync: installation.lastSyncAt,
      syncStatus: installation.syncStatus,
    };

    return {
      installation,
      integration,
      timeline,
      syncHistory,
      usageStats,
    };
  },
});

/**
 * Get integration marketplace overview
 */
export const getIntegrationMarketplaceOverview = query({
  args: {
    sessionToken: v.string(),
  },
  handler: async (ctx, args) => {
    const { tenantId } = await requirePlatformSession(ctx, { sessionToken: args.sessionToken });

    const allPublished = await ctx.db
      .query("integrations")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .collect();

    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const totalIntegrations = allPublished.length;
    const featuredCount = allPublished.filter((i: any) => i.isFeatured).length;
    const newCount = allPublished.filter((i: any) => i.createdAt >= sevenDaysAgo).length;

    const allInstallations = await ctx.db
      .query("integrationInstallations")
      .withIndex("by_tenant", (q) => q.eq("tenantId", tenantId))
      .collect();
    const installedCount = allInstallations.filter((i) => i.status === "active").length;

    const categoryBreakdown = [
      "crm", "communication", "analytics", "payment", "storage",
      "security", "productivity", "development", "other",
    ].map((category) => ({
      category,
      count: allPublished.filter((i: any) => i.category === category).length,
    }));

    const popularIntegrations = allPublished.slice(0, 6);
    const featuredIntegrations = allPublished.filter((i: any) => i.isFeatured).slice(0, 4);
    const newIntegrations = allPublished.filter((i: any) => i.createdAt >= sevenDaysAgo).slice(0, 6);

    return {
      statistics: {
        totalIntegrations,
        featuredIntegrations: featuredCount,
        newIntegrations: newCount,
        installedCount,
        categoryBreakdown,
      },
      popularIntegrations,
      featuredIntegrations,
      newIntegrations,
    };
  },
});

/**
 * Get integration analytics
 */
export const getIntegrationAnalytics = query({
  args: {
    sessionToken: v.string(),
    installationId: v.string(),
    timeRange: v.optional(v.union(v.literal("7d"), v.literal("30d"), v.literal("90d"))),
    metrics: v.optional(v.array(v.union(
      v.literal("api_calls"),
      v.literal("data_transferred"),
      v.literal("errors"),
      v.literal("sync_frequency"),
      v.literal("response_time")
    ))),
  },
  handler: async (ctx, args) => {
    const { tenantId } = await requirePlatformSession(ctx, { sessionToken: args.sessionToken });

    const installation = await ctx.db.get(args.installationId as Id<"integrationInstallations">);
    if (!installation || installation.tenantId !== tenantId) {
      throw new Error("Installation not found");
    }

    const timeRange = args.timeRange || "30d";
    const now = Date.now();
    const msMap: Record<string, number> = { "7d": 7, "30d": 30, "90d": 90 };
    const timeFilter = (msMap[timeRange] || 30) * 24 * 60 * 60 * 1000;

    const timeline = await ctx.db
      .query("integrationInstallationTimeline")
      .withIndex("by_installationId", (q) => q.eq("installationId", args.installationId))
      .filter((q) => q.gte(q.field("createdAt"), now - timeFilter))
      .collect();

    const analytics = {
      apiCalls: {
        total: installation.usage?.apiCalls || 0,
        trend: "stable",
        daily: Array.from({ length: 30 }, (_, i) => ({
          date: now - ((29 - i) * 24 * 60 * 60 * 1000),
          calls: Math.floor(Math.random() * 100) + 20,
        })),
      },
      dataTransferred: {
        total: installation.usage?.dataTransferred || 0,
        average: Math.floor((installation.usage?.dataTransferred || 0) / 30),
        unit: "MB",
      },
      errors: {
        total: installation.usage?.errors || 0,
        rate: installation.usage?.apiCalls ? ((installation.usage?.errors || 0) / installation.usage.apiCalls) * 100 : 0,
        types: [
          { type: "authentication", count: 2 },
          { type: "rate_limit", count: 1 },
          { type: "timeout", count: 3 },
        ],
      },
      syncFrequency: {
        average: "2.5 hours",
        lastSync: installation.lastSyncAt,
        successRate: 95.5,
      },
      responseTime: {
        average: 150,
        p95: 250,
        p99: 450,
      },
    };

    return {
      installation,
      analytics,
      timeline,
      timeRange,
    };
  },
});

/**
 * Search integrations
 */
export const searchIntegrations = query({
  args: {
    sessionToken: v.string(),
    query: v.string(),
    filters: v.optional(v.object({
      category: v.optional(v.union(
        v.literal("crm"),
        v.literal("communication"),
        v.literal("analytics"),
        v.literal("payment"),
        v.literal("storage"),
        v.literal("security"),
        v.literal("productivity"),
        v.literal("development"),
        v.literal("other")
      )),
      type: v.optional(v.union(v.literal("webhook"), v.literal("api"), v.literal("oauth"), v.literal("database"))),
      pricing: v.optional(v.union(v.literal("free"), v.literal("paid"), v.literal("freemium"))),
      features: v.optional(v.array(v.string())),
    })),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { tenantId } = await requirePlatformSession(ctx, { sessionToken: args.sessionToken });

    // Collect all published integrations, then filter in JS
    let integrations: any[] = await ctx.db
      .query("integrations")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .collect();

    // JS search filter
    if (args.query) {
      const searchLower = args.query.toLowerCase();
      integrations = integrations.filter((i) =>
        i.name?.toLowerCase().includes(searchLower) ||
        i.description?.toLowerCase().includes(searchLower) ||
        i.category?.toLowerCase().includes(searchLower) ||
        (Array.isArray(i.tags) && i.tags.some((t: string) => t.toLowerCase().includes(searchLower)))
      );
    }

    // Apply filters in JS
    if (args.filters) {
      if (args.filters.category) {
        integrations = integrations.filter((i) => i.category === args.filters!.category);
      }
      if (args.filters.type) {
        integrations = integrations.filter((i) => i.type === args.filters!.type);
      }
      if (args.filters.pricing) {
        integrations = integrations.filter((i) => i.pricing?.type === args.filters!.pricing);
      }
      if (args.filters.features && args.filters.features.length > 0) {
        const requiredFeatures = args.filters.features;
        integrations = integrations.filter((i) =>
          Array.isArray(i.features) &&
          requiredFeatures.some((f) => i.features.includes(f))
        );
      }
    }

    const limited = integrations.slice(0, args.limit || 20);

    // Enrich with installation status
    const enrichedIntegrations = await Promise.all(
      limited.map(async (integration) => {
        const installation = await ctx.db
          .query("integrationInstallations")
          .withIndex("by_tenant_integration", (q) =>
            q.eq("tenantId", tenantId).eq("integrationId", integration._id)
          )
          .first();

        return {
          ...integration,
          isInstalled: !!installation,
          installation: installation ?? null,
        };
      })
    );

    return {
      integrations: enrichedIntegrations,
      total: integrations.length,
      query: args.query,
      filters: args.filters,
    };
  },
});

/**
 * Get integration categories
 */
export const getIntegrationCategories = query({
  args: {
    sessionToken: v.string(),
  },
  handler: async (ctx, args) => {
    await requirePlatformSession(ctx, { sessionToken: args.sessionToken });

    const integrations = await ctx.db
      .query("integrations")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .collect();

    const categories = [
      { id: "crm", name: "CRM", description: "Customer relationship management", count: 0, icon: "Users" },
      { id: "communication", name: "Communication", description: "Email, chat, and messaging", count: 0, icon: "MessageSquare" },
      { id: "analytics", name: "Analytics", description: "Data analysis and reporting", count: 0, icon: "BarChart3" },
      { id: "payment", name: "Payment", description: "Payment processing and billing", count: 0, icon: "CreditCard" },
      { id: "storage", name: "Storage", description: "File storage and backup", count: 0, icon: "HardDrive" },
      { id: "security", name: "Security", description: "Security and monitoring", count: 0, icon: "Shield" },
      { id: "productivity", name: "Productivity", description: "Productivity and collaboration tools", count: 0, icon: "CheckSquare" },
      { id: "development", name: "Development", description: "Development and deployment tools", count: 0, icon: "Code" },
      { id: "other", name: "Other", description: "Other integrations", count: 0, icon: "MoreHorizontal" },
    ];

    integrations.forEach((integration: any) => {
      const category = categories.find(cat => cat.id === integration.category);
      if (category) {
        category.count++;
      }
    });

    return {
      categories,
      totalIntegrations: integrations.length,
    };
  },
});
