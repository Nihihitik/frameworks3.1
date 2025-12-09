"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchAPI } from "@/lib/api";
import type { SpaceSummaryResponse } from "@/lib/types";

type UseSpaceDataReturn = {
  summary: SpaceSummaryResponse | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  refresh: (src: string) => Promise<void>;
};

export function useSpaceData(): UseSpaceDataReturn {
  const [summary, setSummary] = useState<SpaceSummaryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchAPI<SpaceSummaryResponse>("/space/summary");
      setSummary(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Ошибка загрузки данных космоса"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(async (src: string): Promise<void> => {
    try {
      await fetchAPI(`/space/refresh?src=${src}`);
      await refetch();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : `Ошибка обновления ${src}`
      );
    }
  }, [refetch]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return {
    summary,
    loading,
    error,
    refetch,
    refresh,
  };
}
