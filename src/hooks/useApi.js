"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import api from '@/lib/api';

// Simple in-memory cache shared across hook instances
const cache = new Map();
const CACHE_TTL = 60_000; // 60 seconds

/**
 * SWR-like hook: returns cached data instantly, then revalidates in background.
 * Avoids redundant fetches when navigating between pages.
 *
 * @param {string} url — API endpoint (e.g. '/api/events?limit=4')
 * @param {object} options — { enabled, ttl }
 * @returns {{ data, loading, error, refetch }}
 */
export function useApi(url, { enabled = true, ttl = CACHE_TTL } = {}) {
  const [data, setData] = useState(() => {
    const entry = cache.get(url);
    return entry && Date.now() - entry.ts < ttl ? entry.data : null;
  });
  const [loading, setLoading] = useState(() => {
    const entry = cache.get(url);
    return !(entry && Date.now() - entry.ts < ttl);
  });
  const [error, setError] = useState(null);
  const abortRef = useRef(null);

  const fetchData = useCallback(async (isBackground = false) => {
    if (!enabled || !url) return;

    // Only show loading for the initial fetch, not background revalidation
    if (!isBackground) {
      const entry = cache.get(url);
      if (entry && Date.now() - entry.ts < ttl) {
        setData(entry.data);
        setLoading(false);
        // Still revalidate in background
        fetchData(true);
        return;
      }
      setLoading(true);
    }

    try {
      // Cancel previous in-flight request
      if (abortRef.current) abortRef.current.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      const { data: responseData } = await api.get(url, {
        signal: controller.signal,
      });

      const result = responseData?.data || responseData;
      cache.set(url, { data: result, ts: Date.now() });
      setData(result);
      setError(null);
    } catch (err) {
      if (err.name === 'CanceledError' || err.name === 'AbortError') return;
      if (!isBackground) setError(err);
      console.error(`useApi [${url}]:`, err);
    } finally {
      if (!isBackground) setLoading(false);
    }
  }, [url, enabled, ttl]);

  useEffect(() => {
    fetchData();
    return () => {
      if (abortRef.current) abortRef.current.abort();
    };
  }, [fetchData]);

  const refetch = useCallback(() => {
    cache.delete(url);
    return fetchData(false);
  }, [url, fetchData]);

  return { data, loading, error, refetch };
}

/**
 * Invalidate a specific cache entry (e.g. after a mutation)
 */
export function invalidateCache(url) {
  if (url) {
    cache.delete(url);
  } else {
    cache.clear();
  }
}
