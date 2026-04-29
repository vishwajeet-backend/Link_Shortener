"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ProtectedLayout } from "@/components/auth/protected-layout";
import { useAuthStore } from "@/store/auth.store";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const role = useAuthStore((state) => state.user?.role);

  return (
    <ProtectedLayout roles={["MEMBER", "ADVERTISER"]}>
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <header className="border-b border-slate-800 bg-slate-950 px-3 py-3 sm:px-4 md:px-6 md:py-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            <nav className="-mx-1 flex gap-1 overflow-x-auto pb-1 text-sm sm:flex-wrap sm:pb-0 md:text-base">
              <Link className="shrink-0 rounded-lg px-3 py-1.5 hover:bg-slate-900" href="/dashboard">
                Dashboard
              </Link>
              <Link className="shrink-0 rounded-lg px-3 py-1.5 hover:bg-slate-900" href="/dashboard/urls">
                My URLs
              </Link>
              <Link className="shrink-0 rounded-lg px-3 py-1.5 hover:bg-slate-900" href="/dashboard/analytics">
                Analytics
              </Link>
              <Link className="shrink-0 rounded-lg px-3 py-1.5 hover:bg-slate-900" href="/dashboard/wallet">
                Wallet
              </Link>
              {role === "ADVERTISER" ? (
                <Link className="shrink-0 rounded-lg px-3 py-1.5 hover:bg-slate-900" href="/dashboard/campaigns">
                  Campaigns
                </Link>
              ) : null}
              <Link className="shrink-0 rounded-lg px-3 py-1.5 hover:bg-slate-900" href="/dashboard/billing">
                Billing
              </Link>
              <Link className="shrink-0 rounded-lg px-3 py-1.5 hover:bg-slate-900" href="/dashboard/profile">
                Profile
              </Link>
            </nav>
            <button
              className="w-full shrink-0 rounded-lg border border-slate-700 px-3 py-2 text-sm hover:bg-slate-900 sm:w-auto md:text-base"
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
