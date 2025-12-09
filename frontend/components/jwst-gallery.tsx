"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useJWSTData } from "@/hooks/use-jwst-data";
import { ChevronLeft, ChevronRight, RefreshCw, ChevronDown } from "lucide-react";

export function JWSTGallery() {
  const [source, setSource] = useState("all");
  const [instrument, setInstrument] = useState("all");
  const [perPage, setPerPage] = useState(12);
  const [scrollIndex, setScrollIndex] = useState(0);

  const { items, loading, error, refetch } = useJWSTData({
    source,
    instrument,
    perPage,
  });

  useEffect(() => {
    refetch();
  }, [refetch]);

  const handlePrev = () => {
    setScrollIndex((prev) => Math.max(0, prev - 3));
  };

  const handleNext = () => {
    const maxIndex = (items?.items?.length ?? 0) - 3;
    setScrollIndex((prev) => Math.min(maxIndex, prev + 3));
  };

  const visibleItems = items?.items?.slice(scrollIndex, scrollIndex + 6) ?? [];

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="relative">
          <select
            className="h-10 w-full appearance-none rounded-lg border border-white/10 bg-white/5 pl-4 pr-10 text-sm font-medium transition-colors hover:bg-white/10 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            value={source}
            onChange={(e) => {
              setSource(e.target.value);
              setScrollIndex(0);
            }}
          >
            <option value="all">Источник: Все</option>
            <option value="jpg">Источник: JPG</option>
            <option value="suffix">Источник: Suffix</option>
            <option value="program">Источник: Program</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        </div>

        <div className="relative">
          <select
            className="h-10 w-full appearance-none rounded-lg border border-white/10 bg-white/5 pl-4 pr-10 text-sm font-medium transition-colors hover:bg-white/10 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            value={instrument}
            onChange={(e) => {
              setInstrument(e.target.value);
              setScrollIndex(0);
            }}
          >
            <option value="all">Все инструменты</option>
            <option value="NIRCam">NIRCam</option>
            <option value="MIRI">MIRI</option>
            <option value="NIRISS">NIRISS</option>
            <option value="NIRSpec">NIRSpec</option>
            <option value="FGS">FGS</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        </div>

        <div className="relative">
          <select
            className="h-10 w-full appearance-none rounded-lg border border-white/10 bg-white/5 pl-4 pr-10 text-sm font-medium transition-colors hover:bg-white/10 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            value={perPage}
            onChange={(e) => {
              setPerPage(Number(e.target.value));
              setScrollIndex(0);
            }}
          >
            <option value="12">12 на странице</option>
            <option value="24">24 на странице</option>
            <option value="48">48 на странице</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        </div>

        <button
          type="button"
          onClick={() => refetch()}
          disabled={loading}
          className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground shadow-[0_0_15px_-5px_var(--color-primary)] transition-all hover:bg-primary/90 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          {loading ? "Загрузка..." : "Обновить"}
        </button>
      </div>

      {/* Error State */}
      {error && (
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive backdrop-blur-sm">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && !items && (
        <div className="flex h-48 items-center justify-center">
          <div className="text-center text-muted-foreground">
            <div className="mb-2 text-3xl animate-pulse">🔭</div>
            <p className="text-sm">Загрузка снимков JWST...</p>
          </div>
        </div>
      )}

      {/* Gallery Carousel */}
      {items && items.items && items.items.length > 0 && (
        <div className="relative group">
          <button
            type="button"
            onClick={handlePrev}
            disabled={scrollIndex === 0}
            className="absolute -left-4 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/10 bg-black/50 p-2 text-white backdrop-blur-md transition-all hover:bg-primary hover:border-primary hover:scale-110 disabled:opacity-0"
            aria-label="Назад"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <div className="mx-0 overflow-hidden rounded-xl">
            <div className="flex gap-4 pb-2 transition-transform duration-500 ease-out">
              {visibleItems.map((item, i) => (
                <div
                  key={`${item.url}-${i}`}
                  className="group/item relative flex h-64 w-64 flex-shrink-0 flex-col overflow-hidden rounded-xl border border-white/10 bg-white/5 transition-all hover:border-primary/50"
                >
                  <div className="relative h-full w-full">
                    <Image
                      src={item.url}
                      alt={item.caption || "Снимок JWST"}
                      fill
                      className="object-cover transition-transform duration-700 group-hover/item:scale-110"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover/item:opacity-100" />

                    <div className="absolute bottom-0 left-0 right-0 translate-y-full p-4 transition-transform duration-300 group-hover/item:translate-y-0">
                      <p className="line-clamp-2 text-sm font-medium text-white">
                        {item.caption || item.instrument || "Снимок JWST"}
                      </p>
                      {item.instrument && (
                        <p className="mt-1 text-xs text-white/70">
                          {item.instrument}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={handleNext}
            disabled={scrollIndex >= (items.items.length ?? 0) - 3}
            className="absolute -right-4 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/10 bg-black/50 p-2 text-white backdrop-blur-md transition-all hover:bg-primary hover:border-primary hover:scale-110 disabled:opacity-0"
            aria-label="Вперёд"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      )}

      {/* Empty State */}
      {items && (!items.items || items.items.length === 0) && (
        <div className="flex h-48 items-center justify-center rounded-lg bg-muted">
          <div className="text-center text-muted-foreground">
            <div className="mb-2 text-3xl">🔭</div>
            <p className="text-sm">Снимки не найдены</p>
            <p className="text-xs">Попробуйте изменить фильтры</p>
          </div>
        </div>
      )}

      {/* Count */}
      {items && items.count !== undefined && (
        <p className="text-xs text-muted-foreground">
          Показано {visibleItems.length} из {items.count} снимков
        </p>
      )}
    </div>
  );
}
