import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { User } from "@/types/user";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { signIn } from "next-auth/react";
import { axiosInstance } from "@/lib/axios";

export const useLogin = () => {
    const router = useRouter();
    return useMutation({
        mutationFn: async (payload: Pick<User, "email" | "password">) => {
            const { data } = await axiosInstance.post("/auth/login", payload);
            return data;
        },
        onSuccess: async (data) => {
            await signIn("credentials", {...data, redirect: false});
            toast.success("Login successful");
            router.push("/");
        },
        onError: (error: AxiosError<any>) => {
            toast.error("An unexpected error occurred during login.");
            console.error("Login Error:", error);
        },
    });
};

export default useLogin;