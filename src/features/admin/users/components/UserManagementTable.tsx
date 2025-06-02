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
  Calendar,
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
  const baseClass = "py-2 px-2 sm:py-3 sm:px-4";
  const styles: Record<string, string> = {
    index: "w-12 sm:w-16 text-center text-xs sm:text-sm",
    name: "min-w-[150px] sm:min-w-[200px] text-xs sm:text-sm font-medium",
    phone:
      "min-w-[100px] sm:min-w-[120px] text-xs sm:text-sm hidden md:table-cell",
    role: "w-24 sm:w-32 text-center",
    status: "w-20 sm:w-24 text-center hidden sm:table-cell",
    // date: "w-24 sm:w-32 text-xs sm:text-sm hidden lg:table-cell",
    actions: "w-20 sm:w-32 text-center",
  };
  return `${baseClass} ${styles[columnId] || "text-xs sm:text-sm"}`;
};

const RoleBadge = ({ role }: { role: string }) => {
  const config = ROLE_CONFIG[role as keyof typeof ROLE_CONFIG] || {
    color: "bg-gray-50 text-gray-700 border-gray-200",
    label: role,
  };

  return (
    <Badge
      variant="outline"
      className={`px-1.5 py-0.5 text-xs font-medium sm:px-2 sm:py-1 ${config.color}`}
    >
      {config.label}
    </Badge>
  );
};

const StatusBadge = ({ isVerified }: { isVerified: boolean }) => (
  <Badge
    variant="outline"
    className={`px-1.5 py-0.5 text-xs font-medium sm:px-2 sm:py-1 ${
      isVerified
        ? "border-green-200 bg-green-50 text-green-700"
        : "border-yellow-200 bg-yellow-50 text-yellow-700"
    }`}
  >
    {isVerified ? "Verified" : "Unverified"}
  </Badge>
);

