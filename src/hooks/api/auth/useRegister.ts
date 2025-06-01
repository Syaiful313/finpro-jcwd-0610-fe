import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";

import { axiosInstance } from "@/lib/axios";
import { toast } from "sonner";

interface RegisterPayload {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

export const useRegister = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async (payload: RegisterPayload) => {
      const { data } = await axiosInstance.post("/auth/register", payload);
      return data;
    },
    onSuccess: async (data) => {
      toast.success("Registration successful! Please check your email to verify and set your password.");
      router.push("/register/email-verification");
    },
    onError: (error: AxiosError<any>) => {
      if (error.response) {
        if (error.response.status === 400) {
          toast.error("Email already registered. Please sign in or use a different email.");
        } else if (error.response.data && error.response.data.message) {
          toast.error(`Registration failed: ${error.response.data.message}`);
        } else {
          toast.error("Registration failed. Please try again.");
        }
      } else {
        toast.error("An unexpected error occurred during registration.");
      }
      console.error("Registration Error:", error);
    },
  });
};

export default useRegister;