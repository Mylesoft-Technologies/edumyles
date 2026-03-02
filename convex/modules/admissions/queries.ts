import { query } from "../../_generated/server";
import { v } from "convex/values";
import { requireTenantContext } from "../../helpers/tenantGuard";
import { requirePermission } from "../../helpers/authorize";
import { requireModule } from "../../helpers/moduleGuard";

/**
 * List admission applications with optional status filter.
 */
export const listApplications = query({
    args: {
        status: v.optional(v.string()),
        search: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const tenantCtx = await requireTenantContext(ctx);
        requirePermission(tenantCtx, "students:read");
        await requireModule(ctx, tenantCtx.tenantId, "admissions");

        const { tenantId } = tenantCtx;

        let applications;

        if (args.status) {
            applications = await ctx.db
                .query("admissionApplications")
                .withIndex("by_tenant_status", (q) =>
                    q.eq("tenantId", tenantId).eq("status", args.status!)
                )
                .collect();
        } else {
            applications = await ctx.db
                .query("admissionApplications")
                .withIndex("by_tenant", (q) => q.eq("tenantId", tenantId))
                .collect();
        }

        if (args.search) {
            const lower = args.search.toLowerCase();
            applications = applications.filter(
                (a) =>
                    a.firstName.toLowerCase().includes(lower) ||
                    a.lastName.toLowerCase().includes(lower) ||
                    a.applicationId.toLowerCase().includes(lower)
            );
        }

        return applications;
    },
});

/**
 * Get a single admission application by document ID.
 */
export const getApplication = query({
    args: { applicationId: v.id("admissionApplications") },
    handler: async (ctx, args) => {
        const tenantCtx = await requireTenantContext(ctx);
        requirePermission(tenantCtx, "students:read");

        const application = await ctx.db.get(args.applicationId);
        if (!application || application.tenantId !== tenantCtx.tenantId) {
            throw new Error("APPLICATION_NOT_FOUND");
        }

        return application;
    },
});

/**
 * Get admission statistics.
 */
export const getApplicationStats = query({
    args: {},
    handler: async (ctx) => {
        const tenantCtx = await requireTenantContext(ctx);
        requirePermission(tenantCtx, "students:read");

        const { tenantId } = tenantCtx;

        const applications = await ctx.db
            .query("admissionApplications")
            .withIndex("by_tenant", (q) => q.eq("tenantId", tenantId))
            .collect();

        const total = applications.length;
        const byStatus: Record<string, number> = {};
        for (const app of applications) {
            byStatus[app.status] = (byStatus[app.status] || 0) + 1;
        }

        return { total, byStatus };
    },
});
