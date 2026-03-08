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
  // In development, skip platform queries if session token looks like a mock
  const sessionToken = args?.sessionToken;
  const isDevMockSession = !sessionToken || 
    sessionToken === "dev_session_token" ||
    sessionToken.includes("dev_") ||
    sessionToken.includes("mock") ||
    sessionToken.includes("test");
  
  const shouldSkip = !enabled || isDevMockSession;
  
  // Enhanced debug logging
  console.log("[usePlatformQuery] DEBUG:", {
    queryName: query?.name || query?.toString?.match(/function (\w+)/)?.[1] || "unknown",
    sessionToken: sessionToken ? `${sessionToken.substring(0, 12)}...` : "none",
    sessionTokenLength: sessionToken?.length || 0,
    isDevMockSession,
    enabled,
    shouldSkip,
    args: args ? { ...args, sessionToken: args.sessionToken ? "***" : undefined } : args
  });
  
  const result = useQuery(query, shouldSkip ? "skip" : args);
  
  // Log the result
  console.log("[usePlatformQuery] RESULT:", {
    queryName: query?.name || "unknown",
    result: result ? "SUCCESS" : "UNDEFINED",
    shouldSkip
  });
  
  return result;
}
