"use client"

import { useState } from "react"

interface OSDRItem {
  id: number
  dataset_id: string
  title: string
  status: string
  updated_at: string
  inserted_at: string
  raw: Record<string, unknown>
}

export default function OSDRPage() {
  const [expandedId, setExpandedId] = useState<number | null>(null)

  // Placeholder data - will be replaced with API call
  const items: OSDRItem[] = []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">NASA OSDR</h1>
        <button
          type="button"
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Sync Data
        </button>
      </div>

      <p className="text-muted-foreground">
        Open Science Data Repository — NASA&apos;s collection of space biology datasets
      </p>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">#</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Dataset ID</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Title</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Updated</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                  No datasets loaded. Click &quot;Sync Data&quot; to fetch from OSDR.
                </td>
              </tr>
            ) : (
              items.map((item, index) => (
                <>
                  <tr key={item.id} className="border-t border-border hover:bg-muted/30">
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3 font-mono text-xs">{item.dataset_id}</td>
                    <td className="px-4 py-3">{item.title}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-800 dark:bg-green-900 dark:text-green-200">
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {new Date(item.updated_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                        className="text-primary hover:underline"
                      >
                        {expandedId === item.id ? "Hide" : "Show"} JSON
                      </button>
                    </td>
                  </tr>
                  {expandedId === item.id && (
                    <tr key={`${item.id}-expanded`}>
                      <td colSpan={6} className="bg-muted/30 px-4 py-3">
                        <pre className="max-h-64 overflow-auto rounded bg-muted p-3 text-xs">
                          {JSON.stringify(item.raw, null, 2)}
                        </pre>
                      </td>
                    </tr>
                  )}
                </>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* API Info */}
      <div className="rounded-lg border border-border bg-muted/50 p-4">
        <h3 className="mb-2 text-sm font-medium">API Endpoints</h3>
        <ul className="space-y-1 text-sm text-muted-foreground">
          <li>
            <code className="rounded bg-muted px-1">GET /osdr/sync</code> — Trigger sync
          </li>
          <li>
            <code className="rounded bg-muted px-1">GET /osdr/list</code> — List datasets (paginated)
          </li>
        </ul>
      </div>
    </div>
  )
}
