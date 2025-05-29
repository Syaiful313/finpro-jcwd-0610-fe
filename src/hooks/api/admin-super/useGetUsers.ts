"use client";

import { axiosInstance } from "@/lib/axios";
import { User } from "@/types/user";
import { PageableResponse, PaginationQueries } from "@/types/pagination";
import { useQuery } from "@tanstack/react-query";

interface GetUsersQueries extends PaginationQueries {
  search?: string;
  role?: string;
}

const useGetUsers = (queries?: GetUsersQueries) => {
  return useQuery({
    queryKey: ["users", queries],
    queryFn: async () => {
      const { data } = await axiosInstance.get<PageableResponse<User>>(
        "/admin-super",
        { params: queries },
      );
      return data;
    },
  });
};

export default useGetUsers;