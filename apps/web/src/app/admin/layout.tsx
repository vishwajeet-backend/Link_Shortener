"use client";

import { AdminAppShell } from "@/components/admin/admin-app-shell";
import { ProtectedLayout } from "@/components/auth/protected-layout";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedLayout role="ADMIN">
      <AdminAppShell>{children}</AdminAppShell>
    </ProtectedLayout>
  );
}
