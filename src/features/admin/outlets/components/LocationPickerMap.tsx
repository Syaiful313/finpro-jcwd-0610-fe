"use client";

import L from "leaflet";
import { useRef } from "react";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";

const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface LocationPickerMapProps {
  latitude: number;
  longitude: number;
  onLocationChange: (lat: number, lng: number) => void;
  className?: string;
}

function LocationMarker({
  position,
  onLocationChange,
}: {
  position: [number, number];
  onLocationChange: (lat: number, lng: number) => void;
}) {
  const markerRef = useRef<L.Marker>(null);

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      onLocationChange(lat, lng);
    },
  });

  const handleDragEnd = () => {
    const marker = markerRef.current;
    if (marker) {
      const position = marker.getLatLng();
      onLocationChange(position.lat, position.lng);
    }
  };

  return (
    <Marker
      position={position}
      icon={icon}
      draggable={true}
      ref={markerRef}
      eventHandlers={{
        dragend: handleDragEnd,
      }}
    />
  );
}

export default function LocationPickerMap({
  latitude,
  longitude,
  onLocationChange,
  className = "",
}: LocationPickerMapProps) {
  const defaultLat = latitude && !isNaN(latitude) ? latitude : -7.7956;
  const defaultLng = longitude && !isNaN(longitude) ? longitude : 110.3695;

  const position: [number, number] = [defaultLat, defaultLng];

  return (
    <div className={`relative ${className}`}>
      <div className="h-64 w-full overflow-hidden rounded-lg border">
        <MapContainer
          center={position}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
          className="z-10"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker
            position={position}
            onLocationChange={onLocationChange}
          />
        </MapContainer>
      </div>

      <div className="mt-2 text-xs text-gray-500">
        <p>🖱️ Klik pada peta atau drag marker untuk memilih lokasi</p>
        <p>
          📍 Lokasi saat ini: {defaultLat.toFixed(6)}, {defaultLng.toFixed(6)}
        </p>
      </div>
    </div>
  );
}