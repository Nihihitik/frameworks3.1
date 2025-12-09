# ISS Map and Chart Components Usage Guide

All components have been successfully created and are ready to use. Here's how to integrate them into your Space Dashboard.

## Created Files

### Components
- `/Users/nihihitik/Projects/framework3.1/project/frontend/components/iss-map-client.tsx` - Internal Leaflet map component (client-only)
- `/Users/nihihitik/Projects/framework3.1/project/frontend/components/iss-map.tsx` - Wrapper with dynamic import (SSR-safe)
- `/Users/nihihitik/Projects/framework3.1/project/frontend/components/speed-chart.tsx` - ISS velocity chart
- `/Users/nihihitik/Projects/framework3.1/project/frontend/components/altitude-chart.tsx` - ISS altitude chart

### Hooks
- `/Users/nihihitik/Projects/framework3.1/project/frontend/hooks/use-jwst-data.ts` - JWST gallery data fetcher
- `/Users/nihihitik/Projects/framework3.1/project/frontend/hooks/use-astro-events.ts` - Astronomy events fetcher

## Usage Examples

### 1. ISS Map Component

```typescript
"use client";

import { ISSMap } from "@/components/iss-map";
import { useISSData } from "@/hooks/use-iss-data";

export function ISSTracker() {
  const { issData, loading, error } = useISSData();

  if (loading) return <div>Loading ISS position...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">ISS Live Tracker</h2>
      <ISSMap
        latitude={issData?.payload.latitude}
        longitude={issData?.payload.longitude}
        altitude={issData?.payload.altitude}
        // Optional: pass trail data for polyline
        // trail={[[lat1, lon1], [lat2, lon2], ...]}
      />
    </div>
  );
}
```

### 2. Speed Chart Component

```typescript
"use client";

import { SpeedChart } from "@/components/speed-chart";
import { useState, useEffect } from "react";

export function VelocityMonitor() {
  const [velocityData, setVelocityData] = useState([
    { time: "10:00", velocity: 27580 },
    { time: "10:05", velocity: 27585 },
    { time: "10:10", velocity: 27575 },
    // ... more data points
  ]);

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">ISS Velocity</h3>
      <SpeedChart data={velocityData} />
    </div>
  );
}
```

### 3. Altitude Chart Component

```typescript
"use client";

import { AltitudeChart } from "@/components/altitude-chart";

export function AltitudeMonitor() {
  const altitudeData = [
    { time: "10:00", altitude: 408.5 },
    { time: "10:05", altitude: 408.7 },
    { time: "10:10", altitude: 408.6 },
    // ... more data points
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">ISS Altitude</h3>
      <AltitudeChart data={altitudeData} />
    </div>
  );
}
```

### 4. JWST Data Hook

```typescript
"use client";

import { useJWSTData } from "@/hooks/use-jwst-data";
import { useEffect } from "react";

export function JWSTGallery() {
  const { items, loading, error, refetch } = useJWSTData({
    source: "all",
    instrument: "all",
    perPage: 12,
  });

  // Fetch on mount
  useEffect(() => {
    refetch();
  }, [refetch]);

  if (loading) return <div>Loading JWST images...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="grid grid-cols-3 gap-4">
      {items?.items.map((item) => (
        <div key={item.id} className="rounded-lg overflow-hidden">
          <img src={item.thumbnail} alt={item.observation_id} />
          <p className="text-sm">{item.details.description}</p>
        </div>
      ))}
    </div>
  );
}
```

### 5. Astronomy Events Hook

```typescript
"use client";

import { useAstroEvents } from "@/hooks/use-astro-events";
import { useEffect } from "react";

export function AstronomyCalendar() {
  const { events, loading, error, refetch } = useAstroEvents({
    latitude: 55.7558, // Moscow coordinates
    longitude: 37.6173,
    days: 7,
  });

  useEffect(() => {
    refetch();
  }, [refetch]);

  if (loading) return <div>Loading astronomy events...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-2">
      <h3 className="text-xl font-semibold">Upcoming Events</h3>
      {/* Render events table data */}
      <pre>{JSON.stringify(events?.data, null, 2)}</pre>
    </div>
  );
}
```

### 6. Complete Dashboard Example

