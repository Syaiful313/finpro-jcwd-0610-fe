'use client';

import 'leaflet/dist/leaflet.css';
import { useEffect, useMemo, useState } from 'react';
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet';

interface MapPinpointProps {
  lat: number;
  lng: number;
  onChange: (lat: number, lng: number) => void;
}

export default function MapPinpoint({ lat, lng, onChange }: MapPinpointProps) {
  const [L, setL] = useState<typeof import('leaflet') | null>(null);

  useEffect(() => {
    import('leaflet').then(setL);
  }, []);

  const markerIcon = useMemo(() => {
    if (!L) return null;
    return new L.Icon({
      iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
    });
  }, [L]);

  function DraggableMarker() {
    useMapEvents({
      click(e) {
        onChange(e.latlng.lat, e.latlng.lng);
      },
    });

    if (!markerIcon) return null;

    return (
      <Marker
        position={[lat, lng]}
        icon={markerIcon}
        draggable={true}
        eventHandlers={{
          dragend: (e) => {
            const newPos = e.target.getLatLng();
            onChange(newPos.lat, newPos.lng);
          },
        }}
      />
    );
  }

  function FixMapSize() {
    const map = useMap();
    useEffect(() => {
      setTimeout(() => {
        map.invalidateSize();
      }, 100);
    }, [map]);
    return null;
  }

  if (!L) return null;

  return (
    <MapContainer center={[lat, lng]} zoom={13} style={{ height: '200px', width: '100%' }}>
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FixMapSize />
      <DraggableMarker />
    </MapContainer>
  );
}