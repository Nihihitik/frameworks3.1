import { MetricCard } from "@/components/metric-card"
import { ISSMap } from "@/components/iss-map"
import { SpeedChart } from "@/components/speed-chart"
import { AltitudeChart } from "@/components/altitude-chart"
import { JWSTGallery } from "@/components/jwst-gallery"
import { AstroEventsTable } from "@/components/astro-events-table"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <MetricCard
          title="ISS Speed"
          value="—"
          unit="km/h"
          id="iss-speed"
        />
        <MetricCard
          title="ISS Altitude"
          value="—"
          unit="km"
          id="iss-altitude"
        />
        <MetricCard
          title="Latitude"
          value="—"
          unit="°"
          id="iss-lat"
        />
        <MetricCard
          title="Longitude"
          value="—"
          unit="°"
          id="iss-lon"
        />
      </div>

      {/* Main Grid: Left (7/12) + Right (5/12) */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left Column */}
        <div className="space-y-6 lg:col-span-7">
          {/* JWST Observation Summary */}
          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="mb-4 text-lg font-semibold">JWST Observations</h2>
            <p className="text-muted-foreground">
              Latest images from James Webb Space Telescope
            </p>
          </div>

          {/* Astronomy Events Table */}
          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="mb-4 text-lg font-semibold">Astronomy Events</h2>
            <AstroEventsTable />
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6 lg:col-span-5">
          {/* ISS Map */}
          <div className="rounded-lg border border-border bg-card p-4">
            <h2 className="mb-4 text-lg font-semibold">ISS Position</h2>
            <ISSMap />
          </div>

          {/* Speed Chart */}
          <div className="rounded-lg border border-border bg-card p-4">
            <h2 className="mb-4 text-lg font-semibold">Speed Trend</h2>
            <SpeedChart />
          </div>

          {/* Altitude Chart */}
          <div className="rounded-lg border border-border bg-card p-4">
            <h2 className="mb-4 text-lg font-semibold">Altitude Trend</h2>
            <AltitudeChart />
          </div>
        </div>
      </div>

      {/* JWST Gallery - Full Width */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="mb-4 text-lg font-semibold">JWST Gallery</h2>
        <JWSTGallery />
      </div>
    </div>
  )
}
