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
  Filter,
  Loader2,
  Package,
  PackagePlus,
  Plus,
  Search,
  Tag,
  Trash2,
  Weight,
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
  <div
    className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
      isActive
        ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
        : "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
    }`}
  >
    <div
      className={`h-2 w-2 rounded-full ${
        isActive
          ? "bg-green-500 dark:bg-green-400"
          : "bg-red-500 dark:bg-red-400"
      }`}
    />
    {isActive ? "Active" : "Inactive"}
  </div>
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
        ? "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
        : "border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-800 dark:bg-purple-900/20 dark:text-purple-400"
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
    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
      Rp {basePrice.toLocaleString("id-ID")}
    </div>
    <div className="text-xs text-gray-500 dark:text-gray-400">
      {pricingType === "PER_PIECE" ? "per pcs" : "per kg"}
    </div>
  </div>
);

const UsageInfo = ({ orderCount }: { orderCount: number }) => (
  <div className="flex items-center justify-center text-xs text-green-600 dark:text-green-400">
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
}) => {
  const getInitials = (itemName: string) => {
    return itemName
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getStatusColors = (isActive: boolean) => {
    return isActive
      ? {
          avatar:
            "bg-gradient-to-br from-green-500 to-green-600 dark:from-green-600 dark:to-green-700",
        }
      : {
          avatar:
            "bg-gradient-to-br from-red-500 to-red-600 dark:from-red-600 dark:to-red-700",
        };
  };

  const statusColors = getStatusColors(laundryItem.isActive);

  return (
    <div className="overflow-hidden rounded-2xl border-l-4 border-blue-500 bg-white shadow-md transition-all duration-300 hover:shadow-lg dark:border-blue-400 dark:bg-gray-800 dark:shadow-gray-900/50">
      <div className="border-b border-slate-200 bg-slate-50 p-3.5 dark:border-gray-700 dark:bg-gray-700/50">
        <div className="flex items-center gap-2.5">
          <div
            className={`h-9 w-9 ${statusColors.avatar} flex flex-shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white`}
          >
            {getInitials(laundryItem.name)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="mb-0.5 overflow-hidden text-sm font-semibold text-ellipsis whitespace-nowrap text-slate-900 dark:text-gray-100">
              {laundryItem.name}
            </div>
            <div className="flex items-center gap-1.5">
              <StatusBadge isActive={laundryItem.isActive} />
              <PricingTypeBadge pricingType={laundryItem.pricingType} />
            </div>
          </div>
        </div>
      </div>

      <div className="p-3.5">
        <div className="mb-3">
          <div className="mb-1 text-xs font-medium tracking-wide text-gray-500 uppercase dark:text-gray-400">
            Kategori
          </div>
          <div className="text-sm leading-relaxed text-slate-600 dark:text-gray-300">
            {laundryItem.category}
          </div>
        </div>

        <div className="mb-3 flex flex-col gap-2">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-gray-400">
              <Tag className="h-3.5 w-3.5 flex-shrink-0 text-blue-500 dark:text-blue-400" />
              <span>Harga:</span>
            </div>
            <div className="text-right">
              {/* UPDATED: Now shows price for both PER_PIECE and PER_KG */}
              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Rp {laundryItem.basePrice.toLocaleString("id-ID")}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {laundryItem.pricingType === "PER_PIECE" ? "per pcs" : "per kg"}
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 text-xs text-green-600 dark:text-green-400">
            <Package className="h-3.5 w-3.5 flex-shrink-0" />
            <span>{laundryItem._count.orderItems} Orders</span>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onEdit(laundryItem)}
            className="flex-1 rounded-lg border border-slate-300 bg-white px-3.5 py-1.5 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-50 dark:border-gray-600 dark:bg-gray-800 dark:text-blue-400 dark:hover:bg-blue-900/20"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(laundryItem)}
            className="flex-1 rounded-lg border border-slate-300 bg-white px-3.5 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-gray-600 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-red-900/20"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

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
  <TableRow className="border-b hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800/50">
    <TableCell className={getCellClass("index")}>{index}</TableCell>

    <TableCell className={getCellClass("name")}>
      <div className="flex flex-col">
        <div className="font-medium break-words text-gray-900 dark:text-gray-100">
          {laundryItem.name}
        </div>
        <div className="mt-1 text-xs break-words text-gray-500 md:hidden dark:text-gray-400">
          {laundryItem.category}
        </div>
      </div>
    </TableCell>

    <TableCell className={getCellClass("category")}>
      <div className="text-sm break-words text-gray-700 dark:text-gray-300">
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
          className="h-7 w-7 p-0 sm:h-8 sm:w-8 dark:border-gray-600 dark:hover:bg-gray-700"
          title="Edit Item"
        >
          <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onDelete(laundryItem)}
          className="h-7 w-7 p-0 text-red-600 hover:bg-red-50 hover:text-red-700 sm:h-8 sm:w-8 dark:border-gray-600 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-300"
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
        <span className="ml-2 text-sm sm:text-base dark:text-gray-300">
          Loading session...
        </span>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex h-64 items-center justify-center px-1">
        <div className="text-center">
          <span className="text-sm text-red-500 sm:text-base dark:text-red-400">
            Access Denied
          </span>
          <p className="mt-2 text-xs text-gray-500 sm:text-sm dark:text-gray-400">
            You don't have permission to view this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3 sm:space-y-6 sm:px-4 lg:px-0">
        <div className="block sm:hidden">
          <div className="rounded-b-3xl bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg dark:from-blue-600 dark:to-blue-700">
            <div className="px-5 py-14">
              <h1 className="text-2xl font-bold">Manajemen Barang Laundry</h1>
              <p className="mt-2 opacity-90">
                Lihat dan kelola item laundry dalam sistem
              </p>
            </div>
          </div>

          <div className="relative mx-6 -mt-8 rounded-2xl border border-gray-100 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-800 dark:shadow-gray-900/50">
            <div className="relative mb-2">
              <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Cari berdasarkan nama item atau kategori..."
                value={filters.search}
                onChange={(e) => updateFilters({ search: e.target.value })}
                className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 py-3.5 pr-4 pl-10 text-sm transition-all focus:border-blue-500 focus:bg-white focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:focus:border-blue-400 dark:focus:bg-gray-800 dark:focus:ring-blue-400"
              />
            </div>

            <div className="flex gap-1">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex h-12 flex-1 items-center justify-center gap-1.5 rounded-xl border-2 border-gray-200 bg-blue-500 px-3 text-sm text-white transition-colors hover:bg-blue-600 dark:border-gray-600 dark:bg-blue-600 dark:hover:bg-blue-700">
                    <Filter className="h-4 w-4" />
                    <span className="text-xs whitespace-nowrap">
                      {filters.isActive == null
                        ? "Status"
                        : filters.isActive
                          ? "Active"
                          : "Inactive"}
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-48 dark:border-gray-700 dark:bg-gray-800"
                >
                  <DropdownMenuItem
                    onClick={() => updateFilters({ isActive: null })}
                    className="dark:text-gray-100 dark:hover:bg-gray-700"
                  >
                    Semua Status
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => updateFilters({ isActive: true })}
                    className="dark:text-gray-100 dark:hover:bg-gray-700"
                  >
                    Active Only
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => updateFilters({ isActive: false })}
                    className="dark:text-gray-100 dark:hover:bg-gray-700"
                  >
                    Inactive Only
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex h-12 flex-1 items-center justify-center gap-1.5 rounded-xl border-2 border-gray-200 bg-blue-500 px-3 text-sm text-white transition-colors hover:bg-blue-600 dark:border-gray-600 dark:bg-blue-600 dark:hover:bg-blue-700">
                    <Weight className="h-4 w-4" />
                    <span className="text-xs whitespace-nowrap">
                      {filters.pricingType === ""
                        ? "Type"
                        : filters.pricingType === "PER_PIECE"
                          ? "Per Pcs"
                          : "Per Kg"}
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-48 dark:border-gray-700 dark:bg-gray-800"
                >
                  <DropdownMenuItem
                    onClick={() => updateFilters({ pricingType: "" })}
                    className="dark:text-gray-100 dark:hover:bg-gray-700"
                  >
                    Semua Tipe
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => updateFilters({ pricingType: "PER_PIECE" })}
                    className="dark:text-gray-100 dark:hover:bg-gray-700"
                  >
                    Per Piece
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => updateFilters({ pricingType: "PER_KG" })}
                    className="dark:text-gray-100 dark:hover:bg-gray-700"
                  >
                    Per Kg
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                onClick={() => setIsCreateModalOpen(true)}
                className="flex h-12 flex-1 items-center justify-center gap-1.5 rounded-xl bg-blue-500 px-3 text-sm font-semibold text-white transition-colors hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
              >
                <PackagePlus className="h-4 w-4" />
                <span className="text-xs">Tambah</span>
              </Button>
            </div>
          </div>
        </div>

        <div className="hidden sm:block">
          <div className="rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white shadow-lg dark:from-blue-600 dark:to-blue-700">
            <h1 className="text-2xl font-bold">Manajemen Barang Laundry</h1>
            <p className="mt-2 opacity-90">
              Lihat dan kelola item laundry dalam sistem
            </p>
          </div>
        </div>

        <div className="mx-1 hidden rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:mx-0 sm:block sm:p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-md lg:flex-1">
              <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
              <Input
                placeholder="Cari berdasarkan nama item atau kategori..."
                value={filters.search}
                onChange={(e) => updateFilters({ search: e.target.value })}
                className="rounded-xl border-gray-200 pl-12 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:focus:border-blue-400 dark:focus:ring-blue-400"
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:flex-shrink-0">
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                className="flex h-10 items-center justify-center gap-2 rounded-xl bg-blue-500 text-sm hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
              >
                <PackagePlus className="h-4 w-4" />
                <span className="xs:inline hidden">Tambah Item</span>
                <span className="xs:hidden">Tambah</span>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-10 min-w-0 rounded-xl border-gray-200 text-sm lg:min-w-[140px] dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
                  >
                    <Tag className="mr-2 h-4 w-4 flex-shrink-0" />
                    <span className="truncate text-xs sm:text-sm">
                      {getPricingTypeDisplayText(filters.pricingType)}
                    </span>
                    <ChevronDownIcon className="ml-2 h-4 w-4 flex-shrink-0" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-48 dark:border-gray-700 dark:bg-gray-800"
                >
                  <DropdownMenuItem
                    onClick={() => updateFilters({ pricingType: "" })}
                    className="dark:text-gray-100 dark:hover:bg-gray-700"
                  >
                    Semua Tipe
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => updateFilters({ pricingType: "PER_PIECE" })}
                    className="dark:text-gray-100 dark:hover:bg-gray-700"
                  >
                    Per Piece
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => updateFilters({ pricingType: "PER_KG" })}
                    className="dark:text-gray-100 dark:hover:bg-gray-700"
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
                className="h-10 rounded-xl border-gray-200 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
              >
                Reset
              </Button>
            </div>
          </div>
        </div>

        <div className="block sm:hidden">
          {isLoading ? (
            <div className="flex h-32 items-center justify-center">
              <Loader2 className="mr-2 h-6 w-6 animate-spin" />
              <span className="text-sm dark:text-gray-300">
                Memuat data item laundry...
              </span>
            </div>
          ) : error ? (
            <div className="mx-3 p-4 text-center text-red-500 dark:text-red-400">
              <div className="text-sm">Kesalahan memuat data item laundry</div>
              <div className="mt-1 text-xs text-red-400 dark:text-red-300">
                {error.message || "Kesalahan tidak diketahui"}
              </div>
            </div>
          ) : laundryItemsData?.data?.length ? (
            <div className="space-y-2 px-3 pt-1">
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
            <div className="mx-5 mt-4 rounded-2xl border border-gray-200 bg-white p-6 text-center dark:border-gray-700 dark:bg-gray-800">
              <span className="mb-4 block text-sm text-gray-500 dark:text-gray-400">
                {filters.search
                  ? `Tidak ada item laundry ditemukan untuk "${filters.search}"`
                  : "Belum ada item laundry yang terdaftar"}
              </span>
              {!filters.search && (
                <Button
                  onClick={() => setIsCreateModalOpen(true)}
                  variant="outline"
                  className="mx-auto flex items-center gap-2 rounded-xl dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-700"
                  size="sm"
                >
                  <PackagePlus className="h-4 w-4" />
                  Tambah Item Pertama
                </Button>
              )}
            </div>
          )}
        </div>

        <div className="mx-1 hidden rounded-2xl border border-gray-200 shadow-sm sm:mx-0 sm:block dark:border-gray-700">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b dark:border-gray-700">
                  <TableHead className="w-12 text-center text-xs sm:w-16 sm:text-sm dark:text-gray-300">
                    No
                  </TableHead>
                  <TableHead className="min-w-[150px] text-xs sm:min-w-[200px] sm:text-sm dark:text-gray-300">
                    Nama Item
                  </TableHead>
                  <TableHead className="hidden min-w-[120px] text-xs sm:min-w-[150px] sm:text-sm md:table-cell dark:text-gray-300">
                    Kategori
                  </TableHead>
                  <TableHead className="w-24 text-center text-xs sm:w-32 sm:text-sm dark:text-gray-300">
                    Harga
                  </TableHead>
                  <TableHead className="hidden w-20 text-center text-xs sm:table-cell sm:w-28 sm:text-sm dark:text-gray-300">
                    Tipe
                  </TableHead>
                  <TableHead className="w-20 text-center text-xs sm:w-24 sm:text-sm dark:text-gray-300">
                    Status
                  </TableHead>
                  <TableHead className="hidden w-24 text-center text-xs sm:w-32 sm:text-sm md:table-cell dark:text-gray-300">
                    Penggunaan
                  </TableHead>
                  <TableHead className="w-16 text-center text-xs sm:w-20 sm:text-sm dark:text-gray-300">
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
                        <span className="text-sm dark:text-gray-300">
                          Memuat data item laundry...
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="h-32 text-center text-red-500 dark:text-red-400"
                    >
                      <div>
                        <div className="text-sm">
                          Kesalahan memuat data item laundry
                        </div>
                        <div className="mt-1 text-xs text-red-400 dark:text-red-300">
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
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {filters.search
                            ? `Tidak ada item laundry ditemukan untuk "${filters.search}"`
                            : "Belum ada item laundry yang terdaftar"}
                        </span>
                        {!filters.search && (
                          <Button
                            onClick={() => setIsCreateModalOpen(true)}
                            variant="outline"
                            className="flex items-center gap-2 rounded-xl dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-700"
                            size="sm"
                          >
                            <Plus className="h-4 w-4" />
                            Tambah Item Pertama
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

        {laundryItemsData?.meta && (
          <div className="mx-1 hidden justify-center rounded-2xl border-t px-4 py-6 sm:mx-0 sm:flex">
            <PaginationSection
              page={laundryItemsData.meta.page}
              take={PAGE_SIZE}
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

        {laundryItemsData?.meta && (
          <div className="flex justify-center rounded-2xl border-t p-3 sm:hidden">
            <PaginationSection
              page={laundryItemsData.meta.page}
              take={PAGE_SIZE}
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
      </div>

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
    </>
  );
}
