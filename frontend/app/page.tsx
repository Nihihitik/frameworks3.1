"use client";

import { MetricCard } from "@/components/metric-card";
import { ISSMap } from "@/components/iss-map";
import { SpeedChart } from "@/components/speed-chart";
import { AltitudeChart } from "@/components/altitude-chart";
import { JWSTGallery } from "@/components/jwst-gallery";
import { AstroEventsTable } from "@/components/astro-events-table";
import { SpaceDataCards } from "@/components/space-data-cards";
import { useISSData } from "@/hooks/use-iss-data";

export default function DashboardPage() {
  const { position, history, loading, error } = useISSData();

  // Prepare chart data from history
  const speedData = history.map((item) => ({
    time: new Date(item.timestamp).toLocaleTimeString("ru-RU"),
    velocity: item.velocity,
  }));

  const altitudeData = history.map((item) => ({
    time: new Date(item.timestamp).toLocaleTimeString("ru-RU"),
    altitude: item.altitude,
  }));

  // Prepare trail for map
  const trail: [number, number][] = history.map((item) => [
    item.latitude,
    item.longitude,
  ]);

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl bg-gradient-to-r from-white via-white/80 to-white/40 bg-clip-text text-transparent">
          Центр управления
        </h1>
        <p className="text-lg text-muted-foreground">
          Мониторинг космических объектов в реальном времени
        </p>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive backdrop-blur-sm">
          {error}
        </div>
      )}

      {/* Space Data Cards */}
      <SpaceDataCards />

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <MetricCard
          title="Скорость МКС"
          value={position?.velocity?.toFixed(0) ?? "—"}
          unit="км/ч"
          id="iss-speed"
        />
        <MetricCard
          title="Высота МКС"
          value={position?.altitude?.toFixed(1) ?? "—"}
          unit="км"
          id="iss-altitude"
        />
        <MetricCard
          title="Широта"
          value={position?.latitude?.toFixed(4) ?? "—"}
          unit="°"
          id="iss-lat"
        />
        <MetricCard
          title="Долгота"
          value={position?.longitude?.toFixed(4) ?? "—"}
          unit="°"
          id="iss-lon"
        />
      </div>

      {/* Main Grid: Left (7/12) + Right (5/12) */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left Column */}
        <div className="space-y-6 lg:col-span-7">
          {/* JWST Gallery */}
          <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all hover:bg-white/10">
            <h2 className="mb-4 text-xl font-semibold tracking-tight">Галерея JWST</h2>
            <JWSTGallery />
          </div>

          {/* Astronomy Events Table */}
          <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all hover:bg-white/10">
            <h2 className="mb-4 text-xl font-semibold tracking-tight">Астрономические события</h2>
            <AstroEventsTable />
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6 lg:col-span-5">
          {/* ISS Map */}
          <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-md transition-all hover:bg-white/10">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold tracking-tight">Позиция МКС</h2>
              {loading && (
                <span className="flex items-center gap-2 text-xs text-primary animate-pulse">
                  <span className="h-2 w-2 rounded-full bg-primary" />
                  Обновление...
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
          <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-md transition-all hover:bg-white/10">
            <h2 className="mb-4 text-xl font-semibold tracking-tight">График скорости</h2>
            <SpeedChart data={speedData} />
          </div>

          {/* Altitude Chart */}
          <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-md transition-all hover:bg-white/10">
            <h2 className="mb-4 text-xl font-semibold tracking-tight">График высоты</h2>
            <AltitudeChart data={altitudeData} />
          </div>
        </div>
      </div>

    </div>
  );
}
