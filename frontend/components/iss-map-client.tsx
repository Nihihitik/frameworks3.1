"use client";

import L from "leaflet";
import { useEffect } from "react";
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Custom ISS icon
const issIcon = L.divIcon({
  html: `<div style="font-size: 24px;">🛰️</div>`,
  className: "iss-icon",
  iconSize: [30, 30],
  iconAnchor: [15, 15],
  popupAnchor: [0, -15],
});

type MapUpdaterProps = {
  latitude: number;
  longitude: number;
};

// Component to update map center when ISS position changes
function MapUpdater({ latitude, longitude }: MapUpdaterProps) {
  const map = useMap();

  useEffect(() => {
    map.setView([latitude, longitude], map.getZoom(), {
      animate: true,
    });
  }, [latitude, longitude, map]);

  return null;
}

export type ISSMapClientProps = {
  latitude: number;
  longitude: number;
  altitude: number;
  trail?: [number, number][];
};

export default function ISSMapClient({
  latitude,
  longitude,
  altitude,
  trail,
}: ISSMapClientProps) {
  return (
    <MapContainer
      center={[latitude, longitude]}
      className="rounded-md"
      scrollWheelZoom={false}
      style={{ height: "100%", width: "100%", minHeight: "400px" }}
      zoom={4}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* ISS Marker */}
      <Marker icon={issIcon} position={[latitude, longitude]}>
        <Popup>
          <div className="text-sm">
            <div className="mb-1 font-semibold">
              International Space Station
            </div>
            <div className="space-y-1">
              <div>
                <span className="font-medium">Latitude:</span>{" "}
                {latitude.toFixed(4)}°
              </div>
              <div>
                <span className="font-medium">Longitude:</span>{" "}
                {longitude.toFixed(4)}°
              </div>
              <div>
                <span className="font-medium">Altitude:</span>{" "}
                {altitude.toFixed(2)} km
              </div>
            </div>
          </div>
        </Popup>
      </Marker>

      {/* Trail polyline */}
      {trail !== undefined && trail.length > 1 ? (
        <Polyline
          pathOptions={{
            color: "#3b82f6",
            weight: 2,
            opacity: 0.7,
            dashArray: "5, 10",
          }}
          positions={trail}
        />
      ) : null}

      {/* Map updater */}
      <MapUpdater latitude={latitude} longitude={longitude} />
    </MapContainer>
  );
}
