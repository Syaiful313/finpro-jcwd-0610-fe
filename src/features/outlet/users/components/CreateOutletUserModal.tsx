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
import useCreateOutletUser from "@/hooks/api/admin-outlet/useCreateOutletUser";
import { User } from "@/types/user";
import { useFormik } from "formik";
import { Loader2, Upload, X } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { CreateOutletUserSchema } from "../schemas";

interface CreateOutletUserModalProps {
  open: boolean;
  outletId: number;
  user?: User | null;
  onClose: () => void;
  onSave?: (userData: any) => void;
}

export default function CreateOutletUserModal({
  open,
  outletId,
  user,
  onClose,
  onSave,
}: CreateOutletUserModalProps) {
  const isEditMode = !!user;
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const createOutletUserMutation = useCreateOutletUser();

  const formik = useFormik({
    initialValues: {
      email: user?.email || "",
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      password: "",
      role: user?.role || "WORKER",
      phoneNumber: user?.phoneNumber || "",
      provider: user?.provider || "CREDENTIAL",
      isVerified: user?.isVerified || false,
      profile: null as File | null,
      notificationId: "",
      npwp: "",
    },
    validationSchema: CreateOutletUserSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      if (isEditMode) {
        if (onSave) {
          const userData = {
            ...values,
            id: user!.id,
          };
          await onSave(userData);
        }
      } else {
        if (!values.npwp || values.npwp.trim() === "") {
          formik.setFieldError(
            "npwp",
            "NPWP is required for WORKER and DRIVER roles",
          );
          return;
        }

        if (!values.profile) {
          formik.setFieldError("profile", "Profile picture is required");
          return;
        }

        const createOutletUserPayload = {
          outletId,
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          password: values.password,
          role: values.role as "WORKER" | "DRIVER",
          phoneNumber: values.phoneNumber,
          isVerified: values.isVerified,
          provider: values.provider as "GOOGLE" | "CREDENTIAL",
          profile: values.profile,
          npwp: values.npwp,
          ...(values.notificationId && {
            notificationId: parseInt(values.notificationId),
          }),
        };

        createOutletUserMutation.mutate(createOutletUserPayload, {
          onSuccess: () => {
            handleClose();
          },
        });
      }
    },
  });

  const handleClose = () => {
    if (!createOutletUserMutation.isPending) {
      formik.resetForm();
      setProfilePreview(null);
      onClose();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!validTypes.includes(file.type)) {
        formik.setFieldError(
          "profile",
          "Only JPEG, JPG, and PNG files are allowed",
        );
        return;
      }

      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        formik.setFieldError("profile", "File size must be less than 5MB");
        return;
      }

      formik.setFieldValue("profile", file);
      formik.setFieldError("profile", "");

      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeProfilePicture = () => {
    formik.setFieldValue("profile", null);
    setProfilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const isLoading = createOutletUserMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="max-h-[90vh] overflow-y-auto sm:max-w-[500px] [&>button]:hidden"
      >
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-xl font-semibold">
            {isEditMode ? "Edit User Outlet" : "Tambah User Outlet Baru"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            {isEditMode
              ? "Edit informasi user outlet yang sudah ada"
              : "Isi form berikut untuk menambahkan user baru ke outlet ini"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email *
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="email@example.com"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={isLoading}
              className={
                formik.touched.email && formik.errors.email
                  ? "border-red-500 focus-visible:ring-red-500"
                  : ""
              }
            />
            {formik.touched.email && formik.errors.email && (
              <p className="mt-1 text-xs text-red-500">{formik.errors.email}</p>
            )}
            <p className="text-muted-foreground text-xs">
              Email akan digunakan untuk login dan notifikasi
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-sm font-medium">
                Nama Depan *
              </Label>
              <Input
                id="firstName"
                name="firstName"
                placeholder="Nama Depan"
                value={formik.values.firstName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={isLoading}
                className={
                  formik.touched.firstName && formik.errors.firstName
                    ? "border-red-500 focus-visible:ring-red-500"
                    : ""
                }
              />
              {formik.touched.firstName && formik.errors.firstName && (
                <p className="mt-1 text-xs text-red-500">
                  {formik.errors.firstName}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-sm font-medium">
                Nama Belakang *
              </Label>
              <Input
                id="lastName"
                name="lastName"
                placeholder="Nama Belakang"
                value={formik.values.lastName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={isLoading}
                className={
                  formik.touched.lastName && formik.errors.lastName
                    ? "border-red-500 focus-visible:ring-red-500"
                    : ""
                }
              />
              {formik.touched.lastName && formik.errors.lastName && (
                <p className="mt-1 text-xs text-red-500">
                  {formik.errors.lastName}
                </p>
              )}
            </div>
          </div>

          {!isEditMode && (
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password *
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="********"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={isLoading}
                className={
                  formik.touched.password && formik.errors.password
                    ? "border-red-500 focus-visible:ring-red-500"
                    : ""
                }
              />
              {formik.touched.password && formik.errors.password && (
                <p className="mt-1 text-xs text-red-500">
                  {formik.errors.password}
                </p>
              )}
              <p className="text-muted-foreground text-xs">
                Minimal 8 karakter, kombinasi huruf dan angka
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="role" className="text-sm font-medium">
              Role *
            </Label>
            <Select
              value={formik.values.role}
              onValueChange={(value) => {
                formik.setFieldValue("role", value);
              }}
              disabled={isLoading}
            >
              <SelectTrigger
                className={
                  formik.touched.role && formik.errors.role
                    ? "border-red-500 focus:ring-red-500"
                    : ""
                }
              >
                <SelectValue placeholder="Pilih role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="WORKER">Worker</SelectItem>
                <SelectItem value="DRIVER">Driver</SelectItem>
              </SelectContent>
            </Select>
            {formik.touched.role && formik.errors.role && (
              <p className="mt-1 text-xs text-red-500">{formik.errors.role}</p>
            )}
            <p className="text-muted-foreground text-xs">
              Admin outlet hanya dapat membuat Worker atau Driver
            </p>
          </div>

          {/* ✅ NPWP Field - Show for both WORKER and DRIVER roles */}
          <div className="space-y-2">
            <Label htmlFor="npwp" className="text-sm font-medium">
              NPWP *
            </Label>
            <Input
              id="npwp"
              name="npwp"
              placeholder="XX.XXX.XXX.X-XXX.XXX"
              value={formik.values.npwp}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={isLoading}
              className={
                formik.touched.npwp && formik.errors.npwp
                  ? "border-red-500 focus-visible:ring-red-500"
                  : ""
              }
            />
            {formik.touched.npwp && formik.errors.npwp && (
              <p className="mt-1 text-xs text-red-500">{formik.errors.npwp}</p>
            )}
            <p className="text-muted-foreground text-xs">
              NPWP diperlukan untuk Worker dan Driver (format:
              XX.XXX.XXX.X-XXX.XXX)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber" className="text-sm font-medium">
              Nomor Telepon *
            </Label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              placeholder="08xxxxxxxxxx"
              value={formik.values.phoneNumber}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={isLoading}
              className={
                formik.touched.phoneNumber && formik.errors.phoneNumber
                  ? "border-red-500 focus-visible:ring-red-500"
                  : ""
              }
            />
            {formik.touched.phoneNumber && formik.errors.phoneNumber && (
              <p className="mt-1 text-xs text-red-500">
                {formik.errors.phoneNumber}
              </p>
            )}
            <p className="text-muted-foreground text-xs">
              Format: 08xxxxxxxxxx (10-13 digit)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="provider" className="text-sm font-medium">
              Provider Login
            </Label>
            <Select
              value={formik.values.provider}
              onValueChange={(value) => formik.setFieldValue("provider", value)}
              disabled={isLoading}
            >
              <SelectTrigger
                className={
                  formik.touched.provider && formik.errors.provider
                    ? "border-red-500 focus:ring-red-500"
                    : ""
                }
              >
                <SelectValue placeholder="Pilih provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CREDENTIAL">Email/Password</SelectItem>
                <SelectItem value="GOOGLE">Google</SelectItem>
              </SelectContent>
            </Select>
            {formik.touched.provider && formik.errors.provider && (
              <p className="mt-1 text-xs text-red-500">
                {formik.errors.provider}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notificationId" className="text-sm font-medium">
              Notification ID (Optional)
            </Label>
            <Input
              id="notificationId"
              name="notificationId"
              type="number"
              placeholder="Enter notification ID"
              value={formik.values.notificationId}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={isLoading}
            />
            <p className="text-muted-foreground text-xs">
              ID untuk push notification (opsional)
            </p>
          </div>

          {/* ✅ Profile Picture - Always show for create mode since it's required */}
          {!isEditMode && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Profile Picture *</Label>
              <div className="flex flex-col space-y-3">
                {profilePreview ? (
                  <div className="relative mx-auto h-24 w-24">
                    <Image
                      src={profilePreview}
                      alt="Profile preview"
                      className="h-24 w-24 rounded-full border-2 border-gray-200 object-cover"
                      width={96}
                      height={96}
                    />
                    <button
                      type="button"
                      onClick={removeProfilePicture}
                      className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1 text-white transition-colors hover:bg-red-600"
                      disabled={isLoading}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border-2 border-dashed border-gray-300">
                    <Upload className="h-8 w-8 text-gray-400" />
                  </div>
                )}

                <div className="flex justify-center">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading}
                    className="w-full sm:w-auto"
                  >
                    {profilePreview ? "Change Photo" : "Upload Photo"}
                  </Button>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              {formik.errors.profile && (
                <p className="mt-1 text-xs text-red-500">
                  {formik.errors.profile}
                </p>
              )}
              <p className="text-muted-foreground text-center text-xs">
                Upload JPG, JPEG, atau PNG. Maksimal 2MB. Wajib diisi.
              </p>
            </div>
          )}

          <div className="space-y-3">
            <div className="flex flex-row items-center justify-between space-x-4 rounded-lg border p-4">
              <div className="flex-1 space-y-1">
                <Label className="cursor-pointer text-sm font-medium">
                  Status Terverifikasi
                </Label>
                <p className="text-muted-foreground text-xs">
                  User yang terverifikasi dapat mengakses semua fitur sistem
                </p>
              </div>
              <Switch
                checked={formik.values.isVerified}
                onCheckedChange={(checked) =>
                  formik.setFieldValue("isVerified", checked)
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
