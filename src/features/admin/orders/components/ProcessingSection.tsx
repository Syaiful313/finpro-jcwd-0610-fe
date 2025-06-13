"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  ChevronUp,
  Droplets,
  Package,
  Shirt,
  User,
} from "lucide-react";
import { useState } from "react";

interface ProcessingInfo {
  washing: {
    status: string;
    worker: { name: string } | null;
    startTime: string | null;
    endTime: string | null;
    notes: string | null;
  };
  ironing: {
    status: string;
    worker: { name: string } | null;
    startTime: string | null;
    endTime: string | null;
    notes: string | null;
  };
  packing: {
    status: string;
    worker: { name: string } | null;
    startTime: string | null;
    endTime: string | null;
    notes: string | null;
  };
}

export function ProcessingSection({
  processingInfo,
}: {
  processingInfo: ProcessingInfo;
}) {
  const [isExpanded, setIsExpanded] = useState(true);

  const formatTime = (dateString: string | null) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      day: "numeric",
      month: "short",
    });
  };

  const calculateDuration = (
    startTime: string | null,
    endTime: string | null,
  ) => {
    if (!startTime || !endTime) return "-";

    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();
    const durationMs = end - start;

    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) {
      return `${hours}j ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completed":
        return <Badge className="bg-green-500">Selesai</Badge>;
      case "In Progress":
        return <Badge className="bg-blue-500">Sedang Berlangsung</Badge>;
      case "Pending":
        return <Badge variant="outline">Menunggu</Badge>;
      case "Bypassed":
        return <Badge className="bg-orange-500">Dilewati</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Informasi Proses</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </div>

      {isExpanded && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-md border p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Droplets className="h-5 w-5 text-blue-500" />
                <h3 className="font-medium">Pencucian</h3>
              </div>
              {getStatusBadge(processingInfo.washing.status)}
            </div>

            <div className="space-y-2 text-sm">
              {processingInfo.washing.worker && (
                <div className="flex items-center gap-2">
                  <User className="text-muted-foreground h-4 w-4" />
                  <span>{processingInfo.washing.worker.name}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-1">
                <div className="text-muted-foreground">Mulai:</div>
                <div>{formatTime(processingInfo.washing.startTime)}</div>

                <div className="text-muted-foreground">Selesai:</div>
                <div>{formatTime(processingInfo.washing.endTime)}</div>

                <div className="text-muted-foreground">Durasi:</div>
                <div>
                  {calculateDuration(
                    processingInfo.washing.startTime,
                    processingInfo.washing.endTime,
                  )}
                </div>
              </div>

              {processingInfo.washing.notes && (
                <div className="bg-muted mt-2 rounded-md p-2 text-xs">
                  {processingInfo.washing.notes}
                </div>
              )}
            </div>
          </div>

          <div className="rounded-md border p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shirt className="h-5 w-5 text-purple-500" />
                <h3 className="font-medium">Setrika</h3>
              </div>
              {getStatusBadge(processingInfo.ironing.status)}
            </div>

            <div className="space-y-2 text-sm">
              {processingInfo.ironing.worker && (
                <div className="flex items-center gap-2">
                  <User className="text-muted-foreground h-4 w-4" />
                  <span>{processingInfo.ironing.worker.name}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-1">
                <div className="text-muted-foreground">Mulai:</div>
                <div>{formatTime(processingInfo.ironing.startTime)}</div>

                <div className="text-muted-foreground">Selesai:</div>
                <div>{formatTime(processingInfo.ironing.endTime)}</div>

                <div className="text-muted-foreground">Durasi:</div>
                <div>
                  {calculateDuration(
                    processingInfo.ironing.startTime,
                    processingInfo.ironing.endTime,
                  )}
                </div>
              </div>

              {processingInfo.ironing.notes && (
                <div className="bg-muted mt-2 rounded-md p-2 text-xs">
                  {processingInfo.ironing.notes}
                </div>
              )}
            </div>
          </div>

          <div className="rounded-md border p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-amber-500" />
                <h3 className="font-medium">Kemasan</h3>
              </div>
              {getStatusBadge(processingInfo.packing.status)}
            </div>

            <div className="space-y-2 text-sm">
              {processingInfo.packing.worker && (
                <div className="flex items-center gap-2">
                  <User className="text-muted-foreground h-4 w-4" />
                  <span>{processingInfo.packing.worker.name}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-1">
                <div className="text-muted-foreground">Mulai:</div>
                <div>{formatTime(processingInfo.packing.startTime)}</div>

                <div className="text-muted-foreground">Selesai:</div>
                <div>{formatTime(processingInfo.packing.endTime)}</div>

                <div className="text-muted-foreground">Durasi:</div>
                <div>
                  {calculateDuration(
                    processingInfo.packing.startTime,
                    processingInfo.packing.endTime,
                  )}
                </div>
              </div>

              {processingInfo.packing.notes && (
                <div className="bg-muted mt-2 rounded-md p-2 text-xs">
                  {processingInfo.packing.notes}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}