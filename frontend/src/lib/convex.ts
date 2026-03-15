// ============================================================
// EduMyles — Convex Client Setup
// ============================================================
import { ConvexReactClient } from "convex/react";

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL ?? "";

/**
 * Singleton Convex client for the frontend.
 * Import this wherever you need to pass a client instance directly.
 * For React components, prefer wrapping with `<ConvexProvider>` instead.
 */
let convexClient: ConvexReactClient | null = null;

export const getConvexClient = () => {
  if (!convexClient && typeof window !== "undefined") {
    if (!CONVEX_URL) {
      throw new Error(
        "Missing NEXT_PUBLIC_CONVEX_URL environment variable. " +
          "Set it in .env.local to point to your Convex deployment."
      );
    }
    convexClient = new ConvexReactClient(CONVEX_URL);
  }
  return convexClient;
};

// Export a getter function instead of the client directly
export { convexClient };
