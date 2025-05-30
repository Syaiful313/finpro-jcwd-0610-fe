"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowRightIcon, ArrowUpDown, EyeIcon } from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { z } from "zod";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "outline" | "secondary";
  className?: string;
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "default" | "ghost" | "outline" | "link";
  size?: "default" | "sm" | "icon";
  className?: string;
  asChild?: boolean;
}

interface CheckboxProps {
  checked: boolean | "indeterminate";
  onCheckedChange?: (checked: boolean) => void;
  className?: string;
  [key: string]: any;
}

interface DropdownMenuProps {
  children: React.ReactNode;
}

interface DropdownMenuTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
  onClick?: () => void;
}

interface DropdownMenuContentProps {
  children: React.ReactNode;
  align?: "left" | "end";
  className?: string;
  onClose?: () => void;
}

interface DropdownMenuItemProps {
  children: React.ReactNode;
  onClick?: () => void;
}

interface DropdownMenuCheckboxItemProps {
  children: React.ReactNode;
  checked: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

interface SelectTriggerProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  value?: string;
  id?: string;
}

interface SelectContentProps {
  children: React.ReactNode;
  onSelect?: (value: string) => void;
  onClose?: () => void;
}

interface SelectItemProps {
  children: React.ReactNode;
  value: string;
  onClick?: () => void;
}

interface TableProps {
  children: React.ReactNode;
}

interface TableHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface TableBodyProps {
  children: React.ReactNode;
  className?: string;
}

interface TableRowProps {
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}

interface TableHeadProps {
  children: React.ReactNode;
  className?: string;
  colSpan?: number;
}

interface TableCellProps {
  children: React.ReactNode;
  className?: string;
  colSpan?: number;
}

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

interface CardDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "default",
  className = "",
}) => (
  <span
    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
      variant === "outline"
        ? "border border-gray-300 bg-white text-gray-700"
        : variant === "secondary"
          ? "bg-gray-100 text-gray-700"
          : "bg-blue-100 text-blue-800"
    } ${className}`}
  >
    {children}
  </span>
);

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "default",
  size = "default",
  className = "",
  asChild = false,
  ...props
}) => {
  const baseClasses = `inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 ${
    variant === "ghost"
      ? "hover:bg-gray-100 hover:text-gray-900"
      : variant === "outline"
        ? "border border-gray-300 bg-white hover:bg-gray-50 hover:text-gray-900"
        : variant === "link"
          ? "text-blue-600 underline-offset-4 hover:underline"
          : "bg-blue-600 text-white hover:bg-blue-700"
  } ${
    size === "sm"
      ? "h-9 px-3 text-sm"
      : size === "icon"
        ? "h-10 w-10"
        : "h-10 px-4 py-2"
  } ${className}`;

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      className: baseClasses,
      ...props,
    });
  }

  return (
    <button className={baseClasses} {...props}>
      {children}
    </button>
  );
};

const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onCheckedChange,
  className = "",
}) => (
  <input
    type="checkbox"
    checked={checked === true}
    onChange={(e) => onCheckedChange?.(e.target.checked)}
    className={`h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 ${className}`}
  />
);

const DropdownMenu: React.FC<DropdownMenuProps> = ({ children }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="relative inline-block text-left">
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          if (child.type === DropdownMenuTrigger) {
            return React.cloneElement(
              child as React.ReactElement<DropdownMenuTriggerProps>,
              {
                onClick: () => setIsOpen(!isOpen),
              },
            );
          }
          if (child.type === DropdownMenuContent) {
            return isOpen
              ? React.cloneElement(
                  child as React.ReactElement<DropdownMenuContentProps>,
                  {
                    onClose: () => setIsOpen(false),
                  },
                )
              : null;
          }
        }
        return child;
      })}
    </div>
  );
};

const DropdownMenuTrigger: React.FC<DropdownMenuTriggerProps> = ({
  children,
  asChild,
  onClick,
}) => {
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, { onClick });
  }
  return <button onClick={onClick}>{children}</button>;
};

const DropdownMenuContent: React.FC<DropdownMenuContentProps> = ({
  children,
  align = "left",
  className = "",
  onClose,
}) => {
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      onClose?.();
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [onClose]);

  return (
    <div
      className={`absolute top-full mt-1 ${align === "end" ? "right-0" : "left-0"} ring-opacity-5 z-50 w-56 rounded-md border bg-white shadow-lg ring-1 ring-black focus:outline-none ${className}`}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="py-1" role="menu">
        {children}
      </div>
    </div>
  );
};

const SelectTrigger: React.FC<SelectTriggerProps> = ({
  children,
  className = "",
  onClick,
  value,
  id,
}) => (
  <button
    id={id}
    className={`flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    onClick={onClick}
  >
    {children}
  </button>
);

