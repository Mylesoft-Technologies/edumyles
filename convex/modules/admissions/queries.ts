import { v } from "convex/values";
import { query } from "../../_generated/server";
import { requireTenantContext } from "../../helpers/tenantGuard";
import { requirePermission } from "../../helpers/authorize";
import { requireModule } from "../../helpers/moduleGuard";

export const listApplications = query({
    args: {
        status: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const tenant = await requireTenantContext(ctx);
        await requireModule(ctx, tenant.tenantId, "admissions");
        requirePermission(tenant, "students:read");

        let applicationsQuery = ctx.db
            .query("admissionApplications")
            .withIndex("by_tenant", (q) => q.eq("tenantId", tenant.tenantId));

        if (args.status) {
            applicationsQuery = ctx.db
                .query("admissionApplications")
                .withIndex("by_tenant_status", (q) =>
                    q.eq("tenantId", tenant.tenantId).eq("status", args.status!)
                );
        }

        return await applicationsQuery.order("desc").collect();
    },
});

export const getApplication = query({
    args: { applicationId: v.id("admissionApplications") },
    handler: async (ctx, args) => {
        const tenant = await requireTenantContext(ctx);
        await requireModule(ctx, tenant.tenantId, "admissions");
        requirePermission(tenant, "students:read");

        const application = await ctx.db.get(args.applicationId);
        if (!application || application.tenantId !== tenant.tenantId) {
            return null;
        }

        return application;
    },
});

export const getApplicationStats = query({
    args: {},
    handler: async (ctx) => {
        const tenant = await requireTenantContext(ctx);
        await requireModule(ctx, tenant.tenantId, "admissions");
        requirePermission(tenant, "students:read");

        const applications = await ctx.db
            .query("admissionApplications")
            .withIndex("by_tenant", (q) => q.eq("tenantId", tenant.tenantId))
            .collect();

        return {
            total: applications.length,
            byStatus: {
                submitted: applications.filter((a) => a.status === "submitted").length,
                under_review: applications.filter((a) => a.status === "under_review").length,
                accepted: applications.filter((a) => a.status === "accepted").length,
                enrolled: applications.filter((a) => a.status === "enrolled").length,
            },
        };
    },
});
