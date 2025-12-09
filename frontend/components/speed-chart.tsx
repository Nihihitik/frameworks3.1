"use client"

export function SpeedChart() {
  return (
    <div className="relative h-48 w-full overflow-hidden rounded-md bg-muted">
      <div className="flex h-full items-center justify-center text-muted-foreground">
        <div className="text-center">
          <div className="mb-2 text-2xl">📈</div>
          <p className="text-sm">Speed Chart</p>
          <p className="text-xs">Chart.js will render here</p>
        </div>
      </div>
    </div>
  )
}
