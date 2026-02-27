import { QueryCtx, MutationCtx } from "../convex/_generated/server";

export type TenantContext = {
  tenantId: string;
  userId: string;
  role: string;
  permissions: string[];
};

export async function requireTenantContext(ctx: QueryCtx | MutationCtx, token: string): Promise<TenantContext> {
  if (!token) throw new Error("UNAUTHORIZED: No session token provided");
  const session = await ctx.db.query("sessions").withIndex("by_token", q => q.eq("token", token)).unique();
  if (!session) throw new Error("UNAUTHORIZED: Session not found");
  if (session.expiresAt < Date.now()) throw new Error("UNAUTHORIZED: Session expired");
  const user = await ctx.db.query("users").withIndex("by_tenant", q => q.eq("tenantId", session.tenantId)).filter(q => q.eq(q.field("_id"), session.userId)).unique();
  if (!user) throw new Error("UNAUTHORIZED: User not found");
  if (!user.isActive) throw new Error("FORBIDDEN: User account is inactive");
  return { tenantId: session.tenantId, userId: session.userId, role: session.role, permissions: session.permissions };
}

export function requireRole(tenantCtx: TenantContext, allowedRoles: string[]): void {
  if (!allowedRoles.includes(tenantCtx.role)) throw new Error(`FORBIDDEN: Role '${tenantCtx.role}' not allowed. Required: ${allowedRoles.join(", ")}`);
}

export function requirePermission(tenantCtx: TenantContext, permission: string): void {
  if (!tenantCtx.permissions.includes(permission)) throw new Error(`FORBIDDEN: Missing permission '${permission}'`);
}
