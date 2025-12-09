"use client";

import { useCallback, useState } from "react";
import { fetchAPI } from "@/lib/api";
import type { OSDRListResponse } from "@/lib/types";

type UseOSDRDataReturn = {
  items: OSDRListResponse | null;
  loading: boolean;
  error: string | null;
  sync: () => Promise<void>;
  refetch: (page?: number, pageSize?: number) => Promise<void>;
};

export function useOSDRData(): UseOSDRDataReturn {
  const [items, setItems] = useState<OSDRListResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(
    async (page = 1, pageSize = 10): Promise<void> => {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchAPI<OSDRListResponse>(
          `/osdr/list?page=${page}&page_size=${pageSize}`
        );
        setItems(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch OSDR data"
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const sync = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      await fetchAPI("/osdr/sync");
      // After sync, refetch the list
      await refetch();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to sync OSDR data");
      setLoading(false);
    }
  }, [refetch]);

  return {
    items,
    loading,
    error,
    sync,
    refetch,
  };
}
