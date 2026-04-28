"use client";

import { useEffect, useState } from "react";
import { UrlCreateForm } from "@/components/dashboard/url-create-form";
import { UrlTable } from "@/components/dashboard/url-table";
import { apiRequest } from "@/lib/api-client";
import { useAuthStore } from "@/store/auth.store";

type UrlListResponse = {
  items: Array<{
    id: string;
    shortCode: string;
    shortUrl: string;
    originalUrl: string;
    status: string;
    clickCount: number;
    createdAt: string;
  }>;
};

export default function DashboardPage() {
  const token = useAuthStore((state) => state.accessToken);
  const [items, setItems] = useState<UrlListResponse["items"]>([]);
  const [loading, setLoading] = useState(true);

  const loadUrls = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await apiRequest<UrlListResponse>("/urls?page=1&limit=10", { token });
      setItems(data.items);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadUrls();
  }, [token]);

  return (
    <div className="space-y-6">
      <section className="grid gap-4 rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 to-indigo-950 p-5 md:grid-cols-2 md:p-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Your Link Workspace</h1>
          <p className="mt-2 text-sm text-slate-300">
            Create, track, and manage your short URLs from one dashboard.
          </p>
        </div>
        <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-3 text-sm text-slate-300">
          <p className="font-medium text-white">Tip</p>
          <p className="mt-1">
            Use meaningful destination URLs and review click trends weekly for better campaign performance.
          </p>
        </div>
      </section>
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">Total URLs: {items.length}</div>
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
          Active: {items.filter((i) => i.status === "ACTIVE").length}
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
          Paused: {items.filter((i) => i.status === "PAUSED").length}
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
          Clicks: {items.reduce((sum, i) => sum + i.clickCount, 0)}
        </div>
      </section>
      <UrlCreateForm onCreated={loadUrls} />
      {loading ? (
        <p className="text-slate-300">Loading URLs...</p>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900 p-8 text-center">
          <p className="text-slate-300">No URLs yet. Create your first short link above.</p>
        </div>
      ) : (
        <UrlTable items={items} />
      )}
    </div>
  );
}