```typescript
"use client";

import { ISSMap } from "@/components/iss-map";
import { SpeedChart } from "@/components/speed-chart";
import { AltitudeChart } from "@/components/altitude-chart";
import { useISSData } from "@/hooks/use-iss-data";
import { useState, useEffect } from "react";

export default function DashboardPage() {
  const { issData, trendData, loading, error } = useISSData();
  const [velocityHistory, setVelocityHistory] = useState<Array<{ time: string; velocity: number }>>([]);
  const [altitudeHistory, setAltitudeHistory] = useState<Array<{ time: string; altitude: number }>>([]);

  // Update history when new data arrives
  useEffect(() => {
    if (issData) {
      const timestamp = new Date().toLocaleTimeString();

      setVelocityHistory(prev => [
        ...prev.slice(-19), // Keep last 20 points
        { time: timestamp, velocity: issData.payload.velocity }
      ]);

      setAltitudeHistory(prev => [
        ...prev.slice(-19),
        { time: timestamp, altitude: issData.payload.altitude }
      ]);
    }
  }, [issData]);

  if (loading && !issData) {
    return <div className="p-8">Loading ISS data...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-8 space-y-8">
      <h1 className="text-4xl font-bold">Space Dashboard</h1>

      {/* ISS Position */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">ISS Live Position</h2>
        <ISSMap
          latitude={issData?.payload.latitude}
          longitude={issData?.payload.longitude}
          altitude={issData?.payload.altitude}
        />

        {/* ISS Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-card">
            <p className="text-sm text-muted-foreground">Latitude</p>
            <p className="text-2xl font-bold">{issData?.payload.latitude.toFixed(4)}°</p>
          </div>
          <div className="p-4 rounded-lg bg-card">
            <p className="text-sm text-muted-foreground">Longitude</p>
            <p className="text-2xl font-bold">{issData?.payload.longitude.toFixed(4)}°</p>
          </div>
          <div className="p-4 rounded-lg bg-card">
            <p className="text-sm text-muted-foreground">Altitude</p>
            <p className="text-2xl font-bold">{issData?.payload.altitude.toFixed(2)} km</p>
          </div>
        </div>
      </section>

      {/* Charts */}
      <section className="grid md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-semibold mb-4">Velocity</h3>
          <SpeedChart data={velocityHistory} />
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-4">Altitude</h3>
          <AltitudeChart data={altitudeHistory} />
        </div>
      </section>

      {/* Trend Data */}
      {trendData && (
        <section className="p-4 rounded-lg bg-card">
          <h3 className="text-xl font-semibold mb-2">Movement Trend</h3>
          <p>Direction: {trendData.movement}</p>
          <p>Distance: {trendData.delta_km.toFixed(2)} km</p>
          <p>Velocity: {trendData.velocity_kmh.toFixed(2)} km/h</p>
        </section>
      )}
    </div>
  );
}
```

## Features

### ISS Map (`iss-map.tsx`)
- SSR-safe with dynamic import
- Custom ISS satellite icon (🛰️)
- Interactive popup with position details
- Optional trail visualization (polyline)
- Auto-centers on ISS position
- OpenStreetMap tiles
- Loading state with skeleton

### Speed Chart (`speed-chart.tsx`)
- Blue line chart for velocity data
- Time-based x-axis
- Responsive and interactive
- Chart.js powered
- Smooth animations

### Altitude Chart (`altitude-chart.tsx`)
- Green line chart for altitude data
- Time-based x-axis
- Responsive and interactive
- Chart.js powered
- Smooth animations

### JWST Hook (`use-jwst-data.ts`)
- Fetch James Webb telescope images
- Filter by source and instrument
- Configurable pagination
- Error handling
- Loading states

### Astro Events Hook (`use-astro-events.ts`)
- Fetch astronomy events for location
- Configurable coordinates
- Configurable time range (days)
- Error handling
- Loading states

## Technical Notes

1. **SSR Compatibility**: The ISS map uses dynamic import with `ssr: false` to prevent server-side rendering issues with Leaflet.

2. **Leaflet Icons**: The map includes a custom ISS icon. Default Leaflet marker icons are loaded from CDN to fix Next.js bundling issues.

3. **Chart.js Setup**: Both chart components register required Chart.js modules at import time.

4. **Type Safety**: All components and hooks are fully typed with TypeScript.

5. **Linting**: All code passes Ultracite (Biome) linting checks.

6. **Error Handling**: Components gracefully handle missing/loading data with placeholder states.

## Dependencies

All required dependencies are already installed:
- `leaflet` - Map library
- `react-leaflet` - React bindings for Leaflet
- `chart.js` - Charting library
- `react-chartjs-2` - React bindings for Chart.js

## Next Steps

1. Import these components into your dashboard pages
2. Connect them to the ISS data hooks
3. Customize styling to match your design system
4. Add more features like:
   - Historical trail data
   - Orbit predictions
   - Multiple satellite tracking
   - Custom map markers
   - Export chart data
