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
import { LaundryItem as ApiLaundryItem } from "@/hooks/api/laundry-item/useGetLaundryItems";
import useUpdateLaundryItem from "@/hooks/api/laundry-item/useUpdateLaundryItem";
import { useFormik } from "formik";
import { Loader2, Package, Tag } from "lucide-react";
import { useMemo } from "react";
import { createLaundryItemValidationSchema } from "../schemas";

interface EditLaundryItemModalProps {
  open: boolean;
  laundryItem: ApiLaundryItem;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditLaundryItemModal({
  open,
  laundryItem,
  onClose,
  onSuccess,
}: EditLaundryItemModalProps) {
  const updateLaundryItemMutation = useUpdateLaundryItem(laundryItem.id);

  const validationSchema = useMemo(() => {
    return createLaundryItemValidationSchema({
      isEditMode: true,
    });
  }, []);

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
      const updateLaundryItemPayload = {
        name: values.name,
        category: values.category,
        basePrice:
          values.pricingType === "PER_KG" ? 0 : Number(values.basePrice),
        pricingType: values.pricingType as "PER_PIECE" | "PER_KG",
        isActive: values.isActive,
      };

      updateLaundryItemMutation.mutate(updateLaundryItemPayload, {
        onSuccess: () => {
          handleClose();
          onSuccess();
        },
      });
    },

    validate: (values) => {
      const errors: any = {};

      if (!values.name || values.name.trim() === "") {
        errors.name = "Nama item wajib diisi";
      }

      if (!values.category || values.category.trim() === "") {
        errors.category = "Kategori wajib diisi";
      }

      if (!values.pricingType) {
        errors.pricingType = "Tipe pricing wajib dipilih";
      }

      if (values.pricingType === "PER_PIECE") {
        if (
          !values.basePrice ||
          values.basePrice === "" ||
          Number(values.basePrice) <= 0
        ) {
          errors.basePrice = "Harga wajib diisi untuk tipe Per Piece";
        }
      }

      return errors;
    },
  });

  const handleClose = () => {
    if (!updateLaundryItemMutation.isPending) {
      formik.resetForm();
      onClose();
    }
  };

  const handlePricingTypeChange = (value: string) => {
    formik.setFieldValue("pricingType", value);

    if (value === "PER_KG") {
      formik.setFieldValue("basePrice", "0");
      formik.setFieldError("basePrice", undefined);
    }
  };

  const isLoading = updateLaundryItemMutation.isPending;
  const isPriceRequired = formik.values.pricingType === "PER_PIECE";

  const isFormValid = () => {
    const hasNameError =
      !formik.values.name || formik.values.name.trim() === "";
    const hasCategoryError =
      !formik.values.category || formik.values.category.trim() === "";
    const hasPricingTypeError = !formik.values.pricingType;

    const hasPriceError =
      formik.values.pricingType === "PER_PIECE" &&
      (!formik.values.basePrice ||
        formik.values.basePrice === "" ||
        Number(formik.values.basePrice) <= 0);

    return (
      !hasNameError &&
      !hasCategoryError &&
      !hasPricingTypeError &&
      !hasPriceError
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="max-h-[90vh] overflow-y-auto sm:max-w-[600px] [&>button]:hidden"
      >
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-xl font-semibold">
            Edit Item Laundry
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            Edit informasi item laundry yang sudah ada
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
                    Untuk item dengan tipe pricing per kg, harga akan dihitung
                    berdasarkan berat saat pemesanan. Tidak perlu memasukkan
                    harga tetap.
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
                  Tips Edit Item Laundry
                </h4>
                <ul className="space-y-1 text-xs text-blue-700">
                  <li>• Pastikan nama item tetap unik dan mudah dipahami</li>
                  <li>• Perubahan kategori akan mempengaruhi pengelompokan</li>
                  <li>
                    • <strong>Per Piece:</strong> Update harga akan berlaku
                    untuk pesanan baru
                  </li>
                  <li>
                    • <strong>Per Kg:</strong> Harga tidak perlu diisi, dihitung
                    saat pemesanan
                  </li>
                  <li>
                    • Status non-aktif akan menyembunyikan item dari pelanggan
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
            disabled={isLoading || !isFormValid()}
            className="w-full sm:w-auto"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              "Simpan Perubahan"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
