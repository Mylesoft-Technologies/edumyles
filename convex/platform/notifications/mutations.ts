import { mutation } from "../../_generated/server";
import { v } from "convex/values";
import { requirePlatformSession } from "../../helpers/platformGuard";

export const createNotification = mutation({
  args: {
    sessionToken: v.string(),
    targetUserId: v.string(),
    title: v.string(),
    message: v.string(),
    type: v.string(),
    actionUrl: v.optional(v.string()),
    link: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const session = await requirePlatformSession(ctx, args);
    const link = args.link ?? args.actionUrl;

    return await ctx.db.insert("notifications", {
      tenantId: session.tenantId,
      userId: args.targetUserId,
      title: args.title,
      message: args.message,
      type: args.type,
      isRead: false,
      link,
      createdAt: Date.now(),
    });
  },
});

export const markAsRead = mutation({
  args: {
    sessionToken: v.string(),
    notificationId: v.id("notifications"),
  },
  handler: async (ctx, args) => {
    const session = await requirePlatformSession(ctx, args);

    const notification = await ctx.db.get(args.notificationId);
    if (!notification || notification.userId !== session.userId) {
      throw new Error("Notification not found");
    }

    await ctx.db.patch(args.notificationId, { isRead: true });
  },
});

export const markAllAsRead = mutation({
  args: { sessionToken: v.string() },
  handler: async (ctx, args) => {
    const session = await requirePlatformSession(ctx, args);

    const unread = await ctx.db
      .query("notifications")
      .withIndex("by_user_unread", (q) =>
        q.eq("userId", session.userId).eq("isRead", false)
      )
      .collect();

    for (const n of unread) {
      await ctx.db.patch(n._id, { isRead: true });
    }
  },
});

export const dismissNotification = mutation({
  args: {
    sessionToken: v.string(),
    notificationId: v.id("notifications"),
  },
  handler: async (ctx, args) => {
    const session = await requirePlatformSession(ctx, args);

    const notification = await ctx.db.get(args.notificationId);
    if (!notification || notification.userId !== session.userId) {
      throw new Error("Notification not found");
    }

    await ctx.db.delete(args.notificationId);
  },
});

export const backfillNotificationReadAndLink = mutation({
  args: {
    sessionToken: v.string(),
    dryRun: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    await requirePlatformSession(ctx, args);
    const dryRun = args.dryRun ?? false;

    const notifications = await ctx.db.query("notifications").collect();
    let updated = 0;
    let wouldUpdate = 0;

    for (const notification of notifications) {
      const legacy = notification as unknown as {
        read?: boolean;
        actionUrl?: string;
      };

      const patch: {
        isRead?: boolean;
        link?: string;
      } = {};

      if (notification.isRead === undefined) {
        patch.isRead = typeof legacy.read === "boolean" ? legacy.read : false;
      }

      if (!notification.link && typeof legacy.actionUrl === "string" && legacy.actionUrl.length > 0) {
        patch.link = legacy.actionUrl;
      }

      if (Object.keys(patch).length === 0) continue;

      if (dryRun) {
        wouldUpdate += 1;
        continue;
      }

      await ctx.db.patch(notification._id, patch);
      updated += 1;
    }

    return {
      scanned: notifications.length,
      updated,
      wouldUpdate,
      dryRun,
    };
  },
});
