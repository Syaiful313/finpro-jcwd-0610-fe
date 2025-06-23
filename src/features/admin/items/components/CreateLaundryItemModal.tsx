"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import useCreateLaundryItem from "@/hooks/api/laundry-item/useCreateLaundryItem";
import { LaundryItem } from "@/types/laundry-item";
import { useFormik } from "formik";
import { Loader2, Package, Tag } from "lucide-react";
import { useMemo } from "react";
import { createLaundryItemValidationSchema } from "../schemas";

interface CreateLaundryItemModalProps {
  open: boolean;
  laundryItem?: LaundryItem | null;
  onClose: () => void;
  onSave?: (laundryItemData: any) => void;
}

export default function CreateLaundryItemModal({
  open,
  laundryItem,
  onClose,
  onSave,
}: CreateLaundryItemModalProps) {
  const isEditMode = !!laundryItem;
  const createLaundryItemMutation = useCreateLaundryItem();

  const validationSchema = useMemo(() => {
    return createLaundryItemValidationSchema({ isEditMode });
  }, [isEditMode]);

  const formik = useFormik({
    initialValues: {
      name: laundryItem?.name || "",
      category: laundryItem?.category || "",
      basePrice: laundryItem?.basePrice || "",
      pricingType: laundryItem?.pricingType || "",
      isActive: laundryItem?.isActive ?? true,
    },
    validationSchema: validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      if (isEditMode) {
        if (onSave) {
          const laundryItemData = {
            ...values,
            id: laundryItem!.id,
            basePrice:
              values.pricingType === "PER_KG" ? 5000 : Number(values.basePrice),
          };
          onSave(laundryItemData);
        }
      } else {
        const createLaundryItemPayload = {
          name: values.name,
          category: values.category,
          basePrice:
            values.pricingType === "PER_KG" ? 5000 : Number(values.basePrice),
          pricingType: values.pricingType as "PER_PIECE" | "PER_KG",
          isActive: values.isActive,
        };

        createLaundryItemMutation.mutate(createLaundryItemPayload, {
          onSuccess: () => {
            handleClose();
          },
        });
      }
    },
  });

  const handleClose = () => {
    if (!createLaundryItemMutation.isPending) {
      formik.resetForm();
      onClose();
    }
  };

  const handlePricingTypeChange = (value: string) => {
    formik.setFieldValue("pricingType", value);

    if (value === "PER_KG") {
      formik.setFieldValue("basePrice", 5000);
    }
  };

  const isLoading = createLaundryItemMutation.isPending;
  const isPriceRequired = formik.values.pricingType === "PER_PIECE";

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="max-h-[90vh] overflow-y-auto sm:max-w-[600px] [&>button]:hidden"
      >
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-xl font-semibold">
            {isEditMode ? "Edit Item Laundry" : "Tambah Item Laundry Baru"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            {isEditMode
              ? "Edit informasi item laundry yang sudah ada"
              : "Isi form berikut untuk menambahkan item laundry baru"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Nama Item *
            </Label>
            <Input
              id="name"
              name="name"
              placeholder="Contoh: Baju Kaos, Celana Panjang"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={isLoading}
            />
            {formik.touched.name && formik.errors.name && (
              <p className="mt-1 text-xs text-red-500">{formik.errors.name}</p>
            )}
            <p className="text-muted-foreground text-xs">
              Nama item harus unik dan mudah dikenali oleh pelanggan
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm font-medium">
              Kategori *
            </Label>
            <Input
              id="category"
              name="category"
              placeholder="Contoh: Pakaian Atas, Pakaian Bawah"
              value={formik.values.category}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={isLoading}
            />
            {formik.touched.category && formik.errors.category && (
              <p className="mt-1 text-xs text-red-500">
                {formik.errors.category}
              </p>
            )}
            <p className="text-muted-foreground text-xs">
              Kategori membantu pengelompokan item laundry
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pricingType" className="text-sm font-medium">
              Tipe Pricing *
            </Label>
            <Select
              value={formik.values.pricingType}
              onValueChange={handlePricingTypeChange}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih tipe pricing" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PER_PIECE">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-blue-600" />
                    <span>Per Piece</span>
                  </div>
                </SelectItem>
                <SelectItem value="PER_KG">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-purple-600" />
                    <span>Per Kg</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            {formik.touched.pricingType && formik.errors.pricingType && (
              <p className="mt-1 text-xs text-red-500">
                {formik.errors.pricingType}
              </p>
            )}
            <p className="text-muted-foreground text-xs">
              Per Piece: harga per item, Per Kg: harga berdasarkan berat
            </p>
          </div>

          {isPriceRequired && (
            <div className="space-y-2">
              <Label htmlFor="basePrice" className="text-sm font-medium">
                Harga *
              </Label>
              <Input
                id="basePrice"
                name="basePrice"
                type="number"
                step="100"
                min="0"
                placeholder="5000"
                value={formik.values.basePrice}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={isLoading}
              />
              {formik.touched.basePrice && formik.errors.basePrice && (
                <p className="mt-1 text-xs text-red-500">
                  {formik.errors.basePrice}
                </p>
              )}
              <p className="text-muted-foreground text-xs">
                Harga dalam Rupiah (tanpa titik atau koma)
              </p>
            </div>
          )}

          {formik.values.pricingType === "PER_KG" && (
            <div className="rounded-lg bg-purple-50 p-4">
              <div className="flex items-start gap-3">
                <Tag className="mt-0.5 h-5 w-5 text-purple-600" />
                <div className="space-y-1">
                  <h4 className="text-sm font-medium text-purple-900">
                    Item Per Kilogram
                  </h4>
                  <p className="text-xs text-purple-700">
                    Untuk item dengan tipe pricing per kg, sistem akan
                    menggunakan harga default Rp 5.000. Harga final akan
                    dihitung berdasarkan berat saat pemesanan.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <div className="flex flex-row items-center justify-between space-x-4 rounded-lg border p-4">
              <div className="flex-1 space-y-1">
                <Label className="cursor-pointer text-sm font-medium">
                  Status Aktif
                </Label>
                <p className="text-muted-foreground text-xs">
                  Item aktif akan tersedia untuk dipilih pelanggan
                </p>
              </div>
              <Switch
                checked={formik.values.isActive}
                onCheckedChange={(checked) =>
                  formik.setFieldValue("isActive", checked)
                }
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="rounded-lg bg-blue-50 p-4">
            <div className="flex items-start gap-3">
              <Package className="mt-0.5 h-5 w-5 text-blue-600" />
              <div className="space-y-1">
                <h4 className="text-sm font-medium text-blue-900">
                  Tips Menambahkan Item Laundry
                </h4>
                <ul className="space-y-1 text-xs text-blue-700">
                  <li>
                    • Gunakan nama yang jelas dan mudah dipahami pelanggan
                  </li>
                  <li>• Kelompokkan item dengan kategori yang sesuai</li>
                  <li>
                    • <strong>Per Piece:</strong> Untuk item dengan harga tetap
                    per unit (baju, celana)
                  </li>
                  <li>
                    • <strong>Per Kg:</strong> Untuk item yang dihitung
                    berdasarkan berat (sprei, selimut)
                  </li>
                  <li>
                    • Item Per Kg tidak perlu input harga, akan dihitung saat
                    pemesanan
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </form>

        <DialogFooter className="flex flex-col-reverse space-y-2 space-y-reverse pt-6 sm:flex-row sm:justify-end sm:space-y-0 sm:space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            Batal
          </Button>
          <Button
            type="submit"
            onClick={() => formik.handleSubmit()}
            disabled={isLoading || !formik.isValid}
            className="w-full sm:w-auto"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              "Simpan"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
