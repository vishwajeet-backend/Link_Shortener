"use client";

import { useEffect, useState } from "react";
import { UrlTable } from "@/components/dashboard/url-table";
import { apiRequest } from "@/lib/api-client";
import { useAuthStore } from "@/store/auth.store";

type AdminUrlsResponse = {
  items: Array<{
    id: string;
    ownerId: string;
    shortCode: string;
    originalUrl: string;
    status: string;
    clickCount: number;
    createdAt: string;
  }>;
};

export default function AdminUrlsPage() {
  const token = useAuthStore((state) => state.accessToken);
  const [items, setItems] = useState<AdminUrlsResponse["items"]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      if (!token) return;
      setLoading(true);
      try {
        const data = await apiRequest<AdminUrlsResponse>("/admin/urls?page=1&limit=50", { token });
        setItems(data.items);
      } finally {
        setLoading(false);
      }
    };
    void run();
  }, [token]);

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">All URLs</h1>
      {loading ? <p>Loading...</p> : <UrlTable items={items} />}
    </section>
  );
}
