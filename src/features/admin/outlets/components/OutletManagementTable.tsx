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
import useDeleteOutlet from "@/hooks/api/outlet/useDeleteOutlet";
import useGetOutlets, {
  Outlet as ApiOutlet,
} from "@/hooks/api/outlet/useGetOutlets";
import { useQueryClient } from "@tanstack/react-query";
import {
  ChevronDownIcon,
  Edit,
  Filter,
  FilterIcon,
  Loader2,
  MapPin,
  MapPinPlus,
  Package,
  Plus,
  Search,
  Trash2,
  Users,
} from "lucide-react";
import { useSession } from "next-auth/react";
import {
  parseAsBoolean,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
  useQueryStates,
} from "nuqs";
import { useEffect, useState } from "react";
import CreateOutletModal from "./CreateOutletModal";
import DeleteOutletAlert from "./DeleteOutletAlert";
import EditOutletModal from "./EditOutletModal";

const PAGE_SIZE = 10;
const DEBOUNCE_DELAY = 300;

const getCellClass = (columnId: string) => {
  const baseClass = "py-2 px-2 sm:py-3 sm:px-4";
  const styles: Record<string, string> = {
    index: "w-12 sm:w-16 text-center text-xs sm:text-sm",
    name: "min-w-[150px] sm:min-w-[200px] text-xs sm:text-sm font-medium",
    address:
      "min-w-[200px] sm:min-w-[250px] text-xs sm:text-sm hidden md:table-cell",
    location:
      "min-w-[140px] sm:min-w-[160px] text-xs sm:text-sm hidden lg:table-cell",
    radius: "w-20 sm:w-28 text-center text-xs sm:text-sm hidden sm:table-cell",
    status: "w-20 sm:w-24 text-center",
    stats: "w-24 sm:w-32 text-center text-xs sm:text-sm hidden md:table-cell",
    actions: "w-20 sm:w-32 text-center",
  };
  return `${baseClass} ${styles[columnId] || "text-xs sm:text-sm"}`;
};

