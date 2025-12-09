"use client";

import { useCallback, useState } from "react";
import { fetchAPI } from "@/lib/api";
import type { SpaceSummaryResponse } from "@/lib/types";

type UseSpaceDataReturn = {
  summary: SpaceSummaryResponse | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

export function useSpaceData(): UseSpaceDataReturn {
  const [summary, setSummary] = useState<SpaceSummaryResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchAPI<SpaceSummaryResponse>("/space/summary");
      setSummary(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch space summary"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    summary,
    loading,
    error,
    refetch,
  };
}
