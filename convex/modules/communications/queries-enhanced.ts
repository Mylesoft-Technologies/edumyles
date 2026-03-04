import { v } from "convex/values";
import { query } from "../../_generated/server";
import { requireTenantContext } from "../../helpers/tenantGuard";
import { requirePermission } from "../../helpers/authorize";
import { requireModule } from "../../helpers/moduleGuard";

export const listMessageTemplates = query({
  args: {
    type: v.optional(v.union(v.literal("sms"), v.literal("email"), v.literal("push"))),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const tenant = await requireTenantContext(ctx);
    await requireModule(ctx, tenant.tenantId, "communications");
    requirePermission(tenant, "communications:read");

    let templatesQuery = ctx.db
      .query("messageTemplates")
      .withIndex("by_tenant_active", (q) => q.eq("tenantId").eq("isActive", true));

    if (args.type) {
      templatesQuery = templatesQuery.filter((q) => q.eq(q.field("type"), args.type));
    }

    if (args.isActive !== undefined) {
      templatesQuery = templatesQuery.filter((q) => q.eq(q.field("isActive"), args.isActive));
    }

    return await templatesQuery.collect();
  },
});

export const getMessageTemplate = query({
  args: {
    templateId: v.id("messageTemplates"),
  },
  handler: async (ctx, args) => {
    const tenant = await requireTenantContext(ctx);
    await requireModule(ctx, tenant.tenantId, "communications");
    requirePermission(tenant, "communications:read");

    const template = await ctx.db.get(args.templateId);
    
    if (!template || template.tenantId !== tenant.tenantId) {
      return null;
    }

    return template;
  },
});

export const listMessageQueue = query({
  args: {
    status: v.optional(v.union(v.literal("pending"), v.literal("processing"), v.literal("sent"), v.literal("delivered"), v.literal("failed"))),
    type: v.optional(v.union(v.literal("sms"), v.literal("email"), v.literal("push"))),
    limit: v.optional(v.number()),
    offset: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const tenant = await requireTenantContext(ctx);
    await requireModule(ctx, tenant.tenantId, "communications");
    requirePermission(tenant, "communications:read");

    let queueQuery = ctx.db
      .query("messageQueue")
      .withIndex("by_tenant_status", (q) => q.eq("tenantId").eq("status", args.status || "pending"));

    if (args.type) {
      queueQuery = queueQuery.filter((q) => q.eq(q.field("type"), args.type));
    }

    const messages = await queueQuery
      .order("desc")
      .take(args.limit || 50)
      .skip(args.offset || 0)
      .collect();

    return messages;
  },
});

export const getDeliveryReports = query({
  args: {
    limit: v.optional(v.number()),
    offset: v.optional(v.number()),
    type: v.optional(v.union(v.literal("sms"), v.literal("email"), v.literal("push"))),
    dateFrom: v.optional(v.string()),
    dateTo: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const tenant = await requireTenantContext(ctx);
    await requireModule(ctx, tenant.tenantId, "communications");
    requirePermission(tenant, "communications:read");

    let reportsQuery = ctx.db
      .query("deliveryReports")
      .withIndex("by_tenant", (q) => q.eq("tenantId"));

    if (args.type) {
      reportsQuery = reportsQuery.filter((q) => q.eq(q.field("type"), args.type));
    }

    if (args.dateFrom || args.dateTo) {
      reportsQuery = reportsQuery.filter((q) => {
        let matches = true;
        if (args.dateFrom) {
          matches = matches && q.gte(q.field("createdAt"), new Date(args.dateFrom).getTime());
        }
        if (args.dateTo) {
          matches = matches && q.lte(q.field("createdAt"), new Date(args.dateTo).getTime());
        }
        return matches;
      });
    }

    const reports = await reportsQuery
      .order("desc")
      .take(args.limit || 50)
      .skip(args.offset || 0)
      .collect();

    return reports;
  },
});

export const getMessageStats = query({
  args: {
    dateFrom: v.optional(v.string()),
    dateTo: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const tenant = await requireTenantContext(ctx);
    await requireModule(ctx, tenant.tenantId, "communications");
    requirePermission(tenant, "communications:read");

    const dateFilter = args.dateFrom || args.dateTo ? {
      gte: args.dateFrom ? new Date(args.dateFrom).getTime() : undefined,
      lte: args.dateTo ? new Date(args.dateTo).getTime() : undefined,
    } : {};

    const messages = await ctx.db
      .query("messageQueue")
      .withIndex("by_tenant", (q) => q.eq("tenantId"))
      .filter((q) => {
        let matches = true;
        if (dateFilter.gte) {
          matches = matches && q.gte(q.field("createdAt"), dateFilter.gte);
        }
        if (dateFilter.lte) {
          matches = matches && q.lte(q.field("createdAt"), dateFilter.lte);
        }
        return matches;
      })
      .collect();

    const stats = {
      total: messages.length,
      pending: messages.filter(m => m.status === "pending").length,
      processing: messages.filter(m => m.status === "processing").length,
      sent: messages.filter(m => m.status === "sent").length,
      delivered: messages.filter(m => m.status === "delivered").length,
      failed: messages.filter(m => m.status === "failed").length,
      byType: {
        sms: messages.filter(m => m.type === "sms").length,
        email: messages.filter(m => m.type === "email").length,
        push: messages.filter(m => m.type === "push").length,
      },
      deliveryRate: messages.length > 0 
        ? (messages.filter(m => m.status === "delivered").length / messages.length) * 100 
        : 0,
    };

    return stats;
  },
});
