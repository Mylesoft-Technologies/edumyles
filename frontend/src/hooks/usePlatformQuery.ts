"use client";

import { useQuery } from "./useSSRSafeConvex";

/**
 * Wrapper for platform queries that handles session authentication gracefully.
 * In development mode, mock sessions may not exist in the database, causing
 * "UNAUTHENTICATED: Session not found" errors. This hook prevents such queries
 * from being executed when the session token appears to be invalid.
 */
export function usePlatformQuery<T = any>(
  query: any,
  args: any,
  enabled: boolean = true
): T | undefined {
  // In development, skip platform queries to prevent authentication errors
  const isDevMode = process.env.NODE_ENV === "development";
  
  // Skip all platform queries in development mode
  const shouldSkip = !enabled || isDevMode;
  
  return useQuery(query, shouldSkip ? "skip" : args);
}
