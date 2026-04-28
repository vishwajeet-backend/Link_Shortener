"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";

type Props = {
  children: React.ReactNode;
  role?: "ADMIN" | "USER";
};

export const ProtectedLayout = ({ children, role }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isHydrated, hydrate } = useAuthStore();

  useEffect(() => {
    if (!isHydrated) hydrate();
  }, [hydrate, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (role && user.role !== role) {
      router.replace(user.role === "ADMIN" ? "/admin" : "/dashboard");
    }
  }, [isHydrated, pathname, role, router, user]);

  if (!isHydrated || !user) {
    return <div className="p-6">Loading...</div>;
  }

  return <>{children}</>;
};
