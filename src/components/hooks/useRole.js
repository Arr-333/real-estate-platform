"use client";

import { useSession } from "next-auth/react";

export const useRole = () => {
  const { data: session, status } = useSession();

  return {
    role: session?.user?.role || null,
    loading: status === "loading",
  };
};
