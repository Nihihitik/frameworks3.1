"use client";

import { useISSData } from "@/hooks/use-iss-data";

export default function ISSPage() {
  const { issData, trendData: trend, loading, error, refetch } = useISSData();
  const position = issData?.payload;

  const handleFetchLatest = () => {
    refetch();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">ISS Tracking</h1>
        {loading && (
          <span className="text-sm text-muted-foreground animate-pulse">
            Updating every 15s...
          </span>
        )}
      </div>

      {/* Error Banner */}
      {error && (
        <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Last Position Card */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold">Last Position</h2>
          <dl className="space-y-3">
            <div className="flex justify-between border-b border-border pb-2">
              <dt className="text-muted-foreground">Latitude</dt>
              <dd className="font-mono" id="iss-lat">
                {position?.latitude?.toFixed(4) ?? "—"}°
              </dd>
            </div>
            <div className="flex justify-between border-b border-border pb-2">
              <dt className="text-muted-foreground">Longitude</dt>
              <dd className="font-mono" id="iss-lon">
                {position?.longitude?.toFixed(4) ?? "—"}°
              </dd>
            </div>
            <div className="flex justify-between border-b border-border pb-2">
              <dt className="text-muted-foreground">Altitude</dt>
              <dd className="font-mono" id="iss-altitude">
                {position?.altitude?.toFixed(1) ?? "—"} km
              </dd>
            </div>
            <div className="flex justify-between border-b border-border pb-2">
              <dt className="text-muted-foreground">Velocity</dt>
              <dd className="font-mono" id="iss-velocity">
                {position?.velocity?.toFixed(0) ?? "—"} km/h
              </dd>
            </div>
            <div className="flex justify-between border-b border-border pb-2">
              <dt className="text-muted-foreground">Visibility</dt>
              <dd className="font-mono">
                {position?.visibility ?? "—"}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Timestamp</dt>
              <dd className="font-mono text-sm" id="iss-timestamp">
                {position?.timestamp
                  ? new Date(position.timestamp).toLocaleString()
                  : "—"}
              </dd>
            </div>
          </dl>
        </div>

        {/* Trend Card */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold">Movement Trend</h2>
          <dl className="space-y-3">
            <div className="flex justify-between border-b border-border pb-2">
              <dt className="text-muted-foreground">Status</dt>
              <dd id="trend-status">
                {trend?.movement !== undefined ? (
                  <span
                    className={
                      trend.movement ? "text-green-500" : "text-yellow-500"
                    }
                  >
                    {trend.movement ? "Moving" : "Stationary"}
                  </span>
                ) : (
                  "—"
                )}
              </dd>
            </div>
            <div className="flex justify-between border-b border-border pb-2">
              <dt className="text-muted-foreground">Displacement</dt>
              <dd className="font-mono" id="trend-displacement">
                {trend?.delta_km?.toFixed(2) ?? "—"} km
              </dd>
            </div>
            <div className="flex justify-between border-b border-border pb-2">
              <dt className="text-muted-foreground">Interval</dt>
              <dd className="font-mono" id="trend-interval">
                {trend?.dt_sec?.toFixed(0) ?? "—"} sec
              </dd>
            </div>
            <div className="flex justify-between border-b border-border pb-2">
              <dt className="text-muted-foreground">Avg Velocity</dt>
              <dd className="font-mono" id="trend-velocity">
                {trend?.velocity_kmh?.toFixed(0) ?? "—"} km/h
              </dd>
            </div>
            <div className="flex justify-between border-b border-border pb-2">
              <dt className="text-muted-foreground">From</dt>
              <dd className="font-mono text-xs">
                {trend?.from_lat !== undefined && trend?.from_lon !== undefined
                  ? `${trend.from_lat.toFixed(2)}°, ${trend.from_lon.toFixed(2)}°`
                  : "—"}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">To</dt>
              <dd className="font-mono text-xs">
                {trend?.to_lat !== undefined && trend?.to_lon !== undefined
                  ? `${trend.to_lat.toFixed(2)}°, ${trend.to_lon.toFixed(2)}°`
                  : "—"}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <button
          type="button"
          onClick={handleFetchLatest}
          disabled={loading}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {loading ? "Fetching..." : "Fetch Latest"}
        </button>
      </div>

      {/* API Info */}
      <div className="rounded-lg border border-border bg-muted/50 p-4">
        <h3 className="mb-2 text-sm font-medium">API Endpoints</h3>
        <ul className="space-y-1 text-sm text-muted-foreground">
          <li>
            <code className="rounded bg-muted px-1">GET /last</code> — Latest
            ISS position
          </li>
          <li>
            <code className="rounded bg-muted px-1">GET /fetch</code> — Trigger
            fetch
          </li>
          <li>
            <code className="rounded bg-muted px-1">GET /iss/trend</code> —
            Movement trend
          </li>
        </ul>
      </div>
    </div>
  );
}