const StatusBadge = ({ isActive }: { isActive: boolean }) => (
  <div
    className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
      isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
    }`}
  >
    <div
      className={`h-2 w-2 rounded-full ${
        isActive ? "bg-green-500" : "bg-red-500"
      }`}
    />
    {isActive ? "Active" : "Inactive"}
  </div>
);

const LocationInfo = ({
  latitude,
  longitude,
}: {
  latitude: number;
  longitude: number;
}) => (
  <div className="flex items-center text-xs text-gray-600">
    <MapPin className="mr-1 h-3 w-3" />
    <span>
      {latitude.toFixed(4)}, {longitude.toFixed(4)}
    </span>
  </div>
);

const StatsInfo = ({
  employeeCount,
  orderCount,
}: {
  employeeCount: number;
  orderCount: number;
}) => (
  <div className="flex flex-col gap-1">
    <div className="flex items-center justify-center text-xs text-blue-600">
      <Users className="mr-1 h-3 w-3" />
      {employeeCount} Staff
    </div>
    <div className="flex items-center justify-center text-xs text-green-600">
      <Package className="mr-1 h-3 w-3" />
      {orderCount} Orders
    </div>
  </div>
);

const OutletCard = ({
  outlet,
  index,
  onEdit,
  onDelete,
}: {
  outlet: ApiOutlet;
  index: number;
  onEdit: (outlet: ApiOutlet) => void;
  onDelete: (outlet: ApiOutlet) => void;
}) => {
  // Generate initials from outlet name
  const getInitials = (outletName: string) => {
    return outletName
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Color mapping for status
  const getStatusColors = (isActive: boolean) => {
    return isActive
      ? { avatar: "bg-gradient-to-br from-green-500 to-green-600" }
      : { avatar: "bg-gradient-to-br from-red-500 to-red-600" };
  };

  const statusColors = getStatusColors(outlet.isActive);

  return (
    <div className="overflow-hidden rounded-2xl border-l-4 border-blue-500 bg-white shadow-md transition-all duration-300 hover:shadow-lg">
      {/* Header */}
      <div className="border-b border-slate-200 bg-slate-50 p-3.5">
        <div className="flex items-center gap-2.5">
          <div
            className={`h-9 w-9 ${statusColors.avatar} flex flex-shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white`}
          >
            {getInitials(outlet.outletName)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="mb-0.5 overflow-hidden text-sm font-semibold text-ellipsis whitespace-nowrap text-slate-900">
              {outlet.outletName}
            </div>
            <div className="flex items-center gap-1.5">
              <StatusBadge isActive={outlet.isActive} />
              <span className="text-xs font-semibold text-blue-600">
                {outlet.serviceRadius} km radius
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-3.5">
        {/* Address */}
        <div className="mb-3">
          <div className="mb-1 text-xs font-medium tracking-wide text-gray-500 uppercase">
            Alamat
          </div>
          <div className="text-sm leading-relaxed text-slate-700">
            {outlet.address}
          </div>
        </div>

        {/* Location & Stats */}
        <div className="mb-3 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-blue-500" />
            <span>
              {outlet.latitude.toFixed(3)}, {outlet.longitude.toFixed(3)}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-blue-600">
              <Users className="h-3.5 w-3.5 flex-shrink-0" />
              <span>{outlet._count.employees} Staff</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-green-600">
              <Package className="h-3.5 w-3.5 flex-shrink-0" />
              <span>{outlet._count.orders} Orders</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(outlet)}
            className="flex-1 rounded-lg border border-slate-300 bg-white px-3.5 py-1.5 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-50"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(outlet)}
            className="flex-1 rounded-lg border border-slate-300 bg-white px-3.5 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const OutletRow = ({
  outlet,
  index,
  onEdit,
  onDelete,
}: {
  outlet: ApiOutlet;
  index: number;
  onEdit: (outlet: ApiOutlet) => void;
  onDelete: (outlet: ApiOutlet) => void;
}) => (
  <TableRow className="border-b hover:bg-gray-50">
    <TableCell className={getCellClass("index")}>{index}</TableCell>

    <TableCell className={getCellClass("name")}>
      <div className="flex flex-col">
        <div className="font-medium break-words text-gray-900">
          {outlet.outletName}
        </div>
        <div className="mt-1 text-xs break-words text-gray-500 md:hidden">
          {outlet.address}
        </div>
      </div>
    </TableCell>

    <TableCell className={getCellClass("address")}>
      <div className="text-sm break-words text-gray-700">{outlet.address}</div>
    </TableCell>

    <TableCell className={getCellClass("location")}>
      <LocationInfo latitude={outlet.latitude} longitude={outlet.longitude} />
    </TableCell>

    <TableCell className={getCellClass("radius")}>
      <div className="text-center">
        <span className="text-sm font-medium">{outlet.serviceRadius}</span>
        <span className="ml-1 text-xs text-gray-500">km</span>
      </div>
    </TableCell>

    <TableCell className={getCellClass("status")}>
      <div className="flex justify-center">
        <StatusBadge isActive={outlet.isActive} />
      </div>
    </TableCell>

    <TableCell className={getCellClass("stats")}>
      <StatsInfo
        employeeCount={outlet._count.employees}
        orderCount={outlet._count.orders}
      />
    </TableCell>

    <TableCell className={getCellClass("actions")}>
      <div className="flex justify-center gap-1">
        <Button
          size="sm"
          variant="outline"
          onClick={() => onEdit(outlet)}
          className="h-7 w-7 p-0 sm:h-8 sm:w-8"
          title="Edit Outlet"
        >
          <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onDelete(outlet)}
          className="h-7 w-7 p-0 text-red-600 hover:bg-red-50 hover:text-red-700 sm:h-8 sm:w-8"
          title="Hapus Outlet"
        >
          <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
      </div>
    </TableCell>
  </TableRow>
);

export function OutletManagementTable() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const deleteOutletMutation = useDeleteOutlet();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedOutlet, setSelectedOutlet] = useState<ApiOutlet | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [outletToDelete, setOutletToDelete] = useState<{
    id: number;
    outletName: string;
  } | null>(null);

  const [filters, setFilters] = useQueryStates({
    page: parseAsInteger.withDefault(1),
    search: parseAsString.withDefault(""),
    isActive: parseAsBoolean,
    sortBy: parseAsString.withDefault("outletName"),
    sortOrder: parseAsStringEnum(["asc", "desc"]).withDefault("asc"),
  });

  const [debouncedSearch, setDebouncedSearch] = useState(filters.search);

  const isAdmin = session?.user?.role === "ADMIN";

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
    data: outletsData,
    isLoading,
    error,
  } = useGetOutlets(
    {
      page: filters.page,
      take: PAGE_SIZE,
      search: debouncedSearch,
      isActive: filters.isActive ?? undefined,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
    },
    {
      enabled: !!session && isAdmin,
    },
  );

  const updateFilters = (updates: Partial<typeof filters>) => {
    setFilters(updates);
  };

  const handleCreateOutletClose = () => {
    setIsCreateModalOpen(false);
  };

  const handleEditOutlet = (outlet: ApiOutlet) => {
    setSelectedOutlet(outlet);
    setIsEditModalOpen(true);
  };

  const handleEditOutletClose = () => {
    setIsEditModalOpen(false);
    setSelectedOutlet(null);
  };

  const handleEditSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["outlets"] });
  };

  const handleDeleteOutlet = (outlet: ApiOutlet) => {
    setOutletToDelete({
      id: outlet.id,
      outletName: outlet.outletName,
    });
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (outletToDelete) {
      deleteOutletMutation.mutate(outletToDelete.id, {
        onSuccess: () => {
          setIsDeleteModalOpen(false);
          setOutletToDelete(null);
          queryClient.invalidateQueries({ queryKey: ["outlets"] });
        },
      });
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setOutletToDelete(null);
  };

  if (!session) {
    return (
      <div className="flex h-64 items-center justify-center px-1">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2 text-sm sm:text-base">Loading session...</span>
      </div>
    );
  }

  if (!isAdmin) {
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
            <div className="px-5 py-14">
              <h1 className="text-2xl font-bold">Outlet Management</h1>
              <p className="mt-2 opacity-90">
                Lihat dan kelola outlet dalam sistem
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
                placeholder="Cari berdasarkan nama outlet atau alamat..."
                value={filters.search}
                onChange={(e) => updateFilters({ search: e.target.value })}
                className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 py-3.5 pr-4 pl-10 text-sm transition-all focus:border-blue-500 focus:bg-white focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Filter and Add buttons */}
            <div className="flex gap-1">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl border-2 border-gray-200 bg-blue-500 px-4 text-sm text-white transition-colors hover:bg-blue-600">
                    <Filter className="h-4 w-4" />
                    <span className="whitespace-nowrap">
                      {filters.isActive == null
                        ? "Semua Status"
                        : filters.isActive
                          ? "Active"
                          : "Inactive"}
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem
                    onClick={() => updateFilters({ isActive: null })}
                  >
                    Semua Status
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => updateFilters({ isActive: true })}
                  >
                    Active Only
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => updateFilters({ isActive: false })}
                  >
                    Inactive Only
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                onClick={() => setIsCreateModalOpen(true)}
                className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-blue-500 px-4 text-sm font-semibold transition-colors hover:bg-blue-600"
              >
                <MapPinPlus className="h-4 w-4" />
                Tambah
              </Button>
            </div>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden sm:block">
          <div className="rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white shadow-lg">
            <h1 className="text-2xl font-bold">Outlet Management</h1>
            <p className="mt-2 opacity-90">
              Lihat dan kelola outlet dalam sistem
            </p>
          </div>
        </div>

        {/* Desktop Search & Filter Section */}
        <div className="mx-1 hidden rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:mx-0 sm:block sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-md lg:flex-1">
              <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Cari berdasarkan nama outlet atau alamat..."
                value={filters.search}
                onChange={(e) => updateFilters({ search: e.target.value })}
                className="rounded-xl border-gray-200 pl-12 text-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:flex-shrink-0">
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                className="flex h-10 items-center justify-center gap-2 rounded-xl bg-blue-500 text-sm hover:bg-blue-600"
              >
                <MapPinPlus className="h-4 w-4" />
                <span className="xs:inline hidden">Tambah Outlet</span>
                <span className="xs:hidden">Tambah</span>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-10 min-w-0 rounded-xl border-gray-200 text-sm lg:min-w-[140px]"
                  >
                    <FilterIcon className="mr-2 h-4 w-4 flex-shrink-0" />
                    <span className="truncate text-xs sm:text-sm">
                      {filters.isActive == null
                        ? "Semua Status"
                        : filters.isActive
                          ? "Active"
                          : "Inactive"}
                    </span>
                    <ChevronDownIcon className="ml-2 h-4 w-4 flex-shrink-0" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem
                    onClick={() => updateFilters({ isActive: null })}
                  >
                    Semua Status
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => updateFilters({ isActive: true })}
                  >
                    Active Only
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => updateFilters({ isActive: false })}
                  >
                    Inactive Only
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="outline"
                onClick={() =>
                  updateFilters({
                    search: "",
                    isActive: null,
                    page: 1,
                  })
                }
                disabled={!filters.search && filters.isActive === null}
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
              <span className="text-sm">Memuat data outlet...</span>
            </div>
          ) : error ? (
            <div className="mx-3 p-4 text-center text-red-500">
              <div className="text-sm">Kesalahan memuat data outlet</div>
              <div className="mt-1 text-xs text-red-400">
                {error.message || "Kesalahan tidak diketahui"}
              </div>
            </div>
          ) : outletsData?.data?.length ? (
            <div className="space-y-2 px-3 pt-2">
              {outletsData.data.map((outlet, index) => (
                <OutletCard
                  key={outlet.id}
                  outlet={outlet}
                  index={(filters.page - 1) * PAGE_SIZE + index + 1}
                  onEdit={handleEditOutlet}
                  onDelete={handleDeleteOutlet}
                />
              ))}
            </div>
          ) : (
            <div className="mx-5 mt-4 rounded-2xl border border-gray-200 bg-white p-6 text-center">
              <span className="mb-4 block text-sm text-gray-500">
                {filters.search
                  ? `Tidak ada outlet ditemukan untuk "${filters.search}"`
                  : "Belum ada outlet yang terdaftar"}
              </span>
              {!filters.search && (
                <Button
                  onClick={() => setIsCreateModalOpen(true)}
                  variant="outline"
                  className="mx-auto flex items-center gap-2 rounded-xl"
                  size="sm"
                >
                  <Plus className="h-4 w-4" />
                  Tambah Outlet Pertama
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
                    Nama Outlet
                  </TableHead>
                  <TableHead className="hidden min-w-[200px] text-xs sm:min-w-[250px] sm:text-sm md:table-cell">
                    Alamat
                  </TableHead>
                  <TableHead className="hidden min-w-[140px] text-xs sm:min-w-[160px] sm:text-sm lg:table-cell">
                    Lokasi
                  </TableHead>
                  <TableHead className="hidden w-20 text-center text-xs sm:table-cell sm:w-28 sm:text-sm">
                    Radius
                  </TableHead>
                  <TableHead className="w-20 text-center text-xs sm:w-24 sm:text-sm">
                    Status
                  </TableHead>
                  <TableHead className="hidden w-24 text-center text-xs sm:w-32 sm:text-sm md:table-cell">
                    Statistik
                  </TableHead>
                  <TableHead className="w-20 text-center text-xs sm:w-32 sm:text-sm">
                    Aksi
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-32 text-center">
                      <div className="flex items-center justify-center">
                        <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                        <span className="text-sm">Memuat data outlet...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="h-32 text-center text-red-500"
                    >
                      <div>
                        <div className="text-sm">
                          Kesalahan memuat data outlet
                        </div>
                        <div className="mt-1 text-xs text-red-400">
                          {error.message || "Kesalahan tidak diketahui"}
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : outletsData?.data?.length ? (
                  outletsData.data.map((outlet, index) => (
                    <OutletRow
                      key={outlet.id}
                      outlet={outlet}
                      index={(filters.page - 1) * PAGE_SIZE + index + 1}
                      onEdit={handleEditOutlet}
                      onDelete={handleDeleteOutlet}
                    />
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="h-32 text-center">
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <span className="text-sm text-gray-500">
                          {filters.search
                            ? `Tidak ada outlet ditemukan untuk "${filters.search}"`
                            : "Belum ada outlet yang terdaftar"}
                        </span>
                        {!filters.search && (
                          <Button
                            onClick={() => setIsCreateModalOpen(true)}
                            variant="outline"
                            className="flex items-center gap-2 rounded-xl"
                            size="sm"
                          >
                            <Plus className="h-4 w-4" />
                            Tambah Outlet Pertama
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
        {outletsData?.meta && (
          <div className="mx-1 hidden justify-center rounded-2xl border-t px-4 py-6 sm:mx-0 sm:flex">
            <PaginationSection
              page={outletsData.meta.page}
              take={outletsData.meta.take}
              total={outletsData.meta.total}
              hasNext={
                outletsData.meta.page * outletsData.meta.take <
                outletsData.meta.total
              }
              hasPrevious={outletsData.meta.page > 1}
              onChangePage={(newPage) => updateFilters({ page: newPage })}
            />
          </div>
        )}

        {/* Mobile Pagination */}
        {outletsData?.meta && (
          <div className="flex justify-center rounded-2xl border-t p-3 sm:hidden">
            <PaginationSection
              page={outletsData.meta.page}
              take={outletsData.meta.take}
              total={outletsData.meta.total}
              hasNext={
                outletsData.meta.page * outletsData.meta.take <
                outletsData.meta.total
              }
              hasPrevious={outletsData.meta.page > 1}
              onChangePage={(newPage) => updateFilters({ page: newPage })}
            />
          </div>
        )}
      </div>

      <CreateOutletModal
        open={isCreateModalOpen}
        onClose={handleCreateOutletClose}
      />

      {selectedOutlet && (
        <EditOutletModal
          open={isEditModalOpen}
          outlet={selectedOutlet}
          onClose={handleEditOutletClose}
          onSuccess={handleEditSuccess}
        />
      )}

      <DeleteOutletAlert
        open={isDeleteModalOpen}
        onOpenChange={handleDeleteCancel}
        outletToDelete={outletToDelete}
        onConfirm={handleDeleteConfirm}
        isDeleting={deleteOutletMutation.isPending}
      />
    </>
  );
}
