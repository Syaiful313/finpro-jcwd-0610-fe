"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

interface LocationPickerProps {
  latitude: number;
  longitude: number;
  onLocationChange: (lat: number, lng: number) => void;
  className?: string;
}

const DynamicMap = dynamic(() => import("../components/LocationPickerMap"), {
  ssr: false,
  loading: () => (
    <div className="h-64 w-full overflow-hidden rounded-lg border bg-gray-50 flex items-center justify-center">
      <div className="flex items-center gap-2 text-gray-500">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span>Loading map...</span>
      </div>
    </div>
  ),
});

export default function LocationPicker(props: LocationPickerProps) {
  return <DynamicMap {...props} />;
}