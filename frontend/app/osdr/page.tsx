"use client";

import { useEffect, useState } from "react";
import { useOSDRData } from "@/hooks/use-osdr-data";

export default function OSDRPage() {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const { items, loading, error, refetch, sync } = useOSDRData();

  useEffect(() => {
    refetch();
  }, [refetch]);

  const handleSync = async () => {
    await sync();
    refetch();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">NASA OSDR</h1>
        <button
          type="button"
          onClick={handleSync}
          disabled={loading}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {loading ? "Syncing..." : "Sync Data"}
        </button>
      </div>

      <p className="text-muted-foreground">
        Open Science Data Repository — NASA&apos;s collection of space biology
        datasets
      </p>

      {/* Error Banner */}
      {error && (
        <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && !items && (
        <div className="flex h-32 items-center justify-center">
          <div className="text-center text-muted-foreground animate-pulse">
            Loading datasets...
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                #
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Dataset ID
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Title
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Status
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Updated
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {!items || items.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  {loading
                    ? "Loading..."
                    : 'No datasets loaded. Click "Sync Data" to fetch from OSDR.'}
                </td>
              </tr>
            ) : (
              items.map((item, index) => (
                <TableRow
                  key={item.id}
                  item={item}
                  index={index}
                  expanded={expandedId === item.id}
                  onToggle={() =>
                    setExpandedId(expandedId === item.id ? null : item.id)
                  }
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Count */}
      {items && items.length > 0 && (
        <p className="text-xs text-muted-foreground">
          Showing {items.length} datasets
        </p>
      )}

      {/* API Info */}
      <div className="rounded-lg border border-border bg-muted/50 p-4">
        <h3 className="mb-2 text-sm font-medium">API Endpoints</h3>
        <ul className="space-y-1 text-sm text-muted-foreground">
          <li>
            <code className="rounded bg-muted px-1">GET /osdr/sync</code> —
            Trigger sync
          </li>
          <li>
            <code className="rounded bg-muted px-1">GET /osdr/list</code> — List
            datasets (paginated)
          </li>
        </ul>
      </div>
    </div>
  );
}

type OSDRItem = {
  id: number;
  dataset_id?: string;
  title?: string;
  status?: string;
  updated_at?: string;
  inserted_at: string;
  raw: Record<string, unknown>;
};

function TableRow({
  item,
  index,
  expanded,
  onToggle,
}: {
  item: OSDRItem;
  index: number;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <>
      <tr className="border-t border-border hover:bg-muted/30">
        <td className="px-4 py-3">{index + 1}</td>
        <td className="px-4 py-3 font-mono text-xs">
          {item.dataset_id ?? "—"}
        </td>
        <td className="px-4 py-3">{item.title ?? "Untitled"}</td>
        <td className="px-4 py-3">
          <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-800 dark:bg-green-900 dark:text-green-200">
            {item.status ?? "unknown"}
          </span>
        </td>
        <td className="px-4 py-3 text-xs text-muted-foreground">
          {item.updated_at
            ? new Date(item.updated_at).toLocaleDateString()
            : "—"}
        </td>
        <td className="px-4 py-3">
          <button
            type="button"
            onClick={onToggle}
            className="text-primary hover:underline"
          >
            {expanded ? "Hide" : "Show"} JSON
          </button>
        </td>
      </tr>
      {expanded && (
        <tr>
          <td colSpan={6} className="bg-muted/30 px-4 py-3">
            <pre className="max-h-64 overflow-auto rounded bg-muted p-3 text-xs">
              {JSON.stringify(item.raw, null, 2)}
            </pre>
          </td>
        </tr>
      )}
    </>
  );
}
