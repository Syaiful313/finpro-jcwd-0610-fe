import { axiosInstance } from "@/lib/axios";
import { PageableResponse, PaginationQueries } from "@/types/pagination";
import { useQuery } from "@tanstack/react-query";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  phoneNumber: string;
  profilePic: string | null;
  isVerified: boolean;
  provider: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  notificationId: string | null;
  totalOrdersInOutlet: number;
  employeeInfo: {
    id: number;
    npwp: string;
    createdAt: string;
  } | null;
}

interface GetOutletUsersQuery extends PaginationQueries {
  search?: string;
  role?: string;
}

const useGetOutletUsers = (
  outletId: number,
  queries?: GetOutletUsersQuery,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: ["outlet-users", outletId],
    queryFn: async () => {
      const { data } = await axiosInstance.get<PageableResponse<User>>(
        `/admin-outlet/${outletId}`,
        {
          params: {
            ...queries,
            take: queries?.take || 5,
            page: queries?.page || 1,
            sortBy: queries?.sortBy || "createdAt",
            sortOrder: queries?.sortOrder || "desc",
            search: queries?.search || "",
            role: queries?.role || "",
            outletId: outletId,
          },
        },
      );
      return data;
    },
    enabled: options?.enabled !== false && !!outletId,
  });
};

export default useGetOutletUsers;
