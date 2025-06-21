"use client";

import PaginationSection from "@/components/PaginationSection";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useGetEmployees from "@/hooks/api/employee/useGetEmployees";
import useGetOrders from "@/hooks/api/order/useGetOrders";
import useGetOutlets from "@/hooks/api/outlet/useGetOutlets";
import { OrderSummary } from "@/types/order-management";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import {
  Activity,
  ChevronDownIcon,
  Clock,
  Eye,
  Filter,
  FilterIcon,
  Loader2,
  MapPin,
  Package,
  Search,
  Timer,
  User,
  UserCheck,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
  useQueryState,
} from "nuqs";
import { useEffect, useState } from "react";
import { PendingOrdersTable } from "./PendingOrdersTable";

const PAGE_SIZE = 10;
const DEBOUNCE_DELAY = 300;

const getCellClass = (columnId: string, isAdmin: boolean) => {
  const baseClass = "py-2 px-2 sm:py-3 sm:px-4";
  const styles: Record<string, string> = {
    orderNumber:
      "min-w-[100px] sm:min-w-[120px] text-xs sm:text-sm font-medium",
    customer: isAdmin
      ? "min-w-[120px] sm:min-w-[160px] text-xs sm:text-sm hidden lg:table-cell"
      : "min-w-[150px] sm:min-w-[200px] text-xs sm:text-sm hidden md:table-cell",
    outlet: isAdmin
      ? "min-w-[100px] sm:min-w-[120px] text-xs sm:text-sm hidden md:table-cell"
      : "hidden",
    status: "w-20 sm:w-24 text-center text-xs sm:text-sm",
    total: "w-16 sm:w-20 text-center text-xs sm:text-sm",
    tracking: isAdmin
      ? "w-24 sm:w-32 text-center text-xs sm:text-sm hidden 2xl:table-cell"
      : "w-32 sm:w-40 text-center text-xs sm:text-sm hidden xl:table-cell",
    date: isAdmin
      ? "w-20 sm:w-24 text-center text-xs sm:text-sm hidden xl:table-cell"
      : "w-24 sm:w-32 text-center text-xs sm:text-sm hidden sm:table-cell",
    actions: "w-12 sm:w-16 text-center",
  };
  return `${baseClass} ${styles[columnId] || "text-xs sm:text-sm"}`;
};

