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

interface ProcessStage {
  status: string;
  worker: { name: string } | null;
  startTime: string | null;
  endTime: string | null;
  notes: string | null | undefined;
}

interface ProcessingInfo {
  washing: ProcessStage;
  ironing: ProcessStage;
  packing: ProcessStage;

  current?: any;
  completed?: any[];
  progress?: {
    stages: Array<{
      stage: string;
      label: string;
      status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
      startedAt?: string;
      completedAt?: string;
      worker?: string;
    }>;
    summary: {
      completed: number;
      inProgress: number;
      pending: number;
      total: number;
      percentage: number;
    };
  };
}

export function ProcessingSection({
  processingInfo,
}: {
  processingInfo: ProcessingInfo;
}) {
  const [isExpanded, setIsExpanded] = useState(true);

  const formatTime = (dateString: string | null | undefined) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      day: "numeric",
      month: "short",
    });
  };

  const calculateDuration = (
    startTime: string | null | undefined,
    endTime: string | null | undefined,
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
      case "COMPLETED":
        return <Badge className="bg-green-500">Selesai</Badge>;
      case "In Progress":
      case "IN_PROGRESS":
        return <Badge className="bg-blue-500">Sedang Berlangsung</Badge>;
      case "Pending":
      case "PENDING":
        return <Badge variant="outline">Menunggu</Badge>;
      case "Bypassed":
        return <Badge className="bg-orange-500">Dilewati</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const renderProcessCard = (
    title: string,
    icon: React.ReactNode,
    process: ProcessStage,
  ) => (
    <div className="rounded-md border p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="font-medium">{title}</h3>
        </div>
        {getStatusBadge(process.status)}
      </div>

      <div className="space-y-2 text-sm">
        {process.worker && (
          <div className="flex items-center gap-2">
            <User className="text-muted-foreground h-4 w-4" />
            <span>{process.worker.name}</span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-1">
          <div className="text-muted-foreground">Mulai:</div>
          <div>{formatTime(process.startTime)}</div>

          <div className="text-muted-foreground">Selesai:</div>
          <div>{formatTime(process.endTime)}</div>

          <div className="text-muted-foreground">Durasi:</div>
          <div>{calculateDuration(process.startTime, process.endTime)}</div>
        </div>

        {process.notes && (
          <div className="bg-muted mt-2 rounded-md p-2 text-xs">
            {process.notes}
          </div>
        )}
      </div>
    </div>
  );

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
        <div className="space-y-4">
          {/* Process Cards */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {renderProcessCard(
              "Pencucian",
              <Droplets className="h-5 w-5 text-blue-500" />,
              processingInfo.washing,
            )}

            {renderProcessCard(
              "Setrika",
              <Shirt className="h-5 w-5 text-purple-500" />,
              processingInfo.ironing,
            )}

            {renderProcessCard(
              "Kemasan",
              <Package className="h-5 w-5 text-amber-500" />,
              processingInfo.packing,
            )}
          </div>

          {/* Current Worker Info (if available) */}
          {processingInfo.current && (
            <div className="mt-4 rounded-md border border-blue-200 bg-blue-50 p-4">
              <h3 className="mb-2 font-medium text-blue-900">
                Sedang Dikerjakan
              </h3>
              <div className="text-sm text-blue-800">
                <div className="mb-1 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="font-medium">
                    {processingInfo.current.worker}
                  </span>
                  <span>- {processingInfo.current.station}</span>
                </div>
                <div className="text-xs text-blue-600">
                  Dimulai: {formatTime(processingInfo.current.startedAt)}
                </div>
                {processingInfo.current.notes && (
                  <div className="mt-2 text-xs italic">
                    "{processingInfo.current.notes}"
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
