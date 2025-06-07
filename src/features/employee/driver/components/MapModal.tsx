// import { MapPin, Navigation } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";

// interface MapModalProps {
//   selectedRequest: any | null;
//   onClose: () => void;
//   onNavigate: (coordinates: { lat: number; lng: number }) => void;
// }

// export default function MapModal({
//   selectedRequest,
//   onClose,
//   onNavigate,
// }: MapModalProps) {
//   return (
//     <Dialog open={!!selectedRequest} onOpenChange={onClose}>
//       <DialogContent
//         className="max-h-[80vh] max-w-4xl"
//         aria-describedby={undefined}
//       >
//         <DialogHeader>
//           <DialogTitle>Customer Location</DialogTitle>
//         </DialogHeader>

//         {selectedRequest && (
//           <div className="space-y-4">
//             <div className="bg-muted rounded-lg p-4">
//               <h3 className="font-semibold">
//                 {`${selectedRequest.order.user.firstName} ${selectedRequest.order.user.lastName}`}
//               </h3>
//               <p className="text-muted-foreground text-sm">
//                 {selectedRequest.order.address_line || "Address not provided"}
//               </p>
//               <p className="text-muted-foreground text-sm">
//                 {selectedRequest.order.user.phoneNumber}
//               </p>
//             </div>

//             {/* Map placeholder - can be replaced with actual map integration */}
//             <div className="bg-muted flex h-64 items-center justify-center rounded-lg">
//               <div className="space-y-2 text-center">
//                 <MapPin className="text-muted-foreground mx-auto h-8 w-8" />
//                 <p className="text-muted-foreground text-sm">
//                   Map would be integrated here
//                 </p>
//                 <p className="text-muted-foreground text-xs">
//                   Coordinates would be added to API response
//                 </p>
//               </div>
//             </div>

//             <Button
//               onClick={() => onNavigate({ lat: 0, lng: 0 })}
//               className="w-full"
//             >
//               <Navigation className="mr-2 h-4 w-4" />
//               Navigate with Google Maps
//             </Button>
//           </div>
//         )}
//       </DialogContent>
//     </Dialog>
//   );
// }
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MapPin, Navigation } from "lucide-react";
import { useEffect, useRef } from "react";

// Type definitions
interface MapModalProps {
  selectedRequest: {
    order: {
      user: {
        firstName: string;
        lastName: string;
        phoneNumber: string;
      };
      address_line?: string;
      coordinates?: {
        lat: number;
        lng: number;
      };
    };
  } | null;
  onClose: () => void;
  onNavigate: (coordinates: { lat: number; lng: number }) => void;
}

declare global {
  interface Window {
    google: any;
  }
}

// Google Maps component (uncomment when you have API key)
function GoogleMap({
  coordinates,
  address,
}: {
  coordinates: { lat: number; lng: number };
  address: string;
}) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    // Check if Google Maps is loaded
    if (!(window as any).google || !mapRef.current) return;

    // Initialize map
    const map = new (window as any).google.maps.Map(mapRef.current, {
      center: coordinates,
      zoom: 15,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    });

    // Add marker
    new (window as any).google.maps.Marker({
      position: coordinates,
      map: map,
      title: address,
      icon: {
        path: (window as any).google.maps.SymbolPath.CIRCLE,
        fillColor: "#ff4444",
        fillOpacity: 1,
        strokeColor: "#ffffff",
        strokeWeight: 2,
        scale: 8,
      },
    });

    mapInstanceRef.current = map;

    return () => {
      mapInstanceRef.current = null;
    };
  }, [coordinates, address]);

  return <div ref={mapRef} className="h-64 w-full rounded-lg" />;
}

// Alternative: Simple map using OpenStreetMap/Leaflet style
function SimpleMap({
  coordinates,
  address,
}: {
  coordinates: { lat: number; lng: number };
  address: string;
}) {
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${coordinates.lng - 0.01},${coordinates.lat - 0.01},${coordinates.lng + 0.01},${coordinates.lat + 0.01}&layer=mapnik&marker=${coordinates.lat},${coordinates.lng}`;

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

export default function MapModal({
  selectedRequest,
  onClose,
  onNavigate,
}: MapModalProps) {
  // Sample coordinates (Jakarta city center) - replace with actual coordinates from API
  const defaultCoordinates = { lat: -6.2088, lng: 106.8456 };

  const coordinates = selectedRequest?.order?.coordinates || defaultCoordinates;
  const address =
    selectedRequest?.order?.address_line || "Address not provided";

  const handleNavigate = () => {
    // Open Google Maps with directions
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${coordinates.lat},${coordinates.lng}`;
    window.open(googleMapsUrl, "_blank");
    onNavigate(coordinates);
  };

  return (
    <Dialog open={!!selectedRequest} onOpenChange={onClose}>
      <DialogContent
        className="max-h-[90vh] max-w-4xl"
        aria-describedby={undefined}
      >
        <DialogHeader>
          <DialogTitle>Customer Location</DialogTitle>
        </DialogHeader>

        {selectedRequest && (
          <div className="space-y-4">
            <div className="bg-muted rounded-lg p-4">
              <h3 className="font-semibold">
                {`${selectedRequest.order.user.firstName} ${selectedRequest.order.user.lastName}`}
              </h3>
              <p className="text-muted-foreground text-sm">{address}</p>
              <p className="text-muted-foreground text-sm">
                {selectedRequest.order.user.phoneNumber}
              </p>
            </div>

            {/* Real Map Integration */}
            <div className="overflow-hidden rounded-lg border">
              {/* Option 1: Use SimpleMap for iframe-based solution */}
              <SimpleMap coordinates={coordinates} address={address} />

              {/* Option 2: Uncomment below for Google Maps API (requires API key) */}
              {/* <GoogleMap coordinates={coordinates} address={address} /> */}
            </div>

            <div className="flex gap-2">
              <Button onClick={handleNavigate} className="flex-1">
                <Navigation className="mr-2 h-4 w-4" />
                Navigate with Google Maps
              </Button>

              {/* <Button
                variant="outline"
                onClick={() => {
                  const wazeUrl = `https://waze.com/ul?ll=${coordinates.lat},${coordinates.lng}&navigate=yes`;
                  window.open(wazeUrl, "_blank");
                }}
                className="flex-1"
              >
                <MapPin className="mr-2 h-4 w-4" />
                Open in Waze
              </Button> */}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
