"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useJWSTData } from "@/hooks/use-jwst-data";

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
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <select
          className="rounded-md border border-input bg-background px-3 py-2 text-sm"
          value={source}
          onChange={(e) => {
            setSource(e.target.value);
            setScrollIndex(0);
          }}
        >
          <option value="all">Source: All</option>
          <option value="jpg">Source: JPG</option>
          <option value="suffix">Source: Suffix</option>
          <option value="program">Source: Program</option>
        </select>
        <select
          className="rounded-md border border-input bg-background px-3 py-2 text-sm"
          value={instrument}
          onChange={(e) => {
            setInstrument(e.target.value);
            setScrollIndex(0);
          }}
        >
          <option value="all">All Instruments</option>
          <option value="NIRCam">NIRCam</option>
          <option value="MIRI">MIRI</option>
          <option value="NIRISS">NIRISS</option>
          <option value="NIRSpec">NIRSpec</option>
          <option value="FGS">FGS</option>
        </select>
        <select
          className="rounded-md border border-input bg-background px-3 py-2 text-sm"
          value={perPage}
          onChange={(e) => {
            setPerPage(Number(e.target.value));
            setScrollIndex(0);
          }}
        >
          <option value="12">12 per page</option>
          <option value="24">24 per page</option>
          <option value="48">48 per page</option>
        </select>
        <button
          type="button"
          onClick={() => refetch()}
          disabled={loading}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {/* Error State */}
      {error && (
        <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && !items && (
        <div className="flex h-48 items-center justify-center">
          <div className="text-center text-muted-foreground">
            <div className="mb-2 text-3xl animate-pulse">🔭</div>
            <p className="text-sm">Loading JWST images...</p>
          </div>
        </div>
      )}

      {/* Gallery Carousel */}
      {items && items.items && items.items.length > 0 && (
        <div className="relative">
          <button
            type="button"
            onClick={handlePrev}
            disabled={scrollIndex === 0}
            className="absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-background/80 p-2 shadow-md hover:bg-background disabled:opacity-50"
            aria-label="Previous"
          >
            ◀
          </button>

          <div className="mx-8 overflow-hidden">
            <div className="flex gap-4 pb-4">
              {visibleItems.map((item, i) => (
                <div
                  key={`${item.url}-${i}`}
                  className="flex h-48 w-64 flex-shrink-0 flex-col overflow-hidden rounded-lg bg-muted"
                >
                  <div className="relative h-36 w-full">
                    <Image
                      src={item.url}
                      alt={item.caption || "JWST Image"}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="flex-1 p-2">
                    <p className="truncate text-xs text-muted-foreground">
                      {item.caption || item.instrument || "JWST Image"}
                    </p>
                    {item.instrument && (
                      <p className="text-xs text-muted-foreground/70">
                        {item.instrument}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={handleNext}
            disabled={scrollIndex >= (items.items.length ?? 0) - 3}
            className="absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-background/80 p-2 shadow-md hover:bg-background disabled:opacity-50"
            aria-label="Next"
          >
            ▶
          </button>
        </div>
      )}

      {/* Empty State */}
      {items && (!items.items || items.items.length === 0) && (
        <div className="flex h-48 items-center justify-center rounded-lg bg-muted">
          <div className="text-center text-muted-foreground">
            <div className="mb-2 text-3xl">🔭</div>
            <p className="text-sm">No images found</p>
            <p className="text-xs">Try changing the filters</p>
          </div>
        </div>
      )}

      {/* Count */}
      {items && items.count !== undefined && (
        <p className="text-xs text-muted-foreground">
          Showing {visibleItems.length} of {items.count} images
        </p>
      )}
    </div>
  );
}
