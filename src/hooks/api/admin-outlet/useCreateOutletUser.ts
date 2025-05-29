"use client";

import { axiosInstance } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface CreateOutletUserPayload {
  outletId: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: "WORKER" | "DRIVER"; // ✅ Updated to match service validation
  phoneNumber: string;
  isVerified?: boolean; // ✅ Optional with default handling
  provider?: "GOOGLE" | "CREDENTIAL"; // ✅ Optional with service default
  notificationId?: number;
  npwp: string; // ✅ Required for WORKER and DRIVER roles
  profile: File; // ✅ Required as per service expectation
}

interface CreateOutletUserResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    profilePic: string;
    role: string;
    isVerified: boolean;
    provider: string;
    isEmployee: boolean;
    employeeData: {
      id: number;
      npwp: string;
      outletId: number;
    } | null;
  };
}

const useCreateOutletUser = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation<CreateOutletUserResponse, AxiosError, CreateOutletUserPayload>({
    mutationFn: async (payload: CreateOutletUserPayload) => {
      const { outletId, ...restPayload } = payload;
      const userForm = new FormData();

      // ✅ Required fields
      userForm.append("firstName", restPayload.firstName);
      userForm.append("lastName", restPayload.lastName);
      userForm.append("email", restPayload.email);
      userForm.append("password", restPayload.password);
      userForm.append("phoneNumber", restPayload.phoneNumber);
      userForm.append("role", restPayload.role);
      userForm.append("npwp", restPayload.npwp); // ✅ Now required

      // ✅ Required profile picture
      userForm.append("profile", restPayload.profile);

      // ✅ Optional fields with proper defaults
      userForm.append("isVerified", String(restPayload.isVerified ?? false));
      userForm.append("provider", restPayload.provider ?? "CREDENTIAL");

      // ✅ Optional notification
      if (restPayload.notificationId) {
        userForm.append("notificationId", String(restPayload.notificationId));
      }

      const { data } = await axiosInstance.post(
        `/admin-outlet/${outletId}`,
        userForm,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return data;
    },
    onSuccess: async (data, variables) => {
      const { outletId, role } = variables;
      
      toast.success(data.message || "User created successfully");
      
      // ✅ Invalidate relevant queries
      await queryClient.invalidateQueries({ 
        queryKey: ["outlet-users", outletId] 
      });
      await queryClient.invalidateQueries({ 
        queryKey: ["users"] 
      });
      
      // ✅ Invalidate employees query for both WORKER and DRIVER
      if (role === "WORKER" || role === "DRIVER") {
        await queryClient.invalidateQueries({ 
          queryKey: ["outlet-employees", outletId] 
        });
        await queryClient.invalidateQueries({ 
          queryKey: ["employees"] 
        });
      }
      
      // ✅ Navigate back to outlet users list
      router.push(`/admin/outlet/users`);
    },
    onError: (error: AxiosError<any>) => {
      // ✅ Enhanced error handling
      const errorMessage = error.response?.data?.message || "Failed to create user";
      
      // ✅ Handle specific error cases
      if (error.response?.status === 400) {
        if (errorMessage.includes("already exists")) {
          toast.error("User with this email or phone number already exists");
        } else if (errorMessage.includes("NPWP")) {
          toast.error("NPWP is required for WORKER and DRIVER roles");
        } else if (errorMessage.includes("Provider")) {
          toast.error("Invalid provider. Must be GOOGLE or CREDENTIAL");
        } else {
          toast.error(errorMessage);
        }
      } else if (error.response?.status === 403) {
        toast.error("You can only create WORKER or DRIVER users");
      } else if (error.response?.status === 404) {
        toast.error("Outlet not found");
      } else {
        toast.error(errorMessage);
      }
    },
  });
};

export default useCreateOutletUser;