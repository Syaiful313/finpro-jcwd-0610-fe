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
import { useState } from "react";
import { useDebounceValue } from "usehooks-ts";
import { PendingOrdersTable } from "./PendingOrdersTable";

const PAGE_SIZE = 10;

const getCellClass = (columnId: string, isAdmin: boolean) => {
  const baseClass = "py-2 px-2 sm:py-3 sm:px-4";
  const styles: Record<string, string> = {
    orderNumber:
      "min-w-[120px] sm:min-w-[150px] text-xs sm:text-sm font-medium",
    customer:
      "min-w-[150px] sm:min-w-[200px] text-xs sm:text-sm hidden md:table-cell",
    outlet: isAdmin
      ? "min-w-[120px] sm:min-w-[150px] text-xs sm:text-sm hidden lg:table-cell"
      : "hidden",
    status: "w-24 sm:w-32 text-center",
    total: "w-20 sm:w-28 text-center text-xs sm:text-sm",
    tracking:
      "w-32 sm:w-40 text-center text-xs sm:text-sm hidden xl:table-cell",
    date: "w-24 sm:w-32 text-center text-xs sm:text-sm hidden sm:table-cell",
    actions: "w-16 sm:w-20 text-center",
  };
  return `${baseClass} ${styles[columnId] || "text-xs sm:text-sm"}`;
};

