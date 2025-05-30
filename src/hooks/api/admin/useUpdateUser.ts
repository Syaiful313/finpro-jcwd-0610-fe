"use client";

import useAxios from "@/hooks/useAxios";
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
  outletId?: string;
  npwp?: string;
  profile?: File | null;
}

const useUpdateUser = (userId: number) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const axiosInstance = useAxios();

  return useMutation({
    mutationFn: async (payload: UpdateUserPayload) => {
      const updateUserForm = new FormData();

      const appendIfExists = (key: string, value: any) => {
        if (value !== undefined && value !== null && value !== "") {
          updateUserForm.append(key, value.toString());
        }
      };

      appendIfExists("firstName", payload.firstName);
      appendIfExists("lastName", payload.lastName);
      appendIfExists("email", payload.email);
      appendIfExists("password", payload.password);
      appendIfExists("role", payload.role);
      appendIfExists("phoneNumber", payload.phoneNumber);
      appendIfExists("provider", payload.provider);
      appendIfExists("outletId", payload.outletId);
      appendIfExists("npwp", payload.npwp);

      if (payload.isVerified !== undefined) {
        updateUserForm.append("isVerified", payload.isVerified.toString());
      }

      if (payload.profile) {
        updateUserForm.append("profile", payload.profile);
      }

      const { data } = await axiosInstance.patch(
        `/admin/users/${userId}`,
        updateUserForm,
      );
      return data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "User updated successfully");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user", userId] });
      router.push("/admin/users");
    },
    onError: (error: AxiosError<any>) => {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to update user";

      toast.error(errorMessage);
    },
  });
};

export default useUpdateUser;
