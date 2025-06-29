"use client";

import PaginationSection from "@/components/PaginationSection";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { Clock, Loader2, MapPin, Phone, Settings, User } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { parseAsInteger, useQueryState } from "nuqs";
import { useCallback, useState } from "react";

const PAGE_SIZE = 10;

const getCellClass = (columnId: string) => {
  const baseClass = "py-2 px-2 sm:py-3 sm:px-4";
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
  <span className="inline-block rounded border-orange-200 bg-orange-50 px-1.5 py-0.5 text-xs font-semibold text-orange-700 dark:border-orange-700 dark:bg-orange-900/30 dark:text-orange-300">
    <span className="hidden sm:inline">Sampai Outlet</span>
    <span className="sm:hidden">Sampai</span>
  </span>
);

const CustomerInfo = ({ name, email }: { name: string; email: string }) => (
  <div className="flex flex-col">
    <div className="font-medium break-words text-gray-900 dark:text-gray-100">
      {name}
    </div>
    <div className="mt-1 flex items-center text-xs text-gray-500 dark:text-gray-400">
      <User className="mr-1 h-3 w-3" />
      <span className="break-all">{email}</span>
    </div>
  </div>
);

const PickupInfo = ({ pickupInfo }: { pickupInfo: any }) => {
  if (!pickupInfo) {
    return (
      <div className="text-xs text-gray-500 dark:text-gray-400">
        No pickup info
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex items-center text-xs text-blue-600 dark:text-blue-400">
        <User className="mr-1 h-3 w-3 flex-shrink-0" />
        <span className="truncate font-medium">{pickupInfo.driver}</span>
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-400">Driver</div>
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
  <div className="overflow-hidden rounded-2xl border-l-4 border-orange-400 bg-white shadow-md transition-all duration-300 hover:shadow-lg dark:border-orange-500 dark:bg-gray-800 dark:shadow-gray-900/50 dark:hover:shadow-gray-900/70">
    <div className="border-b border-slate-200 bg-slate-50 p-3.5 dark:border-gray-700 dark:bg-gray-700/50">
      <div className="flex items-center gap-2.5">
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-orange-600 text-sm font-semibold text-white dark:from-orange-600 dark:to-orange-700">
          {order.orderNumber.slice(-2)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-0.5 overflow-hidden text-sm font-semibold text-ellipsis whitespace-nowrap text-slate-900 dark:text-gray-100">
            {order.orderNumber}
          </div>
          <div className="flex items-center gap-1.5">
            <StatusBadge status={order.orderStatus} />
            <span className="flex items-center gap-1 text-xs font-semibold text-orange-600 dark:text-orange-400">
              <span className="h-1.5 w-1.5 rounded-full bg-orange-500 dark:bg-orange-400"></span>
              Pending Proses
            </span>
          </div>
        </div>
      </div>
    </div>

    <div className="p-3.5">
      <div className="mb-3 flex flex-col gap-2">
        <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-gray-400">
          <User className="h-3.5 w-3.5 flex-shrink-0 text-orange-500 dark:text-orange-400" />
          <span className="truncate">{order.customer.name}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-gray-400">
          <Settings className="h-3.5 w-3.5 flex-shrink-0 text-orange-500 dark:text-orange-400" />
          <span className="truncate">{order.customer.email}</span>
        </div>
        {order.customer.phoneNumber && (
          <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-gray-400">
            <Phone className="h-3.5 w-3.5 flex-shrink-0 text-orange-500 dark:text-orange-400" />
            <span>{order.customer.phoneNumber}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-gray-400">
          <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-orange-500 dark:text-orange-400" />
          <span className="truncate">{order.address.fullAddress}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-gray-400">
          <Clock className="h-3.5 w-3.5 flex-shrink-0 text-orange-500 dark:text-orange-400" />
          <span>{formatDate(order.createdAt)}</span>
        </div>
      </div>

      {order.pickupInfo && (
        <div className="mb-3 rounded-lg bg-blue-50 p-2 dark:bg-blue-950/30">
          <div className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400">
            <User className="h-3 w-3" />
            <span className="font-medium">{order.pickupInfo.driver}</span>
          </div>
          {order.pickupInfo.driverPhone && (
            <div className="text-xs text-blue-500 dark:text-blue-400">
              📞 {order.pickupInfo.driverPhone}
            </div>
          )}
        </div>
      )}

      <div className="mb-3 rounded-lg bg-gray-50 p-2 dark:bg-gray-700/50">
        <div className="text-xs text-gray-600 dark:text-gray-300">
          <div className="font-medium text-gray-800 dark:text-gray-100">
            Alamat Lengkap:
          </div>
          <div className="mt-1">
            {order.address.district}, {order.address.city}
          </div>
          <div>{order.address.province}</div>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onProcessOrder(order.uuid)}
          disabled={isProcessing}
          className="flex-1 rounded-lg border border-slate-300 bg-white px-3.5 py-1.5 text-xs font-medium text-orange-600 transition-colors hover:bg-orange-50 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-orange-400 dark:hover:bg-orange-950/30"
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-1 inline h-3 w-3 animate-spin" />
              Memproses...
            </>
          ) : (
            <>
              <Settings className="mr-1 inline h-3 w-3" />
              Proses Order
            </>
          )}
        </button>
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
  <TableRow className="border-b hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800/50">
    <TableCell className={getCellClass("orderNumber")}>
      <div className="flex flex-col">
        <div className="font-medium break-words text-gray-900 dark:text-gray-100">
          {order.orderNumber}
        </div>
        <div className="mt-1 text-xs break-words text-gray-500 md:hidden dark:text-gray-400">
          {order.customer.name}
        </div>
      </div>
    </TableCell>

    <TableCell className={getCellClass("customer")}>
      <CustomerInfo name={order.customer.name} email={order.customer.email} />
      {order.customer.phoneNumber && (
        <div className="mt-1 flex items-center text-xs text-gray-500 dark:text-gray-400">
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
        <span className="text-xs sm:text-sm dark:text-gray-300">
          {formatDate(order.createdAt)}
        </span>
      </div>
    </TableCell>

    <TableCell className={getCellClass("actions")}>
      <div className="flex justify-center">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onProcessOrder(order.uuid)}
          disabled={isProcessing}
          className="h-7 w-7 p-0 text-orange-600 hover:bg-orange-50 sm:h-8 sm:w-8 dark:text-orange-400 dark:hover:bg-orange-950/30"
        >
          {isProcessing ? (
            <Loader2 className="h-3 w-3 animate-spin sm:h-4 sm:w-4" />
          ) : (
            <Settings className="h-3 w-3 sm:h-4 sm:w-4" />
          )}
        </Button>
      </div>
    </TableCell>
  </TableRow>
);

export function PendingOrdersTable() {
  const { data: session } = useSession();
  const router = useRouter();

  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
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
    sortOrder: "desc",
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

  if (!session || !isOutletAdmin) {
    return (
      <div className="flex h-64 items-center justify-center px-1">
        <div className="text-center">
          <span className="text-sm text-red-500 sm:text-base dark:text-red-400">
            Access Denied
          </span>
          <p className="mt-2 text-xs text-gray-500 sm:text-sm dark:text-gray-400">
            Only outlet admin can view pending orders.
          </p>
        </div>
      </div>
    );
  }

  const totalItems = pendingOrdersResponse?.meta?.total ?? 0;

  return (
    <>
      <div className="space-y-3 sm:space-y-6 sm:px-4 lg:px-0">
        {isLoading && (
          <div className="flex h-32 items-center justify-center">
            <div className="text-center">
              <Loader2 className="mx-auto h-6 w-6 animate-spin" />
              <span className="mt-2 block text-sm dark:text-gray-300">
                Memuat data pesanan...
              </span>
            </div>
          </div>
        )}

        {!isLoading && error && (
          <div className="mx-5 mt-4 rounded-2xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-700 dark:bg-red-900/20">
            <div className="text-sm text-red-600 dark:text-red-400">
              Kesalahan memuat data pesanan
            </div>
            <div className="mt-1 text-xs text-red-500 dark:text-red-300">
              {error.message || "Kesalahan tidak diketahui"}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              className="mt-3 dark:border-red-600 dark:text-red-400 dark:hover:bg-red-900/30"
            >
              Coba Lagi
            </Button>
          </div>
        )}

        {!isLoading && !error && totalItems === 0 && (
          <div className="mx-5 mt-4 rounded-2xl border border-gray-200 bg-white p-6 text-center dark:border-gray-700 dark:bg-gray-800">
            <Clock className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
            <span className="mt-3 block text-sm text-gray-500 dark:text-gray-400">
              Tidak ada pesanan yang perlu diproses
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              className="mt-3 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Refresh
            </Button>
          </div>
        )}

        {!isLoading && !error && totalItems > 0 && (
          <>
            <div className="block sm:hidden">
              <div className="space-y-2 px-3 pt-2">
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

            <div className="mx-1 hidden rounded-2xl border border-gray-200 shadow-sm sm:mx-0 sm:block dark:border-gray-700">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b dark:border-gray-700">
                      <TableHead className="min-w-[120px] text-xs sm:min-w-[140px] sm:text-sm md:min-w-[180px] dark:text-gray-300">
                        No. Order
                      </TableHead>
                      <TableHead className="hidden min-w-[160px] text-xs sm:min-w-[180px] sm:text-sm md:table-cell md:min-w-[220px] dark:text-gray-300">
                        Customer
                      </TableHead>
                      <TableHead className="w-24 text-center text-xs sm:w-28 sm:text-sm md:w-36 dark:text-gray-300">
                        Status
                      </TableHead>
                      <TableHead className="hidden w-32 text-center text-xs sm:w-36 sm:text-sm lg:table-cell lg:w-44 dark:text-gray-300">
                        Driver
                      </TableHead>
                      <TableHead className="hidden w-24 text-center text-xs sm:table-cell sm:w-28 sm:text-sm md:w-36 dark:text-gray-300">
                        Tanggal
                      </TableHead>
                      <TableHead className="w-16 text-center text-xs sm:w-18 sm:text-sm md:w-24 dark:text-gray-300">
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

            {pendingOrdersResponse?.meta && (
              <>
                <div className="mx-1 hidden justify-center rounded-2xl border-t bg-white p-4 sm:mx-0 sm:flex dark:border-gray-700 dark:bg-gray-800">
                  <PaginationSection
                    page={pendingOrdersResponse.meta.page}
                    take={pendingOrdersResponse.meta.take}
                    total={pendingOrdersResponse.meta.total}
                    hasNext={pendingOrdersResponse.meta.hasNext}
                    hasPrevious={pendingOrdersResponse.meta.hasPrevious}
                    onChangePage={handlePageChange}
                  />
                </div>

                <div className="flex justify-center rounded-2xl border-t bg-white p-3 sm:hidden dark:border-gray-700 dark:bg-gray-800">
                  <PaginationSection
                    page={pendingOrdersResponse.meta.page}
                    take={pendingOrdersResponse.meta.take}
                    total={pendingOrdersResponse.meta.total}
                    hasNext={pendingOrdersResponse.meta.hasNext}
                    hasPrevious={pendingOrdersResponse.meta.hasPrevious}
                    onChangePage={handlePageChange}
                  />
                </div>
              </>
            )}
          </>
        )}
      </div>
    </>
  );
}
