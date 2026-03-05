"use client";

import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { adminNavItems } from "@/lib/routes";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar navItems={adminNavItems} />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
