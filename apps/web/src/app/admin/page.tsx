"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api-client";
import { useAuthStore } from "@/store/auth.store";

type AdminOverview = {
  totals: {
    users: number;
    urls: number;
    clicks: number;
    activeUrls: number;
    pausedUrls: number;
    deletedUrls: number;
  };
};

export default function AdminPage() {
  const token = useAuthStore((state) => state.accessToken);
  const [overview, setOverview] = useState<AdminOverview | null>(null);

  useEffect(() => {
    const run = async () => {
      if (!token) return;
      const data = await apiRequest<AdminOverview>("/analytics/admin/overview?days=30", { token });
      setOverview(data);
    };
    void run();
  }, [token]);

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Admin Overview</h1>
      {!overview ? (
        <p>Loading...</p>
      ) : (
        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded border bg-white p-4">Users: {overview.totals.users}</div>
          <div className="rounded border bg-white p-4">URLs: {overview.totals.urls}</div>
          <div className="rounded border bg-white p-4">Clicks: {overview.totals.clicks}</div>
        </div>
      )}
    </section>
  );
}
