"use client";

import Image from "next/image";
import { useSpaceData } from "@/hooks/use-space-data";
import type { NEOData } from "@/lib/types";

export function SpaceDataCards() {
  const { summary, loading } = useSpaceData();

  const apod = summary?.apod?.payload;
  const neoPayload = summary?.neo?.payload;
  const flrPayload = summary?.flr?.payload;
  const spacex = summary?.spacex?.payload;

  const neoStats = calculateNEOStats(neoPayload?.near_earth_objects);

  const latestFlare = Array.isArray(flrPayload) && flrPayload.length > 0
    ? flrPayload[flrPayload.length - 1]
    : null;

  if (loading && !summary) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-48 animate-pulse rounded-xl border border-white/10 bg-white/5"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold tracking-tight">Данные космоса</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* APOD Card */}
        <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-md transition-all hover:bg-white/10">
          {apod?.url && apod.media_type === "image" ? (
            <div className="relative h-32 w-full">
              <Image
                src={apod.url}
                alt={apod.title || "APOD"}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          ) : (
            <div className="flex h-32 items-center justify-center bg-gradient-to-br from-orange-500/20 to-yellow-500/20">
              <span className="text-4xl">NASA</span>
            </div>
          )}
          <div className="p-4">
            <h3 className="font-semibold truncate">
              {apod?.title || "Изображение дня"}
            </h3>
            <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
              {apod?.explanation?.slice(0, 100) || "NASA Astronomy Picture of the Day"}...
            </p>
          </div>
        </div>

        {/* NEO Card */}
        <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-md transition-all hover:bg-white/10">
          <div className="flex items-start gap-3">
            <span className="text-2xl">NEO</span>
            <div>
              <h3 className="font-semibold">Объекты у Земли</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Близкие сближения сегодня
              </p>
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold">{neoStats.total}</div>
            <div className="text-sm text-muted-foreground">астероидов</div>
          </div>
          {neoStats.hazardous > 0 && (
            <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-red-500/20 px-3 py-1 text-xs text-red-400">
              <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
              {neoStats.hazardous} потенциально опасных
            </div>
          )}
        </div>

        {/* Solar Activity Card */}
        <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-md transition-all hover:bg-white/10">
          <div className="flex items-start gap-3">
            <span className="text-2xl">SUN</span>
            <div>
              <h3 className="font-semibold">Солнечная активность</h3>
            </div>
          </div>
          <div className="mt-4">
            {latestFlare ? (
              <>
                <div className="text-lg font-medium">
                  Класс {latestFlare.classType}
                </div>
                <div className="text-sm text-muted-foreground">
                  {latestFlare.beginTime
                    ? new Date(latestFlare.beginTime).toLocaleDateString("ru-RU")
                    : "-"}
                </div>
                {latestFlare.sourceLocation && (
                  <div className="mt-2 text-xs text-muted-foreground">
                    Источник: {latestFlare.sourceLocation}
                  </div>
                )}
              </>
            ) : (
              <div className="text-muted-foreground">
                Нет свежих событий
              </div>
            )}
          </div>
        </div>

        {/* SpaceX Card */}
        <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-md transition-all hover:bg-white/10">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <span className="text-2xl">SpX</span>
              <div>
                <h3 className="font-semibold">SpaceX</h3>
              </div>
            </div>
            {spacex?.upcoming && (
              <span className="rounded-full bg-primary/20 px-2 py-0.5 text-xs font-medium text-primary">
                Скоро
              </span>
            )}
          </div>
          <div className="mt-4">
            {spacex ? (
              <>
                <div className="font-medium">{spacex.name}</div>
                <div className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                  {spacex.date_utc
                    ? new Date(spacex.date_utc).toLocaleDateString("ru-RU", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "-"}
                </div>
                {spacex.links?.webcast && (
                  <a
                    href={spacex.links.webcast}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1 text-sm text-primary hover:underline"
                  >
                    Смотреть трансляцию
                  </a>
                )}
              </>
            ) : (
              <div className="text-muted-foreground">
                Нет данных о запусках
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function calculateNEOStats(nearEarthObjects?: Record<string, NEOData[]>): {
  total: number;
  hazardous: number;
} {
  if (!nearEarthObjects) {
    return { total: 0, hazardous: 0 };
  }

  let total = 0;
  let hazardous = 0;

  for (const objects of Object.values(nearEarthObjects)) {
    for (const obj of objects) {
      total++;
      if (obj.is_potentially_hazardous_asteroid) {
        hazardous++;
      }
    }
  }

  return { total, hazardous };
}
