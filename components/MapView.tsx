/* Leaflet must render on the client. */
"use client";

import { useEffect } from "react";
import { CircleMarker, MapContainer, Popup, TileLayer, useMap } from "react-leaflet";
import type { Listing } from "@/types";
import "leaflet/dist/leaflet.css";

function Recenter({ center, zoom }: { center: [number, number]; zoom?: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom ?? map.getZoom(), { duration: 0.8 });
  }, [center, zoom, map]);
  return null;
}

export default function MapView({
  listings,
  selectedId,
  center,
  zoom = 5,
  onSelect,
  userLocation,
}: {
  listings: Listing[];
  selectedId?: string;
  center: [number, number];
  zoom?: number;
  onSelect?: (id: string) => void;
  userLocation?: { lat: number; lng: number } | null;
}) {
  const selected = listings.find((x) => x.id === selectedId);
  const mapCenter: [number, number] = selected ? [selected.lat, selected.lng] : center;

  return (
    <MapContainer center={center} zoom={zoom} scrollWheelZoom className="h-full w-full">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Recenter center={mapCenter} zoom={selected ? 14 : zoom} />
      {userLocation && (
        <CircleMarker
          center={[userLocation.lat, userLocation.lng]}
          radius={8}
          pathOptions={{ color: "#2563eb", fillColor: "#2563eb", fillOpacity: 0.9 }}
        >
          <Popup><div className="text-zinc-900 font-medium">Your location</div></Popup>
        </CircleMarker>
      )}
      {listings.map((item) => (
        <CircleMarker
          key={item.id}
          center={[item.lat, item.lng]}
          radius={9}
          pathOptions={{
            color: item.status === "available" ? "#34d399" : "#71717a",
            fillColor: item.status === "available" ? "#34d399" : "#71717a",
            fillOpacity: 0.9,
          }}
          eventHandlers={{ click: () => onSelect?.(item.id) }}
        >
          <Popup>
            <div className="min-w-[200px] text-zinc-900">
              <strong className="text-base">{item.title}</strong>
              <div className="mt-1 text-sm">{item.store_name}</div>
              <div className="mt-1 text-sm">{item.quantity} available • {item.is_free ? "Free" : `₹${item.price}`}</div>
              <div className="mt-1 text-xs text-zinc-600">{item.address}</div>
              <div className="mt-2 text-xs text-zinc-600">{item.pickup_window}</div>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
