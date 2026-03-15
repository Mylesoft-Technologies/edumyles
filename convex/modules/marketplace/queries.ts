import { query } from "../../_generated/server";
import { v } from "convex/values";
import { requireTenantContext } from "../../helpers/tenantGuard";
import { requireRole } from "../../helpers/authorize";
import { TIER_MODULES } from "./tierModules";
import { CORE_MODULE_IDS } from "./moduleDefinitions";

/**
 * List all modules in the registry (public catalog).
 * Only returns active/beta modules. Requires authentication.
 */
export const getModuleRegistry = query({
  args: {},
  handler: async (ctx) => {
    await requireTenantContext(ctx);

    // moduleRegistry uses "published" status (not "active")
    const modules = await ctx.db
      .query("moduleRegistry")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .collect();

    if (modules.length === 0) {
      const { ALL_MODULES } = await import("./moduleDefinitions");
      return ALL_MODULES.map((mod) => ({
        _id: mod.moduleId as any,
        _creationTime: 0,
        moduleId: mod.moduleId,
        name: mod.name,
        description: mod.description,
        tier: mod.tier,
        category: mod.category,
        isCore: mod.isCore,
        iconName: mod.iconName,
        version: mod.version,
        features: mod.features,
        dependencies: mod.dependencies,
        documentation: mod.documentation,
        pricing: mod.pricing,
        support: mod.support,
        status: "published" as const,
      }));
    }

    return modules;
  },
});

/**
 * Get all installed modules for the caller's tenant.
 * TenantId is derived from the session — never from client args.
 */
export const getInstalledModules = query({
  args: {},
  handler: async (ctx) => {
    const { tenantId } = await requireTenantContext(ctx);

    return await ctx.db
      .query("installedModules")
      .withIndex("by_tenant", (q) => q.eq("tenantId", tenantId))
      .collect();
  },
});

/**
 * Get just the installed module IDs for the caller's tenant.
 * Always includes core modules. Used by sidebar for nav filtering.
 */
export const getInstalledModuleIds = query({
  args: {},
  handler: async (ctx) => {
    const { tenantId } = await requireTenantContext(ctx);

    const installed = await ctx.db
      .query("installedModules")
      .withIndex("by_tenant_status", (q) =>
        q.eq("tenantId", tenantId).eq("status", "active")
      )
      .collect();

    const installedIds = installed.map((m) => m.moduleId);
    // Always include core modules
    const allIds = new Set([...CORE_MODULE_IDS, ...installedIds]);
    return Array.from(allIds);
  },
});

/**
 * Get modules available for the caller's subscription tier.
 * Returns registry modules annotated with tier availability.
 */
export const getAvailableForTier = query({
  args: {},
  handler: async (ctx) => {
    const { tenantId } = await requireTenantContext(ctx);

    const tenant = await ctx.db
      .query("tenants")
      .withIndex("by_tenantId", (q) => q.eq("tenantId", tenantId))
      .first();

    if (!tenant) {
      throw new Error("TENANT_NOT_FOUND");
    }

    const tier = tenant.plan ?? "free";
    const allowedModuleIds = TIER_MODULES[tier] || TIER_MODULES["free"];

    const dbModules = await ctx.db.query("moduleRegistry").collect();

    // If the registry is empty, fall back to in-memory module definitions
    // so the marketplace always shows modules even before the seed is run.
    if (dbModules.length === 0) {
      const { ALL_MODULES } = await import("./moduleDefinitions");
      return ALL_MODULES.map((mod) => ({
        _id: mod.moduleId as any,
        _creationTime: 0,
        moduleId: mod.moduleId,
        name: mod.name,
        description: mod.description,
        tier: mod.tier,
        category: mod.category,
        isCore: mod.isCore,
        iconName: mod.iconName,
        version: mod.version,
        features: mod.features,
        dependencies: mod.dependencies,
        documentation: mod.documentation,
        pricing: mod.pricing,
        support: mod.support,
        status: "published" as const,
        availableForTier: CORE_MODULE_IDS.includes(mod.moduleId) || allowedModuleIds!.includes(mod.moduleId),
      }));
    }

    return dbModules.map((mod) => ({
      ...mod,
      isCore: mod.isCore ?? CORE_MODULE_IDS.includes(mod.moduleId),
      availableForTier: CORE_MODULE_IDS.includes(mod.moduleId) || allowedModuleIds!.includes(mod.moduleId),
    }));
  },
});

/**
 * Get details for a single module including install status.
 * TenantId is derived from the session.
 */
export const getModuleDetails = query({
  args: { moduleId: v.string() },
  handler: async (ctx, args) => {
    const { tenantId } = await requireTenantContext(ctx);

    const registryModule = await ctx.db
      .query("moduleRegistry")
      .withIndex("by_module_id", (q) => q.eq("moduleId", args.moduleId))
      .first();

    if (!registryModule) {
      throw new Error("MODULE_NOT_FOUND");
    }

    const installed = await ctx.db
      .query("installedModules")
      .withIndex("by_tenant_module", (q) =>
        q.eq("tenantId", tenantId).eq("moduleId", args.moduleId)
      )
      .first();

    const tenant = await ctx.db
      .query("tenants")
      .withIndex("by_tenantId", (q) => q.eq("tenantId", tenantId))
      .first();

    const org = await ctx.db
      .query("organizations")
      .withIndex("by_tenant", (q) => q.eq("tenantId", tenantId))
      .first();

    const tier = org?.tier ?? tenant?.plan ?? "free";
    const allowedModuleIds = TIER_MODULES[tier] ?? TIER_MODULES["free"];

    return {
      ...registryModule,
      installed: installed
        ? {
            status: installed.status,
            installedAt: installed.installedAt,
            installedBy: installed.installedBy,
            config: installed.config,
          }
        : null,
      availableForTier: allowedModuleIds!.includes(args.moduleId),
      currentTier: tier,
    };
  },
});

/**
 * Get module access requests for the caller's tenant.
 * Only school_admin / master_admin / super_admin can view requests.
 */
export const getModuleRequests = query({
  args: { status: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const tenantCtx = await requireTenantContext(ctx);
    requireRole(tenantCtx, "school_admin", "master_admin", "super_admin");

    const { tenantId } = tenantCtx;

    if (args.status) {
      return await ctx.db
        .query("moduleRequests")
        .withIndex("by_tenant_status", (q) =>
          q.eq("tenantId", tenantId).eq("status", args.status!)
        )
        .collect();
    }

    return await ctx.db
      .query("moduleRequests")
      .withIndex("by_tenant", (q) => q.eq("tenantId", tenantId))
      .collect();
  },
});
