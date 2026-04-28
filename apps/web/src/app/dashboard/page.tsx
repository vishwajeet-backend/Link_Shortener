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
      <UrlCreateForm onCreated={loadUrls} />
      {loading ? <p>Loading URLs...</p> : <UrlTable items={items} />}
    </div>
  );
}
