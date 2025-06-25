"use client";

import { useEffect } from "react";
import { getSession, signOut } from "next-auth/react";
import { axiosInstance } from "@/lib/axios";

const useAxios = () => {
  useEffect(() => {
    const requestIntercept = axiosInstance.interceptors.request.use(
      async (config) => {
        const session = await getSession();
        const accessToken = session?.user.accessToken || (session as any)?.backendToken;
    
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );

    const responseIntercept = axiosInstance.interceptors.response.use(
      (response) => {
        return response;
      },
      (err) => {
        if (
          err?.response?.data?.message === "No token provided" ||
          err?.response?.data?.message === "Token expired" ||
          err?.response?.data?.message === "Invalid Token"
        ) {
          signOut({ callbackUrl: "/login" });
        }
        return Promise.reject(err);
      },
    );

    return () => {
      axiosInstance.interceptors.request.eject(requestIntercept);
      axiosInstance.interceptors.response.eject(responseIntercept);
    };
  }, []);

  return axiosInstance;
};

export default useAxios;
