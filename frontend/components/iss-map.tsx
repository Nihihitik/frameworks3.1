"use client"

export function ISSMap() {
  return (
    <div className="relative h-64 w-full overflow-hidden rounded-md bg-muted">
      <div className="flex h-full items-center justify-center text-muted-foreground">
        <div className="text-center">
          <div className="mb-2 text-4xl">🛰️</div>
          <p className="text-sm">ISS Map</p>
          <p className="text-xs">Leaflet map will be rendered here</p>
        </div>
      </div>
    </div>
  )
}
