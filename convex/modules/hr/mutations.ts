import { mutation } from "../../_generated/server";
import { v } from "convex/values";
import { requireTenantContext } from "../../helpers/tenantGuard";
import { requirePermission } from "../../helpers/authorize";
import { requireModule } from "../../helpers/moduleGuard";
import { logAction } from "../../helpers/auditLog";

/**
 * Create a new staff member.
 */
export const createStaff = mutation({
    args: {
        firstName: v.string(),
        lastName: v.string(),
        email: v.string(),
        phone: v.optional(v.string()),
        role: v.string(),
        department: v.optional(v.string()),
        qualification: v.optional(v.string()),
        joinDate: v.string(),
    },
    handler: async (ctx, args) => {
        const tenantCtx = await requireTenantContext(ctx);
        requirePermission(tenantCtx, "staff:write");
        await requireModule(ctx, tenantCtx.tenantId, "hr");

        const { tenantId } = tenantCtx;
        const now = Date.now();

        // Auto-generate employee ID
        const employeeId = `EMP-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

        const staffId = await ctx.db.insert("staff", {
            tenantId,
            firstName: args.firstName,
            lastName: args.lastName,
            email: args.email,
            phone: args.phone,
            role: args.role,
            department: args.department,
            employeeId,
            qualification: args.qualification,
            joinDate: args.joinDate,
            status: "active",
            createdAt: now,
            updatedAt: now,
        });

        await logAction(ctx, {
            tenantId,
            userId: tenantCtx.userId,
            action: "staff.created",
            targetId: staffId,
            targetType: "staff",
            details: { employeeId, firstName: args.firstName, lastName: args.lastName, role: args.role },
        });

        return { success: true, staffId, employeeId };
    },
});

/**
 * Update a staff member's profile.
 */
export const updateStaff = mutation({
    args: {
        staffId: v.id("staff"),
        firstName: v.optional(v.string()),
        lastName: v.optional(v.string()),
        email: v.optional(v.string()),
        phone: v.optional(v.string()),
        department: v.optional(v.string()),
        qualification: v.optional(v.string()),
        status: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const tenantCtx = await requireTenantContext(ctx);
        requirePermission(tenantCtx, "staff:write");

        const staff = await ctx.db.get(args.staffId);
        if (!staff || staff.tenantId !== tenantCtx.tenantId) {
            throw new Error("STAFF_NOT_FOUND");
        }

        const updates: Record<string, unknown> = { updatedAt: Date.now() };
        if (args.firstName !== undefined) updates.firstName = args.firstName;
        if (args.lastName !== undefined) updates.lastName = args.lastName;
        if (args.email !== undefined) updates.email = args.email;
        if (args.phone !== undefined) updates.phone = args.phone;
        if (args.department !== undefined) updates.department = args.department;
        if (args.qualification !== undefined) updates.qualification = args.qualification;
        if (args.status !== undefined) updates.status = args.status;

        await ctx.db.patch(args.staffId, updates);

        await logAction(ctx, {
            tenantId: tenantCtx.tenantId,
            userId: tenantCtx.userId,
            action: "staff.updated",
            targetId: args.staffId,
            targetType: "staff",
            details: updates,
        });

        return { success: true };
    },
});

/**
 * Assign a system role to a staff member.
 */
export const assignRole = mutation({
    args: {
        staffId: v.id("staff"),
        role: v.string(),
    },
    handler: async (ctx, args) => {
        const tenantCtx = await requireTenantContext(ctx);
        requirePermission(tenantCtx, "users:manage");

        const staff = await ctx.db.get(args.staffId);
        if (!staff || staff.tenantId !== tenantCtx.tenantId) {
            throw new Error("STAFF_NOT_FOUND");
        }

        const previousRole = staff.role;

        await ctx.db.patch(args.staffId, {
            role: args.role,
            updatedAt: Date.now(),
        });

        // If staff has a linked user account, update their role too
        if (staff.userId) {
            const user = await ctx.db
                .query("users")
                .withIndex("by_tenant", (q) => q.eq("tenantId", tenantCtx.tenantId))
                .filter((q) => q.eq(q.field("eduMylesUserId"), staff.userId))
                .first();

            if (user) {
                await ctx.db.patch(user._id, { role: args.role });
            }
        }

        await logAction(ctx, {
            tenantId: tenantCtx.tenantId,
            userId: tenantCtx.userId,
            action: "staff.role_assigned",
            targetId: args.staffId,
            targetType: "staff",
            details: { previousRole, newRole: args.role },
        });

        return { success: true };
    },
});
