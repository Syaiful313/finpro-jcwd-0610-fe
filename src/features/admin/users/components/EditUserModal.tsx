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
import useUpdateUser from "@/hooks/api/admin-super/useUpdateUser";
import { User } from "@/types/user";
import { useFormik } from "formik";
import { Loader2, Upload, X } from "lucide-react";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";

// Removed Yup schema to avoid cyclic dependency
// Using only custom validation instead

interface EditUserModalProps {
  open: boolean;
  user: User;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function EditUserModal({
  open,
  user,
  onClose,
  onSuccess,
}: EditUserModalProps) {
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [currentProfilePic, setCurrentProfilePic] = useState<string | null>(
    null,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateUserMutation = useUpdateUser(user.id);

  const formik = useFormik({
    initialValues: {
      email: user?.email || "",
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      password: "",
      role: user?.role || "CUSTOMER",
      phoneNumber: user?.phoneNumber || "",
      provider: user?.provider || "CREDENTIAL",
      isVerified: user?.isVerified || false,
      profile: null as File | null,
      notificationId: user?.notificationId?.toString() || "",
    },
    // Removed validationSchema, using custom validate function instead
    enableReinitialize: true,
    validate: (values) => {
      const errors: any = {};
      
      // Only validate fields that are filled/changed
      if (values.email.trim() && values.email !== user.email) {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
          errors.email = "Email tidak valid";
        }
      }
      
      if (values.firstName.trim() && values.firstName !== user.firstName) {
        if (values.firstName.length < 2) {
          errors.firstName = "Nama depan minimal 2 karakter";
        }
      }
      
      if (values.lastName.trim() && values.lastName !== user.lastName) {
        if (values.lastName.length < 2) {
          errors.lastName = "Nama belakang minimal 2 karakter";
        }
      }
      
      if (values.password.trim()) {
        if (values.password.length < 8) {
          errors.password = "Password minimal 8 karakter";
        }
      }
      
      if (values.phoneNumber.trim() && values.phoneNumber !== user.phoneNumber) {
        if (!/^08[0-9]{8,11}$/.test(values.phoneNumber)) {
          errors.phoneNumber = "Format nomor telepon tidak valid";
        }
      }
      
      if (!values.role) {
        errors.role = "Role harus dipilih";
      }
      
      if (!values.provider) {
        errors.provider = "Provider harus dipilih";
      }
      
      return errors;
    },
    onSubmit: async (values) => {
      const updateUserPayload: any = {};

      if (values.firstName.trim() && values.firstName !== user.firstName) {
        updateUserPayload.firstName = values.firstName;
      }
      if (values.lastName.trim() && values.lastName !== user.lastName) {
        updateUserPayload.lastName = values.lastName;
      }
      if (values.email.trim() && values.email !== user.email) {
        updateUserPayload.email = values.email;
      }
      if (values.password.trim()) {
        updateUserPayload.password = values.password;
      }
      if (values.role !== user.role) {
        updateUserPayload.role = values.role;
      }
      if (
        values.phoneNumber.trim() &&
        values.phoneNumber !== user.phoneNumber
      ) {
        updateUserPayload.phoneNumber = values.phoneNumber;
      }
      if (values.provider !== user.provider) {
        updateUserPayload.provider = values.provider;
      }
      if (values.isVerified !== user.isVerified) {
        updateUserPayload.isVerified = values.isVerified;
      }
      if (values.notificationId !== (user?.notificationId?.toString() || "")) {
        updateUserPayload.notificationId = values.notificationId
          ? parseInt(values.notificationId)
          : null;
      }
      if (values.profile instanceof File) {
        updateUserPayload.profile = values.profile;
      }

      if (Object.keys(updateUserPayload).length === 0) {
        handleClose();
        return;
      }

      updateUserMutation.mutate(updateUserPayload, {
        onSuccess: () => {
          handleClose();
          onSuccess?.();
        },
      });
    },
  });

  useEffect(() => {
    if (user?.profilePic) {
      setCurrentProfilePic(user.profilePic);
    }
  }, [user?.profilePic]);

  const handleClose = () => {
    if (!updateUserMutation.isPending) {
      formik.resetForm();
      setProfilePreview(null);
      setCurrentProfilePic(user?.profilePic || null);
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

  const isLoading = updateUserMutation.isPending;

  const displayProfilePic = profilePreview || currentProfilePic;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="max-h-[90vh] overflow-y-auto sm:max-w-[500px] [&>button]:hidden"
      >
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-xl font-semibold">Edit User</DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            Edit informasi user. Kosongkan field yang tidak ingin diubah.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email
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
              Kosongkan jika tidak ingin mengubah email
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-sm font-medium">
                Nama Depan
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
                Nama Belakang
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

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              Password Baru (Opsional)
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
              Kosongkan jika tidak ingin mengubah password
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
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="OUTLET_ADMIN">Admin Outlet</SelectItem>
                <SelectItem value="CUSTOMER">Customer</SelectItem>
                <SelectItem value="WORKER">Worker</SelectItem>
                <SelectItem value="DRIVER">Driver</SelectItem>
              </SelectContent>
            </Select>
            {formik.touched.role && formik.errors.role && (
              <p className="mt-1 text-xs text-red-500">{formik.errors.role}</p>
            )}
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

          <div className="space-y-2">
            <Label className="text-sm font-medium">Profile Picture</Label>
            <div className="flex flex-col space-y-3">
              {displayProfilePic ? (
                <div className="relative mx-auto h-24 w-24">
                  <Image
                    src={displayProfilePic}
                    alt="Profile preview"
                    className="h-24 w-24 rounded-full border-2 border-gray-200 object-cover"
                    width={96}
                    height={96}
                  />
                  {profilePreview && (
                    <button
                      type="button"
                      onClick={removeProfilePicture}
                      className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1 text-white transition-colors hover:bg-red-600"
                      disabled={isLoading}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
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
                  {profilePreview
                    ? "Change Photo"
                    : displayProfilePic
                      ? "Update Photo"
                      : "Upload Photo"}
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
              Upload JPG, JPEG, atau PNG. Maksimal 5MB. Kosongkan untuk tidak
              mengubah foto.
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
            type="submit"
            onClick={() => formik.handleSubmit()}
            disabled={isLoading}
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