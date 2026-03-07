"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect, useState } from "react";

// Hook to safely use Convex queries with SSR protection
export function useSafeQuery<T>(query: any, args: any, fallback: T) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Don't run query during SSR
  if (!isMounted || typeof window === 'undefined') {
    return fallback;
  }

  try {
    const result = useQuery(query, args);
    return result ?? fallback;
  } catch (error) {
    console.warn("Convex query error:", error);
    return fallback;
  }
}

// Hook to safely use Convex mutations with SSR protection
export function useSafeMutation(mutation: any) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Don't create mutation during SSR
  if (!isMounted || typeof window === 'undefined') {
    return {
      mutate: async () => {
        console.warn("Mutation called during SSR");
      },
      isPending: false,
    };
  }

  try {
    return useMutation(mutation);
  } catch (error) {
    console.warn("Convex mutation error:", error);
    return {
      mutate: async () => {
        console.warn("Mutation not available");
      },
      isPending: false,
    };
  }
}
