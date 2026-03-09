// ============================================================
// EduMyles — Convex Authentication Setup
// ============================================================

/**
 * Convex authentication helper functions
 * These functions help manage the authentication state for Convex
 */

export function getConvexAuthToken(): string | null {
  // Get session data from localStorage
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

export function setConvexAuthToken(session: any): void {
  // Store session in localStorage for Convex client
  localStorage.setItem('convex_auth', JSON.stringify(session));
}

export function clearConvexAuthToken(): void {
  // Clear session from localStorage
  localStorage.removeItem('convex_auth');
}
