"use client";

import { useSession } from "next-auth/react";

export function usePlan() {
  const { data } = useSession();
  const plan = data?.user?.plan ?? "free";
  return { plan };
}
