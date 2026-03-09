"use client";

import { ReactNode } from "react";
import { ConvexAuthProvider } from "@/components/ConvexAuthProvider";

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return <ConvexAuthProvider>{children}</ConvexAuthProvider>;
}
