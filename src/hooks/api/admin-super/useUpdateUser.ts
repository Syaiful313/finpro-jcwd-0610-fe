"use client";

import { axiosInstance } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface UpdateUserPayload {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  role?: string;
  phoneNumber?: string;
  isVerified?: boolean | string;
  provider?: string;
  notificationId?: number | null;
  profile?: File | null;
}

const useUpdateUser = (id: number) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateUserPayload) => {
      const updateUserForm = new FormData();

      if (payload.firstName)
        updateUserForm.append("firstName", payload.firstName);
      if (payload.lastName) updateUserForm.append("lastName", payload.lastName);
      if (payload.email) updateUserForm.append("email", payload.email);
      if (payload.password) updateUserForm.append("password", payload.password);
      if (payload.role) updateUserForm.append("role", payload.role);
      if (payload.phoneNumber)
        updateUserForm.append("phoneNumber", payload.phoneNumber);
      if (payload.isVerified !== undefined) {
        updateUserForm.append("isVerified", payload.isVerified.toString());
      }
      if (payload.provider) updateUserForm.append("provider", payload.provider);
      if (payload.notificationId !== undefined) {
        updateUserForm.append(
          "notificationId",
          payload.notificationId?.toString() || "",
        );
      }

      if (payload.profile) {
        updateUserForm.append("profile", payload.profile);
      }

      const { data } = await axiosInstance.patch(
        `/admin-super/${id}`,
        updateUserForm,
      );
      return data;
    },
    onSuccess: async () => {
      toast.success("User updated successfully");
      await queryClient.invalidateQueries({ queryKey: ["users"] });
      await queryClient.invalidateQueries({
        queryKey: ["user", "detail", id],
      });

      router.replace("/admin/super/users");
    },
    onError: (error: AxiosError<any>) => {
      toast.error(error.response?.data.message || "Failed to update user");
    },
  });
};

export default useUpdateUser;
