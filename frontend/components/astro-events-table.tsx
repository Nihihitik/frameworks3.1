"use client";

import { useState } from "react";
import { useAstroEvents } from "@/hooks/use-astro-events";

type AstroEvent = {
  type: string;
  name?: string;
  date?: string;
  time?: string;
  body?: string;
  altitude?: number;
  azimuth?: number;
  elongation?: number;
  magnitude?: number;
  extra?: Record<string, unknown>;
};

export function AstroEventsTable() {
  const [latitude, setLatitude] = useState(55.7558);
  const [longitude, setLongitude] = useState(37.6176);
  const [days, setDays] = useState(7);

  const { events, loading, error, refetch } = useAstroEvents({
    latitude,
    longitude,
    days,
  });

  const handleLoadEvents = () => {
    refetch();
  };

  // Extract events from the response - structure may vary based on API
  const extractEvents = (): AstroEvent[] => {
    if (!events) return [];

    // Handle different response structures
    if (Array.isArray(events)) {
      return events as AstroEvent[];
    }

    // If events is an object with data property
    if (events.data && Array.isArray(events.data)) {
      return events.data as AstroEvent[];
    }

    // If events has rows/items
    if (events.rows && Array.isArray(events.rows)) {
      return events.rows as AstroEvent[];
    }

    // Try to extract from nested structure
    const result: AstroEvent[] = [];
    for (const [key, value] of Object.entries(events)) {
      if (Array.isArray(value)) {
        for (const item of value) {
          result.push({ type: key, ...item });
        }
      } else if (typeof value === "object" && value !== null) {
        result.push({ type: key, ...(value as Record<string, unknown>) });
      }
    }
    return result;
  };

  const eventList = extractEvents();

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <label htmlFor="latitude" className="text-sm text-muted-foreground">
            Lat:
          </label>
          <input
            id="latitude"
            type="number"
            step="0.0001"
            value={latitude}
            onChange={(e) => setLatitude(Number(e.target.value))}
            className="w-28 rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="longitude" className="text-sm text-muted-foreground">
            Lon:
          </label>
          <input
            id="longitude"
            type="number"
            step="0.0001"
            value={longitude}
            onChange={(e) => setLongitude(Number(e.target.value))}
            className="w-28 rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="days" className="text-sm text-muted-foreground">
            Days:
          </label>
          <input
            id="days"
            type="number"
            min="1"
            max="30"
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="w-20 rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </div>
        <button
          type="button"
          onClick={handleLoadEvents}
          disabled={loading}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {loading ? "Loading..." : "Load Events"}
        </button>
      </div>

      {/* Error State */}
      {error && (
        <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex h-32 items-center justify-center">
          <div className="text-center text-muted-foreground">
            <div className="mb-2 animate-pulse">Loading events...</div>
          </div>
        </div>
      )}

      {/* Events Table */}
      {!loading && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Event
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Type
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Date
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Details
                </th>
              </tr>
            </thead>
            <tbody>
              {eventList.length === 0 ? (
                <tr className="border-b border-border">
                  <td
                    className="px-4 py-3 text-muted-foreground"
                    colSpan={4}
                  >
                    {events
                      ? "No events found for this location and time period."
                      : 'Click "Load Events" to fetch astronomy events.'}
                  </td>
                </tr>
              ) : (
                eventList.map((event, index) => (
                  <tr
                    key={`${event.type}-${event.date ?? index}`}
                    className="border-b border-border hover:bg-muted/50"
                  >
                    <td className="px-4 py-3">
                      {event.name || event.body || "Event"}
                    </td>
                    <td className="px-4 py-3 capitalize">{event.type}</td>
                    <td className="px-4 py-3">
                      {event.date || event.time || "-"}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {formatEventDetails(event)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Event Count */}
      {eventList.length > 0 && (
        <p className="text-xs text-muted-foreground">
          Found {eventList.length} events
        </p>
      )}
    </div>
  );
}

function formatEventDetails(event: AstroEvent): string {
  const details: string[] = [];

  if (event.altitude !== undefined) {
    details.push(`Alt: ${event.altitude.toFixed(1)}°`);
  }
  if (event.azimuth !== undefined) {
    details.push(`Az: ${event.azimuth.toFixed(1)}°`);
  }
  if (event.magnitude !== undefined) {
    details.push(`Mag: ${event.magnitude.toFixed(1)}`);
  }
  if (event.elongation !== undefined) {
    details.push(`Elong: ${event.elongation.toFixed(1)}°`);
  }

  return details.length > 0 ? details.join(", ") : "-";
}
