"use client";
import PaginationSection from "@/components/PaginationSection";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
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
import useGetOutletUsers from "@/hooks/api/admin-outlet/useGetOutletUsers";
import { OUTLET_USER_ROLES } from "@/lib/config";
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useQueryClient } from "@tanstack/react-query";
import {
  ColumnDef,
  Row,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  ChevronDownIcon,
  FilterIcon,
  Loader2,
  Mail,
  Phone,
  Plus,
  Search,
  ShoppingCart,
} from "lucide-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import CreateOutletUserModal from "./CreateOutletUserModal";

interface OutletUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  phoneNumber: string;
  profilePic: string | null;
  isVerified: boolean;
  provider: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  notificationId: string | null;
  totalOrdersInOutlet: number;
  employeeInfo: {
    id: number;
    npwp: string;
    createdAt: string;
  } | null;
}

interface OutletUserManagementTableProps {
  outletId: number;
}

function DraggableRow({ row }: { row: Row<OutletUser> }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.id,
  });

  return (
    <TableRow
      data-state={row.getIsSelected() && "selected"}
      data-dragging={isDragging}
      ref={setNodeRef}
      className="relative border-b data-[dragging=true]:z-10 data-[dragging=true]:opacity-90"
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      {row.getVisibleCells().map((cell) => {
        let cellClass = "py-3 sm:py-3 px-2 sm:px-4";

        if (cell.column.id === "index")
          cellClass += " w-10 sm:w-16 text-sm sm:text-sm text-center";
        else if (cell.column.id === "name")
          cellClass +=
            " min-w-[120px] sm:w-auto text-sm sm:text-sm font-medium";
        else if (cell.column.id === "email")
          cellClass += " min-w-[150px] sm:w-auto text-sm sm:text-sm";
        else if (cell.column.id === "phoneNumber")
          cellClass += " min-w-[120px] sm:w-auto text-sm sm:text-sm";
        else if (cell.column.id === "role")
          cellClass += " min-w-[100px] sm:w-32 text-center";
        else if (cell.column.id === "provider")
          cellClass += " min-w-[80px] sm:w-24 text-center";
        else if (cell.column.id === "status")
          cellClass += " min-w-[80px] sm:w-24 text-center";
        else if (cell.column.id === "orders")
          cellClass += " min-w-[80px] sm:w-24 text-center";
        else if (cell.column.id === "employee")
          cellClass += " min-w-[100px] sm:w-32 text-center";
        else if (cell.column.id === "createdAt")
          cellClass += " min-w-[100px] sm:w-32 text-sm sm:text-sm";
        else if (cell.column.id === "actions")
          cellClass += " w-16 sm:w-32 text-center";

        return (
          <TableCell key={cell.id} className={cellClass}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        );
      })}
    </TableRow>
  );
}

