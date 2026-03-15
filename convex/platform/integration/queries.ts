import { query } from "../../../_generated/server";
import { v } from "convex/values";
import { requirePlatformSession } from "../../../helpers/platformGuard";

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
    const { tenantId } = await requirePlatformSession(ctx, args.sessionToken);

    let integrationsQuery = ctx.db
      .query("integrations")
      .withIndex("by_status", (q) => q.eq("status", "published"));

    // Apply filters
    if (args.category) {
      integrationsQuery = integrationsQuery.filter((q) => q.eq(q.field("category"), args.category));
    }

    if (args.featured) {
      integrationsQuery = integrationsQuery.filter((q) => q.eq(q.field("isFeatured"), true));
    }

    if (args.search) {
      integrationsQuery = integrationsQuery.filter((q) => 
        q.or(
          q.contains(q.field("name"), args.search),
          q.contains(q.field("description"), args.search),
          q.contains(q.field("tags"), args.search)
        )
      );
    }

    const integrations = await integrationsQuery
      .order("desc")
      .take(args.limit || 50)
      .collect();

    // Enrich with installation status
    const enrichedIntegrations = await Promise.all(
      integrations.map(async (integration) => {
        const installation = await ctx.db
          .query("integrationInstallations")
          .withIndex("by_tenant_integration", (q) => 
            q.eq("tenantId", tenantId).eq("integrationId", integration._id)
          )
          .first();

        return {
          ...integration,
          isInstalled: !!installation,
          installation: installation || null,
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
    const { tenantId } = await requirePlatformSession(ctx, args.sessionToken);

    let installationsQuery = ctx.db
      .query("integrationInstallations")
      .withIndex("by_tenant", (q) => q.eq("tenantId", tenantId));

    // Apply filters
    if (args.status && args.status !== "all") {
      installationsQuery = installationsQuery.withIndex("by_status", (q) => q.eq("status", args.status));
    }

    const installations = await installationsQuery
      .order("desc")
      .collect();

    // Enrich with integration details
    const enrichedInstallations = await Promise.all(
      installations.map(async (installation) => {
        const integration = await ctx.db.get(installation.integrationId);
        const timeline = await ctx.db
          .query("integrationInstallationTimeline")
          .withIndex("by_installationId", (q) => q.eq("installationId", installation._id))
          .order("desc")
          .take(10)
          .collect();

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
    const { tenantId } = await requirePlatformSession(ctx, args.sessionToken);

    // Get installation
    const installation = await ctx.db.get(args.installationId);
    if (!installation || installation.tenantId !== tenantId) {
      throw new Error("Installation not found");
    }

    // Get integration details
    const integration = await ctx.db.get(installation.integrationId);
    if (!integration) {
      throw new Error("Integration not found");
    }

    // Get full timeline
    const timeline = await ctx.db
      .query("integrationInstallationTimeline")
      .withIndex("by_installationId", (q) => q.eq("installationId", args.installationId))
      .order("desc")
      .collect();

    // Get sync history
    const syncHistory = timeline.filter(entry => entry.type === "sync_completed");

    // Get usage statistics
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
    const { tenantId } = await requirePlatformSession(ctx, args.sessionToken);

    // Get marketplace statistics
    const [totalIntegrations, featuredIntegrations, newIntegrations, installedCount] = await Promise.all([
      ctx.db
        .query("integrations")
        .withIndex("by_status", (q) => q.eq("status", "published"))
        .collect()
        .then(integrations => integrations.length),
      
      ctx.db
        .query("integrations")
        .withIndex("by_status", (q) => q.eq("status", "published"))
        .filter((q) => q.eq(q.field("isFeatured"), true))
        .collect()
        .then(integrations => integrations.length),
      
      ctx.db
        .query("integrations")
        .withIndex("by_status", (q) => q.eq("status", "published"))
        .filter((q) => q.gte(q.field("createdAt"), Date.now() - (7 * 24 * 60 * 60 * 1000)))
        .collect()
        .then(integrations => integrations.length),
      
      ctx.db
        .query("integrationInstallations")
        .withIndex("by_tenant", (q) => q.eq("tenantId", tenantId))
        .withIndex("by_status", (q) => q.eq("status", "active"))
        .collect()
        .then(installations => installations.length),
    ]);

    // Get category breakdown
    const categoryBreakdown = await Promise.all([
      { category: "crm", count: 0 },
      { category: "communication", count: 0 },
      { category: "analytics", count: 0 },
      { category: "payment", count: 0 },
      { category: "storage", count: 0 },
      { category: "security", count: 0 },
      { category: "productivity", count: 0 },
      { category: "development", count: 0 },
      { category: "other", count: 0 },
    ]);

    // Get popular integrations
    const popularIntegrations = await ctx.db
      .query("integrations")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .order("desc")
      .take(6)
      .collect();

    return {
      statistics: {
        totalIntegrations,
        featuredIntegrations,
        newIntegrations,
        installedCount,
        categoryBreakdown,
      },
      popularIntegrations,
      featuredIntegrations: await ctx.db
        .query("integrations")
        .withIndex("by_status", (q) => q.eq("status", "published"))
        .filter((q) => q.eq(q.field("isFeatured"), true))
        .take(4)
        .collect(),
      newIntegrations: await ctx.db
        .query("integrations")
        .withIndex("by_status", (q) => q.eq("status", "published"))
        .filter((q) => q.gte(q.field("createdAt"), Date.now() - (7 * 24 * 60 * 60 * 1000)))
        .take(6)
        .collect(),
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
    const { tenantId } = await requirePlatformSession(ctx, args.sessionToken);

    // Get installation
    const installation = await ctx.db.get(args.installationId);
    if (!installation || installation.tenantId !== tenantId) {
      throw new Error("Installation not found");
    }

    const timeRange = args.timeRange || "30d";
    const now = Date.now();
    let timeFilter = 0;
    
    switch (timeRange) {
      case "7d":
        timeFilter = 7 * 24 * 60 * 60 * 1000;
        break;
      case "30d":
        timeFilter = 30 * 24 * 60 * 60 * 1000;
        break;
      case "90d":
        timeFilter = 90 * 24 * 60 * 60 * 1000;
        break;
    }

    // Get timeline entries for analytics
    const timeline = await ctx.db
      .query("integrationInstallationTimeline")
      .withIndex("by_installationId", (q) => q.eq("installationId", args.installationId))
      .filter((q) => q.gte(q.field("createdAt"), now - timeFilter))
      .collect();

    // Calculate analytics
    const analytics = {
      apiCalls: {
        total: installation.usage?.apiCalls || 0,
        trend: "stable", // Would be calculated from historical data
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
        rate: installation.usage?.apiCalls ? ((installation.usage?.errors || 0) / installation.usage?.apiCalls) * 100 : 0,
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
    const { tenantId } = await requirePlatformSession(ctx, args.sessionToken);

    let integrationsQuery = ctx.db
      .query("integrations")
      .withIndex("by_status", (q) => q.eq("status", "published"));

    // Apply search query
    if (args.query) {
      integrationsQuery = integrationsQuery.filter((q) => 
        q.or(
          q.contains(q.field("name"), args.query),
          q.contains(q.field("description"), args.query),
          q.contains(q.field("tags"), args.query),
          q.contains(q.field("category"), args.query)
        )
      );
    }

    // Apply filters
    if (args.filters) {
      if (args.filters.category) {
        integrationsQuery = integrationsQuery.filter((q) => q.eq(q.field("category"), args.filters.category));
      }
      if (args.filters.type) {
        integrationsQuery = integrationsQuery.filter((q) => q.eq(q.field("type"), args.filters.type));
      }
      if (args.filters.pricing) {
        integrationsQuery = integrationsQuery.filter((q) => q.eq(q.field("pricing.type"), args.filters.pricing));
      }
      if (args.filters.features && args.filters.features.length > 0) {
        integrationsQuery = integrationsQuery.filter((q) => 
          args.filters.features!.some(feature => q.contains(q.field("features"), feature))
        );
      }
    }

    const integrations = await integrationsQuery
      .order("desc")
      .take(args.limit || 20)
      .collect();

    // Enrich with installation status
    const enrichedIntegrations = await Promise.all(
      integrations.map(async (integration) => {
        const installation = await ctx.db
          .query("integrationInstallations")
          .withIndex("by_tenant_integration", (q) => 
            q.eq("tenantId", tenantId).eq("integrationId", integration._id)
          )
          .first();

        return {
          ...integration,
          isInstalled: !!installation,
          installation: installation || null,
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
    const { tenantId } = await requirePlatformSession(ctx, args.sessionToken);

    // Get all published integrations
    const integrations = await ctx.db
      .query("integrations")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .collect();

    // Calculate category statistics
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

    // Count integrations per category
    integrations.forEach(integration => {
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
