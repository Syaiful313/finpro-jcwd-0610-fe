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
import { Switch } from "@/components/ui/switch";
import LocationPicker from "@/features/admin/outlets/components/LocationsPicker";
import useCreateOutlet from "@/hooks/api/outlet/useCreateOutlet";
import { Outlet } from "@/types/outlet";
import { useFormik } from "formik";
import { Loader2, MapPin } from "lucide-react";
import { useMemo } from "react";
import { createOutletValidationSchema } from "../schemas";

interface CreateOutletModalProps {
  open: boolean;
  outlet?: Outlet | null;
  onClose: () => void;
  onSave?: (outletData: any) => void;
}

export default function CreateOutletModal({
  open,
  outlet,
  onClose,
  onSave,
}: CreateOutletModalProps) {
  const isEditMode = !!outlet;
  const createOutletMutation = useCreateOutlet();

  const validationSchema = useMemo(() => {
    return createOutletValidationSchema({ isEditMode });
  }, [isEditMode]);

  const formik = useFormik({
    initialValues: {
      outletName: outlet?.outletName || "",
      address: outlet?.address || "",
      latitude: outlet?.latitude || -7.7956,
      longitude: outlet?.longitude || 110.3695,
      serviceRadius: outlet?.serviceRadius || "",
      isActive: outlet?.isActive ?? true,
    },
    validationSchema: validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      if (isEditMode) {
        if (onSave) {
          const outletData = {
            ...values,
            id: outlet!.id,
            latitude: Number(values.latitude),
            longitude: Number(values.longitude),
            serviceRadius: Number(values.serviceRadius),
          };
          onSave(outletData);
        }
      } else {
        const createOutletPayload = {
          outletName: values.outletName,
          address: values.address,
          latitude: Number(values.latitude),
          longitude: Number(values.longitude),
          serviceRadius: Number(values.serviceRadius),
          isActive: values.isActive,
        };

        createOutletMutation.mutate(createOutletPayload, {
          onSuccess: () => {
            handleClose();
          },
        });
      }
    },
  });

  const handleClose = () => {
    if (!createOutletMutation.isPending) {
      formik.resetForm();
      onClose();
    }
  };

  const handleLocationChange = (lat: number, lng: number) => {
    formik.setFieldValue("latitude", lat);
    formik.setFieldValue("longitude", lng);
  };

  const isLoading = createOutletMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="max-h-[90vh] overflow-y-auto sm:max-w-[700px] [&>button]:hidden"
      >
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-xl font-semibold">
            {isEditMode ? "Edit Outlet" : "Tambah Outlet Baru"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            {isEditMode
              ? "Edit informasi outlet yang sudah ada"
              : "Isi form berikut untuk menambahkan outlet baru"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="outletName" className="text-sm font-medium">
              Nama Outlet *
            </Label>
            <Input
              id="outletName"
              name="outletName"
              placeholder="Nama Outlet"
              value={formik.values.outletName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={isLoading}
            />
            {formik.touched.outletName && formik.errors.outletName && (
              <p className="mt-1 text-xs text-red-500">
                {formik.errors.outletName}
              </p>
            )}
            <p className="text-muted-foreground text-xs">
              Nama outlet harus unik dan mudah dikenali
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="text-sm font-medium">
              Alamat *
            </Label>
            <Input
              id="address"
              name="address"
              placeholder="Alamat lengkap outlet"
              value={formik.values.address}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={isLoading}
            />
            {formik.touched.address && formik.errors.address && (
              <p className="mt-1 text-xs text-red-500">
                {formik.errors.address}
              </p>
            )}
            <p className="text-muted-foreground text-xs">
              Masukkan alamat lengkap untuk memudahkan pelanggan menemukan
              outlet
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-blue-600" />
              <Label className="text-sm font-medium">Lokasi Outlet *</Label>
            </div>

            <LocationPicker
              latitude={Number(formik.values.latitude)}
              longitude={Number(formik.values.longitude)}
              onLocationChange={handleLocationChange}
              className="w-full"
            />

            <p className="text-muted-foreground text-xs">
              Pilih lokasi outlet dengan mengklik pada peta atau drag marker
              untuk posisi yang tepat
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="latitude" className="text-sm font-medium">
                Latitude
              </Label>
              <Input
                id="latitude"
                name="latitude"
                type="number"
                step="any"
                placeholder="-7.7956"
                value={formik.values.latitude}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={isLoading}
                className="bg-gray-50"
                readOnly
              />
              {formik.touched.latitude && formik.errors.latitude && (
                <p className="mt-1 text-xs text-red-500">
                  {formik.errors.latitude}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="longitude" className="text-sm font-medium">
                Longitude
              </Label>
              <Input
                id="longitude"
                name="longitude"
                type="number"
                step="any"
                placeholder="110.3695"
                value={formik.values.longitude}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={isLoading}
                className="bg-gray-50"
                readOnly
              />
              {formik.touched.longitude && formik.errors.longitude && (
                <p className="mt-1 text-xs text-red-500">
                  {formik.errors.longitude}
                </p>
              )}
            </div>
          </div>
          <p className="text-muted-foreground text-xs">
            Koordinat akan otomatis terisi saat Anda memilih lokasi di peta
          </p>

          <div className="space-y-2">
            <Label htmlFor="serviceRadius" className="text-sm font-medium">
              Radius Layanan (km) *
            </Label>
            <Input
              id="serviceRadius"
              name="serviceRadius"
              type="number"
              step="0.1"
              min="0.1"
              max="50"
              placeholder="5.0"
              value={formik.values.serviceRadius}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={isLoading}
            />
            {formik.touched.serviceRadius && formik.errors.serviceRadius && (
              <p className="mt-1 text-xs text-red-500">
                {formik.errors.serviceRadius}
              </p>
            )}
            <p className="text-muted-foreground text-xs">
              Jarak maksimal layanan dari outlet (0.1 - 50 km)
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex flex-row items-center justify-between space-x-4 rounded-lg border p-4">
              <div className="flex-1 space-y-1">
                <Label className="cursor-pointer text-sm font-medium">
                  Status Aktif
                </Label>
                <p className="text-muted-foreground text-xs">
                  Outlet aktif dapat menerima pesanan dari pelanggan
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
