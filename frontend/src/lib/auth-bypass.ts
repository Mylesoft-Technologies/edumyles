export const BYPASS_USER = {
  id: "bypass-user-001",
  email: "admin@school.edumyles.com",
  firstName: "Admin",
  lastName: "User",
  role: "super_admin",
  tenantId: "demo-school-001",
};
export function getBypassSession() {
  return { user: BYPASS_USER, sessionId: "bypass-session" };
}
