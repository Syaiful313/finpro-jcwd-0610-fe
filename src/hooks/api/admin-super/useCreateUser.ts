"use client";

import { axiosInstance } from "@/lib/axios";
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
  phoneNumber: string;
  isVerified: boolean;
  provider: string;
  notificationId?: string;
  profile?: File;
}

const useCreateUser = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateUserPayload) => {
      const userForm = new FormData();

      userForm.append("firstName", payload.firstName);
      userForm.append("lastName", payload.lastName);
      userForm.append("email", payload.email);
      userForm.append("password", payload.password);
      userForm.append("phoneNumber", payload.phoneNumber);
      userForm.append("isVerified", String(payload.isVerified));
      userForm.append("provider", payload.provider);

      // Optional fields
      if (payload.role) {
        userForm.append("role", payload.role);
      }
      if (payload.notificationId) {
        userForm.append("notificationId", payload.notificationId);
      }

      // Profile picture
      if (payload.profile) {
        userForm.append("profile", payload.profile);
      }
      const { data } = await axiosInstance.post("/admin-super", userForm);
      return data;
    },
    onSuccess: async () => {
      toast.success("User created successfully");
      await queryClient.invalidateQueries({ queryKey: ["users"] });
      router.push("/admin/super/users"); // Adjust navigation path as needed
    },
    onError: (error: AxiosError<any>) => {
      toast.error(error.response?.data.message || "Failed to create user");
    },
  });
};

export default useCreateUser;