const getStatusColor = (status: string) => {
  const statusColors: Record<string, string> = {
    WAITING_FOR_PICKUP: "border-gray-200 bg-gray-50 text-gray-700",
    DRIVER_ON_THE_WAY_TO_CUSTOMER: "border-blue-200 bg-blue-50 text-blue-700",
    ARRIVED_AT_CUSTOMER: "border-blue-200 bg-blue-50 text-blue-700",
    DRIVER_ON_THE_WAY_TO_OUTLET: "border-blue-200 bg-blue-50 text-blue-700",
    ARRIVED_AT_OUTLET: "border-orange-200 bg-orange-50 text-orange-700",
    BEING_WASHED: "border-yellow-200 bg-yellow-50 text-yellow-700",
    BEING_IRONED: "border-yellow-200 bg-yellow-50 text-yellow-700",
    BEING_PACKED: "border-yellow-200 bg-yellow-50 text-yellow-700",
    WAITING_PAYMENT: "border-red-200 bg-red-50 text-red-700",
    READY_FOR_DELIVERY: "border-green-200 bg-green-50 text-green-700",
    BEING_DELIVERED_TO_CUSTOMER: "border-green-200 bg-green-50 text-green-700",
    DELIVERED_TO_CUSTOMER: "border-green-200 bg-green-50 text-green-700",
    COMPLETED: "border-emerald-200 bg-emerald-50 text-emerald-700",
    IN_RESOLUTION: "border-purple-200 bg-purple-50 text-purple-700",
  };
  return statusColors[status] || "border-gray-200 bg-gray-50 text-gray-700";
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

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

const StatusBadge = ({ status }: { status: string }) => (
  <Badge
    variant="outline"
    className={`px-1.5 py-0.5 text-xs font-medium sm:px-2 sm:py-1 ${getStatusColor(status)}`}
  >
    {getStatusText(status)}
  </Badge>
);

const CustomerInfo = ({ name, email }: { name: string; email: string }) => (
  <div className="flex flex-col">
    <div className="flex items-center text-xs text-gray-900">
      <User className="mr-1 h-3 w-3" />
      <span className="truncate font-medium">{name}</span>
    </div>
    <div className="truncate text-xs text-gray-500">{email}</div>
  </div>
);

const OutletInfo = ({ outletName }: { outletName: string }) => (
  <div className="flex flex-col">
    <div className="flex items-center text-xs text-gray-900">
      <MapPin className="mr-1 h-3 w-3" />
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
        <div className="flex items-center text-xs text-blue-600">
          <Package className="mr-1 h-3 w-3" />
          <span className="truncate font-medium">{currentWorker.name}</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <Activity className="h-2 w-2" />
          <span>{currentWorker.station}</span>
        </div>
        {currentWorker.hasBypass && (
          <div className="text-xs font-medium text-orange-600">
            ⚠ Bypass Request
          </div>
        )}
      </div>
    );
  }

  if (pickup && orderStatus.includes("DRIVER")) {
    return (
      <div className="flex flex-col">
        <div className="flex items-center text-xs text-green-600">
          <User className="mr-1 h-3 w-3" />
          <span className="truncate font-medium">{pickup.driver}</span>
        </div>
        <div className="text-xs text-gray-500">Pickup Driver</div>
      </div>
    );
  }

  if (delivery && orderStatus.includes("DELIVERY")) {
    return (
      <div className="flex flex-col">
        <div className="flex items-center text-xs text-green-600">
          <User className="mr-1 h-3 w-3" />
          <span className="truncate font-medium">{delivery.driver}</span>
        </div>
        <div className="text-xs text-gray-500">Delivery Driver</div>
      </div>
    );
  }

  if (processHistory.length > 0) {
    const lastProcess = processHistory[processHistory.length - 1];
    return (
      <div className="flex flex-col">
        <div className="flex items-center text-xs text-gray-600">
          <Timer className="mr-1 h-3 w-3" />
          <span className="truncate font-medium">{lastProcess.worker}</span>
        </div>
        <div className="text-xs text-gray-500">
          {lastProcess.station} ({lastProcess.duration})
        </div>
      </div>
    );
  }

  return (
    <div className="text-xs text-gray-500">
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
  <div className="rounded-lg border bg-white p-2.5 shadow-sm transition-shadow hover:shadow-md">
    <div className="mb-2 flex items-start justify-between">
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center gap-2">
          <StatusBadge status={order.orderStatus} />
        </div>
        <h3 className="truncate pr-1 text-sm font-medium text-gray-900">
          {order.orderNumber}
        </h3>
      </div>
      <div className="flex flex-shrink-0">
        <Button
          size="sm"
          variant="outline"
          onClick={() => onViewDetail(order)}
          className="h-7 w-7 p-0"
          title="Lihat Detail"
        >
          <Eye className="h-3 w-3" />
        </Button>
      </div>
    </div>

    <div className="space-y-1.5 text-xs text-gray-600">
      <div>
        <span className="font-medium text-gray-800">Customer:</span>
        <div className="mt-0.5 leading-relaxed text-gray-600">
          {order.customer.name} - {order.customer.email}
        </div>
      </div>

      {showOutlet && (
        <div>
          <span className="font-medium text-gray-800">Outlet:</span>
          <div className="mt-0.5 leading-relaxed text-gray-600">
            {order.outlet.outletName}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 flex-1 items-center">
          <Clock className="mr-1 h-3 w-3 flex-shrink-0" />
          <span className="truncate text-xs">
            {formatDate(order.createdAt)}
          </span>
        </div>
        <div className="flex-shrink-0 text-right">
          <span className="font-medium text-gray-800">
            {formatCurrency(order.totalPrice)}
          </span>
        </div>
      </div>

      {order.tracking.currentWorker && (
        <div className="flex items-center gap-2 pt-1">
          <div className="flex flex-1 items-center text-blue-600">
            <Package className="mr-1 h-3 w-3" />
            <span className="truncate">
              {order.tracking.currentWorker.name}
            </span>
          </div>
          <div className="text-xs text-gray-500">
            {order.tracking.currentWorker.station}
          </div>
        </div>
      )}

      <div className="pt-1">
        <div className="text-xs text-gray-500">
          Progress: {order.tracking.processHistory.length} of 3 stations
          completed
        </div>
        {order.tracking.timeline.length > 0 && (
          <div className="text-xs text-blue-600">
            Last:{" "}
            {order.tracking.timeline[order.tracking.timeline.length - 1]?.event}
          </div>
        )}
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
  <TableRow className="border-b transition-colors hover:bg-gray-50">
    <TableCell className={getCellClass("orderNumber", isAdmin)}>
      <div className="flex flex-col">
        <div className="font-medium break-words text-gray-900">
          {order.orderNumber}
        </div>
        <div className="mt-1 text-xs break-words text-gray-500 md:hidden">
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
        <span className="text-sm font-medium">
          {formatCurrency(order.totalPrice)}
        </span>
      </div>
    </TableCell>

    <TableCell className={getCellClass("tracking", isAdmin)}>
      <TrackingInfo tracking={order.tracking} orderStatus={order.orderStatus} />
    </TableCell>

    <TableCell className={getCellClass("date", isAdmin)}>
      <div className="text-center">
        <span className="text-sm">{formatDate(order.createdAt)}</span>
      </div>
    </TableCell>

    <TableCell className={getCellClass("actions", isAdmin)}>
      <div className="flex justify-center">
        <Button
          size="sm"
          variant="outline"
          onClick={() => onViewDetail(order)}
          className="h-7 w-7 p-0 sm:h-8 sm:w-8"
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

  const [debouncedSearch] = useDebounceValue(search, 500);
  const [activeTab, setActiveTab] = useState("all");

  const isAdmin = session?.user?.role === "ADMIN";
  const isOutletAdmin = session?.user?.role === "OUTLET_ADMIN";
  const hasAccess = isAdmin || isOutletAdmin;

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
    setPage(1);
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
        <span className="ml-2 text-sm sm:text-base">Loading session...</span>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="flex h-64 items-center justify-center px-1">
        <div className="text-center">
          <span className="text-sm text-red-500 sm:text-base">
            Access Denied
          </span>
          <p className="mt-2 text-xs text-gray-500 sm:text-sm">
            You don't have permission to view this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 px-1 sm:space-y-6 sm:px-4 lg:px-0">
      <div className="px-1 sm:px-0">
        <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
          Order Management
        </h1>
        <p className="text-sm text-gray-600 sm:text-base">
          {isAdmin
            ? "Lihat dan kelola semua pesanan dengan tracking lengkap"
            : "Lihat dan kelola pesanan outlet Anda dengan tracking real-time"}
        </p>
      </div>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="mx-1 sm:mx-0"
      >
        {isOutletAdmin && (
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="all">Semua Pesanan</TabsTrigger>
            <TabsTrigger value="pending">Pending Proses</TabsTrigger>
          </TabsList>
        )}

        {/* All Orders Tab */}
        <TabsContent value="all" className="space-y-4">
          {/* Search Section */}
          <div className="relative w-full">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Cari berdasarkan nomor order atau customer..."
              value={search}
              onChange={handleSearchChange}
              className="h-10 pl-10 text-sm"
            />
          </div>

          {/* Filter Section */}
          <div className="flex flex-col gap-3 rounded-lg border p-2 shadow-sm sm:gap-4 sm:p-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-3 lg:items-center">
              {/* Outlet Filter - Only for Admin */}
              {isAdmin && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="h-9 min-w-0 text-sm sm:h-10 lg:min-w-[140px]"
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
                    className="max-h-64 w-56 overflow-y-auto"
                  >
                    <DropdownMenuItem
                      onClick={() => handleOutletChange(undefined)}
                    >
                      <MapPin className="mr-2 h-4 w-4" />
                      Semua Outlet
                    </DropdownMenuItem>
                    {outletsData?.data?.map((outlet) => (
                      <DropdownMenuItem
                        key={outlet.id}
                        onClick={() => handleOutletChange(outlet.id.toString())}
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
                                    ? "border-green-200 bg-green-50 text-green-700"
                                    : "border-red-200 bg-red-50 text-red-700"
                                }`}
                              >
                                {outlet.isActive ? "Active" : "Inactive"}
                              </Badge>
                            </div>
                            <span className="truncate text-xs text-gray-500">
                              {outlet.address}
                            </span>
                          </div>
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {/* Status Filter */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-9 min-w-0 text-sm sm:h-10 lg:min-w-[140px]"
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
                  className="max-h-64 w-56 overflow-y-auto"
                >
                  <DropdownMenuItem
                    onClick={() => handleStatusChange(undefined)}
                  >
                    Semua Status
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleStatusChange("WAITING_FOR_PICKUP")}
                  >
                    Menunggu Pickup
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleStatusChange("BEING_WASHED")}
                  >
                    Sedang Dicuci
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleStatusChange("BEING_IRONED")}
                  >
                    Sedang Disetrika
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleStatusChange("BEING_PACKED")}
                  >
                    Sedang Dikemas
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleStatusChange("WAITING_PAYMENT")}
                  >
                    Menunggu Pembayaran
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleStatusChange("COMPLETED")}
                  >
                    Selesai
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Employee Filter */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-9 min-w-0 text-sm sm:h-10 lg:min-w-[140px]"
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
                  className="max-h-64 w-56 overflow-y-auto"
                >
                  <DropdownMenuItem
                    onClick={() => handleEmployeeChange(undefined)}
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
                    >
                      <div className="flex min-w-0 flex-1 items-center justify-between">
                        <div className="flex min-w-0 flex-1 flex-col">
                          <span className="truncate font-medium">
                            {employee.user?.firstName} {employee.user?.lastName}
                          </span>
                          <span className="truncate text-xs text-gray-500">
                            {employee.role} - {employee.outlet?.outletName}
                          </span>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Date Range Filters */}
              <div className="flex gap-2">
                <Input
                  type="date"
                  placeholder="Tanggal Mulai"
                  value={startDate || ""}
                  onChange={(e) =>
                    handleDateRangeChange("start", e.target.value)
                  }
                  className="h-9 w-32 text-xs sm:h-10 sm:w-36 sm:text-sm"
                />
                <Input
                  type="date"
                  placeholder="Tanggal Akhir"
                  value={endDate || ""}
                  onChange={(e) => handleDateRangeChange("end", e.target.value)}
                  className="h-9 w-32 text-xs sm:h-10 sm:w-36 sm:text-sm"
                />
              </div>

              {/* Reset Button */}
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
                className="h-9 text-sm sm:h-10"
              >
                Reset
              </Button>
            </div>
          </div>

          {/* Mobile Card View - All Orders */}
          <div className="block sm:hidden">
            {isLoading ? (
              <div className="flex h-32 items-center justify-center">
                <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                <span className="text-sm">Memuat data pesanan...</span>
              </div>
            ) : error ? (
              <div className="p-4 text-center text-red-500">
                <div className="text-sm">Kesalahan memuat data pesanan</div>
                <div className="mt-1 text-xs text-red-400">
                  {error.message || "Kesalahan tidak diketahui"}
                </div>
              </div>
            ) : ordersData?.data?.length ? (
              <div className="space-y-2">
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
              <div className="p-3 text-center">
                <span className="mb-3 block text-sm text-gray-500">
                  {debouncedSearch
                    ? `Tidak ada pesanan ditemukan untuk "${debouncedSearch}"`
                    : "Belum ada pesanan yang tersedia"}
                </span>
              </div>
            )}
          </div>

          {/* Desktop Table View - All Orders */}
          <div className="hidden rounded-lg border shadow-sm sm:block">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b">
                    <TableHead className="min-w-[120px] text-xs sm:min-w-[150px] sm:text-sm">
                      No. Order
                    </TableHead>
                    <TableHead className="hidden min-w-[150px] text-xs sm:min-w-[200px] sm:text-sm md:table-cell">
                      Customer
                    </TableHead>
                    {isAdmin && (
                      <TableHead className="hidden min-w-[120px] text-xs sm:min-w-[150px] sm:text-sm lg:table-cell">
                        Outlet
                      </TableHead>
                    )}
                    <TableHead className="w-24 text-center text-xs sm:w-32 sm:text-sm">
                      Status
                    </TableHead>
                    <TableHead className="w-20 text-center text-xs sm:w-28 sm:text-sm">
                      Total
                    </TableHead>
                    <TableHead className="hidden w-32 text-center text-xs sm:w-40 sm:text-sm xl:table-cell">
                      Worker
                    </TableHead>
                    <TableHead className="hidden w-24 text-center text-xs sm:table-cell sm:w-32 sm:text-sm">
                      Tanggal
                    </TableHead>
                    <TableHead className="w-16 text-center text-xs sm:w-20 sm:text-sm">
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
                          <span className="text-sm">
                            Memuat data pesanan...
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : error ? (
                    <TableRow>
                      <TableCell
                        colSpan={getColSpan()}
                        className="h-32 text-center text-red-500"
                      >
                        <div>
                          <div className="text-sm">
                            Kesalahan memuat data pesanan
                          </div>
                          <div className="mt-1 text-xs text-red-400">
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
                          <span className="text-sm text-gray-500">
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

          {/* Pagination - All Orders */}
          {ordersData?.meta && (
            <div className="rounded-b-lg border-t bg-white px-2 py-2 sm:px-4 sm:py-3">
              <PaginationSection
                page={ordersData.meta.page}
                take={ordersData.meta.take}
                total={ordersData.meta.total}
                hasNext={ordersData.meta.hasNext}
                hasPrevious={ordersData.meta.hasPrevious}
                onChangePage={handlePageChange}
              />
            </div>
          )}
        </TabsContent>

        {/* Pending Orders Tab - Only for Outlet Admin */}
        {isOutletAdmin && (
          <TabsContent value="pending">
            <PendingOrdersTable />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
