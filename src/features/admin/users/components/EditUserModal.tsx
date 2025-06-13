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
import { User as ApiUser } from "@/hooks/api/admin/useGetUsers";
import useUpdateUser from "@/hooks/api/admin/useUpdateUser";
import useGetOutlets from "@/hooks/api/outlet/useGetOutlets";
import { useFormik } from "formik";
import { Loader2, TrashIcon, Upload } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  createUserValidationSchema,
  isEmployeeDataRequired,
  isProfileRequired,
  validateProfilePicture,
} from "../schemas";

interface EditUserModalProps {
  open: boolean;
  user: ApiUser;
  onClose: () => void;
  onSuccess: () => void;
}

const AVAILABLE_ROLES = [
  { value: "ADMIN", label: "Admin" },
  { value: "OUTLET_ADMIN", label: "Admin Outlet" },
  { value: "CUSTOMER", label: "Customer" },
  { value: "WORKER", label: "Worker" },
  { value: "DRIVER", label: "Driver" },
];

export default function EditUserModal({
  open,
  user,
  onClose,
  onSuccess,
}: EditUserModalProps) {
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [shouldRemoveProfile, setShouldRemoveProfile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateUserMutation = useUpdateUser(user.id);
  const { data: outletsData, isLoading: outletsLoading } = useGetOutlets({
    all: true,
  });

  const validationSchema = useMemo(() => {
    return createUserValidationSchema({
      isEditMode: true,
    });
  }, []);

  const formik = useFormik({
    initialValues: {
      email: user?.email || "",
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      password: "",
      role: user?.role || "",
      phoneNumber: user?.phoneNumber || "",
      provider: user?.provider || "CREDENTIAL",
      isVerified: user?.isVerified || false,
      profile: null as File | null,
      outletId: user?.outletId?.toString() || "",
      npwp: user?.employeeInfo?.npwp || "",
    },
    validationSchema: validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      if (values.profile) {
        const profileError = validateProfilePicture(
          values.role,
          values.profile,
          true,
        );
        if (profileError) {
          formik.setFieldError("profile", profileError);
          return;
        }
      }

      const requiresEmployeeData = isEmployeeDataRequired(values.role);

      if (requiresEmployeeData) {
        if (!values.outletId) {
          formik.setFieldError(
            "outletId",
            `Outlet wajib untuk role ${values.role}`,
          );
          return;
        }

        if (!values.npwp) {
          formik.setFieldError("npwp", `NPWP wajib untuk role ${values.role}`);
          return;
        }
      }

      const updateUserPayload: any = {};

      if (values.firstName !== user.firstName) {
        updateUserPayload.firstName = values.firstName;
      }
      if (values.lastName !== user.lastName) {
        updateUserPayload.lastName = values.lastName;
      }
      if (values.email !== user.email) {
        updateUserPayload.email = values.email;
      }
      if (values.role !== user.role) {
        updateUserPayload.role = values.role;
      }
      if (values.phoneNumber !== user.phoneNumber) {
        updateUserPayload.phoneNumber = values.phoneNumber;
      }
      if (values.isVerified !== user.isVerified) {
        updateUserPayload.isVerified = values.isVerified;
      }
      if (values.provider !== user.provider) {
        updateUserPayload.provider = values.provider;
      }

      if (values.password && values.password.trim() !== "") {
        updateUserPayload.password = values.password;
      }

      if (values.profile && values.profile instanceof File) {
        updateUserPayload.profile = values.profile;
      } else if (shouldRemoveProfile && user.profilePic) {
        updateUserPayload.removeProfile = true;
      }

      if (requiresEmployeeData) {
        if (values.outletId !== user.outletId?.toString()) {
          updateUserPayload.outletId = values.outletId;
        }
        if (values.npwp !== user.employeeInfo?.npwp) {
          updateUserPayload.npwp = values.npwp;
        }
      }

      updateUserMutation.mutate(updateUserPayload, {
        onSuccess: () => {
          handleClose();
          onSuccess();
        },
        onError: (error) => {
          console.error("Update failed:", error);
        },
      });
    },
  });

  useEffect(() => {
    const requiresEmployeeData = isEmployeeDataRequired(formik.values.role);
    if (!requiresEmployeeData) {
      formik.setFieldValue("outletId", "");
      formik.setFieldValue("npwp", "");
    }
  }, [formik.values.role]);

  useEffect(() => {
    if (user?.profilePic) {
      setProfilePreview(user.profilePic);
      setShouldRemoveProfile(false);
    }
  }, [user?.profilePic]);

  const handleClose = () => {
    if (!updateUserMutation.isPending) {
      formik.setValues({
        email: user?.email || "",
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        password: "",
        role: user?.role || "",
        phoneNumber: user?.phoneNumber || "",
        provider: user?.provider || "CREDENTIAL",
        isVerified: user?.isVerified || false,
        profile: null,
        outletId: user?.outletId?.toString() || "",
        npwp: user?.employeeInfo?.npwp || "",
      });

      setProfilePreview(user?.profilePic || null);
      setShouldRemoveProfile(false);

      formik.setErrors({});
      formik.setTouched({});

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      onClose();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const error = validateProfilePicture(formik.values.role, file, true);
      if (error) {
        formik.setFieldError("profile", error);
        return;
      }

      formik.setFieldValue("profile", file);
      formik.setFieldError("profile", "");
      setShouldRemoveProfile(false);

      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeProfilePicture = () => {
    formik.setFieldValue("profile", null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    if (user?.profilePic) {
      setShouldRemoveProfile(true);
      setProfilePreview(null);
    } else {
      setProfilePreview(user?.profilePic || null);
      setShouldRemoveProfile(false);
    }
  };

  const isLoading = updateUserMutation.isPending;
  const showEmployeeFields = isEmployeeDataRequired(formik.values.role);
  const requiresProfile = isProfileRequired(formik.values.role);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="max-h-[90vh] overflow-y-auto sm:max-w-[500px] [&>button]:hidden"
      >
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-xl font-semibold">Edit User</DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            Edit informasi user yang sudah ada
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
              />
              {formik.touched.lastName && formik.errors.lastName && (
                <p className="mt-1 text-xs text-red-500">
                  {formik.errors.lastName}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              Password (Optional)
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Kosongkan jika tidak ingin mengubah password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={isLoading}
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

          <div className="space-y-2">
            <Label htmlFor="role" className="text-sm font-medium">
              Role *
            </Label>
            <Select
              value={formik.values.role}
              onValueChange={(value) => formik.setFieldValue("role", value)}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih role" />
              </SelectTrigger>
              <SelectContent>
                {AVAILABLE_ROLES.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formik.touched.role && formik.errors.role && (
              <p className="mt-1 text-xs text-red-500">{formik.errors.role}</p>
            )}
            <p className="text-muted-foreground text-xs">
              Admin dapat mengubah semua jenis role termasuk admin lainnya
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber" className="text-sm font-medium">
              Nomor Telepon
            </Label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              placeholder="08xxxxxxxxxx"
              value={formik.values.phoneNumber}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={isLoading}
              maxLength={13}
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

          {showEmployeeFields && (
            <>
              <div className="space-y-2">
                <Label htmlFor="outletId" className="text-sm font-medium">
                  Outlet *
                </Label>
                <Select
                  value={formik.values.outletId}
                  onValueChange={(value) =>
                    formik.setFieldValue("outletId", value)
                  }
                  disabled={isLoading || outletsLoading}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        outletsLoading ? "Loading outlets..." : "Pilih outlet"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {outletsData?.data?.map((outlet) => (
                      <SelectItem key={outlet.id} value={outlet.id.toString()}>
                        {outlet.outletName} - {outlet.address}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formik.touched.outletId && formik.errors.outletId && (
                  <p className="mt-1 text-xs text-red-500">
                    {formik.errors.outletId}
                  </p>
                )}
                <p className="text-muted-foreground text-xs">
                  Pilih outlet tempat user akan bekerja
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="npwp" className="text-sm font-medium">
                  NPWP *
                </Label>
                <Input
                  id="npwp"
                  name="npwp"
                  placeholder="123456789012345"
                  value={formik.values.npwp}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={isLoading}
                  maxLength={15}
                />
                {formik.touched.npwp && formik.errors.npwp && (
                  <p className="mt-1 text-xs text-red-500">
                    {formik.errors.npwp}
                  </p>
                )}
                <p className="text-muted-foreground text-xs">
                  NPWP harus 15 digit angka
                </p>
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="provider" className="text-sm font-medium">
              Provider Login
            </Label>
            <Select
              value={formik.values.provider}
              onValueChange={(value) => formik.setFieldValue("provider", value)}
              disabled={isLoading}
            >
              <SelectTrigger>
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
            <Label className="text-sm font-medium">
              Profile Picture {requiresProfile ? "*" : "(Optional)"}
            </Label>
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
                  <Button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      removeProfilePicture();
                    }}
                    className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1 text-white transition-colors hover:bg-red-600"
                    disabled={isLoading}
                    size="sm"
                  >
                    <TrashIcon className="h-3 w-3" />
                  </Button>
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
              Upload JPG, JPEG, atau PNG. Maksimal 2MB
            </p>
          </div>

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
            type="button"
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
              "Simpan Perubahan"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
