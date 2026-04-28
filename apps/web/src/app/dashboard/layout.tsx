"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ProtectedLayout } from "@/components/auth/protected-layout";
import { useAuthStore } from "@/store/auth.store";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  return (
    <ProtectedLayout role="USER">
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <header className="border-b border-slate-800 bg-slate-950 px-4 py-3 md:px-6 md:py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-3 text-sm md:text-base">
              <Link className="rounded-lg px-3 py-1.5 hover:bg-slate-900" href="/dashboard">
                Dashboard
              </Link>
              <Link className="rounded-lg px-3 py-1.5 hover:bg-slate-900" href="/dashboard/urls">
                My URLs
              </Link>
            </div>
            <button
              className="border border-slate-700 text-sm md:text-base"
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
