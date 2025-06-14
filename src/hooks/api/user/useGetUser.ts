import useAxios from "@/hooks/useAxios";
import { User } from "@/types/user";
import { useQuery } from "@tanstack/react-query";

const useGetUser = (userId: number) => {
  const axiosInstance = useAxios();
  return useQuery<User>({
    queryKey: ["user", userId],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/user/${userId}`);
      return data;
    },
    enabled: !!userId,
  });
};

export default useGetUser;