const UserCard = ({
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
  <div className="rounded-lg border bg-white p-2.5 shadow-sm">
    <div className="mb-2 flex items-start justify-between">
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center gap-2">
          <span className="text-xs text-gray-500">{index} .</span>
          <RoleBadge role={user.role} />
        </div>
        <h3 className="truncate pr-1 text-sm font-medium text-gray-900">
          {user.firstName} {user.lastName}
        </h3>
      </div>
      {isAdmin && (
        <div className="flex flex-shrink-0 gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 text-green-600 hover:bg-green-50"
            onClick={() => onEdit(user)}
          >
            <Edit className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 text-red-600 hover:bg-red-50"
            onClick={() =>
              onDelete(user.id, `${user.firstName} ${user.lastName}`)
            }
            disabled={isDeleting}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      )}
    </div>

    <div className="space-y-1.5 text-xs text-gray-600">
      <div className="flex items-center">
        <Mail className="mr-1 h-3 w-3 flex-shrink-0" />
        <span className="truncate">{user.email}</span>
      </div>

      {user.phoneNumber && (
        <div className="flex items-center">
          <Phone className="mr-1 h-3 w-3 flex-shrink-0" />
          <span>{user.phoneNumber}</span>
        </div>
      )}

      {isOutletAdmin && user.employeeInfo && (
        <div className="text-green-600">
          <span className="font-medium">NPWP:</span> {user.employeeInfo.npwp}
        </div>
      )}

      <div className="flex items-center justify-end pt-1">
        
        <StatusBadge isVerified={user.isVerified} />
      </div>
    </div>
  </div>
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
        <div className="font-medium break-words">
          {user.firstName} {user.lastName}
        </div>
        <div className="mt-1 flex items-center text-xs text-gray-500">
          <Mail className="mr-1 h-3 w-3" />
          <span className="break-all">{user.email}</span>
        </div>
        {isOutletAdmin && user.employeeInfo && (
          <div className="mt-1 text-xs text-green-600">
            NPWP: {user.employeeInfo.npwp}
          </div>
        )}
        <div className="mt-1 flex items-center text-xs text-gray-500 md:hidden">
          <Phone className="mr-1 h-3 w-3" />
          {user.phoneNumber || "-"}
        </div>
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

    {isAdmin && (
      <TableCell className={getCellClass("actions")}>
        <div className="flex justify-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 text-green-600 hover:bg-green-50 sm:h-8 sm:w-8"
            onClick={() => onEdit(user)}
          >
            <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 text-red-600 hover:bg-red-50 sm:h-8 sm:w-8"
            onClick={() =>
              onDelete(user.id, `${user.firstName} ${user.lastName}`)
            }
            disabled={isDeleting}
          >
            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
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
      <div className="flex h-64 items-center justify-center px-1">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2 text-sm sm:text-base">Loading session...</span>
      </div>
    );
  }

  if (!isAdmin && !isOutletAdmin) {
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
    <>
      <div className="space-y-3 px-1 sm:space-y-6 sm:px-4 lg:px-0">
        <div className="px-1 sm:px-0">
          <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
            User Management
          </h1>
          <p className="text-sm text-gray-600 sm:text-base">
            {isAdmin
              ? "Kelola pengguna aplikasi dan permission mereka"
              : "Lihat pengguna di outlet Anda"}
          </p>
        </div>

        <div className="mx-1 flex flex-col gap-3 rounded-lg border p-2 shadow-sm sm:mx-0 sm:gap-4 sm:p-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md lg:flex-1">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Cari berdasarkan nama atau email..."
              value={filters.search}
              onChange={(e) => updateFilters({ search: e.target.value })}
              className="pl-10 text-sm"
            />
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:gap-3 lg:flex-shrink-0">
            {isAdmin && (
              <Button
                onClick={handleCreateUser}
                className="flex h-9 items-center justify-center gap-2 text-sm sm:h-10"
              >
                <UserPlus className="h-4 w-4" />
                <span className="xs:inline hidden">Tambah User</span>
                <span className="xs:hidden">Tambah</span>
              </Button>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="h-9 min-w-0 text-sm sm:h-10 lg:min-w-[140px]"
                >
                  <FilterIcon className="mr-2 h-4 w-4 flex-shrink-0" />
                  <span className="truncate text-xs sm:text-sm">
                    {filters.role
                      ? availableRoles[
                          filters.role as keyof typeof availableRoles
                        ]?.label
                      : "Semua Role"}
                  </span>
                  <ChevronDownIcon className="ml-2 h-4 w-4 flex-shrink-0" />
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

            <Button
              variant="outline"
              onClick={() =>
                updateFilters({
                  search: "",
                  role: "",
                  page: 1,
                })
              }
              disabled={!filters.search && !filters.role}
              className="h-9 text-sm sm:h-10"
            >
              Reset
            </Button>
          </div>
        </div>

        <div className="block px-1 sm:hidden sm:px-0">
          {isLoading ? (
            <div className="flex h-32 items-center justify-center">
              <Loader2 className="mr-2 h-6 w-6 animate-spin" />
              <span className="text-sm">Memuat data user...</span>
            </div>
          ) : error ? (
            <div className="p-4 text-center text-red-500">
              <div className="text-sm">Kesalahan memuat data</div>
              <div className="mt-1 text-xs text-red-400">
                {error.message || "Kesalahan tidak diketahui"}
              </div>
            </div>
          ) : usersData?.data?.length ? (
            <div className="space-y-2">
              {usersData.data.map((user, index) => (
                <UserCard
                  key={user.id}
                  user={user}
                  index={(filters.page - 1) * PAGE_SIZE + index + 1}
                  isAdmin={isAdmin}
                  isOutletAdmin={isOutletAdmin}
                  onEdit={handleEditUser}
                  onDelete={handleDeleteUser}
                  isDeleting={deleteUserMutation.isPending}
                />
              ))}
            </div>
          ) : (
            <div className="p-3 text-center">
              <span className="mb-3 block text-sm text-gray-500">
                {isOutletAdmin
                  ? "Tidak ada driver atau worker ditemukan di outlet Anda"
                  : "Tidak ada data pengguna ditemukan"}
              </span>
              {isAdmin && !filters.search && !filters.role && (
                <Button
                  onClick={handleCreateUser}
                  variant="outline"
                  className="mx-auto flex items-center gap-2"
                  size="sm"
                >
                  <UserPlus className="h-4 w-4" />
                  Tambah User Pertama
                </Button>
              )}
            </div>
          )}
        </div>

        <div className="mx-1 hidden rounded-lg border shadow-sm sm:mx-0 sm:block">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b">
                  <TableHead className="w-12 text-center text-xs sm:w-16 sm:text-sm">
                    No
                  </TableHead>
                  <TableHead className="min-w-[150px] text-xs sm:min-w-[200px] sm:text-sm">
                    Nama
                  </TableHead>
                  <TableHead className="hidden min-w-[100px] text-xs sm:min-w-[120px] sm:text-sm md:table-cell">
                    Telepon
                  </TableHead>
                  <TableHead className="w-24 text-center text-xs sm:w-32 sm:text-sm">
                    Role
                  </TableHead>
                  <TableHead className="hidden w-20 text-center text-xs sm:table-cell sm:w-24 sm:text-sm">
                    Status
                  </TableHead>

                  {isAdmin && (
                    <TableHead className="w-20 text-center text-xs sm:w-32 sm:text-sm">
                      Aksi
                    </TableHead>
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
                        <span className="text-sm">Memuat...</span>
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
                        <div className="text-sm">Kesalahan memuat data</div>
                        <div className="mt-1 text-xs text-red-400">
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
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <span className="text-sm text-gray-500">
                          {isOutletAdmin
                            ? "Tidak ada driver atau worker ditemukan di outlet Anda"
                            : "Tidak ada data pengguna ditemukan"}
                        </span>
                        {isAdmin && !filters.search && !filters.role && (
                          <Button
                            onClick={handleCreateUser}
                            variant="outline"
                            className="flex items-center gap-2"
                            size="sm"
                          >
                            <UserPlus className="h-4 w-4" />
                            Tambah User Pertama
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {usersData?.meta && (
          <div className="mx-1 rounded-b-lg border-t bg-white px-2 py-2 sm:mx-0 sm:px-4 sm:py-3">
            <PaginationSection
              page={usersData.meta.page}
              take={usersData.meta.take}
              total={usersData.meta.total}
              hasNext={usersData.meta.page * usersData.meta.take < usersData.meta.total}
              hasPrevious={usersData.meta.page > 1}
              onChangePage={(newPage) => updateFilters({ page: newPage })}
            />
          </div>
        )}
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
