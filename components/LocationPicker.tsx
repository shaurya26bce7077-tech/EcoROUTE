"use client";

import { useEffect, useState } from "react";
import { CircleMarker, MapContainer, TileLayer, useMap, useMapEvents } from "react-leaflet";
import type { LatLngExpression, LeafletMouseEvent } from "leaflet";
import "leaflet/dist/leaflet.css";

function ClickHandler({ onPick }: { onPick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(event: LeafletMouseEvent) {
      onPick(event.latlng.lat, event.latlng.lng);
    },
  });
  return null;
}

function CenterOnPoint({ point }: { point: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (point) map.flyTo(point, Math.max(map.getZoom(), 13), { duration: 0.7 });
  }, [point, map]);
  return null;
}

export default function LocationPicker({
  lat,
  lng,
  onChange,
}: {
  lat: number;
  lng: number;
  onChange: (lat: number, lng: number) => void;
}) {
  const [center, setCenter] = useState<[number, number]>([lat, lng]);
  const point: [number, number] = [lat, lng];

  useEffect(() => setCenter([lat, lng]), [lat, lng]);

  function pick(newLat: number, newLng: number) {
    setCenter([newLat, newLng]);
    onChange(newLat, newLng);
  }

  function useLocation() {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((position) => {
      pick(position.coords.latitude, position.coords.longitude);
    });
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800 px-3 py-2.5">
        <div>
          <p className="text-sm font-medium text-zinc-200">📍 Pick pickup location</p>
          <p className="text-xs text-zinc-500">Click anywhere on the map to place the pin.</p>
        </div>
        <button type="button" onClick={useLocation} className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:border-emerald-500 hover:text-emerald-300">
          Use my location
        </button>
      </div>
      <div className="h-72 w-full">
        <MapContainer center={center as LatLngExpression} zoom={13} scrollWheelZoom className="h-full w-full">
          <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <ClickHandler onPick={pick} />
          <CenterOnPoint point={center} />
          <CircleMarker center={point} radius={10} pathOptions={{ color: "#34d399", fillColor: "#34d399", fillOpacity: 0.9 }} />
        </MapContainer>
      </div>
      <div className="grid grid-cols-2 gap-2 border-t border-zinc-800 px-3 py-2 text-xs text-zinc-500">
        <span>Latitude: <b className="text-zinc-300">{lat.toFixed(6)}</b></span>
        <span>Longitude: <b className="text-zinc-300">{lng.toFixed(6)}</b></span>
      </div>
    </div>
  );
}
