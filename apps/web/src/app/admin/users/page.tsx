"use client";

import { useCallback, useEffect, useState } from "react";
import { apiRequest } from "@/lib/api-client";
import { useAuthStore } from "@/store/auth.store";

type AdminUserRow = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

type AdminUsersResponse = {
  items: AdminUserRow[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
};

export default function AdminUsersPage() {
  const token = useAuthStore((state) => state.accessToken);
  const [data, setData] = useState<AdminUsersResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await apiRequest<AdminUsersResponse>("/admin/users?page=1&limit=50", { token });
      setData(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load users");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void load();
  }, [load]);

  const items = data?.items ?? [];

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="text-2xl font-semibold text-white">Users</h1>
        {data ? (
          <p className="text-sm text-slate-400">
            {data.pagination.total} user{data.pagination.total === 1 ? "" : "s"}
          </p>
        ) : null}
      </div>
      {loading ? <p className="text-slate-400">Loading...</p> : null}
      {error ? <p className="text-red-400">{error}</p> : null}
      {!loading && !error && items.length === 0 ? (
        <p className="text-slate-400">No users found.</p>
      ) : null}
      {!loading && !error && items.length > 0 ? (
        <>
          <div className="space-y-3 md:hidden">
            {items.map((u) => (
              <article className="rounded-xl border border-slate-800 bg-slate-900 p-3 text-sm" key={u.id}>
                <p className="font-medium text-white">{u.name}</p>
                <p className="mt-1 break-all text-slate-300">{u.email}</p>
                <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-400">
                  <span>{u.role}</span>
                  <span>·</span>
                  <span>{u.status}</span>
                  <span>·</span>
                  <span>{new Date(u.createdAt).toLocaleString()}</span>
                </div>
              </article>
            ))}
          </div>
          <div className="hidden overflow-x-auto rounded-xl border border-slate-800 bg-slate-900 md:block">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-800/80">
                <tr>
                  <th className="px-3 py-2">Name</th>
                  <th className="px-3 py-2">Email</th>
                  <th className="px-3 py-2">Role</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Created</th>
                </tr>
              </thead>
              <tbody>
                {items.map((u) => (
                  <tr className="border-t border-slate-800" key={u.id}>
                    <td className="px-3 py-2 font-medium text-white">{u.name}</td>
                    <td className="max-w-xs truncate px-3 py-2 text-slate-300">{u.email}</td>
                    <td className="px-3 py-2">{u.role}</td>
                    <td className="px-3 py-2">{u.status}</td>
                    <td className="px-3 py-2 text-slate-400">{new Date(u.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : null}
    </section>
  );
}
