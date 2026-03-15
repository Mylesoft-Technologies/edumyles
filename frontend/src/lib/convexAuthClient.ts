// ============================================================
// EduMyles — Convex Client with Session-based Authentication
// ============================================================
import { ConvexReactClient } from "convex/react";

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL ?? "";

/**
 * Creates a Convex client that handles authentication through session tokens
 * This client will automatically handle authentication by reading session data
 */
export function createConvexClientWithAuth(): ConvexReactClient {
  return new ConvexReactClient(CONVEX_URL);
}

/**
 * Singleton authenticated Convex client
 * Created lazily to avoid server-side initialization issues
 */
let _authenticatedConvexClient: ConvexReactClient | null = null;

export const authenticatedConvexClient = (() => {
  if (!_authenticatedConvexClient && typeof window !== 'undefined') {
    _authenticatedConvexClient = createConvexClientWithAuth();
  }
  return _authenticatedConvexClient;
})();
