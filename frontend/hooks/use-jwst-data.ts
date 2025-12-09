"use client";

import { useCallback, useState } from "react";
import type { JWSTFeedResponse } from "@/lib/types";

type UseJWSTDataParams = {
  source?: string;
  instrument?: string;
  perPage?: number;
};

type UseJWSTDataReturn = {
  items: JWSTFeedResponse | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export function useJWSTData({
  source = "all",
  instrument = "all",
  perPage = 12,
}: UseJWSTDataParams = {}): UseJWSTDataReturn {
  const [items, setItems] = useState<JWSTFeedResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      // Only add source if not "all" - default to "jpg"
      params.set("source", source === "all" ? "jpg" : source);
      // Only add instrument if not "all"
      if (instrument && instrument !== "all") {
        params.set("instrument", instrument);
      }
      params.set("perPage", perPage.toString());

      const response = await fetch(
        `${API_URL}/jwst/feed?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch JWST data: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      setItems(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch JWST data"
      );
    } finally {
      setLoading(false);
    }
  }, [source, instrument, perPage]);

  return {
    items,
    loading,
    error,
    refetch,
  };
}
