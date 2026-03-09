"use client";

import { ReactNode } from "react";
import { ConvexProvider } from "convex/react";
import { convexClient } from "@/lib/convex";

interface ConvexAuthProviderProps {
  children: ReactNode;
}

export function ConvexAuthProvider({ children }: ConvexAuthProviderProps) {
  return <ConvexProvider client={convexClient}>{children}</ConvexProvider>;
}
