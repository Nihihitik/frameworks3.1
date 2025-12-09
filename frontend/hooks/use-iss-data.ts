"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchAPI } from "@/lib/api";
import type { ISSResponse, TrendResponse } from "@/lib/types";

type UseISSDataReturn = {
  issData: ISSResponse | null;
  trendData: TrendResponse | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

export function useISSData(): UseISSDataReturn {
  const [issData, setIssData] = useState<ISSResponse | null>(null);
  const [trendData, setTrendData] = useState<TrendResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      // Fetch ISS last position
      const lastPosition = await fetchAPI<ISSResponse>("/last");
      setIssData(lastPosition);

      // Fetch ISS trend
      const trend = await fetchAPI<TrendResponse>("/iss/trend");
      setTrendData(trend);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch ISS data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initial fetch
    refetch();

    // Set up polling interval (15 seconds)
    const interval = setInterval(() => {
      refetch();
    }, 15_000);

    // Cleanup on unmount
    return () => {
      clearInterval(interval);
    };
  }, [refetch]);

  return {
    issData,
    trendData,
    loading,
    error,
    refetch,
  };
}
