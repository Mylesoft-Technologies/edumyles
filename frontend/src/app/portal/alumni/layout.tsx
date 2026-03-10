"use client";

import { ConvexAuthProvider } from "@/components/ConvexAuthProvider";
import { AppShell } from "@/components/layout/AppShell";
import { RoleGuard } from "@/components/shared/RoleGuard";
import { alumniNavItems } from "@/lib/routes";

const ALUMNI_ROLES = [
  "alumni",
  "master_admin",
  "super_admin",
  "school_admin",
];

export default function AlumniLayout({ children }: { children: React.ReactNode }) {
  return (
    <ConvexAuthProvider>
      <RoleGuard allowedRoles={ALUMNI_ROLES}>
        <AppShell navItems={alumniNavItems}>
          {children}
        </AppShell>
      </RoleGuard>
    </ConvexAuthProvider>
  );
}
