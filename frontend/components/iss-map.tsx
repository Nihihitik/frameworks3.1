"use client";

import dynamic from "next/dynamic";

const ISSMapClient = dynamic(() => import("./iss-map-client"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full min-h-[400px] w-full animate-pulse items-center justify-center rounded-md bg-muted">
      <div className="text-center text-muted-foreground">
        <div className="mb-2 text-4xl">🛰️</div>
        <p className="text-sm">Загрузка карты...</p>
      </div>
    </div>
  ),
});

export type ISSMapProps = {
  latitude?: number;
  longitude?: number;
  altitude?: number;
  trail?: [number, number][];
};

export function ISSMap({ latitude, longitude, altitude, trail }: ISSMapProps) {
  // Show placeholder if no data
  if (
    latitude === undefined ||
    longitude === undefined ||
    altitude === undefined
  ) {
    return (
      <div className="relative h-64 w-full overflow-hidden rounded-md bg-muted">
        <div className="flex h-full items-center justify-center text-muted-foreground">
          <div className="text-center">
            <div className="mb-2 text-4xl">🛰️</div>
            <p className="text-sm">Карта МКС</p>
            <p className="text-xs">Ожидание данных о позиции...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden rounded-md">
      <ISSMapClient
        altitude={altitude}
        latitude={latitude}
        longitude={longitude}
        trail={trail}
      />
    </div>
  );
}
