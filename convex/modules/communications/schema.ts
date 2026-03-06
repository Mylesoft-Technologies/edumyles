import { defineTable, v } from "convex/server";

export const messageTemplates = defineTable("messageTemplates", {
  tenantId: v.string(),
  name: v.string(),
  type: v.union(v.literal("sms"), v.literal("email"), v.literal("push")),
  subject: v.string(),
  body: v.string(),
  variables: v.array(v.string()), // Template variables like {{studentName}}, {{grade}}, etc.
  isActive: v.boolean(),
  isDefault: v.boolean(),
  createdBy: v.string(),
  createdAt: v.number(),
  updatedAt: v.number(),
})
  .index("by_tenant", (q) => q.eq("tenantId"))
  .index("by_tenant_type", (q) => q.eq("tenantId").eq("type"))
  .index("by_tenant_active", (q) => q.eq("tenantId").eq("isActive"));

export const messageQueue = defineTable("messageQueue", {
  tenantId: v.string(),
  type: v.union(v.literal("sms"), v.literal("email"), v.literal("push")),
  recipientId: v.string(),
  recipientType: v.union(v.literal("student"), v.literal("parent"), v.literal("teacher"), v.literal("staff")),
  templateId: v.optional(v.id("messageTemplates")),
  subject: v.string(),
  body: v.string(),
  variables: v.optional(v.record(v.string(), v.any())),
  status: v.union(v.literal("pending"), v.literal("processing"), v.literal("sent"), v.literal("delivered"), v.literal("failed")),
  scheduledAt: v.optional(v.number()),
  sentAt: v.optional(v.number()),
  deliveredAt: v.optional(v.number()),
  failureReason: v.optional(v.string()),
  externalId: v.optional(v.string()), // External service ID (SMS gateway, email service, etc.)
  metadata: v.optional(v.record(v.string(), v.any())),
  createdAt: v.number(),
  updatedAt: v.number(),
})
  .index("by_tenant_status", (q) => q.eq("tenantId").eq("status"))
  .index("by_recipient", (q) => q.eq("recipientId"))
  .index("by_tenant_type", (q) => q.eq("tenantId").eq("type"))
  .index("by_scheduled", (q) => q.eq("tenantId").eq("status", "pending"))
  .index("by_created", (q) => q.desc("createdAt"));

export const deliveryReports = defineTable("deliveryReports", {
  tenantId: v.string(),
  messageId: v.id("messageQueue"),
  type: v.union(v.literal("sms"), v.literal("email"), v.literal("push")),
  totalRecipients: v.number(),
  successfulDeliveries: v.number(),
  failedDeliveries: v.number(),
  deliveryRate: v.number(),
  sentAt: v.number(),
  completedAt: v.number(),
  reportData: v.optional(v.record(v.string(), v.any())), // Detailed delivery data from providers
  createdAt: v.number(),
})
  .index("by_tenant", (q) => q.eq("tenantId"))
  .index("by_message", (q) => q.eq("messageId"))
  .index("by_tenant_type", (q) => q.eq("tenantId").eq("type"))
  .index("by_created", (q) => q.desc("createdAt"));
