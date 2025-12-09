"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { fetchAPI } from "@/lib/api";
import type { ISSResponse, TrendResponse } from "@/lib/types";

type ISSPosition = {
  latitude: number;
  longitude: number;
  altitude: number;
  velocity: number;
  timestamp: string;
  visibility?: string;
};

type UseISSDataReturn = {
  position: ISSPosition | null;
  trend: TrendResponse | null;
  history: ISSPosition[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

const MAX_HISTORY_POINTS = 20;

export function useISSData(): UseISSDataReturn {
  const [position, setPosition] = useState<ISSPosition | null>(null);
  const [trend, setTrend] = useState<TrendResponse | null>(null);
  const [history, setHistory] = useState<ISSPosition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const lastTimestampRef = useRef<number | null>(null);

  const refetch = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      // Fetch ISS last position
      const lastPosition = await fetchAPI<ISSResponse>("/last");

      if (lastPosition?.payload) {
        const payload = lastPosition.payload;
        const newPosition: ISSPosition = {
          latitude: payload.latitude,
          longitude: payload.longitude,
          altitude: payload.altitude,
          velocity: payload.velocity,
          timestamp: payload.timestamp
            ? new Date(payload.timestamp * 1000).toISOString()
            : new Date().toISOString(),
          visibility: payload.visibility,
        };

        setPosition(newPosition);

        // Add to history if timestamp is different
        const currentTimestamp = payload.timestamp;
        if (currentTimestamp && currentTimestamp !== lastTimestampRef.current) {
          lastTimestampRef.current = currentTimestamp;
          setHistory((prev) => {
            const updated = [...prev, newPosition];
            // Keep only last N points
            if (updated.length > MAX_HISTORY_POINTS) {
              return updated.slice(-MAX_HISTORY_POINTS);
            }
            return updated;
          });
        }
      }

      // Fetch ISS trend
      const trendData = await fetchAPI<TrendResponse>("/iss/trend");
      setTrend(trendData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка загрузки данных МКС");
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
    position,
    trend,
    history,
    loading,
    error,
    refetch,
  };
}
