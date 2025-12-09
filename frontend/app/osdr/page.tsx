"use client";

import { useEffect, useState } from "react";
import { useOSDRData } from "@/hooks/use-osdr-data";

type ParsedDataset = {
  id: string;
  url: string;
};

const PAGE_SIZE = 25;

export default function OSDRPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const { items, loading, error, refetch, sync } = useOSDRData();

  useEffect(() => {
    refetch();
  }, [refetch]);

  const handleSync = async () => {
    await sync();
    refetch();
  };

  // Parse raw data to extract individual datasets (deduplicated)
  const parseDatasets = (): ParsedDataset[] => {
    if (!items?.items || items.items.length === 0) return [];

    const datasetMap = new Map<string, string>();

    for (const item of items.items) {
      if (item.raw && typeof item.raw === "object") {
        for (const [key, value] of Object.entries(item.raw)) {
          if (key.startsWith("OSD-") && typeof value === "object" && value !== null) {
            const data = value as { REST_URL?: string };
            // Only add if not already in map (deduplication)
            if (!datasetMap.has(key)) {
              datasetMap.set(key, data.REST_URL || "");
            }
          }
        }
      }
    }

    // Convert to array and sort by OSD number
    const datasets: ParsedDataset[] = Array.from(datasetMap.entries()).map(
      ([id, url]) => ({ id, url })
    );

    return datasets.sort((a, b) => {
      const numA = Number.parseInt(a.id.replace("OSD-", ""), 10);
      const numB = Number.parseInt(b.id.replace("OSD-", ""), 10);
      return numA - numB;
    });
  };

  const allDatasets = parseDatasets();
  const datasets = allDatasets.slice(0, visibleCount);
  const hasMore = visibleCount < allDatasets.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + PAGE_SIZE);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">NASA OSDR</h1>
        <button
          type="button"
          onClick={handleSync}
          disabled={loading}
          className="rounded-full bg-primary px-6 py-2 text-sm font-medium text-primary-foreground shadow-[0_0_15px_-5px_var(--color-primary)] transition-all hover:bg-primary/90 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
        >
          {loading ? "Синхронизация..." : "Синхронизировать"}
        </button>
      </div>

      <p className="text-muted-foreground">
        Open Science Data Repository — коллекция космических биологических
        данных NASA
      </p>

      {/* Error Banner */}
      {error && (
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive backdrop-blur-sm">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && datasets.length === 0 && (
        <div className="flex h-32 items-center justify-center">
          <div className="text-center text-primary animate-pulse">
            Загрузка данных...
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-white/10 bg-white/5 backdrop-blur-md">
        <table className="w-full text-sm">
          <thead className="bg-white/10">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                №
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                ID датасета
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Ссылка на API
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Действия
              </th>
            </tr>
          </thead>
          <tbody>
            {datasets.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  {loading
                    ? "Загрузка..."
                    : 'Нет данных. Нажмите "Синхронизировать" для загрузки из OSDR.'}
                </td>
              </tr>
            ) : (
              datasets.map((dataset, index) => (
                <DatasetRow
                  key={dataset.id}
                  dataset={dataset}
                  index={index}
                  expanded={expandedId === dataset.id}
                  onToggle={() =>
                    setExpandedId(expandedId === dataset.id ? null : dataset.id)
                  }
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Count and Load More */}
      {datasets.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Показано {datasets.length} из {allDatasets.length} датасетов
          </p>
          {hasMore && (
            <button
              type="button"
              onClick={handleLoadMore}
              className="rounded-full border border-white/10 bg-white/5 px-6 py-2 text-sm font-medium hover:bg-white/10 transition-all"
            >
              Загрузить ещё {PAGE_SIZE}
            </button>
          )}
        </div>
      )}

    </div>
  );
}

function DatasetRow({
  dataset,
  index,
  expanded,
  onToggle,
}: {
  dataset: ParsedDataset;
  index: number;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <>
      <tr className="border-t border-white/5 hover:bg-white/5 transition-colors">
        <td className="px-4 py-3">{index + 1}</td>
        <td className="px-4 py-3 font-mono text-sm font-medium">
          {dataset.id}
        </td>
        <td className="px-4 py-3">
          {dataset.url ? (
            <a
              href={dataset.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline truncate block max-w-md transition-colors"
            >
              {dataset.url}
            </a>
          ) : (
            <span className="text-muted-foreground">—</span>
          )}
        </td>
        <td className="px-4 py-3">
          <button
            type="button"
            onClick={onToggle}
            className="text-primary hover:underline text-sm transition-colors"
          >
            {expanded ? "Скрыть" : "Подробнее"}
          </button>
        </td>
      </tr>
      {expanded && (
        <tr>
          <td colSpan={4} className="bg-white/5 px-4 py-4">
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium">ID датасета: </span>
                <span className="font-mono">{dataset.id}</span>
              </div>
              <div>
                <span className="text-sm font-medium">REST API: </span>
                {dataset.url ? (
                  <a
                    href={dataset.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline break-all"
                  >
                    {dataset.url}
                  </a>
                ) : (
                  <span className="text-muted-foreground">Недоступно</span>
                )}
              </div>
              {dataset.url && (
                <div className="flex gap-2">
                  <a
                    href={dataset.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    Открыть в API
                  </a>
                  <a
                    href={`https://visualization.osdr.nasa.gov/biodata/datasets/${dataset.id.replace("OSD-", "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-sm font-medium hover:bg-white/10 transition-colors"
                  >
                    Открыть на сайте NASA
                  </a>
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
