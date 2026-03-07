"use client";

import { ConvexProvider } from "@/hooks/useSSRSafeConvex";
import { convexClient } from "@/lib/convex";

export function ConvexClientProvider({ children }: { children: React.ReactNode }) {
  return <ConvexProvider client={convexClient}>{children}</ConvexProvider>;
}
