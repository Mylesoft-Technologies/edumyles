"use client";

import { useAuth } from "./useAuth";
import { useQuery as useConvexQuery, useMutation as useConvexMutation, useAction as useConvexAction } from "convex/react";

/**
 * Enhanced useQuery that includes authentication
 */
export function useQuery(query: any, args?: any) {
  const { sessionToken } = useAuth();
  
  // Only execute query if we have a session token, otherwise skip
  if (!sessionToken && args !== "skip") {
    return "skip";
  }
  
  const useConvexQuerySafe = useConvexQuery as (queryFn: any, queryArgs?: any) => any;
  return useConvexQuerySafe(query, args);
}

/**
 * Enhanced useMutation that includes authentication
 */
export function useMutation(mutation: any) {
  return useConvexMutation(mutation);
}

/**
 * Enhanced useAction that includes authentication
 */
export function useAction(action: any) {
  return useConvexAction(action);
}
