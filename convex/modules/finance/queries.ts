import { v } from "convex/values";
import { query } from "../../_generated/server";
import { requireTenantContext } from "../../helpers/tenantGuard";
import { requirePermission } from "../../helpers/authorize";
import { requireModule } from "../../helpers/moduleGuard";

export const listFeeStructures = query({
    args: {
        grade: v.optional(v.string()),
        academicYear: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const tenant = await requireTenantContext(ctx);
        await requireModule(ctx, tenant.tenantId, "finance");
        requirePermission(tenant, "finance:read");

        let feeQuery = ctx.db
            .query("feeStructures")
            .withIndex("by_tenant", (q) => q.eq("tenantId", tenant.tenantId));

        if (args.grade) {
            feeQuery = ctx.db
                .query("feeStructures")
                .withIndex("by_tenant_grade", (q) =>
                    q.eq("tenantId", tenant.tenantId).eq("grade", args.grade!)
                );
        } else if (args.academicYear) {
            feeQuery = ctx.db
                .query("feeStructures")
                .withIndex("by_tenant_academic_year", (q) =>
                    q.eq("tenantId", tenant.tenantId).eq("academicYear", args.academicYear!)
                );
        }

        return await feeQuery.collect();
    },
});

export const listInvoices = query({
    args: {
        studentId: v.optional(v.string()),
        status: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const tenant = await requireTenantContext(ctx);
        await requireModule(ctx, tenant.tenantId, "finance");
        requirePermission(tenant, "finance:read");

        let invoicesQuery = ctx.db
            .query("invoices")
            .withIndex("by_tenant", (q) => q.eq("tenantId", tenant.tenantId));

        if (args.studentId) {
            invoicesQuery = ctx.db
                .query("invoices")
                .withIndex("by_tenant_student", (q) =>
                    q.eq("tenantId", tenant.tenantId).eq("studentId", args.studentId!)
                );
        } else if (args.status) {
            invoicesQuery = ctx.db
                .query("invoices")
                .withIndex("by_tenant_status", (q) =>
                    q.eq("tenantId", tenant.tenantId).eq("status", args.status!)
                );
        }

        return await invoicesQuery.order("desc").collect();
    },
});
