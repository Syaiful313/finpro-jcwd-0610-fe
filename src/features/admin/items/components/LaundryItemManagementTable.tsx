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
import useDeleteLaundryItem from "@/hooks/api/laundry-item/useDeleteLaundryItem";
import useGetLaundryItems, {
  LaundryItem as ApiLaundryItem,
} from "@/hooks/api/laundry-item/useGetLaundryItems";
import {
  ChevronDownIcon,
  Edit,
  FilterIcon,
  Loader2,
  Package,
  Plus,
  Search,
  ShirtIcon,
  Tag,
  Trash2,
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
import CreateLaundryItemModal from "./CreateLaundryItemModal";
import DeleteLaundryItemAlert from "./DeleteLaundryItemAlert";
import EditLaundryItemModal from "./EditLaundryItemModal";

const PAGE_SIZE = 10;
const DEBOUNCE_DELAY = 300;

const getCellClass = (columnId: string) => {
  const baseClass = "py-2 px-2 sm:py-3 sm:px-4";
  const styles: Record<string, string> = {
    index: "w-12 sm:w-16 text-center text-xs sm:text-sm",
    name: "min-w-[150px] sm:min-w-[200px] text-xs sm:text-sm font-medium",
    category:
      "min-w-[120px] sm:min-w-[150px] text-xs sm:text-sm hidden md:table-cell",
    price: "w-24 sm:w-32 text-center text-xs sm:text-sm",
    pricingType:
      "w-20 sm:w-28 text-center text-xs sm:text-sm hidden sm:table-cell",
    status: "w-20 sm:w-24 text-center",
    usage: "w-24 sm:w-32 text-center text-xs sm:text-sm hidden md:table-cell",
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

const PricingTypeBadge = ({
  pricingType,
}: {
  pricingType: "PER_PIECE" | "PER_KG";
}) => (
  <Badge
    variant="outline"
    className={`px-1.5 py-0.5 text-xs font-medium sm:px-2 sm:py-1 ${
      pricingType === "PER_PIECE"
        ? "border-blue-200 bg-blue-50 text-blue-700"
        : "border-purple-200 bg-purple-50 text-purple-700"
    }`}
  >
    {pricingType === "PER_PIECE" ? "Per Piece" : "Per Kg"}
  </Badge>
);

const PriceInfo = ({
  basePrice,
  pricingType,
}: {
  basePrice: number;
  pricingType: "PER_PIECE" | "PER_KG";
}) => (
  <div className="text-center">
    {pricingType === "PER_KG" ? (
      <div className="text-sm font-medium text-gray-400">-</div>
    ) : (
      <>
        <div className="text-sm font-medium text-gray-900">
          Rp {basePrice.toLocaleString("id-ID")}
        </div>
        <div className="text-xs text-gray-500">per pcs</div>
      </>
    )}
  </div>
);

const UsageInfo = ({ orderCount }: { orderCount: number }) => (
  <div className="flex items-center justify-center text-xs text-green-600">
    <Package className="mr-1 h-3 w-3" />
    {orderCount} Orders
  </div>
);

const LaundryItemCard = ({
  laundryItem,
  index,
  onEdit,
  onDelete,
}: {
  laundryItem: ApiLaundryItem;
  index: number;
  onEdit: (item: ApiLaundryItem) => void;
  onDelete: (item: ApiLaundryItem) => void;
}) => (
  <div className="rounded-lg border bg-white p-2.5 shadow-sm">
    <div className="mb-2 flex items-start justify-between">
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center gap-2">
          <span className="text-xs text-gray-500">{index} .</span>
          <StatusBadge isActive={laundryItem.isActive} />
        </div>
        <h3 className="truncate pr-1 text-sm font-medium text-gray-900">
          {laundryItem.name}
        </h3>
      </div>
      <div className="flex flex-shrink-0 gap-1">
        <Button
          size="sm"
          variant="outline"
          onClick={() => onEdit(laundryItem)}
          className="h-7 w-7 p-0"
          title="Edit Item"
        >
          <Edit className="h-3 w-3" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onDelete(laundryItem)}
          className="h-7 w-7 p-0 text-red-600 hover:bg-red-50 hover:text-red-700"
          title="Hapus Item"
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    </div>

    <div className="space-y-1.5 text-xs text-gray-600">
      <div className="flex items-center gap-2">
        <Tag className="h-3 w-3 flex-shrink-0" />
        <span className="font-medium text-gray-800">Kategori:</span>
        <span className="text-gray-600">{laundryItem.category}</span>
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center">
          <ShirtIcon className="mr-1 h-3 w-3 flex-shrink-0" />
          <PricingTypeBadge pricingType={laundryItem.pricingType} />
        </div>
        <div className="text-right">
          {laundryItem.pricingType === "PER_KG" ? (
            <div className="font-medium text-gray-400">-</div>
          ) : (
            <>
              <div className="font-medium text-gray-800">
                Rp {laundryItem.basePrice.toLocaleString("id-ID")}
              </div>
              <div className="text-xs text-gray-500">per pcs</div>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 pt-1">
        <div className="flex items-center text-green-600">
          <Package className="mr-1 h-3 w-3" />
          <span>{laundryItem._count.orderItems} Orders</span>
        </div>
      </div>
    </div>
  </div>
);

const LaundryItemRow = ({
  laundryItem,
  index,
  onEdit,
  onDelete,
}: {
  laundryItem: ApiLaundryItem;
  index: number;
  onEdit: (item: ApiLaundryItem) => void;
  onDelete: (item: ApiLaundryItem) => void;
}) => (
  <TableRow className="border-b hover:bg-gray-50">
    <TableCell className={getCellClass("index")}>{index}</TableCell>

    <TableCell className={getCellClass("name")}>
      <div className="flex flex-col">
        <div className="font-medium break-words text-gray-900">
          {laundryItem.name}
        </div>
        <div className="mt-1 text-xs break-words text-gray-500 md:hidden">
          {laundryItem.category}
        </div>
      </div>
    </TableCell>

    <TableCell className={getCellClass("category")}>
      <div className="text-sm break-words text-gray-700">
        {laundryItem.category}
      </div>
    </TableCell>

    <TableCell className={getCellClass("price")}>
      <PriceInfo
        basePrice={laundryItem.basePrice}
        pricingType={laundryItem.pricingType}
      />
    </TableCell>

    <TableCell className={getCellClass("pricingType")}>
      <div className="flex justify-center">
        <PricingTypeBadge pricingType={laundryItem.pricingType} />
      </div>
    </TableCell>

    <TableCell className={getCellClass("status")}>
      <div className="flex justify-center">
        <StatusBadge isActive={laundryItem.isActive} />
      </div>
    </TableCell>

    <TableCell className={getCellClass("usage")}>
      <UsageInfo orderCount={laundryItem._count.orderItems} />
    </TableCell>

    <TableCell className={getCellClass("actions")}>
      <div className="flex justify-center gap-1">
        <Button
          size="sm"
          variant="outline"
          onClick={() => onEdit(laundryItem)}
          className="h-7 w-7 p-0 sm:h-8 sm:w-8"
          title="Edit Item"
        >
          <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onDelete(laundryItem)}
          className="h-7 w-7 p-0 text-red-600 hover:bg-red-50 hover:text-red-700 sm:h-8 sm:w-8"
          title="Hapus Item"
        >
          <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
      </div>
    </TableCell>
  </TableRow>
);

export function LaundryItemManagementTable() {
  const { data: session } = useSession();

  const [filters, setFilters] = useQueryStates({
    page: parseAsInteger.withDefault(1),
    search: parseAsString.withDefault(""),
    isActive: parseAsBoolean,
    category: parseAsString,
    pricingType: parseAsString.withDefault(""),
    sortBy: parseAsString.withDefault("name"),
    sortOrder: parseAsStringEnum(["asc", "desc"]).withDefault("asc"),
  });

  const [debouncedSearch, setDebouncedSearch] = useState(filters.search);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedLaundryItem, setSelectedLaundryItem] =
    useState<ApiLaundryItem | null>(null);

  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [laundryItemToDelete, setLaundryItemToDelete] =
    useState<ApiLaundryItem | null>(null);

  const isAdmin = session?.user?.role === "ADMIN";

  const deleteItemMutation = useDeleteLaundryItem();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(filters.search);

      if (filters.page !== 1 && filters.search !== debouncedSearch) {
        setFilters({ page: 1 });
      }
    }, DEBOUNCE_DELAY);
    return () => clearTimeout(timer);
  }, [filters.search, filters.page, debouncedSearch, setFilters]);

  const getPricingTypeForAPI = (
    pricingType: string,
  ): "PER_PIECE" | "PER_KG" | undefined => {
    if (pricingType === "PER_PIECE" || pricingType === "PER_KG") {
      return pricingType;
    }
    return undefined;
  };

  const {
    data: laundryItemsData,
    isLoading,
    error,
    refetch,
  } = useGetLaundryItems(
    {
      page: filters.page,
      take: PAGE_SIZE,
      search: debouncedSearch,
      isActive: filters.isActive ?? undefined,
      category: filters.category ?? undefined,
      pricingType: getPricingTypeForAPI(filters.pricingType),
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

  const handleEditItem = (item: ApiLaundryItem) => {
    setSelectedLaundryItem(item);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedLaundryItem(null);
  };

  const handleEditSuccess = () => {
    refetch();
  };

  const handleDeleteItem = (item: ApiLaundryItem) => {
    setLaundryItemToDelete(item);
    setIsDeleteAlertOpen(true);
  };

  const handleCloseDeleteAlert = () => {
    setIsDeleteAlertOpen(false);
    setLaundryItemToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (laundryItemToDelete) {
      deleteItemMutation.mutate(laundryItemToDelete.id, {
        onSuccess: () => {
          handleCloseDeleteAlert();
          refetch();
        },
      });
    }
  };

  const getPricingTypeDisplayText = (pricingType: string) => {
    switch (pricingType) {
      case "PER_PIECE":
        return "Per Piece";
      case "PER_KG":
        return "Per Kg";
      default:
        return "Semua Tipe";
    }
  };

  const hasActiveFilters = () => {
    return (
      filters.search !== "" ||
      filters.isActive !== null ||
      (filters.category !== null && filters.category !== "") ||
      (filters.pricingType !== "" && filters.pricingType !== null)
    );
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
          Laundry Item Management
        </h1>
        <p className="text-sm text-gray-600 sm:text-base">
          Lihat dan kelola item laundry dalam sistem
        </p>
      </div>

      <div className="mx-1 flex flex-col gap-3 rounded-lg border p-2 shadow-sm sm:mx-0 sm:gap-4 sm:p-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-md lg:flex-1">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Cari berdasarkan nama item atau kategori..."
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
            <span className="xs:inline hidden">Tambah Item</span>
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

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="h-9 min-w-0 text-sm sm:h-10 lg:min-w-[140px]"
              >
                <Tag className="mr-2 h-4 w-4 flex-shrink-0" />
                <span className="truncate text-xs sm:text-sm">
                  {getPricingTypeDisplayText(filters.pricingType)}
                </span>
                <ChevronDownIcon className="ml-2 h-4 w-4 flex-shrink-0" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                onClick={() => updateFilters({ pricingType: "" })}
              >
                Semua Tipe
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => updateFilters({ pricingType: "PER_PIECE" })}
              >
                Per Piece
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => updateFilters({ pricingType: "PER_KG" })}
              >
                Per Kg
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="outline"
            onClick={() =>
              updateFilters({
                search: "",
                isActive: null,
                category: null,
                pricingType: "",
                page: 1,
              })
            }
            disabled={!hasActiveFilters()}
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
            <span className="text-sm">Memuat data item laundry...</span>
          </div>
        ) : error ? (
          <div className="p-4 text-center text-red-500">
            <div className="text-sm">Kesalahan memuat data item laundry</div>
            <div className="mt-1 text-xs text-red-400">
              {error.message || "Kesalahan tidak diketahui"}
            </div>
          </div>
        ) : laundryItemsData?.data?.length ? (
          <div className="space-y-2">
            {laundryItemsData.data.map((laundryItem, index) => (
              <LaundryItemCard
                key={laundryItem.id}
                laundryItem={laundryItem}
                index={(filters.page - 1) * PAGE_SIZE + index + 1}
                onEdit={handleEditItem}
                onDelete={handleDeleteItem}
              />
            ))}
          </div>
        ) : (
          <div className="p-3 text-center">
            <span className="mb-3 block text-sm text-gray-500">
              {filters.search
                ? `Tidak ada item laundry ditemukan untuk "${filters.search}"`
                : "Belum ada item laundry yang terdaftar"}
            </span>
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
                  Nama Item
                </TableHead>
                <TableHead className="hidden min-w-[120px] text-xs sm:min-w-[150px] sm:text-sm md:table-cell">
                  Kategori
                </TableHead>
                <TableHead className="w-24 text-center text-xs sm:w-32 sm:text-sm">
                  Harga
                </TableHead>
                <TableHead className="hidden w-20 text-center text-xs sm:table-cell sm:w-28 sm:text-sm">
                  Tipe
                </TableHead>
                <TableHead className="w-20 text-center text-xs sm:w-24 sm:text-sm">
                  Status
                </TableHead>
                <TableHead className="hidden w-24 text-center text-xs sm:w-32 sm:text-sm md:table-cell">
                  Penggunaan
                </TableHead>
                <TableHead className="w-16 text-center text-xs sm:w-20 sm:text-sm">
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
                      <span className="text-sm">
                        Memuat data item laundry...
                      </span>
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
                        Kesalahan memuat data item laundry
                      </div>
                      <div className="mt-1 text-xs text-red-400">
                        {error.message || "Kesalahan tidak diketahui"}
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : laundryItemsData?.data?.length ? (
                laundryItemsData.data.map((laundryItem, index) => (
                  <LaundryItemRow
                    key={laundryItem.id}
                    laundryItem={laundryItem}
                    index={(filters.page - 1) * PAGE_SIZE + index + 1}
                    onEdit={handleEditItem}
                    onDelete={handleDeleteItem}
                  />
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="h-32 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <span className="text-sm text-gray-500">
                        {filters.search
                          ? `Tidak ada item laundry ditemukan untuk "${filters.search}"`
                          : "Belum ada item laundry yang terdaftar"}
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {laundryItemsData?.meta && (
        <div className="mx-1 rounded-b-lg border-t bg-white px-2 py-2 sm:mx-0 sm:px-4 sm:py-3">
          <PaginationSection
            page={laundryItemsData.meta.page}
            take={laundryItemsData.meta.take}
            total={laundryItemsData.meta.total}
            hasNext={
              laundryItemsData.meta.page * laundryItemsData.meta.take <
              laundryItemsData.meta.total
            }
            hasPrevious={laundryItemsData.meta.page > 1}
            onChangePage={(newPage) => updateFilters({ page: newPage })}
          />
        </div>
      )}

      <CreateLaundryItemModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      {selectedLaundryItem && (
        <EditLaundryItemModal
          open={isEditModalOpen}
          laundryItem={selectedLaundryItem}
          onClose={handleCloseEditModal}
          onSuccess={handleEditSuccess}
        />
      )}

      <DeleteLaundryItemAlert
        open={isDeleteAlertOpen}
        onOpenChange={setIsDeleteAlertOpen}
        laundryItemToDelete={
          laundryItemToDelete
            ? {
                id: laundryItemToDelete.id,
                name: laundryItemToDelete.name,
                category: laundryItemToDelete.category,
              }
            : null
        }
        onConfirm={handleConfirmDelete}
        isDeleting={deleteItemMutation.isPending}
      />
    </div>
  );
}