const SelectContent: React.FC<SelectContentProps> = ({
  children,
  onSelect,
  onClose,
}) => {
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      onClose?.();
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [onClose]);

  return (
    <div
      className="absolute top-full z-50 mt-1 w-full rounded-md border bg-white shadow-lg"
      onClick={(e) => e.stopPropagation()}
    >
      {React.Children.map(children, (child) =>
        React.isValidElement(child) && child.type === SelectItem
          ? React.cloneElement(child as React.ReactElement<SelectItemProps>, {
              onClick: () =>
                onSelect?.(
                  (child as React.ReactElement<SelectItemProps>).props.value,
                ),
            })
          : child,
      )}
    </div>
  );
};

const SelectItem: React.FC<SelectItemProps> = ({
  children,
  value,
  onClick,
}) => (
  <button
    className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100"
    onClick={(e) => {
      e.stopPropagation();
      onClick?.();
    }}
  >
    {children}
  </button>
);

SelectTrigger.displayName = "SelectTrigger";
SelectContent.displayName = "SelectContent";
SelectItem.displayName = "SelectItem";

const Table: React.FC<TableProps> = ({ children }) => (
  <div className="relative w-full overflow-auto">
    <table className="w-full caption-bottom text-sm">{children}</table>
  </div>
);

const TableHeader: React.FC<TableHeaderProps> = ({
  children,
  className = "",
}) => <thead className={`[&_tr]:border-b ${className}`}>{children}</thead>;

const TableBody: React.FC<TableBodyProps> = ({ children, className = "" }) => (
  <tbody className={`[&_tr:last-child]:border-0 ${className}`}>
    {children}
  </tbody>
);

const TableRow: React.FC<TableRowProps> = ({
  children,
  className = "",
  ...props
}) => (
  <tr
    className={`border-b transition-colors hover:bg-gray-50 data-[state=selected]:bg-gray-50 ${className}`}
    {...props}
  >
    {children}
  </tr>
);

const TableHead: React.FC<TableHeadProps> = ({
  children,
  className = "",
  colSpan,
}) => (
  <th
    className={`h-12 px-4 text-left align-middle font-medium text-gray-500 [&:has([role=checkbox])]:pr-0 ${className}`}
    colSpan={colSpan}
  >
    {children}
  </th>
);

const TableCell: React.FC<TableCellProps> = ({
  children,
  className = "",
  colSpan,
}) => (
  <td
    className={`p-4 align-middle [&:has([role=checkbox])]:pr-0 ${className}`}
    colSpan={colSpan}
  >
    {children}
  </td>
);

const Card: React.FC<CardProps> = ({ children, className = "" }) => (
  <div
    className={`rounded-lg border border-gray-200 bg-white text-gray-950 shadow-sm ${className}`}
  >
    {children}
  </div>
);

const CardHeader: React.FC<CardHeaderProps> = ({
  children,
  className = "",
}) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>{children}</div>
);

const CardTitle: React.FC<CardTitleProps> = ({ children, className = "" }) => (
  <h3
    className={`text-2xl leading-none font-semibold tracking-tight ${className}`}
  >
    {children}
  </h3>
);

const CardDescription: React.FC<CardDescriptionProps> = ({
  children,
  className = "",
}) => <p className={`text-sm text-gray-500 ${className}`}>{children}</p>;

const CardContent: React.FC<CardContentProps> = ({
  children,
  className = "",
}) => <div className={`p-6 pt-0 ${className}`}>{children}</div>;

const CardFooter: React.FC<CardFooterProps> = ({
  children,
  className = "",
}) => (
  <div className={`flex items-center p-6 pt-0 ${className}`}>{children}</div>
);

export const orderSchema = z.object({
  id: z.string(),
  orderNo: z.string(),
  customer: z.string(),
  outlet: z.string(),
  date: z.string(),
  status: z.enum(["Diproses", "Menunggu", "Selesai", "Dibatalkan"]),
  total: z.number(),
});

