import { mutation } from "../../_generated/server";
import { v } from "convex/values";
import { requirePlatformSession } from "../../helpers/platformGuard";
import { idGenerator } from "../../helpers/idGenerator";

/**
 * Install a third-party integration
 */
export const installIntegration = mutation({
  args: {
    sessionToken: v.string(),
    integrationId: v.string(),
    configuration: v.optional(v.record(v.string(), v.any())),
    autoEnable: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { tenantId, userId, role } = await requirePlatformSession(ctx, args.sessionToken);

    // Get integration
    const integration = await ctx.db.get(args.integrationId);
    if (!integration) {
      throw new Error("Integration not found");
    }

    // Check if already installed
    const existingInstallation = await ctx.db
      .query("integrationInstallations")
      .withIndex("by_tenant_integration", (q) => 
        q.eq("tenantId", tenantId).eq("integrationId", args.integrationId)
      )
      .first();

    if (existingInstallation) {
      throw new Error("Integration already installed");
    }

    const installationId = idGenerator("installation");

    // Create installation
    await ctx.db.insert("integrationInstallations", {
      _id: installationId,
      tenantId,
      integrationId: args.integrationId,
      configuration: args.configuration || {},
      status: args.autoEnable ? "active" : "installed",
      installedBy: userId,
      installedAt: Date.now(),
      lastSyncAt: null,
      syncStatus: "pending",
      usage: {
        apiCalls: 0,
        dataTransferred: 0,
        errors: 0,
      },
      subscription: {
        plan: integration.defaultPlan || "free",
        status: "active",
        expiresAt: null,
      },
    });

    // Add to installation timeline
    await ctx.db.insert("integrationInstallationTimeline", {
      _id: idGenerator("timeline"),
      installationId,
      type: "installed",
      message: `Integration ${integration.name} installed successfully`,
      metadata: {
        integrationId: args.integrationId,
        autoEnabled: args.autoEnable,
      },
      userId,
      tenantId,
      createdAt: Date.now(),
    });

    // Initialize integration if auto-enabled
    if (args.autoEnable) {
      await ctx.db.insert("integrationInstallationTimeline", {
        _id: idGenerator("timeline"),
        installationId,
        type: "activated",
        message: `Integration ${integration.name} activated and ready for use`,
        metadata: {
          integrationId: args.integrationId,
        },
        userId,
        tenantId,
        createdAt: Date.now(),
      });
    }

    return {
      success: true,
      installationId,
      message: "Integration installed successfully",
    };
  },
});

/**
 * Configure an installed integration
 */
export const configureIntegration = mutation({
  args: {
    sessionToken: v.string(),
    installationId: v.string(),
    configuration: v.record(v.string(), v.any()),
    testConnection: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { tenantId, userId, role } = await requirePlatformSession(ctx, args.sessionToken);

    // Get installation
    const installation = await ctx.db.get(args.installationId);
    if (!installation || installation.tenantId !== tenantId) {
      throw new Error("Installation not found");
    }

    // Update configuration
    await ctx.db.patch(args.installationId, {
      configuration: args.configuration,
      updatedAt: Date.now(),
    });

    // Add to timeline
    await ctx.db.insert("integrationInstallationTimeline", {
      _id: idGenerator("timeline"),
      installationId: args.installationId,
      type: "configured",
      message: "Integration configuration updated",
      metadata: {
        testConnection: args.testConnection,
      },
      userId,
      tenantId,
      createdAt: Date.now(),
    });

    // Test connection if requested
    if (args.testConnection) {
      const testResult = await testIntegrationConnection(installation.integrationId, args.configuration);
      
      await ctx.db.insert("integrationInstallationTimeline", {
        _id: idGenerator("timeline"),
        installationId: args.installationId,
        type: "test_connection",
        message: `Connection test ${testResult.success ? "passed" : "failed"}`,
        metadata: testResult,
        userId,
        tenantId,
        createdAt: Date.now(),
      });

      return {
        success: true,
        message: "Configuration updated and connection tested",
        testResult,
      };
    }

    return {
      success: true,
      message: "Integration configured successfully",
    };
  },
});

/**
 * Enable/disable an integration
 */
