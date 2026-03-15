// ============================================================
// EduMyles — Convex Client with Authentication
// ============================================================
import { ConvexReactClient } from "convex/react";

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL ?? "";

/**
 * Creates a Convex client with authentication support
 */
export function createConvexClient(): ConvexReactClient {
  if (!CONVEX_URL) throw new Error("Missing NEXT_PUBLIC_CONVEX_URL");
  return new ConvexReactClient(CONVEX_URL);
}

/**
 * Singleton Convex client for the frontend.
 * Lazily initialized to avoid crashing during SSR/static build.
 */
let _convexClient: ConvexReactClient | null = null;
export const convexClient = (() => {
  if (!_convexClient && typeof window !== "undefined") {
    _convexClient = createConvexClient();
  }
  return _convexClient;
})();
