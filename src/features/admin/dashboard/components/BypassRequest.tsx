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
import {
    ArrowRightIcon,
    ArrowUpDown,
    CheckCircle,
    Clock,
    MoreVertical,
    XCircle,
} from "lucide-react";
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
  variant?: "default" | "ghost" | "outline" | "link" | "destructive";
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
          : variant === "destructive"
            ? "bg-red-600 text-white hover:bg-red-700"
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

const DropdownMenuItem: React.FC<DropdownMenuItemProps> = ({
  children,
  onClick,
}) => (
  <button
    className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
    onClick={(e) => {
      e.stopPropagation();
      onClick?.();
    }}
    role="menuitem"
  >
    {children}
  </button>
);

const DropdownMenuSeparator: React.FC = () => (
  <div className="my-1 border-t border-gray-100" />
);

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

export const bypassSchema = z.object({
  id: z.string(),
  order: z.string(),
  station: z.string(),
  worker: z.string(),
  time: z.string(),
  reason: z.string(),
  status: z.enum(["Pending", "Approved", "Rejected"]),
  priority: z.enum(["Low", "Medium", "High"]),
});

export type BypassRequest = z.infer<typeof bypassSchema>;

const bypassData: BypassRequest[] = [
  {
    id: "BYP-001",
    order: "ORD-2023-1234",
    station: "Washing",
    worker: "Agus Pratama",
    time: "10.30",
    reason: "Mesin rusak",
    status: "Pending",
    priority: "High",
  },
  {
    id: "BYP-002",
    order: "ORD-2023-1230",
    station: "Drying",
    worker: "Dian Sastro",
    time: "11.15",
    reason: "Antrian penuh",
    status: "Pending",
    priority: "Medium",
  },
  {
    id: "BYP-003",
    order: "ORD-2023-1228",
    station: "Ironing",
    worker: "Joko Widodo",
    time: "09.45",
    reason: "Request customer",
    status: "Pending",
    priority: "Low",
  },
  {
    id: "BYP-004",
    order: "ORD-2023-1225",
    station: "Packing",
    worker: "Siti Aminah",
    time: "14.30",
    reason: "Barang rusak",
    status: "Pending",
    priority: "Medium",
  },
  {
    id: "BYP-005",
    order: "ORD-2023-1220",
    station: "Delivery",
    worker: "Budi Santoso",
    time: "16.00",
    reason: "Kendaraan mogok",
    status: "Pending",
    priority: "High",
  },
];

interface StatusBadgeProps {
  status: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusColor = (status: string): string => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Approved":
        return "bg-green-100 text-green-700 border-green-200";
      case "Rejected":
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

interface PriorityBadgeProps {
  priority: string;
}

const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-700 border-red-200";
      case "Medium":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "Low":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <Badge variant="outline" className={`${getPriorityColor(priority)}`}>
      {priority}
    </Badge>
  );
};

export const bypassColumns: ColumnDef<BypassRequest>[] = [
  {
    accessorKey: "order",
    header: "Order",
    cell: ({ row }) => (
      <div className="font-medium text-gray-900">{row.getValue("order")}</div>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "station",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0"
        >
          Station
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="text-gray-700">{row.getValue("station")}</div>
    ),
  },
  {
    accessorKey: "worker",
    header: "Worker",
    cell: ({ row }) => (
      <div className="text-gray-700">{row.getValue("worker")}</div>
    ),
  },
  {
    accessorKey: "time",
    header: "Waktu",
    cell: ({ row }) => (
      <div className="flex items-center gap-2 text-gray-700">
        <Clock className="h-4 w-4 text-gray-400" />
        {row.getValue("time")}
      </div>
    ),
  },
  {
    accessorKey: "reason",
    header: "Reason",
    cell: ({ row }) => (
      <div
        className="max-w-32 truncate text-gray-700"
        title={row.getValue("reason")}
      >
        {row.getValue("reason")}
      </div>
    ),
  },
  {
    accessorKey: "priority",
    header: "Priority",
    cell: ({ row }) => <PriorityBadge priority={row.getValue("priority")} />,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.getValue("status")} />,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const bypass = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex h-8 w-8 p-0 data-[state=open]:bg-gray-100"
              size="icon"
            >
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={() => console.log("Approve", bypass.id)}>
              <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
              Approve
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => console.log("Reject", bypass.id)}>
              <XCircle className="mr-2 h-4 w-4 text-red-600" />
              Reject
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(bypass.id)}
            >
              Copy ID
            </DropdownMenuItem>
            <DropdownMenuItem>View details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

interface PermintaanBypassTableProps {
  data?: BypassRequest[];
}

export function PermintaanBypassTable({
  data: initialData = bypassData,
}: PermintaanBypassTableProps) {
  const [data, setData] = React.useState(() => initialData);
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
    columns: bypassColumns,
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
              <CardTitle>Permintaan Bypass</CardTitle>
              <CardDescription>
                Permintaan bypass terbaru yang menunggu persetujuan
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
                        colSpan={bypassColumns.length}
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
                Lihat Semua Permintaan
                <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
