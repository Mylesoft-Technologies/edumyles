import { v } from "convex/values";
import { query } from "../../_generated/server";
import { requireTenantContext } from "../../helpers/tenantGuard";
import { requireModule } from "../../helpers/moduleGuard";

export const getMyWalletBalance = query({
  args: {},
  handler: async (ctx) => {
    const tenant = await requireTenantContext(ctx);
    await requireModule(ctx, tenant.tenantId, "ewallet");

    const balance = await ctx.db
      .query("ewalletBalances")
      .withIndex("by_user", (q) => q.eq("userId", tenant.userId))
      .first();

    if (!balance || balance.tenantId !== tenant.tenantId) {
      // Create initial balance if none exists
      const newBalance = await ctx.db.insert("ewalletBalances", {
        tenantId: tenant.tenantId,
        userId: tenant.userId,
        balanceCents: 0,
        lastUpdated: Date.now(),
        currency: "KES",
      });
      
      return {
        balanceCents: 0,
        currency: "KES",
      };
    }

    return {
      balanceCents: balance.balanceCents,
      currency: balance.currency,
    };
  },
});

export const getMyTransactionHistory = query({
  args: {
    limit: v.optional(v.number()),
    offset: v.optional(v.number()),
    type: v.optional(v.union(v.literal("credit"), v.literal("debit"), v.literal("refund"))),
  },
  handler: async (ctx, args) => {
    const tenant = await requireTenantContext(ctx);
    await requireModule(ctx, tenant.tenantId, "ewallet");

    let transactionsQuery = ctx.db
      .query("ewalletTransactions")
      .withIndex("by_user", (q) => q.eq("userId", tenant.userId))
      .filter((q) => q.eq(q.field("tenantId"), tenant.tenantId));

    if (args.type) {
      transactionsQuery = transactionsQuery.filter((q) => q.eq(q.field("type"), args.type));
    }

    const transactions = await transactionsQuery
      .order("desc")
      .take(args.limit || 50)
      .skip(args.offset || 0)
      .collect();

    return transactions;
  },
});

export const getTransactionById = query({
  args: {
    transactionId: v.id("ewalletTransactions"),
  },
  handler: async (ctx, args) => {
    const tenant = await requireTenantContext(ctx);
    await requireModule(ctx, tenant.tenantId, "ewallet");

    const transaction = await ctx.db.get(args.transactionId);
    
    if (!transaction || transaction.tenantId !== tenant.tenantId) {
      return null;
    }

    return transaction;
  },
});
