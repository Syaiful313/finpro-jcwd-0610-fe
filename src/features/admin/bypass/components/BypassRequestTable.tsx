// src/components/outlet-admin/BypassRequestTable.tsx
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
import {
  parseAsInteger,
  parseAsStringEnum,
  useQueryStates,
} from "nuqs";
import { useState } from "react";
import ProcessBypassModal from "./ProcessBypassModal";
import ViewBypassDetailModal from "./ViewBypassDetailModal";

const PAGE_SIZE = 10;

const getCellClass = (columnId: string) => {
  const baseClass = "py-2 px-2 sm:py-3 sm:px-4";
  const styles: Record<string, string> = {
    index: "w-12 sm:w-16 text-center text-xs sm:text-sm",
    order: "min-w-[120px] sm:min-w-[150px] text-xs sm:text-sm font-medium",
    worker: "min-w-[100px] sm:min-w-[120px] text-xs sm:text-sm hidden md:table-cell",
    workerType: "w-24 sm:w-32 text-center",
    reason: "min-w-[150px] sm:min-w-[200px] text-xs sm:text-sm hidden lg:table-cell",
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
        label: "Pending"
      },
      APPROVED: {
        bg: "bg-green-100 dark:bg-green-900/30",
        text: "text-green-700 dark:text-green-300",
        icon: CheckCircle,
        label: "Approved"
      },
      REJECTED: {
        bg: "bg-red-100 dark:bg-red-900/30",
        text: "text-red-700 dark:text-red-300",
        icon: XCircle,
        label: "Rejected"
      },
    };
    return styles[status as keyof typeof styles] || styles.PENDING;
  };

  const config = getStatusStyle(status);
  const IconComponent = config.icon;

  return (
    <div className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${config.bg} ${config.text}`}>
      <IconComponent className="h-3 w-3" />
      {config.label}
    </div>
  );
};

const WorkerTypeBadge = ({ type }: { type: string }) => {
  const getTypeBadgeStyle = (type: string) => {
    const styles = {
      WASHING: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
      IRONING: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
      PACKING: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
    };
    return styles[type as keyof typeof styles] || styles.WASHING;
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      WASHING: "Washing",
      IRONING: "Ironing",
      PACKING: "Packing",
    };
    return labels[type as keyof typeof labels] || type;
  };

  return (
    <span className={`inline-block rounded px-1.5 py-0.5 text-xs font-semibold ${getTypeBadgeStyle(type)}`}>
      {getTypeLabel(type)}
    </span>
  );
};

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
    <div className="overflow-hidden rounded-2xl border-l-4 border-orange-400 dark:border-orange-500 bg-white dark:bg-gray-800 shadow-md dark:shadow-gray-900/50 transition-all duration-300 hover:shadow-lg dark:hover:shadow-gray-900/70">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-700/50 p-3.5">
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <div className="mb-1 font-semibold text-slate-900 dark:text-gray-100 text-sm">
              Order #{request.orderWorkProcesses[0]?.order?.orderNumber}
            </div>
            <div className="flex items-center gap-2">
              <WorkerTypeBadge type={request.orderWorkProcesses[0]?.workerType} />
              <StatusBadge status={request.bypassStatus} />
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-3.5">
        <div className="mb-3 space-y-2">
          <div className="text-xs text-slate-600 dark:text-gray-400">
            <span className="font-medium">Worker:</span> {request.orderWorkProcesses[0]?.employee?.user?.firstName} {request.orderWorkProcesses[0]?.employee?.user?.lastName}
          </div>
          <div className="text-xs text-slate-600 dark:text-gray-400">
            <span className="font-medium">Customer:</span> {request.orderWorkProcesses[0]?.order?.user?.firstName} {request.orderWorkProcesses[0]?.order?.user?.lastName}
          </div>
          <div className="text-xs text-slate-600 dark:text-gray-400">
            <span className="font-medium">Reason:</span> {request.reason}
          </div>
          <div className="text-xs text-slate-500 dark:text-gray-500">
            {formatDate(request.createdAt)}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => onView(request)}
            className="flex-1 rounded-lg border border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3.5 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 transition-colors hover:bg-blue-50 dark:hover:bg-blue-950/30"
          >
            View
          </button>
          {canProcess && (
            <>
              <button
                onClick={() => onApprove(request.id)}
                disabled={isProcessing}
                className="flex-1 rounded-lg border border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20 px-3.5 py-1.5 text-xs font-medium text-green-600 dark:text-green-400 transition-colors hover:bg-green-100 dark:hover:bg-green-900/30 disabled:opacity-50"
              >
                Approve
              </button>
              <button
                onClick={() => onReject(request.id)}
                disabled={isProcessing}
                className="flex-1 rounded-lg border border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20 px-3.5 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 transition-colors hover:bg-red-100 dark:hover:bg-red-900/30 disabled:opacity-50"
              >
                Reject
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
    <TableRow className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
      <TableCell className={getCellClass("index")}>{index}</TableCell>

      <TableCell className={getCellClass("order")}>
        <div className="flex flex-col">
          <div className="font-medium break-words text-gray-900 dark:text-gray-100">
            #{request.orderWorkProcesses[0]?.order?.orderNumber}
          </div>
          <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {request.orderWorkProcesses[0]?.order?.user?.firstName} {request.orderWorkProcesses[0]?.order?.user?.lastName}
          </div>
        </div>
      </TableCell>

      <TableCell className={getCellClass("worker")}>
        <div className="text-xs dark:text-gray-300">
          {request.orderWorkProcesses[0]?.employee?.user?.firstName} {request.orderWorkProcesses[0]?.employee?.user?.lastName}
        </div>
      </TableCell>

      <TableCell className={getCellClass("workerType")}>
        <div className="flex justify-center">
          <WorkerTypeBadge type={request.orderWorkProcesses[0]?.workerType} />
        </div>
      </TableCell>

      <TableCell className={getCellClass("reason")}>
        <div className="text-xs text-gray-600 dark:text-gray-300 truncate max-w-[200px]" title={request.reason}>
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
            className="h-7 w-7 p-0 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 sm:h-8 sm:w-8"
            onClick={() => onView(request)}
          >
            <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
          {canProcess && (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 sm:h-8 sm:w-8"
                onClick={() => onApprove(request.id)}
                disabled={isProcessing}
              >
                <Check className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 sm:h-8 sm:w-8"
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
    status: parseAsStringEnum(["", "PENDING", "APPROVED", "REJECTED"]).withDefault(""),
    workerType: parseAsStringEnum(["", "WASHING", "IRONING", "PACKING"]).withDefault(""),
    sortBy: parseAsStringEnum(["createdAt", "updatedAt"]).withDefault("createdAt"),
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

  // CRITICAL: Only allow outlet admin access
  const isOutletAdmin = session?.user?.role === "OUTLET_ADMIN";

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
    { value: "", label: "All Status" },
    { value: "PENDING", label: "Pending" },
    { value: "APPROVED", label: "Approved" },
    { value: "REJECTED", label: "Rejected" },
  ];

  const workerTypeOptions = [
    { value: "", label: "All Stations" },
    { value: "WASHING", label: "Washing" },
    { value: "IRONING", label: "Ironing" },
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
      viewingRequest: request 
    });
    updateModals({ showDetail: true });
  };

  const handleApprove = (requestId: number) => {
    const request = bypassData?.data?.find(r => r.id === requestId);
    if (request) {
      setSelected({ 
        ...selected, 
        processingRequest: request, 
        processType: "approve" 
      });
      updateModals({ showProcess: true });
    }
  };

  const handleReject = (requestId: number) => {
    const request = bypassData?.data?.find(r => r.id === requestId);
    if (request) {
      setSelected({ 
        ...selected, 
        processingRequest: request, 
        processType: "reject" 
      });
      updateModals({ showProcess: true });
    }
  };

  const confirmProcess = (adminNote: string) => {
    if (!selected.processingRequest) return;

    const mutation = selected.processType === "approve" ? approveBypassMutation : rejectBypassMutation;
    
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
            processType: null 
          });
          queryClient.invalidateQueries({ queryKey: ["bypass-requests"] });
        },
      }
    );
  };

  const closeModals = () => {
    updateModals({ showProcess: false, showDetail: false });
    setSelected({ 
      processingRequest: null, 
      viewingRequest: null, 
      processType: null 
    });
  };

  if (!session) {
    return (
      <div className="flex h-64 items-center justify-center px-1">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2 text-sm sm:text-base dark:text-gray-300">Loading session...</span>
      </div>
    );
  }

  // CRITICAL: Only outlet admin can access bypass management
  if (!isOutletAdmin) {
    return (
      <div className="flex h-64 items-center justify-center px-1">
        <div className="text-center">
          <span className="text-sm text-red-500 dark:text-red-400 sm:text-base">
            Access Denied
          </span>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
            Only outlet admins can manage bypass requests.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3 sm:space-y-6 sm:px-4 lg:px-0">
        {/* Mobile Header */}
        <div className="block sm:hidden">
          <div className="rounded-b-3xl bg-gradient-to-r from-orange-500 to-orange-600 dark:from-orange-600 dark:to-orange-700 text-white shadow-lg">
            <div className="px-4 py-14">
              <h1 className="text-2xl font-bold">My Outlet Bypass Requests</h1>
              <p className="mt-2 opacity-90">
                Manage bypass requests from workers in your outlet
              </p>
              {statsData?.data && (
                <div className="mt-4 grid grid-cols-4 gap-2">
                  <div className="rounded-lg bg-white/20 dark:bg-white/10 p-2 text-center">
                    <div className="text-lg font-bold">{statsData.data.pending}</div>
                    <div className="text-xs">Pending</div>
                  </div>
                  <div className="rounded-lg bg-white/20 dark:bg-white/10 p-2 text-center">
                    <div className="text-lg font-bold">{statsData.data.approved}</div>
                    <div className="text-xs">Approved</div>
                  </div>
                  <div className="rounded-lg bg-white/20 dark:bg-white/10 p-2 text-center">
                    <div className="text-lg font-bold">{statsData.data.rejected}</div>
                    <div className="text-xs">Rejected</div>
                  </div>
                  <div className="rounded-lg bg-white/20 dark:bg-white/10 p-2 text-center">
                    <div className="text-lg font-bold">{statsData.data.total}</div>
                    <div className="text-xs">Total</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Filter section - overlapping white card */}
          <div className="relative mx-6 -mt-8 rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-lg dark:shadow-gray-900/50">
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-orange-500 dark:bg-orange-600 px-4 text-sm text-white transition-colors hover:bg-orange-600 dark:hover:bg-orange-700">
                    <Filter className="h-4 w-4" />
                    <span>
                      {statusOptions.find(opt => opt.value === filters.status)?.label}
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 dark:bg-gray-800 dark:border-gray-700">
                  {statusOptions.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      onClick={() => updateFilters({ status: option.value as any })}
                      className="dark:hover:bg-gray-700 dark:text-gray-100"
                    >
                      {option.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-blue-500 dark:bg-blue-600 px-4 text-sm text-white transition-colors hover:bg-blue-600 dark:hover:bg-blue-700">
                    <Filter className="h-4 w-4" />
                    <span>
                      {workerTypeOptions.find(opt => opt.value === filters.workerType)?.label}
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 dark:bg-gray-800 dark:border-gray-700">
                  {workerTypeOptions.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      onClick={() => updateFilters({ workerType: option.value as any })}
                      className="dark:hover:bg-gray-700 dark:text-gray-100"
                    >
                      {option.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden sm:block">
          <div className="rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 dark:from-orange-600 dark:to-orange-700 p-6 text-white shadow-lg">
            <h1 className="text-2xl font-bold">My Outlet Bypass Requests</h1>
            <p className="mt-2 opacity-90">
              Manage bypass requests from workers in your outlet
            </p>
            {statsData?.data && (
              <div className="mt-4 grid grid-cols-4 gap-4">
                <div className="rounded-lg bg-white/20 dark:bg-white/10 p-3 text-center">
                  <div className="text-2xl font-bold">{statsData.data.pending}</div>
                  <div className="text-sm">Pending</div>
                </div>
                <div className="rounded-lg bg-white/20 dark:bg-white/10 p-3 text-center">
                  <div className="text-2xl font-bold">{statsData.data.approved}</div>
                  <div className="text-sm">Approved</div>
                </div>
                <div className="rounded-lg bg-white/20 dark:bg-white/10 p-3 text-center">
                  <div className="text-2xl font-bold">{statsData.data.rejected}</div>
                  <div className="text-sm">Rejected</div>
                </div>
                <div className="rounded-lg bg-white/20 dark:bg-white/10 p-3 text-center">
                  <div className="text-2xl font-bold">{statsData.data.total}</div>
                  <div className="text-sm">Total</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Desktop Filter Section */}
        <div className="mx-1 hidden rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm sm:mx-0 sm:block sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-3 sm:flex-row">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-10 min-w-0 rounded-xl border-gray-200 dark:border-gray-600 text-sm lg:min-w-[140px] dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
                  >
                    <FilterIcon className="mr-2 h-4 w-4 flex-shrink-0" />
                    <span className="truncate text-xs sm:text-sm">
                      {statusOptions.find(opt => opt.value === filters.status)?.label}
                    </span>
                    <ChevronDownIcon className="ml-2 h-4 w-4 flex-shrink-0" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 dark:bg-gray-800 dark:border-gray-700">
                  {statusOptions.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      onClick={() => updateFilters({ status: option.value as any })}
                      className="dark:hover:bg-gray-700 dark:text-gray-100"
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
                    className="h-10 min-w-0 rounded-xl border-gray-200 dark:border-gray-600 text-sm lg:min-w-[140px] dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
                  >
                    <FilterIcon className="mr-2 h-4 w-4 flex-shrink-0" />
                    <span className="truncate text-xs sm:text-sm">
                      {workerTypeOptions.find(opt => opt.value === filters.workerType)?.label}
                    </span>
                    <ChevronDownIcon className="ml-2 h-4 w-4 flex-shrink-0" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 dark:bg-gray-800 dark:border-gray-700">
                  {workerTypeOptions.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      onClick={() => updateFilters({ workerType: option.value as any })}
                      className="dark:hover:bg-gray-700 dark:text-gray-100"
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
                className="h-10 rounded-xl border-gray-200 dark:border-gray-600 text-sm dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
              >
                Reset
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="block sm:hidden">
          {isLoading ? (
            <div className="flex h-32 items-center justify-center">
              <Loader2 className="mr-2 h-6 w-6 animate-spin" />
              <span className="text-sm dark:text-gray-300">Loading outlet bypass requests...</span>
            </div>
          ) : error ? (
            <div className="mx-3 p-4 text-center text-red-500 dark:text-red-400">
              <div className="text-sm">Error loading data</div>
              <div className="mt-1 text-xs text-red-400 dark:text-red-300">
                {error.message || "Unknown error"}
              </div>
            </div>
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
                  isProcessing={approveBypassMutation.isPending || rejectBypassMutation.isPending}
                />
              ))}
            </div>
          ) : (
            <div className="mx-5 mt-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 text-center">
              <AlertTriangle className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
              <span className="mt-4 block text-sm text-gray-500 dark:text-gray-400">
                No bypass requests found for your outlet
              </span>
            </div>
          )}
        </div>

        {/* Desktop Table View */}
        <div className="mx-1 hidden rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm sm:mx-0 sm:block">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b dark:border-gray-700">
                  <TableHead className="w-12 text-center text-xs sm:w-16 sm:text-sm dark:text-gray-300">
                    No
                  </TableHead>
                  <TableHead className="min-w-[120px] text-xs sm:min-w-[150px] sm:text-sm dark:text-gray-300">
                    Order
                  </TableHead>
                  <TableHead className="hidden min-w-[100px] text-xs sm:min-w-[120px] sm:text-sm md:table-cell dark:text-gray-300">
                    Worker
                  </TableHead>
                  <TableHead className="w-24 text-center text-xs sm:w-32 sm:text-sm dark:text-gray-300">
                    Station
                  </TableHead>
                  <TableHead className="hidden min-w-[150px] text-xs sm:min-w-[200px] sm:text-sm lg:table-cell dark:text-gray-300">
                    Reason
                  </TableHead>
                  <TableHead className="w-20 text-center text-xs sm:w-24 sm:text-sm dark:text-gray-300">
                    Status
                  </TableHead>
                  <TableHead className="hidden w-24 text-center text-xs sm:table-cell sm:w-32 sm:text-sm dark:text-gray-300">
                    Date
                  </TableHead>
                  <TableHead className="w-32 text-center text-xs sm:w-40 sm:text-sm dark:text-gray-300">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="h-32 text-center"
                    >
                      <div className="flex items-center justify-center">
                        <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                        <span className="text-sm dark:text-gray-300">Loading...</span>
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
                        <div className="text-sm">Error loading data</div>
                        <div className="mt-1 text-xs text-red-400 dark:text-red-300">
                          {error.message || "Unknown error"}
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
                      isProcessing={approveBypassMutation.isPending || rejectBypassMutation.isPending}
                    />
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="h-32 text-center"
                    >
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <AlertTriangle className="h-12 w-12 text-gray-400 dark:text-gray-500" />
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          No bypass requests found for your outlet
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Desktop Pagination */}
        {bypassData?.meta && (
          <div className="mx-1 hidden justify-center rounded-2xl border-t dark:border-gray-700 bg-white dark:bg-gray-800 p-4 sm:mx-0 sm:flex">
            <PaginationSection
              page={bypassData.meta.page}
              take={bypassData.meta.take}
              total={bypassData.meta.total}
              hasNext={
                bypassData.meta.page * bypassData.meta.take < bypassData.meta.total
              }
              hasPrevious={bypassData.meta.page > 1}
              onChangePage={(newPage) => updateFilters({ page: newPage })}
            />
          </div>
        )}

        {/* Mobile Pagination */}
        {bypassData?.meta && (
          <div className="flex justify-center rounded-2xl border-t dark:border-gray-700 bg-white dark:bg-gray-800 p-3 sm:hidden">
            <PaginationSection
              page={bypassData.meta.page}
              take={bypassData.meta.take}
              total={bypassData.meta.total}
              hasNext={
                bypassData.meta.page * bypassData.meta.take < bypassData.meta.total
              }
              hasPrevious={bypassData.meta.page > 1}
              onChangePage={(newPage) => updateFilters({ page: newPage })}
            />
          </div>
        )}
      </div>

      {/* Modals */}
      {selected.processingRequest && selected.processType && (
        <ProcessBypassModal
          open={modals.showProcess}
          onClose={closeModals}
          request={selected.processingRequest}
          type={selected.processType}
          onConfirm={confirmProcess}
          isProcessing={approveBypassMutation.isPending || rejectBypassMutation.isPending}
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