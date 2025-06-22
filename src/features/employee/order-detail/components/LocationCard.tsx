import { Map, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SimpleMap from "../../driver/components/SimpleMap";

interface LocationCardProps {
  coordinates: {
    latitude: number;
    longitude: number;
  };
  addressInfo: {
    addressLine: string;
  };
  startNavigation: () => void;
}

export default function LocationCard({
  coordinates,
  addressInfo,
  startNavigation,
}: LocationCardProps) {
  return (
    <Card className="m-4">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Map className="h-5 w-5" />
          Customer Location
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex h-64 items-center justify-center rounded-lg bg-gray-200">
          <SimpleMap
            coordinates={coordinates}
            address={addressInfo.addressLine}
          />
        </div>
        <Button
          variant="outline"
          className="mt-3 w-full"
          onClick={startNavigation}
        >
          <Navigation className="mr-2 h-4 w-4" />
          Open in Google Maps
        </Button>
      </CardContent>
    </Card>
  );
}
