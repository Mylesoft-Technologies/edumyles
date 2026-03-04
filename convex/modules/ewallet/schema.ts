import { defineTable, v } from "convex/values";

export const ewalletTransactions = defineTable("ewalletTransactions", {
  tenantId: v.string(),
  userId: v.string(),
  type: v.union(v.literal("credit"), v.literal("debit"), v.literal("refund")),
  amountCents: v.number(),
  description: v.string(),
  referenceId: v.optional(v.string()),
  referenceType: v.optional(v.union(v.literal("payment"), v.literal("refund"), v.literal("allowance"))),
  balanceAfter: v.number(), // Balance in cents after this transaction
  createdAt: v.number(),
  processedAt: v.optional(v.number()),
  status: v.union(v.literal("pending"), v.literal("completed"), v.literal("failed")),
})
  .index("by_user", (q) => q.eq("userId"))
  .index("by_tenant_user", (q) => q.eq("tenantId").eq("userId"))
  .index("by_status", (q) => q.eq("status"))
  .index("by_type", (q) => q.eq("type"))
  .index("by_created", (q) => q.desc("createdAt"));

export const ewalletBalances = defineTable("ewalletBalances", {
  tenantId: v.string(),
  userId: v.string(),
  balanceCents: v.number(),
  lastUpdated: v.number(),
  currency: v.string(),
})
  .index("by_user", (q) => q.eq("userId"))
  .index("by_tenant_user", (q) => q.eq("tenantId").eq("userId"));
