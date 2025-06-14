import { axiosInstance } from "@/lib/axios";
import { User } from "@/types/user";
import { useMutation } from "@tanstack/react-query";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface LoginPayload {
  email: string;
  password: string;
}

const useLogin = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const { data } = await axiosInstance.post("/auth/login", payload);
      return data;
    },
    onSuccess: async (data) => {
      await signIn("credentials", { ...data, redirect: false });
      toast.success("Login successful");
      if (data.role === "ADMIN" || data.role === "OUTLET_ADMIN") {
        router.push("/admin/dashboard");
      } else if (data.role === "WORKER" || data.role === "DRIVER") {
        router.push("/employee");
      } else {
        router.push("/");
      }
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Something went wrong';
      toast.error(message);
      console.error(error);
    },
  });
};

export default useLogin;
