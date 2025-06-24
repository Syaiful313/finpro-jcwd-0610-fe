"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useGetOrders from "@/hooks/api/order/useGetOrders";
import { STATUS_CONFIG } from "@/lib/config";
import { OrderSummary } from "@/types/order-management";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowRightIcon, ArrowUpDown, EyeIcon, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const formatDate = (dateString: string) => {
  try {
    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(dateString));
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

const StatusBadge = ({ status }: { status: string }) => {
  const config = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] || {
    text: status,
    variant: "secondary" as const,
  };

  return <Badge variant={config.variant}>{config.text}</Badge>;
};

export const orderColumns: ColumnDef<OrderSummary>[] = [
  {
    accessorKey: "orderNumber",
    header: "No. Order",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("orderNumber")}</div>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "customer",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="h-auto p-0"
      >
        Customer
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const customer = row.getValue("customer") as OrderSummary["customer"];
      return <div className="text-muted-foreground">{customer.name}</div>;
    },
  },
  {
    accessorKey: "outlet",
    header: "Outlet",
    cell: ({ row }) => {
      const outlet = row.getValue("outlet") as OrderSummary["outlet"];
      return (
        <Badge variant="outline" className="text-xs">
          {outlet.outletName}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Tanggal",
    cell: ({ row }) => (
      <div className="text-muted-foreground">
        {formatDate(row.getValue("createdAt"))}
      </div>
    ),
  },
  {
    accessorKey: "orderStatus",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.getValue("orderStatus")} />,
  },
  {
    accessorKey: "totalPrice",
    header: () => <div className="text-right">Total</div>,
    cell: ({ row }) => {
      const amount = row.getValue("totalPrice") as number;
      return (
        <div className="text-right font-medium">{formatCurrency(amount)}</div>
      );
    },
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      const order = row.original;
      return (
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/admin/orders/${order.uuid}`}>
            <EyeIcon className="h-4 w-4" />
            <span className="sr-only">Detail Order</span>
          </Link>
        </Button>
      );
    },
  },
];

const LoadingState = () => (
  <Card>
    <CardHeader>
      <CardTitle>Pesanan Terbaru</CardTitle>
      <CardDescription>
        Daftar pesanan terbaru dari semua outlet
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="flex h-32 items-center justify-center">
        <Loader2 className="mr-2 h-6 w-6 animate-spin" />
        <span className="text-muted-foreground text-sm">
          Memuat data pesanan...
        </span>
      </div>
    </CardContent>
  </Card>
);

const ErrorState = ({ error }: { error: any }) => (
  <Card>
    <CardHeader>
      <CardTitle>Pesanan Terbaru</CardTitle>
      <CardDescription>
        Daftar pesanan terbaru dari semua outlet
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="flex h-32 items-center justify-center">
        <div className="text-destructive text-center">
          <div className="text-sm">Kesalahan memuat data pesanan</div>
          <div className="mt-1 text-xs opacity-70">
            {error?.message || "Kesalahan tidak diketahui"}
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

interface PesananTerbaruTableProps {
  limit?: number;
}

export function PesananTerbaruTable({ limit = 5 }: PesananTerbaruTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const {
    data: ordersData,
    isLoading,
    error,
  } = useGetOrders({
    page: 1,
    take: limit,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const table = useReactTable({
    data: ordersData?.data || [],
    columns: orderColumns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
    getRowId: (row) => row.uuid,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pesanan Terbaru</CardTitle>
        <CardDescription>
          Daftar pesanan terbaru dari semua outlet
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={orderColumns.length}
                    className="text-muted-foreground h-24 text-center"
                  >
                    Tidak ada pesanan tersedia.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      <CardFooter className="justify-end">
        <Button variant="ghost" asChild>
          <Link href="/admin/orders" className="flex items-center gap-2">
            Lihat Semua Pesanan
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
