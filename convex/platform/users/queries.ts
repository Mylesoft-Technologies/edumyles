import { query } from "../../_generated/server";
import { v } from "convex/values";
import { requirePlatformSession } from "../../helpers/platformGuard";

/**
 * Get the current platform user's full profile.
 */
export const getCurrentPlatformUser = query({
  args: { sessionToken: v.string() },
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

    // Return avatar URL if stored
    let avatarUrl = user.avatarUrl;
    if (user.avatarUrl && user.avatarUrl.startsWith("kg")) {
      // It's a storage ID, resolve the URL
      try {
        const url = await ctx.storage.getUrl(user.avatarUrl as any);
        avatarUrl = url ?? undefined;
      } catch {
        avatarUrl = undefined;
      }
    }

    return {
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      phone: user.phone,
      bio: user.bio,
      location: user.location,
      avatarUrl,
      isActive: user.isActive,
      twoFactorEnabled: user.twoFactorEnabled,
      passwordHash: user.passwordHash ? true : false,
      createdAt: user.createdAt,
    };
  },
});
