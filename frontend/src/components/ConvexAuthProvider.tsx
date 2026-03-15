"use client";

import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithAuthKit } from "@convex-dev/workos";
import { AuthKitProvider, useAuth } from "@workos-inc/authkit-nextjs/components";
import { type ReactNode, useEffect, useState } from "react";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL ?? "";

// Singleton Convex client — lazy-initialized client-side only
let _client: ConvexReactClient | null = null;
function getClient(): ConvexReactClient {
  if (!_client) {
    if (!convexUrl) throw new Error("Missing NEXT_PUBLIC_CONVEX_URL");
    _client = new ConvexReactClient(convexUrl);
  }
  return _client;
}

function ConvexWithAuthKit({ children }: { children: ReactNode }) {
  return (
    <ConvexProviderWithAuthKit client={getClient()} useAuth={useAuth}>
      {children}
    </ConvexProviderWithAuthKit>
  );
}

/**
 * Wraps the app with:
 *  1. AuthKitProvider           — manages WorkOS AuthKit session state
 *  2. ConvexProviderWithAuthKit — passes WorkOS access tokens to Convex
 *
 * Defers rendering until client-side to avoid SSR issues
 * (Convex requires browser environment).
 */
export function ConvexAuthProvider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // During SSR / static generation, render nothing to avoid Convex context errors.
  // Pages that need server-side data should use direct Convex HTTP client calls.
  if (!mounted) return null;

  return (
    <AuthKitProvider>
      <ConvexWithAuthKit>{children}</ConvexWithAuthKit>
    </AuthKitProvider>
  );
}
