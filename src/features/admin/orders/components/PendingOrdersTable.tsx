"use client";

import PaginationSection from "@/components/PaginationSection";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useGetPendingProcessOrders from "@/hooks/api/order/useGetPendingProcessOrders";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Clock, Loader2, Phone, Search, Settings, User } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { parseAsInteger, useQueryState } from "nuqs";
import { useCallback, useState } from "react";
import { useDebounceValue } from "usehooks-ts";

const PAGE_SIZE = 5;

const getCellClass = (columnId: string) => {
  const baseClass = "py-2 px-1 sm:py-3 sm:px-2 md:px-4";
  const styles: Record<string, string> = {
    orderNumber:
      "min-w-[120px] sm:min-w-[140px] md:min-w-[180px] text-xs sm:text-sm font-medium",
    customer:
      "min-w-[160px] sm:min-w-[180px] md:min-w-[220px] text-xs sm:text-sm hidden md:table-cell",
    status: "w-24 sm:w-28 md:w-36 text-center",
    pickup:
      "w-32 sm:w-36 md:w-44 text-center text-xs sm:text-sm hidden lg:table-cell",
    date: "w-24 sm:w-28 md:w-36 text-center text-xs sm:text-sm hidden sm:table-cell",
    actions: "w-16 sm:w-18 md:w-24 text-center",
  };
  return `${baseClass} ${styles[columnId] || "text-xs sm:text-sm"}`;
};

const formatDate = (dateString: string) => {
  try {
    return format(new Date(dateString), "dd MMM yyyy, HH:mm", { locale: id });
  } catch {
    return "Invalid date";
  }
};

const StatusBadge = ({ status }: { status: string }) => (
  <Badge
    variant="outline"
    className="border-orange-200 bg-orange-50 px-1 py-0.5 text-xs font-medium text-orange-700 sm:px-1.5 sm:py-0.5 md:px-2 md:py-1"
  >
    <span className="hidden sm:inline">Sampai Outlet</span>
    <span className="sm:hidden">Sampai</span>
  </Badge>
);

const CustomerInfo = ({ name, email }: { name: string; email: string }) => (
  <div className="flex flex-col">
    <div className="flex items-center text-xs text-gray-900">
      <User className="mr-1 h-3 w-3 flex-shrink-0" />
      <span className="truncate font-medium">{name}</span>
    </div>
    <div className="truncate text-xs text-gray-500">{email}</div>
  </div>
);

const PickupInfo = ({ pickupInfo }: { pickupInfo: any }) => {
  if (!pickupInfo) {
    return <div className="text-xs text-gray-500">No pickup info</div>;
  }

  return (
    <div className="flex flex-col">
      <div className="flex items-center text-xs text-blue-600">
        <User className="mr-1 h-3 w-3 flex-shrink-0" />
        <span className="truncate font-medium">{pickupInfo.driver}</span>
      </div>
      <div className="text-xs text-gray-500">Driver</div>
    </div>
  );
};

