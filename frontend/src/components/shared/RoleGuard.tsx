"use client";
interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: string[];
}
export function RoleGuard({ children }: RoleGuardProps) {
  return <>{children}</>;
}
