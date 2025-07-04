"use client";

import PaginationSection from "@/components/PaginationSection";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useGetBypassRequests from "@/hooks/api/bypass/useGetBypassRequests";
import useApproveBypassRequest from "@/hooks/api/bypass/useApproveBypassRequest";
import useRejectBypassRequest from "@/hooks/api/bypass/useRejectBypassRequest";
import useGetBypassRequestStats from "@/hooks/api/bypass/useGetBypassRequestStats";
import { BypassRequest } from "@/types/bypass";
import { useQueryClient } from "@tanstack/react-query";
import {
  ChevronDownIcon,
  Check,
  X,
  Filter,
  FilterIcon,
  Loader2,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { parseAsInteger, parseAsStringEnum, useQueryStates } from "nuqs";
import { useState } from "react";
import ProcessBypassModal from "./ProcessBypassModal";
import ViewBypassDetailModal from "./ViewBypassDetailModal";

const PAGE_SIZE = 10;

const getCellClass = (columnId: string) => {
  const baseClass = "py-2 px-2 sm:py-3 sm:px-4";
  const styles: Record<string, string> = {
    index: "w-12 sm:w-16 text-center text-xs sm:text-sm",
    order: "min-w-[120px] sm:min-w-[150px] text-xs sm:text-sm font-medium",
    worker:
      "min-w-[100px] sm:min-w-[120px] text-xs sm:text-sm hidden md:table-cell",
    workerType: "w-24 sm:w-32 text-center",
    reason:
      "min-w-[150px] sm:min-w-[200px] text-xs sm:text-sm hidden lg:table-cell",
    status: "w-20 sm:w-24 text-center",
    date: "w-24 sm:w-32 text-center hidden sm:table-cell",
    actions: "w-32 sm:w-40 text-center",
  };
  return `${baseClass} ${styles[columnId] || "text-xs sm:text-sm"}`;
};

const StatusBadge = ({ status }: { status: string }) => {
  const getStatusStyle = (status: string) => {
    const styles = {
      PENDING: {
        bg: "bg-yellow-100 dark:bg-yellow-900/30",
        text: "text-yellow-700 dark:text-yellow-300",
        icon: Clock,
        label: "Menunggu",
      },
      APPROVED: {
        bg: "bg-green-100 dark:bg-green-900/30",
        text: "text-green-700 dark:text-green-300",
        icon: CheckCircle,
        label: "Disetujui",
      },
      REJECTED: {
        bg: "bg-red-100 dark:bg-red-900/30",
        text: "text-red-700 dark:text-red-300",
        icon: XCircle,
        label: "Ditolak",
      },
    };
    return styles[status as keyof typeof styles] || styles.PENDING;
  };

  const config = getStatusStyle(status);
  const IconComponent = config.icon;

  return (
    <div
      className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${config.bg} ${config.text}`}
    >
      <IconComponent className="h-3 w-3" />
      {config.label}
    </div>
  );
};

const WorkerTypeBadge = ({ type }: { type: string }) => {
  const getTypeBadgeStyle = (type: string) => {
    const styles = {
      WASHING:
        "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
      IRONING:
        "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
      PACKING:
        "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
    };
    return styles[type as keyof typeof styles] || styles.WASHING;
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      WASHING: "Mencuci",
      IRONING: "Setrika",
      PACKING: "Packing",
    };
    return labels[type as keyof typeof labels] || type;
  };

  return (
    <span
      className={`inline-block rounded px-1.5 py-0.5 text-xs font-semibold ${getTypeBadgeStyle(type)}`}
    >
      {getTypeLabel(type)}
    </span>
  );
};

const LoadingSkeleton = ({ message }: { message: string }) => (
  <div className="flex h-64 items-center justify-center px-1">
    <Loader2 className="h-6 w-6 animate-spin" />
    <span className="ml-2 text-sm sm:text-base dark:text-gray-300">
      {message}
    </span>
  </div>
);

const AccessDeniedMessage = () => (
  <div className="flex h-64 items-center justify-center px-1">
    <div className="text-center">
      <span className="text-sm text-red-500 sm:text-base dark:text-red-400">
        Akses Ditolak
      </span>
      <p className="mt-2 text-xs text-gray-500 sm:text-sm dark:text-gray-400">
        Hanya admin outlet yang dapat mengelola permintaan bypass.
      </p>
    </div>
  </div>
);

const EmptyState = () => (
  <div className="mx-5 mt-4 rounded-2xl border border-gray-200 bg-white p-6 text-center dark:border-gray-700 dark:bg-gray-800">
    <AlertTriangle className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
    <span className="mt-4 block text-sm text-gray-500 dark:text-gray-400">
      Tidak ada permintaan bypass ditemukan untuk outlet Anda
    </span>
  </div>
);

const ErrorMessage = ({ error }: { error: any }) => (
  <div className="mx-3 p-4 text-center text-red-500 dark:text-red-400">
    <div className="text-sm">Terjadi kesalahan saat memuat data</div>
    <div className="mt-1 text-xs text-red-400 dark:text-red-300">
      {error.message || "Kesalahan tidak diketahui"}
    </div>
  </div>
);

const MobileLoadingSkeleton = () => (
  <div className="space-y-2 px-3 pt-2">
    {[...Array(3)].map((_, i) => (
      <div
        key={i}
        className="animate-pulse rounded-2xl border bg-white p-4 dark:bg-gray-800"
      >
        <div className="mb-2 h-4 rounded bg-gray-200 dark:bg-gray-700"></div>
        <div className="h-3 w-3/4 rounded bg-gray-200 dark:bg-gray-700"></div>
      </div>
    ))}
  </div>
);

const BypassRequestCard = ({
  request,
  index,
  onView,
  onApprove,
  onReject,
  isProcessing,
}: {
  request: BypassRequest;
  index: number;
  onView: (request: BypassRequest) => void;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
  isProcessing: boolean;
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const canProcess = request.bypassStatus === "PENDING";

  return (
    <div className="overflow-hidden rounded-2xl border-l-4 border-orange-400 bg-white shadow-md transition-all duration-300 hover:shadow-lg dark:border-orange-500 dark:bg-gray-800 dark:shadow-gray-900/50 dark:hover:shadow-gray-900/70">
      <div className="border-b border-slate-200 bg-slate-50 p-3.5 dark:border-gray-700 dark:bg-gray-700/50">
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <div className="mb-1 text-sm font-semibold text-slate-900 dark:text-gray-100">
              Pesanan #{request.orderWorkProcesses[0]?.order?.orderNumber}
            </div>
            <div className="flex items-center gap-2">
              <WorkerTypeBadge
                type={request.orderWorkProcesses[0]?.workerType}
              />
              <StatusBadge status={request.bypassStatus} />
            </div>
          </div>
        </div>
      </div>

      <div className="p-3.5">
        <div className="mb-3 space-y-2">
          <div className="text-xs text-slate-600 dark:text-gray-400">
            <span className="font-medium">Pekerja:</span>{" "}
            {request.orderWorkProcesses[0]?.employee?.user?.firstName}{" "}
            {request.orderWorkProcesses[0]?.employee?.user?.lastName}
          </div>
          <div className="text-xs text-slate-600 dark:text-gray-400">
            <span className="font-medium">Pelanggan:</span>{" "}
            {request.orderWorkProcesses[0]?.order?.user?.firstName}{" "}
            {request.orderWorkProcesses[0]?.order?.user?.lastName}
          </div>
          <div className="text-xs text-slate-600 dark:text-gray-400">
            <span className="font-medium">Alasan:</span> {request.reason}
          </div>
          <div className="text-xs text-slate-500 dark:text-gray-500">
            {formatDate(request.createdAt)}
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() => onView(request)}
            className="flex-1 rounded-lg border border-slate-300 bg-white px-3.5 py-1.5 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-50 dark:border-gray-600 dark:bg-gray-800 dark:text-blue-400 dark:hover:bg-blue-950/30"
          >
            Lihat
          </Button>
          {canProcess && (
            <>
              <button
                onClick={() => onApprove(request.id)}
                disabled={isProcessing}
                className="flex-1 rounded-lg border border-green-300 bg-green-50 px-3.5 py-1.5 text-xs font-medium text-green-600 transition-colors hover:bg-green-100 disabled:opacity-50 dark:border-green-700 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30"
              >
                Setujui
              </button>
              <button
                onClick={() => onReject(request.id)}
                disabled={isProcessing}
                className="flex-1 rounded-lg border border-red-300 bg-red-50 px-3.5 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-100 disabled:opacity-50 dark:border-red-700 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
              >
                Tolak
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const BypassRequestRow = ({
  request,
  index,
  onView,
  onApprove,
  onReject,
  isProcessing,
}: {
  request: BypassRequest;
  index: number;
  onView: (request: BypassRequest) => void;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
  isProcessing: boolean;
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
    });
  };

  const canProcess = request.bypassStatus === "PENDING";

  return (
    <TableRow className="border-b hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800/50">
      <TableCell className={getCellClass("index")}>{index}</TableCell>

      <TableCell className={getCellClass("order")}>
        <div className="flex flex-col">
          <div className="font-medium break-words text-gray-900 dark:text-gray-100">
            #{request.orderWorkProcesses[0]?.order?.orderNumber}
          </div>
          <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {request.orderWorkProcesses[0]?.order?.user?.firstName}{" "}
            {request.orderWorkProcesses[0]?.order?.user?.lastName}
          </div>
        </div>
      </TableCell>

      <TableCell className={getCellClass("worker")}>
        <div className="text-xs dark:text-gray-300">
          {request.orderWorkProcesses[0]?.employee?.user?.firstName}{" "}
          {request.orderWorkProcesses[0]?.employee?.user?.lastName}
        </div>
      </TableCell>

      <TableCell className={getCellClass("workerType")}>
        <div className="flex justify-center">
          <WorkerTypeBadge type={request.orderWorkProcesses[0]?.workerType} />
        </div>
      </TableCell>

      <TableCell className={getCellClass("reason")}>
        <div
          className="max-w-[200px] truncate text-xs text-gray-600 dark:text-gray-300"
          title={request.reason}
        >
          {request.reason}
        </div>
      </TableCell>

      <TableCell className={getCellClass("status")}>
        <div className="flex justify-center">
          <StatusBadge status={request.bypassStatus} />
        </div>
      </TableCell>

      <TableCell className={getCellClass("date")}>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {formatDate(request.createdAt)}
        </div>
      </TableCell>

      <TableCell className={getCellClass("actions")}>
        <div className="flex justify-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 text-blue-600 hover:bg-blue-50 sm:h-8 sm:w-8 dark:text-blue-400 dark:hover:bg-blue-950/30"
            onClick={() => onView(request)}
          >
            <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
          {canProcess && (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 text-green-600 hover:bg-green-50 sm:h-8 sm:w-8 dark:text-green-400 dark:hover:bg-green-900/30"
                onClick={() => onApprove(request.id)}
                disabled={isProcessing}
              >
                <Check className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 text-red-600 hover:bg-red-50 sm:h-8 sm:w-8 dark:text-red-400 dark:hover:bg-red-900/30"
                onClick={() => onReject(request.id)}
                disabled={isProcessing}
              >
                <X className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
};

export function BypassRequestTable() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const approveBypassMutation = useApproveBypassRequest();
  const rejectBypassMutation = useRejectBypassRequest();

  const [filters, setFilters] = useQueryStates({
    page: parseAsInteger.withDefault(1),
    status: parseAsStringEnum([
      "",
      "PENDING",
      "APPROVED",
      "REJECTED",
    ]).withDefault(""),
    workerType: parseAsStringEnum([
      "",
      "WASHING",
      "IRONING",
      "PACKING",
    ]).withDefault(""),
    sortBy: parseAsStringEnum(["createdAt", "updatedAt"]).withDefault(
      "createdAt",
    ),
    sortOrder: parseAsStringEnum(["asc", "desc"]).withDefault("desc"),
  });

  const [modals, setModals] = useState({
    showProcess: false,
    showDetail: false,
  });

  const [selected, setSelected] = useState({
    processingRequest: null as BypassRequest | null,
    viewingRequest: null as BypassRequest | null,
    processType: null as "approve" | "reject" | null,
  });

  const {
    data: bypassData,
    isLoading,
    error,
  } = useGetBypassRequests({
    page: filters.page,
    take: PAGE_SIZE,
    status: filters.status as any,
    workerType: filters.workerType as any,
    sortBy: filters.sortBy,
    sortOrder: filters.sortOrder,
  });

  const { data: statsData } = useGetBypassRequestStats();

  const statusOptions = [
    { value: "", label: "Semua Status" },
    { value: "PENDING", label: "Menunggu" },
    { value: "APPROVED", label: "Disetujui" },
    { value: "REJECTED", label: "Ditolak" },
  ];

  const workerTypeOptions = [
    { value: "", label: "Semua Stasiun" },
    { value: "WASHING", label: "Mencuci" },
    { value: "IRONING", label: "Setrika" },
    { value: "PACKING", label: "Packing" },
  ];

  const updateFilters = (updates: Partial<typeof filters>) => {
    setFilters(updates);
  };

  const updateModals = (updates: Partial<typeof modals>) => {
    setModals((prev) => ({ ...prev, ...updates }));
  };

  const handleViewDetail = (request: BypassRequest) => {
    setSelected({
      ...selected,
      viewingRequest: request,
    });
    updateModals({ showDetail: true });
  };

  const handleApprove = (requestId: number) => {
    const request = bypassData?.data?.find((r) => r.id === requestId);
    if (request) {
      setSelected({
        ...selected,
        processingRequest: request,
        processType: "approve",
      });
      updateModals({ showProcess: true });
    }
  };

  const handleReject = (requestId: number) => {
    const request = bypassData?.data?.find((r) => r.id === requestId);
    if (request) {
      setSelected({
        ...selected,
        processingRequest: request,
        processType: "reject",
      });
      updateModals({ showProcess: true });
    }
  };

  const confirmProcess = (adminNote: string) => {
    if (!selected.processingRequest) return;

    const mutation =
      selected.processType === "approve"
        ? approveBypassMutation
        : rejectBypassMutation;

    mutation.mutate(
      {
        id: selected.processingRequest.id,
        payload: { adminNote },
      },
      {
        onSuccess: () => {
          updateModals({ showProcess: false });
          setSelected({
            processingRequest: null,
            viewingRequest: null,
            processType: null,
          });
          queryClient.invalidateQueries({ queryKey: ["bypass-requests"] });
        },
      },
    );
  };

  const closeModals = () => {
    updateModals({ showProcess: false, showDetail: false });
    setSelected({
      processingRequest: null,
      viewingRequest: null,
      processType: null,
    });
  };

  if (!session) {
    return <LoadingSkeleton message="Memuat sesi..." />;
  }

  if (session?.user?.role !== "OUTLET_ADMIN") {
    return <AccessDeniedMessage />;
  }

  const isProcessing =
    approveBypassMutation.isPending || rejectBypassMutation.isPending;

  return (
    <>
      <div className="space-y-3 sm:space-y-6 sm:px-4 lg:px-0">
        <div className="block sm:hidden">
          <div className="rounded-b-3xl bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg dark:from-orange-600 dark:to-orange-700">
            <div className="px-4 py-14">
              <h1 className="text-2xl font-bold">
                Permintaan Bypass Outlet Saya
              </h1>
              <p className="mt-2 opacity-90">
                Kelola permintaan bypass dari pekerja di outlet Anda
              </p>
              {statsData?.data && (
                <div className="mt-4 grid grid-cols-4 gap-2">
                  <div className="rounded-lg bg-white/20 p-2 text-center dark:bg-white/10">
                    <div className="text-lg font-bold">
                      {statsData.data.pending}
                    </div>
                    <div className="text-xs">Menunggu</div>
                  </div>
                  <div className="rounded-lg bg-white/20 p-2 text-center dark:bg-white/10">
                    <div className="text-lg font-bold">
                      {statsData.data.approved}
                    </div>
                    <div className="text-xs">Disetujui</div>
                  </div>
                  <div className="rounded-lg bg-white/20 p-2 text-center dark:bg-white/10">
                    <div className="text-lg font-bold">
                      {statsData.data.rejected}
                    </div>
                    <div className="text-xs">Ditolak</div>
                  </div>
                  <div className="rounded-lg bg-white/20 p-2 text-center dark:bg-white/10">
                    <div className="text-lg font-bold">
                      {statsData.data.total}
                    </div>
                    <div className="text-xs">Total</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="relative mx-6 -mt-8 rounded-2xl border border-gray-100 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-800 dark:shadow-gray-900/50">
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl border-2 border-gray-200 bg-orange-500 px-4 text-sm text-white transition-colors hover:bg-orange-600 dark:border-gray-600 dark:bg-orange-600 dark:hover:bg-orange-700">
                    <Filter className="h-4 w-4" />
                    <span>
                      {
                        statusOptions.find(
                          (opt) => opt.value === filters.status,
                        )?.label
                      }
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-48 dark:border-gray-700 dark:bg-gray-800"
                >
                  {statusOptions.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      onClick={() =>
                        updateFilters({ status: option.value as any })
                      }
                      className="dark:text-gray-100 dark:hover:bg-gray-700"
                    >
                      {option.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl border-2 border-gray-200 bg-blue-500 px-4 text-sm text-white transition-colors hover:bg-blue-600 dark:border-gray-600 dark:bg-blue-600 dark:hover:bg-blue-700">
                    <Filter className="h-4 w-4" />
                    <span>
                      {
                        workerTypeOptions.find(
                          (opt) => opt.value === filters.workerType,
                        )?.label
                      }
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-48 dark:border-gray-700 dark:bg-gray-800"
                >
                  {workerTypeOptions.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      onClick={() =>
                        updateFilters({ workerType: option.value as any })
                      }
                      className="dark:text-gray-100 dark:hover:bg-gray-700"
                    >
                      {option.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        <div className="hidden sm:block">
          <div className="rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-white shadow-lg dark:from-orange-600 dark:to-orange-700">
            <h1 className="text-2xl font-bold">
              Permintaan Bypass Outlet Saya
            </h1>
            <p className="mt-2 opacity-90">
              Kelola permintaan bypass dari pekerja di outlet Anda
            </p>
            {statsData?.data && (
              <div className="mt-4 grid grid-cols-4 gap-4">
                <div className="rounded-lg bg-white/20 p-3 text-center dark:bg-white/10">
                  <div className="text-2xl font-bold">
                    {statsData.data.pending}
                  </div>
                  <div className="text-sm">Menunggu</div>
                </div>
                <div className="rounded-lg bg-white/20 p-3 text-center dark:bg-white/10">
                  <div className="text-2xl font-bold">
                    {statsData.data.approved}
                  </div>
                  <div className="text-sm">Disetujui</div>
                </div>
                <div className="rounded-lg bg-white/20 p-3 text-center dark:bg-white/10">
                  <div className="text-2xl font-bold">
                    {statsData.data.rejected}
                  </div>
                  <div className="text-sm">Ditolak</div>
                </div>
                <div className="rounded-lg bg-white/20 p-3 text-center dark:bg-white/10">
                  <div className="text-2xl font-bold">
                    {statsData.data.total}
                  </div>
                  <div className="text-sm">Total</div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mx-1 hidden rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:mx-0 sm:block sm:p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-3 sm:flex-row">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-10 min-w-0 rounded-xl border-gray-200 text-sm lg:min-w-[140px] dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
                  >
                    <FilterIcon className="mr-2 h-4 w-4 flex-shrink-0" />
                    <span className="truncate text-xs sm:text-sm">
                      {
                        statusOptions.find(
                          (opt) => opt.value === filters.status,
                        )?.label
                      }
                    </span>
                    <ChevronDownIcon className="ml-2 h-4 w-4 flex-shrink-0" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-48 dark:border-gray-700 dark:bg-gray-800"
                >
                  {statusOptions.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      onClick={() =>
                        updateFilters({ status: option.value as any })
                      }
                      className="dark:text-gray-100 dark:hover:bg-gray-700"
                    >
                      {option.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-10 min-w-0 rounded-xl border-gray-200 text-sm lg:min-w-[140px] dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
                  >
                    <FilterIcon className="mr-2 h-4 w-4 flex-shrink-0" />
                    <span className="truncate text-xs sm:text-sm">
                      {
                        workerTypeOptions.find(
                          (opt) => opt.value === filters.workerType,
                        )?.label
                      }
                    </span>
                    <ChevronDownIcon className="ml-2 h-4 w-4 flex-shrink-0" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-48 dark:border-gray-700 dark:bg-gray-800"
                >
                  {workerTypeOptions.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      onClick={() =>
                        updateFilters({ workerType: option.value as any })
                      }
                      className="dark:text-gray-100 dark:hover:bg-gray-700"
                    >
                      {option.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="outline"
                onClick={() =>
                  updateFilters({
                    status: "",
                    workerType: "",
                    page: 1,
                  })
                }
                disabled={!filters.status && !filters.workerType}
                className="h-10 rounded-xl border-gray-200 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
              >
                Reset
              </Button>
            </div>
          </div>
        </div>

        <div className="block sm:hidden">
          {isLoading ? (
            <MobileLoadingSkeleton />
          ) : error ? (
            <ErrorMessage error={error} />
          ) : bypassData?.data?.length ? (
            <div className="space-y-2 px-3 pt-2">
              {bypassData.data.map((request, index) => (
                <BypassRequestCard
                  key={request.id}
                  request={request}
                  index={(filters.page - 1) * PAGE_SIZE + index + 1}
                  onView={handleViewDetail}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  isProcessing={isProcessing}
                />
              ))}
            </div>
          ) : (
            <EmptyState />
          )}
        </div>

        <div className="mx-1 hidden rounded-2xl border border-gray-200 shadow-sm sm:mx-0 sm:block dark:border-gray-700">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b dark:border-gray-700">
                  <TableHead className="w-12 text-center text-xs sm:w-16 sm:text-sm dark:text-gray-300">
                    No
                  </TableHead>
                  <TableHead className="min-w-[120px] text-xs sm:min-w-[150px] sm:text-sm dark:text-gray-300">
                    Pesanan
                  </TableHead>
                  <TableHead className="hidden min-w-[100px] text-xs sm:min-w-[120px] sm:text-sm md:table-cell dark:text-gray-300">
                    Pekerja
                  </TableHead>
                  <TableHead className="w-24 text-center text-xs sm:w-32 sm:text-sm dark:text-gray-300">
                    Stasiun
                  </TableHead>
                  <TableHead className="hidden min-w-[150px] text-xs sm:min-w-[200px] sm:text-sm lg:table-cell dark:text-gray-300">
                    Alasan
                  </TableHead>
                  <TableHead className="w-20 text-center text-xs sm:w-24 sm:text-sm dark:text-gray-300">
                    Status
                  </TableHead>
                  <TableHead className="hidden w-24 text-center text-xs sm:table-cell sm:w-32 sm:text-sm dark:text-gray-300">
                    Tanggal
                  </TableHead>
                  <TableHead className="w-32 text-center text-xs sm:w-40 sm:text-sm dark:text-gray-300">
                    Aksi
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-32 text-center">
                      <div className="flex items-center justify-center">
                        <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                        <span className="text-sm dark:text-gray-300">
                          Memuat...
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="h-32 text-center text-red-500 dark:text-red-400"
                    >
                      <div>
                        <div className="text-sm">
                          Terjadi kesalahan saat memuat data
                        </div>
                        <div className="mt-1 text-xs text-red-400 dark:text-red-300">
                          {error.message || "Kesalahan tidak diketahui"}
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : bypassData?.data?.length ? (
                  bypassData.data.map((request, index) => (
                    <BypassRequestRow
                      key={request.id}
                      request={request}
                      index={(filters.page - 1) * PAGE_SIZE + index + 1}
                      onView={handleViewDetail}
                      onApprove={handleApprove}
                      onReject={handleReject}
                      isProcessing={isProcessing}
                    />
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="h-32 text-center">
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <AlertTriangle className="h-12 w-12 text-gray-400 dark:text-gray-500" />
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Tidak ada permintaan bypass ditemukan untuk outlet
                          Anda
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {bypassData?.meta && (
          <div className="mx-1 hidden justify-center rounded-2xl border-t bg-white p-4 sm:mx-0 sm:flex dark:border-gray-700 dark:bg-gray-800">
            <PaginationSection
              page={bypassData.meta.page}
              take={bypassData.meta.take}
              total={bypassData.meta.total}
              hasNext={
                bypassData.meta.page * bypassData.meta.take <
                bypassData.meta.total
              }
              hasPrevious={bypassData.meta.page > 1}
              onChangePage={(newPage) => updateFilters({ page: newPage })}
            />
          </div>
        )}

        {bypassData?.meta && (
          <div className="flex justify-center rounded-2xl border-t bg-white p-3 sm:hidden dark:border-gray-700 dark:bg-gray-800">
            <PaginationSection
              page={bypassData.meta.page}
              take={bypassData.meta.take}
              total={bypassData.meta.total}
              hasNext={
                bypassData.meta.page * bypassData.meta.take <
                bypassData.meta.total
              }
              hasPrevious={bypassData.meta.page > 1}
              onChangePage={(newPage) => updateFilters({ page: newPage })}
            />
          </div>
        )}
      </div>

      {selected.processingRequest && selected.processType && (
        <ProcessBypassModal
          open={modals.showProcess}
          onClose={closeModals}
          request={selected.processingRequest}
          type={selected.processType}
          onConfirm={confirmProcess}
          isProcessing={isProcessing}
        />
      )}

      {selected.viewingRequest && (
        <ViewBypassDetailModal
          open={modals.showDetail}
          onClose={closeModals}
          requestId={selected.viewingRequest.id}
        />
      )}
    </>
  );
}
