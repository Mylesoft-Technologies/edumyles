import { v } from "convex/values";
import { mutation } from "../../_generated/server";
import { requireTenantContext } from "../../helpers/tenantGuard";
import { requirePermission } from "../../helpers/authorize";
import { requireModule } from "../../helpers/moduleGuard";
import { logAction } from "../../helpers/auditLog";

export const createStaff = mutation({
    args: {
        employeeId: v.string(),
        firstName: v.string(),
        lastName: v.string(),
        email: v.string(),
        role: v.string(),
        department: v.optional(v.string()),
        phone: v.optional(v.string()),
        qualification: v.optional(v.string()),
        joinDate: v.string(),
        status: v.string(),
    },
    handler: async (ctx, args) => {
        const tenant = await requireTenantContext(ctx);
        await requireModule(ctx, tenant.tenantId, "hr");
        requirePermission(tenant, "staff:write");

        const staffId = await ctx.db.insert("staff", {
            tenantId: tenant.tenantId,
            ...args,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        });

        await logAction(ctx, {
            tenantId: tenant.tenantId,
            actorId: tenant.userId,
            actorEmail: tenant.email,
            action: "staff.created",
            entityType: "staff",
            entityId: staffId,
            after: args,
        });

        return staffId;
    },
});

export const updateStaff = mutation({
    args: {
        id: v.id("staff"),
        firstName: v.optional(v.string()),
        lastName: v.optional(v.string()),
        email: v.optional(v.string()),
        role: v.optional(v.string()),
        department: v.optional(v.string()),
        phone: v.optional(v.string()),
        qualification: v.optional(v.string()),
        status: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const tenant = await requireTenantContext(ctx);
        await requireModule(ctx, tenant.tenantId, "hr");
        requirePermission(tenant, "staff:write");

        const { id, ...updates } = args;
        const existing = await ctx.db.get(id);
        if (!existing || existing.tenantId !== tenant.tenantId) {
            throw new Error("Staff member not found or access denied");
        }

        await ctx.db.patch(id, {
            ...updates,
            updatedAt: Date.now(),
        });

        await logAction(ctx, {
            tenantId: tenant.tenantId,
            actorId: tenant.userId,
            actorEmail: tenant.email,
            action: "staff.updated",
            entityType: "staff",
            entityId: id,
            before: existing,
            after: updates,
        });

        return id;
    },
});

export const assignRole = mutation({
    args: {
        staffId: v.id("staff"),
        role: v.string(),
    },
    handler: async (ctx, args) => {
        const tenant = await requireTenantContext(ctx);
        await requireModule(ctx, tenant.tenantId, "hr");
        requirePermission(tenant, "users:manage");

        const existing = await ctx.db.get(args.staffId);
        if (!existing || existing.tenantId !== tenant.tenantId) {
            throw new Error("Staff member not found or access denied");
        }

        await ctx.db.patch(args.staffId, {
            role: args.role,
            updatedAt: Date.now(),
        });

        await logAction(ctx, {
            tenantId: tenant.tenantId,
            actorId: tenant.userId,
            actorEmail: tenant.email,
            action: "staff.role_assigned",
            entityType: "staff",
            entityId: args.staffId,
            before: { role: existing.role },
            after: { role: args.role },
        });

        return args.staffId;
    },
});
