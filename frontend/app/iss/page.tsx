"use client";

import { useISSData } from "@/hooks/use-iss-data";

export default function ISSPage() {
  const { position, trend, loading, error, refetch } = useISSData();

  const handleFetchLatest = () => {
    refetch();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
          Отслеживание МКС
        </h1>
        {loading && (
          <span className="text-sm text-primary animate-pulse">
            Обновление каждые 15 сек...
          </span>
        )}
      </div>

      {/* Error Banner */}
      {error && (
        <div className="rounded-xl bg-destructive/10 p-4 text-sm text-destructive border border-destructive/20 backdrop-blur-sm">
          {error}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Last Position Card */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all hover:bg-white/10">
          <h2 className="mb-4 text-lg font-semibold tracking-tight">Текущая позиция</h2>
          <dl className="space-y-3">
            <div className="flex justify-between border-b border-white/10 pb-2">
              <dt className="text-muted-foreground">Широта</dt>
              <dd className="font-mono" id="iss-lat">
                {position?.latitude?.toFixed(4) ?? "—"}°
              </dd>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-2">
              <dt className="text-muted-foreground">Долгота</dt>
              <dd className="font-mono" id="iss-lon">
                {position?.longitude?.toFixed(4) ?? "—"}°
              </dd>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-2">
              <dt className="text-muted-foreground">Высота</dt>
              <dd className="font-mono" id="iss-altitude">
                {position?.altitude?.toFixed(1) ?? "—"} км
              </dd>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-2">
              <dt className="text-muted-foreground">Скорость</dt>
              <dd className="font-mono" id="iss-velocity">
                {position?.velocity?.toFixed(0) ?? "—"} км/ч
              </dd>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-2">
              <dt className="text-muted-foreground">Видимость</dt>
              <dd className="font-mono">
                {position?.visibility === "daylight" ? "День" :
                 position?.visibility === "eclipsed" ? "Затенение" :
                 position?.visibility ?? "—"}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Время</dt>
              <dd className="font-mono text-sm" id="iss-timestamp">
                {position?.timestamp
                  ? new Date(position.timestamp).toLocaleString("ru-RU")
                  : "—"}
              </dd>
            </div>
          </dl>
        </div>

        {/* Trend Card */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all hover:bg-white/10">
          <h2 className="mb-4 text-lg font-semibold tracking-tight">Тренд движения</h2>
          <dl className="space-y-3">
            <div className="flex justify-between border-b border-white/10 pb-2">
              <dt className="text-muted-foreground">Статус</dt>
              <dd id="trend-status">
                {trend?.movement !== undefined ? (
                  <span
                    className={
                      trend.movement ? "text-green-400" : "text-yellow-400"
                    }
                  >
                    {trend.movement ? "Движется" : "Стационарно"}
                  </span>
                ) : (
                  "—"
                )}
              </dd>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-2">
              <dt className="text-muted-foreground">Перемещение</dt>
              <dd className="font-mono" id="trend-displacement">
                {trend?.delta_km?.toFixed(2) ?? "—"} км
              </dd>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-2">
              <dt className="text-muted-foreground">Интервал</dt>
              <dd className="font-mono" id="trend-interval">
                {trend?.dt_sec?.toFixed(0) ?? "—"} сек
              </dd>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-2">
              <dt className="text-muted-foreground">Ср. скорость</dt>
              <dd className="font-mono" id="trend-velocity">
                {trend?.velocity_kmh?.toFixed(0) ?? "—"} км/ч
              </dd>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-2">
              <dt className="text-muted-foreground">Откуда</dt>
              <dd className="font-mono text-xs">
                {trend?.from_lat !== undefined && trend?.from_lon !== undefined
                  ? `${trend.from_lat.toFixed(2)}°, ${trend.from_lon.toFixed(2)}°`
                  : "—"}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Куда</dt>
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
          className="rounded-full bg-primary px-6 py-2 text-sm font-medium text-primary-foreground shadow-[0_0_15px_-5px_var(--color-primary)] transition-all hover:bg-primary/90 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
        >
          {loading ? "Загрузка..." : "Обновить данные"}
        </button>
      </div>

    </div>
  );
}
