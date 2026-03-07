"use client";

import { ReactNode } from "react";

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  // Temporarily disable Convex to prevent build errors
  // TODO: Re-enable once Convex backend is properly deployed
  console.warn("Convex temporarily disabled to prevent build errors");
  return <>{children}</>;
}
