// import { axiosInstance } from "@/lib/axios";
// import { Attendance } from "@/types/attendance";
// import { PageableResponse, PaginationQueries } from "@/types/pagination";
// import { useQuery } from "@tanstack/react-query";
// import { useSession } from "next-auth/react";

// interface GetAttendanceProps extends PaginationQueries {}

// const useGetAttendance = (params?: GetAttendanceProps) => {
//   const session = useSession();

//   return useQuery({
//     queryKey: ["attendance", params],
//     enabled: !!session.data,
//     queryFn: async () => {
//       // console.log("Params sent to API:", params);
//       // const response = await axiosInstance.get("/attendance", { params });
//       // console.log("Full API response:", response.data);
//       const { data } = await axiosInstance.get<PageableResponse<Attendance>>(
//         "/attendance",
//         { params },
//       );

//       return data;
//     },
//   });
// };

// export default useGetAttendance;

// import useAxios from "@/hooks/useAxios";
// import { Attendance } from "@/types/attendance";
// import { PageableResponse, PaginationQueries } from "@/types/pagination";
// import { useQuery } from "@tanstack/react-query";
// import { useSession } from "next-auth/react";

// interface GetAttendanceProps extends PaginationQueries {
//   search?: string;
//   employeeId?: number;
//   perPage?: number;
// }
// const useGetAttendance = (queries?: GetAttendanceProps) => {
//   const axiosInstance = useAxios();
//   const { data: session, status: sessionStatus } = useSession();

//   return useQuery({
//     queryKey: ["attendance", queries],
//     enabled: sessionStatus === "authenticated" && !!session,
//     queryFn: async () => {
//       const { data } = await axiosInstance.get<PageableResponse<Attendance>>(
//         "/attendance",
//         { params: queries },
//       );
//       return data;
//     },
//   });
// };

// export default useGetAttendance;
import useAxios from "@/hooks/useAxios";
import { Attendance } from "@/types/attendance";
import { PageableResponse, PaginationQueries } from "@/types/pagination";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

interface GetAttendanceProps extends PaginationQueries {
  search?: string;
  employeeId?: number;
  perPage?: number;
}

const useGetAttendance = (queries?: GetAttendanceProps) => {
  const axiosInstance = useAxios();
  const { data: session, status: sessionStatus } = useSession();

  return useQuery({
    queryKey: ["attendance", queries],
    enabled: sessionStatus === "authenticated" && !!session,
    queryFn: async () => {
      const { data } = await axiosInstance.get<PageableResponse<Attendance>>(
        "/attendance",
        { params: queries },
      );
      return data;
    },
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

export default useGetAttendance;
