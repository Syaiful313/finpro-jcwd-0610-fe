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
import useDeleteUser from "@/hooks/api/admin-super/useDeleteUser";
import useGetUsers, { User } from "@/hooks/api/admin/useGetUsers";
import { PROVIDER_CONFIG, ROLE_CONFIG } from "@/lib/config";
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
  Edit,
  FilterIcon,
  Loader2,
  Mail,
  Phone,
  Search,
  Trash2,
  UserPlus,
} from "lucide-react";
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import CreateUserModal from "./CreateUserModal";
import DeleteUserAlert from "./DeleteUserAlert";
import EditUserModal from "./EditUserModal";

function DraggableRow({ row }: { row: Row<User> }) {
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

export function UserManagementTable() {
  // ✅ ALL HOOKS - Called before any conditional logic
  const { data: session } = useSession();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [pageSize] = useState(10);
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState({});
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [userToDelete, setUserToDelete] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [data, setData] = useState<User[]>([]);
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  const queryClient = useQueryClient();
  const deleteUserMutation = useDeleteUser();

  // ✅ ALL HOOKS - useId, useSensors, useMemo, useCallback
  const sortableId = React.useId();
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {}),
  );

  // ✅ Calculate derived values
  const userRole = session?.user?.role;
  const outletId = session?.user?.outletId;
  const isOutletAdmin = userRole === "OUTLET_ADMIN";
  const isSuperAdmin = userRole === "ADMIN";

  // ✅ ALL useEffect hooks
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // ✅ UPDATED: Use simplified hook - no outletId parameter needed
  const {
    data: usersData,
    isLoading,
    error,
  } = useGetUsers(
    {
      page: page,
      take: pageSize,
      search: debouncedSearch,
      role: role as any,
      sortBy: sortBy,
      sortOrder: sortOrder,
    },
    {
      enabled: !!session && (isSuperAdmin || isOutletAdmin),
    }
  );

  useEffect(() => {
    if (usersData?.data) {
      setData(usersData.data);
    }
  }, [usersData]);

  // ✅ ALL useMemo hooks
  const dataIds = useMemo<UniqueIdentifier[]>(
    () => data?.map(({ id }) => id) || [],
    [data],
  );

  // ✅ ALL useCallback hooks
  const handleSearch = useCallback((searchValue: string) => {
    setSearch(searchValue);
  }, []);

  const handleDeleteUser = useCallback((userId: number, name: string) => {
    setUserToDelete({ id: userId, name });
    setShowDeleteAlert(true);
  }, []);

  const confirmDeleteUser = useCallback(() => {
    if (userToDelete) {
      deleteUserMutation.mutate(userToDelete.id, {
        onSuccess: () => {
          setShowDeleteAlert(false);
          setUserToDelete(null);
          // ✅ UPDATED: Simplified query invalidation
          queryClient.invalidateQueries({ 
            queryKey: ["users"] 
          });
        },
        onError: () => {},
      });
    }
  }, [userToDelete, deleteUserMutation, queryClient]);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handleRoleFilter = useCallback((newRole: string) => {
    setRole(newRole);
    setPage(1);
  }, []);

  const handleSort = useCallback((column: string) => {
    const newSortOrder =
      sortBy === column && sortOrder === "asc" ? "desc" : "asc";
    setSortBy(column);
    setSortOrder(newSortOrder);
  }, [sortBy, sortOrder]);

  const handleCreateUser = useCallback(() => {
    setShowCreateModal(true);
  }, []);

  const handleEditUser = useCallback((user: User) => {
    setEditingUser(user);
    setShowEditModal(true);
  }, []);

  const handleCloseCreateModal = useCallback(() => {
    setShowCreateModal(false);
  }, []);

  const handleCloseEditModal = useCallback(() => {
    setShowEditModal(false);
    setEditingUser(null);
  }, []);

  const handleEditSuccess = useCallback(() => {
    // ✅ UPDATED: Simplified query invalidation
    queryClient.invalidateQueries({ 
      queryKey: ["users"] 
    });
  }, [queryClient]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setData((data) => {
        const oldIndex = dataIds.indexOf(active.id);
        const newIndex = dataIds.indexOf(over.id);
        return arrayMove(data, oldIndex, newIndex);
      });
    }
  }, [dataIds]);

  // ✅ Badge components sebagai useCallback
  const RoleBadge = useCallback(({ role }: { role: string }) => {
    const config = ROLE_CONFIG[role as keyof typeof ROLE_CONFIG] || {
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
  }, []);

  const StatusBadge = useCallback(({ isVerified }: { isVerified: boolean }) => {
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
  }, []);

  // ✅ UPDATED: Role filtering for OUTLET_ADMIN
  const availableRoles = useMemo(() => {
    if (isOutletAdmin) {
      // OUTLET_ADMIN hanya bisa filter DRIVER dan WORKER
      return {
        DRIVER: ROLE_CONFIG.DRIVER,
        WORKER: ROLE_CONFIG.WORKER,
      };
    } else if (isSuperAdmin) {
      // ADMIN bisa filter semua role
      return ROLE_CONFIG;
    }
    return {};
  }, [isOutletAdmin, isSuperAdmin]);

  // ✅ Define columns dengan useMemo
  const columns: ColumnDef<User>[] = useMemo(() => [
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
          {/* ✅ UPDATED: Show outlet-specific info for OUTLET_ADMIN */}
          {isOutletAdmin && row.original.totalOrdersInOutlet !== undefined && (
            <div className="mt-1 text-xs text-blue-600">
              {row.original.totalOrdersInOutlet} orders di outlet ini
            </div>
          )}
          {isOutletAdmin && row.original.employeeInfo && (
            <div className="mt-1 text-xs text-green-600">
              Employee ID: {row.original.employeeInfo.id} | NPWP: {row.original.employeeInfo.npwp}
            </div>
          )}
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
          {row.original.phoneNumber || "-"}
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
    {
      id: "actions",
      header: () => (
        <div className="text-center text-xs font-semibold tracking-wider uppercase sm:text-xs">
          Aksi
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex justify-center gap-1 sm:gap-1">
          <Button
            variant="ghost"
            className="h-8 w-8 rounded-full p-1 text-green-600 hover:bg-green-50 hover:text-green-800 sm:h-8 sm:w-8 sm:p-1"
            size="icon"
            onClick={() => handleEditUser(row.original)}
          >
            <Edit className="h-4 w-4 sm:h-4 sm:w-4" />
            <span className="sr-only">Edit pengguna</span>
          </Button>
          <Button
            variant="ghost"
            className="h-8 w-8 rounded-full p-1 text-red-600 hover:bg-red-50 hover:text-red-800 sm:h-8 sm:w-8 sm:p-1"
            size="icon"
            onClick={() =>
              handleDeleteUser(
                row.original.id,
                `${row.original.firstName} ${row.original.lastName}`,
              )
            }
            disabled={deleteUserMutation.isPending}
          >
            <Trash2 className="h-4 w-4 sm:h-4 sm:w-4" />
            <span className="sr-only">Hapus pengguna</span>
          </Button>
        </div>
      ),
      enableHiding: false,
      size: 120,
    },
  ], [page, pageSize, handleSort, isOutletAdmin, RoleBadge, StatusBadge, handleEditUser, handleDeleteUser, deleteUserMutation.isPending]);

  // ✅ useReactTable hook
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

  // ✅ CONDITIONAL RENDERING - After all hooks are called
  if (!session) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center">
          <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
          <span className="ml-2 text-sm">Loading session...</span>
        </div>
      </div>
    );
  }

  if (!isSuperAdmin && !isOutletAdmin) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <span className="text-red-500">Access Denied</span>
          <p className="text-sm text-gray-500 mt-2">
            You don't have permission to view this page.
          </p>
        </div>
      </div>
    );
  }

  // ✅ UPDATED: Remove outletId check since it's handled by backend
  return (
    <>
      <div className="max-w-full space-y-4 sm:space-y-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">
            Kelola pengguna aplikasi dan permission mereka
            {/* ✅ UPDATED: Show different context based on role */}
            {isOutletAdmin && " (Driver & Worker di outlet Anda)"}
            {isSuperAdmin && " (Global Access - Semua User)"}
          </p>
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
            <Button onClick={handleCreateUser}>
              <UserPlus className="mr-2 h-4 w-4" />
              Tambah User
            </Button>

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
                        ? availableRoles[role as keyof typeof availableRoles]
                            ?.label || role
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
                  {/* ✅ UPDATED: Show only available roles based on user permission */}
                  {Object.entries(availableRoles).map(([role, config]) => (
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
              <Table className="w-full min-w-[800px]">
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
                        else if (header.id === "createdAt")
                          headerClass += " min-w-[100px] sm:w-32";
                        else if (header.id === "actions")
                          headerClass += " w-16 sm:w-32";

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
                          {isOutletAdmin 
                            ? "Tidak ada driver atau worker ditemukan di outlet Anda"
                            : "Tidak ada data pengguna ditemukan"
                          }
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

      <DeleteUserAlert
        open={showDeleteAlert}
        onOpenChange={setShowDeleteAlert}
        userToDelete={userToDelete}
        onConfirm={confirmDeleteUser}
        isDeleting={deleteUserMutation.isPending}
      />

      <CreateUserModal
        open={showCreateModal}
        onClose={handleCloseCreateModal}
        currentUserRole={userRole}
      />

      {/* {editingUser && (
        <EditUserModal
          open={showEditModal}
          user={editingUser}
          onClose={handleCloseEditModal}
          onSuccess={handleEditSuccess}
        />
      )} */}
    </>
  );
}