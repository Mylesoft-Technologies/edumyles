import { v } from "convex/values";
import { mutation } from "../../_generated/server";
import { requireTenantContext } from "../../helpers/tenantGuard";
import { requirePermission } from "../../helpers/authorize";
import { requireModule } from "../../helpers/moduleGuard";
import { logAction } from "../../helpers/auditLog";

export const createFeeStructure = mutation({
    args: {
        name: v.string(),
        amount: v.number(),
        academicYear: v.string(),
        grade: v.string(),
        frequency: v.string(),
    },
    handler: async (ctx, args) => {
        const tenant = await requireTenantContext(ctx);
        await requireModule(ctx, tenant.tenantId, "finance");
        requirePermission(tenant, "finance:write");

        const feeStructureId = await ctx.db.insert("feeStructures", {
            tenantId: tenant.tenantId,
            ...args,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        });

        await logAction(ctx, {
            tenantId: tenant.tenantId,
            actorId: tenant.userId,
            actorEmail: tenant.email,
            action: "settings.updated",
            entityType: "feeStructure",
            entityId: feeStructureId,
            after: args,
        });

        return feeStructureId;
    },
});

export const generateInvoice = mutation({
    args: {
        studentId: v.string(),
        feeStructureId: v.string(),
        dueDate: v.string(),
        issuedAt: v.string(),
    },
    handler: async (ctx, args) => {
        const tenant = await requireTenantContext(ctx);
        await requireModule(ctx, tenant.tenantId, "finance");
        requirePermission(tenant, "finance:write");

        const feeStructure = await ctx.db.get(args.feeStructureId as any);
        if (!feeStructure || !("tenantId" in feeStructure) || (feeStructure as any).tenantId !== tenant.tenantId) {
            throw new Error("Fee structure not found");
        }

        const invoiceId = await ctx.db.insert("invoices", {
            tenantId: tenant.tenantId,
            studentId: args.studentId,
            feeStructureId: args.feeStructureId,
            amount: (feeStructure as any).amount,
            status: "pending",
            dueDate: args.dueDate,
            issuedAt: args.issuedAt,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        });

        await logAction(ctx, {
            tenantId: tenant.tenantId,
            actorId: tenant.userId,
            actorEmail: tenant.email,
            action: "payment.initiated",
            entityType: "invoice",
            entityId: invoiceId,
            after: { studentId: args.studentId, amount: (feeStructure as any).amount },
        });

        return invoiceId;
    },
});
