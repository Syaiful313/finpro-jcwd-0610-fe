"use client";

import useAxios from "@/hooks/useAxios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface CreateUserPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role?: string;
  phoneNumber?: string;
  isVerified?: boolean;
  provider?: string;
  outletId?: number;
  npwp?: string;
  profile?: File | null;
  currentUserRole?: string; // Add this to know who's creating
}

const useCreateUser = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const axiosInstance = useAxios();

  return useMutation({
    mutationFn: async (payload: CreateUserPayload) => {
      const userForm = new FormData();

      userForm.append("firstName", payload.firstName);
      userForm.append("lastName", payload.lastName);
      userForm.append("email", payload.email);
      userForm.append("password", payload.password);

      userForm.append("role", payload.role || "CUSTOMER");
      userForm.append("isVerified", String(payload.isVerified ?? false));
      userForm.append("provider", payload.provider || "CREDENTIAL");

      if (payload.phoneNumber) {
        userForm.append("phoneNumber", payload.phoneNumber);
      }

      // Handle outletId logic based on who's creating the user
      const needsEmployeeData = ["OUTLET_ADMIN", "WORKER", "DRIVER"].includes(payload.role || "");
      
      if (needsEmployeeData) {
        // If ADMIN is creating and provides outletId, send it
        if (payload.currentUserRole === "ADMIN" && payload.outletId) {
          userForm.append("outletId", String(payload.outletId));
        }
        // For OUTLET_ADMIN creating users, don't send outletId - service will handle it

        // Always send npwp for employee roles
        if (payload.npwp) {
          userForm.append("npwp", payload.npwp);
        }
      }

      if (payload.profile) {
        userForm.append("profile", payload.profile);
      }

      const { data } = await axiosInstance.post("/admin/users", userForm, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return data;
    },
    onSuccess: async (data) => {
      toast.success(data.message || "User created successfully");
      await queryClient.invalidateQueries({ queryKey: ["users"] });
      router.push("/admin/users");
    },
    onError: (error: AxiosError<any>) => {
      const errorMessage =
        error.response?.data?.message || "Failed to create user";
      toast.error(errorMessage);
    },
  });
};

export default useCreateUser;