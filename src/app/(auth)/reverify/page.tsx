'use client';

import ReverifyPage from "@/features/auth/reverify";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

export default function Reverify() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  if (!token) router.push('/')

  return (
    <ReverifyPage token={token as string}/>
  );
}
