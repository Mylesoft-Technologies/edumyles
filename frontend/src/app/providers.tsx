"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode } from "react";

let convex: ConvexReactClient | null = null;

function getConvexClient() {
  if (!convex) {
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!convexUrl) {
      console.warn("NEXT_PUBLIC_CONVEX_URL not configured, Convex features will be disabled");
      return null;
    }
    convex = new ConvexReactClient(convexUrl);
  }
  return convex;
}

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  const client = getConvexClient();
  
  if (!client) {
    // Return children without Convex provider if not configured
    return <>{children}</>;
  }
  
  return <ConvexProvider client={client}>{children}</ConvexProvider>;
}
