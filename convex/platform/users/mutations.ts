import { mutation } from "../../_generated/server";
import { v } from "convex/values";
import { requirePlatformSession } from "../../helpers/platformGuard";

/**
 * Update the current platform user's profile.
 */
export const updateUserProfile = mutation({
  args: {
    sessionToken: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    phone: v.optional(v.string()),
    bio: v.optional(v.string()),
    location: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const session = await requirePlatformSession(ctx, args);

    const user = await ctx.db
      .query("users")
      .withIndex("by_tenant_email", (q) =>
        q.eq("tenantId", session.tenantId).eq("email", session.email)
      )
      .first();

    if (!user) {
      throw new Error("Platform user not found");
    }

    const updates: Record<string, string | undefined> = {};
    if (args.firstName !== undefined) updates.firstName = args.firstName;
    if (args.lastName !== undefined) updates.lastName = args.lastName;
    if (args.phone !== undefined) updates.phone = args.phone;
    if (args.bio !== undefined) updates.bio = args.bio;
    if (args.location !== undefined) updates.location = args.location;

    await ctx.db.patch(user._id, updates);

    return { success: true };
  },
});

/**
 * Generate a presigned upload URL for avatar images.
 */
export const generateAvatarUploadUrl = mutation({
  args: { sessionToken: v.string() },
  handler: async (ctx, args) => {
    await requirePlatformSession(ctx, args);
    return await ctx.storage.generateUploadUrl();
  },
});

/**
 * Save the avatar storage ID to the user's profile.
 */
export const saveUserAvatar = mutation({
  args: {
    sessionToken: v.string(),
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const session = await requirePlatformSession(ctx, args);

    const user = await ctx.db
      .query("users")
      .withIndex("by_tenant_email", (q) =>
        q.eq("tenantId", session.tenantId).eq("email", session.email)
      )
      .first();

    if (!user) {
      throw new Error("Platform user not found");
    }

    // Get the URL for the uploaded file
    const url = await ctx.storage.getUrl(args.storageId);

    await ctx.db.patch(user._id, {
      avatarUrl: url ?? undefined,
    });

    return { success: true, avatarUrl: url };
  },
});

/**
 * Create a new platform admin user (master_admin only).
 */
export const createPlatformAdmin = mutation({
  args: {
    sessionToken: v.string(),
    email: v.string(),
    firstName: v.string(),
    lastName: v.string(),
    role: v.union(v.literal("master_admin"), v.literal("super_admin")),
  },
  handler: async (ctx, args) => {
    const session = await requirePlatformSession(ctx, args);

    if (session.role !== "master_admin") {
      throw new Error("UNAUTHORIZED: Only master admins can create platform admins");
    }

    // Check if user already exists in this tenant
    const existing = await ctx.db
      .query("users")
      .withIndex("by_tenant_email", (q) =>
        q.eq("tenantId", session.tenantId).eq("email", args.email)
      )
      .first();

    if (existing) {
      throw new Error("A user with this email already exists");
    }

    // Get the organization for this tenant
    const org = await ctx.db
      .query("organizations")
      .withIndex("by_tenant", (q) => q.eq("tenantId", session.tenantId))
      .first();

    if (!org) {
      throw new Error("Organization not found for tenant");
    }

    const eduMylesUserId = `USR-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    const id = await ctx.db.insert("users", {
      tenantId: session.tenantId,
      eduMylesUserId,
      workosUserId: `pending-${eduMylesUserId}`,
      email: args.email,
      firstName: args.firstName,
      lastName: args.lastName,
      role: args.role,
      permissions: [],
      organizationId: org._id,
      isActive: true,
      createdAt: Date.now(),
    });

    return { success: true, id, eduMylesUserId };
  },
});
