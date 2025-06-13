interface SimpleMapProps {
  coordinates: {
    latitude: number;
    longitude: number;
  };
  address: string;
}

export default function SimpleMap({ coordinates, address }: SimpleMapProps) {
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${
    coordinates.longitude - 0.01
  },${coordinates.latitude - 0.01},${coordinates.longitude + 0.01},${
    coordinates.latitude + 0.01
  }&layer=mapnik&marker=${coordinates.latitude},${coordinates.longitude}`;

  return (
    <div className="relative h-64 w-full overflow-hidden rounded-lg">
      <iframe
        src={mapUrl}
        className="h-full w-full border-0"
        title="Location Map"
      />
      <div className="absolute top-2 left-2 rounded bg-black/70 px-2 py-1 text-xs text-white">
        📍 {address}
      </div>
    </div>
  );
}