export const toggleIntegration = mutation({
  args: {
    sessionToken: v.string(),
    installationId: v.string(),
    enabled: v.boolean(),
    reason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { tenantId, userId, role } = await requirePlatformSession(ctx, args.sessionToken);

    // Get installation
    const installation = await ctx.db.get(args.installationId);
    if (!installation || installation.tenantId !== tenantId) {
      throw new Error("Installation not found");
    }

    const newStatus = args.enabled ? "active" : "disabled";

    // Update status
    await ctx.db.patch(args.installationId, {
      status: newStatus,
      updatedAt: Date.now(),
    });

    // Add to timeline
    await ctx.db.insert("integrationInstallationTimeline", {
      _id: idGenerator("timeline"),
      installationId: args.installationId,
      type: args.enabled ? "enabled" : "disabled",
      message: `Integration ${args.enabled ? "enabled" : "disabled"}${args.reason ? `: ${args.reason}` : ""}`,
      metadata: {
        previousStatus: installation.status,
        newStatus,
      },
      userId,
      tenantId,
      createdAt: Date.now(),
    });

    return {
      success: true,
      message: `Integration ${args.enabled ? "enabled" : "disabled"} successfully`,
    };
  },
});

/**
 * Uninstall an integration
 */
export const uninstallIntegration = mutation({
  args: {
    sessionToken: v.string(),
    installationId: v.string(),
    reason: v.optional(v.string()),
    keepData: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { tenantId, userId, role } = await requirePlatformSession(ctx, args.sessionToken);

    // Get installation
    const installation = await ctx.db.get(args.installationId);
    if (!installation || installation.tenantId !== tenantId) {
      throw new Error("Installation not found");
    }

    // Add to timeline
    await ctx.db.insert("integrationInstallationTimeline", {
      _id: idGenerator("timeline"),
      installationId: args.installationId,
      type: "uninstalled",
      message: `Integration uninstalled${args.reason ? `: ${args.reason}` : ""}`,
      metadata: {
        keepData: args.keepData,
        finalUsage: installation.usage,
      },
      userId,
      tenantId,
      createdAt: Date.now(),
    });

    // Mark as uninstalled (keep for audit purposes)
    await ctx.db.patch(args.installationId, {
      status: "uninstalled",
      uninstalledAt: Date.now(),
      uninstalledBy: userId,
      uninstalledReason: args.reason || "",
      keepData: args.keepData || false,
      updatedAt: Date.now(),
    });

    return {
      success: true,
      message: "Integration uninstalled successfully",
    };
  },
});

/**
 * Sync integration data
 */
