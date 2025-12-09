export default function ISSPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">ISS Tracking</h1>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Last Position Card */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold">Last Position</h2>
          <dl className="space-y-3">
            <div className="flex justify-between border-b border-border pb-2">
              <dt className="text-muted-foreground">Latitude</dt>
              <dd className="font-mono" id="iss-lat">—</dd>
            </div>
            <div className="flex justify-between border-b border-border pb-2">
              <dt className="text-muted-foreground">Longitude</dt>
              <dd className="font-mono" id="iss-lon">—</dd>
            </div>
            <div className="flex justify-between border-b border-border pb-2">
              <dt className="text-muted-foreground">Altitude</dt>
              <dd className="font-mono" id="iss-altitude">— km</dd>
            </div>
            <div className="flex justify-between border-b border-border pb-2">
              <dt className="text-muted-foreground">Velocity</dt>
              <dd className="font-mono" id="iss-velocity">— km/h</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Timestamp</dt>
              <dd className="font-mono text-sm" id="iss-timestamp">—</dd>
            </div>
          </dl>
        </div>

        {/* Trend Card */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold">Movement Trend</h2>
          <dl className="space-y-3">
            <div className="flex justify-between border-b border-border pb-2">
              <dt className="text-muted-foreground">Status</dt>
              <dd id="trend-status">—</dd>
            </div>
            <div className="flex justify-between border-b border-border pb-2">
              <dt className="text-muted-foreground">Displacement</dt>
              <dd className="font-mono" id="trend-displacement">— km</dd>
            </div>
            <div className="flex justify-between border-b border-border pb-2">
              <dt className="text-muted-foreground">Interval</dt>
              <dd className="font-mono" id="trend-interval">— sec</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Avg Velocity</dt>
              <dd className="font-mono" id="trend-velocity">— km/h</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <button
          type="button"
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Fetch Latest
        </button>
        <button
          type="button"
          className="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent"
        >
          View Trend (240 points)
        </button>
      </div>

      {/* API Info */}
      <div className="rounded-lg border border-border bg-muted/50 p-4">
        <h3 className="mb-2 text-sm font-medium">API Endpoints</h3>
        <ul className="space-y-1 text-sm text-muted-foreground">
          <li>
            <code className="rounded bg-muted px-1">GET /last</code> — Latest ISS position
          </li>
          <li>
            <code className="rounded bg-muted px-1">GET /fetch</code> — Trigger fetch
          </li>
          <li>
            <code className="rounded bg-muted px-1">GET /iss/trend</code> — Movement trend
          </li>
        </ul>
      </div>
    </div>
  )
}
