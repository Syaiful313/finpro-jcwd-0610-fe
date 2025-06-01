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
import useDeleteUser from "@/hooks/api/admin/useDeleteUser";
import useGetUsers, { User as ApiUser } from "@/hooks/api/admin/useGetUsers";
import { ROLE_CONFIG } from "@/lib/config";
import { useQueryClient } from "@tanstack/react-query";
import {
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
import {
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
  useQueryStates,
} from "nuqs";
import { useEffect, useState } from "react";
import CreateUserModal from "./CreateUserModal";
import DeleteUserAlert from "./DeleteUserAlert";
import EditUserModal from "./EditUserModal";

const PAGE_SIZE = 10;
const DEBOUNCE_DELAY = 300;

const getCellClass = (columnId: string) => {
  const baseClass = "py-3 px-2 sm:px-4";
  const styles: Record<string, string> = {
    index: "w-16 text-center text-sm",
    name: "min-w-[200px] text-sm font-medium",
    phone: "min-w-[120px] text-sm",
    role: "w-32 text-center",
    status: "w-24 text-center",
    actions: "w-32 text-center",
  };
  return `${baseClass} ${styles[columnId] || "text-sm"}`;
};

const RoleBadge = ({ role }: { role: string }) => {
  const config = ROLE_CONFIG[role as keyof typeof ROLE_CONFIG] || {
    color: "bg-gray-50 text-gray-700 border-gray-200",
    label: role,
  };

  return (
    <Badge
      variant="outline"
      className={`px-2 py-1 text-xs font-medium ${config.color}`}
    >
      {config.label}
    </Badge>
  );
};

const StatusBadge = ({ isVerified }: { isVerified: boolean }) => (
  <Badge
    variant="outline"
    className={`px-2 py-1 text-xs font-medium ${
      isVerified
        ? "border-green-200 bg-green-50 text-green-700"
        : "border-yellow-200 bg-yellow-50 text-yellow-700"
    }`}
  >
    {isVerified ? "Verified" : "Unverified"}
  </Badge>
);

const UserRow = ({
  user,
  index,
  isAdmin,
  isOutletAdmin,
  onEdit,
  onDelete,
  isDeleting,
}: {
  user: ApiUser;
  index: number;
  isAdmin: boolean;
  isOutletAdmin: boolean;
  onEdit: (user: ApiUser) => void;
  onDelete: (id: number, name: string) => void;
  isDeleting: boolean;
}) => (
  <TableRow className="border-b hover:bg-gray-50">
    <TableCell className={getCellClass("index")}>{index}</TableCell>

    <TableCell className={getCellClass("name")}>
      <div className="flex flex-col">
        <div className="font-medium">
          {user.firstName} {user.lastName}
        </div>
        <div className="mt-1 flex items-center text-xs text-gray-500">
          <Mail className="mr-1 h-3 w-3" />
          {user.email}
        </div>
        {isOutletAdmin && user.employeeInfo && (
          <div className="mt-1 text-xs text-green-600">
            NPWP: {user.employeeInfo.npwp}
          </div>
        )}
      </div>
    </TableCell>

    <TableCell className={getCellClass("phone")}>
      <div className="flex items-center">
        <Phone className="mr-1 h-3 w-3 text-gray-400" />
        {user.phoneNumber || "-"}
      </div>
    </TableCell>

    <TableCell className={getCellClass("role")}>
      <div className="flex justify-center">
        <RoleBadge role={user.role} />
      </div>
    </TableCell>

    <TableCell className={getCellClass("status")}>
      <div className="flex justify-center">
        <StatusBadge isVerified={user.isVerified} />
      </div>
    </TableCell>

    <TableCell className={getCellClass("date")}>
      {new Date(user.createdAt).toLocaleDateString("id-ID", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })}
    </TableCell>

    {isAdmin && (
      <TableCell className={getCellClass("actions")}>
        <div className="flex justify-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-green-600 hover:bg-green-50"
            onClick={() => onEdit(user)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-red-600 hover:bg-red-50"
            onClick={() =>
              onDelete(user.id, `${user.firstName} ${user.lastName}`)
            }
            disabled={isDeleting}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    )}
  </TableRow>
);

export function UserManagementTable() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const deleteUserMutation = useDeleteUser();

  const [filters, setFilters] = useQueryStates({
    page: parseAsInteger.withDefault(1),
    search: parseAsString.withDefault(""),
    role: parseAsString.withDefault(""),
    sortBy: parseAsString.withDefault("createdAt"),
    sortOrder: parseAsStringEnum(["asc", "desc"]).withDefault("desc"),
  });

  const [modals, setModals] = useState({
    showCreate: false,
    showEdit: false,
    showDelete: false,
  });

  const [selected, setSelected] = useState({
    editingUser: null as ApiUser | null,
    userToDelete: null as { id: number; name: string } | null,
  });

  const [debouncedSearch, setDebouncedSearch] = useState(filters.search);

  const isAdmin = session?.user?.role === "ADMIN";
  const isOutletAdmin = session?.user?.role === "OUTLET_ADMIN";

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(filters.search);

      if (filters.page !== 1 && filters.search !== debouncedSearch) {
        setFilters({ page: 1 });
      }
    }, DEBOUNCE_DELAY);
    return () => clearTimeout(timer);
  }, [filters.search, filters.page, debouncedSearch, setFilters]);

  const {
    data: usersData,
    isLoading,
    error,
  } = useGetUsers(
    {
      page: filters.page,
      take: PAGE_SIZE,
      search: debouncedSearch,
      role: filters.role as any,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
    },
    {
      enabled: !!session && (isAdmin || isOutletAdmin),
    },
  );

  const availableRoles = isAdmin
    ? ROLE_CONFIG
    : isOutletAdmin
      ? { DRIVER: ROLE_CONFIG.DRIVER, WORKER: ROLE_CONFIG.WORKER }
      : {};

  const updateFilters = (updates: Partial<typeof filters>) => {
    setFilters(updates);
  };

  const updateModals = (updates: Partial<typeof modals>) => {
    setModals((prev) => ({ ...prev, ...updates }));
  };

  const handleCreateUser = () => {
    if (!isAdmin) return;
    updateModals({ showCreate: true });
  };

  const handleEditUser = (user: ApiUser) => {
    if (!isAdmin) return;
    setSelected({ ...selected, editingUser: user });
    updateModals({ showEdit: true });
  };

  const handleDeleteUser = (userId: number, name: string) => {
    if (!isAdmin) return;
    setSelected({ ...selected, userToDelete: { id: userId, name } });
    updateModals({ showDelete: true });
  };

  const confirmDelete = () => {
    if (!selected.userToDelete || !isAdmin) return;

    deleteUserMutation.mutate(selected.userToDelete.id, {
      onSuccess: () => {
        updateModals({ showDelete: false });
        setSelected({ ...selected, userToDelete: null });
        queryClient.invalidateQueries({ queryKey: ["users"] });
      },
    });
  };

  const closeModals = () => {
    updateModals({ showCreate: false, showEdit: false, showDelete: false });
    setSelected({ editingUser: null, userToDelete: null });
  };

  if (!session) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2">Loading session...</span>
      </div>
    );
  }

  if (!isAdmin && !isOutletAdmin) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <span className="text-red-500">Access Denied</span>
          <p className="mt-2 text-sm text-gray-500">
            You don't have permission to view this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">
            {isAdmin
              ? "Kelola pengguna aplikasi dan permission mereka"
              : "Lihat pengguna di outlet Anda"}
          </p>
        </div>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative max-w-md flex-1">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Cari berdasarkan nama atau email..."
              value={filters.search}
              onChange={(e) => updateFilters({ search: e.target.value })}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2">
            {isAdmin && (
              <Button onClick={handleCreateUser}>
                <UserPlus className="mr-2 h-4 w-4" />
                Tambah User
              </Button>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-40">
                  <FilterIcon className="mr-2 h-4 w-4" />
                  <span className="truncate">
                    {filters.role
                      ? availableRoles[
                          filters.role as keyof typeof availableRoles
                        ]?.label
                      : "Semua Role"}
                  </span>
                  <ChevronDownIcon className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => updateFilters({ role: "" })}>
                  Semua Role
                </DropdownMenuItem>
                {Object.entries(availableRoles).map(([role, config]) => (
                  <DropdownMenuItem
                    key={role}
                    onClick={() => updateFilters({ role })}
                  >
                    {config.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="rounded-lg border shadow-sm">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b">
                  <TableHead className="w-16 text-center">No</TableHead>
                  <TableHead className="min-w-[200px]">Nama</TableHead>
                  <TableHead className="min-w-[120px]">Telepon</TableHead>
                  <TableHead className="w-32 text-center">Role</TableHead>
                  <TableHead className="w-24 text-center">Status</TableHead>
                  <TableHead className="w-32">Dibuat</TableHead>
                  {isAdmin && (
                    <TableHead className="w-32 text-center">Aksi</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={isAdmin ? 7 : 6}
                      className="h-32 text-center"
                    >
                      <div className="flex items-center justify-center">
                        <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                        Memuat...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell
                      colSpan={isAdmin ? 7 : 6}
                      className="h-32 text-center text-red-500"
                    >
                      <div>
                        <div>Kesalahan memuat data</div>
                        <div className="mt-1 text-sm text-red-400">
                          {error.message || "Kesalahan tidak diketahui"}
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : usersData?.data?.length ? (
                  usersData.data.map((user, index) => (
                    <UserRow
                      key={user.id}
                      user={user}
                      index={(filters.page - 1) * PAGE_SIZE + index + 1}
                      isAdmin={isAdmin}
                      isOutletAdmin={isOutletAdmin}
                      onEdit={handleEditUser}
                      onDelete={handleDeleteUser}
                      isDeleting={deleteUserMutation.isPending}
                    />
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={isAdmin ? 7 : 6}
                      className="h-32 text-center"
                    >
                      <span className="text-gray-500">
                        {isOutletAdmin
                          ? "Tidak ada driver atau worker ditemukan di outlet Anda"
                          : "Tidak ada data pengguna ditemukan"}
                      </span>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {usersData?.meta && (
            <div className="border-t px-4 py-3">
              <PaginationSection
                page={usersData.meta.page}
                take={usersData.meta.take}
                total={usersData.meta.total}
                onChangePage={(newPage) => updateFilters({ page: newPage })}
              />
            </div>
          )}
        </div>
      </div>

      {isAdmin && (
        <>
          <DeleteUserAlert
            open={modals.showDelete}
            onOpenChange={(open) => updateModals({ showDelete: open })}
            userToDelete={selected.userToDelete}
            onConfirm={confirmDelete}
            isDeleting={deleteUserMutation.isPending}
          />

          <CreateUserModal
            open={modals.showCreate}
            onClose={() => updateModals({ showCreate: false })}
          />

          {selected.editingUser && (
            <EditUserModal
              open={modals.showEdit}
              user={selected.editingUser}
              onClose={closeModals}
              onSuccess={() => {
                closeModals();
                queryClient.invalidateQueries({ queryKey: ["users"] });
              }}
            />
          )}
        </>
      )}
    </>
  );
}
