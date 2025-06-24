import { axiosInstance } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import type { SignInResponse } from "next-auth/react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface LoginPayload {
  email: string;
  password: string;
}

const useLogin = () => {
  const router = useRouter();
  const { update } = useSession();

  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const { data } = await axiosInstance.post("/auth/login", payload);
      return data;
    },
    onSuccess: async (data) => {
      try {
        const result = (await signIn("credentials", {
          ...data,
          id: data.id.toString(),
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          redirect: false,
        })) as SignInResponse | undefined;

        if (result?.ok) {
          toast.success("Login successful");
          await update();

          const routes: Record<string, string> = {
            ADMIN: "/admin/dashboard",
            OUTLET_ADMIN: "/admin/dashboard",
            WORKER: "/employee",
            DRIVER: "/employee",
            CUSTOMER: "/user/profile",
          };

          setTimeout(() => {
            router.push(routes[data.role] || "/");
          }, 1000);
        } else {
          toast.error("Authentication failed");
        }
      } catch (error) {
        toast.error("Authentication failed");
      }
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Login failed";
      toast.error(message);
    },
  });
};

export default useLogin;