const PendingOrderCard = ({
  order,
  onProcessOrder,
  isProcessing,
}: {
  order: any;
  onProcessOrder: (orderId: string) => void;
  isProcessing: boolean;
}) => (
  <div className="rounded-lg border bg-white p-2 shadow-sm transition-shadow hover:shadow-md sm:p-2.5">
    <div className="mb-2 flex items-start justify-between">
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center gap-1.5">
          <StatusBadge status={order.orderStatus} />
        </div>
        <h3 className="truncate pr-1 text-sm font-medium text-gray-900">
          {order.orderNumber}
        </h3>
      </div>
      <div className="flex flex-shrink-0">
        <Button
          size="sm"
          onClick={() => onProcessOrder(order.uuid)}
          disabled={isProcessing}
          className="h-6 px-1.5 text-xs sm:h-7 sm:px-2"
        >
          {isProcessing ? (
            <Loader2 className="mr-0.5 h-3 w-3 animate-spin sm:mr-1" />
          ) : (
            <Settings className="mr-0.5 h-3 w-3 sm:mr-1" />
          )}
          <span className="hidden sm:inline">Proses</span>
        </Button>
      </div>
    </div>

    <div className="space-y-1 text-xs text-gray-600 sm:space-y-1.5">
      <div>
        <span className="font-medium text-gray-800">Customer:</span>
        <div className="mt-0.5 leading-relaxed text-gray-600">
          {order.customer.name} - {order.customer.email}
        </div>
        {order.customer.phoneNumber && (
          <div className="mt-0.5 leading-relaxed text-gray-600">
            📞 {order.customer.phoneNumber}
          </div>
        )}
      </div>

      <div>
        <span className="font-medium text-gray-800">Alamat:</span>
        <div className="mt-0.5 leading-relaxed text-gray-600">
          {order.address.fullAddress}
        </div>
        <div className="mt-0.5 leading-relaxed text-gray-600">
          {order.address.district}, {order.address.city},{" "}
          {order.address.province}
        </div>
      </div>

      {order.pickupInfo && (
        <div>
          <span className="font-medium text-gray-800">Driver:</span>
          <div className="mt-0.5 leading-relaxed text-gray-600">
            {order.pickupInfo.driver}
            {order.pickupInfo.driverPhone &&
              ` - ${order.pickupInfo.driverPhone}`}
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
      </div>
    </div>
  </div>
);

const PendingOrderRow = ({
  order,
  onProcessOrder,
  isProcessing,
}: {
  order: any;
  onProcessOrder: (orderId: string) => void;
  isProcessing: boolean;
}) => (
  <TableRow className="border-b transition-colors hover:bg-gray-50">
    <TableCell className={getCellClass("orderNumber")}>
      <div className="flex flex-col">
        <div className="font-medium break-words text-gray-900">
          {order.orderNumber}
        </div>
        <div className="mt-1 text-xs break-words text-gray-500 md:hidden">
          {order.customer.name}
        </div>
      </div>
    </TableCell>

    <TableCell className={getCellClass("customer")}>
      <CustomerInfo name={order.customer.name} email={order.customer.email} />
      {order.customer.phoneNumber && (
        <div className="mt-1 flex items-center text-xs text-gray-500">
          <Phone className="mr-1 h-3 w-3 flex-shrink-0" />
          <span className="truncate">{order.customer.phoneNumber}</span>
        </div>
      )}
    </TableCell>

    <TableCell className={getCellClass("status")}>
      <div className="flex justify-center">
        <StatusBadge status={order.orderStatus} />
      </div>
    </TableCell>

    <TableCell className={getCellClass("pickup")}>
      <PickupInfo pickupInfo={order.pickupInfo} />
    </TableCell>

    <TableCell className={getCellClass("date")}>
      <div className="text-center">
        <span className="text-xs sm:text-sm">
          {formatDate(order.createdAt)}
        </span>
      </div>
    </TableCell>

    <TableCell className={getCellClass("actions")}>
      <div className="flex justify-center">
        <Button
          size="sm"
          onClick={() => onProcessOrder(order.uuid)}
          disabled={isProcessing}
          className="h-6 px-1 text-xs sm:h-7 sm:px-2"
        >
          {isProcessing ? (
            <Loader2 className="mr-0.5 h-3 w-3 animate-spin sm:mr-1" />
          ) : (
            <Settings className="mr-0.5 h-3 w-3 sm:mr-1" />
          )}
          <span className="hidden sm:inline">Proses</span>
        </Button>
      </div>
    </TableCell>
  </TableRow>
);

export function PendingOrdersTable() {
  const { data: session } = useSession();
  const router = useRouter();

  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [search, setSearch] = useQueryState("search", { defaultValue: "" });
  const [debouncedSearch] = useDebounceValue(search, 500);
  const [processingOrderId, setProcessingOrderId] = useState<string | null>(
    null,
  );

  const isOutletAdmin = session?.user?.role === "OUTLET_ADMIN";

  const {
    data: pendingOrdersResponse,
    isLoading,
    error,
    refetch,
  } = useGetPendingProcessOrders({
    page,
    take: PAGE_SIZE,
    sortBy: "createdAt",
    sortOrder: "asc",
    ...(debouncedSearch && { search: debouncedSearch }),
  });

  const handleProcessOrder = useCallback(
    async (orderId: string) => {
      setProcessingOrderId(orderId);
      try {
        router.push(`/admin/orders/process/${orderId}`);
      } finally {
        setTimeout(() => setProcessingOrderId(null), 1000);
      }
    },
    [router],
  );

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const handlePageChange = useCallback(
    (newPage: number) => {
      setPage(newPage);
    },
    [setPage],
  );

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target.value);
      setPage(1);
    },
    [setSearch, setPage],
  );

  if (!session || !isOutletAdmin) {
    return (
      <div className="flex h-64 items-center justify-center px-2 sm:px-4">
        <div className="text-center">
          <span className="text-sm text-red-500">Access Denied</span>
          <p className="mt-2 text-xs text-gray-500">
            Only outlet admin can view pending orders.
          </p>
        </div>
      </div>
    );
  }

  const totalItems = pendingOrdersResponse?.meta?.total ?? 0;

  return (
    <div className="space-y-3 sm:space-y-4 md:space-y-6">
      {/* Search Input */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="relative w-full">
          <Search className="absolute top-1/2 left-2 h-3 w-3 -translate-y-1/2 text-gray-400 sm:left-3 sm:h-4 sm:w-4" />
          <Input
            placeholder="Cari order number atau nama..."
            value={search}
            onChange={handleSearchChange}
            className="pl-8 text-sm sm:pl-10 sm:text-base"
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex h-24 items-center justify-center sm:h-32">
          <div className="text-center">
            <Loader2 className="mx-auto h-5 w-5 animate-spin sm:h-6 sm:w-6" />
            <span className="mt-1 block text-xs sm:text-sm">
              Memuat data pesanan...
            </span>
          </div>
        </div>
      )}

      {/* Error State */}
      {!isLoading && error && (
        <div className="p-3 text-center text-red-500 sm:p-4">
          <div className="text-sm">Kesalahan memuat data pesanan</div>
          <div className="mt-1 text-xs text-red-400">
            {error.message || "Kesalahan tidak diketahui"}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="mt-2"
          >
            Retry
          </Button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && totalItems === 0 && (
        <div className="flex h-24 flex-col items-center justify-center space-y-2 sm:h-32 sm:space-y-3">
          <Clock className="h-10 w-10 text-gray-400 sm:h-12 sm:w-12" />
          <span className="text-xs text-gray-500 sm:text-sm">
            {debouncedSearch
              ? "Tidak ada pesanan yang cocok dengan pencarian"
              : "Tidak ada pesanan yang perlu diproses"}
          </span>
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            Refresh
          </Button>
        </div>
      )}

      {/* Data Display */}
      {!isLoading && !error && totalItems > 0 && (
        <div className="space-y-3 sm:space-y-4 md:space-y-6">
          {/* Mobile Card View */}
          <div className="block sm:hidden">
            <div className="space-y-2">
              {pendingOrdersResponse?.data?.map((order) => (
                <PendingOrderCard
                  key={order.uuid}
                  order={order}
                  onProcessOrder={handleProcessOrder}
                  isProcessing={processingOrderId === order.uuid}
                />
              )) ?? []}
            </div>
          </div>

          {/* Desktop Table View */}
          <div className="hidden rounded-lg border shadow-sm sm:block">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b">
                    <TableHead className="min-w-[120px] text-xs sm:min-w-[140px] sm:text-sm md:min-w-[180px]">
                      No. Order
                    </TableHead>
                    <TableHead className="hidden min-w-[160px] text-xs sm:min-w-[180px] sm:text-sm md:table-cell md:min-w-[220px]">
                      Customer
                    </TableHead>
                    <TableHead className="w-24 text-center text-xs sm:w-28 sm:text-sm md:w-36">
                      Status
                    </TableHead>
                    <TableHead className="hidden w-32 text-center text-xs sm:w-36 sm:text-sm lg:table-cell lg:w-44">
                      Driver
                    </TableHead>
                    <TableHead className="hidden w-24 text-center text-xs sm:table-cell sm:w-28 sm:text-sm md:w-36">
                      Tanggal
                    </TableHead>
                    <TableHead className="w-16 text-center text-xs sm:w-18 sm:text-sm md:w-24">
                      Aksi
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingOrdersResponse?.data?.map((order) => (
                    <PendingOrderRow
                      key={order.uuid}
                      order={order}
                      onProcessOrder={handleProcessOrder}
                      isProcessing={processingOrderId === order.uuid}
                    />
                  )) ?? []}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Pagination Section */}
          {pendingOrdersResponse?.meta && (
            <div className="rounded-b-lg border-t bg-white px-2 py-2 sm:px-4 sm:py-3">
              <PaginationSection
                page={pendingOrdersResponse.meta.page}
                take={pendingOrdersResponse.meta.take}
                total={pendingOrdersResponse.meta.total}
                hasNext={pendingOrdersResponse.meta.hasNext}
                hasPrevious={pendingOrdersResponse.meta.hasPrevious}
                onChangePage={handlePageChange}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