export type Order = z.infer<typeof orderSchema>;

const ordersData: Order[] = [
  {
    id: "ORD-2023-1234",
    orderNo: "ORD-2023-1234",
    customer: "Budi Santoso",
    outlet: "Outlet Kemang",
    date: "21 Mei 2023",
    status: "Diproses",
    total: 125000,
  },
  {
    id: "ORD-2023-1233",
    orderNo: "ORD-2023-1233",
    customer: "Siti Rahayu",
    outlet: "Outlet BSD",
    date: "21 Mei 2023",
    status: "Menunggu",
    total: 78000,
  },
  {
    id: "ORD-2023-1232",
    orderNo: "ORD-2023-1232",
    customer: "Ahmad Hidayat",
    outlet: "Outlet Menteng",
    date: "20 Mei 2023",
    status: "Selesai",
    total: 210000,
  },
  {
    id: "ORD-2023-1231",
    orderNo: "ORD-2023-1231",
    customer: "Dewi Lestari",
    outlet: "Outlet Kemang",
    date: "20 Mei 2023",
    status: "Selesai",
    total: 95000,
  },
  {
    id: "ORD-2023-1230",
    orderNo: "ORD-2023-1230",
    customer: "Rudi Hermawan",
    outlet: "Outlet BSD",
    date: "19 Mei 2023",
    status: "Dibatalkan",
    total: 150000,
  },
];

interface StatusBadgeProps {
  status: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusColor = (status: string): string => {
    switch (status) {
      case "Diproses":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "Menunggu":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Selesai":
        return "bg-green-100 text-green-700 border-green-200";
      case "Dibatalkan":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <Badge variant="outline" className={`${getStatusColor(status)}`}>
      {status}
    </Badge>
  );
};

export const orderColumns: ColumnDef<Order>[] = [
  {
    accessorKey: "orderNo",
    header: "No. Order",
    cell: ({ row }) => (
      <div className="font-medium text-gray-900">{row.getValue("orderNo")}</div>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "customer",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0"
        >
          Customer
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="text-gray-700">{row.getValue("customer")}</div>
    ),
  },
  {
    accessorKey: "outlet",
    header: "Outlet",
    cell: ({ row }) => (
      <div className="w-32">
        <Badge variant="outline" className="px-1.5 text-gray-600">
          {row.getValue("outlet")}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "date",
    header: "Tanggal",
    cell: ({ row }) => (
      <div className="text-gray-700">{row.getValue("date")}</div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.getValue("status")} />,
  },
  {
    accessorKey: "total",
    header: () => <div className="text-right">Total</div>,
    cell: ({ row }) => {
      const amount = row.getValue("total") as number;
      const formatted = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      }).format(amount);

      return (
        <div className="text-right font-medium text-gray-900">{formatted}</div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const order = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Link
              href={`/dashboard/orders/${order.id}`}
              className="flex h-8 w-8 items-center justify-center p-0 data-[state=open]:bg-gray-100"
            >
              <EyeIcon className="h-4 w-4" />
              <span className="sr-only">Detail Order</span>
            </Link>
          </DropdownMenuTrigger>
        </DropdownMenu>
      );
    },
  },
];

interface PesananTerbaruTableProps {
  data?: Order[];
}

export function PesananTerbaruTable({
  data: initialData = ordersData,
}: PesananTerbaruTableProps) {
  const [data] = React.useState(() => initialData);
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const table = useReactTable({
    data,
    columns: orderColumns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.id,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return (
    <div className="w-full px-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex flex-col space-y-2">
              <CardTitle>Pesanan Terbaru</CardTitle>
              <CardDescription>
                Daftar pesanan terbaru dari semua outlet
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col gap-4">
            {/* Table */}
            <div className="overflow-hidden rounded-lg border">
              <Table>
                <TableHeader className="bg-gray-50">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        return (
                          <TableHead key={header.id} colSpan={header.colSpan}>
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext(),
                                )}
                          </TableHead>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                      >
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
                        className="h-24 text-center"
                      >
                        No results.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>

        <CardFooter>
          {/* Pagination */}
          <div className="flex w-full items-center justify-end">
            <div className="flex w-full items-center gap-8 lg:w-fit">
              <Link href="#" className="flex items-center gap-2">
                Lihat Semua Pesanan
                <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
