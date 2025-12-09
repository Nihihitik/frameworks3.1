"use client"

export function AstroEventsTable() {
  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <input
          type="number"
          placeholder="Latitude"
          defaultValue="55.7558"
          className="w-32 rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
        <input
          type="number"
          placeholder="Longitude"
          defaultValue="37.6176"
          className="w-32 rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
        <input
          type="number"
          placeholder="Days"
          defaultValue="7"
          className="w-24 rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
        <button
          type="button"
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Load Events
        </button>
      </div>

      {/* Events Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Event</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Type</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Date</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Details</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border">
              <td className="px-4 py-3 text-muted-foreground" colSpan={4}>
                No events loaded. Click "Load Events" to fetch astronomy events.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
