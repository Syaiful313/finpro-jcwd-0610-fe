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

const useRegister = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: async (payload: RegisterPayload) => {
      const { data } = await axiosInstance.post("/auth/register", payload);
      return data;
    },
    onSuccess: async () => {
      toast.success("Registration successful! Please check your email to verify and set your password.");
      router.push("/register/verification");
    },
    onError: (error: AxiosError<any>) => {
      toast.error(error.response?.data?.message);
      console.error("Registration Error:", error);
    },
  });
};

export default useRegister;