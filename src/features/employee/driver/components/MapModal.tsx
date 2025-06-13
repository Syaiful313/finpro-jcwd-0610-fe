import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Navigation } from "lucide-react";
import SimpleMap from "./SimpleMap";

interface MapModalProps {
  selectedRequest: {
    order: {
      user: {
        firstName: string;
        lastName: string;
        phoneNumber: string;
      };
      addressLine?: string;
      latitude: number;
      longitude: number;
    };
  } | null;
  onClose: () => void;
  onNavigate: (coordinates: { latitude: number; longitude: number }) => void;
}

export default function MapModal({
  selectedRequest,
  onClose,
  onNavigate,
}: MapModalProps) {
  if (!selectedRequest) return null;

  const { latitude, longitude } = selectedRequest.order;
  const address = selectedRequest.order?.addressLine || "Address not provided";

  if (latitude === undefined || longitude === undefined) {
    return (
      <Dialog open={!!selectedRequest} onOpenChange={onClose}>
        <DialogContent
          className="max-h-[90vh] max-w-4xl"
          aria-describedby={undefined}
        >
          <DialogHeader>
            <DialogTitle>Customer Location</DialogTitle>
          </DialogHeader>
          <div className="text-muted-foreground p-4 text-center">
            Location coordinates not available
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const coordinates = { latitude, longitude };

  const handleNavigate = () => {
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
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

          <div className="overflow-hidden rounded-lg border">
            <SimpleMap coordinates={coordinates} address={address} />
          </div>

          <div className="flex gap-2">
            <Button onClick={handleNavigate} className="flex-1">
              <Navigation className="mr-2 h-4 w-4" />
              Navigate with Google Maps
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
