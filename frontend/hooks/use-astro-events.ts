"use client";

import { useCallback, useState } from "react";
import type { AstroEventsResponse } from "@/lib/types";

type UseAstroEventsParams = {
  latitude?: number;
  longitude?: number;
  days?: number;
};

type UseAstroEventsReturn = {
  events: AstroEventsResponse | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export function useAstroEvents({
  latitude = 55.7558,
  longitude = 37.6173,
  days = 7,
}: UseAstroEventsParams = {}): UseAstroEventsReturn {
  const [events, setEvents] = useState<AstroEventsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        lat: latitude.toString(),
        lon: longitude.toString(),
        days: days.toString(),
      });

      const response = await fetch(
        `${API_URL}/astro/events?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch astronomy events: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      setEvents(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch astronomy events"
      );
    } finally {
      setLoading(false);
    }
  }, [latitude, longitude, days]);

  return {
    events,
    loading,
    error,
    refetch,
  };
}
