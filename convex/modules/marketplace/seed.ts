import { mutation } from "../../_generated/server";
import { ALL_MODULES, CORE_MODULE_IDS } from "./moduleDefinitions";

/**
 * Seed the moduleRegistry with all module definitions.
 * Idempotent — skips modules that already exist.
 */
export const seedModuleRegistry = mutation({
  args: {},
  handler: async (ctx) => {
    let created = 0;
    let updated = 0;

    for (const mod of ALL_MODULES) {
      const existing = await ctx.db
        .query("moduleRegistry")
        .withIndex("by_module_id", (q) => q.eq("moduleId", mod.moduleId))
        .first();

      if (existing) {
        // Update existing module with latest definition
        await ctx.db.patch(existing._id, {
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
        });
        updated++;
      } else {
        await ctx.db.insert("moduleRegistry", {
          moduleId: mod.moduleId,
          name: mod.name,
          description: mod.description,
          tier: mod.tier,
          category: mod.category,
          isCore: mod.isCore,
          iconName: mod.iconName,
          status: "published" as const,
          version: mod.version,
          pricing: mod.pricing,
          features: mod.features,
          dependencies: mod.dependencies,
          documentation: mod.documentation,
          support: mod.support,
        });
        created++;
      }
    }

    return { created, updated, total: ALL_MODULES.length };
  },
});

/**
 * Ensure core modules are installed for a specific tenant.
 * Called when a tenant is created or on first login.
 * Idempotent — won't duplicate existing installations.
 */
export const ensureCoreModules = mutation({
  args: {},
  handler: async (ctx) => {
    // Get all tenants
    const tenants = await ctx.db.query("tenants").collect();
    let totalInstalled = 0;

    for (const tenant of tenants) {
      const tenantId = tenant.tenantId;

      for (const coreModuleId of CORE_MODULE_IDS) {
        const existing = await ctx.db
          .query("installedModules")
          .withIndex("by_tenant_module", (q) =>
            q.eq("tenantId", tenantId).eq("moduleId", coreModuleId)
          )
          .first();

        if (!existing) {
          await ctx.db.insert("installedModules", {
            tenantId,
            moduleId: coreModuleId,
            installedAt: Date.now(),
            installedBy: "system",
            config: {},
            status: "active",
            updatedAt: Date.now(),
          });
          totalInstalled++;
        }
      }
    }

    return { tenantsProcessed: tenants.length, coreModulesInstalled: totalInstalled };
  },
});

/**
 * Ensure core modules are installed for a single tenant.
 * Call this when a new tenant is created.
 */
export const ensureCoreModulesForTenant = mutation({
  args: {},
  handler: async (ctx) => {
    // This uses the session context to get the tenant
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return { installed: 0 };

    // Try to find the tenant from the session
    const sessions = await ctx.db.query("sessions").collect();
    const session = sessions.find(
      (s: any) => s.userId === identity.subject && s.status === "active"
    );
    if (!session) return { installed: 0 };

    const tenantId = (session as any).tenantId;
    if (!tenantId) return { installed: 0 };

    let installed = 0;
    for (const coreModuleId of CORE_MODULE_IDS) {
      const existing = await ctx.db
        .query("installedModules")
        .withIndex("by_tenant_module", (q) =>
          q.eq("tenantId", tenantId).eq("moduleId", coreModuleId)
        )
        .first();

      if (!existing) {
        await ctx.db.insert("installedModules", {
          tenantId,
          moduleId: coreModuleId,
          installedAt: Date.now(),
          installedBy: "system",
          config: {},
          status: "active",
          updatedAt: Date.now(),
        });
        installed++;
      }
    }

    return { installed };
  },
});
