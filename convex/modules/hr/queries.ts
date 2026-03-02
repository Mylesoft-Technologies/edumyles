import { query } from "../../_generated/server";
import { v } from "convex/values";
import { requireTenantContext } from "../../helpers/tenantGuard";
import { requirePermission } from "../../helpers/authorize";
import { requireModule } from "../../helpers/moduleGuard";

/**
 * List staff members with optional role filter.
 */
export const listStaff = query({
    args: {
        role: v.optional(v.string()),
        status: v.optional(v.string()),
        search: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const tenantCtx = await requireTenantContext(ctx);
        requirePermission(tenantCtx, "staff:read");
        await requireModule(ctx, tenantCtx.tenantId, "hr");

        const { tenantId } = tenantCtx;

        let staffMembers;

        if (args.role) {
            staffMembers = await ctx.db
                .query("staff")
                .withIndex("by_tenant_role", (q) =>
                    q.eq("tenantId", tenantId).eq("role", args.role!)
                )
                .collect();
        } else if (args.status) {
            staffMembers = await ctx.db
                .query("staff")
                .withIndex("by_tenant_status", (q) =>
                    q.eq("tenantId", tenantId).eq("status", args.status!)
                )
                .collect();
        } else {
            staffMembers = await ctx.db
                .query("staff")
                .withIndex("by_tenant", (q) => q.eq("tenantId", tenantId))
                .collect();
        }

        if (args.search) {
            const lower = args.search.toLowerCase();
            staffMembers = staffMembers.filter(
                (s) =>
                    s.firstName.toLowerCase().includes(lower) ||
                    s.lastName.toLowerCase().includes(lower) ||
                    s.email.toLowerCase().includes(lower) ||
                    s.employeeId.toLowerCase().includes(lower)
            );
        }

        return staffMembers;
    },
});

/**
 * Get a single staff member by document ID.
 */
export const getStaffMember = query({
    args: { staffId: v.id("staff") },
    handler: async (ctx, args) => {
        const tenantCtx = await requireTenantContext(ctx);
        requirePermission(tenantCtx, "staff:read");

        const staff = await ctx.db.get(args.staffId);
        if (!staff || staff.tenantId !== tenantCtx.tenantId) {
            throw new Error("STAFF_NOT_FOUND");
        }

        return staff;
    },
});

/**
 * Get staff statistics.
 */
export const getStaffStats = query({
    args: {},
    handler: async (ctx) => {
        const tenantCtx = await requireTenantContext(ctx);
        requirePermission(tenantCtx, "staff:read");

        const { tenantId } = tenantCtx;

        const allStaff = await ctx.db
            .query("staff")
            .withIndex("by_tenant", (q) => q.eq("tenantId", tenantId))
            .collect();

        const total = allStaff.length;
        const active = allStaff.filter((s) => s.status === "active").length;

        const byRole: Record<string, number> = {};
        for (const s of allStaff) {
            byRole[s.role] = (byRole[s.role] || 0) + 1;
        }

        const byDepartment: Record<string, number> = {};
        for (const s of allStaff) {
            const dept = s.department || "Unassigned";
            byDepartment[dept] = (byDepartment[dept] || 0) + 1;
        }

        return { total, active, byRole, byDepartment };
    },
});
