import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Box } from "lucide-react";

interface OriginalOrderItemsProps {
  items: any[];
}

export default function OriginalOrderItems({ items }: OriginalOrderItemsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Box className="h-6 w-6" />
          Original Order Items
        </CardTitle>
        <CardDescription>
          Items as listed in the original customer order.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-secondary dark:bg-secondary flex flex-col gap-3 rounded-lg border p-3 md:flex-row md:items-center md:justify-between"
          >
            <div className="flex-1">
              <div className="font-medium">{item.laundryItem.name}</div>
              <div className="text-muted-foreground text-sm">
                Qty: {item.quantity} &bull; {item.laundryItem.category} &bull;
                Rp {item.pricePerUnit.toLocaleString()}
              </div>
            </div>
            <div className="text-left md:text-right">
              <div className="font-medium">
                Rp {item.totalPrice.toLocaleString()}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
