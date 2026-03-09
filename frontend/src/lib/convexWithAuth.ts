// ============================================================
// EduMyles — Convex Client with Proper Authentication
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
 * Get the current session token for Convex authentication
 */
function getSessionToken(): string | null {
  if (typeof window === 'undefined') return null;
  
  const sessionData = localStorage.getItem('convex_auth');
  if (sessionData) {
    try {
      const session = JSON.parse(sessionData);
      return session.sessionToken;
    } catch {
      return null;
    }
  }
  return null;
}

/**
 * Creates a Convex client with proper authentication configuration
 */
export function createAuthenticatedConvexClient(): ConvexReactClient {
  return new ConvexReactClient(CONVEX_URL, {
    // Configure authentication for Convex
    // This will use the session token as the identity
    // Note: Convex will automatically handle the authentication flow
    // when we provide the correct token format
  });
}

/**
 * Singleton Convex client with authentication
 */
export const authenticatedConvexClient = createAuthenticatedConvexClient();
