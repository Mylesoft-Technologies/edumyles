"use client";

import { useQuery as useConvexQuery, useMutation as useConvexMutation } from "convex/react";
import { useEffect, useState } from "react";

// Safe wrapper for useQuery that handles SSR
export function useQuery(query: any, args: any) {
  const [isClient, setIsClient] = useState(false);
  const [fallbackData, setFallbackData] = useState<any>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // During SSR, return fallback data
  if (!isClient || typeof window === 'undefined') {
    return fallbackData;
  }

  try {
    const result = useConvexQuery(query, args);
    return result;
  } catch (error) {
    console.warn("Convex query error during SSR check:", error);
    return fallbackData;
  }
}

// Safe wrapper for useMutation that handles SSR
export function useMutation(mutation: any) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // During SSR, return no-op mutation
  if (!isClient || typeof window === 'undefined') {
    return {
      mutate: async () => {
        console.warn("Mutation called during SSR");
      },
      isPending: false,
    };
  }

  try {
    return useConvexMutation(mutation);
  } catch (error) {
    console.warn("Convex mutation error during SSR check:", error);
    return {
      mutate: async () => {
        console.warn("Mutation not available");
      },
      isPending: false,
    };
  }
}
