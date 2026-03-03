"use client";
export function useTenant() {
  return {
    tenantId: "demo-tenant-001",
    tenant: { _id: "demo-tenant-001", name: "Demo School", plan: "pro" },
    organization: { _id: "demo-org-001", name: "Demo School", tier: "pro" },
    installedModules: ["sis", "admissions", "finance", "timetable", "academics", "hr", "library", "transport", "communications"],
    tier: "pro",
    isLoading: false,
  };
}
