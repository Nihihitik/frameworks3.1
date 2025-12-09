"use client"

export function JWSTGallery() {
  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <select className="rounded-md border border-input bg-background px-3 py-2 text-sm">
          <option value="jpg">Source: JPG</option>
          <option value="suffix">Source: Suffix</option>
          <option value="program">Source: Program</option>
        </select>
        <select className="rounded-md border border-input bg-background px-3 py-2 text-sm">
          <option value="">All Instruments</option>
          <option value="NIRCam">NIRCam</option>
          <option value="MIRI">MIRI</option>
          <option value="NIRISS">NIRISS</option>
          <option value="NIRSpec">NIRSpec</option>
          <option value="FGS">FGS</option>
        </select>
        <select className="rounded-md border border-input bg-background px-3 py-2 text-sm">
          <option value="24">24 per page</option>
          <option value="48">48 per page</option>
          <option value="96">96 per page</option>
        </select>
      </div>

      {/* Gallery Carousel */}
      <div className="relative">
        <button
          type="button"
          className="absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-background/80 p-2 shadow-md hover:bg-background"
          aria-label="Previous"
        >
          ◀
        </button>

        <div className="mx-8 overflow-hidden">
          <div className="flex gap-4 overflow-x-auto pb-4">
            {/* Placeholder items */}
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="flex h-48 w-64 flex-shrink-0 items-center justify-center rounded-lg bg-muted"
              >
                <div className="text-center text-muted-foreground">
                  <div className="mb-2 text-3xl">🔭</div>
                  <p className="text-xs">JWST Image {i + 1}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          className="absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-background/80 p-2 shadow-md hover:bg-background"
          aria-label="Next"
        >
          ▶
        </button>
      </div>
    </div>
  )
}