export const syncIntegration = mutation({
  args: {
    sessionToken: v.string(),
    installationId: v.string(),
    syncType: v.optional(v.union(v.literal("full"), v.literal("incremental"), v.literal("manual"))),
  },
  handler: async (ctx, args) => {
    const { tenantId, userId, role } = await requirePlatformSession(ctx, args.sessionToken);

    // Get installation
    const installation = await ctx.db.get(args.installationId);
    if (!installation || installation.tenantId !== tenantId) {
      throw new Error("Installation not found");
    }

    // Update sync status
    await ctx.db.patch(args.installationId, {
      syncStatus: "running",
      lastSyncAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Add to timeline
    await ctx.db.insert("integrationInstallationTimeline", {
      _id: idGenerator("timeline"),
      installationId: args.installationId,
      type: "sync_started",
      message: `Integration sync started (${args.syncType || "manual"})`,
      metadata: {
        syncType: args.syncType || "manual",
      },
      userId,
      tenantId,
      createdAt: Date.now(),
    });

    // Mock sync process (in real implementation, this would call the integration's API)
    const syncResult = {
      success: true,
      recordsProcessed: 1250,
      recordsCreated: 45,
      recordsUpdated: 89,
      recordsDeleted: 12,
      errors: [],
      duration: 45000, // 45 seconds
    };

    // Update with sync results
    await ctx.db.patch(args.installationId, {
      syncStatus: "completed",
      usage: {
        ...installation.usage,
        apiCalls: installation.usage.apiCalls + 1,
        dataTransferred: installation.usage.dataTransferred + syncResult.recordsProcessed,
      },
      updatedAt: Date.now(),
    });

    // Add completion to timeline
    await ctx.db.insert("integrationInstallationTimeline", {
      _id: idGenerator("timeline"),
      installationId: args.installationId,
      type: "sync_completed",
      message: `Integration sync completed successfully`,
      metadata: syncResult,
      userId,
      tenantId,
      createdAt: Date.now(),
    });

    return {
      success: true,
      message: "Integration sync completed successfully",
      syncResult,
    };
  },
});

/**
 * Create a custom integration
 */
export const createCustomIntegration = mutation({
  args: {
    sessionToken: v.string(),
    name: v.string(),
    description: v.string(),
    category: v.union(
      v.literal("crm"),
      v.literal("communication"),
      v.literal("analytics"),
      v.literal("payment"),
      v.literal("storage"),
      v.literal("security"),
      v.literal("productivity"),
      v.literal("development"),
      v.literal("other")
    ),
    type: v.union(v.literal("webhook"), v.literal("api"), v.literal("oauth"), v.literal("database")),
    configuration: v.record(v.string(), v.any()),
    endpoints: v.array(v.object({
      name: v.string(),
      url: v.string(),
      method: v.union(v.literal("GET"), v.literal("POST"), v.literal("PUT"), v.literal("DELETE")),
      authentication: v.object({
        type: v.union(v.literal("none"), v.literal("api_key"), v.literal("oauth"), v.literal("basic")),
        credentials: v.optional(v.record(v.string(), v.any())),
      }),
    })),
    webhookUrl: v.optional(v.string()),
    documentationUrl: v.optional(v.string()),
    supportEmail: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { tenantId, userId, role } = await requirePlatformSession(ctx, args.sessionToken);

    const integrationId = idGenerator("integration");

    // Create custom integration
    await ctx.db.insert("integrations", {
      _id: integrationId,
      name: args.name,
      description: args.description,
      category: args.category,
      type: args.type,
      isCustom: true,
      isPublic: false,
      status: "draft",
      configuration: args.configuration,
      endpoints: args.endpoints,
      webhookUrl: args.webhookUrl || null,
      documentationUrl: args.documentationUrl || null,
      supportEmail: args.supportEmail || null,
      createdBy: userId,
      tenantId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      publishedAt: null,
      usage: {
        installs: 0,
        apiCalls: 0,
        dataTransferred: 0,
      },
      pricing: {
        type: "free",
        amount: 0,
        currency: "USD",
        billingCycle: "monthly",
      },
      defaultPlan: "free",
      features: [],
      requirements: [],
      limitations: [],
    });

    return {
      success: true,
      integrationId,
      message: "Custom integration created successfully",
    };
  },
});

/**
 * Update integration subscription
 */
export const updateIntegrationSubscription = mutation({
  args: {
    sessionToken: v.string(),
    installationId: v.string(),
    plan: v.union(v.literal("free"), v.literal("basic"), v.literal("pro"), v.literal("enterprise")),
    billingCycle: v.union(v.literal("monthly"), v.literal("quarterly"), v.literal("annual")),
  },
  handler: async (ctx, args) => {
    const { tenantId, userId, role } = await requirePlatformSession(ctx, args.sessionToken);

    // Get installation
    const installation = await ctx.db.get(args.installationId);
    if (!installation || installation.tenantId !== tenantId) {
      throw new Error("Installation not found");
    }

    // Calculate subscription details
    const planPricing = {
      free: { amount: 0, features: ["basic_sync", "support"] },
      basic: { amount: 29, features: ["advanced_sync", "api_access", "email_support"] },
      pro: { amount: 99, features: ["real_time_sync", "advanced_analytics", "priority_support", "custom_endpoints"] },
      enterprise: { amount: 299, features: ["unlimited_sync", "dedicated_support", "custom_development", "sla_guarantee"] },
    };

    const pricing = planPricing[args.plan];
    const now = Date.now();
    let expiresAt = null;

    if (args.plan !== "free") {
      const cycleMonths = {
        monthly: 1,
        quarterly: 3,
        annual: 12,
      };
      expiresAt = now + (cycleMonths[args.billingCycle] * 30 * 24 * 60 * 60 * 1000);
    }

    // Update subscription
    await ctx.db.patch(args.installationId, {
      subscription: {
        plan: args.plan,
        status: "active",
        billingCycle: args.billingCycle,
        amount: pricing.amount,
        currency: "USD",
        features: pricing.features,
        startedAt: now,
        expiresAt,
        lastBilledAt: now,
      },
      updatedAt: Date.now(),
    });

    // Add to timeline
    await ctx.db.insert("integrationInstallationTimeline", {
      _id: idGenerator("timeline"),
      installationId: args.installationId,
      type: "subscription_updated",
      message: `Subscription updated to ${args.plan} plan (${args.billingCycle})`,
      metadata: {
        previousPlan: installation.subscription?.plan,
        newPlan: args.plan,
        amount: pricing.amount,
        expiresAt,
      },
      userId,
      tenantId,
      createdAt: Date.now(),
    });

    return {
      success: true,
      message: "Integration subscription updated successfully",
      subscription: {
        plan: args.plan,
        billingCycle: args.billingCycle,
        amount: pricing.amount,
        currency: "USD",
        features: pricing.features,
        expiresAt,
      },
    };
  },
});

// Helper function to test integration connection
async function testIntegrationConnection(integrationId: string, configuration: any): Promise<any> {
  // Mock connection test (in real implementation, this would test actual connection)
  return {
    success: true,
    responseTime: 150,
    message: "Connection successful",
    details: {
      endpoint: configuration.endpoint,
      authentication: "valid",
      lastTest: Date.now(),
    },
  };
}
