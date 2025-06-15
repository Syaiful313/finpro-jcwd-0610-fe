"use client";

import PaginationSection from "@/components/PaginationSection";
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
  Filter,
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
    actions: "w-20 sm:w-32 text-center",
  };
  return `${baseClass} ${styles[columnId] || "text-xs sm:text-sm"}`;
};

const RoleBadge = ({ role }: { role: string }) => {
  const getRoleBadgeStyle = (role: string) => {
    const styles = {
      CUSTOMER: "bg-blue-100 text-blue-700",
      WORKER: "bg-blue-200 text-blue-800",
      ADMIN: "bg-blue-300 text-blue-900",
      DRIVER: "bg-blue-200 text-blue-800",
      OUTLET_ADMIN: "bg-blue-300 text-blue-900",
    };
    return styles[role as keyof typeof styles] || styles.CUSTOMER;
  };

  const config = ROLE_CONFIG[role as keyof typeof ROLE_CONFIG] || {
    label: role,
  };

  return (
    <span
      className={`inline-block rounded px-1.5 py-0.5 text-xs font-semibold ${getRoleBadgeStyle(role)}`}
    >
      {config.label}
    </span>
  );
};

const StatusBadge = ({ isVerified }: { isVerified: boolean }) => (
  <div
    className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
      isVerified
        ? "bg-green-100 text-green-700"
        : "bg-yellow-100 text-yellow-700"
    }`}
  >
    <div
      className={`h-2 w-2 rounded-full ${
        isVerified ? "bg-green-500" : "bg-yellow-500"
      }`}
    />
    {isVerified ? "Verified" : "Unverified"}
  </div>
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
}) => {
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase();
  };

  const getRoleColors = (role: string) => {
    const roleColors = {
      CUSTOMER: { avatar: "bg-gradient-to-br from-blue-500 to-blue-600" },
      WORKER: { avatar: "bg-gradient-to-br from-blue-600 to-blue-700" },
      ADMIN: { avatar: "bg-gradient-to-br from-blue-800 to-blue-900" },
      DRIVER: { avatar: "bg-gradient-to-br from-blue-700 to-blue-800" },
      OUTLET_ADMIN: { avatar: "bg-gradient-to-br from-blue-800 to-blue-900" },
    };
    return roleColors[role as keyof typeof roleColors] || roleColors.CUSTOMER;
  };

  const roleColors = getRoleColors(user.role);

  return (
    <div className="overflow-hidden rounded-2xl border-l-4 border-blue-400 bg-white shadow-md transition-all duration-300 hover:shadow-lg">
      {/* Header */}
      <div className="border-b border-slate-200 bg-slate-50 p-3.5">
        <div className="flex items-center gap-2.5">
          <div
            className={`h-9 w-9 ${roleColors.avatar} flex flex-shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white`}
          >
            {getInitials(user.firstName, user.lastName)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="mb-0.5 overflow-hidden text-sm font-semibold text-ellipsis whitespace-nowrap text-slate-900">
              {user.firstName} {user.lastName}
            </div>
            <div className="flex items-center gap-1.5">
              <RoleBadge role={user.role} />
              <span className="flex items-center gap-1 text-xs font-semibold text-green-600">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
                {user.isVerified ? "Verified" : "Unverified"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-3.5">
        {/* Contact list */}
        <div className="mb-3 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <Mail className="h-3.5 w-3.5 flex-shrink-0 text-blue-500" />
            <span className="truncate">{user.email}</span>
          </div>
          {user.phoneNumber && (
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <Phone className="h-3.5 w-3.5 flex-shrink-0 text-blue-500" />
              <span>{user.phoneNumber}</span>
            </div>
          )}
          {isOutletAdmin && user.employeeInfo && (
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <svg
                className="h-3.5 w-3.5 flex-shrink-0 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span>NPWP: {user.employeeInfo.npwp}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        {isAdmin && (
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(user)}
              className="flex-1 rounded-lg border border-slate-300 bg-white px-3.5 py-1.5 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-50"
            >
              Edit
            </button>
            <button
              onClick={() =>
                onDelete(user.id, `${user.firstName} ${user.lastName}`)
              }
              disabled={isDeleting}
              className="flex-1 rounded-lg border border-slate-300 bg-white px-3.5 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

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
      <div className="space-y-3 sm:space-y-6 sm:px-4 lg:px-0">
        {/* Mobile Header */}
        <div className="block sm:hidden">
          <div className="rounded-b-3xl bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg">
            {/* Header content */}
            <div className="px-4 py-14">
              <h1 className="text-2xl font-bold">User Management</h1>
              <p className="mt-2 opacity-90">
                {isAdmin
                  ? "Kelola pengguna aplikasi dan permission mereka"
                  : "Lihat pengguna di outlet Anda"}
              </p>
            </div>
          </div>

          {/* Search and filter section - overlapping white card */}
          <div className="relative mx-6 -mt-8 rounded-2xl border border-gray-100 bg-white p-4 shadow-lg">
            {/* Search input */}
            <div className="relative mb-2">
              <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Cari berdasarkan nama atau email..."
                value={filters.search}
                onChange={(e) => updateFilters({ search: e.target.value })}
                className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 py-3.5 pr-4 pl-10 text-sm transition-all focus:border-blue-500 focus:bg-white focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Filter and Add buttons */}
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl border-2 border-gray-200 bg-blue-500 px-4 text-sm text-white transition-colors hover:bg-blue-600">
                    <Filter className="h-4 w-4" />
                    <span>
                      {filters.role
                        ? availableRoles[
                            filters.role as keyof typeof availableRoles
                          ]?.label
                        : "Semua Role"}
                    </span>
                  </button>
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

              {isAdmin && (
                <button
                  onClick={handleCreateUser}
                  className="flex h-12 items-center justify-center gap-2 rounded-xl bg-blue-500 px-6 text-sm font-semibold text-white transition-colors hover:bg-blue-600"
                >
                  <UserPlus className="h-4 w-4" />
                  Tambah
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden sm:block">
          <div className="rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white shadow-lg">
            <h1 className="text-2xl font-bold">User Management</h1>
            <p className="mt-2 opacity-90">
              {isAdmin
                ? "Kelola pengguna aplikasi dan permission mereka"
                : "Lihat pengguna di outlet Anda"}
            </p>
          </div>
        </div>

        {/* Desktop Search & Filter Section */}
        <div className="mx-1 hidden rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:mx-0 sm:block sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-md lg:flex-1">
              <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Cari berdasarkan nama atau email..."
                value={filters.search}
                onChange={(e) => updateFilters({ search: e.target.value })}
                className="rounded-xl border-gray-200 pl-12 text-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:flex-shrink-0">
              {isAdmin && (
                <Button
                  onClick={handleCreateUser}
                  className="flex h-10 items-center justify-center gap-2 rounded-xl bg-blue-500 text-sm hover:bg-blue-700"
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
                    className="h-10 min-w-0 rounded-xl border-gray-200 text-sm lg:min-w-[140px]"
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
                className="h-10 rounded-xl border-gray-200 text-sm"
              >
                Reset
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="block sm:hidden">
          {isLoading ? (
            <div className="flex h-32 items-center justify-center">
              <Loader2 className="mr-2 h-6 w-6 animate-spin" />
              <span className="text-sm">Memuat data user...</span>
            </div>
          ) : error ? (
            <div className="mx-3 p-4 text-center text-red-500">
              <div className="text-sm">Kesalahan memuat data</div>
              <div className="mt-1 text-xs text-red-400">
                {error.message || "Kesalahan tidak diketahui"}
              </div>
            </div>
          ) : usersData?.data?.length ? (
            <div className="space-y-2 px-3 pt-2">
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
            <div className="mx-5 mt-4 rounded-2xl border border-gray-200 bg-white p-6 text-center">
              <span className="mb-4 block text-sm text-gray-500">
                {isOutletAdmin
                  ? "Tidak ada driver atau worker ditemukan di outlet Anda"
                  : "Tidak ada data pengguna ditemukan"}
              </span>
              {isAdmin && !filters.search && !filters.role && (
                <Button
                  onClick={handleCreateUser}
                  variant="outline"
                  className="mx-auto flex items-center gap-2 rounded-xl"
                  size="sm"
                >
                  <UserPlus className="h-4 w-4" />
                  Tambah User Pertama
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Desktop Table View */}
        <div className="mx-1 hidden rounded-2xl border border-gray-200 shadow-sm sm:mx-0 sm:block">
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
                      colSpan={isAdmin ? 6 : 5}
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
                      colSpan={isAdmin ? 6 : 5}
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
                      colSpan={isAdmin ? 6 : 5}
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
                            className="flex items-center gap-2 rounded-xl"
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

        {/* Desktop Pagination */}
        {usersData?.meta && (
          <div className="mx-1 hidden justify-center rounded-2xl border-t bg-white p-4 sm:mx-0 sm:flex">
            <PaginationSection
              page={usersData.meta.page}
              take={usersData.meta.take}
              total={usersData.meta.total}
              hasNext={
                usersData.meta.page * usersData.meta.take < usersData.meta.total
              }
              hasPrevious={usersData.meta.page > 1}
              onChangePage={(newPage) => updateFilters({ page: newPage })}
            />
          </div>
        )}

        {/* Mobile Pagination */}
        {usersData?.meta && (
          <div className="flex justify-center rounded-2xl border-t bg-white p-3 sm:hidden">
            <PaginationSection
              page={usersData.meta.page}
              take={usersData.meta.take}
              total={usersData.meta.total}
              hasNext={
                usersData.meta.page * usersData.meta.take < usersData.meta.total
              }
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
