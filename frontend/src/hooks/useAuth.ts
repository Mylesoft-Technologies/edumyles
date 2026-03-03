"use client";
import { useCallback } from "react";

export function useAuth() {
  const logout = useCallback(() => { window.location.href = "/auth/login"; }, []);
  return {
    user: { _id: "bypass", name: "Admin User", email: "admin@edumyles.com", role: "super_admin", tenantId: "demo-tenant-001" },
    isLoading: false,
    isAuthenticated: true,
    role: "super_admin",
    tenantId: "demo-tenant-001",
    logout,
    sessionToken: "bypass-token",
  };
}
