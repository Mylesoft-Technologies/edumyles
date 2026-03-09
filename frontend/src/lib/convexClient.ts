// ============================================================
// EduMyles — Convex Client with Authentication
// ============================================================
import { ConvexReactClient } from "convex/react";

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL;

if (!CONVEX_URL) {
  throw new Error(
    "Missing NEXT_PUBLIC_CONVEX_URL environment variable. " +
      "Set it in .env.local to point to your Convex deployment."
  );
}

/**
 * Creates a Convex client with authentication support
 */
export function createConvexClient(): ConvexReactClient {
  return new ConvexReactClient(CONVEX_URL, {
    // Configure authentication to work with session tokens
    // This allows Convex to access the session context
    // Note: The actual authentication will be handled through
    // the useAuth hook and session management
  });
}

/**
 * Singleton Convex client for the frontend.
 * This should be used within the ConvexAuthProvider
 */
export const convexClient = createConvexClient();
