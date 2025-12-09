"use client";

import { MetricCard } from "@/components/metric-card";
import { ISSMap } from "@/components/iss-map";
import { SpeedChart } from "@/components/speed-chart";
import { AltitudeChart } from "@/components/altitude-chart";
import { JWSTGallery } from "@/components/jwst-gallery";
import { AstroEventsTable } from "@/components/astro-events-table";
import { useISSData } from "@/hooks/use-iss-data";

export default function DashboardPage() {
  const { issData, trendData, loading, error } = useISSData();

  // Extract position from payload
  const position = issData?.payload;

  // We don't have historical data endpoint yet, so use empty arrays
  const speedData: Array<{ time: string; velocity: number }> = [];
  const altitudeData: Array<{ time: string; altitude: number }> = [];
  const trail: [number, number][] = [];

  return (
    <div className="space-y-6">
      {/* Error Banner */}
      {error && (
        <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <MetricCard
          title="ISS Speed"
          value={position?.velocity?.toFixed(0) ?? "—"}
          unit="km/h"
          id="iss-speed"
        />
        <MetricCard
          title="ISS Altitude"
          value={position?.altitude?.toFixed(1) ?? "—"}
          unit="km"
          id="iss-altitude"
        />
        <MetricCard
          title="Latitude"
          value={position?.latitude?.toFixed(4) ?? "—"}
          unit="°"
          id="iss-lat"
        />
        <MetricCard
          title="Longitude"
          value={position?.longitude?.toFixed(4) ?? "—"}
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
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">ISS Position</h2>
              {loading && (
                <span className="text-xs text-muted-foreground animate-pulse">
                  Updating...
                </span>
              )}
            </div>
            <ISSMap
              latitude={position?.latitude}
              longitude={position?.longitude}
              altitude={position?.altitude}
              trail={trail}
            />
          </div>

          {/* Speed Chart */}
          <div className="rounded-lg border border-border bg-card p-4">
            <h2 className="mb-4 text-lg font-semibold">Speed Trend</h2>
            <SpeedChart data={speedData} />
          </div>

          {/* Altitude Chart */}
          <div className="rounded-lg border border-border bg-card p-4">
            <h2 className="mb-4 text-lg font-semibold">Altitude Trend</h2>
            <AltitudeChart data={altitudeData} />
          </div>
        </div>
      </div>

      {/* JWST Gallery - Full Width */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="mb-4 text-lg font-semibold">JWST Gallery</h2>
        <JWSTGallery />
      </div>
    </div>
  );
}
