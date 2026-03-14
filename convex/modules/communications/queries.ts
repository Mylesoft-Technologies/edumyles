import { v } from "convex/values";
import { query } from "../../_generated/server";
import { requireTenantContext, requireTenantSession } from "../../helpers/tenantGuard";
import { requirePermission } from "../../helpers/authorize";
import { requireModule } from "../../helpers/moduleGuard";

export const listAnnouncements = query({
    args: {
        status: v.optional(v.string()),
        limit: v.optional(v.number()),
        sessionToken: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        try {
            const tenant = args.sessionToken
                ? await requireTenantSession(ctx, { sessionToken: args.sessionToken })
                : await requireTenantContext(ctx);
            await requireModule(ctx, tenant.tenantId, "communications");
            requirePermission(tenant, "communications:read");

            const limit = args.limit ?? 50;
            if (args.status) {
                const all = await ctx.db
                    .query("announcements")
                    .withIndex("by_tenant_status", (q) =>
                        q.eq("tenantId", tenant.tenantId).eq("status", args.status!)
                    )
                    .collect();
                return all.sort((a, b) => b.createdAt - a.createdAt).slice(0, limit);
            }

            const all = await ctx.db
                .query("announcements")
                .withIndex("by_tenant", (q) => q.eq("tenantId", tenant.tenantId))
                .collect();
            return all.sort((a, b) => b.createdAt - a.createdAt).slice(0, limit);
        } catch (error) {
            console.error("listAnnouncements failed", error);
            return [];
        }
    },
});

export const getAnnouncement = query({
    args: { announcementId: v.id("announcements"), sessionToken: v.optional(v.string()) },
    handler: async (ctx, args) => {
        try {
            const tenant = args.sessionToken
                ? await requireTenantSession(ctx, { sessionToken: args.sessionToken })
                : await requireTenantContext(ctx);
            await requireModule(ctx, tenant.tenantId, "communications");
            requirePermission(tenant, "communications:read");

            const ann = await ctx.db.get(args.announcementId);
            if (!ann || ann.tenantId !== tenant.tenantId) return null;
            return ann;
        } catch (error) {
            console.error("getAnnouncement failed", error);
            return null;
        }
    },
});

/** Notifications for the current user (tenant-scoped). */
export const listMyNotifications = query({
    args: { limit: v.optional(v.number()), sessionToken: v.optional(v.string()) },
    handler: async (ctx, args) => {
        try {
            const tenant = args.sessionToken
                ? await requireTenantSession(ctx, { sessionToken: args.sessionToken })
                : await requireTenantContext(ctx);
            await requireModule(ctx, tenant.tenantId, "communications");
            requirePermission(tenant, "communications:read");

            const limit = args.limit ?? 20;
            return await ctx.db
                .query("notifications")
                .withIndex("by_user", (q) => q.eq("userId", tenant.userId))
                .order("desc")
                .take(limit);
        } catch (error) {
            console.error("listMyNotifications failed", error);
            return [];
        }
    },
});
