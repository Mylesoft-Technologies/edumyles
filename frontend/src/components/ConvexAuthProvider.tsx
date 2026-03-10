"use client";

import { ReactNode, useEffect, useState } from "react";
import { ConvexProvider } from "convex/react";
import { getConvexClient } from "@/lib/convex";

interface ConvexAuthProviderProps {
  children: ReactNode;
}

export function ConvexAuthProvider({ children }: ConvexAuthProviderProps) {
  const [client, setClient] = useState<any>(null);

  useEffect(() => {
    // Only initialize client on client side
    const convexClient = getConvexClient();
    setClient(convexClient);
  }, []);

  if (!client) {
    return null; // or a loading spinner
  }

  return <ConvexProvider client={client}>{children}</ConvexProvider>;
}
