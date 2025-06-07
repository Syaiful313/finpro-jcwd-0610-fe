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
import useDeleteOutlet from "@/hooks/api/outlet/useDeleteOutlet";
import useGetOutlets, {
  Outlet as ApiOutlet,
} from "@/hooks/api/outlet/useGetOutlets";
import { useQueryClient } from "@tanstack/react-query";
import {
  ChevronDownIcon,
  Edit,
  FilterIcon,
  Loader2,
  MapPin,
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
  <Badge
    variant="outline"
    className={`px-1.5 py-0.5 text-xs font-medium sm:px-2 sm:py-1 ${
      isActive
        ? "border-green-200 bg-green-50 text-green-700"
        : "border-red-200 bg-red-50 text-red-700"
    }`}
  >
    {isActive ? "Active" : "Inactive"}
  </Badge>
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
}) => (
  <div className="rounded-lg border bg-white p-2.5 shadow-sm">
    <div className="mb-2 flex items-start justify-between">
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center gap-2">
          <span className="text-xs text-gray-500">{index} .</span>
          <StatusBadge isActive={outlet.isActive} />
        </div>
        <h3 className="truncate pr-1 text-sm font-medium text-gray-900">
          {outlet.outletName}
        </h3>
      </div>
      <div className="flex flex-shrink-0 gap-1">
        <Button
          size="sm"
          variant="outline"
          onClick={() => onEdit(outlet)}
          className="h-7 w-7 p-0"
          title="Edit Outlet"
        >
          <Edit className="h-3 w-3" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onDelete(outlet)}
          className="h-7 w-7 p-0 text-red-600 hover:bg-red-50 hover:text-red-700"
          title="Hapus Outlet"
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    </div>

    <div className="space-y-1.5 text-xs text-gray-600">
      <div>
        <span className="font-medium text-gray-800">Alamat:</span>
        <div className="mt-0.5 leading-relaxed text-gray-600">
          {outlet.address}
        </div>
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 flex-1 items-center">
          <MapPin className="mr-1 h-3 w-3 flex-shrink-0" />
          <span className="truncate text-xs">
            {outlet.latitude.toFixed(3)}, {outlet.longitude.toFixed(3)}
          </span>
        </div>
        <div className="flex-shrink-0 text-right">
          <span className="font-medium text-gray-800">
            {outlet.serviceRadius} km
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 pt-1">
        <div className="flex flex-1 items-center text-blue-600">
          <Users className="mr-1 h-3 w-3" />
          <span>{outlet._count.employees} Staff</span>
        </div>
        <div className="flex flex-1 items-center justify-end text-green-600">
          <Package className="mr-1 h-3 w-3" />
          <span>{outlet._count.orders} Orders</span>
        </div>
      </div>
    </div>
  </div>
);

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
    <div className="space-y-3 px-1 sm:space-y-6 sm:px-4 lg:px-0">
      <div className="px-1 sm:px-0">
        <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
          Outlet Management
        </h1>
        <p className="text-sm text-gray-600 sm:text-base">
          Lihat dan kelola outlet dalam sistem
        </p>
      </div>

      <div className="mx-1 flex flex-col gap-3 rounded-lg border p-2 shadow-sm sm:mx-0 sm:gap-4 sm:p-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-md lg:flex-1">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Cari berdasarkan nama outlet atau alamat..."
            value={filters.search}
            onChange={(e) => updateFilters({ search: e.target.value })}
            className="pl-10 text-sm"
          />
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:gap-3 lg:flex-shrink-0">
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex h-9 items-center justify-center gap-2 text-sm sm:h-10"
          >
            <Plus className="h-4 w-4" />
            <span className="xs:inline hidden">Tambah Outlet</span>
            <span className="xs:hidden">Tambah</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="h-9 min-w-0 text-sm sm:h-10 lg:min-w-[140px]"
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
            <span className="text-sm">Memuat data outlet...</span>
          </div>
        ) : error ? (
          <div className="p-4 text-center text-red-500">
            <div className="text-sm">Kesalahan memuat data outlet</div>
            <div className="mt-1 text-xs text-red-400">
              {error.message || "Kesalahan tidak diketahui"}
            </div>
          </div>
        ) : outletsData?.data?.length ? (
          <div className="space-y-2">
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
          <div className="p-3 text-center">
            <span className="mb-3 block text-sm text-gray-500">
              {filters.search
                ? `Tidak ada outlet ditemukan untuk "${filters.search}"`
                : "Belum ada outlet yang terdaftar"}
            </span>
            {!filters.search && (
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                variant="outline"
                className="mx-auto flex items-center gap-2"
                size="sm"
              >
                <Plus className="h-4 w-4" />
                Tambah Outlet Pertama
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
                          className="flex items-center gap-2"
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

      {outletsData?.meta && (
        <div className="mx-1 rounded-b-lg border-t bg-white px-2 py-2 sm:mx-0 sm:px-4 sm:py-3">
          <PaginationSection
            page={outletsData.meta.page}
            take={outletsData.meta.take}
            total={outletsData.meta.total}
            hasNext={outletsData.meta.page * outletsData.meta.take < outletsData.meta.total}
            hasPrevious={outletsData.meta.page > 1}
            onChangePage={(newPage) => updateFilters({ page: newPage })}
          />
        </div>
      )}

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
    </div>
  );
}