export function OutletUserManagementTable({
  outletId,
}: OutletUserManagementTableProps) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [pageSize] = useState(10);
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState({});

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const queryClient = useQueryClient();

  const [debouncedSearch, setDebouncedSearch] = useState(search);
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const {
    data: usersData,
    isLoading,
    error,
  } = useGetOutletUsers(outletId, {
    page: page,
    take: pageSize,
    search: debouncedSearch,
    role: role as any,
    sortBy: sortBy,
    sortOrder: sortOrder,
  });

  const [data, setData] = useState<OutletUser[]>([]);

  useEffect(() => {
    if (usersData?.data) {
      setData(usersData.data);
    }
  }, [usersData]);

  const RoleBadge = ({ role }: { role: string }) => {
    const config = OUTLET_USER_ROLES[
      role as keyof typeof OUTLET_USER_ROLES
    ] || {
      color: "bg-gray-50 text-gray-700 border-gray-200",
      label: role,
    };

    return (
      <Badge
        variant="outline"
        className={`px-2 py-1 text-xs font-medium whitespace-nowrap sm:px-3 sm:py-1 sm:text-xs ${config.color}`}
      >
        {config.label}
      </Badge>
    );
  };

  const StatusBadge = ({ isVerified }: { isVerified: boolean }) => {
    return (
      <Badge
        variant="outline"
        className={`px-2 py-1 text-xs font-medium whitespace-nowrap sm:px-2 sm:py-1 sm:text-xs ${
          isVerified
            ? "border-green-200 bg-green-50 text-green-700"
            : "border-yellow-200 bg-yellow-50 text-yellow-700"
        }`}
      >
        {isVerified ? "Verified" : "Unverified"}
      </Badge>
    );
  };

  const EmployeeBadge = ({
    employeeInfo,
  }: {
    employeeInfo: OutletUser["employeeInfo"];
  }) => {
    if (!employeeInfo) {
      return (
        <Badge
          variant="outline"
          className="border-gray-200 bg-gray-50 px-2 py-1 text-xs font-medium whitespace-nowrap text-gray-700"
        >
          Customer
        </Badge>
      );
    }

    return (
      <Badge
        variant="outline"
        className="border-blue-200 bg-blue-50 px-2 py-1 text-xs font-medium whitespace-nowrap text-blue-700"
      >
        Employee
      </Badge>
    );
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleRoleFilter = (newRole: string) => {
    setRole(newRole);
    setPage(1);
  };

  const handleSearch = useCallback((searchValue: string) => {
    setSearch(searchValue);
  }, []);

  const handleSort = (column: string) => {
    const newSortOrder =
      sortBy === column && sortOrder === "asc" ? "desc" : "asc";

    setSortBy(column);
    setSortOrder(newSortOrder);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleUserCreated = () => {
    queryClient.invalidateQueries({
      queryKey: ["outlet-users", outletId],
    });
    handleCloseCreateModal();
  };

  const columns: ColumnDef<OutletUser>[] = [
    {
      accessorKey: "index",
      header: () => (
        <div className="text-center text-xs font-semibold tracking-wider uppercase sm:text-xs">
          No
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-center text-sm sm:text-sm">
          {(page - 1) * pageSize + row.index + 1}
        </div>
      ),
      enableHiding: false,
      size: 40,
    },
    {
      accessorKey: "name",
      header: () => (
        <Button
          variant="ghost"
          onClick={() => handleSort("firstName")}
          className="p-0 text-xs font-semibold tracking-wider uppercase hover:bg-transparent sm:text-xs"
        >
          Nama
          <ArrowUpDown className="ml-1 h-3 w-3" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="flex flex-col">
          <div className="text-sm font-medium sm:text-sm">
            {row.original.firstName} {row.original.lastName}
          </div>
          <div className="mt-1 flex items-center text-xs text-gray-500">
            <Mail className="mr-1 h-3 w-3" />
            {row.original.email}
          </div>
        </div>
      ),
      size: 200,
    },
    {
      accessorKey: "phoneNumber",
      header: () => (
        <div className="text-left text-xs font-semibold tracking-wider uppercase sm:text-xs">
          Telepon
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center text-sm sm:text-sm">
          <Phone className="mr-1 h-3 w-3 text-gray-400" />
          {row.original.phoneNumber}
        </div>
      ),
      size: 120,
    },
    {
      accessorKey: "role",
      header: () => (
        <div className="text-center text-xs font-semibold tracking-wider uppercase sm:text-xs">
          Role
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex justify-center">
          <RoleBadge role={row.original.role} />
        </div>
      ),
      size: 100,
    },
    {
      accessorKey: "status",
      header: () => (
        <div className="text-center text-xs font-semibold tracking-wider uppercase sm:text-xs">
          Status
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex justify-center">
          <StatusBadge isVerified={row.original.isVerified} />
        </div>
      ),
      size: 80,
    },
    {
      accessorKey: "orders",
      header: () => (
        <div className="text-center text-xs font-semibold tracking-wider uppercase sm:text-xs">
          Orders
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center text-sm">
          <ShoppingCart className="mr-1 h-3 w-3 text-gray-400" />
          {row.original.totalOrdersInOutlet}
        </div>
      ),
      size: 80,
    },
    {
      accessorKey: "employee",
      header: () => (
        <div className="text-center text-xs font-semibold tracking-wider uppercase sm:text-xs">
          Type
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex justify-center">
          <EmployeeBadge employeeInfo={row.original.employeeInfo} />
        </div>
      ),
      size: 100,
    },
    {
      accessorKey: "createdAt",
      header: () => (
        <Button
          variant="ghost"
          onClick={() => handleSort("createdAt")}
          className="p-0 text-xs font-semibold tracking-wider uppercase hover:bg-transparent sm:text-xs"
        >
          Dibuat
          <ArrowUpDown className="ml-1 h-3 w-3" />
        </Button>
      ),
      cell: ({ row }) => {
        const date = new Date(row.original.createdAt);
        return (
          <div className="text-sm sm:text-sm">
            {date.toLocaleDateString("id-ID", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </div>
        );
      },
      size: 100,
    },
  ];

  const sortableId = React.useId();
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {}),
  );

  const dataIds = useMemo<UniqueIdentifier[]>(
    () => data?.map(({ id }) => id) || [],
    [data],
  );

  const table = useReactTable({
    data: data || [],
    columns,
    state: {
      columnVisibility,
      rowSelection,
    },
    getRowId: (row) => row.id.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
  });

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setData((data) => {
        const oldIndex = dataIds.indexOf(active.id);
        const newIndex = dataIds.indexOf(over.id);
        return arrayMove(data, oldIndex, newIndex);
      });
    }
  }

  return (
    <>
      <div className="max-w-full space-y-4 sm:space-y-4">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Outlet User Management
            </h1>
            <p className="text-gray-600">
              Kelola pengguna yang terkait dengan outlet ini
            </p>
          </div>

          <div>
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Tambah User Baru</span>
              <span className="sm:hidden">Tambah User</span>
            </Button>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-3 sm:gap-3 lg:flex-row lg:items-center">
          <div className="max-w-md flex-1">
            <div className="relative">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
              <Input
                placeholder="Cari berdasarkan nama atau email..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="flex flex-1 gap-2 sm:flex-initial">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex h-10 flex-1 items-center justify-center px-3 text-sm sm:h-9 sm:flex-initial sm:justify-start sm:px-3 md:text-sm"
                  >
                    <FilterIcon className="mr-1.5 h-4 w-4" />
                    <span className="truncate">
                      {role
                        ? OUTLET_USER_ROLES[
                            role as keyof typeof OUTLET_USER_ROLES
                          ]?.label || role
                        : "Semua Role"}
                    </span>
                    <ChevronDownIcon className="ml-1.5 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem
                    onClick={() => handleRoleFilter("")}
                    className="cursor-pointer text-sm"
                  >
                    Semua Role
                  </DropdownMenuItem>
                  {Object.entries(OUTLET_USER_ROLES).map(([role, config]) => (
                    <DropdownMenuItem
                      key={role}
                      onClick={() => handleRoleFilter(role)}
                      className="flex cursor-pointer items-center text-sm"
                    >
                      <div
                        className={`mr-2 h-2 w-2 rounded-full ${
                          config.color.split(" ")[1]
                        }`}
                      ></div>
                      {config.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex h-10 flex-1 items-center justify-center px-3 text-sm sm:h-9 sm:flex-initial sm:justify-start sm:px-3 md:text-sm"
                  >
                    <span>Kolom</span>
                    <ChevronDownIcon className="ml-1.5 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  {table
                    .getAllColumns()
                    .filter(
                      (column) =>
                        typeof column.accessorFn !== "undefined" &&
                        column.getCanHide(),
                    )
                    .map((column) => (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="cursor-pointer text-sm capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id === "name"
                          ? "Nama"
                          : column.id === "phoneNumber"
                            ? "Telepon"
                            : column.id === "role"
                              ? "Role"
                              : column.id === "provider"
                                ? "Provider"
                                : column.id === "status"
                                  ? "Status"
                                  : column.id === "orders"
                                    ? "Orders"
                                    : column.id === "employee"
                                      ? "Type"
                                      : column.id === "createdAt"
                                        ? "Dibuat"
                                        : column.id}
                      </DropdownMenuCheckboxItem>
                    ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        <div className="w-full overflow-hidden rounded-lg border shadow-sm">
          <DndContext
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={handleDragEnd}
            sensors={sensors}
            id={sortableId}
          >
            <div
              className="w-full overflow-x-auto"
              style={{ minHeight: "400px" }}
            >
              <Table className="w-full min-w-[900px]">
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id} className="border-b">
                      {headerGroup.headers.map((header) => {
                        let headerClass = "h-10 sm:h-10 px-2 sm:px-4";

                        if (header.id === "index")
                          headerClass += " w-10 sm:w-16";
                        else if (header.id === "name")
                          headerClass += " min-w-[200px] sm:w-auto";
                        else if (header.id === "phoneNumber")
                          headerClass += " min-w-[120px] sm:w-auto";
                        else if (header.id === "role")
                          headerClass += " min-w-[100px] sm:w-32";
                        else if (header.id === "provider")
                          headerClass += " min-w-[80px] sm:w-24";
                        else if (header.id === "status")
                          headerClass += " min-w-[80px] sm:w-24";
                        else if (header.id === "orders")
                          headerClass += " min-w-[80px] sm:w-24";
                        else if (header.id === "employee")
                          headerClass += " min-w-[100px] sm:w-32";
                        else if (header.id === "createdAt")
                          headerClass += " min-w-[100px] sm:w-32";

                        return (
                          <TableHead
                            key={header.id}
                            colSpan={header.colSpan}
                            className={headerClass}
                          >
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
                  {isLoading ? (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        <div className="flex items-center justify-center">
                          <Loader2 className="h-6 w-6 animate-spin text-blue-500 sm:h-6 sm:w-6" />
                          <span className="ml-2 text-sm sm:text-sm">
                            Memuat...
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : error ? (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center text-red-500"
                      >
                        <div className="flex flex-col items-center gap-2">
                          <span className="text-sm">Kesalahan memuat data</span>
                          <span className="text-sm text-red-400 sm:text-sm">
                            {error.message || "Kesalahan tidak diketahui"}
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : table.getRowModel().rows?.length ? (
                    <SortableContext
                      items={dataIds}
                      strategy={verticalListSortingStrategy}
                    >
                      {table.getRowModel().rows.map((row) => (
                        <DraggableRow key={row.id} row={row} />
                      ))}
                    </SortableContext>
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        <span className="text-sm">
                          Tidak ada data pengguna ditemukan untuk outlet ini
                        </span>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </DndContext>

          {usersData?.meta && (
            <div className="border-t px-3 py-3 sm:px-4 sm:py-3">
              <PaginationSection
                page={usersData.meta.page}
                take={usersData.meta.take}
                total={usersData.meta.total}
                onChangePage={handlePageChange}
              />
            </div>
          )}
        </div>
      </div>

      <CreateOutletUserModal
        open={isCreateModalOpen}
        outletId={outletId}
        onClose={handleCloseCreateModal}
        onSave={handleUserCreated}
      />
    </>
  );
}
