"use client";

import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ActionButtons({ order }: { order: any }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Actions</h2>

      <div className="space-y-2">
        <Button
          className="w-full"
          variant="outline"
          onClick={() => window.print()}
        >
          <Printer className="mr-2 h-4 w-4" />
          Print Invoice
        </Button>
      </div>
    </div>
  );
}
