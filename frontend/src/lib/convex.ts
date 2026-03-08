// ============================================================
// EduMyles — Convex Client Setup
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
 * Singleton Convex client for the frontend.
 * Configured with authentication to pass session tokens properly.
 * Import this wherever you need to pass a client instance directly.
 * For React components, prefer wrapping with `<ConvexProvider>` instead.
 */
export const convexClient = new ConvexReactClient(CONVEX_URL, {
  // Configure authentication to work with session tokens
  // This allows Convex to access the session context
  auth: {
    async isAuthenticated() {
      // Check if user is authenticated by checking for session token
      const sessionData = localStorage.getItem('convex_auth');
      if (sessionData) {
        try {
          const session = JSON.parse(sessionData);
          return !!session.sessionToken;
        } catch {
          return false;
        }
      }
      return false;
    },
    getToken: async () => {
      // Get session token for Convex authentication
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
    },
  },
});
