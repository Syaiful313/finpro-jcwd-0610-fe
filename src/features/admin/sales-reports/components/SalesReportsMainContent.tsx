"use client";

import { AlertCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import { ChartSalesReports } from "./ChartSalesReports";
import { SalesReportTable } from "./SalesReportTable";
import { SectionCards } from "./SectionCard";
import { ERROR_MESSAGES } from "@/lib/config";

const AccessDeniedState = () => (
  <div className="flex h-64 items-center justify-center px-4">
    <div className="text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
        <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-red-600 dark:text-red-400">
        Akses Ditolak
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {ERROR_MESSAGES.ACCESS_DENIED}
      </p>
      <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
        Anda perlu akses admin atau outlet admin untuk melihat laporan
        penjualan.
      </p>
    </div>
  </div>
);

export function SalesReportsMainContent() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex h-64 items-center justify-center px-4">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent dark:border-blue-400"></div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Memuat halaman...
          </p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex h-64 items-center justify-center px-4">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/20">
            <AlertCircle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-yellow-600 dark:text-yellow-400">
            Tidak Terautentikasi
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Silakan login terlebih dahulu untuk mengakses halaman ini.
          </p>
        </div>
      </div>
    );
  }

  const userRole = session?.user?.role;
  const isAdmin = userRole === "ADMIN";
  const isOutletAdmin = userRole === "OUTLET_ADMIN";
  const canAccessPage = isAdmin || isOutletAdmin;

  if (!canAccessPage) {
    return <AccessDeniedState />;
  }

  return (
    <div className="space-y-3 sm:space-y-6 sm:px-4 lg:px-0">
      <SectionCards />

      <div className="mx-1 sm:mx-0">
        <ChartSalesReports />
      </div>

      <SalesReportTable />
    </div>
  );
}
