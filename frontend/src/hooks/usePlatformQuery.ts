"use client";

import { useQuery } from "./useSSRSafeConvex";
import { useAuth } from "./useAuth";

/**
 * Wrapper for platform queries that handles session authentication gracefully.
 * Only executes queries when user is authenticated.
 */
export function usePlatformQuery<T = any>(
  query: any,
  args: any,
  enabled: boolean = true
): T | undefined {
  const { sessionToken } = useAuth();
  
  // Only execute query if enabled and user has session token
  const shouldSkip = !enabled || !sessionToken;
  
  // Pass args as-is - Convex handles authentication internally via session context
  return useQuery(query, shouldSkip ? "skip" : args);
}
