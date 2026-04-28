"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ProtectedLayout } from "@/components/auth/protected-layout";
import { useAuthStore } from "@/store/auth.store";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  return (
    <ProtectedLayout role="ADMIN">
      <div className="min-h-screen bg-slate-50">
        <header className="border-b bg-white px-4 py-3 md:px-6 md:py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-3 text-sm md:text-base">
            <Link href="/admin">Admin Dashboard</Link>
            <Link href="/admin/urls">All URLs</Link>
          </div>
          <button
            className="border border-slate-300 text-sm md:text-base"
            onClick={async () => {
              await logout();
              router.push("/login");
            }}
            type="button"
          >
            Logout
          </button>
          </div>
        </header>
        <main className="mx-auto max-w-6xl p-4 md:p-6">{children}</main>
      </div>
    </ProtectedLayout>
  );
}