const getStatusColor = (status: string) => {
  const statusColors: Record<string, string> = {
    WAITING_FOR_PICKUP: "border-gray-200 bg-gray-50 text-gray-700 dark:border-gray-600 dark:bg-gray-800/50 dark:text-gray-300",
    DRIVER_ON_THE_WAY_TO_CUSTOMER: "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    ARRIVED_AT_CUSTOMER: "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    DRIVER_ON_THE_WAY_TO_OUTLET: "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    ARRIVED_AT_OUTLET: "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
    BEING_WASHED: "border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
    BEING_IRONED: "border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
    BEING_PACKED: "border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
    WAITING_PAYMENT: "border-red-200 bg-red-50 text-red-700 dark:border-red-700 dark:bg-red-900/30 dark:text-red-300",
    READY_FOR_DELIVERY: "border-green-200 bg-green-50 text-green-700 dark:border-green-700 dark:bg-green-900/30 dark:text-green-300",
    BEING_DELIVERED_TO_CUSTOMER: "border-green-200 bg-green-50 text-green-700 dark:border-green-700 dark:bg-green-900/30 dark:text-green-300",
    DELIVERED_TO_CUSTOMER: "border-green-200 bg-green-50 text-green-700 dark:border-green-700 dark:bg-green-900/30 dark:text-green-300",
    COMPLETED: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
    IN_RESOLUTION: "border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  };
  return statusColors[status] || "border-gray-200 bg-gray-50 text-gray-700 dark:border-gray-600 dark:bg-gray-800/50 dark:text-gray-300";
};

const getStatusText = (status: string) => {
  const statusTexts: Record<string, string> = {
    WAITING_FOR_PICKUP: "Menunggu Pickup",
    DRIVER_ON_THE_WAY_TO_CUSTOMER: "Driver Menuju Customer",
    ARRIVED_AT_CUSTOMER: "Driver Sampai",
    DRIVER_ON_THE_WAY_TO_OUTLET: "Menuju Outlet",
    ARRIVED_AT_OUTLET: "Sampai Outlet",
    BEING_WASHED: "Sedang Dicuci",
    BEING_IRONED: "Sedang Disetrika",
    BEING_PACKED: "Sedang Dikemas",
    WAITING_PAYMENT: "Menunggu Pembayaran",
    READY_FOR_DELIVERY: "Siap Diantar",
    BEING_DELIVERED_TO_CUSTOMER: "Sedang Diantar",
    DELIVERED_TO_CUSTOMER: "Terkirim",
    COMPLETED: "Selesai",
    IN_RESOLUTION: "Dalam Penyelesaian",
  };
  return statusTexts[status] || status;
};

const formatDate = (dateString: string) => {
  try {
    return format(new Date(dateString), "dd MMM yyyy, HH:mm", { locale: id });
  } catch {
    return "Invalid date";
  }
};

const formatCurrency = (amount?: number) => {
  if (!amount) return "Rp 0";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

const StatusBadge = ({ status }: { status: string }) => (
  <span
    className={`inline-block rounded px-1.5 py-0.5 text-xs font-semibold ${getStatusColor(status)}`}
  >
    {getStatusText(status)}
  </span>
);

const CustomerInfo = ({ name, email }: { name: string; email: string }) => (
  <div className="flex flex-col">
    <div className="font-medium break-words text-gray-900 dark:text-gray-100">{name}</div>
    <div className="mt-1 flex items-center text-xs text-gray-500 dark:text-gray-400">
      <User className="mr-1 h-3 w-3" />
      <span className="break-all">{email}</span>
    </div>
  </div>
);

const OutletInfo = ({ outletName }: { outletName: string }) => (
  <div className="flex flex-col">
    <div className="flex items-center text-xs text-gray-900 dark:text-gray-100 sm:text-sm">
      <MapPin className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
      <span className="truncate font-medium">{outletName}</span>
    </div>
  </div>
);

const TrackingInfo = ({
  tracking,
  orderStatus,
}: {
  tracking: OrderSummary["tracking"];
  orderStatus: string;
}) => {
  const { currentWorker, pickup, delivery, processHistory } = tracking;

  if (currentWorker) {
    return (
      <div className="flex flex-col">
        <div className="flex items-center text-xs text-blue-600 dark:text-blue-400 sm:text-sm">
          <Package className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
          <span className="truncate font-medium">{currentWorker.name}</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
          <Activity className="h-2 w-2 sm:h-3 sm:w-3" />
          <span>{currentWorker.station}</span>
        </div>
        {currentWorker.hasBypass && (
          <div className="text-xs font-medium text-orange-600 dark:text-orange-400 sm:text-sm">
            ⚠ Bypass Request
          </div>
        )}
      </div>
    );
  }

  if (pickup && orderStatus.includes("DRIVER")) {
    return (
      <div className="flex flex-col">
        <div className="flex items-center text-xs text-green-600 dark:text-green-400 sm:text-sm">
          <User className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
          <span className="truncate font-medium">{pickup.driver}</span>
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400 sm:text-sm">Pickup Driver</div>
      </div>
    );
  }

  if (delivery && orderStatus.includes("DELIVERY")) {
    return (
      <div className="flex flex-col">
        <div className="flex items-center text-xs text-green-600 dark:text-green-400 sm:text-sm">
          <User className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
          <span className="truncate font-medium">{delivery.driver}</span>
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400 sm:text-sm">Delivery Driver</div>
      </div>
    );
  }

  if (processHistory.length > 0) {
    const lastProcess = processHistory[processHistory.length - 1];
    return (
      <div className="flex flex-col">
        <div className="flex items-center text-xs text-gray-600 dark:text-gray-300 sm:text-sm">
          <Timer className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
          <span className="truncate font-medium">{lastProcess.worker}</span>
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
          {lastProcess.station} ({lastProcess.duration})
        </div>
      </div>
    );
  }

  return (
    <div className="text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
      {orderStatus.includes("DRIVER") ? "Awaiting Assignment" : "No Worker"}
    </div>
  );
};

const OrderCard = ({
  order,
  onViewDetail,
  showOutlet = true,
}: {
  order: OrderSummary;
  onViewDetail: (order: OrderSummary) => void;
  showOutlet?: boolean;
}) => (
  <div className="overflow-hidden rounded-2xl border-l-4 border-blue-400 dark:border-blue-500 bg-white dark:bg-gray-800 shadow-md dark:shadow-gray-900/50 transition-all duration-300 hover:shadow-lg dark:hover:shadow-gray-900/70">
    {/* Header */}
    <div className="border-b border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-700/50 p-3.5">
      <div className="flex items-center gap-2.5">
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-sm font-semibold text-white">
          {order.orderNumber.slice(-2)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-0.5 overflow-hidden text-sm font-semibold text-ellipsis whitespace-nowrap text-slate-900 dark:text-gray-100">
            {order.orderNumber}
          </div>
          <div className="flex items-center gap-1.5">
            <StatusBadge status={order.orderStatus} />
            <span className="flex items-center gap-1 text-xs font-semibold text-green-600 dark:text-green-400">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 dark:bg-green-400"></span>
              {formatCurrency(order.totalPrice)}
            </span>
          </div>
        </div>
      </div>
    </div>

    {/* Body */}
    <div className="p-3.5">
      {/* Contact list */}
      <div className="mb-3 flex flex-col gap-2">
        <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-gray-400">
          <User className="h-3.5 w-3.5 flex-shrink-0 text-blue-500 dark:text-blue-400" />
          <span className="truncate">{order.customer.name}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-gray-400">
          <Package className="h-3.5 w-3.5 flex-shrink-0 text-blue-500 dark:text-blue-400" />
          <span className="truncate">{order.customer.email}</span>
        </div>
        {showOutlet && (
          <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-gray-400">
            <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-blue-500 dark:text-blue-400" />
            <span className="truncate">{order.outlet.outletName}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-gray-400">
          <Clock className="h-3.5 w-3.5 flex-shrink-0 text-blue-500 dark:text-blue-400" />
          <span>{formatDate(order.createdAt)}</span>
        </div>
      </div>

      {/* Tracking Info */}
      {order.tracking.currentWorker && (
        <div className="mb-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 p-2">
          <div className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400">
            <Package className="h-3 w-3" />
            <span className="font-medium">
              {order.tracking.currentWorker.name}
            </span>
          </div>
          <div className="text-xs text-blue-500 dark:text-blue-400">
            {order.tracking.currentWorker.station}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={() => onViewDetail(order)}
          className="flex-1 rounded-lg border border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3.5 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 transition-colors hover:bg-blue-50 dark:hover:bg-blue-950/30"
        >
          Lihat Detail
        </button>
      </div>
    </div>
  </div>
);

const OrderRow = ({
  order,
  onViewDetail,
  isAdmin,
}: {
  order: OrderSummary;
  onViewDetail: (order: OrderSummary) => void;
  isAdmin: boolean;
}) => (
  <TableRow className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
    <TableCell className={getCellClass("orderNumber", isAdmin)}>
      <div className="flex flex-col">
        <div className="font-medium break-words text-gray-900 dark:text-gray-100">
          {order.orderNumber}
        </div>
        <div
          className={`mt-1 text-xs break-words text-gray-500 dark:text-gray-400 sm:text-sm ${isAdmin ? "lg:hidden" : "md:hidden"}`}
        >
          {order.customer.name}
        </div>
      </div>
    </TableCell>

    <TableCell className={getCellClass("customer", isAdmin)}>
      <CustomerInfo name={order.customer.name} email={order.customer.email} />
    </TableCell>

    {isAdmin && (
      <TableCell className={getCellClass("outlet", isAdmin)}>
        <OutletInfo outletName={order.outlet.outletName} />
      </TableCell>
    )}

    <TableCell className={getCellClass("status", isAdmin)}>
      <div className="flex justify-center">
        <StatusBadge status={order.orderStatus} />
      </div>
    </TableCell>

    <TableCell className={getCellClass("total", isAdmin)}>
      <div className="text-center">
        <span className="text-sm font-medium dark:text-gray-200">
          {formatCurrency(order.totalPrice)}
        </span>
      </div>
    </TableCell>

    <TableCell className={getCellClass("tracking", isAdmin)}>
      <TrackingInfo tracking={order.tracking} orderStatus={order.orderStatus} />
    </TableCell>

    <TableCell className={getCellClass("date", isAdmin)}>
      <div className="text-center">
        <span className="text-sm dark:text-gray-300">{formatDate(order.createdAt)}</span>
      </div>
    </TableCell>

    <TableCell className={getCellClass("actions", isAdmin)}>
      <div className="flex justify-center">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onViewDetail(order)}
          className="h-7 w-7 p-0 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 sm:h-8 sm:w-8"
          title="Lihat Detail"
        >
          <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
      </div>
    </TableCell>
  </TableRow>
);

export function OrderManagementTable() {
  const { data: session } = useSession();
  const router = useRouter();

  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [search, setSearch] = useQueryState("search", { defaultValue: "" });
  const [status, setStatus] = useQueryState("status", parseAsString);
  const [outletId, setOutletId] = useQueryState("outletId", parseAsString);
  const [employeeId, setEmployeeId] = useQueryState(
    "employeeId",
    parseAsString,
  );
  const [startDate, setStartDate] = useQueryState("startDate", parseAsString);
  const [endDate, setEndDate] = useQueryState("endDate", parseAsString);
  const [sortBy] = useQueryState(
    "sortBy",
    parseAsString.withDefault("createdAt"),
  );
  const [sortOrder] = useQueryState(
    "sortOrder",
    parseAsStringEnum(["asc", "desc"]).withDefault("desc"),
  );

  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [activeTab, setActiveTab] = useState("all");

  const isAdmin = session?.user?.role === "ADMIN";
  const isOutletAdmin = session?.user?.role === "OUTLET_ADMIN";
  const hasAccess = isAdmin || isOutletAdmin;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      if (page !== 1 && search !== debouncedSearch) {
        setPage(1);
      }
    }, DEBOUNCE_DELAY);
    return () => clearTimeout(timer);
  }, [search, page, debouncedSearch, setPage]);

  const getColSpan = () => {
    return isAdmin ? 8 : 7;
  };

  const {
    data: ordersData,
    isLoading,
    error,
  } = useGetOrders({
    page,
    take: PAGE_SIZE,
    search: debouncedSearch,
    status: status ?? undefined,
    outletId: outletId ?? undefined,
    employeeId: employeeId ?? undefined,
    startDate: startDate ?? undefined,
    endDate: endDate ?? undefined,
    sortBy,
    sortOrder,
  });

  const { data: outletsData, isLoading: isLoadingOutlets } = useGetOutlets({
    all: true,
  });

  const { data: employeesData, isLoading: isLoadingEmployees } =
    useGetEmployees({
      all: true,
      outletId: isAdmin ? (outletId ?? undefined) : undefined,
    });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleStatusChange = (newStatus: string | undefined) => {
    setStatus(newStatus ?? null);
    setPage(1);
  };

  const handleOutletChange = (newOutletId: string | undefined) => {
    setOutletId(newOutletId ?? null);
    setPage(1);
  };

  const handleEmployeeChange = (newEmployeeId: string | undefined) => {
    setEmployeeId(newEmployeeId ?? null);
    setPage(1);
  };

  const handleDateRangeChange = (type: "start" | "end", value: string) => {
    if (type === "start") {
      setStartDate(value || null);
    } else {
      setEndDate(value || null);
    }
    setPage(1);
  };

  const handleReset = () => {
    setSearch("");
    setStatus(null);
    setOutletId(null);
    setEmployeeId(null);
    setStartDate(null);
    setEndDate(null);
    setPage(1);
  };

  const handleViewDetail = (order: OrderSummary) => {
    router.push(`/admin/orders/${order.uuid}`);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  if (!session) {
    return (
      <div className="flex h-64 items-center justify-center px-1">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2 text-sm sm:text-base dark:text-gray-300">Loading session...</span>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="flex h-64 items-center justify-center px-1">
        <div className="text-center">
          <span className="text-sm text-red-500 dark:text-red-400 sm:text-base">
            Access Denied
          </span>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
            You don't have permission to view this page.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading && !ordersData) {
    return (
      <div className="flex h-64 items-center justify-center px-1">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2 text-sm sm:text-base dark:text-gray-300">
          Memuat data pesanan...
        </span>
      </div>
    );
  }

  if (error && !ordersData) {
    return (
      <div className="flex h-64 items-center justify-center px-1">
        <div className="text-center">
          <span className="text-sm text-red-500 dark:text-red-400 sm:text-base">
            Kesalahan memuat data
          </span>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
            {error.message || "Terjadi kesalahan tidak dikenal"}
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
          <div className="rounded-b-3xl bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-white shadow-lg">
            {/* Header content */}
            <div className="px-4 py-14">
              <h1 className="text-2xl font-bold">Order Management</h1>
              <p className="mt-2 opacity-90">
                {isAdmin
                  ? "Lihat dan kelola semua pesanan dengan tracking lengkap"
                  : "Lihat dan kelola pesanan outlet Anda dengan tracking real-time"}
              </p>
            </div>
          </div>

          {/* Search and filter section - overlapping white card */}
          <div className="relative mx-6 -mt-8 rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-lg dark:shadow-gray-900/50">
            {/* Search input */}
            <div className="relative mb-3">
              <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Cari berdasarkan nomor order atau customer..."
                value={search}
                onChange={handleSearchChange}
                className="w-full rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 py-3.5 pr-4 pl-10 text-sm transition-all focus:border-blue-500 dark:focus:border-blue-400 focus:bg-white dark:focus:bg-gray-800 focus:ring-blue-500 dark:focus:ring-blue-400 focus:outline-none text-gray-900 dark:text-gray-100"
              />
            </div>

            {/* Tabs for outlet admin */}
            {isOutletAdmin && (
              <div className="mb-3">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-2 dark:bg-gray-700">
                    <TabsTrigger value="all" className="dark:data-[state=active]:bg-gray-600">Semua Pesanan</TabsTrigger>
                    <TabsTrigger value="pending" className="dark:data-[state=active]:bg-gray-600">Pending Proses</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            )}

            {/* Filter buttons */}
            <div className="space-y-3">
              {/* First row - Outlet (only for admin) */}
              {isAdmin && (
                <div className="flex gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-blue-500 dark:bg-blue-600 px-4 text-sm text-white transition-colors hover:bg-blue-600 dark:hover:bg-blue-700"
                        disabled={isLoadingOutlets}
                      >
                        <MapPin className="h-4 w-4" />
                        <span className="truncate">
                          {outletId
                            ? outletsData?.data?.find(
                                (outlet) => outlet.id.toString() === outletId,
                              )?.outletName || "Outlet"
                            : "Outlet"}
                        </span>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="max-h-64 w-56 overflow-y-auto dark:bg-gray-800 dark:border-gray-700"
                    >
                      <DropdownMenuItem
                        onClick={() => handleOutletChange(undefined)}
                        className="dark:hover:bg-gray-700 dark:text-gray-100"
                      >
                        <MapPin className="mr-2 h-4 w-4" />
                        Semua Outlet
                      </DropdownMenuItem>
                      {outletsData?.data?.map((outlet) => (
                        <DropdownMenuItem
                          key={outlet.id}
                          onClick={() =>
                            handleOutletChange(outlet.id.toString())
                          }
                          className="dark:hover:bg-gray-700 dark:text-gray-100"
                        >
                          <div className="flex min-w-0 flex-1 items-center justify-between">
                            <div className="flex min-w-0 flex-1 flex-col">
                              <div className="flex items-center gap-2">
                                <span className="truncate font-medium">
                                  {outlet.outletName}
                                </span>
                                <Badge
                                  variant="outline"
                                  className={`px-1 py-0.5 text-xs ${
                                    outlet.isActive
                                      ? "border-green-200 bg-green-50 text-green-700 dark:border-green-700 dark:bg-green-900/30 dark:text-green-300"
                                      : "border-red-200 bg-red-50 text-red-700 dark:border-red-700 dark:bg-red-900/30 dark:text-red-300"
                                  }`}
                                >
                                  {outlet.isActive ? "Active" : "Inactive"}
                                </Badge>
                              </div>
                              <span className="truncate text-xs text-gray-500 dark:text-gray-400">
                                {outlet.address}
                              </span>
                            </div>
                          </div>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}

              {/* Status and Employee row */}
              <div className="flex gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-blue-500 dark:bg-blue-600 px-4 text-sm text-white transition-colors hover:bg-blue-600 dark:hover:bg-blue-700">
                      <Filter className="h-4 w-4" />
                      <span className="truncate">
                        {status
                          ? getStatusText(status).split(" ")[0]
                          : "Status"}
                      </span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 dark:bg-gray-800 dark:border-gray-700">
                    <DropdownMenuItem
                      onClick={() => handleStatusChange(undefined)}
                      className="dark:hover:bg-gray-700 dark:text-gray-100"
                    >
                      Semua Status
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleStatusChange("WAITING_FOR_PICKUP")}
                      className="dark:hover:bg-gray-700 dark:text-gray-100"
                    >
                      Menunggu Pickup
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleStatusChange("BEING_WASHED")}
                      className="dark:hover:bg-gray-700 dark:text-gray-100"
                    >
                      Sedang Dicuci
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleStatusChange("BEING_IRONED")}
                      className="dark:hover:bg-gray-700 dark:text-gray-100"
                    >
                      Sedang Disetrika
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleStatusChange("BEING_PACKED")}
                      className="dark:hover:bg-gray-700 dark:text-gray-100"
                    >
                      Sedang Dikemas
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleStatusChange("WAITING_PAYMENT")}
                      className="dark:hover:bg-gray-700 dark:text-gray-100"
                    >
                      Menunggu Pembayaran
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleStatusChange("COMPLETED")}
                      className="dark:hover:bg-gray-700 dark:text-gray-100"
                    >
                      Selesai
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-blue-500 dark:bg-blue-600 px-4 text-sm text-white transition-colors hover:bg-blue-600 dark:hover:bg-blue-700"
                      disabled={isLoadingEmployees}
                    >
                      <UserCheck className="h-4 w-4" />
                      <span className="truncate">
                        {employeeId
                          ? employeesData?.data?.find(
                              (emp) => emp.id.toString() === employeeId,
                            )?.user?.firstName || "Karyawan"
                          : "Karyawan"}
                      </span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="max-h-64 w-56 overflow-y-auto dark:bg-gray-800 dark:border-gray-700"
                  >
                    <DropdownMenuItem
                      onClick={() => handleEmployeeChange(undefined)}
                      className="dark:hover:bg-gray-700 dark:text-gray-100"
                    >
                      <UserCheck className="mr-2 h-4 w-4" />
                      Semua Karyawan
                    </DropdownMenuItem>
                    {employeesData?.data?.map((employee) => (
                      <DropdownMenuItem
                        key={employee.id}
                        onClick={() =>
                          handleEmployeeChange(employee.id.toString())
                        }
                        className="dark:hover:bg-gray-700 dark:text-gray-100"
                      >
                        <div className="flex min-w-0 flex-1 items-center justify-between">
                          <div className="flex min-w-0 flex-1 flex-col">
                            <span className="truncate font-medium">
                              {employee.user?.firstName}{" "}
                              {employee.user?.lastName}
                            </span>
                            <span className="truncate text-xs text-gray-500 dark:text-gray-400">
                              {employee.role} - {employee.outlet?.outletName}
                            </span>
                          </div>
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Date range row - Hidden on pending tab */}
              {activeTab !== "pending" && (
                <div className="flex gap-2">
                  <Input
                    type="date"
                    placeholder="Tanggal Mulai"
                    value={startDate || ""}
                    onChange={(e) =>
                      handleDateRangeChange("start", e.target.value)
                    }
                    className="h-12 flex-1 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-3 text-sm transition-all focus:border-blue-500 dark:focus:border-blue-400 focus:bg-white dark:focus:bg-gray-800 focus:ring-blue-500 dark:focus:ring-blue-400 focus:outline-none dark:text-gray-100"
                  />
                  <Input
                    type="date"
                    placeholder="Tanggal Akhir"
                    value={endDate || ""}
                    onChange={(e) =>
                      handleDateRangeChange("end", e.target.value)
                    }
                    className="h-12 flex-1 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-3 text-sm transition-all focus:border-blue-500 dark:focus:border-blue-400 focus:bg-white dark:focus:bg-gray-800 focus:ring-blue-500 dark:focus:ring-blue-400 focus:outline-none dark:text-gray-100"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden sm:block">
          <div className="rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 p-6 text-white shadow-lg">
            <h1 className="text-2xl font-bold">Order Management</h1>
            <p className="mt-2 opacity-90">
              {isAdmin
                ? "Lihat dan kelola semua pesanan dengan tracking lengkap"
                : "Lihat dan kelola pesanan outlet Anda dengan tracking real-time"}
            </p>
          </div>
        </div>

        {/* Desktop Tabs and Search & Filter Section */}
        <div className="mx-1 hidden rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm sm:mx-0 sm:block sm:p-6">
          {/* Tabs for outlet admin */}
          {isOutletAdmin && (
            <div className="mb-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid h-12 w-full max-w-lg grid-cols-2 rounded-xl bg-gray-100 dark:bg-gray-700 p-1">
                  <TabsTrigger
                    value="all"
                    className="h-10 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 transition-all hover:text-gray-900 dark:hover:text-gray-200 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-600 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=active]:shadow-sm"
                  >
                    Semua Pesanan
                  </TabsTrigger>
                  <TabsTrigger
                    value="pending"
                    className="h-10 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 transition-all hover:text-gray-900 dark:hover:text-gray-200 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-600 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=active]:shadow-sm"
                  >
                    Pending Proses
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          )}

          <div className="space-y-4">
            {/* Search */}
            <div className="relative w-full">
              <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
              <Input
                placeholder="Cari berdasarkan nomor order atau customer..."
                value={search}
                onChange={handleSearchChange}
                className="rounded-xl border-gray-200 dark:border-gray-600 pl-12 text-sm focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-gray-100"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:items-center lg:gap-4">
              <div className="flex flex-col gap-3 sm:flex-row lg:items-center lg:gap-3">
                {isAdmin && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="h-10 min-w-0 rounded-xl border-gray-200 dark:border-gray-600 text-sm lg:min-w-[140px] dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
                        disabled={isLoadingOutlets}
                      >
                        <MapPin className="mr-2 h-4 w-4 flex-shrink-0" />
                        <span className="truncate text-xs sm:text-sm">
                          {outletId
                            ? outletsData?.data?.find(
                                (outlet) => outlet.id.toString() === outletId,
                              )?.outletName || "Outlet Dipilih"
                            : "Semua Outlet"}
                        </span>
                        <ChevronDownIcon className="ml-2 h-4 w-4 flex-shrink-0" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="max-h-64 w-56 overflow-y-auto dark:bg-gray-800 dark:border-gray-700"
                    >
                      <DropdownMenuItem
                        onClick={() => handleOutletChange(undefined)}
                        className="dark:hover:bg-gray-700 dark:text-gray-100"
                      >
                        <MapPin className="mr-2 h-4 w-4" />
                        Semua Outlet
                      </DropdownMenuItem>
                      {outletsData?.data?.map((outlet) => (
                        <DropdownMenuItem
                          key={outlet.id}
                          onClick={() =>
                            handleOutletChange(outlet.id.toString())
                          }
                          className="dark:hover:bg-gray-700 dark:text-gray-100"
                        >
                          <div className="flex min-w-0 flex-1 items-center justify-between">
                            <div className="flex min-w-0 flex-1 flex-col">
                              <div className="flex items-center gap-2">
                                <span className="truncate font-medium">
                                  {outlet.outletName}
                                </span>
                                <Badge
                                  variant="outline"
                                  className={`px-1 py-0.5 text-xs ${
                                    outlet.isActive
                                      ? "border-green-200 bg-green-50 text-green-700 dark:border-green-700 dark:bg-green-900/30 dark:text-green-300"
                                      : "border-red-200 bg-red-50 text-red-700 dark:border-red-700 dark:bg-red-900/30 dark:text-red-300"
                                  }`}
                                >
                                  {outlet.isActive ? "Active" : "Inactive"}
                                </Badge>
                              </div>
                              <span className="truncate text-xs text-gray-500 dark:text-gray-400">
                                {outlet.address}
                              </span>
                            </div>
                          </div>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="h-10 min-w-0 rounded-xl border-gray-200 dark:border-gray-600 text-sm lg:min-w-[140px] dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
                    >
                      <FilterIcon className="mr-2 h-4 w-4 flex-shrink-0" />
                      <span className="truncate text-xs sm:text-sm">
                        {status ? getStatusText(status) : "Semua Status"}
                      </span>
                      <ChevronDownIcon className="ml-2 h-4 w-4 flex-shrink-0" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="max-h-64 w-56 overflow-y-auto dark:bg-gray-800 dark:border-gray-700"
                  >
                    <DropdownMenuItem
                      onClick={() => handleStatusChange(undefined)}
                      className="dark:hover:bg-gray-700 dark:text-gray-100"
                    >
                      Semua Status
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleStatusChange("WAITING_FOR_PICKUP")}
                      className="dark:hover:bg-gray-700 dark:text-gray-100"
                    >
                      Menunggu Pickup
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleStatusChange("BEING_WASHED")}
                      className="dark:hover:bg-gray-700 dark:text-gray-100"
                    >
                      Sedang Dicuci
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleStatusChange("BEING_IRONED")}
                      className="dark:hover:bg-gray-700 dark:text-gray-100"
                    >
                      Sedang Disetrika
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleStatusChange("BEING_PACKED")}
                      className="dark:hover:bg-gray-700 dark:text-gray-100"
                    >
                      Sedang Dikemas
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleStatusChange("WAITING_PAYMENT")}
                      className="dark:hover:bg-gray-700 dark:text-gray-100"
                    >
                      Menunggu Pembayaran
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleStatusChange("COMPLETED")}
                      className="dark:hover:bg-gray-700 dark:text-gray-100"
                    >
                      Selesai
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="h-10 min-w-0 rounded-xl border-gray-200 dark:border-gray-600 text-sm lg:min-w-[140px] dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
                      disabled={isLoadingEmployees}
                    >
                      <UserCheck className="mr-2 h-4 w-4 flex-shrink-0" />
                      <span className="truncate text-xs sm:text-sm">
                        {employeeId
                          ? employeesData?.data?.find(
                              (emp) => emp.id.toString() === employeeId,
                            )?.user?.firstName || "Karyawan Dipilih"
                          : "Semua Karyawan"}
                      </span>
                      <ChevronDownIcon className="ml-2 h-4 w-4 flex-shrink-0" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="max-h-64 w-56 overflow-y-auto dark:bg-gray-800 dark:border-gray-700"
                  >
                    <DropdownMenuItem
                      onClick={() => handleEmployeeChange(undefined)}
                      className="dark:hover:bg-gray-700 dark:text-gray-100"
                    >
                      <UserCheck className="mr-2 h-4 w-4" />
                      Semua Karyawan
                    </DropdownMenuItem>
                    {employeesData?.data?.map((employee) => (
                      <DropdownMenuItem
                        key={employee.id}
                        onClick={() =>
                          handleEmployeeChange(employee.id.toString())
                        }
                        className="dark:hover:bg-gray-700 dark:text-gray-100"
                      >
                        <div className="flex min-w-0 flex-1 items-center justify-between">
                          <div className="flex min-w-0 flex-1 flex-col">
                            <span className="truncate font-medium">
                              {employee.user?.firstName}{" "}
                              {employee.user?.lastName}
                            </span>
                            <span className="truncate text-xs text-gray-500 dark:text-gray-400">
                              {employee.role} - {employee.outlet?.outletName}
                            </span>
                          </div>
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row lg:items-center lg:gap-3">
                {/* Date range - Hidden on pending tab */}
                {activeTab !== "pending" && (
                  <div className="flex gap-2">
                    <Input
                      type="date"
                      placeholder="Tanggal Mulai"
                      value={startDate || ""}
                      onChange={(e) =>
                        handleDateRangeChange("start", e.target.value)
                      }
                      className="h-10 w-32 rounded-xl border-gray-200 dark:border-gray-600 text-xs sm:w-36 sm:text-sm dark:bg-gray-700 dark:text-gray-100"
                    />
                    <Input
                      type="date"
                      placeholder="Tanggal Akhir"
                      value={endDate || ""}
                      onChange={(e) =>
                        handleDateRangeChange("end", e.target.value)
                      }
                      className="h-10 w-32 rounded-xl border-gray-200 dark:border-gray-600 text-xs sm:w-36 sm:text-sm dark:bg-gray-700 dark:text-gray-100"
                    />
                  </div>
                )}

                <Button
                  variant="outline"
                  onClick={handleReset}
                  disabled={
                    !search &&
                    !status &&
                    !outletId &&
                    !employeeId &&
                    !startDate &&
                    !endDate
                  }
                  className="h-10 rounded-xl border-gray-200 dark:border-gray-600 text-sm dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
                >
                  Reset
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="mx-1 sm:mx-0"
        >
          <TabsContent value="all" className="space-y-4">
            {/* Mobile Card View */}
            <div className="block sm:hidden">
              {isLoading ? (
                <div className="flex h-32 items-center justify-center">
                  <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                  <span className="text-sm dark:text-gray-300">Memuat data pesanan...</span>
                </div>
              ) : error ? (
                <div className="mx-3 p-4 text-center text-red-500 dark:text-red-400">
                  <div className="text-sm">Kesalahan memuat data pesanan</div>
                  <div className="mt-1 text-xs text-red-400 dark:text-red-300">
                    {error.message || "Kesalahan tidak diketahui"}
                  </div>
                </div>
              ) : ordersData?.data?.length ? (
                <div className="space-y-2 px-3 pt-2">
                  {ordersData.data.map((order) => (
                    <OrderCard
                      key={order.uuid}
                      order={order}
                      onViewDetail={handleViewDetail}
                      showOutlet={isAdmin}
                    />
                  ))}
                </div>
              ) : (
                <div className="mx-5 mt-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 text-center">
                  <span className="mb-4 block text-sm text-gray-500 dark:text-gray-400">
                    {debouncedSearch
                      ? `Tidak ada pesanan ditemukan untuk "${debouncedSearch}"`
                      : "Belum ada pesanan yang tersedia"}
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
                      <TableHead className="min-w-[100px] text-xs sm:min-w-[120px] sm:text-sm dark:text-gray-300">
                        No. Order
                      </TableHead>
                      <TableHead
                        className={`${isAdmin ? "hidden min-w-[120px] sm:min-w-[160px] lg:table-cell" : "hidden min-w-[150px] sm:min-w-[200px] md:table-cell"} text-xs sm:text-sm dark:text-gray-300`}
                      >
                        Customer
                      </TableHead>
                      {isAdmin && (
                        <TableHead className="hidden min-w-[100px] text-xs sm:min-w-[120px] sm:text-sm md:table-cell dark:text-gray-300">
                          Outlet
                        </TableHead>
                      )}
                      <TableHead className="w-20 text-center text-xs sm:w-24 sm:text-sm dark:text-gray-300">
                        Status
                      </TableHead>
                      <TableHead className="w-16 text-center text-xs sm:w-20 sm:text-sm dark:text-gray-300">
                        Total
                      </TableHead>
                      <TableHead
                        className={`${isAdmin ? "hidden w-24 sm:w-32 2xl:table-cell" : "hidden w-32 sm:w-40 xl:table-cell"} text-center text-xs sm:text-sm dark:text-gray-300`}
                      >
                        Worker
                      </TableHead>
                      <TableHead
                        className={`${isAdmin ? "hidden w-20 sm:w-24 xl:table-cell" : "hidden w-24 sm:table-cell sm:w-32"} text-center text-xs sm:text-sm dark:text-gray-300`}
                      >
                        Tanggal
                      </TableHead>
                      <TableHead className="w-12 text-center text-xs sm:w-16 sm:text-sm dark:text-gray-300">
                        Aksi
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell
                          colSpan={getColSpan()}
                          className="h-32 text-center"
                        >
                          <div className="flex items-center justify-center">
                            <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                            <span className="text-sm dark:text-gray-300">
                              Memuat data pesanan...
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : error ? (
                      <TableRow>
                        <TableCell
                          colSpan={getColSpan()}
                          className="h-32 text-center text-red-500 dark:text-red-400"
                        >
                          <div>
                            <div className="text-sm">
                              Kesalahan memuat data pesanan
                            </div>
                            <div className="mt-1 text-xs text-red-400 dark:text-red-300">
                              {error.message || "Kesalahan tidak diketahui"}
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : ordersData?.data?.length ? (
                      ordersData.data.map((order) => (
                        <OrderRow
                          key={order.uuid}
                          order={order}
                          onViewDetail={handleViewDetail}
                          isAdmin={isAdmin}
                        />
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={getColSpan()}
                          className="h-32 text-center"
                        >
                          <div className="flex flex-col items-center justify-center space-y-3">
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {debouncedSearch
                                ? `Tidak ada pesanan ditemukan untuk "${debouncedSearch}"`
                                : "Belum ada pesanan yang tersedia"}
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Pagination */}
            {ordersData?.meta && (
              <>
                {/* Desktop Pagination */}
                <div className="mx-1 hidden justify-center rounded-2xl border-t dark:border-gray-700 bg-white dark:bg-gray-800 p-4 sm:mx-0 sm:flex">
                  <PaginationSection
                    page={ordersData.meta.page}
                    take={ordersData.meta.take}
                    total={ordersData.meta.total}
                    hasNext={ordersData.meta.hasNext}
                    hasPrevious={ordersData.meta.hasPrevious}
                    onChangePage={handlePageChange}
                  />
                </div>

                {/* Mobile Pagination */}
                <div className="flex justify-center rounded-2xl border-t dark:border-gray-700 bg-white dark:bg-gray-800 p-3 sm:hidden">
                  <PaginationSection
                    page={ordersData.meta.page}
                    take={ordersData.meta.take}
                    total={ordersData.meta.total}
                    hasNext={ordersData.meta.hasNext}
                    hasPrevious={ordersData.meta.hasPrevious}
                    onChangePage={handlePageChange}
                  />
                </div>
              </>
            )}
          </TabsContent>

          {isOutletAdmin && (
            <TabsContent value="pending">
              <PendingOrdersTable />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </>
  );
}