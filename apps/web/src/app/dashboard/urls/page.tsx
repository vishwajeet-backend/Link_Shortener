"use client";

import { useEffect, useState } from "react";
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

export default function DashboardUrlsPage() {
  const token = useAuthStore((state) => state.accessToken);
  const [items, setItems] = useState<UrlListResponse["items"]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      if (!token) return;
      setLoading(true);
      try {
        const data = await apiRequest<UrlListResponse>("/urls?page=1&limit=50", { token });
        setItems(data.items);
      } finally {
        setLoading(false);
      }
    };
    void run();
  }, [token]);

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">My URLs</h1>
      {loading ? <p>Loading...</p> : <UrlTable items={items} />}
    </section>
  );
}
