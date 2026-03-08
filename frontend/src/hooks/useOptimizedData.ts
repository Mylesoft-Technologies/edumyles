"use client";

import { useState, useEffect, useMemo, useCallback } from "react";

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiry: number;
}

interface OptimizedDataOptions {
  cacheTimeout?: number;
  staleTime?: number;
}

export function useOptimizedData<T>(
  fetcher: () => Promise<T>,
  options: OptimizedDataOptions = {}
) {
  const { cacheTimeout = 5 * 60 * 1000, staleTime = 60 * 1000 } = options;
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cache, setCache] = useState<Map<string, CacheEntry<T>>>(new Map());

  const isDataFresh = useCallback((cachedData: CacheEntry<T>) => {
    return Date.now() - cachedData.timestamp < staleTime;
  }, [staleTime]);

  const fetchData = useCallback(async (forceRefresh = false) => {
    const cacheKey = fetcher.toString();
    const cached = cache.get(cacheKey);

    if (!forceRefresh && cached && isDataFresh(cached)) {
      setData(cached.data);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await fetcher();
      
      const newCacheEntry: CacheEntry<T> = {
        data: result,
        timestamp: Date.now(),
        expiry: Date.now() + cacheTimeout
      };

      setCache(prev => new Map(prev).set(cacheKey, newCacheEntry));
      setData(result);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  }, [fetcher, cache, isDataFresh, cacheTimeout]);

  const refresh = useCallback(() => {
    fetchData(true);
  }, [fetchData]);

  // Auto-refresh when data becomes stale
  useEffect(() => {
    if (data) {
      const cacheKey = fetcher.toString();
      const cached = cache.get(cacheKey);
      
      if (cached && !isDataFresh(cached)) {
        fetchData();
      }
    }
  }, [data, cache, fetchData, isDataFresh]);

  // Cleanup expired cache entries
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setCache(prev => {
        const cleaned = new Map(prev);
        prev.forEach((entry, key) => {
          if (entry.expiry < now) {
            cleaned.delete(key);
          }
        });
        return cleaned;
      });
    }, cacheTimeout / 2);

    return () => clearInterval(interval);
  }, [cacheTimeout]);

  return {
    data,
    loading,
    error,
    refresh,
    refetch: () => fetchData(false)
  };
}
