"use client";

import { ConvexAuthProvider } from "@/components/ConvexAuthProvider";
import { AppShell } from "@/components/layout/AppShell";
import { RoleGuard } from "@/components/shared/RoleGuard";
import { studentNavItems } from "@/lib/routes";

const STUDENT_ROLES = [
  "student",
  "master_admin", 
  "super_admin",
  "school_admin",
  "principal",
  "teacher",
];

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <ConvexAuthProvider>
      <RoleGuard allowedRoles={STUDENT_ROLES}>
        <AppShell navItems={studentNavItems}>
          {children}
        </AppShell>
      </RoleGuard>
    </ConvexAuthProvider>
  );
}
