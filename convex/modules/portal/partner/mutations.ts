import { v } from "convex/values";
import { mutation } from "../../../_generated/server";
import { requireTenantContext } from "../../../helpers/tenantGuard";
import { requirePermission } from "../../../helpers/authorize";

async function getPartnerRecord(ctx: any, tenant: any) {
  const partner = await ctx.db
    .query("partners")
    .withIndex("by_user", (q: any) => q.eq("userId", tenant.userId))
    .filter((q: any) => q.eq(q.field("tenantId"), tenant.tenantId))
    .first();
  if (!partner || !partner.isActive) return null;
  return partner;
}

/**
 * Update partner organization profile (contact, terms, etc.).
 */
export const updatePartnerProfile = mutation({
  args: {
    organizationName: v.optional(v.string()),
    organizationType: v.optional(v.string()),
    contactEmail: v.optional(v.string()),
    contactPhone: v.optional(v.string()),
    sponsorshipTerms: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const tenant = await requireTenantContext(ctx);
    requirePermission(tenant, "students:read");

    const partner = await getPartnerRecord(ctx, tenant);
    if (!partner) throw new Error("Partner profile not found");

    const updates: Record<string, unknown> = { updatedAt: Date.now() };
    if (args.organizationName !== undefined) updates.organizationName = args.organizationName;
    if (args.organizationType !== undefined) updates.organizationType = args.organizationType;
    if (args.contactEmail !== undefined) updates.contactEmail = args.contactEmail;
    if (args.contactPhone !== undefined) updates.contactPhone = args.contactPhone;
    if (args.sponsorshipTerms !== undefined) updates.sponsorshipTerms = args.sponsorshipTerms;

    await ctx.db.patch(partner._id, updates);
    return { success: true };
  },
});

/**
 * Send a message to the school (creates a notification for school admins).
 */
export const sendPartnerMessage = mutation({
  args: {
    message: v.string(),
    recipientRole: v.optional(v.string()), // e.g. school_admin, bursar
  },
  handler: async (ctx, args) => {
    const tenant = await requireTenantContext(ctx);
    requirePermission(tenant, "students:read");

    const partner = await getPartnerRecord(ctx, tenant);
    if (!partner) throw new Error("Partner profile not found");

    let recipientUserId: string | null = null;
    if (args.recipientRole) {
      const target = await ctx.db
        .query("users")
        .withIndex("by_tenant_role", (q: any) =>
          q.eq("tenantId", tenant.tenantId).eq("role", args.recipientRole!)
        )
        .first();
      if (target) recipientUserId = target._id.toString();
    }
    if (!recipientUserId) {
      const admin = await ctx.db
        .query("users")
        .withIndex("by_tenant_role", (q: any) =>
          q.eq("tenantId", tenant.tenantId).eq("role", "school_admin")
        )
        .first();
      recipientUserId = admin ? admin._id.toString() : null;
    }
    if (!recipientUserId) {
      const anyUser = await ctx.db
        .query("users")
        .withIndex("by_tenant", (q: any) => q.eq("tenantId", tenant.tenantId))
        .first();
      recipientUserId = anyUser ? anyUser._id.toString() : null;
    }
    if (!recipientUserId) throw new Error("No school recipient found for message");

    await ctx.db.insert("notifications", {
      tenantId: tenant.tenantId,
      userId: recipientUserId,
      title: `Message from partner: ${partner.organizationName}`,
      message: args.message,
      type: "message",
      isRead: false,
      link: undefined,
      createdAt: Date.now(),
    });

    return { success: true };
  },
});
